

## Pain Point

You're right. The current Reports UI is **too spacious on desktop** — large paddings, oversized stat grids with icons, tall banners, and generous gaps between sections. The result: excessive scrolling to reach meaningful content. Only 2-3 items are visible per screen, and 50%+ of viewport is consumed by headers/banners before content even begins.

The UI is visually polished, but the information density is too low for a daily-use teacher dashboard.

## Root Causes (per screenshot)

| Page | Issue |
|------|-------|
| **Reports Landing** | Batch cards have 3-column stat grid with icons — each card ~180px tall. Only 3 visible on a full screen |
| **Chapters Tab** | OK density, but `space-y-3` gaps add up. Chapter cards are reasonable |
| **Exams Tab** | Source toggle + date filters + exam cards with 3-col stat grid inside = only 2 exams visible |
| **Students Tab** | Decent density, similar to chapters |
| **Chapter Report** | PageHeader + Overview Banner (`text-2xl/3xl` + `p-4/p-5`) + Topic Heatmap (each cell has icon + name + % + meta with `p-3`) = 50% of screen before useful content |
| **Exam Results** | PageHeader + batch selector + tabs bar + verdict banner = top 50% before performance bands |

## Solution: Targeted Density Improvements

Not a redesign — just tightening spacing, reducing redundant elements, and making cards more compact. No functionality changes.

### Phase 1 — Reports Landing (batch cards)

**File:** `src/pages/teacher/Reports.tsx`

- Replace 3-column icon stat grid with **inline stat row** (e.g., `15 exams · 49% avg · 1 at risk`) — removes icons and grid, reduces card height by ~40%
- Reduce card padding from `p-4 sm:p-5` to `p-3 sm:p-4`
- Reduce `space-y-4 sm:space-y-5` to `space-y-3`
- Target: 4-5 cards visible on desktop instead of 3

### Phase 2 — Exams Tab (exam cards)

**File:** `src/components/teacher/reports/ExamsTab.tsx`

- Replace 3-column stat grid inside each exam card with a **single-row inline layout**: `Avg 20/40 · Highest 32/40 · 27 students`
- Reduce card padding from `p-3.5 sm:p-4` to `p-3`
- Reduce `space-y-3` between cards to `space-y-2`
- Target: 4-5 exams visible instead of 2

### Phase 3 — Chapter Report page (overview + heatmap)

**Files:** `src/components/teacher/reports/ChapterOverviewBanner.tsx`, `TopicHeatmapGrid.tsx`

**Overview Banner:**
- Reduce percentage from `text-2xl sm:text-3xl` to `text-xl sm:text-2xl`
- Reduce padding from `p-4 sm:p-5` to `p-3 sm:p-4`
- Make it more horizontal: percentage + stats on same row instead of stacked

**Topic Heatmap:**
- Remove the status icons from each cell (the color already communicates status)
- Reduce cell padding from `p-3` to `p-2.5`
- Reduce percentage font from `text-lg` to `text-base`
- Target: heatmap takes ~30% less vertical space

### Phase 4 — Student Buckets + Practice History + Exam Breakdown

**Files:** `StudentBuckets.tsx`, `ChapterPracticeHistory.tsx`, `ChapterExamBreakdown.tsx`

- Reduce CardHeader padding (already `pb-2`, keep)
- Student rows: reduce padding from `px-3 py-2.5` to `px-3 py-2`
- Practice history rows: reduce padding from `p-3` to `p-2.5`
- Reduce `space-y-3` between sections on ChapterReport to `space-y-3` (already) — reduce `space-y-4 sm:space-y-5` on the page container to `space-y-3`

### Phase 5 — Exam Results page header area

**File:** `src/pages/teacher/ExamResults.tsx`

- Reduce PageHeader bottom margin
- Tighten batch selector + tabs spacing
- Verdict banner: reduce padding slightly

### Phase 6 — PageHeader global tightening (reports only)

**File:** `src/components/ui/page-header.tsx` — No changes here (shared component). Instead, reduce the `space-y-4 sm:space-y-5` on each report page container to `space-y-3`.

---

### Summary of changes

All changes are CSS/spacing only — no structural or functional changes. Every file touched is within the Reports module. Estimated scroll reduction: **30-40%** across all report pages.

| File | Change Type |
|------|------------|
| `src/pages/teacher/Reports.tsx` | Compact batch cards: inline stats, less padding |
| `src/components/teacher/reports/ExamsTab.tsx` | Compact exam cards: inline stats |
| `src/components/teacher/reports/ChapterOverviewBanner.tsx` | Smaller banner |
| `src/components/teacher/reports/TopicHeatmapGrid.tsx` | Remove icons, tighter cells |
| `src/components/teacher/reports/StudentBuckets.tsx` | Tighter student rows |
| `src/components/teacher/reports/ChapterPracticeHistory.tsx` | Tighter session rows |
| `src/pages/teacher/ChapterReport.tsx` | Reduce container spacing |
| `src/pages/teacher/BatchReport.tsx` | Reduce container spacing |
| `src/pages/teacher/ExamResults.tsx` | Reduce header area spacing |

