// Performance Comparison Component
// 3-way comparison: Topper vs Student vs Class Average
// Renders bar chart for multi-section, gauge card for single-section

import { memo, useMemo } from "react";
import { Users, Trophy, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { SectionResult } from "@/data/student/testResults";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PerformanceComparisonProps {
  sections: SectionResult[];
}

// Use classAverage and topperScore from section data, fallback to reasonable defaults

const PerformanceComparison = memo(function PerformanceComparison({
  sections,
}: PerformanceComparisonProps) {
  const isMultiSection = sections.length > 1;

  const chartData = useMemo(() => {
    return sections.map((section) => {
      const studentPercent = section.maxMarks > 0
        ? Math.round((section.marksObtained / section.maxMarks) * 100)
        : 0;
      return {
        name: section.name.length > 8 ? section.name.slice(0, 7) + "…" : section.name,
        fullName: section.name,
        topper: section.topperScore ?? 90,
        you: studentPercent,
        classAvg: section.classAverage ?? 55,
      };
    });
  }, [sections]);

  const overallYou = useMemo(() => {
    const totalMarks = sections.reduce((s, sec) => s + sec.marksObtained, 0);
    const totalMax = sections.reduce((s, sec) => s + sec.maxMarks, 0);
    return totalMax > 0 ? Math.round((totalMarks / totalMax) * 100) : 0;
  }, [sections]);

  const overallClassAvg = useMemo(() =>
    Math.round(chartData.reduce((s, d) => s + d.classAvg, 0) / chartData.length),
  [chartData]);

  const overallTopper = useMemo(() =>
    Math.round(chartData.reduce((s, d) => s + d.topper, 0) / chartData.length),
  [chartData]);

  const diffFromAvg = overallYou - overallClassAvg;
  const diffFromTopper = overallYou - overallTopper;

  // Single-section: render gauge card
  if (!isMultiSection) {
    const data = chartData[0];
    if (!data) return null;
    return (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl border border-border p-4 sm:p-6"
      >
        <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary" />
          Your Standing
        </h3>

        {/* Horizontal gauge */}
        <div className="relative mb-5">
          <div className="h-3 bg-muted/50 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.you}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-primary rounded-full absolute left-0"
            />
          </div>
          {/* Markers */}
          <div className="relative h-8 mt-1">
            {/* Class Avg marker */}
            <div className="absolute -translate-x-1/2 flex flex-col items-center" style={{ left: `${data.classAvg}%` }}>
              <div className="w-0.5 h-3 bg-muted-foreground/40" />
              <span className="text-[9px] text-muted-foreground whitespace-nowrap">Avg {data.classAvg}%</span>
            </div>
            {/* Topper marker */}
            <div className="absolute -translate-x-1/2 flex flex-col items-center" style={{ left: `${data.topper}%` }}>
              <div className="w-0.5 h-3 bg-amber-500" />
              <span className="text-[9px] text-amber-600 font-medium whitespace-nowrap">Top {data.topper}%</span>
            </div>
          </div>
        </div>

        {/* 3 value cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-2.5 text-center">
            <Trophy className="w-4 h-4 text-amber-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-amber-700">{data.topper}%</p>
            <p className="text-[10px] text-amber-600">Topper</p>
          </div>
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-2.5 text-center">
            <TrendingUp className="w-4 h-4 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold text-primary">{data.you}%</p>
            <p className="text-[10px] text-primary/70">You</p>
          </div>
          <div className="rounded-lg bg-muted/50 border border-border p-2.5 text-center">
            <Users className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
            <p className="text-lg font-bold text-muted-foreground">{data.classAvg}%</p>
            <p className="text-[10px] text-muted-foreground">Class Avg</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Multi-section: bar chart with 3 bars
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-xl border border-border p-4 sm:p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Performance Comparison
        </h3>
        <span
          className={cn(
            "text-xs font-semibold px-2 py-1 rounded-full",
            diffFromTopper >= 0
              ? "bg-amber-100 text-amber-700"
              : diffFromTopper >= -10
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
          )}
        >
          {diffFromTopper >= 0 ? "🏆 Top scorer!" : `${diffFromTopper}% from topper`}
        </span>
      </div>

      {/* Chart */}
      <div className="h-52 sm:h-64 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            barGap={2}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const data = payload[0]?.payload;
                return (
                  <div className="bg-background border border-border rounded-lg px-3 py-2 shadow-lg text-xs">
                    <p className="font-medium text-foreground mb-1">{data?.fullName}</p>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" />
                      <span className="text-muted-foreground">Topper:</span>
                      <span className="font-semibold text-foreground">{data?.topper}%</span>
                    </div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-primary inline-block" />
                      <span className="text-muted-foreground">You:</span>
                      <span className="font-semibold text-foreground">{data?.you}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm bg-muted-foreground/30 inline-block" />
                      <span className="text-muted-foreground">Class Avg:</span>
                      <span className="font-semibold text-foreground">{data?.classAvg}%</span>
                    </div>
                  </div>
                );
              }}
            />
            <Bar dataKey="topper" name="Topper" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={24} />
            <Bar dataKey="you" name="You" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={24} />
            <Bar dataKey="classAvg" name="Class Avg" fill="hsl(var(--muted-foreground) / 0.3)" radius={[4, 4, 0, 0]} maxBarSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block" />
          Topper
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-primary inline-block" />
          You
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-muted-foreground/30 inline-block" />
          Class Avg
        </span>
      </div>

      {/* Section-wise comparison list */}
      <div className="mt-4 pt-4 border-t border-border space-y-2">
        {chartData.map((d, i) => {
          const sectionDiffTopper = d.you - d.topper;
          return (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground truncate flex-1">{sections[i]?.name}</span>
              <div className="flex items-center gap-2.5">
                <span className="font-medium text-amber-600 w-10 text-right">{d.topper}%</span>
                <span className="font-semibold text-foreground w-10 text-right">{d.you}%</span>
                <span className="text-muted-foreground w-10 text-right">{d.classAvg}%</span>
                <span
                  className={cn(
                    "text-xs font-medium w-12 text-right",
                    sectionDiffTopper >= 0 ? "text-amber-600" : sectionDiffTopper >= -10 ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {sectionDiffTopper >= 0 ? "=" : sectionDiffTopper}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
});

export default PerformanceComparison;
