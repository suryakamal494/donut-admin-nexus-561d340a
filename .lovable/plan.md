

## Institute Reports Documentation Audit — Phase-wise Plan

### Audit Summary

I compared all 4 documentation files against the actual implementation code. The docs exist and cover the right pages, but they are **surface-level descriptions** — they list what's displayed but never explain **how values are calculated**. A developer reading these docs cannot reproduce the logic without reading source code.

---

### Gap Analysis by Report Section

#### Phase 1: Batch Reports (`reports-batches.md`)

| What Docs Say | What's Actually in Code | Gap |
|---|---|---|
| "Overall average with trend indicator" | `overallAverage` is hardcoded per batch; `trend` is hardcoded as `"up"/"down"/"stable"` | Docs don't explain that `trendDiff = abs(overallAverage - previousAverage)` and how trend badge text is derived |
| "Color-coded border-left using PI bucketing" | Batch cards do NOT use PI border-left — they use a gradient strip + trend badge. PI borders are only on student cards | **Incorrect** — docs describe a feature that doesn't exist on batch cards |
| "At-risk student count" | `atRiskCount` is hardcoded per batch, not computed | Docs should clarify this is a static metric, or document the intended formula |
| Subject cards: "Class average and trend" | `SubjectOverviewCards.tsx`: shows `classAverage%`, trend badge with `trendDiff = abs(classAverage - previousAverage)` | Missing: trend badge calculation formula |
| "Exams Tab: Show more pattern: displays 10 exams initially" | `BatchExamsTab.tsx` renders ALL exams — no "Show more" pattern exists | **Incorrect** — docs describe pagination that isn't implemented |
| "Students Tab: Subject mini-bars (first 5 subjects, then +N)" | `BatchStudentsTab.tsx` renders ALL subject mini-bars with no 5-subject cap or "+N" | **Incorrect** — docs describe overflow logic that isn't in this component (it IS in `StudentReports.tsx` but not here) |
| "Students Tab: PI-bucketed border-left colors" | Correct — uses `getPerformanceColor(student.overallAverage)` for `border-l` | Missing: link to `getPerformanceColor()` thresholds |
| SubjectDetail: "Status badges: Strong (≥65%), Moderate (40–64%), Weak (<40%)" | Code: `rate >= 65 ? "strong" : rate >= 40 ? "moderate" : "weak"` | Correct but docs should reference `getStatusColor()` mapping |
| SubjectDetail: chapter data generation | `avgSuccessRate = clamp(subjectClassAverage + random(-15..+15), 20, 95)` | Missing: the formula for how `avgSuccessRate`, `examsCovering`, `topicCount`, `weakTopicCount` are computed |

**Missing from docs entirely:**
- `BatchStudentsTab` has search, sort (Name/Avg), and PI bucket summary pills — none documented
- `BatchExamsTab` has type filter chips (All/Teacher/Institute/Grand Test) — not documented
- Exam card `avgPercent = round((classAverage / totalMarks) * 100)` — not documented
- `ReportsLanding.tsx` aggregate stats: `totalStudents = sum(batch.totalStudents)`, `overallAvg = mean(batch.overallAverage)`, `totalAtRisk = sum(batch.atRiskCount)` — not documented anywhere

---

#### Phase 2: Exam Reports (`reports-exams.md`)

| What Docs Say | What's Actually in Code | Gap |
|---|---|---|
| "Insights Tab: Score distribution histogram" | Insights tab uses `VerdictBanner`, `PerformanceBands`, `TopicFlags`, `InsightCards` — no histogram in Insights tab (histogram is in Analytics tab) | **Incorrect** — score distribution is in Analytics, not Insights |
| "Insights Tab: Overall statistics: class average, pass %, highest/lowest" | `VerdictBanner` shows verdict text + stat pills; `PerformanceBands` shows student groupings; `TopicFlags` shows weak/strong topics | Docs describe generic stats but don't document the actual components or their formulas |
| ExamResultDetail reuses teacher module's `generateExamAnalyticsForBatch()` | Not mentioned in docs at all | Missing: explanation that institute exam detail delegates to teacher analytics engine |
| `computePerformanceBands()`, `computeTopicFlags()`, `generateVerdictSummary()` | These are the core calculation functions | Missing: band thresholds, topic flag logic, verdict generation rules |
| GrandTestResults: `Math.random()` used (not seeded) | `generateGrandTestData()` uses `Math.random()` — data is unstable across re-renders (mitigated by Map cache) | **Bug** documented nowhere — GrandTest subject scores flicker if cache is cleared |
| GrandTest: "Percentile display" in Leaderboard | No percentile calculation exists — only rank and percentage | **Incorrect** — docs describe percentile that doesn't exist |
| GrandTest: `marksPerSubject = round(totalMarks / subjectNames.length)` | This is how per-subject max marks are derived | Missing from docs |
| GrandTest: `percentage = round((totalScore / totalMarks) * 100)` | Student percentage formula | Missing from docs |
| "Data Flow" section mentions "5 exams per subject" | Code: `numExams = min(sub.totalExams, 5)` where `totalExams` varies 5-8 per subject | Partially correct but misleading |

