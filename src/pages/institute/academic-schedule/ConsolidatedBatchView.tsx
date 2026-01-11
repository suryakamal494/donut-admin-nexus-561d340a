import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  BookOpen,
  ChevronDown,
  User,
  Calendar,
  Check,
  Target,
  BookMarked,
  GraduationCap,
  Timer,
} from "lucide-react";
import { 
  batchProgressSummaries, 
  academicScheduleSetups, 
  teachingConfirmations,
  pendingConfirmations,
  academicWeeks,
  currentWeekIndex,
  scheduleAdjustments,
} from "@/data/academicScheduleData";
import { cn } from "@/lib/utils";
import { 
  NO_TEACH_REASON_LABELS, 
  ChapterHourAllocation,
  ChapterDriftStatus,
  AdjustmentAction,
} from "@/types/academicSchedule";
import { MonthNavigator, getCompactWeekLabel } from "@/components/academic-schedule/MonthNavigator";
import { DriftAlertBanner } from "@/components/academic-schedule/DriftAlertBanner";
import { ScheduleAdjustmentDialog } from "@/components/academic-schedule/ScheduleAdjustmentDialog";
import { AdjustmentHistoryPanel } from "@/components/academic-schedule/AdjustmentHistoryPanel";
import { useChapterDrift } from "@/hooks/useChapterDrift";
import { toast } from "sonner";

// Mock topic data for chapters (in real app, this would come from masterData)
const MOCK_TOPICS: Record<string, { id: string; name: string; duration: string; status: "completed" | "in_progress" | "pending" }[]> = {
  "phy-10-1": [
    { id: "t1", name: "Reflection of Light", duration: "2h", status: "completed" },
    { id: "t2", name: "Spherical Mirrors", duration: "3h", status: "completed" },
    { id: "t3", name: "Refraction of Light", duration: "2h", status: "completed" },
    { id: "t4", name: "Refraction by Spherical Lenses", duration: "3h", status: "completed" },
  ],
  "phy-10-2": [
    { id: "t1", name: "Human Eye", duration: "2h", status: "completed" },
    { id: "t2", name: "Defects of Vision", duration: "2h", status: "completed" },
    { id: "t3", name: "Dispersion of Light", duration: "2h", status: "in_progress" },
  ],
  "phy-10-3": [
    { id: "t1", name: "Electric Current and Circuit", duration: "2h", status: "in_progress" },
    { id: "t2", name: "Electric Potential and Potential Difference", duration: "2h", status: "pending" },
    { id: "t3", name: "Ohm's Law", duration: "3h", status: "pending" },
    { id: "t4", name: "Resistance and Resistivity", duration: "2h", status: "pending" },
    { id: "t5", name: "Heating Effect of Electric Current", duration: "2h", status: "pending" },
  ],
  "mat-6-6": [
    { id: "t1", name: "Introduction to Integers", duration: "1h", status: "completed" },
    { id: "t2", name: "Representation of Integers on Number Line", duration: "1h", status: "completed" },
    { id: "t3", name: "Addition of Integers", duration: "2h", status: "in_progress" },
    { id: "t4", name: "Subtraction of Integers", duration: "2h", status: "pending" },
  ],
};

// Get mock topics for a chapter (falls back to generated topics)
const getTopicsForChapter = (chapterId: string, chapterName: string) => {
  if (MOCK_TOPICS[chapterId]) {
    return MOCK_TOPICS[chapterId];
  }
  // Generate placeholder topics
  return [
    { id: "t1", name: `Introduction to ${chapterName.split(' ').slice(0, 3).join(' ')}`, duration: "2h", status: "pending" as const },
    { id: "t2", name: "Core Concepts", duration: "2h", status: "pending" as const },
    { id: "t3", name: "Practice Problems", duration: "2h", status: "pending" as const },
  ];
};

