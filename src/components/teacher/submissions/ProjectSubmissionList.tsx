import { useState } from "react";
import {
  FileText,
  Presentation,
  FileImage,
  FileVideo,
  FileArchive,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  FolderOpen,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { ProjectSubmission, SubmissionStatus } from "@/data/teacher/submissions";
import { SubmissionViewerDialog } from "./SubmissionViewerDialog";

interface ProjectSubmissionListProps {
  submissions: ProjectSubmission[];
  filter: 'all' | 'submitted' | 'pending' | 'late' | 'graded';
}

const statusConfig: Record<SubmissionStatus, { label: string; className: string; icon: typeof Clock }> = {
  pending: { label: "Pending", className: "bg-muted text-muted-foreground", icon: Clock },
  submitted: { label: "Submitted", className: "bg-blue-100 text-blue-700", icon: CheckCircle2 },
  graded: { label: "Graded", className: "bg-green-100 text-green-700", icon: CheckCircle2 },
  late: { label: "Late", className: "bg-amber-100 text-amber-700", icon: AlertCircle },
};

const fileTypeIcons = {
  ppt: Presentation,
  pdf: FileText,
  doc: FileText,
  zip: FileArchive,
  image: FileImage,
  video: FileVideo,
};

const fileTypeColors = {
  ppt: "bg-orange-50 text-orange-600",
  pdf: "bg-red-50 text-red-600",
  doc: "bg-blue-50 text-blue-600",
  zip: "bg-purple-50 text-purple-600",
  image: "bg-green-50 text-green-600",
  video: "bg-pink-50 text-pink-600",
};

export function ProjectSubmissionList({ submissions, filter }: ProjectSubmissionListProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<ProjectSubmission | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const filteredSubmissions = submissions.filter(s => {
    if (filter === 'all') return true;
    return s.status === filter;
  });

  const handleView = (submission: ProjectSubmission) => {
    setSelectedSubmission(submission);
    setViewerOpen(true);
  };

  if (filteredSubmissions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No project submissions found</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {filteredSubmissions.map((submission) => {
          const status = statusConfig[submission.status];
          const StatusIcon = status.icon;

          return (
            <Card key={submission.id} className={cn(
              "overflow-hidden",
              submission.status === "pending" && "opacity-60"
            )}>
              <CardContent className="p-3">
                {/* Header: Student + Status */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {submission.studentName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{submission.studentName}</p>
                      <p className="text-xs text-muted-foreground">{submission.rollNumber}</p>
                    </div>
                  </div>
                  <Badge className={cn("text-xs gap-1 shrink-0", status.className)}>
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </Badge>
                </div>

                {/* Project Details */}
                {submission.projectFiles.length > 0 && (
                  <div className="p-2 rounded-lg bg-muted/30 mb-3">
                    {submission.projectTitle && (
                      <p className="text-sm font-medium truncate mb-2">{submission.projectTitle}</p>
                    )}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {submission.projectFiles.slice(0, 3).map((file, idx) => {
                        const FileIcon = fileTypeIcons[file.type];
                        return (
                          <div
                            key={idx}
                            className={cn(
                              "flex items-center gap-1 px-1.5 py-0.5 rounded text-xs",
                              fileTypeColors[file.type]
                            )}
                          >
                            <FileIcon className="w-3 h-3" />
                            <span className="truncate max-w-[60px]">
                              {file.name.length > 8 ? file.name.slice(0, 6) + '...' : file.name}
                            </span>
                          </div>
                        );
                      })}
                      {submission.projectFiles.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{submission.projectFiles.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Footer: Date + Action */}
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    {submission.submittedAt ? (
                      <>Submitted: {new Date(submission.submittedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}</>
                    ) : (
                      "Not submitted"
                    )}
                    {submission.grade !== undefined && (
                      <span className="ml-2 font-medium text-foreground">
                        Grade: {submission.grade}/{submission.maxGrade}
                      </span>
                    )}
                  </div>
                  {submission.status !== "pending" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3"
                      onClick={() => handleView(submission)}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      View
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <ScrollArea className="w-full">
          <div className="min-w-[650px]">
            {/* Header */}
            <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-muted/50 rounded-lg text-xs font-medium text-muted-foreground mb-2">
              <div className="col-span-3">Student</div>
              <div className="col-span-4">Project Files</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Submitted</div>
              <div className="col-span-1 text-right">Action</div>
            </div>

            {/* Rows */}
            <div className="space-y-1">
              {filteredSubmissions.map((submission) => {
                const status = statusConfig[submission.status];
                const StatusIcon = status.icon;

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
                    <div className="col-span-3 flex items-center gap-2 min-w-0">
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

                    {/* Project Files */}
                    <div className="col-span-4 min-w-0">
                      {submission.projectFiles.length > 0 ? (
                        <div className="space-y-1">
                          {submission.projectTitle && (
                            <p className="text-sm font-medium truncate">{submission.projectTitle}</p>
                          )}
                          <div className="flex items-center gap-1 flex-wrap">
                            {submission.projectFiles.slice(0, 3).map((file, idx) => {
                              const FileIcon = fileTypeIcons[file.type];
                              return (
                                <div
                                  key={idx}
                                  className={cn(
                                    "flex items-center gap-1 px-1.5 py-0.5 rounded text-xs",
                                    fileTypeColors[file.type]
                                  )}
                                >
                                  <FileIcon className="w-3 h-3" />
                                  <span className="truncate max-w-[80px]">
                                    {file.name.length > 12 ? file.name.slice(0, 10) + '...' : file.name}
                                  </span>
                                </div>
                              );
                            })}
                            {submission.projectFiles.length > 3 && (
                              <span className="text-xs text-muted-foreground">
                                +{submission.projectFiles.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">No files submitted</span>
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
      </div>

      {/* Submission Viewer Dialog */}
      <SubmissionViewerDialog
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        submission={selectedSubmission}
        type="project"
      />
    </>
  );
}
