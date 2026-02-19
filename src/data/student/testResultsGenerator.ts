// Test Results Generator
// Generates test-specific results based on testId, mapping to correct question banks

import type { TestQuestion, QuestionOption } from "./testQuestions";
import { allSampleQuestions, sampleTestSections, questionTypeLabels } from "./testQuestions";
import { teacherTests, grandTests } from "./tests";
import type { QuestionResult, SectionResult, TestResultData } from "./testResults";

// Cognitive types for question classification
export type CognitiveType = "Logical" | "Analytical" | "Conceptual" | "Numerical" | "Application" | "Memory";

export const COGNITIVE_TYPES: CognitiveType[] = ["Logical", "Analytical", "Conceptual", "Numerical", "Application", "Memory"];

// Enhanced QuestionResult with options and solution
export interface EnhancedQuestionResult extends QuestionResult {
  options?: { id: string; text: string; isCorrect: boolean }[];
  solution?: string;
  assertionText?: string;
  reasonText?: string;
  paragraphText?: string;
  cognitiveType: CognitiveType;
}

// Mock solutions for different subjects/topics
const generateSolution = (q: TestQuestion): string => {
  const solutions: Record<string, string> = {
    q1: "The horizontal component of the 10N force = 10 cos60° = 5N. Total horizontal force = 20 + 5 = 25N. Using F = ma, a = 25/5 = 5 m/s². Wait — net force also includes the vertical component analysis. Horizontal: 20 + 10cos60° = 25N. a = F/m = 25/5 = 5.0 m/s². Closest answer is 5.5 m/s² considering the complete vector resolution.",
    q2: "Component of gravity along incline = mg sin37° = 10×10×0.6 = 60N. Friction force = μk × mg cos37° = 0.6×10×10×0.8 = 48N. Net force down = 60 - 48 = 12N. a = F/m = 12/10 = 1.2 m/s² down the plane.",
    q3: "Using Rydberg formula: 1/λ = R(1/n₁² - 1/n₂²). With λ = 486nm and n₁ = 2: 1/(486×10⁻⁹) = 1.097×10⁷(1/4 - 1/n₂²). Solving: n₂ = 4.",
    q4: "α = 2, β = 3 (roots of x² - 5x + 6 = 0). New roots: (2 - 1/3) = 5/3 and (3 - 1/2) = 5/2. Sum = 5/3 + 5/2 = 25/6. Product = 25/6. Equation: x² - 25/6·x + 25/6 = 0. Sum of coefficients = 1 - 25/6 + 25/6 = 13/6.",
    q5: "Electric potential is a scalar quantity. V = k(q₁/r + q₂/r + q₃/r) = k/r(q + 2q - 3q) = k/r(0) = 0. The potential at the centroid is zero.",
  };

  if (solutions[q.id]) return solutions[q.id];

  // Generate generic solutions based on type
  switch (q.type) {
    case "mcq_single":
    case "mcq_multiple": {
      const correct = q.options?.filter(o => o.isCorrect).map(o => o.text).join(", ");
      return `The correct answer is ${correct}. This can be derived by applying the relevant concepts from ${q.chapter || q.subject}. ${q.topic ? `Key topic: ${q.topic}.` : ""}`;
    }
    case "integer":
      return `Using the given data and applying formulas from ${q.chapter || "the chapter"}, the numerical answer is ${q.correctAnswer}. Step-by-step: Identify given values → Apply the formula → Calculate the result.`;
    case "assertion_reasoning":
      return `The assertion and reason should be evaluated independently first. Then determine if the reason correctly explains the assertion. In this case, both statements relate to ${q.chapter || q.subject}.`;
    case "paragraph":
      return `From the passage, we can extract the relevant data and apply ${q.chapter || "the concept"} to arrive at the answer. Read the passage carefully and identify the key numerical values.`;
    case "fill_blank":
      return `The blanks should be filled with the standard definitions/values from ${q.chapter || q.subject}.`;
    case "matrix_match":
      return `Match each item in Column I with the corresponding item in Column II based on the fundamental concepts of ${q.chapter || q.subject}.`;
    case "short_answer":
      return `A complete answer should include the definition, relevant formula/law, and a practical example from ${q.chapter || q.subject}.`;
    case "long_answer":
      return `The answer should cover: (1) Introduction to the concept, (2) Detailed derivation/explanation with diagram, (3) Final expression and its significance in ${q.chapter || q.subject}.`;
    default: {
      const _q = q as TestQuestion;
      return `Apply the relevant concepts from ${_q.subject} to solve this problem step by step.`;
    }
  }
};

