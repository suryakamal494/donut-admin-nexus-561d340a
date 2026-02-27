import { ChevronDown, ChevronUp, Target, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { InfoTooltip } from "@/components/timetable/InfoTooltip";
import type { DifficultyBreakdown } from "@/data/teacher/studentReportData";

const levelColors: Record<string, { bg: string; text: string; label: string }> = {
  easy: { bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-400", label: "Easy" },
  medium: { bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-700 dark:text-amber-400", label: "Medium" },
  hard: { bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-700 dark:text-red-400", label: "Hard" },
};

interface DifficultyAnalysisProps {
  difficultyBreakdown: DifficultyBreakdown[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DifficultyAnalysis = ({ difficultyBreakdown, isOpen, onOpenChange }: DifficultyAnalysisProps) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
    <Card className="card-premium">
      <Collapsible open={isOpen} onOpenChange={onOpenChange}>
        <CollapsibleTrigger asChild>
          <div className="cursor-pointer hover:bg-muted/30 transition-colors px-4 pt-4 pb-3">
            <div className="text-sm font-semibold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Difficulty Analysis
                <InfoTooltip content="Accuracy breakdown by question difficulty level. Shows how the student performs on easy, medium, and hard questions — helps identify if they struggle only with harder content." />
              </div>
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="px-4 pb-4 pt-0">
            <div className="grid grid-cols-3 gap-2">
              {difficultyBreakdown.map(d => {
                const lc = levelColors[d.level];
                return (
                  <div key={d.level} className={cn("rounded-xl p-3 text-center", lc.bg)}>
                    <p className="text-[10px] text-muted-foreground font-medium mb-1">{lc.label}</p>
                    <p className={cn("text-lg font-bold", lc.text)}>{d.accuracy}%</p>
                    <p className="text-[10px] text-muted-foreground">{d.questionsAttempted} Q</p>
                    <div className="flex items-center justify-center gap-1 mt-1 text-[10px] text-muted-foreground">
                      <Clock className="w-2.5 h-2.5" />
                      {d.avgTimePerQuestion}s
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  </motion.div>
);
