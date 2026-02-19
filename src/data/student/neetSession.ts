// NEET Session Config
// Maps the NEET test structure to a session state
// 160 questions: 40 per subject, all MCQ single correct, +4/-1

import type { TestSessionState, TestSessionQuestion } from "./testSession";
import { neetSections, allNEETQuestions, neetTest } from "./neetQuestions";

// Generate session questions preserving section order
const generateNEETSessionQuestions = (): TestSessionQuestion[] => {
  let questionNumber = 1;
  const sessionQuestions: TestSessionQuestion[] = [];

  neetSections.forEach((section) => {
    const sectionQuestions = allNEETQuestions.filter(
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

export const neetSession: TestSessionState = {
  testId: "neet-demo",
  testName: "NEET 2024 — Full Mock Test",
  pattern: "neet",
  totalQuestions: 160,
  totalMarks: 640,
  totalDuration: 200, // 3 hrs 20 min
  remainingTime: 200 * 60,
  sections: neetSections,
  questions: allNEETQuestions,
  sessionQuestions: generateNEETSessionQuestions(),
  currentQuestionIndex: 0,
  currentSectionId: "neet-phy",
  startedAt: new Date().toISOString(),
  isSubmitted: false,
  allowBackNavigation: true,
  allowMarkForReview: true,
  showCalculator: false,
};
