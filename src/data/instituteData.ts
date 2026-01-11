// Mock data for Institute Panel
import { ContentType } from "@/components/content/ContentTypeIcon";

export interface InstituteContentItem {
  id: string;
  title: string;
  type: ContentType;
  subject: string;
  subjectId: string;
  chapter: string;
  chapterId: string;
  topic: string;
  topicId?: string;
  classId: string;
  className: string;
  description: string;
  duration?: number;
  size?: string;
  url: string;
  thumbnailUrl?: string;
  embedUrl?: string;
  visibility: "public" | "private" | "restricted";
  status: "published" | "draft" | "archived";
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  viewCount: number;
  downloadCount: number;
  source: "global" | "institute";
  instituteId?: string;
}

export interface Batch {
  id: string;
  name: string;
  classId: string;
  className: string;
  academicYear: string;
  subjects: string[];
  assignedCourses: string[]; // Course IDs (e.g., "cbse", "jee-mains")
  studentCount: number;
  teacherCount: number;
  createdAt: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  mobile: string;
  username: string;
  subjects: string[];
  assignedCourses: string[]; // Courses this teacher teaches (e.g., "cbse", "jee-mains")
  batches: { batchId: string; batchName: string; subject: string }[];
  status: "active" | "inactive";
  createdAt: string;
}

export interface Student {
  id: string;
  
  // Basic Info
  name: string;
  username: string;
  batchId: string;
  batchName: string;
  className: string;
  status: "active" | "inactive";
  createdAt: string;
  
  // Personal Information (Required)
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  studentMobile: string;
  studentEmail: string;
  
  // Personal Information (Optional)
  aadharNumber?: string;
  
  // Parent/Guardian Information
  fatherName?: string;
  fatherMobile?: string;
  fatherOccupation?: string;
  motherName?: string;
  motherMobile?: string;
  guardianName?: string;
  guardianMobile?: string;
  guardianRelation?: string;
  
  // Address Information
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  
  // Academic Information
  previousSchool?: string;
  admissionDate?: string;
  admissionNumber?: string;
  transportRequired?: boolean;
}

export interface TimetableSlot {
  id: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  startTime: string;
  endTime: string;
  subject: string;
  subjectId: string;
  teacher: string;
  teacherId: string;
  batchId: string;
}

export interface InstituteExam {
  id: string;
  name: string;
  status: "draft" | "scheduled" | "live" | "completed";
  subjects: string[];
  totalQuestions: number;
  totalMarks: number;
  duration: number;
  batches: string[];
  scheduledDate?: string;
  uiType: "platform" | "real_exam";
  pattern?: string;
  createdAt: string;
}

// Sample Batches - Expanded dataset for scalability testing (24 batches across 7 classes)
export const batches: Batch[] = [
  // Class 6 - 3 Batches
  {
    id: "batch-6a",
    name: "Section A",
    classId: "class-6",
    className: "Class 6",
    academicYear: "2024-25",
    subjects: ["mat", "sci", "eng", "hin", "sst"],
    assignedCourses: ["cbse"],
    studentCount: 48,
    teacherCount: 5,
    createdAt: "2024-04-01",
  },
  {
    id: "batch-6b",
    name: "Section B",
    classId: "class-6",
    className: "Class 6",
    academicYear: "2024-25",
    subjects: ["mat", "sci", "eng", "hin", "sst"],
    assignedCourses: ["cbse"],
    studentCount: 45,
    teacherCount: 5,
    createdAt: "2024-04-01",
  },
  {
    id: "batch-6c",
    name: "Section C",
    classId: "class-6",
    className: "Class 6",
    academicYear: "2024-25",
    subjects: ["mat", "sci", "eng", "hin", "sst"],
    assignedCourses: ["cbse"],
    studentCount: 42,
    teacherCount: 5,
    createdAt: "2024-04-01",
  },
  // Class 7 - 3 Batches
  {
    id: "batch-7a",
    name: "Section A",
    classId: "class-7",
    className: "Class 7",
    academicYear: "2024-25",
    subjects: ["mat", "sci", "eng", "hin", "sst"],
    assignedCourses: ["cbse"],
    studentCount: 50,
    teacherCount: 5,
    createdAt: "2024-04-01",
  },
  {
    id: "batch-7b",
    name: "Section B",
    classId: "class-7",
    className: "Class 7",
    academicYear: "2024-25",
    subjects: ["mat", "sci", "eng", "hin", "sst"],
    assignedCourses: ["cbse"],
    studentCount: 47,
    teacherCount: 5,
    createdAt: "2024-04-01",
  },
  {
    id: "batch-7c",
    name: "Section C",
    classId: "class-7",
    className: "Class 7",
    academicYear: "2024-25",
    subjects: ["mat", "sci", "eng", "hin", "sst"],
    assignedCourses: ["cbse"],
    studentCount: 44,
    teacherCount: 5,
    createdAt: "2024-04-01",
  },
  // Class 8 - 3 Batches
  {
    id: "batch-8a",
    name: "Section A",
    classId: "class-8",
    className: "Class 8",
    academicYear: "2024-25",
    subjects: ["mat", "sci", "eng", "hin", "sst"],
    assignedCourses: ["cbse"],
    studentCount: 50,
    teacherCount: 5,
    createdAt: "2024-04-01",
  },
  {
    id: "batch-8b",
    name: "Section B",
    classId: "class-8",
    className: "Class 8",
    academicYear: "2024-25",
    subjects: ["mat", "sci", "eng", "hin", "sst"],
    assignedCourses: ["cbse"],
    studentCount: 48,
    teacherCount: 5,
    createdAt: "2024-04-01",
  },
  {
    id: "batch-8c",
    name: "Section C",
    classId: "class-8",
    className: "Class 8",
    academicYear: "2024-25",
    subjects: ["mat", "sci", "eng", "hin", "sst"],
    assignedCourses: ["cbse"],
    studentCount: 46,
    teacherCount: 5,
    createdAt: "2024-04-01",
  },
  // Class 9 - 4 Batches
  {
    id: "batch-9a",
    name: "Section A",
    classId: "class-9",
    className: "Class 9",
    academicYear: "2024-25",
    subjects: ["mat", "phy", "che", "bio", "eng", "hin", "sst"],
    assignedCourses: ["cbse"],
    studentCount: 48,
    teacherCount: 7,
    createdAt: "2024-04-01",
  },
  {
    id: "batch-9b",
    name: "Section B",
    classId: "class-9",
    className: "Class 9",
    academicYear: "2024-25",
    subjects: ["mat", "phy", "che", "bio", "eng", "hin"],
    assignedCourses: ["cbse"],
    studentCount: 46,
    teacherCount: 6,
    createdAt: "2024-04-01",
  },
  {
    id: "batch-9c",
    name: "Section C",
    classId: "class-9",
    className: "Class 9",
    academicYear: "2024-25",
    subjects: ["mat", "phy", "che", "bio", "eng", "hin"],
    assignedCourses: ["cbse"],
    studentCount: 44,
    teacherCount: 6,
    createdAt: "2024-04-01",
  },
  {
    id: "batch-9d",
    name: "Section D",
    classId: "class-9",
    className: "Class 9",
    academicYear: "2024-25",
    subjects: ["mat", "phy", "che", "bio", "eng"],
    assignedCourses: ["cbse"],
    studentCount: 42,
    teacherCount: 5,
    createdAt: "2024-04-01",
  },
  // Class 10 - 4 Batches
  {
    id: "batch-10a",
    name: "Section A",
    classId: "class-10",
    className: "Class 10",
    academicYear: "2024-25",
    subjects: ["mat", "phy", "che", "bio", "eng", "cs", "eco"],
    assignedCourses: ["cbse", "jee-mains"],
    studentCount: 45,
    teacherCount: 7,
    createdAt: "2024-04-01",
  },
  {
    id: "batch-10b",
    name: "Section B",
    classId: "class-10",
    className: "Class 10",
    academicYear: "2024-25",
    subjects: ["mat", "phy", "che", "bio", "eng", "cs", "eco"],
    assignedCourses: ["cbse"],
    studentCount: 42,
    teacherCount: 7,
    createdAt: "2024-04-01",
  },
  {
    id: "batch-10c",
    name: "Section C",
    classId: "class-10",
    className: "Class 10",
    academicYear: "2024-25",
    subjects: ["mat", "phy", "che", "bio", "eng"],
    assignedCourses: ["cbse"],
    studentCount: 40,
    teacherCount: 5,
    createdAt: "2024-04-01",
  },
  {
    id: "batch-10d",
    name: "Section D",
    classId: "class-10",
    className: "Class 10",
    academicYear: "2024-25",
    subjects: ["mat", "phy", "che", "bio", "eng"],
    assignedCourses: ["cbse", "jee-mains"],
    studentCount: 38,
    teacherCount: 5,
    createdAt: "2024-04-01",
  },
  // Class 11 - 4 Batches (JEE Focus)
  {
    id: "batch-11a",
    name: "Section A",
    classId: "class-11",
    className: "Class 11",
    academicYear: "2024-25",
    subjects: ["mat", "phy", "che"],
    assignedCourses: ["jee-mains"],
    studentCount: 35,
    teacherCount: 3,
    createdAt: "2024-04-01",
  },
  {
    id: "batch-11b",
    name: "Section B",
    classId: "class-11",
    className: "Class 11",
    academicYear: "2024-25",
    subjects: ["mat", "phy", "che", "eng"],
    assignedCourses: ["cbse", "jee-mains"],
    studentCount: 38,
    teacherCount: 4,
    createdAt: "2024-04-01",
  },
  {
    id: "batch-11c",
    name: "Section C",
    classId: "class-11",
    className: "Class 11",
    academicYear: "2024-25",
    subjects: ["mat", "phy", "che", "bio"],
    assignedCourses: ["cbse"],
    studentCount: 40,
    teacherCount: 4,
    createdAt: "2024-04-01",
  },
  {
    id: "batch-11d",
    name: "Section D",
    classId: "class-11",
    className: "Class 11",
    academicYear: "2024-25",
    subjects: ["mat", "phy", "che"],
    assignedCourses: ["cbse", "jee-mains"],
    studentCount: 36,
    teacherCount: 3,
    createdAt: "2024-04-01",
  },
  // Class 12 - 3 Batches (JEE Focus)
  {
    id: "batch-12a",
    name: "Section A",
    classId: "class-12",
    className: "Class 12",
    academicYear: "2024-25",
    subjects: ["mat", "phy", "che"],
    assignedCourses: ["cbse", "jee-mains"],
    studentCount: 32,
    teacherCount: 3,
    createdAt: "2024-04-01",
  },
  {
    id: "batch-12b",
    name: "Section B",
    classId: "class-12",
    className: "Class 12",
    academicYear: "2024-25",
    subjects: ["mat", "phy", "che", "eng"],
    assignedCourses: ["cbse", "jee-mains"],
    studentCount: 30,
    teacherCount: 4,
    createdAt: "2024-04-01",
  },
  {
    id: "batch-12c",
    name: "Section C",
    classId: "class-12",
    className: "Class 12",
    academicYear: "2024-25",
    subjects: ["mat", "phy", "che", "bio"],
    assignedCourses: ["cbse"],
    studentCount: 34,
    teacherCount: 4,
    createdAt: "2024-04-01",
  },
];

