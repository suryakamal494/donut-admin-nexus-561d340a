// Academic Planner Mock Data
// Standalone data for testing the academic planner without timetable dependencies

import { BatchAcademicPlan, SubjectPlanData, ChapterWeekAssignment } from "@/types/academicPlanner";

// ============================================
// Saved Academic Plans - Pre-generated plans for batches
// ============================================

export interface SavedAcademicPlan {
  id: string;
  batchId: string;
  batchName: string;
  className: string;
  academicYear: string;
  createdAt: string;
  lastModifiedAt: string;
  subjects: SubjectPlanData[];
  startWeekIndex: number;
  endWeekIndex: number;
  publishedMonths: number[]; // Month numbers (0-11) that are published
  status: 'draft' | 'published' | 'archived';
}

// Helper function to create chapter assignments
function createChapterAssignments(
  chapters: { id: string; name: string; hours: number }[],
  weeklyHours: number,
  startWeek: number
): ChapterWeekAssignment[] {
  const assignments: ChapterWeekAssignment[] = [];
  let currentWeek = startWeek;
  let hoursUsed = 0;

  chapters.forEach((chapter) => {
    let remaining = chapter.hours;
    const hoursPerWeek: { weekIndex: number; hours: number }[] = [];
    const chapterStart = currentWeek;
    const isPartialStart = hoursUsed > 0;

    while (remaining > 0) {
      const available = weeklyHours - hoursUsed;
      const allocated = Math.min(available, remaining);
      
      if (allocated > 0) {
        hoursPerWeek.push({ weekIndex: currentWeek, hours: allocated });
        remaining -= allocated;
        hoursUsed += allocated;
      }

      if (hoursUsed >= weeklyHours) {
        currentWeek++;
        hoursUsed = 0;
      }
    }

    const chapterEnd = hoursPerWeek.length > 0 
      ? hoursPerWeek[hoursPerWeek.length - 1].weekIndex 
      : chapterStart;

    assignments.push({
      chapterId: chapter.id,
      chapterName: chapter.name,
      plannedHours: chapter.hours,
      startWeekIndex: chapterStart,
      endWeekIndex: chapterEnd,
      hoursPerWeek,
      isLocked: false,
      isPartialStart,
      isPartialEnd: hoursUsed > 0 && hoursUsed < weeklyHours,
    });
  });

  return assignments;
}

