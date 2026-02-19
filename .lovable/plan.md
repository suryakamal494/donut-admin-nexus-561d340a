
# Add Recommendations Section to Overview Tab

## What It Does
A new card at the bottom of the Overview tab that analyzes the student's weakest areas (from difficulty and cognitive data) and generates 3-5 actionable, personalized study tips. For example: "You missed 60% of Hard questions -- focus on advanced problem sets" or "Your Numerical accuracy is only 30% -- practice calculation-heavy problems in Physics."

## Technical Plan

### Step 1: Create `Recommendations.tsx` Component

**New file:** `src/components/student/tests/results/Recommendations.tsx`

- Accepts `questions: EnhancedQuestionResult[]` and `sections: SectionResult[]`
- Internally computes:
  - Weakest difficulty level (lowest accuracy among Easy/Medium/Hard)
  - Weakest cognitive type (lowest accuracy among attempted types)
  - Overall accuracy and skipped rate
  - For grand tests: weakest subject
- Generates a list of 3-5 recommendation cards based on rules:
  1. If easy accuracy < 80%: "You're losing marks on Easy questions -- likely carelessness. Slow down and double-check."
  2. If hard accuracy < 30%: "Hard questions need more practice. Focus on advanced topics."
  3. Weakest cognitive type tip: "Your {type} skills need work. Practice {type}-focused problems."
  4. If skipped > 20%: "You left {X}% unanswered. Attempt more questions even if unsure."
  5. For grand tests, weakest subject: "Focus more time on {subject} -- it's pulling your score down."
- Each tip has an icon (Lightbulb, AlertTriangle, Target, etc.), a title, and a short description
- Mobile-first card layout with framer-motion entry animations
- Color-coded priority: red border for critical, amber for moderate, blue for general tips

### Step 2: Export from Barrel

**File:** `src/components/student/tests/results/index.ts`

- Add `export { default as Recommendations } from "./Recommendations";`

### Step 3: Integrate into TestResults Page

**File:** `src/pages/student/TestResults.tsx`

- Import `Recommendations`
- Add it as the last component in the Overview `TabsContent`, after `SectionAnalysis` (or after `CognitiveAnalysis` for single-subject tests)
- Pass `questions` and `sections` props
