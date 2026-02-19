// JEE Advanced Session Config
// Maps the JEE Advanced test structure to a session state

import type { TestSessionState, TestSessionQuestion } from "./testSession";
import { jeeAdvancedSections, allJEEAdvancedQuestions, jeeAdvancedTest } from "./jeeAdvancedQuestions";

// Generate session questions preserving section order
const generateJEEAdvancedSessionQuestions = (): TestSessionQuestion[] => {
  let questionNumber = 1;
  const sessionQuestions: TestSessionQuestion[] = [];

  // Process questions in section order
  jeeAdvancedSections.forEach((section) => {
    const sectionQuestions = allJEEAdvancedQuestions.filter(
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

export const jeeAdvancedSession: TestSessionState = {
  testId: "jee-advanced-demo",
  testName: "JEE Advanced 2024 — Paper 1",
  pattern: "jee_advanced",
  totalQuestions: 81,
  totalMarks: 285,
  totalDuration: 180,
  remainingTime: 180 * 60,
  sections: jeeAdvancedSections,
  questions: allJEEAdvancedQuestions,
  sessionQuestions: generateJEEAdvancedSessionQuestions(),
  currentQuestionIndex: 0,
  currentSectionId: "phy-sec1",
  startedAt: new Date().toISOString(),
  isSubmitted: false,
  allowBackNavigation: true,
  allowMarkForReview: true,
  showCalculator: false,
};
