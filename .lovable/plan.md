

## Phased Implementation Plan: Actionable AI Insights for Teacher Reports

---

### Current Platform Flow (Teacher's Journey)

```text
/teacher/reports                     ← Reports Landing (batch grid)
  └─ /teacher/reports/:batchId       ← Batch Report (3 tabs: Chapters | Exams | Students)
       ├─ Chapters Tab
       │    └─ /…/:batchId/chapters/:chapterId       ← Chapter Report
       │         └─ /…/practice                       ← Generate Practice (3-step)
       │         └─ /…/practice/:sessionId            ← Practice Session Detail
       ├─ Exams Tab
       │    └─ /…/:batchId/exams/:examId              ← Exam Results (4 tabs)
       └─ Students Tab
            └─ /…/:batchId/students/:studentId        ← Student Profile
```

---

### Design Principles for Positioning

1. **Top-of-page = Orientation** — The first thing a teacher sees must answer "What should I focus on?"
2. **Middle = Evidence** — Charts, bands, and data that back up the orientation
3. **Bottom = Action** — Generate Practice, Generate Homework, or Assign buttons
4. **Inline Actions** — Every insight card that surfaces a problem must have a "Take Action" button right there — never send the teacher to a different page to act
5. **Mock AI Data** — All AI responses are mock/hardcoded JSON. No real AI calls. The documentation specifies what prompt goes where and what structured output is expected.

---

## Phase 1: Actionable Insight Cards on Exam Results

**Goal**: Replace the current markdown-based AI Analysis with structured, actionable insight cards. This is the highest-impact change — it transforms the exam post-mortem from "read and forget" into "read and act."

### Positioning (Exam Results Page — `/teacher/reports/:batchId/exams/:examId`)

```text
Current layout (Analytics tab):
  1. AI Analysis Card (markdown text)      ← REPLACE
  2. Score Distribution chart
  3. Difficulty Chart
  4. Cognitive Chart

New layout (Insights tab — the DEFAULT tab):
  1. Verdict Banner (unchanged)
  2. Actionable Insight Cards (NEW)        ← 3-4 cards with [Take Action]
  3. Performance Bands (unchanged)
  4. Topic Flags (unchanged)
  5. Key Insights (unchanged)
```

The actionable cards go ABOVE Performance Bands because they answer "What do I do?" before the teacher even looks at the raw data.

### New Component: `ActionableInsightCards`

**Location**: `src/components/teacher/exams/results/ActionableInsightCards.tsx`

Each card has:
- **Icon** (color-coded by severity: Red = urgent, Amber = attention, Teal = positive)
- **Finding** — plain-language statement (e.g., "7 students scored below 35% on Projectile Motion")
- **Affected students** — count + names (collapsed, expandable)
- **[Take Action] button** — opens the existing `CreateHomeworkDialog` or navigates to Generate Practice, pre-filled with the relevant topic + students

### Mock Data Structure

```typescript
interface ActionableInsight {
  id: string;
  type: 'reteach' | 'practice' | 'celebrate' | 'attention';
  severity: 'critical' | 'warning' | 'positive';
  finding: string;           // "7 students scored below 35% on Projectile Motion"
  detail: string;            // "Average accuracy was 28%. Most errors were conceptual."
  affectedStudents: { id: string; name: string; score: number }[];
  suggestedAction: string;   // "Assign targeted practice on Projectile Motion"
  actionType: 'homework' | 'practice' | 'none';
  actionPayload: {           // Pre-fill data for the dialog
    topic?: string;
    difficulty?: string;
    studentIds?: string[];
  };
}
```

A helper function `generateMockActionableInsights(analytics, bands, topicFlags)` will produce 3-4 cards from existing analytics data (no AI call).

### AI Documentation (for future developer)

**Edge function**: `generate-actionable-insights` (to be built later)

**Prompt specification** (document in `docs/03-teacher/reports-exams.md`):

