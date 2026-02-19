// CBSE Hindi Session Config

import type { TestSessionState, TestSessionQuestion } from "./testSession";
import { cbseHindiSections, allCBSEHindiQuestions, cbseHindiTest } from "./cbseHindiQuestions";

const generateCBSEHindiSessionQuestions = (): TestSessionQuestion[] => {
  let questionNumber = 1;
  const sessionQuestions: TestSessionQuestion[] = [];

  cbseHindiSections.forEach((section) => {
    const sectionQuestions = allCBSEHindiQuestions.filter(
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

export const cbseHindiSession: TestSessionState = {
  testId: "cbse-hindi-demo",
  testName: "CBSE कक्षा 10 हिंदी (ब) — 2024",
  pattern: "cbse",
  totalQuestions: 35,
  totalMarks: 80,
  totalDuration: 180,
  remainingTime: 180 * 60,
  sections: cbseHindiSections,
  questions: allCBSEHindiQuestions,
  sessionQuestions: generateCBSEHindiSessionQuestions(),
  currentQuestionIndex: 0,
  currentSectionId: "sec-a-hindi",
  startedAt: new Date().toISOString(),
  isSubmitted: false,
  allowBackNavigation: true,
  allowMarkForReview: true,
  showCalculator: false,
};
