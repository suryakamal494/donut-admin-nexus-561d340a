# Reports — Chapters Tab

> Chapter-wise performance analytics with topic heatmaps, student bucketing, practice generation, and exam-wise breakdown.

---

## Overview

The **Chapters** tab within the Batch Report provides a comprehensive, chapter-by-chapter view of how students are performing across all exams that tested a given chapter. Each chapter card drills down into a detailed Chapter Report page containing topic-level heatmaps, PI-based student buckets, practice assignment history, and exam-wise breakdown.

### Reports Landing Page

Before reaching the Chapters tab, the teacher lands on the **Reports Landing Page** (`/teacher/reports`), which displays a batch selection grid. This is the entry point to the entire Reports module.

**Route**: `/teacher/reports`
**Component**: `Reports.tsx`

```text
┌─────────────────────────────────────────────────────────┐
│  Class 10 — 10A           [↑ 3%]              [62%]    │
│  35 students · 12 exams · 62% avg · 3 at risk          │
├─────────────────────────────────────────────────────────┤
│  Class 10 — 10B           [↓ 2%]              [48%]    │
│  32 students · 10 exams · 48% avg · 5 at risk          │
├─────────────────────────────────────────────────────────┤
│  Class 9 — 9A             [→ Stable]          [71%]    │
│  30 students · 8 exams · 71% avg · 1 at risk           │
└─────────────────────────────────────────────────────────┘
```

**Batch Card Data Points:**

| Field | Description | Source |
|-------|-------------|--------|
| `className` | Class name (e.g., "Class 10") | Batch definition |
| `batchName` | Batch identifier (e.g., "10A") | Batch definition |
| `totalStudents` | Number of students in the batch | Batch data |
| `classAverage` | Overall class average percentage | Computed across all exams |
| `previousAverage` | Previous period average (for trend) | Historical data |
| `trend` | `up` / `down` / `stable` | Comparison of `classAverage` vs `previousAverage` |
| `atRiskCount` | Students with PI in "Foundational Risk" band | PI computation |
| `totalExamsConducted` | Number of completed exams | Exam count |

**Card Visual Styling:**

| Element | Rule |
|---------|------|
| Header strip | Teal-to-cyan gradient (`from-teal-500 to-cyan-500`) |
| Average badge BG | Emerald gradient (≥65%), Amber gradient (≥40%), Red gradient (<40%) |
| Trend pill | Emerald bg (up), Red bg (down), Muted bg (stable) |
| At-risk count color | Red (>3), Amber (1–3), Emerald (0) |

**Inline stats row**: `{totalExamsConducted} exams · {classAverage}% avg · {atRiskCount} at risk`

**Navigation**: Clicking a batch card navigates to `/teacher/reports/:batchId`, which opens the Batch Report with Chapters, Exams, and Students tabs.

**Empty State**: Shows `Users` icon with message _"No batches found"_ and helper text _"Reports will appear once exams are conducted for your batches."_

**Animation**: Cards use staggered `framer-motion` fade-in (`opacity: 0→1, y: 16→0`) with 80ms delay per card.

---

## Access

- **Route (Reports Landing)**: `/teacher/reports`
- **Route (Chapters listing)**: `/teacher/reports/:batchId` → Chapters tab
- **Route (Chapter Report)**: `/teacher/reports/:batchId/chapters/:chapterId`
- **Route (Generate Practice)**: `/teacher/reports/:batchId/chapters/:chapterId/practice`
- **Route (Practice Session Detail)**: `/teacher/reports/:batchId/chapters/:chapterId/practice/:sessionId`
- **Login Types**: Teacher
- **Permissions Required**: Teacher account with assigned batches

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| `ChaptersTab` | Chapter listing with status badges | Batch Report → Chapters tab |
| `ChapterOverviewBanner` | Color-coded success rate banner | Chapter Report → Top |
| `TopicHeatmapGrid` | 4-tier color-coded topic grid | Chapter Report → Below banner |
| `StudentBuckets` | Expandable PI-based student bands | Chapter Report → Below heatmap |
| `ChapterPracticeHistory` | Chronological practice session log | Chapter Report → Below buckets |
| `ChapterExamBreakdown` | List of exams testing this chapter | Chapter Report → Bottom |
| `ChapterPracticeReview` | 3-step practice generation wizard | Separate full page |
| `PracticeSessionDetail` | Per-session analytics with band/student/question breakdown | Separate full page |