// ============================================
// Class 6 Section A - Has published plan (Jan, Feb, Mar)
// ============================================
const batch6ASubjects: SubjectPlanData[] = [
  {
    subjectId: "mat",
    subjectName: "Mathematics",
    weeklyHours: 6,
    totalPlannedHours: 48,
    chapterAssignments: createChapterAssignments([
      { id: "mat-ch1", name: "Knowing Our Numbers", hours: 8 },
      { id: "mat-ch2", name: "Whole Numbers", hours: 8 },
      { id: "mat-ch3", name: "Playing with Numbers", hours: 10 },
      { id: "mat-ch4", name: "Basic Geometrical Ideas", hours: 10 },
      { id: "mat-ch5", name: "Understanding Elementary Shapes", hours: 12 },
    ], 6, 0),
  },
  {
    subjectId: "sci",
    subjectName: "Science",
    weeklyHours: 5,
    totalPlannedHours: 45,
    chapterAssignments: createChapterAssignments([
      { id: "sci-ch1", name: "Food: Where Does It Come From?", hours: 6 },
      { id: "sci-ch2", name: "Components of Food", hours: 8 },
      { id: "sci-ch3", name: "Fibre to Fabric", hours: 7 },
      { id: "sci-ch4", name: "Sorting Materials into Groups", hours: 8 },
      { id: "sci-ch5", name: "Separation of Substances", hours: 8 },
      { id: "sci-ch6", name: "Changes Around Us", hours: 8 },
    ], 5, 0),
  },
  {
    subjectId: "eng",
    subjectName: "English",
    weeklyHours: 5,
    totalPlannedHours: 40,
    chapterAssignments: createChapterAssignments([
      { id: "eng-ch1", name: "Who Did Patrick's Homework?", hours: 6 },
      { id: "eng-ch2", name: "How the Dog Found Himself a New Master!", hours: 6 },
      { id: "eng-ch3", name: "Taro's Reward", hours: 7 },
      { id: "eng-ch4", name: "An Indian - American Woman in Space", hours: 7 },
      { id: "eng-ch5", name: "A Different Kind of School", hours: 7 },
      { id: "eng-ch6", name: "Who I Am", hours: 7 },
    ], 5, 0),
  },
  {
    subjectId: "hin",
    subjectName: "Hindi",
    weeklyHours: 4,
    totalPlannedHours: 32,
    chapterAssignments: createChapterAssignments([
      { id: "hin-ch1", name: "वह चिड़िया जो", hours: 5 },
      { id: "hin-ch2", name: "बचपन", hours: 5 },
      { id: "hin-ch3", name: "नादान दोस्त", hours: 6 },
      { id: "hin-ch4", name: "चाँद से थोड़ी सी गप्पें", hours: 5 },
      { id: "hin-ch5", name: "अक्षरों का महत्व", hours: 6 },
      { id: "hin-ch6", name: "पार नज़र के", hours: 5 },
    ], 4, 0),
  },
  {
    subjectId: "sst",
    subjectName: "Social Studies",
    weeklyHours: 4,
    totalPlannedHours: 36,
    chapterAssignments: createChapterAssignments([
      { id: "sst-ch1", name: "What, Where, How and When?", hours: 6 },
      { id: "sst-ch2", name: "From Hunting-Gathering to Growing Food", hours: 6 },
      { id: "sst-ch3", name: "In the Earliest Cities", hours: 6 },
      { id: "sst-ch4", name: "What Books and Burials Tell Us", hours: 6 },
      { id: "sst-ch5", name: "Kingdoms, Kings and an Early Republic", hours: 6 },
      { id: "sst-ch6", name: "New Questions and Ideas", hours: 6 },
    ], 4, 0),
  },
];

// ============================================
// Class 7 Section A - Draft plan (no published months)
// ============================================
const batch7ASubjects: SubjectPlanData[] = [
  {
    subjectId: "mat",
    subjectName: "Mathematics",
    weeklyHours: 6,
    totalPlannedHours: 54,
    chapterAssignments: createChapterAssignments([
      { id: "mat7-ch1", name: "Integers", hours: 10 },
      { id: "mat7-ch2", name: "Fractions and Decimals", hours: 12 },
      { id: "mat7-ch3", name: "Data Handling", hours: 8 },
      { id: "mat7-ch4", name: "Simple Equations", hours: 10 },
      { id: "mat7-ch5", name: "Lines and Angles", hours: 14 },
    ], 6, 0),
  },
  {
    subjectId: "sci",
    subjectName: "Science",
    weeklyHours: 5,
    totalPlannedHours: 50,
    chapterAssignments: createChapterAssignments([
      { id: "sci7-ch1", name: "Nutrition in Plants", hours: 8 },
      { id: "sci7-ch2", name: "Nutrition in Animals", hours: 8 },
      { id: "sci7-ch3", name: "Fibre to Fabric", hours: 6 },
      { id: "sci7-ch4", name: "Heat", hours: 10 },
      { id: "sci7-ch5", name: "Acids, Bases and Salts", hours: 10 },
      { id: "sci7-ch6", name: "Physical and Chemical Changes", hours: 8 },
    ], 5, 0),
  },
  {
    subjectId: "eng",
    subjectName: "English",
    weeklyHours: 5,
    totalPlannedHours: 42,
    chapterAssignments: createChapterAssignments([
      { id: "eng7-ch1", name: "Three Questions", hours: 7 },
      { id: "eng7-ch2", name: "A Gift of Chappals", hours: 7 },
      { id: "eng7-ch3", name: "Gopal and the Hilsa Fish", hours: 7 },
      { id: "eng7-ch4", name: "The Ashes That Made Trees Bloom", hours: 7 },
      { id: "eng7-ch5", name: "Quality", hours: 7 },
      { id: "eng7-ch6", name: "Expert Detectives", hours: 7 },
    ], 5, 0),
  },
  {
    subjectId: "hin",
    subjectName: "Hindi",
    weeklyHours: 4,
    totalPlannedHours: 36,
    chapterAssignments: createChapterAssignments([
      { id: "hin7-ch1", name: "हम पंछी उन्मुक्त गगन के", hours: 6 },
      { id: "hin7-ch2", name: "दादी माँ", hours: 6 },
      { id: "hin7-ch3", name: "हिमालय की बेटियाँ", hours: 6 },
      { id: "hin7-ch4", name: "कठपुतली", hours: 6 },
      { id: "hin7-ch5", name: "मिठाईवाला", hours: 6 },
      { id: "hin7-ch6", name: "रक्त और हमारा शरीर", hours: 6 },
    ], 4, 0),
  },
  {
    subjectId: "sst",
    subjectName: "Social Studies",
    weeklyHours: 4,
    totalPlannedHours: 40,
    chapterAssignments: createChapterAssignments([
      { id: "sst7-ch1", name: "Tracing Changes Through a Thousand Years", hours: 7 },
      { id: "sst7-ch2", name: "New Kings and Kingdoms", hours: 7 },
      { id: "sst7-ch3", name: "The Delhi Sultans", hours: 7 },
      { id: "sst7-ch4", name: "The Mughal Empire", hours: 7 },
      { id: "sst7-ch5", name: "Rulers and Buildings", hours: 6 },
      { id: "sst7-ch6", name: "Towns, Traders and Craftspersons", hours: 6 },
    ], 4, 0),
  },
];

