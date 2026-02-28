

## Issue Identified — Questions Tab: Flat, Monotone Question Cards

**Current state**: The `QuestionRow` component in `PracticeSessionDetail.tsx` renders questions as plain `divide-y` rows with gray "Q1" labels, black text, and two small badges. There's no visual warmth, no color on the Q number, no card boundaries, and no way to view the solution or answer options. Everything is black-and-white with thin dividers — no clear distinction between questions.

**What the reference image (your screenshot) does right**: Each question has a subtle card-like separation with warm background, colored Q numbers, topic + difficulty badges on the left, and color-coded success rates on the right. Clean, readable, well-spaced.

**What's missing from current UI**:
1. Q number has no color — just gray monospace text
2. No solution/answer viewing capability — `QuestionResult` interface doesn't even have options or correct answer data
3. No card-like boundaries between questions — just `divide-y`
4. No background warmth — plain white

---

## Solution

### Phase 1 — Enhance Data Model + Question Card UI

**File: `src/data/teacher/practiceSessionDetailData.ts`**
- Add `options: string[]` and `correctOption: number` fields to `QuestionResult` interface
- Generate 4 mock options per question with a marked correct answer

**File: `src/pages/teacher/PracticeSessionDetail.tsx`**
- Replace `divide-y` flat list with individual card-like containers per question (subtle border, rounded, slight padding, `bg-muted/30` background)
- Style Q number with a colored circular badge (band accent color or primary tint, e.g., `bg-primary/10 text-primary` rounded-full)
- Add an expandable "View Solution" toggle per question using local state — clicking reveals the 4 options with the correct one highlighted in green
- Keep topic badge + difficulty badge + success rate in current positions but ensure the success rate is color-coded (already done via `accuracyColor`)
- Add subtle left border using band color on each question card for visual grouping

```text
┌─────────────────────────────────────────────────────┐
│ ● Mastery Ready  (5 questions)                       │
│                                                       │
│ ┌───────────────────────────────────────────────────┐│
│ │ [Q1] A particle moves along a straight line...    ││
│ │   Free Fall · Medium              74% success 1/2 ││
│ │   ▸ View Solution                                  ││
│ └───────────────────────────────────────────────────┘│
│ ┌───────────────────────────────────────────────────┐│
│ │ [Q2] Derive the equation of motion...             ││
│ │   Circular Motion · Easy          43% success 1/2 ││
│ │   ▾ View Solution                                  ││
│ │   A. 2as = v²-u²   ✓B. v²=u²+2as  C. ...  D. ...││
│ └───────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

### Changes Summary

| What | Detail |
|------|--------|
| Q number badge | Colored circular badge (`bg-primary/10 text-primary font-semibold rounded-full w-7 h-7 flex items-center justify-center`) |
| Card boundaries | Each question wrapped in a div with `border rounded-lg p-3 bg-muted/20` |
| View Solution | Collapsible section per question showing 4 options (A/B/C/D) with correct answer in green |
| Data model | Add `options: string[]` and `correctOption: number` to `QuestionResult` |
| Mock options | Generate 4 plausible options per question text using seeded patterns |

