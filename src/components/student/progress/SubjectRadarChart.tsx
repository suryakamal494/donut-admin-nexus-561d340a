import { motion } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

interface SubjectData {
  subjectName: string;
  accuracy: number;
  color: string;
}

interface SubjectRadarChartProps {
  subjects: SubjectData[];
}

const SubjectRadarChart = ({ subjects }: SubjectRadarChartProps) => {
  const chartData = subjects.map((s) => ({
    subject: s.subjectName.length > 5 ? s.subjectName.slice(0, 4) + "." : s.subjectName,
    fullName: s.subjectName,
    accuracy: s.accuracy,
  }));

  const strongest = subjects.reduce((a, b) => (a.accuracy > b.accuracy ? a : b));
  const weakest = subjects.reduce((a, b) => (a.accuracy < b.accuracy ? a : b));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 border border-white/50 shadow-lg"
    >
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        Subject Comparison
      </h3>

      <div className="h-[220px] sm:h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
            <PolarGrid
              stroke="hsl(var(--border))"
              strokeOpacity={0.5}
            />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            />
            <Radar
              name="Accuracy"
              dataKey="accuracy"
              stroke="hsl(var(--donut-coral))"
              fill="hsl(var(--donut-coral))"
              fillOpacity={0.25}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-2">
        <span className="font-medium text-emerald-600">
          Strongest: {strongest.subjectName} ({strongest.accuracy}%)
        </span>
        {" · "}
        <span className="font-medium text-rose-500">
          Weakest: {weakest.subjectName} ({weakest.accuracy}%)
        </span>
      </p>
    </motion.div>
  );
};

export default SubjectRadarChart;