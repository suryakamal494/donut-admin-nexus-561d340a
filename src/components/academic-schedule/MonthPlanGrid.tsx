// Month Plan Grid Component
// Main grid visualization for the Academic Planner workspace

import { useState, useMemo } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Lock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AcademicWeek } from "@/types/academicSchedule";
import {
  BatchAcademicPlan,
  SubjectPlanData,
  ChapterCellType,
  ChapterAdjustment,
  SUBJECT_COLORS,
  SUBJECT_ICONS,
} from "@/types/academicPlanner";
import {
  getChapterCellType,
  getHoursForWeek,
  getWeekNumberInMonth,
} from "@/lib/academicPlannerUtils";
import { ChapterAdjustmentPopover } from "./ChapterAdjustmentPopover";

interface MonthPlanGridProps {
  plan: BatchAcademicPlan;
  weeks: AcademicWeek[];
  monthWeeks: { startWeekIndex: number; endWeekIndex: number; weeksInMonth: AcademicWeek[] };
  currentWeekIndex: number;
  publishedMonths: Set<number>;
  onAdjust?: (adjustment: ChapterAdjustment) => void;
  onCellClick?: (subjectId: string, chapterId: string | null, weekIndex: number) => void;
}

export function MonthPlanGrid({
  plan,
  weeks,
  monthWeeks,
  currentWeekIndex,
  publishedMonths,
  onAdjust,
  onCellClick,
}: MonthPlanGridProps) {
  // Get month name
  const monthName = useMemo(() => {
    if (monthWeeks.weeksInMonth.length === 0) return "";
    const firstWeek = monthWeeks.weeksInMonth[0];
    const date = new Date(firstWeek.startDate);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [monthWeeks]);

  // Check if month is published
  const isMonthPublished = useMemo(() => {
    if (monthWeeks.weeksInMonth.length === 0) return false;
    const date = new Date(monthWeeks.weeksInMonth[0].startDate);
    return publishedMonths.has(date.getMonth());
  }, [monthWeeks, publishedMonths]);

  return (
    <div className="space-y-3">
      {/* Month Header */}
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">{monthName}</h3>
        {isMonthPublished && (
          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
            <Lock className="w-3 h-3 mr-1" />
            Published
          </Badge>
        )}
      </div>

      {/* Grid */}
      <ScrollArea className="w-full">
        <div className="min-w-[600px]">
          {/* Header Row - Weeks */}
          <div className="grid gap-1" style={{ 
            gridTemplateColumns: `140px repeat(${monthWeeks.weeksInMonth.length}, 1fr)` 
          }}>
            {/* Empty corner cell */}
            <div className="h-12" />
            
            {/* Week headers */}
            {monthWeeks.weeksInMonth.map((week, idx) => {
              const absoluteIndex = monthWeeks.startWeekIndex + idx;
              const weekInMonth = getWeekNumberInMonth(week, weeks);
              const isCurrent = absoluteIndex === currentWeekIndex;
              const startDay = new Date(week.startDate).getDate();
              const endDay = new Date(week.endDate).getDate();
              
              return (
                <div
                  key={week.weekNumber}
                  className={cn(
                    "h-12 flex flex-col items-center justify-center rounded-t-lg border-t border-x text-xs",
                    isCurrent 
                      ? "bg-primary/10 border-primary" 
                      : "bg-muted/30 border-border"
                  )}
                >
                  <span className="font-medium">Week {weekInMonth}</span>
                  <span className="text-muted-foreground text-[10px]">
                    {startDay}-{endDay}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Subject Rows */}
          {plan.subjects.map((subject) => (
            <SubjectRow
              key={subject.subjectId}
              subject={subject}
              weeks={weeks}
              monthWeeks={monthWeeks}
              currentWeekIndex={currentWeekIndex}
              isPublished={isMonthPublished}
              onAdjust={onAdjust}
              onCellClick={onCellClick}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-2 border-t">
        <span className="font-medium">Legend:</span>
        <div className="flex items-center gap-1.5">
          <div className="w-8 h-3 bg-primary/70 rounded" />
          <span>Full week</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-8 h-3 bg-primary/40 rounded-l" />
          <span>Continues</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-8 h-3 bg-primary/40 rounded-r flex items-center justify-end pr-1">
            <ChevronRight className="w-2 h-2" />
          </div>
          <span>Continues next</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Lock className="w-3 h-3 text-amber-600" />
          <span>Locked</span>
        </div>
      </div>
    </div>
  );
}

// Subject Row Component
interface SubjectRowProps {
  subject: SubjectPlanData;
  weeks: AcademicWeek[];
  monthWeeks: { startWeekIndex: number; endWeekIndex: number; weeksInMonth: AcademicWeek[] };
  currentWeekIndex: number;
  isPublished: boolean;
  onAdjust?: (adjustment: ChapterAdjustment) => void;
  onCellClick?: (subjectId: string, chapterId: string | null, weekIndex: number) => void;
}

function SubjectRow({
  subject,
  weeks,
  monthWeeks,
  currentWeekIndex,
  isPublished,
  onAdjust,
  onCellClick,
}: SubjectRowProps) {
  const colors = SUBJECT_COLORS[subject.subjectId] || SUBJECT_COLORS.mat;
  const icon = SUBJECT_ICONS[subject.subjectId] || '📚';

  return (
    <div 
      className="grid gap-1 mb-1" 
      style={{ 
        gridTemplateColumns: `140px repeat(${monthWeeks.weeksInMonth.length}, 1fr)` 
      }}
    >
      {/* Subject Label */}
      <div className={cn(
        "h-16 flex items-center gap-2 px-3 rounded-l-lg border-y border-l",
        colors.bg, colors.border
      )}>
        <span className="text-lg">{icon}</span>
        <div className="min-w-0">
          <div className={cn("text-sm font-medium truncate", colors.text)}>
            {subject.subjectName}
          </div>
          <div className="text-[10px] text-muted-foreground">
            {subject.weeklyHours}h/week
          </div>
        </div>
      </div>

      {/* Week Cells */}
      {monthWeeks.weeksInMonth.map((week, idx) => {
        const absoluteIndex = monthWeeks.startWeekIndex + idx;
        
        // Find chapter for this week
        let foundAssignment = subject.chapterAssignments.find(
          a => absoluteIndex >= a.startWeekIndex && absoluteIndex <= a.endWeekIndex
        );
        
        const cellType: ChapterCellType = foundAssignment 
          ? getChapterCellType(absoluteIndex, foundAssignment)
          : 'empty';
        
        const hours = foundAssignment 
          ? getHoursForWeek(absoluteIndex, foundAssignment)
          : 0;
        
        const isCurrent = absoluteIndex === currentWeekIndex;
        
        return (
          <ChapterCellWithPopover
            key={week.weekNumber}
            subjectId={subject.subjectId}
            chapterId={foundAssignment?.chapterId || null}
            chapterName={foundAssignment?.chapterName || null}
            hours={hours}
            weekIndex={absoluteIndex}
            cellType={cellType}
            isCurrent={isCurrent}
            isLocked={foundAssignment?.isLocked || false}
            isPublished={isPublished}
            colors={colors}
            onAdjust={onAdjust}
            onClick={() => onCellClick?.(subject.subjectId, foundAssignment?.chapterId || null, absoluteIndex)}
          />
        );
      })}
    </div>
  );
}

// Chapter Cell with Popover Component
interface ChapterCellWithPopoverProps {
  subjectId: string;
  chapterId: string | null;
  chapterName: string | null;
  hours: number;
  weekIndex: number;
  cellType: ChapterCellType;
  isCurrent: boolean;
  isLocked: boolean;
  isPublished: boolean;
  colors: { bg: string; text: string; border: string };
  onAdjust?: (adjustment: ChapterAdjustment) => void;
  onClick?: () => void;
}

function ChapterCellWithPopover({
  subjectId,
  chapterId,
  chapterName,
  hours,
  weekIndex,
  cellType,
  isCurrent,
  isLocked,
  isPublished,
  colors,
  onAdjust,
  onClick,
}: ChapterCellWithPopoverProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const isEmpty = cellType === 'empty';
  
  // Determine visual style based on cell type
  const getCellStyle = () => {
    switch (cellType) {
      case 'single':
        return "rounded-lg";
      case 'start':
        return "rounded-l-lg";
      case 'end':
        return "rounded-r-lg";
      case 'middle':
        return "";
      case 'full':
        return "rounded-lg";
      default:
        return "rounded-lg";
    }
  };
  
  const getOpacity = () => {
    switch (cellType) {
      case 'single':
      case 'full':
        return "bg-opacity-70";
      case 'start':
        return "bg-opacity-60";
      case 'middle':
        return "bg-opacity-40";
      case 'end':
        return "bg-opacity-50";
      default:
        return "";
    }
  };

  const cellContent = (
    <button
      onClick={() => {
        if (!isEmpty && !isPublished) {
          setIsPopoverOpen(true);
        } else {
          onClick?.();
        }
      }}
      disabled={isPublished}
      className={cn(
        "h-16 w-full flex flex-col items-center justify-center border text-xs transition-all",
        isEmpty 
          ? "bg-muted/20 border-dashed border-muted-foreground/20 hover:bg-muted/40" 
          : cn(colors.bg, colors.border, getOpacity(), getCellStyle()),
        isCurrent && "ring-2 ring-primary ring-offset-1",
        !isPublished && !isEmpty && "hover:shadow-md cursor-pointer",
        isPublished && "cursor-default opacity-80",
        isLocked && "ring-1 ring-amber-400"
      )}
    >
      {!isEmpty && (
        <>
          <div className={cn("font-medium truncate max-w-full px-1", colors.text)}>
            {chapterName?.split(' ').slice(0, 2).join(' ')}
            {(cellType === 'middle' || cellType === 'end') && '...'}
          </div>
          <div className="text-[10px] text-muted-foreground flex items-center gap-1">
            {hours}h
            {isLocked && <Lock className="w-2.5 h-2.5 text-amber-600" />}
            {cellType === 'end' && <ChevronRight className="w-2.5 h-2.5" />}
          </div>
        </>
      )}
      {isEmpty && (
        <span className="text-muted-foreground/50">—</span>
      )}
    </button>
  );

  // If empty or published, just show tooltip
  if (isEmpty || isPublished) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {cellContent}
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[200px]">
            {isEmpty ? (
              <p>No chapter planned</p>
            ) : (
              <div className="text-xs">
                <p className="font-medium">{chapterName}</p>
                <p className="text-muted-foreground">{hours} hours this week</p>
                {isPublished && <p className="text-green-600">✓ Published (read-only)</p>}
              </div>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Show popover for adjustable cells
  return (
    <ChapterAdjustmentPopover
      isOpen={isPopoverOpen}
      onOpenChange={setIsPopoverOpen}
      chapterId={chapterId!}
      chapterName={chapterName!}
      subjectId={subjectId}
      weekIndex={weekIndex}
      hours={hours}
      isLocked={isLocked}
      isPublished={isPublished}
      onAdjust={(adjustment) => {
        onAdjust?.(adjustment);
        setIsPopoverOpen(false);
      }}
    >
      {cellContent}
    </ChapterAdjustmentPopover>
  );
}
