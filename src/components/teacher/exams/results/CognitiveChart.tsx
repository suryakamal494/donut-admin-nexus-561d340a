import { Brain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { InfoTooltip } from "@/components/timetable/InfoTooltip";
import type { QuestionAnalysis, CognitiveType } from "@/data/teacher/examResults";

interface CognitiveChartProps {
  questions: QuestionAnalysis[];
}

const cognitiveColors: Record<CognitiveType, string> = {
  Logical: "hsl(221, 83%, 53%)",
  Analytical: "hsl(262, 83%, 58%)",
  Conceptual: "hsl(142, 71%, 45%)",
  Numerical: "hsl(38, 92%, 50%)",
  Application: "hsl(0, 84%, 60%)",
  Memory: "hsl(186, 72%, 44%)",
};

export const CognitiveChart = ({ questions }: CognitiveChartProps) => {
  const groups: Record<string, { total: number; successSum: number }> = {};

  questions.forEach((q) => {
    const key = q.cognitiveType;
    if (!groups[key]) groups[key] = { total: 0, successSum: 0 };
    groups[key].total += 1;
    groups[key].successSum += q.successRate;
  });

  const data = Object.entries(groups)
    .map(([name, v]) => ({
      name,
      accuracy: Math.round(v.successSum / v.total),
      questions: v.total,
    }))
    .sort((a, b) => a.accuracy - b.accuracy);

  return (
    <Card className="card-premium">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary" />
          Cognitive Type Performance
          <InfoTooltip content="Class accuracy by question type — Logical, Analytical, Conceptual, Numerical, Application, Memory. Reveals thinking-skill gaps." />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 100]} unit="%" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={80} />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                formatter={(value: number, _name: string, props: any) => [`${value}% (${props.payload.questions} Qs)`, 'Accuracy']}
              />
              <Bar dataKey="accuracy" radius={[0, 6, 6, 0]} barSize={24}>
                {data.map((entry) => (
                  <Cell key={entry.name} fill={cognitiveColors[entry.name as CognitiveType] || "hsl(var(--primary))"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
