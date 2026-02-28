

## Issues Identified

### Issue 1 — Configure Page: Excessive White Space + No Visual Warmth
The compact form works functionally but the page is barren — plain text on white background with no card containers, no color accents, and "Per-band instructions" is cryptic. More than 50% of the viewport is empty white space below the Generate button.

**Reasoning**: You're right. Compactness was achieved but visual warmth was lost. The form needs a proper card container with subtle background, and the Generate button should be **sticky at the bottom** (like Image 3's "Review & Assign" bar) so the page feels intentional rather than empty.

**Solution**: Wrap the configure form in a styled card with a subtle gradient header showing chapter context. Make the bottom bar (total count + Generate button) **fixed/sticky at the bottom** of the viewport. Add visual hierarchy with section dividers and proper label styling.

---

### Issue 2 — Review Page: Clumsy, No Visual Distinction Between Questions
Questions run together with only thin dividers — no card boundaries, no visual breathing room. It looks like a raw text dump rather than a structured review interface. Switching bands requires scrolling to top.

**Reasoning**: You're absolutely right. Comparing to Image 3, each question group there has a proper bordered card with clear headers. Our current `divide-y` approach creates a wall of text. Questions need individual card-like containers with subtle backgrounds.

**Solution**: Give each question a proper card-like container (bordered, slight background, rounded). Keep inline options but add proper visual separation. Make band tabs sticky (already done). Add a **sticky bottom bar** showing "X questions total · Y/4 bands assigned" + "Assign All" button (like Image 3's bottom bar).

---

### Issue 3 — No Regenerate Option After Deleting Questions
When a teacher removes questions, there's no way to get replacements. They either accept fewer questions or start over. This is a UX gap.

**Solution**: Track deleted question count per band. When any band has deleted questions, show a highlighted "Regenerate X Questions" button (either per-band or global). On click, pull replacement questions from the static mock pool to fill the gaps. The button only appears when deletions exist.

---

### Issue 4 — Static Generation for All 4 Bands
Already implemented in previous phase. Just need to ensure all 4 bands always appear regardless of student count (already done).

---

## Implementation Plan

### Phase 1 — Configure Page: Card Container + Sticky Bottom Bar

**File**: `src/pages/teacher/ChapterPracticeReview.tsx` (renderConfigure)

Changes:
- Wrap form content in a `Card` with subtle colored header showing chapter/subject context
- Move Generate button out of the form into a **sticky bottom bar** (`fixed bottom-0`) with total question count on the left
- Add proper labels with slightly larger text, section spacing
- Remove excess white space by centering the card vertically

```text
┌─────────────────────────────────────────────┐
│ breadcrumbs                                  │
│ Generate Practice                            │
│ ┌─────────────────────────────────────────┐ │
│ │ Performance Bands                        │ │
│ │ [● Mastery 1] [● Stable 13] ...         │ │
│ │                                          │ │
│ │ Questions per band: (●)5  ( )10   20tot │ │
│ │                                          │ │
│ │ Instructions (optional)                  │ │
│ │ ┌──────────────────────────────────┐    │ │
│ │ │ placeholder...                    │    │ │
│ │ └──────────────────────────────────┘    │ │
│ │ ▸ Per-band instructions                  │ │
│ └─────────────────────────────────────────┘ │
│                                              │
├──────────────────────────────────────────────┤
│ sticky: 20 questions total  [✨ Generate 20] │
└──────────────────────────────────────────────┘
```

### Phase 2 — Review Page: Question Cards + Sticky Bottom Bar + Visual Polish

**File**: `src/pages/teacher/ChapterPracticeReview.tsx` (renderReview)

Changes:
- Replace `divide-y` flat list with individual question cards (subtle border, rounded-lg, `p-3`, slight band-colored left border or background tint)
- Move "Configure" back button to breadcrumb area, not inside review content
- Move "Assign All" button to a **sticky bottom bar** with summary: `"X questions · Y/4 bands assigned"` on left, `[Assign All]` on right
- Keep sticky band tabs at top
- Each question card: question text + inline options + tags, with clear visual boundaries

```text
┌──────────────────────────────────────────────┐
│ sticky: [● Mastery(5)] [● Stable(5)] ...     │
├──────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────┐ │
│ │ Q1. A particle moves in a circle...   [×]│ │
│ │   ✓A. 2.5 m/s²  B. 5.0  C. 0.5  D. 25  │ │
│ │   hard · Circular Motion                  │ │
│ └──────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────┐ │
│ │ Q2. Two blocks of masses 2 kg...      [×]│ │
│ │   ✓A. 1.96  B. 3.92  C. 4.9  D. 2.45   │ │
│ │   hard · Newton's Laws                    │ │
│ └──────────────────────────────────────────┘ │
│                                              │
├──────────────────────────────────────────────┤
│ sticky: 20 questions · 0/4 assigned  [Assign]│
└──────────────────────────────────────────────┘
```

### Phase 3 — Regenerate Deleted Questions

**File**: `src/pages/teacher/ChapterPracticeReview.tsx`

Changes:
- Track total removed count per band
- When any band has removed questions, show a **"Regenerate X Questions"** button with `RotateCcw` icon, highlighted in the band's accent color
- Position: below the band tabs, above the question list (or in the sticky bottom bar)
- On click: pull replacement questions from the mock pool (questions not already in the results) and insert them into the band's question list
- Button only visible when `removedQuestions` has entries

| Phase | Scope | File |
|-------|-------|------|
| **Phase 1** | Configure: card container + sticky Generate bar | `ChapterPracticeReview.tsx` |
| **Phase 2** | Review: question cards + sticky bottom bar + visual polish | `ChapterPracticeReview.tsx` |
| **Phase 3** | Regenerate deleted questions feature | `ChapterPracticeReview.tsx` + `mockPracticeQuestions.ts` |

