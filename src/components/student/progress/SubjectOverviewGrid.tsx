import { memo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Atom, Calculator, FlaskConical, Leaf, BookOpen, Languages, Globe, Laptop, AlertTriangle } from "lucide-react";
import type { SubjectSummary } from "@/data/student/progressData";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Atom, Calculator, FlaskConical, Leaf,
  BookOpen, Languages, Globe, Laptop,
};

interface SubjectOverviewGridProps {
  subjects: SubjectSummary[];
  onSelect: (subjectId: string) => void;
  selectedId?: string;
}

const SubjectOverviewGrid = memo(({ subjects, onSelect, selectedId }: SubjectOverviewGridProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 border border-white/50 shadow-lg"
    >
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Subjects</h3>

      {/* Responsive grid: 2 cols mobile, 3 tablet, 4 desktop — scales for 2-10+ subjects */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {subjects.map((subject, i) => {
          const Icon = iconMap[subject.icon] || Atom;
          const TrendIcon = subject.trend === "up" ? TrendingUp : subject.trend === "down" ? TrendingDown : Minus;
          const trendColor = subject.trend === "up" ? "text-emerald-500" : subject.trend === "down" ? "text-red-500" : "text-amber-500";
          const isSelected = selectedId === subject.subjectId;

          const accColor = subject.accuracy >= 75 ? "bg-emerald-100 text-emerald-700"
            : subject.accuracy >= 50 ? "bg-blue-100 text-blue-700"
            : subject.accuracy >= 35 ? "bg-amber-100 text-amber-700"
            : "bg-red-100 text-red-700";

          return (
            <motion.button
              key={subject.subjectId}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              onClick={() => onSelect(subject.subjectId)}
              className={`
              p-3 rounded-xl border transition-all text-left
                ${isSelected 
                  ? 'border-[hsl(var(--donut-coral))] bg-gradient-to-br from-[hsl(var(--donut-coral))]/5 to-[hsl(var(--donut-orange))]/5 shadow-md' 
                  : 'border-white/50 bg-white/50 hover:bg-white/80 hover:shadow-sm'
                }
              `}
            >
              {/* Row 1: Icon + Name + Trend */}
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${subject.color}15` }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: subject.color }} />
                </div>
                <span className="text-xs font-semibold text-foreground truncate flex-1">{subject.subjectName}</span>
                <div className={`shrink-0 ${trendColor}`}>
                  <TrendIcon className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Row 2: Chapter progress bar */}
              <div className="mb-1.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-muted-foreground">Chapters</span>
                  <span className="text-[10px] font-medium text-foreground">{subject.chaptersStrong}/{subject.chaptersTotal}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted/40 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${subject.chaptersTotal > 0 ? (subject.chaptersStrong / subject.chaptersTotal) * 100 : 0}%`,
                      backgroundColor: subject.color,
                    }}
                  />
                </div>
              </div>

              {/* Row 3: Accuracy + Weak topics */}
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${accColor}`}>
                  {subject.accuracy}%
                </span>
                {subject.weakTopicCount > 0 ? (
                  <span className="text-[10px] font-medium text-red-500 flex items-center gap-0.5">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    {subject.weakTopicCount} weak
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-emerald-500">All clear</span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
});

SubjectOverviewGrid.displayName = "SubjectOverviewGrid";
export default SubjectOverviewGrid;