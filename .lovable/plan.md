

# Refactoring Plan for Student Report Components

## What Changes and Why

This plan addresses 7 specific code quality issues found during the audit of the newly built report features. No visual or behavioral changes -- purely internal cleanup for maintainability and consistency.

---

## Refactoring Items

### 1. Extract Shared Accuracy Color Utility

The same ternary expression for coloring accuracy percentages appears in 4+ components. Extract to a single helper.

**File:** `src/data/student/testResults.ts`
- Add: `getAccuracyColor(accuracy: number): string` that returns the appropriate Tailwind text color class

**Files updated:** `DifficultyAnalysis.tsx`, `CognitiveAnalysis.tsx`, `PerformanceComparison.tsx`, `ScoreBreakdown.tsx` -- replace inline ternaries with the shared function

### 2. Extract Shared Stats Calculator

Create a reusable `getQuestionStats()` function that computes total, attempted, correct, wrong, skipped, and accuracy from a question array. Currently duplicated across `DifficultyAnalysis`, `CognitiveAnalysis`, and `Recommendations`.

**File:** `src/data/student/testResults.ts`
- Add: `getQuestionStats(questions: QuestionResult[]): { total, attempted, correct, wrong, skipped, accuracy }`

**Files updated:** `DifficultyAnalysis.tsx`, `CognitiveAnalysis.tsx`, `Recommendations.tsx` -- import and use the shared function

### 3. Move Random Data Generation to Data Layer

`PerformanceComparison.tsx` generates `classAvg` and `topper` scores using `Math.random()` inside the component. Move this to `testResultsGenerator.ts` so values are generated once and stay stable across re-renders.

**File:** `src/data/student/testResultsGenerator.ts`
- Add `classAverage` and `topperScore` fields to each `SectionResult` during generation

**File:** `src/data/student/testResults.ts`
- Add `classAverage` and `topperScore` to `SectionResult` interface

**File:** `src/components/student/tests/results/PerformanceComparison.tsx`
- Remove `generateClassAverage()` and `generateTopperScore()` functions
- Read values from `sections[i].classAverage` and `sections[i].topperScore`

### 4. Extract QuestionReview Sub-Components

`QuestionReview.tsx` is 560 lines with 4 inline sub-components. Extract them into a `review/` subfolder.

**New files:**
- `src/components/student/tests/results/review/OptionDisplay.tsx`
- `src/components/student/tests/results/review/IntegerDisplay.tsx`
- `src/components/student/tests/results/review/FillBlankDisplay.tsx`
- `src/components/student/tests/results/review/MatrixMatchDisplay.tsx`

**File updated:** `QuestionReview.tsx` -- import from the new files, reducing it to ~380 lines

### 5. Replace `any` Types in Generator

**File:** `src/data/student/testResultsGenerator.ts`
- Define a `TestInput` interface: `{ id: string; name: string; pattern?: string; duration: number; attemptedAt?: string; rank?: number; totalAttempts?: number; percentile?: number; subject?: string; totalQuestions?: number; totalMarks?: number }`
- Replace all `any` parameter types in `buildTestResultData`, `generateGrandTestResult`, `generateTeacherTestResult`, and `generateDefaultResult`

### 6. Wrap Recommendations in React.memo

**File:** `src/components/student/tests/results/Recommendations.tsx`
- Change `const Recommendations = ({ ... })` to `const Recommendations = memo(function Recommendations({ ... })`
- Add `memo` to the import from React

### 7. Use Single Source for Cognitive Types

**File:** `src/data/student/testResultsGenerator.ts` already exports `COGNITIVE_TYPES`

**Files updated:**
- `Recommendations.tsx` -- import `COGNITIVE_TYPES` instead of hardcoding `["Logical", "Analytical", ...]`
- `CognitiveAnalysis.tsx` -- import `COGNITIVE_TYPES` instead of deriving from `COGNITIVE_COLORS` keys

---

## Files Summary

| File | Action | Change |
|------|--------|--------|
| `src/data/student/testResults.ts` | Modify | Add `getAccuracyColor()`, `getQuestionStats()`, update `SectionResult` interface |
| `src/data/student/testResultsGenerator.ts` | Modify | Add `TestInput` interface, generate `classAverage`/`topperScore`, remove `any` |
| `src/components/student/tests/results/DifficultyAnalysis.tsx` | Modify | Use shared utils |
| `src/components/student/tests/results/CognitiveAnalysis.tsx` | Modify | Use shared utils, import `COGNITIVE_TYPES` |
| `src/components/student/tests/results/PerformanceComparison.tsx` | Modify | Remove random generators, read from data |
| `src/components/student/tests/results/ScoreBreakdown.tsx` | Modify | Use `getAccuracyColor()` |
| `src/components/student/tests/results/Recommendations.tsx` | Modify | Add `memo`, use shared utils, import `COGNITIVE_TYPES` |
| `src/components/student/tests/results/review/OptionDisplay.tsx` | New | Extracted from QuestionReview |
| `src/components/student/tests/results/review/IntegerDisplay.tsx` | New | Extracted from QuestionReview |
| `src/components/student/tests/results/review/FillBlankDisplay.tsx` | New | Extracted from QuestionReview |
| `src/components/student/tests/results/review/MatrixMatchDisplay.tsx` | New | Extracted from QuestionReview |
| `src/components/student/tests/results/QuestionReview.tsx` | Modify | Import extracted sub-components |

## Impact

- Zero visual or behavioral changes
- Removes ~120 lines of duplicated code
- Stabilizes random mock data across re-renders
- Reduces QuestionReview from 560 to ~380 lines
- Eliminates all `any` types in the data layer
- Single source of truth for cognitive types and accuracy colors
