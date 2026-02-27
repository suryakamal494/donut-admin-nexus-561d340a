

## Reasoning: Where to Place "Generate Homework"

Your instinct is correct — placing it at the **top level near the batch selector** is better than per-performance-band. Here's why:

1. **Per-band buttons are redundant.** The AI homework generator already accepts context (exam data, weak topics). A single entry point that passes the full exam context is more powerful than 4 separate buttons that each only target one band.

2. **Teacher intent is exam-level, not band-level.** When a teacher thinks "I want homework based on this test," they're thinking about the whole test — the AI can internally prioritize weak areas without forcing the teacher to pick a band first.

3. **Top-level placement keeps the page clean.** Performance bands are data displays. Mixing action buttons into every band creates visual clutter, especially on mobile with 4 bands.

**Proposed placement:** Add a "Generate Homework" button in the `PageHeader` actions row, next to Export and Share. This is the standard action placement across the app. On mobile it shows just the icon (Sparkles), on desktop it shows the full label.

**What it does when clicked:** Opens the existing `CreateHomeworkDialog` (AI mode) pre-filled with:
- Subject & chapter from the exam
- Context type = "exam_results" with the exam analytics summary (weak topics, difficulty gaps)
- This way the AI generates homework that specifically targets what students struggled with

---

## Implementation Plan

| File | Change |
|---|---|
| `src/pages/teacher/ExamResults.tsx` | Add Sparkles icon import, add "Generate Homework" button in PageHeader actions (beside Export/Share). Add state for dialog open. Import and render `CreateHomeworkDialog` with exam context pre-filled. |
| No new components needed | Reuses existing `CreateHomeworkDialog` which already supports context-based AI generation |

The button will pass context like: `contextType: "exam_results"`, `contextContent: "Exam: {name}, Weak topics: {topics}, Difficulty gaps: {gaps}"` — leveraging the existing `assessment-ai` edge function's context support.

