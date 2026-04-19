import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingDown, TrendingUp, Minus, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface StudentProfileData {
  reports_batch_id: string;
  student: {
    id: string;
    name: string;
    roll: string;
    pi: number;
    accuracy: number;
    consistency: number;
    trend: "up" | "down" | "flat";
    secondary_tags: string[];
    total_exams: number;
    suggested_difficulty: string;
    weak_topic_names: string[];
    chapter_mastery: { chapter: string; avg: number; status: string; trend: string }[];
    weak_topics: { topic: string; chapter: string; accuracy: number }[];
    difficulty_breakdown: { level: string; attempted: number; accuracy: number; avg_time: number }[];
    ai_summary: string;
    ai_strengths: string[];
    ai_priorities: string[];
    ai_engagement_note: string;
  };
}

const trendIcon = (t: string) =>
  t === "up" ? <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> :
  t === "down" ? <TrendingDown className="w-3.5 h-3.5 text-destructive" /> :
  <Minus className="w-3.5 h-3.5 text-muted-foreground" />;

export default function StudentProfileCard({ data }: { data: StudentProfileData }) {
  const navigate = useNavigate();
  const s = data.student;
  const strongChapters = s.chapter_mastery.filter(c => c.status === "strong").slice(0, 3);
  const weakChapters = s.chapter_mastery.filter(c => c.status === "weak").slice(0, 3);

  return (
    <Card className="p-4 space-y-3 bg-background">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-0.5">Student profile</div>
          <div className="font-semibold text-sm">{s.name}</div>
          <div className="text-[11px] text-muted-foreground">Roll {s.roll} · {s.total_exams} exams</div>
        </div>
        <div className="flex items-center gap-1.5">
          {trendIcon(s.trend)}
          <Badge variant="outline" className="text-[10px]">PI {s.pi}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Stat label="Accuracy" value={`${s.accuracy}%`} />
        <Stat label="Consistency" value={`${s.consistency}%`} />
        <Stat label="Suggested" value={s.suggested_difficulty} />
      </div>

      {s.ai_summary && (
        <p className="text-xs leading-relaxed border-l-2 border-primary/40 pl-2 text-foreground/80">
          <Sparkles className="w-3 h-3 inline mr-1 text-primary" />
          {s.ai_summary}
        </p>
      )}

      {strongChapters.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Strengths</div>
          <div className="flex flex-wrap gap-1">
            {strongChapters.map(c => (
              <Badge key={c.chapter} variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-700">
                {c.chapter} · {c.avg}%
              </Badge>
            ))}
          </div>
        </div>
      )}

      {weakChapters.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Needs work</div>
          <div className="flex flex-wrap gap-1">
            {weakChapters.map(c => (
              <Badge key={c.chapter} variant="outline" className="text-[10px] border-destructive/40 text-destructive">
                {c.chapter} · {c.avg}%
              </Badge>
            ))}
          </div>
        </div>
      )}

      {s.weak_topic_names.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Weak topics</div>
          <div className="flex flex-wrap gap-1">
            {s.weak_topic_names.slice(0, 5).map(t => (
              <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>
            ))}
          </div>
        </div>
      )}

      {s.difficulty_breakdown.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Difficulty mix</div>
          <div className="grid grid-cols-3 gap-1.5">
            {s.difficulty_breakdown.map(d => (
              <div key={d.level} className="text-center rounded bg-muted/40 py-1">
                <div className="text-sm font-semibold tabular-nums">{d.accuracy}%</div>
                <div className="text-[9px] text-muted-foreground capitalize">{d.level} ({d.attempted})</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          variant="default"
          size="sm"
          className="flex-1 h-8 text-xs"
          onClick={() => {
            window.dispatchEvent(new CustomEvent("rp:handoff-homework", {
              detail: {
                contextBanner: `Generate homework for ${s.name} (PI ${s.pi}, accuracy ${s.accuracy}%)`,
                topic: s.weak_topic_names[0],
                difficulty: s.suggested_difficulty,
                studentIds: [s.id],
                studentNames: [s.name],
              },
            }));
          }}
        >
          Generate Homework
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 h-8 text-xs justify-between"
          onClick={() => navigate(`/teacher/reports/${data.reports_batch_id}/students/${s.id}`)}
        >
          Open profile
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center rounded-md bg-muted/50 py-1.5">
      <div className="text-base font-semibold tabular-nums capitalize">{value}</div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</div>
    </div>
  );
}
