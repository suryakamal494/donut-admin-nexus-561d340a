

## Problem

The sticky bottom action bar has two full-width (`flex-1`) buttons that span the entire bottom of the screen. This causes:
1. **Visual overlap** with the sidebar navigation on desktop
2. **Unnecessarily large buttons** — they don't need to stretch across the full width
3. Poor visual balance on both mobile and desktop

## Plan

**Replace the full-width sticky bar with compact, right-aligned floating action buttons.**

In `src/pages/institute/batches/BatchDashboard.tsx` (lines 420-439):

- Remove `flex-1` from both buttons so they size to their content
- Change layout from `flex gap-3` to `flex gap-2 justify-end`
- Use `size="sm"` on both buttons for a more compact look
- Adjust the container: remove `left-0` positioning, keep it right-aligned with proper padding
- On mobile, position it as a compact floating bar at bottom-right (above the nav bar with proper clearance)

The result: two small, right-aligned buttons that float at the bottom-right corner — similar to a FAB pattern — without overlapping the sidebar or taking up excessive space.

