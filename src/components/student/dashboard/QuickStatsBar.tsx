// Quick Stats Bar Component
// Horizontal row of stat pills showing subjects count, upcoming tests, and study streak

import { BookOpen, Calendar, Flame } from "lucide-react";
import { studentSubjects } from "@/data/student";
import { upcomingTests } from "@/data/student/dashboard";
import { studentProfile } from "@/data/student";
import DailyStudyGoalRing from "./DailyStudyGoalRing";

interface StatPill {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  gradient: string;
  shadowColor: string;
}

const QuickStatsBar = () => {
  const stats: StatPill[] = [
    {
      icon: <BookOpen className="w-4 h-4 text-white" />,
      value: studentSubjects.length,
      label: "Subjects",
      gradient: "from-blue-400 to-indigo-500",
      shadowColor: "shadow-blue-300/40"
    },
    {
      icon: <Calendar className="w-4 h-4 text-white" />,
      value: upcomingTests.length,
      label: "Tests",
      gradient: "from-violet-400 to-purple-500",
      shadowColor: "shadow-violet-300/40"
    },
    {
      icon: <Flame className="w-4 h-4 text-white" />,
      value: `${studentProfile.streak}d`,
      label: "Streak",
      gradient: "from-donut-coral to-donut-orange",
      shadowColor: "shadow-orange-300/40"
    },
  ];

  return (
    <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-hide">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className="flex-shrink-0 flex items-center gap-2.5 px-4 py-3 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm"
        >
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-md ${stat.shadowColor}`}>
            {stat.icon}
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      ))}
      <DailyStudyGoalRing compact />
    </div>
  );
};

export default QuickStatsBar;
