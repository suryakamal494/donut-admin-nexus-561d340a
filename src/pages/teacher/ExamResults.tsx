import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft,
  BarChart3,
  Download,
  Share2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/ui/page-header";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { teacherExams } from "@/data/teacher/exams";
import {
  getExamAnalytics,
  generateExamAnalytics,
  computePerformanceBands,
  computeTopicFlags,
  generateVerdictSummary,
  type ExamAnalytics,
} from "@/data/teacher/examResults";
import {
  VerdictBanner,
  PerformanceBands,
  TopicFlags,
  InsightCards,
  QuestionAnalysisCard,
  StudentResultRow,
} from "@/components/teacher/exams/results";

const PIE_COLORS = ["#22c55e", "#f59e0b", "#ef4444", "#6b7280"];

const ExamResults = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();

  const exam = useMemo(() => teacherExams.find(e => e.id === examId), [examId]);

  const analytics: ExamAnalytics | null = useMemo(() => {
    if (!exam) return null;
    const existing = getExamAnalytics(exam.id);
    if (existing) return existing;
    return generateExamAnalytics(exam.id, exam.name, exam.totalMarks);
  }, [exam]);

  // Derived insight data
  const bands = useMemo(
    () => (analytics ? computePerformanceBands(analytics.allStudents) : []),
    [analytics]
  );
  const topicFlags = useMemo(
    () => (analytics ? computeTopicFlags(analytics.questionAnalysis) : []),
    [analytics]
  );
  const verdict = useMemo(
    () => (analytics ? generateVerdictSummary(analytics, bands, topicFlags) : null),
    [analytics, bands, topicFlags]
  );

  if (!exam || !analytics || !verdict) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-4">
        <BarChart3 className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Exam Not Found</h2>
        <p className="text-muted-foreground mb-4">The exam you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/teacher/exams")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Exams
        </Button>
      </div>
    );
  }

  // Chart data
  const scoreDistributionData = analytics.scoreDistribution.map((d, i) => ({
    ...d,
    fill: PIE_COLORS[i % PIE_COLORS.length],
  }));

  const questionSuccessData = analytics.questionAnalysis.map(q => ({
    name: `Q${q.questionNumber}`,
    successRate: q.successRate,
    avgTime: q.averageTime,
    difficulty: q.difficulty,
  }));

  const attemptDistribution = [
    { name: "Correct", value: analytics.questionAnalysis.reduce((s, q) => s + q.correctAttempts, 0), color: "#22c55e" },
    { name: "Incorrect", value: analytics.questionAnalysis.reduce((s, q) => s + q.incorrectAttempts, 0), color: "#ef4444" },
    { name: "Unattempted", value: analytics.questionAnalysis.reduce((s, q) => s + q.unattempted, 0), color: "#6b7280" },
  ];

  return (
    <div className="space-y-4 sm:space-y-5 max-w-7xl mx-auto pb-20 md:pb-6">
      <PageHeader
        title="Exam Results"
        description={exam.name}
        breadcrumbs={[
          { label: "Teacher", href: "/teacher" },
          { label: "Exams", href: "/teacher/exams" },
          { label: "Results" },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9">
              <Download className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <Share2 className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
        }
      />

      {/* Tabs */}
      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList className="w-full sm:w-auto h-auto p-1 grid grid-cols-4 sm:flex">
          <TabsTrigger value="insights" className="text-xs sm:text-sm">Insights</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
          <TabsTrigger value="questions" className="text-xs sm:text-sm">Questions</TabsTrigger>
          <TabsTrigger value="students" className="text-xs sm:text-sm">Students</TabsTrigger>
        </TabsList>

        {/* ── Insights Tab (default) ── */}
        <TabsContent value="insights" className="space-y-5">
          <VerdictBanner examName={exam.name} verdict={verdict} />
          <PerformanceBands bands={bands} />
          <TopicFlags flags={topicFlags} />
          <InsightCards questions={analytics.questionAnalysis} />
        </TabsContent>

        {/* ── Analytics Tab ── */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Score Distribution */}
            <Card className="card-premium">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Score Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] sm:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scoreDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                      <XAxis dataKey="range" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {scoreDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-3 mt-4 justify-center">
                  {scoreDistributionData.map((d, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: d.fill }} />
                      <span className="text-muted-foreground">{d.range}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Attempt Pie */}
            <Card className="card-premium">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Overall Attempt Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] sm:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={attemptDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                        {attemptDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-2">
                  {attemptDistribution.map((d, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-xs text-muted-foreground">{d.name}</span>
                      <span className="text-xs font-medium">{d.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Questions Tab ── */}
        <TabsContent value="questions" className="space-y-4">
          <Card className="card-premium">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Question-wise Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] sm:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={questionSuccessData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                      formatter={(value: number) => [`${value}%`, 'Success Rate']}
                    />
                    <Area type="monotone" dataKey="successRate" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {analytics.questionAnalysis.map((q) => (
              <QuestionAnalysisCard key={q.questionId} question={q} />
            ))}
          </div>
        </TabsContent>

        {/* ── Students Tab ── */}
        <TabsContent value="students" className="space-y-4">
          <Card className="card-premium">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">All Students</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {analytics.allStudents.map((student) => (
                  <StudentResultRow key={student.id} student={student} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExamResults;
