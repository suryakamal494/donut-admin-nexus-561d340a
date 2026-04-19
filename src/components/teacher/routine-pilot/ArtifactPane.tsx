import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, FileText, Sparkles } from "lucide-react";
import ArtifactCard from "./artifacts/ArtifactCard";
import ArtifactView from "./artifacts/ArtifactView";
import type { Artifact, Batch, Thread } from "./types";

interface Props {
  batch: Batch | null;
  thread: Thread | null;
  routineKey?: string;
}

export default function ArtifactPane({ batch, thread, routineKey }: Props) {
  const [allArtifacts, setAllArtifacts] = useState<Artifact[]>([]);
  const [tab, setTab] = useState<"thread" | "library">("thread");
  const [openArtifactId, setOpenArtifactId] = useState<string | null>(null);

  useEffect(() => {
    if (!batch) {
      setAllArtifacts([]);
      return;
    }
    let cancelled = false;
    const load = async () => {
      const { data } = await supabase
        .from("rp_artifacts")
        .select("*")
        .eq("batch_id", batch.id)
        .order("created_at", { ascending: false });
      if (!cancelled) setAllArtifacts((data ?? []) as Artifact[]);
    };
    load();
    // Realtime refresh
    const channel = supabase
      .channel(`rp_artifacts_${batch.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "rp_artifacts", filter: `batch_id=eq.${batch.id}` },
        () => load()
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "rp_artifacts", filter: `batch_id=eq.${batch.id}` },
        () => load()
      )
      .subscribe();
    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [batch]);

  // Auto-pick best tab when thread/library content changes
  useEffect(() => {
    setOpenArtifactId(null);
    if (!thread) {
      setTab("library");
      return;
    }
    const threadArts = allArtifacts.filter((a) => a.thread_id === thread.id);
    setTab(threadArts.length ? "thread" : "library");
  }, [thread, allArtifacts]);

  const threadArtifacts = thread ? allArtifacts.filter((a) => a.thread_id === thread.id) : [];
  const visible = tab === "thread" ? threadArtifacts : allArtifacts;
  const openArtifact = allArtifacts.find((a) => a.id === openArtifactId) ?? null;

  if (!batch) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
        No batch selected.
      </div>
    );
  }

  return (
    <div data-tour="copilot-artifacts" className="flex flex-col h-full">
      {openArtifact ? (
        <>
          <div className="px-4 py-3 border-b flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-7 px-2 -ml-1" onClick={() => setOpenArtifactId(null)}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <div className="text-sm font-medium truncate">{openArtifact.title}</div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4">
              <ArtifactView artifact={openArtifact} batch={batch} routineKey={routineKey} />
            </div>
          </ScrollArea>
        </>
      ) : (
        <>
          <div className="px-4 pt-3 pb-2 border-b">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Artifacts</span>
            </div>
            <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
              <TabsList className="w-full grid grid-cols-2 h-8">
                <TabsTrigger value="thread" className="text-xs" disabled={!thread}>
                  This thread {thread ? `(${threadArtifacts.length})` : ""}
                </TabsTrigger>
                <TabsTrigger value="library" className="text-xs">
                  Batch library ({allArtifacts.length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-2">
              {visible.length === 0 && (
                <div className="text-center py-10 text-xs text-muted-foreground">
                  <Sparkles className="w-5 h-5 mx-auto mb-2 opacity-50" />
                  No artifacts yet. Ask the AI to create one.
                </div>
              )}
              {visible.map((a) => (
                <ArtifactCard key={a.id} artifact={a} onClick={() => setOpenArtifactId(a.id)} />
              ))}
            </div>
          </ScrollArea>
        </>
      )}
    </div>
  );
}
