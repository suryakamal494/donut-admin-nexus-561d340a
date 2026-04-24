// Upcoming Test Card Component
// Individual card for upcoming tests/exams

import { useNavigate } from "react-router-dom";
import { FileText, Calendar, Sparkles } from "lucide-react";
import { subjectColors, formatRelativeDate, formatTestTime, type UpcomingTest } from "@/data/student/dashboard";
import { cn } from "@/lib/utils";

interface UpcomingTestCardProps {
  test: UpcomingTest;
}

const getTestTypeBadge = (type: UpcomingTest['type']) => {
  switch (type) {
    case 'quiz':
      return { bg: 'bg-blue-100 text-blue-600', label: 'Quiz' };
    case 'test':
      return { bg: 'bg-amber-100 text-amber-600', label: 'Test' };
    case 'exam':
      return { bg: 'bg-red-100 text-red-600', label: 'Exam' };
    default:
      return { bg: 'bg-muted text-muted-foreground', label: type };
  }
};

const UpcomingTestCard = ({ test }: UpcomingTestCardProps) => {
  const navigate = useNavigate();
  const colors = subjectColors[test.subject] || subjectColors.math;
  const typeBadge = getTestTypeBadge(test.type);
  const relativeDate = formatRelativeDate(test.date);
  const time = formatTestTime(test.date);

  const handleClick = () => {
    // Navigate to the Tests page
    navigate('/student/tests');
  };

  return (
    <div 
      onClick={handleClick}
      className="flex-shrink-0 w-[200px] lg:w-auto bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm p-3.5 hover:shadow-md transition-shadow cursor-pointer active:scale-[0.98]"
    >
      {/* Subject Icon & Type Badge */}
      <div className="flex items-start justify-between mb-2.5">
        <div className={cn("w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-sm", colors.icon)}>
          <FileText className="w-4 h-4 text-white" />
        </div>
        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", typeBadge.bg)}>
          {typeBadge.label}
        </span>
      </div>

      {/* Test Title */}
      <p className="font-semibold text-foreground text-sm truncate mb-1 capitalize">
        {test.subject}
      </p>
      <p className="text-xs text-muted-foreground truncate mb-2.5">{test.title}</p>

      {/* Date & Time */}
      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
        <Calendar className="w-3 h-3" />
        <span className="font-medium">{relativeDate}</span>
        <span>•</span>
        <span>{time}</span>
      </div>

      {/* Prepare with AI chip */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          const params = new URLSearchParams();
          params.set('subject', test.subject);
          params.set('intent', `Resume prep for upcoming ${test.type}: ${test.title}`);
          navigate(`/student/copilot?${params.toString()}`);
        }}
        className="mt-2.5 w-full px-2 py-1.5 rounded-xl bg-violet-50 text-violet-600 text-[10px] font-medium flex items-center justify-center gap-1.5 hover:bg-violet-100 transition-colors"
      >
        <Sparkles className="w-3 h-3" />
        Prepare
      </button>
    </div>
  );
};

export default UpcomingTestCard;
