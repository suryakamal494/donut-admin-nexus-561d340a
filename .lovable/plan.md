

## What I understood from your request

You want the **Reports routine** in Copilot to be enabled and become a **conversational analytics layer** over the **existing Teacher Reports module**. Concretely:

1. **Unlock the routine** — right now "Reports" is grayed-out as "Coming soon" because it's marked inactive in the database. Activate it.

2. **Same source of truth as `/teacher/reports`** — when a teacher asks "How did 10A do in the Wave Optics test?", the answer must come from the *same* numbers the Reports page already shows (batch averages, exam analytics, chapter health, at-risk students, topic flags, performance bands). No invented numbers.

3. **Conversational, batch-scoped Q&A** — the active batch in the left rail = the scope of the conversation. Questions are auto-answered for that batch:
   - *"Which students are at risk?"* → list of students from `getChapterDetail` / `ExamAnalytics.allStudents`
   - *"How did the last exam go?"* → verdict + score distribution from `getExamAnalyticsForBatch`
   - *"Which chapters are weakest?"* → ranked chapter health from `getBatchChapters`
   - *"Compare last two exams"* → exam history from `getBatchExamHistory`
   - *"Top performers"*, *"weak topics in Optics"*, *"at-risk in 2+ subjects"*, etc.

4. **Render answers as text + cards inline in the chat (NOT as right-pane artifacts)** — because reports are *read-only conversation*, not generated documents. Charts only when the data calls for it (distributions, trends).

5. **Cross-link to the actual Reports pages** — every card has a "Open in Reports →" link that deep-links to the matching `/teacher/reports/:batchId`, `/teacher/reports/:batchId/exams/:examId`, or `/teacher/reports/:batchId/chapters/:chapterId` page.

## Critical compatibility gap I'll handle

Copilot batches use UUIDs (`11111111-…-111101` "Class 9-A"). Reports mock data uses keys like `batch-10a`, `batch-10b`, `batch-11a`. I'll add a small **batch-mapping layer** on the edge function side so a Copilot batch resolves to the closest Reports batch by grade+section. (No DB migration — just a lookup.)

## The plan

### 1. Activate the Reports routine
- DB update: `is_active = true` for the `reports` routine.
- Set sensible quick-start chips:
  - "How did the last exam go?"
  - "Which students are at risk?"
  - "Weakest chapters this term"
  - "Top performers in 10A"
  - "Compare last two exams"
- Update `default_system_prompt` to a Reports-specific analyst prompt.

### 2. New read-only data tools in the edge function
Add to `routine-pilot-chat/index.ts` — only available when `routine_key === "reports"`:

| Tool | Returns |
|---|---|
| `get_batch_overview` | Batch health summary (avg, trend, at-risk count, exam count) |
| `get_recent_exams` | Last N completed exams with averages |
| `get_exam_analysis` | Verdict, score distribution, performance bands, topic flags for one exam |
| `get_chapter_health` | Chapter-wise success rates and weak-topic counts |
| `get_at_risk_students` | Students in `risk` / `reinforcement` bands with names + PI |

Each tool runs **server-side** against the same generators used by the Reports pages (we'll import the data from a shared serializer the edge function can call via a small fetch back to the app, OR we mirror the generator logic in the edge function — see "How data flows" below).

### 3. How data flows (the linking mechanism)
Since the data lives in client-side TS files (`reportsData.ts`, `examResults.ts`), I'll create **one new edge function `teacher-reports-data`** that exposes the same generator outputs as JSON (Deno port of the deterministic seeded generators — same PRNG, same output). The Reports routine's tools call this function internally. Result: **identical numbers** in the Reports page and in Copilot answers.

Alternative considered: pre-compute and pass batch context inline. Rejected — would balloon the prompt and miss exam-specific drill-downs.

### 4. New chat-inline render components (no right-pane artifact)
In `ChatPane.tsx`, when a Reports tool result arrives, render structured cards **inline in the assistant message** instead of going to ArtifactPane:

- **`ReportSummaryCard`** — batch overview tile (avg, trend arrow, at-risk pill, "Open in Reports →")
- **`ExamResultCard`** — verdict banner + 4-band performance + mini bar chart of score distribution
- **`StudentListCard`** — compact list (name, roll, %, trend) with per-row deep link
- **`ChapterHealthCard`** — sortable chapter list with weak-topic chips
- **`MiniTrendChart`** — small recharts line for "last N exams"

Detection: tool calls prefixed `get_*` render inline; existing `create_*` / `update_*` keep their artifact behavior.

### 5. Routine-aware chat behavior
- Hide the right artifact pane (or show "No artifacts in Reports mode") when `routine_key === "reports"` to give the chat full width.
- Keep the same tutorial, refine, mobile drawer logic — no behavior change.

### 6. Navigation deep-links
Card buttons route to existing Reports pages:
- Batch → `/teacher/reports/:batchId`
- Exam → `/teacher/reports/:batchId/exams/:examId`
- Chapter → `/teacher/reports/:batchId/chapters/:chapterId`
- Student → `/teacher/reports/:batchId/students/:studentId` (if exists, else batch page)

### Files touched

| File | Change |
|---|---|
| DB — `rp_routines` row | Activate reports routine + chips + prompt (data update) |
| `supabase/functions/teacher-reports-data/index.ts` | NEW — Deno port of report generators (deterministic JSON) |
| `supabase/functions/routine-pilot-chat/index.ts` | Add 5 `get_*` tools (Reports-only); pass results back as structured JSON in the SSE stream |
| `src/components/teacher/routine-pilot/ChatPane.tsx` | Detect `report_data` events from stream; render inline cards under the assistant message |
| `src/components/teacher/routine-pilot/streamChat.ts` | Add `onReportData` callback for the new event type |
| `src/components/teacher/routine-pilot/reports-cards/` (NEW folder) | `ReportSummaryCard`, `ExamResultCard`, `StudentListCard`, `ChapterHealthCard`, `MiniTrendChart` |
| `src/components/teacher/routine-pilot/ArtifactPane.tsx` | Show "Reports mode — answers appear in chat" empty state when routine is reports |
| `src/components/teacher/routine-pilot/RoutinePilotPage.tsx` | (small) Pass routine key to ArtifactPane (already there) — verify |

### What does NOT change

- All other routines (Lesson Prep, Test Creation, Homework) — untouched.
- The Teacher Reports pages themselves — untouched, just deep-linked into.
- Tutorial, refine, mobile sheets, batch switcher — untouched.
- No new DB tables, no schema migrations — only the routines row activation.

### Out of scope

- Wiring real (non-mock) student data — Reports module is mock-data-driven today; conversational analytics will be exact replicas of those mocks.
- Editing reports from the chat (it's read-only).
- Cross-batch / institute-wide Q&A — strictly scoped to the active batch.

### Phasing

Single implementation pass (one approval, then build).

