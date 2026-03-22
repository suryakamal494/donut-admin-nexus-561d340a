

## Curriculum Switcher — Understanding & Implementation Plan

### What I Understood from the Feature Spec

The spec defines **7 changes** across the student panel. Here's what each means, how I'll implement it, and where:

---

### Change 1 — Curriculum Pill Switcher on Subject Detail Page

**What I understood:** When a student opens a subject (e.g., Physics) and their batch has multiple curricula (CBSE + JEE Mains), a segmented pill switcher appears inside the subject header banner, below the title. If only one curriculum exists, nothing changes — the UI stays exactly as today. The switcher follows a "CURRICULUM" label on the left.

**How I'll implement it:** Create a new `CurriculumSwitcher` component — a flex row with a label and pill buttons. Active pill color is determined by the curriculum name (using our existing color system, not the spec's hardcoded hex values — I'll map CBSE→blue, JEE Mains→purple, Foundation→green, Olympiad→amber through our design tokens). The component receives `curricula[]`, `activeCurriculum`, and `onSwitch` callback.

**Where:** New component `src/components/student/subjects/CurriculumSwitcher.tsx`, rendered inside `SubjectHeader.tsx` after the stats pills row. Only rendered when `curricula.length > 1`.

---

### Change 2 — Chapter List Re-renders on Curriculum Switch

**What I understood:** When the student switches curriculum, the entire chapter list swaps — different chapter names, counts, progress, teacher names, AI path badges. The header stats ("3 of 5 chapters completed") also update to reflect only the active curriculum's data. No blending.

**How I'll implement it:**
- Extend the data model: add `curriculumId` field to `StudentChapter` interface
- Add curriculum-specific chapter sets to `chapters.ts` (e.g., CBSE Physics chapters vs JEE Physics chapters — completely different lists)
- Update `getChaptersBySubject()` to accept an optional `curriculumId` parameter: `getChaptersBySubject(subjectId, curriculumId?)`
- In `SubjectDetail.tsx`, maintain `activeCurriculum` state, pass it to the chapter fetch, and re-derive header stats from the filtered chapters

**Where:** Data changes in `src/data/student/chapters.ts`. State management in `src/pages/student/SubjectDetail.tsx`. Header stats update in `SubjectHeader.tsx` (accept chapters count as props instead of reading from subject object).

---

### Change 3 — Pending Work Indicator on Auto-Selection

**What I understood:** When the switcher auto-selects a curriculum because of pending teacher work (not because the student manually chose it), show a small chip next to the active pill saying "1 pending homework" or "2 pending tasks." This chip disappears if the student manually switches.

**How I'll implement it:** Add an `autoSelectedReason` state alongside `activeCurriculum`. When the default selection logic runs (pending work → CBSE tiebreaker → lastVisited), if rules 1 or 2 triggered, set `autoSelectedReason` to the pending count string. When the student manually taps a pill, clear `autoSelectedReason`. The `CurriculumSwitcher` component conditionally renders a small chip when `autoSelectedReason` is truthy.

**Where:** State logic in `SubjectDetail.tsx`. Chip rendering inside `CurriculumSwitcher.tsx`.

---

### Change 4 — Curriculum Badges on Subject Cards (My Subjects Grid)

**What I understood:** On the My Subjects grid page, subject cards for multi-curriculum subjects get small badge pills (e.g., "CBSE", "JEE Mains") below the chapter progress line. Single-curriculum subjects show no badges — zero visual change.

**How I'll implement it:**
- Extend `StudentSubject` interface with `curricula?: string[]` (optional array — if absent or length 1, no badges)
- In `SubjectCard.tsx`, after the chapter count row, conditionally render a flex row of small badge pills when `curricula.length > 1`
- Badge colors follow the same curriculum→color mapping used by the switcher

**Where:** Data model change in `src/data/student/subjects.ts`. Badge rendering in `src/components/student/SubjectCard.tsx`.

---

### Change 5 — Curriculum Switcher on Subject Tests Page

**What I understood:** The Subject Tests page (`/student/tests/:subject`) gets the exact same `CurriculumSwitcher` component, placed below the subject title and test count. Same visibility rule (only if multi-curriculum). The curriculum state here is **independent** from the Subjects section state.

**How I'll implement it:** Reuse the `CurriculumSwitcher` component. Add `activeCurriculum` state in `SubjectTests.tsx`. The default selection logic runs independently here.

**Where:** `src/pages/student/SubjectTests.tsx` — add switcher in the header section after the subject title.

---

### Change 6 — Test List Filters Scope to Active Curriculum

**What I understood:** When curriculum is switched, the test list re-renders showing only tests under that curriculum. Filter tab counts (All/Live/Upcoming/Attempted/Missed) update. Teacher name on test cards shows as a colored chip matching the active curriculum color.

**How I'll implement it:**
- Add `curriculumId` field to `StudentTest` interface
- Update test mock data to tag tests with curriculum
- In `SubjectTests.tsx`, filter `subjectTests` by both `subject` and `activeCurriculum`
- Update `SubjectTestItem` to render teacher name as a colored chip using curriculum color

**Where:** Data changes in `src/data/student/tests.ts`. Filtering logic and chip rendering in `src/pages/student/SubjectTests.tsx`.

---

### Change 7 — Persist lastVisited Curriculum

**What I understood:** Store the last manually selected curriculum per student per subject, separately for Subjects and Tests sections. Use localStorage keys like `lastVisited_subjects_{studentId}_{subjectId}` and `lastVisited_tests_{studentId}_{subjectId}`.

**How I'll implement it:** Create a small hook `useCurriculumSelection` that encapsulates the 3-step default selection logic (pending work → CBSE tiebreaker → lastVisited) and the localStorage read/write. Both `SubjectDetail.tsx` and `SubjectTests.tsx` use this hook with different section keys.

**Where:** New hook `src/hooks/useCurriculumSelection.ts`. Used in `SubjectDetail.tsx` and `SubjectTests.tsx`.

---

### No Changes (Confirmed)

- **Chapter detail page** (Classroom/My Path/Compete tabs) — no changes
- **Grand Tests page** — already has curriculum filters, no changes
- **Home dashboard** — no changes
- **Progress page** — no changes
- **Single-curriculum subjects** — zero visual change anywhere

---

### Phased Implementation

**Phase 1 — Data Model + Shared Components**
- Extend `StudentSubject` with `curricula` and `pendingWork` fields
- Extend `StudentChapter` with `curriculumId` field
- Extend `StudentTest` with `curriculumId` field
- Add curriculum-specific mock data (JEE Physics chapters, JEE Physics tests)
- Create `CurriculumSwitcher` component
- Create `useCurriculumSelection` hook
- Create curriculum color mapping utility

**Phase 2 — Subject Detail Page (Changes 1, 2, 3)**
- Integrate switcher into `SubjectHeader.tsx`
- Wire `activeCurriculum` state to chapter filtering in `SubjectDetail.tsx`
- Add pending work chip logic
- Update header stats to be curriculum-aware

**Phase 3 — My Subjects Grid (Change 4)**
- Add curriculum badge pills to `SubjectCard.tsx`
- Only for multi-curriculum subjects

**Phase 4 — Tests Section (Changes 5, 6, 7)**
- Add switcher to `SubjectTests.tsx`
- Filter tests by active curriculum
- Add teacher name colored chip
- Wire localStorage persistence for both sections

