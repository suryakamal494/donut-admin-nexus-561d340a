

## Phase 3: Chapter Insights Page — Enrichment Plan

### What exists today
The `ChapterReport.tsx` page (at `/teacher/reports/:batchId/chapters/:chapterId`) currently shows:
1. A color-coded overview banner (success rate, strong/moderate/weak topic counts)
2. Topic-wise progress bars with status icons
3. Exam-wise breakdown (list of exams covering this chapter)

### What Phase 3 adds
Three new sections to the ChapterReport page, turning it from a passive display into an actionable insights page:

---

### 1. Topic Heatmap Grid
A visual grid replacing or supplementing the current linear topic list. Each topic is a colored cell (emerald/amber/red) sized or shaded by success rate. This gives an instant "at a glance" view of which topics are strong vs weak across the chapter. Mobile: 2-column grid of colored cards. Desktop: 3-4 columns.

### 2. Student Performance Buckets (aggregated across all exams for this chapter)
Reuse the same 4-band model from `examResults.ts` (`computePerformanceBands`): Mastery Ready, Stable Progress, Reinforcement Needed, Foundational Risk. But instead of single-exam scores, aggregate student scores across all exams covering this chapter.

**Data changes needed in `reportsData.ts`:**
- `ChapterDetailReport` gains a new field: `studentBuckets: ChapterStudentBucket[]` containing aggregated student performance for that chapter+batch.
- New type `ChapterStudentBucket` with `bandKey`, `label`, `students[]` (name, avgPercentage, examsAttempted).
- Generate mock data: pull student names from `examResults.ts` pools, assign random aggregated percentages.

**UI:** Collapsible band cards identical to `PerformanceBands.tsx` pattern (left-colored border, expand to see student list), but with a "Generate Practice" button on each band header.

### 3. "Generate Practice" Button per Bucket
Each performance band card gets a teal "Generate Practice" button. On tap, it opens the existing `AIHomeworkGeneratorDialog` pre-filled with context:
- Chapter name, batch, weak topics for that band
- The dialog handles the rest (AI generation flow already exists)

This is a UI wiring task — no new AI backend needed. The button passes context to the dialog.

---

### Files to modify

| File | Change |
|------|--------|
| `src/data/teacher/reportsData.ts` | Add `ChapterStudentBucket` type, add `studentBuckets` field to `ChapterDetailReport`, generate mock aggregated student data per band |
| `src/pages/teacher/ChapterReport.tsx` | Add topic heatmap grid section, add student bucket cards with expand/collapse and "Generate Practice" button, wire `AIHomeworkGeneratorDialog` |

### Files unchanged
- `PerformanceBands.tsx` — reuse pattern but build chapter-specific version inline (it needs "Generate Practice" button which the exam version does not have)
- `AIHomeworkGeneratorDialog.tsx` — used as-is, just opened with pre-filled context
- No new routes needed

