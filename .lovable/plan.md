

## Plan: Copilot fixes + Tutorial + Suggestion chips + Test routine integration

This is a 4-part plan. I'll explain the **why** for each first, then the **what**, so you can see the full picture before any code changes.

---

### Understanding what you asked for

1. **Bug:** Batch dropdown in Copilot's left rail does nothing when you change it.
2. **First-run tutorial:** A short, dismissible 4-step coachmark tour (max 5 opens) explaining batches, routines, artifacts, and the Exit button.
3. **Suggestion chips:** Move them from above the chat to **just above the composer**, and make them **dynamic** based on the most recent artifact / thread for the current batch + routine, instead of static seed chips.
4. **Test Creation routine — full integration with the real Tests page**, with a clean way to refine an already-generated test inside Copilot without bloating the UI.

---

### Part 1 — Fix the batch dropdown bug

**Root cause** (after reading `LeftRail.tsx` + `RoutinePilotPage.tsx`): the dropdown calls `onSelectBatch` which calls `setSelectedBatchId`. That works. The bug is in `ChatPane`'s message loading effect — when you switch batch, threads reload (good), `selectedThreadId` gets reset to the new batch's first thread (good), but `ChatPane` is still rendering the old thread's messages because the artifact pane and thread state don't fully reset. Also, on the desktop left rail the `<Select>` uses a controlled `value={selectedBatchId ?? undefined}` which prevents updates if the new id isn't in the rendered list yet.