---

## Features & Functionality

### 1. Chapters Listing

Each chapter is displayed as a clickable card showing aggregated performance data across all exams.

```text
┌─────────────────────────────────────────────────────────┐
│  ┌──────┐                                               │
│  │ 62%  │  Kinematics                      [Moderate]   │
│  └──────┘  5 topics · 3 exams · 2 weak                  │
│                                                    ▶    │
└─────────────────────────────────────────────────────────┘
```

**Card Data Points:**
| Field | Description | Source |
|-------|-------------|--------|
| `avgSuccessRate` | Average success rate across all exams for this chapter | Computed from topic averages |
| `status` | Strong (≥75%), Moderate (50–74%), Weak (<50%) | Derived from `avgSuccessRate` |
| `topicCount` | Number of topics in the chapter | Chapter definition |
| `examsCovering` | Number of completed exams that included questions from this chapter | Exam-chapter mapping |
| `weakTopicCount` | Topics with success rate < 40% | Topic-level aggregation |

**Status Badge Colors:**
| Status | Badge Color | Percentage Icon BG |
|--------|-------------|-------------------|
| Strong | Emerald | `bg-emerald-500` |
| Moderate | Amber | `bg-amber-500` |
| Weak | Red | `bg-red-500` |

---

### 2. Chapter Report Page

Accessed by clicking any chapter card. Displays five sections in order:

#### 2a. Overview Banner (`ChapterOverviewBanner`)

A full-width gradient banner showing the chapter's headline metrics.

```text
┌─────────────────────────────────────────────────────────┐
│  Kinematics                              [3 exams]      │
│                                                          │
│  62%                                                     │
│  Overall success rate · 47 questions asked              │
└─────────────────────────────────────────────────────────┘
```

**Gradient Selection (based on `overallSuccessRate`):**
| Range | Gradient |
|-------|----------|
| ≥ 75% | `emerald-500 → teal-500` |
| ≥ 50% | `teal-500 → cyan-500` |
| ≥ 35% | `amber-500 → orange-500` |
| < 35% | `red-500 → rose-500` |

---

#### 2b. Topic Heatmap Grid (`TopicHeatmapGrid`)

A responsive grid (2 cols mobile, 3 cols tablet, 4 cols desktop) showing per-topic performance.

