import { useNavigate } from "react-router-dom";
import { BookOpen, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getStatusColor } from "@/lib/reportColors";
import { motion } from "framer-motion";
import type { ChapterReportCard } from "@/data/teacher/reportsData";

interface ChaptersTabProps {
  chapters: ChapterReportCard[];
  batchId: string;
}

const statusBadge = (status: "strong" | "moderate" | "weak") => {
  const colors = getStatusColor(status);
  return <Badge variant="secondary" className={cn("text-[10px] px-1.5 py-0.5 font-medium", colors.badge)}>{status}</Badge>;
};

export const ChaptersTab = ({ chapters, batchId }: ChaptersTabProps) => {
  const navigate = useNavigate();

  if (chapters.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-8 text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold mb-1">No chapter data</h3>
          <p className="text-sm text-muted-foreground">Conduct exams to see chapter-wise analytics.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {chapters.map((ch, i) => (
        <motion.div
          key={ch.chapterId}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: i * 0.04 }}
        >
          <Card
            className="card-premium cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99]"
            onClick={() => navigate(`/teacher/reports/${batchId}/chapters/${ch.chapterId}`)}
          >
            <CardContent className="p-3.5 sm:p-4 flex items-center gap-3">
              <div className={cn(
                "shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center text-white font-bold text-sm",
                ch.status === "strong" ? "bg-emerald-500" :
                ch.status === "moderate" ? "bg-amber-500" : "bg-red-500"
              )}>
                {ch.avgSuccessRate}%
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-sm font-semibold text-foreground truncate">{ch.chapterName}</h3>
                  {statusBadge(ch.status)}
                </div>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span>{ch.topicCount} topics</span>
                  <span>·</span>
                  <span>{ch.examsCovering} exam{ch.examsCovering > 1 ? "s" : ""}</span>
                  {ch.weakTopicCount > 0 && (
                    <>
                      <span>·</span>
                      <span className="text-red-500 font-medium">{ch.weakTopicCount} weak</span>
                    </>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
