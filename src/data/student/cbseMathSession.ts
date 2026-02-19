// CBSE Math Session Config
// Maps the CBSE Math test structure to a session state

import type { TestSessionState, TestSessionQuestion } from "./testSession";
import { cbseMathSections, allCBSEMathQuestions, cbseMathTest } from "./cbseMathQuestions";

// Generate session questions preserving section order
const generateCBSEMathSessionQuestions = (): TestSessionQuestion[] => {
  let questionNumber = 1;
  const sessionQuestions: TestSessionQuestion[] = [];

  cbseMathSections.forEach((section) => {
    const sectionQuestions = allCBSEMathQuestions.filter(
      (q) => q.sectionId === section.id
    );
    sectionQuestions.forEach((q) => {
      sessionQuestions.push({
        id: q.id,
        questionNumber: questionNumber++,
        sectionId: section.id,
        subject: q.subject,
        status: "not_visited",
        timeSpent: 0,
      });
    });
  });

  return sessionQuestions;
};

export const cbseMathSession: TestSessionState = {
  testId: "cbse-math-demo",
  testName: "CBSE Class 12 Mathematics — 2024",
  pattern: "cbse",
  totalQuestions: 38,
  totalMarks: 80,
  totalDuration: 180,
  remainingTime: 180 * 60,
  sections: cbseMathSections,
  questions: allCBSEMathQuestions,
  sessionQuestions: generateCBSEMathSessionQuestions(),
  currentQuestionIndex: 0,
  currentSectionId: "sec-a",
  startedAt: new Date().toISOString(),
  isSubmitted: false,
  allowBackNavigation: true,
  allowMarkForReview: true,
  showCalculator: false,
};