```text
Topic Heatmap  ⓘ
┌──────────────┬──────────────┬──────────────┬──────────────┐
│   ✓          │   ⚠          │   ✗          │   !          │
│ Displacement │  Velocity    │ Acceleration │ Projectile   │
│    78%       │    55%       │    32%       │    41%       │
│ 5 Qs · 2 ex │ 3 Qs · 1 ex │ 8 Qs · 3 ex │ 4 Qs · 2 ex │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

**Tooltip**: _"Each percentage shows the average success rate — the % of students who answered questions on this topic correctly across all exams."_

**4-Tier Color Standard (used throughout the platform):**

| Tier | Range | Color | Icon | Meaning |
|------|-------|-------|------|---------|
| 1 | ≥ 75% | Emerald | `CheckCircle` | Strong — well understood |
| 2 | ≥ 50% | Teal (via `AlertCircle`) | `AlertCircle` | Moderate — needs reinforcement |
| 3 | ≥ 35% | Amber | `AlertTriangle` | Needs attention |
| 4 | < 35% | Red | `XCircle` | Weak — needs reteaching |

**Data per topic:**
- `topicName` — Name of the topic
- `questionsAsked` — Total questions asked across all exams
- `avgSuccessRate` — % of students who answered correctly (averaged across exams)
- `examsAppeared` — Number of exams that included this topic
- `status` — Strong (≥65%), Moderate (40–64%), Weak (<40%)

> **Note on topic status thresholds vs. color tiers**: Topic `status` uses 65/40 thresholds for labeling, while the visual color function (`getPerformanceColor`) uses 75/50/35 tiers. Both are deliberate — status is for semantic labels, colors are for visual severity.

---

#### 2c. Student Performance Buckets (`StudentBuckets`)

Students are grouped into four persistent bands based on a composite **Performance Index (PI)**, not raw averages.

```text
Student Performance Buckets  ⓘ                    [✨ Generate Practice]
┌─────────────────────────────────────────────────────────────────────┐
│ 🟢 Mastery Ready                                              [5]  │
│   ▼ (expanded)                                                      │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │ Aarav Sharma  ↑  [Improving]              82%  (3 exams)   │   │
│   │ R101                                                        │   │
│   ├─────────────────────────────────────────────────────────────┤   │
│   │ Priya Patel   →                            78%  (2 exams)   │   │
│   │ R102                                                        │   │
│   └─────────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────┤
│ 🔵 Stable Progress                                            [8]  │
│   ▶ (collapsed)                                                     │
├─────────────────────────────────────────────────────────────────────┤
│ 🟡 Reinforcement Needed                                       [4]  │
│   ▼ (expanded by default)                                           │
│   ...student rows...                                                │
├─────────────────────────────────────────────────────────────────────┤
│ 🔴 Foundational Risk                                          [3]  │
│   ▼ (expanded by default)                                           │
│   ...student rows...                                                │
└─────────────────────────────────────────────────────────────────────┘
```

**Tooltip**: _"Students are grouped into bands based on a composite performance score across all exams for this chapter, factoring in accuracy, consistency, time efficiency, and attempt rate."_

##### Performance Index (PI) Formula

```
PI = (0.50 × Accuracy) + (0.20 × Consistency) + (0.15 × TimeEfficiency) + (0.15 × AttemptRate)
```

| Component | Weight | Calculation |
|-----------|--------|-------------|
| **Accuracy** | 50% | Average percentage across all exams for this chapter |
| **Consistency** | 20% | Inverse of standard deviation: `max(0, 100 - (stddev / 30) × 100)`. Low variance = high consistency. Single exam defaults to 75. |
| **Time Efficiency** | 15% | Average of per-exam time efficiency scores (0–100) |
| **Attempt Rate** | 15% | Average of per-exam attempt rates (0–100) |

##### Band Thresholds

| Band | PI Range | Color | Default State |
|------|----------|-------|---------------|
| Mastery Ready | PI ≥ 75 | Emerald | Collapsed |
| Stable Progress | 50 ≤ PI < 75 | Teal | Collapsed |
| Reinforcement Needed | 35 ≤ PI < 50 | Amber | **Expanded** |
| Foundational Risk | PI < 35 | Red | **Expanded** |

> **Important**: All 4 bands are always visible, even if empty (shown with "No students in this band" message and reduced opacity). This ensures the teacher always sees the full picture.

##### Displayed Student Data

| Field | Description | Visibility |
|-------|-------------|------------|
| `studentName` | Full name | Always |
| `rollNumber` | Roll number (e.g., R101) | Always |
| `avgPercentage` | Average exam percentage (**not PI**) | Displayed as main metric |
| `performanceIndex` | PI score | **Hidden** — used only for bucketing & sorting |
| `examsAttempted` | Number of exams | Always |
| `trend` | ↑ up / ↓ down / → flat | Icon next to name |
| `secondaryTags` | Behavioral tags (max 2) | Badges below name |

##### Trend Detection (Linear Regression)

```
slope = linear regression slope across exam percentages (chronological order)
```

| Slope | Trend | Icon |
|-------|-------|------|
| > 2 per exam | Up (improving) | `TrendingUp` (emerald) |
| < -2 per exam | Down (declining) | `TrendingDown` (red) |
| -2 to 2 | Flat (stable) | `Minus` (muted) |

##### Secondary Behavioral Tags

| Tag | Condition | Badge Color |
|-----|-----------|-------------|
| `improving` | Trend = up, 2+ exams | Emerald |
| `declining` | Trend = down, 2+ exams | Red |
| `plateaued` | 3+ exams, stddev < 5, slope < 1.5 | Gray |
| `inconsistent` | 3+ exams, stddev > 15 | Orange |
| `speed-issue` | Avg time efficiency < 40 | Purple |
| `low-attempt` | Avg attempt rate < 60 | Rose |

> Maximum 2 tags per student. Tags are assigned in order of priority and truncated.

##### "Generate Practice" Button

Placed in the card header:
- **Mobile**: Icon-only `Sparkles` button (8×8 px)
- **Desktop**: Full "Generate Practice" button with `Sparkles` icon

Clicking navigates to `/teacher/reports/:batchId/chapters/:chapterId/practice`.

---

#### 2d. Practice History (`ChapterPracticeHistory`)

A chronological log of all practice assignments generated for this chapter-batch combination.

```text
Practice History (3)
┌─────────────────────────────────────────────────────────┐
│  15 Jan 2025       25 questions                         │
│  🟢🔵🟡🔴  85% completed   Avg accuracy: 62%      ▶   │
├─────────────────────────────────────────────────────────┤
│  08 Jan 2025       20 questions                         │
│  🟢🔵🟡🔴  70% completed   Avg accuracy: 55%      ▶   │
├─────────────────────────────────────────────────────────┤
│  01 Jan 2025       20 questions                         │
│  🟢🔵🟡🔴  92% completed   Avg accuracy: 58%      ▶   │
└─────────────────────────────────────────────────────────┘
```

**Row Data:**
- Date (formatted as `dd MMM yyyy` in `en-IN` locale)
- Total question count (sum across all bands)
- Band indicator dots (color-coded circles for each band)
- Completion percentage (`completedCount / studentsAssigned` across all bands)
- Average accuracy (mean of per-band `avgAccuracy`)

**Clicking a row** navigates to the Practice Session Detail page.

**Empty State**: Shows FileText icon with message _"No practice sessions yet"_ and helper text _"Generate practice from the Student Performance section above"_.

---

#### 2e. Exam-wise Breakdown (`ChapterExamBreakdown`)

Lists every exam that included questions from this chapter.

```text
Exam-wise Breakdown  ⓘ
┌─────────────────────────────────────────────────────────┐
│  Kinematics Unit Test                          [72%]    │
│  📅 15 Jan 2025 · 5 Qs from this chapter               │
├─────────────────────────────────────────────────────────┤
│  Motion Mid-Term                               [45%]    │
│  📅 08 Jan 2025 · 3 Qs from this chapter               │
├─────────────────────────────────────────────────────────┤
│  Weekly Quiz #4                                [58%]    │
│  📅 01 Jan 2025 · 2 Qs from this chapter               │
├─────────────────────────────────────────────────────────┤
│         [View all 6 exams]                              │
└─────────────────────────────────────────────────────────┘
```

**Tooltip**: _"Shows how this chapter was tested across different exams. Click any exam to view its full results."_

**Features:**
- Initial display: 3 exams (scalability pattern)
- "View all X exams" toggle to expand
- Color-coded success rate badge (emerald ≥65%, amber ≥40%, red <40%)
- **Clicking an exam** navigates to `/teacher/reports/:batchId/exams/:examId?returnTo=<currentPath>` — preserves context so the back button returns to this chapter report

---

### 3. Practice Generation Flow (`ChapterPracticeReview`)

Accessed via the "Generate Practice" button. A full-page, 3-step wizard.

**Route**: `/teacher/reports/:batchId/chapters/:chapterId/practice`

#### Step 1: Configure

```text
┌─────────────────────────────────────────────────────────┐
│  Performance Bands                                       │
│  🟢 Mastery Ready [5 students]                          │
│  🔵 Stable Progress [8 students]                        │
│  🟡 Reinforcement Needed [4 students]                   │
│  🔴 Foundational Risk [3 students]                      │
│  Total: 20 students across 4 bands                      │
├─────────────────────────────────────────────────────────┤
│  Questions per Band                                      │
│  ○ 5 questions    ● 10 questions                        │
│  Will generate 40 questions total (10 × 4 bands)        │
├─────────────────────────────────────────────────────────┤
│  Instructions (Optional)                                 │
│  Common instructions: [__________________________]      │
│                                                          │
│  Per-band overrides:                                     │
│  ▶ Mastery Ready                                        │
│  ▶ Stable Progress                                      │
│  ▶ Reinforcement Needed                                 │
│  ▶ Foundational Risk                                    │
├─────────────────────────────────────────────────────────┤
│  [✨ Generate 40 Questions]                              │
└─────────────────────────────────────────────────────────┘
```

**Configuration Options:**
| Option | Values | Default |
|--------|--------|---------|
| Questions per band | 5 or 10 | 5 |
| Common instructions | Free text | Empty |
| Per-band overrides | Free text per band (expandable) | Empty |

**Only bands with students (count > 0) are included** in the generation.

##### AI Prompt Context per Band

Each band sends contextual instructions to the AI based on topic performance:

| Band | Context Strategy |
|------|-----------------|
| **Mastery** | _"Challenge with advanced/application-based questions. Strong topics: [list]"_ |
| **Stable** | _"Good understanding, needs reinforcement. Focus: [moderate topics]"_ |
| **Reinforcement** | _"Needs practice on fundamentals. Weak in: [weak + moderate topics]. Use easy-to-medium difficulty."_ |
| **Risk** | _"At risk — foundational gaps. Weak in: [weak topics]. Generate easy conceptual questions."_ |

##### Edge Function Payload

```json
{
  "chapter": "Kinematics",
  "subject": "Physics",
  "bands": [
    {
      "key": "mastery",
      "label": "Mastery Ready",
      "studentCount": 5,
      "questionCount": 10,
      "instructions": "Common instruction. Band-specific override.",
      "context": "Strong in all topics. Challenge with advanced..."
    }
  ],
  "topics": [
    { "name": "Displacement", "status": "strong", "avgSuccessRate": 78 },
    { "name": "Acceleration", "status": "weak", "avgSuccessRate": 32 }
  ]
}
```

#### Step 2: Review

Tabbed interface with one tab per band. Each tab shows generated MCQ questions with options.

```text
┌─────────────────────────────────────────────────────────┐
│  [← Back to Configure]              [Assign All Bands]  │
│                                                          │
│  [🟢 Mastery (10)] [🔵 Stable (9)] [🟡 Reinf. (10)]   │
│                                                          │
│  Q1. A particle moves with velocity v = 3t²...          │
│      A) 8 m/s²                                          │
│      B) 10 m/s²  ✓ (correct)                            │
│      C) 12 m/s²                                          │
│      D) 14 m/s²                                          │
│      [Medium] [Displacement]                    [✗ Remove]│
│                                                          │
│  Q2. ...                                                 │
│                                                          │
│  [📤 Assign to 5 students]                               │
└─────────────────────────────────────────────────────────┘
```

**Review Features:**
- Remove individual questions (click ✗ to remove — removed questions are hidden from view)
- **Regenerate**: When questions are removed, a sticky amber banner appears showing _"{N} question(s) removed across bands"_ with a **"Regenerate {N}"** button. Clicking it replaces all removed questions with fresh AI-generated replacements (via `getReplacementQuestions()`). A toast confirms _"Regenerated {N} questions successfully"_. This is distinct from restoring — regeneration fetches entirely new questions.
- Per-band "Assign to X students" button
- "Assign All Bands" bulk action
- Tab shows active question count (excluding removed)
- Removed count shown in tab as red `-{count}` indicator
- Assigned bands show ✓ and become read-only with reduced opacity

#### Step 3: Done

Success state with summary. Teacher can navigate back to the chapter report.

```text
┌─────────────────────────────────────────────────────────┐
│  ✅ Practice Assigned Successfully!                      │
│                                                          │
│  40 questions assigned to 20 students across 4 bands.    │
│                                                          │
│  Students will see the practice in their homework.       │
│                                                          │
│  [← Back to Chapter Report]                              │
└─────────────────────────────────────────────────────────┘
```

---

### 4. Practice Session Detail (`PracticeSessionDetail`)

**Route**: `/teacher/reports/:batchId/chapters/:chapterId/practice/:sessionId`

Accessed by clicking a practice history row. Provides comprehensive analytics for a completed practice session.

#### 4a. Overview Stats

```text
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ 👥 Total     │ ✅ Completion│ 🎯 Avg       │ 📖 Questions │
│ Students     │              │ Accuracy     │              │
│    20        │    85%       │    62%       │    40        │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

