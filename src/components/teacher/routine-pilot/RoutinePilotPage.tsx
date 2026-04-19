import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PanelLeft, PanelRight, Menu } from "lucide-react";
import LeftRail from "./LeftRail";
import ChatPane from "./ChatPane";
import ArtifactPane from "./ArtifactPane";
import MobileLeftRailSheet from "./MobileLeftRailSheet";
import MobileArtifactSheet from "./MobileArtifactSheet";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Batch, Routine, Thread } from "./types";

interface Props {
  initialBatchId?: string | null;
  initialRoutineKey?: string | null;
}

const LS_LEFT = "copilot.leftCollapsed";
const LS_RIGHT = "copilot.rightCollapsed";

export default function RoutinePilotPage({ initialBatchId, initialRoutineKey }: Props) {
  const isMobile = useIsMobile();

  const [batches, setBatches] = useState<Batch[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);

  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(initialBatchId ?? null);
  const [selectedRoutineKey, setSelectedRoutineKey] = useState<string | null>(initialRoutineKey ?? null);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

  // Pane collapse — desktop user-toggleable, persisted
  const [leftCollapsed, setLeftCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(LS_LEFT) === "1";
  });
  const [rightCollapsed, setRightCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(LS_RIGHT) === "1";
  });
  useEffect(() => {
    window.localStorage.setItem(LS_LEFT, leftCollapsed ? "1" : "0");
  }, [leftCollapsed]);
  useEffect(() => {
    window.localStorage.setItem(LS_RIGHT, rightCollapsed ? "1" : "0");
  }, [rightCollapsed]);

  // Mobile sheet state
  const [mobileLeftOpen, setMobileLeftOpen] = useState(false);

  // Artifact count for mobile handle
  const [artifactCount, setArtifactCount] = useState(0);

  // Load batches + routines
  useEffect(() => {
    (async () => {
      const [{ data: bs }, { data: rs }] = await Promise.all([
        supabase.from("rp_batches").select("*").order("name"),
        supabase.from("rp_routines").select("*").order("sort_order"),
      ]);
      const batchList = (bs ?? []) as Batch[];
      const routineList = (rs ?? []) as Routine[];
      setBatches(batchList);
      setRoutines(routineList);
      setSelectedBatchId((curr) => {
        if (curr && batchList.some((b) => b.id === curr)) return curr;
        return batchList[0]?.id ?? null;
      });
      setSelectedRoutineKey((curr) => {
        if (curr && routineList.some((r) => r.key === curr && r.is_active)) return curr;
        const firstActive = routineList.find((r) => r.is_active);
        return firstActive?.key ?? null;
      });
    })();
  }, []);

  // Shared thread loader used by the effect below and the manual refresh helper.
  const loadThreads = async (
    batchId: string,
    routineId: string
  ): Promise<Thread[]> => {
    const { data } = await supabase
      .from("rp_threads")
      .select("*")
      .eq("batch_id", batchId)
      .eq("routine_id", routineId)
      .order("last_message_at", { ascending: false });
    return (data ?? []) as Thread[];
  };

  // Load threads when batch or routine changes
  useEffect(() => {
    if (!selectedBatchId || !selectedRoutineKey) return;
    const routine = routines.find((r) => r.key === selectedRoutineKey);
    if (!routine) return;
    (async () => {
      const list = await loadThreads(selectedBatchId, routine.id);
      setThreads(list);
      setSelectedThreadId(list[0]?.id ?? null);
    })();
  }, [selectedBatchId, selectedRoutineKey, routines]);

  // Artifact count for mobile bottom-sheet handle (live)
  useEffect(() => {
    if (!selectedBatchId) {
      setArtifactCount(0);
      return;
    }
    let cancelled = false;
    const load = async () => {
      const { count } = await supabase
        .from("rp_artifacts")
        .select("*", { count: "exact", head: true })
        .eq("batch_id", selectedBatchId);
      if (!cancelled) setArtifactCount(count ?? 0);
    };
    load();
    const channel = supabase
      .channel(`rp_artifacts_count_${selectedBatchId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rp_artifacts", filter: `batch_id=eq.${selectedBatchId}` },
        () => load()
      )
      .subscribe();
    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [selectedBatchId]);

  const refreshThreads = async () => {
    if (!selectedBatchId || !selectedRoutineKey) return;
    const routine = routines.find((r) => r.key === selectedRoutineKey);
    if (!routine) return;
    const list = await loadThreads(selectedBatchId, routine.id);
    setThreads(list);
  };

  const startNewThread = async () => {
    if (!selectedBatchId || !selectedRoutineKey) return;
    const routine = routines.find((r) => r.key === selectedRoutineKey);
    if (!routine) return;
    const { data } = await supabase
      .from("rp_threads")
      .insert({
        batch_id: selectedBatchId,
        routine_id: routine.id,
        title: `New ${routine.label} chat`,
      })
      .select("*")
      .single();
    if (data) {
      const t = data as Thread;
      setThreads((prev) => [t, ...prev]);
      setSelectedThreadId(t.id);
    }
  };

  const selectedBatch = batches.find((b) => b.id === selectedBatchId) ?? null;
  const selectedRoutine = routines.find((r) => r.key === selectedRoutineKey) ?? null;
  const selectedThread = threads.find((t) => t.id === selectedThreadId) ?? null;

  const handleSelectBatch = (id: string) => {
    if (id === selectedBatchId) return;
    // Force a clean reset so chat/artifacts don't render stale data from previous batch
    setSelectedThreadId(null);
    setThreads([]);
    setSelectedBatchId(id);
  };

  const handleSelectRoutine = (key: string) => {
    if (key === selectedRoutineKey) return;
    setSelectedThreadId(null);
    setThreads([]);
    setSelectedRoutineKey(key);
  };

  const railProps = {
    batches,
    routines,
    threads,
    selectedBatchId,
    selectedRoutineKey,
    selectedThreadId,
    onSelectBatch: handleSelectBatch,
    onSelectRoutine: handleSelectRoutine,
    onSelectThread: setSelectedThreadId,
    onNewThread: startNewThread,
  };

  return (
    <div className="flex h-full overflow-hidden bg-background relative">
      {/* Desktop/tablet left rail (collapsible) */}
      {!isMobile && !leftCollapsed && (
        <div className="hidden md:block w-[260px] flex-shrink-0 border-r bg-card/40">
          <LeftRail {...railProps} />
        </div>
      )}

      {/* Center column */}
      <div className="flex-1 min-w-0 flex flex-col border-r">
        {/* Pane toggle bar (desktop/tablet) */}
        {!isMobile && (
          <div className="h-9 px-2 border-b flex items-center justify-between bg-card/30 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => setLeftCollapsed((v) => !v)}
              aria-label={leftCollapsed ? "Show left panel" : "Hide left panel"}
            >
              <PanelLeft className="w-4 h-4 mr-1" />
              {leftCollapsed ? "Show batches" : "Hide"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs hidden lg:inline-flex"
              onClick={() => setRightCollapsed((v) => !v)}
              aria-label={rightCollapsed ? "Show artifacts" : "Hide artifacts"}
            >
              {rightCollapsed ? "Show artifacts" : "Hide"}
              <PanelRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        {/* Mobile in-chat hamburger to open left rail */}
        {isMobile && (
          <div className="h-10 px-2 border-b flex items-center bg-card/30 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2"
              onClick={() => setMobileLeftOpen(true)}
              aria-label="Open routines and threads"
            >
              <Menu className="w-4 h-4 mr-1" />
              <span className="text-xs">
                {selectedBatch ? selectedBatch.name : "Pick batch"}
                {selectedRoutine ? ` · ${selectedRoutine.label}` : ""}
              </span>
            </Button>
          </div>
        )}

        <div className="flex-1 min-h-0 flex flex-col">
          <ChatPane
            batch={selectedBatch}
            routine={selectedRoutine}
            thread={selectedThread}
            onThreadCreated={(t) => {
              setThreads((prev) => [t, ...prev.filter((p) => p.id !== t.id)]);
              setSelectedThreadId(t.id);
            }}
            onArtifactsCreated={refreshThreads}
          />
        </div>

        {/* Mobile artifact bottom sheet handle */}
        {isMobile && (
          <MobileArtifactSheet
            batch={selectedBatch}
            thread={selectedThread}
            artifactCount={artifactCount}
            routineKey={selectedRoutine?.key}
          />
        )}
      </div>

      {/* Desktop/tablet artifact pane (collapsible, lg+) */}
      {!isMobile && !rightCollapsed && (
        <div className="hidden lg:block w-[400px] flex-shrink-0 bg-card/40">
          <ArtifactPane batch={selectedBatch} thread={selectedThread} routineKey={selectedRoutine?.key} />
        </div>
      )}

      {/* Mobile left rail sheet */}
      {isMobile && (
        <MobileLeftRailSheet
          open={mobileLeftOpen}
          onOpenChange={setMobileLeftOpen}
          {...railProps}
        />
      )}
    </div>
  );
}
