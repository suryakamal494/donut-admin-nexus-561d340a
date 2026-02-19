// Teacher Test Card Component
// Displays individual test with status, details, and actions
// Mobile-first design with responsive enhancements

import { memo } from "react";
import { Clock, FileText, Minus, User, Calendar, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import TestStatusBadge from "./TestStatusBadge";
import { getSubjectColors } from "@/components/student/shared/subjectColors";
import type { StudentTest } from "@/data/student/tests";
import { formatDuration, subjectColorMap } from "@/data/student/tests";

interface TestCardProps {
  test: StudentTest;
  onStart?: (testId: string) => void;
  onView?: (testId: string) => void;
  onResults?: (testId: string) => void;
}

const TestCard = memo(function TestCard({
  test,
  onStart,
  onView,
  onResults,
}: TestCardProps) {
  const colorKey = test.subject ? subjectColorMap[test.subject] || "blue" : "blue";
  const colors = getSubjectColors(colorKey);

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
            className={cn(
              "text-xs font-semibold shadow-lg",
              colors.gradient,
              "text-white hover:opacity-90"
            )}
            onClick={handleAction}
          >
            Start Test →
          </Button>
        );
      case "upcoming":
        return (
          <Button
            size="sm"
            variant="outline"
            className="text-xs opacity-60 cursor-not-allowed"
            disabled
          >
            {test.scheduledDate
              ? `Starts ${new Date(test.scheduledDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}${test.scheduledTime ? `, ${test.scheduledTime}` : ""}`
              : "Scheduled"}
          </Button>
        );
      case "attempted":
        return (
          <Button
            size="sm"
            variant="ghost"
            className="text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
            onClick={handleAction}
          >
            View Results
          </Button>
        );
      case "missed":
        return (
          <Button size="sm" variant="ghost" disabled className="text-xs">
            Expired
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "bg-white/80 backdrop-blur-sm rounded-xl border border-white/60 shadow-sm",
        "p-3 sm:p-4 transition-all duration-200",
        "hover:shadow-md hover:border-white/80",
        test.status === "missed" && "opacity-60"
      )}
    >
      {/* Header: Status Badge */}
      <div className="flex items-center justify-between mb-2">
        <TestStatusBadge status={test.status} />
        {test.negativeMarking && (
          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
            <Minus className="w-3 h-3" />
            ve marking
          </span>
        )}
      </div>

      {/* Test Name */}
      <h4 className="font-semibold text-foreground text-sm sm:text-base leading-tight mb-1.5 line-clamp-2">
        {test.name}
      </h4>

      {/* Teacher & Batch Info */}
      {test.teacherName && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
          <User className="w-3 h-3" />
          <span>{test.teacherName}</span>
          {test.batchName && (
            <>
              <span className="text-muted-foreground/40">•</span>
              <span>{test.batchName}</span>
            </>
          )}
        </div>
      )}

      {/* Stats Row */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
        <span className="flex items-center gap-1">
          <FileText className="w-3.5 h-3.5" />
          {test.totalQuestions} Qs
        </span>
        <span className="flex items-center gap-1">
          <Award className="w-3.5 h-3.5" />
          {test.totalMarks} marks
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {formatDuration(test.duration)}
        </span>
      </div>

      {/* Scheduled Date (for upcoming) */}
      {test.status === "upcoming" && test.scheduledDate && (
        <div className="flex items-center gap-1.5 text-xs text-amber-600 mb-3 bg-amber-50 rounded-lg px-2 py-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>
            {new Date(test.scheduledDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
            {test.scheduledTime && `, ${test.scheduledTime}`}
          </span>
        </div>
      )}

      {/* Score (for attempted) */}
      {test.status === "attempted" && test.score !== undefined && (
        <div className="flex items-center gap-2 text-xs text-emerald-600 mb-3 bg-emerald-50 rounded-lg px-2 py-1.5">
          <Award className="w-3.5 h-3.5" />
          <span className="font-semibold">
            Score: {test.score}/{test.totalMarks}
          </span>
          <span className="text-emerald-500">
            ({Math.round((test.score / test.totalMarks) * 100)}%)
          </span>
        </div>
      )}

      {/* Action Button */}
      <div className="flex justify-end">{getActionButton()}</div>
    </div>
  );
});

export default TestCard;
