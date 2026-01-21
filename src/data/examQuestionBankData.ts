import { QuestionType } from "./examPatternsData";

// Enhanced question interface with rich content support
export interface BankQuestion {
  id: string;
  text: string;
  type: QuestionType;
  subject: string;
  difficulty: "easy" | "medium" | "hard";
  cognitiveType: string;
  chapter: string;
  marks: number;
  // Rich content flags
  hasMath?: boolean;
  hasImage?: boolean;
  imageUrl?: string;
  // For paragraph-based questions
  isPartOfPassage?: boolean;
  passageId?: string;
  passageText?: string;
  // For matrix match
  matrixLeft?: string[];
  matrixRight?: string[];
  // Options (for MCQ types)
  options?: {
    id: string;
    text: string;
    hasMath?: boolean;
    hasImage?: boolean;
  }[];
  correctAnswer?: string | string[] | number;
}

// Passage data for paragraph-based questions
export interface Passage {
  id: string;
  subject: string;
  chapter: string;
  text: string;
  hasMath?: boolean;
  hasImage?: boolean;
}

// ============================================
// PASSAGES FOR COMPREHENSION QUESTIONS
// ============================================

export const passages: Passage[] = [
  {
    id: "passage_physics_1",
    subject: "physics",
    chapter: "Electromagnetic Induction",
    text: `A conducting rod of length $L = 0.5$ m is moving with a constant velocity $v = 4$ m/s perpendicular to a uniform magnetic field $B = 0.2$ T directed into the page. The rod is part of a closed circuit with total resistance $R = 2\\Omega$. 

[Image: A diagram showing a conducting rod moving through a magnetic field with the circuit configuration]

The induced EMF causes a current to flow through the circuit, which in turn experiences a force due to the magnetic field.`,
    hasMath: true,
    hasImage: true,
  },
  {
    id: "passage_chemistry_1",
    subject: "chemistry",
    chapter: "Electrochemistry",
    text: `Consider an electrochemical cell consisting of a zinc electrode in 1M $ZnSO_4$ solution and a copper electrode in 1M $CuSO_4$ solution, connected by a salt bridge. The standard electrode potentials are:
    
$Zn^{2+}/Zn: E° = -0.76$ V
$Cu^{2+}/Cu: E° = +0.34$ V

The cell operates at 298 K under standard conditions.`,
    hasMath: true,
  },
  {
    id: "passage_biology_1",
    subject: "biology",
    chapter: "Genetics",
    text: `In a genetics experiment, researchers crossed tall pea plants (TT) with dwarf pea plants (tt). The F1 generation showed all tall plants. When F1 plants were self-crossed, the F2 generation showed a phenotypic ratio of 3:1 (tall:dwarf).

[Image: Punnett square diagram showing the cross between Tt × Tt]

Further analysis revealed that some tall plants were homozygous (TT) while others were heterozygous (Tt). The researchers wanted to determine the genotype of a tall plant from F2 generation.`,
    hasImage: true,
  },
];

// ============================================
// RICH MOCK QUESTIONS
// ============================================

