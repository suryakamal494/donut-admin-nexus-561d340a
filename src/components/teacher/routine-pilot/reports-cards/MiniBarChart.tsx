/**
 * Tiny inline bar chart for score distributions and similar small datasets.
 * Kept lightweight — no recharts axes/legends — to fit naturally in chat.
 */
import { cn } from "@/lib/utils";

interface BarDatum {
  label: string;
  value: number;
}

interface Props {
  data: BarDatum[];
  className?: string;
  /** Format for hover/numeric label. Defaults to plain number. */
  format?: (n: number) => string;
}

export default function MiniBarChart({ data, className, format }: Props) {
  if (!data.length) return null;
  const max = Math.max(...data.map((d) => d.value), 1);
  const fmt = format ?? ((n: number) => String(n));
  return (
    <div className={cn("space-y-1.5", className)}>
      {data.map((d) => {
        const pct = (d.value / max) * 100;
        return (
          <div key={d.label} className="flex items-center gap-2 text-[11px]">
            <span className="w-16 text-muted-foreground truncate" title={d.label}>
              {d.label}
            </span>
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary/70 rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-10 text-right tabular-nums font-medium">{fmt(d.value)}</span>
          </div>
        );
      })}
    </div>
  );
}
