import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  CalendarClock, 
  UserCheck, 
  UserX, 
  FileText, 
  ClipboardList, 
  BookOpen, 
  Clock, 
  Layers, 
  FileVideo, 
  Gift, 
  Bell,
  Check,
  X,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TeacherNotification, TeacherNotificationType } from "@/types/teacherNotifications";
import { formatDistanceToNow } from "date-fns";

interface TeacherNotificationCardProps {
  notification: TeacherNotification;
  onMarkAsRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
  compact?: boolean;
}

// Icon and color mapping based on notification type
const getNotificationConfig = (type: TeacherNotificationType, priority: string) => {
  const configs: Record<TeacherNotificationType, { icon: typeof Bell; colorClass: string }> = {
    substitution_assigned: { icon: UserCheck, colorClass: "text-red-600 bg-red-100" },
    substitution_cancelled: { icon: UserX, colorClass: "text-amber-600 bg-amber-100" },
    timetable_published: { icon: Calendar, colorClass: "text-blue-600 bg-blue-100" },
    timetable_updated: { icon: CalendarClock, colorClass: "text-blue-600 bg-blue-100" },
    exam_scheduled: { icon: FileText, colorClass: "text-purple-600 bg-purple-100" },
    exam_assigned: { icon: ClipboardList, colorClass: "text-purple-600 bg-purple-100" },
    subject_assigned: { icon: BookOpen, colorClass: "text-emerald-600 bg-emerald-100" },
    syllabus_updated: { icon: Clock, colorClass: "text-emerald-600 bg-emerald-100" },
    weekly_plan_published: { icon: Layers, colorClass: "text-teal-600 bg-teal-100" },
    content_shared: { icon: FileVideo, colorClass: "text-cyan-600 bg-cyan-100" },
    holiday_declared: { icon: Gift, colorClass: "text-amber-600 bg-amber-100" },
    general_announcement: { icon: Bell, colorClass: "text-gray-600 bg-gray-100" },
  };
  
  return configs[type] || { icon: Bell, colorClass: "text-gray-600 bg-gray-100" };
};

const getPriorityStyles = (priority: string, read: boolean) => {
  if (read) return "border-muted bg-muted/30";
  
  switch (priority) {
    case "urgent":
      return "border-red-200 bg-red-50/50";
    case "high":
      return "border-amber-200 bg-amber-50/50";
    case "medium":
      return "border-blue-100 bg-blue-50/30";
    default:
      return "border-muted bg-background";
  }
};

export const TeacherNotificationCard = memo(function TeacherNotificationCard({
  notification,
  onMarkAsRead,
  onDismiss,
  compact = false
}: TeacherNotificationCardProps) {
  const navigate = useNavigate();
  const { icon: Icon, colorClass } = getNotificationConfig(notification.type, notification.priority);
  
  const handleClick = () => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };
  
  const timeAgo = formatDistanceToNow(notification.timestamp, { addSuffix: true });
  
  if (compact) {
    return (
      <div
        onClick={handleClick}
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
          "hover:shadow-sm active:scale-[0.99]",
          getPriorityStyles(notification.priority, notification.read)
        )}
      >
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", colorClass)}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn("text-sm truncate", !notification.read && "font-medium")}>
            {notification.title}
          </p>
          <p className="text-xs text-muted-foreground">{timeAgo}</p>
        </div>
        {notification.actionUrl && (
          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        )}
      </div>
    );
  }
  
  return (
    <div
      className={cn(
        "p-3 sm:p-4 rounded-xl border transition-all",
        getPriorityStyles(notification.priority, notification.read),
        !notification.read && "shadow-sm"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={cn(
          "w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0",
          colorClass
        )}>
          <Icon className="w-5 h-5" />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className={cn(
                "text-sm sm:text-base",
                !notification.read ? "font-semibold text-foreground" : "font-medium text-muted-foreground"
              )}>
                {notification.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{timeAgo}</p>
            </div>
            
            {/* Priority indicator for urgent/high */}
            {!notification.read && (notification.priority === "urgent" || notification.priority === "high") && (
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-medium uppercase flex-shrink-0",
                notification.priority === "urgent" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
              )}>
                {notification.priority}
              </span>
            )}
          </div>
          
          {/* Message */}
          <p className={cn(
            "text-xs sm:text-sm mt-2 leading-relaxed",
            notification.read ? "text-muted-foreground" : "text-foreground/80"
          )}>
            {notification.message}
          </p>
          
          {/* Actions */}
          <div className="flex items-center gap-2 mt-3">
            {notification.actionUrl && (
              <Button
                size="sm"
                variant="outline"
                className="h-8 px-3 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
              >
                View Details
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            )}
            
            {!notification.read && onMarkAsRead && (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead(notification.id);
                }}
              >
                <Check className="w-3.5 h-3.5 mr-1" />
                Mark Read
              </Button>
            )}
            
            {onDismiss && (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive ml-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  onDismiss(notification.id);
                }}
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
