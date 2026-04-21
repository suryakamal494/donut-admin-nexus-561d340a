
# Auto-Select Latest Exam on Exams Tab

## Problem

On the Exams tab, the right-side detail panel (PerExamStandingCard) is empty until the user clicks an exam. The latest exam should be pre-selected so the detail card is always visible.

## Solution

In `Progress.tsx`, after `exams` are computed, auto-set `selectedExamId` to the most recent exam's ID when:
- The exams array is loaded and non-empty
- No exam is currently selected (`selectedExamId` is still `null`)

Since `exams` are already sorted by date (newest first) in `ExamHistoryTimeline`, we sort once and pick the first entry.

## Implementation

### `src/pages/student/Progress.tsx`

Add a `useEffect` after the `exams` memo:

```typescript
useEffect(() => {
  if (exams.length > 0 && !selectedExamId) {
    const latest = [...exams].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setSelectedExamId(latest[0].examId);
  }
}, [exams]);
```

This ensures the latest exam is always pre-selected when the tab loads, and the user can still switch to any other exam by tapping.

## Files changed

| File | Change |
|------|--------|
| `src/pages/student/Progress.tsx` | Add `useEffect` to auto-select latest exam when exams load |
