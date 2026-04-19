import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useDynamicChips } from "./useDynamicChips";
import type { Batch, Routine, Thread, Message } from "./types";

interface Props {
  batch: Batch | null;
  routine: Routine | null;
  thread: Thread | null;
  onThreadCreated: (t: Thread) => void;
  onArtifactsCreated: () => void;
}

/**
 * Streams an SSE chat response from the routine-pilot-chat edge function.
 * Calls onDelta for each text chunk and returns whether artifacts were created.
 */
async function streamChat(
  body: Record<string, unknown>,
  onDelta: (chunk: string) => void
): Promise<{ ok: boolean; status: number; artifactsCreated: boolean }> {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/routine-pilot-chat`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok || !resp.body) {
    return { ok: false, status: resp.status, artifactsCreated: false };
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  let artifactsCreated = false;
  let done = false;

  while (!done) {
    const { done: d, value } = await reader.read();
    if (d) break;
    buf += decoder.decode(value, { stream: true });
    let nl: number;
    while ((nl = buf.indexOf("\n")) !== -1) {
      let line = buf.slice(0, nl);
      buf = buf.slice(nl + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") { done = true; break; }
      try {
        const parsed = JSON.parse(json);
        if (parsed.rp_artifacts_created?.length) {
          artifactsCreated = true;
          continue;
        }
        const delta = parsed.choices?.[0]?.delta?.content;
        if (delta) onDelta(delta);
      } catch {
        buf = line + "\n" + buf;
        break;
      }
    }
  }

  return { ok: true, status: resp.status, artifactsCreated };
}

export default function ChatPane({ batch, routine, thread, onThreadCreated, onArtifactsCreated }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // IMPORTANT: All hooks must be called before any early return so React's
  // hook order stays stable across renders (prevents "Rendered more hooks
  // than during the previous render").
  const dynamicChips = useDynamicChips(batch?.id ?? null, routine);
  const isEmpty = messages.length === 0;

  useEffect(() => {
    if (!thread) {
      setMessages([]);
      return;
    }
    (async () => {
      const { data } = await supabase
        .from("rp_messages")
        .select("*")
        .eq("thread_id", thread.id)
        .order("created_at");
      setMessages((data ?? []) as Message[]);
    })();
  }, [thread]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleChip = (chip: string) => {
    setInput(chip);
    setTimeout(() => {
      const ta = textareaRef.current;
      if (!ta) return;
      const idx = chip.indexOf("____");
      if (idx >= 0) {
        ta.focus();
        ta.setSelectionRange(idx, idx + 4);
      } else {
        ta.focus();
      }
    }, 0);
  };

  const send = async () => {
    if (!input.trim() || !batch || !routine || loading) return;
    const text = input.trim();

    // Ensure thread exists
    let activeThread = thread;
    if (!activeThread) {
      const { data, error } = await supabase
        .from("rp_threads")
        .insert({
          batch_id: batch.id,
          routine_id: routine.id,
          title: text.slice(0, 60),
        })
        .select("*")
        .single();
      if (error || !data) {
        toast.error("Failed to start thread");
        return;
      }
      activeThread = data as Thread;
      onThreadCreated(activeThread);
    }

    // Optimistic user message
    const tempUser: Message = {
      id: `temp-${Date.now()}`,
      thread_id: activeThread.id,
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUser]);
    setInput("");
    setLoading(true);

    // Persist user message
    await supabase.from("rp_messages").insert({
      thread_id: activeThread.id,
      role: "user",
      content: text,
    });

    // Build conversation history
    const history = [...messages, tempUser].map((m) => ({ role: m.role, content: m.content }));

    // Add streaming assistant placeholder
    const assistantId = `assistant-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: assistantId, thread_id: activeThread!.id, role: "assistant", content: "", created_at: new Date().toISOString() },
    ]);
    let assistantText = "";

    try {
      const result = await streamChat(
        {
          thread_id: activeThread.id,
          batch_id: batch.id,
          routine_key: routine.key,
          messages: history,
        },
        (delta) => {
          assistantText += delta;
          setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, content: assistantText } : m));
        }
      );

      if (!result.ok) {
        if (result.status === 429) toast.error("Rate limit hit. Try again shortly.");
        else if (result.status === 402) toast.error("AI credits exhausted. Add credits in Workspace settings.");
        else toast.error("AI request failed");
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
        setLoading(false);
        return;
      }

      // Persist assistant message
      const finalText = assistantText.trim() || "Done.";
      await supabase.from("rp_messages").insert({
        thread_id: activeThread.id,
        role: "assistant",
        content: finalText,
      });
      setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, content: finalText } : m));

      // Update thread timestamp
      await supabase.from("rp_threads")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", activeThread.id);

      if (result.artifactsCreated) onArtifactsCreated();
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
    } finally {
      setLoading(false);
    }
  };

  if (!batch || !routine) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
        Select a batch and routine to start.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-3 border-b flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">{routine.label}</div>
          <div className="text-xs text-muted-foreground">{batch.name} • {batch.subject}</div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div ref={scrollRef as any} className="px-5 py-6 max-w-3xl mx-auto space-y-5">
          {isEmpty && (
            <div className="text-center py-10">
              <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold">{routine.label}</h3>
              <p className="text-sm text-muted-foreground mt-1">{routine.description}</p>
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
              <div
                className={
                  m.role === "user"
                    ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary text-primary-foreground px-4 py-2.5 text-sm whitespace-pre-wrap"
                    : "max-w-[85%] rounded-2xl rounded-bl-sm bg-muted px-4 py-2.5 text-sm whitespace-pre-wrap"
                }
              >
                {m.content || (loading ? <span className="text-muted-foreground">Thinking…</span> : "")}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t p-3 bg-card/30">
        <div className="max-w-3xl mx-auto space-y-2">
          {dynamicChips.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {dynamicChips.map((chip, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleChip(chip)}
                  className="text-xs px-2.5 py-1 rounded-full border bg-background hover:bg-muted transition-colors"
                  title={chip}
                >
                  {chip}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-end gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder={`Message ${routine.label}…`}
              className="min-h-[44px] max-h-32 resize-none text-sm"
              rows={1}
            />
            <Button onClick={send} disabled={loading || !input.trim()} size="icon" className="h-11 w-11 flex-shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
