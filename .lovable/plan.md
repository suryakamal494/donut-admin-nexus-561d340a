

## Plan: Refactor Copilot to full-screen overlay (keep 3-panel layout)

### What changes

**Entry & exit**
- Keep the existing floating "Copilot" pill (bottom-right) as the primary opener.
- Add global `Cmd/Ctrl + K` shortcut to open it.
- Add `Esc` to close (Sheet already does this, but we'll make it explicit).
- When open, the app's `TeacherLayout` chrome (sidebar + bottom nav + top bar) must be hidden — Copilot renders truly full-screen.
- Add a persistent **← Exit Copilot** button top-left inside the overlay (replaces the current generic close X behavior on mobile; desktop keeps both options).

**Overlay shell**
- Replace the current right-side `Sheet` (`max-w-[1400px]`) with a true full-screen overlay (fixed inset-0, z-50) so there's no background app peeking on the left.
- Top bar inside the overlay: only `← Exit Copilot` on left + optional `[⋮]` menu on right. **No filters, no breadcrumb, no routine/batch dropdowns in the header.**

**Desktop layout (≥1024px)** — keep `RoutinePilotPage` 3-panel structure as-is:
- Left rail: Batch switcher → Routines list → `+ New thread` → Threads (already built in `LeftRail.tsx`).
- Center: Chat (`ChatPane`).
- Right: Artifacts (`ArtifactPane`).
- Both side panels remain collapsible. Today the left rail uses `hidden md:block` and the right uses `hidden lg:block` — we'll convert these to user-toggleable collapse state (hamburger on left, panel toggle on right) so a teacher can hide either pane on demand even on desktop.

**Mobile (≤768px)**
- Center chat is full-screen.
- Left rail becomes a slide-in `Sheet` (left side) triggered by a hamburger icon top-left, next to Exit.
- Artifact pane becomes a swipe-up bottom sheet (use existing `Drawer` from vaul) with a `📎 N artifacts ▲` handle pinned above the chat composer.

**Tablet (768–1023px)**
- Left rail visible inline, artifact pane becomes the bottom sheet (or right slide-in sheet) — toggleable.

**Context-aware entry**
- `CopilotLauncher` accepts/derives a context based on the current route (read via `useLocation`):
  - `/teacher/dashboard` → preselect routine `lesson_prep`
  - `/teacher/tests*` → `test_creation`
  - `/teacher/homework*` → `homework`
  - `/teacher/reports*` → `analysis` (currently coming-soon → fall back to `lesson_prep` with a toast, OR just don't preselect)
  - `/teacher/syllabus*` → `syllabus_tracker` (same fallback)
- If the route contains a batch id (e.g. `/teacher/batches/:batchId/...`), preselect that batch in the left rail's batch switcher.
- Implementation: pass `initialRoutineKey` and `initialBatchId` props from `CopilotLauncher` → `RoutinePilotPage`, which uses them for initial state instead of "first batch / first active routine".
- Also expose a global helper / context so any "Open in Copilot" button on app screens can call `openCopilot({ routine, batchId })`.

**What stays unchanged**
- All artifact types and their renderers (lesson_plan, test, homework, banded_homework, ppt, schedule).
- `BandedHomeworkView`, `PptView`, inline artifact detail swap (no modal).
- Mock scheduling flow.
- Edge function `routine-pilot-chat` and DB schema.
- LeftRail batch switcher remains the only filter — no header dropdowns.

### Files

| File | Action |
|---|---|
| `src/components/teacher/routine-pilot/CopilotLauncher.tsx` | Refactor: full-screen overlay (not Sheet), Exit button, Cmd+K, context-aware preselect from route, hide app chrome via portal/fixed inset-0 |
| `src/components/teacher/routine-pilot/RoutinePilotPage.tsx` | Accept `initialBatchId` + `initialRoutineKey` props; add user-toggleable collapse state for left & right panes; integrate mobile drawer + bottom sheet |
| `src/components/teacher/routine-pilot/MobileArtifactSheet.tsx` | New: vaul `Drawer` wrapper with "📎 N artifacts" handle, hosts `ArtifactPane` inside |
| `src/components/teacher/routine-pilot/MobileLeftRailSheet.tsx` | New: `Sheet` (left side) wrapper hosting `LeftRail` for mobile/tablet |
| `src/components/teacher/routine-pilot/CopilotContext.tsx` | New: tiny context exposing `openCopilot({ routine?, batchId? })` so other teacher screens can trigger it programmatically |
| `src/components/layout/TeacherLayout.tsx` | Wrap children with `CopilotProvider`; ensure `CopilotLauncher` uses route-derived context |

### Behavior details
- Exit Copilot: closes overlay, restores the floating pill, keeps app on the same underlying route.
- Cmd/Ctrl+K: toggles open/close; ignored when typing inside `<input>` / `<textarea>` outside Copilot only if conflicts arise (otherwise allow it everywhere).
- Pane collapse state persists in `localStorage` (`copilot.leftCollapsed`, `copilot.rightCollapsed`).
- Mobile bottom sheet artifact count badge updates as new artifacts arrive (already realtime-wired).

### Out of scope
- No DB changes.
- No edge function changes.
- No new artifact types.
- No styling overhaul — uses existing tokens.

### Phasing
Single implementation pass — the changes are mostly contained to `CopilotLauncher` + 2 new mobile sheet components + a small prop addition on `RoutinePilotPage`.

