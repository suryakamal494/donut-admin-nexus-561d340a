

# Student Dashboard — Copilot Integration and AI Suggestions Upgrade

## Summary

The current AI Suggestions section uses hardcoded static cards that just navigate to subjects. With the copilot now active, these should become **copilot triggers** — tapping a card opens the copilot with pre-filled context (e.g., "Practice Laws of Motion"). Additionally, add small copilot entry points on homework and test cards so students can get instant help without leaving the dashboard flow.

---

## What Changes and Why

### 1. Replace Static AI Recommendations with Copilot-Linked Smart Cards

**Current problem:** The three AI suggestion cards are hardcoded strings that all navigate to `/student/subjects/:id` — no connection to the copilot at all.

**New behavior:** Each card carries a `copilotAction` — tapping it navigates to `/student/copilot` with query params that pre-select the routine and subject:

- **"Continue where you left off"** → Opens copilot in `s_doubt` mode with the subject pre-selected
- **"Needs your attention"** → Opens copilot in `s_practice` mode for weak topics
- **"Almost there!"** → Opens copilot in `s_practice` mode for near-mastery topics

The URL pattern: `/student/copilot?routine=s_practice&subject=Physics&prompt=Practice+weak+topics+in+Laws+of+Motion`

### 2. Add "Ask Copilot" Chip on Homework Cards

A small `Sparkles` icon chip ("Ask AI") on each homework item. Tapping it opens copilot with the homework topic as context — so the student can ask doubts about the assignment immediately.

### 3. Add "Prepare" Button on Upcoming Test Cards

Each test card gets a subtle "Prepare" chip that opens copilot in `s_exam_prep` mode with the test subject and title pre-filled.

### 4. Copilot Page Reads Query Params on Mount

The copilot page needs to read `routine`, `subject`, and `prompt` from the URL search params and auto-start a conversation with that context. This is what makes the dashboard cards actually functional.

---

## Technical Details

### Files Changed

| File | Action |
|------|--------|
| `src/data/student/dashboard.ts` | Edit — add `copilotRoutine` and `copilotPrompt` fields to `AIRecommendation` interface; update mock data |
| `src/components/student/dashboard/AIRecommendationCard.tsx` | Edit — change `handleClick` to navigate to `/student/copilot?routine=...&subject=...&prompt=...` instead of subjects |
| `src/components/student/dashboard/HomeworkSection.tsx` | Edit — add small "Ask AI" chip on each homework card that links to copilot with doubt context |
| `src/components/student/dashboard/UpcomingTestCard.tsx` | Edit — add "Prepare" chip linking to copilot in exam prep mode |
| `src/components/student/copilot/StudentCopilotPage.tsx` | Edit — on mount, read `routine`, `subject`, `prompt` from `useSearchParams`; if present, auto-create a thread with that routine/subject and send the prompt as the first message |

### Data Changes (dashboard.ts)

```typescript
export interface AIRecommendation {
  // ...existing fields...
  copilotRoutine?: string;  // e.g. 's_practice', 's_exam_prep', 's_doubt'
  copilotPrompt?: string;   // pre-filled message for copilot
}
```

Updated mock data examples:
- `{ type: 'continue', copilotRoutine: 's_doubt', copilotPrompt: 'Help me continue with Laws of Motion' }`
- `{ type: 'focus', copilotRoutine: 's_practice', copilotPrompt: 'Practice weak topics in Biology' }`
- `{ type: 'quick-win', copilotRoutine: 's_practice', copilotPrompt: 'Quick practice on Chemistry Ch.5 to finish the unit' }`

### Navigation Pattern

All copilot-linked elements use the same URL scheme:
```
/student/copilot?routine={key}&subject={name}&prompt={encoded_message}
```

The `StudentCopilotPage` reads these on mount via `useSearchParams`, creates a thread with the matching routine and subject, and auto-sends the prompt — giving the student an instant, contextual conversation.

### Visual Design

- **AI Suggestion cards**: Keep existing coral/orange design, add a small `Sparkles` icon in the action arrow area to signal "opens copilot"
- **Homework "Ask AI" chip**: Tiny `Sparkles` icon + "Ask AI" text, styled `bg-donut-coral/10 text-donut-coral rounded-full px-2 py-0.5`, placed after the due date
- **Test "Prepare" chip**: Same style, `bg-violet-100 text-violet-600`, with `Sparkles` icon + "Prepare"

No new files created. No database changes needed.

