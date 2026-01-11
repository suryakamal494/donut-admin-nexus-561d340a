// Academic Planner Workspace
// Batch-specific view for generating and editing academic plans
// Redesigned to work without timetable dependency

import { useState, useMemo, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  Sparkles,
  RefreshCw,
  Check,
  AlertTriangle,
  AlertCircle,
  Calendar,
  Loader2,
  BookOpen,
  Settings,
  Lock,
  FileEdit,
  History,
  Undo2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Components
import { MonthNavigator } from "@/components/academic-schedule/MonthNavigator";
import { MonthPlanGrid } from "@/components/academic-schedule/MonthPlanGrid";
import { PlanHistorySheet } from "@/components/academic-schedule/PlanHistorySheet";

// Hooks & Data
import { useAcademicPlanGenerator, PlanHistoryEntry } from "@/hooks/useAcademicPlanGenerator";
import { academicWeeks, currentWeekIndex, academicScheduleSetups } from "@/data/academicScheduleData";
import { getWeeksForMonth, getPendingChaptersForSubject } from "@/lib/academicPlannerUtils";
import { loadPlanForBatch } from "@/data/academicPlannerData";
import { PendingChapter } from "@/types/academicPlanner";

export default function AcademicPlannerWorkspace() {
  const { batchId } = useParams<{ batchId: string }>();
  const navigate = useNavigate();
  
  // Month navigation
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(() => {
    // Find current month index
    const currentWeek = academicWeeks[currentWeekIndex];
    if (!currentWeek) return 0;
    
    const currentDate = new Date(currentWeek.startDate);
    const months = new Map<string, number>();
    let idx = 0;
    
    academicWeeks.forEach((week) => {
      const date = new Date(week.startDate);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!months.has(key)) {
        months.set(key, idx++);
      }
    });
    
    const currentKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
    return months.get(currentKey) || 0;
  });

  // Plan generator hook - now uses batchId from URL params
  const {
    plan,
    isGenerating,
    validation,
    publishedMonths,
    hasExistingPlan,
    history,
    generatePlan,
    clearPlan,
    applyAdjustment,
    publishMonth,
    reorderChapters,
    addChapterManually,
    undoToEntry,
    clearHistory,
    resetSubjectToOriginal,
    batch,
    hasValidSetup,
    canEditWeek,
    getWeekStatus,
  } = useAcademicPlanGenerator({ batchId: batchId || null });

  // Get weeks for current month
  const monthWeeks = useMemo(() => {
    return getWeeksForMonth(academicWeeks, selectedMonthIndex);
  }, [selectedMonthIndex]);

  // Get current month name
  const currentMonthName = useMemo(() => {
    if (monthWeeks.weeksInMonth.length === 0) return "";
    const date = new Date(monthWeeks.weeksInMonth[0].startDate);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [monthWeeks]);

  // Check if current month is published
  const isCurrentMonthPublished = useMemo(() => {
    if (monthWeeks.weeksInMonth.length === 0) return false;
    const date = new Date(monthWeeks.weeksInMonth[0].startDate);
    return publishedMonths.has(date.getMonth());
  }, [monthWeeks, publishedMonths]);

  // Get actual month number for publishing
  const currentActualMonth = useMemo(() => {
    if (monthWeeks.weeksInMonth.length === 0) return 0;
    const date = new Date(monthWeeks.weeksInMonth[0].startDate);
    return date.getMonth();
  }, [monthWeeks]);

  // Get pending chapters for each subject
  const pendingChaptersBySubject = useMemo(() => {
    if (!plan) return {};
    const result: Record<string, PendingChapter[]> = {};
    plan.subjects.forEach(subject => {
      result[subject.subjectId] = getPendingChaptersForSubject(
        subject.subjectId,
        plan,
        academicScheduleSetups
      );
    });
    return result;
  }, [plan]);

  // Handle cell click
  const handleCellClick = useCallback((subjectId: string, chapterId: string | null, weekIndex: number) => {
    if (!chapterId) {
      toast.info("No chapter planned for this week");
      return;
    }
    console.log("Cell clicked:", { subjectId, chapterId, weekIndex });
  }, []);

  // Handle publish month
  const handlePublishMonth = useCallback(() => {
    publishMonth(currentActualMonth);
  }, [publishMonth, currentActualMonth]);

  // Published months display
  const publishedMonthsDisplay = useMemo(() => {
    if (publishedMonths.size === 0) return null;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return Array.from(publishedMonths)
      .sort((a, b) => a - b)
      .map(m => monthNames[m])
      .join(', ');
  }, [publishedMonths]);

  // No batch selected - redirect to hub
  if (!batchId) {
    navigate('/institute/academic-schedule/plans');
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Header Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <Link 
            to="/institute/academic-schedule/plans" 
            className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-semibold truncate">
              {batch?.className} - {batch?.name}
            </h1>
            <p className="text-xs text-muted-foreground">Academic Planner</p>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary gap-1 hidden sm:flex ml-2">
            <Sparkles className="w-3 h-3" />
            Auto-Sequence
          </Badge>
        </div>
        
        {/* Quick Links */}
        <div className="flex items-center gap-2">
          {/* History Button */}
          {plan && history.length > 0 && (
            <PlanHistorySheet
              history={history}
              onUndo={undoToEntry}
              onClearHistory={clearHistory}
            >
              <Button variant="outline" size="sm" className="gap-1.5 h-8">
                <History className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">History</span>
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                  {history.length}
                </Badge>
              </Button>
            </PlanHistorySheet>
          )}
          <Link to="/institute/academic-schedule/setup">
            <Button variant="ghost" size="sm" className="gap-1.5 h-8 text-muted-foreground">
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Setup</span>
            </Button>
          </Link>
          <Link to="/institute/academic-schedule/batches">
            <Button variant="ghost" size="sm" className="gap-1.5 h-8 text-muted-foreground">
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Batch Progress</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Plan Status Section */}
      {(plan || hasExistingPlan) && (
        <div className="bg-card border border-border/50 rounded-xl p-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Badge */}
            <Badge 
              variant="outline" 
              className={cn(
                "gap-1.5",
                plan?.status === 'published' 
                  ? "bg-green-100 text-green-700 border-green-200"
                  : "bg-amber-100 text-amber-700 border-amber-200"
              )}
            >
              {plan?.status === 'published' ? (
                <>
                  <Lock className="w-3 h-3" />
                  Published
                </>
              ) : (
                <>
                  <FileEdit className="w-3 h-3" />
                  Draft
                </>
              )}
            </Badge>

            {/* Published Months */}
            {publishedMonthsDisplay && (
              <div className="flex items-center gap-1.5 text-sm">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-green-700">{publishedMonthsDisplay}</span>
              </div>
            )}

            {/* Stats */}
            {plan && (
              <>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{plan.subjects.length} subjects</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {plan.subjects.reduce((sum, s) => sum + s.chapterAssignments.length, 0)} chapters
                  </span>
                </div>
              </>
            )}

            {/* Actions */}
            <div className="ml-auto flex items-center gap-2">
              {plan && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 h-7 text-xs"
                  onClick={clearPlan}
                >
                  <RefreshCw className="w-3 h-3" />
                  <span className="hidden sm:inline">Regenerate</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Control Bar - Generate/Month Navigation */}
      <div className="bg-card border border-border/50 rounded-xl p-3 space-y-3">
        {/* Generate Row (if no plan) */}
        {!plan && validation.isValid && (
          <div className="flex items-center justify-center gap-3 py-4">
            <Button
              size="default"
              className="gap-2"
              onClick={generatePlan}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Plan
                </>
              )}
            </Button>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Auto-sequence chapters based on academic setup
            </p>
          </div>
        )}
        
        {/* Month Navigation (when plan exists) */}
        {plan && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide shrink-0 w-12">
              Month
            </span>
            <div className="flex-1 min-w-0">
              <MonthNavigator
                weeks={academicWeeks}
                currentWeekIndex={currentWeekIndex}
                selectedMonthIndex={selectedMonthIndex}
                onMonthChange={setSelectedMonthIndex}
                publishedMonths={publishedMonths}
              />
            </div>
          </div>
        )}
      </div>

      {/* Validation Errors */}
      {!validation.isValid && (
        <div className="space-y-2">
          {validation.errors.map((error, idx) => (
            <Alert key={idx} variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Setup Required</AlertTitle>
              <AlertDescription className="flex items-center justify-between">
                <span>{error.message}</span>
                <Link to="/institute/academic-schedule/setup">
                  <Button size="sm" variant="outline" className="ml-2">
                    Configure Now
                  </Button>
                </Link>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Validation Warnings */}
      {validation.warnings.length > 0 && validation.isValid && !plan && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warnings</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside text-sm">
              {validation.warnings.map((warning, idx) => (
                <li key={idx}>{warning.message}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Empty State - No Plan Yet */}
      {!plan && validation.isValid && !isGenerating && (
        <Card className="p-8">
          <div className="text-center text-muted-foreground">
            <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Ready to Generate Plan</p>
            <p className="text-sm mt-1 mb-4">
              Click "Generate Plan" to auto-sequence chapters based on academic setup data
            </p>
          </div>
        </Card>
      )}

      {/* Main Grid */}
      {plan && (
        <Card>
          <CardContent className="p-4">
            <MonthPlanGrid
              plan={plan}
              weeks={academicWeeks}
              monthWeeks={monthWeeks}
              currentWeekIndex={currentWeekIndex}
              publishedMonths={publishedMonths}
              pendingChaptersBySubject={pendingChaptersBySubject}
              onAdjust={applyAdjustment}
              onCellClick={handleCellClick}
              onReorderChapters={reorderChapters}
              onAddChapter={addChapterManually}
            />
          </CardContent>
        </Card>
      )}

      {/* Publish Button */}
      {plan && !isCurrentMonthPublished && (
        <div className="flex justify-end">
          <Button 
            onClick={handlePublishMonth}
            className="gap-2"
          >
            <Check className="w-4 h-4" />
            Publish {currentMonthName}
          </Button>
        </div>
      )}

      {/* Already Published Notice */}
      {plan && isCurrentMonthPublished && (
        <div className="flex items-center justify-end gap-2 text-sm text-green-600">
          <Lock className="w-4 h-4" />
          <span>{currentMonthName} is published (read-only)</span>
        </div>
      )}
    </div>
  );
}
