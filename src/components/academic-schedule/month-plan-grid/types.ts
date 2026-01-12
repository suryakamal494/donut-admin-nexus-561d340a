// Shared types for MonthPlanGrid components

import { AcademicWeek } from "@/types/academicSchedule";
import {
  SubjectPlanData,
  ChapterCellType,
  ChapterAdjustment,
  PendingChapter,
  ChapterWeekAssignment,
} from "@/types/academicPlanner";

// Modification types union
export type ModificationType = 'reorder' | 'extend' | 'compress' | 'swap' | 'addHours' | 'removeHours' | 'manualAdd' | 'removeFromWeek';

export interface MonthWeeksData {
  startWeekIndex: number;
  endWeekIndex: number;
  weeksInMonth: AcademicWeek[];
}

export interface SubjectColors {
  bg: string;
  text: string;
  border: string;
}

export interface ChapterItemData {
  id: string;
  chapterId: string;
  chapterName: string;
  chapterIndex: number;
  weekIndex: number;
  hours: number;
  cellType: ChapterCellType;
  isLocked: boolean;
  assignment: ChapterWeekAssignment | null;
}

export interface DraggedChapterInfo {
  chapterId: string;
  chapterName: string;
  chapterIndex: number;
  hours: number;
}

// Cell style helpers
export const getCellStyle = (cellType: ChapterCellType): string => {
  switch (cellType) {
    case 'single':
      return "rounded-lg";
    case 'start':
      return "rounded-l-lg";
    case 'end':
      return "rounded-r-lg";
    case 'middle':
      return "";
    case 'full':
      return "rounded-lg";
    default:
      return "rounded-lg";
  }
};

export const getCellOpacity = (cellType: ChapterCellType): string => {
  switch (cellType) {
    case 'single':
    case 'full':
      return "bg-opacity-70";
    case 'start':
      return "bg-opacity-60";
    case 'middle':
      return "bg-opacity-40";
    case 'end':
      return "bg-opacity-50";
    default:
      return "";
  }
};

// Get modification label for tooltip
export const getModificationLabel = (modificationTypes: ModificationType[]): string | null => {
  if (modificationTypes.length === 0) return null;
  const labels: string[] = [];
  if (modificationTypes.includes('reorder')) labels.push('Reordered');
  if (modificationTypes.includes('extend')) labels.push('Extended');
  if (modificationTypes.includes('compress')) labels.push('Compressed');
  if (modificationTypes.includes('swap')) labels.push('Swapped');
  if (modificationTypes.includes('addHours')) labels.push('Hours Added');
  if (modificationTypes.includes('removeHours')) labels.push('Hours Removed');
  if (modificationTypes.includes('manualAdd')) labels.push('Manually Added');
  if (modificationTypes.includes('removeFromWeek')) labels.push('Removed');
  return labels.join(', ');
};

// Trigger haptic feedback if available
export const triggerHaptic = (duration: number = 10): void => {
  if ('vibrate' in navigator) {
    navigator.vibrate(duration);
  }
};
