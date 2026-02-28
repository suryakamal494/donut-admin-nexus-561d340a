

## Audit-Driven Fixes: Unified Action Flow & Rename

Based on the audit, there are **3 real problems** to fix and **1 rename** to unify terminology. I've scoped this tightly to avoid overdoing it.

---

### What Changes and Why

**Core insight**: "Generate Practice" and "Generate Homework" mean the same thing on this platform. The Chapter Report's practice flow (`ChapterPracticeReview`) is the actual generation engine — it creates band-specific questions. The `AIHomeworkGeneratorDialog` is the AI-powered generator. Both serve the same purpose: creating targeted work for students.

**What we will NOT do** (to avoid overdoing):
- We will NOT add action buttons to every single card (Performance Bands, etc.)
- We will NOT add an AI summary to the Chapter Report page
- We will NOT restructure the homework dialog system — `CreateHomeworkDialog` stays for the manual Homework page, `AIHomeworkGeneratorDialog` stays for AI-powered report actions
- We will NOT make student names clickable everywhere — that's a polish task for later

---

### Phase 1: Rename "Generate Practice" → "Generate Homework"

**Files affected:**

| File | Change |
|------|--------|
| `src/components/teacher/reports/StudentBuckets.tsx` | Rename button label + tooltip from "Generate Practice" to "Generate Homework" |
| `src/pages/teacher/ChapterPracticeReview.tsx` | Rename page title from "Generate Practice" to "Generate Homework" |
| `src/components/teacher/reports/ChapterPracticeHistory.tsx` | Update empty-state text |
| `src/data/teacher/mockPracticeQuestions.ts` | Update file comment (cosmetic) |
| `docs/03-teacher/reports-chapters.md` | Update all "Generate Practice" references |
| `docs/03-teacher/reports-overview.md` | Update references in AI Integration Map |

**No route changes** — the URL path `/practice` stays as-is (internal, not user-facing).

---

### Phase 2: Fix ExamResults — Replace `CreateHomeworkDialog` with `AIHomeworkGeneratorDialog`

**Problem**: ExamResults uses the manual `CreateHomeworkDialog` and doesn't pass insight context to it.

**Files affected:**

| File | Change |
|------|--------|
| `src/pages/teacher/ExamResults.tsx` | Replace `CreateHomeworkDialog` import with `AIHomeworkGeneratorDialog`. Build a `prefill` object from `topicFlags` (weak topics) and exam context. Update `handleInsightAction` to set prefill from the specific insight's `actionPayload`. |
| `docs/03-teacher/reports-exams.md` | Update dialog reference |

**Result**: "Generate Homework" button in header AND "Take Action" on insight cards both open the AI dialog with proper context pre-filled.

---

### Phase 3: Fix BatchHealthCard — Wire up `onNavigateToChapter`

**Problem**: `onNavigateToChapter` prop is not passed in `BatchReport.tsx`, so priority topic buttons do nothing.

**Files affected:**

| File | Change |
|------|--------|
| `src/pages/teacher/BatchReport.tsx` | Add `onNavigateToChapter={(chapterId) => navigate(\`/teacher/reports/${batchId}/chapters/${chapterId}\`)}` prop |

One line fix.

---

### Phase 4: Add "Generate Homework" button to ReteachingPlanCard

**Problem**: The reteaching plan identifies weak topics but the only action is "Copy Plan" — dead end.

**Files affected:**

| File | Change |
|------|--------|
| `src/components/teacher/exams/results/ReteachingPlanCard.tsx` | Add a "Generate Homework" button next to "Copy Plan" that accepts an `onGenerateHomework` callback |
| `src/pages/teacher/ExamResults.tsx` | Pass `onGenerateHomework` to `ReteachingPlanCard` that opens `AIHomeworkGeneratorDialog` pre-filled with the reteaching topics |
| `docs/03-teacher/reports-exams.md` | Update ReteachingPlanCard spec |

---

### Phase 5: Documentation consolidation

**Files affected:**

| File | Change |
|------|--------|
| `docs/03-teacher/reports-overview.md` | Update AI Integration Map — all "Generate Practice" → "Generate Homework", update ExamResults dialog reference |
| `docs/03-teacher/reports-chapters.md` | Rename references |
| `docs/03-teacher/reports-exams.md` | Document dialog switch and ReteachingPlan action |
| `docs/03-teacher/reports-students.md` | Verify consistency (likely no changes needed) |

---

### Summary

| Phase | Scope | Files |
|-------|-------|-------|
| 1 | Rename "Generate Practice" → "Generate Homework" | 6 files |
| 2 | ExamResults: switch to AI dialog with prefill | 2 files |
| 3 | BatchHealthCard: wire navigation prop | 1 file |
| 4 | ReteachingPlanCard: add action button | 3 files |
| 5 | Documentation sync | 4 files |

**Total: ~12 file touches across 5 phases.** Each phase is independently deployable and testable.

