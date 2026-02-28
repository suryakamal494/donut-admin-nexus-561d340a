// ============================================
// Institute Reports — Mock Data Layer
// Map-cached for render stability
// Seeded PRNG for deterministic generation
// ============================================

export type Trend = "up" | "down" | "stable";

// ── Seeded PRNG ──
function seededRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

// ── Types ──

export interface SubjectSummary {
  subjectId: string;
  subjectName: string;
  subjectColor: string;
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
  subjectNames?: string[];
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

export interface ExamHistoryEntry {
  examName: string;
  subject: string;
  date: string;
  score: number;
  maxScore: number;
  percentage: number;
}

// ── Subject Colors ──
const SUBJECT_COLORS: Record<string, string> = {
  Physics: "210 90% 56%",
  Chemistry: "145 65% 42%",
  Mathematics: "35 95% 55%",
  Biology: "280 65% 55%",
  English: "350 70% 55%",
  Hindi: "20 80% 55%",
  "Computer Science": "195 80% 50%",
};

// ── Teacher Pool ──
const TEACHERS: Record<string, string[]> = {
  Physics: ["Mr. Sharma", "Dr. Gupta", "Ms. Verma"],
  Chemistry: ["Ms. Patel", "Ms. Iyer", "Dr. Nair"],
  Mathematics: ["Mr. Kumar", "Mr. Joshi", "Mr. Reddy"],
  Biology: ["Dr. Sinha", "Ms. Kapoor"],
  English: ["Ms. D'Souza", "Mr. Thomas"],
  Hindi: ["Mrs. Mishra", "Mr. Pandey"],
  "Computer Science": ["Mr. Rajan", "Ms. Mehta"],
};

// ── Name Pool (80+) ──
const FIRST_NAMES = [
  "Aarav","Priya","Rohan","Sneha","Vikram","Ananya","Arjun","Meera","Karan","Diya",
  "Rahul","Kavya","Aditya","Nisha","Siddharth","Pooja","Harsh","Riya","Dev","Sakshi",
  "Nikhil","Ishita","Manish","Tanvi","Amit","Shruti","Rajesh","Neha","Varun","Simran",
  "Kunal","Deepika","Akash","Swati","Gaurav","Pallavi","Mohit","Anjali","Tushar","Divya",
  "Suresh","Komal","Ramesh","Bhavna","Girish","Yash","Tanya","Pranav","Megha","Vivek",
  "Ritika","Omkar","Jhanvi","Sahil","Kritika","Abhinav","Sanya","Dhruv","Anushka","Parth",
  "Madhuri","Ishan","Kiara","Tarun","Lavanya","Shaurya","Navya","Chirag","Muskaan","Ayush",
  "Ridhi","Darshan","Aisha","Nakul","Tara","Raghav","Charvi","Aarushi","Vedant","Nitya",
  "Ashwin","Myra","Soham","Khushi","Reyansh","Avni","Kabir","Pihu","Viraj","Anvi",
];

const LAST_NAMES = [
  "Sharma","Patel","Gupta","Singh","Kumar","Verma","Joshi","Reddy","Iyer","Nair",
  "Mehta","Shah","Kapoor","Mishra","Pandey","Desai","Rao","Bhat","Chopra","Malhotra",
];

function getName(index: number, rand: () => number): string {
  const first = FIRST_NAMES[index % FIRST_NAMES.length];
  const last = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];
  return `${first} ${last}`;
}

// ── Batch Definitions ──

function makeSub(
  id: string, name: string, teacher: string,
  avg: number, prevAvg: number, trend: Trend,
  exams: number, atRisk: number, total: number
): SubjectSummary {
  return {
    subjectId: id, subjectName: name, subjectColor: SUBJECT_COLORS[name] || "200 50% 50%",
    teacherName: teacher, classAverage: avg, previousAverage: prevAvg,
    trend, totalExams: exams, atRiskCount: atRisk, totalStudents: total,
  };
}

const batchReportsCache = new Map<string, InstituteBatchReport[]>();