export const mockBankQuestions: BankQuestion[] = [
  // ============ PHYSICS QUESTIONS ============
  
  // Simple MCQ
  {
    id: "q1",
    text: "What is Newton's first law of motion?",
    type: "single_correct",
    subject: "physics",
    difficulty: "easy",
    cognitiveType: "conceptual",
    chapter: "Laws of Motion",
    marks: 4,
    options: [
      { id: "a", text: "Every object continues in its state of rest or uniform motion unless acted upon by an external force" },
      { id: "b", text: "Force equals mass times acceleration" },
      { id: "c", text: "For every action, there is an equal and opposite reaction" },
      { id: "d", text: "Energy can neither be created nor destroyed" },
    ],
    correctAnswer: "a",
  },
  
  // Math/LaTeX question with formula
  {
    id: "q2",
    text: "Calculate the acceleration of a 5 kg mass when a net force of 10 N is applied. Use $F = ma$ to solve.",
    type: "numerical",
    subject: "physics",
    difficulty: "medium",
    cognitiveType: "numerical",
    chapter: "Laws of Motion",
    marks: 4,
    hasMath: true,
    correctAnswer: 2,
  },
  
  // Complex LaTeX with calculus
  {
    id: "q3",
    text: "The velocity of a particle is given by $v(t) = 3t^2 - 2t + 5$ m/s. Find the acceleration at $t = 2$ seconds using $a = \\frac{dv}{dt}$.",
    type: "numerical",
    subject: "physics",
    difficulty: "hard",
    cognitiveType: "numerical",
    chapter: "Kinematics",
    marks: 4,
    hasMath: true,
    correctAnswer: 10,
  },
  
  // Image-based question
  {
    id: "q4",
    text: "In the circuit shown below, find the equivalent resistance between points A and B.",
    type: "numerical",
    subject: "physics",
    difficulty: "hard",
    cognitiveType: "application",
    chapter: "Current Electricity",
    marks: 4,
    hasImage: true,
    imageUrl: "/placeholder-circuit.png",
    correctAnswer: 5,
  },
  
  // Paragraph-based question 1 (linked to passage)
  {
    id: "q5",
    text: "Based on the passage above, calculate the induced EMF in the rod using $\\varepsilon = BLv$.",
    type: "numerical",
    subject: "physics",
    difficulty: "medium",
    cognitiveType: "application",
    chapter: "Electromagnetic Induction",
    marks: 4,
    hasMath: true,
    isPartOfPassage: true,
    passageId: "passage_physics_1",
    correctAnswer: 0.4,
  },
  
  // Paragraph-based question 2 (linked to same passage)
  {
    id: "q6",
    text: "What is the magnitude of the current flowing through the circuit?",
    type: "numerical",
    subject: "physics",
    difficulty: "medium",
    cognitiveType: "numerical",
    chapter: "Electromagnetic Induction",
    marks: 4,
    isPartOfPassage: true,
    passageId: "passage_physics_1",
    correctAnswer: 0.2,
  },
  
  // Paragraph-based question 3 (linked to same passage)
  {
    id: "q7",
    text: "Calculate the force required to maintain the constant velocity of the rod.",
    type: "numerical",
    subject: "physics",
    difficulty: "hard",
    cognitiveType: "application",
    chapter: "Electromagnetic Induction",
    marks: 4,
    hasMath: true,
    isPartOfPassage: true,
    passageId: "passage_physics_1",
    correctAnswer: 0.02,
  },
  
  // Assertion-Reasoning
  {
    id: "q8",
    text: "**Assertion (A):** The work done by centripetal force on a body moving in a circular path is zero.\n\n**Reason (R):** Centripetal force is always perpendicular to the velocity of the body.",
    type: "assertion_reasoning",
    subject: "physics",
    difficulty: "medium",
    cognitiveType: "logical",
    chapter: "Circular Motion",
    marks: 4,
    options: [
      { id: "a", text: "Both A and R are true, and R is the correct explanation of A" },
      { id: "b", text: "Both A and R are true, but R is not the correct explanation of A" },
      { id: "c", text: "A is true but R is false" },
      { id: "d", text: "A is false but R is true" },
    ],
    correctAnswer: "a",
  },
  
  // Integer type
  {
    id: "q9",
    text: "A projectile is launched at an angle of 45° with initial velocity $v_0 = 20\\sqrt{2}$ m/s. Find the maximum height reached (in meters). Take $g = 10$ m/s².",
    type: "integer",
    subject: "physics",
    difficulty: "hard",
    cognitiveType: "numerical",
    chapter: "Projectile Motion",
    marks: 4,
    hasMath: true,
    correctAnswer: 20,
  },
  
  // Multiple correct
  {
    id: "q10",
    text: "Which of the following statements are correct about electromagnetic waves?",
    type: "multiple_correct",
    subject: "physics",
    difficulty: "medium",
    cognitiveType: "conceptual",
    chapter: "Electromagnetic Waves",
    marks: 4,
    options: [
      { id: "a", text: "They can travel through vacuum" },
      { id: "b", text: "Electric and magnetic fields are perpendicular to each other" },
      { id: "c", text: "They require a medium to propagate" },
      { id: "d", text: "They travel at the speed of light in vacuum" },
    ],
    correctAnswer: ["a", "b", "d"],
  },
  
  // ============ CHEMISTRY QUESTIONS ============
  
  // Simple MCQ
  {
    id: "q11",
    text: "What is the atomic number of Carbon?",
    type: "single_correct",
    subject: "chemistry",
    difficulty: "easy",
    cognitiveType: "memory",
    chapter: "Periodic Table",
    marks: 4,
    options: [
      { id: "a", text: "4" },
      { id: "b", text: "6" },
      { id: "c", text: "8" },
      { id: "d", text: "12" },
    ],
    correctAnswer: "b",
  },
  
  // Chemical equation with LaTeX
  {
    id: "q12",
    text: "Balance the following chemical equation:\n\n$Fe + O_2 \\rightarrow Fe_2O_3$\n\nWhat is the coefficient of $Fe$ in the balanced equation?",
    type: "integer",
    subject: "chemistry",
    difficulty: "medium",
    cognitiveType: "application",
    chapter: "Chemical Equations",
    marks: 4,
    hasMath: true,
    correctAnswer: 4,
  },
  
  // Electrochemistry with LaTeX (paragraph-based)
  {
    id: "q13",
    text: "Calculate the standard EMF ($E°_{cell}$) of the galvanic cell described in the passage.",
    type: "numerical",
    subject: "chemistry",
    difficulty: "medium",
    cognitiveType: "numerical",
    chapter: "Electrochemistry",
    marks: 4,
    hasMath: true,
    isPartOfPassage: true,
    passageId: "passage_chemistry_1",
    correctAnswer: 1.1,
  },
  
  // Organic chemistry with structure
  {
    id: "q14",
    text: "Identify the product when ethanol undergoes oxidation with acidified potassium dichromate.\n\n[Image: Structural formula of ethanol: $CH_3-CH_2-OH$]",
    type: "single_correct",
    subject: "chemistry",
    difficulty: "medium",
    cognitiveType: "application",
    chapter: "Organic Chemistry",
    marks: 4,
    hasMath: true,
    hasImage: true,
    options: [
      { id: "a", text: "Methanol" },
      { id: "b", text: "Ethanoic acid (Acetic acid)" },
      { id: "c", text: "Methanoic acid (Formic acid)" },
      { id: "d", text: "Propanol" },
    ],
    correctAnswer: "b",
  },
  
  // Matrix Match
  {
    id: "q15",
    text: "Match the following elements with their properties:",
    type: "match_the_following",
    subject: "chemistry",
    difficulty: "hard",
    cognitiveType: "memory",
    chapter: "Periodic Table",
    marks: 4,
    matrixLeft: [
      "A. Sodium",
      "B. Chlorine",
      "C. Neon",
      "D. Iron",
    ],
    matrixRight: [
      "P. Transition metal",
      "Q. Alkali metal",
      "R. Noble gas",
      "S. Halogen",
    ],
    correctAnswer: ["A-Q", "B-S", "C-R", "D-P"],
  },
  
  // ============ MATHEMATICS QUESTIONS ============
  
  // Quadratic equation
  {
    id: "q16",
    text: "Solve the quadratic equation: $x^2 - 5x + 6 = 0$. Find the sum of roots.",
    type: "numerical",
    subject: "mathematics",
    difficulty: "easy",
    cognitiveType: "numerical",
    chapter: "Quadratic Equations",
    marks: 4,
    hasMath: true,
    correctAnswer: 5,
  },
  
  // Calculus - Differentiation
  {
    id: "q17",
    text: "Find the derivative of $f(x) = \\sin(x) \\cdot \\cos(x)$ at $x = \\frac{\\pi}{4}$.",
    type: "numerical",
    subject: "mathematics",
    difficulty: "medium",
    cognitiveType: "application",
    chapter: "Differentiation",
    marks: 4,
    hasMath: true,
    correctAnswer: 0,
  },
  
  // Integration
  {
    id: "q18",
    text: "Evaluate the integral: $\\int_{0}^{\\pi} \\sin(x) \\, dx$",
    type: "integer",
    subject: "mathematics",
    difficulty: "medium",
    cognitiveType: "numerical",
    chapter: "Integration",
    marks: 4,
    hasMath: true,
    correctAnswer: 2,
  },
  
  // Matrices
  {
    id: "q19",
    text: "If $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$, find the determinant of $A$.",
    type: "integer",
    subject: "mathematics",
    difficulty: "easy",
    cognitiveType: "numerical",
    chapter: "Matrices",
    marks: 4,
    hasMath: true,
    correctAnswer: -2,
  },
  
  // Probability
  {
    id: "q20",
    text: "A bag contains 5 red balls and 3 blue balls. Two balls are drawn at random without replacement. What is the probability that both balls are red? Express as a fraction in simplest form.",
    type: "single_correct",
    subject: "mathematics",
    difficulty: "hard",
    cognitiveType: "logical",
    chapter: "Probability",
    marks: 4,
    options: [
      { id: "a", text: "$\\frac{5}{14}$", hasMath: true },
      { id: "b", text: "$\\frac{5}{28}$", hasMath: true },
      { id: "c", text: "$\\frac{25}{64}$", hasMath: true },
      { id: "d", text: "$\\frac{10}{28}$", hasMath: true },
    ],
    correctAnswer: "a",
  },
  
  // Trigonometry with image
  {
    id: "q21",
    text: "In the triangle ABC shown below, if $\\angle A = 60°$, $AB = 5$ cm, and $AC = 8$ cm, find the length of BC using the cosine rule.\n\n[Image: Triangle ABC with given measurements]",
    type: "numerical",
    subject: "mathematics",
    difficulty: "hard",
    cognitiveType: "application",
    chapter: "Trigonometry",
    marks: 4,
    hasMath: true,
    hasImage: true,
    correctAnswer: 7,
  },
  
  // ============ BIOLOGY QUESTIONS ============
  
  // Simple memory
  {
    id: "q22",
    text: "What is the powerhouse of the cell?",
    type: "single_correct",
    subject: "biology",
    difficulty: "easy",
    cognitiveType: "memory",
    chapter: "Cell Biology",
    marks: 4,
    options: [
      { id: "a", text: "Nucleus" },
      { id: "b", text: "Ribosome" },
      { id: "c", text: "Mitochondria" },
      { id: "d", text: "Golgi apparatus" },
    ],
    correctAnswer: "c",
  },
  
  // Genetics (paragraph-based)
  {
    id: "q23",
    text: "Based on the passage, what is the genotypic ratio of F2 generation?",
    type: "single_correct",
    subject: "biology",
    difficulty: "medium",
    cognitiveType: "application",
    chapter: "Genetics",
    marks: 4,
    isPartOfPassage: true,
    passageId: "passage_biology_1",
    options: [
      { id: "a", text: "1:2:1 (TT:Tt:tt)" },
      { id: "b", text: "3:1 (Tall:Dwarf)" },
      { id: "c", text: "1:1 (TT:Tt)" },
      { id: "d", text: "2:1:1 (Tt:TT:tt)" },
    ],
    correctAnswer: "a",
  },
  
  // Test cross question (paragraph-based)
  {
    id: "q24",
    text: "To determine if a tall plant from F2 is homozygous or heterozygous, which cross should be performed?",
    type: "single_correct",
    subject: "biology",
    difficulty: "medium",
    cognitiveType: "logical",
    chapter: "Genetics",
    marks: 4,
    isPartOfPassage: true,
    passageId: "passage_biology_1",
    options: [
      { id: "a", text: "Cross with another tall plant" },
      { id: "b", text: "Test cross with a dwarf plant (tt)" },
      { id: "c", text: "Self-pollination" },
      { id: "d", text: "Both B and C" },
    ],
    correctAnswer: "d",
  },
  
  // Enzyme kinetics with graph
  {
    id: "q25",
    text: "The graph below shows the effect of substrate concentration on enzyme activity. What does the plateau region indicate?\n\n[Image: Michaelis-Menten curve showing enzyme saturation]",
    type: "single_correct",
    subject: "biology",
    difficulty: "hard",
    cognitiveType: "analytical",
    chapter: "Enzymes",
    marks: 4,
    hasImage: true,
    options: [
      { id: "a", text: "Enzyme denaturation" },
      { id: "b", text: "Enzyme saturation - all active sites are occupied" },
      { id: "c", text: "Competitive inhibition" },
      { id: "d", text: "Substrate inhibition" },
    ],
    correctAnswer: "b",
  },
  
  // Matrix match - Biology
  {
    id: "q26",
    text: "Match the following diseases with their causative agents:",
    type: "match_the_following",
    subject: "biology",
    difficulty: "medium",
    cognitiveType: "memory",
    chapter: "Human Health and Disease",
    marks: 4,
    matrixLeft: [
      "A. Malaria",
      "B. Typhoid",
      "C. Common Cold",
      "D. AIDS",
    ],
    matrixRight: [
      "P. Salmonella typhi",
      "Q. Plasmodium",
      "R. HIV",
      "S. Rhinovirus",
    ],
    correctAnswer: ["A-Q", "B-P", "C-S", "D-R"],
  },
  
  // Multiple correct - Biology
  {
    id: "q27",
    text: "Which of the following are characteristics of enzymes?",
    type: "multiple_correct",
    subject: "biology",
    difficulty: "medium",
    cognitiveType: "conceptual",
    chapter: "Enzymes",
    marks: 4,
    options: [
      { id: "a", text: "They are biological catalysts" },
      { id: "b", text: "They are consumed in the reaction" },
      { id: "c", text: "They are highly specific" },
      { id: "d", text: "They can be denatured by high temperature" },
    ],
    correctAnswer: ["a", "c", "d"],
  },
  
  // Assertion-Reasoning - Biology
  {
    id: "q28",
    text: "**Assertion (A):** DNA replication is semi-conservative.\n\n**Reason (R):** Each daughter DNA molecule contains one parental strand and one newly synthesized strand.",
    type: "assertion_reasoning",
    subject: "biology",
    difficulty: "medium",
    cognitiveType: "logical",
    chapter: "Molecular Basis of Inheritance",
    marks: 4,
    options: [
      { id: "a", text: "Both A and R are true, and R is the correct explanation of A" },
      { id: "b", text: "Both A and R are true, but R is not the correct explanation of A" },
      { id: "c", text: "A is true but R is false" },
      { id: "d", text: "A is false but R is true" },
    ],
    correctAnswer: "a",
  },
  
  // Long descriptive
  {
    id: "q29",
    text: "Describe the process of photosynthesis including the light-dependent and light-independent reactions. Include the role of chlorophyll, the electron transport chain, and the Calvin cycle.",
    type: "long_answer",
    subject: "biology",
    difficulty: "hard",
    cognitiveType: "conceptual",
    chapter: "Plant Physiology",
    marks: 5,
  },
  
  // Short answer
  {
    id: "q30",
    text: "Explain the principle of conservation of momentum with a suitable example.",
    type: "short_answer",
    subject: "physics",
    difficulty: "medium",
    cognitiveType: "conceptual",
    chapter: "Laws of Motion",
    marks: 3,
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getPassageById(passageId: string): Passage | undefined {
  return passages.find(p => p.id === passageId);
}

export function getQuestionsByPassage(passageId: string): BankQuestion[] {
  return mockBankQuestions.filter(q => q.passageId === passageId);
}

export function getQuestionsBySubject(subject: string): BankQuestion[] {
  return mockBankQuestions.filter(q => q.subject === subject);
}

export function getQuestionsByType(type: QuestionType): BankQuestion[] {
  return mockBankQuestions.filter(q => q.type === type);
}

// Group passage questions together for display
export function groupQuestionsByPassage(questions: BankQuestion[]): {
  standalone: BankQuestion[];
  passageGroups: { passage: Passage; questions: BankQuestion[] }[];
} {
  const standalone: BankQuestion[] = [];
  const passageMap = new Map<string, BankQuestion[]>();
  
  questions.forEach(q => {
    if (q.isPartOfPassage && q.passageId) {
      const existing = passageMap.get(q.passageId) || [];
      passageMap.set(q.passageId, [...existing, q]);
    } else {
      standalone.push(q);
    }
  });
  
  const passageGroups = Array.from(passageMap.entries()).map(([passageId, questions]) => ({
    passage: getPassageById(passageId)!,
    questions,
  })).filter(g => g.passage);
  
  return { standalone, passageGroups };
}
