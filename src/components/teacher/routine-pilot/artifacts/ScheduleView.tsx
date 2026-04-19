import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, Send, X, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const bandLabels: Record<string, string> = {
  mastery_ready: "Mastery Ready",
  stable_progress: "Stable Progress",
  reinforcement: "Reinforcement",
  foundational_risk: "Foundational Risk",
};

export default function ScheduleView({ content }: { content: any }) {
  const sendAt = content.send_at ? new Date(content.send_at) : null;
  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 p-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
            <Check className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold">Scheduled successfully</div>
            <div className="text-xs text-muted-foreground mt-0.5">{content.title}</div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card divide-y">
        <div className="flex items-center justify-between px-3 py-2.5 text-sm">
          <span className="flex items-center gap-2 text-muted-foreground"><Clock className="w-3.5 h-3.5" /> Send at</span>
          <span className="font-medium">
            {sendAt ? sendAt.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : content.send_at}
          </span>
        </div>
        <div className="flex items-center justify-between px-3 py-2.5 text-sm">
          <span className="flex items-center gap-2 text-muted-foreground"><Send className="w-3.5 h-3.5" /> Channel</span>
          <span className="font-medium">{content.channel}</span>
        </div>
      </div>

      {content.bands?.length > 0 && (
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Recipients</div>
          <div className="flex flex-wrap gap-1.5">
            {content.bands.map((b: string) => (
              <Badge key={b} variant="secondary" className="font-normal">{bandLabels[b] ?? b}</Badge>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={() => toast.info("Reschedule (mock)")}>
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Reschedule
        </Button>
        <Button variant="outline" size="sm" className="flex-1 text-destructive" onClick={() => toast.info("Cancelled (mock)")}>
          <X className="w-3.5 h-3.5 mr-1.5" /> Cancel
        </Button>
      </div>
    </div>
  );
}
