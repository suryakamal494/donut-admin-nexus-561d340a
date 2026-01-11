import { useState } from "react";
import { Users, Clock, CheckCircle2, AlertCircle, Filter } from "lucide-react";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TeacherHomework, HomeworkType } from "@/data/teacher/types";
import { 
  getSubmissionsForHomework,
  practiceSubmissions,
  testSubmissions,
  projectSubmissions,
} from "@/data/teacher/submissions";
import { PracticeSubmissionList, TestSubmissionList, ProjectSubmissionList } from "./submissions";

interface ReviewSubmissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  homework: TeacherHomework | null;
}

export function ReviewSubmissionsDialog({
  open,
  onOpenChange,
  homework,
}: ReviewSubmissionsDialogProps) {
  const [filter, setFilter] = useState<'all' | 'submitted' | 'pending' | 'late' | 'graded'>('all');

  if (!homework) return null;

  // Get submissions based on homework type
  const homeworkType = homework.homeworkType || 'practice';
  const submissions = getSubmissionsForHomework(homework.id, homeworkType);

  // Calculate stats
  const stats = {
    total: submissions.length,
    submitted: submissions.filter(s => s.status === 'submitted' || s.status === 'graded').length,
    pending: submissions.filter(s => s.status === 'pending').length,
    late: submissions.filter(s => s.status === 'late').length,
    graded: submissions.filter(s => s.status === 'graded').length,
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={homework.title}
      description={`${homework.subject} • ${homework.batchName} • Due: ${new Date(homework.dueDate).toLocaleDateString()}`}
      className="max-w-4xl"
    >
      <div className="space-y-4">
        {/* Summary Stats */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="gap-1.5 py-1">
            <Users className="w-3 h-3" />
            {stats.total} Students
          </Badge>
          <Badge variant="outline" className="gap-1.5 py-1 bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="w-3 h-3" />
            {stats.submitted} Submitted
          </Badge>
          <Badge variant="outline" className="gap-1.5 py-1 bg-muted text-muted-foreground">
            <Clock className="w-3 h-3" />
            {stats.pending} Pending
          </Badge>
          {stats.late > 0 && (
            <Badge variant="outline" className="gap-1.5 py-1 bg-amber-50 text-amber-700 border-amber-200">
              <AlertCircle className="w-3 h-3" />
              {stats.late} Late
            </Badge>
          )}
        </div>

        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="w-full">
          <TabsList className="w-full h-auto p-1 flex overflow-x-auto">
            <TabsTrigger value="all" className="flex-1 min-w-[60px]">All</TabsTrigger>
            <TabsTrigger value="submitted" className="flex-1 min-w-[80px]">Submitted</TabsTrigger>
            <TabsTrigger value="pending" className="flex-1 min-w-[70px]">Pending</TabsTrigger>
            <TabsTrigger value="late" className="flex-1 min-w-[60px]">Late</TabsTrigger>
            <TabsTrigger value="graded" className="flex-1 min-w-[70px]">Graded</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Type-specific submission list */}
        <div className="min-h-[300px]">
          {homeworkType === 'practice' && (
            <PracticeSubmissionList 
              submissions={practiceSubmissions.filter(s => s.homeworkId === homework.id).length > 0 
                ? practiceSubmissions.filter(s => s.homeworkId === homework.id)
                : practiceSubmissions // Fallback to all for demo
              } 
              filter={filter} 
            />
          )}
          {homeworkType === 'test' && (
            <TestSubmissionList 
              submissions={testSubmissions.filter(s => s.homeworkId === homework.id).length > 0
                ? testSubmissions.filter(s => s.homeworkId === homework.id)
                : testSubmissions
              } 
              filter={filter} 
            />
          )}
          {homeworkType === 'project' && (
            <ProjectSubmissionList 
              submissions={projectSubmissions.filter(s => s.homeworkId === homework.id).length > 0
                ? projectSubmissions.filter(s => s.homeworkId === homework.id)
                : projectSubmissions
              } 
              filter={filter} 
            />
          )}
        </div>
      </div>
    </ResponsiveDialog>
  );
}
