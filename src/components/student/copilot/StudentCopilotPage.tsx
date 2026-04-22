// Student Copilot — Main 3-panel layout (orchestrator)
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { PanelLeft, PanelRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { studentProfile } from "@/data/student/profile";
import StudentLeftRail from "./StudentLeftRail";
import StudentChatPane from "./StudentChatPane";
import { useStudentChat } from "./useStudentChat";
import {
  fetchStudentRoutines,
  fetchThreads,
  createThread,
  fetchMessages,
  fetchArtifacts,
} from "./api";
import type {
  StudentThread,
  StudentMessage,
  StudentRoutine,
  StudentArtifact,
} from "./types";
import { DEFAULT_ROUTINE_KEY } from "./types";

const STUDENT_ID = studentProfile.id;

const StudentCopilotPage: React.FC = () => {
  const isMobile = useIsMobile();

  // Data state
  const [routines, setRoutines] = useState<StudentRoutine[]>([]);
  const [threads, setThreads] = useState<StudentThread[]>([]);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<StudentMessage[]>([]);
  const [artifacts, setArtifacts] = useState<StudentArtifact[]>([]);
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);

  // Panel visibility
  const [leftVisible, setLeftVisible] = useState(true);
  const [rightVisible, setRightVisible] = useState(true);
  const [leftSheetOpen, setLeftSheetOpen] = useState(false);

  // Chat hook
  const { streaming, streamedText, pendingArtifact, send } = useStudentChat();

  // Current thread/routine
  const currentThread = useMemo(
    () => threads.find((t) => t.id === currentThreadId) ?? null,
    [threads, currentThreadId]
  );
  const currentRoutine = useMemo(() => {
    if (!currentThread) return routines.find((r) => r.key === DEFAULT_ROUTINE_KEY) ?? null;
    return routines.find((r) => r.key === currentThread.routine_key) ?? null;
  }, [currentThread, routines]);

  // Quick start chips
  const quickStartChips = useMemo(() => {
    if (!currentRoutine?.quick_start_chips) return [];
    const chips = currentRoutine.quick_start_chips;
    if (Array.isArray(chips)) return chips as string[];
    return [];
  }, [currentRoutine]);

  // Initial data load
  useEffect(() => {
    (async () => {
      const [rts, ths, arts] = await Promise.all([
        fetchStudentRoutines(),
        fetchThreads(STUDENT_ID),
        fetchArtifacts(STUDENT_ID),
      ]);
      setRoutines(rts);
      setThreads(ths);
      setArtifacts(arts);
    })();
  }, []);

  // Load messages when thread changes
  useEffect(() => {
    if (!currentThreadId) {
      setMessages([]);
      return;
    }
    (async () => {
      const msgs = await fetchMessages(currentThreadId);
      setMessages(msgs);
    })();
  }, [currentThreadId]);

  // Keyboard shortcut: Cmd+K → new chat
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        handleNewThread();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [routines]);

  const handleNewThread = useCallback(
    async (routineKey?: string) => {
      const key = routineKey ?? DEFAULT_ROUTINE_KEY;
      const routine = routines.find((r) => r.key === key);
      const title = routine ? `New ${routine.label} chat` : "New chat";
      const thread = await createThread(STUDENT_ID, key, title, subjectFilter);
      if (thread) {
        setThreads((prev) => [thread, ...prev]);
        setCurrentThreadId(thread.id);
        setMessages([]);
      }
    },
    [routines, subjectFilter]
  );

  const handleSend = useCallback(
    async (text: string, images?: string[]) => {
      if (!currentThread) {
        // Auto-create thread
        const key = DEFAULT_ROUTINE_KEY;
        const routine = routines.find((r) => r.key === key);
        const title = text.slice(0, 60).trim() || "New chat";
        const thread = await createThread(STUDENT_ID, key, title, subjectFilter);
        if (!thread) return;
        setThreads((prev) => [thread, ...prev]);
        setCurrentThreadId(thread.id);

        // Add user message to UI optimistically
        const tempUserMsg: StudentMessage = {
          id: `temp-${Date.now()}`,
          thread_id: thread.id,
          role: "user",
          content: text,
          created_at: new Date().toISOString(),
        };
        setMessages([tempUserMsg]);

        const result = await send({
          text,
          images,
          thread,
          routine: routine ?? null,
          studentId: STUDENT_ID,
          existingMessages: [],
        });

        // Refresh messages from DB
        const msgs = await fetchMessages(thread.id);
        setMessages(msgs);

        if (result.artifacts.length > 0) {
          setArtifacts((prev) => [...result.artifacts, ...prev]);
        }
        if (result.detectedSubject) {
          setThreads((prev) =>
            prev.map((t) =>
              t.id === thread.id ? { ...t, subject: result.detectedSubject, title } : t
            )
          );
        }
        return;
      }

      // Existing thread
      const tempUserMsg: StudentMessage = {
        id: `temp-${Date.now()}`,
        thread_id: currentThread.id,
        role: "user",
        content: text,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempUserMsg]);

      const result = await send({
        text,
        images,
        thread: currentThread,
        routine: currentRoutine,
        studentId: STUDENT_ID,
        existingMessages: messages,
      });

      // Refresh messages
      const msgs = await fetchMessages(currentThread.id);
      setMessages(msgs);

      if (result.artifacts.length > 0) {
        setArtifacts((prev) => [...result.artifacts, ...prev]);
      }
    },
    [currentThread, currentRoutine, messages, routines, subjectFilter, send]
  );

  const handleSelectThread = useCallback((id: string) => {
    setCurrentThreadId(id);
  }, []);

  const toggleLeft = useCallback(() => {
    if (isMobile) {
      setLeftSheetOpen((v) => !v);
    } else {
      setLeftVisible((v) => !v);
    }
  }, [isMobile]);

  const toggleRight = useCallback(() => {
    setRightVisible((v) => !v);
  }, []);

  const railProps = {
    routines,
    threads,
    currentThreadId,
    subjectFilter,
    onNewThread: handleNewThread,
    onSelectThread: handleSelectThread,
    onSubjectFilter: setSubjectFilter,
  };

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background">
      {/* Desktop left rail */}
      {!isMobile && leftVisible && (
        <div className="hidden md:flex w-[260px] flex-shrink-0 border-r bg-card/40 flex-col">
          <StudentLeftRail {...railProps} />
        </div>
      )}

      {/* Mobile left sheet */}
      {isMobile && (
        <Sheet open={leftSheetOpen} onOpenChange={setLeftSheetOpen}>
          <SheetContent side="left" className="w-[280px] p-0">
            <StudentLeftRail {...railProps} onClose={() => setLeftSheetOpen(false)} />
          </SheetContent>
        </Sheet>
      )}

      {/* Center chat pane */}
      <div className="flex-1 min-w-0 flex flex-col border-r">
        <StudentChatPane
          thread={currentThread}
          routine={currentRoutine}
          messages={messages}
          streaming={streaming}
          streamedText={streamedText}
          pendingArtifact={pendingArtifact}
          artifacts={artifacts}
          onSend={handleSend}
          onToggleLeft={toggleLeft}
          onToggleRight={toggleRight}
          quickStartChips={quickStartChips}
        />
      </div>

      {/* Desktop right artifact pane (placeholder for Phase 3) */}
      {!isMobile && rightVisible && (
        <div className="hidden lg:flex w-[360px] flex-shrink-0 bg-card/40 flex-col items-center justify-center">
          <div className="text-center text-muted-foreground p-6">
            <p className="text-sm font-medium mb-1">Artifacts</p>
            <p className="text-xs">Generated artifacts will appear here</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCopilotPage;