import { useState } from "react";
import { BookOpen, Clock, Copy, ChevronDown, ChevronUp, CheckCircle2, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import type { QuestionAnalysis, CognitiveType } from "@/data/teacher/examResults";

// ── Types ──

interface ReteachingTopic {
  topic: string;
  successRate: number;
  questionCount: number;
  suggestedApproach: string;
  estimatedMinutes: number;
  cognitiveType: CognitiveType;
}

interface ReteachingPlan {
  topics: ReteachingTopic[];
  totalEstimatedMinutes: number;
  overallAdvice: string;
}

// ── Mock data generator ──

function getSuggestedApproach(cognitiveType: CognitiveType, topic: string): string {
  const approaches: Record<CognitiveType, string> = {
    Conceptual: `Use visual diagrams and real-world analogies to rebuild understanding of ${topic}.`,
    Numerical: `Walk through 2-3 worked examples of ${topic}, then assign similar practice problems.`,
    Logical: `Present ${topic} as a step-by-step logical chain — use flowcharts to show reasoning.`,
    Analytical: `Give students a solved problem on ${topic} and ask them to identify each step's purpose.`,
    Application: `Use real-world scenario questions on ${topic} to bridge theory to practice.`,
    Memory: `Create a quick-reference sheet for ${topic} formulas and key facts, then quiz students.`,
  };
  return approaches[cognitiveType] || `Review core concepts of ${topic} with guided examples.`;
}

export function generateMockReteachingPlan(questions: QuestionAnalysis[]): ReteachingPlan {
  // Group weak questions by topic
  const weakQuestions = questions.filter(q => q.successRate < 50);
  const topicMap = new Map<string, { totalRate: number; count: number; cogType: CognitiveType }>();

  for (const q of weakQuestions) {
    const existing = topicMap.get(q.topic);
    if (existing) {
      existing.totalRate += q.successRate;
      existing.count += 1;
    } else {
      topicMap.set(q.topic, { totalRate: q.successRate, count: 1, cogType: q.cognitiveType });
    }
  }

  const topics: ReteachingTopic[] = Array.from(topicMap.entries())
    .map(([topic, data]) => ({
      topic,
      successRate: Math.round(data.totalRate / data.count),
      questionCount: data.count,
      suggestedApproach: getSuggestedApproach(data.cogType, topic),
      estimatedMinutes: 5 + Math.min(data.count, 3) * 2,
      cognitiveType: data.cogType,
    }))
    .sort((a, b) => a.successRate - b.successRate)
    .slice(0, 5);

  const totalEstimatedMinutes = topics.reduce((s, t) => s + t.estimatedMinutes, 0);

  const topicNames = topics.slice(0, 2).map(t => t.topic).join(" and ");
  const overallAdvice = topics.length > 0
    ? `Prioritize ${topicNames} in your next session — these had the lowest class accuracy.`
    : "All topics were well understood — consider advancing to the next chapter.";

  return { topics, totalEstimatedMinutes, overallAdvice };
}

// ── Component ──

interface ReteachingPlanCardProps {
  questions: QuestionAnalysis[];
  onGenerateHomework?: (topics: string[]) => void;
}

export const ReteachingPlanCard = ({ questions, onGenerateHomework }: ReteachingPlanCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const plan = generateMockReteachingPlan(questions);

  if (plan.topics.length === 0) return null;

  const handleCopyPlan = () => {
    const text = [
      "📋 Reteaching Plan",
      "",
      plan.overallAdvice,
      "",
      ...plan.topics.map((t, i) =>
        `${i + 1}. ${t.topic} (${t.successRate}% accuracy, ${t.questionCount} Qs)\n   Approach: ${t.suggestedApproach}\n   Time: ~${t.estimatedMinutes} min`
      ),
      "",
      `Total estimated time: ~${plan.totalEstimatedMinutes} minutes`,
    ].join("\n");

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast({ title: "Plan copied!", description: "Reteaching plan copied to clipboard." });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="card-premium border-amber-200 dark:border-amber-800/40 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
        <CardContent className="p-4 sm:p-5 space-y-3">
          {/* Header bar */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <span className="text-sm font-semibold text-foreground">
                  {plan.topics.length} topic{plan.topics.length !== 1 ? "s" : ""} need reteaching
                </span>
                <span className="text-xs text-muted-foreground ml-2 hidden sm:inline">
                  · ~{plan.totalEstimatedMinutes} min estimated
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] text-muted-foreground border-muted">Mock Data</Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setExpanded(!expanded)}
                className="gap-1 text-xs h-8"
              >
                {expanded ? "Hide" : "View Plan"}
                {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </Button>
            </div>
          </div>

          {/* Expandable plan */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-3 pt-2 border-t border-border">
                  {/* Overall advice */}
                  <p className="text-sm text-foreground leading-relaxed">{plan.overallAdvice}</p>

                  {/* Topics */}
                  <div className="space-y-2">
                    {plan.topics.map((topic, i) => (
                      <div
                        key={topic.topic}
                        className="rounded-lg bg-muted/50 p-3 space-y-1.5 border-l-2 border-l-amber-500"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs font-bold text-muted-foreground w-5 shrink-0">{i + 1}.</span>
                            <span className="text-sm font-semibold text-foreground truncate">{topic.topic}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge className="text-[10px] bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border-0">
                              {topic.successRate}%
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {topic.estimatedMinutes}m
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed pl-7">
                          {topic.suggestedApproach}
                        </p>
                        <div className="flex items-center gap-2 pl-7">
                          <Badge variant="outline" className="text-[10px]">{topic.cognitiveType}</Badge>
                          <span className="text-[10px] text-muted-foreground">{topic.questionCount} question{topic.questionCount !== 1 ? "s" : ""}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      Total: ~{plan.totalEstimatedMinutes} minutes
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={handleCopyPlan} className="gap-1.5 text-xs h-8">
                        {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        {copied ? "Copied!" : "Copy Plan"}
                      </Button>
                      {onGenerateHomework && (
                        <Button
                          size="sm"
                          className="gap-1.5 text-xs h-8 gradient-button"
                          onClick={() => onGenerateHomework(plan.topics.map(t => t.topic))}
                        >
                          <Sparkles className="w-3 h-3" />
                          Generate Homework
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};
