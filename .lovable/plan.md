

## What You're Asking

You want me to write comprehensive documentation for the entire Teacher Reports module in the existing docs section (`docs/03-teacher/`). This documentation should cover every feature, calculation, component, and flow that exists in the Reports — covering the Chapters tab, Exams tab, Students tab, the drill-down pages (Chapter Report, Exam Results, Student Profile), the Practice Assignment lifecycle, and the Generate Homework feature across all three places it appears.

You want this done **phase-wise** to avoid missing details:
- **Phase 1**: Chapters tab + Chapter Report drill-down (topics, heatmaps, student buckets, practice history, exam breakdown)
- **Phase 2**: Exams tab + Exam Results drill-down (Insights, Analytics, Questions, Students sub-tabs, Institute Tests)
- **Phase 3**: Students tab + Student Profile drill-down (chapter mastery, exam history, difficulty analysis, weak topics, Generate Homework across all 3 locations)

## My Understanding of What Exists

After reading every file in the Reports module, here is the complete inventory:

**Level 1 — Reports Landing** (`/teacher/reports`): Batch cards with class average, trend, exam count, at-risk count.

**Level 2 — Batch Report** (`/teacher/reports/:batchId`): Three tabs — Chapters, Exams, Students.

**Level 3 — Drill-down pages:**
- Chapter Report → Overview Banner, Topic Heatmap, Student Buckets (4 PI-based bands), Practice History, Exam-wise Breakdown
- Chapter Practice Review → 3-step Generate Practice flow (Configure → Review → Assign)
- Practice Session Detail → Per-band completion, accuracy, student results, question success rates
- Exam Results → 4 tabs (Insights: verdict/bands/topics/insight cards; Analytics: AI analysis/score distribution/difficulty/cognitive charts; Questions: grouped accordion by accuracy bands; Students: all student rows)
- Institute Test Detail → Separate page for grand tests with chapters/difficulty/questions tabs
- Student Profile → Header with PI/tags, Chapter Mastery grid, Exam History timeline, Difficulty Analysis, Weak Topics list

**Generate Homework appears in 3 places:**
1. Chapter Report → "Generate Practice" button → full-page multi-band practice flow
2. Exam Results → "Generate Homework" button → CreateHomeworkDialog with weak topics pre-filled
3. Student Profile → "Generate Homework" button → AIHomeworkGeneratorDialog with student-specific weak topics pre-filled

**Key calculations:**
- Performance Index (PI) = 0.50×Accuracy + 0.20×Consistency + 0.15×TimeEfficiency + 0.15×AttemptRate
- Student bucketing: Mastery (PI≥75), Stable (50-74), Reinforcement (35-49), Risk (<35)
- Topic status: Strong (≥65%), Moderate (40-64%), Weak (<40%)
- Trend detection: Linear regression slope (>2 = up, <-2 = down)
- Plateau: 3+ exams, stddev<5, slope<1.5
- Secondary tags: improving, declining, plateaued, inconsistent, speed-issue, low-attempt

## Implementation Plan

### Phase 1 — Chapters Documentation
**File**: `docs/03-teacher/reports-chapters.md`

Will document:
- Chapters tab listing (status badges, topic count, weak count)
- Chapter Report page: Overview Banner, Topic Heatmap Grid (4-tier color standard), Student Performance Buckets (PI formula, band thresholds, secondary tags), Practice History section, Exam-wise Breakdown
- Practice Generation flow (Configure → Review → Assign), edge function prompt structure
- Practice Session Detail page (band performance cards, student results, question success rates)

### Phase 2 — Exams Documentation
**File**: `docs/03-teacher/reports-exams.md`

Will document:
- Exams tab: My Exams (date filters, pagination) vs Institute Tests (grand tests filtered by teacher's subject)
- Exam Results page: Batch Selector, 4 sub-tabs
  - Insights: VerdictBanner, PerformanceBands, TopicFlags, InsightCards
  - Analytics: AIAnalysisCard, Score Distribution chart, Difficulty Chart, Cognitive Chart
  - Questions: QuestionGroupAccordion (4 accuracy bands: Well Understood ≥75%, Moderate 50-74%, Needs Attention 35-49%, Needs Reteaching <35%)
  - Students: StudentResultRow list
- Institute Test Detail page

### Phase 3 — Students & Generate Homework Documentation
**File**: `docs/03-teacher/reports-students.md`

Will document:
- Students tab: search, PI bucket badges, trend indicators
- Student Profile page: HeaderCard (accuracy, trend, behavioral tags, consistency, weak chapters), Chapter Mastery grid (expandable topics), Exam History timeline (Show more pattern), Difficulty Analysis (Easy/Medium/Hard), Weak Topics list
- Generate Homework — all 3 locations, what context gets pre-filled, prompt structure

### Phase 4 — Navigation Update
**File**: `src/data/docsNavigation.ts`

Add "Reports" as a parent nav item under Teacher Portal with 3 children:
- Reports — Chapters (`03-teacher/reports-chapters`)
- Reports — Exams (`03-teacher/reports-exams`)
- Reports — Students (`03-teacher/reports-students`)

### Summary of File Changes

| Action | File |
|--------|------|
| **Create** | `docs/03-teacher/reports-chapters.md` |
| **Create** | `docs/03-teacher/reports-exams.md` |
| **Create** | `docs/03-teacher/reports-students.md` |
| **Modify** | `src/data/docsNavigation.ts` — add Reports nav items |

Each doc follows the existing format: Overview → Access → UI Components table → Features & Functionality (with ASCII diagrams) → Data Flow → Business Rules → Mobile Behavior → Related Documentation.

