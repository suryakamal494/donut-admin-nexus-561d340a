

## Your Pain Point — My Understanding

**The problem:** Teachers currently see student performance only in fragmented, per-exam or per-chapter slices. If a teacher wants to understand "How is Aarav Sharma doing overall in my subject across all chapters and exams in this batch?", there's no single place to get that answer. They'd have to manually click through each chapter report and each exam result, mentally stitching together patterns. There's no student-centric view — everything is exam-centric or chapter-centric.

**What you need:** A Student Profile Report page within the Reports section that gives teachers a complete, actionable landscape of a single student's performance across all chapters and exams in that batch. After reading it, the teacher should immediately know: What are this student's strengths? Where are they struggling? Are they improving or declining? And then take action — generate targeted homework.

---

## What Data We Already Track (Per Student)

From the codebase analysis, here's what we can aggregate per student across exams:

| Data Point | Source | Available |
|---|---|---|
| Score, percentage, rank per exam | `examResults.ts` → `StudentResult` | ✓ |
| Question-wise correct/incorrect/unattempted per exam | `QuestionResult` in `examResults.ts` | ✓ |
| Topic-wise success rate per exam | `QuestionAnalysis` (topic + subject + successRate) | ✓ |
| Difficulty tagging (easy/medium/hard) per question | `QuestionAnalysis.difficulty` | ✓ |
| Cognitive type tagging (Logical/Analytical/Conceptual/Numerical/Application/Memory) | `testResultsGenerator.ts` → `EnhancedQuestionResult.cognitiveType` | ✓ (student module, needs mirroring for teacher) |
| Time taken per exam | `StudentResult.timeTaken` | ✓ |
| Performance Index (PI), consistency, trend, secondary tags | `performanceIndex.ts` → `computeStudentPI()` | ✓ |
| Chapter-wise performance buckets | `reportsData.ts` → `ChapterStudentEntry` | ✓ |

**Not currently tracked but can be derived:** Difficulty-wise accuracy breakdown per student, cognitive-type-wise accuracy per student, chapter-wise trend over time.

---

## Proposed Design: Student Report Page

**Route:** `/teacher/reports/:batchId/students/:studentId`

**Entry point:** New "Students" tab in BatchReport (alongside Chapters and Exams) → list of all students → click → Student Report page

### Page Layout (Mobile-First)

**Section 1: Student Header Card**
- Name, roll number, batch
- Overall accuracy % (large), exam count
- Trend arrow (up/down/flat) + secondary tags (e.g., "Improving", "Speed Issue")
- `Generate Homework` button (opens AI Homework dialog pre-filled with student's weak areas)

**Section 2: Chapter Mastery Grid**
- Color-coded cards (emerald/amber/red) for each chapter
- Shows: chapter name, avg success rate, exams attempted, trend
- This is the core "landscape" view — teacher instantly sees which chapters are strong/weak
- Tapping a chapter scrolls to or expands its topic breakdown

**Section 3: Exam History Timeline**
- Chronological list of all exams the student appeared in (within this batch)
- Each row: exam name, date, score/max, percentage, rank
- A small sparkline or trend line showing percentage over time
- Clicking an exam → navigates to the exam results page (already built)

**Section 4: Difficulty Analysis (Collapsible)**
- Bar chart or simple grid: Easy / Medium / Hard
- For each: questions attempted, accuracy %, time per question
- Highlights if student is "only good at easy" or "struggles with hard"

**Section 5: Topic-Level Weak Spots**
- Aggregated across all exams — which topics does this student consistently get wrong?
- Sorted by weakness (lowest success rate first)
- Each topic shows: chapter it belongs to, questions asked, accuracy
- This directly feeds the "Generate Homework" action

### The "Generate Homework" Flow
- Pre-fills the existing `AIHomeworkGeneratorDialog` with:
  - Batch ID
  - Subject (teacher's subject)
  - Instructions auto-populated with weak topics and difficulty focus
  - e.g., "Focus on [Projectile Motion, Wave Optics, Entropy] at medium-hard difficulty for remediation"

---

## Implementation Plan

### 1. Data Layer: `src/data/teacher/studentReportData.ts` (new file)
- Define `StudentBatchProfile` interface aggregating all exam data for one student in one batch
- Create `getStudentBatchProfile(studentId, batchId)` that:
  - Collects all exams for the batch
  - Finds the student's results across each exam
  - Computes chapter-wise success rates by mapping questions → topics → chapters
  - Computes difficulty breakdown (easy/medium/hard accuracy)
  - Runs `computeStudentPI()` for trend and tags
  - Computes topic-level weak spots sorted by accuracy ascending
  - Caches results in a Map (same pattern as other data files)

### 2. Data Layer: Add student roster to `reportsData.ts`
- Create `getBatchStudentRoster(batchId)` that returns a list of all students in the batch with summary metrics (name, roll, avg %, trend, PI bucket)
- Used by the "Students" tab in BatchReport

### 3. UI: Add "Students" tab to `src/pages/teacher/BatchReport.tsx`
- Third tab alongside "Chapters" and "Exams"
- Shows a searchable list of students with: name, roll number, avg %, trend badge, PI bucket badge
- Click → navigates to `/teacher/reports/:batchId/students/:studentId`
- InfoTooltip explaining the student list

### 4. UI: New page `src/pages/teacher/StudentReport.tsx`
- Route: `reports/:batchId/students/:studentId`
- Breadcrumbs: Reports → Batch → Student Name
- Sections as described above (Header, Chapter Grid, Exam History, Difficulty, Weak Topics)
- Mobile-first: single-column stack, collapsible cards for Difficulty/Topics
- "Generate Homework" button in header → opens `AIHomeworkGeneratorDialog` with prefill

### 5. Route: `src/routes/TeacherRoutes.tsx`
- Add: `reports/:batchId/students/:studentId` → lazy-loaded `StudentReport`

### Files to create/modify:
| File | Change |
|---|---|
| `src/data/teacher/studentReportData.ts` | **New** — student profile data aggregation + caching |
| `src/data/teacher/reportsData.ts` | Add `getBatchStudentRoster()` |
| `src/pages/teacher/StudentReport.tsx` | **New** — full student report page |
| `src/pages/teacher/BatchReport.tsx` | Add "Students" tab |
| `src/routes/TeacherRoutes.tsx` | Add student report route |

