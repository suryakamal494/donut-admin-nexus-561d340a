# Institute Reports — Student Reports

> Student listing and 360° profile with subject analysis.

---

## Student Reports Listing

**Route**: `/institute/reports/students`

### Features
- **Search**: By student name or roll number
- **Batch filter**: Dropdown to filter by batch
- **PI buckets**: Summary pills showing Mastery / Stable / Reinforce / At Risk counts
- **Show more**: Displays 20 students initially, "Show more" button loads next 20
- Sorted by overall average (descending)

### Student Card
- Name with trend indicator (↑ ↓ —)
- Roll number, batch, exam count
- Overall average with PI-bucketed color
- Subject mini-bars (first 5 subjects with 3-letter abbreviations, "+N" for extras)

---

## Student 360° Profile

**Route**: `/institute/reports/students/:studentId`

### Header Card
- Student name, roll number, batch
- Overall average (large, color-coded)
- Trend indicator with label
- Subject count and exams taken

### Tabs

#### Subjects Tab (Default)
Cards for each subject showing:
- Subject color dot and name
- Average percentage with PI color
- Teacher name and exam count
- Progress bar

#### Exam History Tab
Chronological list of all exams taken (newest first):
- Exam name, subject, date
- Score (marks) and percentage
- PI-bucketed border color
- **Show more**: Displays 10 exams initially, expandable

#### Analysis Tab

**Weak Spots**
- Subjects with average < 50%
- Sorted by lowest first
- Color dot + percentage + mini progress bar

**Subject Comparison**
- Horizontal bar chart for all subjects
- Animated bars using framer-motion
- PI-colored

**Recent Performance Trend**
- Sparkline bar chart of last 10 exams
- Animated vertical bars
- Color-coded by PI tier

---

## Weak Spots Detection Logic

```typescript
// Subjects with average < 50% are flagged as weak spots
function getWeakSpots(student): WeakSpot[] {
  return student.subjects
    .filter(s => s.average < 50)
    .sort((a, b) => a.average - b.average);
}
```

---

## Cross-Linking

| Source | Target | Method |
|--------|--------|--------|
| StudentReports list | Student360 Profile | Card tap → navigate |
| BatchReportDetail Students tab | Student360 Profile | Card tap → navigate |
| Student360 breadcrumbs | StudentReports list | "Students" breadcrumb |
| Student360 breadcrumbs | ReportsLanding | "Reports" breadcrumb |

---

## Data Stability

Student exam history uses `getStudentExamHistory()` from the data layer:
- **Map-cached** by studentId
- **Seeded PRNG** keyed on `studentId + "-history"`
- Scores are deterministic and stable across re-renders

---

## Scalability

| Metric | Value |
|--------|-------|
| Total students | ~270 across 7 batches |
| Subjects per student | 6–7 |
| Exams per student | 32–48 |
| Name pool | 90 first names × 20 last names |
| Show more increment | 20 students |

---

*Last Updated: February 2025*
