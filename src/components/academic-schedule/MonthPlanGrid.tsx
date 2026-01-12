// Month Plan Grid Component
// Main grid visualization for the Academic Planner workspace
// Refactored to use modular components for maintainability

import { useMemo } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Lock, GripVertical } from "lucide-react";
import { AcademicWeek } from "@/types/academicSchedule";
import {
  BatchAcademicPlan,
  ChapterAdjustment,
  PendingChapter,
} from "@/types/academicPlanner";
import { WeekHeaderRow } from "./month-plan-grid/WeekHeaderRow";
import { SubjectPlanRow } from "./month-plan-grid/SubjectPlanRow";
import { PlanGridLegend } from "./month-plan-grid/PlanGridLegend";

interface MonthPlanGridProps {
  plan: BatchAcademicPlan;
  weeks: AcademicWeek[];
  monthWeeks: { startWeekIndex: number; endWeekIndex: number; weeksInMonth: AcademicWeek[] };
  currentWeekIndex: number;
  publishedMonths: Set<number>;
  pendingChaptersBySubject?: Record<string, PendingChapter[]>;
  onAdjust?: (adjustment: ChapterAdjustment) => void;
  onCellClick?: (subjectId: string, chapterId: string | null, weekIndex: number) => void;
  onReorderChapters?: (subjectId: string, oldIndex: number, newIndex: number) => void;
  onAddChapter?: (subjectId: string, chapterId: string, weekIndex: number, hours: number) => void;
}

export function MonthPlanGrid({
  plan,
  weeks,
  monthWeeks,
  currentWeekIndex,
  publishedMonths,
  pendingChaptersBySubject = {},
  onAdjust,
  onCellClick,
  onReorderChapters,
  onAddChapter,
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
        {!isMonthPublished && onReorderChapters && (
          <Badge variant="outline" className="text-xs gap-1">
            <GripVertical className="w-3 h-3" />
            Drag to reorder
          </Badge>
        )}
      </div>

      {/* Grid */}
      <ScrollArea className="w-full">
        <div className="min-w-[600px]">
          {/* Header Row - Weeks */}
          <WeekHeaderRow
            weeks={weeks}
            monthWeeks={monthWeeks}
            currentWeekIndex={currentWeekIndex}
          />

          {/* Subject Rows */}
          {plan.subjects.map((subject) => (
            <SubjectPlanRow
              key={subject.subjectId}
              subject={subject}
              weeks={weeks}
              monthWeeks={monthWeeks}
              currentWeekIndex={currentWeekIndex}
              isPublished={isMonthPublished}
              pendingChapters={pendingChaptersBySubject[subject.subjectId] || []}
              onAdjust={onAdjust}
              onCellClick={onCellClick}
              onReorderChapters={onReorderChapters}
              onAddChapter={onAddChapter}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Legend */}
      <PlanGridLegend />
    </div>
  );
}
