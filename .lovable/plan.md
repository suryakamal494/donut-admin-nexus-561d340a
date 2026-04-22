

# Add Student Copilot Access — Floating Action Button

## What's Missing

The student copilot (all 6 phases) is fully built and lives at `/student/copilot`, but there is zero way to reach it from the student panel. No button, no nav entry, no link anywhere.

## What We'll Build

A floating "Copilot" button on the bottom-right of every student page (similar to the teacher panel's `CopilotLauncher`), which navigates to `/student/copilot`.

## Implementation

### 1. Create `StudentCopilotFAB.tsx`

New file: `src/components/student/copilot/StudentCopilotFAB.tsx`

- A floating action button positioned `fixed bottom-20 right-4` on mobile (above bottom nav) and `bottom-6 right-6` on desktop
- Gradient background matching student panel warm theme (donut-coral to donut-orange)
- Sparkles icon + "Copilot" label
- On click: `navigate('/student/copilot')`
- Hidden when already on the copilot page
- 44px+ touch target, shadow, hover/active scale transitions

### 2. Add FAB to `StudentLayout.tsx`

Import and render `StudentCopilotFAB` inside the layout, so it appears on all student pages (dashboard, subjects, tests, progress, notifications).

### 3. Add Copilot to `StudentSidebar.tsx` (Desktop)

Add a "Copilot" nav item with a Sparkles icon to the sidebar navigation list, linking to `/student/copilot`. This gives desktop users a secondary way to access it.

---

No changes to routing needed — the `/student/copilot` route already exists as a standalone page outside the layout.

