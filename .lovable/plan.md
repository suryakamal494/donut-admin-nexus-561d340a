

# Add Exit Button + Seed Mock Data for Student Copilot

## What's Happening Now

1. The copilot page has no way to go back to the student panel — no "Exit" button.
2. The copilot is completely static — no mock artifacts, threads, messages, or notifications are seeded. All lists are empty.

## What We'll Build

### 1. Exit Copilot Button

Add an "Exit Copilot" button in the left rail, above Arjun Sharma's profile section. On click, navigates back to `/student/dashboard`.

**File**: `src/components/student/copilot/StudentLeftRail.tsx`
- Add an `ArrowLeft` icon button at the very top: "← Exit Copilot"
- `useNavigate()` to `/student/dashboard`
- Also add this button to the chat pane header (for mobile, where left rail is hidden)

**File**: `src/components/student/copilot/StudentChatPane.tsx`
- Add a small "← Back" button visible on the welcome screen header for mobile users

### 2. Create Mock Data File

**New file**: `src/data/student/copilotMockData.ts`

A comprehensive mock data generator that creates:

- **5 student routines** (seeded into `rp_routines` with audience='student'): s_doubt, s_practice, s_exam_prep, s_roadmap, s_progress
- **6 sample threads** across different routines and subjects
- **12+ messages** across threads (user + assistant pairs showing realistic conversations)
- **9 sample artifacts** (one per artifact type):
  - `concept_explainer` — Newton's Laws with progressive steps
  - `worked_solution` — Projectile motion with Given/To Find/Steps/Answer
  - `formula_sheet` — Kinematics formulas with LaTeX expressions
  - `practice_session` — 5 MCQ questions on Mechanics
  - `study_plan` — 5-day plan with daily tasks
  - `target_tracker` — JEE Mains target with subject gaps
  - `mastery_map` — Physics + Chemistry topics with bands
  - `progress_report` — Weekly stats with trends
  - `test_debrief` — 10-question test analysis with wrong answers
- **3 notifications** (homework_pending, exam_upcoming, chapter_today)

All data structures match the exact content interfaces consumed by the 9 artifact view components.

### 3. Seed Data into Database on First Load

**File**: `src/components/student/copilot/seedCopilotData.ts`

A one-time seeder function that:
1. Checks if student routines exist in `rp_routines` with `audience='student'`
2. If not, inserts the 5 routines
3. Checks if any threads exist for `student-001`
4. If not, inserts mock threads, messages, artifacts, and notifications
5. Uses a localStorage flag `copilot_seeded` to avoid re-running

**File**: `src/components/student/copilot/StudentCopilotPage.tsx`
- Call `seedCopilotDataIfNeeded()` before the main data fetch in the initial `useEffect`
- After seeding, proceed with normal fetch flow — artifacts, threads, messages all populate naturally

### 4. Files Changed

| File | Action |
|------|--------|
| `src/data/student/copilotMockData.ts` | Create — all mock data definitions |
| `src/components/student/copilot/seedCopilotData.ts` | Create — DB seeder logic |
| `src/components/student/copilot/StudentLeftRail.tsx` | Edit — add Exit Copilot button |
| `src/components/student/copilot/StudentChatPane.tsx` | Edit — add Back button on mobile |
| `src/components/student/copilot/StudentCopilotPage.tsx` | Edit — call seeder on mount |

### Technical Notes

- Mock artifacts use realistic CBSE Class 10 Physics/Chemistry/Math content
- Practice session questions have proper `id`, `type`, `options`, `correct_answer`, and `explanation` fields
- Study plan has proper `days[].items[].task` structure with durations
- All seeding uses the existing `supabase` client with `insert` calls
- The seeder is idempotent — safe to run multiple times

