import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  Plus, 
  CheckCircle2,
  MapPin,
  Clock,
  Sparkles
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type TeacherTimetableSlot } from "@/data/teacherData";
import { useTeacherFeatures } from "@/config/featureFlags";
import { useCopilot } from "@/components/teacher/routine-pilot/CopilotContext";

interface ClassCardProps {
  slot: TeacherTimetableSlot;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onConfirm: () => void;
}

export const ClassCard = ({ slot, index, isSelected, onSelect, onConfirm }: ClassCardProps) => {
  const navigate = useNavigate();
  const { hasCopilot } = useTeacherFeatures();
  const { openCopilot } = useCopilot();
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  const isLive = currentTime >= slot.startTime && currentTime < slot.endTime;
  const isPast = currentTime >= slot.endTime;

  return (
    <Card 
      className={cn(
        "transition-all duration-300 cursor-pointer hover:shadow-lg active:scale-[0.99] overflow-hidden",
        isLive && "border-teal-400/50 bg-gradient-to-r from-teal-50/80 via-cyan-50/50 to-teal-50/80 ring-1 ring-teal-400/30 shadow-lg shadow-teal-500/10",
        isPast && "opacity-70 bg-slate-50/50",
        isSelected && "ring-2 ring-teal-500",
        !isLive && !isPast && "bg-white hover:bg-gradient-to-r hover:from-slate-50/50 hover:to-white"
      )}
      onClick={onSelect}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Time Column with premium styling */}
          <div className={cn(
            "text-center min-w-[50px] sm:min-w-[60px] p-2 rounded-xl",
            isLive ? "bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/25" : 
            isPast ? "bg-slate-100" : "bg-gradient-to-br from-slate-100 to-slate-50"
          )}>
            <p className={cn(
              "font-bold text-sm sm:text-base",
              isLive ? "text-white" : isPast ? "text-slate-500" : "text-foreground"
            )}>
              {slot.startTime}
            </p>
            <p className={cn(
              "text-[10px] sm:text-xs",
              isLive ? "text-white/80" : "text-muted-foreground"
            )}>
              {slot.endTime}
            </p>
          </div>
          
          {/* Status Indicator Bar */}
          <div className={cn(
            "w-1 h-12 sm:h-14 rounded-full flex-shrink-0",
            isLive ? "bg-gradient-to-b from-teal-400 via-cyan-400 to-teal-500" : 
            slot.lessonPlanStatus === 'ready' ? "bg-gradient-to-b from-emerald-400 to-green-500" :
            slot.lessonPlanStatus === 'draft' ? "bg-gradient-to-b from-amber-400 to-orange-500" :
            isPast ? "bg-slate-300" : "bg-slate-200"
          )} />
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
              <h4 className={cn(
                "font-bold text-base sm:text-lg truncate",
                isLive ? "text-teal-700" : isPast ? "text-slate-600" : "text-foreground"
              )}>
                {slot.subject}
              </h4>
              {isLive && (
                <Badge className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-[9px] sm:text-[10px] px-2 animate-pulse border-0 shadow-sm">
                  LIVE
                </Badge>
              )}
              {isPast && (
                <Badge variant="outline" className="text-[9px] sm:text-[10px] px-1.5 border-amber-300 text-amber-600 bg-amber-50">
                  <Clock className="w-2.5 h-2.5 mr-0.5" />
                  Pending
                </Badge>
              )}
            </div>
            <div className={cn(
              "flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium flex-wrap",
              isPast ? "text-slate-500" : "text-muted-foreground"
            )}>
              <span className="font-semibold">{slot.batchName}</span>
              {slot.room && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {slot.room}
                  </span>
                </>
              )}
            </div>
            {slot.topic && (
              <p className={cn(
                "text-xs mt-1 truncate",
                isPast ? "text-slate-400" : "text-muted-foreground/80"
              )}>
                {slot.topic}
              </p>
            )}
          </div>

          {/* Status/Action - Larger touch targets */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {isPast ? (
              <Button 
                size="sm" 
                className="h-9 sm:h-10 px-3 sm:px-4 text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-amber-500/20 border-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onConfirm();
                }}
              >
                <CheckCircle2 className="w-3.5 h-3.5 sm:mr-1.5" />
                <span className="hidden sm:inline">Confirm</span>
              </Button>
            ) : slot.hasLessonPlan ? (
              <Badge 
                className={cn(
                  "h-8 sm:h-9 px-2.5 sm:px-3 cursor-pointer border-0 shadow-sm",
                  slot.lessonPlanStatus === 'ready' 
                    ? "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 hover:from-emerald-200 hover:to-green-200"
                    : "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 hover:from-amber-200 hover:to-orange-200"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  if (slot.lessonPlanId) {
                    navigate(`/teacher/lesson-plans/${slot.lessonPlanId}`);
                  }
                }}
              >
                <BookOpen className="w-3.5 h-3.5 sm:mr-1" />
                <span className="hidden sm:inline text-xs font-medium">
                  {slot.lessonPlanStatus === 'ready' ? 'Ready' : 'Draft'}
                </span>
              </Badge>
            ) : (
              hasCopilot && !isLive ? (
                <Button
                  size="sm"
                  className="h-8 sm:h-9 px-2.5 sm:px-3 text-xs font-semibold bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white border-0 shadow-md shadow-violet-500/25"
                  onClick={(e) => {
                    e.stopPropagation();
                    openCopilot({ routineKey: "lesson_prep", batchId: slot.batchId });
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5 sm:mr-1" />
                  <span className="hidden sm:inline">Generate</span>
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 sm:h-9 px-2.5 sm:px-3 text-xs font-medium border-dashed border-teal-300 text-teal-600 hover:bg-teal-50 hover:border-teal-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/teacher/lesson-plans/new");
                  }}
                >
                  <Plus className="w-3.5 h-3.5 sm:mr-1" />
                  <span className="hidden sm:inline">Add Plan</span>
                </Button>
              )
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};