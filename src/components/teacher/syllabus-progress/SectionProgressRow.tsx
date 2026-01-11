import { MapPin, Clock, AlertCircle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChapterDotsIndicator } from "./ChapterDotsIndicator";
import type { SectionProgress } from "@/hooks/useTeacherSyllabusProgress";

interface SectionProgressRowProps {
  section: SectionProgress;
  onTap?: () => void;
  onConfirmTap?: () => void;
}

export function SectionProgressRow({ section, onTap, onConfirmTap }: SectionProgressRowProps) {
  const statusColors = {
    ahead: "border-l-blue-500 bg-blue-50/30",
    on_track: "border-l-emerald-500 bg-emerald-50/30",
    lagging: "border-l-amber-500 bg-amber-50/30",
    critical: "border-l-red-500 bg-red-50/30",
  };

  const statusBadgeColors = {
    ahead: "bg-blue-100 text-blue-700",
    on_track: "bg-emerald-100 text-emerald-700",
    lagging: "bg-amber-100 text-amber-700",
    critical: "bg-red-100 text-red-700",
  };

  const statusLabels = {
    ahead: "Ahead",
    on_track: "On Track",
    lagging: "Behind",
    critical: "Critical",
  };

  const handleConfirmClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onConfirmTap?.();
  };

  return (
    <div
      className={cn(
        "border-l-4 rounded-lg p-3 sm:p-4 transition-all cursor-pointer hover:shadow-md active:scale-[0.99]",
        "bg-card border border-border/50",
        statusColors[section.status]
      )}
      onClick={onTap}
      role="button"
      tabIndex={0}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-foreground truncate">
              {section.batchName}
            </h4>
            <span className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full shrink-0",
              statusBadgeColors[section.status]
            )}>
              {statusLabels[section.status]}
            </span>
          </div>
        </div>
        
        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
      </div>

      {/* Chapter Dots */}
      <div className="flex items-center gap-2 mb-3">
        <ChapterDotsIndicator
          totalChapters={section.totalChapters}
          completedChapters={section.completedChapters}
          currentChapterIndex={section.completedChapters}
        />
        <span className="text-sm text-muted-foreground shrink-0">
          {section.completedChapters}/{section.totalChapters}
        </span>
      </div>

      {/* Current Chapter */}
      <div className="flex items-start gap-2 mb-3">
        <MapPin className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
        <div className="min-w-0 flex-1">
          <span className="text-xs text-muted-foreground">Now Teaching</span>
          <p className="text-sm font-medium text-foreground truncate">
            Ch.{section.completedChapters + 1}: {section.currentChapterName}
          </p>
        </div>
      </div>

      {/* Hours Progress + Pending Action */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 shrink-0">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-sm">
            <span className="font-semibold text-foreground">{section.hoursTaken}h</span>
            <span className="text-muted-foreground"> / {section.hoursAllotted}h</span>
          </span>
        </div>
        
        {/* Progress Bar Mini */}
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              section.status === "ahead" && "bg-blue-500",
              section.status === "on_track" && "bg-emerald-500",
              section.status === "lagging" && "bg-amber-500",
              section.status === "critical" && "bg-red-500"
            )}
            style={{ width: `${section.percentComplete}%` }}
          />
        </div>
        <span className="text-xs font-medium text-muted-foreground shrink-0">
          {section.percentComplete}%
        </span>

        {/* Pending Confirmation Button */}
        {section.pendingConfirmations > 0 && (
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-2.5 gap-1.5 bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 hover:text-amber-800 shrink-0"
            onClick={handleConfirmClick}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">{section.pendingConfirmations} Pending</span>
          </Button>
        )}
      </div>
    </div>
  );
}
