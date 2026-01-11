// Compact Test Row - Single line test item for virtualized lists
// Used inside SubjectTestsSheet for scalability with 30+ tests

import { memo } from "react";
import { Clock, FileText, User, Calendar, ChevronRight, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { StudentTest, TestStatus } from "@/data/student/tests";
import { formatDuration } from "@/data/student/tests";

interface CompactTestRowProps {
  test: StudentTest;
  onStart?: (testId: string) => void;
  onView?: (testId: string) => void;
  onResults?: (testId: string) => void;
  style?: React.CSSProperties;
}

// Status dot colors and labels
const statusConfig: Record<TestStatus, { dot: string; label: string; bg: string }> = {
  live: {
    dot: "bg-rose-500",
    label: "Live",
    bg: "bg-rose-50",
  },
  upcoming: {
    dot: "bg-amber-500",
    label: "Upcoming",
    bg: "bg-amber-50",
  },
  attempted: {
    dot: "bg-emerald-500",
    label: "Done",
    bg: "bg-emerald-50",
  },
  missed: {
    dot: "bg-gray-400",
    label: "Missed",
    bg: "bg-gray-50",
  },
};

const CompactTestRow = memo(function CompactTestRow({
  test,
  onStart,
  onView,
  onResults,
  style,
}: CompactTestRowProps) {
  const status = statusConfig[test.status];

  const handleAction = () => {
    if (test.status === "live") {
      onStart?.(test.id);
    } else if (test.status === "attempted") {
      onResults?.(test.id);
    } else if (test.status === "upcoming") {
      onView?.(test.id);
    }
  };

  const getActionButton = () => {
    switch (test.status) {
      case "live":
        return (
          <Button
            size="sm"
            className="h-7 px-3 text-xs font-semibold bg-gradient-to-r from-donut-orange to-donut-coral text-white shadow-sm hover:opacity-90"
            onClick={handleAction}
          >
            Start
            <ChevronRight className="w-3 h-3 ml-0.5" />
          </Button>
        );
      case "upcoming":
        return (
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-3 text-xs"
            onClick={handleAction}
          >
            View
          </Button>
        );
      case "attempted":
        return (
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-3 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
            onClick={handleAction}
          >
            Results
          </Button>
        );
      case "missed":
        return (
          <span className="text-xs text-muted-foreground/60 pr-2">Expired</span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={style}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50",
        "hover:bg-white/80 hover:shadow-sm transition-all duration-200",
        test.status === "missed" && "opacity-60"
      )}
    >
      {/* Status indicator */}
      <div className={cn("shrink-0 flex items-center justify-center w-8 h-8 rounded-lg", status.bg)}>
        <span
          className={cn(
            "w-2.5 h-2.5 rounded-full",
            status.dot,
            test.status === "live" && "animate-pulse"
          )}
        />
      </div>

      {/* Test info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground text-sm truncate leading-tight">
          {test.name}
        </p>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
          {test.teacherName && (
            <span className="flex items-center gap-0.5 truncate max-w-[100px]">
              <User className="w-2.5 h-2.5" />
              {test.teacherName}
            </span>
          )}
          <span className="flex items-center gap-0.5">
            <FileText className="w-2.5 h-2.5" />
            {test.totalQuestions}Q
          </span>
          <span className="flex items-center gap-0.5">
            <Clock className="w-2.5 h-2.5" />
            {formatDuration(test.duration)}
          </span>
        </div>
      </div>

      {/* Score for attempted tests */}
      {test.status === "attempted" && test.score !== undefined && (
        <div className="hidden sm:flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 rounded-lg px-2 py-1">
          <Award className="w-3 h-3" />
          <span className="font-medium">{Math.round((test.score / test.totalMarks) * 100)}%</span>
        </div>
      )}

      {/* Scheduled date for upcoming */}
      {test.status === "upcoming" && test.scheduledDate && (
        <div className="hidden sm:flex items-center gap-1 text-xs text-amber-600 bg-amber-50 rounded-lg px-2 py-1">
          <Calendar className="w-3 h-3" />
          <span>
            {new Date(test.scheduledDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      )}

      {/* Action */}
      {getActionButton()}
    </div>
  );
});

export default CompactTestRow;
