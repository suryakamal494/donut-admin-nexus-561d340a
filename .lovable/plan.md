# Left Rail Restructure — Accordion Lifecycle + Quick Tools Placement

## What's wrong right now (from your screenshots)

1. **Group headers blend into the list.** `ACTIVE (41)` and `RECENT (5)` are tiny uppercase muted text, indistinguishable from a thread row. The eye reads them as just another chat.
2. **No accordion behavior.** Active has 41 items, so the user must scroll past all 41 just to reach Recent. The grouping exists logically, but there is no spatial separation.
3. **Quick Tools is muted and buried at the bottom.** It looks "disabled" rather than "secondary."

---

## The Quick Tools placement question — my honest reasoning

You asked *why* I put Quick Tools at the bottom. Here is the trade-off:

**Argument for top placement (your instinct):**
- Tools are actions. Actions usually live above content.
- Power users scan top-down; they will discover tools faster.
- Visually, top placement signals "this is important."

**Argument for bottom placement (what I did):**
- Per Rule 1 of the rulebook, the **global chat input is the primary entry point**. Every CTA on the dashboard already routes through the router. Tools in the rail are an **escape hatch** for the rare case where the student wants to skip the router and force a specific tool.
- If tools sit at the top, students start using them as their main path again — which **defeats the entire session-continuity work** we just built. We're back to "click Practice, get a fresh thread" sprawl.
- Hence: history (the meaningful artifact of past work) gets the prime real estate; tools sit quietly below as power-user escape.

**My recommendation:** Keep tools at the bottom on principle, but make them **visible and inviting** — not faded. The current dullness is a styling bug, not a placement decision. A clear separator, normal foreground color, hover affordance, and a subtle icon tint will make them feel intentional rather than disabled.

If after using it for a week you still feel they should move up, we move them — but the architectural reason to keep them down is real.

---

## Proposed redesign

### 1. Lifecycle accordion (replaces flat headers)

Replace the three flat `ThreadGroup` blocks with a true **single-expand accordion**:

```text
┌─────────────────────────────────────┐
│ ▼ Active           6                │  ← bold, expanded by default
│   • Newton's Laws                   │
│   • Mechanics 6/10                  │
│   • JEE Main 2026                   │
│   …                                 │
├─────────────────────────────────────┤
│ ▶ Recent           5                │  ← bold, collapsed
├─────────────────────────────────────┤
│ ▶ Archived         5                │  ← bold, collapsed
└─────────────────────────────────────┘
```

Behavior:
- Click `Recent` → Active **collapses automatically**, Recent expands. Single-pane at a time.
- Empty bucket: header still renders but disabled (no chevron, muted count).
- Default open: `Active`. If Active is empty, default to `Recent`.

Visual contract for the headers:
- Background bar: `bg-muted/40` for collapsed, `bg-muted/70` for expanded.
- Typography: `text-sm font-semibold text-foreground` (bold, full-contrast).
- Chevron icon (rotates on expand) + count pill on the right.
- 1 px divider between sections.

This makes the three buckets feel like **distinct compartments**, not labels inside one long list.

### 2. Thread items get a clearer visual hierarchy

Inside an expanded section:
- Thread title: `text-sm` (was `text-sm`, same) but in `text-foreground/85`.
- Subject dot stays.
- Active section gets a left coral accent border on the item to reinforce "this is live."

### 3. Quick Tools: stay at the bottom, but make it look intentional

- Replace the muted footer with a clearly delineated card:
  - Solid divider above.
  - `bg-background` (not muted) so it doesn't look "off."
  - Header `Quick tools` in `text-xs font-semibold text-foreground` (not muted).
  - Each item: full-contrast text (`text-foreground/90`), icon at `text-donut-coral/70`, hover shifts to `bg-donut-coral/10`.
  - Subtle helper line at the very bottom: *"Skip the router — start a tool directly."* So students understand the placement is deliberate.

### 4. Subject filter stays at the top, unchanged

It's a filter for the entire history view, so it logically sits above the accordion.

---

## File changes (only one)

`src/components/student/copilot/StudentLeftRail.tsx`
- Add local state `expandedBucket: "active" | "recent" | "archived"`.
- Replace the three `ThreadGroup` calls with three `LifecycleSection` blocks rendered as an accordion.
- Restyle the Quick Tools footer per the new spec; add the helper line.

No DB, router, or other component changes. No new dependencies — uses existing `lucide-react` chevron icons and existing tokens.

---

## What you'll see after

- Three bold, separated bars: **Active 6**, **Recent 5**, **Archived 5**.
- Active is open by default. Click Recent → Active folds, Recent unfurls.
- Quick Tools at the bottom now reads as a deliberate, full-contrast section — not a forgotten footer.
