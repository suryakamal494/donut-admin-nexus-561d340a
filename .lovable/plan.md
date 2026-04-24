# Student Copilot — Session Continuity Rulebook + Implementation Plan

## The core problem (in one line)

Today every dashboard CTA and every chat message creates a **new thread**. The student has to hunt through history to resume work. We must flip this: **the system finds the right thread automatically; the student never searches.**

The solution has two halves:

1. A **single global chat** is the only entry point a student sees.
2. A **router** behind that chat decides — silently — whether the message belongs to an existing session or a new one, and opens the right artifact.

The student never picks a thread. Ever.

---

## Part 1 — The Rulebook (canonical, will be documented)

### Rule 1 — One global chat, no manual thread picking
- Dashboard, FAB, deep-links and the copilot page all open the **same global chat input**.
- The "thread list" in the left rail becomes a **read-only history view** (collapsed by default), not a picker the student must use to continue work.
- "New chat" button is removed from the primary flow. It moves to a secondary "Start fresh" menu item.

### Rule 2 — Session identity = Tool + Scope (not timestamp)
A "session" is defined by **what tool** + **what scope**, not by when it was created.

| Tool | Scope key (what makes it the same session) | Lifetime |
|---|---|---|
| Doubt / Concept (`s_doubt`) | subject + chapter + concept-cluster | Rolling 7 days, then archived |
| Practice (`s_practice`) | subject + chapter | Until student marks "done" or 14 days idle |
| Study Plan (`s_roadmap`) | plan duration window (e.g. "Week of Apr 22") | Until plan end-date |
| Exam Target (`s_exam_prep`) | exam_id (e.g. JEE Main 2026) | Until exam_date |
| Test Debrief | test_attempt_id | Permanent (one per attempt) |
| Progress (`s_progress`) | rolling weekly window | 7 days |

Two messages with the same Tool+Scope → **same thread**. Different scope → **new thread, automatically**.

### Rule 3 — The Router decides; the student does not
When a message is sent from the global chat:

```text
incoming message
    │
    ▼
1. Classify intent  (doubt | practice | plan | exam | progress | debrief)
2. Extract scope    (subject, chapter, exam_id, plan_window …)
3. Lookup           findActiveSession(tool, scope)
    │
    ├── found  → append message to that thread, open its artifact
    └── none   → create thread silently, open fresh artifact
```

The student sees only: their message, the answer, and the relevant artifact opening on the right. No "which chat?" prompt.

### Rule 4 — Surface continuation, don't ask for it
- When a match is found, show a small inline banner above the AI reply: *"Continuing your Physics Ch. 4 practice — 6/10 done."* with a single "Start fresh instead" link (escape hatch only).
- Never block the student to confirm.

### Rule 5 — Active vs Recent vs Archived (history view)
The history rail (now secondary) groups threads by status, not by routine:
- **Active** — has activity in last 48h OR has an unfinished artifact (incomplete practice, unfinished plan day, exam not yet passed).
- **Recent** — last 7 days, no unfinished work.
- **Archived** — older or explicitly closed. Hidden behind "Show all".

This keeps the surface clean even after months of use.

### Rule 6 — Artifact reuse beats artifact creation
Before any tool fires (`create_practice_session`, `create_study_plan`, `create_target_tracker`):
- The router checks if a live artifact of that type already exists for the scope.
- If yes → reopen and continue (e.g. resume question 7/10) instead of generating a new one.
- The AI is told via system prompt: *"An active practice for Physics/Newton's Laws exists at 6/10 — continue it; do not create a new one."*

### Rule 7 — Dashboard CTAs are scope hints, not thread creators
Today, clicking "Practice Physics" calls `createThread`. New rule:
- CTAs send a **scope-hinted message** into the global chat (e.g. `"Continue practice: Physics — Newton's Laws"`) and let the Router decide.
- This guarantees the same continuation logic from any entry point.

### Rule 8 — Auto-archive (so history never bloats)
- Practice with no activity for 14 days → archived.
- Study plan past its end-date → archived (kept readable).
- Exam target past exam_date → archived.
- Doubt threads with no follow-up for 7 days → archived.

### Rule 9 — Escape hatches (always available, never primary)
- "Start fresh" link inside the continuation banner.
- "Show archived" toggle in history.
- "Open in new chat" on any artifact.

These exist for power users; defaults are zero-friction.

### Rule 10 — Determinism & traceability
- Every routing decision is logged (`thread_id`, `decision: matched|new`, `scope_key`, `confidence`) for debugging and future tuning.
- The scope key is deterministic (`tool:subject:chapter` style string) so the same input always routes the same way.

---

## Part 2 — Documentation deliverables

A new file: **`docs/04-student/copilot-session-continuity.md`** containing:

