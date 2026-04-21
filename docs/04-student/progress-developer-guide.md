# Student Progress & Analytics — Developer Guide

> Comprehensive reference for every component, data source, and interaction in the Student Progress module (`/student/progress`).

---

## Table of Contents

1. [Module Overview](#1-module-overview)
2. [Data Layer](#2-data-layer)
3. [Phase 1: Overview Tab](#3-phase-1-overview-tab)
4. [Phase 2: Subjects Tab](#4-phase-2-subjects-tab)
5. [Phase 3: Exams Tab](#5-phase-3-exams-tab)
6. [Phase 4: Insights Tab](#6-phase-4-insights-tab)
7. [Shared Components](#7-shared-components)
8. [Cross-Tab Interactions](#8-cross-tab-interactions)
9. [Responsive Behavior](#9-responsive-behavior)

---

## 1. Module Overview

### Route & Entry Point

| Key | Value |
|-----|-------|
| **Route** | `/student/progress` |
| **Component** | `src/pages/student/Progress.tsx` |
| **Login** | Student |
| **Permissions** | Authenticated student account |

### Page Architecture

```text
┌─────────────────────────────────────────────────┐
│  Header (icon + "My Progress" + subtitle)       │
├─────────────────────────────────────────────────┤
│  SecondaryTagsPills (behavior tags)             │
├─────────────────────────────────────────────────┤
│  Tab Bar: [Overview] [Subjects] [Exams] [Insights] │
├─────────────────────────────────────────────────┤
│  Tab Content (AnimatePresence, mode="wait")     │
│  ┌────────────────┐  ┌────────────────┐         │
│  │  Left Column   │  │  Right Column  │  (lg)   │
│  └────────────────┘  └────────────────┘         │
└─────────────────────────────────────────────────┘
```

### Tab Keys

```typescript
type TabKey = "overview" | "subjects" | "exams" | "insights";
```

### Lazy Loading Strategy

Heavy charting/detail components are lazy-loaded to keep the initial bundle small:

| Component | Lazy | Reason |
|-----------|------|--------|
| `ProgressHeroCard` | No | Above-fold, always visible on Overview |
| `BatchStandingCard` | No | Above-fold, always visible on Overview |
| `SubjectOverviewGrid` | No | Used in both Overview and Subjects |
| `InsightBanner` | No | Small component |
| `SecondaryTagsPills` | No | Small component |
| `SubjectDeepDive` | **Yes** | Heavy drill-down, only on Subjects tab |
| `ExamHistoryTimeline` | **Yes** | Only on Exams tab |
| `ExamTrendChart` | **Yes** | Recharts LineChart |
| `PerExamStandingCard` | **Yes** | Only on Exams tab |
| `StreakCalendar` | **Yes** | Only on Insights tab |
| `SubjectRadarChart` | **Yes** | Recharts RadarChart |
| `WeeklyActivityChart` | **Yes** | Recharts BarChart |

All lazy components are wrapped in `<Suspense fallback={<CardSkeleton />}>`.

### State Management

```typescript
const [activeTab, setActiveTab] = useState<TabKey>("overview");
const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
```

- `activeTab` — controls which tab panel renders
- `selectedSubjectId` — when set, Subjects tab shows `SubjectDeepDive`; null shows grid
- `selectedExamId` — which exam is expanded in `PerExamStandingCard`; auto-set to latest on load

---

## 2. Data Layer

### Source File

`src/data/student/progressData.ts`

This is an **adapter layer** that wraps teacher-side data generators (`studentReportData.ts`, `reportsData.ts`) to produce student-facing analytics. All data is deterministic mock data using seeded PRNG from the teacher module.

### Caching

All exported functions use an in-memory `Map<string, unknown>` cache. Data is computed once per session and reused across re-renders and tab switches:

```typescript
const cache = new Map<string, unknown>();
function cached<T>(key: string, fn: () => T): T { ... }
```

### Constants

```typescript
const CURRENT_STUDENT_ID = "student-batch-10a-0"; // Aarav Sharma
const CURRENT_BATCH_ID = "batch-10a";
```

### Exported Functions

#### `getStudentOverview(): StudentOverview`

**Cache key:** `"overview"`

Returns the student's global analytics summary. Used by `ProgressHeroCard`, `BatchStandingCard`, and `SecondaryTagsPills`.

**Upstream calls:**
- `getStudentBatchProfile(CURRENT_STUDENT_ID, CURRENT_BATCH_ID)` — from teacher module
- `getBatchStudentRoster(CURRENT_BATCH_ID)` — for batch ranking

**Computation:**
1. Fetches the student's `StudentBatchProfile`
2. Fetches the full batch roster
3. Calls `computeBatchStanding()` to derive rank, percentile, batch average, topper accuracy
4. Computes `deltaFromAverage` = `overallAccuracy - batchAverage`
5. Computes `deltaFromTop` = `overallAccuracy - topperAccuracy`

**Interface:**
```typescript
interface StudentOverview {
  studentId: string;
  studentName: string;
  batchId: string;
  batchName: string;
  performanceIndex: number;   // PI score (0-100)
  overallAccuracy: number;    // % correct across all exams
  consistency: number;        // % consistency metric
  trend: Trend;               // "up" | "down" | "steady"
  secondaryTags: SecondaryTag[]; // behavior tags
  totalExams: number;
  totalQuestions: number;
  rank: number;               // within batch (1-based)
  totalStudents: number;      // batch size
  percentile: number;         // 0-100
  batchAverage: number;       // class avg accuracy %
  topperAccuracy: number;     // highest scorer's accuracy %
  deltaFromAverage: number;   // positive = above avg
  deltaFromTop: number;       // negative = below top
}
```

---

#### `getSubjectSummaries(): SubjectSummary[]`

**Cache key:** `"subjects"`

Returns an array of 8 subject summaries. Used by `SubjectOverviewGrid` and `SubjectRadarChart`.

**How it works:**
- Iterates over `SUBJECT_CONFIGS` (8 subjects)
- For each subject, calls `getStudentBatchProfile()` with a unique student ID to get varied data
- Counts strong/weak chapters from `chapterMastery`

**Interface:**
```typescript
interface SubjectSummary {
  subjectId: string;       // e.g. "physics"
  subjectName: string;     // e.g. "Physics"
  icon: string;            // Lucide icon name e.g. "Atom"
  color: string;           // hex color e.g. "#8B5CF6"
  performanceIndex: number;
  accuracy: number;        // overall subject accuracy %
  trend: Trend;
  chaptersTotal: number;
  chaptersStrong: number;  // status === "strong"
  chaptersWeak: number;    // status === "weak"
  weakTopicCount: number;  // count of weak topics
}
```

**Subject Config:**

| ID | Name | Icon | Color |
|----|------|------|-------|
| `physics` | Physics | Atom | `#8B5CF6` |
| `math` | Mathematics | Calculator | `#3B82F6` |
| `chemistry` | Chemistry | FlaskConical | `#10B981` |
| `biology` | Biology | Leaf | `#F59E0B` |
| `english` | English | BookOpen | `#EC4899` |
| `hindi` | Hindi | Languages | `#F97316` |
| `social-science` | Social Science | Globe | `#06B6D4` |
| `computer` | Computer Science | Laptop | `#6366F1` |

---

#### `getSubjectDetail(subjectId: string): SubjectDetail`

**Cache key:** `"subject-{subjectId}"`

Returns deep analytics for a single subject. Used by `SubjectDeepDive`.

**Interface:**
```typescript
interface SubjectDetail {
  profile: StudentBatchProfile;  // full profile with chapters, topics, exams
  insight: StudentAIInsight;     // AI-generated insight
  batchAverage: number;
  rank: number;
  totalStudents: number;
  percentile: number;
}
```

**Upstream:** `getStudentBatchProfile()`, `getBatchStudentRoster()`, `generateMockStudentInsight()`

---

#### `getExamsWithContext(): ExamWithContext[]`

**Cache key:** `"exams-context"`

Returns exam history enriched with batch-level context. Used by `ExamHistoryTimeline`, `PerExamStandingCard`, and `ExamTrendChart`.

**Interface:**
```typescript
interface ExamWithContext extends ExamHistoryItem {
  classAverage: number;      // class avg as %
  highestScore: number;      // topper score as %
  percentile: number;
  deltaFromAverage: number;  // your % - class avg %
  deltaFromTop: number;      // your % - topper %
}
```

**Inherited from `ExamHistoryItem`:**
```typescript
interface ExamHistoryItem {
  examId: string;
  examName: string;
  date: string;              // ISO date string
  score: number;             // raw score
  maxScore: number;          // max possible
  percentage: number;        // score/maxScore * 100
  rank: number;
  totalStudents: number;
  questionsAttempted: number;
  totalQuestions: number;
}
```

**Computation:**
1. Gets student profile exam history
2. Gets batch exam history for class-level data
3. Joins via `examId` using a pre-built Map for O(1) lookup
4. Computes `classAverage` and `highestScore` as percentages
5. Computes `percentile` = `(totalStudents - rank) / totalStudents * 100`

---

#### `getStudentInsight(): StudentAIInsight`

**Cache key:** `"insight"`

Returns AI-generated learning insight. Used by `InsightBanner`.

**Interface:**
```typescript
interface StudentAIInsight {
  summary: string;         // 1-2 sentence plain-language summary
  strengths: string[];     // list of strong areas
  priorities: string[];    // list of focus areas
}
```

---

#### `getDerivedStreakData(): DerivedStreak`

**Cache key:** `"streak"`

Derives study streak data from exam dates. Used by `StreakCalendar`.

**Interface:**
```typescript
interface DerivedStreak {
  currentStreak: number;   // consecutive active days ending today
  longestStreak: number;   // best streak ever
  activeDays: Date[];      // array of active Date objects this month
}
```

**Logic:**
- Extracts unique exam dates
- Iterates forward to find the longest consecutive-day sequence (with 2-day tolerance)
- Iterates backward from today to find current streak
- Floors: `currentStreak >= min(totalExams, 8)`, `longestStreak >= min(totalExams, 14)`
- `activeDays` = streak days this month + exam dates this month

---

#### `getDerivedWeeklyActivity(): { data, totalMinutes, averageMinutes }`

**Cache key:** `"weekly-activity"`

Generates synthetic weekly study time. Used by `WeeklyActivityChart`.

**Interface:**
```typescript
interface DerivedWeeklyActivity {
  day: string;       // "Mon", "Tue", etc.
  minutes: number;   // study minutes
  chapters: number;  // chapters studied
}

// Return type:
{
  data: DerivedWeeklyActivity[];  // 7 entries (Mon-Sun)
  totalMinutes: number;
  averageMinutes: number;         // totalMinutes / 7, rounded
}
```

**Computation:**
- Seed = `totalExams + round(overallAccuracy)`
- For each day: `minutes = 20 + ((seed * (i+1) * 7) % 60)`
- For each day: `chapters = 1 + ((seed * (i+2)) % 4)`

---

#### Conditional Data Loading (Memos in Progress.tsx)

Data is only computed when the relevant tab is active:

| Data | Computed When |
|------|--------------|
| `overview` | Always (cheap) |
| `subjects` | Always (used in Overview compact grid too) |
| `exams` | `activeTab === "overview"` or `"exams"` |
| `insight` | `activeTab === "insights"` |
| `streakData` | `activeTab === "insights"` |
| `weeklyActivity` | `activeTab === "overview"` or `"insights"` |
| `selectedSubjectDetail` | When `selectedSubjectId` is set |

---

## 3. Phase 1: Overview Tab

### Layout

```text
┌──────────────────────────────┬──────────────────────────────┐
│  ProgressHeroCard            │  ExamTrendChart              │
│  BatchStandingCard           │  WeeklyActivityChart         │
│  SubjectOverviewGrid (compact)│                             │
└──────────────────────────────┴──────────────────────────────┘
       Left Column (lg)               Right Column (lg)

Mobile: Single column, all stacked vertically
```

Grid: `grid grid-cols-1 lg:grid-cols-2 gap-4`

---

### 3.1 ProgressHeroCard

**File:** `src/components/student/progress/ProgressHeroCard.tsx`

**Purpose:** The hero card showing the student's overall Performance Index as an animated circular gauge, with key stats (name, batch, accuracy, consistency, trend, rank).

**Props:**
```typescript
interface ProgressHeroCardProps {
  data: StudentOverview;
}
```

**Visual Layout:**
```text
┌───────────────────────────────────────────────────┐
│  ┌─────────┐  Student Name                       │
│  │  72%    │  Batch 10-A                         │
│  │ Accuracy│  ┌──────────┐ ┌──────────┐          │
│  │  (SVG)  │  │ Accuracy │ │Consistency│          │
│  └─────────┘  │   72%    │ │   85%     │          │
│               └──────────┘ └──────────┘          │
│               ↑ Improving   🏅 #3 of 40          │
└───────────────────────────────────────────────────┘
```

**PI Gauge Implementation:**
- SVG circle with `r=52`, viewBox `0 0 120 120`, rotated `-90deg`
- `circumference = 2 * Math.PI * 52` ≈ 326.7
- `strokeDashoffset = circumference - (accuracy / 100) * circumference`
- Animated from full offset to computed offset over 1.5s

**PI Color Logic:**
| Accuracy Range | Color | Hex |
|---------------|-------|-----|
| ≥ 75% | Emerald | `#10B981` |
| ≥ 50% | Blue | `#3B82F6` |
| ≥ 35% | Amber | `#F59E0B` |
| < 35% | Red | `#EF4444` |

**Trend Display:**
| Trend Value | Icon | Color Class | Label |
|-------------|------|-------------|-------|
| `"up"` | `TrendingUp` | `text-emerald-500` | "Improving" |
| `"down"` | `TrendingDown` | `text-red-500` | "Declining" |
| `"steady"` | `Minus` | `text-amber-500` | "Steady" |

**Rank Pill:** Gradient background using `--donut-coral` and `--donut-orange` at 10% opacity.

---

### 3.2 BatchStandingCard

**File:** `src/components/student/progress/BatchStandingCard.tsx`

**Purpose:** Visual representation of where the student stands relative to the class average and topper, with a horizontal position bar and delta stats.

**Props:**
```typescript
interface BatchStandingCardProps {
  data: StudentOverview;
}
```

**Visual Layout:**
```text
┌───────────────────────────────────────────────────┐
│  👥 Batch Standing              [Above Average]   │
│                                                   │
│        Avg 60%              Top 85%               │
│  ──────┼────────────●────────┼──────  (bar)       │
│                     ↑ You                         │
│                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │   72%    │  │  +12%    │  │  -13%    │        │
│  │   You    │  │ vs Average│  │  vs Top  │        │
│  └──────────┘  └──────────┘  └──────────┘        │
└───────────────────────────────────────────────────┘
```

**Position Bar:**
- Height: `h-3`, background: `bg-muted/15`, rounded-full
- **Avg marker:** vertical line at `left: {batchAverage}%`, color `bg-muted-foreground/40`
- **Top marker:** vertical line at `left: {topperAccuracy}%`, color `bg-emerald-400`
- **Student marker:** animated circle (w-5, h-5) at `left: {overallAccuracy}%`
  - Gradient: `from-[hsl(var(--donut-coral))] to-[hsl(var(--donut-orange))]`
  - Animated from `left: 0%` to final position over 1s

**Status Label Logic:**
| Condition | Label | Color |
|-----------|-------|-------|
| `percentile >= 90` | "Top 10%" | emerald |
| `deltaFromAverage > 0` | "Above Average" | emerald |
| `abs(deltaFromAverage) <= 5` | "Near Average" | red |
| else | "Below Average" | red |

**Stats Row:** 3-column grid showing You / vs Average / vs Top.

**Delta Color:** `deltaFromAverage > 0` → `text-emerald-600`, else → `text-red-500`

---

### 3.3 SubjectOverviewGrid (Compact Mode)

**File:** `src/components/student/progress/SubjectOverviewGrid.tsx`

**Purpose:** Quick glance at all subjects. In compact mode (Overview tab), shows only icon + name + accuracy. In full mode (Subjects tab), shows trend, chapter progress, weak count.

**Props:**
```typescript
interface SubjectOverviewGridProps {
  subjects: SubjectSummary[];
  onSelect: (subjectId: string) => void;
  selectedId?: string;
  compact?: boolean;  // true on Overview tab
}
```

**Compact Mode Layout (per card):**
```text
┌─────────┐
│  [icon] │
│ Physics │
│  72%    │
└─────────┘
```

Grid: `grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2`

**Full Mode Layout (per card):**
```text
┌─────────────────────────┐
│ [icon] Physics      ↑   │
│ Chapters     5/8        │
│ ████████░░░░░░░░        │
│ 72%        ⚠ 3 weak    │
└─────────────────────────┘
```

Grid: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3`

**Accuracy Badge Color:**
| Range | Classes |
|-------|---------|
| ≥ 75% | `bg-emerald-100 text-emerald-700` |
| ≥ 50% | `bg-blue-100 text-blue-700` |
| ≥ 35% | `bg-amber-100 text-amber-700` |
| < 35% | `bg-red-100 text-red-700` |

**Icon Mapping:** Uses a local `iconMap` record mapping icon string names to Lucide components:
```typescript
const iconMap = { Atom, Calculator, FlaskConical, Leaf, BookOpen, Languages, Globe, Laptop };
```

**Selection State:** Selected card gets `border-[hsl(var(--donut-coral))]` and gradient background.

**Stagger Animation:** Each card delays by `0.04s * index` (compact) or `0.05s * index` (full).

---

### 3.4 ExamTrendChart

**File:** `src/components/student/progress/ExamTrendChart.tsx`

**Purpose:** Line chart showing the student's exam scores over time vs class average, with optional range selector for large datasets.

**Props:**
```typescript
interface ExamTrendChartProps {
  exams: ExamWithContext[];
}
```

**Visual Layout:**
```text
┌───────────────────────────────────────────────────┐
│  Score Trend                 [Last 20] [All]      │
│                                                   │
│  100 ┤                                            │
│   80 ┤     ●───●                                  │
│   60 ┤  ●──       ───●    (your score — solid)    │
│   40 ┤  - - - - - - - -   (class avg — dashed)    │
│    0 ┤                                            │
│      E1  E2  E3  E4  E5  E6                      │
│                                                   │
│  ── Your Score   - - Class Average                │
└───────────────────────────────────────────────────┘
```

**Range Selector:**
- Only shows when `exams.length > 20`
- Options: "Last 20", optionally "Last 50" (if > 50 exams), "All"
- Default: "Last 20" if > 30 exams, else "All"

**Chart Details:**
- Library: Recharts `LineChart`
- Y-axis domain: `[0, 100]`
- **Your Score line:** solid, `strokeWidth: 2.5`, color `hsl(var(--donut-coral))`
  - Dots shown if ≤ 30 data points (r=4, white stroke)
  - Active dot: r=6
- **Class Average line:** dashed (`strokeDasharray="4 4"`), `strokeWidth: 1.5`, muted color
  - No dots
- **Reference line:** horizontal dashed line at `avgOfAvgs` (mean of all class averages in view)
- **Tooltip:** Dark background, shows "You: X%" and "Class Avg: X%"
- X-axis labels: `E1, E2, E3...` (exam index)

**Data transformation:**
```typescript
const chartData = sliced.map((e, i) => ({
  name: `E${i + 1}`,
  you: e.percentage,
  avg: e.classAverage,
  top: e.highestScore,  // available but not plotted
}));
```

---

### 3.5 WeeklyActivityChart

**File:** `src/components/student/progress/WeeklyActivityChart.tsx`

**Purpose:** Bar chart showing daily study minutes for the current week, with total/average stats.

**Props:**
```typescript
interface WeeklyActivityChartProps {
  data: WeeklyData[];        // 7 entries (Mon-Sun)
  totalMinutes: number;
  averageMinutes: number;
}

interface WeeklyData {
  day: string;       // "Mon", "Tue", etc.
  minutes: number;
  chapters: number;
}
```

**Visual Layout:**
```text
┌───────────────────────────────────────────────────┐
│  Weekly Activity                     This week    │
│                                                   │
│  ┌──────────────┐  ┌──────────────┐               │
│  │  Total Time  │  │  Daily Avg   │               │
│  │  5h 15m      │  │  45m         │               │
│  └──────────────┘  └──────────────┘               │
│                                                   │
│  ▓▓  ▓▓  ██  ▓▓  ▓▓  ▓▓  ▓▓   (bar chart)      │
│  Mon Tue Wed Thu Fri Sat Sun                      │
│                                                   │
│  ■ Most active   ■ Study time                     │
└───────────────────────────────────────────────────┘
```

**Chart Details:**
- Library: Recharts `BarChart`
- Bar radius: `[6, 6, 0, 0]` (rounded top)
- Max bar size: 40px
- **Color logic:** The day with the highest minutes gets full `hsl(var(--donut-coral))`, all others get `hsl(var(--donut-coral) / 0.4)` (40% opacity)
- **Tooltip:** Shows day name, minutes, and chapters count
- Y-axis formatter: `{value}m`

**Stats Row:**
- Total Time: gradient background `from-[hsl(var(--donut-coral))]/10 to-[hsl(var(--donut-orange))]/10`
- Format: `{hours}h {remainingMinutes}m`
- Daily Avg: muted background, just `{averageMinutes}m`

---

## 4. Phase 2: Subjects Tab

### States

The Subjects tab has two states:

1. **Grid View** — when `selectedSubjectId === null`, shows `SubjectOverviewGrid` in full mode
2. **Deep Dive** — when a subject is selected, shows `SubjectDeepDive` with full analytics

### Layout (Grid View)

```text
┌───────────────────────────────────────────────────┐
│  SubjectOverviewGrid (full mode)                  │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                │
│  │Phys │ │Math │ │Chem │ │Bio  │                │
│  └─────┘ └─────┘ └─────┘ └─────┘                │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                │
│  │Eng  │ │Hindi│ │SST  │ │Comp │                │
│  └─────┘ └─────┘ └─────┘ └─────┘                │
│                                                   │
│  "Tap a subject to see detailed analytics"        │
└───────────────────────────────────────────────────┘
```

---

### 4.1 SubjectOverviewGrid (Full Mode)

Already documented in [3.3](#33-subjectoverviewgrid-compact-mode). In full mode (`compact=false`), each card shows:

- Subject icon + name + trend arrow
- Chapter progress bar: `chaptersStrong / chaptersTotal`
- Accuracy badge (color-coded)
- Weak topics count with warning icon, or "All clear"

Clicking a card sets `selectedSubjectId` and transitions to the Deep Dive.

---

### 4.2 SubjectDeepDive

**File:** `src/components/student/progress/SubjectDeepDive.tsx`

**Purpose:** Complete subject-level analytics with rank bar, chapter mastery, weak topics, and difficulty breakdown. This is the main drill-down view.

**Props:**
```typescript
interface SubjectDeepDiveProps {
  subjectName: string;       // display name e.g. "Physics"
  detail: SubjectDetail;     // from getSubjectDetail()
  onBack: () => void;        // resets selectedSubjectId to null
}
```

**Internal State:**
```typescript
const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
```

**Visual Layout:**
```text
┌───────────────────────────────────────────────────┐
│  ← Back to Overview                               │
│  Physics                                          │
│                                                   │
│        Avg 60%              Top 75%               │
│  ──────┼─────────●──────────┼────── (rank bar)    │
│                  ↑                                │
│                                                   │
│  72%    ↑     #3/40   +12%    -3%                │
│ Accuracy Trend  Rank  vs Avg  vs Top             │
│                                                   │
│  Class avg: 60%  •  Percentile: 82nd             │
└───────────────────────────────────────────────────┘
│                                                   │
│  ⚠ Focus Areas (WeakTopicsAlert)                 │
│  • Newton's Laws — 35%                           │
│  • Thermodynamics — 42%                          │
│                                                   │
│  Chapter Mastery (ChapterMasteryList)            │
│  ● Motion .................. 85% ↑               │
│  ● Forces .................. 62% →               │
│  ● Waves ................... 45% ↓               │
│                                                   │
│  Difficulty Performance (DifficultyBreakdown)    │
│  Easy   ████████████████████ 82%                 │
│  Medium ████████████░░░░░░░░ 65%                 │
│  Hard   ████████░░░░░░░░░░░░ 42%                 │
└───────────────────────────────────────────────────┘
```

**Header Rank Bar:** Same visual pattern as `BatchStandingCard` — horizontal bar with Avg/Top markers and animated student position circle.

**5-Column Stats Row:**
| Column | Value | Source |
|--------|-------|--------|
| Accuracy | `profile.overallAccuracy` | % |
| Trend | Icon + label | `profile.trend` |
| Rank | `#rank/totalStudents` | `detail.rank` |
| vs Avg | `+/-delta%` | `overallAccuracy - batchAverage` |
| vs Top | `-delta%` | `overallAccuracy - topperAccuracy` |

Note: `topperAccuracy` in SubjectDeepDive is computed as `min(100, batchAverage + 15)`, not from actual data.

**Computed values:**
```typescript
const deltaFromAvg = profile.overallAccuracy - batchAverage;
const topperAccuracy = Math.min(100, batchAverage + 15);
const deltaFromTop = profile.overallAccuracy - topperAccuracy;
```

---

### 4.3 WeakTopicsAlert

**File:** `src/components/student/progress/WeakTopicsAlert.tsx`

**Purpose:** Red-gradient alert card highlighting the student's weakest topics that need immediate attention.

**Props:**
```typescript
interface WeakTopicsAlertProps {
  topics: TopicDetail[];  // pre-sliced to max 5 in parent
}
```

**TopicDetail interface (from teacher module):**
```typescript
interface TopicDetail {
  topicName: string;
  chapterName: string;
  accuracy: number;        // 0-100
  questionsAsked: number;
  status: "strong" | "moderate" | "weak";
}
```

**Visual Layout:**
```text
┌───────────────────────────────────────────────────┐
│  ⚠ Focus Areas                                   │
│  These topics need your attention...             │
│                                                   │
│  Newton's Laws ...................... 35%         │
│  ████████████░░░░░░░░░░░░░░░░░░░░░░             │
│                                                   │
│  Thermodynamics ..................... 42%         │
│  ████████████████░░░░░░░░░░░░░░░░░░             │
│                                                   │
│  from "Mechanics" (chapter name)                 │
└───────────────────────────────────────────────────┘
```

**Styling:**
- Background: `from-red-50/80 to-orange-50/80` gradient
- Border: `border-red-200/50`
- Progress bars: `bg-red-400` fill on `bg-red-200/40` track
- Only renders when `topics.length > 0`
- Parent passes `profile.weakTopics.slice(0, 5)` — max 5 topics shown

---

### 4.4 ChapterMasteryList

**File:** `src/components/student/progress/ChapterMasteryList.tsx`

**Purpose:** Sortable list of all chapters within a subject, ordered weakest-first. Tapping a chapter opens the `ChapterDetailSheet`.

**Props:**
```typescript
interface ChapterMasteryListProps {
  chapters: ChapterMastery[];
  onSelectChapter: (chapterId: string) => void;
}
```

**ChapterMastery interface:**
```typescript
interface ChapterMastery {
  chapterId: string;
  chapterName: string;
  avgSuccessRate: number;    // 0-100
  questionsAttempted: number;
  examsAppeared: number;
  status: "strong" | "moderate" | "weak";
  trend: Trend;
  topics: TopicDetail[];
}
```

**Sorting:** Always sorted ascending by `avgSuccessRate` (weakest first).

**Show More Pattern:**
- Initial display: 8 chapters (`INITIAL_SHOW = 8`)
- "Show all X chapters" / "Show less" toggle
- Min touch target: `min-h-[44px]`

**Per-Chapter Row:**
```text
┌───────────────────────────────────────────────────┐
│  ●  Motion                      85%  ↑   >       │
│     ████████████████████████░░░░░░░░             │
│     8 topics  ⚠ 2 weak  5 exams                  │
└───────────────────────────────────────────────────┘
```

**Status Config:**
| Status | Dot Color | Badge BG | Badge Text |
|--------|-----------|----------|------------|
| `strong` | `bg-emerald-500` | `bg-emerald-50` | `text-emerald-700` |
| `moderate` | `bg-amber-500` | `bg-amber-50` | `text-amber-700` |
| `weak` | `bg-red-500` | `bg-red-50` | `text-red-700` |

**Animation:** Staggered entry, each row delays by `0.05s * min(index, 8)`. Progress bar animates from 0 to actual width over 0.8s.

---

### 4.5 DifficultyBreakdown

**File:** `src/components/student/progress/DifficultyBreakdown.tsx`

**Purpose:** Shows the student's accuracy split by question difficulty level (Easy/Medium/Hard).

**Props:**
```typescript
interface DifficultyBreakdownProps {
  data: DifficultyBreakdown[];
}

interface DifficultyBreakdown {
  level: "easy" | "medium" | "hard";
  accuracy: number;
  questionsAttempted: number;
  avgTimePerQuestion: number;  // seconds
}
```

**Visual Layout:**
```text
┌───────────────────────────────────────────────────┐
│  📊 Difficulty Performance                        │
│                                                   │
│  [Easy]        45 Qs              82%             │
│  ████████████████████████████░░░░░░░             │
│                                                   │
│  [Medium]      38 Qs              65%             │
│  ████████████████████░░░░░░░░░░░░░░             │
│                                                   │
│  [Hard]        22 Qs              42%             │
│  ████████████░░░░░░░░░░░░░░░░░░░░░             │
│                                                   │
│  Avg time: 45s per question                      │
└───────────────────────────────────────────────────┘
```

**Level Config:**
| Level | Bar Color | Badge BG | Badge Text |
|-------|-----------|----------|------------|
| `easy` | `bg-emerald-500` | `bg-emerald-50` | `text-emerald-700` |
| `medium` | `bg-amber-500` | `bg-amber-50` | `text-amber-700` |
| `hard` | `bg-red-500` | `bg-red-50` | `text-red-700` |

**Footer:** Average time per question across all levels: `Math.round(sum(avgTimePerQuestion) / levels.length)`

---

### 4.6 ChapterDetailSheet

**File:** `src/components/student/progress/ChapterDetailSheet.tsx`

**Purpose:** Bottom sheet overlay showing topic-level breakdown for a selected chapter.

**Props:**
```typescript
interface ChapterDetailSheetProps {
  chapter: ChapterMastery;
  onClose: () => void;
}
```

**Trigger:** Clicking a chapter in `ChapterMasteryList` sets `selectedChapterId` in `SubjectDeepDive`, which finds the matching chapter and renders this sheet inside `<AnimatePresence>`.

**Visual Layout:**
```text
┌───────────────────────────────────────────────────┐
│  ══════  (drag handle, mobile only)               │
│                                                   │
│  Chapter Name                            [X]      │
│                                                   │
│  ┌────────┐  ┌────────┐  ┌────────┐              │
│  │  72%   │  │  45    │  │   5    │              │
│  │Success │  │  Qs    │  │ Exams  │              │
│  └────────┘  └────────┘  └────────┘              │
│                                                   │
│  Topics                                           │
│  Kinematics .............. 12 Qs  [35%]          │
│  ████████████░░░░░░░░░░░░░░░░░░░░               │
│  Projectile Motion ....... 8 Qs   [62%]          │
│  ████████████████████░░░░░░░░░░░░               │
│  Free Fall ............... 6 Qs   [78%]          │
│  ████████████████████████████░░░░               │
└───────────────────────────────────────────────────┘
```

**Sheet Behavior:**
- **Backdrop:** Fixed overlay, `bg-black/30 backdrop-blur-sm`, click dismisses
- **Sheet animation:** Slides up from `y: 100%` with spring physics (`damping: 25, stiffness: 300`)
- **Mobile:** Full-width, max-height 80vh, rounded top corners, drag handle
- **Desktop (lg+):** `max-w-lg`, positioned bottom-right with `lg:right-4 lg:bottom-4 lg:rounded-2xl`
- **Topics sorted:** ascending by accuracy (weakest first)

**Topic Status Colors:**
| Status | Bar | Badge BG | Badge Text |
|--------|-----|----------|------------|
| `strong` | `bg-emerald-500` | `bg-emerald-50` | `text-emerald-700` |
| `moderate` | `bg-amber-500` | `bg-amber-50` | `text-amber-700` |
| `weak` | `bg-red-500` | `bg-red-50` | `text-red-700` |

---

## 5. Phase 3: Exams Tab

### Layout

```text
┌──────────────────────────────┬──────────────────────────────┐
│  ExamHistoryTimeline         │  PerExamStandingCard         │
│  (left column)               │  ExamTrendChart              │
│                              │  (right column)              │
└──────────────────────────────┴──────────────────────────────┘

Mobile: Single column, stacked
```

Grid: `grid grid-cols-1 lg:grid-cols-2 gap-4`

### Auto-Select Latest Exam

On mount (and when exams load), a `useEffect` automatically selects the most recent exam:

```typescript
useEffect(() => {
  if (exams.length > 0 && !selectedExamId) {
    const latest = [...exams].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setSelectedExamId(latest[0].examId);
  }
}, [exams, selectedExamId]);
```

This ensures `PerExamStandingCard` always has data to display when the tab opens.

---

### 5.1 ExamHistoryTimeline

**File:** `src/components/student/progress/ExamHistoryTimeline.tsx`

**Purpose:** Chronologically sorted list of all exams with score bars, rank badges, and comparison indicators. Clicking an exam selects it for the detail card.

**Props:**
```typescript
interface ExamHistoryTimelineProps {
  exams: ExamWithContext[];
  onSelectExam?: (examId: string) => void;
  selectedExamId?: string | null;
}
```

**Visual Layout (per exam row):**
```text
┌───────────────────────────────────────────────────┐
│ ┃ Unit Test 5 — Motion          12 Mar    >       │
│ ┃  72%  •  Avg 60%  •  Top 85%       [#3] [📄]   │
│ ┃  ████████████████░░░░░░░░░░  (comparison bar)  │
└───────────────────────────────────────────────────┘
```

**Sorting:** Descending by date (newest first).

**Show More Pattern:**
- Batch size: 10 (`BATCH_SIZE = 10`)
- Shows "Showing X of Y exams" + "Show N more" / "Collapse"
- Min touch target: `min-h-[44px]`

**Left Border Color (per exam):**
| Condition | Border Color |
|-----------|-------------|
| `deltaFromAverage > 0` | `border-l-emerald-500` |
| `deltaFromAverage >= -5` | `border-l-amber-500` |
| else | `border-l-red-500` |

**Selected State:** `bg-[hsl(var(--donut-coral))]/5 shadow-sm`

**Comparison Mini Bar:**
- Grey bar width = `classAverage%`
- Colored bar width = `percentage%`
- Color: emerald if above avg, red if below
- Wrapped in Tooltip explaining the bars

**Report Button (📄):** Navigates to `/student/tests/{examId}/results` on click. Stops propagation to avoid selecting the exam.

**Animation:** Staggered entry, each row delays by `0.05s * min(index, 10)`.

---

### 5.2 PerExamStandingCard

**File:** `src/components/student/progress/PerExamStandingCard.tsx`

**Purpose:** Detailed breakdown of a single selected exam — score, rank, percentile, comparison bars vs average and topper.

**Props:**
```typescript
interface PerExamStandingCardProps {
  exam: ExamWithContext | null;  // null = don't render
  onClose: () => void;
}
```

**Visual Layout:**
```text
┌───────────────────────────────────────────────────┐
│  🏅 Unit Test 5 — Motion                   [X]   │
│                                                   │
│  36 / 50                              72%         │
│                                                   │
│  ┌──────────────┐  ┌──────────────┐               │
│  │  #3/40       │  │  82nd        │               │
│  │  Rank        │  │  Percentile  │               │
│  └──────────────┘  └──────────────┘               │
│                                                   │
│  vs Avg  ████████████████░░░░░░  +12%             │
│  vs Top  ████████████████████░░  -13%             │
│                                                   │
│  You scored 12% above the class average 🎉       │
│                                                   │
│  [   View Detailed Report   →   ]                 │
└───────────────────────────────────────────────────┘
```

**Score Display:**
- Raw score: `{score} / {maxScore}` (text-3xl bold / text-lg muted)
- Percentage: gradient text `from-[hsl(var(--donut-coral))] to-[hsl(var(--donut-orange))]`

**Stats Grid:** 2-column grid — Rank (`#{rank}/{totalStudents}`) and Percentile (`{percentile}th`)

**Comparison Bars (with Tooltips):**

1. **vs Average:**
   - Grey bar: `classAverage%` width, `bg-muted-foreground/20`
   - Colored bar: `percentage%` width, emerald if above avg, red if below
   - Delta: `+/-deltaFromAverage%` (emerald-600 or red-500)
   - Tooltip explains both bars and gives context

2. **vs Top:**
   - Green bar: `highestScore%` width, `bg-emerald-200`
   - Coral bar: `percentage%` width, `bg-[hsl(var(--donut-coral))]`
   - Delta: `deltaFromTop%` (muted-foreground)

**Motivational Footer:**
- Above avg: "You scored {delta}% above the class average 🎉"
- Below avg: "{delta}% more effort needed to beat the class average"

**View Report Button:** Full-width gradient button navigating to `/student/tests/{examId}/results`

**Animation:** `AnimatePresence mode="wait"` with key `exam.examId` — animates scale + y + opacity on exam switch.

---

## 6. Phase 4: Insights Tab

### Layout

```text
┌──────────────────────────────┬──────────────────────────────┐
│  InsightBanner               │  SubjectRadarChart           │
│  StreakCalendar              │  WeeklyActivityChart         │
└──────────────────────────────┴──────────────────────────────┘

Mobile: Single column, stacked
```

Grid: `grid grid-cols-1 lg:grid-cols-2 gap-4`

---

### 6.1 InsightBanner

**File:** `src/components/student/progress/InsightBanner.tsx`

**Purpose:** AI-generated learning insight with summary text, strengths list, and priority focus areas.

**Props:**
```typescript
interface InsightBannerProps {
  insight: StudentAIInsight;
}
```

**Visual Layout:**
```text
┌───────────────────────────────────────────────────┐
│  ✨ Your Learning Insight                         │
│                                                   │
│  "You've shown strong improvement in Physics,     │
│  particularly in mechanics. Your consistency is    │
│  high but speed needs work on harder questions."   │
│                                                   │
│  ⭐ Strengths: Mechanics, Optics, Algebra         │
│  🎯 Focus: Thermodynamics, Organic Chemistry      │
└───────────────────────────────────────────────────┘
```

**Styling:**
- Background: gradient `from-[hsl(var(--donut-coral))]/10 via-[hsl(var(--donut-orange))]/5 to-white/70`
- Border: `border-[hsl(var(--donut-coral))]/20`
- Summary text: `text-sm text-foreground/80`
- Strengths icon: `Star` (amber-500)
- Priorities icon: `Target` (red-500)
- Lists rendered as comma-separated strings

---

### 6.2 StreakCalendar

**File:** `src/components/student/progress/StreakCalendar.tsx`

**Purpose:** Monthly calendar grid showing active study days, current streak count, and longest streak.

**Props:**
```typescript
interface StreakCalendarProps {
  currentStreak: number;
  longestStreak: number;
  activeDays: Date[];
}
```

**Visual Layout:**
```text
┌───────────────────────────────────────────────────┐
│  Study Streak              🔥 8 days              │
│                                                   │
│  ┌──────────┐  ┌──────────┐                       │
│  │    8     │  │   14    │                       │
│  │ Current  │  │ Longest  │                       │
│  └──────────┘  └──────────┘                       │
│                                                   │
│  April 2026                                       │
│  S  M  T  W  T  F  S                             │
│        1  2  3  4  5                              │
│  6  7  8  9  10 11 12                             │
│  13 14 15 ██ ██ ██ ██  ← active days (gradient)  │
│  ██ ██ ◎  22 23 24 25  ← ◎ = today ring          │
│  26 27 28 29 30                                   │
│                                                   │
│  ■ Active day   ◎ Today                           │
└───────────────────────────────────────────────────┘
```

**Calendar Logic:**
- Uses `date-fns`: `startOfMonth`, `endOfMonth`, `eachDayOfInterval`, `isSameDay`, `isToday`, `format`
- Empty cells padded for `startDayOfWeek` (Sunday = 0)
- Active day lookup: pre-built `Set` of formatted date strings for O(1) checks

**Active Day Styling:** `bg-gradient-to-br from-[hsl(var(--donut-coral))] to-[hsl(var(--donut-orange))] text-white shadow-md`

**Today (not active):** `ring-2 ring-[hsl(var(--donut-coral))] ring-offset-1`

**Streak Badge:** `🔥 {currentStreak} days` in `from-orange-100 to-amber-100` pill

**Stats Cards:** 2-column, muted background, showing Current and Longest streak numbers

**Animation:** Each day cell scales from 0 to 1 with staggered delay of `0.01s * index`.

---

### 6.3 SubjectRadarChart

**File:** `src/components/student/progress/SubjectRadarChart.tsx`

**Purpose:** Radar/spider chart visualizing accuracy across all 8 subjects at a glance.

**Props:**
```typescript
interface SubjectRadarChartProps {
  subjects: SubjectData[];  // reuses SubjectSummary fields
}

interface SubjectData {
  subjectName: string;
  accuracy: number;
  color: string;
}
```

**Visual Layout:**
```text
┌───────────────────────────────────────────────────┐
│  Subject Comparison                               │
│                                                   │
│           Phys.                                   │
│          /    \                                    │
│    Comp./      \Math                              │
│        |   ●    |     (radar fill area)           │
│    SST  \      /Chem                              │
│          \    /                                    │
│      Hindi  Bio                                   │
│                                                   │
│  Strongest: Physics (72%)  ·  Weakest: Hindi (41%)│
└───────────────────────────────────────────────────┘
```

**Chart Details:**
- Library: Recharts `RadarChart` with `PolarGrid`, `PolarAngleAxis`, `Radar`
- Outer radius: 70%
- Grid stroke: `hsl(var(--border))` at 50% opacity
- Fill: `hsl(var(--donut-coral))` at 25% opacity
- Stroke: `hsl(var(--donut-coral))`, width 2
- Axis labels: 11px, muted-foreground color

**Name Abbreviation:** Names longer than 5 characters are truncated to 4 chars + "." (e.g., "Physics" → "Phys.", "Math" stays "Math")

**Summary Callout:**
- Strongest: emerald-600, derived via `reduce()` finding max accuracy
- Weakest: rose-500, derived via `reduce()` finding min accuracy

**Responsive Height:** `h-[220px]` mobile, `sm:h-[280px]` tablet+

---

### 6.4 WeeklyActivityChart (Reused)

Same component as documented in [3.5](#35-weeklyactivitychart). Receives the same `weeklyActivity` data. Appears in both Overview and Insights tabs.

---

## 7. Shared Components

### 7.1 SecondaryTagsPills

**File:** `src/components/student/progress/SecondaryTagsPills.tsx`

**Purpose:** Renders behavior tags as small colored pills with hover tooltips. Shown below the page header.

**Props:**
```typescript
interface SecondaryTagsPillsProps {
  tags: SecondaryTag[];
}

type SecondaryTag = "improving" | "declining" | "plateaued" | "inconsistent" | "speed-issue" | "low-attempt";
```

**Tag Configuration:**

| Tag | Label | Background | Text Color | Tooltip |
|-----|-------|------------|------------|---------|
| `improving` | Improving | `bg-emerald-50` | `text-emerald-700` | Your scores are trending upward across recent exams |
| `declining` | Declining | `bg-red-50` | `text-red-700` | Your scores have been dropping — let's turn this around! |
| `plateaued` | Plateaued | `bg-amber-50` | `text-amber-700` | Scores have been steady — try challenging yourself |
| `inconsistent` | Inconsistent | `bg-orange-50` | `text-orange-700` | Scores vary widely between exams |
| `speed-issue` | Speed Issue | `bg-purple-50` | `text-purple-700` | You're accurate but slow |
| `low-attempt` | Low Attempt | `bg-slate-50` | `text-slate-700` | You're not attempting all questions |

**Tooltip Implementation:** Pure CSS hover tooltip using `group` + `group-hover:opacity-100`. Positioned above the pill with `bottom-full`. Max width 200px with text wrapping.

**Animation:** Each pill scales from 0 to 1 on mount.

---

### 7.2 CardSkeleton

**Defined inline in `Progress.tsx`.**

Used as the Suspense fallback for all lazy-loaded components.

```typescript
const CardSkeleton = ({ className = "" }: { className?: string }) => (
  <div className={`bg-white/70 backdrop-blur-xl rounded-2xl p-5 border border-white/50 shadow-lg space-y-3 ${className}`}>
    <Skeleton className="h-4 w-32" />
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-4 w-48" />
  </div>
);
```

---

## 8. Cross-Tab Interactions

### Subject Selection from Overview → Subjects Tab

When a student taps a subject in the **Overview tab's** compact grid:

```typescript
const handleSubjectSelect = useCallback((id: string) => {
  setSelectedSubjectId(id);
  setActiveTab("subjects");
}, []);
```

This switches to the Subjects tab AND pre-selects the subject, immediately showing the `SubjectDeepDive`.

### Tab Switch Resets

When switching tabs via the tab bar:

```typescript
onClick={() => {
  setActiveTab(tab.key);
  if (tab.key !== "subjects") setSelectedSubjectId(null);
}}
```

- Switching away from Subjects clears the selected subject
- The selected exam persists across tab switches (useful when going Overview → Exams)

### Exam Detail Report Navigation

Both `ExamHistoryTimeline` and `PerExamStandingCard` offer navigation to the full exam results page:

```typescript
navigate(`/student/tests/${exam.examId}/results`);
```

---

## 9. Responsive Behavior

### Global Layout Rules

| Breakpoint | Layout |
|------------|--------|
| < 1024px (mobile/tablet) | Single column, all cards stacked |
| ≥ 1024px (lg) | Two-column grid (`grid-cols-2`) |

### Touch Targets

All interactive elements maintain minimum 44px touch targets:
- Tab buttons: `min-h-[44px]`
- Back button: `min-h-[44px]`
- Show more buttons: `min-h-[44px]`
- Close buttons: `min-h-[44px] min-w-[44px]`
- Chapter rows: `min-h-[48px]`
- Exam history report icon: `min-h-[44px] min-w-[44px]`

### Tab Bar

- `overflow-x-auto` with `scrollbar-hide` for horizontal scroll on mobile
- `whitespace-nowrap` on each tab button
- Padding bottom: `pb-3` for scroll indicator space

### Component-Specific Mobile Rules

| Component | Mobile Behavior |
|-----------|----------------|
| `SubjectOverviewGrid` (compact) | 3 cols mobile, 4 tablet, 5 desktop |
| `SubjectOverviewGrid` (full) | 2 cols mobile, 3 tablet, 4 desktop |
| `SubjectRadarChart` | 220px height mobile, 280px tablet+ |
| `ChapterDetailSheet` | Full-width bottom sheet with drag handle |
| `ChapterDetailSheet` (lg) | Side-positioned card, max-w-lg |
| `ExamHistoryTimeline` | Left-border emphasis, compact score bars |
| `ProgressHeroCard` | Horizontal layout with SVG gauge on left |
| `WeeklyActivityChart` | Responsive container, 160px chart height |
| `ExamTrendChart` | Responsive container, 176px chart height |
| Page bottom padding | `pb-24` mobile (for nav bar), `lg:pb-6` desktop |

### Card Styling Pattern

All cards follow a consistent glassmorphism pattern:
```
bg-white/70 backdrop-blur-xl rounded-2xl p-5 border border-white/50 shadow-lg
```

### Animation Pattern

All cards use Framer Motion with consistent entry animations:
```typescript
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: N }}  // staggered per card position
```

---

## Appendix: File Index

| File | Type | Used In |
|------|------|---------|
| `src/pages/student/Progress.tsx` | Page | Route `/student/progress` |
| `src/data/student/progressData.ts` | Data adapter | All components |
| `src/components/student/progress/ProgressHeroCard.tsx` | Component | Overview |
| `src/components/student/progress/BatchStandingCard.tsx` | Component | Overview |
| `src/components/student/progress/SubjectOverviewGrid.tsx` | Component | Overview, Subjects |
| `src/components/student/progress/ExamTrendChart.tsx` | Component | Overview, Exams |
| `src/components/student/progress/WeeklyActivityChart.tsx` | Component | Overview, Insights |
| `src/components/student/progress/SubjectDeepDive.tsx` | Component | Subjects |
| `src/components/student/progress/WeakTopicsAlert.tsx` | Component | Subjects (deep dive) |
| `src/components/student/progress/ChapterMasteryList.tsx` | Component | Subjects (deep dive) |
| `src/components/student/progress/DifficultyBreakdown.tsx` | Component | Subjects (deep dive) |
| `src/components/student/progress/ChapterDetailSheet.tsx` | Component | Subjects (deep dive) |
| `src/components/student/progress/ExamHistoryTimeline.tsx` | Component | Exams |
| `src/components/student/progress/PerExamStandingCard.tsx` | Component | Exams |
| `src/components/student/progress/InsightBanner.tsx` | Component | Insights |
| `src/components/student/progress/StreakCalendar.tsx` | Component | Insights |
| `src/components/student/progress/SubjectRadarChart.tsx` | Component | Insights |
| `src/components/student/progress/SecondaryTagsPills.tsx` | Shared | Page header |
| `src/components/student/progress/AchievementBadges.tsx` | Deprecated | Not imported (replaced by SubjectRadarChart) |

---

*Last Updated: April 2026*
