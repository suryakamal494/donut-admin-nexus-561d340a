

# Mobile Responsiveness & UX Audit — Reports Module (Institute + Teacher)

## Audit Scope
Reviewed all 16 report pages/components across Institute and Teacher panels at viewports: 320px, 375px, 768px, 1024px, 1920px.

---

## Findings Summary

### Category A: Critical Issues (Content Overflow / Usability Broken)

**A1. GrandTestResults — Leaderboard subject score badges overflow on 320px**
- File: `GrandTestResults.tsx` line 241-249
- Each student row shows subject score badges (`Phy 45`, `Che 38`, `Mat 42`, etc.). On 320px, these badges wrap and push content beyond the card boundary. With 4+ subjects, the row becomes multi-line and visually breaks.
- **Fix:** Hide subject score badges on mobile (`hidden sm:flex`), keep only the total percentage visible. The subject breakdown is available in the Subjects tab.

**A2. GrandTestResults — Overview tab summary banner stats overflow on narrow screens**
- File: `GrandTestResults.tsx` line 101-105
- The `flex gap-4` row with "Highest: 385/450 · Lowest: 112/450 · 78% pass" has no `flex-wrap` and will overflow at 320px.
- **Fix:** Add `flex-wrap` to the stats row.

**A3. ExamResultDetail — TabsList `grid grid-cols-4` cramped at 320px**
- File: `ExamResultDetail.tsx` line 98
- Four tabs ("Insights", "Analytics", "Questions", "Students") in a 4-column grid at 320px = ~72px per tab. Text gets cut.
- **Fix:** Use `grid grid-cols-2 sm:grid-cols-4` to stack into 2x2 on narrow mobile.

**A4. BatchHealthSummary — Urgent subjects pills text overflow**
- File: `BatchHealthSummary.tsx` line 119-124
- Urgent alert pills show "Chemistry: 72% → 65% (-7%)" which is ~30 characters. Multiple pills wrap poorly at 320px and text can overflow the container.
- **Fix:** Truncate subject names on mobile (e.g., "Chem: 72→65 -7%"), or use a stacked layout instead of inline pills.

**A5. SubjectDetail — Cross-batch comparison line wrapping issue**
- File: `SubjectDetail.tsx` — `CrossBatchLine` component
- When 4+ batches exist, the inline comparison wraps messily. The comparison icon + "Other batches:" label + batch entries all in one `flex-wrap` row becomes hard to read.
- **Fix:** On mobile, show only top 3 batches with "+N more" overflow indicator.

---

### Category B: Space Optimization Issues (Too Much/Too Little Space)

**B1. ReportsLanding — Excess vertical space from `mb-4 md:mb-6` on PageHeader + `space-y-4`**
- File: `ReportsLanding.tsx` line 54
- PageHeader has `mb-4 md:mb-6` internally, plus the parent uses `space-y-4`. This creates ~32px gap between header and stats bar on mobile — excessive for a landing page that should show maximum content above the fold.
- **Fix:** Reduce parent to `space-y-3` (already partially done), but also reduce PageHeader's internal `mb-4` to `mb-2` for report pages.

**B2. BatchReportDetail — BatchHealthSummary + BatchAIInsights + Tabs = too much before content**
- File: `BatchReportDetail.tsx` lines 60-108
- On mobile, before the user sees any subjects/exams/students, they must scroll past: PageHeader (~80px) + BatchHealthSummary header (~40px, collapsed) + BatchAIInsights header (~40px) + TabsList (~36px) = ~200px. That's 55% of a 375px viewport consumed before any tab content.
- **Fix:** Already using collapsed default for BatchHealthSummary. Also default BatchAIInsights to collapsed on mobile (it currently defaults to `expanded={true}` — line 52). The Generate button should still be visible in the collapsed header.

**B3. SubjectOverviewCards — `grid-cols-2` on very narrow screens (320px)**
- File: `SubjectOverviewCards.tsx` line 14
- Two cards side-by-side at 320px = ~148px per card. Content fits but is very tight — teacher name truncates aggressively, and the trend badge + subject name compete for space.
- **Fix:** Use `grid-cols-1 xs:grid-cols-2` to stack to single column only below 360px. Since we don't have an `xs:` breakpoint by default, keep `grid-cols-2` but ensure minimum content is preserved (already using truncate — acceptable).

**B4. StudentProfile360 — Profile header card is tall on mobile**
- File: `StudentProfile360.tsx` lines 78-101
- The profile header card shows name, roll, batch, percentage, trend, and summary stats. On mobile this is ~150px. The large "72%" text (text-2xl) dominates.
- **Fix:** Reduce percentage to `text-xl` on mobile. Keep layout compact.