Stats use accent color (emerald) when completion ≥ 70% or accuracy ≥ 60%.

#### 4b. Band Performance Cards

A 2-column grid (1 col on mobile) with one card per band.

```text
┌──────────────────────────────┬──────────────────────────────┐
│ 🟢 Mastery Ready     [10 Q] │ 🔵 Stable Progress   [10 Q] │
│                              │                              │
│ Students: 5/5                │ Students: 7/8                │
│ Avg Accuracy: 78%            │ Avg Accuracy: 62%            │
│                              │                              │
│ Completion ████████░░ 100%   │ Completion ███████░░░ 87%    │
└──────────────────────────────┴──────────────────────────────┘
┌──────────────────────────────┬──────────────────────────────┐
│ 🟡 Reinforcement     [5 Q]  │ 🔴 Foundational Risk [5 Q]  │
│                              │                              │
│ Students: 3/4                │ Students: 2/3                │
│ Avg Accuracy: 48%            │ Avg Accuracy: 35%            │
│                              │                              │
│ Completion ██████░░░░ 75%    │ Completion █████░░░░░ 67%    │
└──────────────────────────────┴──────────────────────────────┘
```

**Card Data:**
- Band label and color
- Question count badge
- Students completed / assigned
- Average accuracy (color-coded using 4-tier standard)
- Completion progress bar

