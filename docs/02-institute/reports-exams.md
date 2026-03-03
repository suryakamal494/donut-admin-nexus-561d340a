# Institute Reports — Exam Reports

> Cross-batch exam analytics for single-subject tests and multi-subject grand tests.

---

## Routes

| Route | Page | Component |
|-------|------|-----------|
| `/institute/reports/exams` | Exam listing with filters | `ExamReports.tsx` |
| `/institute/reports/exams/:examId` | Single-subject exam detail | `ExamResultDetail.tsx` |
| `/institute/reports/exams/:examId/grand-test` | Multi-subject grand test | `GrandTestResults.tsx` |

---

## 1. Exam Reports Listing

**Component:** `ExamReports.tsx`  
**Data source:** `getInstituteExams()` → `reportsData.ts`

### Filters

Four independent filters applied in sequence:

1. **Type chips** — horizontal scroll row of rounded pills:
   - `All` | `Teacher` | `Institute` | `Grand Test`
   - Count badge: `(N)` where N = `allExams.filter(e => e.type === chipKey).length`
   - Chips with zero count are hidden (except "All")

2. **Batch dropdown** — `<select>` populated from `getInstituteBatchReports()`
   - Options: `All Batches` + `{className} {batchName}` per batch

3. **Subject dropdown** — `<select>` populated from unique non-grand-test subjects
   - Grand test exams matched if `subjectNames` array includes selected subject

4. **Search** — case-insensitive substring match on `examName`

**Sort order:** Filtered results sorted by `date` descending (newest first).

### Exam Card Layout

Each card displays:

| Field | Formula / Source |
|-------|-----------------|
| **Exam Name** | `exam.examName` — truncated with `truncate` |
| **Type Badge** | Color-coded pill: Teacher (blue), Institute (purple), Grand Test (amber) |
| **Batch** | `exam.batchName` — e.g. `"10A"` (className digit + batchName letter) |
| **Subject** | Single-subject: `exam.subject`. Grand test: `exam.subjectNames.join(", ")` |
| **Date** | `new Date(exam.date).toLocaleDateString("en-IN", { day, month: "short", year: "2-digit" })` |
| **Avg %** | `Math.round((exam.classAverage / exam.totalMarks) × 100)` — bold, right-aligned |
| **Pass %** | `exam.passPercentage` — small text below avg |

### Exam Type Classification

| Exam Name Pattern | Type Value | Badge |
|-------------------|-----------|-------|
| Unit Test 1/2/3 | `"teacher"` | Blue |
| Mid-Term, Pre-Final | `"institute"` | Purple |
| Grand Test 1/2, Comprehensive | `"grand_test"` | Amber |

**Click behavior:**
- Grand test → navigates to `/institute/reports/exams/:examId/grand-test`
- All others → navigates to `/institute/reports/exams/:examId`

---

## 2. ExamResultDetail (Single-Subject)

**Component:** `ExamResultDetail.tsx`  
**Data pipeline:**

```
examEntry = getInstituteExams().find(e => e.examId === examId)
         ↓
analytics = generateExamAnalyticsForBatch(examId, examName, totalMarks, batchId)
         ↓
bands     = computePerformanceBands(analytics.allStudents)
topicFlags = computeTopicFlags(analytics.questionAnalysis)
verdict   = generateVerdictSummary(analytics, bands, topicFlags)
```

> **Key architecture note:** The institute exam detail page delegates entirely to the **teacher analytics engine** (`src/data/teacher/examResults.ts`). It does not have its own analytics generator — it calls `generateExamAnalyticsForBatch()` with the institute exam entry's parameters.

### Four-Tab Layout

```
[ Insights ] [ Analytics ] [ Questions ] [ Students ]
```

Grid: `grid-cols-4` on mobile, `sm:flex` on desktop.

---

### 2.1 Insights Tab (Default)

Four components rendered in order:

#### VerdictBanner