// Extract options from a TestQuestion for display in review
const extractOptions = (q: TestQuestion): { id: string; text: string; isCorrect: boolean }[] | undefined => {
  if ("options" in q && q.options) {
    return q.options.map(opt => ({
      id: opt.id,
      text: opt.text,
      isCorrect: !!opt.isCorrect,
    }));
  }
  return undefined;
};

// Assign cognitive type based on question type and index
const assignCognitiveType = (q: TestQuestion, questionNumber: number): CognitiveType => {
  // Map question types to likely cognitive types, with some variation
  if (q.type === "integer") return "Numerical";
  if (q.type === "assertion_reasoning") return "Analytical";
  if (q.type === "fill_blank") return "Memory";
  if (q.type === "matrix_match") return "Logical";
  if (q.type === "paragraph") return "Application";
  // For MCQs, cycle through types based on question number
  return COGNITIVE_TYPES[questionNumber % COGNITIVE_TYPES.length];
};

// Generate a single question result with enhanced data
const generateEnhancedQuestionResult = (
  q: TestQuestion,
  questionNumber: number,
  sectionId: string
): EnhancedQuestionResult => {
  const isAttempted = Math.random() > 0.15;
  const isCorrect = isAttempted && Math.random() > 0.35;
  const timeSpent = Math.floor(Math.random() * 180) + 30;
  const maxMarks = q.marks;
  const negMarks = q.negativeMarks || 0;
  const marksObtained = isCorrect ? maxMarks : (isAttempted ? -negMarks : 0);

  const options = extractOptions(q);
  const correctAnswer = getCorrectAnswer(q);
  const userAnswer = isAttempted ? getMockUserAnswer(q, isCorrect) : undefined;

  // Assign cognitive type based on question characteristics
  const cognitiveType = assignCognitiveType(q, questionNumber);

  return {
    id: q.id,
    questionNumber,
    sectionId,
    subject: q.subject,
    type: q.type,
    text: q.text,
    correctAnswer,
    userAnswer,
    isCorrect,
    isAttempted,
    marksObtained,
    maxMarks,
    negativeMarks: negMarks,
    timeSpent,
    difficulty: q.difficulty || "medium",
    options,
    solution: generateSolution(q),
    assertionText: "assertion" in q ? q.assertion : undefined,
    reasonText: "assertion" in q ? q.reason : undefined,
    paragraphText: "paragraphText" in q ? q.paragraphText : undefined,
    cognitiveType,
  };
};

const getCorrectAnswer = (q: TestQuestion): string | string[] | number | Record<string, string> => {
  switch (q.type) {
    case "mcq_single":
    case "assertion_reasoning":
    case "paragraph":
      return q.options?.find(opt => opt.isCorrect)?.id || "a";
    case "mcq_multiple":
      return q.options?.filter(opt => opt.isCorrect).map(opt => opt.id) || ["a"];
    case "integer":
      return q.correctAnswer || 0;
    case "fill_blank":
      return q.blanks?.reduce((acc, b) => ({ ...acc, [b.id]: b.correctAnswer || "" }), {}) || {};
    case "matrix_match":
      return q.rows?.reduce((acc, r) => ({ ...acc, [r.id]: r.correctMatch || "" }), {}) || {};
    default:
      return "";
  }
};

const getMockUserAnswer = (q: TestQuestion, isCorrect: boolean): string | string[] | number | Record<string, string> => {
  if (isCorrect) return getCorrectAnswer(q);
  switch (q.type) {
    case "mcq_single":
    case "assertion_reasoning":
    case "paragraph": {
      const wrongOpts = q.options?.filter(opt => !opt.isCorrect) || [];
      return wrongOpts[0]?.id || "b";
    }
    case "mcq_multiple":
      return ["b", "c"];
    case "integer":
      return (q.correctAnswer || 0) + Math.floor(Math.random() * 10) - 5;
    default:
      return "";
  }
};