**Missing from docs entirely:**
- `ExamResultDetail` has 4 tabs but docs don't explain what `DifficultyChart`, `CognitiveChart`, `QuestionGroupAccordion` show
- GrandTest Overview tab has: summary stat cards (Students, Avg Score, Pass Rate, Subjects) + subject score cards + Top 3 performers
- GrandTest Subjects tab has subject selector chips with per-subject student breakdown
- Exam type classification: Unit Tests → "teacher", Mid-Term/Pre-Final → "institute"
- `passPercentage = round(55 + random() * 35)` formula
- `classAverage` for exams: `clamp(subjectClassAverage + random(-10..+10), 25, 92)` as percentage, then `round((pct/100) * marks)`

---

#### Phase 3: Student Reports (`reports-students.md`)

| What Docs Say | What's Actually in Code | Gap |
|---|---|---|
| "Overall average with PI-bucketed color" | `getPerformanceColor(student.overallAverage)` — correct | Missing: explicit reference to `reportColors.ts` |
| "Subject mini-bars (first 5 subjects with 3-letter abbreviations, "+N" for extras)" | `StudentReports.tsx`: shows `sub.subjectName.slice(0, 3)` for first 5 + `+N` | Correct |
| Student360 "Overall average (large, color-coded)" | `overallAverage = round(mean(subject.average for each subject))` | Missing: the actual formula |
| "Weak Spots: Subjects with average < 50%" | Code: `student.subjects.filter(s => s.average < 50).sort(by lowest)` | Correct, but docs should show the actual threshold and sort |
| "Recent Performance Trend: Sparkline bar chart of last 10 exams" | `examHistory.slice(0, 10).reverse()` — takes newest 10, reverses for left-to-right chronological | Missing: slice + reverse logic |
| Exam History: "Show more: Displays 10 exams initially" | `INITIAL_EXAM_COUNT = 10`, toggle between 10 and all | Correct |
| "Name pool: 90 first names × 20 last names" | Code: 90 first names, 20 last names | Correct |
| Student `overallAverage` computation | `round(mean(subjectPerf[].average))` where each subject average = `clamp(subjectClassAverage + random(-20..+20), 15, 98)` | Missing: the generation formula |

**Missing from docs entirely:**
- `ExamHistoryEntry.percentage` = `clamp(subjectAverage + random(-15..+15), 10, 98)`, `score = round((pct/100) * totalMarks)`
- Subject card progress bar width = `sub.average + "%"`
- Trend sparkline bar height = `(exam.percentage / 100) * 64px`
- Subject Comparison animated bars use framer-motion `initial={{ width: 0 }}` → `animate={{ width: sub.average% }}`

---

### Implementation Plan — 3 Phases

#### Phase 1: Rewrite `reports-batches.md`

**Sections to add/fix:**
1. **ReportsLanding** — document aggregate stat formulas
2. **Batch Card** — fix: remove incorrect "PI border-left" claim, document gradient strip + trend badge formula
3. **BatchReportDetail > Subjects Tab** — document `SubjectOverviewCards` card layout and `trendDiff` calculation
4. **BatchReportDetail > Exams Tab** — fix: remove "Show more" claim, document filter chips and `avgPercent` formula
5. **BatchReportDetail > Students Tab** — fix: remove "+N" claim, document search/sort/bucket pills, document `getPerformanceColor()` usage
6. **SubjectDetail** — document chapter generation formulas (`avgSuccessRate`, `topicCount`, `weakTopicCount`, `status` thresholds)
7. **Calculation Reference** table at the bottom with all formulas

#### Phase 2: Rewrite `reports-exams.md`

**Sections to add/fix:**
1. **ExamReports Listing** — document filter system, card layout, `avgPercent` formula
2. **ExamResultDetail** — fix Insights tab description (VerdictBanner, PerformanceBands, TopicFlags, InsightCards), document Analytics tab (ScoreDistribution, DifficultyChart, CognitiveChart)
3. **GrandTestResults** — document Overview (stat cards + subject cards + top 3), Leaderboard (rank + subject badges, no percentile), Subjects (selector chips + per-subject breakdown)
4. **GrandTest data instability warning** — note `Math.random()` usage mitigated by Map cache
5. **Data Generation** — document exam type classification, marks assignment, `passPercentage` formula, grand test pattern selection logic
6. **Calculation Reference** table

#### Phase 3: Update `reports-students.md` + `reports-overview.md`

**`reports-students.md`:**
1. Document `overallAverage` generation formula
2. Document exam history entry generation formula
3. Document sparkline bar height calculation
4. Document Subject Comparison animation details
5. Add Calculation Reference table

**`reports-overview.md`:**
1. Add ReportsLanding stat formulas
2. Add cross-reference to `reportColors.ts` with full `getPerformanceColor()` thresholds
3. Add `getStatusColor()` mapping (strong→75, moderate→50, weak→0)
4. Document seeded PRNG algorithm details (`hashString` + LCG constants)

---

### Format Standard for All Docs

Each metric/card documented will follow this pattern:

```markdown
### Card/Component Name

**Displayed fields:**
- Field A: `formula or source`
- Field B: `formula or source`

**Color logic:** `getPerformanceColor(percentage)` → 4-tier mapping (see Overview)

**Interactions:** Tap → navigates to `/route/:id`
```

Calculation reference tables at the bottom of each doc:

```markdown
## Calculation Reference

| Metric | Formula | Source |
|--------|---------|--------|
| Batch Overall Avg | Hardcoded per batch definition | `reportsData.ts` L194 |
| Exam Avg % | `round((classAverage / totalMarks) × 100)` | `BatchExamsTab.tsx` L72 |
```

