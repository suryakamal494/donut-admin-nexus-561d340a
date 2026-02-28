

## Issue — Reorder Step 2 & Hide Marking When Sections Enabled

### Core Pain Point

When "Section-wise Examination" is enabled, marking configuration (uniform marking, negative marking, partial marking) exists in **both** Step 2 and the Sections step — each section's question types already define marks per question and negative marks. This creates duplication and confusion during evaluation. The marking cards in Step 2 should disappear when sections are enabled, since the Sections step handles all marking granularly.

Additionally, the current layout order is wrong. It should follow the logical flow: Duration → Questions → Section toggle → (conditionally) Marking.

---

### What I Understood

1. **New layout order** for Step 2:
   - Duration card (slider + presets)
   - Questions per Subject (or Total Questions fallback)
   - Section-wise Examination toggle
   - Section-wise Time Limits toggle
   - **Only if `hasSections` is OFF**: Uniform Marking, Negative Marking, Partial Marking
   - Totals summary
   - Tips
   - Navigation

2. **When `hasSections` is ON**: The three marking cards (Uniform, Negative, Partial) are hidden entirely because marking is configured per question type inside each section.

3. **When `hasSections` is OFF**: The marking cards appear as before — this is the simple exam mode (like JEE Mains/NEET) where all questions share the same marking scheme.

### Reasoning

This is correct because:
- In section-wise exams (JEE Advanced), each section has different question types with different marks (+4 for MCQ, +3 for integer, etc.) and different negative marks. Global uniform marking is meaningless here.
- In non-section exams (JEE Mains, NEET), all questions are the same type with the same marks, so global marking makes sense.
- Removing duplication prevents conflicting configurations.

---

### Implementation

**File: `DurationMarksStep.tsx`** — Reorder JSX and wrap marking cards in `{!hasSections && (...)}`:

Current order → New order:
```text
1. Duration           →  1. Duration (unchanged)
2. Section-wise Time  →  2. Questions per Subject / Total Questions
3. Questions          →  3. Section-wise Examination toggle
4. Uniform Marking    →  4. Section-wise Time Limits
5. Negative Marking   →  5. Totals summary
6. Partial Marking    →  6. Uniform Marking      ← only if !hasSections
7. Totals summary     →  7. Negative Marking      ← only if !hasSections
8. Section-wise Exam  →  8. Partial Marking        ← only if !hasSections
9. Tips               →  9. Tips
10. Navigation        → 10. Navigation
```

Single file change, no hook modifications needed. The `hasSections` prop already exists.

