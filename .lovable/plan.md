

# Fix: Student Panel Slow Loading

## Problem

The student module **eagerly imports all 15 pages** in `StudentRoutes.tsx`, meaning every page (including heavy ones like TestPlayer, Copilot, ContentViewer, TestResults) loads upfront when you first visit any student URL. In contrast, the Teacher module lazy-loads its heavy pages, which is why it feels faster.

The comment in `StudentRoutes.tsx` says "EAGER LOADED (no lazy loading per requirement)" but this requirement is outdated and causing the performance issue.

## Solution

Apply the same pattern the Teacher module uses: **eager-load core pages** (Dashboard, Subjects, Timetable) and **lazy-load heavy pages** (TestPlayer, Copilot, ContentViewer, TestResults, Progress, etc.).

## Changes

### `src/routes/StudentRoutes.tsx`

- Keep eager imports for frequently visited pages: Dashboard, Subjects, SubjectDetail, Timetable, Tests
- Convert heavy/infrequent pages to `lazy()` imports with `Suspense` fallback:
  - `StudentCopilot` (401-line orchestrator with AI chat, artifacts, multiple sub-modules)
  - `StudentTestPlayer` (483-line full-screen test engine)
  - `StudentTestResults` (226-line results with charts)
  - `StudentContentViewer` (311-line full-screen viewer with animations)
  - `StudentBundleDetail`
  - `StudentChapterView`
  - `StudentProgress`
  - `StudentNotifications`
  - `StudentSubjectTests`
- Wrap lazy routes in `Suspense` with the student-appropriate `PageSkeleton` fallback
- Add `LazyErrorBoundary` wrapper for error recovery

This is a single-file change that should dramatically reduce the initial bundle size when entering the student panel.

