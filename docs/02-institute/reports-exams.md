# Institute Reports — Exam Reports

> Single-subject and grand test examination analytics.

---

## Exam Reports Listing

**Route**: `/institute/reports/exams`

Filterable list of all exams across batches.

### Filters
- **Type**: Teacher / Institute / Grand Test
- **Batch**: All Batches or specific batch
- **Subject**: All Subjects or specific subject
- **Search**: By exam name

### Card Display
Each exam card shows:
- Exam name and type badge
- Batch, subject, date
- Class average / total marks
- Pass percentage with color coding

---

## ExamResultDetail (Single-Subject)

**Route**: `/institute/reports/exams/:examId`

Four-tab layout for single-subject exams:

### Insights Tab (Default)
- Overall statistics: class average, pass %, highest/lowest
- Score distribution histogram
- Key insights (auto-generated from data)

### Analytics Tab
- Question-level difficulty analysis
- Topic-wise breakdown
- Time analysis (if available)

### Questions Tab
- Individual question performance
- Correct/incorrect/skipped counts per question
- Difficulty classification

### Students Tab
- Ranked student list with scores
- PI-bucketed border colors
- Cross-link to Student360 Profile

---

## GrandTestResults (Multi-Subject)

**Route**: `/institute/reports/exams/grand/:examId`

Three-tab layout for grand tests (JEE/NEET pattern):

### Overview Tab (Default)
- Total score distribution
- Subject-wise contribution breakdown
- Overall class performance summary

### Leaderboard Tab
- Ranked student list with total and subject-wise scores
- Percentile display

### Subjects Tab
- Per-subject performance cards
- Subject-wise class averages and trends
- Expandable subject detail

### Grand Test Types
| Pattern | Subjects | Total Marks |
|---------|----------|-------------|
| JEE Pattern | Physics, Chemistry, Mathematics | 300 |
| NEET Pattern | Physics, Chemistry, Biology | 720 |
| Comprehensive | All 6 subjects | 600 |

---

## Data Flow

Exam data is generated per-batch using `generateExamsForBatch()` with seeded PRNG:
- 5 exams per subject (Unit Test 1–3, Mid-Term, Pre-Final)
- 3 grand tests per batch (JEE/NEET pattern + Comprehensive)
- Total: 32–48 exams per batch

---

*Last Updated: February 2025*
