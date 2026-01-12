import { useState, useRef, useCallback } from "react";
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Users, 
  Clock,
  FileQuestion,
  BarChart3,
  Calendar,
  Zap,
  CalendarClock
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import type { TeacherExam } from "@/data/teacher/types";

interface TeacherExamCardProps {
  exam: TeacherExam;
  onView?: () => void;
  onEdit?: () => void;
  onAssign?: () => void;
  onSchedule?: () => void;
  onDelete?: () => void;
  onViewResults?: () => void;
}

// Swipe configuration
const SWIPE_THRESHOLD = 50;
const ACTION_WIDTH = 140;
const VELOCITY_THRESHOLD = 0.4;

const getStatusConfig = (status: TeacherExam["status"]) => {
  switch (status) {
    case "draft":
      return { label: "Draft", className: "bg-muted text-muted-foreground" };
    case "scheduled":
      return { label: "Scheduled", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" };
    case "live":
      return { label: "Live", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 animate-pulse" };
    case "completed":
      return { label: "Done", className: "bg-primary/10 text-primary" };
    default:
      return { label: status, className: "bg-muted text-muted-foreground" };
  }
};

const getPatternConfig = (pattern: TeacherExam["pattern"]) => {
  switch (pattern) {
    case "jee_main":
      return { label: "JEE Main", icon: Zap };
    case "jee_advanced":
      return { label: "JEE Adv", icon: Zap };
    case "neet":
      return { label: "NEET", icon: Zap };
    default:
      return null;
  }
};

export const TeacherExamCard = ({
  exam,
  onView,
  onEdit,
  onAssign,
  onSchedule,
  onDelete,
  onViewResults,
}: TeacherExamCardProps) => {
  const isMobile = useIsMobile();
  const statusConfig = getStatusConfig(exam.status);
  const patternConfig = getPatternConfig(exam.pattern);

  // Swipe state
  const [translateX, setTranslateX] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  const isDragging = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isMobile) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
    isDragging.current = false;
  }, [isMobile]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isMobile) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = touchStartX.current - currentX;
    const diffY = Math.abs(touchStartY.current - currentY);

    if (diffY > Math.abs(diffX) && !isDragging.current) return;
    
    isDragging.current = true;

    let newTranslateX = isRevealed ? -ACTION_WIDTH - diffX : -diffX;
    newTranslateX = Math.max(-ACTION_WIDTH, Math.min(0, newTranslateX));
    
    setTranslateX(newTranslateX);
  }, [isMobile, isRevealed]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isMobile || !isDragging.current) return;
    
    const endX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - endX;
    const duration = Date.now() - touchStartTime.current;
    const velocity = Math.abs(diffX) / duration;

    const shouldReveal = velocity > VELOCITY_THRESHOLD 
      ? diffX > 0 
      : Math.abs(translateX) > SWIPE_THRESHOLD;

    if (shouldReveal && !isRevealed) {
      setTranslateX(-ACTION_WIDTH);
      setIsRevealed(true);
    } else if (!shouldReveal || (isRevealed && diffX < -SWIPE_THRESHOLD)) {
      setTranslateX(0);
      setIsRevealed(false);
    } else if (isRevealed) {
      setTranslateX(-ACTION_WIDTH);
    }

    isDragging.current = false;
  }, [isMobile, isRevealed, translateX]);

  const resetSwipe = useCallback(() => {
    setTranslateX(0);
    setIsRevealed(false);
  }, []);

  const handleAction = useCallback((action: () => void) => {
    resetSwipe();
    action();
  }, [resetSwipe]);

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Swipe Action Buttons - Mobile only */}
      {isMobile && (
        <div 
          className={cn(
            "absolute inset-y-0 right-0 flex items-stretch transition-opacity duration-200",
            translateX < 0 ? "opacity-100" : "opacity-0"
          )}
          style={{ width: ACTION_WIDTH }}
        >
          <button
            onClick={() => onEdit && handleAction(onEdit)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 bg-blue-500 text-white active:bg-blue-600 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span className="text-[9px] font-medium">Edit</span>
          </button>
          <button
            onClick={() => onDelete && handleAction(onDelete)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 bg-red-500 text-white active:bg-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-[9px] font-medium">Delete</span>
          </button>
        </div>
      )}

      {/* Main Card */}
      <Card 
        ref={cardRef}
        className={cn(
          "card-premium group overflow-hidden relative bg-card",
          isMobile && "touch-pan-y"
        )}
        style={{
          transform: isMobile ? `translateX(${translateX}px)` : undefined,
          transition: isDragging.current ? 'none' : 'transform 0.25s ease-out',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <CardContent className="p-0">
          {/* Header gradient */}
          <div className="relative h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />
          
          <div className="p-3 space-y-2">
            {/* Top Row: Badges & Menu */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Badge className={cn("text-[10px] px-1.5 py-0", statusConfig.className)}>
                  {statusConfig.label}
                </Badge>
                {patternConfig && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    <patternConfig.icon className="w-2.5 h-2.5 mr-0.5" />
                    {patternConfig.label}
                  </Badge>
                )}
              </div>
              
              {/* Desktop dropdown menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn(
                      "h-7 w-7 transition-opacity",
                      isMobile ? "opacity-50" : "md:opacity-0 md:group-hover:opacity-100"
                    )}
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onView}>
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onAssign}>
                    <Users className="w-4 h-4 mr-2" />
                    Assign Batches
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onSchedule}>
                    <CalendarClock className="w-4 h-4 mr-2" />
                    Schedule
                  </DropdownMenuItem>
                  {exam.status === "completed" && (
                    <DropdownMenuItem onClick={onViewResults}>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Results
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
            
            {/* Title */}
            <h3 className="font-semibold text-sm text-foreground line-clamp-2 leading-tight">
              {exam.name}
            </h3>
            
            {/* Subject & Stats - Single compact row */}
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap">
              <span className="text-primary font-medium">{exam.subjects.join(", ")}</span>
              <span className="flex items-center gap-0.5">
                <FileQuestion className="w-3 h-3" />
                {exam.totalQuestions}
              </span>
              <span className="flex items-center gap-0.5">
                <Clock className="w-3 h-3" />
                {exam.duration}m
              </span>
              <span>{exam.totalMarks} marks</span>
            </div>

            {/* Batches */}
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Users className="w-3 h-3" />
              {exam.batchIds.length} {exam.batchIds.length === 1 ? "batch" : "batches"}
            </div>

            {/* Schedule info */}
            {exam.scheduledDate && (
              <div className="flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded w-fit">
                <Calendar className="w-3 h-3" />
                {new Date(exam.scheduledDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            )}
            
            {/* Action Buttons - Flex wrap for responsiveness */}
            <div className="flex items-center gap-1.5 pt-1 pb-1 flex-wrap min-w-0 max-w-full">
              <Button 
                size="sm" 
                variant="outline" 
                className="h-7 text-xs px-2 whitespace-nowrap" 
                onClick={onView}
              >
                <Eye className="w-3 h-3 sm:mr-1" />
                <span className="hidden sm:inline">View</span>
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-7 text-xs px-2 whitespace-nowrap" 
                onClick={onAssign}
              >
                <Users className="w-3 h-3 sm:mr-1" />
                <span className="hidden sm:inline">Assign</span>
              </Button>
              {exam.status === "draft" ? (
                <Button 
                  size="sm" 
                  className="h-7 text-xs px-2 whitespace-nowrap gradient-button" 
                  onClick={onSchedule}
                >
                  <CalendarClock className="w-3 h-3 sm:mr-1" />
                  <span className="hidden sm:inline">Schedule</span>
                </Button>
              ) : exam.status === "completed" ? (
                <Button 
                  size="sm" 
                  className="h-7 text-xs px-2 whitespace-nowrap gradient-button" 
                  onClick={onViewResults}
                >
                  <BarChart3 className="w-3 h-3 sm:mr-1" />
                  <span className="hidden sm:inline">Results</span>
                </Button>
              ) : (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-7 text-xs px-2 whitespace-nowrap" 
                  onClick={onEdit}
                >
                  <Edit className="w-3 h-3 sm:mr-1" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
