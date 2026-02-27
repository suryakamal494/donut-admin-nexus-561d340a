

## Refactoring Audit — Teacher Reports Module

### Line Count Summary

| File | Lines | Verdict |
|---|---|---|
| `Reports.tsx` | 121 | OK — no action needed |
| `BatchReport.tsx` | **495** | Over limit — 3 tab contents inline |
| `ChapterReport.tsx` | **400** | Over limit — 4 distinct sections inline |
| `StudentReport.tsx` | 375 | Borderline — has inline sub-components, should extract to files |
| `InstituteTestDetail.tsx` | 361 | Over limit — 3 tab contents inline |

No `src/components/teacher/reports/` directory exists yet. All report UI is monolithic inside page files.

---

### Refactoring Plan

**Create directory:** `src/components/teacher/reports/`

#### 1. BatchReport.tsx (495 → ~90 lines)

Extract 3 tab panels + student search into separate components:

| New Component File | What it contains | ~Lines |
|---|---|---|
| `reports/ChaptersTab.tsx` | Chapter list cards with status badges | ~60 |
| `reports/ExamsTab.tsx` | My Exams list with date filters, pagination + Institute Tests list | ~180 |
| `reports/StudentsTab.tsx` | Student search input + roster cards with PI badges | ~70 |

BatchReport.tsx becomes a thin shell: header, tabs, and 3 component imports.

#### 2. ChapterReport.tsx (400 → ~80 lines)

| New Component File | What it contains | ~Lines |
|---|---|---|
| `reports/ChapterOverviewBanner.tsx` | Gradient banner with success rate | ~30 |
| `reports/TopicHeatmapGrid.tsx` | Topic cards grid with status icons | ~50 |
| `reports/StudentBuckets.tsx` | Performance bands with expandable student lists + Generate Practice | ~140 |
| `reports/ChapterExamBreakdown.tsx` | Exam-wise breakdown list with show more | ~60 |

#### 3. StudentReport.tsx (375 → ~100 lines)

The file already has `ChapterMasteryCard` and `DifficultyCard` defined inline (lines 302-375). Move them to files:

| New Component File | What it contains | ~Lines |
|---|---|---|
| `reports/StudentHeaderCard.tsx` | Name, accuracy, trend, tags, Generate Homework button, quick stats | ~70 |
| `reports/ChapterMasteryCard.tsx` | Expandable chapter card with topic breakdown (already exists inline) | ~50 |
| `reports/ExamHistoryTimeline.tsx` | Exam list with show-more pagination | ~60 |
| `reports/DifficultyAnalysis.tsx` | Collapsible difficulty breakdown (includes DifficultyCard) | ~40 |
| `reports/WeakTopicsList.tsx` | Weak topics sorted by accuracy | ~30 |

#### 4. InstituteTestDetail.tsx (361 → ~80 lines)

| New Component File | What it contains | ~Lines |
|---|---|---|
| `reports/InstituteQuestionsTab.tsx` | Per-question cards with metrics bars | ~60 |
| `reports/InstituteChaptersTab.tsx` | Chapter accordion with nested question rows | ~70 |
| `reports/InstituteDifficultyTab.tsx` | Difficulty bars + distribution chart | ~70 |

#### 5. Barrel export

Create `src/components/teacher/reports/index.ts` exporting all components.

---

### Shared Utilities (already done)

- `src/lib/reportColors.ts` — `getPerformanceColor`, `getStatusColor` — already centralized, no change needed.

### Files Summary

| Action | Count |
|---|---|
| New component files | 15 |
| New barrel export | 1 |
| Modified page files | 4 (BatchReport, ChapterReport, StudentReport, InstituteTestDetail) |
| No change | Reports.tsx, reportColors.ts |