#### 4c. Tabbed Detail Section

Two tabs: **Students** (default) and **Questions**.

##### Students Tab

Accordion per band (all expanded by default). Each student row shows:

```text
🟢 Mastery Ready                              [5/5 completed]
┌─────────────────────────────────────────────────────────┐
│ ✅ Aarav Sharma        8/10  82%               ⏱ 12m   │
│    R101                                                  │
├─────────────────────────────────────────────────────────┤
│ ✅ Priya Patel         7/10  70%               ⏱ 15m   │
│    R102                                                  │
├─────────────────────────────────────────────────────────┤
│ ❌ Vikram Reddy                           [Pending]      │
│    R105                                                  │
└─────────────────────────────────────────────────────────┘
```

| Field | Description |
|-------|-------------|
| Completion icon | ✅ `CircleCheck` (emerald) or ❌ `CircleX` (muted) |
| Name + Roll | Student identification |
| Score | `score/maxScore` (only if completed) |
| Accuracy | Percentage with color coding (only if completed) |
| Time taken | Minutes (hidden on mobile, only if completed) |
| Pending badge | Shown for incomplete students |

##### Questions Tab

Grouped by band using collapsible accordions (default expanded). Each question is rendered as a bordered `QuestionCard` with visual indicators for performance.

```text
🟢 Mastery Ready (10 questions)
┌──────────────────────────────────────────────────────────┐
│ ┌──┐                                                     │
│ │Q1│ A particle moves along a straight line with...      │
│ └──┘ [Displacement] [Medium]              78% success    │
│                                           (4/5 correct)  │
│      [👁 View Solution]                                  │
│      ┌─────────────┬─────────────┐                       │
│      │ A. 8 m/s²   │ B. 10 m/s² ✓│  (emerald highlight) │
│      │ C. 12 m/s²  │ D. 14 m/s²  │                       │
│      └─────────────┴─────────────┘                       │
├──────────────────────────────────────────────────────────┤
│ ┌──┐                                                     │
│ │Q2│ Calculate the displacement when...    ⚠ LOW (28%)   │
│ └──┘ [Velocity] [Hard]                    28% success    │
│      (background tinted red)              (1/5 correct)  │
└──────────────────────────────────────────────────────────┘
```

