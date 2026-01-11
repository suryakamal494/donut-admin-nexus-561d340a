import { useState } from "react";
import {
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Trophy,
  Timer,
  Target,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { TestSubmission } from "@/data/teacher/submissions";
import { SubmissionViewerDialog } from "./SubmissionViewerDialog";

interface TestSubmissionListProps {
  submissions: TestSubmission[];
  filter: 'all' | 'submitted' | 'pending' | 'late' | 'graded';
}

const completionStatusConfig = {
  completed: { label: "Completed", className: "bg-green-100 text-green-700", icon: CheckCircle2 },
  partial: { label: "Partial", className: "bg-amber-100 text-amber-700", icon: AlertCircle },
  not_started: { label: "Not Started", className: "bg-muted text-muted-foreground", icon: Clock },
};

function getScoreColor(percentage: number) {
  if (percentage >= 80) return "text-green-600";
  if (percentage >= 60) return "text-amber-600";
  if (percentage >= 40) return "text-orange-600";
  return "text-red-600";
}

function getScoreBgColor(percentage: number) {
  if (percentage >= 80) return "bg-green-50";
  if (percentage >= 60) return "bg-amber-50";
  if (percentage >= 40) return "bg-orange-50";
  return "bg-red-50";
}

export function TestSubmissionList({ submissions, filter }: TestSubmissionListProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<TestSubmission | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const filteredSubmissions = submissions.filter(s => {
    if (filter === 'all') return true;
    if (filter === 'submitted') return s.completionStatus !== 'not_started';
    if (filter === 'pending') return s.completionStatus === 'not_started';
    return s.status === filter;
  });

  // Sort by score (highest first)
  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => b.percentage - a.percentage);

  const handleView = (submission: TestSubmission) => {
    setSelectedSubmission(submission);
    setViewerOpen(true);
  };

  if (sortedSubmissions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No test results found</p>
      </div>
    );
  }

  // Calculate class stats
  const completedSubmissions = sortedSubmissions.filter(s => s.completionStatus === 'completed');
  const avgScore = completedSubmissions.length > 0
    ? Math.round(completedSubmissions.reduce((sum, s) => sum + s.percentage, 0) / completedSubmissions.length)
    : 0;
  const topScore = completedSubmissions.length > 0 
    ? Math.max(...completedSubmissions.map(s => s.percentage))
    : 0;

  return (
    <>
      {/* Quick Stats */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Badge variant="outline" className="gap-1 py-1 px-2">
          <Trophy className="w-3 h-3 text-amber-500" />
          Top: {topScore}%
        </Badge>
        <Badge variant="outline" className="gap-1 py-1 px-2">
          <Target className="w-3 h-3 text-blue-500" />
          Avg: {avgScore}%
        </Badge>
        <Badge variant="outline" className="gap-1 py-1 px-2">
          <CheckCircle2 className="w-3 h-3 text-green-500" />
          {completedSubmissions.length}/{sortedSubmissions.length}
        </Badge>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {sortedSubmissions.map((submission, index) => {
          const status = completionStatusConfig[submission.completionStatus];
          const StatusIcon = status.icon;

          return (
            <Card key={submission.id} className={cn(
              "overflow-hidden",
              submission.completionStatus === "not_started" && "opacity-60"
            )}>
              <CardContent className="p-3">
                {/* Header: Student + Score */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    {index < 3 && submission.completionStatus === 'completed' && (
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                        index === 0 && "bg-amber-100 text-amber-700",
                        index === 1 && "bg-gray-200 text-gray-700",
                        index === 2 && "bg-orange-100 text-orange-700",
                      )}>
                        {index + 1}
                      </div>
                    )}
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
                  {submission.completionStatus !== 'not_started' ? (
                    <div className={cn(
                      "inline-flex items-center gap-1 px-2 py-1 rounded-lg shrink-0",
                      getScoreBgColor(submission.percentage)
                    )}>
                      <span className={cn("text-sm font-bold", getScoreColor(submission.percentage))}>
                        {submission.percentage}%
                      </span>
                    </div>
                  ) : (
                    <Badge className={cn("text-xs gap-1 shrink-0", status.className)}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </Badge>
                  )}
                </div>

                {/* Details */}
                {submission.completionStatus !== 'not_started' && (
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 mb-3 text-xs">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                      {submission.correctAnswers}
                    </span>
                    <span className="flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5 text-red-600" />
                      {submission.wrongAnswers}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Timer className="w-3.5 h-3.5" />
                      {submission.timeTaken} min
                    </span>
                    <span className="text-muted-foreground ml-auto">
                      {submission.attemptedQuestions}/{submission.totalQuestions} Q
                    </span>
                  </div>
                )}

                {/* Footer: Status + Action */}
                <div className="flex items-center justify-between">
                  <Badge className={cn("text-xs gap-1", status.className)}>
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </Badge>
                  {submission.completionStatus !== 'not_started' && (
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
              <div className="col-span-2">Score</div>
              <div className="col-span-2">Time</div>
              <div className="col-span-2">Answers</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1 text-right">Action</div>
            </div>

            {/* Rows */}
            <div className="space-y-1">
              {sortedSubmissions.map((submission, index) => {
                const status = completionStatusConfig[submission.completionStatus];
                const StatusIcon = status.icon;

                return (
                  <div
                    key={submission.id}
                    className={cn(
                      "grid grid-cols-12 gap-2 px-3 py-3 rounded-lg items-center",
                      "hover:bg-muted/30 transition-colors",
                      submission.completionStatus === "not_started" && "opacity-60"
                    )}
                  >
                    {/* Student with rank */}
                    <div className="col-span-3 flex items-center gap-2 min-w-0">
                      {index < 3 && submission.completionStatus === 'completed' && (
                        <div className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                          index === 0 && "bg-amber-100 text-amber-700",
                          index === 1 && "bg-gray-200 text-gray-700",
                          index === 2 && "bg-orange-100 text-orange-700",
                        )}>
                          {index + 1}
                        </div>
                      )}
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

                    {/* Score */}
                    <div className="col-span-2">
                      {submission.completionStatus !== 'not_started' ? (
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-2 py-1 rounded-lg",
                          getScoreBgColor(submission.percentage)
                        )}>
                          <span className={cn("text-sm font-semibold", getScoreColor(submission.percentage))}>
                            {submission.score}/{submission.maxScore}
                          </span>
                          <span className={cn("text-xs", getScoreColor(submission.percentage))}>
                            ({submission.percentage}%)
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </div>

                    {/* Time Taken */}
                    <div className="col-span-2">
                      {submission.timeTaken > 0 ? (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Timer className="w-3.5 h-3.5" />
                          {submission.timeTaken} min
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </div>

                    {/* Answers Breakdown */}
                    <div className="col-span-2">
                      {submission.completionStatus !== 'not_started' ? (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-green-600 flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" />
                            {submission.correctAnswers}
                          </span>
                          <span className="text-red-600 flex items-center gap-0.5">
                            <XCircle className="w-3 h-3" />
                            {submission.wrongAnswers}
                          </span>
                          <span className="text-muted-foreground">
                            {submission.attemptedQuestions}/{submission.totalQuestions}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <Badge className={cn("text-xs gap-1", status.className)}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </Badge>
                    </div>

                    {/* Action */}
                    <div className="col-span-1 text-right">
                      {submission.completionStatus !== 'not_started' && (
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
        type="test"
      />
    </>
  );
}
