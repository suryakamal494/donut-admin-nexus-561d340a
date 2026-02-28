import { useState, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { InfoTooltip } from "@/components/timetable/InfoTooltip";
import { batchInfoMap } from "@/data/teacher/examResults";
import { getStudentBatchProfile, generateMockStudentInsight } from "@/data/teacher/studentReportData";
import { AIHomeworkGeneratorDialog } from "@/components/teacher/AIHomeworkGeneratorDialog";
import type { AIHomeworkPrefill } from "@/components/teacher/AIHomeworkGeneratorDialog";
import { currentTeacher } from "@/data/teacher/profile";
import {
  StudentHeaderCard, ChapterMasteryCard,
  ExamHistoryTimeline, DifficultyAnalysis, WeakTopicsList,
  StudentAISummary,
} from "@/components/teacher/reports";
import { motion } from "framer-motion";

const StudentReport = () => {
  const { batchId, studentId } = useParams<{ batchId: string; studentId: string }>();
  const navigate = useNavigate();
  const [showDifficulty, setShowDifficulty] = useState(false);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const weakTopicsRef = useRef<HTMLDivElement>(null);

  const batchInfo = batchId ? batchInfoMap[batchId] : null;
  const profile = useMemo(() => {
    if (!studentId || !batchId) return null;
    return getStudentBatchProfile(studentId, batchId);
  }, [studentId, batchId]);

  const aiInsight = useMemo(() => {
    if (!profile) return null;
    return generateMockStudentInsight(profile);
  }, [profile]);

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

      <StudentHeaderCard
        profile={profile}
        batchClassName={batchInfo.className}
        batchName={batchInfo.name}
        onGenerateHomework={() => setShowAIGenerator(true)}
      />

      {/* AI Summary — positioned between header and chapter mastery */}
      {aiInsight && (
        <StudentAISummary
          insight={aiInsight}
          onGenerateHomework={() => setShowAIGenerator(true)}
          onScrollToWeakTopics={() => weakTopicsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
        />
      )}

      {/* Chapter Mastery Grid */}
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

      <ExamHistoryTimeline examHistory={profile.examHistory} batchId={batchId!} />

      <DifficultyAnalysis
        difficultyBreakdown={profile.difficultyBreakdown}
        isOpen={showDifficulty}
        onOpenChange={setShowDifficulty}
      />

      <div ref={weakTopicsRef}>
        <WeakTopicsList weakTopics={profile.weakTopics} />
      </div>

      <AIHomeworkGeneratorDialog
        open={showAIGenerator}
        onOpenChange={setShowAIGenerator}
        prefill={hwPrefill}
      />
    </div>
  );
};

export default StudentReport;
