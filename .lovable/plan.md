

# Make Student Copilot Interactive — Chat-First Learning Flow

## What You Asked For (My Understanding)

You want the copilot to feel like talking to a real teacher or friend:

1. **Practice questions inline in chat** — When a student asks for 5-10 MCQs, questions appear one-by-one inside the chat bubble. After each answer, the AI responds contextually: "Great job!" if correct, or explains what went wrong if incorrect, then presents the next question. Only if there are 10+ questions, create a separate artifact.

2. **Study plan tasks trigger learning flows** — When a student clicks "Revise distance, displacement, speed & velocity" in Day 1 of a study plan, the chat opens a revision session: explains key concepts, shows reading material, asks memory-check questions inline, and adapts based on the student's responses. The next task is shaped by how they performed on the current one.

3. **Conversational, adaptive interaction** — Not a silent "here's your artifact" response. The AI should scaffold, ask follow-ups, check understanding, and adjust difficulty — like a tutor sitting next to the student.

## Root Causes (Why It Doesn't Work Today)

### 1. Edge function creates artifacts silently, doesn't chat
The system prompt tells the AI to route requests to tool calls (artifacts) but doesn't instruct it to also provide inline conversational text. When a student asks "5 MCQs on Kinematics", the AI calls `create_practice_session` and says nothing else, or just says "I've created a practice session."

### 2. Inline practice exists but isn't triggered properly
`useInlinePractice` + `InlinePracticeCard` are built and functional, but:
- The artifact-to-message linking in `ChatMessageList` uses a 30-second timestamp window which may not match
- After answering a question, there's no AI follow-up — just a static "Next" button
- No contextual encouragement or explanation from the AI after each answer

### 3. Study plan tasks have no click-to-chat wiring
`StudyPlanView` has `onToggleTask` which just toggles a checkbox. There's no callback to send a learning prompt to chat. The `StudentCopilotPage` doesn't pass a handler that would start a chat-based learning session from a task click.

### 4. Study plan normalizer is missing
`artifactNormalizers.ts` handles practice, concept, worked_solution, target_tracker, progress_report, test_debrief — but NOT `study_plan`. The edge function outputs `{ focus, minutes }` per item, while the view expects `{ task, duration }`. Currently this works for mock data (which uses `task/duration` directly), but AI-generated study plans would break.

### 5. No feedback loop after inline practice answers
When a student answers a practice question correctly or incorrectly via `InlinePracticeCard`, the result is saved to `student_attempts` but no follow-up message is injected into the chat. The student just sees a static green/red indicator and clicks "Next."

---

## Implementation Plan

### Step 1 — Update Edge Function System Prompt for Interactive Behavior

**File**: `supabase/functions/student-copilot-chat/index.ts`

Add explicit instructions to the system prompt:

- **For small practice requests (up to 10 questions)**: Present questions one at a time in the chat text itself (not as an artifact). Format each question clearly with options. Wait for the student's response before presenting the next question.
- **For larger practice sets (10+ questions)**: Use `create_practice_session` tool to create an artifact.
- **After each student answer**: Respond with encouragement if correct ("Great job! You nailed it."), or explain the concept if wrong ("Not quite — here's why..."), then present the next question.
- **For study plan task flows**: When the student says something like "Start Day 1 Task 1" or "Teach me about displacement", deliver the content conversationally — explain the concept, ask check questions, and adapt.
- **General tone**: Be warm, use occasional emojis, ask "Ready for the next one?" or "Want to try a harder version?"

### Step 2 — Add Study Plan Normalizer

**File**: `src/components/student/copilot/artifactNormalizers.ts`

