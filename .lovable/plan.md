

## Phase 8: Mock Data Layer + Documentation — Implementation Plan

### Scalability Audit Summary

**Current gaps identified:**

| Area | Current State | Scalability Issue |
|------|--------------|-------------------|
| **Subjects per batch** | 3 subjects (Physics, Chemistry, Mathematics) | Real institutes have 6-7+ subjects (add English, Hindi, Biology, etc.) |
| **Batches** | 4 batches across 3 classes | Need more batches per class and more classes |
| **Exams per batch** | 3-5 exams | Real institutes run 15-25+ exams per subject per year |
| **Student names** | 45 hardcoded names | Pool exhausts at 45; needs seeded random generation |
| **Chapter names** | Only Physics/Chemistry/Math have chapter lists | New subjects have no chapter data |
| **Grand tests** | Only JEE (3 subjects) and NEET (3 subjects) | Need grand tests with 4-6 subject combinations |
| **Student360 exam history** | Uses `Math.random()` without seeding | Scores change on re-render (partially mitigated by cache but `generateExamHistory` in StudentProfile360.tsx is uncached) |
| **StudentReports list** | No "Show more" pattern | 160+ students render at once |
| **Documentation** | No institute reports docs exist | Missing from `docs/02-institute/` and `docsNavigation.ts` |

---

### Implementation Steps

#### Task 1: Expand `reportsData.ts` mock data for scalability

- **Add subjects**: English, Hindi, Biology to relevant batches (6-7 subjects per batch instead of 3)
- **Add batches**: Class 10C, Class 11B, Class 12B (7-8 total batches)
- **Add SUBJECT_COLORS** entries for all new subjects
- **Add chapter name mappings** for Biology, English, Hindi in `getSubjectDetail()`
- **Expand exam listings**: Add 30-40 exams total (unit tests, mid-terms per subject per batch)
- **Add grand tests with expanded subjects**: Grand tests covering 4+ subjects
- **Use seeded pseudo-random** in `generateStudentsForBatch()` — replace `Math.random()` with a deterministic seed based on `batchId + index` so data stays stable without relying solely on cache
- **Expand name pool** to 80+ names using a generator pattern instead of a hardcoded array

#### Task 2: Fix `StudentProfile360.tsx` render stability

- Move `generateExamHistory()` into `reportsData.ts` with Map caching (same pattern as other generators)
- Use seeded random for score generation to eliminate flicker on re-render

#### Task 3: Add "Show more" pattern to `StudentReports.tsx`

- Default display: 20 students
- "Show more" button loads next 20
- Consistent with the project's existing scalability pattern (per memory: `reports-list-scalability`)

#### Task 4: Create documentation files

**`docs/02-institute/reports-overview.md`**
- Navigation map (ReportsLanding → Batch Reports / Exam Reports / Student Reports)
- Design principles (mobile-first, PI-based bucketing, Map-cached data)
- Color standards and PI formula reference

**`docs/02-institute/reports-batches.md`**
- BatchReports listing (grouped by class)
- BatchReportDetail tabs: Subjects, Exams, Students
- SubjectDetail drilldown with chapter analysis
- Cross-linking to Student360

**`docs/02-institute/reports-exams.md`**
- ExamReports listing with type/batch/subject filters
- ExamResultDetail (single-subject): Insights, Analytics, Questions, Students tabs
- GrandTestResults (multi-subject): Overview, Leaderboard, Subjects tabs

**`docs/02-institute/reports-students.md`**
- StudentReports listing with search, batch filter, PI buckets
- Student360 profile: Subjects, Exam History, Analysis tabs
- Weak spots detection logic
- Cross-linking from BatchStudentsTab

#### Task 5: Update `docsNavigation.ts`

Add under Institute Portal items, after "Exams":
```
{
  title: "Reports",
  path: "02-institute/reports-overview",
  children: [
    { title: "Overview", path: "02-institute/reports-overview" },
    { title: "Batch Reports", path: "02-institute/reports-batches" },
    { title: "Exam Reports", path: "02-institute/reports-exams" },
    { title: "Student Reports", path: "02-institute/reports-students" },
  ],
}
```

---

### Technical Notes

- **Seeded random**: Will use a simple hash-based PRNG (`(seed * 16807) % 2147483647`) to replace `Math.random()` calls, ensuring deterministic data generation keyed on entity IDs
- **No UI component changes needed** for scalability — the existing card grids, filters, and tabs already handle variable-length arrays; the issue is purely insufficient mock data
- **GrandTestResults.tsx** already uses Map caching — no changes needed there; just add more grand test entries with wider subject coverage
- **File changes**: 3 modified files (`reportsData.ts`, `StudentProfile360.tsx`, `StudentReports.tsx`, `docsNavigation.ts`), 4 new documentation files

