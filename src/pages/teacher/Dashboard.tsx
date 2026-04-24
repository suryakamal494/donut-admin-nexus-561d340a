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
  TrendingUp,
  Bell,
  AlertTriangle,
  ListChecks
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CurrentClassWidget } from "@/components/teacher/CurrentClassWidget";
import { TeachingConfirmationDialog } from "@/components/teacher/TeachingConfirmationDialog";
import { ClassCard } from "@/components/teacher/ClassCard";
import { TeacherNotificationCard, PushNotificationBanner } from "@/components/teacher/notifications";
import { useTeacherNotifications } from "@/hooks/useTeacherNotifications";
import {
  SmartNudgesRow,
  RecentArtifactsCard,
  SyllabusTrackerMini,
  UnlockCopilotCard,
} from "@/components/teacher/dashboard";
import { useTeacherFeatures } from "@/config/featureFlags";
import { useCopilot } from "@/components/teacher/routine-pilot/CopilotContext";
import { 
  currentTeacher, 
  teacherPendingActions,
  teacherWeeklyStats,
  type TeacherTimetableSlot,
  type PendingAction
} from "@/data/teacherData";
import { teacherDemoTodayTimetable } from "@/data/teacher/schedule";
import { pendingConfirmations } from "@/data/academicScheduleData";
import { toast } from "sonner";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [slotToConfirm, setSlotToConfirm] = useState<TeacherTimetableSlot | null>(null);
  
  // Get urgent alerts from notifications
  const { urgentAlerts, markAsRead } = useTeacherNotifications();

  // Premium AI surfaces gate
  const { hasCopilot } = useTeacherFeatures();

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

  // Use demo timetable for consistent display
  const todayTimetable = teacherDemoTodayTimetable;

  // Get current/next class with more context
  const classInfo = useMemo(() => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // First check for current class
    for (const slot of todayTimetable) {
      if (currentTime >= slot.startTime && currentTime < slot.endTime) {
        return { slot, status: 'current' as const };
      }
    }
    
    // Then find the next upcoming class
    for (const slot of todayTimetable) {
      if (currentTime < slot.startTime) {
        return { slot, status: 'next' as const };
      }
    }
    
    return null;
  }, [todayTimetable]);

  // Find past classes that need confirmation (classes that ended but not confirmed)
  const pastUnconfirmedSlots = useMemo(() => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    return todayTimetable.filter(slot => 
      currentTime >= slot.endTime
    ).slice(-3); // Show last 3 past classes max
  }, [todayTimetable]);

  // Total pending confirmations count (including from previous days)
  const totalPendingConfirmations = pendingConfirmations.length + pastUnconfirmedSlots.length;

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
      {/* Greeting Section - Premium gradient background */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500/10 via-cyan-500/5 to-transparent p-4 sm:p-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-400/20 to-cyan-400/10 rounded-full blur-2xl -mr-10 -mt-10" />
        
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
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
          
          {/* Quick Action FAB - Desktop with premium gradient */}
          <Button 
            className="hidden sm:flex bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-lg shadow-teal-500/25 h-11 border-0"
            onClick={() => navigate("/teacher/lesson-plans/new")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Lesson Plan
          </Button>
        </div>
      </div>

      {/* Push Notification Banner */}
      <PushNotificationBanner />

      {/* Smart Nudges row — premium only, agentic Copilot suggestions */}
      {hasCopilot && (
        <SmartNudgesRow
          input={{
            todayTimetable,
            pastUnconfirmedCount: pastUnconfirmedSlots.length,
            recentLowScoreQuiz: {
              name: "Newton's Laws Quiz",
              avgPercent: 52,
              strugglingCount: 6,
              examId: "exam-newton-q1",
            },
            underCoveredUpcomingChapter: {
              chapterName: "Thermodynamics",
              coveragePercent: 30,
            },
          }}
          maxVisible={2}
        />
      )}

      {/* Pending Confirmations Alert Banner - Premium amber gradient */}
      {totalPendingConfirmations > 0 && (
        <Card className="border-amber-200/50 bg-gradient-to-r from-amber-50 via-orange-50/50 to-amber-50 overflow-hidden">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/25">
                  <ListChecks className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-amber-900 text-base sm:text-lg">
                    {totalPendingConfirmations} Classes Need Confirmation
                  </h3>
                  <p className="text-sm text-amber-700/80">
                    Confirm teaching sessions to track syllabus progress
                  </p>
                </div>
              </div>
              <Button 
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25 h-10 sm:h-11 px-4 sm:px-5 border-0 flex-shrink-0"
                onClick={() => navigate("/teacher/academic-progress")}
              >
                <span className="hidden sm:inline">Bulk Confirm</span>
                <span className="sm:hidden">Confirm</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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

      {/* Past Classes Needing Confirmation - Premium styling */}
      {pastUnconfirmedSlots.length > 0 && (
        <Card className="border-amber-200/50 bg-gradient-to-br from-amber-50/80 to-orange-50/50 overflow-hidden">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Bell className="w-3.5 h-3.5 text-white" />
              </div>
              <h3 className="font-semibold text-sm text-amber-800">Today's Classes to Confirm</h3>
              <Badge variant="secondary" className="ml-auto bg-amber-100 text-amber-700 border-0">
                {pastUnconfirmedSlots.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {pastUnconfirmedSlots.map((slot) => (
                <div 
                  key={slot.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/80 border border-amber-100 shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">{slot.subject} • {slot.batchName}</p>
                      <p className="text-xs text-muted-foreground">{slot.startTime} - {slot.endTime} • {slot.room}</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="flex-shrink-0 h-9 px-4 text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-amber-500/20 border-0"
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
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              Today's Classes
            </h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 h-9 px-3"
              onClick={() => navigate("/teacher/schedule")}
            >
              Full Schedule
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="grid gap-2 sm:gap-3">
            {todayTimetable.length > 0 ? (
              todayTimetable.map((slot, index) => (
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
              <Card className="border-dashed border-2">
                <CardContent className="p-6 text-center">
                  <Clock className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground">No classes scheduled for today</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Mandatory syllabus tracker — shown for everyone */}
          <SyllabusTrackerMini hasCopilot={hasCopilot} />
        </div>

        {/* Sidebar - Mobile: Horizontal scroll cards, Desktop: Vertical stack */}
        <div className="space-y-4 sm:space-y-5">
          {/* Alerts & Pending Actions */}
          <Card className="bg-gradient-to-br from-white to-slate-50/50 border-slate-100/50 shadow-lg shadow-slate-500/5">
            <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <AlertTriangle className="w-3.5 h-3.5 text-white" />
                </div>
                Alerts & Tasks
                <Badge variant="secondary" className="ml-auto text-[10px] bg-slate-100">
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
                      className="h-6 text-xs text-teal-600 px-2"
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

          {/* AI surface — premium shows Recent Artifacts; free shows the upsell */}
          {hasCopilot ? <RecentArtifactsCard /> : <UnlockCopilotCard />}

        </div>
      </div>

      {/* Mobile FAB - Premium gradient */}
      <div className="fixed bottom-20 right-4 md:hidden z-10">
        <Button 
          size="lg"
          className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 shadow-xl shadow-teal-500/30 border-0"
          onClick={() => navigate("/teacher/lesson-plans/new")}
        >
          <Plus className="w-6 h-6 text-white" />
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