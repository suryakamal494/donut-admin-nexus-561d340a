import { useState } from "react";
import {
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Type,
  Eye,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { PracticeSubmission, SubmissionStatus } from "@/data/teacher/submissions";
import { SubmissionViewerDialog } from "./SubmissionViewerDialog";

interface PracticeSubmissionListProps {
  submissions: PracticeSubmission[];
  filter: 'all' | 'submitted' | 'pending' | 'late' | 'graded';
}

const statusConfig: Record<SubmissionStatus, { label: string; className: string; icon: typeof Clock }> = {
  pending: { label: "Pending", className: "bg-muted text-muted-foreground", icon: Clock },
  submitted: { label: "Submitted", className: "bg-blue-100 text-blue-700", icon: CheckCircle2 },
  graded: { label: "Graded", className: "bg-green-100 text-green-700", icon: CheckCircle2 },
  late: { label: "Late", className: "bg-amber-100 text-amber-700", icon: AlertCircle },
};

const submissionTypeIcons = {
  file: FileText,
  image: ImageIcon,
  link: LinkIcon,
  text: Type,
};

export function PracticeSubmissionList({ submissions, filter }: PracticeSubmissionListProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<PracticeSubmission | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const filteredSubmissions = submissions.filter(s => {
    if (filter === 'all') return true;
    return s.status === filter;
  });

  const handleView = (submission: PracticeSubmission) => {
    setSelectedSubmission(submission);
    setViewerOpen(true);
  };

  if (filteredSubmissions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No submissions found</p>
      </div>
    );
  }

  return (
    <>
      <ScrollArea className="w-full">
        <div className="min-w-[600px]">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-muted/50 rounded-lg text-xs font-medium text-muted-foreground mb-2">
            <div className="col-span-4">Student</div>
            <div className="col-span-3">Submission</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Submitted</div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          {/* Rows */}
          <div className="space-y-1">
            {filteredSubmissions.map((submission) => {
              const status = statusConfig[submission.status];
              const StatusIcon = status.icon;
              const TypeIcon = submissionTypeIcons[submission.submissionType];

              return (
                <div
                  key={submission.id}
                  className={cn(
                    "grid grid-cols-12 gap-2 px-3 py-3 rounded-lg items-center",
                    "hover:bg-muted/30 transition-colors",
                    submission.status === "pending" && "opacity-60"
                  )}
                >
                  {/* Student */}
                  <div className="col-span-4 flex items-center gap-2 min-w-0">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {submission.studentName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{submission.studentName}</p>
                      <p className="text-xs text-muted-foreground">{submission.rollNumber}</p>
                    </div>
                  </div>

                  {/* Submission Type & File */}
                  <div className="col-span-3 flex items-center gap-2 min-w-0">
                    {submission.status !== "pending" ? (
                      <>
                        <div className={cn(
                          "p-1.5 rounded shrink-0",
                          submission.submissionType === "file" && "bg-blue-50 text-blue-600",
                          submission.submissionType === "image" && "bg-purple-50 text-purple-600",
                          submission.submissionType === "link" && "bg-green-50 text-green-600",
                          submission.submissionType === "text" && "bg-amber-50 text-amber-600",
                        )}>
                          <TypeIcon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm truncate">
                            {submission.fileName || submission.submissionType}
                          </p>
                          {submission.fileSize && (
                            <p className="text-xs text-muted-foreground">{submission.fileSize}</p>
                          )}
                        </div>
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground">Not submitted</span>
                    )}
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <Badge className={cn("text-xs gap-1", status.className)}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </Badge>
                    {submission.grade !== undefined && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {submission.grade}/{submission.maxGrade}
                      </p>
                    )}
                  </div>

                  {/* Submitted Date */}
                  <div className="col-span-2 text-sm text-muted-foreground">
                    {submission.submittedAt ? (
                      <span>{new Date(submission.submittedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}</span>
                    ) : (
                      <span>-</span>
                    )}
                  </div>

                  {/* Action */}
                  <div className="col-span-1 text-right">
                    {submission.status !== "pending" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleView(submission)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Submission Viewer Dialog */}
      <SubmissionViewerDialog
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        submission={selectedSubmission}
        type="practice"
      />
    </>
  );
}
