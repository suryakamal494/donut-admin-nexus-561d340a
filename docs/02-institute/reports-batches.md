# Institute Reports — Batch Reports

> Batch-level analytics: subjects, exams, and student performance.

---

## Reports Landing

**Route**: `/institute/reports`  
**Component**: `ReportsLanding.tsx`

Three aggregate stat cards at the top, followed by three report-section navigation cards.

### Aggregate Stats

| Stat | Formula | Source |
|------|---------|--------|
| Total Students | `batches.reduce((sum, b) => sum + b.totalStudents, 0)` | `ReportsLanding.tsx` |
| Overall Avg | `round(batches.reduce((sum, b) => sum + b.overallAverage, 0) / batches.length)` | `ReportsLanding.tsx` |
| At Risk | `batches.reduce((sum, b) => sum + b.atRiskCount, 0)` | `ReportsLanding.tsx` |

### Report Section Cards

Each card shows:
- Icon with tinted background (`hsl(color / 0.12)`)
- Title, description
- Count of tracked items (batches or exams)
- Color gradient strip at top: `linear-gradient(90deg, hsl(color), hsl(color / 0.6))`
- Tap → navigates to the respective report listing

| Section | Route | Count Source |
|---------|-------|-------------|
| Batch Reports | `/institute/reports/batches` | `getInstituteBatchReports().length` |
| Exam Reports | `/institute/reports/exams` | `getInstituteExams().length` |
| Student Reports | `/institute/reports/students` | `getInstituteBatchReports().length` (batch count) |

---

## Batch Reports Listing

**Route**: `/institute/reports/batches`  
**Component**: `BatchReports.tsx`

Displays all batches grouped by class (Class 10, 11, 12). Each class group has an uppercase label header.

### Batch Card Layout

Each batch card renders:

