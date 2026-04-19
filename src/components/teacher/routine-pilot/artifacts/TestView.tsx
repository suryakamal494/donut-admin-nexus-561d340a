import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Award, BookOpen, Send, ExternalLink, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  publishCopilotTestArtifact,
  useIsArtifactPublished,
} from "@/stores/teacherExamsStore";
import { useCopilot } from "../CopilotContext";

const typeMeta: Record<string, { label: string; color: string }> = {
  mcq: { label: "MCQ", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  short: { label: "Short", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  long: { label: "Long", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" },
};

const difficultyColor: Record<string, string> = {
  easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  hard: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
};

interface Props {
  content: any;
  // Optional context — passed when rendered inside the artifact pane
  artifactId?: string;
  artifactTitle?: string;
  batchId?: string;
  batchSubject?: string;
}

export default function TestView({
  content,
  artifactId,
  artifactTitle,
  batchId,
  batchSubject,
}: Props) {
  const navigate = useNavigate();
  const { closeCopilot } = useCopilot();
  const published = useIsArtifactPublished(artifactId ?? null);

  const qs = content?.questions ?? [];
  const chapters: { name: string; topics?: string[] }[] = content?.chapters ?? [];

  const canPublish = !!artifactId && !!batchId;

  const handlePublish = () => {
    if (!canPublish) {
      toast.error("Missing artifact context — cannot publish");
      return;
    }
    publishCopilotTestArtifact({
      id: artifactId!,
      title: artifactTitle || "Untitled test",
      batchId: batchId!,
      subject: batchSubject,
      content,
    });
    toast.success("Published to Tests page");
  };

  const handleOpenInTests = () => {
    closeCopilot();
    navigate("/teacher/exams");
  };

  return (
    <div className="space-y-4">
      {/* Action bar — only shown when we have artifact context */}
      {canPublish && (
        <div className="flex items-center gap-2 pb-2 border-b">
          {published ? (
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs"
              disabled
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
              Published
            </Button>
          ) : (
            <Button size="sm" className="h-8 text-xs" onClick={handlePublish}>
              <Send className="w-3.5 h-3.5 mr-1.5" />
              Publish to Tests
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs"
            onClick={handleOpenInTests}
          >
            <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
            Open Tests page
          </Button>
        </div>
      )}

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />{content?.duration_minutes ?? "—"} min</Badge>
        <Badge variant="outline"><Award className="w-3 h-3 mr-1" />{content?.total_marks ?? "—"} marks</Badge>
        <Badge variant="outline">{qs.length} questions</Badge>
        {content?.pattern && content.pattern !== "custom" && (
          <Badge variant="outline" className="uppercase">{content.pattern.replace("_", " ")}</Badge>
        )}
        {content?.curriculum && (
          <Badge variant="outline">
            <BookOpen className="w-3 h-3 mr-1" />
            {content.curriculum}
          </Badge>
        )}
      </div>

      {/* Chapters summary */}
      {chapters.length > 0 && (
        <div className="rounded-lg border bg-muted/30 p-2.5">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Chapters</div>
          <div className="flex flex-wrap gap-1.5">
            {chapters.map((ch, i) => (
              <span
                key={i}
                className="text-xs px-2 py-0.5 rounded-full bg-background border"
                title={ch.topics?.join(", ")}
              >
                {ch.name}
                {ch.topics?.length ? <span className="text-muted-foreground"> · {ch.topics.length}t</span> : null}
              </span>
            ))}
          </div>
        </div>
      )}

      {content?.instructions && (
        <p className="text-xs text-muted-foreground italic border-l-2 border-primary/30 pl-3">{content.instructions}</p>
      )}

      <div className="space-y-3">
        {qs.map((q: any, i: number) => {
          const tm = typeMeta[q.type] ?? { label: q.type, color: "bg-muted" };
          return (
            <div key={i} className="rounded-lg border bg-card p-3">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-muted-foreground">Q{i + 1}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${tm.color}`}>{tm.label}</span>
                  {q.difficulty && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded capitalize ${difficultyColor[q.difficulty] ?? "bg-muted"}`}>
                      {q.difficulty}
                    </span>
                  )}
                  {q.cognitive_type && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground capitalize">
                      {q.cognitive_type}
                    </span>
                  )}
                </div>
                <Badge variant="outline" className="text-[10px] flex-shrink-0">{q.marks} mark{q.marks > 1 ? "s" : ""}</Badge>
              </div>
              {(q.chapter || q.topic) && (
                <div className="text-[10px] text-muted-foreground mb-1.5">
                  {q.chapter}{q.topic ? ` › ${q.topic}` : ""}
                </div>
              )}
              <p className="text-sm leading-relaxed">{q.prompt}</p>
              {q.options && (
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  {q.options.map((opt: string, j: number) => (
                    <div key={j} className="text-xs px-2 py-1 rounded bg-muted/60">
                      {String.fromCharCode(65 + j)}. {opt}
                    </div>
                  ))}
                </div>
              )}
              {q.answer && (
                <div className="mt-2 text-xs">
                  <span className="text-muted-foreground">Answer: </span>
                  <span className="font-medium text-emerald-600">{q.answer}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
