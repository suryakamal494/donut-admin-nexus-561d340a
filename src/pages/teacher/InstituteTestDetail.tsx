import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Award, Clock, Target, BookOpen, BarChart3, ChevronDown, ChevronUp, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { InfoTooltip } from "@/components/timetable/InfoTooltip";
import { currentTeacher } from "@/data/teacher/profile";
import { batchInfoMap } from "@/data/teacher/examResults";
import { getInstituteTestDetail } from "@/data/teacher/instituteTestDetailData";
import type { InstituteQuestionAnalysis } from "@/data/teacher/instituteTestDetailData";

const patternConfig: Record<string, { label: string; bg: string; text: string }> = {
  jee_main: { label: "JEE Main", bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400" },
  jee_advanced: { label: "JEE Advanced", bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400" },
  neet: { label: "NEET", bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400" },
};

const difficultyColors: Record<string, string> = {
  easy: "text-emerald-600 dark:text-emerald-400",
  medium: "text-amber-600 dark:text-amber-400",
  hard: "text-red-600 dark:text-red-400",
};

const statusBadge = (status: "strong" | "moderate" | "weak") => {
  const styles = {
    strong: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    moderate: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    weak: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  return <Badge variant="secondary" className={cn("text-[10px] px-1.5 py-0 font-medium", styles[status])}>{status}</Badge>;
};

const typeLabels: Record<string, string> = {
  mcq_single: "MCQ (Single)",
  mcq_multiple: "MCQ (Multiple)",
  integer: "Integer",
  assertion_reasoning: "Assertion-Reasoning",
};

const InstituteTestDetail = () => {
  const { batchId, testId } = useParams<{ batchId: string; testId: string }>();
  const navigate = useNavigate();
  const subject = currentTeacher.subjects[0] || "Physics";

  const detail = useMemo(() => (testId ? getInstituteTestDetail(testId, subject) : null), [testId, subject]);
  const batchInfo = batchId ? batchInfoMap[batchId] : null;

  const [activeTab, setActiveTab] = useState("questions");
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());

  // Group questions by chapter for chapter tab
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

      {/* Pattern + date badge row */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="secondary" className={cn("text-xs font-semibold", ps.bg, ps.text)}>{ps.label}</Badge>
        <Badge variant="secondary" className="text-xs bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">{subject}</Badge>
        <span className="text-xs text-muted-foreground">{format(new Date(detail.date), "dd MMM yyyy")}</span>
        <Badge variant="secondary" className="text-xs ml-auto">{detail.passPercentage}% pass</Badge>
      </div>

      {/* Tabs */}
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

        {/* ── Questions Tab ── */}
        <TabsContent value="questions" className="space-y-2">
          {detail.questions.map((q, i) => (
            <motion.div
              key={q.questionId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.02 }}
            >
              <Card className="card-premium">
                <CardContent className="p-3 sm:p-3.5">
                  <div className="flex items-start gap-3">
                    {/* Q number circle */}
                    <div className={cn(
                      "shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white",
                      q.status === "strong" ? "bg-emerald-500" :
                      q.status === "moderate" ? "bg-amber-500" : "bg-red-500"
                    )}>
                      Q{q.questionNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-semibold text-foreground">{q.chapter}</span>
                        <span className="text-[10px] text-muted-foreground">· {q.topic}</span>
                        {statusBadge(q.status)}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap">
                        <span className={difficultyColors[q.difficulty]}>{q.difficulty}</span>
                        <span>{typeLabels[q.type]}</span>
                        <span>+{q.marks}/−{q.negativeMarks}</span>
                      </div>
                      {/* Metrics bar */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                        <div>
                          <div className="flex items-center justify-between text-[10px] mb-0.5">
                            <span className="text-muted-foreground">Correct</span>
                            <span className="font-semibold">{q.correctPercentage}%</span>
                          </div>
                          <Progress value={q.correctPercentage} className="h-1.5" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-[10px] mb-0.5">
                            <span className="text-muted-foreground">Attempted</span>
                            <span className="font-semibold">{q.attemptPercentage}%</span>
                          </div>
                          <Progress value={q.attemptPercentage} className="h-1.5" />
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground col-span-2 sm:col-span-1 mt-1 sm:mt-0">
                          <Clock className="w-3 h-3" />
                          <span className="font-medium">{Math.round(q.avgTimeSpent / 60)}m {q.avgTimeSpent % 60}s</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        {/* ── Chapters Tab ── */}
        <TabsContent value="chapters" className="space-y-3">
          {detail.chapterSummary.map((ch, i) => {
            const isOpen = expandedChapters.has(ch.chapter);
            const chQuestions = questionsByChapter.get(ch.chapter) || [];
            const chStatus = ch.avgCorrectRate >= 60 ? "strong" : ch.avgCorrectRate >= 35 ? "moderate" : "weak";
            return (
              <motion.div
                key={ch.chapter}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
              >
                <Card className="card-premium overflow-hidden">
                  <button
                    className="w-full p-3.5 sm:p-4 flex items-center gap-3 text-left"
                    onClick={() => toggleChapter(ch.chapter)}
                  >
                    <div className={cn(
                      "shrink-0 w-11 h-11 rounded-xl flex flex-col items-center justify-center text-white font-bold text-sm",
                      chStatus === "strong" ? "bg-emerald-500" :
                      chStatus === "moderate" ? "bg-amber-500" : "bg-red-500"
                    )}>
                      {ch.avgCorrectRate}%
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-foreground truncate">{ch.chapter}</h3>
                        {statusBadge(chStatus)}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {ch.totalQuestions} Q · {ch.strongCount} strong · {ch.weakCount} weak
                      </div>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3.5 pb-3.5 space-y-2 border-t border-border/50 pt-2">
                          {chQuestions.map(q => (
                            <div key={q.questionId} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                              <div className={cn(
                                "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0",
                                q.status === "strong" ? "bg-emerald-500" :
                                q.status === "moderate" ? "bg-amber-500" : "bg-red-500"
                              )}>
                                {q.questionNumber}
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-xs text-foreground">{q.topic}</span>
                                <div className="text-[10px] text-muted-foreground">
                                  <span className={difficultyColors[q.difficulty]}>{q.difficulty}</span> · {q.correctPercentage}% correct · {q.attemptPercentage}% attempted
                                </div>
                              </div>
                              {statusBadge(q.status)}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </TabsContent>

        {/* ── Difficulty Tab ── */}
        <TabsContent value="difficulty" className="space-y-3">
          {detail.difficultySummary.map((d, i) => (
            <motion.div
              key={d.difficulty}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
            >
              <Card className="card-premium">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={cn("text-sm font-semibold capitalize", difficultyColors[d.difficulty])}>
                        {d.difficulty}
                      </span>
                      <Badge variant="secondary" className="text-[10px]">{d.totalQuestions} Q</Badge>
                    </div>
                    <span className="text-sm font-bold text-foreground">{d.avgCorrectRate}%</span>
                  </div>
                  <Progress value={d.avgCorrectRate} className="h-2" />
                  <p className="text-[10px] text-muted-foreground mt-1.5">
                    Average correct rate across {d.totalQuestions} {d.difficulty} questions
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Difficulty distribution summary */}
          <Card className="card-premium">
            <CardContent className="p-4">
              <h4 className="text-xs font-semibold text-foreground mb-3">Distribution</h4>
              <div className="flex gap-1 h-6 rounded-lg overflow-hidden">
                {detail.difficultySummary.map(d => {
                  const pct = detail.totalQuestions > 0 ? (d.totalQuestions / detail.totalQuestions) * 100 : 0;
                  const bg = d.difficulty === "easy" ? "bg-emerald-500" : d.difficulty === "medium" ? "bg-amber-500" : "bg-red-500";
                  return (
                    <div
                      key={d.difficulty}
                      className={cn("flex items-center justify-center text-[9px] text-white font-bold", bg)}
                      style={{ width: `${pct}%` }}
                    >
                      {d.totalQuestions > 0 && `${Math.round(pct)}%`}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 mt-2">
                {detail.difficultySummary.map(d => (
                  <div key={d.difficulty} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      d.difficulty === "easy" ? "bg-emerald-500" : d.difficulty === "medium" ? "bg-amber-500" : "bg-red-500"
                    )} />
                    <span className="capitalize">{d.difficulty}: {d.totalQuestions}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InstituteTestDetail;
