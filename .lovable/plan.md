

# Redesign Subject Overview Cards — Compact & Information-Dense

## Problem

Each subject card is ~70% white space. Only 3 data points are shown (accuracy, trend, chapters strong) despite having 7+ metrics available in `SubjectSummary`. Additionally, all cards show identical data (54%, 0/10) due to a data seeding issue.

## What's available in `SubjectSummary` but not displayed

- `chaptersWeak` — number of weak chapters
- `weakTopicCount` — count of topics needing attention
- `chaptersTotal` — total chapters (denominator for a progress bar)
- `trend` — shown as icon only, no label

## Design: Compact Info-Dense Card

Each card will be redesigned with zero wasted space:

```text
┌──────────────────────────┐
│ [Icon] Physics        ↑  │  ← icon + name + trend icon (row)
│ ████████░░░░  6/10 ch    │  ← thin chapter progress bar + count
│ 72%  acc   3 weak topics │  ← accuracy badge + weak topic count
└──────────────────────────┘
```

Key changes:
- **Single-row header**: Icon, subject name, and trend icon all in one line (saves vertical space)
- **Chapter progress bar**: Thin horizontal bar showing `chaptersStrong / chaptersTotal` visually — replaces the text-only "0/10 strong"
- **Bottom row**: Accuracy badge on left, weak topic count on right (red-tinted if > 0, green if 0)
- **Tighter padding**: Reduce from `p-3.5` to `p-3`, remove `mb-2` / `mt-2` gaps
- **No blank zones**: Every pixel carries data

## Data Fix

The "54% everywhere, 0/10 strong" issue comes from `getSubjectSummaries()` in `progressData.ts`. Each subject uses `getStudentBatchProfile(CURRENT_STUDENT_ID, cfg.batchId)` but the batch IDs may not produce varied data. Will verify and fix the seed variation so each subject shows distinct accuracy, trend, and chapter counts.

## Files changed

| File | Change |
|------|--------|
| `src/components/student/progress/SubjectOverviewGrid.tsx` | Redesign card layout: single-row header, progress bar, compact bottom stats row |
| `src/data/student/progressData.ts` | Fix subject data variation so each subject has distinct metrics |

## Mobile-first

- Cards remain `grid-cols-2` on mobile (320px) — the compact design fits perfectly in narrow columns
- Progress bar scales with card width
- Text stays at `text-[10px]` and `text-xs` for density

