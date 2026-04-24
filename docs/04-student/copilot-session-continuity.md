# Student Copilot — Session Continuity Rulebook

> **Status:** Canonical reference. Any change to copilot routing, thread creation, or dashboard CTAs MUST update this document first.

## 1. Philosophy — The Zero-Search Copilot

The student should **never have to search for a chat to continue work**.

Every entry point — dashboard CTAs, the floating chat button, deep links, the copilot page itself — funnels into **one global chat input**. Behind that input, a **router** silently decides whether the message belongs to a session that already exists, or whether a new session must be created. The student sees only their message, the answer, and the relevant artifact opening on the right.

No thread picker. No "which chat do you want to continue?" prompts. No naming chats. Continuation is the default; starting fresh is an explicit, secondary action.

---

## 2. The 10 Rules

### Rule 1 — One global chat, no manual thread picking

- The dashboard, FAB, deep-links, and the copilot page all open the **same global chat input**.
- The thread list in the left rail is a **read-only history view**, collapsed by default. It is not a picker the student must use to continue work.
- The "+ New chat" button is removed from the primary flow. It moves to a secondary "Start fresh" menu item.

### Rule 2 — Session identity = Tool + Scope, not timestamp

A "session" is defined by **what tool** is being used + **what scope** it operates on. Not by when it was created.

| Tool key | Routine | Scope = "same session when…" | Lifetime |
|---|---|---|---|
| `doubt` | `s_doubt` | same subject + chapter + concept-cluster | Rolling 7 days, then archived |
| `practice` | `s_practice` | same subject + chapter | Until student marks "done" or 14 days idle |
| `plan` | `s_roadmap` | same plan duration window (e.g. "Week of Apr 22") | Until plan end-date |
| `exam` | `s_exam_prep` | same `exam_id` (e.g. `JEE-Main-2026`) | Until exam_date |
| `debrief` | (event-based) | same `test_attempt_id` | Permanent — one per attempt |
| `progress` | `s_progress` | same rolling weekly window | 7 days |

**Rule:** Two messages with the same Tool+Scope → **same thread**. Different scope → **new thread, automatically**.

### Rule 3 — The Router decides; the student does not

When a message is sent from the global chat:

```text
incoming message
    │
    ▼
1. Classify intent  →  tool      (doubt | practice | plan | exam | debrief | progress)
2. Extract scope    →  scope_key (e.g. "practice:Physics:Newtons-Laws")
3. Lookup           →  findActiveSession(student_id, tool, scope_key)
    │
    ├── found  →  append message to that thread, open its artifact, show banner
    └── none   →  create thread silently with tool + scope_key, open fresh artifact
```

The student sees only: their message, the answer, the artifact. Never a "which chat?" prompt.

### Rule 4 — Surface continuation, don't ask for it

When a match is found, render a small inline banner above the AI reply:

> *Continuing your Physics Ch. 4 practice — 6/10 done.*  ·  **Start fresh instead**

The banner is informative + an escape hatch. It never blocks the student.

### Rule 5 — Active vs Recent vs Archived

The history rail (now secondary) groups threads by **status**, not by routine:

- **Active** — activity in last 48 h, OR has an unfinished artifact (incomplete practice, undone plan day, exam not yet passed).
- **Recent** — last 7 days, no unfinished work.
- **Archived** — older or explicitly closed. Hidden behind a "Show all" toggle.

This keeps the surface clean even after months of use.

### Rule 6 — Artifact reuse beats artifact creation

Before any tool fires (`create_practice_session`, `create_study_plan`, `create_target_tracker`, etc.):

- The router checks if a **live artifact** of that type already exists for the scope.
- If yes → reopen and continue (e.g. resume question 7/10) instead of generating a new artifact.
- The AI is told via system prompt: *"An active practice for Physics/Newton's Laws exists at 6/10 — continue it; do not create a new one."*

### Rule 7 — Dashboard CTAs are scope hints, not thread creators

CTAs (Practice Physics, Continue Plan, Resume Exam Prep, etc.) **never call `createThread` directly**. They navigate to:

