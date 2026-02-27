

## Your Pain Points

**Problem 1 — Multi-batch exams:** An exam like "Optics Chapter Quiz" can be assigned to `batchIds: ["batch-10a", "batch-10b"]`. Currently, clicking "View Results" navigates to `/teacher/exams/exam-3/results` and shows a single mixed pool of 25 students. There is no way to know which students belong to which batch. The reports of batch 10A and 10B are jumbled together.

**Problem 2 — Scale over time:** After 3-4 months, a teacher may have 40-60 completed exams across 3-7 batches. The Exams page (`/teacher/exams`) has no batch filter. The teacher cannot say "show me all tests I conducted for batch 10A" — she has to scroll through everything.

---

## My Reasoning

The results page needs a **batch selector** as a first-class element. When an exam has multiple batches, the teacher must pick which batch's report to view. Each batch gets its own isolated analytics (students, verdict, bands, topics). This is not optional — it is foundational.

For the Exams listing page, we need a **batch filter** added to the existing status filter bar. This solves the 3-month scale problem without adding a separate Reports tab yet (that comes in Phase 2).

---

## Implementation Plan

### 1. Add batch selector to ExamResults page

**Route stays the same:** `/teacher/exams/:examId/results`

**New flow when exam has multiple batches:**
- Below the PageHeader and above the Tabs, show a horizontal **batch selector strip** — compact pills like `10A - Physics Morning` / `10B - Physics Evening`
- Default to the first batch
- When a batch is selected, all data below (verdict, bands, topics, charts, students) filters to that batch only
- If exam has only 1 batch, the selector is hidden — no extra UI clutter

**Data layer changes (`examResults.ts`):**
- Expand `ExamAnalytics` to include a `batchId` field on each `StudentResult`
- Add a `generateExamAnalyticsForBatch()` helper that generates separate student pools per batch
- The `examAnalyticsData` for multi-batch exams stores results keyed by `examId-batchId`

**VerdictBanner update:** Show the selected batch name as a subtitle under the exam name

### 2. Add batch filter to Exams listing page

**On the Exams page (`Exams.tsx`):**
- Add a second filter row (below the status filters) with batch pills: `All` / `10A` / `10B` / `11A`
- This filters exams where `batchIds` includes the selected batch
- Compact horizontal scroll on mobile, same design as the status filter pills
- This solves the "after 3 months, too many exams" problem

### 3. Update mock data

- Make `exam-3` (Optics) assigned to `["batch-10a", "batch-10b"]` so we can test multi-batch
- Generate separate student pools for each batch (25 students per batch, different names/scores)
- Add 2-3 more completed exams across different batches to simulate realistic volume

### 4. Update exam card

- The "Results" button on multi-batch exams navigates to the results page with the batch selector visible
- No change to navigation pattern — just the results page handles multi-batch internally

---

### Design specs
- Batch selector pills use the same compact style as status filter pills (teal accent for active, muted for inactive)
- On mobile: horizontal scroll, 32px height, 44px+ touch targets
- Batch filter on Exams page: sits between status filters and search bar, same visual language
- Single-batch exams: no selector shown, zero UI overhead

### Files to modify
- `src/data/teacher/exams.ts` — update batchIds for exam-3, add more completed exams
- `src/data/teacher/examResults.ts` — batch-aware analytics generation
- `src/pages/teacher/ExamResults.tsx` — add batch selector, filter analytics by batch
- `src/components/teacher/exams/results/VerdictBanner.tsx` — show batch name
- `src/pages/teacher/Exams.tsx` — add batch filter row

