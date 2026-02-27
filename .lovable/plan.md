

## UI Audit Results — Teacher Reports Module

### Pages Audited
1. **Reports** (`/teacher/reports`) — Batch listing
2. **BatchReport** (`/teacher/reports/:batchId`) — Chapters + Exams tabs
3. **ChapterReport** (`/teacher/reports/:batchId/chapters/:chapterId`) — Topic heatmap + Student buckets
4. **InstituteTestDetail** (`/teacher/reports/:batchId/institute-test/:testId`) — Question analysis
5. **ExamResults** (`/teacher/exams/:examId/results`) — Insights/Analytics/Questions/Students

### Devices Tested
- 320px (small mobile)
- 375px (iPhone SE / standard mobile)

---

### Issues Found

#### Issue 1: Student Performance Bucket Headers — Layout Broken on Mobile (Critical)
**Page:** ChapterReport.tsx  
**Problem:** The bucket header row contains: dot + label + count badge + "Generate Practice" button + chevron. At 320px and 375px, the "Generate Practice" button takes too much horizontal space, pushing the bucket label ("Mastery Ready", "Stable Progress", "Reinforcement Needed") to be severely truncated or hidden. The label text wraps awkwardly under/behind the button.

**Fix:** On mobile (< 640px), move the "Generate Practice" button below the bucket header into the expanded section, or collapse it to an icon-only button. The header row should only show: dot + label + count badge + chevron.

#### Issue 2: Institute Test Detail — Question Metrics Grid Cramped at 320px (Moderate)
**Page:** InstituteTestDetail.tsx  
**Problem:** Each question card uses `grid grid-cols-3` for the Correct/Attempted/Time metrics row. At 320px, the text and progress bars are squeezed together — "Attempted62%" runs into each other, progress bars are too small to be useful.

**Fix:** Switch to `grid-cols-2` on small screens with the time metric moved to a second row, or stack metrics vertically on the smallest screens. Use `grid grid-cols-2 sm:grid-cols-3` and move the time display inline with the header row on mobile.

---

### Issues NOT Found (Passed Audit)
- **Reports page** (batch listing): Clean at 320px, cards render well, stats grid fits
- **BatchReport Chapters tab**: Chapter cards with percentage circle, label, and metadata all fit properly
- **BatchReport Exams tab**: My Exams / Institute Tests toggle, date filters, exam cards — all responsive
- **BatchReport Institute Tests cards**: Pattern badges, score grids, participant counts render cleanly
- **ChapterReport Overview Banner**: Success rate, strong/moderate/weak counts display correctly
- **ChapterReport Topic Heatmap**: 2-column grid works well at 320px
- **ChapterReport Student Rows** (inside expanded buckets): PI scores, trend arrows, secondary tags all fit and display properly
- **ChapterReport Exam-wise Breakdown**: Exam rows with dates and percentage badges fit fine
- **InstituteTestDetail Summary Cards**: 2x2 grid with scores/questions/participants looks good
- **InstituteTestDetail Chapters Tab**: Accordion layout works properly
- **InstituteTestDetail Difficulty Tab**: Progress bars and distribution chart render cleanly
- **ExamResults page**: Insights, Performance Bands, Verdict banner — all clean on 375px

---

### Implementation Plan

**File 1: `src/pages/teacher/ChapterReport.tsx`**
- Refactor the bucket header `<button>` layout (lines 189-237)
- On mobile: Show bucket label + count + chevron in the header row only
- Move "Generate Practice" button inside the expanded content area (before the student list), or show it as an icon-only button on mobile with a tooltip
- Use `hidden sm:inline-flex` on the full button and show a small icon-only variant on mobile

**File 2: `src/pages/teacher/InstituteTestDetail.tsx`**
- Change the question metrics grid (lines 190-209) from `grid-cols-3` to `grid-cols-2 sm:grid-cols-3`
- Move the time metric to display inline with the question header row on mobile, or place it in a full-width row below the 2-column grid

