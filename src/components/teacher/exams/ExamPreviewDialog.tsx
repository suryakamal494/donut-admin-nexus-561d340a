import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Eye, 
  EyeOff, 
  Download, 
  Printer,
  FileQuestion,
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Hash,
  Grid3X3,
  Image as ImageIcon,
  CheckSquare
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import type { TeacherExam } from "@/data/teacher/types";

interface ExamPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exam: TeacherExam | null;
}

// Question types for comprehensive preview
interface PreviewQuestion {
  id: string;
  number: number;
  text: string;
  type: 'mcq_single' | 'mcq_multiple' | 'integer' | 'matrix_match' | 'assertion_reasoning' | 'paragraph' | 'fill_blank';
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
  negativeMarks?: number;
  subject: string;
  imageUrl?: string;
  options?: { text: string; imageUrl?: string }[];
  correctAnswer?: number | number[];
  correctValue?: number;
  rows?: { id: string; text: string }[];
  columns?: { id: string; text: string }[];
  assertion?: string;
  reason?: string;
  paragraphText?: string;
  paragraphId?: string;
  blanks?: { id: string; answer: string }[];
  solution?: string;
}

// Comprehensive mock questions covering all types
const mockQuestions: PreviewQuestion[] = [
  {
    id: "q1",
    number: 1,
    text: "A particle is projected with velocity v at an angle θ to the horizontal. The trajectory is shown in the figure. The radius of curvature at the highest point P is:",
    type: "mcq_single",
    difficulty: "medium",
    marks: 4,
    negativeMarks: 1,
    options: [
      { text: "v²cos²θ/g" },
      { text: "v²sin²θ/g" },
      { text: "v²/gcosθ" },
      { text: "v²cos²θ/2g" }
    ],
    correctAnswer: 0,
    subject: "Physics",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop",
    solution: "At highest point, velocity = vcosθ (horizontal). Using R = v²/a where a = g (centripetal), R = v²cos²θ/g"
  },
  {
    id: "q2",
    number: 2,
    text: "The hybridization of carbon atoms in graphite and the type of bonds present are:",
    type: "mcq_single",
    difficulty: "easy",
    marks: 4,
    negativeMarks: 1,
    options: [
      { text: "sp³, σ bonds only" },
      { text: "sp², σ and π bonds" },
      { text: "sp, σ bonds only" },
      { text: "sp³d, σ and π bonds" }
    ],
    correctAnswer: 1,
    subject: "Chemistry",
  },
  {
    id: "q3",
    number: 3,
    text: "If f(x) = sin⁻¹(2x√(1-x²)), -1/√2 ≤ x ≤ 1/√2, then f'(x) is equal to:",
    type: "mcq_single",
    difficulty: "hard",
    marks: 4,
    negativeMarks: 1,
    options: [
      { text: "2/√(1-x²)" },
      { text: "1/√(1-x²)" },
      { text: "-2/√(1-x²)" },
      { text: "2/√(1-4x²)" }
    ],
    correctAnswer: 0,
    subject: "Mathematics",
  },
  {
    id: "q4",
    number: 4,
    text: "Which of the following statements are correct regarding the properties of noble gases?",
    type: "mcq_multiple",
    difficulty: "medium",
    marks: 4,
    negativeMarks: 2,
    options: [
      { text: "They have completely filled outermost shells" },
      { text: "Their ionization energies are very high" },
      { text: "They can form compounds with fluorine and oxygen" },
      { text: "They are all radioactive" }
    ],
    correctAnswer: [0, 1, 2],
    subject: "Chemistry",
  },
  {
    id: "q5",
    number: 5,
    text: "A ball is thrown vertically upward with velocity 20 m/s from the top of a building 100 m high. The time taken to reach the ground is _______ seconds. (Take g = 10 m/s²)",
    type: "integer",
    difficulty: "medium",
    marks: 4,
    correctValue: 6,
    subject: "Physics",
    solution: "Using h = ut + ½gt², -100 = 20t - 5t². Solving: t = 6 seconds"
  },
  {
    id: "q6",
    number: 6,
    text: "Match the following organic compounds with their functional groups:",
    type: "matrix_match",
    difficulty: "hard",
    marks: 4,
    subject: "Chemistry",
    rows: [
      { id: "P", text: "Acetaldehyde" },
      { id: "Q", text: "Acetic acid" },
      { id: "R", text: "Acetone" },
      { id: "S", text: "Ethyl acetate" }
    ],
    columns: [
      { id: "1", text: "Aldehyde (-CHO)" },
      { id: "2", text: "Carboxylic acid (-COOH)" },
      { id: "3", text: "Ketone (-CO-)" },
      { id: "4", text: "Ester (-COO-)" }
    ],
  },
  {
    id: "q7",
    number: 7,
    text: "Consider the following statements about Mendel's laws of inheritance:",
    type: "assertion_reasoning",
    difficulty: "medium",
    marks: 4,
    negativeMarks: 1,
    subject: "Biology",
    assertion: "The law of independent assortment states that alleles of different genes assort independently of one another during gamete formation.",
    reason: "This is because genes for different traits are located on the same chromosome and are inherited together.",
    options: [
      { text: "Both Assertion and Reason are true, and Reason is the correct explanation of Assertion" },
      { text: "Both Assertion and Reason are true, but Reason is NOT the correct explanation of Assertion" },
      { text: "Assertion is true, but Reason is false" },
      { text: "Assertion is false, but Reason is true" }
    ],
    correctAnswer: 2,
  },
  {
    id: "q8-para",
    number: 8,
    text: "Based on the passage above, what is the primary reason for the greenhouse effect on Earth?",
    type: "paragraph",
    difficulty: "medium",
    marks: 4,
    negativeMarks: 1,
    subject: "Physics",
    paragraphId: "para1",
    paragraphText: "The greenhouse effect is a natural process that warms the Earth's surface. When the Sun's energy reaches the Earth's atmosphere, some of it is reflected back to space and the rest is absorbed and re-radiated by greenhouse gases. These gases include water vapor, carbon dioxide, methane, nitrous oxide, and ozone. The absorbed energy warms the atmosphere and the surface of the Earth. This process maintains the Earth's temperature at around 33°C warmer than it would otherwise be, allowing life as we know it to exist. However, human activities, particularly the burning of fossil fuels and deforestation, have significantly increased the concentration of greenhouse gases in the atmosphere, leading to enhanced greenhouse effect and global warming.",
    options: [
      { text: "Reflection of sunlight from the atmosphere" },
      { text: "Absorption and re-radiation of energy by greenhouse gases" },
      { text: "Direct heating by the sun" },
      { text: "Volcanic activity" }
    ],
    correctAnswer: 1,
  },
  {
    id: "q9-para",
    number: 9,
    text: "According to the passage, by how many degrees Celsius does the greenhouse effect warm the Earth?",
    type: "paragraph",
    difficulty: "easy",
    marks: 4,
    negativeMarks: 1,
    subject: "Physics",
    paragraphId: "para1",
    options: [
      { text: "23°C" },
      { text: "33°C" },
      { text: "43°C" },
      { text: "13°C" }
    ],
    correctAnswer: 1,
  },
  {
    id: "q10",
    number: 10,
    text: "The element with atomic number 20 belongs to _______ period and _______ group of the periodic table.",
    type: "fill_blank",
    difficulty: "easy",
    marks: 2,
    subject: "Chemistry",
    blanks: [
      { id: "b1", answer: "4th" },
      { id: "b2", answer: "2 (IIA)" }
    ],
  },
  {
    id: "q11",
    number: 11,
    text: "Identify the correct circuit diagram that represents a series combination of two resistors with an ammeter:",
    type: "mcq_single",
    difficulty: "medium",
    marks: 4,
    negativeMarks: 1,
    subject: "Physics",
    options: [
      { text: "Option A", imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&h=100&fit=crop" },
      { text: "Option B", imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&h=100&fit=crop" },
      { text: "Option C", imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&h=100&fit=crop" },
      { text: "Option D", imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&h=100&fit=crop" }
    ],
    correctAnswer: 0,
  },
  {
    id: "q12",
    number: 12,
    text: "Evaluate: lim(x→0) [(sin(5x) - sin(3x)) / (tan(4x) - tan(2x))]",
    type: "mcq_single",
    difficulty: "hard",
    marks: 4,
    negativeMarks: 1,
    subject: "Mathematics",
    options: [
      { text: "1/3" },
      { text: "2/3" },
      { text: "1/2" },
      { text: "3/4" }
    ],
    correctAnswer: 0,
  },
  {
    id: "q13",
    number: 13,
    text: "Consider the following reaction: 2Al + 6HCl → 2AlCl₃ + 3H₂. If 5.4 g of Al reacts completely, the volume of H₂ evolved at STP is:",
    type: "mcq_single",
    difficulty: "medium",
    marks: 4,
    negativeMarks: 1,
    subject: "Chemistry",
    options: [
      { text: "2.24 L" },
      { text: "4.48 L" },
      { text: "6.72 L" },
      { text: "8.96 L" }
    ],
    correctAnswer: 2,
    solution: "Moles of Al = 5.4/27 = 0.2. Moles of H₂ = 0.3 (3:2 ratio). Volume = 0.3 × 22.4 = 6.72 L"
  },
  {
    id: "q14",
    number: 14,
    text: "Read the assertion and reason carefully:",
    type: "assertion_reasoning",
    difficulty: "hard",
    marks: 4,
    negativeMarks: 1,
    subject: "Physics",
    assertion: "Electric field lines never form closed loops in electrostatic conditions.",
    reason: "The electrostatic field is a conservative field and the work done in moving a charge along a closed path is always zero.",
    options: [
      { text: "Both Assertion and Reason are true, and Reason is the correct explanation of Assertion" },
      { text: "Both Assertion and Reason are true, but Reason is NOT the correct explanation of Assertion" },
      { text: "Assertion is true, but Reason is false" },
      { text: "Both Assertion and Reason are false" }
    ],
    correctAnswer: 0,
  },
  {
    id: "q15",
    number: 15,
    text: "Calculate the number of moles of electrons required to reduce 1 mole of Cr₂O₇²⁻ to Cr³⁺ in acidic medium. The answer is ______.",
    type: "integer",
    difficulty: "hard",
    marks: 4,
    correctValue: 6,
    subject: "Chemistry",
    solution: "Cr₂O₇²⁻ + 14H⁺ + 6e⁻ → 2Cr³⁺ + 7H₂O. Hence, 6 moles of electrons are required."
  },
  {
    id: "q16",
    number: 16,
    text: "Which of the following is the primary site of photosynthesis in plants?",
    type: "mcq_single",
    difficulty: "easy",
    marks: 4,
    negativeMarks: 1,
    subject: "Biology",
    options: [
      { text: "Mitochondria" },
      { text: "Chloroplast" },
      { text: "Nucleus" },
      { text: "Ribosome" }
    ],
    correctAnswer: 1,
  },
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "easy": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "medium": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "hard": return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400";
    default: return "bg-muted text-muted-foreground";
  }
};

const getSubjectColor = (subject: string) => {
  switch (subject) {
    case "Physics": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "Chemistry": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "Mathematics": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    case "Biology": return "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400";
    default: return "bg-muted text-muted-foreground";
  }
};

const getTypeConfig = (type: string) => {
  const configs: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    mcq_single: { label: 'MCQ', color: 'bg-blue-100 text-blue-700', icon: CheckSquare },
    mcq_multiple: { label: 'Multi', color: 'bg-indigo-100 text-indigo-700', icon: CheckSquare },
    integer: { label: 'Integer', color: 'bg-purple-100 text-purple-700', icon: Hash },
    matrix_match: { label: 'Matrix', color: 'bg-teal-100 text-teal-700', icon: Grid3X3 },
    assertion_reasoning: { label: 'A&R', color: 'bg-cyan-100 text-cyan-700', icon: BookOpen },
    paragraph: { label: 'Passage', color: 'bg-amber-100 text-amber-700', icon: BookOpen },
    fill_blank: { label: 'Fill', color: 'bg-orange-100 text-orange-700', icon: Hash },
  };
  return configs[type] || { label: type, color: 'bg-gray-100 text-gray-700', icon: FileQuestion };
};

export const ExamPreviewDialog = ({
  open,
  onOpenChange,
  exam,
}: ExamPreviewDialogProps) => {
  const isMobile = useIsMobile();
  const [showAnswers, setShowAnswers] = useState(false);
  const [compactView, setCompactView] = useState(true);
  const [expandedParagraph, setExpandedParagraph] = useState<string | null>(null);

  if (!exam) return null;

  // Group paragraph questions by their paragraphId
  const seenParagraphs = new Set<string>();

  const content = (
    <div className="flex flex-col h-full min-h-0">
      {/* Exam Info Header */}
      <div className="p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg mb-3 shrink-0">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1">
              <FileQuestion className="w-3.5 h-3.5" />
              {exam.totalQuestions} Qs
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {exam.duration}m
            </span>
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              {exam.totalMarks} marks
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {exam.subjects.map((sub) => (
              <Badge key={sub} variant="secondary" className="text-[10px] px-1.5 py-0.5">
                {sub}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-2 mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAnswers(!showAnswers)}
            className="h-8 text-xs gap-1.5"
          >
            {showAnswers ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showAnswers ? "Hide" : "Show"} Answers
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCompactView(!compactView)}
            className="h-8 text-xs gap-1.5"
          >
            {compactView ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            {compactView ? "Expand" : "Compact"}
          </Button>
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Printer className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Questions List */}
      <ScrollArea className="flex-1 min-h-0 -mx-1 px-1">
        <div className="space-y-2 pb-4">
          {mockQuestions.map((q) => {
            const typeConfig = getTypeConfig(q.type);
            const TypeIcon = typeConfig.icon;
            const showParagraph = q.type === 'paragraph' && q.paragraphId && !seenParagraphs.has(q.paragraphId);
            if (q.paragraphId) seenParagraphs.add(q.paragraphId);

            return (
              <div
                key={q.id}
                className="p-3 bg-card border rounded-lg space-y-2"
              >
                {/* Paragraph Text - Show only once per paragraph */}
                {showParagraph && q.paragraphText && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg mb-2 border border-amber-200 dark:border-amber-800">
                    <button
                      onClick={() => setExpandedParagraph(
                        expandedParagraph === q.paragraphId ? null : q.paragraphId!
                      )}
                      className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 mb-2 w-full text-left"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">Reading Passage</span>
                      {expandedParagraph === q.paragraphId ? (
                        <ChevronUp className="w-3 h-3 ml-auto" />
                      ) : (
                        <ChevronDown className="w-3 h-3 ml-auto" />
                      )}
                    </button>
                    <p className={cn(
                      "text-xs text-muted-foreground leading-relaxed",
                      expandedParagraph === q.paragraphId ? "" : "line-clamp-3"
                    )}>
                      {q.paragraphText}
                    </p>
                  </div>
                )}

                {/* Question Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center shrink-0">
                      {q.number}
                    </span>
                    <Badge className={cn("text-[10px] px-1.5 py-0", typeConfig.color)}>
                      <TypeIcon className="w-2.5 h-2.5 mr-0.5" />
                      {typeConfig.label}
                    </Badge>
                    <Badge className={cn("text-[10px] px-1.5 py-0", getSubjectColor(q.subject))}>
                      {q.subject}
                    </Badge>
                    <Badge className={cn("text-[10px] px-1.5 py-0", getDifficultyColor(q.difficulty))}>
                      {q.difficulty}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground shrink-0 text-right">
                    <span>+{q.marks}</span>
                    {q.negativeMarks && <span className="text-rose-500"> / -{q.negativeMarks}</span>}
                  </div>
                </div>

                {/* Question Image */}
                {q.imageUrl && !compactView && (
                  <div className="relative rounded-lg overflow-hidden bg-muted">
                    <img 
                      src={q.imageUrl} 
                      alt="Question diagram" 
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="text-[9px] gap-0.5">
                        <ImageIcon className="w-2.5 h-2.5" />
                        Diagram
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Question Text */}
                <p className="text-sm leading-relaxed">{q.text}</p>

                {/* Assertion & Reasoning */}
                {q.type === 'assertion_reasoning' && !compactView && (
                  <div className="space-y-2">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-2.5 rounded-lg border border-blue-200 dark:border-blue-800">
                      <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide">Assertion (A):</span>
                      <p className="text-xs text-foreground mt-1">{q.assertion}</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-2.5 rounded-lg border border-green-200 dark:border-green-800">
                      <span className="text-[10px] font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide">Reason (R):</span>
                      <p className="text-xs text-foreground mt-1">{q.reason}</p>
                    </div>
                  </div>
                )}

                {/* Matrix Match */}
                {q.type === 'matrix_match' && q.rows && q.columns && !compactView && (
                  <div className="overflow-x-auto -mx-1 px-1">
                    <table className="w-full text-xs border border-border rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-muted">
                          <th className="p-2 border-r border-b border-border font-medium"></th>
                          {q.columns.map(col => (
                            <th key={col.id} className="p-2 border-r border-b border-border font-medium text-center min-w-[80px]">
                              {col.id}. {col.text}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {q.rows.map(row => (
                          <tr key={row.id}>
                            <td className="p-2 border-r border-b border-border font-medium bg-muted/50">
                              {row.id}. {row.text}
                            </td>
                            {q.columns!.map(col => (
                              <td key={col.id} className="p-2 border-r border-b border-border text-center">
                                <div className="w-4 h-4 border-2 border-muted-foreground/30 rounded mx-auto" />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Integer Type */}
                {q.type === 'integer' && !compactView && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 px-3 py-2 rounded-lg flex items-center gap-2 border border-purple-200 dark:border-purple-800">
                    <Hash className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-xs text-purple-700 dark:text-purple-300">
                      Enter numerical value (0-999)
                    </span>
                    <div className="ml-auto px-3 py-1 bg-white dark:bg-background border rounded text-sm font-mono min-w-[60px] text-center">
                      {showAnswers ? q.correctValue : '___'}
                    </div>
                  </div>
                )}

                {/* Fill in the Blanks */}
                {q.type === 'fill_blank' && q.blanks && !compactView && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center gap-2 text-xs text-orange-700 dark:text-orange-300 mb-2">
                      <Hash className="w-3.5 h-3.5" />
                      Fill in {q.blanks.length} blank(s)
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {q.blanks.map((blank, idx) => (
                        <div key={blank.id} className="px-3 py-1.5 bg-white dark:bg-background border rounded text-xs">
                          Blank {idx + 1}: {showAnswers ? <span className="text-emerald-600 font-medium">{blank.answer}</span> : '_______'}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* MCQ Options */}
                {q.options && !compactView && (q.type === 'mcq_single' || q.type === 'mcq_multiple' || q.type === 'assertion_reasoning' || q.type === 'paragraph') && (
                  <div className="space-y-1.5 mt-2">
                    {q.type === 'mcq_multiple' && (
                      <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                        (One or more correct answers)
                      </p>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = Array.isArray(q.correctAnswer)
                          ? q.correctAnswer.includes(optIdx)
                          : q.correctAnswer === optIdx;

                        return (
                          <div
                            key={optIdx}
                            className={cn(
                              "px-2.5 py-2 rounded-md text-xs border flex items-start gap-2",
                              showAnswers && isCorrect
                                ? "bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-300"
                                : "bg-muted/50 border-transparent"
                            )}
                          >
                            <span className="font-medium shrink-0">
                              {String.fromCharCode(65 + optIdx)}.
                            </span>
                            {opt.imageUrl ? (
                              <div className="flex-1">
                                <img 
                                  src={opt.imageUrl} 
                                  alt={`Option ${String.fromCharCode(65 + optIdx)}`}
                                  className="h-16 w-auto rounded border"
                                />
                                <span className="text-[10px] text-muted-foreground mt-1 block">{opt.text}</span>
                              </div>
                            ) : (
                              <span className="flex-1">{opt.text}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Solution */}
                {showAnswers && q.solution && !compactView && (
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800 mt-2">
                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">Solution:</span>
                    <p className="text-xs text-foreground mt-1">{q.solution}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh] flex flex-col">
          <DrawerHeader className="pb-2 shrink-0">
            <DrawerTitle className="text-base">{exam.name}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6 flex-1 min-h-0 overflow-hidden flex flex-col">
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{exam.name}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          {content}
        </div>
      </DialogContent>
    </Dialog>
  );
};