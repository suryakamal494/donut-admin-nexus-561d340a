import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, FileText, ChevronRight, Calendar, TrendingUp, TrendingDown, Users, BarChart3, Filter, GraduationCap, Award, Search, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { batchInfoMap } from "@/data/teacher/examResults";
import { getBatchChapters, getBatchExamHistory, getBatchInstituteTests } from "@/data/teacher/reportsData";
import { getBatchStudentRoster, type StudentRosterEntry } from "@/data/teacher/studentReportData";
import { currentTeacher } from "@/data/teacher/profile";
import { cn } from "@/lib/utils";
import { getPerformanceColor, getStatusColor } from "@/lib/reportColors";
import { motion } from "framer-motion";
import { format, subDays, isAfter } from "date-fns";
import { InfoTooltip } from "@/components/timetable/InfoTooltip";

const EXAMS_PER_PAGE = 10;

const dateFilters = [
  { label: "All Time", days: null },
  { label: "30 days", days: 30 },
  { label: "3 months", days: 90 },
  { label: "6 months", days: 180 },
] as const;

const BatchReport = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("chapters");
  const [dateFilter, setDateFilter] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [examSource, setExamSource] = useState<"my" | "institute">("my");

  const batchInfo = batchId ? batchInfoMap[batchId] : null;

  const chapters = useMemo(() => (batchId ? getBatchChapters(batchId) : []), [batchId]);
  const allExamHistory = useMemo(() => (batchId ? getBatchExamHistory(batchId) : []), [batchId]);
  const instituteTests = useMemo(() => (batchId ? getBatchInstituteTests(batchId, currentTeacher.subjects[0] || "Physics") : []), [batchId]);
  const studentRoster = useMemo(() => (batchId ? getBatchStudentRoster(batchId) : []), [batchId]);
  const [studentSearch, setStudentSearch] = useState("");

  // Filter exams by date
  const filteredExams = useMemo(() => {
    if (!dateFilter) return allExamHistory;
    const cutoff = subDays(new Date(), dateFilter);
    return allExamHistory.filter(e => isAfter(new Date(e.date), cutoff));
  }, [allExamHistory, dateFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredExams.length / EXAMS_PER_PAGE));
  const paginatedExams = useMemo(() => {
    const start = (currentPage - 1) * EXAMS_PER_PAGE;
    return filteredExams.slice(start, start + EXAMS_PER_PAGE);
  }, [filteredExams, currentPage]);

  // Reset page when filter changes
  const handleDateFilter = (days: number | null) => {
    setDateFilter(days);
    setCurrentPage(1);
  };

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
    const colors = getStatusColor(status);
    return <Badge variant="secondary" className={cn("text-[10px] px-1.5 py-0.5 font-medium", colors.badge)}>{status}</Badge>;
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
        <TabsList className="w-full sm:w-auto h-auto p-1 grid grid-cols-3 sm:flex max-w-md">
          <TabsTrigger value="chapters" className="text-xs sm:text-sm gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            Chapters
            <InfoTooltip content="Chapter-wise performance overview — average success rate, topic count, and weak areas for each chapter." />
          </TabsTrigger>
          <TabsTrigger value="exams" className="text-xs sm:text-sm gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            Exams ({allExamHistory.length})
            <InfoTooltip content="All completed exams for this batch — click any exam to view detailed results and analytics." />
          </TabsTrigger>
          <TabsTrigger value="students" className="text-xs sm:text-sm gap-1.5">
            <Users className="w-3.5 h-3.5" />
            Students ({studentRoster.length})
            <InfoTooltip content="Student-wise performance overview — click any student to see their detailed report across all chapters and exams." />
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

        {/* ── Exams Tab (Enriched) ── */}
        <TabsContent value="exams" className="space-y-4">
          {/* Source toggle: My Exams | Institute Tests */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => { setExamSource("my"); setCurrentPage(1); }}
              className={cn(
                "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors",
                examSource === "my"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              My Exams ({allExamHistory.length})
            </button>
            <button
              onClick={() => { setExamSource("institute"); setCurrentPage(1); }}
              className={cn(
                "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5",
                examSource === "institute"
                  ? "bg-violet-600 text-white shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Institute Tests ({instituteTests.length})
            </button>
          </div>

          {/* ── My Exams View ── */}
          {examSource === "my" && (
            <>
              {/* Date filter pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                {dateFilters.map((f) => (
                  <button
                    key={f.label}
                    onClick={() => handleDateFilter(f.days)}
                    className={cn(
                      "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                      dateFilter === f.days
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
                <span className="text-[11px] text-muted-foreground ml-auto shrink-0">
                  {filteredExams.length} exam{filteredExams.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Exam cards */}
              <div className="space-y-3">
                {paginatedExams.map((exam, i) => {
                  const colors = getPerformanceColor(exam.passPercentage);
                  return (
                    <motion.div
                      key={exam.examId}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: i * 0.04 }}
                    >
                      <Card
                        className={cn(
                          "card-premium cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99] border-l-4",
                          colors.border
                        )}
                        onClick={() => navigate(`/teacher/reports/${batchId}/exams/${exam.examId}`)}
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
                            <Badge variant="secondary" className={cn("text-[10px] shrink-0 font-semibold", colors.badge)}>
                              {exam.passPercentage}% pass
                            </Badge>
                          </div>

                          <div className="grid grid-cols-3 gap-2 mt-2">
                            <div className={cn("rounded-lg p-2 text-center", colors.bg)}>
                              <p className={cn("text-sm font-bold", colors.text)}>{exam.classAverage}/{exam.totalMarks}</p>
                              <p className="text-[10px] text-muted-foreground">Avg Score</p>
                            </div>
                            <div className={cn("rounded-lg p-2 text-center", colors.bg)}>
                              <p className={cn("text-sm font-bold", colors.text)}>{exam.highestScore}/{exam.totalMarks}</p>
                              <p className="text-[10px] text-muted-foreground">Highest</p>
                            </div>
                            <div className="bg-muted/50 rounded-lg p-2 text-center">
                              <p className="text-sm font-bold text-foreground">{exam.totalStudents}</p>
                              <p className="text-[10px] text-muted-foreground">Students</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Empty state */}
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

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className={cn(currentPage === 1 && "pointer-events-none opacity-50", "cursor-pointer")}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={page === currentPage}
                          onClick={() => setCurrentPage(page)}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
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

          {/* ── Institute Tests View ── */}
          {examSource === "institute" && (
            <>
              <div className="space-y-3">
                {instituteTests.map((test, i) => {
                  const patternStyles: Record<string, { label: string; bg: string; text: string }> = {
                    jee_main: { label: "JEE Main", bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400" },
                    jee_advanced: { label: "JEE Adv", bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400" },
                    neet: { label: "NEET", bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400" },
                  };
                  const ps = patternStyles[test.pattern] || patternStyles.jee_main;
                  const passColors = getPerformanceColor(test.passPercentage);

                  return (
                    <motion.div
                      key={test.examId}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: i * 0.04 }}
                    >
                      <Card
                        className="card-premium border-l-4 border-l-violet-500 cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99]"
                        onClick={() => navigate(`/teacher/reports/${batchId}/institute-test/${test.examId}`)}
                      >
                        <CardContent className="p-3.5 sm:p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                <h3 className="text-sm font-semibold text-foreground truncate">{test.examName}</h3>
                                <Badge variant="secondary" className={cn("text-[10px] px-1.5 py-0 font-semibold", ps.bg, ps.text)}>
                                  {ps.label}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                {format(new Date(test.date), "dd MMM yyyy")}
                                <span>·</span>
                                <Award className="w-3 h-3" />
                                <span className="font-medium text-violet-600 dark:text-violet-400">{currentTeacher.subjects[0]}</span>
                              </div>
                            </div>
                            <Badge variant="secondary" className="text-[10px] shrink-0 font-semibold bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
                              Grand Test
                            </Badge>
                          </div>

                          <div className="grid grid-cols-3 gap-2 mt-2">
                            <div className="bg-violet-50 dark:bg-violet-950/30 rounded-lg p-2 text-center">
                              <p className="text-sm font-bold text-violet-700 dark:text-violet-400">{test.subjectAvgScore}/{test.subjectMaxMarks}</p>
                              <p className="text-[10px] text-muted-foreground">Avg ({currentTeacher.subjects[0]})</p>
                            </div>
                            <div className="bg-violet-50 dark:bg-violet-950/30 rounded-lg p-2 text-center">
                              <p className="text-sm font-bold text-violet-700 dark:text-violet-400">{test.subjectHighest}/{test.subjectMaxMarks}</p>
                              <p className="text-[10px] text-muted-foreground">Highest</p>
                            </div>
                            <div className="bg-muted/50 rounded-lg p-2 text-center">
                              <p className="text-sm font-bold text-foreground">{test.participantCount.toLocaleString()}</p>
                              <p className="text-[10px] text-muted-foreground">Participants</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                            <span className="text-[11px] text-muted-foreground">Total: {test.totalMarks} marks</span>
                            <Badge variant="secondary" className={cn("text-[10px] font-semibold", passColors.badge)}>
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
        </TabsContent>

        {/* ── Students Tab ── */}
        <TabsContent value="students" className="space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search students..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Student list */}
          {studentRoster
            .filter(s => s.studentName.toLowerCase().includes(studentSearch.toLowerCase()) || s.rollNumber.toLowerCase().includes(studentSearch.toLowerCase()))
            .map((student, i) => {
              const bucketStyles: Record<string, { badge: string; label: string }> = {
                mastery: { badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400", label: "Mastery" },
                stable: { badge: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400", label: "Stable" },
                reinforcement: { badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400", label: "Reinforce" },
                risk: { badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400", label: "At Risk" },
              };
              const bs = bucketStyles[student.piBucket];
              const TrendIcon = student.trend === "up" ? TrendingUp : student.trend === "down" ? TrendingDown : Minus;
              const trendColor = student.trend === "up" ? "text-emerald-500" : student.trend === "down" ? "text-red-500" : "text-muted-foreground";

              return (
                <motion.div
                  key={student.studentId}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                >
                  <Card
                    className="card-premium cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99]"
                    onClick={() => navigate(`/teacher/reports/${batchId}/students/${student.studentId}`)}
                  >
                    <CardContent className="p-3.5 sm:p-4 flex items-center gap-3">
                      <div className={cn(
                        "shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm",
                        getPerformanceColor(student.avgPercentage).bg
                      )}>
                        {student.avgPercentage}%
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <h3 className="text-sm font-semibold text-foreground truncate">{student.studentName}</h3>
                          <Badge variant="secondary" className={cn("text-[10px] px-1.5 py-0 font-medium", bs.badge)}>{bs.label}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span>{student.rollNumber}</span>
                          <span>·</span>
                          <span>{student.examsAttempted} exams</span>
                          <TrendIcon className={cn("w-3 h-3", trendColor)} />
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}

          {studentRoster.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold mb-1">No student data</h3>
                <p className="text-sm text-muted-foreground">Conduct exams to see student-wise analytics.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BatchReport;
