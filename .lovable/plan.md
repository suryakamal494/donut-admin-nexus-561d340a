

## Color Consistency Audit Results

### Inconsistencies Found

| File | Issue |
|---|---|
| `PerformanceBands.tsx` | "Stable" band uses **blue** (`bg-blue-500`) instead of **teal** |
| `ChapterReport.tsx` | "Stable" band uses **blue** (`bg-blue-500`) instead of **teal** |
| `BatchReport.tsx` | Inline `statusBadge()` function (line 84) — 3-tier (emerald/amber/red), skips teal. Not using centralized utility |
| `InstituteTestDetail.tsx` | Inline `statusBadge()` (line 31) — same 3-tier issue, not centralized |
| `InstituteTestDetail.tsx` | Percentage circles (lines 181, 246, 276) use inline 3-tier color logic instead of `getPerformanceColor` |
| `InstituteTestDetail.tsx` | Difficulty bar colors (line 336) are inline instead of shared |

**Standard (from `reportColors.ts`):** Emerald ≥75, **Teal** ≥50, Amber ≥35, Red <35

**What's wrong:** Two files use **blue** for the "Stable" tier instead of **teal**. Three files have duplicate inline color functions instead of importing the centralized utility. The Institute Test Detail page has 5+ inline color assignments that bypass the shared system entirely.

### Fix Plan

| File | Change |
|---|---|
| `src/components/teacher/exams/results/PerformanceBands.tsx` | Change stable band from `blue` → `teal` to match standard |
| `src/pages/teacher/ChapterReport.tsx` | Change stable band from `blue` → `teal` to match standard |
| `src/pages/teacher/BatchReport.tsx` | Remove inline `statusBadge()`, import and use `getStatusColor` from `reportColors.ts` |
| `src/pages/teacher/InstituteTestDetail.tsx` | Remove inline `statusBadge()` and all inline color ternaries. Import `getPerformanceColor` and `getStatusColor` from `reportColors.ts` |

No new files needed — all fixes use the existing centralized utility.

