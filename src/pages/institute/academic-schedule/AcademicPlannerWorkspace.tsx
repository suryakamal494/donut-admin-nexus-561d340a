// Academic Planner Workspace
// Batch-First Auto-Sequence Monthly Grid Planner
// Replaces the old clumsy WeeklyPlans component

import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Components
import { BatchPlanSelector } from "@/components/academic-schedule/BatchPlanSelector";
import { MonthNavigator } from "@/components/academic-schedule/MonthNavigator";
import { MonthPlanGrid } from "@/components/academic-schedule/MonthPlanGrid";

// Hooks & Data
import { useAcademicPlanGenerator } from "@/hooks/useAcademicPlanGenerator";
import { academicWeeks, currentWeekIndex } from "@/data/academicScheduleData";
import { getWeeksForMonth } from "@/lib/academicPlannerUtils";
import { ChapterAdjustment } from "@/types/academicPlanner";

export default function AcademicPlannerWorkspace() {
  // Batch selection
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  
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

  // Plan generator hook
  const {
    plan,
    isGenerating,
    validation,
    publishedMonths,
    generatePlan,
    clearPlan,
    applyAdjustment,
    publishMonth,
    batch,
    hasValidSetup,
    hasValidTimetable,
  } = useAcademicPlanGenerator({ batchId: selectedBatchId });

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

  // Handle batch change
  const handleBatchChange = useCallback((batchId: string) => {
    setSelectedBatchId(batchId);
    // Clear existing plan when batch changes
    if (plan) {
      clearPlan();
    }
  }, [plan, clearPlan]);

  // Handle cell click
  const handleCellClick = useCallback((subjectId: string, chapterId: string | null, weekIndex: number) => {
    if (!chapterId) {
      toast.info("No chapter planned for this week");
      return;
    }
    // TODO: Open adjustment popover
    console.log("Cell clicked:", { subjectId, chapterId, weekIndex });
  }, []);

  // Handle publish month
  const handlePublishMonth = useCallback(() => {
    publishMonth(selectedMonthIndex);
  }, [publishMonth, selectedMonthIndex]);

  return (
    <div className="space-y-4">
      {/* Header Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <Link 
            to="/institute/academic-schedule/batches" 
            className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-lg sm:text-xl font-semibold truncate">Academic Planner</h1>
          <Badge variant="secondary" className="bg-primary/10 text-primary gap-1 hidden sm:flex">
            <Sparkles className="w-3 h-3" />
            Auto-Sequence
          </Badge>
        </div>
        
        {/* Quick Links */}
        <div className="flex items-center gap-2">
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

      {/* Control Bar */}
      <div className="bg-card border border-border/50 rounded-xl p-3 space-y-3">
        {/* Row 1: Batch Selection + Generate */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide shrink-0 w-12">
              Batch
            </span>
            <BatchPlanSelector
              selectedBatchId={selectedBatchId}
              onBatchChange={handleBatchChange}
            />
          </div>
          
          <div className="flex items-center gap-2">
            {plan && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 h-8"
                onClick={clearPlan}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear & Regenerate</span>
                <span className="sm:hidden">Clear</span>
              </Button>
            )}
            
            <Button
              size="sm"
              className="gap-1.5 h-8"
              onClick={generatePlan}
              disabled={!selectedBatchId || isGenerating || !validation.isValid}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate Plan
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Divider */}
        {plan && <div className="w-full h-px bg-border/40" />}
        
        {/* Row 2: Month Navigation (only when plan exists) */}
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
              />
            </div>
          </div>
        )}
      </div>

      {/* Validation Errors */}
      {selectedBatchId && !validation.isValid && (
        <div className="space-y-2">
          {validation.errors.map((error, idx) => (
            <Alert key={idx} variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>
                {error.type === 'missing_timetable' ? 'Timetable Required' : 'Setup Required'}
              </AlertTitle>
              <AlertDescription className="flex items-center justify-between">
                <span>{error.message}</span>
                <Link 
                  to={error.type === 'missing_timetable' 
                    ? '/institute/timetable' 
                    : '/institute/academic-schedule/setup'
                  }
                >
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
      {selectedBatchId && validation.warnings.length > 0 && validation.isValid && (
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

      {/* Empty State - No Batch Selected */}
      {!selectedBatchId && (
        <Card className="p-8">
          <div className="text-center text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Select a Batch to Start</p>
            <p className="text-sm mt-1">
              Choose a batch from the dropdown above to generate or view its academic plan
            </p>
          </div>
        </Card>
      )}

      {/* Empty State - Batch Selected but No Plan */}
      {selectedBatchId && !plan && validation.isValid && (
        <Card className="p-8">
          <div className="text-center text-muted-foreground">
            <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Ready to Generate Plan</p>
            <p className="text-sm mt-1 mb-4">
              Click "Generate Plan" to auto-sequence chapters based on timetable and setup data
            </p>
            <Button onClick={generatePlan} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Plan
                </>
              )}
            </Button>
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
              onAdjust={applyAdjustment}
              onCellClick={handleCellClick}
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

      {/* Stats Summary */}
      {plan && (
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="font-medium">Batch:</span>
            <span>{batch?.className} - {batch?.name}</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-1.5">
            <span className="font-medium">Subjects:</span>
            <span>{plan.subjects.length}</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-1.5">
            <span className="font-medium">Total Chapters:</span>
            <span>
              {plan.subjects.reduce((sum, s) => sum + s.chapterAssignments.length, 0)}
            </span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-1.5">
            <span className="font-medium">Weeks Spanned:</span>
            <span>{plan.endWeekIndex - plan.startWeekIndex + 1}</span>
          </div>
        </div>
      )}
    </div>
  );
}
