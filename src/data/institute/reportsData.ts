// ============================================
// Institute Reports — Mock Data Layer
// Map-cached for render stability
// ============================================

export type Trend = "up" | "down" | "stable";

// ── Types ──

export interface SubjectSummary {
  subjectId: string;
  subjectName: string;
  subjectColor: string; // HSL accent for strip
  teacherName: string;
  classAverage: number;
  previousAverage: number;
  trend: Trend;
  totalExams: number;
  atRiskCount: number;
  totalStudents: number;
}

export interface InstituteBatchReport {
  batchId: string;
  batchName: string;
  className: string;
  totalStudents: number;
  subjectCount: number;
  overallAverage: number;
  previousAverage: number;
  trend: Trend;
  atRiskCount: number;
  totalExams: number;
  subjects: SubjectSummary[];
}

export interface InstituteExamEntry {
  examId: string;
  examName: string;
  batchId: string;
  batchName: string;
  subject: string;
  subjectNames?: string[]; // for grand tests (multi-subject)
  type: "teacher" | "institute" | "grand_test";
  date: string;
  totalMarks: number;
  classAverage: number;
  totalStudents: number;
  passPercentage: number;
}

export interface InstituteStudentSummary {
  studentId: string;
  studentName: string;
  rollNumber: string;
  batchId: string;
  batchName: string;
  className: string;
  overallAverage: number;
  trend: Trend;
  subjectCount: number;
  examsTaken: number;
  subjects: {
    subjectName: string;
    subjectColor: string;
    average: number;
    trend: Trend;
    teacherName: string;
    examCount: number;
  }[];
}

export interface ChapterAnalysis {
  chapterId: string;
  chapterName: string;
  avgSuccessRate: number;
  examsCovering: number;
  topicCount: number;
  weakTopicCount: number;
  status: "strong" | "moderate" | "weak";
}

export interface SubjectDetailData {
  subjectId: string;
  subjectName: string;
  subjectColor: string;
  batchId: string;
  batchName: string;
  className: string;
  teacherName: string;
  classAverage: number;
  trend: Trend;
  totalStudents: number;
  chapters: ChapterAnalysis[];
}

// ── Subject Colors ──
const SUBJECT_COLORS: Record<string, string> = {
  Physics: "210 90% 56%",
  Chemistry: "145 65% 42%",
  Mathematics: "35 95% 55%",
  Biology: "280 65% 55%",
  English: "350 70% 55%",
  Hindi: "20 80% 55%",
};

// ── Mock Data Generators (Map-cached) ──

const batchReportsCache = new Map<string, InstituteBatchReport[]>();

