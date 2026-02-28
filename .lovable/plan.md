

## Issues Identified

### Issue 1 — Pages Don't Scroll to Top on Navigation
**Root cause**: React Router v6 does not automatically scroll to top on route changes. The app has no `ScrollRestoration` or `useEffect` that calls `window.scrollTo(0, 0)` on navigation. When a user clicks a Practice History session or an Exam Breakdown link, the new page renders at whatever scroll position the previous page was at — often the bottom, since Practice History and Exam Breakdown are near the bottom of the Chapter Report page.

**Where it happens**: Every navigation within the Reports module (and likely the entire teacher portal). Examples:
- Chapter Report → Practice Session Detail
- Chapter Report → Exam Results
- Batch Report → Chapter Report
- Batch Report → Student Report
- Batch Report → Exam Results

**Solution**: Add a `ScrollToTop` component that listens to `useLocation()` and calls `window.scrollTo(0, 0)` on every pathname change. Place it inside the `BrowserRouter` in `App.tsx` so it applies globally to all portals.

### Issue 2 — Practice History Doesn't Scale Beyond 2-3 Sessions
**Root cause**: The mock data generator (`practiceHistoryData.ts`) produces only 2-3 sessions (`const count = 2 + (seed % 2)`). The `ChapterPracticeHistory` component renders all sessions in a flat list with no pagination or "Show more" pattern. With 5-6+ sessions, the card would become very tall and push content below it further down.

**Solution**:
1. Increase mock data to generate 4-6 sessions to test scalability
2. Add a "Show more" pattern to `ChapterPracticeHistory`: show first 3 sessions, with a "Show all X" toggle button to expand. This matches the pattern already used in Student Report's exam history.

---

## Implementation Plan

### Phase 1 — Scroll-to-Top on Navigation

**File**: New `src/components/ScrollToTop.tsx`
- Create a small component using `useEffect` + `useLocation` that calls `window.scrollTo(0, 0)` on pathname change

**File**: `src/App.tsx`
- Import and place `<ScrollToTop />` inside `<BrowserRouter>` before `<Routes>`

### Phase 2 — Practice History Scalability

**File**: `src/data/teacher/practiceHistoryData.ts`
- Change session count from `2 + (seed % 2)` (2-3) to `3 + (seed % 4)` (3-6) for realistic testing

**File**: `src/components/teacher/reports/ChapterPracticeHistory.tsx`
- Add `useState` for `showAll` (default false)
- Show first 3 sessions when collapsed, all when expanded
- Add a "Show all X sessions" / "Show less" toggle button at the bottom of the list when sessions > 3

