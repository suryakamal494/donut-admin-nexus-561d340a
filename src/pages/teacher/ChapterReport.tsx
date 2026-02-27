import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, CheckCircle, AlertTriangle, XCircle, BarChart3, FileText, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { batchInfoMap } from "@/data/teacher/examResults";
import { getChapterDetail } from "@/data/teacher/reportsData";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { format } from "date-fns";

const ChapterReport = () => {
  const { batchId, chapterId } = useParams<{ batchId: string; chapterId: string }>();
  const navigate = useNavigate();

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

      {/* Topic-wise Analysis */}
      <Card className="card-premium">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            Topic-wise Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {chapter.topics.map((topic, i) => {
            const StatusIcon = topic.status === "strong" ? CheckCircle :
              topic.status === "moderate" ? AlertTriangle : XCircle;
            const barColor = topic.status === "strong" ? "bg-emerald-500" :
              topic.status === "moderate" ? "bg-amber-500" : "bg-red-500";
            const iconColor = topic.status === "strong" ? "text-emerald-500" :
              topic.status === "moderate" ? "text-amber-500" : "text-red-500";

            return (
              <motion.div
                key={topic.topicId}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
                className="flex items-center gap-3"
              >
                <StatusIcon className={cn("w-4 h-4 shrink-0", iconColor)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-foreground truncate">{topic.topicName}</span>
                    <span className="text-xs font-bold text-foreground ml-2">{topic.avgSuccessRate}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all", barColor)} style={{ width: `${topic.avgSuccessRate}%` }} />
                  </div>
                  <div className="flex gap-2 mt-0.5 text-[10px] text-muted-foreground">
                    <span>{topic.questionsAsked} Qs</span>
                    <span>·</span>
                    <span>{topic.examsAppeared} exam{topic.examsAppeared > 1 ? "s" : ""}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>

      {/* Exam Breakdown */}
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
    </div>
  );
};

export default ChapterReport;