export function getInstituteBatchReports(): InstituteBatchReport[] {
  if (batchReportsCache.has("all")) return batchReportsCache.get("all")!;

  const batches: InstituteBatchReport[] = [
    {
      batchId: "batch-10a",
      batchName: "Batch A",
      className: "Class 10",
      totalStudents: 45,
      subjectCount: 3,
      overallAverage: 62,
      previousAverage: 58,
      trend: "up",
      atRiskCount: 8,
      totalExams: 18,
      subjects: [
        { subjectId: "phy-10a", subjectName: "Physics", subjectColor: SUBJECT_COLORS.Physics, teacherName: "Mr. Sharma", classAverage: 58, previousAverage: 54, trend: "up", totalExams: 6, atRiskCount: 5, totalStudents: 45 },
        { subjectId: "chem-10a", subjectName: "Chemistry", subjectColor: SUBJECT_COLORS.Chemistry, teacherName: "Ms. Patel", classAverage: 64, previousAverage: 66, trend: "down", totalExams: 5, atRiskCount: 3, totalStudents: 45 },
        { subjectId: "math-10a", subjectName: "Mathematics", subjectColor: SUBJECT_COLORS.Mathematics, teacherName: "Mr. Kumar", classAverage: 65, previousAverage: 54, trend: "up", totalExams: 7, atRiskCount: 4, totalStudents: 45 },
      ],
    },
    {
      batchId: "batch-10b",
      batchName: "Batch B",
      className: "Class 10",
      totalStudents: 42,
      subjectCount: 3,
      overallAverage: 55,
      previousAverage: 57,
      trend: "down",
      atRiskCount: 12,
      totalExams: 15,
      subjects: [
        { subjectId: "phy-10b", subjectName: "Physics", subjectColor: SUBJECT_COLORS.Physics, teacherName: "Mr. Sharma", classAverage: 49, previousAverage: 52, trend: "down", totalExams: 5, atRiskCount: 8, totalStudents: 42 },
        { subjectId: "chem-10b", subjectName: "Chemistry", subjectColor: SUBJECT_COLORS.Chemistry, teacherName: "Ms. Patel", classAverage: 57, previousAverage: 55, trend: "up", totalExams: 5, atRiskCount: 4, totalStudents: 42 },
        { subjectId: "math-10b", subjectName: "Mathematics", subjectColor: SUBJECT_COLORS.Mathematics, teacherName: "Mr. Reddy", classAverage: 59, previousAverage: 63, trend: "down", totalExams: 5, atRiskCount: 6, totalStudents: 42 },
      ],
    },
    {
      batchId: "batch-11a",
      batchName: "Batch A",
      className: "Class 11",
      totalStudents: 38,
      subjectCount: 3,
      overallAverage: 68,
      previousAverage: 65,
      trend: "up",
      atRiskCount: 5,
      totalExams: 14,
      subjects: [
        { subjectId: "phy-11a", subjectName: "Physics", subjectColor: SUBJECT_COLORS.Physics, teacherName: "Dr. Gupta", classAverage: 66, previousAverage: 63, trend: "up", totalExams: 5, atRiskCount: 3, totalStudents: 38 },
        { subjectId: "chem-11a", subjectName: "Chemistry", subjectColor: SUBJECT_COLORS.Chemistry, teacherName: "Ms. Iyer", classAverage: 71, previousAverage: 68, trend: "up", totalExams: 4, atRiskCount: 2, totalStudents: 38 },
        { subjectId: "math-11a", subjectName: "Mathematics", subjectColor: SUBJECT_COLORS.Mathematics, teacherName: "Mr. Joshi", classAverage: 67, previousAverage: 65, trend: "up", totalExams: 5, atRiskCount: 3, totalStudents: 38 },
      ],
    },
    {
      batchId: "batch-12a",
      batchName: "Batch A",
      className: "Class 12",
      totalStudents: 35,
      subjectCount: 3,
      overallAverage: 71,
      previousAverage: 70,
      trend: "stable",
      atRiskCount: 4,
      totalExams: 22,
      subjects: [
        { subjectId: "phy-12a", subjectName: "Physics", subjectColor: SUBJECT_COLORS.Physics, teacherName: "Dr. Gupta", classAverage: 69, previousAverage: 68, trend: "stable", totalExams: 8, atRiskCount: 2, totalStudents: 35 },
        { subjectId: "chem-12a", subjectName: "Chemistry", subjectColor: SUBJECT_COLORS.Chemistry, teacherName: "Ms. Iyer", classAverage: 73, previousAverage: 71, trend: "up", totalExams: 7, atRiskCount: 1, totalStudents: 35 },
        { subjectId: "math-12a", subjectName: "Mathematics", subjectColor: SUBJECT_COLORS.Mathematics, teacherName: "Mr. Joshi", classAverage: 70, previousAverage: 72, trend: "down", totalExams: 7, atRiskCount: 3, totalStudents: 35 },
      ],
    },
  ];

  batchReportsCache.set("all", batches);
  return batches;
}

export function getInstituteBatchById(batchId: string): InstituteBatchReport | undefined {
  return getInstituteBatchReports().find(b => b.batchId === batchId);
}

// ── Exam Listings ──

const examsCache = new Map<string, InstituteExamEntry[]>();

