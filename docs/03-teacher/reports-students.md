# Reports — Students Tab & Generate Homework

> Student-level performance analytics with chapter mastery, exam history, difficulty analysis, and AI-powered homework generation across three locations.

---

## Overview

The **Students** tab within the Batch Report provides an individual student roster with PI-based bucketing. Each student drills down into a comprehensive Student Profile page showing chapter mastery, exam history, difficulty analysis, and weak topics. The **Generate Homework** feature appears in three different locations across the Reports module, each pre-filling different context based on the source.

## Access

- **Route (Students listing)**: `/teacher/reports/:batchId` → Students tab
- **Route (Student Profile)**: `/teacher/reports/:batchId/students/:studentId`
- **Login Types**: Teacher
- **Permissions Required**: Teacher account with assigned batches

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| `StudentsTab` | Searchable student roster with PI bucket badges | Batch Report → Students tab |
| `StudentHeaderCard` | Overall accuracy, trend, tags, consistency, weak chapters | Student Profile → Top |
| `ChapterMasteryCard` | Color-coded chapter card with expandable topics | Student Profile → Below header |
| `ExamHistoryTimeline` | Chronological exam list with "Show more" pattern | Student Profile → Below mastery |
| `DifficultyAnalysis` | Easy/Medium/Hard accuracy breakdown | Student Profile → Collapsible |
| `WeakTopicsList` | Prioritized list of weak topics sorted by accuracy | Student Profile → Bottom |
| `AIHomeworkGeneratorDialog` | Student-specific AI homework generator | Student Profile → Header action |
| `CreateHomeworkDialog` | Exam-context AI homework dialog | Exam Results → Header action |

---

## Features & Functionality

### 1. Students Listing (`StudentsTab`)

A searchable list of all students in the batch with PI-based classification.

```text
🔍 Search students...

┌─────────────────────────────────────────────────────────┐
│  ┌──────┐                                               │
│  │ 78%  │  Aarav Sharma            [Mastery]            │
│  └──────┘  R101 · 5 exams  ↑                       ▶   │
├─────────────────────────────────────────────────────────┤
│  ┌──────┐                                               │
│  │ 52%  │  Priya Patel             [Stable]             │
│  └──────┘  R102 · 4 exams  →                       ▶   │
├─────────────────────────────────────────────────────────┤
│  ┌──────┐                                               │
│  │ 38%  │  Rohan Gupta             [Reinforce]          │
│  └──────┘  R103 · 3 exams  ↓                       ▶   │
└─────────────────────────────────────────────────────────┘
```

**Search**: Filters by student name or roll number (case-insensitive).

**Card Data Points:**
| Field | Description | Source |
|-------|-------------|--------|
| `avgPercentage` | Average exam percentage (displayed) | PI computation |
| `piBucket` | Mastery/Stable/Reinforce/At Risk badge | Derived from PI |
| `rollNumber` | Roll number | Student data |
| `examsAttempted` | Number of completed exams | Count |
| `trend` | ↑/↓/→ trend icon | Linear regression |

**PI Bucket Badge Colors:**
| Bucket | Badge |
|--------|-------|
| Mastery | Emerald |
| Stable | Teal |
| Reinforce | Amber |
| At Risk | Red |

**Percentage icon BG**: Uses `getPerformanceColor()` 4-tier system.

**Clicking a card** → navigates to `/teacher/reports/:batchId/students/:studentId`.

---

### 2. Student Profile Page (`StudentReport`)

**Route**: `/teacher/reports/:batchId/students/:studentId`

A holistic landscape of the student's academic journey across all chapters and exams in the batch.

**Layout Order:**
1. PageHeader (breadcrumbs)
2. StudentHeaderCard (name, accuracy, trend, tags, Generate Homework)
3. **StudentAISummary (NEW)** — AI-generated insight card
4. Chapter Mastery Grid
5. Exam History Timeline
6. Difficulty Analysis
7. Weak Topics List

#### 2a. Student Header Card (`StudentHeaderCard`)

#### 2a-bis. AI Student Summary (`StudentAISummary`) — NEW

**Position**: Between `StudentHeaderCard` and Chapter Mastery Grid. This answers "What does this student need?" before showing the raw evidence.

**Component**: `src/components/teacher/reports/StudentAISummary.tsx`

