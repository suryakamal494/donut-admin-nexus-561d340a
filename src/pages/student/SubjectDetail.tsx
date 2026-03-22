// Student Subject Detail Page - Shows all chapters for a subject
// Supports curriculum switching for multi-curriculum subjects

import { useMemo } from "react";
import { useParams, Navigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { studentSubjects } from "@/data/student";
import { getChaptersBySubject } from "@/data/student/chapters";
import { SubjectHeader, ChapterCard } from "@/components/student/subjects";
import { useCurriculumSelection } from "@/hooks/useCurriculumSelection";

const StudentSubjectDetail = () => {
  const { subjectId } = useParams<{ subjectId: string }>();

  // Find the subject
  const subject = studentSubjects.find(s => s.id === subjectId);

  // If subject not found, redirect to subjects list
  if (!subject) {
    return <Navigate to="/student/subjects" replace />;
  }

  // Curriculum selection (no-op for single-curriculum subjects)
  const curricula = subject.curricula || [];
  const pendingWork = subject.pendingWork || {};

  const {
    activeCurriculum,
    autoSelectedReason,
    switchCurriculum,
    isMultiCurriculum,
  } = useCurriculumSelection({
    curricula,
    pendingWork,
    subjectId: subject.id,
    section: "subjects",
  });

  // Get chapters — filtered by curriculum if multi-curriculum
  const chapters = useMemo(() => {
    if (isMultiCurriculum && activeCurriculum) {
      return getChaptersBySubject(subject.id, activeCurriculum);
    }
    return getChaptersBySubject(subject.id);
  }, [subject.id, isMultiCurriculum, activeCurriculum]);

  // Derive curriculum-specific stats
  const chaptersCompleted = chapters.filter(
    ch => ch.state === "completed" || ch.state === "mastered"
  ).length;
  const chaptersTotal = chapters.length;

  return (
    <div className="w-full pb-6">
      {/* Subject Header Island */}
      <SubjectHeader
        subject={subject}
        chaptersCompleted={isMultiCurriculum ? chaptersCompleted : undefined}
        chaptersTotal={isMultiCurriculum ? chaptersTotal : undefined}
        curricula={isMultiCurriculum ? curricula : undefined}
        activeCurriculum={isMultiCurriculum ? activeCurriculum : undefined}
        onCurriculumSwitch={isMultiCurriculum ? switchCurriculum : undefined}
        autoSelectedReason={isMultiCurriculum ? autoSelectedReason : undefined}
      />

      {/* Chapters Section */}
      <div className="mt-6">
        {/* Section header */}
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Chapters
          </h2>
          <span className="text-xs text-muted-foreground/70">
            ({chapters.length})
          </span>
        </div>

        {/* Chapter cards list */}
        <div className="space-y-3">
          {chapters.map((chapter) => (
            <ChapterCard 
              key={chapter.id} 
              chapter={chapter}
              subjectColor={subject.color}
            />
          ))}
        </div>

        {/* Empty state */}
        {chapters.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">No Chapters Yet</h3>
            <p className="text-sm text-muted-foreground">
              Chapters for this subject will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentSubjectDetail;
