import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  Play, 
  HelpCircle, 
  ClipboardList,
  Clock,
  Calendar,
  Users,
  MoreVertical,
  Copy,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { type LessonPlan } from "@/data/teacherData";
import { useIsMobile } from "@/hooks/use-mobile";

interface LessonPlanCardProps {
  plan: LessonPlan;
  onClone?: (plan: LessonPlan) => void;
  onDelete?: (plan: LessonPlan) => void;
}

const blockTypeIcons = {
  explain: BookOpen,
  demonstrate: Play,
  quiz: HelpCircle,
  homework: ClipboardList,
};

const blockTypeLabels = {
  explain: "Explain",
  demonstrate: "Demo",
  quiz: "Quiz",
  homework: "HW",
};

export const LessonPlanCard = ({ plan, onClone, onDelete }: LessonPlanCardProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Calculate block counts by type
  const blockCounts = plan.blocks.reduce((acc, block) => {
    const type = block.type as keyof typeof blockTypeIcons;
    if (type in blockTypeIcons) {
      acc[type] = (acc[type] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Get total duration
  const totalDuration = plan.blocks.reduce((sum, block) => sum + (block.duration || 0), 0);

  // Get status config
  const getStatusConfig = (status: LessonPlan["status"]) => {
    switch (status) {
      case "draft":
        return { 
          label: "Draft", 
          className: "bg-amber-50 text-amber-700 border-amber-200",
          dotColor: "bg-amber-500"
        };
      case "ready":
        return { 
          label: "Ready", 
          className: "bg-emerald-50 text-emerald-700 border-emerald-200",
          dotColor: "bg-emerald-500"
        };
      case "used":
        return { 
          label: "Used", 
          className: "bg-blue-50 text-blue-700 border-blue-200",
          icon: CheckCircle2,
          dotColor: "bg-blue-500"
        };
      default:
        return { label: status, className: "bg-muted text-muted-foreground", dotColor: "bg-muted-foreground" };
    }
  };

  const statusConfig = getStatusConfig(plan.status);
  const StatusIcon = statusConfig.icon;

  const handleViewPlan = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/teacher/lesson-plans/${plan.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/teacher/lesson-plans/${plan.id}`);
  };

  const handleClone = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClone?.(plan);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(plan);
  };

  return (
    <Card 
      className="card-premium group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border-0 shadow-sm"
      onClick={handleViewPlan}
    >
      {/* Subtle Gradient Header */}
      <div className="h-1 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400" />
      
      <CardContent className={cn("p-0", isMobile ? "p-0" : "p-0")}>
        {/* Header with Status and Actions */}
        <div className={cn(
          "flex items-center justify-between",
          isMobile ? "px-3 pt-2.5" : "px-4 pt-3"
        )}>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn("text-[10px] font-medium px-2 py-0.5", statusConfig.className)}>
              {StatusIcon && <StatusIcon className="w-3 h-3 mr-1" />}
              {statusConfig.label}
            </Badge>
            {plan.usedDate && (
              <span className="text-[10px] text-muted-foreground">
                {new Date(plan.usedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "h-7 w-7 transition-opacity",
                  isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleClone}>
                <Copy className="w-4 h-4 mr-2" />
                Clone
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Main Content */}
        <div className={cn(
          isMobile ? "px-3 pt-2 pb-2" : "px-4 pt-2.5 pb-2.5"
        )}>
          {/* Chapter Name - Primary colored text */}
          <p className="text-xs font-medium text-teal-600 mb-1.5">
            📚 {plan.chapter}
          </p>

          {/* Title */}
          <h3 className={cn(
            "font-semibold text-foreground mb-3",
            isMobile ? "text-sm line-clamp-1" : "text-sm line-clamp-2"
          )}>
            {plan.title}
          </h3>

          {/* Block Type Summary - Compact inline row */}
          <div className="flex items-center gap-1.5 flex-wrap mb-3">
            {Object.entries(blockCounts).map(([type, count]) => {
              const Icon = blockTypeIcons[type as keyof typeof blockTypeIcons];
              const label = blockTypeLabels[type as keyof typeof blockTypeLabels];
              if (!Icon) return null;
              
              return (
                <div 
                  key={type}
                  className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted/60 text-muted-foreground text-[10px] font-medium"
                >
                  <Icon className="w-3 h-3" />
                  <span>{label} {count}</span>
                </div>
              );
            })}
          </div>

          {/* Meta Info */}
          <div className={cn(
            "flex items-center gap-3 text-muted-foreground border-t border-border/40 pt-2.5",
            isMobile ? "text-[10px]" : "text-[11px]"
          )}>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {plan.batchName}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {totalDuration || plan.totalDuration}m
            </span>
            <span className="flex items-center gap-1 ml-auto">
              <Calendar className="w-3 h-3" />
              {new Date(plan.scheduledDate).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>

        {/* Footer with View Button */}
        <div className={cn(
          "pt-0",
          isMobile ? "px-3 pb-3" : "px-4 pb-3"
        )}>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full h-8 text-xs border-teal-200 text-teal-700 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-300 transition-colors"
            onClick={handleViewPlan}
          >
            <Eye className="w-3 h-3 mr-1.5" />
            View Plan
            <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};