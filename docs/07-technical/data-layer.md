# Data Layer

> Mock data structure and patterns.

---

## Overview

The application uses a centralized mock data layer in `src/data/` that simulates backend responses. This enables full UI development without a live backend and serves as the data contract documentation.

---

## Master Data Structure

### Source: `src/data/masterData.ts`

The master data file contains the curriculum and course structures that form the foundation of all classification systems.

```typescript
// Curriculum structure
interface Curriculum {
  id: string;
  name: string;        // "CBSE", "ICSE"
  description: string;
}

interface Class {
  id: string;
  curriculumId: string;
  name: string;        // "Class 10", "Class 11"
  order: number;
}

interface Subject {
  id: string;
  classId: string;
  name: string;        // "Physics", "Chemistry"
  color: string;       // For UI theming
  icon: string;
}

interface Chapter {
  id: string;
  subjectId: string;
  name: string;
  order: number;
  description?: string;
}

interface Topic {
  id: string;
  chapterId: string;
  name: string;
  order: number;
}

// Course structure
interface Course {
  id: string;
  name: string;        // "JEE Mains", "NEET"
  description: string;
}

interface CourseChapterMapping {
  id: string;
  courseId: string;
  chapterId: string;   // From curriculum
  order: number;
}

interface ExclusiveChapter {
  id: string;
  courseId: string;
  subjectId: string;
  name: string;
  order: number;
}
```

---

## Content Data Structure

### Source: `src/data/contentLibraryData.ts`

```typescript
interface ContentItem {
  id: string;
  title: string;
  type: 'video' | 'pdf' | 'presentation' | 'animation' | 'simulation' | 'quiz' | 'notes';
  source: 'global' | 'institute' | 'teacher';
  sourceId?: string;              // instituteId or teacherId
  
  // Classification
  curriculumId?: string;
  classId: string;
  subjectId: string;
  chapterId: string;
  topicId?: string;
  
  // Metadata
  url?: string;
  fileSize?: number;
  duration?: number;              // For videos
  pageCount?: number;             // For PDFs
  
  // Tracking
  createdAt: string;
  createdBy: string;
  status: 'draft' | 'published';
}
```

---

## Question Data Structure

### Source: `src/data/questionsData.ts`

```typescript
interface Question {
  id: string;
  type: 'mcq-single' | 'mcq-multiple' | 'true-false' | 'fill-blank' | 
        'integer' | 'subjective' | 'assertion-reasoning' | 'matrix-match' | 'paragraph';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  source: 'global' | 'institute' | 'teacher';
  
  // Classification
  classId: string;
  subjectId: string;
  chapterId: string;
  topicId?: string;
  
  // Content
  questionText: string;           // Supports LaTeX
  questionImage?: string;
  options?: QuestionOption[];     // For MCQ types
  correctAnswer: string | string[];
  explanation?: string;
  
  // Metadata
  marks: number;
  negativeMarks?: number;
  tags: string[];
  createdAt: string;
  createdBy: string;
}

interface QuestionOption {
  id: string;
  text: string;
  image?: string;
}
```

---

## Exam Data Structure

### Source: `src/data/examsData.ts`

```typescript
interface Exam {
  id: string;
  title: string;
  type: 'pyp' | 'grand-test' | 'institute' | 'teacher';
  source: 'global' | 'institute' | 'teacher';
  
  // Configuration
  duration: number;               // Minutes
  totalMarks: number;
  instructions?: string;
  
  // Structure
  sections: ExamSection[];
  
  // Assignment
  targetBatches?: string[];
  availableFrom?: string;
  availableUntil?: string;
  
  // Status
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
}

interface ExamSection {
  id: string;
  name: string;                   // "Physics", "Section A"
  questionCount: number;
  questionsRequired: number;
  questionType?: string;          // "mcq-single", "integer"
  markingScheme: {
    correct: number;
    incorrect: number;
  };
  questionIds: string[];
}
```

---

## Timetable Data Structure

### Source: `src/data/timetableData.ts`

```typescript
interface Period {
  id: string;
  order: number;
  startTime: string;              // "08:00"
  endTime: string;                // "08:45"
  type: 'period' | 'break';
  breakType?: 'short' | 'long' | 'lunch';
}

interface Holiday {
  id: string;
  date: string;
  name: string;
  type: 'national' | 'regional' | 'custom';
  recurring: boolean;
}

interface ExamBlock {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  batchIds: string[];
}

interface TimetableSlot {
  id: string;
  batchId: string;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  periodId: string;
  subjectId: string;
  teacherId: string;
}

interface Substitution {
  id: string;
  date: string;
  originalTeacherId: string;
  substituteTeacherId: string;
  slotId: string;
  reason: string;
}
```

---

## Academic Schedule Data

### Source: `src/data/academicScheduleData.ts`

```typescript
interface ChapterHourAllocation {
  id: string;
  batchId: string;
  subjectId: string;
  chapterId: string;
  allocatedHours: number;
  order: number;
}

interface AcademicPlan {
  id: string;
  batchId: string;
  subjectId: string;
  status: 'draft' | 'published';
  entries: PlanEntry[];
  createdAt: string;
  publishedAt?: string;
}

interface PlanEntry {
  id: string;
  chapterId: string;
  weekNumber: number;
  plannedHours: number;
  actualHours?: number;
  isEdited: boolean;
}

interface TeachingConfirmation {
  id: string;
  slotId: string;
  date: string;
  teacherId: string;
  status: 'taught' | 'not-taught';
  topicsTaught?: string[];
  reason?: string;
}
```

---

## Data Access Patterns

### Direct Import

```typescript
import { curriculums, classes, subjects } from '@/data/masterData';
```

### Filtered Access

```typescript
// Get subjects for a class
const classSubjects = subjects.filter(s => s.classId === selectedClass.id);
```

### Lookup Helpers

```typescript
// Helper function pattern
export function getChaptersBySubject(subjectId: string): Chapter[] {
  return chapters.filter(c => c.subjectId === subjectId);
}
```

---

## Data Relationships

```text
Curriculum
└── Class
    └── Subject
        └── Chapter
            └── Topic

Course
├── Subject (linked from curriculum)
├── Mapped Chapter (from curriculum)
└── Exclusive Chapter (course-specific)

Institute
├── Assigned Curricula
├── Assigned Courses
├── Batches
│   ├── Class (from curriculum)
│   ├── Teachers
│   └── Students
├── Timetable
│   └── Slots → Teachers, Subjects
└── Academic Plans
    └── Entries → Chapters
```

---

*Last Updated: January 2025*
