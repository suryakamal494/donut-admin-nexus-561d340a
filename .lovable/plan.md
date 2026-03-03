

# Performance & Refactoring Audit — Report Pages (Institute + Teacher)

## Findings Summary

After auditing all report pages, data generators, and documentation files across both panels, I found **two critical issues** and **several optimization opportunities**.

---

## Critical Issue 1: `Math.random()` Still Used in Teacher Data Generators

**Files affected:**
- `src/data/teacher/reportsData.ts` — **~25 calls** to `Math.random()` across `generateBatchReports()`, `generateChapterReports()`, `generateBatchExams()`, `generateChapterDetail()`, and `generateInstituteTests()`
- `src/data/teacher/instituteTestDetailData.ts` — **~12 calls** to `Math.random()` in the test detail generator

**Impact:** Data flickers on every re-render/tab switch. The caching (Map) only partially masks this — data is stable after first generation per session, but generates different data across page refreshes and is non-deterministic.

**Fix:** Replace all `Math.random()` calls with seeded PRNG using the same Park-Miller LCG pattern already established in `examResults.ts`, `reportsData.ts` (institute), and `GrandTestResults.tsx`. Seed from `batchId`, `chapterId`, or `examId` as appropriate.

---

## Critical Issue 2: `GrandTestResults.tsx` is a 519-line Monolith

The file contains:
- Type definitions (15 interfaces)
- A full data generator with PRNG + caching (~100 lines)
- The entire component with 3 tabs (~350 lines)

**Fix:** Extract into:
1. `src/data/institute/grandTestData.ts` — types, PRNG, generator, cache
2. Keep `GrandTestResults.tsx` as the page component only (~300 lines after extraction)

---

## Optimization Opportunities

### A. Leaderboard list in GrandTestResults — No virtualization or pagination

The leaderboard renders all 35-45 students at once with no "Show more" pattern. This is inconsistent with the rest of the reports module and will scale poorly.

**Fix:** Add the standard "Show more" pattern (initial 15, expand by 15).

### B. ExamReports.tsx — Renders all filtered exams without pagination

With 7 batches × ~8 exams each = ~56+ exam cards rendered at once. Currently no "Show more" limit.

**Fix:** Add "Show more" pagination (initial 20).

### C. SubjectDetail.tsx — `getSubjectDetail()` not memoized at component level

`getSubjectDetail(batchId, subjectId)` is called directly in the render body without `useMemo`. It has internal caching so this is low-severity, but wrapping it in `useMemo` follows the established pattern.

### D. Documentation files — No performance concern

The docs are `.md` files in `/docs/` and are not bundled into the app. They only exist for developer reference. **No refactoring needed for docs.**

---

## Implementation Plan

### Step 1: Fix `Math.random()` in `reportsData.ts` (Teacher)
- Add `seededRandom()` and `hashString()` (same as institute pattern)
- Seed `generateBatchReports` from `batchId`
- Seed `generateChapterReports` from `batchId + chapterId`
- Seed `generateBatchExams` from `batchId`
- Seed `generateChapterDetail` from `chapterId + batchId`
- Seed `generateInstituteTests` from `batchId + subject`

### Step 2: Fix `Math.random()` in `instituteTestDetailData.ts`
- Add seeded PRNG, seed from `examId + subject`

### Step 3: Extract GrandTestResults data layer
- Move types + generator + cache → `src/data/institute/grandTestData.ts`
- Update imports in `GrandTestResults.tsx`

### Step 4: Add "Show more" to GrandTestResults leaderboard
- Initial 15, button to expand

### Step 5: Add "Show more" to ExamReports listing
- Initial 20, button to expand

### Step 6: Add `useMemo` to SubjectDetail
- Wrap `getSubjectDetail()` call

### Step 7: Update documentation
- Update `reports-overview.md` to reflect all generators now use seeded PRNG
- Update `reports-exams.md` if needed for GrandTest data extraction

---

## Files to Edit (8 files)

| File | Change |
|------|--------|
| `src/data/teacher/reportsData.ts` | Replace ~25 `Math.random()` with seeded PRNG |
| `src/data/teacher/instituteTestDetailData.ts` | Replace ~12 `Math.random()` with seeded PRNG |
| `src/data/institute/grandTestData.ts` | **New file** — extracted types + generator |
| `src/pages/institute/reports/GrandTestResults.tsx` | Import from extracted data file, add "Show more" to leaderboard |
| `src/pages/institute/reports/ExamReports.tsx` | Add "Show more" pagination |
| `src/pages/institute/reports/SubjectDetail.tsx` | Add `useMemo` wrapper |
| `docs/02-institute/reports-overview.md` | Update PRNG status notes |
| `docs/02-institute/reports-exams.md` | Update GrandTest data source reference |

