import { useEffect, useRef, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useDynamicChips } from "./useDynamicChips";
import { streamChat } from "./streamChat";
import { buildReportsContext, serializeReportsContext } from "./reports-cards/reportContext";
import ReportCardRenderer, { type ReportDataEvent } from "./reports-cards/ReportCardRenderer";
import type { Batch, Routine, Thread, Message } from "./types";

interface PrefillPayload {
  contextBanner?: string;
  topic?: string;
  difficulty?: string;
  studentIds?: string[];
  studentNames?: string[];
}

interface Props {
  batch: Batch | null;
  routine: Routine | null;
  thread: Thread | null;
  onThreadCreated: (t: Thread) => void;
  onArtifactsCreated: () => void;
  prefill?: PrefillPayload | null;
  onPrefillConsumed?: () => void;
}

interface MessageWithReports extends Message {
  reportEvents?: ReportDataEvent[];
}

export default function ChatPane({ batch, routine, thread, onThreadCreated, onArtifactsCreated, prefill, onPrefillConsumed }: Props) {
  const [messages, setMessages] = useState<MessageWithReports[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const dynamicChips = useDynamicChips(batch?.id ?? null, routine);
  const isEmpty = messages.length === 0;
  const isReports = routine?.key === "reports";

  // Pre-compute reports context for this batch (memoised so we don't recompute per keystroke)
  const reportsContext = useMemo(() => {
    if (!isReports || !batch) return null;
    try {
      return serializeReportsContext(buildReportsContext(batch));
    } catch (e) {
      console.error("Failed to build reports context:", e);
      return null;
    }
  }, [isReports, batch]);

  useEffect(() => {
    if (!thread) {
      setMessages([]);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("rp_messages")
        .select("*")
        .eq("thread_id", thread.id)
        .order("created_at");
      if (!cancelled) setMessages((data ?? []) as MessageWithReports[]);
    })();
    return () => { cancelled = true; };
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

    const tempUser: MessageWithReports = {
      id: `temp-${Date.now()}`,
      thread_id: activeThread.id,
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUser]);
    setInput("");
    setLoading(true);

    await supabase.from("rp_messages").insert({
      thread_id: activeThread.id,
      role: "user",
      content: text,
    });

    const history = [...messages, tempUser].map((m) => ({ role: m.role, content: m.content }));

    const assistantId = `assistant-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: assistantId, thread_id: activeThread!.id, role: "assistant", content: "", created_at: new Date().toISOString(), reportEvents: [] },
    ]);
    let assistantText = "";

    try {
      const result = await streamChat(
        {
          thread_id: activeThread.id,
          batch_id: batch.id,
          routine_key: routine.key,
          messages: history,
          ...(isReports && reportsContext ? { reports_context: reportsContext } : {}),
        },
        {
          onDelta: (delta) => {
            assistantText += delta;
            setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, content: assistantText } : m));
          },
          onReportData: (event) => {
            setMessages((prev) => prev.map((m) =>
              m.id === assistantId
                ? { ...m, reportEvents: [...(m.reportEvents ?? []), event] }
                : m
            ));
          },
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

      const finalText = assistantText.trim() || (result.reportEvents.length ? "Here's what I found." : "Done.");
      await supabase.from("rp_messages").insert({
        thread_id: activeThread.id,
        role: "assistant",
        content: finalText,
      });
      setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, content: finalText } : m));

      await supabase.from("rp_threads")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", activeThread.id);

      if (result.artifactsCreated || result.artifactsUpdated) onArtifactsCreated();
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
      <div className="px-5 py-2.5 border-b">
        <div className="flex items-center gap-2 text-sm">
          <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="font-medium">{routine.label}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground truncate">{batch.name}</span>
          {isReports && (
            <span className="ml-auto text-[10px] uppercase tracking-wider text-muted-foreground">
              Read-only analytics
            </span>
          )}
        </div>
      </div>

      {dynamicChips.length > 0 && (
        <div className="px-5 py-2 border-b bg-muted/20">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <span className="text-[11px] text-muted-foreground flex-shrink-0 font-medium">
              Quick starts:
            </span>
            {dynamicChips.map((chip, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleChip(chip)}
                className="text-xs px-2.5 py-1 rounded-full border bg-background hover:bg-muted hover:border-primary/30 transition-colors whitespace-nowrap flex-shrink-0"
                title={chip}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}

      <ScrollArea className="flex-1">
        <div ref={scrollRef as any} className="px-5 py-5 max-w-3xl mx-auto space-y-5">
          {isEmpty && (
            <div className="text-center py-10">
              <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold">{routine.label}</h3>
              <p className="text-sm text-muted-foreground mt-1">{routine.description}</p>
              {isReports && (
                <p className="text-xs text-muted-foreground mt-3 max-w-md mx-auto">
                  Ask anything about this batch's exams, chapters, or students. Answers come straight from your Reports module.
                </p>
              )}
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
              <div className={m.role === "user" ? "max-w-[85%]" : "max-w-[92%] w-full"}>
                <div
                  className={
                    m.role === "user"
                      ? "rounded-2xl rounded-br-sm bg-primary text-primary-foreground px-4 py-2.5 text-sm whitespace-pre-wrap"
                      : "rounded-2xl rounded-bl-sm bg-muted px-4 py-2.5 text-sm whitespace-pre-wrap"
                  }
                >
                  {m.content || (loading ? <span className="text-muted-foreground">Thinking…</span> : "")}
                </div>
                {m.reportEvents && m.reportEvents.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {m.reportEvents.map((ev, i) => (
                      <ReportCardRenderer key={i} event={ev as ReportDataEvent} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div data-tour="copilot-composer" className="border-t px-5 py-3">
        <div className="max-w-3xl mx-auto flex items-end gap-2">
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
            className="min-h-[40px] max-h-32 resize-none text-sm focus-visible:ring-2 focus-visible:ring-primary/40"
            rows={1}
          />
          <Button
            onClick={send}
            disabled={loading || !input.trim()}
            size="icon"
            className="h-9 w-9 flex-shrink-0 rounded-full"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
