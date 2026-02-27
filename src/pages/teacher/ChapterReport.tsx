import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, CheckCircle, AlertTriangle, XCircle, BarChart3, FileText, Calendar, ChevronDown, ChevronUp, Sparkles, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { batchInfoMap } from "@/data/teacher/examResults";
import { getChapterDetail } from "@/data/teacher/reportsData";
import type { ChapterStudentBucket } from "@/data/teacher/reportsData";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { AIHomeworkGeneratorDialog } from "@/components/teacher/AIHomeworkGeneratorDialog";
import type { AIHomeworkPrefill } from "@/components/teacher/AIHomeworkGeneratorDialog";

// Band visual styles
const bandStyles: Record<string, { dot: string; border: string; bg: string; badge: string }> = {
  mastery: { dot: "bg-emerald-500", border: "border-l-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
  stable: { dot: "bg-blue-500", border: "border-l-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30", badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  reinforcement: { dot: "bg-amber-500", border: "border-l-amber-500", bg: "bg-amber-50 dark:bg-amber-950/30", badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  risk: { dot: "bg-red-500", border: "border-l-red-500", bg: "bg-red-50 dark:bg-red-950/30", badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
};

const ChapterReport = () => {
  const { batchId, chapterId } = useParams<{ batchId: string; chapterId: string }>();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ reinforcement: true, risk: true });
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [aiPrefill, setAiPrefill] = useState<AIHomeworkPrefill | undefined>();

  const batchInfo = batchId ? batchInfoMap[batchId] : null;
  const chapter = useMemo(
    () => (batchId && chapterId ? getChapterDetail(chapterId, batchId) : null),
    [batchId, chapterId]
  );

  if (!chapter || !batchInfo) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-4">
        <BookOpen className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Chapter Not Found</h2>
        <Button onClick={() => navigate(batchId ? `/teacher/reports/${batchId}` : "/teacher/reports")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  const strong = chapter.topics.filter((t) => t.status === "strong");
  const moderate = chapter.topics.filter((t) => t.status === "moderate");
  const weak = chapter.topics.filter((t) => t.status === "weak");

  const toggle = (key: string) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="space-y-4 sm:space-y-5 max-w-7xl mx-auto pb-20 md:pb-6">
      <PageHeader
        title={chapter.chapterName}
        description={`${chapter.subject} · ${batchInfo.className} ${batchInfo.name}`}
        breadcrumbs={[
          { label: "Teacher", href: "/teacher" },
          { label: "Reports", href: "/teacher/reports" },
          { label: batchInfo.name, href: `/teacher/reports/${batchId}` },
          { label: chapter.chapterName },
        ]}
      />

      {/* Overview Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={cn(
          "rounded-xl p-4 sm:p-5 text-white shadow-lg",
          chapter.overallSuccessRate >= 65 ? "bg-gradient-to-r from-emerald-500 to-teal-500" :
          chapter.overallSuccessRate >= 40 ? "bg-gradient-to-r from-amber-500 to-orange-500" :
          "bg-gradient-to-r from-red-500 to-rose-500"
        )}
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-white/70">{chapter.chapterName}</p>
          <Badge className="bg-white/20 text-white border-0 text-[10px]">
            {chapter.examsCovering} exam{chapter.examsCovering > 1 ? "s" : ""}
          </Badge>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-1">{chapter.overallSuccessRate}%</h2>
        <p className="text-xs text-white/70">Overall success rate · {chapter.totalQuestionsAsked} questions asked</p>

        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="bg-white/15 rounded-lg p-2 text-center">
            <p className="text-lg font-bold">{strong.length}</p>
            <p className="text-[10px] text-white/70">Strong</p>
          </div>
          <div className="bg-white/15 rounded-lg p-2 text-center">
            <p className="text-lg font-bold">{moderate.length}</p>
            <p className="text-[10px] text-white/70">Moderate</p>
          </div>
          <div className="bg-white/15 rounded-lg p-2 text-center">
            <p className="text-lg font-bold">{weak.length}</p>
            <p className="text-[10px] text-white/70">Weak</p>
          </div>
        </div>
      </motion.div>

      {/* ── Topic Heatmap Grid ── */}
      <Card className="card-premium">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            Topic Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {chapter.topics.map((topic, i) => {
              const bgColor = topic.status === "strong"
                ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800"
                : topic.status === "moderate"
                ? "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800"
                : "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800";
              const textColor = topic.status === "strong"
                ? "text-emerald-700 dark:text-emerald-300"
                : topic.status === "moderate"
                ? "text-amber-700 dark:text-amber-300"
                : "text-red-700 dark:text-red-300";
              const StatusIcon = topic.status === "strong" ? CheckCircle :
                topic.status === "moderate" ? AlertTriangle : XCircle;

              return (
                <motion.div
                  key={topic.topicId}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  className={cn("rounded-xl border p-3 flex flex-col items-center text-center gap-1.5", bgColor)}
                >
                  <StatusIcon className={cn("w-5 h-5", textColor)} />
                  <p className={cn("text-xs font-semibold leading-tight", textColor)}>{topic.topicName}</p>
                  <p className={cn("text-lg font-bold", textColor)}>{topic.avgSuccessRate}%</p>
                  <p className="text-[10px] text-muted-foreground">{topic.questionsAsked} Qs · {topic.examsAppeared} exam{topic.examsAppeared > 1 ? "s" : ""}</p>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ── Student Performance Buckets ── */}
      <Card className="card-premium">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Student Performance Buckets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {chapter.studentBuckets.map((bucket) => {
            if (bucket.count === 0) return null;
            const style = bandStyles[bucket.key];
            const isOpen = !!expanded[bucket.key];

            return (
              <div
                key={bucket.key}
                className={cn(
                  "rounded-xl border border-border bg-card overflow-hidden border-l-4",
                  style.border
                )}
              >
                {/* Header */}
                <button
                  onClick={() => toggle(bucket.key)}
                  className="flex items-center justify-between w-full p-3.5 sm:p-4 min-h-[48px] text-left"
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", style.dot)} />
                    <span className="text-sm font-semibold text-foreground">{bucket.label}</span>
                    <span className={cn("text-xs font-medium rounded-full px-2 py-0.5", style.badge)}>
                      {bucket.count}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs gap-1 border-teal-300 text-teal-700 hover:bg-teal-50 dark:border-teal-700 dark:text-teal-300 dark:hover:bg-teal-950/40"
                        onClick={(e) => {
                          e.stopPropagation();
                          const isUpperBand = bucket.key === "mastery" || bucket.key === "stable";
                          const focusTopics = isUpperBand
                            ? chapter.topics.filter(t => t.status === "strong").map(t => t.topicName)
                            : [...chapter.topics.filter(t => t.status === "weak").map(t => t.topicName), ...chapter.topics.filter(t => t.status === "moderate").map(t => t.topicName)];
                          const instructions = isUpperBand
                            ? (bucket.key === "mastery"
                              ? `Generate advanced/challenge-level practice for top performers on ${chapter.chapterName}. Topics: ${focusTopics.join(", ") || chapter.chapterName}.`
                              : `Generate reinforcement practice to solidify understanding on ${chapter.chapterName}. Topics: ${focusTopics.join(", ") || chapter.chapterName}.`)
                            : (focusTopics.length > 0
                              ? `Focus on weak topics: ${focusTopics.join(", ")}. Generate practice for students in the "${bucket.label}" band.`
                              : `Generate practice for "${bucket.label}" band — ${chapter.chapterName}.`);
                          setAiPrefill({
                            title: `${chapter.chapterName} Practice — ${bucket.label}`,
                            subject: chapter.subject,
                            batchId: batchId || "batch-10a",
                            instructions,
                            contextBanner: `Pre-filled from: ${chapter.chapterName} · ${bucket.label} · ${focusTopics.length} focus topic${focusTopics.length !== 1 ? "s" : ""}`,
                          });
                          setShowAIGenerator(true);
                        }}
                      >
                        <Sparkles className="w-3 h-3" />
                        Generate Practice
                      </Button>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Student List */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-3.5 pb-3.5 sm:px-4 sm:pb-4 space-y-1">
                        {bucket.students.map((s) => (
                          <div
                            key={s.id}
                            className={cn(
                              "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm",
                              style.bg
                            )}
                          >
                            <div className="min-w-0">
                              <p className="font-medium truncate text-foreground">{s.studentName}</p>
                              <p className="text-xs text-muted-foreground">{s.rollNumber}</p>
                            </div>
                            <div className="text-right shrink-0 ml-3">
                              <p className="font-semibold text-foreground">{s.avgPercentage}%</p>
                              <p className="text-xs text-muted-foreground">{s.examsAttempted} exam{s.examsAttempted > 1 ? "s" : ""}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* ── Exam-wise Breakdown ── */}
      <Card className="card-premium">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Exam-wise Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {chapter.examBreakdown.map((exam) => (
            <div
              key={exam.examId}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/40 cursor-pointer hover:bg-muted/70 transition-colors"
              onClick={() => navigate(`/teacher/exams/${exam.examId}/results?batch=${batchId}`)}
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-foreground truncate">{exam.examName}</p>
                <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(exam.date), "dd MMM yyyy")}
                  <span>·</span>
                  <span>{exam.questionsFromChapter} Qs from this chapter</span>
                </div>
              </div>
              <div className={cn(
                "shrink-0 text-xs font-bold px-2 py-1 rounded-md",
                exam.avgSuccessRate >= 65 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                exam.avgSuccessRate >= 40 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              )}>
                {exam.avgSuccessRate}%
              </div>
            </div>
          ))}

          {chapter.examBreakdown.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No exam data for this chapter yet.</p>
          )}
        </CardContent>
      </Card>

      {/* AI Homework Generator Dialog */}
      <AIHomeworkGeneratorDialog
        open={showAIGenerator}
        onOpenChange={(v) => {
          setShowAIGenerator(v);
          if (!v) setAiPrefill(undefined);
        }}
        prefill={aiPrefill}
      />
    </div>
  );
};

export default ChapterReport;
