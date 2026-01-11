/**
 * Lesson Plan Workspace Types
 * Types and utilities for the lesson workspace feature
 */

export type BlockType = 'explain' | 'demonstrate' | 'quiz' | 'homework';
export type BlockSource = 'library' | 'ai' | 'custom';

// Link types for embedded content
export type LinkType = 'youtube' | 'vimeo' | 'google-drive' | 'google-docs' | 'iframe' | 'unknown';

// Annotation tool types
export type AnnotationTool = 'pen' | 'highlighter' | 'arrow' | 'circle' | 'rectangle' | 'text' | 'eraser';

export interface LessonPlanBlock {
  id: string;
  type: BlockType;
  title: string;
  content?: string;
  duration?: number;
  source: BlockSource;
  sourceId?: string;
  sourceType?: string; // Extended to support content types + homework types (practice/test/project)
  questions?: string[];
  attachmentUrl?: string;
  aiGenerated?: boolean;
  // New fields for link/embed support
  embedUrl?: string;
  linkType?: LinkType;
}

// Helper to detect link type from URL
export const detectLinkType = (url: string): LinkType => {
  if (!url) return 'unknown';
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return 'youtube';
  if (lowerUrl.includes('vimeo.com')) return 'vimeo';
  if (lowerUrl.includes('drive.google.com')) return 'google-drive';
  if (lowerUrl.includes('docs.google.com') || lowerUrl.includes('slides.google.com')) return 'google-docs';
  
  return 'iframe';
};

// Get YouTube embed URL from various YouTube URL formats
export const getYouTubeEmbedUrl = (url: string): string => {
  let videoId = '';
  
  if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
  } else if (url.includes('youtube.com/watch')) {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    videoId = urlParams.get('v') || '';
  } else if (url.includes('youtube.com/embed/')) {
    videoId = url.split('embed/')[1]?.split('?')[0] || '';
  }
  
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

// Get Vimeo embed URL
export const getVimeoEmbedUrl = (url: string): string => {
  const match = url.match(/vimeo\.com\/(\d+)/);
  const videoId = match ? match[1] : '';
  return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
};

export interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  subjectId: string;
  chapter: string;
  topic: string;
  batchId: string;
  batchName: string;
  className: string;
  scheduledDate: string;
  periodNumber: number;
  status: 'draft' | 'ready' | 'completed';
  blocks: LessonPlanBlock[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceContext {
  className: string;
  subject: string;
  chapter: string;
  scheduledDate: string;
  batchName: string;
  batchId: string;
  isFromTimetable: boolean;
}

export const blockTypeConfig: Record<BlockType, {
  icon: string;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  tooltip: string;
}> = {
  explain: {
    icon: 'BookOpen',
    label: 'Explain',
    color: 'bg-[hsl(var(--donut-coral))]',
    bgColor: 'bg-[hsl(var(--donut-coral))]/5',
    borderColor: 'border-[hsl(var(--donut-coral))]/30',
    description: 'Teaching content like presentations, videos, or documents',
    tooltip: 'Add presentations, videos, or documents to explain concepts to students'
  },
  demonstrate: {
    icon: 'Play',
    label: 'Demonstrate',
    color: 'bg-[hsl(var(--donut-orange))]',
    bgColor: 'bg-[hsl(var(--donut-orange))]/5',
    borderColor: 'border-[hsl(var(--donut-orange))]/30',
    description: 'Solved examples, animations, or step-by-step walkthroughs',
    tooltip: 'Add solved examples, animations, or step-by-step demonstrations'
  },
  quiz: {
    icon: 'HelpCircle',
    label: 'Quiz',
    color: 'bg-[hsl(var(--donut-pink))]',
    bgColor: 'bg-[hsl(var(--donut-pink))]/5',
    borderColor: 'border-[hsl(var(--donut-pink))]/30',
    description: 'Questions for quick assessment during class',
    tooltip: 'Add questions from question bank or generate with AI for quick assessment'
  },
  homework: {
    icon: 'ClipboardList',
    label: 'Homework',
    color: 'bg-[hsl(var(--donut-purple))]',
    bgColor: 'bg-[hsl(var(--donut-purple))]/5',
    borderColor: 'border-[hsl(var(--donut-purple))]/30',
    description: 'Take-home assignments for students',
    tooltip: 'Assign take-home work for students to complete after class'
  }
};