```text
┌─────────────────────────────────────────────────────────┐
│ ✨ AI Summary                              [Mock Data]  │
│                                                          │
│ "Riya needs targeted practice on Thermodynamics and     │
│  Waves. Her accuracy dropped to 42% with a declining    │
│  trend."                                                 │
│                                                          │
│ [✨ Generate Homework]  [↓ View Weak Topics]  [Details] │
│                                                          │
│ (expanded detail section)                                │
│ ✅ Strengths: Kinematics (82%), Optics (78%)            │
│ ⚡ Priority: Thermodynamics (31%) — foundational gaps    │
│ 📉 Engagement: Attempt rate declining over last 3 exams  │
└─────────────────────────────────────────────────────────┘
```

**Data Structure** (`StudentAIInsight`):
| Field | Type | Description |
|-------|------|-------------|
| `summary` | string | 2-3 sentence personalized summary using student's first name |
| `strengths` | string[] | Strong chapters with accuracy (e.g., "Kinematics (82%)") |
| `priorities` | string[] | Weak chapters with gap type (e.g., "Thermodynamics (31%) — foundational gaps") |
| `engagementNote` | string | Behavioral observation based on secondary tags |
| `suggestedDifficulty` | string | "easy" / "medium" / "hard" |
| `suggestedTopics` | string[] | Top 3 weak topic names |

**Mock data generator**: `generateMockStudentInsight(profile)` in `src/data/teacher/studentReportData.ts`. Derives insights from existing `StudentBatchProfile` data.

**Action buttons:**
- **Generate Homework** → opens `AIHomeworkGeneratorDialog` (same as header card button)
- **View Weak Topics ↓** → smooth-scrolls to `WeakTopicsList` section
- **Details** → toggles collapsible section showing strengths, priorities, engagement

---

##### Future AI Integration: `student-insight-summary`

**Edge function** (to be built): `student-insight-summary`

**Prompt specification:**
```text
System: You are a teaching assistant. Analyze a single student's performance and generate a personalized summary. Return ONLY valid JSON.

User prompt:
Student: {name}, Roll: {rollNumber}
Overall accuracy: {overallAccuracy}%, Trend: {trend}
Behavioral tags: {secondaryTags}
Chapter mastery: {chapterMastery array with topic breakdowns}
Exam history: {recent 5 exams with scores and percentages}
Weak topics: {weakTopics with accuracy percentages}
Difficulty breakdown: {easy/medium/hard accuracy}

Generate:
{
  "summary": "2-3 sentences about what this student needs right now",
  "strengths": ["Topic (accuracy%)", ...],
  "priorities": ["Topic (accuracy%) — gap type", ...],
  "engagementNote": "One sentence about participation patterns",
  "suggestedDifficulty": "easy" | "medium" | "mixed",
  "suggestedTopics": ["topic1", "topic2"]
}

Rules:
- summary must mention the student by first name
- priorities limited to top 2 weakest topics
- engagementNote: mention if attempt rate or consistency is declining
- suggestedDifficulty: "easy" if student is in risk band, "mixed" otherwise

Model: google/gemini-2.5-flash (structured output via tool calling)
Response format: { "insight": StudentAIInsight }
```

**Data inputs for the prompt:**
| Input | Source |
|-------|--------|
| Student name, roll number | `StudentBatchProfile` |
| Overall accuracy, trend | `StudentBatchProfile.overallAccuracy`, `.trend` |
| Behavioral tags | `StudentBatchProfile.secondaryTags` |
| Chapter mastery | `StudentBatchProfile.chapterMastery` (full array with topics) |
| Exam history | `StudentBatchProfile.examHistory` (last 5) |
| Weak topics | `StudentBatchProfile.weakTopics` |
| Difficulty breakdown | `StudentBatchProfile.difficultyBreakdown` |

---

```text
┌─────────────────────────────────────────────────────────┐
│  Aarav Sharma  [R101]                 [✨ Generate HW]  │
│  Class 10 — 10A · 5 exams                               │
│                                                          │
│  78%  ↑  [Improving]                                     │
│                                                          │
│  ┌──────────┬──────────┬──────────┐                     │
│  │   82%    │   47     │    2     │                     │
│  │Consistency│Questions│Weak Chps │                     │
│  └──────────┴──────────┴──────────┘                     │
└─────────────────────────────────────────────────────────┘
```