// ============================================
// Class 10 Section A - Has published plan (Jan, Feb) + draft (Mar, Apr)
// ============================================
const batch10ASubjects: SubjectPlanData[] = [
  {
    subjectId: "phy",
    subjectName: "Physics",
    weeklyHours: 6,
    totalPlannedHours: 60,
    chapterAssignments: createChapterAssignments([
      { id: "phy10-ch1", name: "Light - Reflection and Refraction", hours: 14 },
      { id: "phy10-ch2", name: "Human Eye and Colourful World", hours: 10 },
      { id: "phy10-ch3", name: "Electricity", hours: 16 },
      { id: "phy10-ch4", name: "Magnetic Effects of Electric Current", hours: 12 },
      { id: "phy10-ch5", name: "Sources of Energy", hours: 8 },
    ], 6, 0),
  },
  {
    subjectId: "che",
    subjectName: "Chemistry",
    weeklyHours: 5,
    totalPlannedHours: 55,
    chapterAssignments: createChapterAssignments([
      { id: "che10-ch1", name: "Chemical Reactions and Equations", hours: 12 },
      { id: "che10-ch2", name: "Acids, Bases and Salts", hours: 12 },
      { id: "che10-ch3", name: "Metals and Non-metals", hours: 14 },
      { id: "che10-ch4", name: "Carbon and its Compounds", hours: 14 },
      { id: "che10-ch5", name: "Periodic Classification of Elements", hours: 8 },
    ], 5, 0),
  },
  {
    subjectId: "mat",
    subjectName: "Mathematics",
    weeklyHours: 6,
    totalPlannedHours: 66,
    chapterAssignments: createChapterAssignments([
      { id: "mat10-ch1", name: "Real Numbers", hours: 10 },
      { id: "mat10-ch2", name: "Polynomials", hours: 12 },
      { id: "mat10-ch3", name: "Pair of Linear Equations in Two Variables", hours: 14 },
      { id: "mat10-ch4", name: "Quadratic Equations", hours: 14 },
      { id: "mat10-ch5", name: "Arithmetic Progressions", hours: 8 },
      { id: "mat10-ch6", name: "Triangles", hours: 8 },
    ], 6, 0),
  },
  {
    subjectId: "bio",
    subjectName: "Biology",
    weeklyHours: 4,
    totalPlannedHours: 44,
    chapterAssignments: createChapterAssignments([
      { id: "bio10-ch1", name: "Life Processes", hours: 12 },
      { id: "bio10-ch2", name: "Control and Coordination", hours: 10 },
      { id: "bio10-ch3", name: "How do Organisms Reproduce?", hours: 10 },
      { id: "bio10-ch4", name: "Heredity and Evolution", hours: 12 },
    ], 4, 0),
  },
  {
    subjectId: "eng",
    subjectName: "English",
    weeklyHours: 4,
    totalPlannedHours: 40,
    chapterAssignments: createChapterAssignments([
      { id: "eng10-ch1", name: "A Letter to God", hours: 6 },
      { id: "eng10-ch2", name: "Nelson Mandela: Long Walk to Freedom", hours: 8 },
      { id: "eng10-ch3", name: "Two Stories about Flying", hours: 6 },
      { id: "eng10-ch4", name: "From the Diary of Anne Frank", hours: 8 },
      { id: "eng10-ch5", name: "The Hundred Dresses – I", hours: 6 },
      { id: "eng10-ch6", name: "The Hundred Dresses – II", hours: 6 },
    ], 4, 0),
  },
];

