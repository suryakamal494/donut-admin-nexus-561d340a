import { BarChart3, Sparkles, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { lastTestResult, subjectColors } from "@/data/student/dashboard";
import { Progress } from "@/components/ui/progress";

const LastTestResultCard = () => {
  const navigate = useNavigate();
  const result = lastTestResult;
  const colors = subjectColors[result.subject] || subjectColors.math;

  // 48-hour visibility window
  const hoursSinceTest = (Date.now() - new Date(result.date).getTime()) / (1000 * 60 * 60);
  if (hoursSinceTest > 48) return null;

  const handlePrepare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const params = new URLSearchParams();
    params.set('subject', result.subject);
    params.set('intent', `Debrief my ${result.testName} in ${result.subject} and plan what to fix`);
    navigate(`/student/copilot?${params.toString()}`);
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${colors.icon} flex items-center justify-center shadow-md`}>
          <BarChart3 className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">Last Test Result</h3>
      </div>

      {/* Test info */}
      <p className="text-sm font-medium text-foreground truncate">{result.testName}</p>
      <p className="text-xs text-muted-foreground capitalize mb-3">{result.subject}</p>

      {/* Score and rank */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl font-bold text-foreground">{result.score}<span className="text-sm font-normal text-muted-foreground">/{result.totalMarks}</span></span>
        <span className="text-xs text-muted-foreground">•</span>
        <span className="text-xs font-medium text-muted-foreground">Rank #{result.rank}/{result.totalStudents}</span>
      </div>

      {/* Accuracy bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] text-muted-foreground">Accuracy</span>
          <span className="text-[10px] font-medium text-foreground">{result.accuracy}%</span>
        </div>
        <Progress value={result.accuracy} className="h-1.5" />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => navigate(`/student/tests/${result.id}/results`)}
          className="flex-1 flex items-center justify-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground py-2 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
        >
          View Details <ChevronRight className="w-3 h-3" />
        </button>
        <button
          onClick={handlePrepare}
          className="flex items-center gap-1 text-xs font-medium text-donut-coral hover:text-donut-orange px-3 py-2 rounded-xl bg-donut-coral/10 hover:bg-donut-coral/20 transition-colors"
        >
          <Sparkles className="w-3 h-3" /> Prepare
        </button>
      </div>
    </div>
  );
};

export default LastTestResultCard;