**Question Card Data:**

| Field | Description |
|-------|-------------|
| Question number | Circular badge (e.g., `Q1`) with `bg-primary/10 text-primary` |
| Question text | Full text displayed |
| Topic badge | Outline variant |
| Difficulty badge | Secondary variant |
| Success rate | Color-coded percentage using `accuracyColor()` |
| Attempts | `correctAttempts / totalAttempts` |

**Visual Styling by Success Rate (left border + background):**

| Success Rate | Left Border Color | Background Tint |
|-------------|-------------------|-----------------|
| ≥ 75% | `border-l-emerald-500` | None |
| ≥ 50% | `border-l-teal-500` | None |
| ≥ 35% | `border-l-amber-500` | `bg-amber-500/5` |
| < 35% | `border-l-red-500` | `bg-red-500/5` (signals teacher attention needed) |

**"View Solution" Toggle:**
- Button with `Eye` icon, ghost variant, toggles solution visibility
- When expanded, shows a 2-column grid (1 col on mobile) of answer options
- **Correct answer**: Highlighted with `bg-emerald-500/10`, `border-emerald-500/40`, emerald text, bold font, and a `CheckCircle2` icon
- **Other options**: `bg-muted/30` with `border-border` and muted text
- Each option prefixed with label (A, B, C, D)