// ============================================
// Saved Plans Collection
// ============================================
export const savedAcademicPlans: SavedAcademicPlan[] = [
  {
    id: "plan-batch-6a-2025",
    batchId: "batch-6a",
    batchName: "Section A",
    className: "Class 6",
    academicYear: "2025-26",
    createdAt: "2025-04-01T10:00:00Z",
    lastModifiedAt: "2025-06-15T14:30:00Z",
    subjects: batch6ASubjects,
    startWeekIndex: 0,
    endWeekIndex: 15,
    publishedMonths: [0, 1, 2], // Jan, Feb, Mar published
    status: "published",
  },
  {
    id: "plan-batch-7a-2025",
    batchId: "batch-7a",
    batchName: "Section A",
    className: "Class 7",
    academicYear: "2025-26",
    createdAt: "2025-04-05T09:00:00Z",
    lastModifiedAt: "2025-04-05T09:00:00Z",
    subjects: batch7ASubjects,
    startWeekIndex: 0,
    endWeekIndex: 14,
    publishedMonths: [], // Draft only
    status: "draft",
  },
  {
    id: "plan-batch-10a-2025",
    batchId: "batch-10a",
    batchName: "Section A",
    className: "Class 10",
    academicYear: "2025-26",
    createdAt: "2025-03-28T08:00:00Z",
    lastModifiedAt: "2025-06-20T16:00:00Z",
    subjects: batch10ASubjects,
    startWeekIndex: 0,
    endWeekIndex: 18,
    publishedMonths: [0, 1], // Jan, Feb published
    status: "published",
  },
];

// ============================================
// Batch Plan Status - Quick overview for hub
// ============================================
export type PlanStatus = 'no_plan' | 'draft' | 'partial' | 'fully_published';

export interface BatchPlanSummary {
  batchId: string;
  batchName: string;
  className: string;
  status: PlanStatus;
  subjectCount: number;
  totalChapters: number;
  publishedMonthCount: number;
  lastModified: string | null;
  planId: string | null;
}

export function getBatchPlanSummary(batchId: string): BatchPlanSummary {
  const plan = savedAcademicPlans.find(p => p.batchId === batchId);
  
  if (!plan) {
    // Get batch info from our mock data
    const batchInfo = getBatchInfo(batchId);
    return {
      batchId,
      batchName: batchInfo.name,
      className: batchInfo.className,
      status: 'no_plan',
      subjectCount: 0,
      totalChapters: 0,
      publishedMonthCount: 0,
      lastModified: null,
      planId: null,
    };
  }

  const totalChapters = plan.subjects.reduce(
    (sum, s) => sum + s.chapterAssignments.length,
    0
  );

  let status: PlanStatus = 'draft';
  if (plan.publishedMonths.length > 0) {
    status = plan.publishedMonths.length >= 6 ? 'fully_published' : 'partial';
  }

  return {
    batchId,
    batchName: plan.batchName,
    className: plan.className,
    status,
    subjectCount: plan.subjects.length,
    totalChapters,
    publishedMonthCount: plan.publishedMonths.length,
    lastModified: plan.lastModifiedAt,
    planId: plan.id,
  };
}

