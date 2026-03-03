import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BarChart3, Trophy, Users, TrendingUp, Medal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/ui/page-header";
import { cn } from "@/lib/utils";
import { getInstituteExams } from "@/data/institute/reportsData";
import { getPerformanceColor } from "@/lib/reportColors";
import { motion } from "framer-motion";
import { generateGrandTestData } from "@/data/institute/grandTestData";

const LEADERBOARD_PAGE_SIZE = 15;

const GrandTestResults = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [leaderboardLimit, setLeaderboardLimit] = useState(LEADERBOARD_PAGE_SIZE);

  const examEntry = useMemo(
    () => getInstituteExams().find((e) => e.examId === examId && e.type === "grand_test"),
    [examId]
  );

  const data = useMemo(() => {
    if (!examEntry) return null;
    return generateGrandTestData(
      examEntry.examId,
      examEntry.examName,
      examEntry.batchName,
      examEntry.date,
      examEntry.subjectNames || [],
      examEntry.totalMarks,
      examEntry.totalStudents,
      examEntry.classAverage,
      examEntry.passPercentage
    );
  }, [examEntry]);

  if (!examEntry || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-4">
        <BarChart3 className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Grand Test Not Found</h2>
        <p className="text-muted-foreground mb-4">This exam doesn't exist or is not a grand test.</p>
        <Button onClick={() => navigate("/institute/reports/exams")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Exam Reports
        </Button>
      </div>
    );
  }

  const overallPct = Math.round((data.classAverage / data.totalMarks) * 100);
  const perfColor = getPerformanceColor(overallPct);

  // Per-subject breakdown for selected subject
  const subjectDetail = selectedSubject
    ? data.subjects.find((s) => s.subject === selectedSubject)
    : null;
  const subjectStudents = selectedSubject
    ? data.leaderboard
        .map((st) => ({
          ...st,
          subjectScore: st.subjectScores.find((ss) => ss.subject === selectedSubject),
        }))
        .filter((st) => st.subjectScore)
        .sort((a, b) => (b.subjectScore!.score - a.subjectScore!.score))
    : [];

  const visibleLeaderboard = data.leaderboard.slice(0, leaderboardLimit);
  const hasMoreLeaderboard = leaderboardLimit < data.leaderboard.length;

  return (
    <div className="space-y-3 max-w-7xl mx-auto pb-20 md:pb-6">
      <PageHeader
        title={data.examName}
        description={`${data.batchName} · ${new Date(data.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · ${data.totalStudents} students`}
        breadcrumbs={[
          { label: "Institute", href: "/institute" },
          { label: "Reports", href: "/institute/reports" },
          { label: "Exams", href: "/institute/reports/exams" },
          { label: "Grand Test" },
        ]}
      />

      {/* Overall Summary Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("rounded-xl p-4 text-white", perfColor.bg)}
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-white/80 text-xs font-medium">{data.batchName}</p>
            <p className="text-xl font-bold">{overallPct}% avg</p>
          </div>
          <Trophy className="w-8 h-8 text-white/60" />
        </div>
        <div className="flex gap-4 text-xs text-white/90">
          <span>Highest: {data.highest}/{data.totalMarks}</span>
          <span>Lowest: {data.lowest}/{data.totalMarks}</span>
          <span>{data.passPercentage}% pass</span>
        </div>
      </motion.div>

      <Tabs defaultValue="overview" className="space-y-3">
        <TabsList className="w-full sm:w-auto h-auto p-1 grid grid-cols-3 sm:flex">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="leaderboard" className="text-xs sm:text-sm">Leaderboard</TabsTrigger>
          <TabsTrigger value="subjects" className="text-xs sm:text-sm">Subjects</TabsTrigger>
        </TabsList>

        {/* ── Overview Tab ── */}
        <TabsContent value="overview" className="space-y-3">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: "Students", value: data.totalStudents, icon: Users },
              { label: "Avg Score", value: `${data.classAverage}/${data.totalMarks}`, icon: BarChart3 },
              { label: "Pass Rate", value: `${data.passPercentage}%`, icon: TrendingUp },
              { label: "Subjects", value: data.subjects.length, icon: Medal },
            ].map((stat) => (
              <Card key={stat.label} className="border-0 shadow-sm">
                <CardContent className="p-3 flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <stat.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                    <p className="text-sm font-bold text-foreground">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Subject Score Cards */}
          <h3 className="text-sm font-semibold text-foreground pt-1">Subject-wise Performance</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {data.subjects.map((sub, i) => {
              const pct = Math.round((sub.classAverage / sub.totalMarks) * 100);
              const color = getPerformanceColor(pct);
              return (
                <motion.div
                  key={sub.subject}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className={cn("border-0 shadow-sm border-l-4", color.border)}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: `hsl(${sub.color})` }}
                          />
                          <h4 className="text-sm font-semibold text-foreground">{sub.subject}</h4>
                        </div>
                        <span className={cn("text-xs font-bold px-1.5 py-0.5 rounded-full", color.badge)}>
                          {pct}%
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                        <span>Avg: {sub.classAverage}/{sub.totalMarks}</span>
                        <span>High: {sub.highest}</span>
                        <span>Pass: {sub.passPercentage}%</span>
                      </div>
                      {/* Mini progress bar */}
                      <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all", color.bg)}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Top 3 Toppers */}
          <h3 className="text-sm font-semibold text-foreground pt-1">Top Performers</h3>
          <div className="space-y-1.5">
            {data.leaderboard.slice(0, 3).map((student, i) => {
              const medalColors = ["text-amber-500", "text-slate-400", "text-amber-700"];
              return (
                <Card key={student.rollNumber} className="border-0 shadow-sm">
                  <CardContent className="p-2.5 flex items-center gap-3">
                    <div className={cn("text-lg font-bold w-7 text-center", medalColors[i] || "text-muted-foreground")}>
                      #{student.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-foreground truncate">{student.name}</p>
                      <div className="flex gap-2 text-[10px] text-muted-foreground">
                        <span>{student.rollNumber}</span>
                        <span>·</span>
                        {student.subjectScores.map((ss) => (
                          <span key={ss.subject}>{ss.subject.slice(0, 3)}: {ss.score}</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-foreground">{student.percentage}%</p>
                      <p className="text-[10px] text-muted-foreground">{student.totalScore}/{student.totalMax}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* ── Leaderboard Tab ── */}
        <TabsContent value="leaderboard" className="space-y-2">
          <Card className="card-premium">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary" />
                Full Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {visibleLeaderboard.map((student) => {
                  const color = getPerformanceColor(student.percentage);
                  return (
                    <div
                      key={student.rollNumber}
                      className={cn("flex items-center gap-3 px-3 py-2.5 border-l-3", color.border)}
                    >
                      <span className="text-xs font-bold w-6 text-center text-muted-foreground">
                        {student.rank}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-foreground truncate">{student.name}</p>
                        <div className="flex gap-1.5 mt-0.5">
                          {student.subjectScores.map((ss) => {
                            const sPct = Math.round((ss.score / ss.max) * 100);
                            const sColor = getPerformanceColor(sPct);
                            return (
                              <span key={ss.subject} className={cn("text-[9px] px-1 py-0.5 rounded", sColor.badge)}>
                                {ss.subject.slice(0, 3)} {ss.score}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={cn("text-sm font-bold", color.text)}>{student.percentage}%</p>
                        <p className="text-[10px] text-muted-foreground">{student.totalScore}/{student.totalMax}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {hasMoreLeaderboard && (
                <div className="p-3 text-center border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-primary"
                    onClick={() => setLeaderboardLimit(prev => prev + LEADERBOARD_PAGE_SIZE)}
                  >
                    Show more ({data.leaderboard.length - leaderboardLimit} remaining)
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Subjects Tab ── */}
        <TabsContent value="subjects" className="space-y-3">
          {/* Subject selector chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
            {data.subjects.map((sub) => (
              <button
                key={sub.subject}
                onClick={() => setSelectedSubject(selectedSubject === sub.subject ? null : sub.subject)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0",
                  selectedSubject === sub.subject
                    ? "text-white shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
                style={
                  selectedSubject === sub.subject
                    ? { backgroundColor: `hsl(${sub.color})` }
                    : undefined
                }
              >
                {sub.subject}
              </button>
            ))}
          </div>

          {!selectedSubject && (
            <div className="text-center py-12">
              <BarChart3 className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Select a subject above to view detailed breakdown</p>
            </div>
          )}

          {selectedSubject && subjectDetail && (
            <motion.div
              key={selectedSubject}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              {/* Subject summary */}
              <Card
                className="border-0 shadow-sm border-l-4"
                style={{ borderLeftColor: `hsl(${subjectDetail.color})` }}
              >
                <CardContent className="p-3">
                  <h4 className="text-sm font-bold text-foreground mb-1">{subjectDetail.subject}</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Average</p>
                      <p className="font-bold text-foreground">{subjectDetail.classAverage}/{subjectDetail.totalMarks}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Highest</p>
                      <p className="font-bold text-foreground">{subjectDetail.highest}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Lowest</p>
                      <p className="font-bold text-foreground">{subjectDetail.lowest}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Pass Rate</p>
                      <p className="font-bold text-foreground">{subjectDetail.passPercentage}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Subject-wise student ranking */}
              <Card className="card-premium">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">
                    {selectedSubject} Rankings ({subjectStudents.length} students)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {subjectStudents.map((student, idx) => {
                      const score = student.subjectScore!.score;
                      const max = student.subjectScore!.max;
                      const pct = Math.round((score / max) * 100);
                      const color = getPerformanceColor(pct);
                      return (
                        <div key={student.rollNumber} className="flex items-center gap-3 px-3 py-2">
                          <span className="text-xs font-bold w-5 text-center text-muted-foreground">{idx + 1}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground truncate">{student.name}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                              <div className={cn("h-full rounded-full", color.bg)} style={{ width: `${pct}%` }} />
                            </div>
                            <span className={cn("text-xs font-bold min-w-[36px] text-right", color.text)}>
                              {score}/{max}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GrandTestResults;