// Sample Teachers - 10 teachers with diverse course assignments
// Distribution: 3 teach CBSE+JEE (Physics, Math, Chemistry), 7 teach CBSE only
export const teachers: Teacher[] = [
  {
    id: "teacher-1",
    name: "Dr. Rajesh Kumar",
    email: "rajesh.kumar@dps.edu",
    mobile: "9876543210",
    username: "rajesh.kumar",
    subjects: ["phy"],
    assignedCourses: ["cbse", "jee-mains"],
    batches: [
      { batchId: "batch-1", batchName: "Class 10 - Section A", subject: "Physics" },
      { batchId: "batch-2", batchName: "Class 10 - Section B", subject: "Physics" },
      { batchId: "batch-3", batchName: "Class 9 - Section A", subject: "Physics" },
      { batchId: "batch-6", batchName: "Class 11 - Section A", subject: "Physics" },
      { batchId: "batch-7", batchName: "Class 11 - Section B", subject: "Physics" },
    ],
    status: "active",
    createdAt: "2024-03-15",
  },
  {
    id: "teacher-2",
    name: "Mrs. Priya Sharma",
    email: "priya.sharma@dps.edu",
    mobile: "9876543211",
    username: "priya.sharma",
    subjects: ["mat"],
    assignedCourses: ["cbse", "jee-mains"],
    batches: [
      { batchId: "batch-1", batchName: "Class 10 - Section A", subject: "Mathematics" },
      { batchId: "batch-2", batchName: "Class 10 - Section B", subject: "Mathematics" },
      { batchId: "batch-3", batchName: "Class 9 - Section A", subject: "Mathematics" },
      { batchId: "batch-4", batchName: "Class 9 - Section B", subject: "Mathematics" },
      { batchId: "batch-6", batchName: "Class 11 - Section A", subject: "Mathematics" },
      { batchId: "batch-8", batchName: "Class 12 - Section A", subject: "Mathematics" },
    ],
    status: "active",
    createdAt: "2024-03-15",
  },
  {
    id: "teacher-3",
    name: "Mr. Suresh Verma",
    email: "suresh.verma@dps.edu",
    mobile: "9876543212",
    username: "suresh.verma",
    subjects: ["che"],
    assignedCourses: ["cbse", "jee-mains"],
    batches: [
      { batchId: "batch-1", batchName: "Class 10 - Section A", subject: "Chemistry" },
      { batchId: "batch-2", batchName: "Class 10 - Section B", subject: "Chemistry" },
      { batchId: "batch-7", batchName: "Class 11 - Section B", subject: "Chemistry" },
      { batchId: "batch-8", batchName: "Class 12 - Section A", subject: "Chemistry" },
    ],
    status: "active",
    createdAt: "2024-03-15",
  },
  {
    id: "teacher-4",
    name: "Ms. Anjali Gupta",
    email: "anjali.gupta@dps.edu",
    mobile: "9876543213",
    username: "anjali.gupta",
    subjects: ["bio"],
    assignedCourses: ["cbse"],
    batches: [
      { batchId: "batch-1", batchName: "Class 10 - Section A", subject: "Biology" },
      { batchId: "batch-3", batchName: "Class 9 - Section A", subject: "Biology" },
      { batchId: "batch-4", batchName: "Class 9 - Section B", subject: "Biology" },
    ],
    status: "active",
    createdAt: "2024-03-15",
  },
  {
    id: "teacher-5",
    name: "Mr. Vikram Singh",
    email: "vikram.singh@dps.edu",
    mobile: "9876543214",
    username: "vikram.singh",
    subjects: ["eng"],
    assignedCourses: ["cbse"],
    batches: [
      { batchId: "batch-1", batchName: "Class 10 - Section A", subject: "English" },
      { batchId: "batch-2", batchName: "Class 10 - Section B", subject: "English" },
      { batchId: "batch-5", batchName: "Class 8 - Section A", subject: "English" },
      { batchId: "batch-7", batchName: "Class 11 - Section B", subject: "English" },
    ],
    status: "active",
    createdAt: "2024-03-15",
  },
  {
    id: "teacher-6",
    name: "Mrs. Kavita Nair",
    email: "kavita.nair@dps.edu",
    mobile: "9876543215",
    username: "kavita.nair",
    subjects: ["hin"],
    assignedCourses: ["cbse"],
    batches: [
      { batchId: "batch-3", batchName: "Class 9 - Section A", subject: "Hindi" },
      { batchId: "batch-4", batchName: "Class 9 - Section B", subject: "Hindi" },
      { batchId: "batch-5", batchName: "Class 8 - Section A", subject: "Hindi" },
    ],
    status: "active",
    createdAt: "2024-03-15",
  },
  {
    id: "teacher-7",
    name: "Mr. Arun Mehta",
    email: "arun.mehta@dps.edu",
    mobile: "9876543216",
    username: "arun.mehta",
    subjects: ["sst"],
    assignedCourses: ["cbse"],
    batches: [
      { batchId: "batch-5", batchName: "Class 8 - Section A", subject: "Social Studies" },
      { batchId: "batch-3", batchName: "Class 9 - Section A", subject: "Social Studies" },
    ],
    status: "active",
    createdAt: "2024-03-15",
  },
  {
    id: "teacher-8",
    name: "Dr. Sneha Reddy",
    email: "sneha.reddy@dps.edu",
    mobile: "9876543217",
    username: "sneha.reddy",
    subjects: ["cs"],
    assignedCourses: ["cbse"],
    batches: [
      { batchId: "batch-1", batchName: "Class 10 - Section A", subject: "Computer Science" },
      { batchId: "batch-2", batchName: "Class 10 - Section B", subject: "Computer Science" },
    ],
    status: "active",
    createdAt: "2024-03-15",
  },
  {
    id: "teacher-9",
    name: "Mr. Rahul Saxena",
    email: "rahul.saxena@dps.edu",
    mobile: "9876543218",
    username: "rahul.saxena",
    subjects: ["eco"],
    assignedCourses: ["cbse"],
    batches: [
      { batchId: "batch-1", batchName: "Class 10 - Section A", subject: "Economics" },
      { batchId: "batch-2", batchName: "Class 10 - Section B", subject: "Economics" },
    ],
    status: "active",
    createdAt: "2024-03-15",
  },
  {
    id: "teacher-10",
    name: "Mrs. Geeta Iyer",
    email: "geeta.iyer@dps.edu",
    mobile: "9876543219",
    username: "geeta.iyer",
    subjects: ["sci"],
    assignedCourses: ["cbse"],
    batches: [
      { batchId: "batch-5", batchName: "Class 8 - Section A", subject: "Science" },
    ],
    status: "active",
    createdAt: "2024-03-15",
  },
];

