
The user has pasted a complete spec/prompt for "RoutinePilot" — a teacher-facing AI copilot. They said "in teacher panel" at the start, which means they want this built INTO the existing teacher panel of the current project (not as a separate export).

This is a large feature. Let me plan a phased build inside the teacher panel.

## Plan: Build RoutinePilot inside Teacher Panel

### Where it lives
New route `/teacher/routine-pilot` added to the teacher panel sidebar (under existing TeacherLayout). Three-pane NotebookLM-style workspace.

### Phase 1 — Data & Backend

**Database tables** (new migration):
- `rp_batches` — id, name, subject, grade, section
- `rp_routines` — id, key, label, icon, description, default_system_prompt, quick_start_chips[], is_active, sort_order
- `rp_threads` — id, batch_id, routine_id, title, last_message_at, created_at
- `rp_messages` — id, thread_id, role, content, created_at
- `rp_artifacts` — id, batch_id, thread_id (nullable), type, title, content (jsonb), created_at
  - CHECK on type: lesson_plan, ppt, test, homework, banded_homework, report, schedule

RLS: public read/write (single-teacher prototype, matching project's current mock-driven approach).

**Seed data** (inserted via migration):
- 4 batches: 9-A Science, 10-A Science, 10-B Science, 11-B Physics
- 6 routines (3 active, 3 coming-soon)
- For each batch × each active routine: 1 thread + 2 messages + 1 artifact
- Every batch gets a `banded_homework` artifact under Homework
- 11-B also gets a `schedule` artifact
- Each batch gets a `ppt` artifact (8–10 slides) under Lesson Prep

**Edge function** `routine-pilot-chat`:
- Inputs: thread_id, batch_id, routine_key, messages[]
- Loads routine system prompt + batch context
- Calls Lovable AI Gateway (`google/gemini-2.5-flash` default)
- Tool calls: `create_lesson_plan`, `create_ppt`, `create_test`, `create_homework`, `create_banded_homework`, `schedule_homework`
- On tool call → inserts row in `rp_artifacts`, returns artifact id
- Streaming SSE response

### Phase 2 — UI Shell

New folder: `src/components/teacher/routine-pilot/`

- `RoutinePilotPage.tsx` — three-pane shell, route entry
- `LeftRail.tsx` — batch switcher, routine list, thread list
- `ChatPane.tsx` — messages list, composer, quick-start chips
- `ArtifactPane.tsx` — tabs ("This thread" / "Batch library"), card list, inline detail swap (no modal)
- `useChat.ts` — hook that streams from edge function, appends messages, refreshes artifacts on tool call

Sidebar entry in `TeacherSidebar` → "RoutinePilot" with Sparkles icon.

### Phase 3 — Artifact Renderers

`src/components/teacher/routine-pilot/artifacts/`:
- `ArtifactCard.tsx` — list-item summary (icon + title + type badge + timestamp)
- `ArtifactView.tsx` — switch on type → renders one of:
  - `LessonPlanView` — objectives, materials, sections, homework
  - `PptView` — vertical slide cards (number badge, title, bullets, speaker notes)
  - `TestView` — questions grouped by type with marks
  - `HomeworkView` — flat problem list (legacy)
  - `BandedHomeworkView` — 4-tab strip (mastery=emerald, stable=teal, reinforcement=amber, foundational=rose), per-band instructions/problems/time, "Schedule send" button
  - `ScheduleView` — confirmation card with time, channel, band chips, mock reschedule/cancel

Inline detail swap inside `ArtifactPane` via local state + back arrow. No Dialog component used.

### Behavior
- Batch switch → reloads routines/threads/artifacts
- Routine switch → filters threads
- Thread click → loads messages + scopes "This thread" tab
- "Batch library" tab → all artifacts for current batch
- Quick-start chip click → fills composer, cursor at `____`
- Coming-soon routines → disabled with "Coming soon" badge
- Narrow viewport → left/right collapse, chat stays usable

### Files

| File | Action |
|---|---|
| Migration: 5 tables + seeds | Create |
| `supabase/functions/routine-pilot-chat/index.ts` | Create |
| `supabase/config.toml` | Add `[functions.routine-pilot-chat] verify_jwt = false` |
| `src/pages/teacher/RoutinePilot.tsx` | Create |
| `src/components/teacher/routine-pilot/*` (~12 files) | Create |
| `src/components/layout/TeacherSidebar.tsx` | Add nav entry |
| `src/App.tsx` (or teacher routes file) | Add route |

### Phasing
- **Phase 1** (one go): Migration + seed + edge function + sidebar/route stub
- **Phase 2** (one go): Shell UI + chat streaming + artifact list
- **Phase 3** (one go): All 6 artifact renderers + inline detail swap

Total: 3 implementation messages after approval.

Notes:
- Tables prefixed `rp_` to avoid collision with future real batch/thread tables
- Uses existing TeacherLayout — no new global chrome
- No new visual styling — uses existing tokens (primary/accent/muted/etc.)
- LOVABLE_API_KEY already present, no secret prompts needed
