

## Issues Identified

### Issue 1 — Batch Report Header Takes ~40% of Viewport
**Screenshot 1 & 2.** Breadcrumbs + title ("Class 10 — 10A") + description + tabs + source toggle (My Exams / Institute) + date filters stack vertically, consuming ~200px before any content appears. On Students tab, it's even worse — the header is ~35% of the viewport with zero content visible.

### Issue 2 — Generate Practice: Generate Button Below the Fold
**Screenshot 3.** Three separate cards (Performance Bands, Questions per Band, Instructions) stack vertically. The "Generate" button is always below the fold, requiring a scroll every time.

### Issue 3 — Review Questions: Only 1 Question Visible, Band Switching Pain
**Screenshot 4.** Each question card shows full text + 4 options in a 2-column grid + difficulty/topic tags. This means only ~1.2 questions fit per screen. Switching bands requires scrolling back to the top to reach the tab bar.

### Issue 4 — Static UI for Question Generation
Currently calls an edge function. Since this is a UI prototype, the generation should use static mock data instantly instead of making API calls.

---

## Solutions with Options

### Issue 1 — Compact Batch Report Header

**Option A (Recommended): Inline header with tabs on the same row**

```text
┌─────────────────────────────────────────────────────────────┐
│ Teacher > Reports > 10A                                      │
│ Class 10 — 10A  [Chapters] [Exams (15)] [Students (21)]     │
│                  Chapter-wise & exam performance              │
│ [My Exams (15)] [Institute (6)]  [All Time|30d|3m|6m]  15   │
├─────────────────────────────────────────────────────────────┤
│ exam cards start here...                                     │
└─────────────────────────────────────────────────────────────┘
```

Move the TabsList to sit beside/below the title on the same visual row on desktop. Source toggle + date filters merge into one compact row. Saves ~60px.

**Option B: Sticky tabs bar**

Keep header as-is but make the TabsList + filters sticky at top when scrolling. Content scrolls underneath. Header scrolls away.

```text
(scrolled state)
┌────────────────────────────────────────────────┐
│ sticky: [Chapters] [Exams] [Students]          │
│ sticky: [My Exams] [Institute]  [filters]      │
├────────────────────────────────────────────────┤
│ content...                                      │
└────────────────────────────────────────────────┘
```

**Option C: Collapsible header**

PageHeader collapses on scroll — breadcrumbs and description hide, title shrinks. Tabs remain visible.

**Recommendation: Option A** — simplest, no scroll-dependent behavior, works on all devices. Reduces header from ~200px to ~120px.

---

### Issue 2 — Generate Practice: Single-Screen Configure

**Option A (Recommended): Merge cards into one compact form**

Collapse the 3 separate cards into a single streamlined form. Bands as inline chips (already compact), question count as inline toggle, instructions as a single collapsible textarea. Generate button is always visible.

```text
┌──────────────────────────────────────────────────────┐
│ Generate Practice                                     │
│ Kinematics · Physics · Class 10 10A                  │
│                                                       │
│ Bands: [● Mastery 1] [● Stable 13] [● Reinforce 9]  │
│                                                       │
│ Questions: (●) 5  ( ) 10  per band  │  15 total      │
│                                                       │
│ Instructions (optional)              [▼ Per-band]    │
│ ┌──────────────────────────────────────────────┐     │
│ │ e.g., Focus on numerical problems...          │     │
│ └──────────────────────────────────────────────┘     │
│                                                       │
│ [✨ Generate 15 Questions]                            │
└──────────────────────────────────────────────────────┘
```

Everything fits in one screen. No scrolling needed to reach Generate.

**Option B: Fixed Generate button at bottom**

Keep current layout but make the Generate button sticky at the bottom of the viewport.

**Recommendation: Option A** — cleaner, eliminates unnecessary card chrome.

---

### Issue 3 — Review Questions: Compact Cards + Sticky Band Tabs

**Option A (Recommended): Compact question cards + sticky band bar**

- Reduce question card size: options in a tighter single-column list (not 2-col grid), smaller font, less padding
- Make the band tab bar sticky so switching bands never requires scrolling to the top
- Show 3-4 questions per screen instead of 1

```text
┌───────────────────────────────────────────────────┐
│ [← Back]                    [Assign All Bands]    │
│ sticky: [● Mastery(5)] [● Stable(5)] [● Reinf(5)]│
├───────────────────────────────────────────────────┤
│ Q1. An object moves along a circular...    [×]    │
│   A. 0 m/s   B. 5.0 m/s   ✓C. 7.1 m/s   D. 10  │
│   medium · Displacement                           │
│───────────────────────────────────────────────────│
│ Q2. A projectile is launched from...       [×]    │
│   A. 45°   ✓B. 60°   C. 30°   D. 90°            │
│   hard · Projectile Motion                        │
│───────────────────────────────────────────────────│
│ Q3. ...                                           │
└───────────────────────────────────────────────────┘
```

Options displayed inline (A/B/C/D on one row) instead of a 2×2 grid. Each question takes ~80px instead of ~200px. 4-5 questions visible per screen.

**Option B: Accordion per question**

Show only question text by default, expand to see options on click. Very compact but requires extra clicks.

**Recommendation: Option A** — maintains readability while tripling density.

---

### Issue 4 — Static Question Generation

Replace the `supabase.functions.invoke("generate-chapter-practice")` call with a local static mock generator that returns questions instantly. Use the same `GeneratedQuestion` interface. Always show all 4 bands (mastery, stable, reinforcement, risk) regardless of student count.

---

## Implementation Plan

| Phase | Scope | Files |
|-------|-------|-------|
| **Phase 1** | Compact Batch Report header — tabs beside title, merge source+filter row | `BatchReport.tsx` |
| **Phase 2** | Single-screen Generate Practice — merge 3 cards, always-visible Generate button | `ChapterPracticeReview.tsx` (configure step) |
| **Phase 3** | Static mock question generator — remove API call, instant generation, all 4 bands | `ChapterPracticeReview.tsx` + new mock data util |
| **Phase 4** | Compact Review Questions — inline options, sticky band tabs, 4-5 Qs per screen | `ChapterPracticeReview.tsx` (review step) |

