

# Student Progress Analytics — Phased Implementation Plan

## Current State

The `/student/progress` page has 5 placeholder components with hardcoded mock data: a circular overall progress card, a flat subject list with chapter counts, a streak calendar, achievement badges, and a weekly activity bar chart. None of it connects to the rich analytics the platform already computes on the teacher/institute side (Performance Index, chapter mastery, topic flags, batch standing, exam history, difficulty breakdown, secondary tags).

## What We Are Building

A comprehensive, multi-tab student analytics module that reuses the same formulas and generators the teacher reports use — so the student sees the **same source-of-truth numbers** their teacher sees, presented in a student-friendly, motivational UI.

---

## Phase 1 — Data Layer and Overall Dashboard (Foundation)

**Goal**: Create `src/data/student/progressData.ts` — a student-facing data adapter that calls into the existing teacher-side generators and reshapes the output for the student view.

### Data to expose

| Metric | Source Generator | Student View |
|--------|-----------------|-------------|
| Performance Index (PI) + breakdown | `computeStudentPI` from `performanceIndex.ts` | Gauge with accuracy, consistency, time efficiency, attempt rate |
| Overall accuracy + trend | `getStudentBatchProfile` | Trend arrow + spark line |
| Batch standing (rank, percentile) | Computed from `getBatchStudentRoster` | "You are #X of Y" + distance from average and top |
| Secondary tags | `computeStudentPI` | Motivational badges ("Improving", "Consistent") |
| Subject-level summary | One profile per subject (loop subjects) | Per-subject PI, accuracy, trend |

### UI components (replace existing)

1. **ProgressHeroCard** — replaces `OverallProgressCard`. Shows PI gauge (animated ring), overall accuracy, trend indicator, and batch rank pill. Glassmorphism card with coral/orange gradient accents.
2. **BatchStandingCard** — new. Horizontal bar showing student position relative to batch average and batch topper. Labels: "Below Average / Average / Above Average / Top 10%". Distance markers in percentage points.
3. **SubjectOverviewGrid** — replaces `SubjectProgressList`. Scrollable horizontal cards (mobile) / 2-col grid (desktop). Each card: subject icon, PI score, accuracy %, trend arrow, chapter mastery ratio, tap to drill into Phase 2.

### Design contract

- All cards: `bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg`
- Gradients: `from-[hsl(var(--donut-coral))] to-[hsl(var(--donut-orange))]`
- Animations: `framer-motion` staggered entrance
- Touch targets: 44px minimum
- Mobile-first: single column, horizontal scroll for subject cards

---

## Phase 2 — Subject Deep Dive (Per-Subject Analytics)

**Goal**: When a student taps a subject card, expand or navigate to a detailed subject view.

### Components

1. **SubjectProgressHeader** — Subject name, PI gauge, accuracy, trend, batch rank *in this subject*
2. **ChapterMasteryList** — Vertical list of chapters with:
   - Progress bar colored by status (green = strong >= 65%, amber = moderate >= 40%, red = weak < 40%)
   - Topic count and weak topic count
   - Trend arrow per chapter
   - Tap to expand topics (Phase 3)
3. **WeakTopicsAlert** — Top 3-5 weakest topics across all chapters in this subject, sorted by accuracy ascending. Coral/red tinted card with "Focus on these" motivational copy.
4. **DifficultyBreakdownCard** — Three horizontal bars (Easy/Medium/Hard) showing accuracy per difficulty level. Helps student understand where they struggle.
5. **SubjectBatchStanding** — Same horizontal bar as Phase 1 but scoped to this subject. "In Physics, you rank #X of Y"

### Data source

`getStudentBatchProfile(studentId, batchId)` already returns `chapterMastery[]`, `difficultyBreakdown[]`, `weakTopics[]` — direct mapping.

---

## Phase 3 — Exam Performance History

**Goal**: Show how the student has performed across all exams, with batch context.

### Components

1. **ExamHistoryTimeline** — Chronological list of exams with:
   - Score / Max Score, percentage
   - Rank in batch + total students
   - Class average comparison (inline bar: "You: 72% | Class Avg: 65% | Top: 91%")
   - Color-coded: green if above average, amber if within 5%, red if below
2. **ExamTrendChart** — Recharts line chart of percentage over time, with a dashed line for class average. Tap any point for exam details.
3. **PerExamStandingCard** — When an exam is selected: score, rank, percentile, distance from average ("You scored 7% above the class average"), distance from top ("12% below the topper").

