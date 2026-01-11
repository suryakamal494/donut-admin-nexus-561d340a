import { useState } from "react";
import {
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Type,
  Download,
  ExternalLink,
  CheckCircle2,
  Clock,
  Star,
  Send,
  Presentation,
  FileVideo,
  Target,
  Timer,
  Trophy,
  XCircle,
} from "lucide-react";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { 
  PracticeSubmission, 
  TestSubmission, 
  ProjectSubmission,
  HomeworkSubmission 
} from "@/data/teacher/submissions";

interface SubmissionViewerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission: HomeworkSubmission | null;
  type: 'practice' | 'test' | 'project';
}

export function SubmissionViewerDialog({
  open,
  onOpenChange,
  submission,
  type,
}: SubmissionViewerDialogProps) {
  const [grade, setGrade] = useState(submission?.grade?.toString() || "");
  const [feedback, setFeedback] = useState(submission?.feedback || "");

  if (!submission) return null;

  const handleSaveGrade = () => {
    // In a real app, this would save to backend
    console.log("Saving grade:", { grade, feedback, submissionId: submission.id });
    onOpenChange(false);
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Submission Details"
      description={`${submission.studentName} • ${submission.rollNumber}`}
      className="max-w-2xl"
      footer={
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 sm:flex-none">
            Close
          </Button>
          <Button onClick={handleSaveGrade} className="flex-1 sm:flex-none gap-2">
            <Send className="w-4 h-4" />
            Save & Send Feedback
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Student Header */}
        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="text-sm bg-primary/10 text-primary">
              {submission.studentName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{submission.studentName}</p>
            <p className="text-sm text-muted-foreground">
              {submission.rollNumber} • Submitted: {submission.submittedAt 
                ? new Date(submission.submittedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Not yet'
              }
            </p>
          </div>
          <Badge 
            className={cn(
              "ml-auto",
              submission.status === 'submitted' && "bg-blue-100 text-blue-700",
              submission.status === 'graded' && "bg-green-100 text-green-700",
              submission.status === 'late' && "bg-amber-100 text-amber-700",
              submission.status === 'pending' && "bg-muted text-muted-foreground",
            )}
          >
            {submission.status === 'graded' ? 'Graded' : 
             submission.status === 'late' ? 'Late Submission' :
             submission.status === 'submitted' ? 'Submitted' : 'Pending'}
          </Badge>
        </div>

        <Separator />

        {/* Type-specific content */}
        {type === 'practice' && <PracticeContent submission={submission as PracticeSubmission} />}
        {type === 'test' && <TestContent submission={submission as TestSubmission} />}
        {type === 'project' && <ProjectContent submission={submission as ProjectSubmission} />}

        <Separator />

        {/* Grading Section */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" />
            Grade & Feedback
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="grade"
                  type="number"
                  placeholder="0"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-20"
                />
                <span className="text-muted-foreground">/ {submission.maxGrade || 100}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Feedback</Label>
            <Textarea
              id="feedback"
              placeholder="Add your feedback for the student..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </div>
    </ResponsiveDialog>
  );
}

// Practice Submission Content
function PracticeContent({ submission }: { submission: PracticeSubmission }) {
  return (
    <div className="space-y-4">
      <h4 className="font-semibold">Submitted Work</h4>
      
      {submission.submissionType === 'file' && (
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium">{submission.fileName}</p>
              <p className="text-sm text-muted-foreground">{submission.fileSize}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <ExternalLink className="w-3 h-3" />
              Preview
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="w-3 h-3" />
              Download
            </Button>
          </div>
        </div>
      )}

      {submission.submissionType === 'image' && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {submission.imageUrls?.map((url, idx) => (
              <div key={idx} className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
                <span className="text-xs text-muted-foreground ml-1">Image {idx + 1}</span>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="gap-1 w-full">
            <Download className="w-3 h-3" />
            Download All Images
          </Button>
        </div>
      )}

      {submission.submissionType === 'text' && (
        <div className="p-4 bg-muted/30 rounded-lg">
          <p className="text-sm whitespace-pre-wrap">{submission.textAnswer}</p>
        </div>
      )}

      {submission.submissionType === 'link' && (
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <LinkIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium">External Link</p>
              <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                {submission.linkUrl}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-1" asChild>
            <a href={submission.linkUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3 h-3" />
              Open
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}

// Test Submission Content
function TestContent({ submission }: { submission: TestSubmission }) {
  const scoreColor = submission.percentage >= 80 ? "text-green-600" : 
                     submission.percentage >= 60 ? "text-amber-600" : "text-red-600";

  return (
    <div className="space-y-4">
      <h4 className="font-semibold">Test Results</h4>
      
      {/* Score Card */}
      <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Score</p>
            <p className={cn("text-3xl font-bold", scoreColor)}>
              {submission.score}/{submission.maxScore}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Percentage</p>
            <p className={cn("text-3xl font-bold", scoreColor)}>
              {submission.percentage}%
            </p>
          </div>
        </div>
        <Progress value={submission.percentage} className="mt-3 h-2" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-muted/30 rounded-lg text-center">
          <Timer className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
          <p className="text-lg font-semibold">{submission.timeTaken} min</p>
          <p className="text-xs text-muted-foreground">Time Taken</p>
        </div>
        <div className="p-3 bg-muted/30 rounded-lg text-center">
          <Target className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
          <p className="text-lg font-semibold">{submission.attemptedQuestions}/{submission.totalQuestions}</p>
          <p className="text-xs text-muted-foreground">Attempted</p>
        </div>
        <div className="p-3 bg-green-50 rounded-lg text-center">
          <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-green-600" />
          <p className="text-lg font-semibold text-green-600">{submission.correctAnswers}</p>
          <p className="text-xs text-green-600">Correct</p>
        </div>
        <div className="p-3 bg-red-50 rounded-lg text-center">
          <XCircle className="w-5 h-5 mx-auto mb-1 text-red-600" />
          <p className="text-lg font-semibold text-red-600">{submission.wrongAnswers}</p>
          <p className="text-xs text-red-600">Wrong</p>
        </div>
      </div>

      <Button variant="outline" className="w-full gap-2">
        <ExternalLink className="w-4 h-4" />
        View Detailed Answer Sheet
      </Button>
    </div>
  );
}

// Project Submission Content
function ProjectContent({ submission }: { submission: ProjectSubmission }) {
  const fileIcons: Record<string, typeof FileText> = {
    ppt: Presentation,
    pdf: FileText,
    doc: FileText,
    video: FileVideo,
    image: ImageIcon,
  };

  const fileColors: Record<string, string> = {
    ppt: "bg-orange-100 text-orange-600",
    pdf: "bg-red-100 text-red-600",
    doc: "bg-blue-100 text-blue-600",
    video: "bg-pink-100 text-pink-600",
    image: "bg-green-100 text-green-600",
    zip: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="space-y-4">
      {submission.projectTitle && (
        <div>
          <h4 className="font-semibold">{submission.projectTitle}</h4>
          {submission.description && (
            <p className="text-sm text-muted-foreground mt-1">{submission.description}</p>
          )}
        </div>
      )}
      
      <div>
        <h4 className="font-semibold mb-3">Project Files ({submission.projectFiles.length})</h4>
        <div className="space-y-2">
          {submission.projectFiles.map((file, idx) => {
            const FileIcon = fileIcons[file.type] || FileText;
            return (
              <div 
                key={idx}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg", fileColors[file.type] || "bg-gray-100 text-gray-600")}>
                    <FileIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Button variant="outline" className="w-full gap-2">
        <Download className="w-4 h-4" />
        Download All Files
      </Button>
    </div>
  );
}
