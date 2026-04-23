import { Sparkles, MessageCircle, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface RecentThread {
  id: string;
  title: string;
  routine_key: string;
  subject: string | null;
  last_message_at: string;
}

const routineLabels: Record<string, { label: string; color: string }> = {
  s_doubt: { label: 'Doubt', color: 'bg-blue-100 text-blue-700' },
  s_practice: { label: 'Practice', color: 'bg-emerald-100 text-emerald-700' },
  s_exam_prep: { label: 'Exam Prep', color: 'bg-violet-100 text-violet-700' },
  s_explain: { label: 'Explain', color: 'bg-amber-100 text-amber-700' },
};

const RecentCopilotCard = () => {
  const navigate = useNavigate();
  const [thread, setThread] = useState<RecentThread | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const { data } = await supabase
          .from('student_copilot_threads')
          .select('id, title, routine_key, subject, last_message_at')
          .order('last_message_at', { ascending: false })
          .limit(1)
          .single();
        
        if (data) setThread(data);
      } catch {
        // No threads yet — that's fine
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const handleContinue = () => {
    if (thread) {
      navigate(`/student/copilot?thread=${thread.id}`);
    } else {
      navigate('/student/copilot');
    }
  };

  const handleStartSession = () => {
    navigate('/student/copilot');
  };

  const routine = thread ? routineLabels[thread.routine_key] || { label: 'Study', color: 'bg-secondary text-secondary-foreground' } : null;

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-donut-coral to-donut-orange flex items-center justify-center shadow-md shadow-orange-300/40">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">Recent Study Session</h3>
      </div>

      {loading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-4 bg-secondary/50 rounded w-3/4" />
          <div className="h-3 bg-secondary/30 rounded w-1/2" />
        </div>
      ) : thread ? (
        <>
          {/* Thread info */}
          <p className="text-sm font-medium text-foreground truncate">{thread.title}</p>
          <div className="flex items-center gap-2 mt-1 mb-3">
            {routine && (
              <Badge className={`${routine.color} border-0 text-[10px] font-medium px-2 py-0`}>
                {routine.label}
              </Badge>
            )}
            {thread.subject && (
              <span className="text-xs text-muted-foreground capitalize">{thread.subject}</span>
            )}
            <span className="text-xs text-muted-foreground">• {formatTimeAgo(thread.last_message_at)}</span>
          </div>

          {/* Continue button */}
          <button
            onClick={handleContinue}
            className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-white py-2.5 rounded-xl bg-gradient-to-r from-donut-coral to-donut-orange hover:shadow-lg hover:shadow-orange-300/40 transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5" /> Continue <ChevronRight className="w-3 h-3" />
          </button>
        </>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-3">No study sessions yet. Start your first AI-powered session!</p>
          <button
            onClick={handleStartSession}
            className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-white py-2.5 rounded-xl bg-gradient-to-r from-donut-coral to-donut-orange hover:shadow-lg hover:shadow-orange-300/40 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" /> Start Studying
          </button>
        </>
      )}
    </div>
  );
};

export default RecentCopilotCard;