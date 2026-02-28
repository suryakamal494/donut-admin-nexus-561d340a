import { useState, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, BarChart3, Download, Share2, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/ui/page-header";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { teacherExams } from "@/data/teacher/exams";
import {
  getExamAnalyticsForBatch,
  generateExamAnalyticsForBatch,
  computePerformanceBands,
  computeTopicFlags,
  generateVerdictSummary,
  generateMockActionableInsights,
  batchInfoMap,
  type ExamAnalytics,
  type ActionableInsight,
} from "@/data/teacher/examResults";
import {
  VerdictBanner,
  PerformanceBands,
  TopicFlags,
  InsightCards,
  StudentResultRow,
  ActionableInsightCards,
} from "@/components/teacher/exams/results";
import { BatchSelector } from "@/components/teacher/exams/results/BatchSelector";
import { DifficultyChart } from "@/components/teacher/exams/results/DifficultyChart";
import { CognitiveChart } from "@/components/teacher/exams/results/CognitiveChart";
import { AIAnalysisCard } from "@/components/teacher/exams/results/AIAnalysisCard";
import { QuestionGroupAccordion } from "@/components/teacher/exams/results/QuestionGroupAccordion";
import { InfoTooltip } from "@/components/timetable/InfoTooltip";
import { CreateHomeworkDialog } from "@/components/teacher/CreateHomeworkDialog";

const PIE_COLORS = ["#22c55e", "#f59e0b", "#ef4444", "#6b7280"];

const ExamResults = () => {
  const { examId, batchId: batchIdFromUrl } = useParams<{ examId: string; batchId?: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const exam = useMemo(() => teacherExams.find(e => e.id === examId), [examId]);

  const batchFromUrl = batchIdFromUrl;
  const returnTo = searchParams.get("returnTo");
  const [selectedBatchId, setSelectedBatchId] = useState<string>(
    (batchFromUrl && exam?.batchIds.includes(batchFromUrl) ? batchFromUrl : exam?.batchIds[0]) || ""
  );
  const [homeworkDialogOpen, setHomeworkDialogOpen] = useState(false);

  const analytics: ExamAnalytics | null = useMemo(() => {
    if (!exam) return null;
    const batchId = selectedBatchId || exam.batchIds[0];
    const existing = getExamAnalyticsForBatch(exam.id, batchId);
    if (existing) return existing;
    return generateExamAnalyticsForBatch(exam.id, exam.name, exam.totalMarks, batchId);
  }, [exam, selectedBatchId]);

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
  const actionableInsights = useMemo(
    () => (analytics ? generateMockActionableInsights(analytics, bands, topicFlags) : []),
    [analytics, bands, topicFlags]
  );

  const handleInsightAction = (insight: ActionableInsight) => {
    // Pre-fill homework dialog with the insight's context
    setHomeworkDialogOpen(true);
  };

  if (!exam || !analytics || !verdict) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-4">
        <BarChart3 className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Exam Not Found</h2>
        <p className="text-muted-foreground mb-4">The exam you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/teacher/reports")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Reports
        </Button>
      </div>
    );
  }

  const selectedBatchName = batchInfoMap[selectedBatchId]
    ? `${batchInfoMap[selectedBatchId].className} - ${batchInfoMap[selectedBatchId].name}`
    : undefined;

  const scoreDistributionData = analytics.scoreDistribution.map((d, i) => ({
    ...d,
    fill: PIE_COLORS[i % PIE_COLORS.length],
  }));

  return (
    <div className="space-y-3 max-w-7xl mx-auto pb-20 md:pb-6">
      <PageHeader
        title="Exam Results"
        description={exam.name}
        breadcrumbs={[
          { label: "Teacher", href: "/teacher" },
          { label: "Reports", href: "/teacher/reports" },
          { label: selectedBatchName || "Batch", href: `/teacher/reports/${selectedBatchId}` },
          ...(returnTo ? [{ label: "Chapter", href: returnTo }] : []),
          { label: "Results" },
        ]}
        actions={
          <div className="flex gap-2">
            <Button
              size="sm"
              className="h-9 gradient-button"
              onClick={() => setHomeworkDialogOpen(true)}
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Generate Homework</span>
            </Button>
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

      <BatchSelector
        batchIds={exam.batchIds}
        selectedBatchId={selectedBatchId}
        onSelect={setSelectedBatchId}
      />

      <Tabs defaultValue="insights" className="space-y-3">
        <TabsList className="w-full sm:w-auto h-auto p-1 grid grid-cols-4 sm:flex">
          <TabsTrigger value="insights" className="text-xs sm:text-sm">Insights</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
          <TabsTrigger value="questions" className="text-xs sm:text-sm">Questions</TabsTrigger>
          <TabsTrigger value="students" className="text-xs sm:text-sm">Students</TabsTrigger>
        </TabsList>

        {/* ── Insights Tab ── */}
        <TabsContent value="insights" className="space-y-5">
          <VerdictBanner examName={exam.name} verdict={verdict} batchName={selectedBatchName} />
          <ActionableInsightCards insights={actionableInsights} onTakeAction={handleInsightAction} />
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
                  <InfoTooltip content="Shows how student scores are distributed across mark ranges. Taller bars indicate more students scored in that range." />
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

            {/* Difficulty-wise Performance — NEW */}
            <DifficultyChart questions={analytics.questionAnalysis} />
          </div>

          {/* Cognitive Type Performance */}
          <CognitiveChart questions={analytics.questionAnalysis} />

          {/* AI Deep-Dive Analysis — moved below charts */}
          <AIAnalysisCard analytics={analytics} examName={exam.name} />

        </TabsContent>

        {/* ── Questions Tab — Grouped Accordion ── */}
        <TabsContent value="questions" className="space-y-4">
          <QuestionGroupAccordion questions={analytics.questionAnalysis} />
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

      <CreateHomeworkDialog
        open={homeworkDialogOpen}
        onOpenChange={setHomeworkDialogOpen}
        context={{
          subject: exam.subjects?.[0],
          batchId: selectedBatchId,
          batchName: selectedBatchName,
          chapter: exam.name,
          topic: topicFlags.filter(f => f.status === 'weak').map(f => f.topic).join(', ') || undefined,
        }}
      />
    </div>
  );
};

export default ExamResults;
