import { useState } from "react";
import { AlertTriangle, BookOpen, PartyPopper, Eye, ChevronDown, ChevronUp, Sparkles, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import type { ActionableInsight } from "@/data/teacher/examResults";

interface ActionableInsightCardsProps {
  insights: ActionableInsight[];
  onTakeAction: (insight: ActionableInsight) => void;
}

const insightConfig: Record<ActionableInsight["type"], {
  icon: typeof AlertTriangle;
  borderColor: string;
  iconBg: string;
  iconColor: string;
}> = {
  reteach: {
    icon: AlertTriangle,
    borderColor: "border-l-red-500",
    iconBg: "bg-red-50 dark:bg-red-950/40",
    iconColor: "text-red-500",
  },
  practice: {
    icon: Target,
    borderColor: "border-l-amber-500",
    iconBg: "bg-amber-50 dark:bg-amber-950/40",
    iconColor: "text-amber-500",
  },
  celebrate: {
    icon: PartyPopper,
    borderColor: "border-l-emerald-500",
    iconBg: "bg-emerald-50 dark:bg-emerald-950/40",
    iconColor: "text-emerald-500",
  },
  attention: {
    icon: Eye,
    borderColor: "border-l-teal-500",
    iconBg: "bg-teal-50 dark:bg-teal-950/40",
    iconColor: "text-teal-500",
  },
};

const severityBadge: Record<ActionableInsight["severity"], { className: string; label: string }> = {
  critical: { className: "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400", label: "Urgent" },
  warning: { className: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400", label: "Attention" },
  positive: { className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400", label: "Positive" },
};

export const ActionableInsightCards = ({ insights, onTakeAction }: ActionableInsightCardsProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (insights.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Actionable Insights</h3>
        <span className="text-xs text-muted-foreground">· {insights.length} findings</span>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2">
        {insights.map((insight, idx) => {
          const config = insightConfig[insight.type];
          const badge = severityBadge[insight.severity];
          const Icon = config.icon;
          const isExpanded = expandedId === insight.id;
          const hasStudents = insight.affectedStudents.length > 0;

          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
            >
              <Card className={cn("card-premium border-l-4 overflow-hidden", config.borderColor)}>
                <CardContent className="p-3.5 space-y-2.5">
                  {/* Header row */}
                  <div className="flex items-start gap-2.5">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", config.iconBg)}>
                      <Icon className={cn("w-4 h-4", config.iconColor)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={cn("text-[10px] font-semibold rounded-full px-1.5 py-0.5", badge.className)}>
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-foreground leading-snug">{insight.finding}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{insight.detail}</p>
                    </div>
                  </div>

                  {/* Affected students (expandable) */}
                  {hasStudents && (
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : insight.id)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors w-full"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>{insight.affectedStudents.length} student{insight.affectedStudents.length > 1 ? 's' : ''} affected</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
                    </button>
                  )}

                  <AnimatePresence initial={false}>
                    {isExpanded && hasStudents && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-muted/50 rounded-lg p-2 space-y-1 max-h-32 overflow-y-auto">
                          {insight.affectedStudents.map((s) => (
                            <div key={s.id} className="flex items-center justify-between text-xs px-1.5 py-1">
                              <span className="font-medium truncate">{s.name}</span>
                              <span className="text-muted-foreground shrink-0 ml-2">{s.score}%</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action button */}
                  {insight.actionType !== 'none' && (
                    <Button
                      size="sm"
                      variant={insight.severity === 'critical' ? 'default' : 'outline'}
                      className={cn(
                        "w-full h-8 text-xs gap-1.5",
                        insight.severity === 'critical' && "gradient-button"
                      )}
                      onClick={() => onTakeAction(insight)}
                    >
                      <Sparkles className="w-3 h-3" />
                      {insight.suggestedAction}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
