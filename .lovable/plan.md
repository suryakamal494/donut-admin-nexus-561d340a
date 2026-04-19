

## Plan: Fix Copilot crash + light refactor (no behavior changes)

### Audit summary

I measured every Copilot file. The codebase is **healthy in size** — 20 files, ~1,800 lines total, average ~90 lines per file. Nothing is bloated:

- Largest: `RoutinePilotPage.tsx` (286), `ChatPane.tsx` (283), `TestView.tsx` (190).
- Each file has a single, clear responsibility (chat, artifacts, tutorial, refine composer, etc.).
- No dead code, no duplication worth extracting.

**The "smoothness" issue is not size — it's one critical bug** plus a few small hygiene items.

---

### The actual bug (causes the runtime crash you're seeing)

`src/components/teacher/routine-pilot/ChatPane.tsx` calls `useDynamicChips(...)` on **line 207**, which is **after the early `return` on line 198**. React requires hooks to run in the same order every render. When `batch` or `routine` is null on first render and non-null on the next, the hook count changes → React throws **"Rendered more hooks than during the previous render."**

Fix: move `const dynamicChips = useDynamicChips(batch?.id ?? null, routine);` and `const isEmpty = messages.length === 0;` to the top of the component, **above** the `if (!batch || !routine) return …` guard.

This single fix resolves the current crash and explains why Copilot feels broken.

---

### Light, safe refactor (zero behavior change)

These are tiny cleanups that improve smoothness without touching any feature:

1. **ChatPane.tsx**
   - Move all hook calls above the early return (the bug fix above).
   - Extract the SSE streaming reader into a small helper `streamChat()` inside the same file (just a function, not a new file) — shrinks `send()` from ~140 lines to ~40 and makes it easier to read. No behavior change.

2. **RoutinePilotPage.tsx**
   - Extract the two duplicated thread-loading queries (effect on line 78 and `refreshThreads` on line 124) into one local `loadThreads()` helper used by both. Saves ~12 lines, removes the duplication that caused the original batch-switch bug.

3. **useDynamicChips.ts**
   - Already clean. No change needed.

4. **CopilotLauncher.tsx**
   - Already clean. No change needed.

5. **TestView.tsx, ArtifactRefineComposer.tsx, CopilotTutorial.tsx, ArtifactPane.tsx**
   - Already clean. No change needed.

### What stays exactly the same

- All UI, all behavior, all routes, all edge functions, all DB queries.
- The 3-pane layout, mobile drawers, tutorial, refine composer, publish flow — all untouched.
- No new dependencies, no file moves, no renames, no new components.

### Files touched

| File | Change |
|---|---|
| `src/components/teacher/routine-pilot/ChatPane.tsx` | Move hooks above early return (fixes crash); extract `streamChat` helper |
| `src/components/teacher/routine-pilot/RoutinePilotPage.tsx` | Deduplicate thread-loading into one helper |

That's it. Two files, ~50 lines net change, zero feature regressions.

### Out of scope

- No new features.
- No edge function changes.
- No styling or layout changes.
- No splitting files just for size — none of them warrant it.

### Phasing

Single implementation pass.

