

## Pain Points Identified

1. **No batch pre-selection**: Clicking an exam from ChapterReport or BatchReport Exams tab navigates to `/teacher/exams/:examId/results` without passing the batch context. The ExamResults page defaults to the first batch, not the one the teacher was viewing.

2. **Exams tab is plain black & white**: The BatchReport Exams tab cards use `bg-muted/50` grey boxes with no color coding. No visual distinction between high-performing vs low-performing exams. Contrast this with the Chapters tab which uses emerald/amber/red color-coded circles.

3. **No scalability controls on Exams tab**: No date filter, no pagination. After 6 months with 30-40 exams per batch, this becomes an endless scroll.

4. **Thin mock data**: Only 3-5 completed exams per batch. Not enough to test pagination or date filtering.

---

## Implementation Plan

### 1. Batch pre-selection via URL query param

- **ExamResults.tsx**: Read `?batch=batch-10a` from URL search params. If present, use it as the default `selectedBatchId` instead of `exam.batchIds[0]`.
- **ChapterReport.tsx**: Update exam breakdown links to navigate with `?batch={batchId}`.
- **BatchReport.tsx**: Update Exams tab card links to navigate with `?batch={batchId}`.

### 2. Enrich Exams tab UI with color theming

Replace the plain grey stat boxes with color-coded design matching the teacher teal-cyan theme:
- Add a left-side **pass rate indicator** (emerald/amber/red colored bar or badge) on each exam card.
- Use subtle gradient backgrounds on stat cells: emerald tint for high pass rate, amber for moderate, red for low.
- Add a small trend indicator or icon for visual richness.
- Keep the same card structure but add the teal accent color to headers/icons.

### 3. Add date filter and pagination to Exams tab

- **Date filter row**: Add a horizontal filter strip at the top of the Exams tab with options like "All Time", "Last 30 days", "Last 3 months", "Last 6 months". Compact pills, same style as batch selector.
- **Pagination**: Show 10 exams per page with simple Previous/Next pagination at the bottom. Use the existing `Pagination` component.

### 4. Expand mock data for scale testing

- Add 15-20 more completed exams spread across batches in `exams.ts` with varied dates spanning 6 months.
- Update `reportsData.ts` to generate exam history from the expanded dataset.

### Files to modify
- `src/pages/teacher/ExamResults.tsx` — read `?batch=` query param for initial batch selection
- `src/pages/teacher/BatchReport.tsx` — enrich Exams tab UI, add date filter + pagination, pass batch in navigation
- `src/pages/teacher/ChapterReport.tsx` — pass batch in exam breakdown navigation links
- `src/data/teacher/exams.ts` — add 15-20 more completed exams with varied dates
- `src/data/teacher/reportsData.ts` — no structural changes needed (already reads from teacherExams)