**Header Data:**
| Field | Description |
|-------|-------------|
| `studentName` | Full name |
| `rollNumber` | Badge (outline style) |
| `batchClassName — batchName` | e.g., "Class 10 — 10A" |
| `totalExams` | Count of completed exams |
| `overallAccuracy` | Large percentage display |
| `trend` | TrendingUp (emerald), TrendingDown (red), or Minus (muted) |
| `secondaryTags` | Behavioral tags (max 2) as badges |
| `consistency` | Consistency score (0–100%) |
| `totalQuestions` | Total questions across all chapters |
| Weak Chapters count | Chapters with status = "weak" |

**"Generate Homework" button**: Violet colored (`bg-violet-600`), icon-only label on mobile ("Assign"), full label on desktop. Opens `AIHomeworkGeneratorDialog`.

---

#### 2b. Chapter Mastery Grid

```text
Chapter Mastery  ⓘ
┌─────────────────────────────────────────────────────────┐
│  ▌ Kinematics                    ↑       72%  [Strong] │
│    5 topics · 3 exams                                    │
│  (tap to expand)                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Displacement    78%  [Strong]   5 Qs            │    │
│  │ Velocity        55%  [Moderate] 3 Qs            │    │
│  │ Acceleration    32%  [Weak]     8 Qs            │    │
│  │ Projectile      41%  [Moderate] 4 Qs            │    │
│  │ Relative Motion 68%  [Strong]   2 Qs            │    │
│  └─────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────┤
│  ▌ Laws of Motion                →       45%  [Moderate]│
│    5 topics · 2 exams                                    │
│  ▶ (collapsed)                                           │
├─────────────────────────────────────────────────────────┤
│  ▌ Thermodynamics                ↓       28%  [Weak]    │
│    5 topics · 1 exam                                     │
│  ▶ (collapsed)                                           │
└─────────────────────────────────────────────────────────┘
```

**Tooltip**: _"Color-coded overview of student performance across all chapters. Green = strong (≥65%), Amber = moderate (40-64%), Red = weak (<40%). Tap a chapter to see topic-level breakdown."_

**Chapter Card Data:**
| Field | Description |
|-------|-------------|
| `chapterName` | Chapter title |
| `avgSuccessRate` | Average across all topics |
| `status` | Strong (≥65%), Moderate (40–64%), Weak (<40%) |
| `trend` | Per-chapter trend icon |
| `questionsAttempted` | Total questions |
| `examsAppeared` | Number of exams |

**Left border color**: 4-tier system based on `avgSuccessRate`.

**Expandable topics**: Only one chapter expanded at a time (accordion behavior). Each topic shows:
- Topic name
- Accuracy percentage
- Status badge (Strong/Moderate/Weak)
- Question count

---

#### 2c. Exam History Timeline (`ExamHistoryTimeline`)

Chronological list of all exams with a **"Show more" pattern** for scalability.

```text
Exam History
┌─────────────────────────────────────────────────────────┐
│  Kinematics Unit Test         72/80  90%  #1/25         │
│  📅 15 Jan 2025                                         │
├─────────────────────────────────────────────────────────┤
│  Motion Mid-Term              52/80  65%  #8/25         │
│  📅 08 Jan 2025                                         │
├─────────────────────────────────────────────────────────┤
│  ...8 more exams...                                      │
├─────────────────────────────────────────────────────────┤
│  [Show 8 more exams]                                     │
└─────────────────────────────────────────────────────────┘
```

**Scalability**: Shows initial 10 items. "Show more" button reveals remaining exams. This handles 6-month academic timelines with 20–40 exams gracefully.

**Exam Row Data:**
| Field | Description |
|-------|-------------|
| `examName` | Exam title |
| `date` | Formatted as `dd MMM yyyy` |
| `score / maxScore` | Raw score |
| `percentage` | Percentage |
| `rank / totalStudents` | Class rank |

**Clicking an exam** → navigates to `/teacher/reports/:batchId/exams/:examId`.

---

#### 2d. Difficulty Analysis (`DifficultyAnalysis`)

Collapsible section showing accuracy across difficulty levels.

```text
Difficulty Analysis  ▶ (collapsed by default)
┌─────────────────────────────────────────────────────────┐
│  Easy     │ 82% accuracy │ 12 Qs │ Avg 35s/Q           │
│  Medium   │ 58% accuracy │ 18 Qs │ Avg 52s/Q           │
│  Hard     │ 35% accuracy │ 8 Qs  │ Avg 72s/Q           │
└─────────────────────────────────────────────────────────┘
```

