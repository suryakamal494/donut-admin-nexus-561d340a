// Recommendations Component
// Generates actionable study tips based on performance analysis

import { memo, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, AlertTriangle, Target, SkipForward, BookOpen, Brain } from "lucide-react";
import { motion } from "framer-motion";
import type { EnhancedQuestionResult } from "@/data/student/testResultsGenerator";
import { COGNITIVE_TYPES } from "@/data/student/testResultsGenerator";
import type { SectionResult } from "@/data/student/testResults";
import { getQuestionStats } from "@/data/student/testResults";

interface Recommendation {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  priority: "critical" | "moderate" | "general";
}

interface RecommendationsProps {
  questions: EnhancedQuestionResult[];
  sections: SectionResult[];
}

const priorityStyles = {
  critical: "border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-950/20",
  moderate: "border-l-4 border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20",
  general: "border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20",
};

const Recommendations = memo(function Recommendations({ questions, sections }: RecommendationsProps) {
  const tips = useMemo(() => {
    const recs: Recommendation[] = [];
    const { attempted, total: totalQ } = getQuestionStats(questions);
    const attemptedQs = questions.filter(q => q.isAttempted);

    // Difficulty accuracy
    const byDiff = (d: string) => {
      const qs = attemptedQs.filter(q => q.difficulty === d);
      return qs.length > 0 ? Math.round(qs.filter(q => q.isCorrect).length / qs.length * 100) : null;
    };
    const easyAcc = byDiff("easy");
    const hardAcc = byDiff("hard");

    // Cognitive accuracy
    const cogAccuracies: { type: string; accuracy: number; count: number }[] = [];
    COGNITIVE_TYPES.forEach(type => {
      const qs = attemptedQs.filter(q => q.cognitiveType === type);
      if (qs.length >= 2) {
        cogAccuracies.push({
          type,
          accuracy: Math.round(qs.filter(q => q.isCorrect).length / qs.length * 100),
          count: qs.length,
        });
      }
    });
    const weakestCog = cogAccuracies.length > 0
      ? cogAccuracies.reduce((a, b) => a.accuracy < b.accuracy ? a : b)
      : null;

    // Skipped rate
    const skippedRate = Math.round((totalQ - attempted) / totalQ * 100);

    // Weakest subject (for grand tests)
    const isMultiSection = sections.length > 1;
    const weakestSection = isMultiSection
      ? sections.reduce((a, b) => a.accuracy < b.accuracy ? a : b)
      : null;

    // Rule 1: Easy accuracy < 80%
    if (easyAcc !== null && easyAcc < 80) {
      recs.push({
        id: "easy-careless",
        icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
        title: "Losing marks on Easy questions",
        description: `Your accuracy on Easy questions is only ${easyAcc}%. These are marks you should be securing. Slow down, read carefully, and double-check your work.`,
        priority: "critical",
      });
    }

    // Rule 2: Hard accuracy < 30%
    if (hardAcc !== null && hardAcc < 30) {
      recs.push({
        id: "hard-practice",
        icon: <Target className="w-5 h-5 text-amber-500" />,
        title: "Hard questions need more practice",
        description: `You got only ${hardAcc}% of Hard questions right. Focus on advanced problem sets and previous year tough questions to build confidence.`,
        priority: "moderate",
      });
    }

    // Rule 3: Weakest cognitive type
    if (weakestCog && weakestCog.accuracy < 60) {
      recs.push({
        id: "cog-weak",
        icon: <Brain className="w-5 h-5 text-amber-500" />,
        title: `Strengthen your ${weakestCog.type} skills`,
        description: `Your ${weakestCog.type} accuracy is ${weakestCog.accuracy}% (${weakestCog.count} questions). Practice ${weakestCog.type.toLowerCase()}-focused problems to improve this thinking style.`,
        priority: "moderate",
      });
    }

    // Rule 4: Skipped > 20%
    if (skippedRate > 20) {
      recs.push({
        id: "skipped",
        icon: <SkipForward className="w-5 h-5 text-blue-500" />,
        title: "Too many unanswered questions",
        description: `You left ${skippedRate}% of questions unanswered. Even educated guesses can earn marks. Practice time management to attempt more questions.`,
        priority: skippedRate > 35 ? "critical" : "general",
      });
    }

    // Rule 5: Weakest subject (grand tests)
    if (weakestSection && weakestSection.accuracy < 50) {
      recs.push({
        id: "weak-subject",
        icon: <BookOpen className="w-5 h-5 text-red-500" />,
        title: `Focus more on ${weakestSection.subject}`,
        description: `${weakestSection.subject} is your weakest section at ${weakestSection.accuracy}% accuracy. Dedicate extra study time here — it's pulling your overall score down.`,
        priority: "critical",
      });
    }

    // Fallback: if no tips, add a general one
    if (recs.length === 0) {
      recs.push({
        id: "good-job",
        icon: <Lightbulb className="w-5 h-5 text-blue-500" />,
        title: "Great performance!",
        description: "You performed well across all areas. Keep revising consistently and challenge yourself with harder problem sets to stay sharp.",
        priority: "general",
      });
    }

    return recs;
  }, [questions, sections]);

  return (
    <Card>
      <CardHeader className="pb-3 px-4 pt-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <CardTitle className="text-base font-semibold">Recommendations</CardTitle>
          <Badge variant="secondary" className="text-xs ml-auto">{tips.length} tips</Badge>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-3">
        {tips.map((tip, i) => (
          <motion.div
            key={tip.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-lg p-3 ${priorityStyles[tip.priority]}`}
          >
            <div className="flex gap-3">
              <div className="mt-0.5 shrink-0">{tip.icon}</div>
              <div className="min-w-0">
                <p className="font-medium text-sm">{tip.title}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{tip.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
});

export default Recommendations;
