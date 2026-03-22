

## Implementation Plan: 6 Curriculum Switcher UI Fixes

### Issue 1 — Move Switcher Below the Header Card

**Current:** `CurriculumSwitcher` is rendered inside `SubjectHeader.tsx` (line 115-123), buried within the gradient card.

**Change:** Remove the switcher from `SubjectHeader.tsx`. Render it in `SubjectDetail.tsx` between the header and the "Chapters" section (between lines 65 and 67). This gives it standalone visibility with its own spacing.

**Files:** `SubjectHeader.tsx` (remove lines 114-123 and related props), `SubjectDetail.tsx` (add `CurriculumSwitcher` import and render it after `<SubjectHeader>` with `mt-4 mb-2`).

---

### Issue 2 — Remove "CURRICULUM" Label

**Current:** `CurriculumSwitcher.tsx` line 30-32 renders a "Curriculum" text label.

**Change:** Delete the label `<span>` entirely. The pills are self-explanatory with names like "CBSE" and "JEE Mains".

**File:** `CurriculumSwitcher.tsx` — remove lines 29-32.

---

### Issue 3 — First-Time Onboarding Tooltip

**What:** When a multi-curriculum subject is opened for the first time ever, show a tooltip/callout pointing at the switcher: "Switch between your curriculum tracks here". Dismissed on tap, stored in `localStorage` as `curriculum_switcher_onboarded`.

**Implementation:** Add a `CurriculumOnboardingTooltip` component rendered conditionally in `SubjectDetail.tsx` next to the switcher. Checks `localStorage` on mount; if key absent, shows tooltip. On dismiss, sets the key. Simple overlay with an arrow pointing at the pills.

**Files:** New component `src/components/student/subjects/CurriculumOnboardingTooltip.tsx`, rendered in `SubjectDetail.tsx`.

---

### Issue 4 — Confirm Auto-Selection Logic is Working

Already implemented in `useCurriculumSelection.ts`. The 3-step logic (pending work → CBSE tiebreaker → lastVisited) is active. No code changes needed — this is a confirmation only.

---

### Issue 5 — Show Curriculum Tags for Single-Curriculum Subjects Too

**Current:** `SubjectCard.tsx` line 97 checks `curricula.length > 1`. Single-curriculum subjects show no tag.

**Change:** Change condition to `curricula && curricula.length >= 1`. This way a subject with only `["CBSE"]` still shows the CBSE badge, giving developers visibility into all possibilities.

**File:** `SubjectCard.tsx` — change line 97 condition.

---

### Issue 6 — Expand Mock Data with More Curriculum Variations

**Current:** Only Math, Physics, Chemistry have `curricula: ["CBSE", "JEE Mains"]`. All other subjects have no curricula field.

**Changes in `subjects.ts`:**
- Biology → `curricula: ["CBSE", "NEET"]`
- Science → `curricula: ["CBSE", "Foundation"]`
- Zoology → `curricula: ["NEET"]` (single, but tag visible per Issue 5)
- Botany → `curricula: ["NEET"]`
- Economics → `curricula: ["CBSE", "Foundation", "Olympiad"]` (3-way example)
- English → `curricula: ["CBSE"]`
- CS → `curricula: ["CBSE"]`
- Hindi, Sanskrit, Social Science, History, Geography, Civics → `curricula: ["CBSE"]`
- Art, PE, Home Science → `curricula: ["CBSE"]`
- AI → `curricula: ["CBSE", "Foundation"]`
- Accountancy, Business → `curricula: ["CBSE"]`
- EVS → `curricula: ["CBSE"]`
- Informatics → `curricula: ["CBSE"]`

Also add `pendingWork` entries for the new multi-curriculum subjects (Biology, Science, Economics, AI).

**File:** `src/data/student/subjects.ts`

**Also update `curriculumColors.ts`:** Already has NEET, Foundation, Olympiad schemes — no changes needed there.

---

### Files Changed Summary

| File | Change |
|------|--------|
| `src/components/student/subjects/CurriculumSwitcher.tsx` | Remove "Curriculum" label |
| `src/components/student/subjects/SubjectHeader.tsx` | Remove switcher rendering and related props |
| `src/pages/student/SubjectDetail.tsx` | Render switcher below header + add onboarding tooltip |
| `src/components/student/subjects/CurriculumOnboardingTooltip.tsx` | New — first-time tooltip component |
| `src/components/student/SubjectCard.tsx` | Show tags for `curricula.length >= 1` |
| `src/data/student/subjects.ts` | Add curricula arrays to all subjects |

### What Does NOT Change
- `useCurriculumSelection.ts` — logic already correct
- `curriculumColors.ts` — already has NEET/Foundation/Olympiad
- Chapter data, test data — unchanged
- Tests section switcher — unchanged (separate issue if needed)
- Grand Tests, Dashboard, Progress pages — unchanged

