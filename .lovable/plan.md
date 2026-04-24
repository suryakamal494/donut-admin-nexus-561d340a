# Left Rail Audit + Restructure

## What I found (audit)

I reviewed `StudentLeftRail.tsx`, `StudentCopilotPage.tsx`, `StudentChatPane.tsx`, and the mock data. Three real problems:

### 1. The accordion code is *technically* correct — but you can't see it work

`toggleBucket` already does `prev === b ? null : b`, and the three `LifecycleSection` blocks all render. So why does it feel "stuck"?

Because the rail is so vertically packed that **Recent and Archived bars sit below the visible scroll fold**:

```text
┌───────────────────┐  ← top
│ ← Exit Copilot    │  ~40px
├───────────────────┤
│ 👤 Arjun Sharma   │  ~72px  ← profile block
│    Class 10  ⋯    │
├───────────────────┤
│ [All][Phy][Chem]… │  ~60px  ← subject chips wrap to 2 rows
├───────────────────┤
│ ▼ Active   (41)   │  ← only this fits
│   thread…         │
│   thread… (×40)   │  ← fills remaining height
│ ─ ─ ─ fold ─ ─ ─  │
│ ▶ Recent  (5)     │  ← off-screen until you scroll
│ ▶ Archived (5)    │
├───────────────────┤
│ Quick tools       │  pinned bottom
└───────────────────┘
```

So when you click Active, it *does* collapse — but with 41 items above and Recent/Archived hidden below, the only visible feedback is the chevron rotating. The other bars never come into view without scrolling.

### 2. Active says **41** because unstatused threads default to active

Mock data has 6 active / 5 recent / 5 archived = 16. Every new chat the router auto-creates (`handleNewThread`) saves a thread with no `status`, and the rail's fallback (`status ?? "active"`) dumps all 25+ unstatused threads into Active. That's how you got "Active (41)".

### 3. Profile + 3-dot menu is wasted vertical space in the rail

Your suggestion is right — `Arjun Sharma · Class 10` belongs in the top bar of the chat pane (the "welcome bar"), not eating ~72px in a 260px-wide rail. The 3-dot menu only contains "Start fresh chat", which a `+` icon communicates better and faster.

---

## The fix (one structural pass)

### A. Move profile out of the left rail → into the chat pane header

Replace the chat pane's plain 48px header (currently just a hamburger + a panel-toggle) with a richer top bar:

```text
┌──────────────────────────────────────────────────────────┐
│ ☰   👤 Arjun Sharma · Class 10              [+]   [▣]   │  ← 56px top bar
├──────────────────────────────────────────────────────────┤
│  routine pill · thread title                             │  ← thin sub-header (only when in a thread)
├──────────────────────────────────────────────────────────┤
│                                                          │
│   chat / welcome content                                 │
```

- `☰` toggles the left rail (same as today).
- `👤 Arjun Sharma · Class 10` — small avatar + name + grade.
- `+` button → starts a fresh chat (replaces 3-dot dropdown).
- `▣` toggles the artifact pane (existing).
- Thread title + routine pill drop into a thin secondary line, so the top bar stays clean.

This top bar is shared between the welcome screen and the in-thread view.

### B. Slim the left rail

Remove the entire profile block (lines 130–156) and the 3-dot dropdown. The rail becomes:

```text
┌───────────────────┐
│ ← Exit Copilot    │  ~36px
├───────────────────┤
│ [All][Phy][Chem]… │  ~52px (chips, single row scroll)
├───────────────────┤
│ ▼ Active     (6)  │  ← all three bars now fit above the fold
│   • thread…       │
│   • thread…       │
├───────────────────┤
│ ▶ Recent     (5)  │
├───────────────────┤
│ ▶ Archived   (5)  │
├───────────────────┤
│ Quick tools       │
│ • Practice  • …   │
└───────────────────┘
```

Subject chips switch from `flex-wrap` to a single horizontal scroll row (`overflow-x-auto`, no wrap) so they don't take 2 lines on narrow rails. Roughly **~110px reclaimed** at the top of the rail.

### C. Fix the "Active (41)" bloat

Change the grouping fallback so unstatused threads land in **Recent**, not Active:

```ts
// before
const s = (t.status as Bucket) ?? "active";
// after
const s = (t.status as Bucket) ?? "recent";
```

Rationale: a thread with no explicit status is "I don't know if it's still being worked on" — the safe bucket is Recent. Active should only contain threads actively touched today (per Rule 5 / `archiveStaleThreads`). After this change, the pre-seeded labels remain authoritative (6 / 5 / 5), and any new chats you create show up under Recent until they get touched again, then promoted by the lifecycle sweep.

### D. Make the accordion clearly interactive

Small polish so it doesn't look "stuck":

- Even when a bucket is empty, the header stays clickable (just shows the empty hint inside) — no more `disabled` / muted feel that reads as "broken."
- Add a 1px shadow under the open header so the active bar visually pops.
- Smooth height transition on expand/collapse using `max-h` + `transition-[max-height]`.

### E. Quick tools — keep at the bottom, no styling change

Audit-confirmed. The current contrast + helper line is fine. The only reason they looked dull before was that the rail above was so dense the eye gave up before reaching them. Once the rail is slimmed (A + B), Quick Tools sits in a clean ~120px footer with nothing competing for attention.

---

## Files to change

1. **`src/components/student/copilot/StudentLeftRail.tsx`**
   - Remove the Exit Copilot? **Keep** — it's the only way back to the dashboard.
   - Remove the profile block (lines 130–156) + dropdown menu + unused `MoreHorizontal`, `DropdownMenu*` imports.
   - Subject chips → single-row scroll (`flex-nowrap overflow-x-auto`).
   - Change grouping fallback `"active"` → `"recent"`.
   - Make `LifecycleSection` always clickable (drop `disabled={isEmpty}`); show the empty hint when expanded.
   - Add `shadow-sm` to the open header.

2. **`src/components/student/copilot/StudentChatPane.tsx`**
   - Replace the 48px header with a 56px top bar containing: hamburger, avatar + name + grade, `+` (new chat), artifact-pane toggle.
   - Add a thin secondary line below for routine pill + thread title (only when a thread is selected).
   - Welcome screen reuses the same top bar (no `+` action needed since the next user message creates a thread automatically).

3. **`src/components/student/copilot/StudentCopilotPage.tsx`**
   - Pass `onNewThread` and `studentProfile` props down to `StudentChatPane` so the new top bar's `+` button works.

No changes to the router, edge functions, or DB. No new dependencies.

---

## What you'll see after

- Top bar: **👤 Arjun Sharma · Class 10** with a clean `+` button, replacing the 3-dot menu.
- Left rail: ~110px shorter at the top → all three bars (**Active 6 · Recent 5 · Archived 5**) visible above the fold without scrolling.
- Click Active → it collapses, Recent/Archived stay in view. Click Recent → Active was already collapsed; Recent expands. Click Archived → Recent collapses; Archived expands. Single-pane behaviour is now visually obvious because the other two bars are always on screen.
- Counts are realistic (6/5/5), not 41/5/0.
- Quick Tools at the bottom reads as a deliberate footer, not a forgotten one.