// Helper to get batch info for batches without plans
function getBatchInfo(batchId: string): { name: string; className: string } {
  const batchMap: Record<string, { name: string; className: string }> = {
    "batch-6a": { name: "Section A", className: "Class 6" },
    "batch-6b": { name: "Section B", className: "Class 6" },
    "batch-7a": { name: "Section A", className: "Class 7" },
    "batch-7b": { name: "Section B", className: "Class 7" },
    "batch-8a": { name: "Section A", className: "Class 8" },
    "batch-8b": { name: "Section B", className: "Class 8" },
    "batch-9a": { name: "Section A", className: "Class 9" },
    "batch-9b": { name: "Section B", className: "Class 9" },
    "batch-10a": { name: "Section A", className: "Class 10" },
    "batch-10b": { name: "Section B", className: "Class 10" },
    "batch-11a": { name: "Section A", className: "Class 11" },
    "batch-12a": { name: "Section A", className: "Class 12" },
  };
  
  return batchMap[batchId] || { name: "Unknown", className: "Unknown" };
}

// ============================================
// Get all batch summaries for hub display
// ============================================
export const allBatchIds = [
  "batch-6a", "batch-6b",
  "batch-7a", "batch-7b",
  "batch-8a", "batch-8b",
  "batch-9a", "batch-9b",
  "batch-10a", "batch-10b",
  "batch-11a",
  "batch-12a",
];

export function getAllBatchPlanSummaries(): BatchPlanSummary[] {
  return allBatchIds.map(getBatchPlanSummary);
}

// ============================================
// Load/Save Plan Functions (mock implementations)
// ============================================
export function loadPlanForBatch(batchId: string): SavedAcademicPlan | null {
  return savedAcademicPlans.find(p => p.batchId === batchId) || null;
}

export function savePlan(plan: SavedAcademicPlan): void {
  const existingIndex = savedAcademicPlans.findIndex(p => p.batchId === plan.batchId);
  if (existingIndex >= 0) {
    savedAcademicPlans[existingIndex] = {
      ...plan,
      lastModifiedAt: new Date().toISOString(),
    };
  } else {
    savedAcademicPlans.push({
      ...plan,
      lastModifiedAt: new Date().toISOString(),
    });
  }
}

export function publishMonthForPlan(batchId: string, monthIndex: number): boolean {
  const plan = savedAcademicPlans.find(p => p.batchId === batchId);
  if (!plan) return false;
  
  if (!plan.publishedMonths.includes(monthIndex)) {
    plan.publishedMonths.push(monthIndex);
    plan.publishedMonths.sort((a, b) => a - b);
    plan.lastModifiedAt = new Date().toISOString();
  }
  return true;
}

// ============================================
// Week Editability Helpers
// ============================================
export function isWeekEditable(
  weekIndex: number,
  currentWeekIndex: number,
  publishedMonths: number[],
  weekStartDate: Date
): boolean {
  // Past weeks are not editable
  if (weekIndex < currentWeekIndex) {
    return false;
  }
  
  // Published months are not editable
  const weekMonth = weekStartDate.getMonth();
  if (publishedMonths.includes(weekMonth)) {
    return false;
  }
  
  return true;
}

export type WeekEditabilityStatus = 'editable' | 'past' | 'published';

export function getWeekEditabilityStatus(
  weekIndex: number,
  currentWeekIndex: number,
  publishedMonths: number[],
  weekStartDate: Date
): WeekEditabilityStatus {
  if (weekIndex < currentWeekIndex) {
    return 'past';
  }
  
  const weekMonth = weekStartDate.getMonth();
  if (publishedMonths.includes(weekMonth)) {
    return 'published';
  }
  
  return 'editable';
}
