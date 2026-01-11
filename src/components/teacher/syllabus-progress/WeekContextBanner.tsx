import { Calendar } from "lucide-react";
import type { WeekContext } from "@/hooks/useTeacherSyllabusProgress";

interface WeekContextBannerProps {
  weekContext: WeekContext;
}

export function WeekContextBanner({ weekContext }: WeekContextBannerProps) {
  // Format as "Jan Week 4" or "Feb Week 1"
  const getMonthWeekLabel = (startDateStr: string) => {
    if (!startDateStr) return "Current Week";
    
    const date = new Date(startDateStr);
    const month = date.toLocaleDateString("en-IN", { month: "short" });
    
    // Calculate week of month (1-5)
    const dayOfMonth = date.getDate();
    const weekOfMonth = Math.ceil(dayOfMonth / 7);
    
    return `${month} Week ${weekOfMonth}`;
  };

  const formatDateRange = (startStr: string, endStr: string) => {
    if (!startStr || !endStr) return "";
    
    const startDate = new Date(startStr);
    const endDate = new Date(endStr);
    
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    const startMonth = startDate.toLocaleDateString("en-IN", { month: "short" });
    const endMonth = endDate.toLocaleDateString("en-IN", { month: "short" });
    
    // Same month: "27 - 31 Jan" or different months: "27 Jan - 2 Feb"
    if (startMonth === endMonth) {
      return `${startDay} - ${endDay} ${startMonth}`;
    }
    return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
  };

  return (
    <div className="bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-teal-500/10 border border-teal-200/50 rounded-xl p-3 sm:p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shrink-0">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="font-semibold text-foreground">
            {getMonthWeekLabel(weekContext.startDate)}
          </span>
          <p className="text-sm text-muted-foreground">
            {formatDateRange(weekContext.startDate, weekContext.endDate)}
          </p>
        </div>
      </div>
    </div>
  );
}