**Component:** `VerdictBanner.tsx`  
**Visual:** Gradient banner (`bg-gradient-to-r from-teal-500 to-cyan-500`), white text.

**Displayed fields:**
- Exam name (small, `text-white/70`)
- Batch name (smaller, `text-white/50`)
- Headline: `"Class average {averagePercentage}% | {passedCount} of {totalAttempted} passed"`

**Insight pills** (rendered as `bg-white/20 backdrop-blur-sm` rounded pills):

| Pill | Condition | Content |
|------|-----------|---------|
| At Risk | `atRiskCount > 0` | `⚠ {atRiskCount} at risk` |
| Weak Topics | `weakTopicCount > 0` | `📖 {weakTopicCount} weak topic(s)` |
| Top Student | `topStudent !== null` | `🏆 Top: {firstName} {percentage}%` |
| Average | Always shown | `📈 Avg {averagePercentage}%` |

**Calculation formulas (`generateVerdictSummary`):**

| Field | Formula |
|-------|---------|
| `averagePercentage` | `round(mean(allStudents[].percentage))` |
| `passedCount` | `round(attemptedCount × passPercentage / 100)` |
| `totalAttempted` | `analytics.attemptedCount` (= `allStudents.length`) |
| `atRiskCount` | `bands['risk'].count + bands['reinforcement'].count` |
| `weakTopicCount` | `topicFlags.filter(t => t.status === 'weak').length` |
| `topStudent` | `allStudents[0]` (pre-sorted by score descending) |

#### PerformanceBands

**Component:** `PerformanceBands.tsx`  
**Visual:** Collapsible cards with left-border color coding. Risk & Reinforcement bands expanded by default.

**Band definitions (`computePerformanceBands`):**

| Band | Key | Threshold | Border Color | Dot Color |
|------|-----|-----------|-------------|-----------|
| Mastery Ready | `mastery` | `percentage >= 75` | Emerald | `bg-emerald-500` |
| Stable Progress | `stable` | `50 <= percentage < 75` | Teal | `bg-teal-500` |
| Reinforcement Needed | `reinforcement` | `35 <= percentage < 50` | Amber | `bg-amber-500` |
| Foundational Risk | `risk` | `percentage < 35` | Red | `bg-red-500` |

Each band header shows: colored dot + label + count badge. Expanding reveals student rows with `name`, `rollNumber`, `score/maxScore`, `percentage`.

Bands with zero students are hidden.

#### TopicFlags

**Component:** `TopicFlags.tsx`  
**Visual:** Horizontal scroll on mobile (`sm:hidden`), flex-wrap on desktop.

**Classification (`computeTopicFlags`):**

| Status | Threshold | Pill Style |
|--------|-----------|-----------|
| Strong | `successRate >= 75` | Green bg + border |
| Moderate | `50 <= successRate < 75` | Amber bg + border |
| Weak | `successRate < 50` | Red bg + border + ⚠ icon |

Each pill shows: `{topic} {successRate}%`

> One TopicFlag per question — each question maps to one topic.

#### InsightCards

**Component:** `InsightCards.tsx`  
**Visual:** Two-column grid of `card-premium` cards with left border accents.

| Card | Selection Logic | Border |
|------|----------------|--------|
| Hardest Question | `questions.sort(asc by successRate)[0]` | `border-l-red-400` |
| Most Skipped | `questions.sort(desc by unattempted)[0]` | `border-l-amber-400` |

Each card shows: question number, topic, and the key metric.  
Most Skipped card only renders if `unattempted > 0`.

---

### 2.2 Analytics Tab

Three chart components:

#### Score Distribution Bar Chart

**Inline in `ExamResultDetail.tsx`**  
**Visual:** Vertical bar chart (Recharts `BarChart`) with 4 color-coded bars.

**Score ranges:**

| Range | Formula | Color |
|-------|---------|-------|
| 0–25% | `0 to maxScore × 0.25` | `#22c55e` (green) |
| 25–50% | `maxScore × 0.25 to × 0.5` | `#f59e0b` (amber) |
| 50–75% | `maxScore × 0.5 to × 0.75` | `#ef4444` (red) |
| 75–100% | `maxScore × 0.75 to maxScore` | `#6b7280` (gray) |

