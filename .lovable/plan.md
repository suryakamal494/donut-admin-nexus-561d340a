

# Student Progress Plan — Implementation Audit

## Status Summary

| Item | Status |
|------|--------|
| **Data Layer** (`progressData.ts`) | DONE — adapter wrapping teacher generators with caching |
| **Progress.tsx** (tab navigation) | DONE — 4 tabs (Overview/Subjects/Exams/Insights), pill tabs, AnimatePresence |

## Phase 1 — Overall Dashboard

| Component | Status |
|-----------|--------|
| `ProgressHeroCard` | DONE — PI gauge, accuracy, consistency, trend, rank pill |
| `BatchStandingCard` | DONE — horizontal bar with avg/top markers, delta stats |
| `SubjectOverviewGrid` | DONE — horizontal scroll mobile, 2-col grid desktop, PI/trend/accuracy |

## Phase 2 — Subject Deep Dive

| Component | Status |
|-----------|--------|
| `SubjectDeepDive` (header + container) | DONE — PI, accuracy, trend, rank, percentile, batch avg |
| `ChapterMasteryList` | DONE — color-coded progress bars, topic count, tap to expand |
| `WeakTopicsAlert` | DONE — top 5 weakest topics, coral-tinted card |
| `DifficultyBreakdown` | DONE — Easy/Medium/Hard accuracy bars |
| `SubjectBatchStanding` | **MISSING** — no dedicated component; batch standing info is inline in SubjectDeepDive header but not the visual horizontal bar from Phase 1 |

## Phase 3 — Exam Performance History

| Component | Status |
|-----------|--------|
| `ExamHistoryTimeline` | DONE — chronological list, color-coded, score/avg/top, rank |
| `ExamTrendChart` | DONE — Recharts line chart with class average dashed line |
| `PerExamStandingCard` | **MISSING** — no component for selected-exam detail (score, rank, percentile, distance from avg/top) |

## Phase 4 — Chapter and Topic Drill-Down

| Component | Status |
|-----------|--------|
| `ChapterDetailSheet` | DONE — bottom sheet, topic list with accuracy bars, question count |
| `TopicTrendMini` | **MISSING** — no sparkline per topic |

## Phase 5 — Behavioral Insights

| Component | Status | Notes |
|-----------|--------|-------|
| `InsightBanner` | DONE | Summary, strengths, priorities |
| `SecondaryTagsPills` | DONE | All 6 tags with tooltips |
| `StreakCalendar` | PARTIAL — **still uses mock data** | Props are hardcoded dates in Progress.tsx (lines 33-37) |
| `AchievementBadges` | PARTIAL — **still uses mock data** | Hardcoded achievements (lines 39-48), not derived from real metrics |
| `WeeklyActivityChart` | PARTIAL — **still uses mock data** | Hardcoded weekly minutes (lines 50-58) |

## Phase 6 — Responsive Polish

| Item | Status |
|------|--------|
| Tab navigation (scrollable pills) | DONE |
| 320px audit | **NOT DONE** — no evidence of audit pass |
| Swipe gestures between tabs | **NOT DONE** |
| Loading skeletons | **NOT DONE** — no skeleton variants |
| Lazy loading (Phase 2-4 components) | **NOT DONE** — all imports are eager |

## Old placeholder components

| File | Status |
|------|--------|
| `OverallProgressCard.tsx` | Still exists on disk but **not imported** — safe, but should be deleted |
| `SubjectProgressList.tsx` | Still exists on disk but **not imported** — should be deleted |

---

## What needs to be built

### Missing components (3)
1. **`SubjectBatchStanding.tsx`** — visual horizontal bar (like BatchStandingCard) scoped to one subject, showing "In Physics, you rank #X of Y" with avg/top markers
2. **`PerExamStandingCard.tsx`** — when an exam is selected in ExamHistoryTimeline: score, rank, percentile, delta from average, delta from top
3. **`TopicTrendMini.tsx`** — small sparkline per topic in ChapterDetailSheet (if data permits — current data has single-point accuracy, so this may need to be deferred or shown as a static indicator)

### Rewire Phase 5 components (3)
4. **StreakCalendar** — derive `activeDays` and `currentStreak`/`longestStreak` from real data in `progressData.ts` (or at minimum from exam dates)
5. **AchievementBadges** — derive unlock status from real metrics (consistency > 80 = "Consistency King", rank === 1 = "Champion", etc.)
6. **WeeklyActivityChart** — wire to real study/exam activity data

### Phase 6 polish (4)
7. **320px responsive audit** — ensure no overflow at 320px width on every card
8. **Swipe gestures** — add horizontal swipe between tabs on mobile (e.g., `framer-motion` drag or a swipeable container)
9. **Loading skeletons** — skeleton variants matching each card shape
10. **Lazy loading** — `React.lazy()` for SubjectDeepDive, ChapterDetailSheet, ExamHistoryTimeline, ExamTrendChart

### Cleanup (2)
11. Delete `OverallProgressCard.tsx`
12. Delete `SubjectProgressList.tsx`

---

## Recommended implementation order

1. Create `SubjectBatchStanding`, `PerExamStandingCard` — missing cards
2. Rewire StreakCalendar, AchievementBadges, WeeklyActivityChart to real data
3. Add loading skeletons + lazy loading
4. Add swipe gestures
5. 320px responsive audit
6. Delete old placeholder files
7. `TopicTrendMini` — defer unless multi-exam topic data is available

Total: ~12 items remaining across Phases 2-6.

