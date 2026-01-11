// Teacher Profile Mock Data
import { TeacherProfile } from './types';

// Current logged-in teacher (mock)
export const currentTeacher: TeacherProfile = {
  id: "teacher-1",
  name: "Dr. Rajesh Kumar",
  email: "rajesh.kumar@school.edu",
  mobile: "+91 98765 43210",
  subjects: ["Physics"],
  assignedBatches: ["batch-10a", "batch-10b", "batch-11a"],
  assignedClasses: ["Class 10", "Class 11"],
};

// Detailed batch data for content assignment
export const teacherBatches = [
  { id: "batch-10a", name: "10A - Physics Morning", students: 35, class: "Class 10" },
  { id: "batch-10b", name: "10B - Physics Evening", students: 32, class: "Class 10" },
  { id: "batch-11a", name: "11A - JEE Physics", students: 45, class: "Class 11" },
];