**Data per level:**
| Field | Description |
|-------|-------------|
| `level` | Easy / Medium / Hard |
| `accuracy` | Percentage correct |
| `questionsAttempted` | Count |
| `avgTimePerQuestion` | Seconds per question |

This section helps identify if a student struggles specifically with harder questions or has issues across all levels.

---

#### 2e. Weak Topics List (`WeakTopicsList`)

Prioritized list of the student's weakest topics, sorted by accuracy (ascending).

```text
Weak Spots
┌─────────────────────────────────────────────────────────┐
│  1. Acceleration (Kinematics)         32%    8 Qs      │
│  2. Entropy (Thermodynamics)          28%    3 Qs      │
│  3. Projectile Motion (Kinematics)    35%    4 Qs      │
│  4. Friction (Laws of Motion)         38%    6 Qs      │
│  5. Doppler Effect (Waves & Sound)    42%    2 Qs      │
└─────────────────────────────────────────────────────────┘
```

**Filter**: Only topics with accuracy < 50% are included.

**Data per topic:**
| Field | Description |
|-------|-------------|
| `topicName` | Topic name |
| `chapterName` | Parent chapter |
| `accuracy` | Percentage correct |
| `questionsAsked` | Number of questions |

This list feeds directly into the "Generate Homework" context.

---

### 3. Generate Homework — All 3 Locations

The Generate Homework feature appears in three places across the Reports module, each pre-filling different context based on the analysis being viewed.

#### Location 1: Chapter Report → Generate Practice

| Field | Value |
|-------|-------|
| **Button** | "Generate Practice" (Sparkles icon) |
| **Location** | Student Buckets card header |
| **Action** | Navigates to `/teacher/reports/:batchId/chapters/:chapterId/practice` |
| **Component** | `ChapterPracticeReview` — full-page 3-step wizard |
| **Pre-filled Context** | Chapter name, subject, topic status, per-band student context |

**Unique behavior**: This is a full-page multi-band practice flow, NOT a dialog. It generates differentiated question sets for each performance band simultaneously.

**AI Prompt Structure:**
```json
{
  "chapter": "Kinematics",
  "subject": "Physics",
  "bands": [
    {
      "key": "mastery",
      "label": "Mastery Ready",
      "studentCount": 5,
      "questionCount": 10,
      "instructions": "User's common + band-specific instructions",
      "context": "Strong in all topics. Challenge with advanced questions. Strong topics: Displacement, Velocity"
    },
    {
      "key": "risk",
      "context": "At risk — foundational gaps. Weak in: Acceleration, Projectile Motion. Generate easy conceptual questions."
    }
  ],
  "topics": [
    { "name": "Displacement", "status": "strong", "avgSuccessRate": 78 },
    { "name": "Acceleration", "status": "weak", "avgSuccessRate": 32 }
  ]
}
```

---

#### Location 2: Exam Results → Generate Homework

| Field | Value |
|-------|-------|
| **Button** | "Generate Homework" (Sparkles icon) |
| **Location** | Exam Results page header |
| **Action** | Opens `CreateHomeworkDialog` |
| **Component** | `CreateHomeworkDialog` — modal/drawer dialog |

**Pre-filled Context:**
| Field | Source |
|-------|--------|
| `subject` | Exam's subject |
| `batchId` | Currently selected batch |
| `batchName` | Batch display name |
| `chapter` | Exam name (used as topic context) |
| `topic` | Comma-separated weak topics (success rate < 50%) |

**Example pre-fill:**
```
Subject: Physics
Batch: Class 10 - 10A
Chapter: Kinematics Unit Test
Topic: Acceleration, Projectile Motion
```

---

#### Location 3: Student Profile → Generate Homework

| Field | Value |
|-------|-------|
| **Button** | "Generate Homework" / "Assign" (mobile) |
| **Location** | Student Header Card |
| **Action** | Opens `AIHomeworkGeneratorDialog` |
| **Component** | `AIHomeworkGeneratorDialog` — modal/drawer dialog |

