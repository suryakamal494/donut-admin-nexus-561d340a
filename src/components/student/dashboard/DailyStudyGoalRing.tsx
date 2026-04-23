import { useNavigate } from "react-router-dom";
import { dailyStudyGoal } from "@/data/student/dashboard";

interface DailyStudyGoalRingProps {
  compact?: boolean;
}

const DailyStudyGoalRing = ({ compact = false }: DailyStudyGoalRingProps) => {
  const navigate = useNavigate();
  const { current, target } = dailyStudyGoal;
  const percentage = Math.min((current / target) * 100, 100);
  
  const radius = compact ? 18 : 28;
  const strokeWidth = compact ? 3 : 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const size = (radius + strokeWidth) * 2;

  const handleClick = () => {
    const params = new URLSearchParams();
    params.set('routine', 's_practice');
    params.set('prompt', "Let's continue my daily study goal");
    navigate(`/student/copilot?${params.toString()}`);
  };

  if (compact) {
    return (
      <button onClick={handleClick} className="flex items-center gap-2.5 px-4 py-3 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm flex-shrink-0">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle cx={radius + strokeWidth} cy={radius + strokeWidth} r={radius} fill="none" stroke="hsl(var(--secondary))" strokeWidth={strokeWidth} />
          <circle cx={radius + strokeWidth} cy={radius + strokeWidth} r={radius} fill="none" stroke="hsl(var(--donut-coral, 15 90% 65%))" strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-700" />
        </svg>
        <div>
          <p className="text-lg font-bold text-foreground">{current}<span className="text-xs font-normal text-muted-foreground">m</span></p>
          <p className="text-[10px] text-muted-foreground">/{target}m goal</p>
        </div>
      </button>
    );
  }

  return (
    <button onClick={handleClick} className="w-full flex items-center gap-4 p-4 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm lg:hidden">
      <svg width={size} height={size} className="transform -rotate-90 flex-shrink-0">
        <circle cx={radius + strokeWidth} cy={radius + strokeWidth} r={radius} fill="none" stroke="hsl(var(--secondary))" strokeWidth={strokeWidth} />
        <circle cx={radius + strokeWidth} cy={radius + strokeWidth} r={radius} fill="none" stroke="hsl(var(--donut-coral, 15 90% 65%))" strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-700" />
      </svg>
      <div className="text-left">
        <p className="text-sm font-semibold text-foreground">{current} min today</p>
        <p className="text-xs text-muted-foreground">Daily goal: {target} min</p>
      </div>
      <div className="ml-auto text-right">
        <p className="text-lg font-bold text-foreground">{Math.round(percentage)}%</p>
      </div>
    </button>
  );
};

export default DailyStudyGoalRing;