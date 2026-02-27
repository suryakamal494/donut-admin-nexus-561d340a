import { Clock, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { getStatusColor } from "@/lib/reportColors";
import { motion } from "framer-motion";
import type { InstituteQuestionAnalysis } from "@/data/teacher/instituteTestDetailData";

const difficultyColors: Record<string, string> = {
  easy: "text-emerald-600 dark:text-emerald-400",
  medium: "text-amber-600 dark:text-amber-400",
  hard: "text-red-600 dark:text-red-400",
};

const typeLabels: Record<string, string> = {
  mcq_single: "MCQ (Single)", mcq_multiple: "MCQ (Multiple)",
  integer: "Integer", assertion_reasoning: "Assertion-Reasoning",
};

const statusBadge = (status: "strong" | "moderate" | "weak") => {
  const colors = getStatusColor(status);
  return <Badge variant="secondary" className={cn("text-[10px] px-1.5 py-0 font-medium", colors.badge)}>{status}</Badge>;
};

interface InstituteQuestionsTabProps {
  questions: InstituteQuestionAnalysis[];
}

export const InstituteQuestionsTab = ({ questions }: InstituteQuestionsTabProps) => (
  <div className="space-y-2">
    {questions.map((q, i) => (
      <motion.div key={q.questionId} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: i * 0.02 }}>
        <Card className="card-premium">
          <CardContent className="p-3 sm:p-3.5">
            <div className="flex items-start gap-3">
              <div className={cn("shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white", getStatusColor(q.status).bg)}>
                Q{q.questionNumber}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs font-semibold text-foreground">{q.chapter}</span>
                  <span className="text-[10px] text-muted-foreground">· {q.topic}</span>
                  {statusBadge(q.status)}
                </div>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap">
                  <span className={difficultyColors[q.difficulty]}>{q.difficulty}</span>
                  <span>{typeLabels[q.type]}</span>
                  <span>+{q.marks}/−{q.negativeMarks}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                  <div>
                    <div className="flex items-center justify-between text-[10px] mb-0.5">
                      <span className="text-muted-foreground">Correct</span>
                      <span className="font-semibold">{q.correctPercentage}%</span>
                    </div>
                    <Progress value={q.correctPercentage} className="h-1.5" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-[10px] mb-0.5">
                      <span className="text-muted-foreground">Attempted</span>
                      <span className="font-semibold">{q.attemptPercentage}%</span>
                    </div>
                    <Progress value={q.attemptPercentage} className="h-1.5" />
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground col-span-2 sm:col-span-1 mt-1 sm:mt-0">
                    <Clock className="w-3 h-3" />
                    <span className="font-medium">{Math.round(q.avgTimeSpent / 60)}m {q.avgTimeSpent % 60}s</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ))}
  </div>
);
