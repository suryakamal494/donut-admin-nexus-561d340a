# Institute Reports — Overview

> Navigation map, design principles, and scalability standards.

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
│   └── GrandTestResults (/institute/reports/exams/grand/:examId) — multi-subject
└── Student Reports (/institute/reports/students)
    └── Student360 Profile (/institute/reports/students/:studentId)
```

---

## Design Principles

### Mobile-First
- All report pages are designed for mobile (390×844) first, then scale up
- Card-based layout with border-left accent colors
- Touch-friendly tap targets (minimum 44px)
- "Show more" pattern for lists exceeding 20 items

### Performance Index (PI) Bucketing
Students and subjects are classified into 4 tiers based on percentage:

| Tier | Range | Color | Tailwind |
|------|-------|-------|----------|
| Mastery Ready | ≥ 75% | Emerald | `border-emerald-500` |
| Stable Progress | 50–74% | Teal | `border-teal-500` |
| Reinforcement Needed | 35–49% | Amber | `border-amber-500` |
| Foundational Risk | < 35% | Red | `border-red-500` |

Color logic is centralized in `src/lib/reportColors.ts` via `getPerformanceColor()`.

### Data Stability
All mock data generators use:
- **Map-based caching** — prevents regeneration on re-render
- **Seeded PRNG** — deterministic `hashString()` + LCG ensures same data across sessions
- No `Math.random()` in any data generator

---

## Data Layer

Source: `src/data/institute/reportsData.ts`

### Scale Targets
| Dimension | Count |
|-----------|-------|
| Batches | 7 (3 classes × 2-3 batches) |
| Subjects per batch | 6–7 |
| Students per batch | 34–45 |
| Total students | ~270 |
| Exams per batch | 32–48 |
| Grand tests per batch | 3 |
| Chapter mappings | 6–8 per subject |

### Exports
- `getInstituteBatchReports()` — all batch summaries
- `getInstituteExams()` — all exam entries
- `getAllStudents()` / `getStudentsByBatch()` — student summaries
- `getStudentExamHistory()` — cached exam history per student
- `getSubjectDetail()` — chapter analysis per subject per batch

---

*Last Updated: February 2025*