**Count per range:** `students.filter(r => r.score >= range.min && r.score < range.max).length`  
**Percentage:** `round((count / attemptedCount) × 100)`

#### DifficultyChart

**Component:** `DifficultyChart.tsx`  
**Visual:** Vertical bar chart showing class average accuracy per difficulty level.

**Grouping logic:**

```
For each question:
  key = "Easy" if difficulty === "easy", "Medium" if "medium", "Hard" if "hard"
  groups[key].total += 1
  groups[key].successSum += question.successRate

Bar value = round(successSum / total)  // Average accuracy per difficulty
```

**Colors:** Easy = `hsl(142, 71%, 45%)`, Medium = `hsl(38, 92%, 50%)`, Hard = `hsl(0, 84%, 60%)`

**Difficulty auto-classification (`generateQuestionAnalysis`):**

| Classification | Rule |
|---------------|------|
| Easy | `successRate > 65` |
| Medium | `40 < successRate <= 65` |
| Hard | `successRate <= 40` |

#### CognitiveChart

**Component:** `CognitiveChart.tsx`  
**Visual:** Horizontal bar chart (layout="vertical") showing accuracy by cognitive type.

**Cognitive types:** `Logical`, `Analytical`, `Conceptual`, `Numerical`, `Application`, `Memory`

**Grouping logic:** Same as DifficultyChart — `round(successSum / total)` per type.

**Assignment:** Questions assigned cognitive types round-robin: `cognitiveTypes[i % 6]`

**Colors:**

| Type | Color |
|------|-------|
| Logical | `hsl(221, 83%, 53%)` |
| Analytical | `hsl(262, 83%, 58%)` |
| Conceptual | `hsl(142, 71%, 45%)` |
| Numerical | `hsl(38, 92%, 50%)` |
| Application | `hsl(0, 84%, 60%)` |
| Memory | `hsl(186, 72%, 44%)` |

**Sort order:** Ascending by accuracy (weakest type first).

---

### 2.3 Questions Tab

**Component:** `QuestionGroupAccordion.tsx`  
**Visual:** Accordion with questions grouped into 4 accuracy bands.

**Accuracy bands:**

| Band | Key | Range | Icon | Border Color |
|------|-----|-------|------|-------------|
| Needs Reteaching | `reteach` | `0–35%` | ✕ (XCircle) | Red |
| Review Recommended | `review` | `35–50%` | ⚠ (AlertTriangle) | Amber |
| Satisfactory | `satisfactory` | `50–75%` | ℹ (AlertCircle) | Teal |
| Well Understood | `well-understood` | `75–100%` | ✓ (CheckCircle) | Emerald |

**Default expanded:** The first two non-empty bands (worst-performing first).

**Within each band:** Questions sorted ascending by `successRate`.

Each question rendered via `QuestionAnalysisCard` showing:
- Question number and topic
- Success rate, correct/incorrect/unattempted counts
- Average time, difficulty badge, cognitive type

---

### 2.4 Students Tab

**Component:** `StudentResultRow.tsx` (from teacher module)  
**Visual:** Flat list of all students in `divide-y` layout.

**Per-student row:**
- Student name (truncated)
- Roll number
- Score / Max Score
- Percentage
- Rank

**Sort order:** Pre-sorted by score descending (rank 1 = highest).

**Student score generation (`generateStudentResults`):**

```
score = floor(random() × maxScore × 0.6) + floor(maxScore × 0.3)
percentage = round((score / maxScore) × 100)
```

> ⚠ **Data stability note:** `generateExamAnalyticsForBatch()` uses **unseeded `Math.random()`**. Student data is regenerated on each call. Stability depends on the component's `useMemo` caching — data remains consistent within a single mount but may change on remount.

---

