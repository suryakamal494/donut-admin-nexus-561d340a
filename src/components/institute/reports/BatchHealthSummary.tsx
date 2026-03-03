import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus, AlertTriangle, Trophy, Target } from "lucide-react";
import type { SubjectSummary, InstituteStudentSummary } from "@/data/institute/reportsData";

interface BatchHealthSummaryProps {
  subjects: SubjectSummary[];
  students: InstituteStudentSummary[];
}

const BatchHealthSummary = ({ subjects, students }: BatchHealthSummaryProps) => {
  const [expanded, setExpanded] = useState(() => window.innerWidth >= 768);

  const health = useMemo(() => {
    // Strongest & weakest
    const sorted = [...subjects].sort((a, b) => b.classAverage - a.classAverage);
    const strongest = sorted[0];
    const weakest = sorted[sorted.length - 1];

    // Trend momentum
    const trends = { up: 0, down: 0, stable: 0 };
    subjects.forEach((s) => trends[s.trend]++);

    // Urgent flags — subjects that dropped >5%
    const urgentSubjects = subjects.filter(
      (s) => s.previousAverage - s.classAverage > 5
    );

    // Multi-subject at-risk: students with average < 35 in 2+ subjects
    const multiRiskStudents = students.filter((st) => {
      const riskSubjects = st.subjects.filter((sub) => sub.average < 35);
      return riskSubjects.length >= 2;
    });

    return { strongest, weakest, trends, urgentSubjects, multiRiskCount: multiRiskStudents.length };
  }, [subjects, students]);

  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      {/* Compact toggle header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <span className="text-xs sm:text-sm font-semibold text-foreground">Batch Health Summary</span>
          {health.urgentSubjects.length > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] font-semibold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded-full">
              <AlertTriangle className="w-2.5 h-2.5" />
              {health.urgentSubjects.length} alert{health.urgentSubjects.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      {expanded && (
        <CardContent className="px-3 pb-3 pt-0 space-y-2.5">
          {/* Row 1: Strongest & Weakest */}
          <div className="grid grid-cols-2 gap-2">
            {health.strongest && (
              <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg px-2.5 py-2">
                <Trophy className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">Strongest</p>
                  <p className="text-xs font-bold text-foreground truncate">{health.strongest.subjectName} <span className="font-semibold text-emerald-700 dark:text-emerald-400">{health.strongest.classAverage}%</span></p>
                </div>
              </div>
            )}
            {health.weakest && (
              <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/30 rounded-lg px-2.5 py-2">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-red-700 dark:text-red-400 font-medium">Weakest</p>
                  <p className="text-xs font-bold text-foreground truncate">{health.weakest.subjectName} <span className="font-semibold text-red-700 dark:text-red-400">{health.weakest.classAverage}%</span></p>
                </div>
              </div>
            )}
          </div>

          {/* Row 2: Trends + Multi-subject risk */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Trend momentum pills */}
            {health.trends.up > 0 && (
              <div className="flex items-center gap-1 text-[10px] sm:text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-full font-medium">
                <TrendingUp className="w-3 h-3" />
                {health.trends.up} improving
              </div>
            )}
            {health.trends.down > 0 && (
              <div className="flex items-center gap-1 text-[10px] sm:text-xs bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 px-2 py-1 rounded-full font-medium">
                <TrendingDown className="w-3 h-3" />
                {health.trends.down} declining
              </div>
            )}
            {health.trends.stable > 0 && (
              <div className="flex items-center gap-1 text-[10px] sm:text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full font-medium">
                <Minus className="w-3 h-3" />
                {health.trends.stable} stable
              </div>
            )}

            {/* Multi-subject risk */}
            {health.multiRiskCount > 0 && (
              <div className="flex items-center gap-1 text-[10px] sm:text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-full font-medium">
                <AlertTriangle className="w-3 h-3" />
                {health.multiRiskCount} at risk in 2+ subjects
              </div>
            )}
          </div>

          {/* Urgent alerts */}
          {health.urgentSubjects.length > 0 && (
            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-2">
              <p className="text-[10px] font-semibold text-destructive mb-1">⚠ Subjects dropped &gt;5% from previous</p>
              <div className="flex flex-wrap gap-1.5">
                {health.urgentSubjects.map((s) => (
                  <span key={s.subjectId} className="text-[10px] bg-destructive/10 text-destructive px-2 py-0.5 rounded-full font-medium">
                    {s.subjectName}: {s.previousAverage}% → {s.classAverage}% ({s.previousAverage - s.classAverage > 0 ? `-${s.previousAverage - s.classAverage}` : `+${s.classAverage - s.previousAverage}`}%)
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default BatchHealthSummary;
