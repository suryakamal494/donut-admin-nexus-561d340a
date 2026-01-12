import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

// Modular imports for better tree-shaking
import { academicWeeks, currentWeekIndex } from "@/data/academic-schedule/weeks";
import { academicScheduleSetups } from "@/data/academic-schedule/setups";
import { pendingConfirmations } from "@/data/academic-schedule/pendingConfirmations";
import { scheduleAdjustments } from "@/data/academic-schedule/adjustments";
import { batchProgressSummaries } from "@/data/academicScheduleData";

import { ChapterDriftStatus, AdjustmentAction } from "@/types/academicSchedule";
import { DriftAlertBanner } from "@/components/academic-schedule/DriftAlertBanner";
import { ScheduleAdjustmentDialog } from "@/components/academic-schedule/ScheduleAdjustmentDialog";
import { AdjustmentHistoryPanel } from "@/components/academic-schedule/AdjustmentHistoryPanel";
import { useChapterDrift } from "@/hooks/useChapterDrift";

// Refactored components
import {
  ChapterDetail,
  SubjectProgressInfo,
  BatchProgressHeader,
  ChapterTimelineGrid,
  SubjectProgressSection,
  ChapterDetailSheet,
  PendingConfirmationsSection,
} from "@/components/academic-schedule/batch-view";