```
/student/copilot?intent=<scope-hinted-prompt>
```

…and let the router decide whether to resume or start fresh. This guarantees the same continuation behaviour from every entry point.

### Rule 8 — Auto-archive (so history never bloats)

| Tool | Archive trigger |
|---|---|
| `practice` | No activity for 14 days |
| `plan` | Past `plan_window.end_date` |
| `exam` | Past `exam_date` (kept readable) |
| `doubt` | No follow-up for 7 days |
| `debrief` | Never auto-archived (permanent) |
| `progress` | Rolls weekly — older windows archived |

Archive runs on copilot page load (client-side sweep) and via the `copilot-archive-sweep` edge function.

### Rule 9 — Escape hatches (always available, never primary)

- "Start fresh" link inside the continuation banner.
- "Show archived" toggle in history.
- "Open in new chat" on any artifact.

Defaults are zero-friction; power users can override.

### Rule 10 — Determinism & traceability

- The `scope_key` is **deterministic**: same input → same key. Format: `tool:subject:chapter[:extra]`, lowercased, hyphenated.
- Every routing decision is logged to `router_decisions` (`tool`, `scope_key`, `decision`, `thread_id`, `confidence`) for debugging and future tuning.

---

## 3. Worked examples

### Example A — Resume a practice from the dashboard

1. Student taps **"Practice Physics"** on the dashboard.
2. Dashboard navigates to `/student/copilot?intent=Continue%20practice%3A%20Physics%20%E2%80%94%20Newton%27s%20Laws`.
3. Router classifies → `tool = practice`, scope `practice:physics:newtons-laws`.
4. `findActiveSession` returns an existing thread with 6/10 questions answered.
5. The chat opens that thread, the practice artifact resumes at Q7, and the banner shows *"Continuing your Physics Ch. 4 practice — 6/10 done."*

### Example B — A new doubt in the global chat

1. Student types *"explain dot product again"*.
2. Router classifies → `tool = doubt`, scope `doubt:math:vectors:dot-product`.
3. An open Math/Vectors doubt thread already exists → append the message, open the existing concept explainer with an updated section.

### Example C — A study plan request that has no match

1. Student types *"give me a JEE plan for next week"*.
2. Router classifies → `tool = plan`, scope `plan:jee:week-2026-04-27`.
3. No live plan in that window → router creates a thread silently and the AI generates the plan artifact.

---

## 4. Data model reference

### `student_copilot_threads` — new fields

| Column | Type | Purpose |
|---|---|---|
| `tool` | text | Normalized tool name: `doubt` \| `practice` \| `plan` \| `exam` \| `debrief` \| `progress`. |
| `scope_key` | text | Deterministic key used by the router (e.g. `practice:physics:newtons-laws`). |
| `scope_meta` | jsonb | Structured scope: `{ subject, chapter, exam_id, plan_window, … }`. |
| `status` | text | `active` (default) \| `recent` \| `archived`. |
| `last_activity_at` | timestamptz | Updated on every message and every practice answer. |
| `archived_at` | timestamptz | Nullable; set when the lifecycle sweep archives the thread. |

**Index:** `(student_id, tool, scope_key, status)` for fast router lookup.

### `router_decisions` — new table

| Column | Type | Purpose |
|---|---|---|
| `id` | uuid PK | |
| `student_id` | text | |
| `message_preview` | text | First 120 chars of the routed message |
| `tool` | text | Classified tool |
| `scope_key` | text | Computed scope key |
| `decision` | text | `matched` \| `new` |
| `thread_id` | uuid | Resulting thread |
| `confidence` | numeric | 0–1, classifier confidence |
| `created_at` | timestamptz | |

Used purely for debugging and tuning. Read-only from the app.

---

## 5. Dashboard CTA contract

Every dashboard card that links into the copilot MUST follow this contract:

