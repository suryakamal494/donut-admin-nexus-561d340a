

# Simplify Subject Cards on Overview Tab

## Problem

The Overview tab reuses the same dense subject cards as the Subjects tab. With 8+ subjects in a 2-column grid, subject names get truncated to 1-2 characters ("P...", "M..."), and the chapter bars and weak-topic counts add clutter without value on a summary page.

## Solution

Add a `compact` mode to `SubjectOverviewGrid`. The Overview tab passes `compact={true}`, the Subjects tab continues using the full card.

### Compact card layout (Overview tab)

```text
┌─────────────────┐
│  [Icon]          │
│  Physics    72%  │
└─────────────────┘
```

- Icon centered or left-aligned, slightly larger (w-8 h-8)
- Full subject name visible (no truncation — use `text-wrap` and allow 2 lines)
- Accuracy badge below or beside the name
- No chapter bar, no weak topics, no trend icon
- Grid: `grid-cols-3 sm:grid-cols-4 lg:grid-cols-5` — smaller cards, more columns since each card is tiny
- Tapping still navigates to the Subjects tab deep-dive

### Detailed card (Subjects tab) — unchanged

Keeps the current 3-row layout: icon+name+trend, chapter progress bar, accuracy+weak topics.

## Files changed

| File | Change |
|------|--------|
| `src/components/student/progress/SubjectOverviewGrid.tsx` | Add `compact?: boolean` prop. When `true`, render minimal card (icon, name, accuracy). When `false`/absent, render current detailed card. |
| `src/pages/student/Progress.tsx` | Pass `compact` to the Overview tab's `SubjectOverviewGrid` instance (line 137) |

