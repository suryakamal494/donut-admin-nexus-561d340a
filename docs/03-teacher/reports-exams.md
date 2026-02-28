# Reports — Exams Tab

> Exam-wise performance analytics with multi-tab drill-down: Insights, Analytics, Questions, and Students.

---

## Overview

The **Exams** tab within the Batch Report lists all completed exams for the batch, split into two sources: **My Exams** (created by the teacher) and **Institute Tests** (grand tests containing the teacher's subject). Each exam drills down into a detailed results page with four analytical tabs.

## Access

- **Route (Exams listing)**: `/teacher/reports/:batchId` → Exams tab
- **Route (Exam Results)**: `/teacher/reports/:batchId/exams/:examId`
- **Route (Institute Test Detail)**: `/teacher/reports/:batchId/institute-test/:testId`
- **Login Types**: Teacher
- **Permissions Required**: Teacher account with assigned batches

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| `ExamsTab` | Source toggle (My Exams / Institute Tests), date filters, exam cards, pagination | Batch Report → Exams tab |
| `BatchSelector` | Batch pill selector for multi-batch exams | Exam Results → Top |
| `VerdictBanner` | Teal gradient banner with plain-language verdict | Exam Results → Insights |
| `PerformanceBands` | 4-band student grouping | Exam Results → Insights |
| `TopicFlags` | Per-topic success rate badges | Exam Results → Insights |
| `InsightCards` | Actionable insight cards | Exam Results → Insights |
| `AIAnalysisCard` | AI-generated performance summary | Exam Results → Analytics |
| `DifficultyChart` | Easy/Medium/Hard accuracy chart | Exam Results → Analytics |
| `CognitiveChart` | Cognitive type accuracy chart | Exam Results → Analytics |
| `QuestionGroupAccordion` | Questions grouped by 4 accuracy bands | Exam Results → Questions |
| `QuestionAnalysisCard` | Individual question analysis card | Inside accordion |
| `StudentResultRow` | Individual student result row | Exam Results → Students |
| `CreateHomeworkDialog` | AI homework generator dialog | Exam Results → Header action |
| `InstituteQuestionsTab` | Per-question analysis for grand tests | Institute Test Detail |
| `InstituteChaptersTab` | Chapter-wise breakdown for grand tests | Institute Test Detail |
| `InstituteDifficultyTab` | Difficulty split for grand tests | Institute Test Detail |

---

## Features & Functionality

### 1. Exams Listing

#### Source Toggle

Two sources, selectable via pill buttons:

```text
[My Exams (12)]  [🎓 Institute Tests (3)]
```

- **My Exams**: Exams created by the teacher, filtered to the current batch
- **Institute Tests**: Grand tests (JEE Main, JEE Advanced, NEET) that contain the teacher's subject

#### My Exams — Date Filters & Pagination

```text
🔽 [All Time] [30 days] [3 months] [6 months]        12 exams

┌─────────────────────────────────────────────────────────┐
│ ▌ Kinematics Unit Test                      [72% pass] │
│   📅 15 Jan 2025                                        │
│   ┌──────────┬──────────┬──────────┐                    │
│   │ 54/80    │ 72/80    │ 25       │                    │
│   │ Avg Score│ Highest  │ Students │                    │
│   └──────────┴──────────┴──────────┘                    │
└─────────────────────────────────────────────────────────┘

◀ 1  [2]  3 ▶
```

**Card Data Points:**
| Field | Description |
|-------|-------------|
| `examName` | Exam title (truncated) |
| `date` | Formatted as `dd MMM yyyy` |
| `classAverage / totalMarks` | Average score vs max |
| `highestScore / totalMarks` | Best score vs max |
| `totalStudents` | Number of students |
| `passPercentage` | Pass rate badge |

**Left border color**: Derived from `passPercentage` using the 4-tier color system.

**Pagination**: 10 exams per page with Previous/Next controls.

**Clicking a card** → navigates to `/teacher/reports/:batchId/exams/:examId`.

#### Institute Tests

```text
┌─────────────────────────────────────────────────────────┐
│ ▌ Grand Test #3 — Full Syllabus    [JEE Main]  [Grand] │
│   📅 20 Jan 2025 · 🏆 Physics                          │
│   ┌──────────┬──────────┬──────────┐                    │
│   │ 42/100   │ 85/100   │ 1,200    │                    │
│   │ Avg (Phy)│ Highest  │Particip. │                    │
│   └──────────┴──────────┴──────────┘                    │
│   Total: 300 marks                         [65% pass]   │
└─────────────────────────────────────────────────────────┘
```

**Institute Tests show subject-specific metrics** — the teacher only sees scores for their subject (e.g., Physics) within the multi-subject grand test.

**Pattern badges:**
| Pattern | Badge Color |
|---------|-------------|
| JEE Main | Blue |
| JEE Advanced | Orange |
| NEET | Green |

**Left border**: Always violet (`border-l-violet-500`).

**Clicking a card** → navigates to `/teacher/reports/:batchId/institute-test/:testId`.

**Filtering logic**: Only completed grand tests that include the teacher's subject are shown.

---

### 2. Exam Results Page

**Route**: `/teacher/reports/:batchId/exams/:examId`

#### Batch Selector

For multi-batch exams, a pill selector lets the teacher switch between batches. The selected batch determines all displayed analytics.

```text
[10A ●]  [10B]  [11A]
```

Context preservation: If navigating from a chapter report with `?returnTo=`, the breadcrumbs include a "Chapter" link back.

#### Header Actions

Three buttons (labels hidden on mobile, icons always visible):

| Action | Icon | Function |
|--------|------|----------|
| Generate Homework | `Sparkles` | Opens `CreateHomeworkDialog` with weak topics pre-filled |
| Export | `Download` | Export results (placeholder) |
| Share | `Share2` | Share results (placeholder) |

#### Tab Structure

```text
[Insights]  [Analytics]  [Questions]  [Students]
```

---

#### 2a. Insights Tab

The default tab, prioritizing **plain-language actionable information** over raw charts.

##### Verdict Banner (`VerdictBanner`)

```text
┌─────────────────────────────────────────────────────────┐
│  Kinematics Unit Test                                    │
│  Class 10 - 10A                                          │
│                                                          │
│  Class average 62%  |  18 of 25 passed                   │
│                                                          │
│  [⚠ 7 at risk] [📖 2 weak topics] [🏆 Top: Aarav 92%] │
│  [📈 Avg 62%]                                           │
└─────────────────────────────────────────────────────────┘
```

Always uses teal-to-cyan gradient. Insight pills show:
- At-risk count (reinforcement + risk bands combined)
- Weak topic count (topics with success rate < 50%)
- Top student name + percentage
- Average percentage

##### Performance Bands (`PerformanceBands`)

Same 4-band grouping as Chapter Buckets, but based on **exam percentage** (not PI):

| Band | Exam Percentage Range |
|------|----------------------|
| Mastery Ready | ≥ 75% |
| Stable Progress | 50–74% |
| Reinforcement Needed | 35–49% |
| Foundational Risk | < 35% |

> **Note**: In exam results, bands use raw percentage. In chapter reports, bands use PI (composite score). This is intentional — single exam results don't have enough data points for PI calculation.

##### Topic Flags (`TopicFlags`)

Per-topic success rate indicators:

| Status | Success Rate | Color |
|--------|-------------|-------|
| Strong | ≥ 75% | Emerald |
| Moderate | 50–74% | Teal |
| Weak | < 50% | Red |

Computed from `questionAnalysis` array — each question has a `topic` field and `successRate`.

##### Insight Cards (`InsightCards`)

Actionable cards highlighting specific patterns from question analysis (e.g., "3 questions had <30% success rate", "Topic X needs attention").

---

#### 2b. Analytics Tab

Data visualization and AI-generated analysis.

##### AI Analysis Card (`AIAnalysisCard`)

A prominent "Analyze Results" button that triggers an AI-generated summary:

```text
┌─────────────────────────────────────────────────────────┐
│  🤖 AI Analysis                                         │
│                                                          │
│  [✨ Analyze Results]                                    │
│                                                          │
│  (After clicking:)                                       │
│  The class performed moderately on Kinematics...         │
│  Key gaps: Projectile Motion (32% success)...            │
│  Recommended: Focus next class on application...         │
└─────────────────────────────────────────────────────────┘
```

##### Score Distribution Chart

Bar chart (Recharts) showing how scores are distributed across ranges.

```text
Score Distribution  ⓘ
│ ██
│ ██ ██
│ ██ ██ ██
│ ██ ██ ██ ██
└─────────────────
  0-25  25-50  50-75  75-100
  
  🟢 75-100  🟡 50-75  🔴 25-50  ⬛ 0-25
```

**Tooltip**: _"Shows how student scores are distributed across mark ranges."_

##### Difficulty-wise Performance (`DifficultyChart`)

Accuracy breakdown by question difficulty:

| Difficulty | Calculation |
|-----------|-------------|
| Easy | Average success rate of easy questions |
| Medium | Average success rate of medium questions |
| Hard | Average success rate of hard questions |

##### Cognitive Type Performance (`CognitiveChart`)

Accuracy by cognitive classification:

| Type | Description |
|------|-------------|
| Logical | Reasoning-based |
| Analytical | Data interpretation |
| Conceptual | Understanding-based |
| Numerical | Calculation-heavy |
| Application | Real-world problems |
| Memory | Recall-based |

Each question is tagged with a `cognitiveType` in the exam data.

---

#### 2c. Questions Tab

Questions grouped into **4 accuracy bands** using a collapsible accordion.

```text
┌─────────────────────────────────────────────────────────┐
│ ✗ Needs Reteaching                         [3 questions]│
│   ▼ (expanded by default — worst bands open first)      │
│   ┌─────────────────────────────────────────────────┐   │
│   │ Q3: Calculate the displacement when a...        │   │
│   │    [Kinematics] [Hard]  28% success (7/25)      │   │
│   │    [View Question ▼]                             │   │
│   │    A) 10 m    B) 15 m ✓    C) 20 m    D) 25 m  │   │
│   └─────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│ ⚠ Review Recommended                      [4 questions]│
│   ▼ (expanded)                                          │
├─────────────────────────────────────────────────────────┤
│ ℹ Satisfactory                             [5 questions]│
│   ▶ (collapsed)                                         │
├─────────────────────────────────────────────────────────┤
│ ✓ Well Understood                          [8 questions]│
│   ▶ (collapsed)                                         │
└─────────────────────────────────────────────────────────┘
```

##### Question Accuracy Bands

| Band | Success Rate Range | Color | Icon | Default State |
|------|-------------------|-------|------|---------------|
| Needs Reteaching | < 35% | Red | `XCircle` | **Expanded** |
| Review Recommended | 35–49% | Amber | `AlertTriangle` | **Expanded** |
| Satisfactory | 50–74% | Teal | `AlertCircle` | Collapsed |
| Well Understood | ≥ 75% | Emerald | `CheckCircle` | Collapsed |

> Bands open from worst to best — the 2 worst non-empty bands are expanded by default.

##### Question Analysis Card

Each question card displays:
- Truncated question text (expandable via "View Question")
- Topic badge
- Difficulty badge
- Success rate with color coding
- Attempt breakdown: `correct / incorrect / unattempted`
- When expanded: full question text with options, correct answer highlighted in emerald

Questions within each band are sorted by success rate (ascending — worst first).

---

#### 2d. Students Tab

Flat list of all students with their exam results:

```text
All Students
┌─────────────────────────────────────────────────────────┐
│ Aarav Sharma     R2024001    72/80  90%    ⏱ 42min  #1 │
├─────────────────────────────────────────────────────────┤
│ Priya Patel      R2024002    65/80  81%    ⏱ 38min  #2 │
├─────────────────────────────────────────────────────────┤
│ ...                                                      │
└─────────────────────────────────────────────────────────┘
```

**Student Row Data:**
| Field | Description |
|-------|-------------|
| `studentName` | Full name |
| `rollNumber` | Roll number |
| `score / maxScore` | Raw score |
| `percentage` | Percentage |
| `timeTaken` | Minutes taken |
| `rank` | Class rank |

---

### 3. Generate Homework (from Exam Results)

The "Generate Homework" button in the Exam Results header opens `CreateHomeworkDialog` with pre-filled context:

| Pre-filled Field | Source |
|-----------------|--------|
| `subject` | Exam's subject |
| `batchId` | Currently selected batch |
| `batchName` | Batch display name |
| `chapter` | Exam name |
| `topic` | Comma-separated list of **weak topics** (success rate < 50%) |

This allows the teacher to generate targeted homework addressing specific weaknesses identified in the exam.

---

### 4. Institute Test Detail Page

**Route**: `/teacher/reports/:batchId/institute-test/:testId`

A separate page for grand test analysis, **filtered to the teacher's subject only**.

#### Summary Cards

```text
┌──────────┬──────────┬──────────┬──────────┐
│ 42/100   │ 85/100   │ 30       │ 1,200    │
│ Avg Score│ Highest  │ Questions│Particip. │
└──────────┴──────────┴──────────┴──────────┘

[JEE Main] [Physics]  20 Jan 2025  [65% pass]
```

#### Three Tabs

| Tab | Component | Content |
|-----|-----------|---------|
| Questions | `InstituteQuestionsTab` | Per-question analysis: correct %, attempt %, average time, difficulty |
| Chapters | `InstituteChaptersTab` | Chapter-wise breakdown with expandable question lists |
| Difficulty | `InstituteDifficultyTab` | Performance split by Easy/Medium/Hard |

**Key difference from My Exams results**: Institute tests show only the teacher's subject, use violet color scheme, include participant count (not batch students), and have a chapters tab instead of insights/analytics.

---

## Data Flow

```text
Batch Report → Exams Tab
│
├── My Exams (source: teacherExams → filtered by batchId + completed)
│   └── Exam Card (click)
│       └── Exam Results (/teacher/reports/:batchId/exams/:examId)
│           ├── BatchSelector (multi-batch exams)
│           ├── Insights: VerdictBanner + PerformanceBands + TopicFlags + InsightCards
│           ├── Analytics: AIAnalysisCard + ScoreDistribution + DifficultyChart + CognitiveChart
│           ├── Questions: QuestionGroupAccordion (4 bands)
│           ├── Students: StudentResultRow list
│           └── Generate Homework → CreateHomeworkDialog (weak topics pre-filled)
│
└── Institute Tests (source: mockGrandTests → filtered by teacher's subject + completed)
    └── Institute Test Card (click)
        └── Institute Test Detail (/teacher/reports/:batchId/institute-test/:testId)
            ├── Summary Cards (subject-specific scores)
            ├── Questions: InstituteQuestionsTab
            ├── Chapters: InstituteChaptersTab
            └── Difficulty: InstituteDifficultyTab
```

### Data Sources

| Data | Source File | Key Functions |
|------|------------|---------------|
| Exam list | `reportsData.ts` | `getBatchExamHistory()` |
| Institute tests | `reportsData.ts` | `getBatchInstituteTests()` |
| Exam analytics | `examResults.ts` | `generateExamAnalyticsForBatch()` |
| Performance bands | `examResults.ts` | `computePerformanceBands()` |
| Topic flags | `examResults.ts` | `computeTopicFlags()` |
| Verdict | `examResults.ts` | `generateVerdictSummary()` |
| Institute detail | `instituteTestDetailData.ts` | `getInstituteTestDetail()` |

---

## Business Rules

1. **My Exams**: Only shows exams created by the teacher that are `completed` and assigned to the current batch
2. **Institute Tests**: Shows grand tests containing the teacher's subject — the teacher sees only their subject's metrics
3. **Batch context**: URL parameter `?batch=` preserves batch selection; URL path `/:batchId/` provides initial context
4. **`returnTo` parameter**: When arriving from a Chapter Report's Exam Breakdown, breadcrumbs include a "Chapter" link back
5. **Pagination**: 10 exams per page for My Exams; Institute Tests show all (typically fewer)
6. **Date filters**: All Time, 30 days, 3 months, 6 months — resets to page 1 when changed
7. **Question accuracy bands differ from student bands**: Questions use <35/35-49/50-74/≥75; Students use the same thresholds but labeled differently
8. **Worst bands open first**: In the Questions accordion, the 2 worst non-empty bands are expanded by default
9. **Generate Homework pre-fills weak topics**: Only topics with success rate < 50% are included in the pre-fill
10. **AI Analysis**: The "Analyze Results" button calls an edge function for on-demand AI-generated insights — not pre-computed

---

## Mobile Behavior

- **Source toggle**: Horizontally scrollable pills with `scrollbar-hide`
- **Date filters**: Horizontally scrollable row
- **Exam cards**: Full-width with 3-column stats grid
- **Tabs**: 4-column grid on mobile (compact text)
- **Verdict Banner**: Full-width, insight pills wrap naturally
- **Charts**: Responsive height (250px mobile, 300px desktop) via `ResponsiveContainer`
- **Question cards**: Stack to single column on mobile
- **Header actions**: Icon-only on mobile (labels hidden via `sm:inline`)
- **Bottom padding**: `pb-20` for mobile bottom nav

---

## Related Documentation

- [Reports — Chapters](./reports-chapters.md) — Chapter drill-down and practice generation
- [Reports — Students](./reports-students.md) — Student profile and Generate Homework
- [Teacher Exams](./exams.md) — Exam creation and management
- [Homework & AI Generation](./homework.md) — Homework system and AI generation
- [Exam Flow](../05-cross-login-flows/exam-flow.md) — Cross-login exam lifecycle

---

*Last Updated: February 2026*