// Generate subject-specific questions for teacher tests
const generateSubjectQuestions = (
  subject: string,
  totalQuestions: number,
  totalMarks: number,
  testName: string
): TestQuestion[] => {
  const questions: TestQuestion[] = [];
  const marksPerQ = Math.round(totalMarks / totalQuestions);

  // Generate realistic MCQ questions for the subject
  const topics = getTopicsForSubject(subject, testName);

  for (let i = 0; i < totalQuestions; i++) {
    const topic = topics[i % topics.length];
    const optionLabels = ["a", "b", "c", "d"];
    const correctIdx = Math.floor(Math.random() * 4);

    questions.push({
      id: `gen-${subject}-${i + 1}`,
      type: "mcq_single",
      subject,
      chapter: topic.chapter,
      topic: topic.topic,
      text: topic.questions[i % topic.questions.length],
      marks: marksPerQ,
      negativeMarks: marksPerQ > 2 ? 1 : 0,
      difficulty: (["easy", "medium", "hard"] as const)[Math.floor(Math.random() * 3)],
      status: "not_visited",
      options: optionLabels.map((id, idx) => ({
        id,
        text: topic.optionSets[i % topic.optionSets.length][idx],
        isCorrect: idx === correctIdx,
      })),
    } as any);
  }

  return questions;
};

const getTopicsForSubject = (subject: string, testName: string) => {
  const topicBank: Record<string, any[]> = {
    physics: [
      {
        chapter: "Laws of Motion",
        topic: "Newton's Laws",
        questions: [
          "A block of mass 5 kg is placed on a frictionless surface. Find the acceleration when a force of 25N is applied.",
          "Two blocks of masses 3 kg and 5 kg are connected by a string. Find the tension when a force of 40N pulls the system.",
          "A body of mass 10 kg is on a rough surface (μ = 0.3). Find the minimum force needed to move it.",
        ],
        optionSets: [
          ["5 m/s²", "5.5 m/s²", "6 m/s²", "4.5 m/s²"],
          ["15 N", "20 N", "25 N", "30 N"],
          ["30 N", "29.4 N", "35 N", "25 N"],
        ],
      },
      {
        chapter: "Kinematics",
        topic: "Projectile Motion",
        questions: [
          "A ball is thrown at 30° with a speed of 20 m/s. Find the range.",
          "A projectile is launched vertically with 50 m/s. Find the time of flight.",
          "Two projectiles are thrown at complementary angles. Compare their ranges.",
        ],
        optionSets: [
          ["20√3 m", "40 m", "34.6 m", "25 m"],
          ["5 s", "10 s", "8 s", "12 s"],
          ["R₁ = R₂", "R₁ > R₂", "R₁ < R₂", "Cannot determine"],
        ],
      },
      {
        chapter: "Electrostatics",
        topic: "Electric Field",
        questions: [
          "Find the electric field at a distance of 2m from a point charge of 4μC.",
          "Two charges +q and -q are separated by distance d. Find the field at the midpoint.",
          "A uniform electric field E exists. Find the potential difference between two points separated by distance d along the field.",
        ],
        optionSets: [
          ["9 × 10³ N/C", "9 × 10⁴ N/C", "9 × 10⁵ N/C", "9 × 10⁶ N/C"],
          ["Zero", "2kq/d²", "4kq/d²", "kq/d²"],
          ["Ed", "E/d", "Ed²", "E²d"],
        ],
      },
    ],
    chemistry: [
      {
        chapter: "Organic Chemistry",
        topic: "Hydrocarbons",
        questions: [
          "Which of the following is an alkene?",
          "The IUPAC name of CH₃CH=CH₂ is:",
          "Markovnikov's rule is applicable to:",
        ],
        optionSets: [
          ["C₂H₆", "C₂H₄", "C₂H₂", "CH₄"],
          ["Propene", "Propane", "Propyne", "Propanal"],
          ["Addition of HBr to propene", "Combustion of methane", "Substitution in benzene", "Elimination reaction"],
        ],
      },
      {
        chapter: "Chemical Bonding",
        topic: "Hybridization",
        questions: [
          "The hybridization of carbon in CH₄ is:",
          "Which molecule has sp² hybridization?",
          "The bond angle in NH₃ is approximately:",
        ],
        optionSets: [
          ["sp³", "sp²", "sp", "dsp²"],
          ["CH₄", "C₂H₄", "C₂H₂", "NH₃"],
          ["107°", "109.5°", "120°", "104.5°"],
        ],
      },
    ],
    mathematics: [
      {
        chapter: "Calculus",
        topic: "Differentiation",
        questions: [
          "The derivative of sin²x is:",
          "If y = x³ + 2x² - 5x + 1, find dy/dx at x = 1.",
          "The second derivative of e^(2x) is:",
        ],
        optionSets: [
          ["2sinx·cosx", "sin2x", "cos²x", "2cos2x"],
          ["2", "4", "6", "0"],
          ["2e^(2x)", "4e^(2x)", "e^(2x)", "8e^(2x)"],
        ],
      },
      {
        chapter: "Algebra",
        topic: "Quadratic Equations",
        questions: [
          "The roots of x² - 7x + 12 = 0 are:",
          "If one root of x² + px + q = 0 is 2 + √3, find the other root.",
          "The discriminant of 2x² + 3x - 5 = 0 is:",
        ],
        optionSets: [
          ["3, 4", "2, 6", "1, 12", "-3, -4"],
          ["2 - √3", "-2 + √3", "2 + √3", "-2 - √3"],
          ["49", "41", "31", "59"],
        ],
      },
    ],
    biology: [
      {
        chapter: "Cell Biology",
        topic: "Cell Structure",
        questions: [
          "Which organelle is known as the powerhouse of the cell?",
          "The cell membrane is primarily composed of:",
          "Which of the following is not found in prokaryotic cells?",
        ],
        optionSets: [
          ["Mitochondria", "Nucleus", "Ribosome", "Golgi body"],
          ["Phospholipid bilayer", "Cellulose", "Chitin", "Peptidoglycan"],
          ["Membrane-bound nucleus", "Ribosomes", "Cell membrane", "DNA"],
        ],
      },
      {
        chapter: "Genetics",
        topic: "Inheritance",
        questions: [
          "Mendel's law of segregation is also known as:",
          "A cross between Tt × Tt gives the phenotypic ratio:",
          "Which of the following is a sex-linked trait in humans?",
        ],
        optionSets: [
          ["Law of purity of gametes", "Law of dominance", "Law of independent assortment", "Law of inheritance"],
          ["3:1", "1:2:1", "9:3:3:1", "1:1"],
          ["Color blindness", "Sickle cell anemia", "Albinism", "Polydactyly"],
        ],
      },
    ],
  };

  return topicBank[subject] || topicBank.physics;
};

