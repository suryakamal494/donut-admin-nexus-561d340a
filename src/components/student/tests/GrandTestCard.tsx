// Grand Test / PYP Card Component
// Multi-subject test card with pattern branding
// Mobile-first with enhanced desktop layout

import { memo } from "react";
import {
  Clock,
  FileText,
  Calendar,
  Award,
  TrendingUp,
  Target,
  Zap,
  Heart,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import TestStatusBadge from "./TestStatusBadge";
import type { StudentTest, ExamPattern } from "@/data/student/tests";
import { formatDuration, getSubjectDisplayName } from "@/data/student/tests";

interface GrandTestCardProps {
  test: StudentTest;
  onStart?: (testId: string) => void;
  onView?: (testId: string) => void;
  onResults?: (testId: string) => void;
}

const patternConfig: Record<
  ExamPattern,
  { icon: typeof Target; color: string; gradient: string; bgLight: string }
> = {
  jee_main: {
    icon: Target,
    color: "text-blue-600",
    gradient: "from-blue-500 to-indigo-600",
    bgLight: "bg-blue-50",
  },
  jee_advanced: {
    icon: Zap,
    color: "text-purple-600",
    gradient: "from-purple-500 to-violet-600",
    bgLight: "bg-purple-50",
  },
  neet: {
    icon: Heart,
    color: "text-emerald-600",
    gradient: "from-emerald-500 to-teal-600",
    bgLight: "bg-emerald-50",
  },
  custom: {
    icon: Target,
    color: "text-amber-600",
    gradient: "from-amber-500 to-orange-600",
    bgLight: "bg-amber-50",
  },
  cbse: {
    icon: Target,
    color: "text-orange-600",
    gradient: "from-orange-500 to-red-500",
    bgLight: "bg-orange-50",
  },
};

const GrandTestCard = memo(function GrandTestCard({
  test,
  onStart,
  onView,
  onResults,
}: GrandTestCardProps) {
  const pattern = test.pattern || "custom";
  const config = patternConfig[pattern];
  const Icon = config.icon;

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
              "text-xs font-semibold shadow-lg w-full sm:w-auto",
              "bg-gradient-to-r",
              config.gradient,
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
            className="text-xs w-full sm:w-auto"
            onClick={handleAction}
          >
            View Details
          </Button>
        );
      case "attempted":
        return (
          <Button
            size="sm"
            variant="ghost"
            className={cn(
              "text-xs w-full sm:w-auto",
              config.color,
              `hover:${config.bgLight}`
            )}
            onClick={handleAction}
          >
            View Results
          </Button>
        );
      case "missed":
        return (
          <Button
            size="sm"
            variant="ghost"
            disabled
            className="text-xs w-full sm:w-auto"
          >
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
      {/* Header: Pattern Icon + Status */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br",
              config.gradient
            )}
          >
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className={cn("text-xs font-medium", config.color)}>
              {pattern === "jee_main"
                ? "JEE Main"
                : pattern === "jee_advanced"
                ? "JEE Advanced"
                : pattern === "neet"
                ? "NEET"
                : "Custom"}
            </span>
            {test.type === "pyp" && test.year && (
              <span className="text-xs text-muted-foreground ml-1">
                • {test.year}
              </span>
            )}
          </div>
        </div>
        <TestStatusBadge status={test.status} />
      </div>

      {/* Test Name */}
      <h4 className="font-semibold text-foreground text-sm sm:text-base leading-tight mb-1.5">
        {test.name}
      </h4>

      {/* Session (for PYPs) */}
      {test.session && (
        <p className="text-xs text-muted-foreground mb-2">{test.session}</p>
      )}

      {/* Subjects Pills */}
      {test.subjects && test.subjects.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2.5">
          {test.subjects.map((subject) => (
            <span
              key={subject}
              className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-medium"
            >
              {getSubjectDisplayName(subject)}
            </span>
          ))}
        </div>
      )}

      {/* Stats Row */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mb-3">
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
        <div
          className={cn(
            "flex items-center gap-1.5 text-xs mb-3 rounded-lg px-2 py-1.5",
            config.bgLight,
            config.color
          )}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>
            {new Date(test.scheduledDate).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
            {test.scheduledTime && `, ${test.scheduledTime}`}
          </span>
        </div>
      )}

      {/* Results (for attempted) */}
      {test.status === "attempted" && (
        <div
          className={cn(
            "rounded-lg px-2.5 py-2 mb-3",
            config.bgLight
          )}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Score</span>
            <span className={cn("text-sm font-bold", config.color)}>
              {test.score}/{test.totalMarks}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {test.percentile !== undefined && (
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="font-medium">{test.percentile}%ile</span>
              </span>
            )}
            {test.rank !== undefined && (
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="font-medium">Rank {test.rank}</span>
              </span>
            )}
            {test.totalAttempts !== undefined && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Users className="w-3.5 h-3.5" />
                <span>{test.totalAttempts.toLocaleString()}</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="flex justify-end">{getActionButton()}</div>
    </div>
  );
});

export default GrandTestCard;
