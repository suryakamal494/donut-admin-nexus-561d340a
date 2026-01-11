import { useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AcademicWeek } from "@/types/academicSchedule";

interface MonthNavigatorProps {
  weeks: AcademicWeek[];
  currentWeekIndex: number;
  selectedMonthIndex: number;
  onMonthChange: (index: number) => void;
}

interface MonthData {
  name: string;
  shortName: string;
  year: number;
  startWeekIndex: number;
  endWeekIndex: number;
  weeksInMonth: AcademicWeek[];
  isCurrent: boolean;
}

export function MonthNavigator({
  weeks,
  currentWeekIndex,
  selectedMonthIndex,
  onMonthChange,
}: MonthNavigatorProps) {
  // Group weeks by month
  const months = useMemo(() => {
    const monthMap = new Map<string, MonthData>();
    
    weeks.forEach((week, index) => {
      const date = new Date(week.startDate);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'long' });
      const shortName = date.toLocaleDateString('en-US', { month: 'short' });
      const year = date.getFullYear();
      
      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, {
          name: monthName,
          shortName,
          year,
          startWeekIndex: index,
          endWeekIndex: index,
          weeksInMonth: [week],
          isCurrent: false,
        });
      } else {
        const monthData = monthMap.get(monthKey)!;
        monthData.endWeekIndex = index;
        monthData.weeksInMonth.push(week);
      }
    });
    
    // Mark current month
    const currentWeek = weeks[currentWeekIndex];
    if (currentWeek) {
      const currentDate = new Date(currentWeek.startDate);
      const currentMonthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
      const currentMonth = monthMap.get(currentMonthKey);
      if (currentMonth) {
        currentMonth.isCurrent = true;
      }
    }
    
    return Array.from(monthMap.values());
  }, [weeks, currentWeekIndex]);

  // Find current month index
  const currentMonthIdx = useMemo(() => {
    return months.findIndex(m => m.isCurrent);
  }, [months]);

  // Calculate visible months (show 5-7 months with scroll)
  const visibleMonths = useMemo(() => {
    const visibleCount = 7;
    const halfVisible = Math.floor(visibleCount / 2);
    
    let startIdx = Math.max(0, selectedMonthIndex - halfVisible);
    let endIdx = Math.min(months.length, startIdx + visibleCount);
    
    // Adjust if we're near the end
    if (endIdx === months.length) {
      startIdx = Math.max(0, endIdx - visibleCount);
    }
    
    return months.slice(startIdx, endIdx).map((month, i) => ({
      ...month,
      originalIndex: startIdx + i,
    }));
  }, [months, selectedMonthIndex]);

  const canGoPrev = selectedMonthIndex > 0;
  const canGoNext = selectedMonthIndex < months.length - 1;

  return (
    <div className="flex items-center gap-2 bg-muted/30 rounded-xl p-2 border">
      {/* Previous Button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={() => onMonthChange(selectedMonthIndex - 1)}
        disabled={!canGoPrev}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Month Pills */}
      <div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-hide">
        {visibleMonths.map((month) => (
          <button
            key={`${month.year}-${month.name}`}
            onClick={() => onMonthChange(month.originalIndex)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
              month.originalIndex === selectedMonthIndex
                ? "bg-primary text-primary-foreground shadow-sm"
                : month.isCurrent
                ? "bg-primary/10 text-primary border border-primary/30"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="hidden sm:inline">{month.name}</span>
            <span className="sm:hidden">{month.shortName}</span>
            {month.isCurrent && month.originalIndex !== selectedMonthIndex && (
              <span className="ml-1 text-xs">●</span>
            )}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={() => onMonthChange(selectedMonthIndex + 1)}
        disabled={!canGoNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Today Button */}
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 h-8 shrink-0"
        onClick={() => onMonthChange(currentMonthIdx)}
        disabled={selectedMonthIndex === currentMonthIdx}
      >
        <Calendar className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Today</span>
      </Button>
    </div>
  );
}

/**
 * Get week label with month context
 * e.g., "Jan Week 1 (6-11)" or "Feb Week 2 (10-15)"
 */
export function getMonthWeekLabel(week: AcademicWeek, weekInMonth: number): string {
  const startDate = new Date(week.startDate);
  const endDate = new Date(week.endDate);
  const month = startDate.toLocaleDateString('en-US', { month: 'short' });
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();
  
  return `${month} Week ${weekInMonth} (${startDay}-${endDay})`;
}

/**
 * Get compact week label for table headers
 * e.g., "Week 1\n6-11"
 */
export function getCompactWeekLabel(week: AcademicWeek, weekInMonth: number): { week: string; dates: string } {
  const startDate = new Date(week.startDate);
  const endDate = new Date(week.endDate);
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();
  
  return {
    week: `Week ${weekInMonth}`,
    dates: `${startDay}-${endDay}`,
  };
}