```
┌─ gradient strip (h-1.5, bg-gradient-to-r from-primary to-accent) ─┐
│ Class 10 — Batch A                                                  │
│ 45 students · 6 subjects · [↑ 4%] trend badge                      │
│ ─────────────────────────────────────────────                       │
│ 📖 62% avg   👥 36 exams          ⚠ 8 at risk                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Important**: Batch cards do **NOT** use PI-bucketed `border-left` colors. They use a `bg-gradient-to-r from-primary to-accent` strip at the top. PI-bucketed borders are only used on **student** cards.

### Displayed Fields

| Field | Formula | Source |
|-------|---------|--------|
| Title | `batch.className — batch.batchName` | Hardcoded in batch definition |
| Students | `batch.totalStudents` | Hardcoded per batch |
| Subjects | `batch.subjectCount` | Hardcoded per batch |
| Overall Avg | `batch.overallAverage` (percentage, displayed as `{value}% avg`) | Hardcoded per batch |
| Total Exams | `batch.totalExams` | Hardcoded per batch |
| At Risk | `batch.atRiskCount` (shown only if > 0) | Hardcoded per batch |

### Trend Badge

```
trendDiff = Math.abs(batch.overallAverage - batch.previousAverage)
```

| Condition | Badge Style | Text |
|-----------|-------------|------|
| `trend === "up"` | `bg-emerald-100 text-emerald-700` + ↑ icon | `{trendDiff}%` |
| `trend === "down"` | `bg-red-100 text-red-700` + ↓ icon | `{trendDiff}%` |
| `trend === "stable"` | `bg-muted text-muted-foreground` + — icon | `"Stable"` |

### Interactions

- Tap card → navigates to `/institute/reports/batches/{batchId}`

---

## BatchReportDetail

**Route**: `/institute/reports/batches/:batchId`  
**Component**: `BatchReportDetail.tsx`

Three-tab layout with a compact header showing inline stats.

### Header Stats

Inline stat row in the `PageHeader` description:
```
{totalStudents} students · {subjectCount} subjects · {overallAverage}% avg · {totalExams} exams
```

All values come directly from the batch definition object.

### Breadcrumbs

```
Institute > Reports > Batches > {className} {batchName}
```

---

### Subjects Tab (Default)

**Component**: `SubjectOverviewCards.tsx`

Responsive grid: `grid-cols-2` mobile, `lg:grid-cols-3` desktop.

#### Subject Card Layout

```
┌─ subject color strip (h-1, hsl(subjectColor)) ─┐
│ Physics                        [↑ 4%] trend     │
│ 👤 Mr. Sharma                                    │
│ ─────────────────────────────────────            │
│ 58% avg                        ⚠ 5 at-risk      │
└──────────────────────────────────────────────────┘
```

#### Displayed Fields

| Field | Formula | Source |
|-------|---------|--------|
| Subject Name | `subject.subjectName` | Batch subjects array |
| Color Strip | `hsl(subject.subjectColor)` | `SUBJECT_COLORS` map |
| Teacher | `subject.teacherName` | `TEACHERS` pool |
| Class Average | `subject.classAverage` (displayed as `{value}%`) | Hardcoded per subject |
| At Risk Count | `subject.atRiskCount` (shown only if > 0) | Hardcoded per subject |

#### Trend Badge Calculation

```
trendDiff = Math.abs(subject.classAverage - subject.previousAverage)
```

| Condition | Badge Style | Text |
|-----------|-------------|------|
| `trend === "up"` | `bg-emerald-100 text-emerald-700` + ↑ icon | `{trendDiff}%` |
| `trend === "down"` | `bg-red-100 text-red-700` + ↓ icon | `{trendDiff}%` |
| `trend === "stable"` | `bg-muted text-muted-foreground` + — icon | `"—"` |

If `trendDiff === 0`, displays `"—"` regardless of trend direction.

#### Interactions

- Tap card → navigates to `/institute/reports/batches/{batchId}/subjects/{subjectId}`

---

### Exams Tab

**Component**: `BatchExamsTab.tsx`

Lists all exams for the batch. **No pagination or "Show more" pattern** — all exams render in a single scrollable list.

#### Filter Chips

Horizontal scrollable row of filter chips at the top:

| Chip | Filter | Count |
|------|--------|-------|
| All | Shows all exams | `exams.length` |
| Teacher | `exam.type === "teacher"` | Filtered count |
| Institute | `exam.type === "institute"` | Filtered count |
| Grand Test | `exam.type === "grand_test"` | Filtered count |

Chips with `count === 0` are hidden (except "All").

#### Exam Type Classification

| Exam Name Pattern | Type Value | Badge Style |
|-------------------|-----------|-------------|
| Unit Test 1/2/3 | `"teacher"` | `bg-blue-100 text-blue-700` |
| Mid-Term, Pre-Final | `"institute"` | `bg-purple-100 text-purple-700` |
| Grand Test (any) | `"grand_test"` | `bg-amber-100 text-amber-700` |

#### Exam Card Layout

```
┌──────────────────────────────────────────────────────┐
│ Physics Unit Test 1    [Teacher]          72%        │
│ Physics · 10 Jan '25 · 85% pass       21.7/30      │
└──────────────────────────────────────────────────────┘
```

#### Displayed Fields & Formulas

| Field | Formula | Source |
|-------|---------|--------|
| Exam Name | `exam.examName` (e.g., "Physics Unit Test 1") | Generated |
| Type Badge | `typeBadgeStyles[exam.type]` | See table above |
| Subject | `exam.subject` (or `exam.subjectNames.join(", ")` for grand tests) | Generated |
| Date | `new Date(exam.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })` | Generated |
| Pass % | `exam.passPercentage` (displayed as `{value}% pass`) | `round(55 + rand() * 35)` |
| **Avg Percent** | `round((exam.classAverage / exam.totalMarks) × 100)` | `BatchExamsTab.tsx` L72 |
| Avg Score | `exam.classAverage / exam.totalMarks` (displayed as `{classAverage}/{totalMarks}`) | Generated |

#### `classAverage` Generation Formula

```javascript
avgPct = clamp(subjectClassAverage + floor(rand() * 20) - 10, 25, 92)
classAverage = round((avgPct / 100) * totalMarks)
```

Where `totalMarks` = 30 for Unit Tests, 100 for Mid-Term/Pre-Final.

#### Interactions

- Tap exam card →
  - If `type === "grand_test"`: navigates to `/institute/reports/exams/{examId}/grand-test`
  - Otherwise: navigates to `/institute/reports/exams/{examId}`

---

### Students Tab

**Component**: `BatchStudentsTab.tsx`

Renders all students in the batch with search, sort, and performance bucket summary.

#### PI Bucket Summary Pills

Horizontal row of pills showing student distribution across performance buckets:

| Bucket | Threshold | Color Dot |
|--------|-----------|-----------|
| Mastery | `overallAverage >= 75` | `bg-emerald-500` |
| Stable | `overallAverage >= 50` | `bg-teal-500` |
| Reinforce | `overallAverage >= 35` | `bg-amber-500` |
| At Risk | `overallAverage < 35` | `bg-red-500` |

Each pill shows: `[● dot] {label} {count}`

#### Search & Sort Controls

| Control | Behavior |
|---------|----------|
| Search input | Filters by `studentName` or `rollNumber` (case-insensitive) |
| Name sort button | Toggles alphabetical sort (default: ascending) |
| Avg sort button | Toggles by `overallAverage` (default: descending) |

Toggling the same sort key flips direction; switching keys sets the default direction for that key.

#### Student Card Layout

```
┌─ border-l-emerald-500 (PI-bucketed) ─────────────────────────────┐
│ Aarav Sharma    10A001            ● 58% ● 64% ● 65%    72% ↑    │
│                                   Phy   Chem   Math              │
└──────────────────────────────────────────────────────────────────┘
```

#### Displayed Fields & Formulas

| Field | Formula | Source |
|-------|---------|--------|
| Student Name | `student.studentName` | `getName(index, rand)` from pool |
| Roll Number | `{classNum}{batchLetter}{paddedIndex}` e.g. `10A001` | Generated |
| Subject Mini-bars | **All subjects** shown as colored dot + `{average}%` | No 5-subject cap or "+N" overflow |
| Overall Average | `round(mean(subject.average for all subjects))` | `reportsData.ts` L405 |
| Trend Icon | `↑` / `↓` / `—` based on `student.trend` | Randomly assigned |
| Border-left color | `getPerformanceColor(overallAverage).border` | See [Color Reference](#color-reference) |

#### `overallAverage` Generation Formula

```javascript
// For each subject:
subjectAverage = clamp(subjectClassAverage + floor(rand() * 40) - 20, 15, 98)

