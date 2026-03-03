# Institute Reports — Student Reports

> Student listing with PI bucketing and 360° profiles with subject analysis, exam history, and performance trends.

---

## Routes

| Route | Page | Component |
|-------|------|-----------|
| `/institute/reports/students` | Student listing | `StudentReports.tsx` |
| `/institute/reports/students/:studentId` | 360° Profile | `StudentProfile360.tsx` |

---

## 1. Student Reports Listing

**Component:** `StudentReports.tsx`  
**Data source:** `getAllStudents()` → `reportsData.ts`

### Filters & Controls

1. **Search** — case-insensitive substring match on `studentName` or `rollNumber`
2. **Batch dropdown** — `<select>` populated from `getInstituteBatchReports()`
3. **PI bucket summary pills** — 4 colored dots with counts (not clickable, purely informational)

**Sort order:** `overallAverage` descending (highest first).

**Pagination:** `STUDENTS_PER_PAGE = 20`. "Show more" button loads next 20.
- Button text: `"Show more ({filtered.length - visibleCount} remaining)"`
- Visible count resets to 20 when filters change

### PI Bucket Summary Pills

Four inline indicators showing distribution of filtered students:

| Bucket | Condition | Dot Color |
|--------|-----------|-----------|
| Mastery | `overallAverage >= 75` | `bg-emerald-500` |
| Stable | `50 <= overallAverage < 75` | `bg-teal-500` |
| Reinforce | `35 <= overallAverage < 50` | `bg-amber-500` |
| At Risk | `overallAverage < 35` | `bg-red-500` |

### Student Card

Each card has a 4px PI-colored left border via `getPerformanceColor(student.overallAverage).border`.

**Displayed fields:**

| Field | Source / Formula |
|-------|-----------------|
| Name | `student.studentName` — truncated |
| Trend icon | ↑ emerald (up), ↓ red (down), — muted (stable) |
| Roll number | `student.rollNumber` — format: `{classDigit}{batchLetter}{3-digit index}` e.g. `10A001` |
| Batch | `student.batchName` — e.g. `"Class 10 Batch A"` |
| Exam count | `student.examsTaken` |
| Overall Avg | `student.overallAverage` — PI-colored text via `getPerformanceColor().text` |

**Subject mini-bars:**
- Shows first 5 subjects: `student.subjects.slice(0, 5)`
- Each: colored dot (`hsl(subjectColor)`) + 3-letter abbreviation (`subjectName.slice(0, 3)`) + `{average}%`
- Overflow: `+{subjects.length - 5}` text if more than 5 subjects

**Click:** Navigates to `/institute/reports/students/{studentId}`

---

## 2. Student 360° Profile

**Component:** `StudentProfile360.tsx`  
**Data sources:**
- `getStudentById(studentId)` → student summary
- `getStudentExamHistory(student)` → cached exam history
- `getWeakSpots(student)` → subjects below 50%

### Profile Header Card

Animated entry (`framer-motion`, opacity + y). PI-colored left border.

**Displayed fields:**

| Field | Source |
|-------|--------|
| Name | `student.studentName` |
| Roll + Batch | `{rollNumber} · {batchName}` |
| Overall Avg | `student.overallAverage` — large (2xl), PI-colored text |
| Trend | Icon + label: `"Improving"` / `"Declining"` / `"Stable"` |
| Subject count | `student.subjectCount` |
| Exams taken | `student.examsTaken` |

### Three-Tab Layout

```
[ Subjects ] [ Exam History ] [ Analysis ]
```

Grid: `grid-cols-3` on mobile, `sm:flex` on desktop.

---

### 2.1 Subjects Tab (Default)

Staggered animation: `delay: i × 0.04` per card.

**Per-subject card:**

| Field | Source / Formula |
|-------|-----------------|
| Color dot | `hsl(sub.subjectColor)` — 3×3px circle |
| Subject name | `sub.subjectName` |
| Trend icon | Same as listing (up/down/stable) |
| Average | `sub.average` — PI-colored text |
| Teacher | `sub.teacherName` |
| Exam count | `sub.examCount` |
| Progress bar | Height: `1.5px`. Width: `{sub.average}%`. Color: `getPerformanceColor(sub.average).bg` |

Left border: 4px, PI-colored.

---

### 2.2 Exam History Tab

**Component:** `ExamHistoryTab` (extracted sub-component)

**Initial display:** `INITIAL_EXAM_COUNT = 10` exams  
**Toggle:** "View all {N} exams" / "Show less" ghost button

**Sort order:** Newest first (pre-sorted by `getStudentExamHistory`).

**Per-exam row:**

| Field | Source / Formula |
|-------|-----------------|
| Exam name | `exam.examName` — truncated |
| Subject | `exam.subject` (grand tests show `"Grand Test"`) |
| Date | `toLocaleDateString("en-IN", { day: "numeric", month: "short" })` |
| Percentage | `exam.percentage` — PI-colored text |
| Score | `{exam.score}/{exam.maxScore}` |
| Left border | 3px, PI-colored via `getPerformanceColor(exam.percentage)` |

---

### 2.3 Analysis Tab

Three sections rendered in order:

#### Weak Spots

**Detection logic:**

```typescript
student.subjects
  .filter(s => s.average < 50)    // threshold: 50%
  .sort((a, b) => a.average - b.average)  // weakest first
  .map(s => ({ subject: s.subjectName, average: s.average, color: s.subjectColor }))
```

If no subjects below 50%: shows success message `"No subjects below 50% — great performance!"`

**Per weak spot row:**
- Subject color dot (`hsl(color)`)
- Subject name
- Average (PI-colored text)
- Mini progress bar: `w-20 h-1.5`, width = `{average}%`, color = PI-colored bg

