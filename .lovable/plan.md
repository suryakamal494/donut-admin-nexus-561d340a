

# Documentation: Student Progress & Analytics Module

## Summary

Create a detailed developer-facing documentation file for the Student Progress page (`/student/progress`). This will be a comprehensive reference covering all 4 tabs, every card/component, the data each one needs, and how they connect. Phased by tab for readability.

## Output

A single markdown file: `docs/04-student/progress-developer-guide.md`

This will be a long, structured document (~2500-3000 lines) organized into these sections:

### Document Structure

1. **Module Overview** — Route, page layout, tab architecture, lazy loading strategy
2. **Data Layer** — `progressData.ts` adapter functions, types, caching, and upstream data sources
3. **Phase 1: Overview Tab** — Each card documented individually:
   - ProgressHeroCard (PI gauge, accuracy, consistency, trend, rank)
   - BatchStandingCard (visual bar with Avg/Top markers, delta stats)
   - SubjectOverviewGrid (compact mode — icon, name, accuracy only)
   - ExamTrendChart (line chart: your score vs class avg, range selector)
   - WeeklyActivityChart (bar chart: daily minutes, total/avg stats)
4. **Phase 2: Subjects Tab** — Two states documented:
   - SubjectOverviewGrid (detailed mode — trend, chapter bar, weak count)
   - SubjectDeepDive (drill-down view):
     - Header with rank bar and 5-column stats
     - WeakTopicsAlert (red-gradient alert with focus topics)
     - ChapterMasteryList (sorted weakest-first, status dots, progress bars)
     - DifficultyBreakdown (Easy/Medium/Hard accuracy bars)
     - ChapterDetailSheet (bottom sheet with topic-level detail)
5. **Phase 3: Exams Tab** — Two-column layout:
   - ExamHistoryTimeline (date-sorted list, comparison bars, show-more)
   - PerExamStandingCard (auto-selected latest exam, score/rank/percentile, vs-avg/vs-top bars)
   - ExamTrendChart (reused from Overview)
6. **Phase 4: Insights Tab** — AI-driven analytics:
   - InsightBanner (AI summary, strengths, priorities)
   - StreakCalendar (current/longest streak, monthly grid)
   - SubjectRadarChart (Recharts radar, strongest/weakest callout)
   - WeeklyActivityChart (reused from Overview)
7. **Shared Components** — SecondaryTagsPills (behavior tags with tooltips)
8. **Cross-Tab Interactions** — How selecting a subject in Overview navigates to Subjects tab, how exam auto-selection works
9. **Responsive Behavior** — Mobile grid rules, touch targets, scroll behaviors per component

### Per-Component Documentation Format

Each component section will include:
- **Purpose** — What it tells the student
- **Props / Interface** — TypeScript interface with field descriptions
- **Data Source** — Which `progressData.ts` function and what upstream data
- **Visual Layout** — ASCII diagram of the card structure
- **Color Logic** — Conditional color rules (e.g., accuracy >= 75 = emerald, >= 50 = blue)
- **Interactions** — Click/tap behaviors, navigation targets
- **Mobile Behavior** — Grid columns, touch targets, truncation rules

## Files Changed

| File | Change |
|------|--------|
| `docs/04-student/progress-developer-guide.md` | New — Complete developer reference for the Progress module |
| `docs/04-student/progress.md` | Add link to the new developer guide at the bottom |

