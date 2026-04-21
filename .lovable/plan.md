

# Scalability Audit — Student Progress Reports

## Findings

### 1. Mock Data Ceiling (Current: max 22 exams)

The `teacherExams` array has only 25 entries, 22 with `status: "completed"`. The student profile generator in `studentReportData.ts` (line 203) filters `teacherExams` by batch and status, so `examHistory` maxes out at ~22 items. **There is no way to test 100-exam scalability without expanding mock data.**

### 2. ExamHistoryTimeline — No Pagination (CRITICAL)

`ExamHistoryTimeline.tsx` renders every exam in the array with a `motion.div` per item (line 40: `sorted.map()`). At 100 exams:
- 100 animated DOM nodes mount simultaneously
- Staggered animation: `delay: 0.05 * Math.min(i, 10)` — capped at 10, so animation is fine, but DOM count is not
- No "Show more" / virtualized list pattern
- On 320px mobile, this creates a very long scroll inside the card

**Fix**: Implement a "Show more" pattern — display the 10 most recent exams, with a "Show all" / "Load more" button.

### 3. ExamTrendChart — Unreadable at Scale (CRITICAL)

`ExamTrendChart.tsx` plots every exam as a data point on the Recharts `LineChart`. At 100 exams:
- X-axis labels (E1, E2, ... E100) overlap and become unreadable
- 100 dots crowd the line, making it a blob
- Tooltip hover becomes imprecise

**Fix**: Show only the last 20 exams by default, with a "Show all" toggle or a range slider. Alternatively, aggregate by month when count exceeds a threshold.

### 4. ChapterMasteryList — Uncapped Animation Delays (MODERATE)

`ChapterMasteryList.tsx` line 42: `transition={{ delay: 0.05 * i }}` — delay is NOT capped. With 30 chapters, the last item takes 1.5s to appear. At 50 chapters, 2.5s. This creates a perceived-lag issue.

Also no pagination — all chapters render at once.

**Fix**: Cap animation delay at `Math.min(i, 8)`. Add a "Show more" pattern if chapters exceed 10.

### 5. Data Layer — Eager Computation of All Tabs (MODERATE)

In `Progress.tsx`, all `useMemo` hooks run on mount regardless of which tab is active:
```
const exams = useMemo(() => getExamsWithContext(), []);
const streakData = useMemo(() => getDerivedStreakData(), []);
const achievements = useMemo(() => getDerivedAchievements(), []);
```

At 100 exams x 8 subjects, this computes ~800 exam-context objects, all streak derivations, and all achievements before the user even looks at the Overview tab.

**Fix**: Move per-tab data into the tab's render branch (compute only when tab is active), or use lazy initialization.

### 6. Nested Linear Scan in `getExamsWithContext()` (MINOR)

Line 228: `batchExams.find(be => be.examId === exam.examId)` inside a `.map()` = O(n*m). At 100 exams this is ~10,000 comparisons — fast in absolute terms, but easy to fix with a Map lookup.

**Fix**: Pre-build a `Map<examId, BatchExamEntry>` before the `.map()`.

### 7. StreakCalendar — `isSameDay` Linear Scan (MINOR)

Line 21: `activeDays.some(activeDay => isSameDay(activeDay, day))` runs for each of ~30 days in the month. At 100+ active days this is 3,000 date comparisons per render. Not critical but easy to optimize with a `Set<string>`.

### 8. SubjectOverviewGrid — Scales Well (OK)

Grid layout with `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4` handles 8+ subjects. Even at 15 subjects, the grid wraps cleanly. No issue here.

---

## Remediation Plan

### Step 1: Expand Mock Data for Testing

Add a configurable exam count to `studentReportData.ts` so the profile generator can produce 50-100 exam history entries regardless of the `teacherExams` array size. This is needed to actually validate the fixes.

### Step 2: ExamHistoryTimeline — Add "Show More"

- Display the 10 most recent exams by default
- Add a "Show N more" button at the bottom (batch of 10)
- Show total count: "Showing 10 of 87 exams"
- Follows the existing `reports-list-scalability` memory pattern

### Step 3: ExamTrendChart — Add Range Limiter

- Default to last 20 exams on the chart
- Add a small toggle: "Last 20 | Last 50 | All"
- When "All" is selected with 50+ points, hide individual dots to keep the line clean

### Step 4: ChapterMasteryList — Cap Animations + Pagination

- Cap stagger delay: `Math.min(i, 8) * 0.05`
- Show first 8 chapters, "Show all N chapters" button for the rest

### Step 5: Lazy Tab Data

- Move `getExamsWithContext()` computation inside the Exams tab branch
- Move `getDerivedStreakData()`, `getDerivedAchievements()` inside the Insights tab branch
- Keep Overview data eager (it's the default tab)

### Step 6: Data Layer Micro-Optimizations

- `getExamsWithContext()`: Build `Map<examId, BatchExamEntry>` before mapping
- `StreakCalendar`: Convert `activeDays` to a `Set<string>` of ISO date strings for O(1) lookup

---

## Files Changed

| File | Change |
|------|--------|
| `src/data/teacher/studentReportData.ts` | Expand mock exam generation to support 50-100 exams |
| `src/data/student/progressData.ts` | Map-based lookup in `getExamsWithContext()`, Set-based in streak |
| `src/components/student/progress/ExamHistoryTimeline.tsx` | "Show more" pagination (10 at a time) |
| `src/components/student/progress/ExamTrendChart.tsx` | Range limiter (Last 20/50/All toggle) |
| `src/components/student/progress/ChapterMasteryList.tsx` | Cap animation delay, "Show more" at 8 |
| `src/components/student/progress/StreakCalendar.tsx` | Set-based date lookup |
| `src/pages/student/Progress.tsx` | Lazy tab data computation |

