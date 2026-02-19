// Student Tests Data
// Comprehensive mock data for test listings

export type TestType = "teacher" | "grand_test" | "pyp";
export type TestStatus = "upcoming" | "live" | "attempted" | "missed";
export type ExamPattern = "jee_main" | "jee_advanced" | "neet" | "cbse" | "custom";

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
  hindi: "orange",
};

// Teacher-assigned tests (single subject)
export const teacherTests: StudentTest[] = [
  // ===================== PHYSICS (18 tests) =====================
  { id: "tt-p1", name: "Laws of Motion Quiz", type: "teacher", subject: "physics", totalQuestions: 25, totalMarks: 100, duration: 45, negativeMarking: true, negativeMarks: 1, status: "live", teacherName: "Mr. Verma", batchName: "Class 11-A" },
  { id: "tt-p2", name: "Electromagnetic Induction Unit Test", type: "teacher", subject: "physics", totalQuestions: 30, totalMarks: 120, duration: 60, negativeMarking: true, negativeMarks: 1, status: "live", teacherName: "Mr. Verma", batchName: "Class 11-A" },
  { id: "tt-p3", name: "Thermodynamics Unit Test", type: "teacher", subject: "physics", totalQuestions: 30, totalMarks: 120, duration: 60, negativeMarking: true, negativeMarks: 1, status: "upcoming", scheduledDate: "2026-02-22", scheduledTime: "10:00 AM", teacherName: "Mr. Verma", batchName: "Class 11-A" },
  { id: "tt-p4", name: "Wave Optics Practice", type: "teacher", subject: "physics", totalQuestions: 20, totalMarks: 80, duration: 40, negativeMarking: false, status: "upcoming", scheduledDate: "2026-02-25", scheduledTime: "11:00 AM", teacherName: "Dr. Saxena", batchName: "Class 11-A" },
  { id: "tt-p5", name: "Current Electricity Quiz", type: "teacher", subject: "physics", totalQuestions: 25, totalMarks: 100, duration: 45, negativeMarking: true, negativeMarks: 1, status: "upcoming", scheduledDate: "2026-03-01", scheduledTime: "09:00 AM", teacherName: "Mr. Verma", batchName: "Class 11-A" },
  { id: "tt-p6", name: "Rotational Mechanics Test", type: "teacher", subject: "physics", totalQuestions: 30, totalMarks: 120, duration: 60, negativeMarking: true, negativeMarks: 1, status: "upcoming", scheduledDate: "2026-03-05", scheduledTime: "10:00 AM", teacherName: "Dr. Saxena", batchName: "Class 11-A" },
  { id: "tt-p7", name: "Work & Energy Practice", type: "teacher", subject: "physics", totalQuestions: 20, totalMarks: 80, duration: 40, negativeMarking: false, status: "attempted", attemptedAt: "2026-02-18", score: 72, teacherName: "Mr. Verma", batchName: "Class 11-A" },
  { id: "tt-p8", name: "Gravitation Quiz", type: "teacher", subject: "physics", totalQuestions: 15, totalMarks: 60, duration: 30, negativeMarking: false, status: "attempted", attemptedAt: "2026-02-16", score: 54, teacherName: "Mr. Verma", batchName: "Class 11-A" },
  { id: "tt-p9", name: "Kinematics Chapter Test", type: "teacher", subject: "physics", totalQuestions: 30, totalMarks: 120, duration: 60, negativeMarking: true, negativeMarks: 1, status: "attempted", attemptedAt: "2026-02-14", score: 96, teacherName: "Dr. Saxena", batchName: "Class 11-A" },
  { id: "tt-p10", name: "Electrostatics Unit Test", type: "teacher", subject: "physics", totalQuestions: 25, totalMarks: 100, duration: 50, negativeMarking: true, negativeMarks: 1, status: "attempted", attemptedAt: "2026-02-10", score: 82, teacherName: "Mr. Verma", batchName: "Class 11-A" },
  { id: "tt-p11", name: "Fluid Mechanics Practice", type: "teacher", subject: "physics", totalQuestions: 20, totalMarks: 80, duration: 40, negativeMarking: false, status: "attempted", attemptedAt: "2026-02-07", score: 64, teacherName: "Dr. Saxena", batchName: "Class 11-A" },
  { id: "tt-p12", name: "Simple Harmonic Motion Test", type: "teacher", subject: "physics", totalQuestions: 25, totalMarks: 100, duration: 45, negativeMarking: true, negativeMarks: 1, status: "attempted", attemptedAt: "2026-02-03", score: 78, teacherName: "Mr. Verma", batchName: "Class 11-A" },
  { id: "tt-p13", name: "Magnetism & Matter Quiz", type: "teacher", subject: "physics", totalQuestions: 15, totalMarks: 60, duration: 30, negativeMarking: false, status: "attempted", attemptedAt: "2026-01-28", score: 51, teacherName: "Dr. Saxena", batchName: "Class 11-A" },
  { id: "tt-p14", name: "Nuclear Physics Practice", type: "teacher", subject: "physics", totalQuestions: 20, totalMarks: 80, duration: 40, negativeMarking: false, status: "attempted", attemptedAt: "2026-01-22", score: 68, teacherName: "Mr. Verma", batchName: "Class 11-A" },
  { id: "tt-p15", name: "Semiconductor Devices Test", type: "teacher", subject: "physics", totalQuestions: 20, totalMarks: 80, duration: 40, negativeMarking: true, negativeMarks: 1, status: "attempted", attemptedAt: "2026-01-15", score: 60, teacherName: "Dr. Saxena", batchName: "Class 11-A" },
  { id: "tt-p16", name: "Ray Optics Quiz", type: "teacher", subject: "physics", totalQuestions: 15, totalMarks: 60, duration: 25, negativeMarking: false, status: "missed", scheduledDate: "2026-01-10", scheduledTime: "10:00 AM", teacherName: "Mr. Verma", batchName: "Class 11-A" },
  { id: "tt-p17", name: "Units & Dimensions Test", type: "teacher", subject: "physics", totalQuestions: 20, totalMarks: 80, duration: 35, negativeMarking: false, status: "missed", scheduledDate: "2026-01-05", scheduledTime: "09:00 AM", teacherName: "Dr. Saxena", batchName: "Class 11-A" },
  { id: "tt-p18", name: "Vectors & Scalars Practice", type: "teacher", subject: "physics", totalQuestions: 15, totalMarks: 60, duration: 30, negativeMarking: false, status: "missed", scheduledDate: "2025-12-28", scheduledTime: "11:00 AM", teacherName: "Mr. Verma", batchName: "Class 11-A" },

  // ===================== CHEMISTRY (16 tests) =====================
  { id: "tt-c1", name: "Organic Chemistry Basics", type: "teacher", subject: "chemistry", totalQuestions: 30, totalMarks: 100, duration: 50, negativeMarking: true, negativeMarks: 1, status: "live", teacherName: "Mrs. Sharma", batchName: "Class 11-A" },
  { id: "tt-c2", name: "Coordination Compounds Quiz", type: "teacher", subject: "chemistry", totalQuestions: 20, totalMarks: 80, duration: 40, negativeMarking: true, negativeMarks: 1, status: "live", teacherName: "Mrs. Sharma", batchName: "Class 11-A" },
  { id: "tt-c3", name: "Periodic Table Test", type: "teacher", subject: "chemistry", totalQuestions: 25, totalMarks: 100, duration: 45, negativeMarking: true, negativeMarks: 1, status: "upcoming", scheduledDate: "2026-02-23", scheduledTime: "11:00 AM", teacherName: "Mrs. Sharma", batchName: "Class 11-A" },
  { id: "tt-c4", name: "Electrochemistry Unit Test", type: "teacher", subject: "chemistry", totalQuestions: 30, totalMarks: 120, duration: 60, negativeMarking: true, negativeMarks: 1, status: "upcoming", scheduledDate: "2026-02-27", scheduledTime: "10:00 AM", teacherName: "Dr. Patel", batchName: "Class 11-A" },
  { id: "tt-c5", name: "Thermochemistry Practice", type: "teacher", subject: "chemistry", totalQuestions: 20, totalMarks: 80, duration: 40, negativeMarking: false, status: "upcoming", scheduledDate: "2026-03-03", scheduledTime: "11:00 AM", teacherName: "Mrs. Sharma", batchName: "Class 11-A" },
  { id: "tt-c6", name: "Chemical Bonding Quiz", type: "teacher", subject: "chemistry", totalQuestions: 15, totalMarks: 60, duration: 30, negativeMarking: false, status: "attempted", attemptedAt: "2026-02-17", score: 54, teacherName: "Mrs. Sharma", batchName: "Class 11-A" },
  { id: "tt-c7", name: "Redox Reactions Test", type: "teacher", subject: "chemistry", totalQuestions: 25, totalMarks: 100, duration: 45, negativeMarking: true, negativeMarks: 1, status: "attempted", attemptedAt: "2026-02-13", score: 82, teacherName: "Dr. Patel", batchName: "Class 11-A" },
  { id: "tt-c8", name: "Aldehydes & Ketones Quiz", type: "teacher", subject: "chemistry", totalQuestions: 20, totalMarks: 80, duration: 40, negativeMarking: false, status: "attempted", attemptedAt: "2026-02-09", score: 68, teacherName: "Mrs. Sharma", batchName: "Class 11-A" },
  { id: "tt-c9", name: "Chemical Kinetics Practice", type: "teacher", subject: "chemistry", totalQuestions: 25, totalMarks: 100, duration: 50, negativeMarking: true, negativeMarks: 1, status: "attempted", attemptedAt: "2026-02-05", score: 76, teacherName: "Dr. Patel", batchName: "Class 11-A" },
  { id: "tt-c10", name: "Solutions & Colligative Properties", type: "teacher", subject: "chemistry", totalQuestions: 20, totalMarks: 80, duration: 40, negativeMarking: false, status: "attempted", attemptedAt: "2026-01-30", score: 62, teacherName: "Mrs. Sharma", batchName: "Class 11-A" },
  { id: "tt-c11", name: "Solid State Chemistry Test", type: "teacher", subject: "chemistry", totalQuestions: 20, totalMarks: 80, duration: 40, negativeMarking: true, negativeMarks: 1, status: "attempted", attemptedAt: "2026-01-24", score: 70, teacherName: "Dr. Patel", batchName: "Class 11-A" },
  { id: "tt-c12", name: "Hydrocarbons Unit Test", type: "teacher", subject: "chemistry", totalQuestions: 30, totalMarks: 120, duration: 60, negativeMarking: true, negativeMarks: 1, status: "attempted", attemptedAt: "2026-01-18", score: 96, teacherName: "Mrs. Sharma", batchName: "Class 11-A" },
  { id: "tt-c13", name: "Atomic Structure Quiz", type: "teacher", subject: "chemistry", totalQuestions: 15, totalMarks: 60, duration: 25, negativeMarking: false, status: "attempted", attemptedAt: "2026-01-12", score: 48, teacherName: "Dr. Patel", batchName: "Class 11-A" },
  { id: "tt-c14", name: "Mole Concept Test", type: "teacher", subject: "chemistry", totalQuestions: 20, totalMarks: 80, duration: 35, negativeMarking: false, status: "missed", scheduledDate: "2026-01-08", scheduledTime: "10:00 AM", teacherName: "Mrs. Sharma", batchName: "Class 11-A" },
  { id: "tt-c15", name: "Environmental Chemistry Quiz", type: "teacher", subject: "chemistry", totalQuestions: 15, totalMarks: 60, duration: 25, negativeMarking: false, status: "missed", scheduledDate: "2026-01-02", scheduledTime: "11:00 AM", teacherName: "Dr. Patel", batchName: "Class 11-A" },
  { id: "tt-c16", name: "States of Matter Practice", type: "teacher", subject: "chemistry", totalQuestions: 15, totalMarks: 60, duration: 30, negativeMarking: false, status: "missed", scheduledDate: "2025-12-26", scheduledTime: "10:00 AM", teacherName: "Mrs. Sharma", batchName: "Class 11-A" },

  // ===================== MATHEMATICS (17 tests) =====================
  { id: "tt-m1", name: "Definite Integrals Practice", type: "teacher", subject: "mathematics", totalQuestions: 25, totalMarks: 100, duration: 50, negativeMarking: true, negativeMarks: 1, status: "live", teacherName: "Mrs. Gupta", batchName: "Class 11-A" },
  { id: "tt-m2", name: "Quadratic Equations Test", type: "teacher", subject: "mathematics", totalQuestions: 30, totalMarks: 100, duration: 60, negativeMarking: true, negativeMarks: 1, status: "upcoming", scheduledDate: "2026-02-21", scheduledTime: "09:00 AM", teacherName: "Mrs. Gupta", batchName: "Class 11-A" },
  { id: "tt-m3", name: "Matrices & Determinants Quiz", type: "teacher", subject: "mathematics", totalQuestions: 20, totalMarks: 80, duration: 40, negativeMarking: false, status: "upcoming", scheduledDate: "2026-02-24", scheduledTime: "10:00 AM", teacherName: "Mr. Iyer", batchName: "Class 11-A" },
  { id: "tt-m4", name: "Probability Unit Test", type: "teacher", subject: "mathematics", totalQuestions: 25, totalMarks: 100, duration: 50, negativeMarking: true, negativeMarks: 1, status: "upcoming", scheduledDate: "2026-02-28", scheduledTime: "09:00 AM", teacherName: "Mrs. Gupta", batchName: "Class 11-A" },
  { id: "tt-m5", name: "Differential Equations Test", type: "teacher", subject: "mathematics", totalQuestions: 30, totalMarks: 120, duration: 60, negativeMarking: true, negativeMarks: 1, status: "upcoming", scheduledDate: "2026-03-04", scheduledTime: "10:00 AM", teacherName: "Mr. Iyer", batchName: "Class 11-A" },
  { id: "tt-m6", name: "Sequences & Series Practice", type: "teacher", subject: "mathematics", totalQuestions: 20, totalMarks: 80, duration: 40, negativeMarking: false, status: "upcoming", scheduledDate: "2026-03-08", scheduledTime: "11:00 AM", teacherName: "Mrs. Gupta", batchName: "Class 11-A" },
  { id: "tt-m7", name: "Trigonometry Practice", type: "teacher", subject: "mathematics", totalQuestions: 25, totalMarks: 100, duration: 50, negativeMarking: false, status: "attempted", attemptedAt: "2026-02-17", score: 88, teacherName: "Mrs. Gupta", batchName: "Class 11-A" },
  { id: "tt-m8", name: "Coordinate Geometry Test", type: "teacher", subject: "mathematics", totalQuestions: 30, totalMarks: 120, duration: 60, negativeMarking: true, negativeMarks: 1, status: "attempted", attemptedAt: "2026-02-12", score: 102, teacherName: "Mr. Iyer", batchName: "Class 11-A" },
  { id: "tt-m9", name: "Limits & Continuity Quiz", type: "teacher", subject: "mathematics", totalQuestions: 20, totalMarks: 80, duration: 35, negativeMarking: false, status: "attempted", attemptedAt: "2026-02-08", score: 72, teacherName: "Mrs. Gupta", batchName: "Class 11-A" },
  { id: "tt-m10", name: "Permutations & Combinations", type: "teacher", subject: "mathematics", totalQuestions: 20, totalMarks: 80, duration: 40, negativeMarking: true, negativeMarks: 1, status: "attempted", attemptedAt: "2026-02-04", score: 64, teacherName: "Mr. Iyer", batchName: "Class 11-A" },
  { id: "tt-m11", name: "Binomial Theorem Practice", type: "teacher", subject: "mathematics", totalQuestions: 15, totalMarks: 60, duration: 30, negativeMarking: false, status: "attempted", attemptedAt: "2026-01-29", score: 52, teacherName: "Mrs. Gupta", batchName: "Class 11-A" },
  { id: "tt-m12", name: "Complex Numbers Test", type: "teacher", subject: "mathematics", totalQuestions: 25, totalMarks: 100, duration: 45, negativeMarking: true, negativeMarks: 1, status: "attempted", attemptedAt: "2026-01-23", score: 84, teacherName: "Mr. Iyer", batchName: "Class 11-A" },
  { id: "tt-m13", name: "Sets & Relations Quiz", type: "teacher", subject: "mathematics", totalQuestions: 15, totalMarks: 60, duration: 25, negativeMarking: false, status: "attempted", attemptedAt: "2026-01-17", score: 54, teacherName: "Mrs. Gupta", batchName: "Class 11-A" },
  { id: "tt-m14", name: "Mathematical Induction Test", type: "teacher", subject: "mathematics", totalQuestions: 15, totalMarks: 60, duration: 30, negativeMarking: false, status: "attempted", attemptedAt: "2026-01-11", score: 48, teacherName: "Mr. Iyer", batchName: "Class 11-A" },
  { id: "tt-m15", name: "Calculus Fundamentals", type: "teacher", subject: "mathematics", totalQuestions: 20, totalMarks: 80, duration: 45, negativeMarking: true, negativeMarks: 1, status: "missed", scheduledDate: "2026-01-06", scheduledTime: "10:00 AM", teacherName: "Mrs. Gupta", batchName: "Class 11-A" },
  { id: "tt-m16", name: "Straight Lines Practice", type: "teacher", subject: "mathematics", totalQuestions: 15, totalMarks: 60, duration: 25, negativeMarking: false, status: "missed", scheduledDate: "2025-12-30", scheduledTime: "09:00 AM", teacherName: "Mr. Iyer", batchName: "Class 11-A" },
  { id: "tt-m17", name: "Statistics & Mean Deviation", type: "teacher", subject: "mathematics", totalQuestions: 15, totalMarks: 60, duration: 30, negativeMarking: false, status: "missed", scheduledDate: "2025-12-22", scheduledTime: "11:00 AM", teacherName: "Mrs. Gupta", batchName: "Class 11-A" },

  // ===================== BIOLOGY (15 tests) =====================
  { id: "tt-b1", name: "Human Physiology Unit Test", type: "teacher", subject: "biology", totalQuestions: 30, totalMarks: 120, duration: 60, negativeMarking: true, negativeMarks: 1, status: "live", teacherName: "Dr. Kumar", batchName: "Class 11-B" },
  { id: "tt-b2", name: "Cell Biology Quiz", type: "teacher", subject: "biology", totalQuestions: 25, totalMarks: 100, duration: 45, negativeMarking: true, negativeMarks: 1, status: "upcoming", scheduledDate: "2026-02-22", scheduledTime: "02:00 PM", teacherName: "Dr. Kumar", batchName: "Class 11-B" },
  { id: "tt-b3", name: "Plant Anatomy Test", type: "teacher", subject: "biology", totalQuestions: 20, totalMarks: 80, duration: 40, negativeMarking: false, status: "upcoming", scheduledDate: "2026-02-26", scheduledTime: "02:00 PM", teacherName: "Mrs. Reddy", batchName: "Class 11-B" },
  { id: "tt-b4", name: "Ecology & Environment Quiz", type: "teacher", subject: "biology", totalQuestions: 25, totalMarks: 100, duration: 45, negativeMarking: true, negativeMarks: 1, status: "upcoming", scheduledDate: "2026-03-02", scheduledTime: "02:00 PM", teacherName: "Dr. Kumar", batchName: "Class 11-B" },
  { id: "tt-b5", name: "Genetics Basics Test", type: "teacher", subject: "biology", totalQuestions: 20, totalMarks: 80, duration: 40, negativeMarking: false, status: "attempted", attemptedAt: "2026-02-16", score: 68, teacherName: "Dr. Kumar", batchName: "Class 11-B" },
  { id: "tt-b6", name: "Biomolecules Practice", type: "teacher", subject: "biology", totalQuestions: 25, totalMarks: 100, duration: 45, negativeMarking: true, negativeMarks: 1, status: "attempted", attemptedAt: "2026-02-11", score: 84, teacherName: "Mrs. Reddy", batchName: "Class 11-B" },
  { id: "tt-b7", name: "Animal Kingdom Quiz", type: "teacher", subject: "biology", totalQuestions: 20, totalMarks: 80, duration: 35, negativeMarking: false, status: "attempted", attemptedAt: "2026-02-06", score: 72, teacherName: "Dr. Kumar", batchName: "Class 11-B" },
  { id: "tt-b8", name: "Reproduction in Plants Test", type: "teacher", subject: "biology", totalQuestions: 25, totalMarks: 100, duration: 45, negativeMarking: true, negativeMarks: 1, status: "attempted", attemptedAt: "2026-02-01", score: 78, teacherName: "Mrs. Reddy", batchName: "Class 11-B" },
  { id: "tt-b9", name: "Photosynthesis Unit Test", type: "teacher", subject: "biology", totalQuestions: 30, totalMarks: 120, duration: 60, negativeMarking: true, negativeMarks: 1, status: "attempted", attemptedAt: "2026-01-26", score: 96, teacherName: "Dr. Kumar", batchName: "Class 11-B" },
  { id: "tt-b10", name: "Transport in Plants Quiz", type: "teacher", subject: "biology", totalQuestions: 15, totalMarks: 60, duration: 25, negativeMarking: false, status: "attempted", attemptedAt: "2026-01-20", score: 48, teacherName: "Mrs. Reddy", batchName: "Class 11-B" },
  { id: "tt-b11", name: "Cell Division Practice", type: "teacher", subject: "biology", totalQuestions: 20, totalMarks: 80, duration: 40, negativeMarking: false, status: "attempted", attemptedAt: "2026-01-14", score: 64, teacherName: "Dr. Kumar", batchName: "Class 11-B" },
  { id: "tt-b12", name: "Morphology of Plants Test", type: "teacher", subject: "biology", totalQuestions: 20, totalMarks: 80, duration: 40, negativeMarking: true, negativeMarks: 1, status: "attempted", attemptedAt: "2026-01-08", score: 60, teacherName: "Mrs. Reddy", batchName: "Class 11-B" },
  { id: "tt-b13", name: "Biological Classification Quiz", type: "teacher", subject: "biology", totalQuestions: 15, totalMarks: 60, duration: 25, negativeMarking: false, status: "missed", scheduledDate: "2026-01-03", scheduledTime: "02:00 PM", teacherName: "Dr. Kumar", batchName: "Class 11-B" },
  { id: "tt-b14", name: "Mineral Nutrition Test", type: "teacher", subject: "biology", totalQuestions: 20, totalMarks: 80, duration: 35, negativeMarking: false, status: "missed", scheduledDate: "2025-12-27", scheduledTime: "02:00 PM", teacherName: "Mrs. Reddy", batchName: "Class 11-B" },
  { id: "tt-b15", name: "Plant Growth & Development", type: "teacher", subject: "biology", totalQuestions: 15, totalMarks: 60, duration: 30, negativeMarking: false, status: "missed", scheduledDate: "2025-12-20", scheduledTime: "02:00 PM", teacherName: "Dr. Kumar", batchName: "Class 11-B" },
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
  {
    id: "cbse-math-demo",
    name: "CBSE Class 12 Mathematics — 2024",
    type: "grand_test",
    subjects: ["mathematics"],
    pattern: "cbse",
    totalQuestions: 38,
    totalMarks: 80,
    duration: 180,
    negativeMarking: false,
    status: "live",
    scheduledDate: "2026-02-19",
    scheduledTime: "10:00 AM",
  },
  {
    id: "cbse-hindi-demo",
    name: "CBSE कक्षा 10 हिंदी (ब) — 2024",
    type: "grand_test",
    subjects: ["hindi"],
    pattern: "cbse",
    totalQuestions: 35,
    totalMarks: 80,
    duration: 180,
    negativeMarking: false,
    status: "live",
    scheduledDate: "2026-02-19",
    scheduledTime: "02:00 PM",
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
  cbse: {
    label: "CBSE Board",
    shortLabel: "CBSE",
    colorKey: "orange",
    icon: "GraduationCap",
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
    hindi: "हिंदी",
  };
  return names[subject.toLowerCase()] || subject;
};
