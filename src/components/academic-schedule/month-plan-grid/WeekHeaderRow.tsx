import { cn } from "@/lib/utils";
import { AcademicWeek } from "@/types/academicSchedule";
import { getWeekNumberInMonth } from "@/lib/academicPlannerUtils";

interface WeekHeaderRowProps {
  weeks: AcademicWeek[];
  monthWeeks: {
    startWeekIndex: number;
    weeksInMonth: AcademicWeek[];
  };
  currentWeekIndex: number;
}

export function WeekHeaderRow({
  weeks,
  monthWeeks,
  currentWeekIndex,
}: WeekHeaderRowProps) {
  return (
    <div 
      className="grid gap-1" 
      style={{ 
        gridTemplateColumns: `140px repeat(${monthWeeks.weeksInMonth.length}, 1fr)` 
      }}
    >
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
  );
}