Add `normalizeStudyPlan()`:
- Map `focus` to `label` for each day
- Map `minutes` to `duration` string for each item  
- Ensure `task` field exists (from AI's `task` or fallback)
- Register in `normalizeArtifactContent` switch

### Step 3 — Wire Study Plan Task Click to Chat

**Files**: 
- `src/components/student/copilot/StudentArtifactPane.tsx`
- `src/components/student/copilot/StudentCopilotPage.tsx`
- `src/components/student/copilot/artifacts/StudyPlanView.tsx`

Add a new callback `onStartTask` to `StudyPlanView`:
- When a task item is clicked, instead of just toggling completion, send a contextual prompt to chat: e.g., "Teach me about: Revise distance, displacement, speed & velocity (Day 1, Physics)"
- Pass this callback from `StudentCopilotPage` through `StudentArtifactPane` to `StudyPlanView`
- The chat then handles it as a normal user message, and the AI (with updated system prompt) starts an interactive teaching session

### Step 4 — Add Post-Answer AI Follow-Up in Chat

**Files**:
- `src/components/student/copilot/StudentCopilotPage.tsx`
- `src/components/student/copilot/useInlinePractice.ts`

After a student answers an inline practice question:
- If correct: Auto-inject a brief encouragement message into the chat ("Correct! Well done. Ready for the next one?")
- If wrong: Auto-inject an explanation message ("Not quite. The correct answer is X because... Let's try the next one.")
- These are local UI messages (not sent to the AI API), providing immediate feedback
- The existing `onPracticeAnswer` callback already knows `correct` and has access to `explanation` — extend it to also append a feedback message to the messages list

### Step 5 — Improve Inline Practice Question Display

**File**: `src/components/student/copilot/InlinePracticeCard.tsx`

Polish the inline card for chat context:
- Make the question card feel more conversational (less "test-like")
- After answering wrong, show the explanation more prominently with the AI's avatar
- Add a "Want to try a similar one?" option after wrong answers

### Step 6 — Fix Practice Artifact Linking in Chat

**File**: `src/components/student/copilot/ChatMessageList.tsx`

The current 30-second timestamp window for linking practice artifacts to messages is fragile. Change to:
- Link by `thread_id` + check if the assistant message content mentions "practice" or similar keywords
- Or store `artifact_id` in the message metadata when the edge function creates one

---

## Files to Update

| File | Action |
|------|--------|
| `supabase/functions/student-copilot-chat/index.ts` | Update system prompt for interactive tutoring |
| `src/components/student/copilot/artifactNormalizers.ts` | Add study_plan normalizer |
| `src/components/student/copilot/StudentCopilotPage.tsx` | Wire task-click-to-chat, post-answer feedback |
| `src/components/student/copilot/StudentArtifactPane.tsx` | Pass onStartTask callback through |
| `src/components/student/copilot/artifacts/StudyPlanView.tsx` | Add onStartTask click handler |
| `src/components/student/copilot/ChatMessageList.tsx` | Improve artifact-message linking |
| `src/components/student/copilot/InlinePracticeCard.tsx` | Polish for conversational feel |
| `src/components/student/copilot/useInlinePractice.ts` | Support feedback message injection |

## Expected Result

```
Student: "5 MCQs on Kinematics"
AI: "Let's test your Kinematics knowledge! Here's Q1:"
     [Inline MCQ card appears]
Student: clicks option B
AI: "Correct! Displacement can be zero even if distance is not. Ready for Q2?"
     [Next MCQ card appears]
Student: clicks wrong option
AI: "Not quite — the correct answer is B. Here's why: v = u + at = 0 + 2×5 = 10 m/s. Let's try Q3!"

Student: clicks "Revise distance & displacement" in study plan
Chat: "Let's revise Distance vs Displacement!

Distance is the total path length traveled. It's a scalar — always positive.
Displacement is the shortest distance from start to end. It's a vector.

Quick check: If you walk 3m east then 4m north, what's the distance? What's the displacement?"

Student: "distance is 7m, displacement is 5m"
AI: "Perfect! You used the Pythagorean theorem correctly. √(3²+4²) = 5m. 
     Ready for the next concept — Speed vs Velocity?"
```