**B5. Teacher BatchReport — `space-y-2` is tight, but BatchHealthCard is very tall when expanded**
- File: `BatchReport.tsx` — BatchHealthCard expanded shows suggested focus + priority topics + students = can be 400px+ on mobile.
- **Fix:** Already defaults to collapsed on mobile. This is fine. No change needed.

---

### Category C: Touch Target & Interaction Issues

**C1. ExamReports — `<select>` elements for batch/subject filters are only `h-8` (32px)**
- File: `ExamReports.tsx` lines 131, 140
- 32px is below the 44px touch target minimum for mobile.
- **Fix:** Increase to `h-10` on mobile, keep `h-8` on desktop: `h-10 sm:h-8`.

**C2. StudentReports — Same `<select>` touch target issue**
- File: `StudentReports.tsx` line 95
- **Fix:** Same as C1.

**C3. BatchStudentsTab — Sort buttons "Name" and "Avg" are `py-1.5` (~30px height)**
- File: `BatchStudentsTab.tsx` lines 113-131
- These are small tappable targets in a classroom environment.
- **Fix:** Add `min-h-[44px]` to ensure touch compliance.

**C4. Filter chips across multiple pages — `py-1.5` (~28px)**
- Files: `ExamReports.tsx`, `BatchExamsTab.tsx`, `GrandTestResults.tsx`
- Filter chip buttons are 28px tall. Below 44px minimum.
- **Fix:** Increase to `py-2` on mobile for 36px+ height, or wrap in a taller container. Given they're in a scrollable row, 36px is acceptable for filter chips (industry standard).

---

### Category D: Consistency & Polish Issues

**D1. Inconsistent bottom padding**
- Institute pages use `pb-20 md:pb-6` (BatchReportDetail, SubjectDetail, etc.) — correct for bottom nav clearance.
- But `ReportsLanding.tsx` also uses `pb-20 md:pb-6` while institute layout doesn't have a bottom nav (it uses a sidebar). The `pb-20` is unnecessary for institute panel.
- Teacher pages correctly use `pb-20 md:pb-6` since TeacherLayout has bottom nav on mobile.
- **Fix:** Institute pages should use `pb-6` since there's no bottom nav. Only teacher/student pages need `pb-20`.

**D2. PageHeader breadcrumb overflow on deep pages**
- File: `page-header.tsx` — breadcrumbs use `overflow-x-auto` which is correct.
- On SubjectDetail, breadcrumbs show: Institute > Reports > Batches > Class 10 Batch A > Physics = 5 levels. At 320px this scrolls horizontally. While functional, the breadcrumb font is `text-xs` making it hard to tap individual links.
- **Fix:** On mobile, show only last 2 breadcrumb levels with a "..." prefix. This is a minor polish item.

**D3. SubjectComparisonChart — YAxis label width is fixed at 70px**
- File: `SubjectComparisonChart.tsx` line 44
- Subject names like "Social Science" or "Computer Science" get cut at 7 chars. On mobile the chart is narrow so the 70px label takes significant horizontal space.
- **Fix:** Reduce YAxis width to `55` on mobile, and truncate names to 5 chars instead of 7.

**D4. InstituteSubjectHealth — min-w-[80px] on subject name is too wide at 320px**
- File: `InstituteSubjectHealth.tsx` line 100
- With the color dot, name (80px), bar, value (32px), trend icon, and spread text, the row is cramped at 320px.
- **Fix:** Reduce to `min-w-[60px] sm:min-w-[100px]`. The `hidden sm:inline` on spread is already correct.

---

## Implementation Plan

### Phase 1: Critical Fixes (Content Overflow)
1. **GrandTestResults** — Hide subject badges on mobile, add flex-wrap to summary stats
2. **ExamResultDetail** — 2x2 tab grid on narrow mobile
3. **BatchHealthSummary** — Truncate urgent subject pills
4. **SubjectDetail CrossBatchLine** — Cap at 3 batches with "+N" overflow on mobile

### Phase 2: Space Optimization
5. **BatchAIInsights** — Default collapsed on mobile (match BatchHealthSummary pattern)
6. **Institute pages** — Fix `pb-20` to `pb-6` (no bottom nav in institute panel)

### Phase 3: Touch Targets
7. **ExamReports + StudentReports** — Increase select height to `h-10 sm:h-8`
8. **BatchStudentsTab** — Add min-height to sort buttons
9. **Filter chips** — Increase padding to `py-2` on mobile

### Phase 4: Polish
10. **SubjectComparisonChart** — Responsive YAxis width
11. **InstituteSubjectHealth** — Responsive min-width on subject names

Total: 11 targeted fixes across ~12 files. No structural changes — all are surgical CSS/conditional rendering adjustments.

