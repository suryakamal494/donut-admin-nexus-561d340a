import { AlertCircle } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { TopicFlag } from "@/data/teacher/examResults";

interface TopicFlagsProps {
  flags: TopicFlag[];
}

export const TopicFlags = ({ flags }: TopicFlagsProps) => {
  if (flags.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-foreground">Topic Health</h3>

      {/* Mobile: horizontal scroll · Desktop: wrap grid */}
      <ScrollArea className="w-full sm:hidden -mx-4 px-4">
        <div className="flex gap-2 min-w-max pb-1">
          {flags.map((f) => (
            <TopicPill key={f.topic} flag={f} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="hidden sm:flex sm:flex-wrap gap-2">
        {flags.map((f) => (
          <TopicPill key={f.topic} flag={f} />
        ))}
      </div>
    </div>
  );
};

function TopicPill({ flag }: { flag: TopicFlag }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium shrink-0 border",
        flag.status === "strong" && "bg-emerald-50 text-emerald-700 border-emerald-200",
        flag.status === "moderate" && "bg-amber-50 text-amber-700 border-amber-200",
        flag.status === "weak" && "bg-red-50 text-red-700 border-red-200"
      )}
    >
      {flag.status === "weak" && <AlertCircle className="w-3 h-3" />}
      {flag.topic}
      <span className="font-bold">{flag.successRate}%</span>
    </span>
  );
}
