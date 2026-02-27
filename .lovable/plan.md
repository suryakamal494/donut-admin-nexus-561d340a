

## Issues & Root Causes

### Issue 1: All Exam Cards Show Same Teal Color
**Root cause:** Mock data generator at `src/data/teacher/reportsData.ts` line 164:
```
passPercentage: 50 + Math.floor(Math.random() * 40)
```
This produces values **only in 50–89%** range. Since the 4-tier color scheme is:
- Emerald ≥75, Teal ≥50, Amber ≥35, Red <35

Most values land in teal (50–74), a few in emerald (75–89). Emerald and teal are visually similar greens. **No exam ever gets amber or red** because the minimum is 50%.

Same problem exists in institute test data (line 303): `45 + Math.floor(Math.random() * 40)` → always 45–84%.

Additionally, `colors.bg` (e.g. `bg-teal-500`, `bg-emerald-500`) is used as the background for the score cells. These solid green backgrounds make the score text hard to read. Should use `colors.light` (lighter surface) instead, with `colors.text` for the numbers.

**Fix:**
1. Widen the `passPercentage` range in mock data to span all 4 tiers (e.g., 30–95%)
2. Use `colors.light` + `colors.text` on score cells instead of `colors.bg` for better readability and visual differentiation

### Issue 2: "Analyze Results" Buried at Bottom of Analytics Tab
**Root cause:** In `ExamResults.tsx`, the `AIAnalysisCard` is placed last in the Analytics tab (line 187), after Score Distribution, Difficulty Chart, and Cognitive Chart.

**Fix:** Move `AIAnalysisCard` to the first position in the Analytics tab, before the charts grid.

---

## Implementation Plan

| File | Change |
|---|---|
| `src/data/teacher/reportsData.ts` | Line 164: Change `passPercentage` to `30 + Math.floor(Math.random() * 60)` (range 30–89%, covers all 4 tiers). Line 303: Same for institute tests. |
| `src/components/teacher/reports/ExamsTab.tsx` | Lines 125–126, 129–130: Change `colors.bg` to `colors.light` on score cells for visual contrast between tiers |
| `src/pages/teacher/ExamResults.tsx` | Move `AIAnalysisCard` from line 187 to before the charts grid (after line 141) |

