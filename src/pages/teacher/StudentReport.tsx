import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, TrendingUp, TrendingDown, Minus, Sparkles, BookOpen, Target,
  ChevronDown, ChevronUp, BarChart3, AlertTriangle, CheckCircle, Clock, Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { InfoTooltip } from "@/components/timetable/InfoTooltip";
import { cn } from "@/lib/utils";
import { getPerformanceColor, getStatusColor } from "@/lib/reportColors";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { batchInfoMap } from "@/data/teacher/examResults";
import { getStudentBatchProfile } from "@/data/teacher/studentReportData";
import type { ChapterMastery, DifficultyBreakdown, TopicDetail } from "@/data/teacher/studentReportData";
import { AIHomeworkGeneratorDialog } from "@/components/teacher/AIHomeworkGeneratorDialog";
import type { AIHomeworkPrefill } from "@/components/teacher/AIHomeworkGeneratorDialog";
import { currentTeacher } from "@/data/teacher/profile";

// ── Helpers ──

const EXAM_HISTORY_INITIAL = 10;

const TrendIcon = ({ trend }: { trend: "up" | "down" | "flat" }) => {
  if (trend === "up") return <TrendingUp className="w-4 h-4 text-emerald-500" />;
  if (trend === "down") return <TrendingDown className="w-4 h-4 text-red-500" />;
  return <Minus className="w-4 h-4 text-muted-foreground" />;
};

const tagLabels: Record<string, string> = {
  improving: "Improving",
  declining: "Declining",
  plateaued: "Plateaued",
  inconsistent: "Inconsistent",
  "speed-issue": "Speed Issue",
  "low-attempt": "Low Attempt",
};