// Sample Students - Expanded dataset for scalability testing
export const students: Student[] = [
  // Class 10 - Section A (batch-10a)
  { id: "student-1", name: "Aarav Patel", username: "aarav.patel", batchId: "batch-10a", batchName: "Section A", className: "Class 10", status: "active", createdAt: "2024-04-01", dateOfBirth: "2010-05-15", gender: "male", studentMobile: "9876543210", studentEmail: "aarav.patel@school.com" },
  { id: "student-2", name: "Diya Sharma", username: "diya.sharma", batchId: "batch-10a", batchName: "Section A", className: "Class 10", status: "active", createdAt: "2024-04-01", dateOfBirth: "2010-08-22", gender: "female", studentMobile: "9876543211", studentEmail: "diya.sharma@school.com" },
  { id: "student-3", name: "Arjun Singh", username: "arjun.singh", batchId: "batch-10a", batchName: "Section A", className: "Class 10", status: "active", createdAt: "2024-04-01", dateOfBirth: "2010-03-10", gender: "male", studentMobile: "9876543212", studentEmail: "arjun.singh@school.com" },
  { id: "student-4", name: "Ananya Gupta", username: "ananya.gupta", batchId: "batch-10a", batchName: "Section A", className: "Class 10", status: "active", createdAt: "2024-04-01", dateOfBirth: "2010-11-05", gender: "female", studentMobile: "9876543213", studentEmail: "ananya.gupta@school.com" },
  { id: "student-5", name: "Kavya Nair", username: "kavya.nair", batchId: "batch-10a", batchName: "Section A", className: "Class 10", status: "active", createdAt: "2024-04-01", dateOfBirth: "2010-07-18", gender: "female", studentMobile: "9876543214", studentEmail: "kavya.nair@school.com" },
  { id: "student-6", name: "Rohan Desai", username: "rohan.desai", batchId: "batch-10a", batchName: "Section A", className: "Class 10", status: "inactive", createdAt: "2024-04-01", dateOfBirth: "2010-01-25", gender: "male", studentMobile: "9876543215", studentEmail: "rohan.desai@school.com" },
  
  // Class 10 - Section B (batch-10b)
  { id: "student-7", name: "Vihaan Kumar", username: "vihaan.kumar", batchId: "batch-10b", batchName: "Section B", className: "Class 10", status: "active", createdAt: "2024-04-01", dateOfBirth: "2010-04-12", gender: "male", studentMobile: "9876543216", studentEmail: "vihaan.kumar@school.com" },
  { id: "student-8", name: "Aanya Mehta", username: "aanya.mehta", batchId: "batch-10b", batchName: "Section B", className: "Class 10", status: "active", createdAt: "2024-04-01", dateOfBirth: "2010-09-30", gender: "female", studentMobile: "9876543217", studentEmail: "aanya.mehta@school.com" },
  { id: "student-9", name: "Advait Rao", username: "advait.rao", batchId: "batch-10b", batchName: "Section B", className: "Class 10", status: "active", createdAt: "2024-04-01", dateOfBirth: "2010-06-08", gender: "male", studentMobile: "9876543218", studentEmail: "advait.rao@school.com" },
  { id: "student-10", name: "Myra Kapoor", username: "myra.kapoor", batchId: "batch-10b", batchName: "Section B", className: "Class 10", status: "active", createdAt: "2024-04-01", dateOfBirth: "2010-02-14", gender: "female", studentMobile: "9876543219", studentEmail: "myra.kapoor@school.com" },
  
  // Class 9 - Section A (batch-9a)
  { id: "student-11", name: "Ishaan Reddy", username: "ishaan.reddy", batchId: "batch-9a", batchName: "Section A", className: "Class 9", status: "active", createdAt: "2024-04-01", dateOfBirth: "2011-03-20", gender: "male", studentMobile: "9876543220", studentEmail: "ishaan.reddy@school.com" },
  { id: "student-12", name: "Saanvi Joshi", username: "saanvi.joshi", batchId: "batch-9a", batchName: "Section A", className: "Class 9", status: "active", createdAt: "2024-04-01", dateOfBirth: "2011-07-15", gender: "female", studentMobile: "9876543221", studentEmail: "saanvi.joshi@school.com" },
  { id: "student-13", name: "Vivaan Malhotra", username: "vivaan.malhotra", batchId: "batch-9a", batchName: "Section A", className: "Class 9", status: "active", createdAt: "2024-04-01", dateOfBirth: "2011-11-02", gender: "male", studentMobile: "9876543222", studentEmail: "vivaan.malhotra@school.com" },
  { id: "student-14", name: "Anika Saxena", username: "anika.saxena", batchId: "batch-9a", batchName: "Section A", className: "Class 9", status: "inactive", createdAt: "2024-04-01", dateOfBirth: "2011-05-28", gender: "female", studentMobile: "9876543223", studentEmail: "anika.saxena@school.com" },
  { id: "student-15", name: "Dhruv Pandey", username: "dhruv.pandey", batchId: "batch-9a", batchName: "Section A", className: "Class 9", status: "active", createdAt: "2024-04-01", dateOfBirth: "2011-09-10", gender: "male", studentMobile: "9876543224", studentEmail: "dhruv.pandey@school.com" },
  
  // Class 9 - Section B (batch-9b)
  { id: "student-16", name: "Kiara Bhat", username: "kiara.bhat", batchId: "batch-9b", batchName: "Section B", className: "Class 9", status: "active", createdAt: "2024-04-01", dateOfBirth: "2011-01-18", gender: "female", studentMobile: "9876543225", studentEmail: "kiara.bhat@school.com" },
  { id: "student-17", name: "Reyansh Menon", username: "reyansh.menon", batchId: "batch-9b", batchName: "Section B", className: "Class 9", status: "active", createdAt: "2024-04-01", dateOfBirth: "2011-08-05", gender: "male", studentMobile: "9876543226", studentEmail: "reyansh.menon@school.com" },
  { id: "student-18", name: "Tara Kulkarni", username: "tara.kulkarni", batchId: "batch-9b", batchName: "Section B", className: "Class 9", status: "active", createdAt: "2024-04-01", dateOfBirth: "2011-12-22", gender: "female", studentMobile: "9876543227", studentEmail: "tara.kulkarni@school.com" },
  
  // Class 8 - Section A (batch-8a)
  { id: "student-19", name: "Reyansh Mehta", username: "reyansh.mehta", batchId: "batch-8a", batchName: "Section A", className: "Class 8", status: "active", createdAt: "2024-04-01", dateOfBirth: "2012-04-15", gender: "male", studentMobile: "9876543228", studentEmail: "reyansh.mehta@school.com" },
  { id: "student-20", name: "Zara Shah", username: "zara.shah", batchId: "batch-8a", batchName: "Section A", className: "Class 8", status: "active", createdAt: "2024-04-01", dateOfBirth: "2012-10-30", gender: "female", studentMobile: "9876543229", studentEmail: "zara.shah@school.com" },
  { id: "student-21", name: "Aadhya Pillai", username: "aadhya.pillai", batchId: "batch-8a", batchName: "Section A", className: "Class 8", status: "active", createdAt: "2024-04-01", dateOfBirth: "2012-06-12", gender: "female", studentMobile: "9876543230", studentEmail: "aadhya.pillai@school.com" },
  { id: "student-22", name: "Kabir Chatterjee", username: "kabir.chatterjee", batchId: "batch-8a", batchName: "Section A", className: "Class 8", status: "active", createdAt: "2024-04-01", dateOfBirth: "2012-02-08", gender: "male", studentMobile: "9876543231", studentEmail: "kabir.chatterjee@school.com" },
  
  // Class 11 - Section A (batch-11a)
  { id: "student-23", name: "Arnav Bhatt", username: "arnav.bhatt", batchId: "batch-11a", batchName: "Section A", className: "Class 11", status: "active", createdAt: "2024-04-01", dateOfBirth: "2009-07-25", gender: "male", studentMobile: "9876543232", studentEmail: "arnav.bhatt@school.com" },
  { id: "student-24", name: "Ira Shetty", username: "ira.shetty", batchId: "batch-11a", batchName: "Section A", className: "Class 11", status: "active", createdAt: "2024-04-01", dateOfBirth: "2009-03-18", gender: "female", studentMobile: "9876543233", studentEmail: "ira.shetty@school.com" },
  { id: "student-25", name: "Yash Bansal", username: "yash.bansal", batchId: "batch-11a", batchName: "Section A", className: "Class 11", status: "active", createdAt: "2024-04-01", dateOfBirth: "2009-11-08", gender: "male", studentMobile: "9876543234", studentEmail: "yash.bansal@school.com" },
  
  // Class 12 - Section A (batch-12a)
  { id: "student-26", name: "Riya Verma", username: "riya.verma", batchId: "batch-12a", batchName: "Section A", className: "Class 12", status: "active", createdAt: "2024-04-01", dateOfBirth: "2008-05-10", gender: "female", studentMobile: "9876543235", studentEmail: "riya.verma@school.com" },
  { id: "student-27", name: "Ayaan Khanna", username: "ayaan.khanna", batchId: "batch-12a", batchName: "Section A", className: "Class 12", status: "active", createdAt: "2024-04-01", dateOfBirth: "2008-09-22", gender: "male", studentMobile: "9876543236", studentEmail: "ayaan.khanna@school.com" },
  { id: "student-28", name: "Navya Iyer", username: "navya.iyer", batchId: "batch-12a", batchName: "Section A", className: "Class 12", status: "inactive", createdAt: "2024-04-01", dateOfBirth: "2008-01-05", gender: "female", studentMobile: "9876543237", studentEmail: "navya.iyer@school.com" },
];

