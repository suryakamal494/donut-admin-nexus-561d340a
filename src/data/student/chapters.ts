// Student Chapters Data - Per-subject chapter information

export type ChapterLearningState = 
  | "not-started" 
  | "in-progress" 
  | "struggling" 
  | "on-track" 
  | "completed" 
  | "mastered";

export interface StudentChapter {
  id: string;
  subjectId: string;
  name: string;
  order: number;
  progress: number;
  state: ChapterLearningState;
  hasAIPath: boolean;
  topicsTotal: number;
  topicsCompleted: number;
  /** Curriculum this chapter belongs to. Undefined = default/single curriculum. */
  curriculumId?: string;
}

// Mathematics Chapters — CBSE
const mathChapters: StudentChapter[] = [
  { id: "math-ch1", subjectId: "math", name: "Number Systems", order: 1, progress: 100, state: "completed", hasAIPath: false, topicsTotal: 4, topicsCompleted: 4, curriculumId: "CBSE" },
  { id: "math-ch2", subjectId: "math", name: "Polynomials", order: 2, progress: 100, state: "mastered", hasAIPath: false, topicsTotal: 5, topicsCompleted: 5, curriculumId: "CBSE" },
  { id: "math-ch3", subjectId: "math", name: "Quadratic Equations", order: 3, progress: 55, state: "in-progress", hasAIPath: true, topicsTotal: 6, topicsCompleted: 3, curriculumId: "CBSE" },
  { id: "math-ch4", subjectId: "math", name: "Arithmetic Progressions", order: 4, progress: 30, state: "struggling", hasAIPath: true, topicsTotal: 4, topicsCompleted: 1, curriculumId: "CBSE" },
  { id: "math-ch5", subjectId: "math", name: "Triangles", order: 5, progress: 0, state: "not-started", hasAIPath: false, topicsTotal: 5, topicsCompleted: 0, curriculumId: "CBSE" },
  { id: "math-ch6", subjectId: "math", name: "Coordinate Geometry", order: 6, progress: 0, state: "not-started", hasAIPath: false, topicsTotal: 4, topicsCompleted: 0, curriculumId: "CBSE" },
];

// Mathematics Chapters — JEE Mains
const mathJeeChapters: StudentChapter[] = [
  { id: "math-jee-ch1", subjectId: "math", name: "Complex Numbers & Quadratic Equations", order: 1, progress: 80, state: "on-track", hasAIPath: false, topicsTotal: 6, topicsCompleted: 5, curriculumId: "JEE Mains" },
  { id: "math-jee-ch2", subjectId: "math", name: "Matrices & Determinants", order: 2, progress: 45, state: "in-progress", hasAIPath: true, topicsTotal: 5, topicsCompleted: 2, curriculumId: "JEE Mains" },
  { id: "math-jee-ch3", subjectId: "math", name: "Permutations & Combinations", order: 3, progress: 20, state: "in-progress", hasAIPath: true, topicsTotal: 4, topicsCompleted: 1, curriculumId: "JEE Mains" },
  { id: "math-jee-ch4", subjectId: "math", name: "Binomial Theorem", order: 4, progress: 0, state: "not-started", hasAIPath: false, topicsTotal: 3, topicsCompleted: 0, curriculumId: "JEE Mains" },
  { id: "math-jee-ch5", subjectId: "math", name: "Sequences & Series", order: 5, progress: 0, state: "not-started", hasAIPath: false, topicsTotal: 5, topicsCompleted: 0, curriculumId: "JEE Mains" },
];

// Physics Chapters
const physicsChapters: StudentChapter[] = [
  { id: "physics-ch1", subjectId: "physics", name: "Motion", order: 1, progress: 100, state: "completed", hasAIPath: false, topicsTotal: 5, topicsCompleted: 5 },
  { id: "physics-ch2", subjectId: "physics", name: "Force and Laws of Motion", order: 2, progress: 35, state: "in-progress", hasAIPath: true, topicsTotal: 6, topicsCompleted: 2 },
  { id: "physics-ch3", subjectId: "physics", name: "Gravitation", order: 3, progress: 0, state: "not-started", hasAIPath: false, topicsTotal: 4, topicsCompleted: 0 },
  { id: "physics-ch4", subjectId: "physics", name: "Work and Energy", order: 4, progress: 0, state: "not-started", hasAIPath: false, topicsTotal: 5, topicsCompleted: 0 },
  { id: "physics-ch5", subjectId: "physics", name: "Sound", order: 5, progress: 0, state: "not-started", hasAIPath: false, topicsTotal: 4, topicsCompleted: 0 },
];

