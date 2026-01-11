import { useState, useMemo, useCallback } from "react";
import { 
  TeacherNotification, 
  NotificationCategory, 
  getNotificationCategory 
} from "@/types/teacherNotifications";
import { teacherNotifications as initialNotifications } from "@/data/teacher/notifications";

export const useTeacherNotifications = () => {
  const [notifications, setNotifications] = useState<TeacherNotification[]>(initialNotifications);
  const [activeFilter, setActiveFilter] = useState<NotificationCategory>("all");
  
  // Calculate counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<NotificationCategory, number> = {
      all: 0,
      timetable: 0,
      exams: 0,
      substitution: 0,
      syllabus: 0,
      general: 0
    };
    
    notifications.forEach(n => {
      if (!n.dismissed) {
        counts.all++;
        const category = getNotificationCategory(n.type);
        counts[category]++;
      }
    });
    
    return counts;
  }, [notifications]);
  
  // Get unread count
  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.read && !n.dismissed).length,
    [notifications]
  );
  
  // Get urgent alerts (for dashboard)
  const urgentAlerts = useMemo(() => 
    notifications.filter(n => 
      !n.dismissed && 
      !n.read &&
      (n.priority === "urgent" || n.priority === "high")
    ).slice(0, 5),
    [notifications]
  );
  
  // Filter notifications based on active category
  const filteredNotifications = useMemo(() => {
    let filtered = notifications.filter(n => !n.dismissed);
    
    if (activeFilter !== "all") {
      filtered = filtered.filter(n => getNotificationCategory(n.type) === activeFilter);
    }
    
    // Sort by timestamp (newest first)
    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [notifications, activeFilter]);
  
  // Mark notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);
  
  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  }, []);
  
  // Dismiss notification
  const dismiss = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, dismissed: true } : n)
    );
  }, []);
  
  // Get filter options with counts
  const filterOptions = useMemo(() => [
    { value: "all" as NotificationCategory, label: "All", count: categoryCounts.all },
    { value: "timetable" as NotificationCategory, label: "Timetable", count: categoryCounts.timetable },
    { value: "exams" as NotificationCategory, label: "Exams", count: categoryCounts.exams },
    { value: "substitution" as NotificationCategory, label: "Substitution", count: categoryCounts.substitution },
    { value: "syllabus" as NotificationCategory, label: "Syllabus", count: categoryCounts.syllabus },
    { value: "general" as NotificationCategory, label: "General", count: categoryCounts.general },
  ], [categoryCounts]);
  
  return {
    notifications: filteredNotifications,
    allNotifications: notifications,
    unreadCount,
    urgentAlerts,
    activeFilter,
    setActiveFilter,
    filterOptions,
    markAsRead,
    markAllAsRead,
    dismiss
  };
};