// Sample Timetable for Class 10 Section A
export const timetableSlots: TimetableSlot[] = [
  { id: "slot-1", day: "Monday", startTime: "08:00", endTime: "08:45", subject: "Mathematics", subjectId: "mat", teacher: "Mrs. Priya Sharma", teacherId: "teacher-2", batchId: "batch-1" },
  { id: "slot-2", day: "Monday", startTime: "08:45", endTime: "09:30", subject: "Physics", subjectId: "phy", teacher: "Dr. Rajesh Kumar", teacherId: "teacher-1", batchId: "batch-1" },
  { id: "slot-3", day: "Monday", startTime: "09:45", endTime: "10:30", subject: "Chemistry", subjectId: "che", teacher: "Mr. Suresh Verma", teacherId: "teacher-3", batchId: "batch-1" },
  { id: "slot-4", day: "Monday", startTime: "10:30", endTime: "11:15", subject: "English", subjectId: "eng", teacher: "Mr. Vikram Singh", teacherId: "teacher-5", batchId: "batch-1" },
  { id: "slot-5", day: "Tuesday", startTime: "08:00", endTime: "08:45", subject: "Physics", subjectId: "phy", teacher: "Dr. Rajesh Kumar", teacherId: "teacher-1", batchId: "batch-1" },
  { id: "slot-6", day: "Tuesday", startTime: "08:45", endTime: "09:30", subject: "Mathematics", subjectId: "mat", teacher: "Mrs. Priya Sharma", teacherId: "teacher-2", batchId: "batch-1" },
  { id: "slot-7", day: "Tuesday", startTime: "09:45", endTime: "10:30", subject: "Biology", subjectId: "bio", teacher: "Ms. Anjali Gupta", teacherId: "teacher-4", batchId: "batch-1" },
  { id: "slot-8", day: "Wednesday", startTime: "08:00", endTime: "08:45", subject: "Chemistry", subjectId: "che", teacher: "Mr. Suresh Verma", teacherId: "teacher-3", batchId: "batch-1" },
  { id: "slot-9", day: "Wednesday", startTime: "08:45", endTime: "09:30", subject: "English", subjectId: "eng", teacher: "Mr. Vikram Singh", teacherId: "teacher-5", batchId: "batch-1" },
  { id: "slot-10", day: "Thursday", startTime: "08:00", endTime: "08:45", subject: "Mathematics", subjectId: "mat", teacher: "Mrs. Priya Sharma", teacherId: "teacher-2", batchId: "batch-1" },
  { id: "slot-11", day: "Friday", startTime: "08:00", endTime: "08:45", subject: "Physics", subjectId: "phy", teacher: "Dr. Rajesh Kumar", teacherId: "teacher-1", batchId: "batch-1" },
];

