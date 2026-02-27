import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { InfoTooltip } from "@/components/timetable/InfoTooltip";
import type { QuestionAnalysis } from "@/data/teacher/examResults";

interface DifficultyChartProps {
  questions: QuestionAnalysis[];
}

export const DifficultyChart = ({ questions }: DifficultyChartProps) => {
  const groups: Record<string, { total: number; successSum: number }> = {
    Easy: { total: 0, successSum: 0 },
    Medium: { total: 0, successSum: 0 },
    Hard: { total: 0, successSum: 0 },
  };

  questions.forEach((q) => {
    const key = q.difficulty === "easy" ? "Easy" : q.difficulty === "medium" ? "Medium" : "Hard";
    groups[key].total += 1;
    groups[key].successSum += q.successRate;
  });

  const data = Object.entries(groups)
    .filter(([, v]) => v.total > 0)
    .map(([name, v]) => ({
      name,
      accuracy: Math.round(v.successSum / v.total),
      questions: v.total,
    }));

  const colors: Record<string, string> = {
    Easy: "hsl(142, 71%, 45%)",
    Medium: "hsl(38, 92%, 50%)",
    Hard: "hsl(0, 84%, 60%)",
  };

  return (
    <Card className="card-premium">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          Difficulty-wise Performance
          <InfoTooltip content="Class average accuracy grouped by question difficulty. Helps identify if students struggle with harder questions." />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 100]} unit="%" />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                formatter={(value: number, _name: string, props: any) => [`${value}% (${props.payload.questions} Qs)`, 'Avg Accuracy']}
              />
              <Bar dataKey="accuracy" radius={[6, 6, 0, 0]} barSize={48}>
                {data.map((entry) => (
                  <Cell key={entry.name} fill={colors[entry.name] || "hsl(var(--primary))"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