// Chemistry Chapters
const chemistryChapters: StudentChapter[] = [
  { id: "chem-ch1", subjectId: "chemistry", name: "Matter in Our Surroundings", order: 1, progress: 100, state: "mastered", hasAIPath: false, topicsTotal: 4, topicsCompleted: 4 },
  { id: "chem-ch2", subjectId: "chemistry", name: "Is Matter Around Us Pure", order: 2, progress: 100, state: "completed", hasAIPath: false, topicsTotal: 5, topicsCompleted: 5 },
  { id: "chem-ch3", subjectId: "chemistry", name: "Atoms and Molecules", order: 3, progress: 100, state: "completed", hasAIPath: false, topicsTotal: 6, topicsCompleted: 6 },
  { id: "chem-ch4", subjectId: "chemistry", name: "Structure of the Atom", order: 4, progress: 85, state: "on-track", hasAIPath: false, topicsTotal: 5, topicsCompleted: 4 },
  { id: "chem-ch5", subjectId: "chemistry", name: "The Fundamental Unit of Life", order: 5, progress: 40, state: "in-progress", hasAIPath: true, topicsTotal: 4, topicsCompleted: 2 },
];

// Biology Chapters
const biologyChapters: StudentChapter[] = [
  { id: "bio-ch1", subjectId: "biology", name: "The Living World", order: 1, progress: 100, state: "completed", hasAIPath: false, topicsTotal: 4, topicsCompleted: 4 },
  { id: "bio-ch2", subjectId: "biology", name: "Biological Classification", order: 2, progress: 60, state: "on-track", hasAIPath: false, topicsTotal: 5, topicsCompleted: 3 },
  { id: "bio-ch3", subjectId: "biology", name: "Plant Kingdom", order: 3, progress: 25, state: "struggling", hasAIPath: true, topicsTotal: 6, topicsCompleted: 1 },
  { id: "bio-ch4", subjectId: "biology", name: "Animal Kingdom", order: 4, progress: 0, state: "not-started", hasAIPath: false, topicsTotal: 5, topicsCompleted: 0 },
  { id: "bio-ch5", subjectId: "biology", name: "Morphology of Plants", order: 5, progress: 0, state: "not-started", hasAIPath: false, topicsTotal: 4, topicsCompleted: 0 },
  { id: "bio-ch6", subjectId: "biology", name: "Anatomy of Plants", order: 6, progress: 0, state: "not-started", hasAIPath: false, topicsTotal: 5, topicsCompleted: 0 },
];

// English Chapters
const englishChapters: StudentChapter[] = [
  { id: "eng-ch1", subjectId: "english", name: "Reading Comprehension", order: 1, progress: 100, state: "mastered", hasAIPath: false, topicsTotal: 4, topicsCompleted: 4 },
  { id: "eng-ch2", subjectId: "english", name: "Grammar Fundamentals", order: 2, progress: 100, state: "completed", hasAIPath: false, topicsTotal: 6, topicsCompleted: 6 },
  { id: "eng-ch3", subjectId: "english", name: "Creative Writing", order: 3, progress: 100, state: "completed", hasAIPath: false, topicsTotal: 5, topicsCompleted: 5 },
  { id: "eng-ch4", subjectId: "english", name: "Literature Analysis", order: 4, progress: 75, state: "on-track", hasAIPath: false, topicsTotal: 4, topicsCompleted: 3 },
];

// Computer Science Chapters
const csChapters: StudentChapter[] = [
  { id: "cs-ch1", subjectId: "cs", name: "Introduction to Programming", order: 1, progress: 100, state: "mastered", hasAIPath: false, topicsTotal: 5, topicsCompleted: 5 },
  { id: "cs-ch2", subjectId: "cs", name: "Data Types and Variables", order: 2, progress: 100, state: "completed", hasAIPath: false, topicsTotal: 4, topicsCompleted: 4 },
  { id: "cs-ch3", subjectId: "cs", name: "Control Structures", order: 3, progress: 65, state: "in-progress", hasAIPath: true, topicsTotal: 6, topicsCompleted: 4 },
  { id: "cs-ch4", subjectId: "cs", name: "Functions and Modules", order: 4, progress: 20, state: "in-progress", hasAIPath: true, topicsTotal: 5, topicsCompleted: 1 },
  { id: "cs-ch5", subjectId: "cs", name: "Object-Oriented Programming", order: 5, progress: 0, state: "not-started", hasAIPath: false, topicsTotal: 6, topicsCompleted: 0 },
];

// All chapters combined
export const studentChapters: StudentChapter[] = [
  ...mathChapters,
  ...physicsChapters,
  ...chemistryChapters,
  ...biologyChapters,
  ...englishChapters,
  ...csChapters,
];

// Helper function to get chapters for a specific subject
export const getChaptersBySubject = (subjectId: string): StudentChapter[] => {
  return studentChapters
    .filter(ch => ch.subjectId === subjectId)
    .sort((a, b) => a.order - b.order);
};
