import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { bandConfig, accuracyColor } from "./constants";
import type { BandDetail } from "@/data/teacher/practiceSessionDetailData";

interface BandCardProps {
  band: BandDetail;
}

export function BandCard({ band }: BandCardProps) {
  const cfg = bandConfig[band.key] || bandConfig.risk;
  const completionPct = band.studentsAssigned > 0 ? Math.round((band.completedCount / band.studentsAssigned) * 100) : 0;

  return (
    <Card className={cn("border", cfg.border)}>
      <CardContent className={cn("p-4 space-y-3", cfg.bg)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={cn("w-3 h-3 rounded-full", cfg.color)} />
            <span className={cn("text-sm font-semibold", cfg.text)}>{band.label}</span>
          </div>
          <Badge variant="outline" className="text-xs">{band.questionCount} Q</Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">Students</span>
            <p className="font-semibold text-foreground">{band.completedCount}/{band.studentsAssigned}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Avg Accuracy</span>
            <p className={cn("font-semibold", accuracyColor(band.avgAccuracy))}>{band.avgAccuracy}%</p>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Completion</span>
            <span>{completionPct}%</span>
          </div>
          <Progress value={completionPct} className="h-1.5" />
        </div>
      </CardContent>
    </Card>
  );
}