- **Do not** build URLs with `?routine=...&prompt=...` (that pattern implied thread creation).
- **Do** navigate to `/student/copilot?intent=<scope-hinted-prompt>`.
- The intent string should be **scope-rich** so the router can classify it without ambiguity, e.g.:
  - `Continue practice: Physics — Newton's Laws`
  - `Resume exam prep: JEE Main 2026`
  - `Continue this week's study plan`
  - `Debrief test attempt 38c1…` (debrief uses `?debrief=<attempt_id>` to guarantee scoping)

Cards covered: `ExamTargetCard`, `LastTestResultCard`, `DailyStudyGoalRing`, `HomeworkSection`, `RecentCopilotCard`, `UpcomingTestCard`, `AIRecommendationCard`.

---

## 6. The Router module

Location: `src/components/student/copilot/router/sessionRouter.ts`

| Function | Responsibility |
|---|---|
| `classifyIntent(text, ctx)` | Returns `{ tool, confidence }`. Keyword-first; falls back to `gemini-2.5-flash-lite` for ambiguous inputs. |
| `extractScope(text, tool, ctx)` | Returns `{ scope_key, scope_meta }`. Uses `classifySubject` + chapter detection from the timetable context. |
| `findActiveSession(studentId, tool, scope_key)` | Supabase query against the `(student_id, tool, scope_key, status='active')` index. |
| `route(text, ctx)` | Orchestrator. Returns `{ threadId, isNew, banner }`. Logs to `router_decisions`. |

The router is the **only** code path allowed to call `createThread` from the chat flow.

---

## 7. Lifecycle automation

- **Client-side sweep** runs on copilot page load: archives threads that exceed Rule 8 thresholds.
- **Edge function** `copilot-archive-sweep` exposes the same logic for scheduled execution.
- `last_activity_at` is updated by `useStudentChat` (every message) and `useInlinePractice` (every answer).

---

## 8. Tool reuse guard (in the AI prompt)

The `student-copilot-chat` edge function prepends to the system prompt a list of live artifacts for the current scope:

```text
ACTIVE ARTIFACTS FOR THIS SCOPE:
- practice_session "Physics Ch. 4" — 6/10 questions answered, last touched 2h ago

RULES:
- If a live artifact above matches the user's request, continue it. Do NOT call create_*.
- Only call create_practice_session / create_study_plan / create_target_tracker when no live artifact exists.
```

This is what prevents the model from spawning duplicate practices/plans/targets.

---

## 9. Logging & debugging

Every `route()` call writes a row to `router_decisions`. To debug a misroute:

1. Find the row by `student_id` and `created_at`.
2. Read `tool`, `scope_key`, `decision`, `thread_id`, `confidence`.
3. Compare against the message preview to see whether classification or scope extraction was wrong.
4. Adjust keyword tables in `chatHelpers.ts` or the few-shot examples in `classifyIntent`.

---

## 10. Future-proofing checklist — adding a new routine

When a new tool is added:

1. Add it to the **Session identity matrix** in §2.
2. Add a `tool` value and define its `scope_key` shape.
3. Extend `classifyIntent` keyword table and (if needed) few-shot examples.
4. Extend `extractScope` to compute the new `scope_key` shape.
5. Add a Rule 8 archive trigger.
6. Update this document, `docs/04-student/dashboard.md`, and the memory file.

---

## Appendix A — Glossary

- **Thread** — A row in `student_copilot_threads`. Holds the message log for one session.
- **Session** — The conceptual unit identified by Tool + Scope. Maps 1:1 to a thread.
- **Artifact** — Structured output (practice, plan, target tracker, etc.) attached to a thread.
- **Scope key** — Deterministic string identifying a session, used by the router.
- **Router** — The module that classifies intent and decides resume vs. new.
- **Intent** — The tool the student is invoking (practice, doubt, plan, …).

## Appendix B — What this replaces

Before this rulebook:

- Every dashboard CTA called `createThread` → many duplicate threads.
- Every "new question" in chat created a fresh thread → fragmented context.
- The student had to scroll the thread list to resume work → high friction, often abandoned.

After:

- Threads exist only for distinct Tool+Scope pairs.
- The student types and the right thread is found or created automatically.
- History is a quiet record, not a navigation tool.
