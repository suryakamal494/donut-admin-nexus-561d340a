// Homework Submission Sheet - Main submission dialog (Drawer on mobile, Sheet on desktop)

import { memo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO, isPast } from "date-fns";
import { 
  Calendar, 
  Clock, 
  FileText, 
  PlayCircle, 
  AlertCircle,
  Download,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { PracticeSubmissionForm } from "./PracticeSubmissionForm";
import { ProjectSubmissionForm } from "./ProjectSubmissionForm";
import { SubmissionStatus } from "./SubmissionStatus";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { HomeworkItem } from "@/data/student/lessonBundles";

interface HomeworkSubmissionSheetProps {
  homework: HomeworkItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Haptic feedback helper
const triggerHaptic = () => {
  if (navigator.vibrate) {
    navigator.vibrate(10);
  }
};

export const HomeworkSubmissionSheet = memo(function HomeworkSubmissionSheet({
  homework,
  open,
  onOpenChange,
}: HomeworkSubmissionSheetProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // All hooks must be called before any early returns
  const handlePracticeSubmit = useCallback(async (data: {
    mode: 'file' | 'text' | 'link';
    files?: File[];
    text?: string;
    link?: string;
  }) => {
    if (!homework) return;
    triggerHaptic();
    setIsSubmitting(true);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Homework Submitted! 🎉",
      description: `Your ${data.mode === 'file' ? 'files have' : 'answer has'} been submitted successfully`,
    });
    
    setIsSubmitting(false);
    onOpenChange(false);
  }, [homework, toast, onOpenChange]);

  const handleProjectSubmit = useCallback(async (data: {
    title: string;
    description: string;
    files: File[];
  }) => {
    if (!homework) return;
    triggerHaptic();
    setIsSubmitting(true);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Project Submitted! 🎉",
      description: `"${data.title}" has been submitted with ${data.files.length} files`,
    });
    
    setIsSubmitting(false);
    onOpenChange(false);
  }, [homework, toast, onOpenChange]);

  const handleStartTest = useCallback(() => {
    if (!homework) return;
    triggerHaptic();
    onOpenChange(false);
    // Navigate to test player
    if (homework.testId) {
      navigate(`/student/tests/${homework.testId}`);
    } else {
      navigate(`/student/tests/${homework.id}`);
    }
  }, [homework, navigate, onOpenChange]);

  // Early return AFTER all hooks are declared
  if (!homework) return null;

  const isOverdue = isPast(parseISO(homework.dueDate));
  const isAlreadySubmitted = homework.submissionStatus && homework.submissionStatus !== 'pending';
  const formattedDueDate = format(parseISO(homework.dueDate), "EEEE, MMM d 'at' h:mm a");

  // Footer for test type
  const testFooter = homework.homeworkType === 'test' && !isAlreadySubmitted ? (
    <Button 
      onClick={handleStartTest}
      className="w-full h-12 text-base font-medium bg-gradient-to-r from-cyan-500 to-blue-600"
    >
      <PlayCircle className="w-5 h-5 mr-2" />
      Start Test
    </Button>
  ) : null;

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={homework.title}
      description={homework.description}
      footer={testFooter}
      className="max-w-lg"
    >
      <div className="space-y-4">
        {/* Due Date & Status */}
        <div className="flex flex-wrap items-center gap-3">
          <div className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
            isOverdue 
              ? "bg-red-100 text-red-700" 
              : "bg-emerald-100 text-emerald-700"
          )}>
            {isOverdue ? (
              <AlertCircle className="w-3.5 h-3.5" />
            ) : (
              <Calendar className="w-3.5 h-3.5" />
            )}
            {isOverdue ? "Overdue" : "Due"}: {formattedDueDate}
          </div>
          
          {homework.homeworkType === 'test' && homework.testDuration && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
              <Clock className="w-3.5 h-3.5" />
              {homework.testDuration}
            </div>
          )}
          
          {homework.questionsCount > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
              <FileText className="w-3.5 h-3.5" />
              {homework.questionsCount} questions
            </div>
          )}
        </div>

        {/* Instructions */}
        {homework.instructions && (
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-900">{homework.instructions}</p>
          </div>
        )}

        {/* Teacher Attachments */}
        {homework.attachments && homework.attachments.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-medium text-muted-foreground">Reference Materials</span>
            <div className="flex flex-wrap gap-2">
              {homework.attachments.map((file, idx) => (
                <a
                  key={idx}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-xs font-medium">{file.name}</span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Submission Status (if already submitted) */}
        {isAlreadySubmitted && (
          <SubmissionStatus homework={homework} />
        )}

        {/* Submission Forms (if not submitted) */}
        {!isAlreadySubmitted && (
          <>
            {homework.homeworkType === 'practice' && (
              <PracticeSubmissionForm
                onSubmit={handlePracticeSubmit}
                isSubmitting={isSubmitting}
              />
            )}

            {homework.homeworkType === 'project' && (
              <ProjectSubmissionForm
                onSubmit={handleProjectSubmit}
                isSubmitting={isSubmitting}
              />
            )}

            {homework.homeworkType === 'test' && (
              <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-200 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <PlayCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold">Online Test</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    This homework requires you to take an online test. 
                    Make sure you have a stable internet connection.
                  </p>
                </div>
                {homework.testDuration && (
                  <div className="text-sm text-cyan-700 font-medium">
                    Duration: {homework.testDuration}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </ResponsiveDialog>
  );
});

HomeworkSubmissionSheet.displayName = "HomeworkSubmissionSheet";
export default HomeworkSubmissionSheet;
