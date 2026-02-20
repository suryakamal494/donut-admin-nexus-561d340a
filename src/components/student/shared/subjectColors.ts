// Shared Subject Color Configuration
// Single source of truth for subject-specific styling across all student components

import { 
  Calculator, 
  Atom, 
  FlaskConical, 
  Leaf, 
  BookOpen, 
  Code,
  Languages,
  ScrollText,
  Globe,
  Landmark,
  Mountain,
  Scale,
  TrendingUp,
  Microscope,
  Bug,
  Sprout,
  TreePine,
  Palette,
  Dumbbell,
  Receipt,
  Briefcase,
  BrainCircuit,
  Database,
  Home,
  type LucideIcon 
} from "lucide-react";

// ============ TYPES ============

export type SubjectPattern = 
  | "math" | "physics" | "chemistry" | "biology" | "english" | "cs"
  | "hindi" | "sanskrit" | "social-science" | "history" | "geography" 
  | "civics" | "economics" | "science" | "zoology" | "botany" 
  | "evs" | "art" | "pe" | "accountancy" | "business" | "ai" 
  | "informatics" | "home-science";

export type SubjectColorKey = 
  | "blue" | "purple" | "green" | "red" | "amber" | "cyan"
  | "orange" | "indigo" | "slate" | "brown" | "sky" | "lime" 
  | "pink" | "fuchsia" | "stone" | "zinc" | "emerald" | "rose" | "violet" | "teal";

export interface SubjectColorScheme {
  gradient: string;
  headerGradient: string;
  iconBg: string;
  numberBg: string;
  progressBg: string;
  progressFill: string;
  progressBar: string;
  textAccent: string;
  patternColor: string;
  border: string;
  pattern: SubjectPattern;
}

// ============ ICON MAPPING ============

export const subjectIconMap: Record<string, LucideIcon> = {
  Calculator, Atom, FlaskConical, Leaf, BookOpen, Code,
  Languages, ScrollText, Globe, Landmark, Mountain, Scale,
  TrendingUp, Microscope, Bug, Sprout, TreePine, Palette,
  Dumbbell, Receipt, Briefcase, BrainCircuit, Database, Home,
};

// ============ PATTERN MAPPING ============

export const subjectPatternMap: Record<string, SubjectPattern> = {
  math: "math",
  mathematics: "math",
  physics: "physics",
  chemistry: "chemistry",
  biology: "biology",
  english: "english",
  hindi: "hindi",
  sanskrit: "sanskrit",
  cs: "cs",
  "computer-science": "cs",
  "social-science": "social-science",
  "social_science": "social-science",
  history: "history",
  geography: "geography",
  civics: "civics",
  "political-science": "civics",
  economics: "economics",
  science: "science",
  zoology: "zoology",
  botany: "botany",
  evs: "evs",
  "environmental-studies": "evs",
  art: "art",
  "fine-arts": "art",
  pe: "pe",
  "physical-education": "pe",
  accountancy: "accountancy",
  business: "business",
  "business-studies": "business",
  ai: "ai",
  "artificial-intelligence": "ai",
  informatics: "informatics",
  "informatics-practices": "informatics",
  "home-science": "home-science",
};

// ============ COLOR SCHEMES ============

