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
  physics: "purple", chemistry: "green", mathematics: "blue",
  math: "blue", biology: "red", english: "amber", cs: "cyan",
  botany: "emerald", zoology: "pink", hindi: "orange",
  sanskrit: "indigo", "social-science": "slate", history: "brown",
  geography: "teal", civics: "sky", economics: "emerald",
  science: "lime", evs: "teal", art: "fuchsia", pe: "orange",
  accountancy: "stone", business: "zinc", ai: "violet",
  informatics: "sky", "home-science": "rose",
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

  // ===================== ENGLISH (5 tests) =====================
  { id: "tt-e1", name: "Grammar & Composition Test", type: "teacher", subject: "english", totalQuestions: 25, totalMarks: 100, duration: 50, negativeMarking: false, status: "live", teacherName: "Ms. D'Souza", batchName: "Class 11-A" },
  { id: "tt-e2", name: "Literature: Poetry Analysis", type: "teacher", subject: "english", totalQuestions: 20, totalMarks: 80, duration: 45, negativeMarking: false, status: "upcoming", scheduledDate: "2026-02-24", scheduledTime: "11:00 AM", teacherName: "Ms. D'Souza", batchName: "Class 11-A" },
  { id: "tt-e3", name: "Comprehension & Writing Skills", type: "teacher", subject: "english", totalQuestions: 15, totalMarks: 60, duration: 40, negativeMarking: false, status: "attempted", attemptedAt: "2026-02-15", score: 52, teacherName: "Ms. D'Souza", batchName: "Class 11-A" },
  { id: "tt-e4", name: "Prose: Hornbill Unit Test", type: "teacher", subject: "english", totalQuestions: 20, totalMarks: 80, duration: 45, negativeMarking: false, status: "attempted", attemptedAt: "2026-02-08", score: 68, teacherName: "Ms. D'Souza", batchName: "Class 11-A" },
  { id: "tt-e5", name: "Vocabulary & Idioms Quiz", type: "teacher", subject: "english", totalQuestions: 30, totalMarks: 60, duration: 25, negativeMarking: false, status: "missed", scheduledDate: "2026-01-20", scheduledTime: "10:00 AM", teacherName: "Ms. D'Souza", batchName: "Class 11-A" },

  // ===================== COMPUTER SCIENCE (5 tests) =====================
  { id: "tt-cs1", name: "Python Functions & Modules", type: "teacher", subject: "cs", totalQuestions: 25, totalMarks: 100, duration: 50, negativeMarking: false, status: "live", teacherName: "Mr. Nair", batchName: "Class 11-A" },
  { id: "tt-cs2", name: "Data Structures Quiz", type: "teacher", subject: "cs", totalQuestions: 20, totalMarks: 80, duration: 40, negativeMarking: false, status: "upcoming", scheduledDate: "2026-02-25", scheduledTime: "10:00 AM", teacherName: "Mr. Nair", batchName: "Class 11-A" },
  { id: "tt-cs3", name: "SQL & Database Management", type: "teacher", subject: "cs", totalQuestions: 30, totalMarks: 100, duration: 50, negativeMarking: false, status: "attempted", attemptedAt: "2026-02-12", score: 82, teacherName: "Mr. Nair", batchName: "Class 11-A" },
  { id: "tt-cs4", name: "OOP Concepts Test", type: "teacher", subject: "cs", totalQuestions: 20, totalMarks: 80, duration: 40, negativeMarking: false, status: "attempted", attemptedAt: "2026-02-05", score: 72, teacherName: "Mr. Nair", batchName: "Class 11-A" },
  { id: "tt-cs5", name: "Boolean Algebra Practice", type: "teacher", subject: "cs", totalQuestions: 15, totalMarks: 60, duration: 30, negativeMarking: false, status: "missed", scheduledDate: "2026-01-15", scheduledTime: "11:00 AM", teacherName: "Mr. Nair", batchName: "Class 11-A" },

  // ===================== HINDI (5 tests) =====================
  { id: "tt-hi1", name: "हिंदी व्याकरण परीक्षा", type: "teacher", subject: "hindi", totalQuestions: 25, totalMarks: 100, duration: 50, negativeMarking: false, status: "live", teacherName: "Mrs. Joshi", batchName: "Class 10-A" },
  { id: "tt-hi2", name: "गद्य खंड इकाई परीक्षा", type: "teacher", subject: "hindi", totalQuestions: 20, totalMarks: 80, duration: 45, negativeMarking: false, status: "upcoming", scheduledDate: "2026-02-25", scheduledTime: "10:00 AM", teacherName: "Mrs. Joshi", batchName: "Class 10-A" },
  { id: "tt-hi3", name: "पद्य खंड अभ्यास", type: "teacher", subject: "hindi", totalQuestions: 15, totalMarks: 60, duration: 35, negativeMarking: false, status: "attempted", attemptedAt: "2026-02-14", score: 48, teacherName: "Mrs. Joshi", batchName: "Class 10-A" },
  { id: "tt-hi4", name: "लेखन कौशल परीक्षा", type: "teacher", subject: "hindi", totalQuestions: 10, totalMarks: 40, duration: 40, negativeMarking: false, status: "attempted", attemptedAt: "2026-02-06", score: 34, teacherName: "Mrs. Joshi", batchName: "Class 10-A" },
  { id: "tt-hi5", name: "अपठित गद्यांश प्रश्नोत्तरी", type: "teacher", subject: "hindi", totalQuestions: 20, totalMarks: 80, duration: 40, negativeMarking: false, status: "missed", scheduledDate: "2026-01-18", scheduledTime: "09:00 AM", teacherName: "Mrs. Joshi", batchName: "Class 10-A" },

  // ===================== SANSKRIT (4 tests) =====================
  { id: "tt-sk1", name: "संस्कृत व्याकरणम् परीक्षा", type: "teacher", subject: "sanskrit", totalQuestions: 20, totalMarks: 80, duration: 40, negativeMarking: false, status: "upcoming", scheduledDate: "2026-02-26", scheduledTime: "10:00 AM", teacherName: "Pandit Shastri", batchName: "Class 10-A" },
  { id: "tt-sk2", name: "श्लोक एवं गद्य", type: "teacher", subject: "sanskrit", totalQuestions: 15, totalMarks: 60, duration: 35, negativeMarking: false, status: "attempted", attemptedAt: "2026-02-10", score: 42, teacherName: "Pandit Shastri", batchName: "Class 10-A" },
  { id: "tt-sk3", name: "अनुवाद अभ्यास", type: "teacher", subject: "sanskrit", totalQuestions: 10, totalMarks: 40, duration: 30, negativeMarking: false, status: "attempted", attemptedAt: "2026-01-28", score: 32, teacherName: "Pandit Shastri", batchName: "Class 10-A" },
  { id: "tt-sk4", name: "रूप एवं धातु प्रश्नोत्तरी", type: "teacher", subject: "sanskrit", totalQuestions: 20, totalMarks: 80, duration: 40, negativeMarking: false, status: "missed", scheduledDate: "2026-01-12", scheduledTime: "11:00 AM", teacherName: "Pandit Shastri", batchName: "Class 10-A" },

  // ===================== SOCIAL SCIENCE (5 tests) =====================
  { id: "tt-ss1", name: "India & Contemporary World", type: "teacher", subject: "social-science", totalQuestions: 30, totalMarks: 80, duration: 60, negativeMarking: false, status: "live", teacherName: "Mr. Mehta", batchName: "Class 10-B" },
  { id: "tt-ss2", name: "Democratic Politics Unit Test", type: "teacher", subject: "social-science", totalQuestions: 25, totalMarks: 80, duration: 50, negativeMarking: false, status: "upcoming", scheduledDate: "2026-02-27", scheduledTime: "10:00 AM", teacherName: "Mr. Mehta", batchName: "Class 10-B" },
  { id: "tt-ss3", name: "Geography: Resources Quiz", type: "teacher", subject: "social-science", totalQuestions: 20, totalMarks: 60, duration: 40, negativeMarking: false, status: "attempted", attemptedAt: "2026-02-13", score: 48, teacherName: "Mr. Mehta", batchName: "Class 10-B" },
  { id: "tt-ss4", name: "Economics: Development Test", type: "teacher", subject: "social-science", totalQuestions: 20, totalMarks: 60, duration: 40, negativeMarking: false, status: "attempted", attemptedAt: "2026-02-04", score: 52, teacherName: "Mr. Mehta", batchName: "Class 10-B" },
  { id: "tt-ss5", name: "Nationalism in India Quiz", type: "teacher", subject: "social-science", totalQuestions: 15, totalMarks: 40, duration: 30, negativeMarking: false, status: "missed", scheduledDate: "2026-01-22", scheduledTime: "10:00 AM", teacherName: "Mr. Mehta", batchName: "Class 10-B" },

  // ===================== HISTORY (4 tests) =====================
  { id: "tt-hs1", name: "French Revolution Test", type: "teacher", subject: "history", totalQuestions: 25, totalMarks: 80, duration: 50, negativeMarking: false, status: "upcoming", scheduledDate: "2026-02-28", scheduledTime: "11:00 AM", teacherName: "Dr. Bhat", batchName: "Class 11-C" },
  { id: "tt-hs2", name: "Industrial Revolution Quiz", type: "teacher", subject: "history", totalQuestions: 20, totalMarks: 60, duration: 40, negativeMarking: false, status: "attempted", attemptedAt: "2026-02-11", score: 46, teacherName: "Dr. Bhat", batchName: "Class 11-C" },
  { id: "tt-hs3", name: "World War I & II Analysis", type: "teacher", subject: "history", totalQuestions: 30, totalMarks: 100, duration: 60, negativeMarking: false, status: "attempted", attemptedAt: "2026-01-30", score: 78, teacherName: "Dr. Bhat", batchName: "Class 11-C" },
  { id: "tt-hs4", name: "Ancient Civilizations Test", type: "teacher", subject: "history", totalQuestions: 20, totalMarks: 60, duration: 40, negativeMarking: false, status: "missed", scheduledDate: "2026-01-14", scheduledTime: "10:00 AM", teacherName: "Dr. Bhat", batchName: "Class 11-C" },

  // ===================== GEOGRAPHY (4 tests) =====================
  { id: "tt-ge1", name: "Map Skills & Cartography", type: "teacher", subject: "geography", totalQuestions: 20, totalMarks: 80, duration: 45, negativeMarking: false, status: "live", teacherName: "Mrs. Rao", batchName: "Class 11-C" },
  { id: "tt-ge2", name: "Climate & Weather Patterns", type: "teacher", subject: "geography", totalQuestions: 25, totalMarks: 80, duration: 50, negativeMarking: false, status: "upcoming", scheduledDate: "2026-03-01", scheduledTime: "10:00 AM", teacherName: "Mrs. Rao", batchName: "Class 11-C" },
  { id: "tt-ge3", name: "Landforms & Processes Quiz", type: "teacher", subject: "geography", totalQuestions: 20, totalMarks: 60, duration: 40, negativeMarking: false, status: "attempted", attemptedAt: "2026-02-09", score: 54, teacherName: "Mrs. Rao", batchName: "Class 11-C" },
  { id: "tt-ge4", name: "Population & Settlement", type: "teacher", subject: "geography", totalQuestions: 15, totalMarks: 50, duration: 30, negativeMarking: false, status: "missed", scheduledDate: "2026-01-16", scheduledTime: "11:00 AM", teacherName: "Mrs. Rao", batchName: "Class 11-C" },

  // ===================== POLITICAL SCIENCE / CIVICS (4 tests) =====================
  { id: "tt-ci1", name: "Indian Constitution Basics", type: "teacher", subject: "civics", totalQuestions: 25, totalMarks: 80, duration: 50, negativeMarking: false, status: "upcoming", scheduledDate: "2026-02-26", scheduledTime: "02:00 PM", teacherName: "Mr. Kapoor", batchName: "Class 11-C" },
  { id: "tt-ci2", name: "Fundamental Rights Quiz", type: "teacher", subject: "civics", totalQuestions: 20, totalMarks: 60, duration: 35, negativeMarking: false, status: "attempted", attemptedAt: "2026-02-12", score: 48, teacherName: "Mr. Kapoor", batchName: "Class 11-C" },
  { id: "tt-ci3", name: "Parliament & Legislature Test", type: "teacher", subject: "civics", totalQuestions: 25, totalMarks: 80, duration: 50, negativeMarking: false, status: "attempted", attemptedAt: "2026-01-29", score: 64, teacherName: "Mr. Kapoor", batchName: "Class 11-C" },
  { id: "tt-ci4", name: "Judiciary System Practice", type: "teacher", subject: "civics", totalQuestions: 15, totalMarks: 50, duration: 30, negativeMarking: false, status: "missed", scheduledDate: "2026-01-10", scheduledTime: "02:00 PM", teacherName: "Mr. Kapoor", batchName: "Class 11-C" },

  // ===================== ECONOMICS (4 tests) =====================
  { id: "tt-ec1", name: "Microeconomics: Demand & Supply", type: "teacher", subject: "economics", totalQuestions: 25, totalMarks: 100, duration: 50, negativeMarking: false, status: "live", teacherName: "Mr. Agarwal", batchName: "Class 12-A" },
  { id: "tt-ec2", name: "National Income Accounting", type: "teacher", subject: "economics", totalQuestions: 20, totalMarks: 80, duration: 45, negativeMarking: false, status: "upcoming", scheduledDate: "2026-03-02", scheduledTime: "10:00 AM", teacherName: "Mr. Agarwal", batchName: "Class 12-A" },
  { id: "tt-ec3", name: "Money & Banking Quiz", type: "teacher", subject: "economics", totalQuestions: 20, totalMarks: 60, duration: 35, negativeMarking: false, status: "attempted", attemptedAt: "2026-02-10", score: 52, teacherName: "Mr. Agarwal", batchName: "Class 12-A" },
  { id: "tt-ec4", name: "Government Budget Analysis", type: "teacher", subject: "economics", totalQuestions: 15, totalMarks: 50, duration: 30, negativeMarking: false, status: "missed", scheduledDate: "2026-01-20", scheduledTime: "10:00 AM", teacherName: "Mr. Agarwal", batchName: "Class 12-A" },

  // ===================== SCIENCE (Combined, Classes 6-10) (4 tests) =====================
  { id: "tt-sc1", name: "Light & Sound Unit Test", type: "teacher", subject: "science", totalQuestions: 30, totalMarks: 80, duration: 50, negativeMarking: false, status: "upcoming", scheduledDate: "2026-02-27", scheduledTime: "10:00 AM", teacherName: "Mrs. Pillai", batchName: "Class 8-A" },
  { id: "tt-sc2", name: "Chemical Reactions Basics", type: "teacher", subject: "science", totalQuestions: 25, totalMarks: 80, duration: 45, negativeMarking: false, status: "attempted", attemptedAt: "2026-02-14", score: 62, teacherName: "Mrs. Pillai", batchName: "Class 8-A" },
  { id: "tt-sc3", name: "Human Body Systems Quiz", type: "teacher", subject: "science", totalQuestions: 20, totalMarks: 60, duration: 40, negativeMarking: false, status: "attempted", attemptedAt: "2026-02-03", score: 50, teacherName: "Mrs. Pillai", batchName: "Class 8-A" },
  { id: "tt-sc4", name: "Force & Motion Practice", type: "teacher", subject: "science", totalQuestions: 15, totalMarks: 50, duration: 30, negativeMarking: false, status: "missed", scheduledDate: "2026-01-18", scheduledTime: "10:00 AM", teacherName: "Mrs. Pillai", batchName: "Class 8-A" },

  // ===================== ZOOLOGY (NEET) (4 tests) =====================
  { id: "tt-zo1", name: "Animal Diversity Quiz", type: "teacher", subject: "zoology", totalQuestions: 25, totalMarks: 100, duration: 50, negativeMarking: true, negativeMarks: 1, status: "upcoming", scheduledDate: "2026-02-28", scheduledTime: "02:00 PM", teacherName: "Dr. Srinivasan", batchName: "NEET Batch" },
  { id: "tt-zo2", name: "Human Reproduction Test", type: "teacher", subject: "zoology", totalQuestions: 20, totalMarks: 80, duration: 45, negativeMarking: true, negativeMarks: 1, status: "attempted", attemptedAt: "2026-02-15", score: 68, teacherName: "Dr. Srinivasan", batchName: "NEET Batch" },
  { id: "tt-zo3", name: "Animal Physiology Practice", type: "teacher", subject: "zoology", totalQuestions: 30, totalMarks: 120, duration: 60, negativeMarking: true, negativeMarks: 1, status: "attempted", attemptedAt: "2026-02-02", score: 88, teacherName: "Dr. Srinivasan", batchName: "NEET Batch" },
  { id: "tt-zo4", name: "Genetics & Evolution Quiz", type: "teacher", subject: "zoology", totalQuestions: 20, totalMarks: 80, duration: 40, negativeMarking: false, status: "missed", scheduledDate: "2026-01-22", scheduledTime: "02:00 PM", teacherName: "Dr. Srinivasan", batchName: "NEET Batch" },

  // ===================== BOTANY (NEET) (4 tests) =====================
  { id: "tt-bt1", name: "Plant Morphology Test", type: "teacher", subject: "botany", totalQuestions: 25, totalMarks: 100, duration: 50, negativeMarking: true, negativeMarks: 1, status: "live", teacherName: "Dr. Iyer", batchName: "NEET Batch" },
  { id: "tt-bt2", name: "Plant Physiology Quiz", type: "teacher", subject: "botany", totalQuestions: 20, totalMarks: 80, duration: 45, negativeMarking: true, negativeMarks: 1, status: "upcoming", scheduledDate: "2026-03-03", scheduledTime: "10:00 AM", teacherName: "Dr. Iyer", batchName: "NEET Batch" },
  { id: "tt-bt3", name: "Cell Biology & Biomolecules", type: "teacher", subject: "botany", totalQuestions: 30, totalMarks: 120, duration: 60, negativeMarking: true, negativeMarks: 1, status: "attempted", attemptedAt: "2026-02-08", score: 96, teacherName: "Dr. Iyer", batchName: "NEET Batch" },
  { id: "tt-bt4", name: "Ecology & Biodiversity Quiz", type: "teacher", subject: "botany", totalQuestions: 15, totalMarks: 60, duration: 30, negativeMarking: false, status: "missed", scheduledDate: "2026-01-25", scheduledTime: "10:00 AM", teacherName: "Dr. Iyer", batchName: "NEET Batch" },

  // ===================== EVS (4 tests) =====================
  { id: "tt-ev1", name: "Biodiversity & Conservation", type: "teacher", subject: "evs", totalQuestions: 20, totalMarks: 60, duration: 40, negativeMarking: false, status: "upcoming", scheduledDate: "2026-02-28", scheduledTime: "10:00 AM", teacherName: "Mrs. Desai", batchName: "Class 7-A" },
  { id: "tt-ev2", name: "Pollution & Waste Management", type: "teacher", subject: "evs", totalQuestions: 15, totalMarks: 50, duration: 30, negativeMarking: false, status: "attempted", attemptedAt: "2026-02-12", score: 42, teacherName: "Mrs. Desai", batchName: "Class 7-A" },
  { id: "tt-ev3", name: "Natural Resources Quiz", type: "teacher", subject: "evs", totalQuestions: 20, totalMarks: 60, duration: 35, negativeMarking: false, status: "attempted", attemptedAt: "2026-01-30", score: 50, teacherName: "Mrs. Desai", batchName: "Class 7-A" },
  { id: "tt-ev4", name: "Ecosystems & Food Chains", type: "teacher", subject: "evs", totalQuestions: 15, totalMarks: 40, duration: 25, negativeMarking: false, status: "missed", scheduledDate: "2026-01-15", scheduledTime: "10:00 AM", teacherName: "Mrs. Desai", batchName: "Class 7-A" },

  // ===================== FINE ARTS (3 tests) =====================
  { id: "tt-ar1", name: "Indian Art History Quiz", type: "teacher", subject: "art", totalQuestions: 20, totalMarks: 60, duration: 40, negativeMarking: false, status: "upcoming", scheduledDate: "2026-03-01", scheduledTime: "02:00 PM", teacherName: "Ms. Sen", batchName: "Class 11-D" },
  { id: "tt-ar2", name: "Art Appreciation Test", type: "teacher", subject: "art", totalQuestions: 15, totalMarks: 50, duration: 30, negativeMarking: false, status: "attempted", attemptedAt: "2026-02-10", score: 44, teacherName: "Ms. Sen", batchName: "Class 11-D" },
  { id: "tt-ar3", name: "Colour Theory & Composition", type: "teacher", subject: "art", totalQuestions: 15, totalMarks: 40, duration: 25, negativeMarking: false, status: "missed", scheduledDate: "2026-01-20", scheduledTime: "02:00 PM", teacherName: "Ms. Sen", batchName: "Class 11-D" },

  // ===================== PHYSICAL EDUCATION (3 tests) =====================
  { id: "tt-pe1", name: "Sports & Physical Fitness", type: "teacher", subject: "pe", totalQuestions: 25, totalMarks: 70, duration: 40, negativeMarking: false, status: "upcoming", scheduledDate: "2026-03-02", scheduledTime: "09:00 AM", teacherName: "Coach Singh", batchName: "Class 12-B" },
  { id: "tt-pe2", name: "Yoga & Health Education", type: "teacher", subject: "pe", totalQuestions: 20, totalMarks: 50, duration: 30, negativeMarking: false, status: "attempted", attemptedAt: "2026-02-08", score: 42, teacherName: "Coach Singh", batchName: "Class 12-B" },
  { id: "tt-pe3", name: "Anatomy & Kinesiology Quiz", type: "teacher", subject: "pe", totalQuestions: 15, totalMarks: 40, duration: 25, negativeMarking: false, status: "missed", scheduledDate: "2026-01-18", scheduledTime: "09:00 AM", teacherName: "Coach Singh", batchName: "Class 12-B" },

  // ===================== ACCOUNTANCY (4 tests) =====================
  { id: "tt-ac1", name: "Financial Statements Test", type: "teacher", subject: "accountancy", totalQuestions: 25, totalMarks: 100, duration: 60, negativeMarking: false, status: "live", teacherName: "Mr. Choudhary", batchName: "Class 12-Commerce" },
  { id: "tt-ac2", name: "Partnership Accounts Quiz", type: "teacher", subject: "accountancy", totalQuestions: 20, totalMarks: 80, duration: 50, negativeMarking: false, status: "upcoming", scheduledDate: "2026-03-01", scheduledTime: "10:00 AM", teacherName: "Mr. Choudhary", batchName: "Class 12-Commerce" },
  { id: "tt-ac3", name: "Company Accounts Practice", type: "teacher", subject: "accountancy", totalQuestions: 20, totalMarks: 80, duration: 50, negativeMarking: false, status: "attempted", attemptedAt: "2026-02-10", score: 64, teacherName: "Mr. Choudhary", batchName: "Class 12-Commerce" },
  { id: "tt-ac4", name: "Journal Entries & Ledger", type: "teacher", subject: "accountancy", totalQuestions: 15, totalMarks: 60, duration: 40, negativeMarking: false, status: "missed", scheduledDate: "2026-01-14", scheduledTime: "10:00 AM", teacherName: "Mr. Choudhary", batchName: "Class 12-Commerce" },

  // ===================== BUSINESS STUDIES (4 tests) =====================
  { id: "tt-bs1", name: "Marketing Management Test", type: "teacher", subject: "business", totalQuestions: 25, totalMarks: 80, duration: 50, negativeMarking: false, status: "upcoming", scheduledDate: "2026-02-27", scheduledTime: "02:00 PM", teacherName: "Mrs. Malhotra", batchName: "Class 12-Commerce" },
  { id: "tt-bs2", name: "Entrepreneurship & Planning", type: "teacher", subject: "business", totalQuestions: 20, totalMarks: 60, duration: 40, negativeMarking: false, status: "attempted", attemptedAt: "2026-02-11", score: 48, teacherName: "Mrs. Malhotra", batchName: "Class 12-Commerce" },
  { id: "tt-bs3", name: "Financial Markets Quiz", type: "teacher", subject: "business", totalQuestions: 20, totalMarks: 60, duration: 35, negativeMarking: false, status: "attempted", attemptedAt: "2026-01-28", score: 52, teacherName: "Mrs. Malhotra", batchName: "Class 12-Commerce" },
  { id: "tt-bs4", name: "Business Environment Test", type: "teacher", subject: "business", totalQuestions: 15, totalMarks: 50, duration: 30, negativeMarking: false, status: "missed", scheduledDate: "2026-01-12", scheduledTime: "02:00 PM", teacherName: "Mrs. Malhotra", batchName: "Class 12-Commerce" },

  // ===================== ARTIFICIAL INTELLIGENCE (4 tests) =====================
  { id: "tt-ai1", name: "AI Fundamentals & Ethics", type: "teacher", subject: "ai", totalQuestions: 25, totalMarks: 80, duration: 50, negativeMarking: false, status: "live", teacherName: "Dr. Rajan", batchName: "Class 10-C" },
  { id: "tt-ai2", name: "Machine Learning Basics Quiz", type: "teacher", subject: "ai", totalQuestions: 20, totalMarks: 60, duration: 40, negativeMarking: false, status: "upcoming", scheduledDate: "2026-03-03", scheduledTime: "11:00 AM", teacherName: "Dr. Rajan", batchName: "Class 10-C" },
  { id: "tt-ai3", name: "Data Science & Visualization", type: "teacher", subject: "ai", totalQuestions: 20, totalMarks: 60, duration: 40, negativeMarking: false, status: "attempted", attemptedAt: "2026-02-13", score: 48, teacherName: "Dr. Rajan", batchName: "Class 10-C" },
  { id: "tt-ai4", name: "Neural Networks Overview", type: "teacher", subject: "ai", totalQuestions: 15, totalMarks: 50, duration: 30, negativeMarking: false, status: "missed", scheduledDate: "2026-01-20", scheduledTime: "11:00 AM", teacherName: "Dr. Rajan", batchName: "Class 10-C" },

  // ===================== INFORMATICS PRACTICES (4 tests) =====================
  { id: "tt-ip1", name: "MySQL & Data Handling", type: "teacher", subject: "informatics", totalQuestions: 25, totalMarks: 100, duration: 50, negativeMarking: false, status: "upcoming", scheduledDate: "2026-02-28", scheduledTime: "10:00 AM", teacherName: "Ms. Chatterjee", batchName: "Class 12-B" },
  { id: "tt-ip2", name: "Pandas & NumPy Practice", type: "teacher", subject: "informatics", totalQuestions: 20, totalMarks: 80, duration: 45, negativeMarking: false, status: "attempted", attemptedAt: "2026-02-11", score: 68, teacherName: "Ms. Chatterjee", batchName: "Class 12-B" },
  { id: "tt-ip3", name: "Networking Concepts Quiz", type: "teacher", subject: "informatics", totalQuestions: 15, totalMarks: 60, duration: 30, negativeMarking: false, status: "attempted", attemptedAt: "2026-01-30", score: 48, teacherName: "Ms. Chatterjee", batchName: "Class 12-B" },
  { id: "tt-ip4", name: "Cyber Safety & Ethics Test", type: "teacher", subject: "informatics", totalQuestions: 20, totalMarks: 60, duration: 35, negativeMarking: false, status: "missed", scheduledDate: "2026-01-16", scheduledTime: "10:00 AM", teacherName: "Ms. Chatterjee", batchName: "Class 12-B" },

  // ===================== HOME SCIENCE (3 tests) =====================
  { id: "tt-hs-h1", name: "Nutrition & Dietetics Test", type: "teacher", subject: "home-science", totalQuestions: 25, totalMarks: 80, duration: 50, negativeMarking: false, status: "upcoming", scheduledDate: "2026-03-02", scheduledTime: "02:00 PM", teacherName: "Mrs. Tandon", batchName: "Class 12-D" },
  { id: "tt-hs-h2", name: "Textile & Fabric Science", type: "teacher", subject: "home-science", totalQuestions: 20, totalMarks: 60, duration: 40, negativeMarking: false, status: "attempted", attemptedAt: "2026-02-09", score: 50, teacherName: "Mrs. Tandon", batchName: "Class 12-D" },
  { id: "tt-hs-h3", name: "Child Development Quiz", type: "teacher", subject: "home-science", totalQuestions: 15, totalMarks: 50, duration: 30, negativeMarking: false, status: "missed", scheduledDate: "2026-01-22", scheduledTime: "02:00 PM", teacherName: "Mrs. Tandon", batchName: "Class 12-D" },
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
    physics: "Physics", chemistry: "Chemistry", mathematics: "Mathematics",
    math: "Mathematics", biology: "Biology", english: "English",
    cs: "Computer Science", hindi: "हिंदी", sanskrit: "संस्कृतम्",
    "social-science": "Social Science", history: "History",
    geography: "Geography", civics: "Political Science",
    economics: "Economics", science: "Science", zoology: "Zoology",
    botany: "Botany", evs: "Environmental Studies", art: "Fine Arts",
    pe: "Physical Education", accountancy: "Accountancy",
    business: "Business Studies", ai: "Artificial Intelligence",
    informatics: "Informatics Practices", "home-science": "Home Science",
  };
  return names[subject.toLowerCase()] || subject;
};
