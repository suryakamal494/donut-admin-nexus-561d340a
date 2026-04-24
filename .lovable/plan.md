# Audit & Mock Data Fix — Session Continuity

## Audit results vs. the 10 rules in `docs/04-student/copilot-session-continuity.md`

| # | Rule | Status | Notes |
|---|---|---|---|
| 1 | One global chat, no manual picking | Done | "+ New chat" demoted to dropdown menu |
| 2 | Session identity = Tool + Scope | **Schema only** | Columns exist (`tool`, `scope_key`), but mock threads were seeded **without** them — that's why every thread shows up as `active` |
| 3 | Router decides | Done | `sessionRouter.ts` has `classifyIntent`, `extractScope`, `findActiveSession`, `route` |
| 4 | Continuation banner | Done | `ContinuationBanner.tsx` rendered above replies |
| 5 | Active / Recent / Archived grouping | **Logic done, data missing** | `StudentLeftRail` groups correctly, but every seeded thread defaults to `active` so only one bucket shows |
| 6 | Artifact reuse | Done | Reuse guard injected into the `student-copilot-chat` system prompt |
| 7 | Dashboard CTAs use `?intent=` | Done | All 7 cards refactored |
| 8 | Auto-archive | **Half** | Client-side sweep runs on copilot mount; the documented `copilot-archive-sweep` edge function is **not built** |
| 9 | Escape hatches | Done | "Start fresh" in dropdown, "Show archived" toggle, banner override |
| 10 | Determinism & traceability | Done | `router_decisions` table + insert path |

**Why you only see "Active 41":** the grouping UI is correct. The mock data is wrong — every thread was inserted with the column default `status='active'`, no `tool`, no `scope_key`, no `last_activity_at` distribution. The buckets have nothing to fill them.

---

## What this plan fixes

### 1. Rebuild mock thread data so all three buckets render

Update `src/data/student/copilotMockData.ts` so the seeded threads cover the full lifecycle:

- **Active (5–6 threads)** — `last_activity_at` within 48 h, or unfinished artifact. Examples:
  - Physics — Newton's Laws (practice, 6/10 done)
  - Chemistry — Acids & Bases (doubt, today)
  - JEE Main 2026 prep (exam)
  - Week of Apr 22 plan (plan)
- **Recent (5–6 threads)** — `last_activity_at` 3–7 days ago, no unfinished work. Examples:
  - Math — Trigonometry doubt (4 days ago)
  - Biology — Cell structure practice (5 days ago, completed)
  - Last week's progress report
- **Archived (4–5 threads)** — `last_activity_at` >14 days, `archived_at` set. Examples:
  - Old Physics chapter (kinematics, 30 days)
  - Closed exam debrief (Unit Test 2, 21 days)
  - Old weekly plan (Mar 15)

Each thread also gets:
- `tool` — `doubt` | `practice` | `plan` | `exam` | `debrief` | `progress`
- `scope_key` — deterministic, e.g. `practice:physics:newtons-laws`
- `scope_meta` — `{ subject, chapter }` JSON
- `status` — `active` | `recent` | `archived`
- `last_activity_at` — staggered timestamps so sorting/grouping look natural
- `archived_at` — non-null for archived rows

### 2. Force a re-seed so the new data actually lands

The seeder skips when the localStorage flag is set. Bump the seed key to `copilot_mock_seeded_v5` and clear v4 on load, so existing browsers re-seed once.

Because the same fixed UUIDs are reused, the existing rows in the DB must be updated (not duplicated). The seeder will:
1. Detect existing v4 rows for the same IDs.
2. Run an `update` to backfill `tool`, `scope_key`, `scope_meta`, `status`, `last_activity_at`, `archived_at`.
3. Insert any new mock threads that don't yet exist.

### 3. Build the missing `copilot-archive-sweep` edge function (Rule 8)

Currently only the client sweep exists. Add a thin edge function that runs the same archive logic server-side so it can later be scheduled. It will:
- Move `practice` threads with no activity for 14 days → `archived`.
- Move `doubt` threads with no follow-up for 7 days → `archived`.
- Move `plan` threads past `plan_window.end_date` → `archived`.
- Move `exam` threads past `exam_date` → `archived` (but keep readable).
- Set `archived_at = now()` on each archived row.

This makes Rule 8 truly complete and unblocks scheduled cleanup later.

### 4. Small UX polish to make the new buckets visible

- Always render the "Active" / "Recent" headers (even when one bucket has 0) so the structure is visible at a glance — current code hides empty buckets.
- Show a count next to "Recent" too (currently only "Active" shows a count).

---

## Files touched

| File | Change |
|---|---|
| `src/data/student/copilotMockData.ts` | Expand `MOCK_THREADS` to ~16 threads spread across active/recent/archived with `tool`, `scope_key`, `scope_meta`, `status`, `last_activity_at`, `archived_at` |
| `src/components/student/copilot/seedCopilotData.ts` | Bump to `copilot_mock_seeded_v5`; add an `update` pass that backfills the new columns on existing rows |
| `src/components/student/copilot/StudentLeftRail.tsx` | Show "Recent" count; render headers consistently |
| `supabase/functions/copilot-archive-sweep/index.ts` | New edge function implementing Rule 8 server-side |
| `docs/04-student/copilot-session-continuity.md` | Mark §7 (lifecycle) and §11 (audit appendix) as fully implemented; add a note that the seed data now covers all three buckets |
| `.lovable/memory/features/student-copilot-architecture.md` | Note that Session Continuity is now end-to-end complete with seeded mock buckets |

## Out of scope (intentionally)

- Real-data scope inference from existing message bodies — the seeder writes scope keys directly; back-classifying historical messages isn't needed for the demo.
- A scheduled cron for the new edge function — Lovable Cloud doesn't expose cron yet; the function is callable manually and will be wired to a schedule later.
- Changing the router itself — its logic already matches the rulebook.

## Result you'll see after approval

The left rail will show three labelled groups with realistic counts (e.g. **Active (6) · Recent (5) · Archived (5)**), threads will carry the new `tool` + `scope_key` so the router can actually match them, the archive sweep is callable from the server, and every rule in the rulebook moves to "done."
