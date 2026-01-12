import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStatusConfig, SUBJECT_COLORS, SubjectProgressInfo } from "./types";

interface BatchProgressHeaderProps {
  batchName: string;
  className: string;
  overallProgress: number;
  status: string;
  pendingCount: number;
  subjects: SubjectProgressInfo[];
  selectedSubject: string | null;
  onSubjectChange: (subjectId: string) => void;
  onBack: () => void;
}

const StatusIcons = {
  ahead: TrendingUp,
  completed: TrendingUp,
  on_track: CheckCircle,
  in_progress: CheckCircle,
  lagging: TrendingDown,
  critical: AlertTriangle,
  not_started: AlertTriangle,
};

export function BatchProgressHeader({
  batchName,
  className,
  overallProgress,
  status,
  pendingCount,
  subjects,
  selectedSubject,
  onSubjectChange,
  onBack,
}: BatchProgressHeaderProps) {
  const statusConfig = getStatusConfig(status);
  const StatusIcon = StatusIcons[status as keyof typeof StatusIcons] || Clock;

  return (
    <>
      {/* Back & Overall Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          All Batches
        </Button>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Overall Progress</p>
            <p className="text-2xl font-bold">{overallProgress}%</p>
          </div>
          <Badge className={cn("gap-1.5 text-sm py-1.5 px-3", statusConfig.color)}>
            <StatusIcon className="w-4 h-4" />
            {statusConfig.label}
          </Badge>
          {pendingCount > 0 && (
            <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-300 bg-amber-50">
              <Clock className="w-4 h-4" />
              {pendingCount} Pending
            </Badge>
          )}
        </div>
      </div>

      {/* Subject Selection Pills */}
      {subjects.length > 0 ? (
        <div className="flex items-center gap-2 flex-wrap">
          {subjects.map((subject) => {
            const colors = SUBJECT_COLORS[subject.subjectId] || { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200" };
            const isSelected = selectedSubject === subject.subjectId;
            return (
              <button
                key={subject.subjectId}
                onClick={() => onSubjectChange(subject.subjectId)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all border-2",
                  isSelected
                    ? `${colors.bg} ${colors.text} ${colors.border} shadow-sm`
                    : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted"
                )}
              >
                {subject.subjectName}
                <span className="ml-2 text-xs opacity-70">{subject.percentComplete}%</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="p-4 rounded-lg border-amber-200 bg-amber-50/30">
          <p className="text-sm text-amber-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            No subjects configured for this batch. Please configure subjects in Setup.
          </p>
        </div>
      )}
    </>
  );
}