// Overall:
overallAverage = round(sum(subjectAverages) / subjectCount)
```

#### Interactions

- Tap student card → navigates to `/institute/reports/students/{studentId}`

---

## SubjectDetail Drilldown

**Route**: `/institute/reports/batches/:batchId/subjects/:subjectId`  
**Component**: `SubjectDetail.tsx`

Chapter-level analysis for a specific subject within a batch.

### Header

Inline stats: `{teacherName} · {totalStudents} students · {classAverage}% avg · {trend label}`

Trend label: `"Improving"` / `"Declining"` / `"Stable"`

### Summary Pills

| Pill | Condition | Style |
|------|-----------|-------|
| Chapters | Always shown | `bg-muted` with BookOpen icon |
| Strong | `strongCount > 0` | `bg-emerald-50 text-emerald-700` with CheckCircle2 icon |
| Weak | `weakCount > 0` | `bg-red-50 text-red-700` with AlertTriangle icon |

Where:
```javascript
strongCount = chapters.filter(c => c.status === "strong").length
weakCount = chapters.filter(c => c.status === "weak").length
```

### Chapter Card Layout

```
┌─ border-l-emerald-500 (status-colored) ──────────────┐
│ Mechanics                             [Strong]        │
│ 78% success rate                                      │
│ ────────────────────────────────────────               │
│ 5 topics · 2 exams · ⚠ 0 weak                        │
└───────────────────────────────────────────────────────┘
```

Responsive grid: `grid-cols-1` mobile, `sm:grid-cols-2`, `lg:grid-cols-3`.

### Chapter Data Generation

All values use seeded PRNG with seed `hashString("{batchId}-{subjectId}")`.

| Field | Formula | Range |
|-------|---------|-------|
| `avgSuccessRate` | `clamp(subjectClassAverage + floor(rand() * 30) - 15, 20, 95)` | 20–95% |
| `examsCovering` | `floor(rand() * 3) + 1` | 1–3 |
| `topicCount` | `floor(rand() * 4) + 3` | 3–6 |
| `weakTopicCount` | If weak: `floor(rand() * 3) + 1`; if moderate: `floor(rand() * 2)`; if strong: `0` | 0–3 |

### Status Classification

| Status | Threshold | Border Color | Badge Style |
|--------|-----------|--------------|-------------|
| Strong | `avgSuccessRate >= 65` | `border-l-emerald-500` | `bg-emerald-100 text-emerald-700` |
| Moderate | `avgSuccessRate >= 40` | `border-l-teal-500` | `bg-teal-100 text-teal-700` |
| Weak | `avgSuccessRate < 40` | `border-l-red-500` | `bg-red-100 text-red-700` |

Status colors use `getStatusColor(status)` from `reportColors.ts`, which maps:
- `"strong"` → `getPerformanceColor(75)` (emerald tier)
- `"moderate"` → `getPerformanceColor(50)` (teal tier)
- `"weak"` → `getPerformanceColor(0)` (red tier)

### Chapter Names

| Subject | Chapters |
|---------|----------|
| Physics | Mechanics, Thermodynamics, Optics, Electrostatics, Magnetism, Waves, Modern Physics, Semiconductors |
| Chemistry | Atomic Structure, Chemical Bonding, Organic Chemistry, Equilibrium, Solutions, Electrochemistry, Coordination Compounds, Polymers |
| Mathematics | Algebra, Calculus, Trigonometry, Coordinate Geometry, Probability, Vectors, Matrices, Differential Equations |
| Biology | Cell Biology, Genetics, Ecology, Human Physiology, Plant Physiology, Evolution, Biotechnology, Reproduction |
| English | Reading Comprehension, Creative Writing, Grammar & Usage, Literature Analysis, Poetry, Essay Writing |
| Hindi | गद्य खण्ड, काव्य खण्ड, व्याकरण, लेखन कौशल, अपठित गद्यांश, पत्र लेखन |
| Computer Science | Programming Fundamentals, Data Structures, Databases, Networking, Boolean Algebra, Python |

---

## Cross-Linking

| From | To | Route |
|------|----|-------|
| Reports Landing card | Batch Reports listing | `/institute/reports/batches` |
| Batch card | BatchReportDetail | `/institute/reports/batches/{batchId}` |
| Subject card | SubjectDetail | `/institute/reports/batches/{batchId}/subjects/{subjectId}` |
| Exam card (regular) | ExamResultDetail | `/institute/reports/exams/{examId}` |
| Exam card (grand test) | GrandTestResults | `/institute/reports/exams/{examId}/grand-test` |
| Student card | Student360 Profile | `/institute/reports/students/{studentId}` |
| Breadcrumbs | Full chain back to Reports Landing | All intermediate routes |

---

## Color Reference

### Performance Color Tiers (`getPerformanceColor()`)

Used for student card `border-left` and overall average text color.

| Tier | Threshold | bg | text | border |
|------|-----------|-----|------|--------|
| Mastery | `>= 75` | `bg-emerald-500` | `text-emerald-700` / `dark:text-emerald-400` | `border-l-emerald-500` |
| Stable | `>= 50` | `bg-teal-500` | `text-teal-700` / `dark:text-teal-400` | `border-l-teal-500` |
| Reinforcement | `>= 35` | `bg-amber-500` | `text-amber-700` / `dark:text-amber-400` | `border-l-amber-500` |
| At Risk | `< 35` | `bg-red-500` | `text-red-700` / `dark:text-red-400` | `border-l-red-500` |

Source: `src/lib/reportColors.ts`

### Subject Colors

| Subject | HSL Value |
|---------|-----------|
| Physics | `210 90% 56%` |
| Chemistry | `145 65% 42%` |
| Mathematics | `35 95% 55%` |
| Biology | `280 65% 55%` |
| English | `350 70% 55%` |
| Hindi | `20 80% 55%` |
| Computer Science | `195 80% 50%` |

Source: `SUBJECT_COLORS` in `reportsData.ts`

---

## Data Generation

### Seeded PRNG

All mock data uses a seeded pseudo-random number generator for **deterministic, render-stable** output.

```
Algorithm: Linear Congruential Generator (LCG)
Multiplier: 16807
Modulus: 2147483647 (2^31 - 1)
Seed: hashString(contextKey)
Hash: DJB2 variant — hash = ((hash << 5) + hash + charCode) | 0
```

### Map Caching

All generated data is cached in `Map<string, T>` instances per entity type:
- `batchReportsCache` — batch definitions
- `examsCache` — exam listings
- `studentsCache` — student summaries (keyed by batchId)
- `examHistoryCache` — per-student exam history
- `subjectDetailCache` — per-subject chapter analysis

Cache ensures data stability across re-renders without requiring `useMemo` in components.

### Batch Definitions

7 batches across 3 classes:
- Class 10: Batch A (45 students), Batch B (42), Batch C (40)
- Class 11: Batch A (38 students, 7 subjects), Batch B (36, 7 subjects)
- Class 12: Batch A (35 students, 7 subjects), Batch B (34, 7 subjects)

Class 10 batches have 6 subjects; Class 11/12 have 7 (includes Computer Science).

All per-batch values (`overallAverage`, `previousAverage`, `trend`, `atRiskCount`, `totalExams`) are **hardcoded** in the batch definition array — they are not computed from child data.

---

## Calculation Reference

| Metric | Formula | Source File | Line |
|--------|---------|-------------|------|
| Reports Landing: Total Students | `sum(batch.totalStudents)` | `ReportsLanding.tsx` | L46 |
| Reports Landing: Overall Avg | `round(mean(batch.overallAverage))` | `ReportsLanding.tsx` | L47 |
| Reports Landing: At Risk | `sum(batch.atRiskCount)` | `ReportsLanding.tsx` | L48 |
| Batch card: Trend diff | `abs(overallAverage - previousAverage)` | `BatchReports.tsx` | L41 |
| Subject card: Trend diff | `abs(classAverage - previousAverage)` | `SubjectOverviewCards.tsx` | L17 |
| Exam card: Avg percent | `round((classAverage / totalMarks) × 100)` | `BatchExamsTab.tsx` | L72 |
| Exam: classAverage generation | `round((clamp(subjectClassAvg + rand(-10..+10), 25, 92) / 100) × totalMarks)` | `reportsData.ts` | L307-308 |
| Exam: passPercentage | `round(55 + rand() × 35)` | `reportsData.ts` | L321 |
| Student: subject average | `clamp(subjectClassAvg + rand(-20..+20), 15, 98)` | `reportsData.ts` | L393-394 |
| Student: overallAverage | `round(mean(allSubjectAverages))` | `reportsData.ts` | L405 |
| Student: roll number | `{classNum}{batchLetter}{padStart(index+1, 3, "0")}` | `reportsData.ts` | L410 |
| Chapter: avgSuccessRate | `clamp(subjectClassAvg + rand(-15..+15), 20, 95)` | `reportsData.ts` | L503 |
| Chapter: examsCovering | `floor(rand() × 3) + 1` | `reportsData.ts` | L509 |
| Chapter: topicCount | `floor(rand() × 4) + 3` | `reportsData.ts` | L510 |
| Chapter: weakTopicCount | weak: `rand(1..3)`, moderate: `rand(0..1)`, strong: `0` | `reportsData.ts` | L511 |
| Chapter: status | `rate >= 65 → strong, >= 40 → moderate, < 40 → weak` | `reportsData.ts` | L504 |
| Bucket: Mastery | `overallAverage >= 75` | `BatchStudentsTab.tsx` | L54 |
| Bucket: Stable | `overallAverage >= 50` | `BatchStudentsTab.tsx` | L55 |
| Bucket: Reinforcement | `overallAverage >= 35` | `BatchStudentsTab.tsx` | L56 |
| Bucket: At Risk | `overallAverage < 35` | `BatchStudentsTab.tsx` | L57 |

---

*Last Updated: March 2026*
