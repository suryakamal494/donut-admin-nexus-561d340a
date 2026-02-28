

## Refactoring Audit — Reports Module

### Current State

Most of the reports module is already well-decomposed (BatchReport 88 lines, ChapterReport 75 lines, StudentReport 114 lines, ExamResults 238 lines, InstituteTestDetail 166 lines, and 16 granular components in `src/components/teacher/reports/`). Only two files exceed the 300-line threshold.

---

### File 1: `ChapterPracticeReview.tsx` — 533 lines (needs split)

This page has 3 inline render functions (`renderConfigure`, `renderReview`, `renderDone`) plus all state and handlers in one monolithic component.

**Extraction plan** — create `src/components/teacher/practice-review/`:

| New File | What moves there | ~Lines |
|---|---|---|
| `ConfigureStep.tsx` | `renderConfigure()` content, band config card, instructions, sticky bar | ~120 |
| `ReviewStep.tsx` | `renderReview()` content, band tabs, question cards, regenerate bar, sticky bar | ~180 |
| `DoneStep.tsx` | `renderDone()` content, success state | ~25 |
| `types.ts` | `GeneratedQuestion`, `BandResult`, `bandMeta`, `allBandKeys`, shared types | ~50 |
| `index.ts` | Barrel exports | ~5 |

The page file (`ChapterPracticeReview.tsx`) keeps routing params, state management, and step switching — drops to ~120 lines. State is passed down as props.

---

### File 2: `PracticeSessionDetail.tsx` — 301 lines (needs split)

Has 4 inline sub-components (`StatCard`, `BandCard`, `StudentRow`, `QuestionCard`) plus shared constants (`bandConfig`, `accuracyColor`).

**Extraction plan** — create `src/components/teacher/practice-detail/`:

| New File | What moves there | ~Lines |
|---|---|---|
| `StatCard.tsx` | StatCard component | ~15 |
| `BandCard.tsx` | BandCard + bandConfig + accuracyColor | ~50 |
| `StudentRow.tsx` | StudentRow component | ~30 |
| `QuestionCard.tsx` | QuestionCard + optionLabels | ~70 |
| `constants.ts` | `bandConfig`, `accuracyColor` (shared by BandCard + QuestionCard) | ~15 |
| `index.ts` | Barrel exports | ~8 |

The page file drops to ~160 lines — just routing, data fetching, and layout composition.

---

### No UI Changes

All extractions are pure refactors — move code into separate files, add imports, export via barrel. Zero visual or behavioral changes.

### Files Modified/Created

- `src/pages/teacher/ChapterPracticeReview.tsx` — trimmed to ~120 lines
- `src/components/teacher/practice-review/` — 5 new files
- `src/pages/teacher/PracticeSessionDetail.tsx` — trimmed to ~160 lines
- `src/components/teacher/practice-detail/` — 6 new files