```text
System: You are an education analytics engine. Return ONLY valid JSON — no markdown.

User prompt:
Given the following exam data:
- Exam: {examName}
- Score distribution: {scoreDistribution}
- Question analysis (topic, successRate, difficulty, cognitiveType): {questionAnalysis}
- Student results (name, score, percentage): {allStudents}
- Performance bands: {bands with student lists}

Generate 3-4 actionable insight objects. Each must have:
{
  "type": "reteach" | "practice" | "celebrate" | "attention",
  "severity": "critical" | "warning" | "positive",
  "finding": "Plain English, <15 words",
  "detail": "One sentence with specific numbers",
  "affectedStudentIds": ["student-id-1", ...],
  "suggestedAction": "What teacher should do, <12 words",
  "actionType": "homework" | "practice" | "none",
  "topicFocus": "Topic name if applicable"
}

Rules:
- At least 1 card must be type=reteach if any topic has <35% success
- At least 1 card must be type=celebrate if any topic has >75% success
- Include student IDs so the UI can link to their profiles
- Be specific: use topic names, student counts, percentages

Model: google/gemini-2.5-flash (structured output via tool calling)
Response format: { "insights": ActionableInsight[] }
```

### Files Created/Modified

| File | Action |
|------|--------|
| `src/components/teacher/exams/results/ActionableInsightCards.tsx` | CREATE — New component |
| `src/data/teacher/examResults.ts` | MODIFY — Add `generateMockActionableInsights()` helper + `ActionableInsight` type |
| `src/pages/teacher/ExamResults.tsx` | MODIFY — Add `ActionableInsightCards` to Insights tab (position 2, between VerdictBanner and PerformanceBands) |
| `src/components/teacher/exams/results/index.ts` | MODIFY — Export new component |
| `docs/03-teacher/reports-exams.md` | MODIFY — Add "Actionable Insights" section with prompt spec, data structure, and positioning rationale |

### Exam Results Analytics Tab Change

Move `AIAnalysisCard` from position 1 in Analytics tab to position 2 (below Score Distribution). It remains as a "deep dive" option but is no longer the primary AI surface. The Insights tab is the first thing teachers see.

---

## Phase 2: Batch Health Summary + Today's Focus on Batch Report

**Goal**: Make the Batch Report page proactive — when a teacher opens a batch, before they pick a tab, they see "Here's what matters right now."

### Positioning (Batch Report Page — `/teacher/reports/:batchId`)

```text
Current layout:
  1. Breadcrumbs
  2. Title + Tabs (Chapters | Exams | Students)
  3. Tab content

New layout:
  1. Breadcrumbs
  2. Title + Tabs
  3. ┌─────────────────────────────────────────────┐
     │  TODAY'S FOCUS card (NEW)                   │  ← Always visible, above tabs content
     │  "3 topics need attention · 2 at-risk       │
     │   students · Last exam avg 52%"             │
     │  [View Details ▾]                           │
     └─────────────────────────────────────────────┘
  4. Tab content (Chapters / Exams / Students)
```

The "Today's Focus" card sits BETWEEN the tab bar and the tab content. It is a collapsible card (expanded by default on first visit, collapsed after). It is visible regardless of which tab is active.

### New Component: `BatchHealthCard`

**Location**: `src/components/teacher/reports/BatchHealthCard.tsx`

Structure:
- **Gradient banner** (teal, same visual language as VerdictBanner)
- **3 stat pills** inline: Topics needing attention | At-risk students | Recent exam avg
- **Expandable section** with:
  - **Top 2-3 priority topics** with success rates and trend arrows
  - **2-3 students to check in with** (chronic at-risk or recently declining)
  - **One-liner suggested focus** ("Review Projectile Motion using application problems")
- **[Generate Practice]** button linking to the weakest chapter's practice flow

### Mock Data Structure

```typescript
interface BatchHealthSummary {
  generatedAt: string;
  overallTrend: 'improving' | 'declining' | 'stable';
  recentExamAvg: number;
  priorityTopics: {
    topic: string;
    chapter: string;
    successRate: number;
    trend: 'up' | 'down' | 'flat';
    examCount: number;
  }[];
  studentsToCheckIn: {
    studentId: string;
    studentName: string;
    reason: string;        // "At risk for 3 consecutive exams"
    avgPercentage: number;
    trend: 'up' | 'down' | 'flat';
  }[];
  suggestedFocus: string;  // "Review Projectile Motion — 7 students consistently below 35%"
  atRiskCount: number;
  weakTopicCount: number;
}
```

A helper function `generateMockBatchHealth(chapters, examHistory, studentRoster)` will compute this from existing batch data.

### AI Documentation (for future developer)

**Edge function**: `batch-health-summary` (to be built later)

**Prompt specification** (document in `docs/03-teacher/reports-overview.md`):

