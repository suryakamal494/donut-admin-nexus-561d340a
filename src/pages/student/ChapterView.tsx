// Chapter View Page - Main learning experience with 3 modes

import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { studentSubjects } from "@/data/student/subjects";
import { getChaptersBySubject } from "@/data/student/chapters";
import {
  getLessonBundlesByChapter,
  getHomeworkByChapter,
  getAIPathByChapter,
  getChallengesByChapter,
} from "@/data/student/lessonBundles";
import {
  ChapterHeader,
  ModeSwitcher,
  ClassroomMode,
  MyPathMode,
  CompeteMode,
  type LearningMode,
} from "@/components/student/chapter";
import { ModeOnboardingTooltip } from "@/components/student/chapter/ModeOnboardingTooltip";

const StudentChapterView = () => {
  const { subjectId, chapterId } = useParams<{ subjectId: string; chapterId: string }>();
  const [currentMode, setCurrentMode] = useState<LearningMode>("classroom");

  // Find subject
  const subject = studentSubjects.find((s) => s.id === subjectId);
  if (!subject) {
    return <Navigate to="/student/subjects" replace />;
  }

  // Find chapter
  const chapters = getChaptersBySubject(subjectId!);
  const chapter = chapters.find((c) => c.id === chapterId);
  if (!chapter) {
    return <Navigate to={`/student/subjects/${subjectId}`} replace />;
  }

  // Get mode-specific data
  const lessonBundles = getLessonBundlesByChapter(chapterId!);
  const homeworkItems = getHomeworkByChapter(chapterId!);
  const aiPathItems = getAIPathByChapter(chapterId!);
  const challengeItems = getChallengesByChapter(chapterId!);

  // Calculate mode counts
  const modeCounts = {
    classroom: lessonBundles.length + homeworkItems.filter(h => !h.isCompleted).length,
    mypath: aiPathItems.filter(a => !a.isCompleted).length,
    compete: challengeItems.filter(c => !c.isCompleted).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-3xl mx-auto px-3 md:px-4 py-3 md:py-6 space-y-3 md:space-y-4">
        {/* Chapter Header */}
        <ChapterHeader chapter={chapter} subject={subject} />

        {/* First-time onboarding tooltip */}
        <ModeOnboardingTooltip />

        {/* Mode Switcher */}
        <div className="flex justify-center lg:justify-start">
          <ModeSwitcher
            currentMode={currentMode}
            onModeChange={setCurrentMode}
            modeCounts={modeCounts}
          />
        </div>

        {/* Mode Content */}
        <div className={cn(
          "transition-all duration-300",
          "animate-in fade-in-0 slide-in-from-bottom-2"
        )}>
          {currentMode === "classroom" && (
            <ClassroomMode
              lessonBundles={lessonBundles}
              homeworkItems={homeworkItems}
            />
          )}
          {currentMode === "mypath" && (
            <MyPathMode pathItems={aiPathItems} />
          )}
          {currentMode === "compete" && (
            <CompeteMode challenges={challengeItems} />
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentChapterView;