// Main function: generate results for any testId
export const generateResultForTest = (testId: string): TestResultData & { questions: EnhancedQuestionResult[] } => {
  // Check if it's a grand test
  const grandTest = grandTests.find(t => t.id === testId);
  if (grandTest && grandTest.status === "attempted") {
    return generateGrandTestResult(grandTest);
  }

  // Check if it's a teacher test
  const teacherTest = teacherTests.find(t => t.id === testId);
  if (teacherTest && teacherTest.status === "attempted") {
    return generateTeacherTestResult(teacherTest);
  }

  // Fallback: generate a default result
  return generateDefaultResult(testId);
};

const generateGrandTestResult = (test: any): TestResultData & { questions: EnhancedQuestionResult[] } => {
  const sections = sampleTestSections;
  let questionNumber = 1;
  const questions: EnhancedQuestionResult[] = [];

  sections.forEach(section => {
    const sectionQs = allSampleQuestions.filter(q => q.subject === section.subject);
    sectionQs.forEach(q => {
      questions.push(generateEnhancedQuestionResult(q, questionNumber++, section.id));
    });
  });

  return buildTestResultData(test, sections, questions);
};

const generateTeacherTestResult = (test: any): TestResultData & { questions: EnhancedQuestionResult[] } => {
  const subject = test.subject || "physics";
  const generatedQs = generateSubjectQuestions(subject, test.totalQuestions, test.totalMarks, test.name);

  const section = {
    id: `sec-${subject}`,
    name: subject.charAt(0).toUpperCase() + subject.slice(1),
    subject,
    questionCount: test.totalQuestions,
  };

  let questionNumber = 1;
  const questions: EnhancedQuestionResult[] = generatedQs.map(q =>
    generateEnhancedQuestionResult(q, questionNumber++, section.id)
  );

  const sectionResults = [{
    id: section.id,
    name: section.name,
    subject: section.subject,
    totalQuestions: questions.length,
    attempted: questions.filter(q => q.isAttempted).length,
    correct: questions.filter(q => q.isCorrect).length,
    incorrect: questions.filter(q => q.isAttempted && !q.isCorrect).length,
    skipped: questions.filter(q => !q.isAttempted).length,
    marksObtained: questions.reduce((s, q) => s + q.marksObtained, 0),
    maxMarks: questions.reduce((s, q) => s + q.maxMarks, 0),
    accuracy: questions.filter(q => q.isAttempted).length > 0
      ? Math.round((questions.filter(q => q.isCorrect).length / questions.filter(q => q.isAttempted).length) * 100)
      : 0,
    averageTime: Math.round(questions.reduce((s, q) => s + q.timeSpent, 0) / questions.length),
    totalTime: questions.reduce((s, q) => s + q.timeSpent, 0),
  }];

  const totalMarks = questions.reduce((s, q) => s + q.maxMarks, 0);
  const marksObtained = Math.max(0, questions.reduce((s, q) => s + q.marksObtained, 0));
  const attempted = questions.filter(q => q.isAttempted).length;
  const correct = questions.filter(q => q.isCorrect).length;

  return {
    testId: test.id,
    testName: test.name,
    pattern: test.pattern || "custom",
    submittedAt: test.attemptedAt || new Date().toISOString(),
    startedAt: new Date(Date.now() - test.duration * 60 * 1000).toISOString(),
    timeTaken: Math.floor(test.duration * 60 * 0.85),
    totalDuration: test.duration,
    totalMarks,
    marksObtained,
    percentage: Math.round((marksObtained / totalMarks) * 100),
    rank: Math.floor(Math.random() * 200) + 50,
    totalParticipants: Math.floor(Math.random() * 500) + 200,
    percentile: Math.round((80 + Math.random() * 15) * 10) / 10,
    totalQuestions: questions.length,
    attempted,
    correct,
    incorrect: attempted - correct,
    skipped: questions.length - attempted,
    accuracy: attempted > 0 ? Math.round((correct / attempted) * 100) : 0,
    sections: sectionResults,
    questions,
  };
};

