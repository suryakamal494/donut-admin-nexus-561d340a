// Student Tests Data
// Comprehensive mock data for test listings

export type TestType = "teacher" | "grand_test" | "pyp";
export type TestStatus = "upcoming" | "live" | "attempted" | "missed";
export type ExamPattern = "jee_main" | "jee_advanced" | "neet" | "custom";

export interface StudentTest {
  id: string;
  name: string;
  type: TestType;
  subject?: string; // For teacher tests (single subject)
  subjects?: string[]; // For grand tests (multi-subject)
  pattern?: ExamPattern;
  totalQuestions: number;
  totalMarks: number;
  duration: number; // minutes
  negativeMarking: boolean;
  negativeMarks?: number;
  status: TestStatus;
  scheduledDate?: string;
  scheduledTime?: string;
  teacherName?: string; // For teacher tests
  batchName?: string;
  attemptedAt?: string;
  score?: number;
  percentile?: number;
  rank?: number;
  totalAttempts?: number;
  year?: number; // For PYPs
  session?: string; // For PYPs (Jan, Apr, etc.)
}

// Subject color keys for consistent branding
export const subjectColorMap: Record<string, string> = {
  physics: "purple",
  chemistry: "green",
  mathematics: "blue",
  math: "blue",
  biology: "red",
  botany: "emerald",
  zoology: "rose",
  english: "amber",
  cs: "cyan",
};

// Teacher-assigned tests (single subject)
export const teacherTests: StudentTest[] = [
  // Physics Tests
  {
    id: "tt-1",
    name: "Laws of Motion Quiz",
    type: "teacher",
    subject: "physics",
    totalQuestions: 25,
    totalMarks: 100,
    duration: 45,
    negativeMarking: true,
    negativeMarks: 1,
    status: "live",
    teacherName: "Mr. Verma",
    batchName: "Class 11-A",
  },
  {
    id: "tt-2",
    name: "Thermodynamics Unit Test",
    type: "teacher",
    subject: "physics",
    totalQuestions: 30,
    totalMarks: 120,
    duration: 60,
    negativeMarking: true,
    negativeMarks: 1,
    status: "upcoming",
    scheduledDate: "2026-01-12",
    scheduledTime: "10:00 AM",
    teacherName: "Mr. Verma",
    batchName: "Class 11-A",
  },
  {
    id: "tt-3",
    name: "Work & Energy Practice",
    type: "teacher",
    subject: "physics",
    totalQuestions: 20,
    totalMarks: 80,
    duration: 40,
    negativeMarking: false,
    status: "attempted",
    attemptedAt: "2026-01-08",
    score: 72,
    teacherName: "Mr. Verma",
    batchName: "Class 11-A",
  },
  // Chemistry Tests
  {
    id: "tt-4",
    name: "Organic Chemistry Basics",
    type: "teacher",
    subject: "chemistry",
    totalQuestions: 30,
    totalMarks: 100,
    duration: 50,
    negativeMarking: true,
    negativeMarks: 1,
    status: "live",
    teacherName: "Mrs. Sharma",
    batchName: "Class 11-A",
  },
  {
    id: "tt-5",
    name: "Periodic Table Test",
    type: "teacher",
    subject: "chemistry",
    totalQuestions: 25,
    totalMarks: 100,
    duration: 45,
    negativeMarking: true,
    negativeMarks: 1,
    status: "upcoming",
    scheduledDate: "2026-01-14",
    scheduledTime: "11:00 AM",
    teacherName: "Mrs. Sharma",
    batchName: "Class 11-A",
  },
  {
    id: "tt-6",
    name: "Chemical Bonding Quiz",
    type: "teacher",
    subject: "chemistry",
    totalQuestions: 15,
    totalMarks: 60,
    duration: 30,
    negativeMarking: false,
    status: "attempted",
    attemptedAt: "2026-01-05",
    score: 54,
    teacherName: "Mrs. Sharma",
    batchName: "Class 11-A",
  },
  // Mathematics Tests
  {
    id: "tt-7",
    name: "Quadratic Equations Test",
    type: "teacher",
    subject: "mathematics",
    totalQuestions: 30,
    totalMarks: 100,
    duration: 60,
    negativeMarking: true,
    negativeMarks: 1,
    status: "upcoming",
    scheduledDate: "2026-01-13",
    scheduledTime: "09:00 AM",
    teacherName: "Mrs. Gupta",
    batchName: "Class 11-A",
  },
  {
    id: "tt-8",
    name: "Trigonometry Practice",
    type: "teacher",
    subject: "mathematics",
    totalQuestions: 25,
    totalMarks: 100,
    duration: 50,
    negativeMarking: false,
    status: "attempted",
    attemptedAt: "2026-01-06",
    score: 88,
    teacherName: "Mrs. Gupta",
    batchName: "Class 11-A",
  },
  {
    id: "tt-9",
    name: "Calculus Fundamentals",
    type: "teacher",
    subject: "mathematics",
    totalQuestions: 20,
    totalMarks: 80,
    duration: 45,
    negativeMarking: true,
    negativeMarks: 1,
    status: "missed",
    scheduledDate: "2026-01-02",
    scheduledTime: "10:00 AM",
    teacherName: "Mrs. Gupta",
    batchName: "Class 11-A",
  },
  // Biology Tests
  {
    id: "tt-10",
    name: "Cell Biology Quiz",
    type: "teacher",
    subject: "biology",
    totalQuestions: 25,
    totalMarks: 100,
    duration: 45,
    negativeMarking: true,
    negativeMarks: 1,
    status: "upcoming",
    scheduledDate: "2026-01-15",
    scheduledTime: "02:00 PM",
    teacherName: "Dr. Kumar",
    batchName: "Class 11-B",
  },
  {
    id: "tt-11",
    name: "Genetics Basics Test",
    type: "teacher",
    subject: "biology",
    totalQuestions: 20,
    totalMarks: 80,
    duration: 40,
    negativeMarking: false,
    status: "attempted",
    attemptedAt: "2026-01-04",
    score: 68,
    teacherName: "Dr. Kumar",
    batchName: "Class 11-B",
  },
];

