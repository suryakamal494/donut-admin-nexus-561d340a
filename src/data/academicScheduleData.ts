// Comprehensive Mock Data for Academic Schedule Tracking
// Aligned with cbseMasterData using consistent class IDs:
// "1" = Class 6, "2" = Class 7, "3" = Class 8, "4" = Class 9, "5" = Class 10, "6" = Class 11, "7" = Class 12
// Date range: Jan 6 - Feb 28, 2025

import {
  AcademicScheduleSetup,
  WeeklyChapterPlan,
  TeachingConfirmation,
  ChapterProgress,
  SubjectProgress,
  BatchProgressSummary,
  PendingConfirmation,
  AcademicWeek,
  NoTeachReason,
  ScheduleAdjustment,
} from "@/types/academicSchedule";

// ============================================
// Helper: Generate Academic Weeks (Jan 2025 onwards)
// ============================================

export const generateAcademicWeeks = (startDate: string, numWeeks: number): AcademicWeek[] => {
  const weeks: AcademicWeek[] = [];
  const start = new Date(startDate);
  
  for (let i = 0; i < numWeeks; i++) {
    const weekStart = new Date(start);
    weekStart.setDate(start.getDate() + (i * 7));
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 5); // Monday to Saturday
    
    const formatDate = (d: Date) => {
      return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    };
    
    weeks.push({
      weekNumber: i + 1,
      startDate: weekStart.toISOString().split('T')[0],
      endDate: weekEnd.toISOString().split('T')[0],
      label: `Week ${i + 1} (${formatDate(weekStart)} - ${formatDate(weekEnd)})`,
    });
  }
  
  return weeks;
};

// Generate 40 weeks starting from Jan 6, 2025 (aligns with timetable)
export const academicWeeks = generateAcademicWeeks("2025-01-06", 40);
export const currentWeekIndex = 3; // Week 4: Jan 27 - Feb 1, 2025 (Weeks 1-3 are past, 4 is current, 5-8 are future)

// ============================================
// Academic Schedule Setups - Aligned with cbseMasterData
// Class IDs: "1"=6, "2"=7, "3"=8, "4"=9, "5"=10, "6"=11, "7"=12
// Subject IDs: "1"=Physics, "2"=Chemistry, "3"=Math, "4"=Biology, "5"=History, "8"=Hindi (matches cbseMasterData)
// ============================================

