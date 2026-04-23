// Student Dashboard - Simplified Mobile-First Layout

import { studentProfile } from "@/data/student";
import { Flame } from "lucide-react";
import {
  AIRecommendationsCarousel,
  HomeworkSection,
  ScheduleTimeline,
  UpcomingTestsSection,
  LastTestResultCard,
  ExamTargetCard,
  DailyStudyGoalRing
} from "@/components/student/dashboard";

const StudentDashboard = () => {
  const firstName = studentProfile.name.split(' ')[0];

  return (
    <div className="w-full pb-24 lg:pb-6">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-start justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Hi, {firstName}! 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Let's continue learning
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-br from-donut-coral to-donut-orange rounded-full shadow-lg shadow-orange-300/40">
          <Flame className="w-4 h-4 text-white" />
          <span className="text-sm font-bold text-white">{studentProfile.streak}</span>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Here's your learning snapshot for today
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DailyStudyGoalRing compact />
          <div className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-br from-donut-coral to-donut-orange rounded-full shadow-lg shadow-orange-300/40">
            <Flame className="w-5 h-5 text-white" />
            <span className="text-sm font-bold text-white">{studentProfile.streak} day streak</span>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <AIRecommendationsCarousel />

      {/* Pending Homework — high priority */}
      <div className="mb-4">
        <HomeworkSection />
      </div>

      {/* Last Test Result (48h) + Exam Target */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <LastTestResultCard />
        <ExamTargetCard />
      </div>

      {/* Daily Study Goal — Mobile only */}
      <div className="mb-4 lg:hidden">
        <DailyStudyGoalRing />
      </div>

      {/* Today's Schedule */}
      <div className="mb-4">
        <ScheduleTimeline />
      </div>

      {/* Upcoming Tests */}
      <UpcomingTestsSection />
    </div>
  );
};

export default StudentDashboard;
