
# Student Copilot Artifact Audit — Why Artifacts Are Not Showing

## What the audit confirmed

The issue is real, and it is not just a UI glitch.

Current backend state for `student-001` shows:
- Many threads exist
- Only **2 artifacts** exist in the database
- **0 active notifications** exist
- The seeded mock artifact set is **not present**

So the frontend is mostly showing exactly what the database currently contains: almost no artifacts.

## Root Causes

### 1. The seeder is skipping artifact seeding for existing users
In `seedCopilotData.ts`, threads/messages/artifacts/notifications are all seeded only when this condition is true:

```ts
if (!existingThreads || existingThreads.length === 0) { ... }
```

That means:
- if the user already has even **1 thread**
- the seeder will **not insert mock messages**
- will **not insert mock artifacts**
- will **not insert mock notifications**

So once a few live threads were created, the mock artifact set stopped seeding entirely.

This is the main reason your planned artifact library never appeared.

### 2. The artifact schemas are inconsistent across the system
The mock data, the artifact views, the inline practice flow, and the AI tool output are not using one shared shape.

Examples:
- `practice_session`
  - edge function outputs `prompt`, `answer`, `options: string[]`
  - pane view expects `question`, `correct_answer`, `options: {label,text}[]`
  - inline practice expects `question`, `answer`, `options: string[]`
- `target_tracker`
  - edge function outputs `exam`, `gap_analysis`, `todays_plan`, `weekly_progress`
  - current view expects `exam_name`, `subjects`, `today_plan`, `days_remaining`
- `progress_report`
  - edge function outputs `questions_attempted`, `accuracy_by_topic`, `time_by_subject`, `highlights`
  - current view expects `total_attempts`, `subjects`, `weekly_activity`, `recommendations`
- `test_debrief`, `worked_solution`, `concept_explainer`, `mastery_map` also have similar mismatches

So even when artifacts are created, several of them will render partially, incorrectly, or blank.

### 3. The artifact pane filters too aggressively
Right now `StudentArtifactPane` does this:
- if a thread is selected, it shows only artifacts from that thread
- if that thread has no artifacts, the pane becomes empty

But the spec says:
- show thread artifacts first
- if none exist, fall back to recent relevant artifacts

That fallback is missing, so many threads appear to have “nothing working” even when artifacts exist elsewhere.

### 4. Some planned interactivity is not wired yet
The following are still not connected end-to-end:
- study-plan task completion loading/saving into the pane
- task click → open learning flow → mark task complete
- consistent proactive notification generation
- artifact-linked learning journeys from roadmap tasks

So the system currently has isolated pieces, not the full interactive artifact workflow you described.

### 5. Notification types are inconsistent
Mock notification types do not match the action mapping used in `handleNotificationAction`, so even if seeded, some cards would not route correctly.

---

## What I will fix

### Step 1 — Fix seeding so artifacts seed independently
Refactor `seedCopilotData.ts` so each dataset is checked and seeded separately:

- routines seeded if student routines missing
- threads seeded if seeded thread IDs missing
- messages seeded if seeded message set missing
- artifacts seeded if seeded artifact IDs missing
- notifications seeded if seeded notification set missing
- attempts seeded if missing
- exams seeded if missing

This removes the current “threads gate everything” problem.

Also:
- bump the seed version key again
- clear old keys
- use deterministic IDs so reseeding is safe
- only mark seeded after all required inserts succeed

### Step 2 — Introduce one canonical artifact normalization layer
Create a shared artifact adapter/normalizer so every artifact type can render from:
- seeded mock data
- edge-function generated data
- future database records

This will normalize all shapes before rendering.

Planned normalizations:
- `concept_explainer`: `intro/body/try_yourself` ↔ `summary/explanation/challenge`
- `worked_solution`: `given[]/find/step/expression/justification` ↔ current view model
- `practice_session`: `prompt` → `question`, `answer` → canonical answer field, options normalized
- `study_plan`: `focus/minutes` ↔ `label/duration`
- `target_tracker`: `exam/gap_analysis/todays_plan/weekly_progress` ↔ pane-friendly model
- `mastery_map`: `strongest_3/weakest_3` aliases
- `progress_report`: `questions_attempted/highlights/time_by_subject` ↔ current report model
- `test_debrief`: `q/why_wrong/followups` ↔ current debrief model

