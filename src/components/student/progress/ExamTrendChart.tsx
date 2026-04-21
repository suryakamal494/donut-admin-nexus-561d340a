import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import type { ExamWithContext } from "@/data/student/progressData";

interface ExamTrendChartProps {
  exams: ExamWithContext[];
}

const ExamTrendChart = ({ exams }: ExamTrendChartProps) => {
  const sorted = [...exams].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const chartData = sorted.map((e, i) => ({
    name: `E${i + 1}`,
    you: e.percentage,
    avg: e.classAverage,
    top: e.highestScore,
  }));

  const avgOfAvgs = Math.round(sorted.reduce((s, e) => s + e.classAverage, 0) / sorted.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 border border-white/50 shadow-lg"
    >
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Score Trend</h3>

      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload?.length) {
                  return (
                    <div className="bg-foreground text-background px-3 py-2 rounded-lg text-xs shadow-xl">
                      <p>You: <span className="font-bold">{payload[0]?.value}%</span></p>
                      <p>Class Avg: {payload[1]?.value}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine y={avgOfAvgs} stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" strokeOpacity={0.4} />
            <Line
              type="monotone"
              dataKey="you"
              stroke="hsl(var(--donut-coral))"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "hsl(var(--donut-coral))", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="avg"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-2 pt-2 border-t border-muted/20">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 rounded bg-[hsl(var(--donut-coral))]" />
          <span className="text-[10px] text-muted-foreground">Your Score</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 rounded bg-muted-foreground/40 border-dashed" />
          <span className="text-[10px] text-muted-foreground">Class Average</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ExamTrendChart;