

# Remove Notifications and Copilot from Student Sidebar Navigation

## Summary
Remove the duplicate "Notifications" and "Copilot" nav items from the desktop sidebar, since both are already accessible via the header (bell icon) and the floating action button (bottom-right).

## Changes

### 1. `src/components/student/layout/StudentSidebar.tsx`
- Remove the two entries from the `navItems` array: `{ id: "notifications", ... }` and `{ id: "copilot", ... }`
- Remove the `Bell` and `Sparkles` icon imports (if unused elsewhere)

### 2. `src/components/student/layout/StudentBottomNav.tsx`
- Audit for matching Notifications/Copilot entries and remove if present (to keep mobile nav consistent)

No other files affected. The sidebar will show: Home, Subjects, Tests, Progress.

