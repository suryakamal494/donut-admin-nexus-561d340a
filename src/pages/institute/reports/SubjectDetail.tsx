import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { User, BookOpen, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, Minus, GitCompareArrows } from "lucide-react";
import { getSubjectDetail, getCrossBatchChapterComparison } from "@/data/institute/reportsData";
import { getStatusColor, getPerformanceColor } from "@/lib/reportColors";

const SubjectDetail = () => {
  const { batchId, subjectId } = useParams<{ batchId: string; subjectId: string }>();
  const detail = useMemo(() => batchId && subjectId ? getSubjectDetail(batchId, subjectId) : undefined, [batchId, subjectId]);

  if (!detail) {
    return (
      <div className="p-6 text-center text-muted-foreground">Subject not found.</div>
    );
  }

  const TrendIcon = detail.trend === "up" ? TrendingUp : detail.trend === "down" ? TrendingDown : Minus;

  const strongCount = detail.chapters.filter(c => c.status === "strong").length;
  const weakCount = detail.chapters.filter(c => c.status === "weak").length;

  return (
    <div className="space-y-3 max-w-7xl mx-auto pb-20 md:pb-6">
      <PageHeader
        title={detail.subjectName}
        description={
          <span className="flex items-center gap-2 flex-wrap text-xs">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {detail.teacherName}
            </span>
            <span className="text-muted-foreground">·</span>
            <span>{detail.totalStudents} students</span>
            <span className="text-muted-foreground">·</span>
            <span className="font-semibold text-foreground">{detail.classAverage}% avg</span>
            <span className="text-muted-foreground">·</span>
            <span className="flex items-center gap-0.5">
              <TrendIcon className={cn(
                "w-3 h-3",
                detail.trend === "up" ? "text-emerald-500" :
                detail.trend === "down" ? "text-red-500" :
                "text-muted-foreground"
              )} />
              {detail.trend === "up" ? "Improving" : detail.trend === "down" ? "Declining" : "Stable"}
            </span>
          </span>
        }
        breadcrumbs={[
          { label: "Institute", href: "/institute" },
          { label: "Reports", href: "/institute/reports" },
          { label: "Batches", href: "/institute/reports/batches" },
          { label: detail.batchName, href: `/institute/reports/batches/${detail.batchId}` },
          { label: detail.subjectName },
        ]}
      />

      {/* Subject color accent bar */}
      <div
        className="h-1 rounded-full"
        style={{ background: `linear-gradient(90deg, hsl(${detail.subjectColor}), hsl(${detail.subjectColor} / 0.4))` }}
      />

      {/* Quick summary pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-xs">
          <BookOpen className="w-3 h-3 text-muted-foreground" />
          <span className="text-muted-foreground">{detail.chapters.length} chapters</span>
        </div>
        {strongCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-xs">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span className="text-emerald-700 font-medium">{strongCount} strong</span>
          </div>
        )}
        {weakCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-xs">
            <AlertTriangle className="w-3 h-3 text-red-500" />
            <span className="text-red-700 font-medium">{weakCount} weak</span>
          </div>
        )}
      </div>

      {/* Chapter cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {detail.chapters.map((chapter, i) => {
          const colors = getStatusColor(chapter.status);
          const statusLabel = chapter.status === "strong" ? "Strong" : chapter.status === "moderate" ? "Moderate" : "Weak";

          return (
            <motion.div
              key={chapter.chapterId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.04 }}
            >
              <Card className={cn("border-0 shadow-sm overflow-hidden border-l-[3px]", colors.border)}>
                <CardContent className="p-3">
                  {/* Chapter name + status badge */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-xs sm:text-sm font-semibold text-foreground leading-tight">{chapter.chapterName}</h4>
                    <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0", colors.badge)}>
                      {statusLabel}
                    </span>
                  </div>

                  {/* Success rate prominent */}
                  <div className="mb-2">
                    <span className={cn("text-lg sm:text-xl font-bold", colors.text)}>{chapter.avgSuccessRate}%</span>
                    <span className="text-[10px] text-muted-foreground ml-1">success rate</span>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-3 text-[10px] sm:text-xs text-muted-foreground border-t border-border/40 pt-2">
                    <span>{chapter.topicCount} topics</span>
                    <span>·</span>
                    <span>{chapter.examsCovering} exams</span>
                    {chapter.weakTopicCount > 0 && (
                      <>
                        <span>·</span>
                        <span className="text-destructive font-semibold flex items-center gap-0.5">
                          <AlertTriangle className="w-3 h-3" />
                          {chapter.weakTopicCount} weak
                        </span>
                      </>
                    )}
                  </div>

                  {/* Cross-batch comparison */}
                  <CrossBatchLine
                    subjectName={detail.subjectName}
                    chapterName={chapter.chapterName}
                    currentBatchId={detail.batchId}
                  />
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SubjectDetail;
