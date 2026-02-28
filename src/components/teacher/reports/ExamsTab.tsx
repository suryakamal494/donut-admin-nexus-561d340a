import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Calendar, Filter, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { getPerformanceColor } from "@/lib/reportColors";
import { motion } from "framer-motion";
import { format, subDays, isAfter } from "date-fns";
import type { BatchExamEntry, InstituteTestEntry } from "@/data/teacher/reportsData";
import { currentTeacher } from "@/data/teacher/profile";

const EXAMS_PER_PAGE = 10;

const dateFilters = [
  { label: "All Time", days: null },
  { label: "30 days", days: 30 },
  { label: "3 months", days: 90 },
  { label: "6 months", days: 180 },
] as const;

interface ExamsTabProps {
  allExamHistory: BatchExamEntry[];
  instituteTests: InstituteTestEntry[];
  batchId: string;
}

export const ExamsTab = ({ allExamHistory, instituteTests, batchId }: ExamsTabProps) => {
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [examSource, setExamSource] = useState<"my" | "institute">("my");

  const filteredExams = useMemo(() => {
    if (!dateFilter) return allExamHistory;
    const cutoff = subDays(new Date(), dateFilter);
    return allExamHistory.filter(e => isAfter(new Date(e.date), cutoff));
  }, [allExamHistory, dateFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredExams.length / EXAMS_PER_PAGE));
  const paginatedExams = useMemo(() => {
    const start = (currentPage - 1) * EXAMS_PER_PAGE;
    return filteredExams.slice(start, start + EXAMS_PER_PAGE);
  }, [filteredExams, currentPage]);

  const handleDateFilter = (days: number | null) => {
    setDateFilter(days);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-3">
      {/* Source toggle */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => { setExamSource("my"); setCurrentPage(1); }}
          className={cn(
            "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors",
            examSource === "my" ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          My Exams ({allExamHistory.length})
        </button>
        <button
          onClick={() => { setExamSource("institute"); setCurrentPage(1); }}
          className={cn(
            "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5",
            examSource === "institute" ? "bg-violet-600 text-white shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          Institute Tests ({instituteTests.length})
        </button>
      </div>

      {/* My Exams */}
      {examSource === "my" && (
        <>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            {dateFilters.map((f) => (
              <button
                key={f.label}
                onClick={() => handleDateFilter(f.days)}
                className={cn(
                  "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                  dateFilter === f.days ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {f.label}
              </button>
            ))}
            <span className="text-[11px] text-muted-foreground ml-auto shrink-0">
              {filteredExams.length} exam{filteredExams.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="space-y-3">
            {paginatedExams.map((exam, i) => {
              const colors = getPerformanceColor(exam.passPercentage);
              return (
                <motion.div key={exam.examId} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: i * 0.04 }}>
                  <Card
                    className={cn("card-premium cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99] border-l-4", colors.border)}
                    onClick={() => navigate(`/teacher/reports/${batchId}/exams/${exam.examId}`)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-semibold text-foreground truncate">{exam.examName}</h3>
                          <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-muted-foreground flex-wrap">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(exam.date), "dd MMM yyyy")}
                            <span>·</span>
                            <span>Avg <span className={cn("font-semibold", colors.text)}>{exam.classAverage}/{exam.totalMarks}</span></span>
                            <span className="hidden xs:inline">·</span>
                            <span className="hidden xs:inline">High {exam.highestScore}/{exam.totalMarks}</span>
                            <span>·</span>
                            <span>{exam.totalStudents} students</span>
                          </div>
                        </div>
                        <Badge variant="secondary" className={cn("text-[10px] shrink-0 font-semibold ml-2", colors.badge)}>
                          {exam.passPercentage}% pass
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {filteredExams.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold mb-1">No exams found</h3>
                <p className="text-sm text-muted-foreground">
                  {dateFilter ? "No exams match the selected time period. Try a wider range." : "No completed exams found for this batch."}
                </p>
              </CardContent>
            </Card>
          )}

          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={cn(currentPage === 1 && "pointer-events-none opacity-50", "cursor-pointer")}
                  />
                </PaginationItem>
                {(() => {
                  const pages: (number | "ellipsis")[] = [];
                  if (totalPages <= 5) {
                    for (let i = 1; i <= totalPages; i++) pages.push(i);
                  } else {
                    pages.push(1);
                    if (currentPage > 3) pages.push("ellipsis");
                    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
                    if (currentPage < totalPages - 2) pages.push("ellipsis");
                    pages.push(totalPages);
                  }
                  return pages.map((page, idx) =>
                    page === "ellipsis" ? (
                      <PaginationItem key={`ellipsis-${idx}`}>
                        <span className="px-2 text-muted-foreground">…</span>
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={page}>
                        <PaginationLink isActive={page === currentPage} onClick={() => setCurrentPage(page)} className="cursor-pointer">
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  );
                })()}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={cn(currentPage === totalPages && "pointer-events-none opacity-50", "cursor-pointer")}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}

      {/* Institute Tests */}
      {examSource === "institute" && (
        <>
          <div className="space-y-2">
            {instituteTests.map((test, i) => {
              const patternStyles: Record<string, { label: string; bg: string; text: string }> = {
                jee_main: { label: "JEE Main", bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400" },
                jee_advanced: { label: "JEE Adv", bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400" },
                neet: { label: "NEET", bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400" },
              };
              const ps = patternStyles[test.pattern] || patternStyles.jee_main;
              const passColors = getPerformanceColor(test.passPercentage);

              return (
                <motion.div key={test.examId} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: i * 0.04 }}>
                  <Card
                    className="card-premium border-l-4 border-l-violet-500 cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99]"
                    onClick={() => navigate(`/teacher/reports/${batchId}/institute-test/${test.examId}`)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <h3 className="text-sm font-semibold text-foreground truncate">{test.examName}</h3>
                            <Badge variant="secondary" className={cn("text-[10px] px-1.5 py-0 font-semibold", ps.bg, ps.text)}>
                              {ps.label}
                            </Badge>
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0 font-semibold bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
                              Grand Test
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-muted-foreground flex-wrap">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(test.date), "dd MMM yyyy")}
                            <span>·</span>
                            <span>Avg <span className="font-semibold text-violet-600 dark:text-violet-400">{test.subjectAvgScore}/{test.subjectMaxMarks}</span> ({currentTeacher.subjects[0]})</span>
                            <span>·</span>
                            <span>High {test.subjectHighest}/{test.subjectMaxMarks}</span>
                            <span>·</span>
                            <span>{test.participantCount.toLocaleString()} students</span>
                          </div>
                        </div>
                        <Badge variant="secondary" className={cn("text-[10px] font-semibold shrink-0 ml-2", passColors.badge)}>
                          {test.passPercentage}% pass
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {instituteTests.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold mb-1">No institute tests</h3>
                <p className="text-sm text-muted-foreground">No completed grand tests with {currentTeacher.subjects[0]} found.</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};