1. **Philosophy** — "Zero-search copilot" principle.
2. **The 10 rules** above, verbatim, with examples.
3. **Session identity matrix** — the table from Rule 2, with example scope keys.
4. **Router flow** — the ASCII diagram + a worked example for each tool type.
5. **Lifecycle states** — Active / Recent / Archived definitions and triggers.
6. **Data model reference** — which fields on `student_copilot_threads` carry scope.
7. **Dashboard CTA contract** — how every card must hand off to the router.
8. **Escape hatches** — when and how the student can override.
9. **Logging & debugging** — how to read router decisions.
10. **Future-proofing checklist** — what to update when adding a new routine.

Updates to existing docs:
- `docs/04-student/dashboard.md` — note that all CTAs now route through the global chat router.
- `docs/04-student/README.md` — link to the new continuity doc.
- `docs/07-technical/data-layer.md` — add the session-scope schema additions.
- `.lovable/memory/features/student-copilot-architecture.md` — append a "Session Continuity (Phase 2)" section summarising the rulebook.

---

## Part 3 — Implementation Plan

### Phase A — Schema additions (one migration)

Add scope fields to `student_copilot_threads` so the router can match without re-parsing messages:

| Column | Type | Purpose |
|---|---|---|
| `tool` | text | normalized tool name (`doubt`, `practice`, `plan`, `exam`, `progress`, `debrief`) |
| `scope_key` | text | deterministic key, e.g. `practice:Physics:Newtons-Laws` |
| `scope_meta` | jsonb | `{ subject, chapter, exam_id, plan_window, … }` |
| `status` | text | `active` \| `recent` \| `archived` (default `active`) |
| `archived_at` | timestamptz | nullable |

Index: `(student_id, tool, scope_key, status)` for fast router lookup.

Add `router_decisions` table for traceability:
- `id, student_id, message_preview, tool, scope_key, decision (matched|new), thread_id, confidence, created_at`.

No data loss for existing threads — backfill `tool` from `routine_key` and leave `scope_key` null until first new message routes them.

### Phase B — The Router module

New file: `src/components/student/copilot/router/sessionRouter.ts`

Exports:
- `classifyIntent(text, context) → { tool, confidence }` — keyword + light LLM classification (reuse Lovable AI Gateway, `gemini-2.5-flash-lite` for speed).
- `extractScope(text, tool, context) → { scope_key, scope_meta }` — uses existing `classifySubject` + chapter detection from timetable context.
- `findActiveSession(studentId, tool, scope_key)` — Supabase query against new index.
- `route(text, context) → { threadId, isNew, banner }` — the orchestrator. Logs decision to `router_decisions`.

### Phase C — Wire the global chat

In `StudentCopilotPage.tsx`:
- Replace the current "create thread per CTA" logic in `handleSend` with a single call to `route()`.
- If `isNew` → silently create thread with `tool` + `scope_key` populated.
- If matched → set `currentThreadId` to the matched thread, append the message, render the continuation banner.
- Remove auto-create-thread from query-param handler; instead pass the deep-link prompt through `route()`.

### Phase D — Dashboard CTA refactor

All 7 dashboard cards (`ExamTargetCard`, `LastTestResultCard`, `DailyStudyGoalRing`, `HomeworkSection`, `RecentCopilotCard`, `UpcomingTestCard`, `AIRecommendationCard`):
- Stop building `?routine=...&prompt=...` URLs that imply thread creation.
- Instead navigate to `/student/copilot?intent=<scope-hinted-prompt>` and let the router handle it.
- `RecentCopilotCard` becomes "Resume" — directly opens the most recent active thread by scope, no picker.

### Phase E — UI: Continuation banner + simplified left rail

- New `ContinuationBanner.tsx` — small chip above AI reply with progress (e.g. "6/10 done") and "Start fresh" link.
- `StudentLeftRail.tsx` — collapse history by default, group by Active/Recent/Archived, demote "New chat" to a "⋯" menu item.

### Phase F — Lifecycle automation

A lightweight client-side sweep (runs on copilot page load) + an edge function `copilot-archive-sweep` (callable, also schedulable later):
- Mark threads `archived` per Rule 8 thresholds.
- Update `last_activity_at` on every message/practice answer.

### Phase G — Tool reuse guard

In `student-copilot-chat` edge function, prepend to the system prompt:
- The list of live artifacts for the current scope (`"Active practice for Physics/Newton's Laws: 6/10 done — continue, do not create new"`).
- The model is instructed to call `resume_*` semantics (just append questions / next steps) rather than `create_*` when a live artifact exists.

### Phase H — Documentation

Create `docs/04-student/copilot-session-continuity.md` with all content from Part 2. Register it in `src/data/docsNavigation.ts`. Update related docs and the memory file.

---

## What the student experiences after this ships

- Opens dashboard, taps **"Practice Physics"** → global chat opens, sees their previous practice resume at Q7/10 with a tiny "Continuing — start fresh?" link. No picker.
- Types **"explain dot product again"** in the chat → router finds their open Math/Vectors doubt thread, appends the question, opens the existing concept explainer. No new thread spawned.
- Types **"give me a JEE plan for next week"** → no existing plan in that window, router creates one silently and opens it.
- Goes to history → sees just **"Active (3)"** with progress chips. Everything else tucked under "Recent" / "Archived".

Zero searching, zero choosing, full continuity.
