// Homework Section Component
// Collapsible list showing pending homework with urgency indicators

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, ChevronDown, ChevronRight, Clock, AlertTriangle } from "lucide-react";
import { Sparkles } from "lucide-react";
import { studentHomework, getHomeworkUrgency, formatRelativeDate, subjectColors } from "@/data/student/dashboard";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const HomeworkSection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);
  const pendingHomework = studentHomework.filter(hw => hw.status === 'pending');
  const displayCount = expanded ? pendingHomework.length : 3;

  const getUrgencyStyles = (urgency: 'urgent' | 'soon' | 'normal') => {
    switch (urgency) {
      case 'urgent':
        return {
          badge: 'bg-red-100 text-red-600',
          dot: 'bg-red-500',
          text: 'Urgent'
        };
      case 'soon':
        return {
          badge: 'bg-amber-100 text-amber-600',
          dot: 'bg-amber-500',
          text: 'Soon'
        };
      default:
        return {
          badge: 'bg-muted text-muted-foreground',
          dot: 'bg-muted-foreground/50',
          text: ''
        };
    }
  };

  const getSubjectIcon = (subject: string) => {
    const colors = subjectColors[subject] || subjectColors.math;
    return (
      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colors.icon} flex items-center justify-center shadow-sm`}>
        <BookOpen className="w-4 h-4 text-white" />
      </div>
    );
  };

  const handleHomeworkClick = (homework: typeof pendingHomework[0]) => {
    // Navigate to the subject page where homework is located
    // For now, show toast until homework viewer is implemented
    toast({
      title: "Opening Homework",
      description: `${homework.title} - Homework viewer coming soon!`,
      duration: 2000,
    });
    // Navigate to subject page as a fallback
    navigate(`/student/subjects/${homework.subject}`);
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-donut-coral" />
          <h3 className="font-semibold text-foreground text-sm">Pending Homework</h3>
          <span className="px-2 py-0.5 bg-donut-coral/10 text-donut-coral text-xs font-medium rounded-full">
            {pendingHomework.length}
          </span>
        </div>
        {pendingHomework.length > 3 && (
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-donut-coral font-medium hover:underline flex items-center gap-1"
          >
            {expanded ? 'Show less' : 'See all'}
            {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>
        )}
      </div>

      {/* Homework List */}
      <div className="space-y-2.5">
        {pendingHomework.slice(0, displayCount).map((hw) => {
          const urgency = getHomeworkUrgency(hw.dueDate);
          const urgencyStyles = getUrgencyStyles(urgency);
          
          return (
            <div 
              key={hw.id}
              onClick={() => handleHomeworkClick(hw)}
              className="flex items-center gap-3 p-3 bg-white/60 rounded-xl hover:bg-white/80 transition-colors cursor-pointer active:scale-[0.98]"
            >
              {getSubjectIcon(hw.subject)}
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm truncate">{hw.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{formatRelativeDate(hw.dueDate)}</span>
                  </div>
                  {urgency === 'urgent' && (
                    <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-medium flex items-center gap-1", urgencyStyles.badge)}>
                      <AlertTriangle className="w-2.5 h-2.5" />
                      {urgencyStyles.text}
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const params = new URLSearchParams();
                      params.set('routine', 's_doubt');
                      params.set('subject', hw.subject);
                      params.set('prompt', `Help me with my homework: ${hw.title}`);
                      navigate(`/student/copilot?${params.toString()}`);
                    }}
                    className="px-2 py-0.5 rounded-full bg-donut-coral/10 text-donut-coral text-[10px] font-medium flex items-center gap-1 hover:bg-donut-coral/20 transition-colors"
                  >
                    <Sparkles className="w-2.5 h-2.5" />
                    Ask AI
                  </button>
                </div>
              </div>
              
              <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </div>
          );
        })}
      </div>

      {pendingHomework.length === 0 && (
        <div className="text-center py-6 text-muted-foreground text-sm">
          🎉 All caught up! No pending homework.
        </div>
      )}
    </div>
  );
};

export default HomeworkSection;
