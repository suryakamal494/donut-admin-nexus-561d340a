// Hook: Curriculum selection logic with 3-step default + localStorage persistence
// Used independently by Subject Detail and Subject Tests pages

import { useState, useEffect, useCallback, useRef } from "react";

interface CurriculumSelectionInput {
  curricula: string[];
  pendingWork: Record<string, boolean>;
  subjectId: string;
  /** "subjects" or "tests" — stored separately */
  section: "subjects" | "tests";
  /** Placeholder student ID (will come from auth later) */
  studentId?: string;
}

interface CurriculumSelectionResult {
  activeCurriculum: string;
  /** Non-null only when auto-selected due to pending work */
  autoSelectedReason: string | null;
  switchCurriculum: (curriculum: string) => void;
  isMultiCurriculum: boolean;
}

function getStorageKey(section: string, studentId: string, subjectId: string) {
  return `lastVisited_${section}_${studentId}_${subjectId}`;
}

export function useCurriculumSelection({
  curricula,
  pendingWork,
  subjectId,
  section,
  studentId = "default",
}: CurriculumSelectionInput): CurriculumSelectionResult {
  const isMultiCurriculum = curricula.length > 1;
  const hasInitialized = useRef(false);

  // Compute default selection
  const computeDefault = useCallback((): { curriculum: string; reason: string | null } => {
    if (curricula.length === 0) return { curriculum: "", reason: null };
    if (curricula.length === 1) return { curriculum: curricula[0], reason: null };

    // Rule 1: Exactly one curriculum has pending work
    const pendingCurricula = curricula.filter(c => pendingWork[c]);
    if (pendingCurricula.length === 1) {
      return { curriculum: pendingCurricula[0], reason: "Pending work" };
    }

    // Rule 2: More than one has pending work → select CBSE
    if (pendingCurricula.length > 1) {
      const cbse = curricula.find(c => c.toLowerCase() === "cbse");
      return { curriculum: cbse || pendingCurricula[0], reason: "Pending work" };
    }

    // Rule 3: No pending work → restore lastVisited
    const storageKey = getStorageKey(section, studentId, subjectId);
    const stored = localStorage.getItem(storageKey);
    if (stored && curricula.includes(stored)) {
      return { curriculum: stored, reason: null };
    }

    // Fallback: first curriculum
    return { curriculum: curricula[0], reason: null };
  }, [curricula, pendingWork, subjectId, section, studentId]);

  const defaultVal = computeDefault();
  const [activeCurriculum, setActiveCurriculum] = useState(defaultVal.curriculum);
  const [autoSelectedReason, setAutoSelectedReason] = useState<string | null>(defaultVal.reason);

  // Re-run default logic when subject changes
  useEffect(() => {
    if (hasInitialized.current) {
      const val = computeDefault();
      setActiveCurriculum(val.curriculum);
      setAutoSelectedReason(val.reason);
    }
    hasInitialized.current = true;
  }, [subjectId, computeDefault]);

  const switchCurriculum = useCallback((curriculum: string) => {
    setActiveCurriculum(curriculum);
    setAutoSelectedReason(null); // Manual switch clears the reason
    const storageKey = getStorageKey(section, studentId, subjectId);
    localStorage.setItem(storageKey, curriculum);
  }, [section, studentId, subjectId]);

  return {
    activeCurriculum,
    autoSelectedReason,
    switchCurriculum,
    isMultiCurriculum,
  };
}
