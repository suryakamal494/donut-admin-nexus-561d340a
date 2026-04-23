

# Student Dashboard — Layout Optimization and Section Cleanup

## Summary

Simplify the dashboard by removing low-value sections, promoting homework visibility, replacing the "Recent Study Session" card with an **Exam Target Tracker** (e.g., JEE/NEET goal from `student_exams` table), and making the Last Test Result conditional (48-hour window) with graceful layout adaptation when it disappears.

## What Changes

### 1. Remove QuickStatsBar entirely

The "24 Subjects, 4 Tests, 12d Streak" pills add no actionable value. The streak is already in the header. Remove the component from the dashboard page and the `QuickStatsBar` import. The `DailyStudyGoalRing` compact variant that lived inside it moves into the header area on desktop as a small inline element.

### 2. Replace "Recent Study Session" with Exam Target Tracker

Instead of surfacing the last copilot thread (which is just a link back to copilot — the AI Suggestions already do that), show the student's **active exam target** from the `student_exams` table:

```text
┌──────────────────────────────────┐
│ 🎯 My Target                    │
│                                  │
│ JEE Mains 2026                   │
│ Target: 250/300                  │
│ ░░░░░░░░░░░░░░░░  83 days left  │
│                                  │
│ [Study Plan ✨]                  │
└──────────────────────────────────┘
```

- Fetches the nearest upcoming exam from `student_exams` where `exam_date > now()`
- Shows exam name, target score, countdown, and a progress-style days-remaining bar
- "Study Plan" chip opens copilot with `s_exam_prep` routine pre-filled
- If no exam target exists, shows a prompt: "Set your exam target" linking to copilot's `s_roadmap` routine
- This gives the dashboard a **purpose** — the student sees their goal every day

### 3. Last Test Result — 48-hour conditional display

- Add a `date` field check: only render the card if `lastTestResult.date` is within the last 48 hours
- When the card is hidden, the Exam Target card spans full width on mobile (already full width) and on desktop takes the full row or sits alongside the Daily Study Goal ring
- The layout grid becomes responsive: `grid-cols-1` when only one card is visible, `grid-cols-2` when both are present

### 4. Move Homework UP — directly after AI Suggestions

Homework is the most urgent daily item. It should not be buried below two cards and a study goal ring. New order:

```text
Header (greeting + streak)
AI Suggestions Carousel
Pending Homework  ← moved up
[Last Test Result (if <48h) | Exam Target]  ← conditional row
Daily Study Goal Ring (mobile only)
Today's Schedule
Upcoming Tests
```

### 5. Daily Study Goal Ring — stays but repositioned

- **Mobile**: compact horizontal card between the conditional row and the schedule
- **Desktop**: inline in the header area as a small ring next to the streak badge (replaces its former home in the removed QuickStatsBar)

---

## New Dashboard Layout (Mobile)

```text
┌─ Hi, Arjun! 👋 ─────────── 🔥 12 ─┐
│ Let's continue learning             │
├─────────────────────────────────────┤
│ ✨ AI Suggestions  [carousel >>>]   │
├─────────────────────────────────────┤
│ 📚 Pending Homework (4)            │
│  • Quadratic Equations   Today  ⚠️  │
│  • Cell Structure Diagram  2 days   │
│  • Motion Worksheet       3 days    │
├─────────────────────────────────────┤
│ 🎯 My Target                       │
│ JEE Mains 2026 • 83 days left      │
│ Target: 250/300  [Study Plan ✨]    │
├─────────────────────────────────────┤
│ ⏱ 45/60 min today [study goal]     │
├─────────────────────────────────────┤
│ 📅 Today's Schedule                │
│  9:00  Math - Quadratic Equations   │
│  10:15 Chemistry - Organic          │
│  ...                                │
├─────────────────────────────────────┤
│ 📝 Upcoming Tests (4)              │
│  [Kinematics Quiz] [Algebra Test]   │
└─────────────────────────────────────┘
```

When Last Test Result is active (within 48h), it appears as a card above the Exam Target, stacked on mobile, side-by-side on desktop.

---

## Technical Details

### Files Changed

| File | Action |
|------|--------|
| `src/components/student/dashboard/ExamTargetCard.tsx` | **New** — fetches from `student_exams`, shows countdown + target, links to copilot |
| `src/components/student/dashboard/LastTestResultCard.tsx` | **Edit** — add 48-hour check, return `null` when expired |
| `src/pages/student/Dashboard.tsx` | **Edit** — remove QuickStatsBar, reorder sections, add ExamTargetCard, make test result row conditional |
| `src/components/student/dashboard/index.ts` | **Edit** — export ExamTargetCard, remove QuickStatsBar export |
| `src/components/student/dashboard/QuickStatsBar.tsx` | **Delete** — no longer used |

### ExamTargetCard Data Source

Reads from existing `student_exams` table (already seeded by copilot):
```sql
SELECT * FROM student_exams 
WHERE student_id = 'student-001' AND exam_date > now()
ORDER BY exam_date ASC LIMIT 1
```

Shows: `name`, `target_score`, `max_score`, days until `exam_date`.

### Conditional Layout Logic (Dashboard.tsx)

```tsx
// 48-hour check for Last Test Result
const testDate = new Date(lastTestResult.date);
const hoursSinceTest = (Date.now() - testDate.getTime()) / (1000 * 60 * 60);
const showTestResult = hoursSinceTest <= 48;

// Layout adapts:
// - Both visible: 2-col grid on desktop
// - Only exam target: full-width card
// - Only test result (no exam target): full-width card
```

### No database changes needed

The `student_exams` table already exists with the right schema (`name`, `exam_date`, `target_score`, `max_score`). The copilot seeds mock exam data. No migrations required.

