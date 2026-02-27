import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Users, CheckCircle2, Clock, Target, BarChart3, FileText,
  ArrowLeft, BookOpen, CircleCheck, CircleX, Timer
} from "lucide-react";
import { getPracticeSessionDetail } from "@/data/teacher/practiceSessionDetailData";
import type { BandDetail, StudentResult, QuestionResult } from "@/data/teacher/practiceSessionDetailData";

const bandConfig: Record<string, { color: string; bg: string; border: string; text: string }> = {
  mastery: { color: "bg-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-700 dark:text-emerald-400" },
  stable: { color: "bg-teal-500", bg: "bg-teal-500/10", border: "border-teal-500/30", text: "text-teal-700 dark:text-teal-400" },
  reinforcement: { color: "bg-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-700 dark:text-amber-400" },
  risk: { color: "bg-red-500", bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-700 dark:text-red-400" },
};

const accuracyColor = (pct: number) =>
  pct >= 75 ? "text-emerald-600 dark:text-emerald-400" :
  pct >= 50 ? "text-teal-600 dark:text-teal-400" :
  pct >= 35 ? "text-amber-600 dark:text-amber-400" :
  "text-red-600 dark:text-red-400";

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
          <div className="space-y-3">
            {bandDetails.map((band) => (
              <Card key={band.key} className="overflow-hidden">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <span className={cn("w-2.5 h-2.5 rounded-full", bandConfig[band.key]?.color)} />
                    {band.label}
                    <span className="text-xs font-normal text-muted-foreground">({band.questionCount} questions)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {band.questions.map((q, idx) => (
                      <QuestionRow key={q.id} question={q} index={idx + 1} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ── Sub-components ── */

function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) {
  return (
    <Card className="card-premium">
      <CardContent className="p-3 md:p-4 flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">{icon}{label}</div>
        <span className={cn("text-lg md:text-xl font-bold", accent ? "text-emerald-600 dark:text-emerald-400" : "text-foreground")}>{value}</span>
      </CardContent>
    </Card>
  );
}

function BandCard({ band }: { band: BandDetail }) {
  const cfg = bandConfig[band.key] || bandConfig.risk;
  const completionPct = band.studentsAssigned > 0 ? Math.round((band.completedCount / band.studentsAssigned) * 100) : 0;

  return (
    <Card className={cn("border", cfg.border)}>
      <CardContent className={cn("p-4 space-y-3", cfg.bg)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={cn("w-3 h-3 rounded-full", cfg.color)} />
            <span className={cn("text-sm font-semibold", cfg.text)}>{band.label}</span>
          </div>
          <Badge variant="outline" className="text-xs">{band.questionCount} Q</Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">Students</span>
            <p className="font-semibold text-foreground">{band.completedCount}/{band.studentsAssigned}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Avg Accuracy</span>
            <p className={cn("font-semibold", accuracyColor(band.avgAccuracy))}>{band.avgAccuracy}%</p>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Completion</span>
            <span>{completionPct}%</span>
          </div>
          <Progress value={completionPct} className="h-1.5" />
        </div>
      </CardContent>
    </Card>
  );
}

function StudentRow({ student }: { student: StudentResult }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      {student.completed ? (
        <CircleCheck className="w-4 h-4 text-emerald-500 shrink-0" />
      ) : (
        <CircleX className="w-4 h-4 text-muted-foreground/50 shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{student.name}</p>
        <p className="text-xs text-muted-foreground">{student.rollNumber}</p>
      </div>
      {student.completed ? (
        <>
          <div className="text-right shrink-0">
            <p className="text-sm font-semibold">{student.score}/{student.maxScore}</p>
            <p className={cn("text-xs font-medium", accuracyColor(student.accuracy))}>{student.accuracy}%</p>
          </div>
          <div className="text-xs text-muted-foreground shrink-0 hidden sm:flex items-center gap-0.5">
            <Timer className="w-3 h-3" /> {student.timeTaken}m
          </div>
        </>
      ) : (
        <Badge variant="outline" className="text-xs text-muted-foreground">Pending</Badge>
      )}
    </div>
  );
}

function QuestionRow({ question, index }: { question: QuestionResult; index: number }) {
  return (
    <div className="px-4 py-3 space-y-1.5">
      <div className="flex items-start gap-2">
        <span className="text-xs text-muted-foreground font-mono shrink-0 mt-0.5">Q{index}</span>
        <p className="text-sm text-foreground line-clamp-2 flex-1">{question.text}</p>
      </div>
      <div className="flex items-center gap-2 flex-wrap pl-6">
        <Badge variant="outline" className="text-xs">{question.topic}</Badge>
        <Badge variant="secondary" className="text-xs">{question.difficulty}</Badge>
        <span className={cn("text-xs font-medium ml-auto", accuracyColor(question.successRate))}>
          {question.successRate}% success ({question.correctAttempts}/{question.totalAttempts})
        </span>
      </div>
    </div>
  );
}
