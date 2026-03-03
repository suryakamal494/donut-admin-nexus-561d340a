

# Post-Refactoring Integrity Audit — Institute & Teacher Reports

## Audit Scope
Verified all files modified in the recent performance optimization pass to check for broken calculations, incorrect imports, anti-patterns, or altered display logic.

---

## Findings

### Issue 1: Unused Import in `grandTestData.ts` (Minor)
**File:** `src/data/institute/grandTestData.ts`, line 4  
`getPerformanceColor` is imported but never used in the file. It was left behind during extraction from `GrandTestResults.tsx`. The component itself imports it directly — so no broken functionality, just dead code.

**Fix:** Remove the unused import.

---

### Issue 2: `useMemo` Used as Side-Effect (Anti-Pattern) — 2 files
**Files:**
- `src/pages/institute/reports/ExamReports.tsx`, line 62
- `src/pages/institute/reports/StudentReports.tsx`, line 43

Both do `useMemo(() => { setVisibleCount(...); }, [deps])` — calling `setState` inside `useMemo` is a React anti-pattern. `useMemo` is for computing values, not triggering side effects. This works by accident in React 18 but may break in future versions and causes a double-render on every filter change.

**Fix:** Replace with `useEffect` in both files.

---

### Issue 3: `Math.random()` Still Used in Student Panel Data Generators (Out of Scope but Noted)
**Files:**
- `src/data/student/testResultsGenerator.ts` — ~15 calls
- `src/data/student/testResults.ts` — ~8 calls

These are student-facing generators, not teacher/institute. They were not in the audit scope but will cause the same flickering issue on the student panel. No action needed now — noted for a future pass.

---

## Verified — No Issues Found

| Area | Status | Detail |
|------|--------|--------|
| **Seeded PRNG in `reportsData.ts` (Teacher)** | Correct | All 5 generators use `seededRandom(hashString(...))` with appropriate seeds. Caches are properly keyed. |
| **Seeded PRNG in `instituteTestDetailData.ts`** | Correct | Generator seeds from `examId + subject`. Cache keyed by `examId__subject`. |
| **GrandTest data extraction** | Correct | Types, generator, cache all moved cleanly. `GrandTestResults.tsx` imports `generateGrandTestData` correctly. |
| **GrandTest leaderboard "Show more"** | Correct | Initial 15, increments by 15. `hasMoreLeaderboard` logic is accurate. |
| **ExamReports "Show more"** | Correct | Initial 20, increments by 20. Count display is accurate. |
| **SubjectDetail `useMemo`** | Correct | `getSubjectDetail(batchId, subjectId)` is properly wrapped with `[batchId, subjectId]` deps. |
| **Performance Index (PI) calculations** | Intact | `computeStudentPI`, `calculatePI`, `detectTrend`, `assignSecondaryTags` — all unchanged and correct. Formula: PI = 0.50×Accuracy + 0.20×Consistency + 0.15×Time + 0.15×Attempt. |
| **4-tier color system** | Intact | `getPerformanceColor` thresholds (75/50/35) unchanged. `getStatusColor` maps correctly. |
| **Batch health summary** | Intact | `generateMockBatchHealth` uses deterministic inputs (chapters, exams, roster) — no randomness. |
| **Actionable insights** | Intact | `generateMockActionableInsights` derives from analytics data — no randomness. |
| **Verdict summary** | Intact | `generateVerdictSummary` calculates from analytics — pure computation. |
| **Institute batch reports** | Intact | Hand-written static data (not generated). Averages, trends, at-risk counts all hardcoded correctly. |
| **Institute student generation** | Correct | Uses seeded PRNG from `batchId-students`. Cached per batch. |
| **Institute exam generation** | Correct | Uses seeded PRNG from `batchId-exams`. Cached globally. |
| **Exam results analytics** | Correct | Pre-generated data uses seeded PRNG. `generateExamAnalyticsForBatch` and `generateExamAnalytics` both use seeded PRNG with caching. |
| **Documentation** | Correct | `reports-overview.md` and `reports-exams.md` accurately reflect current implementation. |

---

## Implementation Plan

### Step 1: Remove unused import in `grandTestData.ts`
- Delete line 4: `import { getPerformanceColor } from "@/lib/reportColors";`

### Step 2: Fix `useMemo` anti-pattern in `ExamReports.tsx`
- Replace `useMemo(() => { setVisibleCount(EXAMS_PAGE_SIZE); }, [filteredKey])` with `useEffect`
- Add `useEffect` import if not already present

### Step 3: Fix `useMemo` anti-pattern in `StudentReports.tsx`
- Replace `useMemo(() => { setVisibleCount(STUDENTS_PER_PAGE); }, [batchFilter, search])` with `useEffect`

---

## Files to Edit (3 files)

| File | Change |
|------|--------|
| `src/data/institute/grandTestData.ts` | Remove unused `getPerformanceColor` import |
| `src/pages/institute/reports/ExamReports.tsx` | Replace `useMemo` side-effect with `useEffect` |
| `src/pages/institute/reports/StudentReports.tsx` | Replace `useMemo` side-effect with `useEffect` |

## Verdict
The recent refactoring is clean. All calculations, color tiers, PI formulas, bucket thresholds, and data generation logic are intact and functioning as designed. The three issues found are minor cleanup items — none affect correctness of displayed data.

