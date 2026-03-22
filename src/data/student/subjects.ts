// Student Subjects Data - Completely separate from other modules

export type SubjectStatus = 
  | "in-progress" 
  | "just-started" 
  | "doing-well" 
  | "needs-attention" 
  | "almost-done" 
  | "on-track";

export interface StudentSubject {
  id: string;
  name: string;
  icon: string;
  progress: number;
  status: SubjectStatus;
  color: string;
  chaptersTotal: number;
  chaptersCompleted: number;
  /** Available curricula for this subject. If length <= 1, no switcher is shown. */
  curricula?: string[];
  /** Per-curriculum pending work flags. Only relevant when curricula.length > 1. */
  pendingWork?: Record<string, boolean>;
}

export const studentSubjects: StudentSubject[] = [
  { id: "math", name: "Mathematics", icon: "Calculator", progress: 45, status: "in-progress", color: "blue", chaptersTotal: 6, chaptersCompleted: 3 },
  { id: "physics", name: "Physics", icon: "Atom", progress: 15, status: "just-started", color: "purple", chaptersTotal: 5, chaptersCompleted: 1 },
  { id: "chemistry", name: "Chemistry", icon: "FlaskConical", progress: 78, status: "doing-well", color: "green", chaptersTotal: 5, chaptersCompleted: 4 },
  { id: "biology", name: "Biology", icon: "Leaf", progress: 25, status: "needs-attention", color: "red", chaptersTotal: 6, chaptersCompleted: 2 },
  { id: "english", name: "English", icon: "BookOpen", progress: 88, status: "almost-done", color: "amber", chaptersTotal: 4, chaptersCompleted: 4 },
  { id: "cs", name: "Computer Science", icon: "Code", progress: 55, status: "on-track", color: "cyan", chaptersTotal: 5, chaptersCompleted: 3 },

  { id: "hindi", name: "Hindi", icon: "Languages", progress: 62, status: "on-track", color: "orange", chaptersTotal: 8, chaptersCompleted: 5 },
  { id: "sanskrit", name: "Sanskrit", icon: "ScrollText", progress: 35, status: "in-progress", color: "indigo", chaptersTotal: 6, chaptersCompleted: 2 },
  { id: "social-science", name: "Social Science", icon: "Globe", progress: 50, status: "on-track", color: "slate", chaptersTotal: 10, chaptersCompleted: 5 },
  { id: "history", name: "History", icon: "Landmark", progress: 40, status: "in-progress", color: "brown", chaptersTotal: 8, chaptersCompleted: 3 },
  { id: "geography", name: "Geography", icon: "Mountain", progress: 70, status: "doing-well", color: "teal", chaptersTotal: 7, chaptersCompleted: 5 },
  { id: "civics", name: "Political Science", icon: "Scale", progress: 30, status: "just-started", color: "sky", chaptersTotal: 6, chaptersCompleted: 2 },
  { id: "economics", name: "Economics", icon: "TrendingUp", progress: 58, status: "on-track", color: "emerald", chaptersTotal: 8, chaptersCompleted: 5 },
  { id: "science", name: "Science", icon: "Microscope", progress: 48, status: "in-progress", color: "lime", chaptersTotal: 10, chaptersCompleted: 5 },
  { id: "zoology", name: "Zoology", icon: "Bug", progress: 22, status: "just-started", color: "pink", chaptersTotal: 6, chaptersCompleted: 1 },
  { id: "botany", name: "Botany", icon: "Sprout", progress: 65, status: "doing-well", color: "emerald", chaptersTotal: 6, chaptersCompleted: 4 },
  { id: "evs", name: "Environmental Studies", icon: "TreePine", progress: 80, status: "almost-done", color: "teal", chaptersTotal: 5, chaptersCompleted: 4 },
  { id: "art", name: "Fine Arts", icon: "Palette", progress: 90, status: "almost-done", color: "fuchsia", chaptersTotal: 4, chaptersCompleted: 4 },
  { id: "pe", name: "Physical Education", icon: "Dumbbell", progress: 72, status: "doing-well", color: "orange", chaptersTotal: 5, chaptersCompleted: 4 },
  { id: "accountancy", name: "Accountancy", icon: "Receipt", progress: 38, status: "needs-attention", color: "stone", chaptersTotal: 8, chaptersCompleted: 3 },
  { id: "business", name: "Business Studies", icon: "Briefcase", progress: 52, status: "on-track", color: "zinc", chaptersTotal: 7, chaptersCompleted: 4 },
  { id: "ai", name: "Artificial Intelligence", icon: "BrainCircuit", progress: 18, status: "just-started", color: "violet", chaptersTotal: 6, chaptersCompleted: 1 },
  { id: "informatics", name: "Informatics Practices", icon: "Database", progress: 42, status: "in-progress", color: "sky", chaptersTotal: 6, chaptersCompleted: 3 },
  { id: "home-science", name: "Home Science", icon: "Home", progress: 60, status: "on-track", color: "rose", chaptersTotal: 5, chaptersCompleted: 3 },
];
