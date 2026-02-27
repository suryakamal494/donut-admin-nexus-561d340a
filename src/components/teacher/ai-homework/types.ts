// Shared types and configuration for AI Homework Generator components

import { Pencil, Timer, FolderOpen } from "lucide-react";

// Homework type configuration
export type HomeworkType = 'practice' | 'test' | 'project';
export type ContextSourceType = 'none' | 'document' | 'content' | 'lesson_plan';

export interface HomeworkTypeConfig {
  id: HomeworkType;
  label: string;
  description: string;
  icon: typeof Pencil;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const homeworkTypeConfig: Record<HomeworkType, HomeworkTypeConfig> = {
  practice: {
    id: 'practice',
    label: 'Practice',
    description: 'Write, solve, upload answers',
    icon: Pencil,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  test: {
    id: 'test',
    label: 'Test',
    description: 'Auto-graded MCQ/Questions',
    icon: Timer,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  project: {
    id: 'project',
    label: 'Project',
    description: 'Reports, PPTs, creative work',
    icon: FolderOpen,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
};

export interface GeneratedHomework {
  title: string;
  description: string;
  instructions: string[];
  tasks: Array<{
    id: string;
    type: string;
    content: string;
    marks?: number;
  }>;
  totalMarks?: number;
  estimatedTime: number;
  resources?: string[];
}

export interface AIHomeworkFormData {
  title: string;
  instructions: string;
  selectedType: HomeworkType;
  subject: string;
  batchId: string;
  dueDate: string;
}

export interface AIHomeworkPrefill {
  title?: string;
  subject?: string;
  batchId?: string;
  instructions?: string;
  contextBanner?: string;
}

export interface ContextSourceData {
  contextSource: ContextSourceType;
  uploadedFile: File | null;
  selectedContent: any | null;
  selectedLessonPlan: any | null;
}

// Get batch display name
export const getBatchDisplayName = (batchId: string): string => {
  switch (batchId) {
    case "batch-10a": return "10A";
    case "batch-10b": return "10B";
    case "batch-11a": return "11A";
    default: return batchId;
  }
};

// Get class name from batch
export const getClassName = (batchId: string): string => {
  return batchId.includes("10") ? "Class 10" : "Class 11";
};
