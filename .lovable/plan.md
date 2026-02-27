

## Phase 5: Institute Test Integration — Detailed Plan

### What This Phase Does

Currently, the Reports tab (`/teacher/reports → batch → exams tab`) only shows **teacher-created exams** — the ones from `teacherExams` in `src/data/teacher/exams.ts`. Grand Tests (institute-level, multi-subject exams like JEE/NEET mocks) exist in `src/data/examsData.ts` as `mockGrandTests`, but they are completely invisible in the teacher's Reports module.

Phase 5 surfaces these grand test results **filtered to the teacher's subject** (Physics, per `src/data/teacher/profile.ts`) within each batch's Exams tab.

### Where Things Will Appear

The integration point is the **BatchReport page** (`src/pages/teacher/BatchReport.tsx`), specifically the **Exams tab**. Currently this tab lists only teacher exams. After Phase 5:

1. The Exams tab gets **sub-sections or filter pills** to toggle between "My Exams" and "Institute Tests" (grand tests + PYPs)
2. Institute test cards show the **teacher's subject performance only** (e.g., Physics section from a JEE Main grand test), not the full multi-subject result
3. Each institute test card displays: test name, date, pattern badge (JEE/NEET), Physics section avg score, highest score, pass %, and student count from the teacher's batches

### Data Flow

```text
mockGrandTests (src/data/examsData.ts)
  → filter by status === "completed"
  → filter by subjects.includes("Physics")  ← teacher's subject
  → generate mock per-batch, per-subject analytics
  → surface in BatchReport Exams tab as "Institute Tests"
```

### Implementation Steps

**1. Add data generator in `src/data/teacher/reportsData.ts`**
- New interface `InstituteTestEntry` (extends `BatchExamEntry` with fields: `pattern`, `source: "grand_test" | "pyp"`, `subjectScore`, `subjectMaxMarks`)
- New function `getBatchInstituteTests(batchId, teacherSubject)` that:
  - Filters `mockGrandTests` for `completed` status and subject match
  - Generates mock subject-specific analytics (Physics avg, highest, pass %) per batch
  - Returns `InstituteTestEntry[]`

**2. Update `BatchReport.tsx` Exams tab**
- Add filter pills or segmented tabs: "My Exams" | "Institute Tests"
- When "Institute Tests" is selected, call `getBatchInstituteTests(batchId, "Physics")`
- Render institute test cards with:
  - Pattern badge (JEE Main / NEET / JEE Advanced) with color coding
  - "Physics" subject label — making it clear this is the filtered view
  - Score stats (subject avg / subject max, highest, pass %)
  - Participant count from the grand test data
- Cards are read-only (no navigation to results detail, since full results are in the institute panel)

**3. Visual differentiation**
- Institute test cards get a distinct accent — purple/indigo gradient strip (vs teal for teacher exams) to visually separate them
- A small "Institute" or "Grand Test" badge on each card
- Pattern icon/badge (JEE, NEET) matching existing `patternConfig` from student module

### Files to Modify

| File | Change |
|------|--------|
| `src/data/teacher/reportsData.ts` | Add `InstituteTestEntry` interface + `getBatchInstituteTests()` generator |
| `src/pages/teacher/BatchReport.tsx` | Add exam source filter (My Exams / Institute Tests), render institute test cards with subject-filtered data, pattern badges, distinct styling |

### What the Teacher Sees

- Goes to Reports → picks a batch → Exams tab
- Sees filter: **My Exams** (default) | **Institute Tests**
- Taps "Institute Tests" → sees completed grand tests where Physics was a subject
- Each card shows: "Grand Test #16 - NEET Biology Focus" with "Physics" badge, Physics avg 58/180, highest 162/180, 72% pass, 3250 participants
- Cards are clearly marked as institute-level (purple accent, "Grand Test" badge)