export const academicScheduleSetups: AcademicScheduleSetup[] = [
  // ========================
  // CLASS 6 (classId: "1") - Mathematics, History, Hindi, Science, English
  // ========================
  {
    id: "setup-c6-mat",
    courseId: "cbse",
    classId: "1",
    subjectId: "mat", // Mathematics
    subjectName: "Mathematics",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "mat-6-1", chapterName: "Knowing Our Numbers", plannedHours: 6, order: 1 },
      { chapterId: "mat-6-2", chapterName: "Whole Numbers", plannedHours: 5, order: 2 },
      { chapterId: "mat-6-3", chapterName: "Playing with Numbers", plannedHours: 6, order: 3 },
      { chapterId: "mat-6-4", chapterName: "Basic Geometrical Ideas", plannedHours: 5, order: 4 },
      { chapterId: "mat-6-5", chapterName: "Understanding Elementary Shapes", plannedHours: 6, order: 5 },
      { chapterId: "mat-6-6", chapterName: "Integers", plannedHours: 6, order: 6 },
      { chapterId: "mat-6-7", chapterName: "Fractions", plannedHours: 7, order: 7 },
      { chapterId: "mat-6-8", chapterName: "Decimals", plannedHours: 6, order: 8 },
    ],
    totalPlannedHours: 47,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c6-sci",
    courseId: "cbse",
    classId: "1",
    subjectId: "sci", // Science
    subjectName: "Science",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "sci-6-1", chapterName: "Food: Where Does It Come From?", plannedHours: 5, order: 1 },
      { chapterId: "sci-6-2", chapterName: "Components of Food", plannedHours: 5, order: 2 },
      { chapterId: "sci-6-3", chapterName: "Fibre to Fabric", plannedHours: 4, order: 3 },
      { chapterId: "sci-6-4", chapterName: "Sorting Materials into Groups", plannedHours: 5, order: 4 },
      { chapterId: "sci-6-5", chapterName: "Separation of Substances", plannedHours: 5, order: 5 },
    ],
    totalPlannedHours: 24,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c6-eng",
    courseId: "cbse",
    classId: "1",
    subjectId: "eng", // English
    subjectName: "English",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "eng-6-1", chapterName: "Who Did Patrick's Homework?", plannedHours: 4, order: 1 },
      { chapterId: "eng-6-2", chapterName: "How the Dog Found Himself a New Master!", plannedHours: 4, order: 2 },
      { chapterId: "eng-6-3", chapterName: "Taro's Reward", plannedHours: 4, order: 3 },
      { chapterId: "eng-6-4", chapterName: "An Indian-American Woman in Space", plannedHours: 5, order: 4 },
    ],
    totalPlannedHours: 17,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c6-hin",
    courseId: "cbse",
    classId: "1",
    subjectId: "hin", // Hindi
    subjectName: "Hindi",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "hin-6-1", chapterName: "वह चिड़िया जो (Vah Chidiya Jo)", plannedHours: 4, order: 1 },
      { chapterId: "hin-6-2", chapterName: "बचपन (Bachpan)", plannedHours: 4, order: 2 },
      { chapterId: "hin-6-3", chapterName: "नादान दोस्त (Naadan Dost)", plannedHours: 5, order: 3 },
      { chapterId: "hin-6-4", chapterName: "चाँद से थोड़ी सी गप्पें (Chand Se Thodi Si Gappen)", plannedHours: 4, order: 4 },
    ],
    totalPlannedHours: 17,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c6-sst",
    courseId: "cbse",
    classId: "1",
    subjectId: "sst", // Social Studies
    subjectName: "Social Studies",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "sst-6-1", chapterName: "What, Where, How and When?", plannedHours: 4, order: 1 },
      { chapterId: "sst-6-2", chapterName: "From Hunting-Gathering to Growing Food", plannedHours: 5, order: 2 },
      { chapterId: "sst-6-3", chapterName: "In the Earliest Cities", plannedHours: 5, order: 3 },
      { chapterId: "sst-6-4", chapterName: "What Books and Burials Tell Us", plannedHours: 4, order: 4 },
    ],
    totalPlannedHours: 18,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },

  // ========================
  // CLASS 7 (classId: "2") - Mathematics, Science, English, Hindi, SST
  // ========================
  {
    id: "setup-c7-mat",
    courseId: "cbse",
    classId: "2",
    subjectId: "mat", // Mathematics
    subjectName: "Mathematics",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "mat-7-1", chapterName: "Integers", plannedHours: 6, order: 1 },
      { chapterId: "mat-7-2", chapterName: "Fractions and Decimals", plannedHours: 6, order: 2 },
      { chapterId: "mat-7-3", chapterName: "Data Handling", plannedHours: 5, order: 3 },
      { chapterId: "mat-7-4", chapterName: "Simple Equations", plannedHours: 6, order: 4 },
      { chapterId: "mat-7-5", chapterName: "Lines and Angles", plannedHours: 6, order: 5 },
      { chapterId: "mat-7-6", chapterName: "The Triangle and Its Properties", plannedHours: 6, order: 6 },
    ],
    totalPlannedHours: 35,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c7-sci",
    courseId: "cbse",
    classId: "2",
    subjectId: "sci", // Science
    subjectName: "Science",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "sci-7-1", chapterName: "Nutrition in Plants", plannedHours: 5, order: 1 },
      { chapterId: "sci-7-2", chapterName: "Nutrition in Animals", plannedHours: 5, order: 2 },
      { chapterId: "sci-7-3", chapterName: "Fibre to Fabric", plannedHours: 4, order: 3 },
      { chapterId: "sci-7-4", chapterName: "Heat", plannedHours: 6, order: 4 },
      { chapterId: "sci-7-5", chapterName: "Acids, Bases and Salts", plannedHours: 5, order: 5 },
    ],
    totalPlannedHours: 25,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c7-eng",
    courseId: "cbse",
    classId: "2",
    subjectId: "eng", // English
    subjectName: "English",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "eng-7-1", chapterName: "Three Questions", plannedHours: 4, order: 1 },
      { chapterId: "eng-7-2", chapterName: "A Gift of Chappals", plannedHours: 5, order: 2 },
      { chapterId: "eng-7-3", chapterName: "Gopal and the Hilsa Fish", plannedHours: 4, order: 3 },
      { chapterId: "eng-7-4", chapterName: "The Ashes That Made Trees Bloom", plannedHours: 5, order: 4 },
    ],
    totalPlannedHours: 18,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c7-hin",
    courseId: "cbse",
    classId: "2",
    subjectId: "hin", // Hindi
    subjectName: "Hindi",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "hin-7-1", chapterName: "हम पंछी उन्मुक्त गगन के (Hum Panchhi Unmukt Gagan Ke)", plannedHours: 4, order: 1 },
      { chapterId: "hin-7-2", chapterName: "दादी माँ (Dadi Maa)", plannedHours: 5, order: 2 },
      { chapterId: "hin-7-3", chapterName: "हिमालय की बेटियाँ (Himalaya Ki Betiyan)", plannedHours: 4, order: 3 },
      { chapterId: "hin-7-4", chapterName: "कठपुतली (Kathputli)", plannedHours: 4, order: 4 },
    ],
    totalPlannedHours: 17,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c7-sst",
    courseId: "cbse",
    classId: "2",
    subjectId: "sst", // Social Studies
    subjectName: "Social Studies",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "sst-7-1", chapterName: "Tracing Changes Through a Thousand Years", plannedHours: 5, order: 1 },
      { chapterId: "sst-7-2", chapterName: "New Kings and Kingdoms", plannedHours: 5, order: 2 },
      { chapterId: "sst-7-3", chapterName: "The Delhi Sultans", plannedHours: 6, order: 3 },
      { chapterId: "sst-7-4", chapterName: "The Mughal Empire", plannedHours: 6, order: 4 },
    ],
    totalPlannedHours: 22,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },

  // ========================
  // CLASS 8 (classId: "3") - Mathematics, Science, English, Hindi, SST
  // ========================
  {
    id: "setup-c8-mat",
    courseId: "cbse",
    classId: "3",
    subjectId: "mat", // Mathematics
    subjectName: "Mathematics",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "mat-8-1", chapterName: "Rational Numbers", plannedHours: 6, order: 1 },
      { chapterId: "mat-8-2", chapterName: "Linear Equations in One Variable", plannedHours: 7, order: 2 },
      { chapterId: "mat-8-3", chapterName: "Understanding Quadrilaterals", plannedHours: 6, order: 3 },
      { chapterId: "mat-8-4", chapterName: "Practical Geometry", plannedHours: 5, order: 4 },
      { chapterId: "mat-8-5", chapterName: "Data Handling", plannedHours: 6, order: 5 },
      { chapterId: "mat-8-6", chapterName: "Squares and Square Roots", plannedHours: 6, order: 6 },
    ],
    totalPlannedHours: 36,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c8-sci",
    courseId: "cbse",
    classId: "3",
    subjectId: "sci", // Science
    subjectName: "Science",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "sci-8-1", chapterName: "Crop Production and Management", plannedHours: 5, order: 1 },
      { chapterId: "sci-8-2", chapterName: "Microorganisms: Friend and Foe", plannedHours: 6, order: 2 },
      { chapterId: "sci-8-3", chapterName: "Synthetic Fibres and Plastics", plannedHours: 5, order: 3 },
      { chapterId: "sci-8-4", chapterName: "Materials: Metals and Non-Metals", plannedHours: 6, order: 4 },
      { chapterId: "sci-8-5", chapterName: "Coal and Petroleum", plannedHours: 5, order: 5 },
    ],
    totalPlannedHours: 27,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c8-eng",
    courseId: "cbse",
    classId: "3",
    subjectId: "eng", // English
    subjectName: "English",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "eng-8-1", chapterName: "The Best Christmas Present in the World", plannedHours: 5, order: 1 },
      { chapterId: "eng-8-2", chapterName: "The Tsunami", plannedHours: 5, order: 2 },
      { chapterId: "eng-8-3", chapterName: "Glimpses of the Past", plannedHours: 5, order: 3 },
      { chapterId: "eng-8-4", chapterName: "Bepin Choudhury's Lapse of Memory", plannedHours: 5, order: 4 },
    ],
    totalPlannedHours: 20,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c8-hin",
    courseId: "cbse",
    classId: "3",
    subjectId: "hin", // Hindi
    subjectName: "Hindi",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "hin-8-1", chapterName: "ध्वनि (Dhwani)", plannedHours: 4, order: 1 },
      { chapterId: "hin-8-2", chapterName: "लाख की चूड़ियाँ (Lakh Ki Chudiyan)", plannedHours: 5, order: 2 },
      { chapterId: "hin-8-3", chapterName: "बस की यात्रा (Bus Ki Yatra)", plannedHours: 4, order: 3 },
      { chapterId: "hin-8-4", chapterName: "दीवानों की हस्ती (Diwanon Ki Hasti)", plannedHours: 4, order: 4 },
    ],
    totalPlannedHours: 17,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c8-sst",
    courseId: "cbse",
    classId: "3",
    subjectId: "sst", // Social Studies
    subjectName: "Social Studies",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "sst-8-1", chapterName: "How, When and Where", plannedHours: 4, order: 1 },
      { chapterId: "sst-8-2", chapterName: "From Trade to Territory", plannedHours: 5, order: 2 },
      { chapterId: "sst-8-3", chapterName: "Ruling the Countryside", plannedHours: 5, order: 3 },
      { chapterId: "sst-8-4", chapterName: "Tribals, Dikus and the Vision of a Golden Age", plannedHours: 5, order: 4 },
    ],
    totalPlannedHours: 19,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },

  // ========================
  // CLASS 9 (classId: "4") - Physics, Chemistry, Mathematics, Biology, English, Hindi, SST
  // ========================
  {
    id: "setup-c9-phy",
    courseId: "cbse",
    classId: "4",
    subjectId: "phy", // Physics
    subjectName: "Physics",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "phy-9-1", chapterName: "Motion", plannedHours: 8, order: 1 },
      { chapterId: "phy-9-2", chapterName: "Force and Laws of Motion", plannedHours: 8, order: 2 },
      { chapterId: "phy-9-3", chapterName: "Gravitation", plannedHours: 7, order: 3 },
      { chapterId: "phy-9-4", chapterName: "Work and Energy", plannedHours: 8, order: 4 },
      { chapterId: "phy-9-5", chapterName: "Sound", plannedHours: 7, order: 5 },
    ],
    totalPlannedHours: 38,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c9-che",
    courseId: "cbse",
    classId: "4",
    subjectId: "che", // Chemistry
    subjectName: "Chemistry",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "che-9-1", chapterName: "Matter in Our Surroundings", plannedHours: 6, order: 1 },
      { chapterId: "che-9-2", chapterName: "Is Matter Around Us Pure?", plannedHours: 7, order: 2 },
      { chapterId: "che-9-3", chapterName: "Atoms and Molecules", plannedHours: 8, order: 3 },
      { chapterId: "che-9-4", chapterName: "Structure of the Atom", plannedHours: 7, order: 4 },
    ],
    totalPlannedHours: 28,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c9-mat",
    courseId: "cbse",
    classId: "4",
    subjectId: "mat", // Mathematics
    subjectName: "Mathematics",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "mat-9-1", chapterName: "Number Systems", plannedHours: 8, order: 1 },
      { chapterId: "mat-9-2", chapterName: "Polynomials", plannedHours: 7, order: 2 },
      { chapterId: "mat-9-3", chapterName: "Coordinate Geometry", plannedHours: 6, order: 3 },
      { chapterId: "mat-9-4", chapterName: "Linear Equations in Two Variables", plannedHours: 8, order: 4 },
      { chapterId: "mat-9-5", chapterName: "Introduction to Euclid's Geometry", plannedHours: 5, order: 5 },
      { chapterId: "mat-9-6", chapterName: "Lines and Angles", plannedHours: 6, order: 6 },
    ],
    totalPlannedHours: 40,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c9-bio",
    courseId: "cbse",
    classId: "4",
    subjectId: "bio", // Biology
    subjectName: "Biology",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "bio-9-1", chapterName: "The Fundamental Unit of Life", plannedHours: 6, order: 1 },
      { chapterId: "bio-9-2", chapterName: "Tissues", plannedHours: 6, order: 2 },
      { chapterId: "bio-9-3", chapterName: "Diversity in Living Organisms", plannedHours: 7, order: 3 },
      { chapterId: "bio-9-4", chapterName: "Why Do We Fall Ill?", plannedHours: 6, order: 4 },
    ],
    totalPlannedHours: 25,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c9-eng",
    courseId: "cbse",
    classId: "4",
    subjectId: "eng", // English
    subjectName: "English",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "eng-9-1", chapterName: "The Fun They Had", plannedHours: 4, order: 1 },
      { chapterId: "eng-9-2", chapterName: "The Sound of Music", plannedHours: 5, order: 2 },
      { chapterId: "eng-9-3", chapterName: "The Little Girl", plannedHours: 4, order: 3 },
      { chapterId: "eng-9-4", chapterName: "A Truly Beautiful Mind", plannedHours: 5, order: 4 },
    ],
    totalPlannedHours: 18,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c9-hin",
    courseId: "cbse",
    classId: "4",
    subjectId: "hin", // Hindi
    subjectName: "Hindi",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "hin-9-1", chapterName: "दो बैलों की कथा (Do Bailon Ki Katha)", plannedHours: 5, order: 1 },
      { chapterId: "hin-9-2", chapterName: "ल्हासा की ओर (Lhasa Ki Or)", plannedHours: 5, order: 2 },
      { chapterId: "hin-9-3", chapterName: "उपभोक्तावाद की संस्कृति (Upbhoktawad Ki Sanskriti)", plannedHours: 5, order: 3 },
      { chapterId: "hin-9-4", chapterName: "साँवले सपनों की याद (Sanwle Sapnon Ki Yaad)", plannedHours: 4, order: 4 },
    ],
    totalPlannedHours: 19,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c9-sst",
    courseId: "cbse",
    classId: "4",
    subjectId: "sst", // Social Studies
    subjectName: "Social Studies",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "sst-9-1", chapterName: "The French Revolution", plannedHours: 8, order: 1 },
      { chapterId: "sst-9-2", chapterName: "Socialism in Europe and the Russian Revolution", plannedHours: 7, order: 2 },
      { chapterId: "sst-9-3", chapterName: "Nazism and the Rise of Hitler", plannedHours: 7, order: 3 },
      { chapterId: "sst-9-4", chapterName: "Forest Society and Colonialism", plannedHours: 6, order: 4 },
    ],
    totalPlannedHours: 28,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },

  // ========================
  // CLASS 10 (classId: "5") - Physics, Chemistry, Mathematics, Biology, English, Hindi
  // ========================
  {
    id: "setup-c10-phy",
    courseId: "cbse",
    classId: "5",
    subjectId: "phy", // Physics
    subjectName: "Physics",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "phy-10-1", chapterName: "Light - Reflection and Refraction", plannedHours: 10, order: 1 },
      { chapterId: "phy-10-2", chapterName: "Human Eye and the Colourful World", plannedHours: 6, order: 2 },
      { chapterId: "phy-10-3", chapterName: "Electricity", plannedHours: 12, order: 3 },
      { chapterId: "phy-10-4", chapterName: "Magnetic Effects of Electric Current", plannedHours: 10, order: 4 },
      { chapterId: "phy-10-5", chapterName: "Sources of Energy", plannedHours: 6, order: 5 },
    ],
    totalPlannedHours: 44,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c10-che",
    courseId: "cbse",
    classId: "5",
    subjectId: "che", // Chemistry
    subjectName: "Chemistry",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "che-10-1", chapterName: "Chemical Reactions and Equations", plannedHours: 8, order: 1 },
      { chapterId: "che-10-2", chapterName: "Acids, Bases and Salts", plannedHours: 8, order: 2 },
      { chapterId: "che-10-3", chapterName: "Metals and Non-metals", plannedHours: 10, order: 3 },
      { chapterId: "che-10-4", chapterName: "Carbon and its Compounds", plannedHours: 12, order: 4 },
      { chapterId: "che-10-5", chapterName: "Periodic Classification of Elements", plannedHours: 6, order: 5 },
    ],
    totalPlannedHours: 44,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c10-mat",
    courseId: "cbse",
    classId: "5",
    subjectId: "mat", // Mathematics
    subjectName: "Mathematics",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "mat-10-1", chapterName: "Real Numbers", plannedHours: 8, order: 1 },
      { chapterId: "mat-10-2", chapterName: "Polynomials", plannedHours: 6, order: 2 },
      { chapterId: "mat-10-3", chapterName: "Pair of Linear Equations in Two Variables", plannedHours: 10, order: 3 },
      { chapterId: "mat-10-4", chapterName: "Quadratic Equations", plannedHours: 10, order: 4 },
      { chapterId: "mat-10-5", chapterName: "Arithmetic Progressions", plannedHours: 8, order: 5 },
      { chapterId: "mat-10-6", chapterName: "Triangles", plannedHours: 10, order: 6 },
    ],
    totalPlannedHours: 52,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c10-bio",
    courseId: "cbse",
    classId: "5",
    subjectId: "bio", // Biology
    subjectName: "Biology",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "bio-10-1", chapterName: "Life Processes", plannedHours: 10, order: 1 },
      { chapterId: "bio-10-2", chapterName: "Control and Coordination", plannedHours: 8, order: 2 },
      { chapterId: "bio-10-3", chapterName: "How do Organisms Reproduce?", plannedHours: 10, order: 3 },
      { chapterId: "bio-10-4", chapterName: "Heredity and Evolution", plannedHours: 10, order: 4 },
    ],
    totalPlannedHours: 38,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c10-eng",
    courseId: "cbse",
    classId: "5",
    subjectId: "eng", // English
    subjectName: "English",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "eng-10-1", chapterName: "A Letter to God", plannedHours: 4, order: 1 },
      { chapterId: "eng-10-2", chapterName: "Nelson Mandela: Long Walk to Freedom", plannedHours: 5, order: 2 },
      { chapterId: "eng-10-3", chapterName: "Two Stories about Flying", plannedHours: 5, order: 3 },
      { chapterId: "eng-10-4", chapterName: "From the Diary of Anne Frank", plannedHours: 5, order: 4 },
    ],
    totalPlannedHours: 19,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c10-hin",
    courseId: "cbse",
    classId: "5",
    subjectId: "hin", // Hindi
    subjectName: "Hindi",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "hin-10-1", chapterName: "सूरदास (Surdas)", plannedHours: 5, order: 1 },
      { chapterId: "hin-10-2", chapterName: "तुलसीदास (Tulsidas)", plannedHours: 5, order: 2 },
      { chapterId: "hin-10-3", chapterName: "देव (Dev)", plannedHours: 4, order: 3 },
      { chapterId: "hin-10-4", chapterName: "जयशंकर प्रसाद (Jaishankar Prasad)", plannedHours: 5, order: 4 },
    ],
    totalPlannedHours: 19,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },

  // ========================
  // CLASS 11 (classId: "6") - Physics, Chemistry, Mathematics, Biology
  // ========================
  {
    id: "setup-c11-phy",
    courseId: "cbse",
    classId: "6",
    subjectId: "phy", // Physics
    subjectName: "Physics",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "phy-11-1", chapterName: "Physical World", plannedHours: 4, order: 1 },
      { chapterId: "phy-11-2", chapterName: "Units and Measurements", plannedHours: 8, order: 2 },
      { chapterId: "phy-11-3", chapterName: "Motion in a Straight Line", plannedHours: 10, order: 3 },
      { chapterId: "phy-11-4", chapterName: "Motion in a Plane", plannedHours: 12, order: 4 },
      { chapterId: "phy-11-5", chapterName: "Laws of Motion", plannedHours: 12, order: 5 },
    ],
    totalPlannedHours: 46,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c11-che",
    courseId: "cbse",
    classId: "6",
    subjectId: "che", // Chemistry
    subjectName: "Chemistry",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "che-11-1", chapterName: "Some Basic Concepts of Chemistry", plannedHours: 8, order: 1 },
      { chapterId: "che-11-2", chapterName: "Structure of Atom", plannedHours: 10, order: 2 },
      { chapterId: "che-11-3", chapterName: "Classification of Elements and Periodicity", plannedHours: 8, order: 3 },
      { chapterId: "che-11-4", chapterName: "Chemical Bonding and Molecular Structure", plannedHours: 12, order: 4 },
      { chapterId: "che-11-5", chapterName: "States of Matter", plannedHours: 8, order: 5 },
    ],
    totalPlannedHours: 46,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c11-mat",
    courseId: "cbse",
    classId: "6",
    subjectId: "mat", // Mathematics
    subjectName: "Mathematics",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "mat-11-1", chapterName: "Sets", plannedHours: 8, order: 1 },
      { chapterId: "mat-11-2", chapterName: "Relations and Functions", plannedHours: 10, order: 2 },
      { chapterId: "mat-11-3", chapterName: "Trigonometric Functions", plannedHours: 12, order: 3 },
      { chapterId: "mat-11-4", chapterName: "Principle of Mathematical Induction", plannedHours: 6, order: 4 },
      { chapterId: "mat-11-5", chapterName: "Complex Numbers and Quadratic Equations", plannedHours: 10, order: 5 },
    ],
    totalPlannedHours: 46,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c11-bio",
    courseId: "cbse",
    classId: "6",
    subjectId: "bio", // Biology
    subjectName: "Biology",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "bio-11-1", chapterName: "The Living World", plannedHours: 6, order: 1 },
      { chapterId: "bio-11-2", chapterName: "Biological Classification", plannedHours: 8, order: 2 },
      { chapterId: "bio-11-3", chapterName: "Plant Kingdom", plannedHours: 10, order: 3 },
      { chapterId: "bio-11-4", chapterName: "Animal Kingdom", plannedHours: 12, order: 4 },
    ],
    totalPlannedHours: 36,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },

  // ========================
  // CLASS 12 (classId: "7") - Physics, Chemistry, Mathematics, Biology
  // ========================
  {
    id: "setup-c12-phy",
    courseId: "cbse",
    classId: "7",
    subjectId: "phy", // Physics
    subjectName: "Physics",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "phy-12-1", chapterName: "Electric Charges and Fields", plannedHours: 10, order: 1 },
      { chapterId: "phy-12-2", chapterName: "Electrostatic Potential and Capacitance", plannedHours: 12, order: 2 },
      { chapterId: "phy-12-3", chapterName: "Current Electricity", plannedHours: 14, order: 3 },
      { chapterId: "phy-12-4", chapterName: "Moving Charges and Magnetism", plannedHours: 12, order: 4 },
      { chapterId: "phy-12-5", chapterName: "Magnetism and Matter", plannedHours: 8, order: 5 },
    ],
    totalPlannedHours: 56,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c12-che",
    courseId: "cbse",
    classId: "7",
    subjectId: "che", // Chemistry
    subjectName: "Chemistry",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "che-12-1", chapterName: "The Solid State", plannedHours: 8, order: 1 },
      { chapterId: "che-12-2", chapterName: "Solutions", plannedHours: 10, order: 2 },
      { chapterId: "che-12-3", chapterName: "Electrochemistry", plannedHours: 12, order: 3 },
      { chapterId: "che-12-4", chapterName: "Chemical Kinetics", plannedHours: 10, order: 4 },
      { chapterId: "che-12-5", chapterName: "Surface Chemistry", plannedHours: 8, order: 5 },
    ],
    totalPlannedHours: 48,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c12-mat",
    courseId: "cbse",
    classId: "7",
    subjectId: "mat", // Mathematics
    subjectName: "Mathematics",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "mat-12-1", chapterName: "Relations and Functions", plannedHours: 10, order: 1 },
      { chapterId: "mat-12-2", chapterName: "Inverse Trigonometric Functions", plannedHours: 8, order: 2 },
      { chapterId: "mat-12-3", chapterName: "Matrices", plannedHours: 12, order: 3 },
      { chapterId: "mat-12-4", chapterName: "Determinants", plannedHours: 12, order: 4 },
      { chapterId: "mat-12-5", chapterName: "Continuity and Differentiability", plannedHours: 14, order: 5 },
      { chapterId: "mat-12-6", chapterName: "Applications of Derivatives", plannedHours: 14, order: 6 },
      { chapterId: "mat-12-7", chapterName: "Integrals", plannedHours: 16, order: 7 },
      { chapterId: "mat-12-8", chapterName: "Applications of Integrals", plannedHours: 10, order: 8 },
      { chapterId: "mat-12-9", chapterName: "Differential Equations", plannedHours: 12, order: 9 },
      { chapterId: "mat-12-10", chapterName: "Vector Algebra", plannedHours: 10, order: 10 },
      { chapterId: "mat-12-11", chapterName: "Three Dimensional Geometry", plannedHours: 12, order: 11 },
      { chapterId: "mat-12-12", chapterName: "Linear Programming", plannedHours: 8, order: 12 },
      { chapterId: "mat-12-13", chapterName: "Probability", plannedHours: 12, order: 13 },
    ],
    totalPlannedHours: 150,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c12-bio",
    courseId: "cbse",
    classId: "7",
    subjectId: "bio", // Biology
    subjectName: "Biology",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "bio-12-1", chapterName: "Reproduction in Organisms", plannedHours: 8, order: 1 },
      { chapterId: "bio-12-2", chapterName: "Sexual Reproduction in Flowering Plants", plannedHours: 12, order: 2 },
      { chapterId: "bio-12-3", chapterName: "Human Reproduction", plannedHours: 12, order: 3 },
      { chapterId: "bio-12-4", chapterName: "Reproductive Health", plannedHours: 8, order: 4 },
    ],
    totalPlannedHours: 40,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },

  // ========================
  // JEE Mains Setups (Class 11 & 12 - courseId: "jee-mains")
  // ========================
  {
    id: "setup-jee11-phy",
    courseId: "jee-mains",
    classId: "6",
    subjectId: "jee_phy",
    subjectName: "JEE Physics",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "jee-phy-11-1", chapterName: "Units, Dimensions & Measurements", plannedHours: 8, order: 1 },
      { chapterId: "jee-phy-11-2", chapterName: "Kinematics", plannedHours: 12, order: 2 },
      { chapterId: "jee-phy-11-3", chapterName: "Laws of Motion", plannedHours: 14, order: 3 },
      { chapterId: "jee-phy-11-4", chapterName: "Work, Energy and Power", plannedHours: 12, order: 4 },
    ],
    totalPlannedHours: 46,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-jee11-che",
    courseId: "jee-mains",
    classId: "6",
    subjectId: "jee_che",
    subjectName: "JEE Chemistry",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "jee-che-11-1", chapterName: "Some Basic Concepts of Chemistry", plannedHours: 10, order: 1 },
      { chapterId: "jee-che-11-2", chapterName: "Atomic Structure", plannedHours: 14, order: 2 },
      { chapterId: "jee-che-11-3", chapterName: "Chemical Bonding", plannedHours: 16, order: 3 },
      { chapterId: "jee-che-11-4", chapterName: "Thermodynamics", plannedHours: 12, order: 4 },
    ],
    totalPlannedHours: 52,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-jee11-mat",
    courseId: "jee-mains",
    classId: "6",
    subjectId: "jee_mat",
    subjectName: "JEE Mathematics",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "jee-mat-11-1", chapterName: "Sets and Relations", plannedHours: 8, order: 1 },
      { chapterId: "jee-mat-11-2", chapterName: "Complex Numbers", plannedHours: 12, order: 2 },
      { chapterId: "jee-mat-11-3", chapterName: "Quadratic Equations", plannedHours: 10, order: 3 },
      { chapterId: "jee-mat-11-4", chapterName: "Permutations and Combinations", plannedHours: 12, order: 4 },
    ],
    totalPlannedHours: 42,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-jee12-phy",
    courseId: "jee-mains",
    classId: "7",
    subjectId: "jee_phy",
    subjectName: "JEE Physics",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "jee-phy-12-1", chapterName: "Electrostatics", plannedHours: 16, order: 1 },
      { chapterId: "jee-phy-12-2", chapterName: "Current Electricity", plannedHours: 14, order: 2 },
      { chapterId: "jee-phy-12-3", chapterName: "Magnetic Effects of Current", plannedHours: 16, order: 3 },
      { chapterId: "jee-phy-12-4", chapterName: "Electromagnetic Induction", plannedHours: 12, order: 4 },
    ],
    totalPlannedHours: 58,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-jee12-che",
    courseId: "jee-mains",
    classId: "7",
    subjectId: "jee_che",
    subjectName: "JEE Chemistry",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "jee-che-12-1", chapterName: "Solid State", plannedHours: 10, order: 1 },
      { chapterId: "jee-che-12-2", chapterName: "Solutions", plannedHours: 12, order: 2 },
      { chapterId: "jee-che-12-3", chapterName: "Electrochemistry", plannedHours: 14, order: 3 },
      { chapterId: "jee-che-12-4", chapterName: "Chemical Kinetics", plannedHours: 12, order: 4 },
    ],
    totalPlannedHours: 48,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-jee12-mat",
    courseId: "jee-mains",
    classId: "7",
    subjectId: "jee_mat",
    subjectName: "JEE Mathematics",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "jee-mat-12-1", chapterName: "Relations and Functions", plannedHours: 14, order: 1 },
      { chapterId: "jee-mat-12-2", chapterName: "Inverse Trigonometric Functions", plannedHours: 12, order: 2 },
      { chapterId: "jee-mat-12-3", chapterName: "Matrices and Determinants", plannedHours: 16, order: 3 },
      { chapterId: "jee-mat-12-4", chapterName: "Differential Calculus", plannedHours: 18, order: 4 },
    ],
    totalPlannedHours: 60,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
];

