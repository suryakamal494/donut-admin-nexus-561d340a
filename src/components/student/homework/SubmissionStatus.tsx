// Submission Status Display - Shows grade, feedback, and submission details

import { memo } from "react";
import { format, parseISO } from "date-fns";
import { CheckCircle2, Clock, Star, MessageSquare, FileText, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HomeworkItem } from "@/data/student/lessonBundles";

interface SubmissionStatusProps {
  homework: HomeworkItem;
  className?: string;
}

export const SubmissionStatus = memo(function SubmissionStatus({
  homework,
  className,
}: SubmissionStatusProps) {
  const { submissionStatus, submittedAt, grade, maxGrade, feedback, submissionFiles, submissionText, submissionLink } = homework;

  if (!submissionStatus || submissionStatus === 'pending') return null;

  const statusConfig = {
    submitted: {
      icon: Clock,
      label: "Submitted",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    graded: {
      icon: CheckCircle2,
      label: "Graded",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
    late: {
      icon: Clock,
      label: "Late Submission",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
  };

  const config = statusConfig[submissionStatus];
  const StatusIcon = config.icon;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Status Header */}
      <div className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg border",
        config.bgColor,
        config.borderColor
      )}>
        <StatusIcon className={cn("w-4 h-4", config.color)} />
        <span className={cn("text-sm font-medium", config.color)}>
          {config.label}
        </span>
        {submittedAt && (
          <span className="text-xs text-muted-foreground ml-auto">
            {format(parseISO(submittedAt), "MMM d, h:mm a")}
          </span>
        )}
      </div>

      {/* Grade Display */}
      {submissionStatus === 'graded' && grade !== undefined && maxGrade !== undefined && (
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-lg border border-emerald-200">
          <div className="flex items-center gap-1.5">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span className="text-2xl font-bold text-emerald-700">{grade}</span>
            <span className="text-sm text-muted-foreground">/ {maxGrade}</span>
          </div>
          <div className="ml-auto text-right">
            <div className="text-xs text-muted-foreground">Score</div>
            <div className="text-sm font-semibold text-emerald-600">
              {Math.round((grade / maxGrade) * 100)}%
            </div>
          </div>
        </div>
      )}

      {/* Teacher Feedback */}
      {feedback && (
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center gap-1.5 mb-2">
            <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-xs font-medium text-slate-600">Teacher Feedback</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{feedback}</p>
        </div>
      )}

      {/* Submitted Content Preview */}
      <div className="space-y-2">
        <span className="text-xs font-medium text-muted-foreground">Your Submission</span>
        
        {/* Files */}
        {submissionFiles && submissionFiles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {submissionFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 px-2 py-1 bg-white rounded border text-xs"
              >
                <FileText className="w-3 h-3 text-blue-500" />
                <span className="truncate max-w-[120px]">{file.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Text Answer */}
        {submissionText && (
          <div className="p-2 bg-white rounded border text-sm text-muted-foreground line-clamp-2">
            {submissionText}
          </div>
        )}

        {/* Link */}
        {submissionLink && (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded border text-xs text-blue-600">
            <Link2 className="w-3 h-3" />
            <span className="truncate">{submissionLink}</span>
          </div>
        )}
      </div>
    </div>
  );
});

SubmissionStatus.displayName = "SubmissionStatus";
export default SubmissionStatus;
