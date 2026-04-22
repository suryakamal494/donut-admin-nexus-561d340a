

# Student Progress Page — Final Polish

## What Changed From Previous Plan

Removed per your feedback:
- Achievement Badges — will be deleted entirely (component + data helper)
- Weak Topics Summary — not adding
- Upcoming Exams Card — already on dashboard, no duplication

## What Remains

### Phase 1 — Delete Achievement Badges

Remove all traces of the unused `AchievementBadges` component:

| File | Action |
|------|--------|
| `src/components/student/progress/AchievementBadges.tsx` | Delete |
| `src/data/student/progressData.ts` | Remove `getDerivedAchievements()` function and `DerivedAchievement` type |

No other files import these, so this is a clean removal.

### Phase 2 — UI Spacing Fixes

All changes in `src/pages/student/Progress.tsx`:

1. **Secondary tags margin**: `mb-4` to `mb-2` — tighten gap between tags and tab bar
2. **Subjects tab hint**: `py-8` to `py-3` — remove excessive empty space below subject grid
3. **Overview subject grid**: Remove `compact` prop on desktop so cards show chapter bars and more detail instead of tiny icons
4. **Desktop bottom padding**: `lg:pb-6` to `lg:pb-8` for breathing room
5. **Exams tab timeline**: Add `max-h-[70vh] overflow-y-auto` to the exam history column to prevent it stretching too tall on desktop

### Phase 3 — Add Difficulty Analysis to Insights Tab

Create a new `DifficultyOverview.tsx` component that aggregates Easy / Medium / Hard accuracy across ALL subjects (not just one subject like the existing `DifficultyBreakdown` in SubjectDeepDive).

**File**: `src/components/student/progress/DifficultyOverview.tsx`

- Aggregates difficulty data from all subject profiles
- Shows three bars: Easy, Medium, Hard with accuracy % and attempt count
- Uses the same visual style as existing `DifficultyBreakdown` for consistency
- Mobile-first: stacked vertical bars on small screens, horizontal on desktop

**File**: `src/data/student/progressData.ts`
- Add `getAggregatedDifficultyBreakdown()` helper that merges difficulty stats across subjects

**File**: `src/pages/student/Progress.tsx`
- Add `DifficultyOverview` to the Insights tab right column, below `SubjectRadarChart`
- Lazy-load it with Suspense

---

## Files Summary

| File | Action |
|------|--------|
| `src/components/student/progress/AchievementBadges.tsx` | Delete |
| `src/data/student/progressData.ts` | Remove achievements, add aggregated difficulty helper |
| `src/pages/student/Progress.tsx` | Spacing fixes, add DifficultyOverview to Insights |
| `src/components/student/progress/DifficultyOverview.tsx` | New — cross-subject difficulty analysis |

