# Institute Reports — Overview

> Navigation map, design principles, centralized color system, data architecture, and landing page documentation.

---

## Navigation Map

```text
ReportsLanding (/institute/reports)
├── Batch Reports (/institute/reports/batches)
│   └── BatchReportDetail (/institute/reports/batches/:batchId)
│       ├── Subjects Tab → SubjectDetail (/institute/reports/batches/:batchId/subjects/:subjectId)
│       ├── Exams Tab → ExamResultDetail / GrandTestResults
│       └── Students Tab → Student360 Profile
├── Exam Reports (/institute/reports/exams)
│   ├── ExamResultDetail (/institute/reports/exams/:examId) — single-subject
│   └── GrandTestResults (/institute/reports/exams/:examId/grand-test) — multi-subject
└── Student Reports (/institute/reports/students)
    └── Student360 Profile (/institute/reports/students/:studentId)
```

---

## ReportsLanding Page

**Route:** `/institute/reports`  
**Component:** `ReportsLanding.tsx`

### Quick Stats Bar

3-column grid of stat cards:

| Card | Formula | Icon Color |
|------|---------|-----------|
| Total Students | `batches.reduce((s, b) => s + b.totalStudents, 0)` | `text-primary` |
| Overall Avg | `round(batches.reduce((s, b) => s + b.overallAverage, 0) / batches.length)` + `%` | `text-emerald-600` |
| At Risk | `batches.reduce((s, b) => s + b.atRiskCount, 0)` | `text-destructive` |

> `batches` = `getInstituteBatchReports()` — returns all 7 batch definitions.

### Report Section Cards

3 clickable cards in `sm:grid-cols-3`:

| Card | Href | Stat Badge |
|------|------|-----------|
| Batch Reports | `/institute/reports/batches` | `{batches.length} batches tracked` |
| Exam Reports | `/institute/reports/exams` | `{allExams.length} exams tracked` |
| Student Reports | `/institute/reports/students` | `{batches.length} batches tracked` |

Each card has:
- Gradient color strip at top: `linear-gradient(90deg, hsl(color), hsl(color / 0.6))`
- Icon in tinted circle: `hsl(color / 0.12)` background
- Staggered animation: `delay: i × 0.1`

**Section colors (HSL):**
- Batch Reports: `210 90% 56%` (blue)
- Exam Reports: `145 65% 42%` (green)
- Student Reports: `35 95% 55%` (amber)

---

## Centralized Color System

### `getPerformanceColor(percentage)` — `src/lib/reportColors.ts`

Returns a `PerformanceColors` object with 5 class strings for consistent theming:

| Tier | Threshold | `bg` | `text` | `light` | `badge` | `border` |
|------|-----------|------|--------|---------|---------|----------|
| **Mastery** | `>= 75` | `bg-emerald-500` | `text-emerald-700 dark:text-emerald-400` | `bg-emerald-50 dark:bg-emerald-950/30` | `bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400` | `border-l-emerald-500` |
| **Stable** | `>= 50` | `bg-teal-500` | `text-teal-700 dark:text-teal-400` | `bg-teal-50 dark:bg-teal-950/30` | `bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400` | `border-l-teal-500` |
| **Reinforcement** | `>= 35` | `bg-amber-500` | `text-amber-700 dark:text-amber-400` | `bg-amber-50 dark:bg-amber-950/30` | `bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400` | `border-l-amber-500` |
| **At Risk** | `< 35` | `bg-red-500` | `text-red-700 dark:text-red-400` | `bg-red-50 dark:bg-red-950/30` | `bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400` | `border-l-red-500` |

All tiers include `dark:` variants for both light and dark theme support.

### `getStatusColor(status)` — Same file

Maps string status labels to the color system:

| Status | Delegates To |
|--------|-------------|
| `"strong"` | `getPerformanceColor(75)` → Mastery (emerald) |
| `"moderate"` | `getPerformanceColor(50)` → Stable (teal) |
| `"weak"` | `getPerformanceColor(0)` → At Risk (red) |

### Usage Pattern

```tsx
import { getPerformanceColor } from "@/lib/reportColors";

const color = getPerformanceColor(student.overallAverage);

// Left border accent
<Card className={cn("border-l-4", color.border)}>

// Text color
<span className={cn("font-bold", color.text)}>{percentage}%</span>

// Progress bar fill
<div className={cn("h-full rounded-full", color.bg)} style={{ width: `${pct}%` }} />

// Badge
<span className={cn("px-2 py-0.5 rounded-full text-xs", color.badge)}>Mastery</span>

// Surface background
<div className={cn("rounded-lg p-3", color.light)}>...</div>
```

