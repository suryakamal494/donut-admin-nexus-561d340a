// Time Analysis Component
// Enhanced breakdown: efficiency, correct vs wrong time, slowest questions

import { memo, useMemo } from "react";
import { Clock, Timer, AlertTriangle, Zap, CheckCircle2, XCircle, SkipForward, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { QuestionResult, SectionResult } from "@/data/student/testResults";
import { formatDuration, getSubjectColor } from "@/data/student/testResults";

interface TimeAnalysisProps {
  questions: QuestionResult[];
  sections: SectionResult[];
  totalTime: number;
  totalDuration: number; // in minutes
}

const TimeAnalysis = memo(function TimeAnalysis({
  questions,
  sections,
  totalTime,
  totalDuration,
}: TimeAnalysisProps) {
  const isMultiSection = sections.length > 1;

  // Core time stats
  const timeStats = useMemo(() => {
    const correctQs = questions.filter(q => q.isCorrect);
    const wrongQs = questions.filter(q => q.isAttempted && !q.isCorrect);
    const skippedQs = questions.filter(q => !q.isAttempted);

    const timeOnCorrect = correctQs.reduce((s, q) => s + q.timeSpent, 0);
    const timeOnWrong = wrongQs.reduce((s, q) => s + q.timeSpent, 0);
    const timeOnSkipped = skippedQs.reduce((s, q) => s + q.timeSpent, 0);

    const avgCorrect = correctQs.length > 0 ? Math.round(timeOnCorrect / correctQs.length) : 0;
    const avgWrong = wrongQs.length > 0 ? Math.round(timeOnWrong / wrongQs.length) : 0;

    const efficiencyPercent = totalTime > 0 ? Math.round((timeOnCorrect / totalTime) * 100) : 0;

    return {
      timeOnCorrect, timeOnWrong, timeOnSkipped,
      avgCorrect, avgWrong,
      correctCount: correctQs.length, wrongCount: wrongQs.length, skippedCount: skippedQs.length,
      efficiencyPercent,
    };
  }, [questions, totalTime]);

  // Top 5 slowest questions
  const slowestQuestions = useMemo(() => {
    return [...questions]
      .sort((a, b) => b.timeSpent - a.timeSpent)
      .slice(0, 5);
  }, [questions]);

  // Time distribution buckets
  const timeDistribution = useMemo(() => {
    const buckets = [
      { label: "< 30s", min: 0, max: 30, count: 0, color: "bg-emerald-500" },
      { label: "30s-1m", min: 30, max: 60, count: 0, color: "bg-blue-500" },
      { label: "1-2m", min: 60, max: 120, count: 0, color: "bg-amber-500" },
      { label: "2-3m", min: 120, max: 180, count: 0, color: "bg-orange-500" },
      { label: "> 3m", min: 180, max: Infinity, count: 0, color: "bg-red-500" },
    ];
    questions.forEach(q => {
      const bucket = buckets.find(b => q.timeSpent >= b.min && q.timeSpent < b.max);
      if (bucket) bucket.count++;
    });
    return buckets;
  }, [questions]);

  const maxBucketCount = Math.max(...timeDistribution.map(b => b.count));

  // Subject-wise efficiency (for grand tests)
  const subjectEfficiency = useMemo(() => {
    if (!isMultiSection) return [];
    return sections.map(section => {
      const sQs = questions.filter(q => q.sectionId === section.id);
      const correctQs = sQs.filter(q => q.isCorrect);
      const wrongQs = sQs.filter(q => q.isAttempted && !q.isCorrect);
      const timeCorrect = correctQs.reduce((s, q) => s + q.timeSpent, 0);
      const timeWrong = wrongQs.reduce((s, q) => s + q.timeSpent, 0);
      const total = sQs.reduce((s, q) => s + q.timeSpent, 0);
      return {
        ...section,
        timeCorrect,
        timeWrong,
        totalSectionTime: total,
        efficiency: total > 0 ? Math.round((timeCorrect / total) * 100) : 0,
      };
    });
  }, [sections, questions, isMultiSection]);

  const maxBarTime = Math.max(timeStats.timeOnCorrect, timeStats.timeOnWrong, timeStats.timeOnSkipped, 1);

  return (
    <div className="space-y-4">
      {/* Time Efficiency Score */}
      <div className="bg-white rounded-xl border border-border p-4 sm:p-5">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Timer className="w-5 h-5 text-primary" />
          Time Efficiency
        </h3>

        {/* Efficiency Ring */}
        <div className="flex items-center gap-5 mb-5">
          <div className="relative w-20 h-20 shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="3" className="text-muted/30" />
              <motion.circle
                cx="18" cy="18" r="15.5" fill="none" strokeWidth="3"
                strokeDasharray={`${timeStats.efficiencyPercent} ${100 - timeStats.efficiencyPercent}`}
                strokeLinecap="round"
                className={timeStats.efficiencyPercent >= 60 ? "text-emerald-500" : timeStats.efficiencyPercent >= 40 ? "text-amber-500" : "text-red-500"}
                initial={{ strokeDasharray: "0 100" }}
                animate={{ strokeDasharray: `${timeStats.efficiencyPercent} ${100 - timeStats.efficiencyPercent}` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-foreground">
              {timeStats.efficiencyPercent}%
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {timeStats.efficiencyPercent >= 60 ? "Good efficiency!" : timeStats.efficiencyPercent >= 40 ? "Room for improvement" : "Time management needs work"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {timeStats.efficiencyPercent}% of your time was spent on questions you answered correctly
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-muted/40 rounded-lg p-2.5 text-center">
            <p className="text-[10px] text-muted-foreground mb-0.5">Total Time</p>
            <p className="font-bold text-sm text-foreground">{formatDuration(totalTime)}</p>
          </div>
          <div className="bg-muted/40 rounded-lg p-2.5 text-center">
            <p className="text-[10px] text-muted-foreground mb-0.5">Avg/Question</p>
            <p className="font-bold text-sm text-foreground">{formatDuration(Math.round(totalTime / questions.length))}</p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-2.5 text-center">
            <p className="text-[10px] text-muted-foreground mb-0.5">Avg (Correct)</p>
            <p className="font-bold text-sm text-emerald-600">{formatDuration(timeStats.avgCorrect)}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-2.5 text-center">
            <p className="text-[10px] text-muted-foreground mb-0.5">Avg (Wrong)</p>
            <p className="font-bold text-sm text-red-600">{formatDuration(timeStats.avgWrong)}</p>
          </div>
        </div>
      </div>

      {/* Correct vs Wrong vs Skipped Time */}
      <div className="bg-white rounded-xl border border-border p-4 sm:p-5">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Where Did Your Time Go?
        </h3>

        <div className="space-y-3">
          {[
            { label: "Correct", icon: CheckCircle2, time: timeStats.timeOnCorrect, count: timeStats.correctCount, color: "bg-emerald-500", iconColor: "text-emerald-500" },
            { label: "Wrong", icon: XCircle, time: timeStats.timeOnWrong, count: timeStats.wrongCount, color: "bg-red-500", iconColor: "text-red-500" },
            { label: "Skipped", icon: SkipForward, time: timeStats.timeOnSkipped, count: timeStats.skippedCount, color: "bg-slate-400", iconColor: "text-slate-400" },
          ].map((item, idx) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <item.icon className={cn("w-3.5 h-3.5", item.iconColor)} />
                  <span className="text-xs font-medium text-foreground">{item.label}</span>
                  <span className="text-[10px] text-muted-foreground">({item.count} Qs)</span>
                </div>
                <span className="text-xs font-semibold text-foreground">{formatDuration(item.time)}</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.time / maxBarTime) * 100}%` }}
                  transition={{ duration: 0.6, delay: 0.15 * idx }}
                  className={cn("h-full rounded-full", item.color)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slowest Questions */}
      <div className="bg-white rounded-xl border border-border p-4 sm:p-5">
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-primary" />
          Top 5 Time-Consuming Questions
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          Questions where you spent the most time — did it pay off?
        </p>

        <div className="space-y-2">
          {slowestQuestions.map((q, idx) => (
            <div
              key={q.id}
              className={cn(
                "flex items-center gap-3 p-2.5 rounded-lg border",
                q.isCorrect ? "bg-emerald-50/50 border-emerald-100" : q.isAttempted ? "bg-red-50/50 border-red-100" : "bg-slate-50/50 border-slate-100"
              )}
            >
              <span className="text-xs font-bold text-muted-foreground w-5 text-center">#{idx + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-foreground">Q.{q.questionNumber}</span>
                  {isMultiSection && (
                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium", getSubjectColor(q.subject).light, getSubjectColor(q.subject).text)}>
                      {q.subject}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs font-semibold text-foreground">{formatDuration(q.timeSpent)}</span>
              {q.isCorrect ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : q.isAttempted ? (
                <XCircle className="w-4 h-4 text-red-500 shrink-0" />
              ) : (
                <SkipForward className="w-4 h-4 text-slate-400 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Time Distribution Chart */}
      <div className="bg-white rounded-xl border border-border p-4 sm:p-5">
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Time Distribution
        </h3>
        <div className="flex items-end gap-2 h-24">
          {timeDistribution.map((bucket, index) => (
            <div key={bucket.label} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: maxBucketCount > 0 ? `${(bucket.count / maxBucketCount) * 100}%` : "0%" }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className={cn("w-full rounded-t-md min-h-[4px]", bucket.color)}
              />
              <span className="text-[10px] text-muted-foreground text-center">{bucket.label}</span>
              <span className="text-xs font-bold text-foreground">{bucket.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Subject-wise Time Breakdown (Grand Tests only) */}
      {isMultiSection && (
        <div className="bg-white rounded-xl border border-border p-4 sm:p-5">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-primary" />
            Time by Subject
          </h3>

          <div className="space-y-3">
            {subjectEfficiency.map((section, idx) => {
              const colors = getSubjectColor(section.subject);
              const correctPercent = section.totalSectionTime > 0 ? Math.round((section.timeCorrect / section.totalSectionTime) * 100) : 0;
              const wrongPercent = section.totalSectionTime > 0 ? Math.round((section.timeWrong / section.totalSectionTime) * 100) : 0;

              return (
                <div key={section.id} className="p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", colors.bg)} />
                      <span className="text-sm font-medium text-foreground">{section.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-foreground">{formatDuration(section.totalSectionTime)}</span>
                  </div>

                  {/* Stacked bar */}
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${correctPercent}%` }}
                      transition={{ duration: 0.5, delay: 0.1 * idx }}
                      className="h-full bg-emerald-500"
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${wrongPercent}%` }}
                      transition={{ duration: 0.5, delay: 0.15 * idx }}
                      className="h-full bg-red-400"
                    />
                  </div>

                  <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />Correct: {formatDuration(section.timeCorrect)}</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-red-400 rounded-full" />Wrong: {formatDuration(section.timeWrong)}</span>
                    <span>Efficiency: {section.efficiency}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});

export default TimeAnalysis;
