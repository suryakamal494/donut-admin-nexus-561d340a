import { memo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Atom, Calculator, FlaskConical, Leaf, BookOpen, Languages, Globe, Laptop } from "lucide-react";
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
              p-3.5 rounded-xl border transition-all text-left
                ${isSelected 
                  ? 'border-[hsl(var(--donut-coral))] bg-gradient-to-br from-[hsl(var(--donut-coral))]/5 to-[hsl(var(--donut-orange))]/5 shadow-md' 
                  : 'border-white/50 bg-white/50 hover:bg-white/80 hover:shadow-sm'
                }
              `}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${subject.color}15` }}>
                  <Icon className="w-4 h-4" style={{ color: subject.color }} />
                </div>
                <span className="text-xs font-semibold text-foreground truncate">{subject.subjectName}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${accColor}`}>
                  {subject.accuracy}%
                </span>
                <div className={`flex items-center gap-0.5 ${trendColor}`}>
                  <TrendIcon className="w-3 h-3" />
                </div>
              </div>

              <div className="mt-2 text-[10px] text-muted-foreground text-right">
                <span>{subject.chaptersStrong}/{subject.chaptersTotal} strong</span>
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