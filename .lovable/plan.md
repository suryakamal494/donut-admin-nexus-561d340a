

## Issues Identified

### Issue 1 — Replace Per-Subject Question Inputs with Single "Questions per Subject" Input

**Pain point**: Currently, each subject has its own number input (Physics: 25, Chemistry: 25, Math: 25). If someone accidentally enters 25 and 26, it breaks the uniform assumption. Since in exams like JEE Mains/NEET, every subject has the *same* number of questions, a single input makes more sense.

**What I understood**: Replace the per-subject individual inputs with a single "Questions per Subject" number input. The system auto-calculates total questions = (input value) × (number of subjects). E.g., enter 25 with 3 subjects → 75 total questions. All subjects get the same count automatically.

**Implementation**:
- In `DurationMarksStep.tsx`: Replace the per-subject input loop with a single input labeled "Questions per Subject". Show a computed summary: "3 subjects × 25 questions = 75 total".
- In `usePatternBuilder.ts`: Replace `subjectQuestionCounts: Record<string, number>` usage with a single `questionsPerSubject` number. When computing `totalQuestions`, use `questionsPerSubject * subjects.length`. Update `setSubjectQuestionCount` → single `setQuestionsPerSubject` setter that internally sets the same count for all subjects.
- Update `perSubjectQuestionCount` to simply return the single value.
- Update `canProceedStep2` validation accordingly.

---

### Issue 2 — Question Type Selector When Sections are Disabled

**Pain point**: For non-section exams (JEE Mains, NEET), there's no way to specify the question type (e.g., Single Correct). All parameters for exam creation need to be defined, but question type is missing in the non-section flow.

**What I understood**: When `hasSections` is OFF, show a "Question Type" selector card below the Section-wise Examination toggle. This allows selecting exactly **one** question type (single select, not multi). When `hasSections` is ON, this card disappears (question types are configured per section in the Sections step).

**Implementation**:
- Add `globalQuestionType: QuestionType` to `PatternBuilderState` (default: `'single_correct'`).
- In `DurationMarksStep.tsx`: After the Section-wise Examination card, when `!hasSections`, render a "Question Type" card with pill buttons for each type (single select). Import `questionTypeLabels` from `examPatternsData`.
- Add new props: `globalQuestionType` and `setGlobalQuestionType`.
- Pass these from `PatternBuilder.tsx`.

---

### Files Modified

| File | Changes |
|------|---------|
| `src/hooks/usePatternBuilder.ts` | Add `globalQuestionType` state, refactor `subjectQuestionCounts` to use single value, add setter |
| `src/components/institute/exams-new/steps/DurationMarksStep.tsx` | Single "Questions per Subject" input, Question Type selector when `!hasSections` |
| `src/pages/institute/exams-new/PatternBuilder.tsx` | Pass new props |

