# Reports — Overview

> Unified entry point for the Teacher Reports module: batch-level analytics, chapter drill-downs, exam results, and student profiles with AI-powered homework generation.

---

## Purpose

The Reports module is the analytical backbone of the Teacher Portal. It follows an **"Insight-First" philosophy** — prioritizing plain-language verdicts and actionable student groupings over raw charts. Every metric displayed is designed to answer a specific teaching question: _"Who needs help?"_, _"On what?"_, and _"What should I do about it?"_

---

## Module Architecture

```text
/teacher/reports                         ← Reports Landing (batch grid)
│
└── /teacher/reports/:batchId            ← Batch Report (3 tabs)
    │
    ├── Chapters Tab                     ← Chapter-wise performance
    │   └── /chapters/:chapterId         ← Chapter Report (heatmap, buckets, practice)
    │       └── /practice                ← Generate Practice (3-step wizard)
    │           └── /practice/:sessionId ← Practice Session Detail
    │
    ├── Exams Tab                        ← Exam results listing
    │   └── /exams/:examId               ← Exam Detail (4 sub-tabs)
    │       ├── Overview
    │       ├── Questions
    │       ├── Chapters
    │       └── Difficulty
    │
    └── Students Tab                     ← Student roster with PI bucketing
        └── /students/:studentId         ← Student Profile
            ├── Chapter Mastery Grid
            ├── Exam History Timeline
            ├── Difficulty Analysis
            └── Weak Topics List
```

---

## Navigation Flow

### Entry Point: Reports Landing Page

**Route**: `/teacher/reports`

The landing page displays a grid of **batch cards** — one per class-batch combination the teacher is assigned to. Each card shows:

| Metric | Example |
|--------|---------|
| Class & Batch | Class 10 — 10A |
| Students | 35 students |
| Class Average | 62% |
| Trend | ↑ 3% (vs previous period) |
| At-Risk Count | 3 students |
| Exams Conducted | 12 exams |

Clicking a batch card navigates to the **Batch Report** at `/teacher/reports/:batchId`.

### Batch Report: Three Tabs

The Batch Report uses a compact inline header with tabs on the same row as the title.

| Tab | Focus | Key Actions |
|-----|-------|-------------|
| **Chapters** | Chapter-by-chapter performance with topic heatmaps | Generate Practice |
| **Exams** | Exam results with AI analysis | Generate Homework |
| **Students** | Individual student profiles with PI bucketing | Generate Homework |

---

## Documentation Pages

| Page | Covers | Link |
|------|--------|------|
| **[Chapters](./reports-chapters.md)** | Landing page, chapter listing, topic heatmap, student buckets (PI formula), practice generation (3-step wizard), practice session detail, exam-wise breakdown | [→ reports-chapters.md](./reports-chapters.md) |
| **[Exams](./reports-exams.md)** | Exam results listing, exam detail with 4 sub-tabs (Overview, Questions, Chapters, Difficulty), AI analysis, accuracy bands, institute test detail | [→ reports-exams.md](./reports-exams.md) |
| **[Students & Homework](./reports-students.md)** | Student roster, student profile (mastery grid, exam history, difficulty analysis, weak topics), AI homework generation across 3 locations, context sources, edge function payload | [→ reports-students.md](./reports-students.md) |

---

## Key Concepts

### Performance Index (PI)

A composite score used for student bucketing throughout the module. **Never displayed to teachers** — only used internally for classification.

```
PI = (0.50 × Accuracy) + (0.20 × Consistency) + (0.15 × TimeEfficiency) + (0.15 × AttemptRate)
```

### 4-Tier Color Standard

Used consistently across all reports for visual severity:

| Tier | Range | Color | Meaning |
|------|-------|-------|---------|
| 1 | ≥ 75% | Emerald | Strong / Mastery |
| 2 | ≥ 50% | Teal | Moderate / Stable |
| 3 | ≥ 35% | Amber | Needs Attention / Reinforcement |
| 4 | < 35% | Red | Weak / At Risk |

### Student Bands

| Band | PI Range | Default State |
|------|----------|---------------|
| Mastery Ready | PI ≥ 75 | Collapsed |
| Stable Progress | 50 ≤ PI < 75 | Collapsed |
| Reinforcement Needed | 35 ≤ PI < 50 | **Expanded** |
| Foundational Risk | PI < 35 | **Expanded** |

---

## AI-Powered Actions

The Reports module integrates AI in three distinct locations:

| Action | Location | Component | Scope |
|--------|----------|-----------|-------|
| **Generate Practice** | Chapter Report → Student Buckets | `ChapterPracticeReview` (full-page wizard) | Multi-band, chapter-specific MCQs |
| **Generate Homework** (Exam) | Exam Results → Header | `CreateHomeworkDialog` | Batch-wide, exam-context homework |
| **Generate Homework** (Student) | Student Profile → Header | `AIHomeworkGeneratorDialog` | Student-specific, cross-chapter homework with context sources |

### Context Sources (Student Homework)

The student-specific homework generator supports optional context:

- **Document Upload** — PDF/doc uploaded by teacher
- **Content Library** — Existing library item
- **Lesson Plan** — Existing lesson plan with topics

---

## Navigation Design Principles

1. **Single path to exam results**: Exams are accessed via `/teacher/reports/:batchId/exams/:examId` — no duplicate routes under the Exams section
2. **Context preservation**: `returnTo` query parameter ensures back-navigation returns to the originating chapter or student report
3. **Insight-first layout**: Compact, high-density cards with inline stats reduce vertical scrolling
4. **Mobile-first**: All pages use responsive grids, bottom drawers for dialogs, and icon-only buttons on small screens

---

## Data Sources

| Data | Source File |
|------|------------|
| Batch reports | `reportsData.ts` |
| Chapter analytics | `reportsData.ts` |
| Student profiles | `studentReportData.ts` |
| Practice sessions | `practiceHistoryData.ts`, `practiceSessionDetailData.ts` |
| PI computation | `performanceIndex.ts` |
| Color utilities | `reportColors.ts` |
| Exam results | `teacherExams` data |

All generators use `Map`-based caching with seeded random for deterministic, stable data across navigations.

---

## Related Documentation

- [Teacher Dashboard](./dashboard.md)
- [Teacher Exams](./exams.md)
- [Homework & AI Generation](./homework.md)
- [Academic Progress](./academic-progress.md)
- [Exam Flow (Cross-Login)](../05-cross-login-flows/exam-flow.md)
- [Homework Flow (Cross-Login)](../05-cross-login-flows/homework-flow.md)

---

*Last Updated: February 2026*