export function getInstituteExams(): InstituteExamEntry[] {
  if (examsCache.has("all")) return examsCache.get("all")!;

  const exams: InstituteExamEntry[] = [
    // Batch 10A exams
    { examId: "exam-phy-unit1-10a", examName: "Physics Unit Test 1", batchId: "batch-10a", batchName: "10A", subject: "Physics", type: "teacher", date: "2025-01-15", totalMarks: 30, classAverage: 18, totalStudents: 45, passPercentage: 72 },
    { examId: "exam-chem-unit1-10a", examName: "Chemistry Unit Test 1", batchId: "batch-10a", batchName: "10A", subject: "Chemistry", type: "teacher", date: "2025-01-18", totalMarks: 30, classAverage: 21, totalStudents: 45, passPercentage: 80 },
    { examId: "exam-math-unit1-10a", examName: "Maths Unit Test 1", batchId: "batch-10a", batchName: "10A", subject: "Mathematics", type: "teacher", date: "2025-01-20", totalMarks: 30, classAverage: 19, totalStudents: 45, passPercentage: 74 },
    { examId: "exam-inst-mid-10a", examName: "Mid-Term Examination", batchId: "batch-10a", batchName: "10A", subject: "Physics", type: "institute", date: "2025-02-10", totalMarks: 100, classAverage: 62, totalStudents: 45, passPercentage: 78 },
    { examId: "grand-test-1-10a", examName: "Grand Test 1 (JEE Pattern)", batchId: "batch-10a", batchName: "10A", subject: "Grand Test", subjectNames: ["Physics", "Chemistry", "Mathematics"], type: "grand_test", date: "2025-02-25", totalMarks: 300, classAverage: 186, totalStudents: 45, passPercentage: 68 },
    // Batch 10B exams
    { examId: "exam-phy-unit1-10b", examName: "Physics Unit Test 1", batchId: "batch-10b", batchName: "10B", subject: "Physics", type: "teacher", date: "2025-01-16", totalMarks: 30, classAverage: 15, totalStudents: 42, passPercentage: 60 },
    { examId: "exam-chem-unit1-10b", examName: "Chemistry Unit Test 1", batchId: "batch-10b", batchName: "10B", subject: "Chemistry", type: "teacher", date: "2025-01-19", totalMarks: 30, classAverage: 18, totalStudents: 42, passPercentage: 65 },
    { examId: "grand-test-1-10b", examName: "Grand Test 1 (JEE Pattern)", batchId: "batch-10b", batchName: "10B", subject: "Grand Test", subjectNames: ["Physics", "Chemistry", "Mathematics"], type: "grand_test", date: "2025-02-25", totalMarks: 300, classAverage: 165, totalStudents: 42, passPercentage: 55 },
    // Batch 11A exams
    { examId: "exam-phy-unit1-11a", examName: "Physics Unit Test 1", batchId: "batch-11a", batchName: "11A", subject: "Physics", type: "teacher", date: "2025-01-22", totalMarks: 30, classAverage: 20, totalStudents: 38, passPercentage: 82 },
    { examId: "exam-inst-mid-11a", examName: "Mid-Term Examination", batchId: "batch-11a", batchName: "11A", subject: "Chemistry", type: "institute", date: "2025-02-12", totalMarks: 100, classAverage: 71, totalStudents: 38, passPercentage: 85 },
    // Batch 12A exams
    { examId: "exam-phy-unit1-12a", examName: "Physics Unit Test 1", batchId: "batch-12a", batchName: "12A", subject: "Physics", type: "teacher", date: "2025-01-10", totalMarks: 30, classAverage: 22, totalStudents: 35, passPercentage: 88 },
    { examId: "grand-test-1-12a", examName: "Grand Test 1 (NEET Pattern)", batchId: "batch-12a", batchName: "12A", subject: "Grand Test", subjectNames: ["Physics", "Chemistry", "Biology"], type: "grand_test", date: "2025-03-01", totalMarks: 720, classAverage: 510, totalStudents: 35, passPercentage: 74 },
  ];

  examsCache.set("all", exams);
  return exams;
}

export function getExamsByBatch(batchId: string): InstituteExamEntry[] {
  return getInstituteExams().filter(e => e.batchId === batchId);
}

// ── Student Summaries ──

const studentsCache = new Map<string, InstituteStudentSummary[]>();