---

## Data Flow

```text
Reports Landing (/teacher/reports)
│
├── Batch Card (click)
│   └── Batch Report (/teacher/reports/:batchId)
│       └── Chapters Tab
│           └── Chapter Card (click)
│               └── Chapter Report (/teacher/reports/:batchId/chapters/:chapterId)
│                   │
│                   ├── Topic Heatmap Grid
│                   │   └── Source: ChapterTopicAnalysis[] from all exams
│                   │
│                   ├── Student Buckets
│                   │   ├── Source: ChapterStudentEntry[] + computeStudentPI()
│                   │   └── Action: "Generate Practice" → ChapterPracticeReview
│                   │
│                   ├── Practice History
│                   │   ├── Source: getPracticeHistory(chapterId, batchId)
│                   │   └── Action: Click row → PracticeSessionDetail
│                   │
│                   └── Exam-wise Breakdown
│                       ├── Source: ChapterExamBreakdown[] from teacherExams
│                       └── Action: Click exam → Exam Results (with returnTo)
```

### Data Sources

| Data | Source File | Generator |
|------|------------|-----------|
| Chapter list | `reportsData.ts` | `generateChapterReports()` |
| Chapter detail | `reportsData.ts` | `generateChapterDetail()` |
| Practice history | `practiceHistoryData.ts` | `generateSessions()` |
| Practice detail | `practiceSessionDetailData.ts` | `getPracticeSessionDetail()` |
| PI computation | `performanceIndex.ts` | `computeStudentPI()` |
| Color tiers | `reportColors.ts` | `getPerformanceColor()` |

### Caching Strategy

All data generators use `Map`-based caching keyed by `chapterId__batchId` (or `sessionId__chapterId__batchId`). This ensures:
- Stable data across page navigations and re-renders
- Deterministic percentages and analytics
- No flickering or changing values on refresh

---

## Business Rules

1. **Chapter scope**: Only chapters from the teacher's assigned subject (currently Physics) are shown
2. **Exam aggregation**: Only `completed` exams assigned to the current batch are included
3. **PI is hidden**: The Performance Index score is used for bucketing and sorting but **never displayed** to the teacher. The UI shows `avgPercentage` instead, reducing jargon.
4. **All 4 bands are always visible**: Even empty bands render with a disabled state — this prevents teachers from assuming categories don't exist
5. **Reinforcement and Risk bands default to expanded**: These are the actionable groups
6. **Practice generation requires non-empty bands**: Only bands with `count > 0` are included in the generation payload
7. **Question cap**: Maximum 10 questions per band in practice generation
8. **Exam breakdown uses `returnTo`**: URL parameter preserves navigation context when jumping to exam results
9. **Exam breakdown initial limit**: Shows 3 exams with "View all" toggle for scalability
10. **Topic status vs. color thresholds differ**: Topic `status` labels use 65/40 cutoffs; visual colors use 75/50/35 — both are intentional

---

## Mobile Behavior

- **Chapters listing**: Full-width cards with touch-friendly 44px minimum targets
- **Topic Heatmap**: 2-column grid (vs. 4 on desktop)
- **Student Buckets**: Full-width accordion, "Generate Practice" becomes icon-only `Sparkles` button
- **Practice History**: Compact rows with stacked layout
- **Practice Generation**: All steps are full-width, single-column
- **Practice Session Detail**: Stats grid becomes 2×2, band cards stack to single column
- **Exam Breakdown**: Full-width rows with truncated exam names
- **Bottom padding**: `pb-20` on mobile (for fixed bottom nav), `pb-6` on desktop

---

## Related Documentation

- [Reports — Exams](./reports-exams.md) — Exam results drill-down
- [Reports — Students](./reports-students.md) — Student profile and Generate Homework
- [Teacher Exams](./exams.md) — Exam creation and management
- [Homework & AI Generation](./homework.md) — Homework system
- [Exam Flow](../05-cross-login-flows/exam-flow.md) — Cross-login exam lifecycle

---

*Last Updated: February 2026*
