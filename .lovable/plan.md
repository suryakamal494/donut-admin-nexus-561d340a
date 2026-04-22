

# Student Copilot — Phased Implementation Plan

## Requirement Summary

Build a student-facing AI copilot within the DonutAI platform, mirroring the Teacher Routine Pilot architecture but contextualized to student workflows. The copilot provides doubt resolution, adaptive practice, exam prep, study roadmaps, and progress insights — all with inline interactive artifacts, mastery tracking, and teacher-assigned homework integration.

Key contextual integrations:
- Teacher banded homework flows into the copilot (student's band determines difficulty, never shown explicitly)
- Timetable data provides "today's chapter" context for practice and doubts
- Existing student panel components (SubjectRadarChart, ExamTrendChart, etc.) render inline as report artifacts
- Existing mock data from progressData.ts, dashboard.ts used for seeding and context
- Mobile-first UI matching student panel design standards

---

## Phase 1: Database, Types, API Layer, Edge Function

**Goal**: Backend foundation — tables, types, API helpers, and the streaming chat edge function with student tools.

### 1.1 Database Tables (Migrations)

Create these tables (adapting the doc's schema to fit existing platform conventions):

- **`student_copilot_threads`** — id, student_id (text, matches existing student mock IDs), routine_key (text), title, subject, last_message_at, created_at
- **`student_copilot_messages`** — id, thread_id (FK), role (text), content (text), created_at
- **`student_copilot_artifacts`** — id, student_id, thread_id (FK nullable), type (text), title, content (jsonb), source (text: 'ai' | 'teacher'), created_at
- **`student_attempts`** — id, student_id, thread_id (nullable), artifact_id (nullable), subject, topic, question_type, question_text, expected_answer, given_answer, correct (boolean), time_seconds, source (text: 'practice'|'test'|'homework'), created_at
- **`student_study_tasks`** — id, student_id, artifact_id, day_index, item_index, completed, completed_at, created_at. Unique on (artifact_id, day_index, item_index)
- **View: `student_topic_mastery`** — aggregates student_attempts by student_id/subject/topic, calculates accuracy and band (mastery_ready >=80%, stable >=60%, reinforcement >=40%, foundational_risk <40%)

Seed student routines into existing `rp_routines` table with `audience = 'student'`:
- s_doubt (Chat), s_practice (Practice), s_exam_prep (Exam target), s_roadmap (Study roadmap), s_progress (Insights)

RLS: public read/write for now (matching existing rp_* pattern).

### 1.2 TypeScript Types

New file: `src/components/student/copilot/types.ts`

Define: StudentThread, StudentMessage, StudentArtifact (with all 10 artifact types), StudentAttempt, TopicMastery, MasteryBand, ClarificationContent, StudyTaskCompletion. Reference existing student data types where possible.

### 1.3 API Layer

New file: `src/components/student/copilot/api.ts`

Supabase query functions: fetchStudentRoutines, fetchThreads, createThread, fetchMessages, fetchArtifacts, insertArtifact, updateArtifactContent, insertAttempts, fetchTopicMastery, fetchStudyTaskCompletions, markStudyTaskComplete.

### 1.4 Edge Function — `student-copilot-chat`

New edge function: `supabase/functions/student-copilot-chat/index.ts`

- Mirrors `routine-pilot-chat` architecture (streaming SSE, tool calling)
- 10 student tools: solve_doubt, create_practice_session, create_study_plan, create_target_tracker, create_worked_solution, create_formula_sheet, create_mastery_map, ask_clarifications, create_test_debrief, create_progress_report
- Student base prompt with: tutoring principles (scaffold, don't give answers), LaTeX math formatting, mhchem chemistry formatting, clarify-before-build rule, artifact routing, image input handling
- Accepts student context injection: name, grade, board, competitive_track, band data per subject, today's timetable, pending homework, upcoming exams

### 1.5 Chat Helpers

New file: `src/components/student/copilot/chatHelpers.ts`

- classifySubject(text) — keyword-based subject detection for Physics/Chemistry/Math/Biology/English
- splitStoredContent(content) — separates text from embedded image markers
- buildStudentContext() — assembles student profile, band data, timetable info, pending homework into system prompt context

---

## Phase 2: Layout, Left Rail, Chat Pane (Core UI)

**Goal**: The 3-panel copilot page with working chat, matching student panel design.

### 2.1 Page Route

New page: `src/pages/student/Copilot.tsx` — registered at `/student/copilot`

### 2.2 Layout Component

New file: `src/components/student/copilot/StudentCopilotPage.tsx`

3-panel layout mirroring RoutinePilotPage but with student panel styling:
- Desktop: left rail (260px) + center chat (flex-1) + right artifacts (400px), both side panels collapsible
- Tablet: left rail as sheet, center chat + right artifacts
- Mobile: center chat only, left rail as bottom sheet (hamburger), right artifacts as bottom sheet

State: routines, threads, currentThread, messages, artifacts, mastery data, left/right visibility.

### 2.3 Left Rail

New file: `src/components/student/copilot/StudentLeftRail.tsx`

- Student profile header (name, grade, board, competitive track from existing mock data)
- "New chat" button with Cmd+K shortcut
- Tool shortcuts: Practice, Exam target, Study roadmap, Insights — each creates a thread with the corresponding routine
- Subject filter chips (All, Physics, Chemistry, Math, Biology, English) with student panel color scheme
- Recent threads list filtered by subject

### 2.4 Chat Pane

New file: `src/components/student/copilot/StudentChatPane.tsx`

- Header: subject dropdown, routine label, thread title, toggle buttons for side panels
- Message bubbles: user (right, primary bg), assistant (left, muted bg) with MathMarkdown rendering
- Streaming indicator with cursor animation
- Composer: textarea + image attachment (Paperclip, max 3 images, 4MB each, drag-drop, paste), Enter to send
- Empty states: welcome screen with proactive notification cards, new thread with quick-start chips
- Pending artifact skeleton animation during tool calling

### 2.5 MathMarkdown Component

New file: `src/components/student/copilot/MathMarkdown.tsx`

Markdown renderer with: react-markdown, remark-gfm, remark-math, rehype-katex, katex/contrib/mhchem. Normalizes LaTeX delimiters.

### 2.6 useStudentChat Hook

New file: `src/components/student/copilot/useStudentChat.ts`

- send() persists user message, builds system prompt with student context + routine prompt + band data + timetable + homework
- Streams from student-copilot-chat edge function
- Detects __ARTIFACT__ markers, parses and saves artifacts
- Auto-titles thread on first message, auto-detects subject

---

## Phase 3: Artifact Views (9 Types)

**Goal**: All artifact view components, rendered both in the artifact pane and inline in chat.

### 3.1 Core Artifact Views

All in `src/components/student/copilot/artifacts/`:

1. **ConceptExplainerView** — Progressive reveal steps with hints, "try yourself" challenge
2. **WorkedSolutionView** — Problem, given/find, numbered steps with LaTeX, final answer, common mistakes, marking scheme
3. **FormulaSheetView** — Formula cards with expression, when-to-use, units, variable grid
4. **PracticeSessionView** — Interactive quiz (artifact pane version): MCQ grid, short answer inputs, submit per question, score counter, reset/retry
5. **StudyPlanView** — Day-by-day plan with task checkboxes, progress bar, clickable tasks
6. **TargetTrackerView** — Current vs target score visualization, gap analysis, today's plan, weekly progress chart
7. **MasteryMapView** — Per-subject/topic accuracy bars colored by band, strongest/weakest/cold topic summary, "Practice this" buttons
8. **ProgressReportView** — Reuses existing student progress components (SubjectRadarChart, ExamTrendChart) inline as artifact cards
9. **TestDebriefView** — Per-question breakdown (correct/incorrect), follow-up suggestions, auto-records attempts on mount

### 3.2 Artifact Pane

New file: `src/components/student/copilot/StudentArtifactPane.tsx`

- Routine-based filtering (s_doubt shows explainers/solutions/formulas, s_practice shows sessions/debriefs, etc.)
- Thread-scoped vs fallback subject-filtered view
- Time grouping (Today / This week / Older)
- Pinned target tracker for exam_prep routine
- Mastery snapshot widget for progress routine

### 3.3 Artifact Card

New file: `src/components/student/copilot/artifacts/ArtifactCard.tsx`

Compact card with type icon, title, timestamp. Click expands to full view in pane.

---

## Phase 4: Interactive Inline Workflows

**Goal**: Practice flow in chat, clarifications, study task completion, proactive notifications.

### 4.1 InlinePracticeCard

New file: `src/components/student/copilot/InlinePracticeCard.tsx`

- Single question rendered inline in chat message
- MCQ option buttons or text input, submit, correct/incorrect feedback with explanation
- "Next >" button to advance one at a time
- Auto-scrolls into view

### 4.2 PracticeSummaryCard

End-of-practice celebration card: score, dot grid, weak topic callout, "Practice more" button.

### 4.3 Inline Practice Flow (in ChatPane)

- Manages practiceState per artifact: currentIndex, results
- Shows questions one at a time within chat
- Records each attempt via insertAttempts, refreshes mastery
- Auto-generates test_debrief artifact on completion

### 4.4 ClarificationCard

New file: `src/components/student/copilot/ClarificationCard.tsx`

- Agent asks 1-3 questions before generating artifacts
- Chip-based options (single/multi-select), "Other" free text
- Sends formatted answers back to chat for artifact generation

### 4.5 ProactiveCards

New file: `src/components/student/copilot/ProactiveCards.tsx`

"What's on your plate today" cards driven by:
- Pending banded homework from teacher (mapped to student's band)
- Upcoming exams from timetable/exam schedule
- Today's chapters from timetable
- Available debriefs from recent tests

Color-coded by type, action buttons route to appropriate routines.

### 4.6 StudyTaskCompleteCard

Inline card after study task teaching: "Did you understand X?" with mark-complete and need-help buttons.

---

## Phase 5: Platform Context Integration

**Goal**: Connect the copilot to existing DonutAI data flows.

### 5.1 Timetable Context

- Read from existing timetable data (`src/data/timetable/`) to inject today's schedule, current chapter, upcoming topics into the system prompt
- The copilot knows "Today you have Physics — Chapter: Kinematics" and adapts doubt/practice accordingly

### 5.2 Teacher Banded Homework Integration

- When teacher generates banded homework via Routine Pilot, create corresponding student_copilot_artifacts with source='teacher'
- Map student to their band using existing PI/bucketing logic from `src/data/teacher/studentReportData.ts`
- Copilot receives band context: "This student is in 'reinforcement' band for Kinematics. Help them build foundational understanding without revealing the band label."
- ProactiveCards surface pending banded homework as "Practice assignment from your teacher"

### 5.3 Existing Report Components as Artifacts

- When the copilot generates a progress_report or mastery_map, render existing student progress components (SubjectRadarChart, ExamTrendChart, WeeklyActivityChart, ProgressHeroCard) as inline artifacts
- This reuses proven UI and maintains visual consistency

### 5.4 Competitive Exam Planner Context

- For JEE/NEET students: copilot injects competitive_track, current_score, target_score into system prompt
- Target tracker and study plan tools generate content calibrated to competitive exam patterns (assertion-reason, multi-step numericals)
- 6-month roadmap generation with weekly milestones

### 5.5 Mastery → Adaptive Practice Pipeline

Full loop:
1. Student answers practice question → attempt recorded → mastery view recalculated
2. Next practice session's system prompt includes weakest 3 topics (60-70% focus)
3. Band progression tracked over time — copilot adapts difficulty upward as student improves

---

## Phase 6: Navigation, Polish, Mobile UX

**Goal**: Integration into student panel navigation, mobile optimization, and UX polish.

### 6.1 Navigation Integration

- Add "AI Copilot" entry to StudentBottomNav and StudentSidebar
- Sparkles/Bot icon, accessible from any student page
- Deep-link support: `/student/copilot?routine=s_practice&subject=Physics`

### 6.2 Mobile UX Polish

- 320px minimum width support
- Left rail as swipe-to-dismiss sheet
- Artifact pane as bottom sheet with drag handle and artifact count badge
- 44px+ touch targets on all interactive elements
- Composer: full-width on mobile, image preview thumbnails

### 6.3 Keyboard Shortcuts

- Cmd/Ctrl+K: new doubt thread
- Enter: send message
- Shift+Enter: newline
- Escape: close side panels

### 6.4 Dependencies

Install: react-markdown, remark-gfm, remark-math, rehype-katex, katex

---

## File Structure Summary

```text
src/components/student/copilot/
├── types.ts
├── api.ts
├── chatHelpers.ts
├── useStudentChat.ts
├── MathMarkdown.tsx
├── StudentCopilotPage.tsx
├── StudentLeftRail.tsx
├── StudentChatPane.tsx
├── StudentArtifactPane.tsx
├── ClarificationCard.tsx
├── InlinePracticeCard.tsx
├── ProactiveCards.tsx
├── artifacts/
│   ├── ArtifactCard.tsx
│   ├── ArtifactView.tsx
│   ├── ConceptExplainerView.tsx
│   ├── WorkedSolutionView.tsx
│   ├── FormulaSheetView.tsx
│   ├── PracticeSessionView.tsx
│   ├── StudyPlanView.tsx
│   ├── TargetTrackerView.tsx
│   ├── MasteryMapView.tsx
│   ├── ProgressReportView.tsx
│   └── TestDebriefView.tsx
├── context/
│   ├── timetableContext.ts
│   ├── bandContext.ts
│   └── homeworkContext.ts
└── index.ts

supabase/functions/
└── student-copilot-chat/
    └── index.ts

src/pages/student/
└── Copilot.tsx
```

## Implementation Order

Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6

Each phase is self-contained and testable. Phase 1-2 gives a working chat. Phase 3 adds all artifact rendering. Phase 4 makes practice interactive. Phase 5 connects to existing platform data. Phase 6 polishes navigation and mobile.

