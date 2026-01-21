// ============================================
// EXAM PATTERNS DATA - Configuration Templates for Exams
// ============================================

export type QuestionType = 
  | 'single_correct'
  | 'multiple_correct'
  | 'integer'
  | 'numerical'
  | 'assertion_reasoning'
  | 'paragraph'
  | 'match_the_following'
  | 'fill_in_blanks'
  | 'short_answer'
  | 'long_answer'
  | 'true_false';

export const questionTypeLabels: Record<QuestionType, string> = {
  single_correct: 'Single Correct',
  multiple_correct: 'Multiple Correct',
  integer: 'Integer Type',
  numerical: 'Numerical',
  assertion_reasoning: 'Assertion-Reasoning',
  paragraph: 'Paragraph Based',
  match_the_following: 'Match the Following',
  fill_in_blanks: 'Fill in the Blanks',
  short_answer: 'Short Answer',
  long_answer: 'Long Answer',
  true_false: 'True/False',
};

export const questionTypeIcons: Record<QuestionType, string> = {
  single_correct: 'circle-dot',
  multiple_correct: 'check-square',
  integer: 'hash',
  numerical: 'calculator',
  assertion_reasoning: 'scale',
  paragraph: 'file-text',
  match_the_following: 'link',
  fill_in_blanks: 'text-cursor-input',
  short_answer: 'text',
  long_answer: 'file-text',
  true_false: 'toggle-left',
};

export interface ExamSection {
  id: string;
  name: string;
  subjectId: string | null; // null for subject-agnostic sections
  questionCount: number;
  questionTypes: QuestionType[];
  isOptional: boolean;
  attemptLimit: number | null; // e.g., "Answer any 5 out of 10"
  marksPerQuestion: number;
  negativeMarks: number;
  timeLimit: number | null; // section-specific time in minutes
  partialMarkingEnabled: boolean;
  partialMarkingPercent: number; // e.g., 25% for partial credit
}

export interface ExamPattern {
  id: string;
  name: string;
  description: string;
  isSystemPreset: boolean; // false for institute-created patterns
  
  // Subject Configuration
  hasFixedSubjects: boolean;
  subjects: string[]; // empty if generic pattern
  
  // Duration
  totalDuration: number; // minutes
  hasSectionWiseTime: boolean;
  
  // Sections Configuration
  sections: ExamSection[];
  
  // Marking Configuration
  hasUniformMarking: boolean;
  defaultMarksPerQuestion: number; // if uniform
  hasNegativeMarking: boolean;
  defaultNegativeMarks: number;
  hasPartialMarking: boolean;
  
  // Real Exam UI Configuration
  realExamUIAvailable: boolean; // true if this pattern has a specialized real-exam interface
  realExamUIId: string | null; // e.g., "jee-main-nta", "jee-advanced-iit", "neet-nta"
  realExamUILabel: string | null; // User-friendly label e.g., "NTA JEE Main Interface"
  