## 3. GrandTestResults (Multi-Subject)

**Component:** `GrandTestResults.tsx`  
**Data source:** `generateGrandTestData()` — inline generator with `Map` cache.

### Overall Summary Banner

**Visual:** Animated (`framer-motion`) gradient banner using `getPerformanceColor(overallPct)`.

**Displayed fields:**

| Field | Formula |
|-------|---------|
| Overall Avg % | `round((data.classAverage / data.totalMarks) × 100)` |
| Batch name | From exam entry |
| Highest | `leaderboard[0].totalScore` (after sort) |
| Lowest | `leaderboard[last].totalScore` |
| Pass % | From exam entry `passPercentage` |

**Banner color:** Determined by `getPerformanceColor(overallPct)` — see `reportColors.ts`.

### Three-Tab Layout

```
[ Overview ] [ Leaderboard ] [ Subjects ]
```

Grid: `grid-cols-3` on mobile, `sm:flex` on desktop.

---

### 3.1 Overview Tab (Default)

#### Summary Stat Cards

2×2 grid on mobile, 4-col on `sm`:

| Card | Value |
|------|-------|
| Students | `data.totalStudents` |
| Avg Score | `{classAverage}/{totalMarks}` |
| Pass Rate | `{passPercentage}%` |
| Subjects | `data.subjects.length` |

#### Subject-wise Performance Cards

Grid: 1-col mobile, 2-col `sm`, 3-col `lg`. Staggered animation (`delay: i × 0.05`).

Each card:

| Field | Formula |
|-------|---------|
| Subject name | With colored dot (`hsl(subjectColor)`) |
| Percentage badge | `round((classAverage / totalMarks) × 100)` — PI-colored via `getPerformanceColor()` |
| Stats row | `Avg: {classAverage}/{totalMarks}`, `High: {highest}`, `Pass: {passPercentage}%` |
| Progress bar | Width = `{pct}%`, color = `getPerformanceColor(pct).bg` |
| Left border | 4px, color = `getPerformanceColor(pct).border` |

**Subject score generation:**

```
marksPerSubject = round(totalMarks / subjectNames.length)

For each subject:
  classAverage = round(marksPerSubject × (0.45 + random() × 0.3))
  highest = min(marksPerSubject, round(classAverage + marksPerSubject × 0.2 + random() × 10))
  lowest = max(0, round(classAverage - marksPerSubject × 0.3 - random() × 10))
  passPercentage = round(55 + random() × 30)
```

#### Top 3 Performers

Shows `leaderboard.slice(0, 3)` with medal colors:
- Rank 1: `text-amber-500` (gold)
- Rank 2: `text-slate-400` (silver)
- Rank 3: `text-amber-700` (bronze)

Per-student: name, roll number, per-subject scores (3-letter abbreviations), total percentage, total score.

---

### 3.2 Leaderboard Tab

**Visual:** Full leaderboard in `card-premium` with `divide-y` rows.

**Per-student row:**
- Rank number
- Name (truncated)
- Subject score badges: `{subject.slice(0,3)} {score}` — each badge colored via `getPerformanceColor(round((score/max)×100))`
- Total percentage (PI-colored text)
- Total score / max

**Left border:** 3px, PI-colored via `getPerformanceColor(student.percentage).border`

**Student score generation:**

```
For each student:
  For each subject:
    score = clamp(round(subjectClassAverage + (random() - 0.5) × totalMarks × 0.6), 0, marksPerSubject)
  totalScore = sum(subjectScores[].score)
  percentage = round((totalScore / totalMarks) × 100)

Sort: descending by totalScore
Rank: index + 1
```

> **No percentile calculation exists.** Only rank and percentage are shown.

---

### 3.3 Subjects Tab

**Subject selector chips:** Horizontal scroll row. Selected chip uses `backgroundColor: hsl(subjectColor)` with white text; unselected uses `bg-muted`.

**No selection state:** Placeholder with icon + "Select a subject above to view detailed breakdown".

