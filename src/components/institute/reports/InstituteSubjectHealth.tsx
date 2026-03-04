import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { getPerformanceColor } from "@/lib/reportColors";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronDown, TrendingUp, TrendingDown, Minus, Activity } from "lucide-react";
import { getInstituteBatchReports, type Trend } from "@/data/institute/reportsData";

interface SubjectHealth {
  name: string;
  color: string;
  avg: number;
  trend: Trend;
  batchCount: number;
  min: number;
  max: number;
}

function computeSubjectHealth(): SubjectHealth[] {
  const batches = getInstituteBatchReports();
  const map = new Map<string, { color: string; avgs: number[]; trends: Trend[] }>();

  for (const batch of batches) {
    for (const sub of batch.subjects) {
      const entry = map.get(sub.subjectName) || { color: sub.subjectColor, avgs: [], trends: [] };
      entry.avgs.push(sub.classAverage);
      entry.trends.push(sub.trend);
      map.set(sub.subjectName, entry);
    }
  }

  const results: SubjectHealth[] = [];
  for (const [name, data] of map) {
    const avg = Math.round(data.avgs.reduce((s, v) => s + v, 0) / data.avgs.length);
    const upCount = data.trends.filter(t => t === "up").length;
    const downCount = data.trends.filter(t => t === "down").length;
    const trend: Trend = upCount > downCount ? "up" : downCount > upCount ? "down" : "stable";
    results.push({
      name,
      color: data.color,
      avg,
      trend,
      batchCount: data.avgs.length,
      min: Math.min(...data.avgs),
      max: Math.max(...data.avgs),
    });
  }

  // Sort worst-to-best so problem areas surface first
  results.sort((a, b) => a.avg - b.avg);
  return results;
}

const TrendIndicator = ({ trend }: { trend: Trend }) => {
  if (trend === "up") return <TrendingUp className="w-3 h-3 text-emerald-500" />;
  if (trend === "down") return <TrendingDown className="w-3 h-3 text-destructive" />;
  return <Minus className="w-3 h-3 text-muted-foreground" />;
};

const InstituteSubjectHealth = () => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(!isMobile);
  const subjects = useMemo(computeSubjectHealth, []);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="border-0 shadow-sm overflow-hidden">
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between p-3 hover:bg-muted/40 transition-colors">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-xs sm:text-sm font-semibold text-foreground">Subject Health Across Institute</span>
              <span className="text-[10px] text-muted-foreground">({subjects.length} subjects)</span>
            </div>
            <ChevronDown className={cn(
              "w-4 h-4 text-muted-foreground transition-transform duration-200",
              open && "rotate-180"
            )} />
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="p-0 pb-2">
            <div className="grid gap-0">
              {subjects.map((sub) => {
                const colors = getPerformanceColor(sub.avg);
                return (
                  <div
                    key={sub.name}
                    className="flex items-center gap-2 px-3 py-1.5 hover:bg-muted/30 transition-colors"
                  >
                    {/* Subject color dot */}
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: `hsl(${sub.color})` }}
                    />

                    {/* Subject name */}
                    <span className="text-xs font-medium text-foreground min-w-[80px] sm:min-w-[100px] truncate">
                      {sub.name}
                    </span>

                    {/* Bar */}
                    <div className="flex-1 h-4 bg-muted/50 rounded-full overflow-hidden relative min-w-[60px]">
                      <div
                        className={cn("h-full rounded-full transition-all", colors.bg)}
                        style={{ width: `${sub.avg}%`, opacity: 0.8 }}
                      />
                      {/* Range marker: show min-max spread */}
                      <div
                        className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-foreground/20"
                        style={{
                          left: `${sub.min}%`,
                          width: `${Math.max(sub.max - sub.min, 1)}%`,
                        }}
                      />
                    </div>

                    {/* Average value */}
                    <span className={cn("text-xs font-bold w-8 text-right", colors.text)}>
                      {sub.avg}%
                    </span>

                    {/* Trend */}
                    <TrendIndicator trend={sub.trend} />

                    {/* Spread on larger screens */}
                    <span className="text-[10px] text-muted-foreground hidden sm:inline w-14 text-right">
                      {sub.min}–{sub.max}%
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default InstituteSubjectHealth;
