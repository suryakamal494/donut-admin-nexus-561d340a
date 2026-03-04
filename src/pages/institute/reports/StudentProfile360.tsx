import { useMemo, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, GraduationCap, TrendingUp, TrendingDown, Minus, BookOpen, ClipboardList, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/ui/page-header";
import { cn } from "@/lib/utils";
import { getStudentById, getStudentExamHistory, type InstituteStudentSummary } from "@/data/institute/reportsData";
import { getPerformanceColor } from "@/lib/reportColors";
import { motion } from "framer-motion";
import StudentReportCard from "@/components/institute/reports/export/StudentReportCard";
import ExportDropdown from "@/components/institute/reports/export/ExportDropdown";

const trendIcon = (trend: string, size = "w-3.5 h-3.5") => {
  if (trend === "up") return <TrendingUp className={cn(size, "text-emerald-500")} />;
  if (trend === "down") return <TrendingDown className={cn(size, "text-red-500")} />;
  return <Minus className={cn(size, "text-muted-foreground")} />;
};

const trendLabel = (trend: string) => {
  if (trend === "up") return "Improving";
  if (trend === "down") return "Declining";
  return "Stable";
};

// Identify weak spots
interface WeakSpot {
  subject: string;
  average: number;
  color: string;
}

function getWeakSpots(student: InstituteStudentSummary): WeakSpot[] {
  return student.subjects
    .filter(s => s.average < 50)
    .sort((a, b) => a.average - b.average)
    .map(s => ({ subject: s.subjectName, average: s.average, color: s.subjectColor }));
}

const INITIAL_EXAM_COUNT = 10;

const StudentProfile360 = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();

  const student = useMemo(() => getStudentById(studentId || ""), [studentId]);
  const examHistory = useMemo(() => (student ? getStudentExamHistory(student) : []), [student]);
  const weakSpots = useMemo(() => (student ? getWeakSpots(student) : []), [student]);
  const reportCardRef = useRef<HTMLDivElement>(null);
  const getReportElement = useCallback(() => reportCardRef.current, []);

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-4">
        <GraduationCap className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Student Not Found</h2>
        <p className="text-muted-foreground mb-4">This student profile doesn't exist.</p>
        <Button onClick={() => navigate("/institute/reports/students")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Students
        </Button>
      </div>
    );
  }

  const overallColor = getPerformanceColor(student.overallAverage);

  return (
    <div className="space-y-3 max-w-7xl mx-auto pb-6">
      <PageHeader
        title={student.studentName}
        description={`${student.rollNumber} · ${student.batchName}`}
        breadcrumbs={[
          { label: "Institute", href: "/institute" },
          { label: "Reports", href: "/institute/reports" },
          { label: "Students", href: "/institute/reports/students" },
          { label: student.studentName },
        ]}
        actions={
          <ExportDropdown
            getElement={getReportElement}
            filename={`Report-${student.studentName.replace(/\s+/g, "-")}`}
          />
        }
      />

      {/* Profile Header Card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card className={cn("border-0 shadow-sm border-l-4", overallColor.border)}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-bold text-foreground">{student.studentName}</h2>
                <p className="text-xs text-muted-foreground">{student.rollNumber} · {student.batchName}</p>
              </div>
              <div className="text-right">
                <p className={cn("text-xl sm:text-2xl font-bold", overallColor.text)}>{student.overallAverage}%</p>
                <div className="flex items-center gap-1 justify-end">
                  {trendIcon(student.trend)}
                  <span className="text-[10px] text-muted-foreground">{trendLabel(student.trend)}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 text-xs text-muted-foreground">
              <span>{student.subjectCount} subjects</span>
              <span>·</span>
              <span>{student.examsTaken} exams taken</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="subjects" className="space-y-3">
        <TabsList className="w-full sm:w-auto h-auto p-1 grid grid-cols-3 sm:flex">
          <TabsTrigger value="subjects" className="text-xs sm:text-sm">Subjects</TabsTrigger>
          <TabsTrigger value="exams" className="text-xs sm:text-sm">Exam History</TabsTrigger>
          <TabsTrigger value="analysis" className="text-xs sm:text-sm">Analysis</TabsTrigger>
        </TabsList>

        {/* ── Subjects Tab ── */}
        <TabsContent value="subjects" className="space-y-2">
          {student.subjects.map((sub, i) => {
            const color = getPerformanceColor(sub.average);
            return (
              <motion.div
                key={sub.subjectName}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card className={cn("border-0 shadow-sm border-l-4", color.border)}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: `hsl(${sub.subjectColor})` }}
                        />
                        <h4 className="text-sm font-semibold text-foreground">{sub.subjectName}</h4>
                        {trendIcon(sub.trend)}
                      </div>
                      <span className={cn("text-sm font-bold", color.text)}>{sub.average}%</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span>Teacher: {sub.teacherName}</span>
                      <span>·</span>
                      <span>{sub.examCount} exams</span>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className={cn("h-full rounded-full transition-all", color.bg)} style={{ width: `${sub.average}%` }} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </TabsContent>

        {/* ── Exam History Tab ── */}
        <ExamHistoryTab examHistory={examHistory} />

        {/* ── Analysis Tab ── */}
        <TabsContent value="analysis" className="space-y-3">
          {/* Weak Spots */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Weak Spots
              </CardTitle>
            </CardHeader>
            <CardContent>
              {weakSpots.length === 0 ? (
                <p className="text-sm text-muted-foreground">No subjects below 50% — great performance!</p>
              ) : (
                <div className="space-y-2">
                  {weakSpots.map(ws => {
                    const color = getPerformanceColor(ws.average);
                    return (
                      <div key={ws.subject} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: `hsl(${ws.color})` }} />
                        <span className="text-sm text-foreground flex-1">{ws.subject}</span>
                        <span className={cn("text-sm font-bold", color.text)}>{ws.average}%</span>
                        <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className={cn("h-full rounded-full", color.bg)} style={{ width: `${ws.average}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Overview */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                Subject Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {student.subjects.map(sub => {
                  const color = getPerformanceColor(sub.average);
                  return (
                    <div key={sub.subjectName}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-foreground">{sub.subjectName}</span>
                        <span className={cn("text-xs font-bold", color.text)}>{sub.average}%</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className={cn("h-full rounded-full", color.bg)}
                          initial={{ width: 0 }}
                          animate={{ width: `${sub.average}%` }}
                          transition={{ duration: 0.6, delay: 0.1 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Performance Trend Sparkline */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Recent Performance Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-1 h-20">
                {examHistory.slice(0, 10).reverse().map((exam, i) => {
                  const color = getPerformanceColor(exam.percentage);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                      <motion.div
                        className={cn("w-full rounded-t-sm min-h-[4px]", color.bg)}
                        style={{ height: `${(exam.percentage / 100) * 64}px` }}
                        initial={{ height: 0 }}
                        animate={{ height: `${(exam.percentage / 100) * 64}px` }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                      />
                      <span className="text-[8px] text-muted-foreground">{exam.percentage}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-2">Last {Math.min(10, examHistory.length)} exams (oldest → newest)</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Hidden printable report card */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <StudentReportCard ref={reportCardRef} student={student} />
      </div>
    </div>
  );
};

// Extracted exam history tab with Show more
import { useState } from "react";
import type { ExamHistoryEntry } from "@/data/institute/reportsData";

function ExamHistoryTab({ examHistory }: { examHistory: ExamHistoryEntry[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? examHistory : examHistory.slice(0, INITIAL_EXAM_COUNT);

  return (
    <TabsContent value="exams" className="space-y-2">
      <Card className="card-premium">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-primary" />
            Exam History ({examHistory.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {visible.map((exam, i) => {
              const color = getPerformanceColor(exam.percentage);
              return (
                <div key={`${exam.examName}-${i}`} className={cn("flex items-center gap-3 px-3 py-2.5 border-l-3", color.border)}>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-foreground truncate">{exam.examName}</p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                      <span>{exam.subject}</span>
                      <span>·</span>
                      <span>{new Date(exam.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={cn("text-sm font-bold", color.text)}>{exam.percentage}%</p>
                    <p className="text-[10px] text-muted-foreground">{exam.score}/{exam.maxScore}</p>
                  </div>
                </div>
              );
            })}
          </div>
          {examHistory.length > INITIAL_EXAM_COUNT && (
            <div className="p-3 text-center">
              <Button variant="ghost" size="sm" className="text-xs" onClick={() => setShowAll(!showAll)}>
                {showAll ? "Show less" : `View all ${examHistory.length} exams`}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export default StudentProfile360;