// Status helpers
const getStatusConfig = (status: string) => {
  switch (status) {
    case "ahead":
    case "completed":
      return { icon: TrendingUp, label: "Ahead", color: "text-emerald-600 bg-emerald-50 border-emerald-200" };
    case "on_track":
    case "in_progress":
      return { icon: CheckCircle, label: "On Track", color: "text-blue-600 bg-blue-50 border-blue-200" };
    case "lagging":
      return { icon: TrendingDown, label: "Lagging", color: "text-amber-600 bg-amber-50 border-amber-200" };
    case "critical":
    case "not_started":
      return { icon: AlertTriangle, label: "Critical", color: "text-red-600 bg-red-50 border-red-200" };
    default:
      return { icon: Clock, label: status, color: "text-muted-foreground bg-muted" };
  }
};

const SUBJECT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  phy: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" },
  mat: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" },
  che: { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200" },
  bio: { bg: "bg-green-100", text: "text-green-700", border: "border-green-200" },
  eng: { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200" },
  hin: { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
  sst: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" },
  sci: { bg: "bg-cyan-100", text: "text-cyan-700", border: "border-cyan-200" },
};

// Chapter detail type for the sheet
interface ChapterDetail {
  chapter: ChapterHourAllocation & { weeksNeeded: number; startWeek: number; endWeek: number };
  isCompleted: boolean;
  isCurrent: boolean;
  subjectName: string;
}

export default function ConsolidatedBatchView() {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [lostDaysOpen, setLostDaysOpen] = useState<Record<string, boolean>>({});
  const [selectedChapter, setSelectedChapter] = useState<ChapterDetail | null>(null);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(() => {
    // Find the month containing the current week
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
  
  // Get classId for drift calculation - computed before hooks to ensure consistent hook ordering
  const classId = useMemo(() => {
    if (!batch) return undefined;
    const classNumber = parseInt(batch.className.replace(/\D/g, '')) || 0;
    const classIdMap: Record<number, string> = {
      6: "1", 7: "2", 8: "3", 9: "4", 10: "5", 11: "6", 12: "7"
    };
    return classIdMap[classNumber];
  }, [batch]);

  // Calculate drift for current subject - hook must be called unconditionally
  const driftData = useChapterDrift(
    batchId || "",
    selectedSubject || "",
    classId
  );

  // Get subject-specific adjustments
  const subjectAdjustments = useMemo(() => {
    return scheduleAdjustments.filter(
      a => a.batchId === batchId && a.subjectId === selectedSubject
    );
  }, [batchId, selectedSubject]);

  // Group pending by urgency
  const batchPendingConfirmations = useMemo(() => {
    return pendingConfirmations.filter(p => p.batchId === batchId);
  }, [batchId]);

  const pendingGrouped = useMemo(() => {
    const critical = batchPendingConfirmations.filter(p => p.daysOverdue >= 3);
    const overdue = batchPendingConfirmations.filter(p => p.daysOverdue > 0 && p.daysOverdue < 3);
    const today = batchPendingConfirmations.filter(p => p.daysOverdue === 0);
    return { critical, overdue, today };
  }, [batchPendingConfirmations]);

  // Get months from weeks
  const months = useMemo(() => {
    const monthMap = new Map<string, { name: string; weeks: typeof academicWeeks }>();
    academicWeeks.forEach((week) => {
      const date = new Date(week.startDate);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, { name: monthName, weeks: [] });
      }
      monthMap.get(monthKey)!.weeks.push(week);
    });
    return Array.from(monthMap.values());
  }, []);

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

  const currentSubject = batch.subjects.find(s => s.subjectId === selectedSubject);
  const statusConfig = getStatusConfig(batch.status);
  const StatusIcon = statusConfig.icon;

  const currentMonth = months[selectedMonthIndex];

  // Get subject setup for year view
  // Map class name to classId used in academicScheduleSetups
  // "Class 6" -> "1", "Class 7" -> "2", etc. OR JEE batches use course-based matching
  const getSubjectSetup = (subjectId: string) => {
    // For JEE batches, match by courseId and subjectId
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

  // Handler for opening adjustment dialog
  const handleOpenAdjustmentDialog = (chapterDrift?: ChapterDriftStatus) => {
    if (chapterDrift) {
      setSelectedDriftChapter(chapterDrift);
    } else if (driftData.chaptersWithDrift.length > 0) {
      // Select the first unresolved drift
      const unresolvedDrift = driftData.chaptersWithDrift.find(d => !d.isResolved);
      if (unresolvedDrift) {
        setSelectedDriftChapter(unresolvedDrift);
      }
    }
    setAdjustmentDialogOpen(true);
  };

  // Handler for adjustment submission
  const handleAdjustmentSubmit = (action: AdjustmentAction, notes: string) => {
    // In real app, this would save to database
    toast.success("Adjustment recorded", {
      description: `${selectedDriftChapter?.chapterName} drift has been addressed.`,
    });
    setAdjustmentDialogOpen(false);
    setSelectedDriftChapter(null);
    setDriftAlertDismissed(true);
  };

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

      {/* Back & Overall Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Button variant="outline" onClick={() => navigate("/institute/academic-schedule/batches")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          All Batches
        </Button>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Overall Progress</p>
            <p className="text-2xl font-bold">{batch.overallProgress}%</p>
          </div>
          <Badge className={cn("gap-1.5 text-sm py-1.5 px-3", statusConfig.color)}>
            <StatusIcon className="w-4 h-4" />
            {statusConfig.label}
          </Badge>
          {batchPendingConfirmations.length > 0 && (
            <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-300 bg-amber-50">
              <Clock className="w-4 h-4" />
              {batchPendingConfirmations.length} Pending
            </Badge>
          )}
        </div>
      </div>

      {/* Subject Selection Pills */}
      {batch.subjects.length > 0 ? (
        <div className="flex items-center gap-2 flex-wrap">
          {batch.subjects.map((subject) => {
            const colors = SUBJECT_COLORS[subject.subjectId] || { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200" };
            const isSelected = selectedSubject === subject.subjectId;
            return (
              <button
                key={subject.subjectId}
                onClick={() => setSelectedSubject(subject.subjectId)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all border-2",
                  isSelected
                    ? `${colors.bg} ${colors.text} ${colors.border} shadow-sm`
                    : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted"
                )}
              >
                {subject.subjectName}
                <span className="ml-2 text-xs opacity-70">{subject.percentComplete}%</span>
              </button>
            );
          })}
        </div>
      ) : (
        <Card className="border-amber-200 bg-amber-50/30">
          <CardContent className="p-4">
            <p className="text-sm text-amber-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              No subjects configured for this batch. Please configure subjects in Setup.
            </p>
          </CardContent>
        </Card>
      )}

      {currentSubject && (
        <>
          {/* ============================================ */}
          {/* SECTION 1: YEARLY PLAN */}
          {/* ============================================ */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Yearly Plan - {currentSubject.subjectName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Month Navigator */}
              <MonthNavigator
                weeks={academicWeeks}
                currentWeekIndex={currentWeekIndex}
                selectedMonthIndex={selectedMonthIndex}
                onMonthChange={setSelectedMonthIndex}
              />

              {/* Month Timeline Grid */}
              {currentMonth && (
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">{currentMonth.name}</h4>
                  
                  <ScrollArea className="w-full">
                    <div className="min-w-[600px]">
                      {/* Week Headers */}
                      <div className="grid gap-2" style={{ gridTemplateColumns: `180px repeat(${currentMonth.weeks.length}, 1fr)` }}>
                        <div className="text-xs text-muted-foreground font-medium px-2 py-1">Chapter</div>
                        {currentMonth.weeks.map((week, idx) => {
                          const label = getCompactWeekLabel(week, idx + 1);
                          const weekIndex = academicWeeks.findIndex(w => w.startDate === week.startDate);
                          const isCurrent = weekIndex === currentWeekIndex;
                          const isPast = weekIndex < currentWeekIndex;
                          return (
                            <div 
                              key={week.startDate}
                              className={cn(
                                "text-center text-xs px-2 py-1 rounded",
                                isCurrent && "bg-primary/10 text-primary font-medium",
                                isPast && "text-muted-foreground"
                              )}
                            >
                              <div>{label.week}</div>
                              <div className="text-[10px] opacity-70">{label.dates}</div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Chapter Rows */}
                      {(() => {
                        const setup = getSubjectSetup(currentSubject.subjectId);
                        if (!setup) return <p className="text-sm text-muted-foreground p-4">No chapter data available</p>;
                        
                        // Calculate dynamic week spans based on planned hours
                        // Assume ~4-6 hours per subject per week (use 5 as average)
                        const HOURS_PER_WEEK = 5;
                        
                        // Calculate cumulative hours to determine start/end weeks for each chapter
                        const chaptersWithWeeks = setup.chapters.slice(0, 8).map((chapter, idx) => {
                          // Calculate cumulative hours up to this chapter
                          const cumulativeHoursBefore = setup.chapters
                            .slice(0, idx)
                            .reduce((sum, ch) => sum + ch.plannedHours, 0);
                          
                          // Calculate which week this chapter starts (0-indexed)
                          const startWeek = Math.floor(cumulativeHoursBefore / HOURS_PER_WEEK);
                          
                          // Calculate how many weeks this chapter spans
                          const weeksNeeded = Math.max(1, Math.ceil(chapter.plannedHours / HOURS_PER_WEEK));
                          const endWeek = startWeek + weeksNeeded - 1;
                          
                          return {
                            ...chapter,
                            startWeek,
                            endWeek,
                            weeksNeeded,
                          };
                        });
                        
                        return chaptersWithWeeks.map((chapter, chapterIdx) => {
                          const isCompleted = chapterIdx < currentSubject.chaptersCompleted;
                          const isCurrentChapter = chapter.chapterId === currentSubject.currentChapter;
                          
                          // Get drift info for this chapter
                          const chapterDrift = driftData.chaptersWithDrift.find(
                            d => d.chapterId === chapter.chapterId
                          );
                          const hasDrift = chapterDrift && chapterDrift.driftHours !== 0 && !chapterDrift.isResolved;
                          
                          // Get the global week index for this month's first week
                          const monthFirstWeekIndex = academicWeeks.findIndex(w => 
                            w.startDate === currentMonth.weeks[0]?.startDate
                          );
                          
                          return (
                            <div 
                              key={chapter.chapterId}
                              className="grid gap-2 items-center border-t py-2"
                              style={{ gridTemplateColumns: `180px repeat(${currentMonth.weeks.length}, 1fr)` }}
                            >
                              <div className="flex items-center gap-2 px-2">
                                {isCompleted ? (
                                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                                ) : isCurrentChapter ? (
                                  <div className="w-4 h-4 rounded-full border-2 border-primary shrink-0" />
                                ) : (
                                  <div className="w-4 h-4 rounded-full border-2 border-sky-300 shrink-0" />
                                )}
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className={cn(
                                      "text-sm truncate cursor-help",
                                      isCompleted && "text-muted-foreground",
                                      isCurrentChapter && "font-medium text-primary"
                                    )}>
                                      {chapter.chapterName}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent side="right" className="max-w-xs">
                                    <div className="space-y-1">
                                      <p className="font-semibold">{chapter.chapterName}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {chapter.plannedHours}h planned • Spans {chapter.weeksNeeded} week{chapter.weeksNeeded > 1 ? 's' : ''}
                                      </p>
                                      {chapterDrift && (
                                        <p className={cn(
                                          "text-xs font-medium",
                                          chapterDrift.driftHours > 0 ? "text-amber-600" : "text-emerald-600"
                                        )}>
                                          {chapterDrift.driftHours > 0 ? "+" : ""}{chapterDrift.driftHours}h vs plan
                                          ({chapterDrift.actualHours}h actual / {chapterDrift.plannedHours}h planned)
                                        </p>
                                      )}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                                
                                {/* Drift Indicator Badge */}
                                {hasDrift && (
                                  <Badge 
                                    variant="outline" 
                                    className={cn(
                                      "text-[10px] px-1.5 py-0 h-4 shrink-0 cursor-pointer font-semibold",
                                      chapterDrift.severity === "critical" 
                                        ? "bg-red-50 text-red-700 border-red-300 hover:bg-red-100" 
                                        : chapterDrift.severity === "significant"
                                        ? "bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100"
                                        : "bg-muted text-muted-foreground border-muted-foreground/30 hover:bg-muted/80"
                                    )}
                                    onClick={() => handleOpenAdjustmentDialog(chapterDrift)}
                                  >
                                    {chapterDrift.driftHours > 0 ? "+" : ""}{chapterDrift.driftHours}h
                                  </Badge>
                                )}
                              </div>
                              
                              {currentMonth.weeks.map((week, weekIdx) => {
                                // Calculate if this week falls within this chapter's span
                                const absoluteWeekIdx = monthFirstWeekIndex + weekIdx;
                                const showBar = absoluteWeekIdx >= chapter.startWeek && absoluteWeekIdx <= chapter.endWeek;
                                
                                const weekIndex = academicWeeks.findIndex(w => w.startDate === week.startDate);
                                const isPastWeek = weekIndex < currentWeekIndex;
                                const isCurrentWeek = weekIndex === currentWeekIndex;
                                
                                // Calculate hours for this specific week segment
                                const isFirstWeek = absoluteWeekIdx === chapter.startWeek;
                                const isLastWeek = absoluteWeekIdx === chapter.endWeek;
                                const remainingHours = chapter.plannedHours % HOURS_PER_WEEK;
                                const hoursThisWeek = isLastWeek && remainingHours > 0 ? remainingHours : HOURS_PER_WEEK;
                                
                                // Format dates for tooltip
                                const startDate = new Date(week.startDate);
                                const endDate = new Date(week.endDate);
                                const formatDate = (d: Date) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
                                
                                // Determine status text
                                const statusText = isCompleted ? "✓ Completed" : 
                                  isCurrentChapter && isCurrentWeek ? "📍 Current" :
                                  isCurrentChapter ? "In Progress" : 
                                  isPastWeek ? "Planned" : "Upcoming";
                                
                                // Determine bar intensity based on hours (narrower bars for partial weeks)
                                const barWidth = isLastWeek && remainingHours > 0 && remainingHours < HOURS_PER_WEEK 
                                  ? `${Math.max(40, (remainingHours / HOURS_PER_WEEK) * 100)}%` 
                                  : '100%';
                                
                                return (
                                  <div key={week.startDate} className="h-6 flex items-center justify-center">
                                    {showBar && (
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <div 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setSelectedChapter({
                                                chapter,
                                                isCompleted,
                                                isCurrent: isCurrentChapter,
                                                subjectName: currentSubject.subjectName,
                                              });
                                            }}
                                            className={cn(
                                              "h-4 rounded cursor-pointer transition-all hover:scale-y-125 hover:shadow-sm",
                                              isCompleted ? "bg-emerald-300 hover:bg-emerald-400" :
                                              isCurrentChapter && isCurrentWeek ? "bg-primary hover:bg-primary/90" :
                                              isCurrentChapter ? "bg-primary/40 hover:bg-primary/50" :
                                              "bg-sky-200 hover:bg-sky-300",
                                              // Rounded corners for first/last week
                                              isFirstWeek && "rounded-l-md ml-1",
                                              isLastWeek && "rounded-r-md mr-1",
                                              !isFirstWeek && !isLastWeek && "mx-0.5"
                                            )} 
                                            style={{ width: barWidth }}
                                          />
                                        </TooltipTrigger>
                                        <TooltipContent side="top" className="max-w-xs">
                                          <div className="space-y-1">
                                            <p className="font-semibold text-sm">{chapter.chapterName}</p>
                                            <div className="text-xs text-muted-foreground space-y-0.5">
                                              <p>📅 {formatDate(startDate)} - {formatDate(endDate)}</p>
                                              <p>⏱️ {hoursThisWeek}h / {chapter.plannedHours}h total</p>
                                              <p>{statusText}</p>
                                              {isFirstWeek && chapter.weeksNeeded > 1 && <p>🚀 Week 1 of {chapter.weeksNeeded}</p>}
                                              {isLastWeek && chapter.weeksNeeded > 1 && <p>🏁 Week {chapter.weeksNeeded} of {chapter.weeksNeeded}</p>}
                                              <p className="text-primary mt-1">Click for details →</p>
                                            </div>
                                          </div>
                                        </TooltipContent>
                                      </Tooltip>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          );
                        });
                      })()}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                  
                  {/* Color-Coded Legend */}
                  <div className="flex items-center justify-center gap-6 pt-4 border-t mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-3 rounded bg-emerald-300" />
                      <span className="text-xs text-muted-foreground">Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-3 rounded bg-primary" />
                      <span className="text-xs text-muted-foreground">In Progress</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-3 rounded bg-sky-200" />
                      <span className="text-xs text-muted-foreground">Upcoming</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ============================================ */}
          {/* DRIFT ALERT BANNER */}
          {/* ============================================ */}
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

          {/* ============================================ */}
          {/* SECTION 2: SUBJECT PROGRESS */}
          {/* ============================================ */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Progress Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-muted/30 border">
                  <p className="text-xs text-muted-foreground">Hours</p>
                  <p className="text-lg font-semibold">
                    {currentSubject.totalActualHours}/{currentSubject.totalPlannedHours}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 border">
                  <p className="text-xs text-muted-foreground">Chapters</p>
                  <p className="text-lg font-semibold">
                    {currentSubject.chaptersCompleted}/{currentSubject.totalChapters}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 border">
                  <p className="text-xs text-muted-foreground">Current</p>
                  <p className="text-lg font-semibold truncate">
                    {currentSubject.currentChapterName || "—"}
                  </p>
                </div>
                <div className={cn(
                  "p-3 rounded-lg border",
                  currentSubject.lostDays > 3 ? "bg-red-50 border-red-200" : 
                  currentSubject.lostDays > 0 ? "bg-amber-50 border-amber-200" : "bg-muted/30"
                )}>
                  <p className="text-xs text-muted-foreground">Lost Days</p>
                  <p className="text-lg font-semibold">{currentSubject.lostDays}</p>
                </div>
              </div>

              {/* Chapter List */}
              <div className="space-y-2">
                {(() => {
                  const setup = getSubjectSetup(currentSubject.subjectId);
                  if (!setup) return null;
                  
                  return setup.chapters.map((chapter, index) => {
                    const isCompleted = index < currentSubject.chaptersCompleted;
                    const isCurrent = chapter.chapterId === currentSubject.currentChapter;
                    const progress = isCompleted ? 100 : isCurrent ? 60 : 0;
                    
                    return (
                      <div
                        key={chapter.chapterId}
                        className={cn(
                          "p-3 rounded-lg border flex items-center gap-3",
                          isCurrent && "border-primary bg-primary/5",
                          isCompleted && "border-emerald-200 bg-emerald-50/30"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-medium",
                          isCompleted ? "bg-emerald-100 text-emerald-700" :
                          isCurrent ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        )}>
                          {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "font-medium text-sm truncate",
                            isCompleted && "text-muted-foreground"
                          )}>
                            {chapter.chapterName}
                          </p>
                          <p className="text-xs text-muted-foreground">{chapter.plannedHours}h planned</p>
                        </div>
                        <Progress value={progress} className="w-20 h-1.5" />
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Lost Days Breakdown */}
              {currentSubject.lostDays > 0 && currentSubject.lostDaysReasons.length > 0 && (
                <Collapsible 
                  open={lostDaysOpen[currentSubject.subjectId]} 
                  onOpenChange={(open) => setLostDaysOpen(prev => ({ ...prev, [currentSubject.subjectId]: open }))}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                      <span className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Lost Days Breakdown
                      </span>
                      <ChevronDown className={cn("w-4 h-4 transition-transform", lostDaysOpen[currentSubject.subjectId] && "rotate-180")} />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {currentSubject.lostDaysReasons.map((item) => (
                        <div key={item.reason} className="p-3 rounded-lg bg-muted/50 border text-center">
                          <p className="text-2xl font-bold">{item.count}</p>
                          <p className="text-xs text-muted-foreground">{NO_TEACH_REASON_LABELS[item.reason]}</p>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* ============================================ */}
      {/* SECTION 3: PENDING CONFIRMATIONS */}
      {/* ============================================ */}
      {batchPendingConfirmations.length > 0 && (
        <Card className="border-amber-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-amber-700">
              <Clock className="w-5 h-5" />
              Pending Confirmations ({batchPendingConfirmations.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Critical */}
            {pendingGrouped.critical.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-red-600 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Critical ({pendingGrouped.critical.length})
                </h4>
                {pendingGrouped.critical.map((item) => (
                  <PendingConfirmationCard key={item.id} item={item} />
                ))}
              </div>
            )}

            {/* Overdue */}
            {pendingGrouped.overdue.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-amber-600">
                  Overdue ({pendingGrouped.overdue.length})
                </h4>
                {pendingGrouped.overdue.map((item) => (
                  <PendingConfirmationCard key={item.id} item={item} />
                ))}
              </div>
            )}

            {/* Today */}
            {pendingGrouped.today.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Due Today ({pendingGrouped.today.length})
                </h4>
                {pendingGrouped.today.map((item) => (
                  <PendingConfirmationCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pending Status Summary */}
      <Card className={cn(
        "border",
        batchPendingConfirmations.length === 0 ? "border-emerald-200 bg-emerald-50/30" : "border-muted"
      )}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {batchPendingConfirmations.length === 0 ? (
                <>
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-emerald-700">Confirmations Complete</p>
                    <p className="text-xs text-muted-foreground">All teaching sessions are confirmed</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-amber-700">{batchPendingConfirmations.length} Pending Confirmation{batchPendingConfirmations.length > 1 ? 's' : ''}</p>
                    <p className="text-xs text-muted-foreground">
                      {pendingGrouped.critical.length > 0 && `${pendingGrouped.critical.length} critical • `}
                      Review and confirm teaching sessions
                    </p>
                  </div>
                </>
              )}
            </div>
            {batch.subjects.length > 0 && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Total Lost Days</p>
                <p className="text-lg font-semibold">
                  {batch.subjects.reduce((sum, s) => sum + s.lostDays, 0)}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Chapter Detail Sheet */}
      <Sheet open={!!selectedChapter} onOpenChange={(open) => !open && setSelectedChapter(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedChapter && (
            <>
              <SheetHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    selectedChapter.isCompleted ? "bg-emerald-100" :
                    selectedChapter.isCurrent ? "bg-primary/20" : "bg-muted"
                  )}>
                    {selectedChapter.isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                    ) : selectedChapter.isCurrent ? (
                      <BookOpen className="w-6 h-6 text-primary" />
                    ) : (
                      <BookMarked className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <SheetTitle className="text-left">{selectedChapter.chapter.chapterName}</SheetTitle>
                    <SheetDescription className="text-left">
                      {selectedChapter.subjectName} • Chapter {selectedChapter.chapter.order}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              {/* Status Badge */}
              <div className="mb-4">
                <Badge className={cn(
                  "gap-1.5",
                  selectedChapter.isCompleted ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                  selectedChapter.isCurrent ? "bg-primary/10 text-primary border-primary/20" :
                  "bg-muted text-muted-foreground"
                )}>
                  {selectedChapter.isCompleted ? (
                    <><CheckCircle className="w-3.5 h-3.5" /> Completed</>
                  ) : selectedChapter.isCurrent ? (
                    <><Target className="w-3.5 h-3.5" /> In Progress</>
                  ) : (
                    <><Clock className="w-3.5 h-3.5" /> Upcoming</>
                  )}
                </Badge>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="p-3 rounded-lg bg-muted/30 border text-center">
                  <Timer className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-lg font-bold">{selectedChapter.chapter.plannedHours}h</p>
                  <p className="text-xs text-muted-foreground">Planned</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 border text-center">
                  <Calendar className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-lg font-bold">{selectedChapter.chapter.weeksNeeded}</p>
                  <p className="text-xs text-muted-foreground">Week{selectedChapter.chapter.weeksNeeded > 1 ? 's' : ''}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 border text-center">
                  <GraduationCap className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-lg font-bold">
                    {getTopicsForChapter(selectedChapter.chapter.chapterId, selectedChapter.chapter.chapterName).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Topics</p>
                </div>
              </div>

              {/* Topic Breakdown */}
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2 text-sm">
                  <BookOpen className="w-4 h-4" />
                  Topic Breakdown
                </h4>
                
                <div className="space-y-2">
                  {getTopicsForChapter(selectedChapter.chapter.chapterId, selectedChapter.chapter.chapterName).map((topic, idx) => (
                    <div 
                      key={topic.id}
                      className={cn(
                        "p-3 rounded-lg border flex items-center gap-3",
                        topic.status === "completed" && "border-emerald-200 bg-emerald-50/30",
                        topic.status === "in_progress" && "border-primary/30 bg-primary/5",
                        topic.status === "pending" && "border-muted"
                      )}
                    >
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-medium",
                        topic.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                        topic.status === "in_progress" ? "bg-primary/10 text-primary" : 
                        "bg-muted text-muted-foreground"
                      )}>
                        {topic.status === "completed" ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          idx + 1
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "font-medium text-sm",
                          topic.status === "completed" && "text-muted-foreground"
                        )}>
                          {topic.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{topic.duration} estimated</p>
                      </div>
                      <Badge variant="outline" className={cn(
                        "text-xs shrink-0",
                        topic.status === "completed" && "text-emerald-600 border-emerald-300",
                        topic.status === "in_progress" && "text-primary border-primary/30",
                        topic.status === "pending" && "text-muted-foreground"
                      )}>
                        {topic.status === "completed" ? "Done" :
                         topic.status === "in_progress" ? "Current" : "Pending"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Summary */}
              <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Topic Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {getTopicsForChapter(selectedChapter.chapter.chapterId, selectedChapter.chapter.chapterName)
                      .filter(t => t.status === "completed").length} / {getTopicsForChapter(selectedChapter.chapter.chapterId, selectedChapter.chapter.chapterName).length}
                  </span>
                </div>
                <Progress 
                  value={
                    (getTopicsForChapter(selectedChapter.chapter.chapterId, selectedChapter.chapter.chapterName)
                      .filter(t => t.status === "completed").length / 
                    getTopicsForChapter(selectedChapter.chapter.chapterId, selectedChapter.chapter.chapterName).length) * 100
                  } 
                  className="h-2"
                />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

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

// Pending Confirmation Card Component
function PendingConfirmationCard({ item }: { item: typeof pendingConfirmations[0] }) {
  const formattedDate = new Date(item.date).toLocaleDateString('en-IN', { 
    day: 'numeric', 
    month: 'short' 
  });
  
  return (
    <div className={cn(
      "p-3 rounded-lg border flex items-center justify-between gap-3",
      item.daysOverdue >= 3 ? "bg-red-50 border-red-200" :
      item.daysOverdue > 0 ? "bg-amber-50 border-amber-200" : "bg-muted/30"
    )}>
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <User className="w-5 h-5 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-sm truncate">{item.subjectName}</p>
          <p className="text-xs text-muted-foreground">
            {item.teacherName} • {formattedDate}
          </p>
        </div>
      </div>
      <div className="text-right shrink-0">
        {item.daysOverdue > 0 && (
          <Badge variant="outline" className={cn(
            "text-xs",
            item.daysOverdue >= 3 ? "text-red-600 border-red-300" : "text-amber-600 border-amber-300"
          )}>
            {item.daysOverdue}d overdue
          </Badge>
        )}
        <Button size="sm" className="ml-2 h-7">
          Confirm
        </Button>
      </div>
    </div>
  );
}
