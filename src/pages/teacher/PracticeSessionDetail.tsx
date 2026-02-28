import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Users, CheckCircle2, Target, FileText, ArrowLeft, BookOpen } from "lucide-react";
import { getPracticeSessionDetail } from "@/data/teacher/practiceSessionDetailData";
import { StatCard, BandCard, StudentRow, QuestionCard, bandConfig } from "@/components/teacher/practice-detail";

export default function PracticeSessionDetail() {
  const { batchId, chapterId, sessionId } = useParams<{ batchId: string; chapterId: string; sessionId: string }>();
  const navigate = useNavigate();

  if (!batchId || !chapterId || !sessionId) return null;

  const detail = getPracticeSessionDetail(sessionId, chapterId, batchId);

  if (!detail) {
    return (
      <div className="p-4 md:p-6">
        <PageHeader
          title="Practice Session Not Found"
          breadcrumbs={[
            { label: "Reports", href: "/teacher/reports" },
            { label: "Back", href: `/teacher/reports/${batchId}/chapters/${chapterId}` },
          ]}
        />
        <Card className="card-premium">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">This practice session could not be found.</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { session, bandDetails, overallCompletion, overallAccuracy, totalStudents } = detail;
  const dateStr = new Date(session.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title={`Practice — ${dateStr}`}
        description={`${session.totalQuestions} questions across ${bandDetails.length} performance bands`}
        breadcrumbs={[
          { label: "Reports", href: "/teacher/reports" },
          { label: batchId.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()), href: `/teacher/reports/${batchId}` },
          { label: chapterId.replace(/^ch-/, "").replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()), href: `/teacher/reports/${batchId}/chapters/${chapterId}` },
          { label: "Practice Detail" },
        ]}
      />

      {/* Overview Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={<Users className="w-4 h-4" />} label="Total Students" value={String(totalStudents)} />
        <StatCard icon={<CheckCircle2 className="w-4 h-4" />} label="Completion" value={`${overallCompletion}%`} accent={overallCompletion >= 70} />
        <StatCard icon={<Target className="w-4 h-4" />} label="Avg Accuracy" value={`${overallAccuracy}%`} accent={overallAccuracy >= 60} />
        <StatCard icon={<BookOpen className="w-4 h-4" />} label="Questions" value={String(session.totalQuestions)} />
      </div>

      {/* Band Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {bandDetails.map((band) => (
          <BandCard key={band.key} band={band} />
        ))}
      </div>

      {/* Tabbed Detail */}
      <Tabs defaultValue="students" className="space-y-3">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="students" className="flex-1 sm:flex-initial gap-1.5">
            <Users className="w-3.5 h-3.5" /> Students
          </TabsTrigger>
          <TabsTrigger value="questions" className="flex-1 sm:flex-initial gap-1.5">
            <FileText className="w-3.5 h-3.5" /> Questions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <Accordion type="multiple" defaultValue={bandDetails.map(b => b.key)} className="space-y-2">
            {bandDetails.map((band) => (
              <AccordionItem key={band.key} value={band.key} className="border rounded-lg overflow-hidden">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span className={cn("w-2.5 h-2.5 rounded-full", bandConfig[band.key]?.color)} />
                    {band.label}
                    <Badge variant="secondary" className="text-xs font-normal ml-1">
                      {band.completedCount}/{band.studentsAssigned} completed
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-0 pb-0">
                  <div className="divide-y">
                    {band.students.map((s) => (
                      <StudentRow key={s.id} student={s} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="questions">
          <Accordion type="multiple" defaultValue={bandDetails.map(b => b.key)} className="space-y-2">
            {bandDetails.map((band) => (
              <AccordionItem key={band.key} value={band.key} className="border rounded-lg overflow-hidden">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span className={cn("w-2.5 h-2.5 rounded-full", bandConfig[band.key]?.color)} />
                    {band.label}
                    <Badge variant="secondary" className="text-xs font-normal ml-1">
                      {band.questionCount} questions
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-3 pt-0 space-y-2">
                  {band.questions.map((q, idx) => (
                    <QuestionCard key={q.id} question={q} index={idx + 1} bandKey={band.key} />
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  );
}
