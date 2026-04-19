import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import LeftRail from "./LeftRail";
import ChatPane from "./ChatPane";
import ArtifactPane from "./ArtifactPane";
import type { Batch, Routine, Thread } from "./types";

export default function RoutinePilotPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);

  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [selectedRoutineKey, setSelectedRoutineKey] = useState<string | null>(null);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

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
      if (batchList.length && !selectedBatchId) setSelectedBatchId(batchList[0].id);
      if (routineList.length && !selectedRoutineKey) {
        const firstActive = routineList.find((r) => r.is_active);
        if (firstActive) setSelectedRoutineKey(firstActive.key);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load threads when batch or routine changes
  useEffect(() => {
    if (!selectedBatchId || !selectedRoutineKey) return;
    const routine = routines.find((r) => r.key === selectedRoutineKey);
    if (!routine) return;
    (async () => {
      const { data } = await supabase
        .from("rp_threads")
        .select("*")
        .eq("batch_id", selectedBatchId)
        .eq("routine_id", routine.id)
        .order("last_message_at", { ascending: false });
      const list = (data ?? []) as Thread[];
      setThreads(list);
      setSelectedThreadId(list[0]?.id ?? null);
    })();
  }, [selectedBatchId, selectedRoutineKey, routines]);

  const refreshThreads = async () => {
    if (!selectedBatchId || !selectedRoutineKey) return;
    const routine = routines.find((r) => r.key === selectedRoutineKey);
    if (!routine) return;
    const { data } = await supabase
      .from("rp_threads")
      .select("*")
      .eq("batch_id", selectedBatchId)
      .eq("routine_id", routine.id)
      .order("last_message_at", { ascending: false });
    setThreads((data ?? []) as Thread[]);
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

  return (
    <div className="flex h-full overflow-hidden bg-background">
      <div className="hidden md:block w-[260px] flex-shrink-0 border-r bg-card/40">
        <LeftRail
          batches={batches}
          routines={routines}
          threads={threads}
          selectedBatchId={selectedBatchId}
          selectedRoutineKey={selectedRoutineKey}
          selectedThreadId={selectedThreadId}
          onSelectBatch={setSelectedBatchId}
          onSelectRoutine={setSelectedRoutineKey}
          onSelectThread={setSelectedThreadId}
          onNewThread={startNewThread}
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col border-r">
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

      <div className="hidden lg:block w-[400px] flex-shrink-0 bg-card/40">
        <ArtifactPane batch={selectedBatch} thread={selectedThread} />
      </div>
    </div>
  );
}
