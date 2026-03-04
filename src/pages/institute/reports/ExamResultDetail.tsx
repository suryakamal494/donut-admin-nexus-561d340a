import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/ui/page-header";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { getInstituteExams } from "@/data/institute/reportsData";
import {
  generateExamAnalyticsForBatch,
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
  StudentResultRow,
} from "@/components/teacher/exams/results";
import { DifficultyChart } from "@/components/teacher/exams/results/DifficultyChart";
import { CognitiveChart } from "@/components/teacher/exams/results/CognitiveChart";
import { QuestionGroupAccordion } from "@/components/teacher/exams/results/QuestionGroupAccordion";
import { InfoTooltip } from "@/components/timetable/InfoTooltip";

const PIE_COLORS = ["#22c55e", "#f59e0b", "#ef4444", "#6b7280"];

const ExamResultDetail = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();

  // Find the exam entry from institute data
  const examEntry = useMemo(
    () => getInstituteExams().find(e => e.examId === examId),
    [examId]
  );

  // Generate analytics using the teacher module's generator
  const analytics: ExamAnalytics | null = useMemo(() => {
    if (!examEntry) return null;
    return generateExamAnalyticsForBatch(
      examEntry.examId,
      examEntry.examName,
      examEntry.totalMarks,
      examEntry.batchId
    );
  }, [examEntry]);

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

  if (!examEntry || !analytics || !verdict) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-4">
        <BarChart3 className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Exam Not Found</h2>
        <p className="text-muted-foreground mb-4">The exam you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/institute/reports/exams")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Exam Reports
        </Button>
      </div>
    );
  }

  const scoreDistributionData = analytics.scoreDistribution.map((d, i) => ({
    ...d,
    fill: PIE_COLORS[i % PIE_COLORS.length],
  }));

  return (
    <div className="space-y-3 max-w-7xl mx-auto pb-6">
      <PageHeader
        title={examEntry.examName}
        description={`${examEntry.batchName} · ${examEntry.subject} · ${new Date(examEntry.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`}
        breadcrumbs={[
          { label: "Institute", href: "/institute" },
          { label: "Reports", href: "/institute/reports" },
          { label: "Exams", href: "/institute/reports/exams" },
          { label: examEntry.examName },
        ]}
      />

      <Tabs defaultValue="insights" className="space-y-3">
        <TabsList className="w-full sm:w-auto h-auto p-1 grid grid-cols-2 sm:grid-cols-4 sm:flex">
          <TabsTrigger value="insights" className="text-xs sm:text-sm">Insights</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
          <TabsTrigger value="questions" className="text-xs sm:text-sm">Questions</TabsTrigger>
          <TabsTrigger value="students" className="text-xs sm:text-sm">Students</TabsTrigger>
        </TabsList>

        {/* Insights Tab — read-only, no homework actions */}
        <TabsContent value="insights" className="space-y-5">
          <VerdictBanner examName={examEntry.examName} verdict={verdict} batchName={examEntry.batchName} />
          <PerformanceBands bands={bands} />
          <TopicFlags flags={topicFlags} />
          <InsightCards questions={analytics.questionAnalysis} />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="card-premium">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Score Distribution
                  <InfoTooltip content="Shows how student scores are distributed across mark ranges." />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] sm:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scoreDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                      <XAxis dataKey="range" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
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
            <DifficultyChart questions={analytics.questionAnalysis} />
          </div>
          <CognitiveChart questions={analytics.questionAnalysis} />
        </TabsContent>

        {/* Questions Tab */}
        <TabsContent value="questions" className="space-y-4">
          <QuestionGroupAccordion questions={analytics.questionAnalysis} />
        </TabsContent>

        {/* Students Tab */}
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

export default ExamResultDetail;