#### Subject Comparison

**Visual:** Horizontal bars for all subjects with animated fill.

**Animation (`framer-motion`):**

```tsx
<motion.div
  className={cn("h-full rounded-full", color.bg)}
  initial={{ width: 0 }}
  animate={{ width: `${sub.average}%` }}
  transition={{ duration: 0.6, delay: 0.1 }}
/>
```

- Bar height: `h-2.5` (10px)
- Bar container: `bg-muted overflow-hidden rounded-full`
- Label row above: subject name (left) + `{average}%` PI-colored (right)

#### Recent Performance Trend (Sparkline)

**Visual:** Vertical bar chart showing last 10 exams.

**Data selection:**

```typescript
examHistory.slice(0, 10)  // Take newest 10 (already sorted newest-first)
  .reverse()               // Reverse for left-to-right chronological (oldest → newest)
```

**Bar height formula:**

```
height = (exam.percentage / 100) × 64px
```

- Minimum height: `4px` (`min-h-[4px]`)
- Container height: `h-20` (80px)
- Bar color: PI-colored via `getPerformanceColor(exam.percentage).bg`
- Below each bar: `{percentage}` in `8px` text

**Animation:**

```tsx
<motion.div
  style={{ height: `${(exam.percentage / 100) * 64}px` }}
  initial={{ height: 0 }}
  animate={{ height: `${(exam.percentage / 100) * 64}px` }}
  transition={{ duration: 0.4, delay: i * 0.05 }}
/>
```

Caption: `"Last {min(10, examHistory.length)} exams (oldest → newest)"`

---

## 3. Data Generation

### Student Summary Generation (`generateStudentsForBatch`)

**Seeded PRNG:** `seededRandom(hashString(batchId + "-students"))`

```
For each student i in 0..batch.totalStudents:
  name = getName(i, rand)  // FIRST_NAMES[i % 90] + LAST_NAMES[floor(rand() × 20)]
  
  For each subject in batch.subjects:
    offset = floor(rand() × 40) - 20     // range: -20 to +19
    average = clamp(subjectClassAverage + offset, 15, 98)
    trend = ["up","down","stable"][floor(rand() × 3)]
  
  overallAverage = round(mean(subjectPerf[].average))
  studentTrend = ["up","down","stable"][floor(rand() × 3)]
```

**Roll number format:** `{classDigit}{batchLetter}{3-digit padded index}`  
Example: Class 10, Batch A, student 1 → `10A001`

**Sort:** Students sorted by `overallAverage` descending after generation.

### Exam History Generation (`getStudentExamHistory`)

**Seeded PRNG:** `seededRandom(hashString(studentId + "-history"))`  
**Cache:** Map-cached by `studentId`

```
For each exam in getExamsByBatch(student.batchId):
  baseAvg = student's subject average for matching subject, or overallAverage for grand tests
  percentage = clamp(baseAvg + floor(rand() × 30) - 15, 10, 98)
  score = round((percentage / 100) × exam.totalMarks)
  subject = "Grand Test" if exam.type === "grand_test", else exam.subject
```

**Sort:** Descending by date (newest first).

---

## 4. Cross-Linking

| Source | Target | Method |
|--------|--------|--------|
| StudentReports list card | StudentProfile360 | `navigate(/institute/reports/students/{studentId})` |
| BatchReportDetail Students tab | StudentProfile360 | Same navigation |
| StudentProfile360 breadcrumbs → "Students" | StudentReports listing | Breadcrumb link |
| StudentProfile360 breadcrumbs → "Reports" | ReportsLanding | Breadcrumb link |

---

## 5. Scalability

| Metric | Value |
|--------|-------|
| Total students | ~270 across 7 batches |
| Subjects per student | 6–7 |
| Exams per student | 32–48 (includes grand tests) |
| Name pool | 90 first names × 20 last names |
| Show more increment | 20 students |
| Initial exam history display | 10 exams |

---

## 6. Calculation Reference

| Metric | Formula | Source |
|--------|---------|--------|
| Student Overall Avg | `round(mean(subjects[].average))` | `reportsData.ts` L405 |
| Subject Average | `clamp(subjectClassAverage + rand(-20..+19), 15, 98)` | `reportsData.ts` L393-394 |
| Exam History % | `clamp(subjectAvg + rand(-15..+14), 10, 98)` | `reportsData.ts` L460 |
| Exam History Score | `round((percentage / 100) × totalMarks)` | `reportsData.ts` L461 |
| Weak Spot Threshold | `subject.average < 50` | `StudentProfile360.tsx` L34 |
| Sparkline Bar Height | `(percentage / 100) × 64px` | `StudentProfile360.tsx` L235 |
| Subject Comparison Width | `{average}%` animated from 0 | `StudentProfile360.tsx` L208 |
| PI Bucket: Mastery | `overallAverage >= 75` | `StudentReports.tsx` L47 |
| PI Bucket: Stable | `50 <= overallAverage < 75` | `StudentReports.tsx` L48 |
| PI Bucket: Reinforce | `35 <= overallAverage < 50` | `StudentReports.tsx` L49 |
| PI Bucket: At Risk | `overallAverage < 35` | `StudentReports.tsx` L50 |
| Roll Number | `{classDigit}{batchLetter}{padStart(i+1, 3, "0")}` | `reportsData.ts` L410 |
| Student Name | `FIRST_NAMES[i % 90] + " " + LAST_NAMES[floor(rand() × 20)]` | `reportsData.ts` L165-168 |

---

*Last Updated: March 2026*
