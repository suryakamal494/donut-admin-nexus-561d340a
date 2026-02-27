import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const difficultyColors: Record<string, string> = {
  easy: "text-emerald-600 dark:text-emerald-400",
  medium: "text-amber-600 dark:text-amber-400",
  hard: "text-red-600 dark:text-red-400",
};

const difficultyBgColors: Record<string, string> = {
  easy: "bg-emerald-500",
  medium: "bg-amber-500",
  hard: "bg-red-500",
};

interface DifficultySummary {
  difficulty: string;
  totalQuestions: number;
  avgCorrectRate: number;
}

interface InstituteDifficultyTabProps {
  difficultySummary: DifficultySummary[];
  totalQuestions: number;
}

export const InstituteDifficultyTab = ({ difficultySummary, totalQuestions }: InstituteDifficultyTabProps) => (
  <div className="space-y-3">
    {difficultySummary.map((d, i) => (
      <motion.div key={d.difficulty} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: i * 0.05 }}>
        <Card className="card-premium">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={cn("text-sm font-semibold capitalize", difficultyColors[d.difficulty])}>{d.difficulty}</span>
                <Badge variant="secondary" className="text-[10px]">{d.totalQuestions} Q</Badge>
              </div>
              <span className="text-sm font-bold text-foreground">{d.avgCorrectRate}%</span>
            </div>
            <Progress value={d.avgCorrectRate} className="h-2" />
            <p className="text-[10px] text-muted-foreground mt-1.5">
              Average correct rate across {d.totalQuestions} {d.difficulty} questions
            </p>
          </CardContent>
        </Card>
      </motion.div>
    ))}

    <Card className="card-premium">
      <CardContent className="p-4">
        <h4 className="text-xs font-semibold text-foreground mb-3">Distribution</h4>
        <div className="flex gap-1 h-6 rounded-lg overflow-hidden">
          {difficultySummary.map(d => {
            const pct = totalQuestions > 0 ? (d.totalQuestions / totalQuestions) * 100 : 0;
            return (
              <div key={d.difficulty} className={cn("flex items-center justify-center text-[9px] text-white font-bold", difficultyBgColors[d.difficulty])} style={{ width: `${pct}%` }}>
                {d.totalQuestions > 0 && `${Math.round(pct)}%`}
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-2">
          {difficultySummary.map(d => (
            <div key={d.difficulty} className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <div className={cn("w-2 h-2 rounded-full", difficultyBgColors[d.difficulty])} />
              <span className="capitalize">{d.difficulty}: {d.totalQuestions}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);