**Fix:**
- Force a clean reset on batch switch: clear `selectedThreadId` to `null` immediately, then let the threads-load effect set the first thread of the new batch.
- Verify the `<Select>` in `LeftRail` re-renders by passing a stable `key={selectedBatchId}` only on the `SelectTrigger` content, not on the whole Select.
- Also, currently the mobile sheet does NOT close when you change batch. Add `onOpenChange(false)` to the batch handler in `MobileLeftRailSheet` (it's commented but missing).

---

### Part 2 — First-run tutorial (max 5 opens, skippable)

A lightweight overlay tour, no external library:

- Track count in `localStorage`: `copilot.tutorial.shownCount` (0–5) and `copilot.tutorial.skipped` (boolean).
- New component `CopilotTutorial.tsx`: a fixed overlay rendered inside `CopilotLauncher` when overlay opens AND `shownCount < 5` AND not skipped.
- 4 sequential bubbles with a translucent backdrop and a target highlight (CSS ring around the target element):
  1. **Batches** → points to left rail batch dropdown ("Pick a class to scope everything you do here.")
  2. **Routines** → points to routine list ("Choose what you want to do — Lesson Prep, Test Creation, Homework.")
  3. **Chat** → points to composer ("Just type. Try the suggestion chips below.")
  4. **Artifacts panel** → points to right pane ("Anything the AI builds for you — tests, slides, homework — lives here.")
  5. **Exit** → points to top-left Exit button ("Press Esc or click here to leave Copilot anytime.")
- Footer of each bubble: `Skip tour` (left), `Back / Next / Done` (right). Skip sets `skipped=true`. Reaching "Done" stops counting.
- Increments `shownCount` only on first bubble shown per session.

---

### Part 3 — Dynamic suggestion chips at the bottom

**Move location:** today chips are above the composer when chat is empty. New behavior — chips always render in a thin row **directly above the textarea**, regardless of whether chat is empty.

**Dynamic source** (per current batch × routine):
- Fetch the **last 3 artifacts** + **last 3 threads** for the selected batch+routine.
- Build chips like:
  - "Refine 'Photosynthesis Test'" (if last artifact is a test)
  - "Add 5 more MCQs to last test"
  - "Create a slide deck on the last lesson topic"
  - "Schedule the last homework for tomorrow"
- Fallback to the routine's static `quick_start_chips` when there's no recent activity.
- Chips fetched via a new lightweight helper `useDynamicChips(batchId, routineKey)` that watches the `rp_artifacts` table.

---

### Part 4 — Test Creation: real integration with the Tests page (the big one)

**The current state**
- Copilot's Test Creation routine generates a `test` artifact stored in `rp_artifacts` with shape `{ duration_minutes, total_marks, instructions, questions[] }`.
- The real Teacher Tests page (`/teacher/exams`) reads from a separate mock `teacherExams` array (`TeacherExam` type) with a richer shape: `subjects, pattern, uiType, batchIds, status, questionIds, scheduledDate…`.
- These two worlds are completely disconnected today.

**The bridge — without complicating Copilot**

The principle: **Copilot only knows how to generate. The Tests page is where tests live.** We create a one-way "publish" + a refinement loop.

#### 4a. Enrich the `create_test` tool schema
Add the fields the real Tests page needs so the AI fills them at generation time:
- `curriculum` (string — e.g. "CBSE Class 10")
- `chapters[]` (array of `{ name, topics[] }`)
- `pattern` (`custom | jee_main | jee_advanced | neet`)
- `target_batch_id` (auto-filled from current Copilot batch)
- Per-question: `chapter`, `topic`, `difficulty (easy|medium|hard)`, `cognitive_type`, plus existing `type/prompt/options/answer/marks`

System prompt for `test_creation` routine updated to gather curriculum + chapters from the user (or assume from batch subject) before calling the tool.

#### 4b. New "Publish to Tests" action on the Test artifact
On `TestView` (the artifact detail in the right pane), add two buttons at the top:
1. **Publish to Tests page** → converts the `rp_artifacts` row into a `TeacherExam` and pushes it into the existing `teacherExams` store. Status starts as `draft`. The artifact gets a small "Published ✓" badge so you don't double-publish.
2. **Open in Tests page** → navigates to `/teacher/exams` (or `/teacher/exams/:id/edit` once published) and closes Copilot.

Since `teacherExams` is currently in-memory mock data, we'll wrap it in a tiny Zustand store (`src/stores/teacherExamsStore.ts`) so a "publish" actually appears on the Tests page in the same session. (No DB migration — you can promote to Supabase later when the real Tests table exists.)

#### 4c. Refinement loop — answer to "how do teachers tweak questions without bloating Copilot?"

The cleanest pattern (used by Cursor / Notion AI / Linear): **artifact-scoped chat**.

When a teacher opens a test artifact in the right pane, a slim **"Refine this test"** input appears at the bottom of the artifact view itself (NOT in the main chat). It supports natural-language commands like:
- "Replace question 3 with a harder MCQ"
- "Add 5 more short-answer questions on Newton's laws"
- "Convert all MCQs to long-answer"
- "Make question 7 easier"
- "Remove negative marking"

Mechanics:
- The input posts to the same `routine-pilot-chat` edge function but with an extra payload `target_artifact_id` and a special system prompt suffix: "You are refining the existing test artifact below. Apply ONLY the user's requested change. Return the FULL updated test via the `update_test` tool."
- Add a new `update_test` tool to the edge function — same shape as `create_test` but writes back to the SAME `rp_artifacts.id` (UPDATE not INSERT). The artifact pane re-renders via realtime.
- Each refinement appends a tiny entry to a per-artifact `rp_messages`-style log so teachers see history (optional, can ship without).

This keeps Copilot's main chat focused on **creation/intent**, and per-artifact refinements are scoped to that artifact — no extra modes, no extra dropdowns, no top bar clutter.

#### 4d. Action-based intents for ALL artifact types (simple framework)
The same `update_*` tool pattern + per-artifact "Refine this" input applies uniformly to:
- `update_test` → tweak questions
- `update_lesson_plan` → add/remove sections
- `update_ppt` → add/edit slides
- `update_banded_homework` → swap problems in a band

This is **one consistent UX** across all artifact types: open artifact → mini-chat at the bottom → AI updates in place. No new modal, no new screens.

---

### Files to change

| File | Action | Why |
|---|---|---|
| `src/components/teacher/routine-pilot/RoutinePilotPage.tsx` | Edit | Reset thread on batch change; rename header label "RoutinePilot" → "Copilot" |
| `src/components/teacher/routine-pilot/LeftRail.tsx` | Edit | Header label fix; ensure batch select fires correctly |
| `src/components/teacher/routine-pilot/MobileLeftRailSheet.tsx` | Edit | Close sheet on batch change |
| `src/components/teacher/routine-pilot/CopilotTutorial.tsx` | New | 4-step coachmark tour |
| `src/components/teacher/routine-pilot/CopilotLauncher.tsx` | Edit | Mount tutorial when overlay opens |
| `src/components/teacher/routine-pilot/ChatPane.tsx` | Edit | Move chips to bottom (above composer); use dynamic chips |
| `src/components/teacher/routine-pilot/useDynamicChips.ts` | New | Hook that builds chips from recent artifacts/threads |
| `src/components/teacher/routine-pilot/artifacts/TestView.tsx` | Edit | Add "Publish to Tests" + "Open in Tests" + "Refine this test" composer |
| `src/components/teacher/routine-pilot/artifacts/ArtifactRefineComposer.tsx` | New | Reusable per-artifact refinement input |
| `src/components/teacher/routine-pilot/artifacts/{LessonPlanView,PptView,BandedHomeworkView}.tsx` | Edit | Mount the refine composer at bottom of each |
| `src/stores/teacherExamsStore.ts` | New | Zustand store wrapping the existing mock `teacherExams` so publish persists across the session |
| `src/pages/teacher/Exams.tsx` | Edit | Read from the store instead of the static array |
| `supabase/functions/routine-pilot-chat/index.ts` | Edit | Enrich `create_test` schema; add `update_test`, `update_lesson_plan`, `update_ppt`, `update_banded_homework` tools; honor `target_artifact_id` |

### Out of scope for this pass
- Persisting `TeacherExam` to Supabase (still in-memory store; promotion to DB is a future step when the real schema is designed).
- Adding new tutorial copy translations.
- Adding refinement history UI per artifact (the log itself is appended; visible history can come later).

### Phasing
- **Phase A:** Bug fix (batch dropdown) + suggestion chips moved to bottom + dynamic chips + tutorial. (One implementation pass.)
- **Phase B:** Test artifact enrichment + Publish/Open buttons + Tests-page store wiring. (One pass.)
- **Phase C:** Universal "Refine this artifact" composer + `update_*` tools in edge function. (One pass.)

Total: 3 implementation messages after approval.

