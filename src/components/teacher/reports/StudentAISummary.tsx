import { useState } from "react";
import { Sparkles, ChevronDown, ChevronUp, ArrowDown, Zap, TrendingDown, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import type { StudentAIInsight } from "@/data/teacher/studentReportData";

interface StudentAISummaryProps {
  insight: StudentAIInsight;
  onGenerateHomework: () => void;
  onScrollToWeakTopics: () => void;
}

export const StudentAISummary = ({ insight, onGenerateHomework, onScrollToWeakTopics }: StudentAISummaryProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}>
      <Card className="card-premium border-primary/20 overflow-hidden">
        {/* Gradient accent bar */}
        <div className="h-1 bg-gradient-to-r from-violet-500 via-primary to-teal-500" />

        <CardContent className="p-4 sm:p-5 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Summary</span>
            </div>
            <Badge variant="outline" className="text-[10px] text-muted-foreground border-muted">
              Mock Data
            </Badge>
          </div>

          {/* Summary paragraph */}
          <p className="text-sm text-foreground leading-relaxed">{insight.summary}</p>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button size="sm" onClick={onGenerateHomework} className="gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs h-8">
              <Sparkles className="w-3 h-3" />
              Generate Homework
            </Button>
            <Button size="sm" variant="outline" onClick={onScrollToWeakTopics} className="gap-1.5 text-xs h-8">
              <ArrowDown className="w-3 h-3" />
              View Weak Topics
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setExpanded(!expanded)}
              className="ml-auto gap-1 text-xs h-8 text-muted-foreground"
            >
              {expanded ? "Less" : "Details"}
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </Button>
          </div>

          {/* Expandable details */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-2.5 pt-2 border-t border-border">
                  {/* Strengths */}
                  {insight.strengths.length > 0 && (
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-foreground mb-0.5">Strengths</p>
                        <div className="flex flex-wrap gap-1">
                          {insight.strengths.map((s) => (
                            <Badge key={s} className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-0">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Priorities */}
                  {insight.priorities.length > 0 && (
                    <div className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-foreground mb-0.5">Priority Focus</p>
                        <div className="flex flex-wrap gap-1">
                          {insight.priorities.map((p) => (
                            <Badge key={p} className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border-0">
                              {p}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Engagement note */}
                  {insight.engagementNote && (
                    <div className="flex items-start gap-2">
                      <TrendingDown className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-foreground mb-0.5">Engagement</p>
                        <p className="text-xs text-muted-foreground">{insight.engagementNote}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};
