

## Two Issues Found

### Issue 1: Tooltips Getting Clipped
**Root cause:** `InfoTooltip` hardcodes `side="top"` with no collision handling. Radix Tooltip supports `avoidCollisions` and `collisionPadding` props, but they aren't being passed. When the tooltip is near the navbar or screen edge, it renders behind/outside the viewport.

**Fix in `src/components/timetable/InfoTooltip.tsx`:**
- Add `collisionPadding={16}` to `TooltipContent` — this tells Radix to flip/shift the tooltip when it's within 16px of any viewport edge
- Remove the hardcoded `side="top"` — let Radix auto-pick the best side based on available space
- Add `sideOffset={6}` for slightly more breathing room

### Issue 2: Percentages Changing on Every Refresh
**Root cause:** The exported functions `getBatchChapters()`, `getBatchExamHistory()`, `getChapterDetail()` call their generator functions directly every time they're invoked. Since generators use `Math.random()`, every component render/refresh produces different numbers.

The `batchReports` export at line 311 is stable (called once at module load and cached). But the `getBatchChapters`, `getBatchExamHistory`, and `getChapterDetail` functions regenerate on every call.

**Fix in `src/data/teacher/reportsData.ts`:**
- Add a simple cache (`Map`) for each generator function
- On first call for a given key (batchId or chapterId+batchId), generate and cache the result
- On subsequent calls, return the cached result
- This matches the pattern already used in `examResults.ts` (which has `getExamAnalyticsForBatch` with a cache)

```typescript
// Cache maps
const chapterReportsCache = new Map<string, ChapterReportCard[]>();
const batchExamsCache = new Map<string, BatchExamEntry[]>();
const chapterDetailCache = new Map<string, ChapterDetailReport>();

export const getBatchChapters = (batchId: string): ChapterReportCard[] => {
  if (!chapterReportsCache.has(batchId)) {
    chapterReportsCache.set(batchId, generateChapterReports(batchId));
  }
  return chapterReportsCache.get(batchId)!;
};

// Same pattern for getBatchExamHistory and getChapterDetail
```

### Files to modify
| File | Change |
|------|--------|
| `src/components/timetable/InfoTooltip.tsx` | Remove hardcoded `side="top"`, add `collisionPadding={16}` |
| `src/data/teacher/reportsData.ts` | Add caching to all generator-backed exports |