export default function ConsolidatedBatchView() {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<ChapterDetail | null>(null);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(() => {
    const currentWeek = academicWeeks[currentWeekIndex];
    if (!currentWeek) return 0;
    const currentDate = new Date(currentWeek.startDate);
    let monthIdx = 0;
    const seenMonths = new Set<string>();
    for (let i = 0; i < academicWeeks.length; i++) {
      const weekDate = new Date(academicWeeks[i].startDate);
      const monthKey = `${weekDate.getFullYear()}-${weekDate.getMonth()}`;
      if (!seenMonths.has(monthKey)) {
        if (weekDate.getMonth() === currentDate.getMonth() && weekDate.getFullYear() === currentDate.getFullYear()) {
          return monthIdx;
        }
        seenMonths.add(monthKey);
        monthIdx++;
      }
    }
    return 0;
  });
  
  // Drift Management State
  const [driftAlertDismissed, setDriftAlertDismissed] = useState(false);
  const [adjustmentDialogOpen, setAdjustmentDialogOpen] = useState(false);
  const [selectedDriftChapter, setSelectedDriftChapter] = useState<ChapterDriftStatus | null>(null);

  const batch = batchProgressSummaries.find(b => b.batchId === batchId);
  
  // Get classId for drift calculation
  const classId = useMemo(() => {
    if (!batch) return undefined;
    const classNumber = parseInt(batch.className.replace(/\D/g, '')) || 0;
    const classIdMap: Record<number, string> = {
      6: "1", 7: "2", 8: "3", 9: "4", 10: "5", 11: "6", 12: "7"
    };
    return classIdMap[classNumber];
  }, [batch]);

  // Calculate drift for current subject
  const driftData = useChapterDrift(batchId || "", selectedSubject || "", classId);

  // Get subject-specific adjustments
  const subjectAdjustments = useMemo(() => {
    return scheduleAdjustments.filter(
      a => a.batchId === batchId && a.subjectId === selectedSubject
    );
  }, [batchId, selectedSubject]);

  // Group pending by batch
  const batchPendingConfirmations = useMemo(() => {
    return pendingConfirmations.filter(p => p.batchId === batchId);
  }, [batchId]);

  // Early return AFTER all hooks are called
  if (!batch) {
    return (
      <div className="space-y-6">
        <PageHeader title="Batch Not Found" description="The requested batch could not be found" />
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  // Set default selected subject
  if (!selectedSubject && batch.subjects.length > 0) {
    setSelectedSubject(batch.subjects[0].subjectId);
  }

  const currentSubject = batch.subjects.find(s => s.subjectId === selectedSubject) as SubjectProgressInfo | undefined;

  // Get subject setup
  const getSubjectSetup = (subjectId: string) => {
    if (batch.batchId.startsWith('jee-')) {
      return academicScheduleSetups.find(s => 
        s.subjectId === subjectId && s.courseId === 'jee-mains'
      );
    }
    if (!classId) return undefined;
    return academicScheduleSetups.find(s => 
      s.subjectId === subjectId && s.classId === classId
    );
  };

  const handleOpenAdjustmentDialog = (chapterDrift?: ChapterDriftStatus) => {
    if (chapterDrift) {
      setSelectedDriftChapter(chapterDrift);
    } else if (driftData.chaptersWithDrift.length > 0) {
      const unresolvedDrift = driftData.chaptersWithDrift.find(d => !d.isResolved);
      if (unresolvedDrift) {
        setSelectedDriftChapter(unresolvedDrift);
      }
    }
    setAdjustmentDialogOpen(true);
  };

  const handleAdjustmentSubmit = (action: AdjustmentAction, notes: string) => {
    toast.success("Adjustment recorded", {
      description: `${selectedDriftChapter?.chapterName} drift has been addressed.`,
    });
    setAdjustmentDialogOpen(false);
    setSelectedDriftChapter(null);
    setDriftAlertDismissed(true);
  };

  const subjectSetup = currentSubject ? getSubjectSetup(currentSubject.subjectId) : undefined;

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title={batch.batchName}
        description={`${batch.className} • Complete syllabus overview`}
        breadcrumbs={[
          { label: "Syllabus Tracker", href: "/institute/academic-schedule/batches" },
          { label: "Batch Progress", href: "/institute/academic-schedule/batches" },
          { label: batch.batchName },
        ]}
      />

      <BatchProgressHeader
        batchName={batch.batchName}
        className={batch.className}
        overallProgress={batch.overallProgress}
        status={batch.status}
        pendingCount={batchPendingConfirmations.length}
        subjects={batch.subjects as SubjectProgressInfo[]}
        selectedSubject={selectedSubject}
        onSubjectChange={setSelectedSubject}
        onBack={() => navigate("/institute/academic-schedule/batches")}
      />

      {currentSubject && (
        <>
          {/* Yearly Plan Timeline */}
          {subjectSetup && (
            <ChapterTimelineGrid
              batchId={batch.batchId}
              currentSubject={currentSubject}
              chapters={subjectSetup.chapters}
              academicWeeks={academicWeeks}
              currentWeekIndex={currentWeekIndex}
              selectedMonthIndex={selectedMonthIndex}
              onMonthChange={setSelectedMonthIndex}
              chaptersWithDrift={driftData.chaptersWithDrift}
              onChapterClick={setSelectedChapter}
              onDriftClick={handleOpenAdjustmentDialog}
            />
          )}

          {/* Drift Alert Banner */}
          {!driftAlertDismissed && driftData.totalDriftHours >= 3 && (
            <DriftAlertBanner
              totalDriftHours={driftData.totalDriftHours}
              affectedChapters={driftData.affectedChapters}
              subjectName={currentSubject.subjectName}
              severity={driftData.maxSeverity}
              onResolveClick={() => handleOpenAdjustmentDialog()}
              onDismiss={() => setDriftAlertDismissed(true)}
            />
          )}

          {/* Subject Progress Details */}
          {subjectSetup && (
            <SubjectProgressSection
              batchId={batch.batchId}
              currentSubject={currentSubject}
              chapters={subjectSetup.chapters}
            />
          )}
        </>
      )}

      {/* Pending Confirmations */}
      <PendingConfirmationsSection
        pendingConfirmations={batchPendingConfirmations}
        subjects={batch.subjects as SubjectProgressInfo[]}
      />

      {/* Chapter Detail Sheet */}
      <ChapterDetailSheet
        selectedChapter={selectedChapter}
        onClose={() => setSelectedChapter(null)}
      />

      {/* Adjustment History Panel */}
      {subjectAdjustments.length > 0 && (
        <AdjustmentHistoryPanel adjustments={subjectAdjustments} />
      )}

      {/* Schedule Adjustment Dialog */}
      {selectedDriftChapter && currentSubject && (
        <ScheduleAdjustmentDialog
          open={adjustmentDialogOpen}
          onOpenChange={setAdjustmentDialogOpen}
          chapterDrift={selectedDriftChapter}
          subjectName={currentSubject.subjectName}
          onSubmit={handleAdjustmentSubmit}
        />
      )}
    </div>
  );
}