### Step 3 — Make practice artifacts work in both chat and pane
Unify the practice question model used by:
- `useInlinePractice.ts`
- `InlinePracticeCard.tsx`
- `PracticeSessionView.tsx`
- mock data
- AI output

This will ensure:
- seeded practice artifacts are playable
- AI-created practice artifacts are playable
- result tracking writes correct `student_attempts`
- mastery refresh stays accurate

### Step 4 — Fix artifact pane behavior
Update `StudentArtifactPane.tsx` to follow the intended behavior:

- exclude `clarifications` from the pane
- show current thread artifacts first
- if selected thread has none, fall back to recent relevant artifacts
- optionally prefer same routine and subject
- keep the pane populated instead of showing empty states too easily

Additional polish:
- pin latest `target_tracker` at top for exam prep
- support nested `test_debrief` under practice sessions later if needed

### Step 5 — Wire study-plan interaction properly
Complete the roadmap/study-plan loop:

- load `student_study_tasks` completion data
- pass completion state into `StudentArtifactPane`
- clicking a study-plan task sends a contextual learning prompt into chat
- after teaching/help flow, mark task complete
- persist progress visually in the study plan

This is required for the “study plan → click task → learn concept/question → continue” workflow you described.

### Step 6 — Fix notification seeding and routing
Align seeded notification types with the routing logic so proactive cards can actually launch the correct flows.

Examples:
- homework → practice
- exam reminder → exam prep
- debrief available → insights
- study material / chapter today → doubt/learning flow

### Step 7 — Clean up the progress artifacts so they show copilot data, not unrelated platform data
`MasteryMapView` and `ProgressReportView` currently pull chart data from general student progress generators. That can make the artifact feel disconnected from the copilot dataset.

I will refactor them so they primarily render from artifact content / mastery data passed into the copilot flow, with fallback only when needed.

---

## Files to update

### Core logic
- `src/components/student/copilot/seedCopilotData.ts`
- `src/data/student/copilotMockData.ts`
- `src/components/student/copilot/StudentCopilotPage.tsx`
- `src/components/student/copilot/StudentArtifactPane.tsx`
- `src/components/student/copilot/useInlinePractice.ts`
- `src/components/student/copilot/InlinePracticeCard.tsx`
- `src/components/student/copilot/artifacts/ArtifactView.tsx`

### Artifact renderers likely needing normalization support
- `src/components/student/copilot/artifacts/ConceptExplainerView.tsx`
- `src/components/student/copilot/artifacts/WorkedSolutionView.tsx`
- `src/components/student/copilot/artifacts/FormulaSheetView.tsx`
- `src/components/student/copilot/artifacts/PracticeSessionView.tsx`
- `src/components/student/copilot/artifacts/StudyPlanView.tsx`
- `src/components/student/copilot/artifacts/TargetTrackerView.tsx`
- `src/components/student/copilot/artifacts/MasteryMapView.tsx`
- `src/components/student/copilot/artifacts/ProgressReportView.tsx`
- `src/components/student/copilot/artifacts/TestDebriefView.tsx`

### Optional new shared utility
- `src/components/student/copilot/artifactNormalizers.ts`

---

## Expected result after the fix

After implementation, the student copilot should behave like this:

```text
Open Copilot
→ seeded threads appear
→ seeded artifacts are visible immediately
→ selecting roadmap/exam/practice/progress threads shows real artifacts
→ practice artifacts run interactively
→ study plans show actionable tasks
→ progress/mastery artifacts render meaningful data
→ fallback artifact pane prevents “empty” dead-ends
```

## Technical conclusion

Why artifacts are not showing today:
1. the seeder skips artifacts once any thread exists
2. the database therefore contains almost no artifacts
3. the pane only shows current-thread artifacts with no fallback
4. several artifact types use incompatible schemas, so even created artifacts are not reliably renderable

So this is a combined **data-seeding + schema-contract + pane-filtering** problem, not a single frontend bug.