// Sample Exams (removed type field)
export const instituteExams: InstituteExam[] = [
  {
    id: "exam-1",
    name: "Mid-Term Physics",
    status: "completed",
    subjects: ["phy"],
    totalQuestions: 30,
    totalMarks: 100,
    duration: 90,
    batches: ["batch-1", "batch-2"],
    scheduledDate: "2024-09-15",
    uiType: "platform",
    createdAt: "2024-09-01",
  },
  {
    id: "exam-2",
    name: "Unit Test - Chemistry",
    status: "scheduled",
    subjects: ["che"],
    totalQuestions: 20,
    totalMarks: 50,
    duration: 60,
    batches: ["batch-1"],
    scheduledDate: "2025-01-10",
    uiType: "platform",
    createdAt: "2024-12-20",
  },
  {
    id: "exam-3",
    name: "Practice Test - Mathematics",
    status: "live",
    subjects: ["mat"],
    totalQuestions: 25,
    totalMarks: 75,
    duration: 75,
    batches: ["batch-1", "batch-3"],
    uiType: "real_exam",
    createdAt: "2024-12-28",
  },
  {
    id: "exam-4",
    name: "Final Exam - All Subjects",
    status: "draft",
    subjects: ["phy", "che", "mat", "bio", "eng"],
    totalQuestions: 100,
    totalMarks: 300,
    duration: 180,
    batches: ["batch-1", "batch-2"],
    uiType: "real_exam",
    pattern: "JEE",
    createdAt: "2024-12-30",
  },
  {
    id: "exam-5",
    name: "Biology Weekly Test",
    status: "draft",
    subjects: ["bio"],
    totalQuestions: 15,
    totalMarks: 30,
    duration: 30,
    batches: [],
    uiType: "platform",
    createdAt: "2025-01-01",
  },
];

// Dashboard Stats
export const dashboardStats = {
  setupStatus: {
    classesConfigured: true,
    batchesCreated: true,
    teachersAdded: true,
    studentsAdded: true,
  },
  todaySnapshot: {
    classesScheduled: 24,
    testsScheduledThisWeek: 3,
    pendingTestReviews: 2,
  },
  counts: {
    totalBatches: 5,
    totalTeachers: 10,
    totalStudents: 231,
    totalExams: 5,
  },
};

// Available classes from Super Admin master data
export const availableClasses = [
  { id: "class-6", name: "Class 6" },
  { id: "class-7", name: "Class 7" },
  { id: "class-8", name: "Class 8" },
  { id: "class-9", name: "Class 9" },
  { id: "class-10", name: "Class 10" },
  { id: "class-11", name: "Class 11" },
  { id: "class-12", name: "Class 12" },
];

// Available subjects from Super Admin master data
export const availableSubjects = [
  { id: "mat", name: "Mathematics" },
  { id: "phy", name: "Physics" },
  { id: "che", name: "Chemistry" },
  { id: "bio", name: "Biology" },
  { id: "eng", name: "English" },
  { id: "hin", name: "Hindi" },
  { id: "sci", name: "Science" },
  { id: "sst", name: "Social Studies" },
  { id: "cs", name: "Computer Science" },
  { id: "eco", name: "Economics" },
];

