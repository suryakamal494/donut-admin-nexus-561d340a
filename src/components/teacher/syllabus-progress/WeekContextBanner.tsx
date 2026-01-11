import { Calendar, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WeekContext } from "@/hooks/useTeacherSyllabusProgress";

interface WeekContextBannerProps {
  weekContext: WeekContext;
}

export function WeekContextBanner({ weekContext }: WeekContextBannerProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  };

  return (
    <div className="bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-teal-500/10 border border-teal-200/50 rounded-xl p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        {/* Week Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">
                Week {weekContext.weekNumber}
              </span>
              <span className="text-muted-foreground text-sm">
                of {weekContext.totalWeeks}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {formatDate(weekContext.startDate)} - {formatDate(weekContext.endDate)}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Hours This Week */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-sm">
              <span className="font-semibold text-foreground">
                {weekContext.hoursThisWeek}h
              </span>
              <span className="text-muted-foreground ml-1 hidden sm:inline">
                taught
              </span>
            </div>
          </div>

          {/* Pending Confirmations */}
          {weekContext.totalPendingConfirmations > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-sm">
                <span className="font-semibold text-amber-600">
                  {weekContext.totalPendingConfirmations}
                </span>
                <span className="text-muted-foreground ml-1 hidden sm:inline">
                  pending
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