### Data source

`examHistory[]` from `StudentBatchProfile` already has score, maxScore, percentage, rank, totalStudents. Class average comes from `BatchExamEntry` in `reportsData.ts`.

---

## Phase 4 — Chapter and Topic Drill-Down

**Goal**: Tap a chapter in Phase 2 to see topic-level mastery.

### Components

1. **ChapterDetailSheet** — Bottom sheet (mobile) / side panel (desktop):
   - Chapter name, overall success rate, exams appeared in
   - Topic list with accuracy bars (strong/moderate/weak color coding)
   - Per-topic question count
2. **TopicTrendMini** — If data permits, a small sparkline per topic showing accuracy over exams

### Data source

`ChapterMastery.topics[]` from `getStudentBatchProfile` — already has topicName, accuracy, status, questionsAsked.

---

## Phase 5 — Behavioral Insights and Streaks (Polish)

**Goal**: Keep streak/achievements but connect them to real data; add motivational behavioral signals.

### Components

1. **StreakCalendar** — Keep existing but wire to actual study activity data
2. **AchievementBadges** — Keep existing but derive unlock status from real metrics (e.g., "Consistency King" if consistency > 80)
3. **InsightBanner** — A single motivational card at the top that uses the same logic as `generateMockStudentInsight`:
   - Shows summary sentence, top strength, top priority
   - Styled as a warm gradient card with the Donut Bot personality
4. **SecondaryTagsPills** — Display tags like "Improving", "Speed Issue", "Plateaued" as colored pills with tooltips explaining what they mean
5. **WeeklyActivityChart** — Keep but wire to actual time data

---

## Phase 6 — Responsive Polish and Navigation

**Goal**: Ensure the entire progress module is production-ready across all breakpoints.

### Work

1. **Tab navigation** at top of Progress page: Overview | Subjects | Exams | Insights
   - Mobile: horizontal scrollable pill tabs
   - Desktop: standard tab bar
2. **320px audit** — Every card must render without overflow at 320px width
3. **Swipe gestures** — Swipe between tabs on mobile
4. **Loading skeletons** — Skeleton variants for each card type during data generation
5. **Performance** — Memoize all data generators with stable cache keys; lazy-load Phase 2-4 components

---

## Technical Summary

```text
src/
├── data/student/
│   └── progressData.ts          ← NEW: adapter calling teacher generators
├── components/student/progress/
│   ├── ProgressHeroCard.tsx      ← Phase 1 (replaces OverallProgressCard)
│   ├── BatchStandingCard.tsx     ← Phase 1
│   ├── SubjectOverviewGrid.tsx   ← Phase 1 (replaces SubjectProgressList)
│   ├── SubjectDeepDive.tsx       ← Phase 2
│   ├── ChapterMasteryList.tsx    ← Phase 2
│   ├── WeakTopicsAlert.tsx       ← Phase 2
│   ├── DifficultyBreakdown.tsx   ← Phase 2
│   ├── SubjectBatchStanding.tsx  ← Phase 2
│   ├── ExamHistoryTimeline.tsx   ← Phase 3
│   ├── ExamTrendChart.tsx        ← Phase 3
│   ├── PerExamStandingCard.tsx   ← Phase 3
│   ├── ChapterDetailSheet.tsx    ← Phase 4
│   ├── InsightBanner.tsx         ← Phase 5
│   ├── SecondaryTagsPills.tsx    ← Phase 5
│   ├── StreakCalendar.tsx        ← Phase 5 (keep, rewire)
│   ├── AchievementBadges.tsx     ← Phase 5 (keep, rewire)
│   └── WeeklyActivityChart.tsx   ← Phase 5 (keep, rewire)
├── pages/student/
│   └── Progress.tsx              ← Rewritten with tab navigation
```

### Formulas (same source of truth as teacher)

- **PI** = 0.50 x Accuracy + 0.20 x Consistency + 0.15 x TimeEfficiency + 0.15 x AttemptRate
- **Consistency** = 100 - (stdDev / 30) x 100
- **Trend** = linear regression slope (> 2 = up, < -2 = down)
- **Performance bands**: Mastery >= 75, Stable 50-74, Reinforcement 35-49, Risk < 35
- **Topic flags**: strong >= 65%, moderate >= 40%, weak < 40%
- **Batch standing**: rank / totalStudents, percentile, delta from class average

### No new database tables needed

All data comes from existing generators. No migrations required.

