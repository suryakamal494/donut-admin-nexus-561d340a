

# AI Question Generator Enhancement: Advanced Type Configuration

## Research Findings: Current State Analysis

### What I Found in SuperAdmin AI Generator (`/superadmin/questions/ai`)

**File:** `src/pages/questions/AIQuestions.tsx` (396 lines)

The current SuperAdmin generator is a single-page form with:
- **Question Types**: All 10 types shown as checkboxes (MCQ Single, MCQ Multiple, Numerical, Assertion-Reasoning, Paragraph, Matrix Match, Fill in Blanks, True/False, Short Answer, Long Answer)
- **Difficulty Level**: Simple dropdown (Mostly Easy, Mixed, Mostly Hard)
- **Number of Questions**: Text input (1-50)
- **Additional Instructions**: Free text area
- **Classification sidebar**: Curriculum/Course cascading dropdowns

**What's MISSING:**
- No per-type quantity breakdown (if you select 4 types and want 10 questions, there's no way to say "3 MCQ, 3 Numerical, 2 Paragraph, 2 Assertion-Reasoning")
- Selecting "Paragraph" gives NO option for: how many paragraphs, how many sub-questions per paragraph, what sub-question types
- Selecting "Assertion-Reasoning" gives NO special configuration
- Selecting "Matrix Match" gives NO option for number of rows/columns
- No cognitive type selection at all (unlike Institute version)
- No difficulty multi-select (unlike Institute version)

---

### What I Found in Institute AI Generator (`/institute/questions/ai`)

**File:** `src/pages/institute/questions/AIQuestions.tsx` (585 lines)

The Institute version is MORE advanced than SuperAdmin:
- **Course Selection**: Track-based (CBSE, JEE Mains)
- **Question Types**: Only shows FIRST 6 types (`.slice(0, 6)` on line 368) - so Paragraph, Matrix Match, Fill in Blanks, True/False are HIDDEN
- **Question Count**: Slider (1-20)
- **Difficulty Mix**: Multi-select badges (Easy, Medium, Hard)
- **Cognitive Types**: Multi-select checkboxes (6 types)
- **Generated Questions Panel**: Right side with select/deselect and "Add to Bank"

**What's MISSING:**
- Paragraph, Matrix Match, Fill in Blanks, True/False types are completely hidden from the selection
- Same lack of per-type quantity distribution
- Same lack of complex type configuration

---

### What Manual Creation DOES Support (the reference standard)

**File:** `src/pages/questions/CreateQuestion.tsx` (730 lines)

The manual question creation form handles each type with specific UI:

| Question Type | Manual Form Has | AI Generator Has |
|---------------|----------------|------------------|
| MCQ (Single) | 4 options + radio for correct | Nothing specific |
| MCQ (Multiple) | 4 options + checkboxes | Nothing specific |
| Numerical | Number input for answer | Nothing specific |
| True/False | Radio: True/False | Nothing specific |
| Fill in Blanks | Blank detection (\_\_\_), answer fields per blank | Nothing specific |
| Assertion-Reasoning | Assertion textarea + Reason textarea + 4 standard options (A/B/C/D) | Nothing specific |
| Paragraph | Passage textarea + sub-question count (1-10) + per-sub-question type selector (MCQ/Multiple/Numerical/Fill/T-F) | Nothing specific |
| Matrix Match | Column A items + Column B items + matching | Not even available in Institute |
| Short Answer | Text area | Nothing specific |
| Long Answer | Text area | Nothing specific |

---

## Pain Points Being Addressed

1. **No complex type configuration**: When Paragraph/Assertion-Reasoning/Matrix Match are selected in AI Generator, there's zero guidance for the AI on HOW to structure them
2. **No per-type quantity control**: Users can't specify "I want 5 MCQ and 3 Numerical and 2 Paragraph" -- it's all random
3. **Institute is missing question types**: `.slice(0, 6)` hides 4 important types entirely
4. **Inconsistency between panels**: SuperAdmin and Institute generators have different features, different layouts

---

## Proposed Solution: "Custom Setup" Toggle

### Core Concept
Add a simple toggle between two modes:
- **Quick Mode** (default) -- Current behavior. Select types, count, difficulty. AI decides distribution.
- **Custom Setup** -- Expandable section that reveals per-type configuration ONLY for the types that need it.

This keeps the simple experience for users who don't need fine control, while giving power users the options they need.

### How It Works for Users

When a user selects question types and toggles "Custom Setup":

**For Simple Types** (MCQ Single, MCQ Multiple, Numerical, True/False, Short Answer, Long Answer):
- Just a quantity field: "How many of this type?"

**For Paragraph**:
- How many paragraphs? (1-5)
- Sub-questions per paragraph? (2-5)  
- What sub-question types? (MCQ, Multiple Correct, Numerical, Fill in Blanks, True/False)

**For Assertion-Reasoning**:
- How many? (quantity field)
- Subject focus (same as classification -- inherited)

**For Matrix Match**:
- How many matrix questions? (1-5)
- Items per column? (3-5)

**For Fill in Blanks**:
- How many? (quantity field)
- Blanks per question? (1-3)

---

## Impact Analysis

### Where Changes Happen in SuperAdmin Panel

**File:** `src/pages/questions/AIQuestions.tsx`

| Area | Current | After Change |
|------|---------|-------------|
| Question Types section | 10 checkboxes, flat list | Same checkboxes + "Custom Setup" toggle below |
| Below question types | Nothing | Collapsible "Custom Setup" panel with per-type config |
| Difficulty | Single dropdown (Easy/Mixed/Hard) | Multi-select badges (align with Institute) |
| Cognitive Types | Missing entirely | Add multi-select (align with Institute) |
| Number of Questions | Single input for total | In Quick mode: same. In Custom mode: auto-calculated from per-type counts |

### Where Changes Happen in Institute Panel

**File:** `src/pages/institute/questions/AIQuestions.tsx`

| Area | Current | After Change |
|------|---------|-------------|
| Question Types | Only first 6 shown (`.slice(0,6)`) | Show ALL 10 types (remove the `.slice`) |
| Below question types | Nothing | Same "Custom Setup" toggle and panel |
| Question Count | Slider 1-20 | In Quick mode: same slider. In Custom mode: auto-calculated |
| Rest of the form | Already has difficulty + cognitive | No change needed |

### What Does NOT Change
- Classification sidebar (both panels) -- untouched
- Manual Create Question pages -- untouched  
- Question Bank listing pages -- untouched
- Question Card components -- untouched
- Teacher Exam AI Generation Sheet -- separate component, untouched
- Any other pages or components -- untouched

---

## Technical Implementation Details

### New Shared Component: `TypeConfigPanel`

Create a new reusable component that both SuperAdmin and Institute pages import:

**File:** `src/components/questions/TypeConfigPanel.tsx`

This component receives:
- `selectedTypes`: which question types are checked
- `totalCount`: the total question count
- `onConfigChange`: callback with the configuration object

It renders:
- A toggle: "Let AI Decide" vs "Custom Setup"
- When "Custom Setup" is active, shows per-type configuration cards

### Configuration Data Structure

```typescript
interface TypeConfig {
  mode: 'auto' | 'custom';
  // Per-type quantities (only in custom mode)
  typeDistribution?: Record<QuestionType, number>;
  // Paragraph-specific
  paragraphConfig?: {
    count: number;           // How many paragraphs
    subQuestionsPerParagraph: number;  // 2-5
    subQuestionTypes: string[];        // Which types for sub-questions
  };
  // Matrix Match specific
  matrixConfig?: {
    count: number;           // How many matrix questions
    itemsPerColumn: number;  // 3-5 items
  };
  // Fill in Blanks specific
  fillConfig?: {
    count: number;
    blanksPerQuestion: number; // 1-3
  };
}
```

### Phase-Wise Implementation

**Phase 1: SuperAdmin Panel**

Step 1: Create the shared `TypeConfigPanel` component
Step 2: Integrate into `src/pages/questions/AIQuestions.tsx`
Step 3: Add missing Difficulty multi-select and Cognitive Type selection (align with Institute)
Step 4: Wire up the configuration to the generate function

**Phase 2: Institute Panel**

Step 1: Remove `.slice(0, 6)` to show all 10 question types
Step 2: Import and integrate the same `TypeConfigPanel` component
Step 3: Wire up configuration to generate function (already has most infrastructure)

### UI Design for Custom Setup Panel

```
+--------------------------------------------------+
| Question Types *                                  |
| [x] MCQ Single  [x] Numerical  [ ] True/False    |
| [x] Paragraph   [ ] Matrix     [x] Assertion     |
| [x] Fill Blanks  [ ] Short     [ ] Long Answer   |
|                                                   |
| 4 types selected                                  |
|                                                   |
| ┌──────────────────────────────────────────────┐  |
| │ ○ Let AI Decide    ● Custom Setup            │  |
| └──────────────────────────────────────────────┘  |
|                                                   |
| ▼ Custom Setup                                    |
| ┌──────────────────────────────────────────────┐  |
| │ MCQ Single              [  3  ] questions    │  |
| │ ─────────────────────────────────────────    │  |
| │ Numerical               [  2  ] questions    │  |
| │ ─────────────────────────────────────────    │  |
| │ Paragraph                                    │  |
| │   Paragraphs:          [  2  ]               │  |
| │   Questions/paragraph: [  3  ]               │  |
| │   Sub-question types:                        │  |
| │   [x] MCQ  [x] Numerical  [ ] Fill          │  |
| │ ─────────────────────────────────────────    │  |
| │ Assertion-Reasoning     [  2  ] questions    │  |
| │ ─────────────────────────────────────────    │  |
| │ Fill in Blanks          [  2  ] questions    │  |
| │   Blanks per question:  [  2  ]              │  |
| │                                              │  |
| │ Total: 15 questions                          │  |
| └──────────────────────────────────────────────┘  |
+--------------------------------------------------+
```

On mobile, this renders as a full-width stacked layout within the existing form flow.

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/questions/TypeConfigPanel.tsx` | Shared "Custom Setup" component |

### Files to Modify

| File | Change | Risk |
|------|--------|------|
| `src/pages/questions/AIQuestions.tsx` | Add TypeConfigPanel, add Difficulty multi-select, add Cognitive Types | Low -- only this page affected |
| `src/pages/institute/questions/AIQuestions.tsx` | Remove `.slice(0,6)`, add TypeConfigPanel | Low -- only this page affected |

### Files NOT Modified (Safety Confirmation)
- `src/pages/questions/CreateQuestion.tsx` -- Manual creation, untouched
- `src/pages/institute/questions/CreateQuestion.tsx` -- Manual creation, untouched
- `src/components/questions/QuestionCard.tsx` -- Display component, untouched
- `src/data/questionsData.ts` -- Data types, untouched
- `src/components/teacher/exams/AIGenerationSheet.tsx` -- Teacher exam AI, untouched
- All other pages and components -- untouched

---

## Summary

| What | Description |
|------|-------------|
| **Problem** | AI Generator has no configuration for complex question types (Paragraph, Matrix Match, Assertion-Reasoning) and no per-type quantity control |
| **Solution** | Add a "Custom Setup" toggle that reveals type-specific configuration only when needed |
| **Affected in SuperAdmin** | Only `src/pages/questions/AIQuestions.tsx` + new shared component |
| **Affected in Institute** | Only `src/pages/institute/questions/AIQuestions.tsx` (reuses same shared component) |
| **User Experience** | Default stays simple (Quick mode). Advanced users toggle "Custom Setup" for fine control |
| **Phase 1** | SuperAdmin panel -- create shared component + integrate |
| **Phase 2** | Institute panel -- show all types + integrate same component |

