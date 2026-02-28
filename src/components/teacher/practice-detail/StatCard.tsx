import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}

export function StatCard({ icon, label, value, accent }: StatCardProps) {
  return (
    <Card className="card-premium">
      <CardContent className="p-3 md:p-4 flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">{icon}{label}</div>
        <span className={cn("text-lg md:text-xl font-bold", accent ? "text-emerald-600 dark:text-emerald-400" : "text-foreground")}>{value}</span>
      </CardContent>
    </Card>
  );
}
