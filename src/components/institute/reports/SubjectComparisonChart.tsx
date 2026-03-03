import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, LabelList } from "recharts";
import type { SubjectSummary } from "@/data/institute/reportsData";

interface SubjectComparisonChartProps {
  subjects: SubjectSummary[];
}

const getTierColor = (avg: number): string => {
  if (avg >= 75) return "hsl(152, 69%, 41%)"; // emerald-500
  if (avg >= 50) return "hsl(173, 80%, 36%)"; // teal-500
  if (avg >= 35) return "hsl(38, 92%, 50%)";  // amber-500
  return "hsl(0, 84%, 60%)";                   // red-500
};

const SubjectComparisonChart = ({ subjects }: SubjectComparisonChartProps) => {
  const data = useMemo(
    () =>
      [...subjects]
        .sort((a, b) => b.classAverage - a.classAverage)
        .map((s) => ({
          name: s.subjectName.length > 8 ? s.subjectName.slice(0, 7) + "…" : s.subjectName,
          fullName: s.subjectName,
          avg: s.classAverage,
          color: getTierColor(s.classAverage),
        })),
    [subjects]
  );

  if (subjects.length === 0) return null;

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-2.5 sm:p-3">
        <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground mb-2">Subject Comparison</p>
        <ResponsiveContainer width="100%" height={subjects.length * 32 + 8}>
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 40, bottom: 0, left: 0 }}>
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis
              type="category"
              dataKey="name"
              width={70}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <Bar dataKey="avg" radius={[0, 4, 4, 0]} barSize={18}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
              <LabelList
                dataKey="avg"
                position="right"
                formatter={(v: number) => `${v}%`}
                style={{ fontSize: 11, fontWeight: 600, fill: "hsl(var(--foreground))" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SubjectComparisonChart;
