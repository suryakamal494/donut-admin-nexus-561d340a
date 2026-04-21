

# Replace Achievements with Subject Comparison Radar Chart

## Overview

Remove the Achievements section from the Insights tab and replace it with a radar/spider chart that visualizes the student's accuracy across all subjects at a glance. This helps students instantly identify which subjects need attention.

## Changes

### 1. New component: `SubjectRadarChart.tsx`

Create `src/components/student/progress/SubjectRadarChart.tsx`:

- Uses Recharts `RadarChart` with `PolarGrid`, `PolarAngleAxis`, and `Radar` fill
- Receives `SubjectSummary[]` from existing `getSubjectSummaries()`
- Plots each subject's `accuracy` on the radar axes
- Subject names as axis labels (abbreviated on mobile to 3-4 chars)
- Filled area uses a gradient tint (donut-coral or primary)
- Card wrapper with title "Subject Overview" and a subtle legend
- Mobile-first: chart height 220px on mobile, 280px on desktop
- Below the chart, a single-line callout: "Strongest: Physics (72%) · Weakest: Hindi (41%)" derived from the data

### 2. Update `Progress.tsx`

- Remove `AchievementBadges` lazy import and `getDerivedAchievements` import
- Remove the `achievements` useMemo
- Add lazy import for `SubjectRadarChart`
- Feed it `subjects` data (already computed for the subjects tab — adjust the memo to also compute when `activeTab === "insights"`)
- Replace `<AchievementBadges>` with `<SubjectRadarChart>` in the Insights tab grid

### 3. Data layer — no changes needed

`getSubjectSummaries()` already returns `subjectName`, `accuracy`, and `color` for all 8 subjects. The radar chart consumes this directly.

## Files changed

| File | Change |
|------|--------|
| `src/components/student/progress/SubjectRadarChart.tsx` | New — Recharts radar chart showing accuracy per subject |
| `src/pages/student/Progress.tsx` | Remove achievements, add SubjectRadarChart with subject data |

## No files deleted

`AchievementBadges.tsx` stays on disk but is no longer imported.