---

## Design Principles

### Mobile-First
- All report pages designed for mobile (390×844) first, then scale up
- Card-based layout with left-border accent colors
- Touch-friendly tap targets (minimum 44px)
- "Show more" pattern: 20 students per page, 10 exams per page

### Consistent Data Rendering
- All percentages displayed as integers (no decimals)
- Trend icons: ↑ emerald (`TrendingUp`), ↓ red (`TrendingDown`), — muted (`Minus`)
- Subject colors: consistent HSL values from `SUBJECT_COLORS` map in `reportsData.ts`

### Subject Color Palette

| Subject | HSL |
|---------|-----|
| Physics | `210 90% 56%` |
| Chemistry | `145 65% 42%` |
| Mathematics | `35 95% 55%` |
| Biology | `280 65% 55%` |
| English | `350 70% 55%` |
| Hindi | `20 80% 55%` |
| Computer Science | `195 80% 50%` |

---

## Data Architecture

### Seeded PRNG

All mock data generators in `reportsData.ts` use a deterministic pseudo-random number generator:

**Hash function (`hashString`):**

```
hash = 5381
for each char in string:
  hash = ((hash << 5) + hash + charCode) | 0
return abs(hash)
```

This is the **djb2** hash algorithm, producing a 32-bit integer from any string.

**LCG generator (`seededRandom`):**

```
seed = inputSeed % 2147483647
if seed <= 0: seed += 2147483646

nextRandom():
  seed = (seed × 16807) % 2147483647
  return (seed - 1) / 2147483646
```

Constants: Multiplier = `16807`, Modulus = `2147483647` (Mersenne prime 2³¹-1).  
This is the **Park-Miller** minimal standard PRNG.

**Seed composition per generator:**

| Generator | Seed String |
|-----------|------------|
| Batch exams | `batchId + "-exams"` |
| Batch students | `batchId + "-students"` |
| Student exam history | `studentId + "-history"` |
| Subject detail chapters | `batchId + "-" + subjectId` |

### Map-Based Caching

All generators cache results in module-level `Map` objects:

| Cache | Key | Content |
|-------|-----|---------|
| `batchReportsCache` | `"all"` | All batch definitions |
| `examsCache` | `"all"` | All exam entries |
| `studentsCache` | `batchId` or `"__all__"` | Students per batch |
| `examHistoryCache` | `studentId` | Exam history entries |
| `subjectDetailCache` | `batchId-subjectId` | Chapter analysis |

Caches persist for the SPA session (no page reload). This ensures data stability across tab switches and component remounts.

> ⚠ **Exception:** `generateGrandTestData()` in `GrandTestResults.tsx` and `generateExamAnalyticsForBatch()` in `examResults.ts` use **unseeded `Math.random()`**. They are cached via `Map` and `useMemo` respectively, but data will differ on remount/cache-clear.

### Scale Targets

| Dimension | Count |
|-----------|-------|
| Batches | 7 (3 classes × 2–3 batches) |
| Subjects per batch | 6–7 |
| Students per batch | 34–45 |
| Total students | ~270 |
| Exams per batch | 32–48 |
| Grand tests per batch | 3 |
| Chapter mappings | 6–8 per subject |
| Name pool | 90 first × 20 last names |

### Exports from `reportsData.ts`

| Function | Returns |
|----------|---------|
| `getInstituteBatchReports()` | `InstituteBatchReport[]` — all 7 batches |
| `getInstituteBatchById(batchId)` | Single batch or `undefined` |
| `getInstituteExams()` | `InstituteExamEntry[]` — all exams across batches |
| `getExamsByBatch(batchId)` | Filtered exams for one batch |
| `getAllStudents()` | `InstituteStudentSummary[]` — all students |
| `getStudentsByBatch(batchId)` | Students for one batch |
| `getStudentById(studentId)` | Single student or `undefined` |
| `getStudentExamHistory(student)` | `ExamHistoryEntry[]` — cached per student |
| `getSubjectDetail(batchId, subjectId)` | `SubjectDetailData` — chapter analysis |

---

*Last Updated: March 2026*
