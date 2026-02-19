
# Enhanced Test Results / Reports Page

## Current State

The Test Results page (`/student/tests/:testId/results`) exists with four tabs: Overview, Sections, Time, and Review. However, it has key limitations:

1. **Hardcoded data**: Always shows the same `sampleTestResult` regardless of which test the student clicks "View Results" on
2. **No option-level display**: The Question Review tab shows "Your Answer: B" and "Correct Answer: A" as plain text -- it does not render the actual options with green/red color coding
3. **No "View Solution" button**: Students cannot see explanations for wrong/unattempted questions
4. **No support for subject tests**: The results data generator only works with the grand test sample questions, not the 66+ teacher-assigned subject tests

## What We Will Build

### 1. Enhanced QuestionResult data model

Add `options` field to `QuestionResult` so we can render the actual option texts (not just IDs) in the review. Add a `solution` field for explanations.

```text
QuestionResult (enhanced):
  + options: { id, text, isCorrect }[]    -- actual option data
  + solution?: string                      -- explanation text
  + assertionText?: string                 -- for assertion-reasoning
  + reasonText?: string                    -- for assertion-reasoning
  + paragraphText?: string                 -- for paragraph-based
```

### 2. Test-aware result generation

Create a `generateResultForTest(testId)` function that maps to the correct question bank based on testId:
- Grand tests (JEE Main, JEE Advanced, NEET) use existing `allSampleQuestions`
- CBSE Math uses `cbseMathQuestions`
- CBSE Hindi uses `cbseHindiQuestions`
- Subject-specific teacher tests generate results from their subject's questions

This replaces the current single `sampleTestResult` export.

### 3. Redesigned Question Review with Option-Level Display

The expanded question card will show:

```text
+------------------------------------------+
| [x] Q.3  MCQ Single  medium    -1/4     |
|     A block of mass 5 kg is placed...    |
+------------------------------------------+
| Options:                                  |
| (A) 5 m/s^2              [grey]          |
| (B) 5.5 m/s^2            [GREEN border]  | <-- correct answer
| (C) 6 m/s^2              [RED border]    | <-- student selected (wrong)
| (D) 4.5 m/s^2            [grey]          |
|                                           |
| Time: 1m 24s  |  Marks: -1/4            |
|                                           |
| [View Solution v]                         |
| +---------------------------------------+|
| | The net horizontal force = 20 + 10... ||
| | cos60 = 25N. a = F/m = 25/5 = 5 m/s^2||
| +---------------------------------------+|
+------------------------------------------+
```

Color coding rules:
- **Student selected + correct** --> Green background, green border, check icon
- **Student selected + wrong** --> Red background, red border, X icon
- **Correct answer (not selected)** --> Green border (outline), check icon
- **Not selected, not correct** --> Grey/default styling
- **Unattempted question** --> Show correct answer highlighted in green, "Not Attempted" badge

### 4. Support for all question types in review

| Type | Review Display |
|------|---------------|
| MCQ Single | Options with A/B/C/D, color-coded |
| MCQ Multiple | Options with checkboxes, multiple green/red |
| Integer | Show entered value vs correct value |
| Fill in Blank | Show entered text vs correct text |
| Matrix Match | Show matching table with correct/wrong pairs |
| Assertion-Reasoning | Show A/R statements + options |
| Paragraph | Show passage + options |
| Short Answer | Show typed answer + model answer |
| Long Answer | Show typed answer + model answer |

### 5. Results page updates

- `TestResults.tsx` will call `generateResultForTest(testId)` to get test-specific data
- The test name, pattern, and metadata will come from the matching test data
- Back button navigates intelligently (to subject page if from subject, else to tests list)

## Execution Plan

### Step 1: Enhance data model in `testResults.ts`

- Add `options`, `solution`, `assertionText`, `reasonText`, `paragraphText` to `QuestionResult`
- Create `generateResultForTest(testId)` that maps testId to correct question bank and test metadata
- Generate realistic mock solutions for each question
- Keep existing `sampleTestResult` as fallback

### Step 2: Redesign `QuestionReview.tsx` with option-level rendering

- New `OptionDisplay` sub-component for MCQ options with green/red color coding
- New `IntegerDisplay` for integer type comparison
- New `SubjectiveDisplay` for short/long answer with model answer
- "View Solution" expandable section with solution text
- Question number palette at the top for quick jump (scrollable strip showing Q1-Q15 with green/red/grey dots)

### Step 3: Update `TestResults.tsx`

- Replace hardcoded `sampleTestResult` with `generateResultForTest(testId)`
- Dynamic test name from matched test data
- Smart back navigation

### Step 4: Connect from SubjectTests page

- Ensure "View Results" button on attempted tests navigates to `/student/tests/:testId/results`
- This already works from the current code

---

## Technical Details

### Files Modified

| File | Change |
|------|--------|
| `src/data/student/testResults.ts` | Add fields to QuestionResult, create generateResultForTest() |
| `src/components/student/tests/results/QuestionReview.tsx` | Full redesign with option-level display, color coding, View Solution |
| `src/pages/student/TestResults.tsx` | Use testId-aware result generation |

### Files Created

None -- all changes are enhancements to existing files.

### Design Principles

- Mobile-first: options stack vertically, touch-friendly 44px+ targets
- Green = correct, Red = wrong, Grey = not selected/unattempted
- View Solution is collapsed by default, expands on tap
- Question jump strip at top of review tab for quick navigation
- Smooth framer-motion animations on expand/collapse
- Handles all 9 question types gracefully
