// Performance Comparison Component
// Bar chart comparing student scores vs class average across sections

import { memo, useMemo } from "react";
import { BarChart3, Users } from "lucide-react";
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
  Legend,
  Cell,
} from "recharts";

interface PerformanceComparisonProps {
  sections: SectionResult[];
}

// Generate mock class average data based on section results
const generateClassAverage = (section: SectionResult) => {
  const studentPercent = section.maxMarks > 0
    ? Math.round((section.marksObtained / section.maxMarks) * 100)
    : 0;
  // Class average is typically within ±20% of a moderate score
  const base = 45 + Math.random() * 25; // 45-70 range
  return Math.round(base);
};

const PerformanceComparison = memo(function PerformanceComparison({
  sections,
}: PerformanceComparisonProps) {
  const chartData = useMemo(() => {
    return sections.map((section) => {
      const studentPercent = section.maxMarks > 0
        ? Math.round((section.marksObtained / section.maxMarks) * 100)
        : 0;
      return {
        name: section.name.length > 8 ? section.name.slice(0, 7) + "…" : section.name,
        fullName: section.name,
        you: studentPercent,
        classAvg: generateClassAverage(section),
      };
    });
  }, [sections]);

  const overallYou = useMemo(() => {
    const totalMarks = sections.reduce((s, sec) => s + sec.marksObtained, 0);
    const totalMax = sections.reduce((s, sec) => s + sec.maxMarks, 0);
    return totalMax > 0 ? Math.round((totalMarks / totalMax) * 100) : 0;
  }, [sections]);

  const overallClassAvg = useMemo(() => {
    return Math.round(chartData.reduce((s, d) => s + d.classAvg, 0) / chartData.length);
  }, [chartData]);

  const diff = overallYou - overallClassAvg;

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
          You vs Class Average
        </h3>
        <span
          className={cn(
            "text-xs font-semibold px-2 py-1 rounded-full",
            diff > 0
              ? "bg-primary/10 text-primary"
              : diff < 0
              ? "bg-destructive/10 text-destructive"
              : "bg-muted text-muted-foreground"
          )}
        >
          {diff > 0 ? "+" : ""}
          {diff}% overall
        </span>
      </div>

      {/* Chart */}
      <div className="h-52 sm:h-64 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            barGap={4}
            barCategoryGap="25%"
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
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const data = payload[0]?.payload;
                return (
                  <div className="bg-background border border-border rounded-lg px-3 py-2 shadow-lg text-xs">
                    <p className="font-medium text-foreground mb-1">{data?.fullName || label}</p>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-primary inline-block" />
                      <span className="text-muted-foreground">You:</span>
                      <span className="font-semibold text-foreground">{payload[0]?.value}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm bg-muted-foreground/30 inline-block" />
                      <span className="text-muted-foreground">Class Avg:</span>
                      <span className="font-semibold text-foreground">{payload[1]?.value}%</span>
                    </div>
                  </div>
                );
              }}
            />
            <Bar dataKey="you" name="You" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={32} />
            <Bar dataKey="classAvg" name="Class Avg" fill="hsl(var(--muted-foreground) / 0.3)" radius={[4, 4, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-primary inline-block" />
          Your Score
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-muted-foreground/30 inline-block" />
          Class Average
        </span>
      </div>

      {/* Section-wise comparison cards (mobile friendly) */}
      <div className="mt-4 pt-4 border-t border-border space-y-2">
        {chartData.map((d, i) => {
          const sectionDiff = d.you - d.classAvg;
          return (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground truncate flex-1">{sections[i]?.name}</span>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-foreground w-10 text-right">{d.you}%</span>
                <span className="text-muted-foreground w-10 text-right">{d.classAvg}%</span>
                <span
                  className={cn(
                    "text-xs font-medium w-12 text-right",
                    sectionDiff > 0 ? "text-primary" : sectionDiff < 0 ? "text-destructive" : "text-muted-foreground"
                  )}
                >
                  {sectionDiff > 0 ? "+" : ""}
                  {sectionDiff}%
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
