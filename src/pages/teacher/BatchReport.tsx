import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, FileText, ChevronRight, Calendar, TrendingUp, Users, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { batchInfoMap } from "@/data/teacher/examResults";
import { getBatchChapters, getBatchExamHistory } from "@/data/teacher/reportsData";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { format } from "date-fns";

const BatchReport = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("chapters");

  const batchInfo = batchId ? batchInfoMap[batchId] : null;

  const chapters = useMemo(() => (batchId ? getBatchChapters(batchId) : []), [batchId]);
  const examHistory = useMemo(() => (batchId ? getBatchExamHistory(batchId) : []), [batchId]);

  if (!batchId || !batchInfo) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-4">
        <Users className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Batch Not Found</h2>
        <Button onClick={() => navigate("/teacher/reports")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Reports
        </Button>
      </div>
    );
  }

  const statusBadge = (status: "strong" | "moderate" | "weak") => {
    const styles = {
      strong: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      moderate: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      weak: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return <Badge variant="secondary" className={cn("text-[10px] px-1.5 py-0.5 font-medium", styles[status])}>{status}</Badge>;
  };

  return (
    <div className="space-y-4 sm:space-y-5 max-w-7xl mx-auto pb-20 md:pb-6">
      <PageHeader
        title={`${batchInfo.className} — ${batchInfo.name}`}
        description="Chapter-wise & exam performance"
        breadcrumbs={[
          { label: "Teacher", href: "/teacher" },
          { label: "Reports", href: "/teacher/reports" },
          { label: batchInfo.name },
        ]}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full sm:w-auto h-auto p-1 grid grid-cols-2 sm:flex max-w-xs">
          <TabsTrigger value="chapters" className="text-xs sm:text-sm gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            Chapters
          </TabsTrigger>
          <TabsTrigger value="exams" className="text-xs sm:text-sm gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            Exams
          </TabsTrigger>
        </TabsList>

        {/* ── Chapters Tab ── */}
        <TabsContent value="chapters" className="space-y-3">
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
                  {/* Success rate circle */}
                  <div className={cn(
                    "shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center text-white font-bold text-sm",
                    ch.status === "strong" ? "bg-emerald-500" :
                    ch.status === "moderate" ? "bg-amber-500" : "bg-red-500"
                  )}>
                    {ch.avgSuccessRate}%
                  </div>

                  {/* Info */}
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

          {chapters.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold mb-1">No chapter data</h3>
                <p className="text-sm text-muted-foreground">Conduct exams to see chapter-wise analytics.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── Exams Tab ── */}
        <TabsContent value="exams" className="space-y-3">
          {examHistory.map((exam, i) => (
            <motion.div
              key={exam.examId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
            >
              <Card
                className="card-premium cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99]"
                onClick={() => navigate(`/teacher/exams/${exam.examId}/results`)}
              >
                <CardContent className="p-3.5 sm:p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-foreground truncate">{exam.examName}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(exam.date), "dd MMM yyyy")}
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-[10px] shrink-0">
                      {exam.totalMarks} marks
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div className="bg-muted/50 rounded-lg p-2 text-center">
                      <p className="text-sm font-bold text-foreground">{exam.classAverage}/{exam.totalMarks}</p>
                      <p className="text-[10px] text-muted-foreground">Avg Score</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2 text-center">
                      <p className="text-sm font-bold text-foreground">{exam.passPercentage}%</p>
                      <p className="text-[10px] text-muted-foreground">Pass Rate</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2 text-center">
                      <p className="text-sm font-bold text-foreground">{exam.totalStudents}</p>
                      <p className="text-[10px] text-muted-foreground">Students</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {examHistory.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold mb-1">No exams yet</h3>
                <p className="text-sm text-muted-foreground">No completed exams found for this batch.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BatchReport;
