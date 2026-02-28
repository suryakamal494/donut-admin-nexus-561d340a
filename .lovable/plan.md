

## Requirements Confirmation — Pattern Builder Restructure

I've read all 6 files involved (hook, stepper, and all 5 step components). Here's my understanding of each change, broken down clearly.

---

### Change 1 — Merge Duration + Marking into "Duration & Marks" (Step 2)

**What you said**: Merge the current Step 2 (Duration) and Step 4 (Marking) into a single step called "Duration & Marks". Keep all components from both steps — duration slider, quick-select presets, section-wise time toggle, uniform marking toggle, marks per question, negative marking, partial marking, and tips.

**What I understood**: The new Step 2 combines everything from `DurationStep.tsx` and `MarkingStep.tsx` into one scrollable page called "Duration & Marks", exactly like the screenshot. Layout order: Duration card → Section-wise time toggle → Uniform marking + marks input → Negative marking → Partial marking → Tips.

**Implementation**: Create a new `DurationMarksStep.tsx` that merges both components. Delete `MarkingStep.tsx` as standalone step.

---

### Change 2 — Per-Subject Question Count Inputs in Step 2

**What you said**: If they selected 3 subjects (e.g., Physics, Chemistry, Mathematics) in Step 1, show input boxes for each subject where they enter how many questions per subject. From this, calculate total questions and total marks on-screen.

**What I understood**: Below the duration section (or after marking config), show a "Questions per Subject" card. For each selected subject, render a labeled number input. Auto-calculate and display: Total Questions (sum of all subject counts) and Total Marks (total questions × marks per question).

**Implementation**: Add `subjectQuestionCounts: Record<string, number>` to hook state. When `hasFixedSubjects` is true and subjects are selected, render per-subject inputs. Show computed totals in a summary row. If subjects aren't fixed, show a single "Total Questions" input instead.

---

### Change 3 — Sections Step becomes Conditional (only when enabled)

**What you said**: The Sections step should only appear when "section-wise examination" is enabled via a toggle in Duration & Marks. If not enabled, skip straight from Duration & Marks to Review. The stepper should also hide the Sections icon/label when not enabled.

**What I understood**: Add a new toggle "Enable Section-wise Exam" in Duration & Marks. When OFF: stepper shows 3 steps (Basic Info → Duration & Marks → Review). When ON: stepper shows 4 steps (Basic Info → Duration & Marks → Sections → Review). The `hasSectionWiseTime` toggle already exists but this is a broader concept — "section-wise exam" means the exam has distinct sections with different question types/counts.

**Implementation**: Add `hasSections: boolean` to hook state. Dynamic `totalSteps` (3 or 4). Stepper renders conditionally. Navigation logic adjusts to skip Sections when disabled.

---

### Change 4 — Remove Subject from Sections

**What you said**: Sections are NOT per-subject. The section configuration (Section A, B, C, D with their question types and counts) applies uniformly to ALL subjects. Remove the subject dropdown from each section card.

**What I understood**: In `SortableSectionCard`, remove the "Subject" dropdown entirely. A section like "Section 1: 5 MCQs" means every subject gets that same section structure. The `subjectId` field on `SectionDraft` becomes irrelevant for this flow.

**Implementation**: Hide the subject selector in `SectionsStep`. The section config becomes subject-agnostic.

---

### Change 5 — Section Question Count Validation against Per-Subject Count

**What you said**: If per-subject question count is 25, and they create 4 sections (e.g., 5+5+5+10), the total across sections must equal the per-subject count (25). Validate per-subject, not total.

**What I understood**: The sum of all section question counts must equal the per-subject question count (since sections are identical for all subjects). Show a validation indicator: "Section total: 20/25 — 5 remaining" or error if exceeded. Block "Next" until it matches.

**Implementation**: In `SectionsStep`, compare `sum(section.questionCount)` against the per-subject count. Show a progress/validation bar. Update `canProceedStep3` to enforce equality.

---

### Files Modified/Created

| File | Action |
|------|--------|
| `src/hooks/usePatternBuilder.ts` | Add `hasSections`, `subjectQuestionCounts`, dynamic `totalSteps`, updated navigation/validation |
| `src/components/institute/exams-new/steps/DurationMarksStep.tsx` | **New** — merged Duration + Marking + per-subject question inputs + section-wise toggle |
| `src/components/institute/exams-new/steps/DurationStep.tsx` | Delete (merged) |
| `src/components/institute/exams-new/steps/MarkingStep.tsx` | Delete (merged) |
| `src/components/institute/exams-new/steps/SectionsStep.tsx` | Remove subject dropdown, add per-subject validation |
| `src/components/institute/exams-new/PatternStepper.tsx` | Dynamic steps array based on `hasSections` |
| `src/components/institute/exams-new/steps/ReviewStep.tsx` | Update step numbers for "Edit" buttons |
| `src/pages/institute/exams-new/PatternBuilder.tsx` | Update step routing (3 or 4 steps) |

### Step Flow After Changes

```text
hasSections = OFF:
  Step 1: Basic Info → Step 2: Duration & Marks → Step 3: Review

hasSections = ON:
  Step 1: Basic Info → Step 2: Duration & Marks → Step 3: Sections → Step 4: Review
```