// Grand Tests (multi-subject, institute-level)
export const grandTests: StudentTest[] = [
  {
    id: "jee-advanced-demo",
    name: "JEE Advanced 2024 — Paper 1",
    type: "grand_test",
    subjects: ["physics", "chemistry", "mathematics"],
    pattern: "jee_advanced",
    totalQuestions: 81,
    totalMarks: 285,
    duration: 180,
    negativeMarking: true,
    negativeMarks: 2,
    status: "live",
    scheduledDate: "2026-02-19",
    scheduledTime: "09:00 AM",
  },
  {
    id: "neet-demo",
    name: "NEET 2024 — Full Mock Test",
    type: "grand_test",
    subjects: ["physics", "chemistry", "botany", "zoology"],
    pattern: "neet",
    totalQuestions: 160,
    totalMarks: 640,
    duration: 200,
    negativeMarking: true,
    negativeMarks: 1,
    status: "live",
    scheduledDate: "2026-02-19",
    scheduledTime: "02:00 PM",
  },
  {
    id: "gt-1",
    name: "Grand Test #18",
    type: "grand_test",
    subjects: ["physics", "chemistry", "mathematics"],
    pattern: "jee_main",
    totalQuestions: 90,
    totalMarks: 300,
    duration: 180,
    negativeMarking: true,
    negativeMarks: 1,
    status: "live",
    scheduledDate: "2026-01-11",
    scheduledTime: "10:00 AM",
  },
  {
    id: "gt-2",
    name: "Grand Test #19",
    type: "grand_test",
    subjects: ["physics", "chemistry", "mathematics"],
    pattern: "jee_main",
    totalQuestions: 90,
    totalMarks: 300,
    duration: 180,
    negativeMarking: true,
    negativeMarks: 1,
    status: "upcoming",
    scheduledDate: "2026-01-18",
    scheduledTime: "10:00 AM",
  },
  {
    id: "gt-3",
    name: "Full Syllabus Test #5",
    type: "grand_test",
    subjects: ["physics", "chemistry", "mathematics"],
    pattern: "jee_advanced",
    totalQuestions: 54,
    totalMarks: 186,
    duration: 180,
    negativeMarking: true,
    negativeMarks: 2,
    status: "upcoming",
    scheduledDate: "2026-01-25",
    scheduledTime: "09:00 AM",
  },
  {
    id: "gt-4",
    name: "Grand Test #17",
    type: "grand_test",
    subjects: ["physics", "chemistry", "mathematics"],
    pattern: "jee_main",
    totalQuestions: 90,
    totalMarks: 300,
    duration: 180,
    negativeMarking: true,
    negativeMarks: 1,
    status: "attempted",
    attemptedAt: "2026-01-04",
    score: 245,
    percentile: 94.5,
    rank: 127,
    totalAttempts: 2450,
  },
  {
    id: "gt-5",
    name: "Full Syllabus Test #4",
    type: "grand_test",
    subjects: ["physics", "chemistry", "mathematics"],
    pattern: "jee_advanced",
    totalQuestions: 54,
    totalMarks: 186,
    duration: 180,
    negativeMarking: true,
    negativeMarks: 2,
    status: "attempted",
    attemptedAt: "2025-12-28",
    score: 142,
    percentile: 89.2,
    rank: 245,
    totalAttempts: 2180,
  },
  {
    id: "gt-6",
    name: "NEET Mock Test #12",
    type: "grand_test",
    subjects: ["physics", "chemistry", "biology"],
    pattern: "neet",
    totalQuestions: 200,
    totalMarks: 720,
    duration: 200,
    negativeMarking: true,
    negativeMarks: 1,
    status: "upcoming",
    scheduledDate: "2026-01-20",
    scheduledTime: "02:00 PM",
  },
  {
    id: "gt-7",
    name: "NEET Mock Test #11",
    type: "grand_test",
    subjects: ["physics", "chemistry", "biology"],
    pattern: "neet",
    totalQuestions: 200,
    totalMarks: 720,
    duration: 200,
    negativeMarking: true,
    negativeMarks: 1,
    status: "attempted",
    attemptedAt: "2026-01-06",
    score: 612,
    percentile: 96.8,
    rank: 42,
    totalAttempts: 1320,
  },
];

