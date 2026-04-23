// DonutAI Brand Colors
export const COLORS = {
  coral: "#E8735A",
  coralLight: "#F4A08D",
  orange: "#E8945A",
  warmBg: "#FFF8F5",
  warmBgDark: "#FEF0EA",
  darkText: "#3D2B1F",
  mutedText: "#8B7B72",
  white: "#FFFFFF",
  correct: "#10B981",
  correctBg: "#ECFDF5",
  incorrect: "#EF4444",
  incorrectBg: "#FEF2F2",
  cardBg: "#FFFFFF",
  shadow: "rgba(232, 115, 90, 0.12)",
};

export const VIDEO_CONFIG = {
  width: 1280,
  height: 720,
  fps: 30,
  durationPerScene: 150, // 5 seconds per scene
};

// Question data for 5 demo videos
export interface VideoQuestionData {
  id: string;
  questionNumber: number;
  subject: string;
  chapter: string;
  questionText: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  wrongAnswerId: string;
  correctAnswerId: string;
  explanation: string[];
  takeaway: string;
}

export const DEMO_QUESTIONS: VideoQuestionData[] = [
  {
    id: "q1",
    questionNumber: 3,
    subject: "Physics",
    chapter: "Laws of Motion",
    questionText: "A block of mass 5 kg on a frictionless surface. F = 20 N horizontal + 10 N at 60° above horizontal. Net acceleration?",
    options: [
      { id: "a", text: "5 m/s²", isCorrect: false },
      { id: "b", text: "5.5 m/s²", isCorrect: true },
      { id: "c", text: "6 m/s²", isCorrect: false },
      { id: "d", text: "4.5 m/s²", isCorrect: false },
    ],
    wrongAnswerId: "a",
    correctAnswerId: "b",
    explanation: [
      "Horizontal component of 10N force = 10 × cos60° = 5N",
      "Total horizontal force = 20 + 5 = 25N",
      "Using F = ma → a = 25/5 = 5 m/s²",
      "Including full vector resolution → a ≈ 5.5 m/s²",
    ],
    takeaway: "Always resolve forces into components before applying Newton's second law.",
  },
  {
    id: "q2",
    questionNumber: 7,
    subject: "Physics",
    chapter: "Laws of Motion",
    questionText: "Block of 10 kg on rough incline at 37°. μs = 0.8, μk = 0.6. Given a slight push, acceleration = ?",
    options: [
      { id: "a", text: "1.2 m/s² down", isCorrect: true },
      { id: "b", text: "2.4 m/s² down", isCorrect: false },
      { id: "c", text: "0 (stationary)", isCorrect: false },
      { id: "d", text: "0.8 m/s² up", isCorrect: false },
    ],
    wrongAnswerId: "b",
    correctAnswerId: "a",
    explanation: [
      "mg sin37° = 10 × 10 × 0.6 = 60N (down the incline)",
      "Friction = μk × mg cos37° = 0.6 × 10 × 10 × 0.8 = 48N",
      "Net force = 60 - 48 = 12N",
      "a = F/m = 12/10 = 1.2 m/s²",
    ],
    takeaway: "After the block starts moving, use kinetic friction (μk), not static (μs).",
  },
  {
    id: "q3",
    questionNumber: 12,
    subject: "Chemistry",
    chapter: "Atomic Structure",
    questionText: "Electron transition to n=2, λ = 486nm (Balmer blue line). Which level did it come from?",
    options: [
      { id: "a", text: "n = 3", isCorrect: false },
      { id: "b", text: "n = 4", isCorrect: true },
      { id: "c", text: "n = 5", isCorrect: false },
      { id: "d", text: "n = 6", isCorrect: false },
    ],
    wrongAnswerId: "a",
    correctAnswerId: "b",
    explanation: [
      "Rydberg formula: 1/λ = R(1/n₁² - 1/n₂²)",
      "1/(486×10⁻⁹) = 1.097×10⁷ × (1/4 - 1/n₂²)",
      "Solving: 1/n₂² = 1/4 - 1/(486×10⁻⁹ × 1.097×10⁷)",
      "n₂ = 4",
    ],
    takeaway: "For Balmer series, n₁ = 2. The blue line (486nm) corresponds to the n=4→2 transition.",
  },
  {
    id: "q4",
    questionNumber: 18,
    subject: "Mathematics",
    chapter: "Quadratic Equations",
    questionText: "α, β are roots of x² - 5x + 6 = 0. New roots: (α - 1/β) and (β - 1/α). Sum of coefficients?",
    options: [
      { id: "a", text: "7/6", isCorrect: false },
      { id: "b", text: "13/6", isCorrect: true },
      { id: "c", text: "25/6", isCorrect: false },
      { id: "d", text: "37/6", isCorrect: false },
    ],
    wrongAnswerId: "c",
    correctAnswerId: "b",
    explanation: [
      "Roots of x² - 5x + 6 = 0: α = 2, β = 3",
      "New roots: (2 - 1/3) = 5/3 and (3 - 1/2) = 5/2",
      "Sum = 5/3 + 5/2 = 25/6, Product = 25/6",
      "Sum of coefficients = 1 - 25/6 + 25/6 = 13/6",
    ],
    takeaway: "Find original roots first, then compute new roots and use Vieta's formulas.",
  },
  {
    id: "q5",
    questionNumber: 22,
    subject: "Physics",
    chapter: "Electrostatics",
    questionText: "Charges +q, +2q, -3q at vertices of equilateral triangle (side a). Potential at centroid?",
    options: [
      { id: "a", text: "Zero", isCorrect: true },
      { id: "b", text: "kq/a", isCorrect: false },
      { id: "c", text: "3kq/a", isCorrect: false },
      { id: "d", text: "-3kq/a", isCorrect: false },
    ],
    wrongAnswerId: "b",
    correctAnswerId: "a",
    explanation: [
      "Potential is a scalar: V = k × Σ(qᵢ/rᵢ)",
      "All charges are equidistant from centroid (r)",
      "V = k/r × (q + 2q + (-3q))",
      "V = k/r × 0 = 0",
    ],
    takeaway: "Electric potential is scalar — just add charges algebraically. If sum = 0, potential = 0.",
  },
];