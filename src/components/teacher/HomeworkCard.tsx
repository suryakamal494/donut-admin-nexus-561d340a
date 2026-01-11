import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Clock,
  Users,
  Calendar,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Pencil,
  Timer,
  FolderOpen
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { TeacherHomework, HomeworkType } from "@/data/teacherData";

interface HomeworkCardProps {
  homework: TeacherHomework;
  onEdit?: () => void;
  onDelete?: () => void;
  onViewSubmissions?: () => void;
  onViewLessonPlan?: () => void;
}

const getStatusConfig = (status: TeacherHomework["status"]) => {
  switch (status) {
    case "assigned":
      return { 
        label: "Active", 
        className: "bg-blue-100 text-blue-700",
        icon: Clock
      };
    case "overdue":
      return { 
        label: "Overdue", 
        className: "bg-red-100 text-red-700",
        icon: AlertCircle
      };
    case "completed":
      return { 
        label: "Completed", 
        className: "bg-green-100 text-green-700",
        icon: CheckCircle2
      };
    default:
      return { 
        label: status, 
        className: "bg-muted text-muted-foreground",
        icon: Clock
      };
  }
};

// Homework type configuration for badges
const getHomeworkTypeConfig = (type?: HomeworkType) => {
  switch (type) {
    case "practice":
      return {
        label: "Practice",
        icon: Pencil,
        className: "bg-blue-50 text-blue-700 border-blue-200",
      };
    case "test":
      return {
        label: "Test",
        icon: Timer,
        className: "bg-purple-50 text-purple-700 border-purple-200",
      };
    case "project":
      return {
        label: "Project",
        icon: FolderOpen,
        className: "bg-orange-50 text-orange-700 border-orange-200",
      };
    default:
      return null;
  }
};

export const HomeworkCard = ({
  homework,
  onEdit,
  onDelete,
  onViewSubmissions,
  onViewLessonPlan,
}: HomeworkCardProps) => {
  const statusConfig = getStatusConfig(homework.status);
  const StatusIcon = statusConfig.icon;
  const typeConfig = getHomeworkTypeConfig(homework.homeworkType);
  const submissionRate = Math.round((homework.submissionCount / homework.totalStudents) * 100);
  
  const daysUntilDue = Math.ceil(
    (new Date(homework.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className={cn(
      "card-premium group",
      homework.status === "overdue" && "border-red-200"
    )}>
      <CardContent className="p-4">
        {/* Header with status and type badges */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={statusConfig.className}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusConfig.label}
            </Badge>
            
            {/* Homework Type Badge */}
            {typeConfig && (
              <Badge variant="outline" className={cn("gap-1", typeConfig.className)}>
                <typeConfig.icon className="w-3 h-3" />
                {typeConfig.label}
              </Badge>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onViewSubmissions}>
                <Users className="w-4 h-4 mr-2" />
                View Submissions
              </DropdownMenuItem>
              {homework.linkedLessonPlanId && (
                <DropdownMenuItem onClick={onViewLessonPlan}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Lesson Plan
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={onDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
          {homework.title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-3">
          {homework.subject} • {homework.batchName}
        </p>
        
        {/* Due Date */}
        <div className={cn(
          "flex items-center gap-2 text-sm mb-3 p-2 rounded-lg",
          homework.status === "overdue" 
            ? "bg-red-50 text-red-700"
            : daysUntilDue <= 1 
              ? "bg-amber-50 text-amber-700"
              : "bg-muted/50 text-muted-foreground"
        )}>
          <Calendar className="w-4 h-4" />
          <span>
            Due: {new Date(homework.dueDate).toLocaleDateString('en-US', { 
              weekday: 'short',
              month: 'short', 
              day: 'numeric' 
            })}
          </span>
          {homework.status !== "overdue" && homework.status !== "completed" && (
            <span className="ml-auto font-medium">
              {daysUntilDue === 0 ? "Today" : daysUntilDue === 1 ? "Tomorrow" : `${daysUntilDue} days left`}
            </span>
          )}
        </div>
        
        {/* Submission Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-muted-foreground">Submissions</span>
            <span className="font-medium">{homework.submissionCount}/{homework.totalStudents}</span>
          </div>
          <Progress 
            value={submissionRate} 
            className={cn(
              "h-2",
              submissionRate >= 80 ? "[&>div]:bg-green-500" :
              submissionRate >= 50 ? "[&>div]:bg-amber-500" :
              "[&>div]:bg-red-500"
            )}
          />
        </div>
        
        {/* Linked Lesson Plan */}
        {homework.linkedLessonPlanId && (
          <div 
            className="flex items-center gap-2 text-xs text-primary cursor-pointer hover:underline mb-3"
            onClick={onViewLessonPlan}
          >
            <BookOpen className="w-3 h-3" />
            <span>Linked to Lesson Plan</span>
          </div>
        )}
        
        {/* Actions */}
        <Button 
          size="sm" 
          variant="outline" 
          className="w-full"
          onClick={onViewSubmissions}
        >
          <Users className="w-3 h-3 mr-1" />
          Review Submissions ({homework.submissionCount})
        </Button>
      </CardContent>
    </Card>
  );
};