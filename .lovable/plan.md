

## Issues Identified

### Issue 1 — Section Question Type Configuration: Per-Type Questions, Marks, and Negative Marking

**What you said**: Currently each section has a single `questionCount` and a single `marksPerQuestion`. But in reality (like JEE Advanced), a section can have multiple question types (e.g., Single Correct AND Multiple Correct). When multiple types are selected, each type needs its own: (a) number of questions, (b) marks per question, (c) negative marks per wrong answer. The screenshots show this clearly — selecting "Single Correct" shows a config card for it; selecting both "Single Correct" and "Multiple Correct" shows two separate config cards.

**What I understood**: Replace the current single `questionCount` slider with a per-question-type configuration system. When a teacher selects question types (pill buttons), a "Question Type Configuration" card appears below for each selected type with three fields: Questions (number input), Marks/Question (number input, disabled/greyed with "(Global: X)" hint when uniform marking is on), and Negative Marks (number input). The section's total question count becomes the sum across all its question types.

**Implementation**:
- Add a new type `QuestionTypeConfig = { type: QuestionType; count: number; marksPerQuestion: number; negativeMarks: number }` to the `SectionDraft` interface (new field `questionTypeConfigs: QuestionTypeConfig[]`).
- Remove the single `questionCount` slider from the section card. Replace with per-type config cards that appear dynamically as types are toggled.
- When uniform marking is ON, the marks input is disabled and shows the global value with a hint "Marks are set globally in Duration step".
- The section header badge updates to show per-type summaries (e.g., "Single Correct (10q, 40m)" and "Multiple Correct (5q, 20m)").
- The section's effective `questionCount` = sum of all `questionTypeConfigs[].count`.

---

### Issue 2 — No Total Questions Input When Fixed Subjects is OFF

**What you said**: In Step 1, if "Fixed Subjects" is not enabled (no subjects selected), Step 2 shows no way to enter the total number of questions for the exam. The "Questions per Subject" card only appears when subjects are selected. There must always be a way to define total questions.

**What I understood**: When `hasFixedSubjects` is false (or no subjects selected), show a simple "Total Questions" input card in Step 2 instead of the per-subject breakdown. This value feeds into the section validation target.

**Implementation**:
- Add `totalQuestionCount: number` to hook state (used when no fixed subjects).
- In `DurationMarksStep`, when `!hasFixedSubjects || subjects.length === 0`, render a "Total Questions" card with a single number input and the same totals summary (Total Questions + Total Marks).
- Update `totalQuestions` computed value to use this field as fallback.
- Update `canProceedStep2` to require `totalQuestionCount > 0` when no fixed subjects.

---

### Issue 3 — Section Validation Must Always Work (Not Just for Fixed Subjects)

**What you said**: The validation banner in the Sections step only appears when `hasFixedSubjects && perSubjectQuestionCount > 0`. But even without fixed subjects, we defined a total question count in Step 2. The sections must validate against that total too.

**What I understood**: The validation target should be: if fixed subjects → per-subject count; if no fixed subjects → total question count from Step 2. Either way, sections must sum to the target. The banner, progress bar, and "Next" button blocking all apply regardless.

**Implementation**:
- Pass `totalQuestionCount` (the non-subject fallback) to `SectionsStep`.
- Change validation logic: `target = hasFixedSubjects ? perSubjectQuestionCount : totalQuestionCount`.
- `hasTarget` becomes true whenever target > 0 (not just when fixed subjects).
- Banner label adjusts: "per subject" vs "total" wording based on mode.
- `canProceedStep3` uses the same logic.

---

## Files Modified

| File | Changes |
|------|---------|
| `src/hooks/usePatternBuilder.ts` | Add `totalQuestionCount` state, `QuestionTypeConfig` type on `SectionDraft`, update computed values and validation |
| `src/components/institute/exams-new/steps/SectionsStep.tsx` | Replace single question count slider with per-type config cards (Questions, Marks, Negative Marks), update header badges, fix validation to work with or without fixed subjects |
| `src/components/institute/exams-new/steps/DurationMarksStep.tsx` | Add "Total Questions" input card when no fixed subjects |
| `src/pages/institute/exams-new/PatternBuilder.tsx` | Pass `totalQuestionCount` to SectionsStep |