**Selected subject view:**

1. **Subject summary card** — Left border colored by `hsl(subjectColor)`:
   - 2×2 grid on mobile, 4-col on `sm`: Average, Highest, Lowest, Pass Rate

2. **Subject rankings** — `card-premium` with sorted student list:
   - Sorted by subject score descending
   - Per-student: rank, name, progress bar (`width: {pct}%`, PI-colored), score/max
   - Progress bar: 16px wide (`w-16 h-1.5`)

---

## 4. Data Generation Architecture

### Exam Generation (`generateExamsForBatch`)

**Seeded PRNG:** `seededRandom(hashString(batchId + "-exams"))`

**Per-subject exams:**

```
examTypes = ["Unit Test 1", "Unit Test 2", "Unit Test 3", "Mid-Term", "Pre-Final"]
numExams = min(subject.totalExams, examTypes.length)

For each exam:
  marks = 30 if "Unit" in name, else 100
  avgPct = clamp(subjectClassAverage + floor(rand() × 20) - 10, 25, 92)
  classAverage = round((avgPct / 100) × marks)
  passPercentage = round(55 + rand() × 35)
  type = "institute" if "Mid" or "Pre" in name, else "teacher"
  date = "2025-{month}-{day}" where month = i+1, day = 10 + i×5
```

### Grand Test Generation

**Pattern selection:** Based on whether batch has Biology:

| Has Biology? | Grand Tests Created |
|-------------|-------------------|
| Yes | 2× NEET Pattern (P/C/Bio, 720 marks) + 1× Comprehensive |
| No | 2× JEE Pattern (P/C/M, 300 marks) + 1× Comprehensive |

**Comprehensive:** All subjects (max 6), marks = `subjectCount × 100`

```
For each grand test:
  avgPct = clamp(batchOverallAverage + floor(rand() × 16) - 8, 35, 85)
  classAverage = round((avgPct / 100) × totalMarks)
  passPercentage = round(50 + rand() × 35)
  date = "2025-{month}-01" where month = 3 + i×2
```

### Single-Subject Analytics Generation

**Function:** `generateExamAnalyticsForBatch()` (teacher module)

```
totalStudents = floor(random() × 15) + 18  // 18–32 students
```

> ⚠ Uses **unseeded `Math.random()`** — results are non-deterministic. Mitigated by `useMemo` in component preventing re-generation during the same mount.

**Question analysis generation:**

```
For each of 10 questions:
  successRate = floor(random() × 70) + 15  // 15–84%
  correct = round(totalStudents × successRate / 100)
  unattempted = floor(random() × 4)  // 0–3
  incorrect = totalStudents - correct - unattempted
  averageTime = floor(random() × 80) + 30  // 30–109 seconds
  difficulty = successRate > 65 ? "easy" : successRate > 40 ? "medium" : "hard"
  cognitiveType = cognitiveTypes[i % 6]
```

**Pass threshold:** `passingScore = maxScore × 0.4` (40%)

**Score distribution ranges:**

| Range | Min | Max |
|-------|-----|-----|
| Band 1 | `0` | `maxScore × 0.25` |
| Band 2 | `maxScore × 0.25` | `maxScore × 0.5` |
| Band 3 | `maxScore × 0.5` | `maxScore × 0.75` |
| Band 4 | `maxScore × 0.75` | `maxScore` |

### Grand Test Data Stability

**Generator:** `generateGrandTestData()` — inline in `GrandTestResults.tsx`

- Uses **unseeded `Math.random()`** for subject scores and student scores
- Cached in module-level `Map<string, GrandTestData>` keyed by `examId`
- Cache persists for the browser session (SPA — no page reload)
- **Risk:** If cache is cleared (e.g., hot module reload in dev), data will regenerate with different values

---

## 5. Calculation Reference