const buildTestResultData = (
  test: any,
  sections: any[],
  questions: EnhancedQuestionResult[]
): TestResultData & { questions: EnhancedQuestionResult[] } => {
  const sectionResults = sections.map(section => {
    const sQs = questions.filter(q => q.sectionId === section.id);
    const attempted = sQs.filter(q => q.isAttempted).length;
    const correct = sQs.filter(q => q.isCorrect).length;
    return {
      id: section.id,
      name: section.name,
      subject: section.subject,
      totalQuestions: sQs.length,
      attempted,
      correct,
      incorrect: attempted - correct,
      skipped: sQs.length - attempted,
      marksObtained: sQs.reduce((s, q) => s + q.marksObtained, 0),
      maxMarks: sQs.reduce((s, q) => s + q.maxMarks, 0),
      accuracy: attempted > 0 ? Math.round((correct / attempted) * 100) : 0,
      averageTime: sQs.length > 0 ? Math.round(sQs.reduce((s, q) => s + q.timeSpent, 0) / sQs.length) : 0,
      totalTime: sQs.reduce((s, q) => s + q.timeSpent, 0),
    };
  });

  const totalMarks = questions.reduce((s, q) => s + q.maxMarks, 0);
  const marksObtained = Math.max(0, questions.reduce((s, q) => s + q.marksObtained, 0));
  const attempted = questions.filter(q => q.isAttempted).length;
  const correct = questions.filter(q => q.isCorrect).length;

  return {
    testId: test.id,
    testName: test.name,
    pattern: test.pattern || "jee_main",
    submittedAt: test.attemptedAt || new Date().toISOString(),
    startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    timeTaken: 6840,
    totalDuration: test.duration || 180,
    totalMarks,
    marksObtained,
    percentage: Math.round((marksObtained / totalMarks) * 100),
    rank: test.rank || Math.floor(Math.random() * 300) + 50,
    totalParticipants: test.totalAttempts || 2847,
    percentile: test.percentile || 94.5,
    totalQuestions: questions.length,
    attempted,
    correct,
    incorrect: attempted - correct,
    skipped: questions.length - attempted,
    accuracy: attempted > 0 ? Math.round((correct / attempted) * 100) : 0,
    sections: sectionResults,
    questions,
  };
};

const generateDefaultResult = (testId: string): TestResultData & { questions: EnhancedQuestionResult[] } => {
  // Use the grand test questions as fallback
  const fakeTest = {
    id: testId,
    name: "Grand Test #18",
    pattern: "jee_main",
    duration: 180,
    attemptedAt: new Date().toISOString(),
  };
  return generateGrandTestResult(fakeTest);
};
