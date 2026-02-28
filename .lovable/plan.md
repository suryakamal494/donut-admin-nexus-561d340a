

## Teacher Reports Module — UI Audit

### Audit Scope
All pages in the Teacher Reports hierarchy tested at 320px (iPhone SE), 390px (iPhone 14), 768px (iPad), 1024px (laptop), and 1920px (desktop).

---

### Issues Found

#### BUG 1: BatchHealthCard blocks tab content on small screens (Critical — 320px, 390px)
**Pages**: BatchReport.tsx (`/teacher/reports/:batchId`)
**Problem**: The `BatchHealthCard` starts expanded (`useState(true)`) and consumes the entire mobile viewport. When a user switches to the Exams or Students tab, the tab content is invisible — pushed below the fold by the health card. Users must manually collapse the card to see any tab content.
**Fix**: Default `isExpanded` to `false` on mobile (`useIsMobile()`) so the gradient header with stat pills is visible but the detail section is collapsed. Keep it expanded on desktop.

#### BUG 2: PerformanceBands missing dark mode styles (Medium)
**File**: `src/components/teacher/exams/results/PerformanceBands.tsx`
**Problem**: `bandStyles` uses light-only colors (`bg-emerald-50`, `bg-emerald-100 text-emerald-700`) without `dark:` variants. In dark mode, these will appear as bright light patches against the dark background.
**Fix**: Add dark mode variants matching the pattern used in `StudentBuckets.tsx` (e.g., `dark:bg-emerald-950/30`, `dark:bg-emerald-900/40 dark:text-emerald-300`).

#### BUG 3: Exam card inline stats overflow at 320px (Minor)
**File**: `src/components/teacher/reports/ExamsTab.tsx` (lines 115-124)
**Problem**: The inline stats row (`date · Avg score · High score · students`) is a single unwrapped flex line. At 320px, the text overflows or gets clipped because there's no `flex-wrap` or `overflow-x-auto`.
**Fix**: Add `flex-wrap` to the stats div, or hide "High score" on the narrowest screens with `hidden xs:inline`.

#### BUG 4: Institute test card inline stats overflow at 320px (Minor)
**File**: `src/components/teacher/reports/ExamsTab.tsx` (lines 208-216)
**Problem**: Same issue as BUG 3 — the institute test stats row (`date · Avg score · High score · students`) has `flex-wrap` but still shows all data points which can crowd on 320px. The Badges ("JEE Main", "Grand Test") also stack into the same flex row as the title.
**Fix**: Already has `flex-wrap` — verify it renders cleanly at 320px. May need to move "Grand Test" badge to the stats row.

#### BUG 5: Pagination renders all page numbers without truncation (Minor)
**File**: `src/components/teacher/reports/ExamsTab.tsx` (lines 158-164)
**Problem**: With 15+ exams and 10 per page, pagination is only 2 pages which is fine. But if exams scale to 30+, all page numbers render inline without ellipsis truncation, potentially overflowing on mobile.
**Fix**: Add ellipsis logic when `totalPages > 5` (show first, last, and neighbors of current).

#### BUG 6: ExamResults Students tab renders all students without pagination (Minor)
**File**: `src/pages/teacher/ExamResults.tsx` (lines 258-261)
**Problem**: The Students tab in ExamResults renders `analytics.allStudents.map(...)` without any pagination or "Show more" pattern. With 25-30 students this is manageable, but at scale it renders all at once.
**Fix**: Add a "Show more" pattern (initial 15 students) consistent with the rest of the module.

---

### No Issues Found (Verified Working)

| Component | 320px | 390px | Desktop | Notes |
|-----------|-------|-------|---------|-------|
| Reports Landing | OK | OK | OK | 3-col grid on desktop, 1-col mobile |
| BatchReport tabs row | OK | OK | OK | `grid-cols-3` mobile, inline desktop |
| ChaptersTab cards | OK | OK | OK | Touch targets 48px+, truncation works |
| ChapterReport | OK | OK | OK | 2-col topic grid mobile, 4-col desktop |
| TopicHeatmapGrid | OK | OK | OK | Responsive grid, colors correct |
| StudentBuckets | OK | OK | OK | Expandable bands, tags wrap correctly |
| ChapterExamBreakdown | OK | OK | OK | "Show more" pattern works |
| ChapterPracticeHistory | OK | OK | OK | "Show more" pattern works |
| VerdictBanner | OK | OK | OK | Stat pills wrap cleanly |
| ActionableInsightCards | OK | OK | OK | 1-col mobile, 2-col desktop |
| QuestionGroupAccordion | OK | OK | OK | 1-col mobile, 2-col desktop |
| ReteachingPlanCard | OK | OK | OK | Expandable, actions wrap |
| BatchSelector | OK | OK | OK | Horizontal scroll with `scrollbar-hide` |
| StudentReport header | OK | OK | OK | Action button "Assign" on mobile |
| ChapterMasteryCard | OK | OK | OK | Expandable, topic details |
| ExamHistoryTimeline | OK | OK | OK | "Show more" after 10 items |
| WeakTopicsList | OK | OK | OK | Truncation, limit 10 |
| StudentAISummary | OK | OK | OK | Expandable details |
| DifficultyAnalysis | OK | OK | OK | 3-col grid, collapsible |
| PageHeader breadcrumbs | OK | OK | OK | `overflow-x-auto`, truncation |

---

### Implementation Plan

**Task 1: Fix BatchHealthCard mobile default state**
- In `BatchHealthCard.tsx`, import `useIsMobile`
- Change `useState(true)` to `useState(!isMobile)` so it's collapsed on mobile by default

**Task 2: Add dark mode variants to PerformanceBands**
- In `PerformanceBands.tsx`, update `bandStyles` to include `dark:` variants for `bg` and `badge` properties, matching the pattern in `StudentBuckets.tsx`

**Task 3: Fix exam card stats overflow on 320px**
- In `ExamsTab.tsx`, add `flex-wrap` to the My Exams stats row (line 115)
- Hide "High score" stat on very narrow screens using responsive utility

**Task 4: Add pagination truncation for scalability**
- In `ExamsTab.tsx`, add ellipsis logic when `totalPages > 5`

**Task 5: Add "Show more" to ExamResults Students tab**
- In `ExamResults.tsx`, add a `visibleCount` state (initial 15) and a "Show more" button for the Students tab