  // Metadata
  category: 'competitive' | 'board' | 'custom';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ============================================
// SYSTEM PRESET PATTERNS
// ============================================

const jeeMainPattern: ExamPattern = {
  id: 'jee-main-2025',
  name: 'JEE Main 2025',
  description: 'Standard JEE Main pattern with Physics, Chemistry, and Mathematics. 90 questions, 300 marks, 3 hours.',
  isSystemPreset: true,
  hasFixedSubjects: true,
  subjects: ['physics', 'chemistry', 'mathematics'],
  totalDuration: 180,
  hasSectionWiseTime: false,
  realExamUIAvailable: true,
  realExamUIId: 'jee-main-nta',
  realExamUILabel: 'NTA JEE Main Interface',
  sections: [
    // Physics Section A - MCQ
    {
      id: 'phy-sec-a',
      name: 'Physics Section A',
      subjectId: 'physics',
      questionCount: 20,
      questionTypes: ['single_correct'],
      isOptional: false,
      attemptLimit: null,
      marksPerQuestion: 4,
      negativeMarks: 1,
      timeLimit: null,
      partialMarkingEnabled: false,
      partialMarkingPercent: 0,
    },
    // Physics Section B - Numerical
    {
      id: 'phy-sec-b',
      name: 'Physics Section B',
      subjectId: 'physics',
      questionCount: 10,
      questionTypes: ['numerical'],
      isOptional: true,
      attemptLimit: 5,
      marksPerQuestion: 4,
      negativeMarks: 0,
      timeLimit: null,
      partialMarkingEnabled: false,
      partialMarkingPercent: 0,
    },
    // Chemistry Section A - MCQ
    {
      id: 'chem-sec-a',
      name: 'Chemistry Section A',
      subjectId: 'chemistry',
      questionCount: 20,
      questionTypes: ['single_correct'],
      isOptional: false,
      attemptLimit: null,
      marksPerQuestion: 4,
      negativeMarks: 1,
      timeLimit: null,
      partialMarkingEnabled: false,
      partialMarkingPercent: 0,
    },
    // Chemistry Section B - Numerical
    {
      id: 'chem-sec-b',
      name: 'Chemistry Section B',
      subjectId: 'chemistry',
      questionCount: 10,
      questionTypes: ['numerical'],
      isOptional: true,
      attemptLimit: 5,
      marksPerQuestion: 4,
      negativeMarks: 0,
      timeLimit: null,
      partialMarkingEnabled: false,
      partialMarkingPercent: 0,
    },
    // Mathematics Section A - MCQ
    {
      id: 'math-sec-a',
      name: 'Mathematics Section A',
      subjectId: 'mathematics',
      questionCount: 20,
      questionTypes: ['single_correct'],
      isOptional: false,
      attemptLimit: null,
      marksPerQuestion: 4,
      negativeMarks: 1,
      timeLimit: null,
      partialMarkingEnabled: false,
      partialMarkingPercent: 0,
    },
    // Mathematics Section B - Numerical
    {
      id: 'math-sec-b',
      name: 'Mathematics Section B',
      subjectId: 'mathematics',
      questionCount: 10,
      questionTypes: ['numerical'],
      isOptional: true,
      attemptLimit: 5,
      marksPerQuestion: 4,
      negativeMarks: 0,
      timeLimit: null,
      partialMarkingEnabled: false,
      partialMarkingPercent: 0,
    },
  ],
  hasUniformMarking: true,
  defaultMarksPerQuestion: 4,
  hasNegativeMarking: true,
  defaultNegativeMarks: 1,
  hasPartialMarking: false,
  category: 'competitive',
  tags: ['JEE', 'Engineering', 'National'],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const jeeAdvancedPattern: ExamPattern = {
  id: 'jee-advanced-2025',
  name: 'JEE Advanced 2025',
  description: 'JEE Advanced pattern with complex question types including multiple correct, integer, and paragraph-based questions.',
  isSystemPreset: true,
  hasFixedSubjects: true,
  subjects: ['physics', 'chemistry', 'mathematics'],
  totalDuration: 180,
  hasSectionWiseTime: false,
  realExamUIAvailable: true,
  realExamUIId: 'jee-advanced-iit',
  realExamUILabel: 'IIT JEE Advanced Interface',
  sections: [
    // Physics Section 1 - Single Correct
    {
      id: 'adv-phy-1',
      name: 'Physics Section 1',
      subjectId: 'physics',
      questionCount: 6,
      questionTypes: ['single_correct'],
      isOptional: false,
      attemptLimit: null,
      marksPerQuestion: 3,
      negativeMarks: 1,
      timeLimit: null,
      partialMarkingEnabled: false,
      partialMarkingPercent: 0,
    },
    // Physics Section 2 - Multiple Correct
    {
      id: 'adv-phy-2',
      name: 'Physics Section 2',
      subjectId: 'physics',
      questionCount: 6,
      questionTypes: ['multiple_correct'],
      isOptional: false,
      attemptLimit: null,
      marksPerQuestion: 4,
      negativeMarks: 2,
      timeLimit: null,
      partialMarkingEnabled: true,
      partialMarkingPercent: 25,
    },
    // Physics Section 3 - Integer Type
    {
      id: 'adv-phy-3',
      name: 'Physics Section 3',
      subjectId: 'physics',
      questionCount: 6,
      questionTypes: ['integer'],
      isOptional: false,
      attemptLimit: null,
      marksPerQuestion: 3,
      negativeMarks: 0,
      timeLimit: null,
      partialMarkingEnabled: false,
      partialMarkingPercent: 0,
    },
    // Physics Section 4 - Paragraph
    {
      id: 'adv-phy-4',
      name: 'Physics Section 4',
      subjectId: 'physics',
      questionCount: 4,
      questionTypes: ['paragraph'],
      isOptional: false,
      attemptLimit: null,
      marksPerQuestion: 3,
      negativeMarks: 1,
      timeLimit: null,
      partialMarkingEnabled: false,
      partialMarkingPercent: 0,
    },
    // Chemistry Section 1 - Single Correct
    {
      id: 'adv-chem-1',
      name: 'Chemistry Section 1',
      subjectId: 'chemistry',
      questionCount: 6,
      questionTypes: ['single_correct'],
      isOptional: false,
      attemptLimit: null,
      marksPerQuestion: 3,
      negativeMarks: 1,
      timeLimit: null,
      partialMarkingEnabled: false,
      partialMarkingPercent: 0,
    },
    // Chemistry Section 2 - Multiple Correct
    {
      id: 'adv-chem-2',
      name: 'Chemistry Section 2',
      subjectId: 'chemistry',
      questionCount: 6,
      questionTypes: ['multiple_correct'],
      isOptional: false,
      attemptLimit: null,
      marksPerQuestion: 4,
      negativeMarks: 2,
      timeLimit: null,
      partialMarkingEnabled: true,
      partialMarkingPercent: 25,
    },
    // Chemistry Section 3 - Integer Type
    {
      id: 'adv-chem-3',
      name: 'Chemistry Section 3',
      subjectId: 'chemistry',
      questionCount: 6,
      questionTypes: ['integer'],
      isOptional: false,
      attemptLimit: null,
      marksPerQuestion: 3,
      negativeMarks: 0,
      timeLimit: null,
      partialMarkingEnabled: false,
      partialMarkingPercent: 0,
    },
    // Chemistry Section 4 - Match the Following
    {
      id: 'adv-chem-4',
      name: 'Chemistry Section 4',
      subjectId: 'chemistry',
      questionCount: 4,
      questionTypes: ['match_the_following'],
      isOptional: false,
      attemptLimit: null,
      marksPerQuestion: 3,
      negativeMarks: 1,
      timeLimit: null,
      partialMarkingEnabled: true,
      partialMarkingPercent: 25,
    },
    // Mathematics Section 1 - Single Correct
    {
      id: 'adv-math-1',
      name: 'Mathematics Section 1',
      subjectId: 'mathematics',
      questionCount: 6,
      questionTypes: ['single_correct'],
      isOptional: false,
      attemptLimit: null,
      marksPerQuestion: 3,
      negativeMarks: 1,
      timeLimit: null,
      partialMarkingEnabled: false,
      partialMarkingPercent: 0,
    },
    // Mathematics Section 2 - Multiple Correct
    {
      id: 'adv-math-2',
      name: 'Mathematics Section 2',
      subjectId: 'mathematics',
      questionCount: 6,
      questionTypes: ['multiple_correct'],
      isOptional: false,
      attemptLimit: null,
      marksPerQuestion: 4,
      negativeMarks: 2,
      timeLimit: null,
      partialMarkingEnabled: true,
      partialMarkingPercent: 25,
    },
    // Mathematics Section 3 - Integer Type
    {
      id: 'adv-math-3',
      name: 'Mathematics Section 3',
      subjectId: 'mathematics',
      questionCount: 6,
      questionTypes: ['integer'],
      isOptional: false,
      attemptLimit: null,
      marksPerQuestion: 3,
      negativeMarks: 0,
      timeLimit: null,
      partialMarkingEnabled: false,
      partialMarkingPercent: 0,
    },
    // Mathematics Section 4 - Paragraph
    {
      id: 'adv-math-4',
      name: 'Mathematics Section 4',
      subjectId: 'mathematics',
      questionCount: 4,
      questionTypes: ['paragraph'],
      isOptional: false,
      attemptLimit: null,
      marksPerQuestion: 3,
      negativeMarks: 1,
      timeLimit: null,
      partialMarkingEnabled: false,
      partialMarkingPercent: 0,
    },
  ],
  hasUniformMarking: false,
  defaultMarksPerQuestion: 3,
  hasNegativeMarking: true,
  defaultNegativeMarks: 1,
  hasPartialMarking: true,
  category: 'competitive',
  tags: ['JEE', 'Engineering', 'Advanced', 'National'],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const neetPattern: ExamPattern = {
  id: 'neet-2025',
  name: 'NEET 2025',
  description: 'NEET pattern for medical entrance with Physics, Chemistry, and Biology. 200 questions, 720 marks, 3 hours 20 minutes.',
  isSystemPreset: true,
  hasFixedSubjects: true,
  subjects: ['physics', 'chemistry', 'biology'],
  totalDuration: 200,
  hasSectionWiseTime: false,
  realExamUIAvailable: true,
  realExamUIId: 'neet-nta',
  realExamUILabel: 'NTA NEET Interface',
  sections: [
    // Physics Section A
    {
      id: 'neet-phy-a',
      name: 'Physics Section A',
      subjectId: 'physics',
      questionCount: 35,
      questionTypes: ['single_correct'],
      isOptional: false,
      attemptLimit: null,
      marksPerQuestion: 4,
      negativeMarks: 1,
      timeLimit: null,
      partialMarkingEnabled: false,
      partialMarkingPercent: 0,
    },
    // Physics Section B
    {
      id: 'neet-phy-b',
      name: 'Physics Section B',
      subjectId: 'physics',
      questionCount: 15,
      questionTypes: ['single_correct'],
      isOptional: true,
      attemptLimit: 10,
      marksPerQuestion: 4,
      negativeMarks: 1,
      timeLimit: null,
      partialMarkingEnabled: false,
      partialMarkingPercent: 0,
    },
    // Chemistry Section A
    {
      id: 'neet-chem-a',
      name: 'Chemistry Section A',
      subjectId: 'chemistry',
      questionCount: 35,
      questionTypes: ['single_correct'],
      isOptional: false,
      attemptLimit: null,
      marksPerQuestion: 4,
      negativeMarks: 1,
      timeLimit: null,
      partialMarkingEnabled: false,
      partialMarkingPercent: 0,
    },
    // Chemistry Section B
    {
      id: 'neet-chem-b',
      name: 'Chemistry Section B',
      subjectId: 'chemistry',
      questionCount: 15,
      questionTypes: ['single_correct'],
      isOptional: true,
      attemptLimit: 10,
      marksPerQuestion: 4,
      negativeMarks: 1,
      timeLimit: null,
      partialMarkingEnabled: false,
      partialMarkingPercent: 0,
    },
    // Biology Section A (Botany + Zoology)
    {
      id: 'neet-bio-a',
      name: 'Biology Section A',
      subjectId: 'biology',
      questionCount: 70,
      questionTypes: ['single_correct'],
      isOptional: false,
      attemptLimit: null,
      marksPerQuestion: 4,
      negativeMarks: 1,
      timeLimit: null,
      partialMarkingEnabled: false,
      partialMarkingPercent: 0,
    },
    // Biology Section B
    {
      id: 'neet-bio-b',
      name: 'Biology Section B',
      subjectId: 'biology',
      questionCount: 30,
      questionTypes: ['single_correct'],
      isOptional: true,
      attemptLimit: 20,
      marksPerQuestion: 4,
      negativeMarks: 1,
      timeLimit: null,
      partialMarkingEnabled: false,
      partialMarkingPercent: 0,
    },
  ],
  hasUniformMarking: true,
  defaultMarksPerQuestion: 4,
  hasNegativeMarking: true,
  defaultNegativeMarks: 1,
  hasPartialMarking: false,
  category: 'competitive',
  tags: ['NEET', 'Medical', 'National'],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const cbse10thPattern: ExamPattern = {
  id: 'cbse-10th-board',
  name: 'CBSE Class 10 Board',
  description: 'Standard CBSE Class 10 board exam pattern. Generic pattern - select subjects during exam creation.',
  isSystemPreset: true,
  hasFixedSubjects: false,
  subjects: [],
  totalDuration: 180,
  hasSectionWiseTime: false,
  realExamUIAvailable: false,
  realExamUIId: null,
  realExamUILabel: null,
  sections: [
    {
      id: 'cbse10-sec-a',
      name: 'Section A - Objective',
      subjectId: null,
      questionCount: 20,
      questionTypes: ['single_correct', 'fill_in_blanks', 'true_false'],
      isOptional: false,
      attemptLimit: null,
      marksPerQuestion: 1,
      negativeMarks: 0,
      timeLimit: null,
      partialMarkingEnabled: false,
      partialMarkingPercent: 0,
    },
    {
      id: 'cbse10-sec-b',
      name: 'Section B - Short Answer I',
      subjectId: null,
      questionCount: 6,
      questionTypes: ['short_answer'],
      isOptional: false,
      attemptLimit: null,
      marksPerQuestion: 2,
      negativeMarks: 0,
      timeLimit: null,
      partialMarkingEnabled: false,
      partialMarkingPercent: 0,
    },
    {
      id: 'cbse10-sec-c',
      name: 'Section C - Short Answer II',
      subjectId: null,
      questionCount: 7,
      questionTypes: ['short_answer'],
      isOptional: false,
      attemptLimit: null,
      marksPerQuestion: 3,
      negativeMarks: 0,
      timeLimit: null,
      partialMarkingEnabled: false,
      partialMarkingPercent: 0,
    },
    {
      id: 'cbse10-sec-d',
      name: 'Section D - Long Answer',
      subjectId: null,
      questionCount: 4,
      questionTypes: ['long_answer'],
      isOptional: false,
      attemptLimit: null,
      marksPerQuestion: 5,
      negativeMarks: 0,
      timeLimit: null,
      partialMarkingEnabled: false,
      partialMarkingPercent: 0,
    },
    {
      id: 'cbse10-sec-e',
      name: 'Section E - Case Study',
      subjectId: null,
      questionCount: 3,
      questionTypes: ['paragraph'],
      isOptional: true,
      attemptLimit: 2,
      marksPerQuestion: 4,
      negativeMarks: 0,
      timeLimit: null,
      partialMarkingEnabled: false,
      partialMarkingPercent: 0,
    },
  ],
  hasUniformMarking: false,
  defaultMarksPerQuestion: 1,
  hasNegativeMarking: false,
  defaultNegativeMarks: 0,
  hasPartialMarking: false,
  category: 'board',
  tags: ['CBSE', 'Board', 'Class 10'],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const cbse12thPattern: ExamPattern = {
  id: 'cbse-12th-board',
  name: 'CBSE Class 12 Board',
  description: 'Standard CBSE Class 12 board exam pattern. Generic pattern - select subjects during exam creation.',
  isSystemPreset: true,
  hasFixedSubjects: false,
  subjects: [],
  totalDuration: 180,
  hasSectionWiseTime: false,
  realExamUIAvailable: false,
  realExamUIId: null,
  realExamUILabel: null,
  sections: [
    {
      id: 'cbse12-sec-a',
      name: 'Section A - MCQ',
      subjectId: null,
      questionCount: 16,
      questionTypes: ['single_correct'],
      isOptional: false,
      attemptLimit: null,
      marksPerQuestion: 1,
      negativeMarks: 0,
      timeLimit: null,
      partialMarkingEnabled: false,
      partialMarkingPercent: 0,
    },
    {
      id: 'cbse12-sec-b',
      name: 'Section B - Assertion Reasoning',
      subjectId: null,
      questionCount: 4,
      questionTypes: ['assertion_reasoning'],
      isOptional: false,
      attemptLimit: null,
      marksPerQuestion: 1,
      negativeMarks: 0,
      timeLimit: null,
      partialMarkingEnabled: false,
      partialMarkingPercent: 0,
    },
    {
      id: 'cbse12-sec-c',
      name: 'Section C - Short Answer',
      subjectId: null,
      questionCount: 9,
      questionTypes: ['short_answer'],
      isOptional: true,
      attemptLimit: 7,
      marksPerQuestion: 2,
      negativeMarks: 0,
      timeLimit: null,
      partialMarkingEnabled: false,
      partialMarkingPercent: 0,
    },
    {
      id: 'cbse12-sec-d',
      name: 'Section D - Long Answer I',
      subjectId: null,
      questionCount: 4,
      questionTypes: ['long_answer'],
      isOptional: true,
      attemptLimit: 3,
      marksPerQuestion: 3,
      negativeMarks: 0,
      timeLimit: null,
      partialMarkingEnabled: false,
      partialMarkingPercent: 0,
    },
    {
      id: 'cbse12-sec-e',
      name: 'Section E - Long Answer II',
      subjectId: null,
      questionCount: 3,
      questionTypes: ['long_answer'],
      isOptional: false,
      attemptLimit: null,
      marksPerQuestion: 5,
      negativeMarks: 0,
      timeLimit: null,
      partialMarkingEnabled: false,
      partialMarkingPercent: 0,
    },
    {
      id: 'cbse12-sec-f',
      name: 'Section F - Case Study',
      subjectId: null,
      questionCount: 3,
      questionTypes: ['paragraph'],
      isOptional: false,
      attemptLimit: null,
      marksPerQuestion: 4,
      negativeMarks: 0,
      timeLimit: null,
      partialMarkingEnabled: false,
      partialMarkingPercent: 0,
    },
  ],
  hasUniformMarking: false,
  defaultMarksPerQuestion: 1,
  hasNegativeMarking: false,
  defaultNegativeMarks: 0,
  hasPartialMarking: false,
  category: 'board',
  tags: ['CBSE', 'Board', 'Class 12'],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

// ============================================
// SAMPLE INSTITUTE PATTERNS
// ============================================

const weeklyPhysicsTest: ExamPattern = {
  id: 'weekly-physics-test',
  name: 'Weekly Physics Test',
  description: 'Quick weekly assessment for Physics with MCQs and numerical problems.',
  isSystemPreset: false,
  hasFixedSubjects: true,
  subjects: ['physics'],
  totalDuration: 45,
  hasSectionWiseTime: false,
  realExamUIAvailable: false,
  realExamUIId: null,
  realExamUILabel: null,
  sections: [
    {
      id: 'weekly-phy-mcq',
      name: 'MCQ Section',
      subjectId: 'physics',
      questionCount: 15,
      questionTypes: ['single_correct'],
      isOptional: false,
      attemptLimit: null,
      marksPerQuestion: 2,
      negativeMarks: 0.5,
      timeLimit: null,
      partialMarkingEnabled: false,
      partialMarkingPercent: 0,
    },
    {
      id: 'weekly-phy-num',
      name: 'Numerical Section',
      subjectId: 'physics',
      questionCount: 5,
      questionTypes: ['numerical', 'integer'],
      isOptional: false,
      attemptLimit: null,
      marksPerQuestion: 4,
      negativeMarks: 0,
      timeLimit: null,
      partialMarkingEnabled: false,
      partialMarkingPercent: 0,
    },
  ],
  hasUniformMarking: false,
  defaultMarksPerQuestion: 2,
  hasNegativeMarking: true,
  defaultNegativeMarks: 0.5,
  hasPartialMarking: false,
  category: 'custom',
  tags: ['Weekly', 'Physics', 'Quick Test'],
  createdAt: '2024-06-15T10:00:00Z',
  updatedAt: '2024-06-15T10:00:00Z',
};

const monthlyAssessment: ExamPattern = {
  id: 'monthly-assessment',
  name: 'Monthly Assessment',
  description: 'Comprehensive monthly test covering all subjects. Generic pattern for any subject combination.',
  isSystemPreset: false,
  hasFixedSubjects: false,
  subjects: [],
  totalDuration: 120,
  hasSectionWiseTime: false,
  realExamUIAvailable: false,
  realExamUIId: null,
  realExamUILabel: null,
  sections: [
    {
      id: 'monthly-sec-a',
      name: 'Section A - Objective',
      subjectId: null,
      questionCount: 30,
      questionTypes: ['single_correct', 'true_false'],
      isOptional: false,
      attemptLimit: null,
      marksPerQuestion: 1,
      negativeMarks: 0.25,
      timeLimit: null,
      partialMarkingEnabled: false,
      partialMarkingPercent: 0,
    },
    {
      id: 'monthly-sec-b',
      name: 'Section B - Short Answer',
      subjectId: null,
      questionCount: 10,
      questionTypes: ['short_answer', 'fill_in_blanks'],
      isOptional: false,
      attemptLimit: null,
      marksPerQuestion: 3,
      negativeMarks: 0,
      timeLimit: null,
      partialMarkingEnabled: false,
      partialMarkingPercent: 0,
    },
    {
      id: 'monthly-sec-c',
      name: 'Section C - Descriptive',
      subjectId: null,
      questionCount: 5,
      questionTypes: ['long_answer'],
      isOptional: true,
      attemptLimit: 4,
      marksPerQuestion: 5,
      negativeMarks: 0,
      timeLimit: null,
      partialMarkingEnabled: false,
      partialMarkingPercent: 0,
    },
  ],
  hasUniformMarking: false,
  defaultMarksPerQuestion: 1,
  hasNegativeMarking: true,
  defaultNegativeMarks: 0.25,
  hasPartialMarking: false,
  category: 'custom',
  tags: ['Monthly', 'Assessment', 'All Subjects'],
  createdAt: '2024-06-20T14:00:00Z',
  updatedAt: '2024-06-20T14:00:00Z',
};

const chapterTest: ExamPattern = {
  id: 'chapter-test',
  name: 'Chapter Test',
  description: 'Quick chapter completion test with mixed question types. Simple and fast.',
  isSystemPreset: false,
  hasFixedSubjects: false,
  subjects: [],
  totalDuration: 30,
  hasSectionWiseTime: false,
  realExamUIAvailable: false,
  realExamUIId: null,
  realExamUILabel: null,
  sections: [
    {
      id: 'chapter-mcq',
      name: 'Multiple Choice',
      subjectId: null,
      questionCount: 10,
      questionTypes: ['single_correct'],
      isOptional: false,
      attemptLimit: null,
      marksPerQuestion: 1,
      negativeMarks: 0,
      timeLimit: null,
      partialMarkingEnabled: false,
      partialMarkingPercent: 0,
    },
    {
      id: 'chapter-short',
      name: 'Short Questions',
      subjectId: null,
      questionCount: 5,
      questionTypes: ['short_answer', 'fill_in_blanks'],
      isOptional: false,
      attemptLimit: null,
      marksPerQuestion: 2,
      negativeMarks: 0,
      timeLimit: null,
      partialMarkingEnabled: false,
      partialMarkingPercent: 0,
    },
  ],
  hasUniformMarking: false,
  defaultMarksPerQuestion: 1,
  hasNegativeMarking: false,
  defaultNegativeMarks: 0,
  hasPartialMarking: false,
  category: 'custom',
  tags: ['Chapter', 'Quick', 'Test'],
  createdAt: '2024-07-01T09:00:00Z',
  updatedAt: '2024-07-01T09:00:00Z',
};

// ============================================
// EXPORTED DATA
// ============================================

export const systemPresetPatterns: ExamPattern[] = [
  jeeMainPattern,
  jeeAdvancedPattern,
  neetPattern,
  cbse10thPattern,
  cbse12thPattern,
];

export const institutePatterns: ExamPattern[] = [
  weeklyPhysicsTest,
  monthlyAssessment,
  chapterTest,
];

export const allExamPatterns: ExamPattern[] = [
  ...systemPresetPatterns,
  ...institutePatterns,
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getPatternById = (id: string): ExamPattern | undefined => {
  return allExamPatterns.find(p => p.id === id);
};

export const getPatternsByCategory = (category: ExamPattern['category']): ExamPattern[] => {
  return allExamPatterns.filter(p => p.category === category);
};

export const getPatternTotalQuestions = (pattern: ExamPattern): number => {
  return pattern.sections.reduce((total, section) => {
    if (section.isOptional && section.attemptLimit) {
      return total + section.attemptLimit;
    }
    return total + section.questionCount;
  }, 0);
};

export const getPatternTotalMarks = (pattern: ExamPattern): number => {
  return pattern.sections.reduce((total, section) => {
    const questionCount = section.isOptional && section.attemptLimit 
      ? section.attemptLimit 
      : section.questionCount;
    return total + (questionCount * section.marksPerQuestion);
  }, 0);
};

export const getPatternSubjectSections = (pattern: ExamPattern, subjectId: string): ExamSection[] => {
  return pattern.sections.filter(s => s.subjectId === subjectId);
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours} hr`;
  return `${hours} hr ${mins} min`;
};
