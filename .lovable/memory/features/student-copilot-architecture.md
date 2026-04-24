---
name: Student Copilot Architecture
description: Student AI copilot module — tables, edge function, types, API layer, 10 tool types, mastery tracking pipeline
type: feature
---

## Student Copilot — Phase 1 Complete

### Database Tables
- `student_copilot_threads` — student_id (text), routine_key, title, subject
- `student_copilot_messages` — thread_id (FK), role, content
- `student_copilot_artifacts` — student_id, thread_id, type, title, content (jsonb), source (ai/teacher)
- `student_attempts` — tracks practice answers for mastery calculation
- `student_study_tasks` — tracks study plan task completions (unique on artifact_id+day+item)
- `student_exams` — exam targets with scores
- `student_notifications` — proactive cards (homework_pending, exam_upcoming, etc.)
- `student_topic_mastery` (VIEW) — aggregates attempts → accuracy + band per topic
- `rp_routines.audience` column added — 'teacher' (default) or 'student'

### Student Routines (in rp_routines, audience='student')
- s_doubt (Chat), s_practice (Practice), s_exam_prep (Exam target), s_roadmap (Study roadmap), s_progress (Insights)

### Edge Function: `student-copilot-chat`
- Streaming SSE, mirrors routine-pilot-chat architecture
- 10 student tools: solve_doubt, create_practice_session, create_study_plan, create_target_tracker, create_worked_solution, create_formula_sheet, create_mastery_map, ask_clarifications, create_test_debrief, create_progress_report
- Emits `__ARTIFACT__<json>__END__` markers for client-side artifact detection
- Saves artifacts to student_copilot_artifacts table server-side
- Uses Lovable AI Gateway with google/gemini-2.5-flash

### TypeScript Files
- `src/components/student/copilot/types.ts` — all interfaces, artifact type mappings
- `src/components/student/copilot/api.ts` — Supabase query functions for all tables
- `src/components/student/copilot/chatHelpers.ts` — classifySubject, splitStoredContent, buildStudentContext

### Mastery Band Logic
- mastery_ready: accuracy >= 80%
- stable: accuracy >= 60%
- reinforcement: accuracy >= 40%
- foundational_risk: accuracy < 40%

### Remaining Phases
- Phase 2: Layout + Chat Pane UI
- Phase 3: 9 Artifact View components
- Phase 4: Interactive inline practice, clarifications, proactive cards
- Phase 5: Platform context integration (timetable, banded homework, reports)
- Phase 6: Navigation, polish, mobile UX

## Session Continuity (Phase 7 — in progress)

Canonical reference: `docs/04-student/copilot-session-continuity.md`. Any change to copilot routing or thread creation MUST update that doc first.

Core principle: **Zero-search copilot.** One global chat. A router classifies intent + scope and silently resumes or creates the right thread. Students never pick a thread.

Schema additions on `student_copilot_threads`: `tool`, `scope_key`, `scope_meta`, `status` (active/recent/archived), `last_activity_at`, `archived_at`. Index `(student_id, tool, scope_key, status)` powers the router lookup. New `router_decisions` table logs every routing choice for debugging.

Tool ↔ scope identity matrix (the "what makes it the same session" rule):
- doubt: subject + chapter + concept-cluster (7 days)
- practice: subject + chapter (until done or 14 days idle)
- plan: plan window (until end_date)
- exam: exam_id (until exam_date)
- debrief: test_attempt_id (permanent)
- progress: rolling weekly window (7 days)

Dashboard CTA contract: navigate to `/student/copilot?intent=<scope-hinted-prompt>` — never call `createThread` directly. The router is the only code path that creates threads from the chat flow.