# Institute Reports — Batch Reports

> Batch-level analytics: subjects, exams, and student performance.

---

## Batch Reports Listing

**Route**: `/institute/reports/batches`

Displays all batches grouped by class (Class 10, 11, 12). Each card shows:
- Batch name and class
- Overall average with trend indicator
- Subject count, student count, at-risk count
- Color-coded border-left using PI bucketing

---

## BatchReportDetail

**Route**: `/institute/reports/batches/:batchId`

Three-tab layout:

### Subjects Tab (Default)
Lists all subjects for the batch. Each subject card shows:
- Subject name with color dot
- Class average and trend
- Teacher name
- At-risk student count
- Tap navigates to **SubjectDetail**

### Exams Tab
Lists all exams for the batch (unit tests, mid-terms, grand tests).
- Type badge: Teacher / Institute / Grand Test
- Class average and pass percentage
- Tap navigates to **ExamResultDetail** or **GrandTestResults**
- "Show more" pattern: displays 10 exams initially

### Students Tab
Lists all students in the batch, sorted by overall average.
- PI-bucketed border-left colors
- Subject mini-bars (first 5 subjects, then "+N")
- Tap navigates to **Student360 Profile**

---

## SubjectDetail Drilldown

**Route**: `/institute/reports/batches/:batchId/subjects/:subjectId`

Shows chapter-level analysis for a specific subject in a batch:
- Chapter cards with success rate, exam coverage, topic counts
- Status badges: Strong (≥65%), Moderate (40–64%), Weak (<40%)
- Weak topic count highlighted in amber/red

### Chapter Data
Each subject has 6–8 chapters with deterministic data from `CHAPTER_NAMES` mapping:
- Physics: Mechanics, Thermodynamics, Optics, etc.
- Chemistry: Atomic Structure, Chemical Bonding, etc.
- Biology: Cell Biology, Genetics, Ecology, etc.
- English: Reading Comprehension, Creative Writing, etc.
- Hindi: गद्य खण्ड, काव्य खण्ड, व्याकरण, etc.
- Computer Science: Programming Fundamentals, Data Structures, etc.

---

## Cross-Linking

- **SubjectDetail** → accessible from Subjects tab
- **Student cards** → navigate to `/institute/reports/students/:studentId`
- **Exam cards** → navigate to ExamResultDetail or GrandTestResults
- Breadcrumbs provide full navigation chain back to Reports landing

---

*Last Updated: February 2025*
