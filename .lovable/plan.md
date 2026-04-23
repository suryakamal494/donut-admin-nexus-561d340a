

# Student Dashboard — New Sections and Copilot Activity Integration

## Summary

Add three new sections to the student dashboard: (1) a **Last Test Result** snapshot card, (2) a **Recent Copilot Activity / Continue Learning** card that surfaces the student's last AI-assisted study session, and (3) a **Daily Study Goal** progress ring. Skip a standalone "AI Sessions" tracker — the copilot already tracks every interaction as threads with artifacts, so the "Recent Copilot Activity" card naturally covers this by surfacing the last practice session, doubt solved, or study plan created.

**Why not a separate "AI Sessions" section?** The copilot stores threads (`student_copilot_threads`), messages, artifacts, and attempts. Each thread *is* a session. Building a separate session tracker would duplicate this data. Instead, we query the most recent thread and its artifact to show a "pick up where you left off" card — same value, zero redundancy.

---

## Current Dashboard Layout (for reference)

```text
Header (greeting + streak)
QuickStatsBar (desktop only)
AI Suggestions Carousel (copilot-linked)
[Homework | Schedule] (2-col on desktop)
Upcoming Tests
```

## New Layout

```text
Header (greeting + streak)
QuickStatsBar (desktop only)
AI Suggestions Carousel (copilot-linked)
[Last Test Result | Recent Copilot Activity] (2-col on desktop, stacked on mobile)
[Homework | Schedule] (2-col on desktop)
Daily Study Goal (compact ring — mobile: above homework, desktop: in QuickStatsBar)
Upcoming Tests
```

---

## Changes

### 1. Last Test Result Card — New Component

A compact card showing the student's most recent completed test:

```text
┌──────────────────────────────────┐
│ 📊 Last Test Result              │
│                                  │
│ Kinematics Quiz — Physics        │
│ 72/100  •  Rank #5/32            │
│ ████████████░░░░  72%            │
│                                  │
│ [View Details]  [Prepare ✨]     │
└──────────────────────────────────┘
```

- Shows: test name, subject, score, batch rank, accuracy bar
- "View Details" navigates to `/student/tests/:testId/results`
- "Prepare" chip opens copilot with `s_exam_prep` routine for that subject
- Data source: mock data in `dashboard.ts` (a new `lastTestResult` object) — mirrors the `TestResultData` interface structure but simplified

**Files:**
- `src/components/student/dashboard/LastTestResultCard.tsx` — New component
- `src/data/student/dashboard.ts` — Add `LastTestResult` interface and mock data
- `src/components/student/dashboard/index.ts` — Export new component

### 2. Recent Copilot Activity Card — New Component

This replaces the need for a separate "AI Sessions" tracker. Shows the last copilot thread:

```text
┌──────────────────────────────────┐
│ ✨ Recent Study Session          │
│                                  │
│ Practice: Laws of Motion         │
│ Physics  •  2 hours ago          │
│ Solved 8/10 questions            │
│                                  │
│ [Continue]                       │
└──────────────────────────────────┘
```

- Fetches the most recent thread from `student_copilot_threads` via Supabase
- If a `practice_session` artifact exists, shows question stats
- "Continue" navigates to `/student/copilot` with the thread auto-selected
- Falls back to a "Start a study session" prompt if no threads exist
- Shows routine label (Doubt, Practice, Exam Prep) as a colored badge

**Files:**
- `src/components/student/dashboard/RecentCopilotCard.tsx` — New component, uses Supabase query
- `src/components/student/dashboard/index.ts` — Export new component

### 3. Daily Study Goal Ring — New Component

A compact circular progress indicator:

```text
┌────────────────────────┐
│    ╭───╮               │
│   │ 45 │  45 min today │
│    ╰───╯  Goal: 60 min │
│                        │
└────────────────────────┘
```

- **Mobile**: Appears as a small horizontal card above the homework/schedule grid
- **Desktop**: Added as a 4th pill in `QuickStatsBar`
- Uses a simple SVG circle for the ring (no extra library needed)
- Data: mock value in `dashboard.ts` (`dailyStudyGoal: { current: 45, target: 60 }`)
- Tapping opens copilot with a generic "Let's study" prompt

**Files:**
- `src/components/student/dashboard/DailyStudyGoalRing.tsx` — New component
- `src/data/student/dashboard.ts` — Add `dailyStudyGoal` mock data
- `src/components/student/dashboard/QuickStatsBar.tsx` — Add study goal as 4th stat pill on desktop
- `src/components/student/dashboard/index.ts` — Export new component

### 4. Dashboard Page Layout Update

Update `src/pages/student/Dashboard.tsx` to include the new sections in the correct order:

- Import `LastTestResultCard`, `RecentCopilotCard`, `DailyStudyGoalRing`
- Add the test result + copilot activity row between AI Suggestions and the homework/schedule grid
- Add the study goal ring for mobile (visible only on mobile, above the homework grid)
- Desktop study goal is handled inside QuickStatsBar

---

## Files Summary

| File | Action |
|------|--------|
| `src/data/student/dashboard.ts` | Edit — add `LastTestResult` interface, mock data, `dailyStudyGoal` object |
| `src/components/student/dashboard/LastTestResultCard.tsx` | New — test result snapshot card |
| `src/components/student/dashboard/RecentCopilotCard.tsx` | New — recent copilot thread card with Supabase query |
| `src/components/student/dashboard/DailyStudyGoalRing.tsx` | New — SVG ring progress for daily study time |
| `src/components/student/dashboard/QuickStatsBar.tsx` | Edit — add study goal as 4th pill |
| `src/components/student/dashboard/index.ts` | Edit — export 3 new components |
| `src/pages/student/Dashboard.tsx` | Edit — integrate new sections into layout |

No database changes. No new routes. The `RecentCopilotCard` reads from existing `student_copilot_threads` table.