**Pre-filled Context (via `AIHomeworkPrefill`):**
| Field | Source | Example |
|-------|--------|---------|
| `subject` | Teacher's subject | "Physics" |
| `batchId` | Current batch | "batch-10a" |
| `instructions` | Auto-generated from weak topics + difficulty | "Focus on [Acceleration, Entropy, Projectile Motion] at medium difficulty for remediation. Student: Aarav Sharma" |
| `contextBanner` | Display banner in dialog | "Student: Aarav Sharma — Weak areas identified" |

**Suggested Difficulty Logic:**
| Avg Difficulty Accuracy | Suggested |
|------------------------|-----------|
| > 60% | Hard |
| > 40% | Medium |
| ≤ 40% | Easy |

**Weak topics selection**: Top 5 topics by ascending accuracy (accuracy < 50%), extracted from the student's `chapterMastery` data.

##### Context Source Types

The `AIHomeworkGeneratorDialog` supports three **context sources** that provide additional material for the AI to base homework on. These are optional and selectable in the dialog form:

| Source Type | Key | Description | UI |
|------------|-----|-------------|-----|
| **Document Upload** | `document` | Teacher uploads a PDF/doc file | File input with drag-drop |
| **Content Library** | `content` | Selects from existing content library items | `ContentLibraryPicker` modal |
| **Lesson Plan** | `lesson_plan` | Selects from existing lesson plans | `LessonPlanPicker` modal |
| **None** | `none` | No additional context (default) | — |

Only one context source can be active at a time. Selecting a new source clears the previous one.

##### Refactored Component Structure

The `AIHomeworkGeneratorDialog` has been decomposed into focused sub-components under `src/components/teacher/ai-homework/`:

| Component | File | Responsibility |
|-----------|------|---------------|
| `AIHomeworkForm` | `AIHomeworkForm.tsx` | Form fields: title, type, subject, batch, due date, instructions, context source selector |
| `AIHomeworkPreview` | `AIHomeworkPreview.tsx` | Preview of generated homework with editable fields |
| `AIHomeworkActions` | `AIHomeworkActions.tsx` | Footer buttons: Cancel, Generate, Regenerate, Accept & Assign |
| `types.ts` | `types.ts` | Shared types: `HomeworkType`, `ContextSourceType`, `GeneratedHomework`, `AIHomeworkFormData`, `AIHomeworkPrefill` |

##### Edge Function Payload (`assessment-ai`)

The dialog invokes the `assessment-ai` edge function with action `generate_homework`:

```json
{
  "action": "generate_homework",
  "topic": "Acceleration and Projectile Motion",
  "subject": "Physics",
  "homeworkType": "practice",
  "customInstructions": "Focus on easy conceptual questions for remediation.",
  "contextType": "lesson_plan",
  "contextContent": "Lesson Plan: Kinematics Week 3. Topics: Acceleration, Projectile Motion. ..."
}
```

| Field | Type | Description |
|-------|------|-------------|
| `action` | string | Always `"generate_homework"` |
| `topic` | string | Homework title / topic |
| `subject` | string | Subject name |
| `homeworkType` | string | `"practice"`, `"test"`, or `"project"` |
| `customInstructions` | string | Teacher's custom instructions (optional) |
| `contextType` | string | `"document"`, `"content"`, `"lesson_plan"`, or `undefined` |
| `contextContent` | string | Serialized context from the selected source (optional) |

**Response**: Returns `{ success: true, data: GeneratedHomework }` with `title`, `description`, `instructions[]`, `tasks[]`, and `estimatedTime`.

---

### Generate Homework Comparison Table

| Aspect | Chapter Report | Exam Results | Student Profile |
|--------|---------------|--------------|-----------------|
| **Trigger** | Button in Student Buckets header | Button in page header | Button in Student Header Card |
| **UI** | Full-page wizard | Dialog (modal/drawer) | Dialog (modal/drawer) |
| **Component** | `ChapterPracticeReview` | `CreateHomeworkDialog` | `AIHomeworkGeneratorDialog` |
| **Scope** | Multi-band, chapter-specific | Exam-wide, batch-specific | Student-specific, cross-chapter |
| **Pre-fills** | Band context + topic status | Weak topics from exam | Student's weakest topics + difficulty |
| **Context Sources** | Topics + band data | Exam results | Content Library / Lesson Plan / Document |
| **Output** | Differentiated MCQs per band | Single homework assignment | Single homework for specific student |
| **Target** | All students (grouped by band) | Entire batch | Individual student |

---

## Data Flow

