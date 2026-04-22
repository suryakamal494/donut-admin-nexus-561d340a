// Student Copilot — Main 3-panel layout (orchestrator)
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { PanelLeft, PanelRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { studentProfile } from "@/data/student/profile";
import StudentLeftRail from "./StudentLeftRail";
import StudentChatPane from "./StudentChatPane";
import StudentArtifactPane from "./StudentArtifactPane";
import { useStudentChat } from "./useStudentChat";
import { useInlinePractice } from "./useInlinePractice";
import {
  fetchStudentRoutines,
  fetchThreads,
  createThread,
  fetchMessages,
  fetchArtifacts,
  updateArtifactContent,
} from "./api";
import {
  fetchTopicMastery,
  fetchNotifications,
  dismissNotification,
} from "./api";
import type { StudentThread, StudentMessage, StudentRoutine, StudentArtifact, TopicMastery, StudentNotification } from "./types";
import { DEFAULT_ROUTINE_KEY } from "./types";
import { buildFullStudentContext } from "./context";

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

  // Mastery & notifications state
  const [mastery, setMastery] = useState<TopicMastery[]>([]);
  const [notifications, setNotifications] = useState<StudentNotification[]>([]);

  // Practice hook
  const { practiceStates, startPractice, answerQuestion, nextQuestion, resetPractice } =
    useInlinePractice(STUDENT_ID);

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
      const [rts, ths, arts, mast, notifs] = await Promise.all([
        fetchStudentRoutines(),
        fetchThreads(STUDENT_ID),
        fetchArtifacts(STUDENT_ID),
        fetchTopicMastery(STUDENT_ID),
        fetchNotifications(STUDENT_ID),
      ]);
      setRoutines(rts);
      setThreads(ths);
      setArtifacts(arts);
      setMastery(mast);
      setNotifications(notifs);
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

  // Build full student context with mastery data
  const studentContext = useMemo(() => buildFullStudentContext(mastery), [mastery]);

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

  // Refresh mastery after practice completes
  const refreshMastery = useCallback(async () => {
    const mast = await fetchTopicMastery(STUDENT_ID);
    setMastery(mast);
  }, []);

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
          extraSystem: studentContext,
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
        extraSystem: studentContext,
      });

      // Refresh messages
      const msgs = await fetchMessages(currentThread.id);
      setMessages(msgs);

      if (result.artifacts.length > 0) {
        setArtifacts((prev) => [...result.artifacts, ...prev]);
      }
    },
    [currentThread, currentRoutine, messages, routines, subjectFilter, send, studentContext]
  );

  // Auto-start practice when a new practice_session artifact appears
  useEffect(() => {
    for (const a of artifacts) {
      if (a.type === "practice_session" && !practiceStates[a.id]) {
        const content = a.content as any;
        if (content?.questions?.length > 0) {
          startPractice(a);
        }
      }
    }
    // Refresh mastery when practice completes
    for (const [artId, state] of Object.entries(practiceStates)) {
      const art = artifacts.find((a) => a.id === artId);
      if (art && state && typeof state === "object" && "results" in state) {
        const results = (state as any).results;
        const content = art.content as any;
        if (results && content?.questions && results.length >= content.questions.length) {
          refreshMastery();
          break;
        }
      }
    }
  }, [artifacts, practiceStates, startPractice, refreshMastery]);

  const handleClarificationSubmit = useCallback(
    async (artifactId: string, answers: Record<string, string | string[]>) => {
      // Mark artifact as answered
      const artifact = artifacts.find((a) => a.id === artifactId);
      if (!artifact) return;
      const updatedContent = { ...(artifact.content as any), answered: true };
      await updateArtifactContent(artifactId, updatedContent);
      setArtifacts((prev) =>
        prev.map((a) => (a.id === artifactId ? { ...a, content: updatedContent } : a))
      );

      // Format answers and send as user message
      const lines = Object.entries(answers)
        .map(([, v]) => (Array.isArray(v) ? v.join(", ") : v))
        .join("\n");
      handleSend(lines);
    },
    [artifacts, handleSend]
  );

  const handlePracticeWeak = useCallback(
    (topic: string) => {
      handleSend(`Practice more on ${topic}`);
    },
    [handleSend]
  );

  const handleDismissNotification = useCallback(async (notifId: string) => {
    await dismissNotification(notifId);
    setNotifications((prev) => prev.filter((n) => n.id !== notifId));
  }, []);

  const handleNotificationAction = useCallback((notif: StudentNotification) => {
    const routineMap: Record<string, string> = {
      homework: "s_practice",
      exam_reminder: "s_exam_prep",
      chapter_today: "s_doubt",
      debrief_available: "s_progress",
    };
    const routineKey = routineMap[notif.type] ?? DEFAULT_ROUTINE_KEY;
    handleNewThread(routineKey);
    setTimeout(() => {
      const prompt = notif.body ?? notif.title;
      handleSend(prompt);
    }, 300);
  }, [handleNewThread, handleSend]);

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
          practiceStates={practiceStates}
          onPracticeAnswer={answerQuestion}
          onPracticeNext={nextQuestion}
          onPracticeRetry={resetPractice}
          onClarificationSubmit={handleClarificationSubmit}
          onPracticeWeak={handlePracticeWeak}
          notifications={notifications}
          onNotificationAction={handleNotificationAction}
          onNotificationDismiss={handleDismissNotification}
        />
      </div>

      {/* Desktop right artifact pane */}
      {!isMobile && rightVisible && (
        <div className="hidden lg:flex w-[360px] flex-shrink-0 bg-card/40 flex-col">
          <StudentArtifactPane
            artifacts={artifacts}
            thread={currentThread}
            routineKey={currentRoutine?.key}
            onClose={toggleRight}
          />
        </div>
      )}
    </div>
  );
};

export default StudentCopilotPage;