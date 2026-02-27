import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Target, BookOpen, BarChart3, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { InfoTooltip } from "@/components/timetable/InfoTooltip";
import { currentTeacher } from "@/data/teacher/profile";
import { batchInfoMap } from "@/data/teacher/examResults";
import { getInstituteTestDetail } from "@/data/teacher/instituteTestDetailData";
import type { InstituteQuestionAnalysis } from "@/data/teacher/instituteTestDetailData";
import {
  InstituteQuestionsTab, InstituteChaptersTab, InstituteDifficultyTab,
} from "@/components/teacher/reports";

const patternConfig: Record<string, { label: string; bg: string; text: string }> = {
  jee_main: { label: "JEE Main", bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400" },
  jee_advanced: { label: "JEE Advanced", bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400" },
  neet: { label: "NEET", bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400" },
};

const InstituteTestDetail = () => {
  const { batchId, testId } = useParams<{ batchId: string; testId: string }>();
  const navigate = useNavigate();
  const subject = currentTeacher.subjects[0] || "Physics";

  const detail = useMemo(() => (testId ? getInstituteTestDetail(testId, subject) : null), [testId, subject]);
  const batchInfo = batchId ? batchInfoMap[batchId] : null;

  const [activeTab, setActiveTab] = useState("questions");
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());

  const questionsByChapter = useMemo(() => {
    if (!detail) return new Map<string, InstituteQuestionAnalysis[]>();
    const map = new Map<string, InstituteQuestionAnalysis[]>();
    detail.questions.forEach(q => {
      const arr = map.get(q.chapter) || [];
      arr.push(q);
      map.set(q.chapter, arr);
    });
    return map;
  }, [detail]);

  if (!detail || !batchId) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-4">
        <GraduationCap className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Test Not Found</h2>
        <p className="text-sm text-muted-foreground mb-4">This institute test could not be loaded.</p>
        <Button onClick={() => navigate(batchId ? `/teacher/reports/${batchId}` : "/teacher/reports")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  const ps = patternConfig[detail.pattern] || patternConfig.jee_main;

  const toggleChapter = (ch: string) => {
    setExpandedChapters(prev => {
      const next = new Set(prev);
      next.has(ch) ? next.delete(ch) : next.add(ch);
      return next;
    });
  };

  return (
    <div className="space-y-4 sm:space-y-5 max-w-7xl mx-auto pb-20 md:pb-6">
      <PageHeader
        title={`${subject} Analysis`}
        description={detail.examName}
        breadcrumbs={[
          { label: "Teacher", href: "/teacher" },
          { label: "Reports", href: "/teacher/reports" },
          { label: batchInfo?.name || batchId, href: `/teacher/reports/${batchId}` },
          { label: `${subject} — ${ps.label}` },
        ]}
      />

      {/* Summary Cards */}
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Summary</h3>
        <InfoTooltip content="Key metrics for your subject in this institute test — average score, highest score, total questions, and participant count." />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-l-4 border-l-violet-500">
          <CardContent className="p-3 text-center">
            <p className="text-lg font-bold text-violet-700 dark:text-violet-400">{detail.subjectAvgScore}/{detail.subjectMaxMarks}</p>
            <p className="text-[10px] text-muted-foreground">Avg Score</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-violet-500">
          <CardContent className="p-3 text-center">
            <p className="text-lg font-bold text-violet-700 dark:text-violet-400">{detail.subjectHighest}/{detail.subjectMaxMarks}</p>
            <p className="text-[10px] text-muted-foreground">Highest</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-lg font-bold text-foreground">{detail.totalQuestions}</p>
            <p className="text-[10px] text-muted-foreground">Questions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-lg font-bold text-foreground">{detail.participantCount.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">Participants</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="secondary" className={cn("text-xs font-semibold", ps.bg, ps.text)}>{ps.label}</Badge>
        <Badge variant="secondary" className="text-xs bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">{subject}</Badge>
        <span className="text-xs text-muted-foreground">{format(new Date(detail.date), "dd MMM yyyy")}</span>
        <Badge variant="secondary" className="text-xs ml-auto">{detail.passPercentage}% pass</Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full sm:w-auto h-auto p-1 grid grid-cols-3 sm:flex max-w-md">
          <TabsTrigger value="questions" className="text-xs sm:text-sm gap-1.5">
            <Target className="w-3.5 h-3.5" />
            Questions
            <InfoTooltip content="Per-question analysis — correct %, attempt %, average time, and difficulty for every question in your subject." />
          </TabsTrigger>
          <TabsTrigger value="chapters" className="text-xs sm:text-sm gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            Chapters
            <InfoTooltip content="Chapter-wise breakdown — average correct rate and performance status for each chapter covered in this test." />
          </TabsTrigger>
          <TabsTrigger value="difficulty" className="text-xs sm:text-sm gap-1.5">
            <BarChart3 className="w-3.5 h-3.5" />
            Difficulty
            <InfoTooltip content="Performance split by difficulty level — see how students performed on easy, medium, and hard questions." />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="questions">
          <InstituteQuestionsTab questions={detail.questions} />
        </TabsContent>

        <TabsContent value="chapters">
          <InstituteChaptersTab
            chapterSummary={detail.chapterSummary}
            questionsByChapter={questionsByChapter}
            expandedChapters={expandedChapters}
            onToggleChapter={toggleChapter}
          />
        </TabsContent>

        <TabsContent value="difficulty">
          <InstituteDifficultyTab
            difficultySummary={detail.difficultySummary}
            totalQuestions={detail.totalQuestions}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InstituteTestDetail;
