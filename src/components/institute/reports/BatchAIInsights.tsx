import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sparkles, ChevronDown, ChevronUp, AlertTriangle, TrendingUp, Users, BookOpen, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { SubjectSummary, InstituteStudentSummary } from "@/data/institute/reportsData";

interface BatchInsight {
  type: "priority_alert" | "cross_subject_pattern" | "teacher_coaching" | "student_intervention" | "positive_signal";
  title: string;
  description: string;
  severity: "critical" | "warning" | "info" | "positive";
  relatedSubjects: string[];
}

interface BatchAIInsightsProps {
  batchName: string;
  className: string;
  totalStudents: number;
  overallAverage: number;
  subjects: SubjectSummary[];
  students: InstituteStudentSummary[];
}

const INSIGHT_CONFIG: Record<string, { icon: typeof AlertTriangle; label: string }> = {
  priority_alert: { icon: AlertTriangle, label: "Priority Alert" },
  cross_subject_pattern: { icon: BookOpen, label: "Cross-Subject Pattern" },
  teacher_coaching: { icon: Users, label: "Teacher Coaching" },
  student_intervention: { icon: Users, label: "Student Intervention" },
  positive_signal: { icon: TrendingUp, label: "Positive Signal" },
};

const SEVERITY_STYLES: Record<string, string> = {
  critical: "border-l-red-500 bg-red-50 dark:bg-red-950/20",
  warning: "border-l-amber-500 bg-amber-50 dark:bg-amber-950/20",
  info: "border-l-teal-500 bg-teal-50 dark:bg-teal-950/20",
  positive: "border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950/20",
};

const SEVERITY_ICON_COLOR: Record<string, string> = {
  critical: "text-red-600 dark:text-red-400",
  warning: "text-amber-600 dark:text-amber-400",
  info: "text-teal-600 dark:text-teal-400",
  positive: "text-emerald-600 dark:text-emerald-400",
};

const BatchAIInsights = ({ batchName, className, totalStudents, overallAverage, subjects, students }: BatchAIInsightsProps) => {
  const [insights, setInsights] = useState<BatchInsight[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const multiRiskCount = students.filter(
    (s) => s.subjects.filter((sub) => sub.average < 35).length >= 2
  ).length;

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-batch-report", {
        body: {
          batchName,
          className,
          totalStudents,
          overallAverage,
          atRiskMultiSubjectCount: multiRiskCount,
          subjects: subjects.map((s) => ({
            subjectName: s.subjectName,
            teacherName: s.teacherName,
            classAverage: s.classAverage,
            previousAverage: s.previousAverage,
            trend: s.trend,
            atRiskCount: s.atRiskCount,
            totalStudents: s.totalStudents,
            totalExams: s.totalExams,
          })),
        },
      });

      if (error) throw error;
      if (data?.error) {
        toast.error(data.error);
        return;
      }

      setInsights(data.insights);
      setExpanded(true);
    } catch (err: any) {
      console.error("AI insights error:", err);
      toast.error(err?.message || "Failed to generate insights");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => insights ? setExpanded((v) => !v) : undefined}
        className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs sm:text-sm font-semibold text-foreground">AI Batch Analysis</span>
          {insights && (
            <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
              {insights.length} insights
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!insights && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs gap-1"
              onClick={(e) => { e.stopPropagation(); handleGenerate(); }}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              {loading ? "Analyzing…" : "Generate"}
            </Button>
          )}
          {insights && (expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />)}
        </div>
      </button>

      {/* Insights */}
      {insights && expanded && (
        <CardContent className="px-3 pb-3 pt-0 space-y-2">
          {insights.map((insight, i) => {
            const config = INSIGHT_CONFIG[insight.type] || INSIGHT_CONFIG.priority_alert;
            const Icon = config.icon;
            return (
              <div
                key={i}
                className={cn(
                  "rounded-lg border-l-[3px] p-2.5 space-y-1",
                  SEVERITY_STYLES[insight.severity] || SEVERITY_STYLES.info
                )}
              >
                <div className="flex items-center gap-1.5">
                  <Icon className={cn("w-3.5 h-3.5 flex-shrink-0", SEVERITY_ICON_COLOR[insight.severity])} />
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {config.label}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-foreground leading-tight">{insight.title}</p>
                <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
                {insight.relatedSubjects.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {insight.relatedSubjects.map((sub) => (
                      <span key={sub} className="text-[9px] bg-background/80 text-muted-foreground px-1.5 py-0.5 rounded-full border">
                        {sub}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Regenerate */}
          <div className="flex justify-end pt-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 text-[10px] gap-1 text-muted-foreground"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              Regenerate
            </Button>
          </div>
        </CardContent>
      )}

      {/* Loading state */}
      {loading && !insights && (
        <CardContent className="px-3 pb-3 pt-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground py-4 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
            Analyzing batch data across {subjects.length} subjects…
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default BatchAIInsights;
