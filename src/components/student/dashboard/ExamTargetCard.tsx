import { Target, Sparkles, ChevronRight, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ExamTarget {
  id: string;
  name: string;
  exam_date: string;
  target_score: number | null;
  max_score: number | null;
}

const ExamTargetCard = () => {
  const navigate = useNavigate();
  const [exam, setExam] = useState<ExamTarget | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const { data } = await supabase
          .from('student_exams')
          .select('id, name, exam_date, target_score, max_score')
          .gt('exam_date', new Date().toISOString().split('T')[0])
          .order('exam_date', { ascending: true })
          .limit(1)
          .single();

        if (data) setExam(data);
      } catch {
        // No upcoming exam
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, []);

  const getDaysLeft = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const handleStudyPlan = () => {
    if (exam) {
      // Scope-rich intent so the router resumes the existing exam-prep session.
      const params = new URLSearchParams();
      params.set(
        'intent',
        `Resume exam prep for ${exam.name}. Target: ${exam.target_score}/${exam.max_score}`,
      );
      navigate(`/student/copilot?${params.toString()}`);
    }
  };

  const handleSetTarget = () => {
    const params = new URLSearchParams();
    params.set('intent', "Help me set my exam target and create this week's study plan");
    navigate(`/student/copilot?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-md">
            <Target className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">My Target</h3>
        </div>
        <div className="space-y-2 animate-pulse">
          <div className="h-4 bg-secondary/50 rounded w-3/4" />
          <div className="h-3 bg-secondary/30 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-md">
            <Target className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">My Target</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-3">Set your exam target to track your preparation journey.</p>
        <button
          onClick={handleSetTarget}
          className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-white py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 hover:shadow-lg hover:shadow-violet-300/40 transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Set Exam Target
        </button>
      </div>
    );
  }

  const daysLeft = getDaysLeft(exam.exam_date);
  const totalDays = 180; // approximate prep window
  const progressPercent = Math.max(0, Math.min(100, ((totalDays - daysLeft) / totalDays) * 100));

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-md shadow-violet-300/40">
          <Target className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">My Target</h3>
      </div>

      {/* Exam info */}
      <p className="text-sm font-medium text-foreground truncate">{exam.name}</p>
      <div className="flex items-center gap-2 mt-1 mb-3">
        {exam.target_score && exam.max_score && (
          <span className="text-xs font-medium text-muted-foreground">Target: {exam.target_score}/{exam.max_score}</span>
        )}
        <span className="text-xs text-muted-foreground">•</span>
        <span className="text-xs font-semibold text-violet-600">{daysLeft} days left</span>
      </div>

      {/* Days progress bar */}
      <div className="mb-4">
        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-400 to-purple-500 rounded-full transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Action */}
      <button
        onClick={handleStudyPlan}
        className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-white py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 hover:shadow-lg hover:shadow-violet-300/40 transition-all"
      >
        <Sparkles className="w-3.5 h-3.5" /> Study Plan <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  );
};

export default ExamTargetCard;