const StudentReport = () => {
  const { batchId, studentId } = useParams<{ batchId: string; studentId: string }>();
  const navigate = useNavigate();
  const [showDifficulty, setShowDifficulty] = useState(false);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [showAllExams, setShowAllExams] = useState(false);

  const batchInfo = batchId ? batchInfoMap[batchId] : null;

  const profile = useMemo(() => {
    if (!studentId || !batchId) return null;
    return getStudentBatchProfile(studentId, batchId);
  }, [studentId, batchId]);

  if (!profile || !batchInfo) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-4">
        <AlertTriangle className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Student Not Found</h2>
        <Button onClick={() => navigate(batchId ? `/teacher/reports/${batchId}` : "/teacher/reports")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
      </div>
    );
  }

  const hwPrefill: AIHomeworkPrefill = {
    subject: currentTeacher.subjects[0] || "Physics",
    batchId: batchId!,
    instructions: profile.weakTopicNames.length > 0
      ? `Focus on [${profile.weakTopicNames.join(", ")}] at ${profile.suggestedDifficulty} difficulty for remediation. Student: ${profile.studentName}`
      : `Targeted practice for ${profile.studentName}`,
    contextBanner: `Student: ${profile.studentName} — Weak areas identified`,
  };

  return (
    <div className="space-y-4 sm:space-y-5 max-w-7xl mx-auto pb-20 md:pb-6">
      <PageHeader
        title={profile.studentName}
        description={`Performance across ${currentTeacher.subjects[0] || "all subjects"}`}
        breadcrumbs={[
          { label: "Reports", href: "/teacher/reports" },
          { label: batchInfo.name, href: `/teacher/reports/${batchId}` },
          { label: profile.studentName },
        ]}
      />

      {/* ── Section 1: Student Header Card ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="card-premium">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h2 className="text-lg font-bold text-foreground">{profile.studentName}</h2>
                  <Badge variant="outline" className="text-[10px]">{profile.rollNumber}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {batchInfo.className} — {batchInfo.name} · {profile.totalExams} exams
                </p>

                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-black text-foreground">{profile.overallAccuracy}%</span>
                    <TrendIcon trend={profile.trend} />
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {profile.secondaryTags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0.5">
                        {tagLabels[tag] || tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                size="sm"
                onClick={() => setShowAIGenerator(true)}
                className="shrink-0 gap-1.5 bg-violet-600 hover:bg-violet-700 text-white"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Generate Homework</span>
                <span className="sm:hidden">Assign</span>
              </Button>
            </div>

            {/* Quick stats row */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="bg-muted/50 rounded-lg p-2.5 text-center">
                <p className="text-sm font-bold text-foreground">{profile.consistency}%</p>
                <p className="text-[10px] text-muted-foreground">Consistency</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-2.5 text-center">
                <p className="text-sm font-bold text-foreground">{profile.totalQuestions}</p>
                <p className="text-[10px] text-muted-foreground">Questions</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-2.5 text-center">
                <p className="text-sm font-bold text-foreground">{profile.chapterMastery.filter(c => c.status === "weak").length}</p>
                <p className="text-[10px] text-muted-foreground">Weak Chapters</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Section 2: Chapter Mastery Grid ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
        <Card className="card-premium">
          <CardHeader className="pb-2 px-4 pt-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              Chapter Mastery
              <InfoTooltip content="Color-coded overview of student performance across all chapters. Green = strong (≥65%), Amber = moderate (40-64%), Red = weak (<40%). Tap a chapter to see topic-level breakdown." />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-2">
            {profile.chapterMastery.map((ch) => (
              <ChapterMasteryCard
                key={ch.chapterId}
                chapter={ch}
                isExpanded={expandedChapter === ch.chapterId}
                onToggle={() => setExpandedChapter(expandedChapter === ch.chapterId ? null : ch.chapterId)}
              />
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Section 3: Exam History Timeline ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
        <Card className="card-premium">
          <CardHeader className="pb-2 px-4 pt-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Exam History
              <InfoTooltip content="Chronological list of all exams this student appeared in. Shows score, percentage, and rank. Tap to view full exam results." />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-2">
            {profile.examHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No exam history available.</p>
            ) : (
              <>
                {(showAllExams ? profile.examHistory : profile.examHistory.slice(0, EXAM_HISTORY_INITIAL)).map((exam, i) => {
                  const pctColors = getPerformanceColor(exam.percentage);
                  return (
                    <motion.div
                      key={exam.examId}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/teacher/reports/${batchId}/exams/${exam.examId}`)}
                    >
                      <div className="shrink-0 w-10 h-10 rounded-lg bg-muted flex flex-col items-center justify-center">
                        <span className={cn("text-sm font-bold", pctColors.text)}>{exam.percentage}%</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{exam.examName}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {format(new Date(exam.date), "dd MMM yyyy")} · {exam.score}/{exam.maxScore}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Award className="w-3 h-3" />
                          Rank {exam.rank}/{exam.totalStudents}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                {profile.examHistory.length > EXAM_HISTORY_INITIAL && !showAllExams && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllExams(true)}
                    className="w-full text-xs text-muted-foreground mt-1"
                  >
                    View all {profile.examHistory.length} exams
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Section 4: Difficulty Analysis (Collapsible) ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
        <Card className="card-premium">
          <Collapsible open={showDifficulty} onOpenChange={setShowDifficulty}>
            <CollapsibleTrigger asChild>
              <div className="cursor-pointer hover:bg-muted/30 transition-colors px-4 pt-4 pb-3">
                <div className="text-sm font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    Difficulty Analysis
                    <InfoTooltip content="Accuracy breakdown by question difficulty level. Shows how the student performs on easy, medium, and hard questions — helps identify if they struggle only with harder content." />
                  </div>
                  {showDifficulty ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="px-4 pb-4 pt-0">
                <div className="grid grid-cols-3 gap-2">
                  {profile.difficultyBreakdown.map(d => (
                    <DifficultyCard key={d.level} data={d} />
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </motion.div>

      {/* ── Section 5: Weak Topics ── */}
      {profile.weakTopics.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 }}>
          <Card className="card-premium border-l-4 border-l-red-500">
            <CardHeader className="pb-2 px-4 pt-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Weak Topics ({profile.weakTopics.length})
                <InfoTooltip content="Topics where the student's accuracy is below 50%, aggregated across all exams. Sorted by weakness — lowest accuracy first. These directly feed the 'Generate Homework' action." />
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-1.5">
              {profile.weakTopics.slice(0, 10).map((topic, i) => (
                <div key={`${topic.chapterName}-${topic.topicName}`} className="flex items-center gap-3 p-2 rounded-lg bg-red-50/50 dark:bg-red-950/20">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                    <span className="text-xs font-bold text-red-600 dark:text-red-400">{topic.accuracy}%</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{topic.topicName}</p>
                    <p className="text-[10px] text-muted-foreground">{topic.chapterName} · {topic.questionsAsked} Q</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* AI Homework Generator Dialog */}
      <AIHomeworkGeneratorDialog
        open={showAIGenerator}
        onOpenChange={setShowAIGenerator}
        prefill={hwPrefill}
      />
    </div>
  );
};

// ── Sub-components ──

function ChapterMasteryCard({ chapter, isExpanded, onToggle }: {
  chapter: ChapterMastery;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const colors = getStatusColor(chapter.status);

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <div className={cn(
          "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors hover:bg-muted/40",
          colors.light
        )}>
          <div className={cn("shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm", colors.bg)}>
            {chapter.avgSuccessRate}%
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h4 className="text-sm font-semibold text-foreground truncate">{chapter.chapterName}</h4>
              <Badge variant="secondary" className={cn("text-[10px] px-1.5 py-0 font-medium", colors.badge)}>{chapter.status}</Badge>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span>{chapter.examsAppeared} exam{chapter.examsAppeared > 1 ? "s" : ""}</span>
              <span>·</span>
              <span>{chapter.questionsAttempted} Q</span>
              <TrendIcon trend={chapter.trend} />
            </div>
          </div>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pl-14 pr-3 pb-2 space-y-1 mt-1">
          {chapter.topics.map(topic => {
            const tc = getStatusColor(topic.status);
            return (
              <div key={topic.topicName} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-muted/30">
                <span className="text-xs text-foreground">{topic.topicName}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground">{topic.questionsAsked}Q</span>
                  <span className={cn("text-xs font-semibold", tc.text)}>{topic.accuracy}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function DifficultyCard({ data }: { data: DifficultyBreakdown }) {
  const levelColors = {
    easy: { bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-400", label: "Easy" },
    medium: { bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-700 dark:text-amber-400", label: "Medium" },
    hard: { bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-700 dark:text-red-400", label: "Hard" },
  };
  const lc = levelColors[data.level];

  return (
    <div className={cn("rounded-xl p-3 text-center", lc.bg)}>
      <p className="text-[10px] text-muted-foreground font-medium mb-1">{lc.label}</p>
      <p className={cn("text-lg font-bold", lc.text)}>{data.accuracy}%</p>
      <p className="text-[10px] text-muted-foreground">{data.questionsAttempted} Q</p>
      <div className="flex items-center justify-center gap-1 mt-1 text-[10px] text-muted-foreground">
        <Clock className="w-2.5 h-2.5" />
        {data.avgTimePerQuestion}s
      </div>
    </div>
  );
}

export default StudentReport;