```text
System: You are a teaching assistant AI. Analyze batch performance data and generate a daily briefing. Return ONLY valid JSON.

User prompt:
Batch: {batchName}, Class: {className}
Recent exams (last 5): {examHistory with dates, avg scores, topic breakdowns}
Chapter performance: {chapters with success rates and weak topic counts}
Student roster: {students with PI buckets, trends, behavioral tags}

Generate a batch health summary:
{
  "overallTrend": "improving" | "declining" | "stable",
  "priorityTopics": [top 3 topics needing attention, with success rate and trend],
  "studentsToCheckIn": [top 3 students needing intervention, with reason],
  "suggestedFocus": "One sentence: what the teacher should prioritize today",
  "atRiskCount": number,
  "weakTopicCount": number
}

Rules:
- priorityTopics: Pick topics that are weak (<50%) AND declining or flat
- studentsToCheckIn: Pick students in risk/reinforcement band with declining or plateaued tags
- suggestedFocus: Must reference a specific topic and student count
- Be concise — teacher reads this in 5 seconds

Model: google/gemini-2.5-flash
```

### Files Created/Modified

| File | Action |
|------|--------|
| `src/components/teacher/reports/BatchHealthCard.tsx` | CREATE |
| `src/data/teacher/reportsData.ts` | MODIFY — Add `generateMockBatchHealth()` + `BatchHealthSummary` type |
| `src/pages/teacher/BatchReport.tsx` | MODIFY — Insert `BatchHealthCard` between tab bar and tab content |
| `docs/03-teacher/reports-overview.md` | MODIFY — Add "Batch Health Summary" section with prompt spec |

---

## Phase 3: Student Profile AI Summary + "What This Student Needs"

**Goal**: When a teacher opens a student's profile, the first card should tell them what this specific student needs — not just show raw data.

### Positioning (Student Report Page — `/teacher/reports/:batchId/students/:studentId`)

```text
Current layout:
  1. PageHeader
  2. StudentHeaderCard (name, accuracy, trend, tags, [Generate Homework])
  3. Chapter Mastery Grid
  4. Exam History Timeline
  5. Difficulty Analysis
  6. Weak Topics List

New layout:
  1. PageHeader
  2. StudentHeaderCard (unchanged)
  3. ┌─────────────────────────────────────────────┐
     │  AI STUDENT SUMMARY card (NEW)              │
     │  "Riya needs targeted practice on           │
     │   Thermodynamics and Waves. Her accuracy    │
     │   dropped 12% over the last 3 exams."       │
     │  [Generate Homework] [View Weak Topics ↓]   │
     └─────────────────────────────────────────────┘
  4. Chapter Mastery Grid
  5. Exam History Timeline
  6. Difficulty Analysis
  7. Weak Topics List
```

The AI summary card goes immediately after the header card — it answers "What does this student need?" before showing the evidence.

### New Component: `StudentAISummary`

**Location**: `src/components/teacher/reports/StudentAISummary.tsx`

Structure:
- **Icon** (Sparkles) + "AI Summary" label
- **2-3 sentence paragraph** about the student's situation
- **2 action buttons**: [Generate Homework] (opens existing dialog) + [View Weak Topics ↓] (scrolls to WeakTopicsList)
- **Collapsible detail section** with:
  - Strength: "Strong in Kinematics (82%) and Optics (78%)"
  - Priority: "Focus on Thermodynamics (31%) — conceptual gaps detected"
  - Engagement note: "Attempt rate declining — 3 recent exams had <80% attempted"

### Mock Data Structure

```typescript
interface StudentAIInsight {
  summary: string;           // "Riya needs targeted practice on Thermodynamics..."
  strengths: string[];       // ["Kinematics (82%)", "Optics (78%)"]
  priorities: string[];      // ["Thermodynamics (31%) — conceptual gaps"]
  engagementNote: string;    // "Attempt rate declining over last 3 exams"
  suggestedDifficulty: string;
  suggestedTopics: string[];
}
```

A helper `generateMockStudentInsight(profile)` computes this from existing `StudentBatchProfile` data.

### AI Documentation

**Edge function**: `student-insight-summary` (to be built later)

**Prompt specification** (document in `docs/03-teacher/reports-students.md`):

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

Model: google/gemini-2.5-flash
```

### Files Created/Modified

| File | Action |
|------|--------|
| `src/components/teacher/reports/StudentAISummary.tsx` | CREATE |
| `src/data/teacher/studentReportData.ts` | MODIFY — Add `generateMockStudentInsight()` + `StudentAIInsight` type |
| `src/pages/teacher/StudentReport.tsx` | MODIFY — Insert `StudentAISummary` between StudentHeaderCard and Chapter Mastery Grid |
| `docs/03-teacher/reports-students.md` | MODIFY — Add "AI Student Summary" section with prompt spec |

---

## Phase 4: Questions Tab — Reteaching Plan Generator

**Goal**: On the Exam Results Questions tab, add a "Generate Reteaching Plan" button that produces a structured plan for the teacher to use in the next class.

### Positioning (Exam Results — Questions Tab)

```text
Current layout:
  1. QuestionGroupAccordion (grouped by accuracy bands)

