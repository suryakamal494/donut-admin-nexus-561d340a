import { useState } from "react";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, BookOpen, Sparkles, ChevronDown, ChevronUp, Users } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import type { BatchHealthSummary } from "@/data/teacher/reportsData";

interface BatchHealthCardProps {
  health: BatchHealthSummary;
  batchId: string;
  onNavigateToChapter?: (chapterId: string) => void;
  onNavigateToStudent?: (studentId: string) => void;
}

const TrendIcon = ({ trend }: { trend: "up" | "down" | "flat" }) => {
  if (trend === "up") return <TrendingUp className="w-3 h-3 text-emerald-500" />;
  if (trend === "down") return <TrendingDown className="w-3 h-3 text-red-500" />;
  return <Minus className="w-3 h-3 text-muted-foreground" />;
};

const trendColor = (trend: "up" | "down" | "flat") =>
  trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-600" : "text-muted-foreground";

export const BatchHealthCard = ({ health, batchId, onNavigateToChapter, onNavigateToStudent }: BatchHealthCardProps) => {
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(() => {
    if (typeof window !== "undefined") return window.innerWidth >= 768;
    return true;
  });

  const overallTrendIcon = health.overallTrend === "improving"
    ? <TrendingUp className="w-4 h-4" />
    : health.overallTrend === "declining"
    ? <TrendingDown className="w-4 h-4" />
    : <Minus className="w-4 h-4" />;

  const overallTrendColor = health.overallTrend === "improving"
    ? "text-emerald-100"
    : health.overallTrend === "declining"
    ? "text-red-200"
    : "text-white/70";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Card className="overflow-hidden border-0 shadow-md">
        {/* Gradient header — always visible */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-700 dark:to-cyan-700 px-4 py-3 sm:px-5 sm:py-3.5"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-white/80" />
              <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">Today's Focus</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn("flex items-center gap-1 text-xs font-medium", overallTrendColor)}>
                {overallTrendIcon}
                {health.overallTrend === "improving" ? "Improving" : health.overallTrend === "declining" ? "Declining" : "Stable"}
              </span>
              {isExpanded
                ? <ChevronUp className="w-4 h-4 text-white/60" />
                : <ChevronDown className="w-4 h-4 text-white/60" />
              }
            </div>
          </div>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-2">
            {health.weakTopicCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-white">
                <BookOpen className="w-3 h-3" />
                {health.weakTopicCount} topic{health.weakTopicCount > 1 ? "s" : ""} need attention
              </span>
            )}
            {health.atRiskCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-white">
                <AlertTriangle className="w-3 h-3" />
                {health.atRiskCount} at-risk student{health.atRiskCount > 1 ? "s" : ""}
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-white">
              <Users className="w-3 h-3" />
              Last exam avg {health.recentExamAvg}%
            </span>
          </div>
        </button>

        {/* Expandable detail section */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <CardContent className="p-4 sm:p-5 space-y-4 bg-card">
                {/* Suggested focus line */}
                <div className="rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/10 px-3 py-2.5">
                  <p className="text-xs font-medium text-primary mb-0.5">Suggested Focus</p>
                  <p className="text-sm text-foreground leading-relaxed">{health.suggestedFocus}</p>
                </div>

                {/* Priority Topics */}
                {health.priorityTopics.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Priority Topics</h4>
                    <div className="space-y-1.5">
                      {health.priorityTopics.map((topic, i) => (
                        <button
                          key={i}
                          onClick={() => onNavigateToChapter?.(topic.chapterId)}
                          className="w-full flex items-center justify-between rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors px-3 py-2 text-left"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{topic.topic}</p>
                            <p className="text-xs text-muted-foreground">{topic.chapter} · {topic.examCount} exam{topic.examCount > 1 ? "s" : ""}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 ml-3">
                            <span className={cn(
                              "text-sm font-semibold",
                              topic.successRate < 35 ? "text-red-600" : topic.successRate < 50 ? "text-amber-600" : "text-teal-600"
                            )}>
                              {topic.successRate}%
                            </span>
                            <TrendIcon trend={topic.trend} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Students to check in with */}
                {health.studentsToCheckIn.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Students to Check In</h4>
                    <div className="space-y-1.5">
                      {health.studentsToCheckIn.map((student, i) => (
                        <button
                          key={i}
                          onClick={() => onNavigateToStudent?.(student.studentId)}
                          className="w-full flex items-center justify-between rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors px-3 py-2 text-left"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{student.studentName}</p>
                            <p className="text-xs text-muted-foreground">{student.reason}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 ml-3">
                            <span className={cn(
                              "text-sm font-semibold",
                              student.avgPercentage < 35 ? "text-red-600" : student.avgPercentage < 50 ? "text-amber-600" : "text-teal-600"
                            )}>
                              {student.avgPercentage}%
                            </span>
                            <TrendIcon trend={student.trend} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};
