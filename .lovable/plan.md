

# Remove PI Display and Merge Subject Cards

## Changes

### 1. Remove PI Score from all student-facing displays

**ProgressHeroCard.tsx** — Replace the PI gauge ring (center of the SVG circle) with the overall accuracy percentage. The animated ring stays but represents accuracy instead of PI. Remove the "PI Score" label.

**SubjectOverviewGrid.tsx** — Remove the `PI {subject.performanceIndex}` badge from each subject card. Replace with accuracy display (already present as `{subject.accuracy}% acc`), promoted to the badge position.

**SubjectDeepDive.tsx** — Remove the "PI Score" stat cell from the 4-column grid in the header card.

### 2. Merge two subject cards into one

Currently the Subject Deep Dive page shows:
- **Top card** (lines 34-70): Subject name, PI, Accuracy, Trend, Rank + class avg / percentile
- **Bottom card** (`SubjectBatchStanding`, lines 87-95): Visual horizontal bar with avg/top markers, rank, vs Avg, vs Top

Merge into a single card that contains:
- Subject name + Back button at the top
- The visual horizontal bar from SubjectBatchStanding (student dot, avg marker, top marker)
- A stats row below the bar: Accuracy, Trend, Rank, vs Avg, vs Top
- Class avg and Percentile as a subtle footer line

Remove the `SubjectBatchStanding` component import and rendering from SubjectDeepDive. Inline the merged design directly in the header card.

### Files changed

| File | Change |
|------|--------|
| `src/components/student/progress/ProgressHeroCard.tsx` | Gauge shows accuracy instead of PI |
| `src/components/student/progress/SubjectOverviewGrid.tsx` | Remove PI badge, promote accuracy |
| `src/components/student/progress/SubjectDeepDive.tsx` | Remove PI cell from grid; absorb SubjectBatchStanding visual bar into the header card; remove SubjectBatchStanding import |

### No files deleted

`SubjectBatchStanding.tsx` stays on disk (still used by BatchStandingCard pattern) but is no longer imported by SubjectDeepDive.

