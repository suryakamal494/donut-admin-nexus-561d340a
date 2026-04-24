// Student Copilot — Left Rail (threads, tools, subject filter)
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare, Dumbbell, Target, Map, TrendingUp,
  Plus, GraduationCap, ArrowLeft, MoreHorizontal, type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { studentProfile } from "@/data/student/profile";
import type { StudentThread, StudentRoutine } from "./types";
import { SUBJECTS, DEFAULT_ROUTINE_KEY } from "./types";

const ICON_MAP: Record<string, LucideIcon> = {
  MessageSquare, Dumbbell, Target, Map, TrendingUp,
};

const SUBJECT_COLORS: Record<string, string> = {
  Physics: "bg-blue-500",
  Chemistry: "bg-emerald-500",
  Math: "bg-violet-500",
  Biology: "bg-rose-500",
  English: "bg-amber-500",
};

interface Props {
  routines: StudentRoutine[];
  threads: StudentThread[];
  currentThreadId: string | null;
  subjectFilter: string | null;
  onNewThread: (routineKey?: string) => void;
  onSelectThread: (id: string) => void;
  onSubjectFilter: (subject: string | null) => void;
  onClose?: () => void;
}

const StudentLeftRail: React.FC<Props> = ({
  routines,
  threads,
  currentThreadId,
  subjectFilter,
  onNewThread,
  onSelectThread,
  onSubjectFilter,
  onClose,
}) => {
  const navigate = useNavigate();

  const toolRoutines = useMemo(
    () => routines.filter((r) => r.key !== DEFAULT_ROUTINE_KEY),
    [routines]
  );

  const filteredThreads = useMemo(() => {
    if (!subjectFilter) return threads;
    return threads.filter((t) => t.subject === subjectFilter);
  }, [threads, subjectFilter]);

  // Group by lifecycle status (Rule 5). Threads without a `status` are
  // treated as `active` for backward compatibility.
  const grouped = useMemo(() => {
    const buckets: Record<"active" | "recent" | "archived", StudentThread[]> = {
      active: [],
      recent: [],
      archived: [],
    };
    for (const t of filteredThreads) {
      const s = (t.status as "active" | "recent" | "archived") ?? "active";
      (buckets[s] ?? buckets.active).push(t);
    }
    return buckets;
  }, [filteredThreads]);

  const [showArchived, setShowArchived] = React.useState(false);

  const handleThreadClick = (id: string) => {
    onSelectThread(id);
    onClose?.();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Exit Copilot */}
      <div className="px-3 pt-3 pb-1">
        <button
          onClick={() => { navigate("/student/dashboard"); onClose?.(); }}
          className="flex items-center gap-2 w-full px-2 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Exit Copilot
        </button>
      </div>

      {/* Profile header */}
      <div className="p-4 border-b border-t">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-donut-coral to-donut-orange flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{studentProfile.name}</p>
            <p className="text-xs text-muted-foreground">{studentProfile.grade}</p>
          </div>
          {/* Demoted: "Start fresh" lives in a secondary menu. The router
              handles continuation by default — see Rule 1. */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-auto">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => { onNewThread(); onClose?.(); }}>
                <Plus className="w-4 h-4 mr-2" />
                Start fresh chat
                <span className="ml-auto text-[10px] opacity-60">⌘K</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Subject filter chips */}
      <div className="px-3 py-2">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onSubjectFilter(null)}
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
              !subjectFilter
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            All
          </button>
          {SUBJECTS.map((s) => (
            <button
              key={s}
              onClick={() => onSubjectFilter(subjectFilter === s ? null : s)}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                subjectFilter === s
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <span className={cn("w-2 h-2 rounded-full", SUBJECT_COLORS[s])} />
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* History — grouped by lifecycle status (Rule 5). */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="px-3 py-2 space-y-3">
          {filteredThreads.length === 0 && (
            <p className="text-xs text-muted-foreground px-2 py-4 text-center">
              No conversations yet
            </p>
          )}

          {/* Always render Active + Recent headers so the lifecycle structure
              (Rule 5) is visible even when one bucket is empty. */}
          <ThreadGroup
            label={`Active (${grouped.active.length})`}
            threads={grouped.active}
            currentThreadId={currentThreadId}
            onSelect={handleThreadClick}
            emptyHint="No active sessions — start a chat to begin."
          />
          <ThreadGroup
            label={`Recent (${grouped.recent.length})`}
            threads={grouped.recent}
            currentThreadId={currentThreadId}
            onSelect={handleThreadClick}
            emptyHint="Nothing in the last 7 days."
          />
          {grouped.archived.length > 0 && (
            <div>
              <button
                onClick={() => setShowArchived((v) => !v)}
                className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1 hover:text-foreground"
              >
                {showArchived ? "Hide" : "Show"} archived ({grouped.archived.length})
              </button>
              {showArchived && (
                <ThreadGroup
                  label=""
                  threads={grouped.archived}
                  currentThreadId={currentThreadId}
                  onSelect={handleThreadClick}
                />
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Tools — quiet footer (no longer the primary path). */}
      <div className="border-t px-3 py-2 space-y-0.5 bg-muted/20">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1">
          Quick tools
        </p>
        {toolRoutines.map((r) => {
          const Icon = ICON_MAP[r.icon] ?? MessageSquare;
          return (
            <button
              key={r.key}
              onClick={() => { onNewThread(r.key); onClose?.(); }}
              className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{r.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

interface GroupProps {
  label: string;
  threads: StudentThread[];
  currentThreadId: string | null;
  onSelect: (id: string) => void;
  emptyHint?: string;
}

const ThreadGroup: React.FC<GroupProps> = ({ label, threads, currentThreadId, onSelect, emptyHint }) => (
  <div>
    {label && (
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1">
        {label}
      </p>
    )}
    {threads.length === 0 && emptyHint && (
      <p className="text-[11px] text-muted-foreground/70 px-2 py-1 italic">
        {emptyHint}
      </p>
    )}
    {threads.map((t) => (
      <button
        key={t.id}
        onClick={() => onSelect(t.id)}
        className={cn(
          "flex items-center gap-2 w-full px-2 py-2 rounded-lg text-sm transition-colors text-left",
          t.id === currentThreadId
            ? "bg-donut-coral/10 text-foreground font-medium"
            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
        )}
      >
        {t.subject && (
          <span className={cn("w-2 h-2 rounded-full flex-shrink-0", SUBJECT_COLORS[t.subject] ?? "bg-muted")} />
        )}
        <span className="truncate">{t.title}</span>
      </button>
    ))}
  </div>
);

export default React.memo(StudentLeftRail);