// ============================================
// Weekly Chapter Plans - Aligned with instituteData batch IDs
// Week 1-3: Past (completed), Week 4: Current, Week 5-8: Future
// Batch IDs from instituteData: batch-6a, batch-6b, batch-7a, batch-8a, batch-9a, batch-10a, etc.
// ============================================

export const weeklyChapterPlans: WeeklyChapterPlan[] = [
  // ========================
  // WEEK 1: Jan 6-11, 2025 (PAST - Completed)
  // ========================
  // Class 6 - Section A
  { id: "plan-w1-6a-mat", batchId: "batch-6a", batchName: "Class 6 - Section A", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["mat-6-1"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w1-6a-sci", batchId: "batch-6a", batchName: "Class 6 - Section A", subjectId: "sci", subjectName: "Science", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["sci-6-1"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w1-6a-eng", batchId: "batch-6a", batchName: "Class 6 - Section A", subjectId: "eng", subjectName: "English", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["eng-6-1"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w1-6a-hin", batchId: "batch-6a", batchName: "Class 6 - Section A", subjectId: "hin", subjectName: "Hindi", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["hin-6-1"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w1-6a-sst", batchId: "batch-6a", batchName: "Class 6 - Section A", subjectId: "sst", subjectName: "Social Studies", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["sst-6-1"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Class 7 - Section A
  { id: "plan-w1-7a-mat", batchId: "batch-7a", batchName: "Class 7 - Section A", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["mat-7-1"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w1-7a-sci", batchId: "batch-7a", batchName: "Class 7 - Section A", subjectId: "sci", subjectName: "Science", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["sci-7-1"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w1-7a-eng", batchId: "batch-7a", batchName: "Class 7 - Section A", subjectId: "eng", subjectName: "English", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["eng-7-1"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w1-7a-hin", batchId: "batch-7a", batchName: "Class 7 - Section A", subjectId: "hin", subjectName: "Hindi", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["hin-7-1"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Class 8 - Section A
  { id: "plan-w1-8a-mat", batchId: "batch-8a", batchName: "Class 8 - Section A", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["mat-8-1"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w1-8a-sci", batchId: "batch-8a", batchName: "Class 8 - Section A", subjectId: "sci", subjectName: "Science", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["sci-8-1", "sci-8-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w1-8a-eng", batchId: "batch-8a", batchName: "Class 8 - Section A", subjectId: "eng", subjectName: "English", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["eng-8-1"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Class 9 - Section A
  { id: "plan-w1-9a-phy", batchId: "batch-9a", batchName: "Class 9 - Section A", subjectId: "phy", subjectName: "Physics", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["phy-9-1"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w1-9a-che", batchId: "batch-9a", batchName: "Class 9 - Section A", subjectId: "che", subjectName: "Chemistry", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["che-9-1"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w1-9a-mat", batchId: "batch-9a", batchName: "Class 9 - Section A", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["mat-9-1"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w1-9a-bio", batchId: "batch-9a", batchName: "Class 9 - Section A", subjectId: "bio", subjectName: "Biology", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["bio-9-1"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w1-9a-eng", batchId: "batch-9a", batchName: "Class 9 - Section A", subjectId: "eng", subjectName: "English", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["eng-9-1"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w1-9a-hin", batchId: "batch-9a", batchName: "Class 9 - Section A", subjectId: "hin", subjectName: "Hindi", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["hin-9-1"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Class 10 - Section A
  { id: "plan-w1-10a-phy", batchId: "batch-10a", batchName: "Class 10 - Section A", subjectId: "phy", subjectName: "Physics", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["phy-10-1"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w1-10a-che", batchId: "batch-10a", batchName: "Class 10 - Section A", subjectId: "che", subjectName: "Chemistry", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["che-10-1"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w1-10a-mat", batchId: "batch-10a", batchName: "Class 10 - Section A", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["mat-10-1"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w1-10a-bio", batchId: "batch-10a", batchName: "Class 10 - Section A", subjectId: "bio", subjectName: "Biology", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["bio-10-1"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w1-10a-eng", batchId: "batch-10a", batchName: "Class 10 - Section A", subjectId: "eng", subjectName: "English", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["eng-10-1"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Class 11 - Section A
  { id: "plan-w1-11a-phy", batchId: "batch-11a", batchName: "Class 11 - Section A", subjectId: "phy", subjectName: "Physics", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["phy-11-1", "phy-11-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w1-11a-che", batchId: "batch-11a", batchName: "Class 11 - Section A", subjectId: "che", subjectName: "Chemistry", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["che-11-1"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w1-11a-mat", batchId: "batch-11a", batchName: "Class 11 - Section A", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["mat-11-1"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // JEE 11
  { id: "plan-w1-jee11-phy", batchId: "jee-11", batchName: "JEE 11", subjectId: "jee_phy", subjectName: "JEE Physics", courseId: "jee-mains", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["jee-phy-11-1"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w1-jee11-che", batchId: "jee-11", batchName: "JEE 11", subjectId: "jee_che", subjectName: "JEE Chemistry", courseId: "jee-mains", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["jee-che-11-1"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w1-jee11-mat", batchId: "jee-11", batchName: "JEE 11", subjectId: "jee_mat", subjectName: "JEE Mathematics", courseId: "jee-mains", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["jee-mat-11-1"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },

  // ========================
  // WEEK 2: Jan 13-18, 2025 (PAST - Completed)
  // ========================
  // Class 6 - Section A
  { id: "plan-w2-6a-mat", batchId: "batch-6a", batchName: "Class 6 - Section A", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-01-13", weekEndDate: "2025-01-18", plannedChapters: ["mat-6-1", "mat-6-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w2-6a-sci", batchId: "batch-6a", batchName: "Class 6 - Section A", subjectId: "sci", subjectName: "Science", courseId: "cbse", weekStartDate: "2025-01-13", weekEndDate: "2025-01-18", plannedChapters: ["sci-6-1", "sci-6-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w2-6a-eng", batchId: "batch-6a", batchName: "Class 6 - Section A", subjectId: "eng", subjectName: "English", courseId: "cbse", weekStartDate: "2025-01-13", weekEndDate: "2025-01-18", plannedChapters: ["eng-6-1", "eng-6-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w2-6a-hin", batchId: "batch-6a", batchName: "Class 6 - Section A", subjectId: "hin", subjectName: "Hindi", courseId: "cbse", weekStartDate: "2025-01-13", weekEndDate: "2025-01-18", plannedChapters: ["hin-6-1", "hin-6-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Class 7 - Section A
  { id: "plan-w2-7a-mat", batchId: "batch-7a", batchName: "Class 7 - Section A", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-01-13", weekEndDate: "2025-01-18", plannedChapters: ["mat-7-1", "mat-7-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w2-7a-sci", batchId: "batch-7a", batchName: "Class 7 - Section A", subjectId: "sci", subjectName: "Science", courseId: "cbse", weekStartDate: "2025-01-13", weekEndDate: "2025-01-18", plannedChapters: ["sci-7-1", "sci-7-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w2-7a-eng", batchId: "batch-7a", batchName: "Class 7 - Section A", subjectId: "eng", subjectName: "English", courseId: "cbse", weekStartDate: "2025-01-13", weekEndDate: "2025-01-18", plannedChapters: ["eng-7-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Class 8 - Section A
  { id: "plan-w2-8a-mat", batchId: "batch-8a", batchName: "Class 8 - Section A", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-01-13", weekEndDate: "2025-01-18", plannedChapters: ["mat-8-1", "mat-8-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w2-8a-sci", batchId: "batch-8a", batchName: "Class 8 - Section A", subjectId: "sci", subjectName: "Science", courseId: "cbse", weekStartDate: "2025-01-13", weekEndDate: "2025-01-18", plannedChapters: ["sci-8-2", "sci-8-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w2-8a-hin", batchId: "batch-8a", batchName: "Class 8 - Section A", subjectId: "hin", subjectName: "Hindi", courseId: "cbse", weekStartDate: "2025-01-13", weekEndDate: "2025-01-18", plannedChapters: ["hin-8-1"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Class 9 - Section A
  { id: "plan-w2-9a-phy", batchId: "batch-9a", batchName: "Class 9 - Section A", subjectId: "phy", subjectName: "Physics", courseId: "cbse", weekStartDate: "2025-01-13", weekEndDate: "2025-01-18", plannedChapters: ["phy-9-1", "phy-9-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w2-9a-che", batchId: "batch-9a", batchName: "Class 9 - Section A", subjectId: "che", subjectName: "Chemistry", courseId: "cbse", weekStartDate: "2025-01-13", weekEndDate: "2025-01-18", plannedChapters: ["che-9-1", "che-9-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w2-9a-mat", batchId: "batch-9a", batchName: "Class 9 - Section A", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-01-13", weekEndDate: "2025-01-18", plannedChapters: ["mat-9-1", "mat-9-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w2-9a-bio", batchId: "batch-9a", batchName: "Class 9 - Section A", subjectId: "bio", subjectName: "Biology", courseId: "cbse", weekStartDate: "2025-01-13", weekEndDate: "2025-01-18", plannedChapters: ["bio-9-1", "bio-9-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Class 10 - Section A
  { id: "plan-w2-10a-phy", batchId: "batch-10a", batchName: "Class 10 - Section A", subjectId: "phy", subjectName: "Physics", courseId: "cbse", weekStartDate: "2025-01-13", weekEndDate: "2025-01-18", plannedChapters: ["phy-10-1", "phy-10-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w2-10a-che", batchId: "batch-10a", batchName: "Class 10 - Section A", subjectId: "che", subjectName: "Chemistry", courseId: "cbse", weekStartDate: "2025-01-13", weekEndDate: "2025-01-18", plannedChapters: ["che-10-1", "che-10-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w2-10a-mat", batchId: "batch-10a", batchName: "Class 10 - Section A", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-01-13", weekEndDate: "2025-01-18", plannedChapters: ["mat-10-1", "mat-10-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w2-10a-bio", batchId: "batch-10a", batchName: "Class 10 - Section A", subjectId: "bio", subjectName: "Biology", courseId: "cbse", weekStartDate: "2025-01-13", weekEndDate: "2025-01-18", plannedChapters: ["bio-10-1", "bio-10-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Class 11 - Section A
  { id: "plan-w2-11a-phy", batchId: "batch-11a", batchName: "Class 11 - Section A", subjectId: "phy", subjectName: "Physics", courseId: "cbse", weekStartDate: "2025-01-13", weekEndDate: "2025-01-18", plannedChapters: ["phy-11-2", "phy-11-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w2-11a-che", batchId: "batch-11a", batchName: "Class 11 - Section A", subjectId: "che", subjectName: "Chemistry", courseId: "cbse", weekStartDate: "2025-01-13", weekEndDate: "2025-01-18", plannedChapters: ["che-11-1", "che-11-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w2-11a-mat", batchId: "batch-11a", batchName: "Class 11 - Section A", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-01-13", weekEndDate: "2025-01-18", plannedChapters: ["mat-11-1", "mat-11-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // JEE 11
  { id: "plan-w2-jee11-phy", batchId: "jee-11", batchName: "JEE 11", subjectId: "jee_phy", subjectName: "JEE Physics", courseId: "jee-mains", weekStartDate: "2025-01-13", weekEndDate: "2025-01-18", plannedChapters: ["jee-phy-11-1", "jee-phy-11-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w2-jee11-che", batchId: "jee-11", batchName: "JEE 11", subjectId: "jee_che", subjectName: "JEE Chemistry", courseId: "jee-mains", weekStartDate: "2025-01-13", weekEndDate: "2025-01-18", plannedChapters: ["jee-che-11-1", "jee-che-11-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w2-jee11-mat", batchId: "jee-11", batchName: "JEE 11", subjectId: "jee_mat", subjectName: "JEE Mathematics", courseId: "jee-mains", weekStartDate: "2025-01-13", weekEndDate: "2025-01-18", plannedChapters: ["jee-mat-11-1", "jee-mat-11-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },

  // ========================
  // WEEK 3: Jan 20-25, 2025 (PAST - Completed)
  // ========================
  // Class 6 - Section A
  { id: "plan-w3-6a-mat", batchId: "batch-6a", batchName: "Class 6 - Section A", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["mat-6-2", "mat-6-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w3-6a-sci", batchId: "batch-6a", batchName: "Class 6 - Section A", subjectId: "sci", subjectName: "Science", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["sci-6-2", "sci-6-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w3-6a-eng", batchId: "batch-6a", batchName: "Class 6 - Section A", subjectId: "eng", subjectName: "English", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["eng-6-2", "eng-6-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w3-6a-hin", batchId: "batch-6a", batchName: "Class 6 - Section A", subjectId: "hin", subjectName: "Hindi", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["hin-6-2", "hin-6-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w3-6a-sst", batchId: "batch-6a", batchName: "Class 6 - Section A", subjectId: "sst", subjectName: "Social Studies", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["sst-6-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Class 7 - Section A
  { id: "plan-w3-7a-mat", batchId: "batch-7a", batchName: "Class 7 - Section A", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["mat-7-2", "mat-7-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w3-7a-sci", batchId: "batch-7a", batchName: "Class 7 - Section A", subjectId: "sci", subjectName: "Science", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["sci-7-2", "sci-7-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w3-7a-eng", batchId: "batch-7a", batchName: "Class 7 - Section A", subjectId: "eng", subjectName: "English", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["eng-7-2", "eng-7-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w3-7a-hin", batchId: "batch-7a", batchName: "Class 7 - Section A", subjectId: "hin", subjectName: "Hindi", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["hin-7-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w3-7a-sst", batchId: "batch-7a", batchName: "Class 7 - Section A", subjectId: "sst", subjectName: "Social Studies", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["sst-7-1", "sst-7-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Class 8 - Section A
  { id: "plan-w3-8a-mat", batchId: "batch-8a", batchName: "Class 8 - Section A", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["mat-8-2", "mat-8-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w3-8a-sci", batchId: "batch-8a", batchName: "Class 8 - Section A", subjectId: "sci", subjectName: "Science", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["sci-8-3", "sci-8-4"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w3-8a-eng", batchId: "batch-8a", batchName: "Class 8 - Section A", subjectId: "eng", subjectName: "English", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["eng-8-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w3-8a-hin", batchId: "batch-8a", batchName: "Class 8 - Section A", subjectId: "hin", subjectName: "Hindi", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["hin-8-1", "hin-8-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w3-8a-sst", batchId: "batch-8a", batchName: "Class 8 - Section A", subjectId: "sst", subjectName: "Social Studies", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["sst-8-1", "sst-8-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Class 9 - Section A
  { id: "plan-w3-9a-phy", batchId: "batch-9a", batchName: "Class 9 - Section A", subjectId: "phy", subjectName: "Physics", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["phy-9-2", "phy-9-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w3-9a-che", batchId: "batch-9a", batchName: "Class 9 - Section A", subjectId: "che", subjectName: "Chemistry", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["che-9-2", "che-9-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w3-9a-mat", batchId: "batch-9a", batchName: "Class 9 - Section A", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["mat-9-2", "mat-9-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w3-9a-bio", batchId: "batch-9a", batchName: "Class 9 - Section A", subjectId: "bio", subjectName: "Biology", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["bio-9-2", "bio-9-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w3-9a-eng", batchId: "batch-9a", batchName: "Class 9 - Section A", subjectId: "eng", subjectName: "English", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["eng-9-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w3-9a-hin", batchId: "batch-9a", batchName: "Class 9 - Section A", subjectId: "hin", subjectName: "Hindi", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["hin-9-1", "hin-9-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w3-9a-sst", batchId: "batch-9a", batchName: "Class 9 - Section A", subjectId: "sst", subjectName: "Social Studies", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["sst-9-1"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Class 10 - Section A
  { id: "plan-w3-10a-phy", batchId: "batch-10a", batchName: "Class 10 - Section A", subjectId: "phy", subjectName: "Physics", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["phy-10-2", "phy-10-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w3-10a-che", batchId: "batch-10a", batchName: "Class 10 - Section A", subjectId: "che", subjectName: "Chemistry", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["che-10-2", "che-10-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w3-10a-mat", batchId: "batch-10a", batchName: "Class 10 - Section A", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["mat-10-2", "mat-10-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w3-10a-bio", batchId: "batch-10a", batchName: "Class 10 - Section A", subjectId: "bio", subjectName: "Biology", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["bio-10-2", "bio-10-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w3-10a-eng", batchId: "batch-10a", batchName: "Class 10 - Section A", subjectId: "eng", subjectName: "English", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["eng-10-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w3-10a-hin", batchId: "batch-10a", batchName: "Class 10 - Section A", subjectId: "hin", subjectName: "Hindi", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["hin-10-1"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Class 11 - Section A
  { id: "plan-w3-11a-phy", batchId: "batch-11a", batchName: "Class 11 - Section A", subjectId: "phy", subjectName: "Physics", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["phy-11-3", "phy-11-4"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w3-11a-che", batchId: "batch-11a", batchName: "Class 11 - Section A", subjectId: "che", subjectName: "Chemistry", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["che-11-2", "che-11-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w3-11a-mat", batchId: "batch-11a", batchName: "Class 11 - Section A", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["mat-11-2", "mat-11-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w3-11a-bio", batchId: "batch-11a", batchName: "Class 11 - Section A", subjectId: "bio", subjectName: "Biology", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["bio-11-1", "bio-11-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // JEE 11
  { id: "plan-w3-jee11-phy", batchId: "jee-11", batchName: "JEE 11", subjectId: "jee_phy", subjectName: "JEE Physics", courseId: "jee-mains", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["jee-phy-11-2", "jee-phy-11-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w3-jee11-che", batchId: "jee-11", batchName: "JEE 11", subjectId: "jee_che", subjectName: "JEE Chemistry", courseId: "jee-mains", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["jee-che-11-2", "jee-che-11-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w3-jee11-mat", batchId: "jee-11", batchName: "JEE 11", subjectId: "jee_mat", subjectName: "JEE Mathematics", courseId: "jee-mains", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["jee-mat-11-2", "jee-mat-11-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },

  // ========================
  // WEEK 4: Jan 27 - Feb 1, 2025 (CURRENT - Partially Planned)
  // ========================
  // Class 6 - Section A (partial)
  { id: "plan-w4-6a-mat", batchId: "batch-6a", batchName: "Class 6 - Section A", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-01-27", weekEndDate: "2025-02-01", plannedChapters: ["mat-6-3", "mat-6-4"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w4-6a-sci", batchId: "batch-6a", batchName: "Class 6 - Section A", subjectId: "sci", subjectName: "Science", courseId: "cbse", weekStartDate: "2025-01-27", weekEndDate: "2025-02-01", plannedChapters: ["sci-6-3", "sci-6-4"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w4-6a-eng", batchId: "batch-6a", batchName: "Class 6 - Section A", subjectId: "eng", subjectName: "English", courseId: "cbse", weekStartDate: "2025-01-27", weekEndDate: "2025-02-01", plannedChapters: ["eng-6-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  // hin and sst not planned for week 4
  
  // Class 9 - Section A (mostly planned)
  { id: "plan-w4-9a-phy", batchId: "batch-9a", batchName: "Class 9 - Section A", subjectId: "phy", subjectName: "Physics", courseId: "cbse", weekStartDate: "2025-01-27", weekEndDate: "2025-02-01", plannedChapters: ["phy-9-3", "phy-9-4"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w4-9a-che", batchId: "batch-9a", batchName: "Class 9 - Section A", subjectId: "che", subjectName: "Chemistry", courseId: "cbse", weekStartDate: "2025-01-27", weekEndDate: "2025-02-01", plannedChapters: ["che-9-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w4-9a-mat", batchId: "batch-9a", batchName: "Class 9 - Section A", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-01-27", weekEndDate: "2025-02-01", plannedChapters: ["mat-9-3", "mat-9-4"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w4-9a-bio", batchId: "batch-9a", batchName: "Class 9 - Section A", subjectId: "bio", subjectName: "Biology", courseId: "cbse", weekStartDate: "2025-01-27", weekEndDate: "2025-02-01", plannedChapters: ["bio-9-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  // eng, hin, sst not planned for week 4
  
  // Class 10 - Section A (mostly planned)
  { id: "plan-w4-10a-phy", batchId: "batch-10a", batchName: "Class 10 - Section A", subjectId: "phy", subjectName: "Physics", courseId: "cbse", weekStartDate: "2025-01-27", weekEndDate: "2025-02-01", plannedChapters: ["phy-10-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w4-10a-che", batchId: "batch-10a", batchName: "Class 10 - Section A", subjectId: "che", subjectName: "Chemistry", courseId: "cbse", weekStartDate: "2025-01-27", weekEndDate: "2025-02-01", plannedChapters: ["che-10-3", "che-10-4"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w4-10a-mat", batchId: "batch-10a", batchName: "Class 10 - Section A", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-01-27", weekEndDate: "2025-02-01", plannedChapters: ["mat-10-3", "mat-10-4"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w4-10a-bio", batchId: "batch-10a", batchName: "Class 10 - Section A", subjectId: "bio", subjectName: "Biology", courseId: "cbse", weekStartDate: "2025-01-27", weekEndDate: "2025-02-01", plannedChapters: ["bio-10-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Class 11 - Section A (partial)
  { id: "plan-w4-11a-phy", batchId: "batch-11a", batchName: "Class 11 - Section A", subjectId: "phy", subjectName: "Physics", courseId: "cbse", weekStartDate: "2025-01-27", weekEndDate: "2025-02-01", plannedChapters: ["phy-11-4", "phy-11-5"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w4-11a-mat", batchId: "batch-11a", batchName: "Class 11 - Section A", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-01-27", weekEndDate: "2025-02-01", plannedChapters: ["mat-11-3", "mat-11-4"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // JEE 11 (partial)
  { id: "plan-w4-jee11-phy", batchId: "jee-11", batchName: "JEE 11", subjectId: "jee_phy", subjectName: "JEE Physics", courseId: "jee-mains", weekStartDate: "2025-01-27", weekEndDate: "2025-02-01", plannedChapters: ["jee-phy-11-3", "jee-phy-11-4"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w4-jee11-mat", batchId: "jee-11", batchName: "JEE 11", subjectId: "jee_mat", subjectName: "JEE Mathematics", courseId: "jee-mains", weekStartDate: "2025-01-27", weekEndDate: "2025-02-01", plannedChapters: ["jee-mat-11-3", "jee-mat-11-4"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },

  // ========================
  // WEEK 5: Feb 3-8, 2025 (FUTURE - Sparse Plans)
  // ========================
  // Class 10 - Section A (some plans)
  { id: "plan-w5-10a-phy", batchId: "batch-10a", batchName: "Class 10 - Section A", subjectId: "phy", subjectName: "Physics", courseId: "cbse", weekStartDate: "2025-02-03", weekEndDate: "2025-02-08", plannedChapters: ["phy-10-4"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w5-10a-mat", batchId: "batch-10a", batchName: "Class 10 - Section A", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-02-03", weekEndDate: "2025-02-08", plannedChapters: ["mat-10-4", "mat-10-5"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Class 11 - Section A (some plans)
  { id: "plan-w5-11a-phy", batchId: "batch-11a", batchName: "Class 11 - Section A", subjectId: "phy", subjectName: "Physics", courseId: "cbse", weekStartDate: "2025-02-03", weekEndDate: "2025-02-08", plannedChapters: ["phy-11-5"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // JEE 11 (some plans)
  { id: "plan-w5-jee11-phy", batchId: "jee-11", batchName: "JEE 11", subjectId: "jee_phy", subjectName: "JEE Physics", courseId: "jee-mains", weekStartDate: "2025-02-03", weekEndDate: "2025-02-08", plannedChapters: ["jee-phy-11-4"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },

  // ========================
  // WEEK 6: Feb 10-15, 2025 (FUTURE - Very Sparse)
  // ========================
  // Class 11 - Section A (minimal)
  { id: "plan-w6-11a-phy", batchId: "batch-11a", batchName: "Class 11 - Section A", subjectId: "phy", subjectName: "Physics", courseId: "cbse", weekStartDate: "2025-02-10", weekEndDate: "2025-02-15", plannedChapters: ["phy-11-5"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },

  // ========================
  // WEEK 7: Feb 17-22, 2025 (FUTURE - Minimal)
  // ========================
  // JEE 12 (only one plan)
  { id: "plan-w7-jee12-phy", batchId: "jee-12", batchName: "JEE 12", subjectId: "jee_phy", subjectName: "JEE Physics", courseId: "jee-mains", weekStartDate: "2025-02-17", weekEndDate: "2025-02-22", plannedChapters: ["jee-phy-12-1"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },

  // ========================
  // WEEK 8: Feb 24 - Mar 1, 2025 (FUTURE - Empty)
  // ========================
  // No plans for week 8 - users need to add them
];

// ============================================
// Teaching Confirmations (Simplified for brevity)
// ============================================

export const teachingConfirmations: TeachingConfirmation[] = [
  { id: "conf-w1-1", batchId: "batch-9a", batchName: "Class 9 - Section A", subjectId: "phy", subjectName: "Physics", date: "2025-01-06", teacherId: "teacher-1", teacherName: "Dr. Sharma", didTeach: true, chapterId: "phy-9-1", chapterName: "Motion", periodsCount: 2, confirmedAt: "2025-01-06", confirmedBy: "teacher" },
  { id: "conf-w1-2", batchId: "batch-9a", batchName: "Class 9 - Section A", subjectId: "mat", subjectName: "Mathematics", date: "2025-01-07", teacherId: "teacher-2", teacherName: "Prof. Verma", didTeach: true, chapterId: "mat-9-1", chapterName: "Number Systems", periodsCount: 2, confirmedAt: "2025-01-07", confirmedBy: "teacher" },
  { id: "conf-w1-3", batchId: "batch-10a", batchName: "Class 10 - Section A", subjectId: "phy", subjectName: "Physics", date: "2025-01-08", teacherId: "teacher-1", teacherName: "Dr. Sharma", didTeach: true, chapterId: "phy-10-1", chapterName: "Light - Reflection and Refraction", periodsCount: 2, confirmedAt: "2025-01-08", confirmedBy: "teacher" },
];

// ============================================
// Subject Progress Data (Simplified)
// ============================================

export const subjectProgressData: SubjectProgress[] = [
  { batchId: "batch-9a", batchName: "Class 9 - Section A", subjectId: "phy", subjectName: "Physics", totalPlannedHours: 38, totalActualHours: 16, chaptersCompleted: 2, totalChapters: 5, currentChapter: "phy-9-3", currentChapterName: "Gravitation", overallStatus: "in_progress", percentComplete: 42, lostDays: 1, lostDaysReasons: [{ reason: "holiday", count: 1 }] },
  { batchId: "batch-9a", batchName: "Class 9 - Section A", subjectId: "che", subjectName: "Chemistry", totalPlannedHours: 28, totalActualHours: 14, chaptersCompleted: 2, totalChapters: 4, currentChapter: "che-9-3", currentChapterName: "Atoms and Molecules", overallStatus: "in_progress", percentComplete: 50, lostDays: 0, lostDaysReasons: [] },
  { batchId: "batch-9a", batchName: "Class 9 - Section A", subjectId: "mat", subjectName: "Mathematics", totalPlannedHours: 40, totalActualHours: 15, chaptersCompleted: 2, totalChapters: 6, currentChapter: "mat-9-3", currentChapterName: "Coordinate Geometry", overallStatus: "lagging", percentComplete: 38, lostDays: 2, lostDaysReasons: [{ reason: "teacher_absent", count: 2 }] },
  { batchId: "batch-10a", batchName: "Class 10 - Section A", subjectId: "phy", subjectName: "Physics", totalPlannedHours: 44, totalActualHours: 22, chaptersCompleted: 2, totalChapters: 5, currentChapter: "phy-10-3", currentChapterName: "Electricity", overallStatus: "in_progress", percentComplete: 50, lostDays: 0, lostDaysReasons: [] },
  { batchId: "batch-10a", batchName: "Class 10 - Section A", subjectId: "mat", subjectName: "Mathematics", totalPlannedHours: 52, totalActualHours: 18, chaptersCompleted: 2, totalChapters: 6, currentChapter: "mat-10-3", currentChapterName: "Pair of Linear Equations", overallStatus: "lagging", percentComplete: 35, lostDays: 1, lostDaysReasons: [{ reason: "exam", count: 1 }] },
];

// ============================================
// Batch Progress Summaries - COMPREHENSIVE MOCK DATA
// ============================================

export const batchProgressSummaries: BatchProgressSummary[] = [
  // ========================
  // CLASS 6 - Section A (5 subjects, On Track)
  // ========================
  {
    batchId: "batch-6a",
    batchName: "Class 6 - Section A",
    className: "Class 6",
    overallProgress: 72,
    status: "on_track",
    subjects: [
      {
        batchId: "batch-6a",
        batchName: "Class 6 - Section A",
        subjectId: "mat",
        subjectName: "Mathematics",
        totalPlannedHours: 47,
        totalActualHours: 34,
        chaptersCompleted: 5,
        totalChapters: 8,
        currentChapter: "mat-6-6",
        currentChapterName: "Integers",
        overallStatus: "in_progress",
        percentComplete: 75,
        lostDays: 1,
        lostDaysReasons: [{ reason: "holiday", count: 1 }],
      },
      {
        batchId: "batch-6a",
        batchName: "Class 6 - Section A",
        subjectId: "sci",
        subjectName: "Science",
        totalPlannedHours: 24,
        totalActualHours: 17,
        chaptersCompleted: 3,
        totalChapters: 5,
        currentChapter: "sci-6-4",
        currentChapterName: "Sorting Materials into Groups",
        overallStatus: "in_progress",
        percentComplete: 70,
        lostDays: 0,
        lostDaysReasons: [],
      },
      {
        batchId: "batch-6a",
        batchName: "Class 6 - Section A",
        subjectId: "eng",
        subjectName: "English",
        totalPlannedHours: 17,
        totalActualHours: 14,
        chaptersCompleted: 3,
        totalChapters: 4,
        currentChapter: "eng-6-4",
        currentChapterName: "An Indian-American Woman in Space",
        overallStatus: "in_progress",
        percentComplete: 80,
        lostDays: 0,
        lostDaysReasons: [],
      },
      {
        batchId: "batch-6a",
        batchName: "Class 6 - Section A",
        subjectId: "hin",
        subjectName: "Hindi",
        totalPlannedHours: 17,
        totalActualHours: 12,
        chaptersCompleted: 2,
        totalChapters: 4,
        currentChapter: "hin-6-3",
        currentChapterName: "नादान दोस्त (Naadan Dost)",
        overallStatus: "in_progress",
        percentComplete: 72,
        lostDays: 0,
        lostDaysReasons: [],
      },
      {
        batchId: "batch-6a",
        batchName: "Class 6 - Section A",
        subjectId: "sst",
        subjectName: "Social Studies",
        totalPlannedHours: 18,
        totalActualHours: 12,
        chaptersCompleted: 2,
        totalChapters: 4,
        currentChapter: "sst-6-3",
        currentChapterName: "In the Earliest Cities",
        overallStatus: "in_progress",
        percentComplete: 68,
        lostDays: 1,
        lostDaysReasons: [{ reason: "holiday", count: 1 }],
      },
    ],
  },

  // ========================
  // CLASS 7 - Section A (5 subjects, LAGGING)
  // ========================
  {
    batchId: "batch-7a",
    batchName: "Class 7 - Section A",
    className: "Class 7",
    overallProgress: 58,
    status: "lagging",
    subjects: [
      {
        batchId: "batch-7a",
        batchName: "Class 7 - Section A",
        subjectId: "mat",
        subjectName: "Mathematics",
        totalPlannedHours: 35,
        totalActualHours: 20,
        chaptersCompleted: 3,
        totalChapters: 6,
        currentChapter: "mat-7-4",
        currentChapterName: "Simple Equations",
        overallStatus: "in_progress",
        percentComplete: 58,
        lostDays: 1,
        lostDaysReasons: [{ reason: "teacher_absent", count: 1 }],
      },
      {
        batchId: "batch-7a",
        batchName: "Class 7 - Section A",
        subjectId: "sci",
        subjectName: "Science",
        totalPlannedHours: 25,
        totalActualHours: 16,
        chaptersCompleted: 3,
        totalChapters: 5,
        currentChapter: "sci-7-4",
        currentChapterName: "Heat",
        overallStatus: "in_progress",
        percentComplete: 62,
        lostDays: 0,
        lostDaysReasons: [],
      },
      {
        batchId: "batch-7a",
        batchName: "Class 7 - Section A",
        subjectId: "eng",
        subjectName: "English",
        totalPlannedHours: 18,
        totalActualHours: 13,
        chaptersCompleted: 2,
        totalChapters: 4,
        currentChapter: "eng-7-3",
        currentChapterName: "Gopal and the Hilsa Fish",
        overallStatus: "in_progress",
        percentComplete: 70,
        lostDays: 0,
        lostDaysReasons: [],
      },
      {
        batchId: "batch-7a",
        batchName: "Class 7 - Section A",
        subjectId: "hin",
        subjectName: "Hindi",
        totalPlannedHours: 17,
        totalActualHours: 9,
        chaptersCompleted: 1,
        totalChapters: 4,
        currentChapter: "hin-7-2",
        currentChapterName: "दादी माँ (Dadi Maa)",
        overallStatus: "lagging",
        percentComplete: 55,
        lostDays: 3,
        lostDaysReasons: [{ reason: "teacher_absent", count: 2 }, { reason: "holiday", count: 1 }],
      },
      {
        batchId: "batch-7a",
        batchName: "Class 7 - Section A",
        subjectId: "sst",
        subjectName: "Social Studies",
        totalPlannedHours: 22,
        totalActualHours: 13,
        chaptersCompleted: 2,
        totalChapters: 4,
        currentChapter: "sst-7-3",
        currentChapterName: "The Delhi Sultans",
        overallStatus: "in_progress",
        percentComplete: 60,
        lostDays: 0,
        lostDaysReasons: [],
      },
    ],
  },

  // ========================
  // CLASS 8 - Section A (5 subjects, On Track)
  // ========================
  {
    batchId: "batch-8a",
    batchName: "Class 8 - Section A",
    className: "Class 8",
    overallProgress: 70,
    status: "on_track",
    subjects: [
      {
        batchId: "batch-8a",
        batchName: "Class 8 - Section A",
        subjectId: "mat",
        subjectName: "Mathematics",
        totalPlannedHours: 36,
        totalActualHours: 26,
        chaptersCompleted: 4,
        totalChapters: 6,
        currentChapter: "mat-8-5",
        currentChapterName: "Data Handling",
        overallStatus: "in_progress",
        percentComplete: 72,
        lostDays: 0,
        lostDaysReasons: [],
      },
      {
        batchId: "batch-8a",
        batchName: "Class 8 - Section A",
        subjectId: "sci",
        subjectName: "Science",
        totalPlannedHours: 27,
        totalActualHours: 20,
        chaptersCompleted: 3,
        totalChapters: 5,
        currentChapter: "sci-8-4",
        currentChapterName: "Materials: Metals and Non-Metals",
        overallStatus: "in_progress",
        percentComplete: 75,
        lostDays: 0,
        lostDaysReasons: [],
      },
      {
        batchId: "batch-8a",
        batchName: "Class 8 - Section A",
        subjectId: "eng",
        subjectName: "English",
        totalPlannedHours: 20,
        totalActualHours: 14,
        chaptersCompleted: 2,
        totalChapters: 4,
        currentChapter: "eng-8-3",
        currentChapterName: "Glimpses of the Past",
        overallStatus: "in_progress",
        percentComplete: 68,
        lostDays: 0,
        lostDaysReasons: [],
      },
      {
        batchId: "batch-8a",
        batchName: "Class 8 - Section A",
        subjectId: "hin",
        subjectName: "Hindi",
        totalPlannedHours: 17,
        totalActualHours: 12,
        chaptersCompleted: 2,
        totalChapters: 4,
        currentChapter: "hin-8-3",
        currentChapterName: "बस की यात्रा (Bus Ki Yatra)",
        overallStatus: "in_progress",
        percentComplete: 70,
        lostDays: 0,
        lostDaysReasons: [],
      },
      {
        batchId: "batch-8a",
        batchName: "Class 8 - Section A",
        subjectId: "sst",
        subjectName: "Social Studies",
        totalPlannedHours: 19,
        totalActualHours: 14,
        chaptersCompleted: 2,
        totalChapters: 4,
        currentChapter: "sst-8-3",
        currentChapterName: "Ruling the Countryside",
        overallStatus: "in_progress",
        percentComplete: 74,
        lostDays: 1,
        lostDaysReasons: [{ reason: "exam", count: 1 }],
      },
    ],
  },

  // ========================
  // CLASS 9 - Section A (6 subjects, On Track)
  // ========================
  {
    batchId: "batch-9a",
    batchName: "Class 9 - Section A",
    className: "Class 9",
    overallProgress: 68,
    status: "on_track",
    subjects: [
      {
        batchId: "batch-9a",
        batchName: "Class 9 - Section A",
        subjectId: "phy",
        subjectName: "Physics",
        totalPlannedHours: 38,
        totalActualHours: 26,
        chaptersCompleted: 2,
        totalChapters: 5,
        currentChapter: "phy-9-3",
        currentChapterName: "Gravitation",
        overallStatus: "in_progress",
        percentComplete: 68,
        lostDays: 0,
        lostDaysReasons: [],
      },
      {
        batchId: "batch-9a",
        batchName: "Class 9 - Section A",
        subjectId: "che",
        subjectName: "Chemistry",
        totalPlannedHours: 28,
        totalActualHours: 20,
        chaptersCompleted: 2,
        totalChapters: 4,
        currentChapter: "che-9-3",
        currentChapterName: "Atoms and Molecules",
        overallStatus: "in_progress",
        percentComplete: 72,
        lostDays: 0,
        lostDaysReasons: [],
      },
      {
        batchId: "batch-9a",
        batchName: "Class 9 - Section A",
        subjectId: "mat",
        subjectName: "Mathematics",
        totalPlannedHours: 40,
        totalActualHours: 26,
        chaptersCompleted: 3,
        totalChapters: 6,
        currentChapter: "mat-9-4",
        currentChapterName: "Linear Equations in Two Variables",
        overallStatus: "lagging",
        percentComplete: 65,
        lostDays: 2,
        lostDaysReasons: [{ reason: "teacher_absent", count: 2 }],
      },
      {
        batchId: "batch-9a",
        batchName: "Class 9 - Section A",
        subjectId: "bio",
        subjectName: "Biology",
        totalPlannedHours: 25,
        totalActualHours: 18,
        chaptersCompleted: 2,
        totalChapters: 4,
        currentChapter: "bio-9-3",
        currentChapterName: "Diversity in Living Organisms",
        overallStatus: "in_progress",
        percentComplete: 70,
        lostDays: 0,
        lostDaysReasons: [],
      },
      {
        batchId: "batch-9a",
        batchName: "Class 9 - Section A",
        subjectId: "eng",
        subjectName: "English",
        totalPlannedHours: 18,
        totalActualHours: 14,
        chaptersCompleted: 3,
        totalChapters: 4,
        currentChapter: "eng-9-4",
        currentChapterName: "A Truly Beautiful Mind",
        overallStatus: "in_progress",
        percentComplete: 75,
        lostDays: 0,
        lostDaysReasons: [],
      },
      {
        batchId: "batch-9a",
        batchName: "Class 9 - Section A",
        subjectId: "hin",
        subjectName: "Hindi",
        totalPlannedHours: 17,
        totalActualHours: 12,
        chaptersCompleted: 2,
        totalChapters: 4,
        currentChapter: "hin-9-3",
        currentChapterName: "उपभोक्तावाद की संस्कृति",
        overallStatus: "in_progress",
        percentComplete: 72,
        lostDays: 1,
        lostDaysReasons: [{ reason: "holiday", count: 1 }],
      },
    ],
  },

  // ========================
  // CLASS 10 - Section A (6 subjects, LAGGING with pending)
  // ========================
  {
    batchId: "batch-10a",
    batchName: "Class 10 - Section A",
    className: "Class 10",
    overallProgress: 55,
    status: "lagging",
    subjects: [
      {
        batchId: "batch-10a",
        batchName: "Class 10 - Section A",
        subjectId: "phy",
        subjectName: "Physics",
        totalPlannedHours: 44,
        totalActualHours: 26,
        chaptersCompleted: 2,
        totalChapters: 5,
        currentChapter: "phy-10-3",
        currentChapterName: "Electricity",
        overallStatus: "lagging",
        percentComplete: 60,
        lostDays: 1,
        lostDaysReasons: [{ reason: "teacher_absent", count: 1 }],
      },
      {
        batchId: "batch-10a",
        batchName: "Class 10 - Section A",
        subjectId: "che",
        subjectName: "Chemistry",
        totalPlannedHours: 35,
        totalActualHours: 23,
        chaptersCompleted: 2,
        totalChapters: 5,
        currentChapter: "che-10-3",
        currentChapterName: "Metals and Non-metals",
        overallStatus: "in_progress",
        percentComplete: 65,
        lostDays: 0,
        lostDaysReasons: [],
      },
      {
        batchId: "batch-10a",
        batchName: "Class 10 - Section A",
        subjectId: "mat",
        subjectName: "Mathematics",
        totalPlannedHours: 52,
        totalActualHours: 29,
        chaptersCompleted: 2,
        totalChapters: 6,
        currentChapter: "mat-10-3",
        currentChapterName: "Pair of Linear Equations",
        overallStatus: "lagging",
        percentComplete: 55,
        lostDays: 3,
        lostDaysReasons: [{ reason: "exam", count: 1 }, { reason: "teacher_absent", count: 2 }],
      },
      {
        batchId: "batch-10a",
        batchName: "Class 10 - Section A",
        subjectId: "bio",
        subjectName: "Biology",
        totalPlannedHours: 30,
        totalActualHours: 19,
        chaptersCompleted: 2,
        totalChapters: 5,
        currentChapter: "bio-10-3",
        currentChapterName: "Control and Coordination",
        overallStatus: "in_progress",
        percentComplete: 62,
        lostDays: 0,
        lostDaysReasons: [],
      },
      {
        batchId: "batch-10a",
        batchName: "Class 10 - Section A",
        subjectId: "eng",
        subjectName: "English",
        totalPlannedHours: 18,
        totalActualHours: 13,
        chaptersCompleted: 2,
        totalChapters: 4,
        currentChapter: "eng-10-3",
        currentChapterName: "Two Stories about Flying",
        overallStatus: "in_progress",
        percentComplete: 70,
        lostDays: 0,
        lostDaysReasons: [],
      },
      {
        batchId: "batch-10a",
        batchName: "Class 10 - Section A",
        subjectId: "hin",
        subjectName: "Hindi",
        totalPlannedHours: 17,
        totalActualHours: 12,
        chaptersCompleted: 2,
        totalChapters: 4,
        currentChapter: "hin-10-3",
        currentChapterName: "साना साना हाथ जोड़ि",
        overallStatus: "in_progress",
        percentComplete: 68,
        lostDays: 0,
        lostDaysReasons: [],
      },
    ],
  },

  // ========================
  // CLASS 11 - Section A (4 subjects, On Track)
  // ========================
  {
    batchId: "batch-11a",
    batchName: "Class 11 - Section A",
    className: "Class 11",
    overallProgress: 58,
    status: "on_track",
    subjects: [
      {
        batchId: "batch-11a",
        batchName: "Class 11 - Section A",
        subjectId: "phy",
        subjectName: "Physics",
        totalPlannedHours: 50,
        totalActualHours: 29,
        chaptersCompleted: 3,
        totalChapters: 6,
        currentChapter: "phy-11-4",
        currentChapterName: "Motion in a Plane",
        overallStatus: "in_progress",
        percentComplete: 58,
        lostDays: 1,
        lostDaysReasons: [{ reason: "holiday", count: 1 }],
      },
      {
        batchId: "batch-11a",
        batchName: "Class 11 - Section A",
        subjectId: "che",
        subjectName: "Chemistry",
        totalPlannedHours: 36,
        totalActualHours: 22,
        chaptersCompleted: 2,
        totalChapters: 4,
        currentChapter: "che-11-3",
        currentChapterName: "Classification of Elements",
        overallStatus: "in_progress",
        percentComplete: 60,
        lostDays: 0,
        lostDaysReasons: [],
      },
      {
        batchId: "batch-11a",
        batchName: "Class 11 - Section A",
        subjectId: "mat",
        subjectName: "Mathematics",
        totalPlannedHours: 40,
        totalActualHours: 22,
        chaptersCompleted: 2,
        totalChapters: 4,
        currentChapter: "mat-11-3",
        currentChapterName: "Trigonometric Functions",
        overallStatus: "in_progress",
        percentComplete: 55,
        lostDays: 0,
        lostDaysReasons: [],
      },
      {
        batchId: "batch-11a",
        batchName: "Class 11 - Section A",
        subjectId: "bio",
        subjectName: "Biology",
        totalPlannedHours: 32,
        totalActualHours: 19,
        chaptersCompleted: 2,
        totalChapters: 4,
        currentChapter: "bio-11-3",
        currentChapterName: "Plant Kingdom",
        overallStatus: "in_progress",
        percentComplete: 58,
        lostDays: 0,
        lostDaysReasons: [],
      },
    ],
  },

  // ========================
  // JEE 11 (3 subjects, On Track)
  // ========================
  {
    batchId: "jee-11",
    batchName: "JEE 11",
    className: "Class 11",
    overallProgress: 55,
    status: "on_track",
    subjects: [
      {
        batchId: "jee-11",
        batchName: "JEE 11",
        subjectId: "jee_phy",
        subjectName: "JEE Physics",
        totalPlannedHours: 60,
        totalActualHours: 31,
        chaptersCompleted: 2,
        totalChapters: 4,
        currentChapter: "jee-phy-11-3",
        currentChapterName: "Laws of Motion",
        overallStatus: "in_progress",
        percentComplete: 52,
        lostDays: 1,
        lostDaysReasons: [{ reason: "student_event", count: 1 }],
      },
      {
        batchId: "jee-11",
        batchName: "JEE 11",
        subjectId: "jee_che",
        subjectName: "JEE Chemistry",
        totalPlannedHours: 50,
        totalActualHours: 28,
        chaptersCompleted: 2,
        totalChapters: 4,
        currentChapter: "jee-che-11-3",
        currentChapterName: "Thermodynamics",
        overallStatus: "in_progress",
        percentComplete: 55,
        lostDays: 0,
        lostDaysReasons: [],
      },
      {
        batchId: "jee-11",
        batchName: "JEE 11",
        subjectId: "jee_mat",
        subjectName: "JEE Mathematics",
        totalPlannedHours: 55,
        totalActualHours: 32,
        chaptersCompleted: 2,
        totalChapters: 4,
        currentChapter: "jee-mat-11-3",
        currentChapterName: "Complex Numbers",
        overallStatus: "in_progress",
        percentComplete: 58,
        lostDays: 0,
        lostDaysReasons: [],
      },
    ],
  },
];

// ============================================
// Pending Confirmations - REALISTIC SCENARIOS
// ============================================

export const pendingConfirmations: PendingConfirmation[] = [
  // Batch 7a - 1 pending (Hindi - 2 days overdue)
  { id: "pending-7a-1", batchId: "batch-7a", batchName: "Class 7 - Section A", subjectId: "hin", subjectName: "Hindi", teacherId: "teacher-7", teacherName: "Mrs. Sunita Devi", date: "2026-01-09", expectedPeriods: 2, daysOverdue: 2 },
  
  // Batch 9a - 1 pending (Math - today)
  { id: "pending-9a-1", batchId: "batch-9a", batchName: "Class 9 - Section A", subjectId: "mat", subjectName: "Mathematics", teacherId: "teacher-2", teacherName: "Prof. Verma", date: "2026-01-11", expectedPeriods: 2, daysOverdue: 0 },
  
  // Batch 10a - 2 pending (Physics - 3 days CRITICAL, Chemistry - 1 day)
  { id: "pending-10a-1", batchId: "batch-10a", batchName: "Class 10 - Section A", subjectId: "phy", subjectName: "Physics", teacherId: "teacher-1", teacherName: "Dr. Rajesh Kumar", date: "2026-01-08", expectedPeriods: 2, daysOverdue: 3 },
  { id: "pending-10a-2", batchId: "batch-10a", batchName: "Class 10 - Section A", subjectId: "che", subjectName: "Chemistry", teacherId: "teacher-3", teacherName: "Dr. Meena Gupta", date: "2026-01-10", expectedPeriods: 1, daysOverdue: 1 },
  
  // Batch 11a - 1 pending (Physics - 2 days)
  { id: "pending-11a-1", batchId: "batch-11a", batchName: "Class 11 - Section A", subjectId: "phy", subjectName: "Physics", teacherId: "teacher-1", teacherName: "Dr. Rajesh Kumar", date: "2026-01-09", expectedPeriods: 2, daysOverdue: 2 },
];

// ============================================
// Schedule Adjustments - Drift Resolution History
// ============================================

export const scheduleAdjustments: ScheduleAdjustment[] = [
  // Batch 6a - Math - Extended chapter due to foundational gaps
  {
    id: "adj-6a-mat-1",
    batchId: "batch-6a",
    subjectId: "mat",
    subjectName: "Mathematics",
    chapterId: "mat-6-3",
    chapterName: "Playing with Numbers",
    action: "extend_chapter",
    driftHoursBefore: 3,
    impactDescription: "Chapter extended by 3 periods. Subsequent chapters shifted by 1 week.",
    notes: "Students needed extra practice with prime factorization concepts.",
    adjustedBy: "Academic Incharge",
    adjustedAt: "2026-01-05",
  },
  
  // Batch 10a - Physics - Accepted variance for Light Reflection
  {
    id: "adj-10a-phy-1",
    batchId: "batch-10a",
    subjectId: "phy",
    subjectName: "Physics",
    chapterId: "phy-10-1",
    chapterName: "Light - Reflection and Refraction",
    action: "accept_variance",
    driftHoursBefore: 2,
    impactDescription: "Minor variance accepted. Progress tracking continues without schedule change.",
    notes: "Lab practicals took extra time but were valuable for understanding.",
    adjustedBy: "Dr. Rajesh Kumar",
    adjustedAt: "2026-01-03",
  },
  
  // Batch 9a - Chemistry - Added compensatory class
  {
    id: "adj-9a-che-1",
    batchId: "batch-9a",
    subjectId: "che",
    subjectName: "Chemistry",
    chapterId: "che-9-2",
    chapterName: "Is Matter Around Us Pure?",
    action: "add_compensatory",
    driftHoursBefore: 4,
    impactDescription: "2 compensatory periods scheduled for Saturday.",
    notes: "Teacher absence due to conference. Saturday class approved by principal.",
    adjustedBy: "Academic Incharge",
    adjustedAt: "2025-12-20",
  },
  
  // Batch 11a - Physics - Compressed future teaching
  {
    id: "adj-11a-phy-1",
    batchId: "batch-11a",
    subjectId: "phy",
    subjectName: "Physics",
    chapterId: "phy-11-2",
    chapterName: "Units and Measurements",
    action: "compress_future",
    driftHoursBefore: 2,
    impactDescription: "Next 3 chapters will be taught at accelerated pace to recover 2 hours.",
    notes: "Curriculum revision allows combining some topics.",
    adjustedBy: "Dr. Rajesh Kumar",
    adjustedAt: "2026-01-08",
  },
];