New layout:
  1. ┌───────────────────────────────────────────────┐
     │  Reteaching Plan bar (NEW)                    │
     │  "4 questions need reteaching"                │
     │  [Generate Reteaching Plan]                   │
     └───────────────────────────────────────────────┘
  2. QuestionGroupAccordion (unchanged)
```

When clicked, a drawer/dialog opens showing:
- **Topics to reteach** (from <35% accuracy questions), ordered by severity
- **Suggested approach per topic** (1 sentence each)
- **Estimated time** ("~15 minutes for 2 topics")
- **[Copy Plan]** button to copy as text

### New Component: `ReteachingPlanCard`

**Location**: `src/components/teacher/exams/results/ReteachingPlanCard.tsx`

### Mock Data

```typescript
interface ReteachingPlan {
  topics: {
    topic: string;
    successRate: number;
    questionCount: number;
    suggestedApproach: string;  // "Use visual diagrams to explain projectile trajectory"
    estimatedMinutes: number;
  }[];
  totalEstimatedMinutes: number;
  overallAdvice: string;
}
```

### AI Documentation

**Prompt** (document in `docs/03-teacher/reports-exams.md`):

```text
System: You are a lesson planning assistant.

User: Given these exam questions that students struggled with:
{questions with <50% success rate, including topic, successRate, cognitiveType, difficulty}

Generate a reteaching plan:
{
  "topics": [{
    "topic": "name",
    "suggestedApproach": "One sentence: how to reteach this",
    "estimatedMinutes": number
  }],
  "totalEstimatedMinutes": number,
  "overallAdvice": "One sentence summary"
}

Rules:
- suggestedApproach must vary by cognitiveType (visual for conceptual, worked examples for numerical)
- estimatedMinutes: 5-8 min per topic
- overallAdvice: reference specific topic names

Model: google/gemini-2.5-flash
```

### Files Created/Modified

| File | Action |
|------|--------|
| `src/components/teacher/exams/results/ReteachingPlanCard.tsx` | CREATE |
| `src/pages/teacher/ExamResults.tsx` | MODIFY — Add above QuestionGroupAccordion in Questions tab |
| `src/components/teacher/exams/results/index.ts` | MODIFY — Export |
| `docs/03-teacher/reports-exams.md` | MODIFY — Add "Reteaching Plan" section |

---

## Phase 5: Documentation Consolidation + AI Integration Map

**Goal**: Update all docs files to include the new AI integration points, prompt specs, mock data shapes, and positioning rationale in a single, developer-friendly reference.

### Files Modified

| File | Changes |
|------|---------|
| `docs/03-teacher/reports-overview.md` | Add updated AI Integration Map table showing all 7 AI touchpoints (3 existing + 4 new), their locations, data inputs, and prompt references |
| `docs/03-teacher/reports-exams.md` | Add sections for Actionable Insight Cards (prompt, data shape, positioning) and Reteaching Plan (prompt, data shape) |
| `docs/03-teacher/reports-students.md` | Add section for Student AI Summary (prompt, data shape, positioning) |
| `docs/03-teacher/reports-chapters.md` | Minor update — cross-reference to new AI touchpoints |

---

### Phase Summary

| Phase | What | Where Positioned | Mock or Real AI | Impact |
|-------|------|-------------------|-----------------|--------|
| 1 | Actionable Insight Cards | Exam Results → Insights tab, between VerdictBanner and PerformanceBands | Mock data + documented prompt | Highest — bridges data-to-action gap |
| 2 | Batch Health Summary | Batch Report, between tab bar and tab content | Mock data + documented prompt | High — proactive daily companion |
| 3 | Student AI Summary | Student Profile, between header card and chapter grid | Mock data + documented prompt | Medium — personalized guidance |
| 4 | Reteaching Plan | Exam Results → Questions tab, above question accordions | Mock data + documented prompt | Medium — lesson planning aid |
| 5 | Docs consolidation | All 4 doc files | N/A | Documentation completeness |

Each phase is self-contained and does not break existing functionality. Phases can be reviewed independently.

