import { Bell, Check, ArrowLeft, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TeacherNotificationFilters, 
  TeacherNotificationList,
  PushNotificationSettings 
} from "@/components/teacher/notifications";
import { useTeacherNotifications } from "@/hooks/useTeacherNotifications";

const TeacherNotifications = () => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    activeFilter,
    setActiveFilter,
    filterOptions,
    markAsRead,
    markAllAsRead,
    dismiss
  } = useTeacherNotifications();

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b">
        <div className="max-w-3xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            {/* Back button on mobile */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 md:hidden"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl gradient-button flex items-center justify-center">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold">Notifications</h1>
                  {unreadCount > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {unreadCount} unread
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Mark all as read */}
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 sm:h-9 text-xs sm:text-sm"
                onClick={markAllAsRead}
              >
                <Check className="w-3.5 h-3.5 mr-1.5" />
                <span className="hidden sm:inline">Mark all read</span>
                <span className="sm:hidden">Read all</span>
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6">
        {/* Filters */}
        <div className="mb-4 sm:mb-6">
          <TeacherNotificationFilters
            filters={filterOptions}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>
        
        {/* Push Notification Settings */}
        <div className="mb-6">
          <PushNotificationSettings />
        </div>
        
        {/* Notification List */}
        <TeacherNotificationList
          notifications={notifications}
          onMarkAsRead={markAsRead}
          onDismiss={dismiss}
        />
      </div>
    </div>
  );
};

export default TeacherNotifications;
