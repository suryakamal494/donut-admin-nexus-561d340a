import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  BookOpen, FileText, PencilLine, TrendingUp, BarChart3, ClipboardCheck,
  Plus, MessageSquare, Sparkles,
} from "lucide-react";
import type { Batch, Routine, Thread } from "./types";

const iconMap: Record<string, React.ElementType> = {
  BookOpen, FileText, PencilLine, TrendingUp, BarChart3, ClipboardCheck,
};

interface Props {
  batches: Batch[];
  routines: Routine[];
  threads: Thread[];
  selectedBatchId: string | null;
  selectedRoutineKey: string | null;
  selectedThreadId: string | null;
  onSelectBatch: (id: string) => void;
  onSelectRoutine: (key: string) => void;
  onSelectThread: (id: string) => void;
  onNewThread: () => void;
}

export default function LeftRail({
  batches, routines, threads,
  selectedBatchId, selectedRoutineKey, selectedThreadId,
  onSelectBatch, onSelectRoutine, onSelectThread, onNewThread,
}: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b space-y-2">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Batch
        </div>
        <Select value={selectedBatchId ?? undefined} onValueChange={onSelectBatch}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Select batch" />
          </SelectTrigger>
          <SelectContent>
            {batches.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                {b.name} • {b.subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground px-2 mb-1.5">Routines</div>
          <div className="space-y-0.5">
            {routines.map((r) => {
              const Icon = iconMap[r.icon] ?? BookOpen;
              const active = r.key === selectedRoutineKey;
              return (
                <button
                  key={r.id}
                  disabled={!r.is_active}
                  onClick={() => r.is_active && onSelectRoutine(r.key)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-left transition-colors",
                    active && "bg-primary/10 text-primary font-medium",
                    !active && r.is_active && "hover:bg-muted",
                    !r.is_active && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 truncate">{r.label}</span>
                  {!r.is_active && (
                    <Badge variant="outline" className="text-[10px] h-4 px-1.5">Soon</Badge>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-3 pb-4">
          <div className="flex items-center justify-between px-2 mb-1.5">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Threads</span>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={onNewThread}>
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>
          <div className="space-y-0.5">
            {threads.length === 0 && (
              <p className="text-xs text-muted-foreground px-2 py-1">No threads yet.</p>
            )}
            {threads.map((t) => {
              const active = t.id === selectedThreadId;
              return (
                <button
                  key={t.id}
                  onClick={() => onSelectThread(t.id)}
                  className={cn(
                    "w-full flex items-start gap-2 px-2.5 py-1.5 rounded-md text-left transition-colors",
                    active ? "bg-muted text-foreground" : "hover:bg-muted/60 text-muted-foreground"
                  )}
                >
                  <MessageSquare className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <span className="text-xs leading-tight line-clamp-2">{t.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </ScrollArea>

      <div className="p-3 border-t">
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-primary/5 border border-primary/10">
          <Sparkles className="w-3 h-3 text-primary flex-shrink-0" />
          <span className="text-[11px] text-muted-foreground truncate">
            RoutinePilot · Co-pilot Mode
          </span>
        </div>
      </div>
    </div>
  );
}
