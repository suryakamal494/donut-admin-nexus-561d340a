import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Plus, 
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Sparkles,
  TrendingUp,
  Bell,
  AlertTriangle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CurrentClassWidget } from "@/components/teacher/CurrentClassWidget";
import { TeachingConfirmationDialog } from "@/components/teacher/TeachingConfirmationDialog";
import { ClassCard } from "@/components/teacher/ClassCard";
import { TeacherNotificationCard } from "@/components/teacher/notifications";
import { useTeacherNotifications } from "@/hooks/useTeacherNotifications";
import { 
  currentTeacher, 
  teacherTodayTimetable, 
  teacherPendingActions,
  teacherWeeklyStats,
  type TeacherTimetableSlot,
  type PendingAction
} from "@/data/teacherData";
import { toast } from "sonner";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [slotToConfirm, setSlotToConfirm] = useState<TeacherTimetableSlot | null>(null);
  
  // Get urgent alerts from notifications
  const { urgentAlerts, markAsRead } = useTeacherNotifications();

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Get current date string
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // Get current/next class with more context
  const classInfo = useMemo(() => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // First check for current class
    for (const slot of teacherTodayTimetable) {
      if (currentTime >= slot.startTime && currentTime < slot.endTime) {
        return { slot, status: 'current' as const };
      }
    }
    
    // Then find the next upcoming class
    for (const slot of teacherTodayTimetable) {
      if (currentTime < slot.startTime) {
        return { slot, status: 'next' as const };
      }
    }
    
    return null;
  }, []);

  // Find past classes that need confirmation (classes that ended but not confirmed)
  const pastUnconfirmedSlots = useMemo(() => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    return teacherTodayTimetable.filter(slot => 
      currentTime >= slot.endTime
    ).slice(-2); // Show last 2 past classes max
  }, []);

  const getPriorityColor = (priority: PendingAction['priority']) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-warning/10 text-warning-foreground border-warning/20';
      default: return 'bg-muted text-muted-foreground border-muted';
    }
  };

  const getActionIcon = (type: PendingAction['type']) => {
    switch (type) {
      case 'homework': return FileText;
      case 'quiz': return ClipboardCheck;
      case 'lesson_plan': return BookOpen;
      case 'review': return CheckCircle2;
      default: return AlertCircle;
    }
  };

  const handleConfirmTeaching = (slot: TeacherTimetableSlot) => {
    setSlotToConfirm(slot);
    setConfirmationDialogOpen(true);
  };

  const handleConfirmationSubmit = (data: any) => {
    toast.success(data.didTeach 
      ? "Teaching confirmed! Chapter progress updated." 
      : "Noted. Class marked as not conducted."
    );
    setConfirmationDialogOpen(false);
    setSlotToConfirm(null);
  };

  return (
    <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto pb-20 md:pb-6">
      {/* Greeting Section - Mobile optimized */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
            {getGreeting()}, {currentTeacher.name.split(' ')[0]}!
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        {/* Quick Action FAB - Desktop */}
        <Button 
          className="hidden sm:flex gradient-button h-11"
          onClick={() => navigate("/teacher/lesson-plans/new")}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Lesson Plan
        </Button>
      </div>

      {/* Current/Next Class - Enhanced Widget with Lesson Plan Preview */}
      {classInfo && (
        <CurrentClassWidget
          slot={classInfo.slot}
          status={classInfo.status}
          dateStr={todayStr}
          onStartClass={() => toast.info("Starting class mode...")}
          onConfirmTeaching={() => handleConfirmTeaching(classInfo.slot)}
        />
      )}

      {/* Past Classes Needing Confirmation - Mobile-friendly cards */}
      {pastUnconfirmedSlots.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="w-4 h-4 text-amber-600" />
              <h3 className="font-semibold text-sm text-amber-800">Confirm Past Classes</h3>
            </div>
            <div className="space-y-2">
              {pastUnconfirmedSlots.map((slot) => (
                <div 
                  key={slot.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-background border"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{slot.subject} • {slot.batchName}</p>
                      <p className="text-xs text-muted-foreground">{slot.startTime} - {slot.endTime}</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-shrink-0 h-9 px-3 text-xs font-medium border-amber-300 text-amber-700 hover:bg-amber-100"
                    onClick={() => handleConfirmTeaching(slot)}
                  >
                    Confirm
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              Today's Classes
            </h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary h-9 px-3"
              onClick={() => navigate("/teacher/schedule")}
            >
              Full Schedule
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="grid gap-2 sm:gap-3">
            {teacherTodayTimetable.length > 0 ? (
              teacherTodayTimetable.map((slot, index) => (
                <ClassCard 
                  key={slot.id} 
                  slot={slot} 
                  index={index}
                  isSelected={selectedSlot === slot.id}
                  onSelect={() => setSelectedSlot(slot.id === selectedSlot ? null : slot.id)}
                  onConfirm={() => handleConfirmTeaching(slot)}
                />
              ))
            ) : (
              <Card className="border-dashed">
                <CardContent className="p-6 text-center">
                  <Clock className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground">No classes scheduled for today</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar - Mobile: Horizontal scroll cards, Desktop: Vertical stack */}
        <div className="space-y-4 sm:space-y-5">
          {/* Quick Stats - 2x2 grid optimized for mobile */}
          <Card className="overflow-hidden card-premium">
            <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 sm:gap-4 px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="text-center p-2.5 sm:p-3 rounded-xl bg-muted/50">
                <p className="text-xl sm:text-2xl font-bold text-foreground">{teacherWeeklyStats.totalClasses}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Classes</p>
              </div>
              <div className="text-center p-2.5 sm:p-3 rounded-xl bg-muted/50">
                <p className="text-xl sm:text-2xl font-bold text-foreground">{teacherWeeklyStats.scheduledTests}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Tests</p>
              </div>
              <div className="text-center p-2.5 sm:p-3 rounded-xl bg-muted/50">
                <p className="text-xl sm:text-2xl font-bold text-foreground">{teacherWeeklyStats.lessonPlansCreated}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Plans</p>
              </div>
              <div className="text-center p-2.5 sm:p-3 rounded-xl bg-muted/50">
                <p className="text-xl sm:text-2xl font-bold text-foreground">{teacherWeeklyStats.pendingHomework}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>

          {/* Alerts & Pending Actions */}
          <Card className="card-premium">
            <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Alerts & Tasks
                <Badge variant="secondary" className="ml-auto text-[10px]">
                  {urgentAlerts.length + teacherPendingActions.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6 pb-3 sm:pb-6">
              {/* Urgent Alerts Section */}
              {urgentAlerts.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-red-600 uppercase tracking-wide">
                      Urgent ({urgentAlerts.length})
                    </h4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-xs text-primary px-2"
                      onClick={() => navigate("/teacher/notifications")}
                    >
                      View All
                    </Button>
                  </div>
                  <div className="space-y-1.5">
                    {urgentAlerts.slice(0, 2).map((alert) => (
                      <TeacherNotificationCard
                        key={alert.id}
                        notification={alert}
                        onMarkAsRead={markAsRead}
                        compact
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Divider if both sections have content */}
              {urgentAlerts.length > 0 && teacherPendingActions.length > 0 && (
                <div className="border-t border-border" />
              )}
              
              {/* Tasks Section */}
              {teacherPendingActions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Tasks ({teacherPendingActions.length})
                  </h4>
                  <div className="space-y-2 sm:space-y-3">
                    {teacherPendingActions.slice(0, urgentAlerts.length > 0 ? 2 : 4).map((action) => {
                      const Icon = getActionIcon(action.type);
                      return (
                        <div 
                          key={action.id}
                          className={cn(
                            "p-2.5 sm:p-3 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md active:scale-[0.98]",
                            getPriorityColor(action.priority)
                          )}
                        >
                          <div className="flex items-start gap-2.5 sm:gap-3">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-background/50 flex items-center justify-center flex-shrink-0">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{action.title}</p>
                              <p className="text-xs opacity-70 truncate">{action.description}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Empty State */}
              {urgentAlerts.length === 0 && teacherPendingActions.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-500" />
                  <p className="text-sm">All caught up!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Assist Card */}
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 card-premium">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl gradient-button flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm">AI Teaching Assistant</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Create lesson plans, quizzes with AI help
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="mt-2.5 sm:mt-3 h-9 border-primary/30 text-primary hover:bg-primary/5"
                  >
                    Try AI Assist
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile FAB - Context aware */}
      <div className="fixed bottom-20 right-4 md:hidden z-10">
        <Button 
          size="lg"
          className="w-14 h-14 rounded-full gradient-button shadow-lg shadow-primary/30"
          onClick={() => navigate("/teacher/lesson-plans/new")}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      {/* Teaching Confirmation Dialog */}
      {slotToConfirm && (
        <TeachingConfirmationDialog
          open={confirmationDialogOpen}
          onOpenChange={setConfirmationDialogOpen}
          batchName={slotToConfirm.batchName}
          subjectName={slotToConfirm.subject}
          date={todayStr}
          periodsCount={1}
          chapters={[
            { chapterId: "ch-1", chapterName: "Newton's Laws of Motion", order: 1, plannedHours: 8 },
            { chapterId: "ch-2", chapterName: "Force and Momentum", order: 2, plannedHours: 6 },
            { chapterId: "ch-3", chapterName: "Work and Energy", order: 3, plannedHours: 10 },
          ]}
          suggestedChapter={slotToConfirm.topic ? "ch-1" : undefined}
          onConfirm={handleConfirmationSubmit}
        />
      )}
    </div>
  );
};

export default TeacherDashboard;
