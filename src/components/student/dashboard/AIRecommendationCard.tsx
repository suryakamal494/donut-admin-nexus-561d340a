// AI Recommendation Card Component
// Light card design with orange accent for AI-powered learning suggestions

import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Play, AlertCircle, Trophy, Sparkles } from "lucide-react";
import type { AIRecommendation } from "@/data/student/dashboard";

interface AIRecommendationCardProps {
  recommendation: AIRecommendation;
  compact?: boolean;
}

const getIcon = (type: AIRecommendation['type']) => {
  switch (type) {
    case 'continue':
      return <Play className="w-4 h-4 text-white" />;
    case 'focus':
      return <AlertCircle className="w-4 h-4 text-white" />;
    case 'quick-win':
      return <Trophy className="w-4 h-4 text-white" />;
    default:
      return <Sparkles className="w-4 h-4 text-white" />;
  }
};

const AIRecommendationCard = memo(function AIRecommendationCard({ recommendation, compact = false }: AIRecommendationCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (recommendation.copilotRoutine) {
      const params = new URLSearchParams();
      params.set('routine', recommendation.copilotRoutine);
      if (recommendation.subject) params.set('subject', recommendation.subject);
      if (recommendation.copilotPrompt) params.set('prompt', recommendation.copilotPrompt);
      navigate(`/student/copilot?${params.toString()}`);
    } else {
      navigate('/student/copilot');
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`
        bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm
        border-l-4 border-l-donut-coral
        cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all duration-200
        ${compact ? 'p-3.5' : 'p-4'}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Orange gradient icon */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-donut-coral to-donut-orange flex items-center justify-center flex-shrink-0 shadow-sm shadow-donut-coral/20">
          {getIcon(recommendation.type)}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-donut-coral text-[10px] font-semibold uppercase tracking-wider mb-0.5">
            {recommendation.title}
          </p>
          <p className={`text-foreground font-medium ${compact ? 'text-sm line-clamp-2' : 'text-sm'}`}>
            {recommendation.description}
          </p>
        </div>
        
        {/* Action arrow */}
        <div className="flex-shrink-0 flex items-center">
          <div className="w-8 h-8 rounded-full bg-donut-coral/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-donut-coral" />
          </div>
        </div>
      </div>
    </div>
  );
});

AIRecommendationCard.displayName = "AIRecommendationCard";
export default AIRecommendationCard;
