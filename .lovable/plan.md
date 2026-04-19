

## What I think you're asking

You want the Copilot screen to **breathe** like the screenshot. Right now the chat column is suffocating because:

1. The **suggestion chips wrap and stack vertically** above the composer — on a 1110px viewport with both side panels open, the chat column is ~450px wide, so 4 chips become 4 rows, eating ~150px of chat real estate.
2. The **left rail wastes a chunky header** ("✨ RoutinePilot") that duplicates the "Copilot" brand already in the top bar.
3. The **chat header is two lines** ("Lesson Prep" / "All Batches • Subject") instead of one tight row.
4. The **composer is taller than it needs to be** with `min-h-[44px]` + send button + chips area = ~120px.
5. There's **no consistent breathing rhythm** — paddings jump between `p-3`, `p-4`, `p-5`, `py-6`.

The screenshot shows a calmer layout: slim left rail, single-row chat header, **chips inline under the header (not above the composer)**, single-line composer with a soft coral ring, and roomier artifact cards on the right. Same components — just better proportions and chip placement.

## The plan

### 1. Move suggestion chips OUT of the composer area, INTO the chat header zone

This is the single biggest fix for "the chat panel feels packed."

- In `ChatPane.tsx`, render chips as a **single row directly under the chat header** with the label `"Quick starts:"` (matches screenshot).
- Use `overflow-x-auto scrollbar-hide` so they scroll horizontally instead of wrapping into multiple rows. No more vertical stacking, no matter how narrow.
- Cap visible chips to 3 (rest scroll). Remove the chips block from above the composer entirely.

### 2. Slim the left rail header

In `LeftRail.tsx`:
- **Remove** the `✨ RoutinePilot` heading row (top bar already shows "Copilot" — it's redundant).
- Replace with a small uppercase `BATCH` label above the dropdown, matching the screenshot.
- Add a small **"RoutinePilot · Co-pilot Mode"** footer pill at the bottom of the rail (sticky inside the scroll container).

### 3. Tighten the chat header to one row

In `ChatPane.tsx`:
- Combine routine name + batch into one row: `📝 Lesson Prep · All Batches` with the routine icon on the left.
- Drop from `py-3` to `py-2.5`. Removes ~15px of vertical waste.

### 4. Lighten the composer

- Single line, `min-h-[40px]`, soft coral focus ring (`focus-visible:ring-2 ring-primary/40`).
- Smaller round send button (`h-9 w-9` instead of `h-11 w-11`).
- Drop the wrapper `bg-card/30` band — let it sit flush on the background like the screenshot.

### 5. Normalize spacing rhythm

Standardize all pane paddings to a **4 / 5 / 6 scale**:
- Left rail body: `p-4`
- Chat header + composer: `px-5 py-3`
- Chat scroll content: `px-5 py-5`
- Artifact pane: `p-4` cards with `gap-3`

### 6. Artifact card polish (right pane)

In `artifacts/ArtifactCard.tsx`:
- Add the mint **batch badge** (e.g. `10A`) on the top-right (already brand color `donut-teal`).
- Footer row: `▸ Expand` (left) / `↓ Export` (right), both ghost buttons, `text-xs`.
- Subtle hover lift (`hover:-translate-y-0.5 hover:shadow-md`).

### What does NOT change

- No new files (except keeping `useDynamicChips`, `CopilotTutorial`, `ArtifactRefineComposer` exactly as they are).
- No edge function, DB, routing, or behavior changes.
- Tutorial, refine composer, publish flow, batch switching — untouched.
- Mobile drawers and bottom sheet — untouched (already responsive).

### Files touched

| File | Change |
|---|---|
| `src/components/teacher/routine-pilot/ChatPane.tsx` | Move chips under header (horizontal scroll, no wrap); tighten header to one row; lighter composer |
| `src/components/teacher/routine-pilot/LeftRail.tsx` | Remove RoutinePilot heading; add `BATCH` label; add footer mode pill |
| `src/components/teacher/routine-pilot/artifacts/ArtifactCard.tsx` | Mint badge + Expand/Export footer + hover lift |

Three files. ~80 lines changed. No new components, no new dependencies, no behavior change — only spacing, placement of chips, and visual polish to match the screenshot.

### Out of scope

- Reworking the artifact detail view (`TestView`, `LessonPlanView`, etc.) — those are fine.
- Changing colors/tokens in `index.css` — we use existing `--primary` (coral), `--accent` (orange), and `--donut-teal` only.
- Any changes to the tutorial coachmarks.

### Phasing

Single implementation pass.