export const subjectColorSchemes: Record<SubjectColorKey, SubjectColorScheme> = {
  blue: {
    gradient: "from-blue-50/90 via-blue-100/50 to-white/80",
    headerGradient: "from-blue-500 to-blue-600",
    iconBg: "bg-gradient-to-br from-blue-400 to-blue-600",
    numberBg: "from-blue-500 to-blue-700",
    progressBg: "bg-blue-100",
    progressFill: "from-blue-400 to-blue-600",
    progressBar: "from-blue-500 to-blue-400",
    textAccent: "text-blue-600",
    patternColor: "text-blue-400",
    border: "border-blue-200/60",
    pattern: "math",
  },
  purple: {
    gradient: "from-violet-50/90 via-purple-100/50 to-white/80",
    headerGradient: "from-purple-500 to-violet-600",
    iconBg: "bg-gradient-to-br from-violet-400 to-purple-600",
    numberBg: "from-violet-500 to-purple-700",
    progressBg: "bg-violet-100",
    progressFill: "from-violet-400 to-purple-600",
    progressBar: "from-purple-500 to-purple-400",
    textAccent: "text-violet-600",
    patternColor: "text-violet-400",
    border: "border-purple-200/60",
    pattern: "physics",
  },
  green: {
    gradient: "from-emerald-50/90 via-green-100/50 to-white/80",
    headerGradient: "from-green-500 to-emerald-600",
    iconBg: "bg-gradient-to-br from-emerald-400 to-green-600",
    numberBg: "from-emerald-500 to-green-700",
    progressBg: "bg-emerald-100",
    progressFill: "from-emerald-400 to-green-600",
    progressBar: "from-emerald-500 to-emerald-400",
    textAccent: "text-emerald-600",
    patternColor: "text-emerald-400",
    border: "border-emerald-200/60",
    pattern: "chemistry",
  },
  red: {
    gradient: "from-rose-50/90 via-red-100/50 to-white/80",
    headerGradient: "from-rose-500 to-red-600",
    iconBg: "bg-gradient-to-br from-rose-400 to-red-500",
    numberBg: "from-rose-500 to-red-600",
    progressBg: "bg-rose-100",
    progressFill: "from-rose-400 to-red-500",
    progressBar: "from-rose-500 to-rose-400",
    textAccent: "text-rose-600",
    patternColor: "text-rose-400",
    border: "border-rose-200/60",
    pattern: "biology",
  },
  amber: {
    gradient: "from-amber-50/90 via-orange-100/50 to-white/80",
    headerGradient: "from-amber-500 to-orange-500",
    iconBg: "bg-gradient-to-br from-amber-400 to-orange-500",
    numberBg: "from-amber-500 to-orange-600",
    progressBg: "bg-amber-100",
    progressFill: "from-amber-400 to-orange-500",
    progressBar: "from-amber-500 to-amber-400",
    textAccent: "text-amber-600",
    patternColor: "text-amber-400",
    border: "border-amber-200/60",
    pattern: "english",
  },
  cyan: {
    gradient: "from-cyan-50/90 via-teal-100/50 to-white/80",
    headerGradient: "from-cyan-500 to-teal-600",
    iconBg: "bg-gradient-to-br from-cyan-400 to-teal-500",
    numberBg: "from-cyan-500 to-teal-600",
    progressBg: "bg-cyan-100",
    progressFill: "from-cyan-400 to-teal-500",
    progressBar: "from-cyan-500 to-cyan-400",
    textAccent: "text-cyan-600",
    patternColor: "text-cyan-400",
    border: "border-cyan-200/60",
    pattern: "cs",
  },
  orange: {
    gradient: "from-orange-50/90 via-orange-100/50 to-white/80",
    headerGradient: "from-orange-500 to-orange-600",
    iconBg: "bg-gradient-to-br from-orange-400 to-orange-600",
    numberBg: "from-orange-500 to-orange-700",
    progressBg: "bg-orange-100",
    progressFill: "from-orange-400 to-orange-600",
    progressBar: "from-orange-500 to-orange-400",
    textAccent: "text-orange-600",
    patternColor: "text-orange-400",
    border: "border-orange-200/60",
    pattern: "hindi",
  },
  indigo: {
    gradient: "from-indigo-50/90 via-indigo-100/50 to-white/80",
    headerGradient: "from-indigo-500 to-indigo-600",
    iconBg: "bg-gradient-to-br from-indigo-400 to-indigo-600",
    numberBg: "from-indigo-500 to-indigo-700",
    progressBg: "bg-indigo-100",
    progressFill: "from-indigo-400 to-indigo-600",
    progressBar: "from-indigo-500 to-indigo-400",
    textAccent: "text-indigo-600",
    patternColor: "text-indigo-400",
    border: "border-indigo-200/60",
    pattern: "sanskrit",
  },
  slate: {
    gradient: "from-slate-50/90 via-slate-100/50 to-white/80",
    headerGradient: "from-slate-500 to-slate-600",
    iconBg: "bg-gradient-to-br from-slate-400 to-slate-600",
    numberBg: "from-slate-500 to-slate-700",
    progressBg: "bg-slate-100",
    progressFill: "from-slate-400 to-slate-600",
    progressBar: "from-slate-500 to-slate-400",
    textAccent: "text-slate-600",
    patternColor: "text-slate-400",
    border: "border-slate-200/60",
    pattern: "social-science",
  },
  brown: {
    gradient: "from-amber-50/90 via-yellow-100/50 to-white/80",
    headerGradient: "from-yellow-700 to-amber-700",
    iconBg: "bg-gradient-to-br from-yellow-600 to-amber-700",
    numberBg: "from-yellow-700 to-amber-800",
    progressBg: "bg-yellow-100",
    progressFill: "from-yellow-600 to-amber-700",
    progressBar: "from-yellow-700 to-yellow-600",
    textAccent: "text-yellow-700",
    patternColor: "text-yellow-600",
    border: "border-yellow-200/60",
    pattern: "history",
  },
  sky: {
    gradient: "from-sky-50/90 via-sky-100/50 to-white/80",
    headerGradient: "from-sky-500 to-sky-600",
    iconBg: "bg-gradient-to-br from-sky-400 to-sky-600",
    numberBg: "from-sky-500 to-sky-700",
    progressBg: "bg-sky-100",
    progressFill: "from-sky-400 to-sky-600",
    progressBar: "from-sky-500 to-sky-400",
    textAccent: "text-sky-600",
    patternColor: "text-sky-400",
    border: "border-sky-200/60",
    pattern: "civics",
  },
  lime: {
    gradient: "from-lime-50/90 via-lime-100/50 to-white/80",
    headerGradient: "from-lime-500 to-lime-600",
    iconBg: "bg-gradient-to-br from-lime-400 to-lime-600",
    numberBg: "from-lime-500 to-lime-700",
    progressBg: "bg-lime-100",
    progressFill: "from-lime-400 to-lime-600",
    progressBar: "from-lime-500 to-lime-400",
    textAccent: "text-lime-600",
    patternColor: "text-lime-400",
    border: "border-lime-200/60",
    pattern: "science",
  },
  pink: {
    gradient: "from-pink-50/90 via-pink-100/50 to-white/80",
    headerGradient: "from-pink-500 to-pink-600",
    iconBg: "bg-gradient-to-br from-pink-400 to-pink-600",
    numberBg: "from-pink-500 to-pink-700",
    progressBg: "bg-pink-100",
    progressFill: "from-pink-400 to-pink-600",
    progressBar: "from-pink-500 to-pink-400",
    textAccent: "text-pink-600",
    patternColor: "text-pink-400",
    border: "border-pink-200/60",
    pattern: "zoology",
  },
  fuchsia: {
    gradient: "from-fuchsia-50/90 via-fuchsia-100/50 to-white/80",
    headerGradient: "from-fuchsia-500 to-fuchsia-600",
    iconBg: "bg-gradient-to-br from-fuchsia-400 to-fuchsia-600",
    numberBg: "from-fuchsia-500 to-fuchsia-700",
    progressBg: "bg-fuchsia-100",
    progressFill: "from-fuchsia-400 to-fuchsia-600",
    progressBar: "from-fuchsia-500 to-fuchsia-400",
    textAccent: "text-fuchsia-600",
    patternColor: "text-fuchsia-400",
    border: "border-fuchsia-200/60",
    pattern: "art",
  },
  stone: {
    gradient: "from-stone-50/90 via-stone-100/50 to-white/80",
    headerGradient: "from-stone-500 to-stone-600",
    iconBg: "bg-gradient-to-br from-stone-400 to-stone-600",
    numberBg: "from-stone-500 to-stone-700",
    progressBg: "bg-stone-100",
    progressFill: "from-stone-400 to-stone-600",
    progressBar: "from-stone-500 to-stone-400",
    textAccent: "text-stone-600",
    patternColor: "text-stone-400",
    border: "border-stone-200/60",
    pattern: "accountancy",
  },
  zinc: {
    gradient: "from-zinc-50/90 via-zinc-100/50 to-white/80",
    headerGradient: "from-zinc-500 to-zinc-600",
    iconBg: "bg-gradient-to-br from-zinc-400 to-zinc-600",
    numberBg: "from-zinc-500 to-zinc-700",
    progressBg: "bg-zinc-100",
    progressFill: "from-zinc-400 to-zinc-600",
    progressBar: "from-zinc-500 to-zinc-400",
    textAccent: "text-zinc-600",
    patternColor: "text-zinc-400",
    border: "border-zinc-200/60",
    pattern: "business",
  },
  emerald: {
    gradient: "from-emerald-50/90 via-emerald-100/50 to-white/80",
    headerGradient: "from-emerald-500 to-emerald-600",
    iconBg: "bg-gradient-to-br from-emerald-400 to-emerald-600",
    numberBg: "from-emerald-500 to-emerald-700",
    progressBg: "bg-emerald-100",
    progressFill: "from-emerald-400 to-emerald-600",
    progressBar: "from-emerald-500 to-emerald-400",
    textAccent: "text-emerald-600",
    patternColor: "text-emerald-400",
    border: "border-emerald-200/60",
    pattern: "botany",
  },
  rose: {
    gradient: "from-rose-50/90 via-rose-100/50 to-white/80",
    headerGradient: "from-rose-500 to-rose-600",
    iconBg: "bg-gradient-to-br from-rose-400 to-rose-600",
    numberBg: "from-rose-500 to-rose-700",
    progressBg: "bg-rose-100",
    progressFill: "from-rose-400 to-rose-600",
    progressBar: "from-rose-500 to-rose-400",
    textAccent: "text-rose-600",
    patternColor: "text-rose-400",
    border: "border-rose-200/60",
    pattern: "home-science",
  },
  violet: {
    gradient: "from-violet-50/90 via-violet-100/50 to-white/80",
    headerGradient: "from-violet-500 to-violet-600",
    iconBg: "bg-gradient-to-br from-violet-400 to-violet-600",
    numberBg: "from-violet-500 to-violet-700",
    progressBg: "bg-violet-100",
    progressFill: "from-violet-400 to-violet-600",
    progressBar: "from-violet-500 to-violet-400",
    textAccent: "text-violet-600",
    patternColor: "text-violet-400",
    border: "border-violet-200/60",
    pattern: "ai",
  },
  teal: {
    gradient: "from-teal-50/90 via-teal-100/50 to-white/80",
    headerGradient: "from-teal-500 to-teal-600",
    iconBg: "bg-gradient-to-br from-teal-400 to-teal-600",
    numberBg: "from-teal-500 to-teal-700",
    progressBg: "bg-teal-100",
    progressFill: "from-teal-400 to-teal-600",
    progressBar: "from-teal-500 to-teal-400",
    textAccent: "text-teal-600",
    patternColor: "text-teal-400",
    border: "border-teal-200/60",
    pattern: "geography",
  },
};

// ============ HELPER FUNCTIONS ============

export function getSubjectColors(colorKey: string): SubjectColorScheme {
  return subjectColorSchemes[colorKey as SubjectColorKey] || subjectColorSchemes.cyan;
}

export function getSubjectIcon(iconName: string): LucideIcon {
  return subjectIconMap[iconName] || BookOpen;
}

export function getSubjectPattern(subjectId: string): SubjectPattern {
  return subjectPatternMap[subjectId] || "math";
}