// Mock Institute Content (mix of global and institute-created)
export const instituteContent: InstituteContentItem[] = [
  // ==========================================
  // GLOBAL CONTENT (from SuperAdmin Library)
  // ==========================================
  
  // Videos - Real YouTube educational content
  {
    id: "gc-v1",
    title: "Newton's Laws of Motion - Complete Explanation",
    type: "video",
    subject: "Physics",
    subjectId: "phy",
    chapter: "Laws of Motion",
    chapterId: "ch-phy-7",
    topic: "Newton's Laws",
    classId: "class-11",
    className: "Class 11",
    description: "Comprehensive explanation of all three Newton's laws with real-world examples and problem-solving techniques",
    duration: 18,
    url: "https://www.youtube.com/watch?v=kKKM8Y-u7ds",
    embedUrl: "https://www.youtube.com/embed/kKKM8Y-u7ds",
    thumbnailUrl: "https://img.youtube.com/vi/kKKM8Y-u7ds/maxresdefault.jpg",
    visibility: "public",
    status: "published",
    createdAt: "2024-09-15",
    updatedAt: "2024-10-01",
    createdBy: "SuperAdmin",
    viewCount: 12580,
    downloadCount: 0,
    source: "global",
  },
  {
    id: "gc-v2",
    title: "Thermodynamics - First Law Explained",
    type: "video",
    subject: "Physics",
    subjectId: "phy",
    chapter: "Thermodynamics",
    chapterId: "ch-phy-8",
    topic: "First Law",
    classId: "class-11",
    className: "Class 11",
    description: "Deep dive into the first law of thermodynamics with practical applications",
    duration: 22,
    url: "https://www.youtube.com/watch?v=Xb05CaG7TsQ",
    embedUrl: "https://www.youtube.com/embed/Xb05CaG7TsQ",
    thumbnailUrl: "https://img.youtube.com/vi/Xb05CaG7TsQ/maxresdefault.jpg",
    visibility: "public",
    status: "published",
    createdAt: "2024-09-20",
    updatedAt: "2024-09-20",
    createdBy: "SuperAdmin",
    viewCount: 8420,
    downloadCount: 0,
    source: "global",
  },
  {
    id: "gc-v3",
    title: "Introduction to Calculus - Limits and Derivatives",
    type: "video",
    subject: "Mathematics",
    subjectId: "mat",
    chapter: "Calculus",
    chapterId: "ch-mat-22",
    topic: "Limits",
    classId: "class-12",
    className: "Class 12",
    description: "Visual introduction to limits and derivatives with beautiful animations by 3Blue1Brown",
    duration: 17,
    url: "https://www.youtube.com/watch?v=WUvTyaaNkzM",
    embedUrl: "https://www.youtube.com/embed/WUvTyaaNkzM",
    thumbnailUrl: "https://img.youtube.com/vi/WUvTyaaNkzM/maxresdefault.jpg",
    visibility: "public",
    status: "published",
    createdAt: "2024-10-05",
    updatedAt: "2024-10-05",
    createdBy: "SuperAdmin",
    viewCount: 15340,
    downloadCount: 0,
    source: "global",
  },
  {
    id: "gc-v4",
    title: "Chemical Bonding - Ionic and Covalent",
    type: "video",
    subject: "Chemistry",
    subjectId: "che",
    chapter: "Chemical Bonding",
    chapterId: "ch-che-26",
    topic: "Types of Bonds",
    classId: "class-11",
    className: "Class 11",
    description: "Understanding ionic and covalent bonds with molecular visualizations",
    duration: 14,
    url: "https://www.youtube.com/watch?v=QqjcCvzWwww",
    embedUrl: "https://www.youtube.com/embed/QqjcCvzWwww",
    thumbnailUrl: "https://img.youtube.com/vi/QqjcCvzWwww/maxresdefault.jpg",
    visibility: "public",
    status: "published",
    createdAt: "2024-10-10",
    updatedAt: "2024-10-10",
    createdBy: "SuperAdmin",
    viewCount: 6780,
    downloadCount: 0,
    source: "global",
  },

  // PDFs - Real educational documents
  {
    id: "gc-p1",
    title: "NCERT Physics Class 11 - Laws of Motion",
    type: "pdf",
    subject: "Physics",
    subjectId: "phy",
    chapter: "Laws of Motion",
    chapterId: "ch-phy-7",
    topic: "Complete Chapter",
    classId: "class-11",
    className: "Class 11",
    description: "Official NCERT textbook chapter on Laws of Motion with solved examples",
    size: "3.2 MB",
    url: "https://ncert.nic.in/textbook/pdf/keph105.pdf",
    thumbnailUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400",
    visibility: "public",
    status: "published",
    createdAt: "2024-08-15",
    updatedAt: "2024-08-15",
    createdBy: "SuperAdmin",
    viewCount: 4520,
    downloadCount: 1890,
    source: "global",
  },
  {
    id: "gc-p2",
    title: "JEE Main 2024 Question Paper with Solutions",
    type: "pdf",
    subject: "Physics",
    subjectId: "phy",
    chapter: "All Chapters",
    chapterId: "ch-0",
    topic: "Previous Year Paper",
    classId: "class-12",
    className: "Class 12",
    description: "Complete JEE Main 2024 paper with detailed step-by-step solutions",
    size: "8.5 MB",
    url: "https://www.embibe.com/exams/jee-main-question-paper/",
    thumbnailUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400",
    visibility: "public",
    status: "published",
    createdAt: "2024-09-01",
    updatedAt: "2024-09-01",
    createdBy: "SuperAdmin",
    viewCount: 18920,
    downloadCount: 7650,
    source: "global",
  },
  {
    id: "gc-p3",
    title: "Organic Chemistry - Reaction Mechanisms",
    type: "pdf",
    subject: "Chemistry",
    subjectId: "che",
    chapter: "Organic Reactions",
    chapterId: "ch-che-25",
    topic: "Reaction Mechanisms",
    classId: "class-12",
    className: "Class 12",
    description: "Comprehensive guide to organic reaction mechanisms with arrow pushing",
    size: "4.1 MB",
    url: "https://ncert.nic.in/textbook/pdf/lech202.pdf",
    thumbnailUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400",
    visibility: "public",
    status: "published",
    createdAt: "2024-09-10",
    updatedAt: "2024-09-10",
    createdBy: "SuperAdmin",
    viewCount: 5670,
    downloadCount: 2340,
    source: "global",
  },
  {
    id: "gc-p4",
    title: "Mathematics Formula Handbook",
    type: "pdf",
    subject: "Mathematics",
    subjectId: "mat",
    chapter: "All Chapters",
    chapterId: "ch-0",
    topic: "Formula Reference",
    classId: "class-12",
    className: "Class 12",
    description: "Complete formula reference for JEE Mathematics covering all topics",
    size: "2.8 MB",
    url: "https://ncert.nic.in/textbook/pdf/lemh1dd.pdf",
    thumbnailUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400",
    visibility: "public",
    status: "published",
    createdAt: "2024-09-15",
    updatedAt: "2024-09-15",
    createdBy: "SuperAdmin",
    viewCount: 9870,
    downloadCount: 4560,
    source: "global",
  },

  // PPT - Presentations
  {
    id: "gc-ppt1",
    title: "Electromagnetic Induction - Complete Lecture",
    type: "ppt",
    subject: "Physics",
    subjectId: "phy",
    chapter: "Electromagnetic Induction",
    chapterId: "ch-phy-11",
    topic: "Faraday's Laws",
    classId: "class-12",
    className: "Class 12",
    description: "Detailed presentation on electromagnetic induction with animations",
    size: "15.2 MB",
    url: "https://docs.google.com/presentation/d/e/2PACX-1vRjfWw5zHJx6Fwt_cGKWZ0A7x_mK9vXyO5z6rZDjh2rN0sH8yQ6T1jK3qM9xN5wL7aS2vB4nF8dC1eR/pub",
    embedUrl: "https://docs.google.com/presentation/d/e/2PACX-1vRjfWw5zHJx6Fwt_cGKWZ0A7x_mK9vXyO5z6rZDjh2rN0sH8yQ6T1jK3qM9xN5wL7aS2vB4nF8dC1eR/embed?start=false&loop=false&delayms=3000",
    thumbnailUrl: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400",
    visibility: "public",
    status: "published",
    createdAt: "2024-10-01",
    updatedAt: "2024-10-01",
    createdBy: "SuperAdmin",
    viewCount: 3450,
    downloadCount: 890,
    source: "global",
  },
  {
    id: "gc-ppt2",
    title: "Periodic Table Trends",
    type: "ppt",
    subject: "Chemistry",
    subjectId: "che",
    chapter: "Periodic Classification",
    chapterId: "ch-che-26",
    topic: "Periodic Trends",
    classId: "class-11",
    className: "Class 11",
    description: "Visual guide to periodic trends including electronegativity and atomic radius",
    size: "12.8 MB",
    url: "https://docs.google.com/presentation/d/e/2PACX-1vT6xYhJ2sB8F7cK4dN9xL3mP5aR2qW7zX1oY8iU3tE6vF4jH9gN2bM7wQ5sK1cL8dA3nO6pS4rV9eT/pub",
    embedUrl: "https://docs.google.com/presentation/d/e/2PACX-1vT6xYhJ2sB8F7cK4dN9xL3mP5aR2qW7zX1oY8iU3tE6vF4jH9gN2bM7wQ5sK1cL8dA3nO6pS4rV9eT/embed?start=false&loop=false&delayms=3000",
    thumbnailUrl: "https://images.unsplash.com/photo-1628863353691-0071c8c1874c?w=400",
    visibility: "public",
    status: "published",
    createdAt: "2024-10-05",
    updatedAt: "2024-10-05",
    createdBy: "SuperAdmin",
    viewCount: 2890,
    downloadCount: 720,
    source: "global",
  },
  {
    id: "gc-ppt3",
    title: "Coordinate Geometry Masterclass",
    type: "ppt",
    subject: "Mathematics",
    subjectId: "mat",
    chapter: "Coordinate Geometry",
    chapterId: "ch-mat-20",
    topic: "Straight Lines",
    classId: "class-11",
    className: "Class 11",
    description: "Complete coordinate geometry concepts with problem-solving strategies",
    size: "9.5 MB",
    url: "https://docs.google.com/presentation/d/e/2PACX-1vR2wA3xY4bC5dE6fG7hI8jK9lM0nO1pQ2rS3tU4vW5xY6zA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU/pub",
    embedUrl: "https://docs.google.com/presentation/d/e/2PACX-1vR2wA3xY4bC5dE6fG7hI8jK9lM0nO1pQ2rS3tU4vW5xY6zA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU/embed?start=false&loop=false&delayms=3000",
    thumbnailUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400",
    visibility: "public",
    status: "published",
    createdAt: "2024-10-08",
    updatedAt: "2024-10-08",
    createdBy: "SuperAdmin",
    viewCount: 1560,
    downloadCount: 340,
    source: "global",
  },

  // Interactive Simulations (iframe)
  {
    id: "gc-i1",
    title: "Forces and Motion - Interactive Simulation",
    type: "iframe",
    subject: "Physics",
    subjectId: "phy",
    chapter: "Laws of Motion",
    chapterId: "ch-phy-7",
    topic: "Forces",
    classId: "class-11",
    className: "Class 11",
    description: "PhET interactive simulation for understanding forces, friction, and motion",
    url: "https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_en.html",
    embedUrl: "https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_en.html",
    thumbnailUrl: "https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics-600.png",
    visibility: "public",
    status: "published",
    createdAt: "2024-09-25",
    updatedAt: "2024-09-25",
    createdBy: "SuperAdmin",
    viewCount: 7890,
    downloadCount: 0,
    source: "global",
  },
  {
    id: "gc-i2",
    title: "Graphing Calculator - Desmos",
    type: "iframe",
    subject: "Mathematics",
    subjectId: "mat",
    chapter: "Functions",
    chapterId: "ch-mat-18",
    topic: "Graph Plotting",
    classId: "class-11",
    className: "Class 11",
    description: "Interactive graphing calculator for visualizing mathematical functions",
    url: "https://www.desmos.com/calculator",
    embedUrl: "https://www.desmos.com/calculator",
    thumbnailUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400",
    visibility: "public",
    status: "published",
    createdAt: "2024-09-28",
    updatedAt: "2024-09-28",
    createdBy: "SuperAdmin",
    viewCount: 11230,
    downloadCount: 0,
    source: "global",
  },
  {
    id: "gc-i3",
    title: "Molecule Shapes - 3D Visualization",
    type: "iframe",
    subject: "Chemistry",
    subjectId: "che",
    chapter: "Chemical Bonding",
    chapterId: "ch-che-26",
    topic: "VSEPR Theory",
    classId: "class-11",
    className: "Class 11",
    description: "PhET simulation for exploring molecular geometry and VSEPR theory",
    url: "https://phet.colorado.edu/sims/html/molecule-shapes/latest/molecule-shapes_en.html",
    embedUrl: "https://phet.colorado.edu/sims/html/molecule-shapes/latest/molecule-shapes_en.html",
    thumbnailUrl: "https://phet.colorado.edu/sims/html/molecule-shapes/latest/molecule-shapes-600.png",
    visibility: "public",
    status: "published",
    createdAt: "2024-10-02",
    updatedAt: "2024-10-02",
    createdBy: "SuperAdmin",
    viewCount: 5670,
    downloadCount: 0,
    source: "global",
  },

  // Animations
  {
    id: "gc-a1",
    title: "Wave Motion Animation",
    type: "animation",
    subject: "Physics",
    subjectId: "phy",
    chapter: "Waves",
    chapterId: "ch-phy-8",
    topic: "Wave Properties",
    classId: "class-11",
    className: "Class 11",
    description: "Interactive HTML5 animation showing transverse and longitudinal waves",
    duration: 5,
    url: "https://phet.colorado.edu/sims/html/wave-on-a-string/latest/wave-on-a-string_en.html",
    embedUrl: "https://phet.colorado.edu/sims/html/wave-on-a-string/latest/wave-on-a-string_en.html",
    thumbnailUrl: "https://phet.colorado.edu/sims/html/wave-on-a-string/latest/wave-on-a-string-600.png",
    visibility: "public",
    status: "published",
    createdAt: "2024-10-03",
    updatedAt: "2024-10-03",
    createdBy: "SuperAdmin",
    viewCount: 4560,
    downloadCount: 0,
    source: "global",
  },

  // ==========================================
  // INSTITUTE CONTENT (Your Content)
  // ==========================================
  
  // Teacher-created revision materials
  {
    id: "ic-1",
    title: "Class 10 Physics - Quick Revision Notes",
    type: "pdf",
    subject: "Physics",
    subjectId: "phy",
    chapter: "All Chapters",
    chapterId: "ch-0",
    topic: "Revision Notes",
    classId: "class-10",
    className: "Class 10",
    description: "Comprehensive revision notes prepared by Dr. Rajesh Kumar covering all Class 10 Physics chapters with key formulas and diagrams",
    size: "2.4 MB",
    url: "#teacher-notes",
    thumbnailUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400",
    visibility: "public",
    status: "published",
    createdAt: "2024-11-15",
    updatedAt: "2024-11-15",
    createdBy: "Dr. Rajesh Kumar",
    viewCount: 342,
    downloadCount: 156,
    source: "institute",
    instituteId: "inst-1",
  },
  {
    id: "ic-2",
    title: "Mathematics Practice Problems - Quadratic Equations",
    type: "pdf",
    subject: "Mathematics",
    subjectId: "mat",
    chapter: "Quadratic Equations",
    chapterId: "ch-mat-16",
    topic: "Practice Problems",
    classId: "class-10",
    className: "Class 10",
    description: "50 practice problems on quadratic equations with step-by-step solutions compiled by Mrs. Priya Sharma",
    size: "1.8 MB",
    url: "#practice-problems",
    thumbnailUrl: "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=400",
    visibility: "public",
    status: "published",
    createdAt: "2024-11-20",
    updatedAt: "2024-11-20",
    createdBy: "Mrs. Priya Sharma",
    viewCount: 287,
    downloadCount: 198,
    source: "institute",
    instituteId: "inst-1",
  },
  {
    id: "ic-3",
    title: "Lab Safety Guidelines Video",
    type: "video",
    subject: "Chemistry",
    subjectId: "che",
    chapter: "Lab Work",
    chapterId: "ch-lab",
    topic: "Safety Guidelines",
    classId: "class-10",
    className: "Class 10",
    description: "Essential lab safety guidelines recorded by Mr. Suresh Verma for all chemistry practical sessions",
    duration: 12,
    url: "https://www.youtube.com/watch?v=VRWRmIEHr3A",
    embedUrl: "https://www.youtube.com/embed/VRWRmIEHr3A",
    thumbnailUrl: "https://img.youtube.com/vi/VRWRmIEHr3A/maxresdefault.jpg",
    visibility: "public",
    status: "published",
    createdAt: "2024-10-25",
    updatedAt: "2024-10-25",
    createdBy: "Mr. Suresh Verma",
    viewCount: 523,
    downloadCount: 0,
    source: "institute",
    instituteId: "inst-1",
  },
  {
    id: "ic-4",
    title: "Human Body Systems - Interactive Diagrams",
    type: "image",
    subject: "Biology",
    subjectId: "bio",
    chapter: "Life Processes",
    chapterId: "ch-bio-4",
    topic: "Body Systems",
    classId: "class-10",
    className: "Class 10",
    description: "High-resolution labeled diagrams of human body systems created by Ms. Anjali Gupta for classroom reference",
    size: "5.2 MB",
    url: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800",
    thumbnailUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400",
    visibility: "public",
    status: "published",
    createdAt: "2024-11-10",
    updatedAt: "2024-11-10",
    createdBy: "Ms. Anjali Gupta",
    viewCount: 412,
    downloadCount: 267,
    source: "institute",
    instituteId: "inst-1",
  },
  {
    id: "ic-5",
    title: "English Grammar - Tenses Presentation",
    type: "ppt",
    subject: "English",
    subjectId: "eng",
    chapter: "Grammar",
    chapterId: "ch-eng-gram",
    topic: "Tenses",
    classId: "class-9",
    className: "Class 9",
    description: "Comprehensive presentation on all English tenses with examples and practice exercises by Mr. Vikram Singh",
    size: "8.4 MB",
    url: "#tenses-ppt",
    thumbnailUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400",
    visibility: "public",
    status: "published",
    createdAt: "2024-11-05",
    updatedAt: "2024-11-05",
    createdBy: "Mr. Vikram Singh",
    viewCount: 198,
    downloadCount: 89,
    source: "institute",
    instituteId: "inst-1",
  },
  {
    id: "ic-6",
    title: "Chemistry Chapter Summary - Acids and Bases",
    type: "pdf",
    subject: "Chemistry",
    subjectId: "che",
    chapter: "Acids, Bases and Salts",
    chapterId: "ch-che-24",
    topic: "Chapter Summary",
    classId: "class-10",
    className: "Class 10",
    description: "One-page summary sheet with all important reactions and pH scale details",
    size: "0.8 MB",
    url: "#acid-base-summary",
    thumbnailUrl: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400",
    visibility: "public",
    status: "published",
    createdAt: "2024-12-01",
    updatedAt: "2024-12-01",
    createdBy: "Mr. Suresh Verma",
    viewCount: 156,
    downloadCount: 98,
    source: "institute",
    instituteId: "inst-1",
  },
  {
    id: "ic-7",
    title: "Audio Lecture - Real Numbers",
    type: "audio",
    subject: "Mathematics",
    subjectId: "mat",
    chapter: "Real Numbers",
    chapterId: "ch-mat-13",
    topic: "Complete Chapter",
    classId: "class-10",
    className: "Class 10",
    description: "Recorded audio lecture by Mrs. Priya Sharma explaining real numbers concepts for revision",
    duration: 35,
    url: "#audio-real-numbers",
    thumbnailUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400",
    visibility: "public",
    status: "published",
    createdAt: "2024-12-10",
    updatedAt: "2024-12-10",
    createdBy: "Mrs. Priya Sharma",
    viewCount: 89,
    downloadCount: 34,
    source: "institute",
    instituteId: "inst-1",
  },
  {
    id: "ic-8",
    title: "Computer Science - Python Basics Worksheet",
    type: "pdf",
    subject: "Computer Science",
    subjectId: "cs",
    chapter: "Python Programming",
    chapterId: "ch-cs-py",
    topic: "Basics",
    classId: "class-10",
    className: "Class 10",
    description: "Practice worksheet with 25 Python coding exercises for beginners",
    size: "1.2 MB",
    url: "#python-worksheet",
    thumbnailUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400",
    visibility: "public",
    status: "draft",
    createdAt: "2024-12-15",
    updatedAt: "2024-12-15",
    createdBy: "Dr. Sneha Reddy",
    viewCount: 45,
    downloadCount: 12,
    source: "institute",
    instituteId: "inst-1",
  },
  {
    id: "ic-9",
    title: "Economics - Market Structures Notes",
    type: "pdf",
    subject: "Economics",
    subjectId: "eco",
    chapter: "Market Structures",
    chapterId: "ch-eco-ms",
    topic: "All Types",
    classId: "class-10",
    className: "Class 10",
    description: "Detailed notes on perfect competition, monopoly, and oligopoly with comparison tables",
    size: "1.5 MB",
    url: "#market-structures",
    thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
    visibility: "public",
    status: "published",
    createdAt: "2024-12-05",
    updatedAt: "2024-12-05",
    createdBy: "Mr. Rahul Saxena",
    viewCount: 78,
    downloadCount: 42,
    source: "institute",
    instituteId: "inst-1",
  },
  {
    id: "ic-10",
    title: "Class 9 Science - Half-Yearly Exam Prep",
    type: "pdf",
    subject: "Science",
    subjectId: "sci",
    chapter: "All Chapters",
    chapterId: "ch-0",
    topic: "Exam Preparation",
    classId: "class-9",
    className: "Class 9",
    description: "Important questions and model answers for half-yearly examination preparation",
    size: "3.1 MB",
    url: "#halfyearly-prep",
    thumbnailUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400",
    visibility: "public",
    status: "published",
    createdAt: "2024-11-28",
    updatedAt: "2024-11-28",
    createdBy: "Mrs. Geeta Iyer",
    viewCount: 234,
    downloadCount: 187,
    source: "institute",
    instituteId: "inst-1",
  },
];

// ============================================
// ASSIGNED TRACKS (Institute's assigned curriculums/courses shown as unified "tracks")
// ============================================
export interface AssignedTrack {
  id: string;
  name: string;
  type: "curriculum" | "course"; // Internal only - not shown to user
  hasClasses: boolean; // Determines 3-panel vs 2-panel layout
}

export const assignedTracks: AssignedTrack[] = [
  { 
    id: "cbse", 
    name: "CBSE", 
    type: "curriculum",
    hasClasses: true
  },
  { 
    id: "jee-mains", 
    name: "JEE Mains", 
    type: "course",
    hasClasses: false
  },
];