export function getInstituteBatchReports(): InstituteBatchReport[] {
  if (batchReportsCache.has("all")) return batchReportsCache.get("all")!;

  const batches: InstituteBatchReport[] = [
    // ── Class 10 ──
    {
      batchId: "batch-10a", batchName: "Batch A", className: "Class 10",
      totalStudents: 45, subjectCount: 6, overallAverage: 62, previousAverage: 58, trend: "up", atRiskCount: 8, totalExams: 36,
      subjects: [
        makeSub("phy-10a","Physics","Mr. Sharma",58,54,"up",6,5,45),
        makeSub("chem-10a","Chemistry","Ms. Patel",64,66,"down",6,3,45),
        makeSub("math-10a","Mathematics","Mr. Kumar",65,54,"up",7,4,45),
        makeSub("bio-10a","Biology","Dr. Sinha",60,58,"up",6,4,45),
        makeSub("eng-10a","English","Ms. D'Souza",68,65,"up",5,2,45),
        makeSub("hin-10a","Hindi","Mrs. Mishra",59,60,"down",6,5,45),
      ],
    },
    {
      batchId: "batch-10b", batchName: "Batch B", className: "Class 10",
      totalStudents: 42, subjectCount: 6, overallAverage: 55, previousAverage: 57, trend: "down", atRiskCount: 12, totalExams: 34,
      subjects: [
        makeSub("phy-10b","Physics","Mr. Sharma",49,52,"down",5,8,42),
        makeSub("chem-10b","Chemistry","Ms. Patel",57,55,"up",6,4,42),
        makeSub("math-10b","Mathematics","Mr. Reddy",59,63,"down",6,6,42),
        makeSub("bio-10b","Biology","Dr. Sinha",53,50,"up",5,5,42),
        makeSub("eng-10b","English","Ms. D'Souza",62,60,"up",6,3,42),
        makeSub("hin-10b","Hindi","Mrs. Mishra",50,52,"down",6,7,42),
      ],
    },
    {
      batchId: "batch-10c", batchName: "Batch C", className: "Class 10",
      totalStudents: 40, subjectCount: 6, overallAverage: 58, previousAverage: 56, trend: "up", atRiskCount: 10, totalExams: 32,
      subjects: [
        makeSub("phy-10c","Physics","Ms. Verma",54,51,"up",5,6,40),
        makeSub("chem-10c","Chemistry","Dr. Nair",60,58,"up",5,4,40),
        makeSub("math-10c","Mathematics","Mr. Kumar",61,60,"stable",6,4,40),
        makeSub("bio-10c","Biology","Ms. Kapoor",56,54,"up",5,5,40),
        makeSub("eng-10c","English","Mr. Thomas",63,62,"stable",6,2,40),
        makeSub("hin-10c","Hindi","Mr. Pandey",52,50,"up",5,6,40),
      ],
    },
    // ── Class 11 ──
    {
      batchId: "batch-11a", batchName: "Batch A", className: "Class 11",
      totalStudents: 38, subjectCount: 7, overallAverage: 68, previousAverage: 65, trend: "up", atRiskCount: 5, totalExams: 42,
      subjects: [
        makeSub("phy-11a","Physics","Dr. Gupta",66,63,"up",6,3,38),
        makeSub("chem-11a","Chemistry","Ms. Iyer",71,68,"up",6,2,38),
        makeSub("math-11a","Mathematics","Mr. Joshi",67,65,"up",7,3,38),
        makeSub("bio-11a","Biology","Dr. Sinha",65,62,"up",6,3,38),
        makeSub("eng-11a","English","Ms. D'Souza",73,70,"up",5,1,38),
        makeSub("hin-11a","Hindi","Mrs. Mishra",64,63,"stable",6,3,38),
        makeSub("cs-11a","Computer Science","Mr. Rajan",70,68,"up",6,2,38),
      ],
    },
    {
      batchId: "batch-11b", batchName: "Batch B", className: "Class 11",
      totalStudents: 36, subjectCount: 7, overallAverage: 61, previousAverage: 60, trend: "stable", atRiskCount: 8, totalExams: 38,
      subjects: [
        makeSub("phy-11b","Physics","Dr. Gupta",58,57,"stable",5,4,36),
        makeSub("chem-11b","Chemistry","Ms. Iyer",63,62,"stable",6,3,36),
        makeSub("math-11b","Mathematics","Mr. Joshi",60,61,"down",6,4,36),
        makeSub("bio-11b","Biology","Ms. Kapoor",59,56,"up",5,4,36),
        makeSub("eng-11b","English","Mr. Thomas",67,66,"stable",5,2,36),
        makeSub("hin-11b","Hindi","Mr. Pandey",57,58,"down",5,5,36),
        makeSub("cs-11b","Computer Science","Ms. Mehta",63,60,"up",6,3,36),
      ],
    },
    // ── Class 12 ──
    {
      batchId: "batch-12a", batchName: "Batch A", className: "Class 12",
      totalStudents: 35, subjectCount: 7, overallAverage: 71, previousAverage: 70, trend: "stable", atRiskCount: 4, totalExams: 48,
      subjects: [
        makeSub("phy-12a","Physics","Dr. Gupta",69,68,"stable",8,2,35),
        makeSub("chem-12a","Chemistry","Ms. Iyer",73,71,"up",7,1,35),
        makeSub("math-12a","Mathematics","Mr. Joshi",70,72,"down",7,3,35),
        makeSub("bio-12a","Biology","Dr. Sinha",72,70,"up",7,1,35),
        makeSub("eng-12a","English","Ms. D'Souza",76,74,"up",6,0,35),
        makeSub("hin-12a","Hindi","Mrs. Mishra",66,67,"down",6,3,35),
        makeSub("cs-12a","Computer Science","Mr. Rajan",71,70,"stable",7,2,35),
      ],
    },
    {
      batchId: "batch-12b", batchName: "Batch B", className: "Class 12",
      totalStudents: 34, subjectCount: 7, overallAverage: 64, previousAverage: 63, trend: "up", atRiskCount: 7, totalExams: 44,
      subjects: [
        makeSub("phy-12b","Physics","Ms. Verma",61,60,"stable",7,4,34),
        makeSub("chem-12b","Chemistry","Dr. Nair",66,64,"up",6,2,34),
        makeSub("math-12b","Mathematics","Mr. Reddy",63,65,"down",7,4,34),
        makeSub("bio-12b","Biology","Ms. Kapoor",65,63,"up",6,3,34),
        makeSub("eng-12b","English","Mr. Thomas",70,68,"up",6,1,34),
        makeSub("hin-12b","Hindi","Mr. Pandey",60,62,"down",6,4,34),
        makeSub("cs-12b","Computer Science","Ms. Mehta",63,60,"up",6,3,34),
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

function generateExamsForBatch(batch: InstituteBatchReport): InstituteExamEntry[] {
  const rand = seededRandom(hashString(batch.batchId + "-exams"));
  const tag = batch.className.replace("Class ", "") + batch.batchName.replace("Batch ", "");
  const exams: InstituteExamEntry[] = [];

  const examTypes = ["Unit Test 1", "Unit Test 2", "Unit Test 3", "Mid-Term", "Pre-Final"];

  for (const sub of batch.subjects) {
    const numExams = Math.min(sub.totalExams, examTypes.length);
    for (let i = 0; i < numExams; i++) {
      const marks = examTypes[i].includes("Unit") ? 30 : 100;
      const avgPct = Math.max(25, Math.min(92, sub.classAverage + Math.floor(rand() * 20) - 10));
      const avg = Math.round((avgPct / 100) * marks);
      const month = (i + 1).toString().padStart(2, "0");
      exams.push({
        examId: `exam-${sub.subjectId}-${i}`,
        examName: `${sub.subjectName} ${examTypes[i]}`,
        batchId: batch.batchId,
        batchName: tag,
        subject: sub.subjectName,
        type: examTypes[i].includes("Mid") || examTypes[i].includes("Pre") ? "institute" : "teacher",
        date: `2025-${month}-${(10 + i * 5).toString().padStart(2, "0")}`,
        totalMarks: marks,
        classAverage: avg,
        totalStudents: batch.totalStudents,
        passPercentage: Math.round(55 + rand() * 35),
      });
    }
  }

  // Grand tests
  const grandSubjects = batch.subjects.map(s => s.subjectName);
  const isScience = grandSubjects.includes("Biology");
  const patterns = isScience
    ? [
        { name: "Grand Test 1 (NEET Pattern)", subs: ["Physics","Chemistry","Biology"], marks: 720 },
        { name: "Grand Test 2 (NEET Pattern)", subs: ["Physics","Chemistry","Biology"], marks: 720 },
      ]
    : [
        { name: "Grand Test 1 (JEE Pattern)", subs: ["Physics","Chemistry","Mathematics"], marks: 300 },
        { name: "Grand Test 2 (JEE Pattern)", subs: ["Physics","Chemistry","Mathematics"], marks: 300 },
      ];

  // Add a comprehensive grand test with all subjects
  patterns.push({
    name: "Comprehensive Grand Test",
    subs: grandSubjects.slice(0, 6),
    marks: grandSubjects.slice(0, 6).length * 100,
  });

  patterns.forEach((p, i) => {
    const avgPct = Math.max(35, Math.min(85, batch.overallAverage + Math.floor(rand() * 16) - 8));
    exams.push({
      examId: `grand-${batch.batchId}-${i}`,
      examName: p.name,
      batchId: batch.batchId,
      batchName: tag,
      subject: "Grand Test",
      subjectNames: p.subs,
      type: "grand_test",
      date: `2025-${(3 + i * 2).toString().padStart(2, "0")}-01`,
      totalMarks: p.marks,
      classAverage: Math.round((avgPct / 100) * p.marks),
      totalStudents: batch.totalStudents,
      passPercentage: Math.round(50 + rand() * 35),
    });
  });

  return exams.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getInstituteExams(): InstituteExamEntry[] {
  if (examsCache.has("all")) return examsCache.get("all")!;
  const batches = getInstituteBatchReports();
  const allExams = batches.flatMap(b => generateExamsForBatch(b));
  examsCache.set("all", allExams);
  return allExams;
}

export function getExamsByBatch(batchId: string): InstituteExamEntry[] {
  return getInstituteExams().filter(e => e.batchId === batchId);
}

// ── Student Summaries ──

const studentsCache = new Map<string, InstituteStudentSummary[]>();

function generateStudentsForBatch(batch: InstituteBatchReport): InstituteStudentSummary[] {
  const rand = seededRandom(hashString(batch.batchId + "-students"));
  const students: InstituteStudentSummary[] = [];
  const count = batch.totalStudents;
  const trends: Trend[] = ["up", "down", "stable"];

  for (let i = 0; i < count; i++) {
    const name = getName(i, rand);
    const subjectPerf = batch.subjects.map(sub => {
      const base = sub.classAverage;
      const offset = Math.floor(rand() * 40) - 20;
      const avg = Math.max(15, Math.min(98, base + offset));
      return {
        subjectName: sub.subjectName,
        subjectColor: sub.subjectColor,
        average: avg,
        trend: trends[Math.floor(rand() * 3)],
        teacherName: sub.teacherName,
        examCount: sub.totalExams,
      };
    });

    const overallAvg = Math.round(subjectPerf.reduce((s, sp) => s + sp.average, 0) / subjectPerf.length);

    students.push({
      studentId: `${batch.batchId}-student-${i + 1}`,
      studentName: name,
      rollNumber: `${batch.className.replace("Class ", "")}${batch.batchName.replace("Batch ", "")}${String(i + 1).padStart(3, "0")}`,
      batchId: batch.batchId,
      batchName: `${batch.className} ${batch.batchName}`,
      className: batch.className,
      overallAverage: overallAvg,
      trend: trends[Math.floor(rand() * 3)],
      subjectCount: batch.subjectCount,
      examsTaken: batch.totalExams,
      subjects: subjectPerf,
    });
  }

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

// ── Exam History for Student (Map-cached, seeded) ──

const examHistoryCache = new Map<string, ExamHistoryEntry[]>();

export function getStudentExamHistory(student: InstituteStudentSummary): ExamHistoryEntry[] {
  if (examHistoryCache.has(student.studentId)) return examHistoryCache.get(student.studentId)!;

  const rand = seededRandom(hashString(student.studentId + "-history"));
  const exams = getExamsByBatch(student.batchId);

  const history = exams.map((exam) => {
    const sub = student.subjects.find(s => s.subjectName === exam.subject);
    const baseAvg = sub ? sub.average : student.overallAverage;
    const pct = Math.max(10, Math.min(98, baseAvg + Math.floor(rand() * 30) - 15));
    const score = Math.round((pct / 100) * exam.totalMarks);
    return {
      examName: exam.examName,
      subject: exam.type === "grand_test" ? "Grand Test" : exam.subject,
      date: exam.date,
      score,
      maxScore: exam.totalMarks,
      percentage: pct,
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  examHistoryCache.set(student.studentId, history);
  return history;
}

// ── Subject Detail ──

const subjectDetailCache = new Map<string, SubjectDetailData>();

const CHAPTER_NAMES: Record<string, string[]> = {
  Physics: ["Mechanics", "Thermodynamics", "Optics", "Electrostatics", "Magnetism", "Waves", "Modern Physics", "Semiconductors"],
  Chemistry: ["Atomic Structure", "Chemical Bonding", "Organic Chemistry", "Equilibrium", "Solutions", "Electrochemistry", "Coordination Compounds", "Polymers"],
  Mathematics: ["Algebra", "Calculus", "Trigonometry", "Coordinate Geometry", "Probability", "Vectors", "Matrices", "Differential Equations"],
  Biology: ["Cell Biology", "Genetics", "Ecology", "Human Physiology", "Plant Physiology", "Evolution", "Biotechnology", "Reproduction"],
  English: ["Reading Comprehension", "Creative Writing", "Grammar & Usage", "Literature Analysis", "Poetry", "Essay Writing"],
  Hindi: ["गद्य खण्ड", "काव्य खण्ड", "व्याकरण", "लेखन कौशल", "अपठित गद्यांश", "पत्र लेखन"],
  "Computer Science": ["Programming Fundamentals", "Data Structures", "Databases", "Networking", "Boolean Algebra", "Python"],
};

export function getSubjectDetail(batchId: string, subjectId: string): SubjectDetailData | undefined {
  const key = `${batchId}-${subjectId}`;
  if (subjectDetailCache.has(key)) return subjectDetailCache.get(key)!;

  const batch = getInstituteBatchById(batchId);
  if (!batch) return undefined;
  const subject = batch.subjects.find(s => s.subjectId === subjectId);
  if (!subject) return undefined;

  const rand = seededRandom(hashString(key));
  const names = CHAPTER_NAMES[subject.subjectName] || ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6"];

  const chapters: ChapterAnalysis[] = names.map((name, i) => {
    const rate = Math.max(20, Math.min(95, subject.classAverage + Math.floor(rand() * 30) - 15));
    const status: ChapterAnalysis["status"] = rate >= 65 ? "strong" : rate >= 40 ? "moderate" : "weak";
    return {
      chapterId: `${subjectId}-ch-${i + 1}`,
      chapterName: name,
      avgSuccessRate: rate,
      examsCovering: Math.floor(rand() * 3) + 1,
      topicCount: Math.floor(rand() * 4) + 3,
      weakTopicCount: status === "weak" ? Math.floor(rand() * 3) + 1 : status === "moderate" ? Math.floor(rand() * 2) : 0,
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