```text
Batch Report → Students Tab
│
├── Student Roster (source: generateStudentRoster())
│   ├── PI computed per student using computeStudentPI()
│   ├── piBucket assigned via getPIBucket(pi)
│   └── Search filter (name / roll number)
│
└── Student Card (click)
    └── Student Profile (/teacher/reports/:batchId/students/:studentId)
        │
        ├── StudentHeaderCard
        │   ├── Source: getStudentBatchProfile()
        │   └── Action: "Generate Homework" → AIHomeworkGeneratorDialog
        │
        ├── Chapter Mastery Grid
        │   ├── Source: chapterMastery[] from profile
        │   └── Expandable topics per chapter (accordion)
        │
        ├── Exam History Timeline
        │   ├── Source: examHistory[] from profile
        │   ├── "Show more" pattern (initial 10)
        │   └── Click exam → Exam Results page
        │
        ├── Difficulty Analysis
        │   └── Source: difficultyBreakdown[] (easy/medium/hard)
        │
        └── Weak Topics List
            ├── Source: weakTopics[] (sorted by accuracy, filtered < 50%)
            └── Feeds into Generate Homework pre-fill
```

### Data Sources

| Data | Source File | Key Functions |
|------|------------|---------------|
| Student roster | `studentReportData.ts` | `getBatchStudentRoster()` |
| Student profile | `studentReportData.ts` | `getStudentBatchProfile()` |
| PI computation | `performanceIndex.ts` | `computeStudentPI()` |
| Exam history | `teacherExams` + profile generator | `generateStudentProfile()` |
| Homework dialog | `AIHomeworkGeneratorDialog.tsx` | Receives `AIHomeworkPrefill` |
| Exam homework | `CreateHomeworkDialog.tsx` | Receives context object |

### Caching Strategy

All generators use seeded random (`seededRandom()` with `hashString()`) for deterministic data. Results are cached in `Map` objects keyed by `studentId__batchId`.

---

## Business Rules

1. **PI-based bucketing**: Students tab uses PI for classification, same formula as Chapter Buckets (50% Accuracy + 20% Consistency + 15% Time Efficiency + 15% Attempt Rate)
2. **PI is hidden in UI**: Only `avgPercentage` is displayed; PI determines the bucket badge
3. **Search is case-insensitive**: Matches against both name and roll number
4. **Chapter mastery thresholds** (for status labels): Strong ≥65%, Moderate 40–64%, Weak <40%
5. **Exam History uses "Show more"**: Initial 10 items, expandable — designed for 6-month timelines with 20–40 exams
6. **Difficulty Analysis is collapsed by default**: Secondary information, not primary
7. **Weak topics filter**: Only topics with accuracy < 50% are included
8. **Weak topics capped at 5**: For homework pre-fill, only top 5 weakest are used
9. **Suggested difficulty is dynamic**: Computed from average difficulty accuracy across Easy/Medium/Hard
10. **Student-specific homework**: Unlike batch-wide homework from Exam Results, the Student Profile generates homework targeted at one student's specific weaknesses
11. **Only one chapter expanded at a time**: In Chapter Mastery, expanding one chapter collapses the previous
12. **Consistency defaults to 75**: For students with only 1 exam, consistency is set to 75 (insufficient data for variance)

---

## Mobile Behavior

- **Students listing**: Full-width cards, search bar always visible
- **Student Header**: "Generate Homework" button shows "Assign" text on mobile, full label on desktop
- **Chapter Mastery**: Full-width cards, tap to expand topics
- **Exam History**: Compact rows, rank hidden on mobile
- **Difficulty Analysis**: Collapsible to reduce scroll depth
- **Weak Topics**: Full-width list
- **Homework Dialogs**: Rendered as `Drawer` (bottom sheet) on mobile, `Dialog` (modal) on desktop
- **Bottom padding**: `pb-20` on mobile (for fixed bottom nav)

---

## Related Documentation

- [Reports — Overview](./reports-overview.md) — Module architecture and navigation map
- [Reports — Chapters](./reports-chapters.md) — Chapter drill-down and practice generation
- [Reports — Exams](./reports-exams.md) — Exam results with multi-tab analysis
- [Homework & AI Generation](./homework.md) — Full homework system
- [Student Bucketing & PI Logic](./reports-chapters.md#performance-index-pi-formula) — Detailed PI formula
- [Academic Progress](./academic-progress.md) — Broader academic tracking

---

*Last Updated: February 2026*