| Metric | Formula | Source File |
|--------|---------|-------------|
| Exam Card Avg % | `round((classAverage / totalMarks) × 100)` | `ExamReports.tsx` L151 |
| Exam Pass % | `round(55 + rand() × 35)` (seeded) | `reportsData.ts` L321 |
| Exam Class Avg (marks) | `round((clamp(subjectAvg ± 10, 25, 92) / 100) × marks)` | `reportsData.ts` L307-308 |
| Exam Type | `"Mid"/"Pre" → institute, else → teacher` | `reportsData.ts` L316 |
| Unit Test Marks | `30` | `reportsData.ts` L306 |
| Mid-Term/Pre-Final Marks | `100` | `reportsData.ts` L306 |
| Student Score (single-subject) | `floor(random() × maxScore × 0.6) + floor(maxScore × 0.3)` | `examResults.ts` L182 |
| Student Percentage | `round((score / maxScore) × 100)` | `examResults.ts` L192 |
| Pass Threshold | `maxScore × 0.4` | `examResults.ts` L309 |
| Pass Count | `students.filter(score >= passingScore).length` | `examResults.ts` L310 |
| Actual Pass % | `round((passCount / attemptedCount) × 100)` | `examResults.ts` L338 |
| Verdict Avg % | `round(mean(allStudents[].percentage))` | `examResults.ts` L148-149 |
| Verdict At-Risk | `risk.count + reinforcement.count` | `examResults.ts` L141-142 |
| Band: Mastery | `percentage >= 75` | `examResults.ts` L115 |
| Band: Stable | `50 <= percentage < 75` | `examResults.ts` L116 |
| Band: Reinforcement | `35 <= percentage < 50` | `examResults.ts` L117 |
| Band: Risk | `percentage < 35` | `examResults.ts` L118 |
| Topic Flag: Strong | `successRate >= 75` | `examResults.ts` L132 |
| Topic Flag: Moderate | `50 <= successRate < 75` | `examResults.ts` L132 |
| Topic Flag: Weak | `successRate < 50` | `examResults.ts` L132 |
| Q Difficulty: Easy | `successRate > 65` | `examResults.ts` L288 |
| Q Difficulty: Medium | `40 < successRate <= 65` | `examResults.ts` L288 |
| Q Difficulty: Hard | `successRate <= 40` | `examResults.ts` L288 |
| Q Accuracy Band: Reteach | `0–35%` | `QuestionGroupAccordion.tsx` L22-27 |
| Q Accuracy Band: Review | `35–50%` | `QuestionGroupAccordion.tsx` L35-39 |
| Q Accuracy Band: Satisfactory | `50–75%` | `QuestionGroupAccordion.tsx` L48-52 |
| Q Accuracy Band: Well Understood | `75–100%` | `QuestionGroupAccordion.tsx` L61-66 |
| Grand Test: Marks Per Subject | `round(totalMarks / subjectNames.length)` | `GrandTestResults.tsx` L71 |
| Grand Test: Subject Avg | `round(marksPerSubject × (0.45 + random() × 0.3))` | `GrandTestResults.tsx` L74 |
| Grand Test: Subject Highest | `min(max, round(avg + max × 0.2 + random() × 10))` | `GrandTestResults.tsx` L79 |
| Grand Test: Subject Lowest | `max(0, round(avg - max × 0.3 - random() × 10))` | `GrandTestResults.tsx` L80 |
| Grand Test: Subject Pass % | `round(55 + random() × 30)` | `GrandTestResults.tsx` L81 |
| Grand Test: Student Score | `clamp(round(subjectAvg + (random()-0.5) × max × 0.6), 0, max)` | `GrandTestResults.tsx` L103-105 |
| Grand Test: Student Total | `sum(subjectScores[].score)` | `GrandTestResults.tsx` L109 |
| Grand Test: Student % | `round((totalScore / totalMarks) × 100)` | `GrandTestResults.tsx` L116 |
| Grand Test: Overall Avg % | `round((examEntry.classAverage / totalMarks) × 100)` | `GrandTestResults.tsx` L185 |

---

*Last Updated: March 2026*