function generateStudentsForBatch(batch: InstituteBatchReport): InstituteStudentSummary[] {
  const firstNames = ["Aarav", "Priya", "Rohan", "Sneha", "Vikram", "Ananya", "Arjun", "Meera", "Karan", "Diya", "Rahul", "Kavya", "Aditya", "Nisha", "Siddharth", "Pooja", "Harsh", "Riya", "Dev", "Sakshi", "Nikhil", "Ishita", "Manish", "Tanvi", "Amit", "Shruti", "Rajesh", "Neha", "Varun", "Simran", "Kunal", "Deepika", "Akash", "Swati", "Gaurav", "Pallavi", "Mohit", "Anjali", "Tushar", "Divya", "Suresh", "Komal", "Ramesh", "Bhavna", "Girish"];
  
  const students: InstituteStudentSummary[] = [];
  const count = Math.min(batch.totalStudents, firstNames.length);
  
  for (let i = 0; i < count; i++) {
    const subjectPerf = batch.subjects.map(sub => {
      const base = sub.classAverage;
      const offset = Math.floor(Math.random() * 40) - 20; // -20 to +20
      const avg = Math.max(15, Math.min(98, base + offset));
      const trends: Trend[] = ["up", "down", "stable"];
      return {
        subjectName: sub.subjectName,
        subjectColor: sub.subjectColor,
        average: avg,
        trend: trends[Math.floor(Math.random() * 3)],
        teacherName: sub.teacherName,
        examCount: sub.totalExams,
      };
    });

    const overallAvg = Math.round(subjectPerf.reduce((s, sp) => s + sp.average, 0) / subjectPerf.length);
    const trends: Trend[] = ["up", "down", "stable"];

    students.push({
      studentId: `${batch.batchId}-student-${i + 1}`,
      studentName: firstNames[i],
      rollNumber: `${batch.className.replace("Class ", "")}${batch.batchName.replace("Batch ", "")}${String(i + 1).padStart(3, "0")}`,
      batchId: batch.batchId,
      batchName: `${batch.className} ${batch.batchName}`,
      className: batch.className,
      overallAverage: overallAvg,
      trend: trends[Math.floor(Math.random() * 3)],
      subjectCount: batch.subjectCount,
      examsTaken: batch.totalExams,
      subjects: subjectPerf,
    });
  }

  // Sort by overall average descending
  students.sort((a, b) => b.overallAverage - a.overallAverage);
  return students;
}

export function getStudentsByBatch(batchId: string): InstituteStudentSummary[] {
  if (studentsCache.has(batchId)) return studentsCache.get(batchId)!;
  const batch = getInstituteBatchById(batchId);
  if (!batch) return [];
  const students = generateStudentsForBatch(batch);
  studentsCache.set(batchId, students);
  return students;
}

export function getAllStudents(): InstituteStudentSummary[] {
  if (studentsCache.has("__all__")) return studentsCache.get("__all__")!;
  const batches = getInstituteBatchReports();
  const all = batches.flatMap(b => getStudentsByBatch(b.batchId));
  studentsCache.set("__all__", all);
  return all;
}

export function getStudentById(studentId: string): InstituteStudentSummary | undefined {
  return getAllStudents().find(s => s.studentId === studentId);
}

// ── Subject Detail ──

const subjectDetailCache = new Map<string, SubjectDetailData>();

export function getSubjectDetail(batchId: string, subjectId: string): SubjectDetailData | undefined {
  const key = `${batchId}-${subjectId}`;
  if (subjectDetailCache.has(key)) return subjectDetailCache.get(key)!;

  const batch = getInstituteBatchById(batchId);
  if (!batch) return undefined;
  const subject = batch.subjects.find(s => s.subjectId === subjectId);
  if (!subject) return undefined;

  const chapterNames: Record<string, string[]> = {
    Physics: ["Mechanics", "Thermodynamics", "Optics", "Electrostatics", "Magnetism", "Waves"],
    Chemistry: ["Atomic Structure", "Chemical Bonding", "Organic Chemistry", "Equilibrium", "Solutions", "Electrochemistry"],
    Mathematics: ["Algebra", "Calculus", "Trigonometry", "Coordinate Geometry", "Probability", "Vectors"],
  };

  const names = chapterNames[subject.subjectName] || ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4"];

  const chapters: ChapterAnalysis[] = names.map((name, i) => {
    const rate = Math.max(20, Math.min(95, subject.classAverage + Math.floor(Math.random() * 30) - 15));
    const status: ChapterAnalysis["status"] = rate >= 65 ? "strong" : rate >= 40 ? "moderate" : "weak";
    return {
      chapterId: `${subjectId}-ch-${i + 1}`,
      chapterName: name,
      avgSuccessRate: rate,
      examsCovering: Math.floor(Math.random() * 3) + 1,
      topicCount: Math.floor(Math.random() * 4) + 3,
      weakTopicCount: status === "weak" ? Math.floor(Math.random() * 3) + 1 : status === "moderate" ? Math.floor(Math.random() * 2) : 0,
      status,
    };
  });

  const detail: SubjectDetailData = {
    subjectId,
    subjectName: subject.subjectName,
    subjectColor: subject.subjectColor,
    batchId,
    batchName: `${batch.className} ${batch.batchName}`,
    className: batch.className,
    teacherName: subject.teacherName,
    classAverage: subject.classAverage,
    trend: subject.trend,
    totalStudents: subject.totalStudents,
    chapters,
  };

  subjectDetailCache.set(key, detail);
  return detail;
}