// Previous Year Papers
export const previousYearPapers: StudentTest[] = [
  {
    id: "pyp-1",
    name: "JEE Main 2025",
    type: "pyp",
    subjects: ["physics", "chemistry", "mathematics"],
    pattern: "jee_main",
    year: 2025,
    session: "January - Shift 1",
    totalQuestions: 90,
    totalMarks: 300,
    duration: 180,
    negativeMarking: true,
    negativeMarks: 1,
    status: "attempted",
    attemptedAt: "2026-01-02",
    score: 268,
    percentile: 98.5,
  },
  {
    id: "pyp-2",
    name: "JEE Main 2025",
    type: "pyp",
    subjects: ["physics", "chemistry", "mathematics"],
    pattern: "jee_main",
    year: 2025,
    session: "January - Shift 2",
    totalQuestions: 90,
    totalMarks: 300,
    duration: 180,
    negativeMarking: true,
    negativeMarks: 1,
    status: "upcoming",
  },
  {
    id: "pyp-3",
    name: "JEE Main 2024",
    type: "pyp",
    subjects: ["physics", "chemistry", "mathematics"],
    pattern: "jee_main",
    year: 2024,
    session: "April - Shift 1",
    totalQuestions: 90,
    totalMarks: 300,
    duration: 180,
    negativeMarking: true,
    negativeMarks: 1,
    status: "upcoming",
  },
  {
    id: "pyp-4",
    name: "JEE Advanced 2025",
    type: "pyp",
    subjects: ["physics", "chemistry", "mathematics"],
    pattern: "jee_advanced",
    year: 2025,
    session: "Paper 1",
    totalQuestions: 54,
    totalMarks: 186,
    duration: 180,
    negativeMarking: true,
    negativeMarks: 2,
    status: "upcoming",
  },
  {
    id: "pyp-5",
    name: "JEE Advanced 2024",
    type: "pyp",
    subjects: ["physics", "chemistry", "mathematics"],
    pattern: "jee_advanced",
    year: 2024,
    session: "Paper 1",
    totalQuestions: 54,
    totalMarks: 186,
    duration: 180,
    negativeMarking: true,
    negativeMarks: 2,
    status: "attempted",
    attemptedAt: "2025-12-20",
    score: 156,
    percentile: 91.3,
  },
  {
    id: "pyp-6",
    name: "NEET 2025",
    type: "pyp",
    subjects: ["physics", "chemistry", "biology"],
    pattern: "neet",
    year: 2025,
    session: "May Session",
    totalQuestions: 200,
    totalMarks: 720,
    duration: 200,
    negativeMarking: true,
    negativeMarks: 1,
    status: "upcoming",
  },
  {
    id: "pyp-7",
    name: "NEET 2024",
    type: "pyp",
    subjects: ["physics", "chemistry", "biology"],
    pattern: "neet",
    year: 2024,
    session: "May Session",
    totalQuestions: 200,
    totalMarks: 720,
    duration: 200,
    negativeMarking: true,
    negativeMarks: 1,
    status: "attempted",
    attemptedAt: "2025-11-15",
    score: 645,
    percentile: 97.2,
  },
];

// Exam pattern configurations
export const examPatternConfig: Record<
  ExamPattern,
  { label: string; shortLabel: string; colorKey: string; icon: string }
> = {
  jee_main: {
    label: "JEE Main",
    shortLabel: "Main",
    colorKey: "blue",
    icon: "Target",
  },
  jee_advanced: {
    label: "JEE Advanced",
    shortLabel: "Adv",
    colorKey: "purple",
    icon: "Zap",
  },
  neet: {
    label: "NEET",
    shortLabel: "NEET",
    colorKey: "green",
    icon: "Heart",
  },
  custom: {
    label: "Custom",
    shortLabel: "Custom",
    colorKey: "amber",
    icon: "Settings",
  },
};

// Helper: Group teacher tests by subject
export const getTestsBySubject = (tests: StudentTest[]) => {
  const grouped: Record<string, StudentTest[]> = {};

  tests.forEach((test) => {
    if (test.subject) {
      if (!grouped[test.subject]) {
        grouped[test.subject] = [];
      }
      grouped[test.subject].push(test);
    }
  });

  return grouped;
};

// Helper: Get tests by status
export const getTestsByStatus = (tests: StudentTest[], status: TestStatus) => {
  return tests.filter((test) => test.status === status);
};

// Helper: Get live tests count
export const getLiveTestsCount = (tests: StudentTest[]) => {
  return tests.filter((test) => test.status === "live").length;
};

// Helper: Format duration
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours} hr`;
};

// Helper: Get subject display name
export const getSubjectDisplayName = (subject: string): string => {
  const names: Record<string, string> = {
    physics: "Physics",
    chemistry: "Chemistry",
    mathematics: "Mathematics",
    math: "Mathematics",
    biology: "Biology",
    english: "English",
    cs: "Computer Science",
  };
  return names[subject.toLowerCase()] || subject;
};
