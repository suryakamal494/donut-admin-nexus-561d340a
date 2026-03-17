// Test Session Persistence Hook
// Saves and restores test progress to localStorage

import { useEffect, useCallback, useRef } from "react";
import type { AnswerValue } from "@/components/student/tests/player/QuestionDisplay";
import type { QuestionStatus } from "@/data/student/testQuestions";

interface SessionQuestion {
  id: string;
  status: QuestionStatus;
  questionNumber: number;
  sectionId: string;
}

interface PersistedTestSession {
  testId: string;
  answers: Record<string, AnswerValue>;
  sessionQuestions: SessionQuestion[];
  remainingTime: number;
  currentQuestionIndex: number;
  currentSectionId: string;
  savedAt: number;
  alertsShown: {
    halfTime: boolean;
    fiveMinutes: boolean;
    oneMinute: boolean;
  };
}

const STORAGE_KEY_PREFIX = "test_session_";
const SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

export const useTestSessionPersistence = (testId: string | undefined) => {
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Get storage key for this test
  const getStorageKey = useCallback(() => {
    return `${STORAGE_KEY_PREFIX}${testId}`;
  }, [testId]);

  // Load persisted session from localStorage
  const loadSession = useCallback((): PersistedTestSession | null => {
    if (!testId) return null;

    try {
      const stored = localStorage.getItem(getStorageKey());
      if (!stored) return null;

      const session: PersistedTestSession = JSON.parse(stored);

      // Check if session has expired
      if (Date.now() - session.savedAt > SESSION_EXPIRY_MS) {
        localStorage.removeItem(getStorageKey());
        return null;
      }

      // Verify it's the same test
      if (session.testId !== testId) {
        localStorage.removeItem(getStorageKey());
        return null;
      }

      return session;
    } catch (error) {
      console.error("Failed to load test session:", error);
      localStorage.removeItem(getStorageKey());
      return null;
    }
  }, [testId, getStorageKey]);

  // Save session to localStorage (debounced)
  const saveSession = useCallback(
    (data: Omit<PersistedTestSession, "testId" | "savedAt">) => {
      if (!testId) return;

      // Clear previous timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Debounce save to avoid too many writes
      saveTimeoutRef.current = setTimeout(() => {
        try {
          const session: PersistedTestSession = {
            ...data,
            testId,
            savedAt: Date.now(),
          };
          localStorage.setItem(getStorageKey(), JSON.stringify(session));
        } catch (error) {
          console.error("Failed to save test session:", error);
        }
      }, 500);
    },
    [testId, getStorageKey]
  );

  // Clear persisted session (on submit or exit)
  const clearSession = useCallback(() => {
    if (!testId) return;
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    try {
      localStorage.removeItem(getStorageKey());
    } catch (error) {
      console.error("Failed to clear test session:", error);
    }
  }, [testId, getStorageKey]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    loadSession,
    saveSession,
    clearSession,
  };
};
