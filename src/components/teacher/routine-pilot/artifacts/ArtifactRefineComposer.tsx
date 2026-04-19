import { useState, KeyboardEvent } from "react";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  artifactId: string;
  artifactType: "test" | "lesson_plan" | "ppt" | "banded_homework";
  batchId: string;
  // Optional: a thread to attach the refinement instruction to (so the
  // edge function has somewhere to write transient logs); falls back to
  // the artifact's own thread_id on the server side via target_artifact_id.
  threadId?: string | null;
  routineKey: string;
}

const placeholderByType: Record<Props["artifactType"], string> = {
  test:
    "e.g. Replace Q3 with a harder MCQ, add 5 more on Newton's laws, remove negative marking…",
  lesson_plan:
    "e.g. Add a 10-min recap section, swap the homework for a project, expand objectives…",
  ppt:
    "e.g. Add a slide on real-world applications, shorten slide 4 to 3 bullets, add speaker notes…",
  banded_homework:
    "e.g. Make foundational_risk problems easier, add 2 more to mastery_ready, change due date…",
};

export default function ArtifactRefineComposer({
  artifactId,
  artifactType,
  batchId,
  threadId,
  routineKey,
}: Props) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  const send = async () => {
    const instruction = text.trim();
    if (!instruction || busy) return;
    setBusy(true);
    try {
      // Resolve a thread_id to attach to. Fallback: query the artifact for its thread.
      let resolvedThreadId = threadId ?? null;
      if (!resolvedThreadId) {
        const { data: art } = await supabase
          .from("rp_artifacts")
          .select("thread_id, batch_id")
          .eq("id", artifactId)
          .maybeSingle();
        resolvedThreadId = art?.thread_id ?? null;
      }
      if (!resolvedThreadId) {
        toast.error("Cannot find a thread for this artifact");
        return;
      }

      // Invoke the edge function in refinement mode
      const { error } = await supabase.functions.invoke("routine-pilot-chat", {
        body: {
          thread_id: resolvedThreadId,
          batch_id: batchId,
          routine_key: routineKey,
          target_artifact_id: artifactId,
          messages: [{ role: "user", content: instruction }],
        },
      });

      if (error) throw error;

      setText("");
      toast.success("Refining…", {
        description: "Updates will appear here as soon as they're ready.",
      });
    } catch (e: any) {
      console.error("refine error", e);
      toast.error("Refinement failed", { description: e?.message ?? "Unknown error" });
    } finally {
      setBusy(false);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  return (
    <div className="mt-6 pt-4 border-t">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
        <Sparkles className="w-3 h-3" />
        Refine this {artifactType.replace("_", " ")}
      </div>
      <div
        className={cn(
          "flex items-end gap-2 rounded-lg border bg-card p-2 transition-colors",
          busy && "opacity-70"
        )}
      >
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={busy}
          placeholder={placeholderByType[artifactType]}
          rows={1}
          className="min-h-[36px] max-h-32 resize-none border-0 focus-visible:ring-0 px-2 py-1.5 text-sm shadow-none bg-transparent"
        />
        <Button
          size="icon"
          className="h-8 w-8 flex-shrink-0"
          onClick={send}
          disabled={!text.trim() || busy}
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </div>
      <p className="text-[10px] text-muted-foreground mt-1.5 px-1">
        Press Enter to send · Shift+Enter for newline · Updates this artifact in place
      </p>
    </div>
  );
}
