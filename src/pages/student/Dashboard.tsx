// Student Dashboard - Complete Mobile-First Redesign
// Shows quick snapshot of learning journey with AI recommendations

import { studentProfile } from "@/data/student";
import { Flame } from "lucide-react";
import { 
  QuickStatsBar, 
  AIRecommendationsCarousel, 
  HomeworkSection, 
  ScheduleTimeline, 
  UpcomingTestsSection,
  LastTestResultCard,
  RecentCopilotCard,
  DailyStudyGoalRing
} from "@/components/student/dashboard";

const StudentDashboard = () => {
  const firstName = studentProfile.name.split(' ')[0];

  return (
    <div className="w-full pb-24 lg:pb-6">
      {/* Mobile Header with greeting */}
      <div className="lg:hidden flex items-start justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Hi, {firstName}! 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Let's continue learning
          </p>
        </div>
        
        {/* Streak badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-br from-donut-coral to-donut-orange rounded-full shadow-lg shadow-orange-300/40">
          <Flame className="w-4 h-4 text-white" />
          <span className="text-sm font-bold text-white">{studentProfile.streak}</span>
        </div>
      </div>

      {/* Desktop greeting */}
      <div className="hidden lg:flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Here's your learning snapshot for today
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-br from-donut-coral to-donut-orange rounded-full shadow-lg shadow-orange-300/40">
          <Flame className="w-5 h-5 text-white" />
          <span className="text-sm font-bold text-white">{studentProfile.streak} day streak</span>
        </div>
      </div>

      {/* Quick Stats Row - Desktop only */}
      <div className="hidden lg:block mb-6">
        <QuickStatsBar />
      </div>

      {/* AI Recommendations Carousel */}
      <AIRecommendationsCarousel />

      {/* Last Test Result + Recent Copilot Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <LastTestResultCard />
        <RecentCopilotCard />
      </div>

      {/* Daily Study Goal — Mobile only */}
      <div className="mb-4">
        <DailyStudyGoalRing />
      </div>

      {/* Two Column Layout for Tablet/Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Pending Homework */}
        <HomeworkSection />
        
        {/* Today's Schedule Timeline */}
        <ScheduleTimeline />
      </div>

      {/* Upcoming Tests Section */}
      <UpcomingTestsSection />
    </div>
  );
};

export default StudentDashboard;
