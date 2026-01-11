import { memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import { TeacherNotificationCard } from "./TeacherNotificationCard";
import { TeacherNotification } from "@/types/teacherNotifications";
import { isToday, isYesterday, isThisWeek, format } from "date-fns";

interface TeacherNotificationListProps {
  notifications: TeacherNotification[];
  onMarkAsRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
  compact?: boolean;
}

// Group notifications by date
const groupNotificationsByDate = (notifications: TeacherNotification[]) => {
  const groups: { label: string; notifications: TeacherNotification[] }[] = [];
  
  const today: TeacherNotification[] = [];
  const yesterday: TeacherNotification[] = [];
  const thisWeek: TeacherNotification[] = [];
  const earlier: TeacherNotification[] = [];
  
  notifications.forEach(notification => {
    const date = notification.timestamp;
    if (isToday(date)) {
      today.push(notification);
    } else if (isYesterday(date)) {
      yesterday.push(notification);
    } else if (isThisWeek(date)) {
      thisWeek.push(notification);
    } else {
      earlier.push(notification);
    }
  });
  
  if (today.length > 0) groups.push({ label: "Today", notifications: today });
  if (yesterday.length > 0) groups.push({ label: "Yesterday", notifications: yesterday });
  if (thisWeek.length > 0) groups.push({ label: "This Week", notifications: thisWeek });
  if (earlier.length > 0) groups.push({ label: "Earlier", notifications: earlier });
  
  return groups;
};

export const TeacherNotificationList = memo(function TeacherNotificationList({
  notifications,
  onMarkAsRead,
  onDismiss,
  compact = false
}: TeacherNotificationListProps) {
  const groupedNotifications = useMemo(
    () => groupNotificationsByDate(notifications),
    [notifications]
  );
  
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Bell className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-foreground mb-1">No notifications</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          You're all caught up! New notifications will appear here.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 sm:space-y-6">
      <AnimatePresence mode="popLayout">
        {groupedNotifications.map((group) => (
          <motion.div
            key={group.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Group Label */}
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 sm:mb-3 px-1">
              {group.label}
            </h3>
            
            {/* Notifications in Group */}
            <div className="space-y-2 sm:space-y-3">
              {group.notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <TeacherNotificationCard
                    notification={notification}
                    onMarkAsRead={onMarkAsRead}
                    onDismiss={onDismiss}
                    compact={compact}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
});
