# Progress & Analytics

> Personal learning analytics and progress tracking.

---

## Overview

The Progress page provides comprehensive analytics on the student's learning journey, including subject-wise progress, test performance trends, study streaks, and time analytics. It helps students understand their strengths and areas for improvement.

## Access

- **Route**: `/student/progress`
- **Login Types**: Student
- **Permissions Required**: Student account

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| ProgressHeader | Overall stats | Top |
| SubjectProgress | Per-subject breakdown | Main content |
| PerformanceChart | Test score trends | Charts section |
| StreakWidget | Study consistency | Sidebar/Section |
| TimeAnalytics | Study time stats | Bottom section |

---

## Features & Functionality

### Overall Stats

```text
┌─────────────────────────────────────────────────────────────┐
│ Your Progress Overview                                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐          │
│ │    68%       │ │    85%       │ │    🔥 15     │          │
│ │   Overall    │ │  Avg Score   │ │  Day Streak  │          │
│ │  Completion  │ │  in Tests    │ │              │          │
│ └──────────────┘ └──────────────┘ └──────────────┘          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Subject Progress Cards

```text
Physics
┌─────────────────────────────────────────────────────────────┐
│ Progress: 68% ████████████████░░░░░░░░                      │
│                                                              │
│ Chapters:                                                   │
│ ✓ Motion (100%)                                             │
│ ◐ Laws of Motion (75%)                                      │
│ ○ Gravitation (40%)                                         │
│ ○ Work & Energy (0%)                                        │
│                                                              │
│ Test Average: 78%  │  Content Completed: 24/35             │
│                                                              │
│ [View Details]                                              │
└─────────────────────────────────────────────────────────────┘
```

### Performance Charts

```text
Test Score Trend
┌─────────────────────────────────────────────────────────────┐
│ 100 │                                    ●                  │
│  90 │                          ●    ●                       │
│  80 │              ●     ●                                  │
│  70 │    ●    ●                                             │
│  60 │                                                       │
│     └────────────────────────────────────────────────       │
│       Jan    Feb    Mar    Apr    May    Jun                │
│                                                              │
│ Average: 82%  │  Trend: +12% from start                    │
└─────────────────────────────────────────────────────────────┘
```

### Chapter-wise Performance

```text
Chapter Performance - Physics
┌─────────────────────────────────────────────────────────────┐
│ Motion              ████████████████████  95% 🌟            │
│ Laws of Motion      █████████████████░░░  82%               │
│ Gravitation         ████████████░░░░░░░░  65% ⚠️            │
│ Work & Energy       █████░░░░░░░░░░░░░░░  45% ❗            │
└─────────────────────────────────────────────────────────────┘
```

### Study Streak

```text
┌─────────────────────────────────────────────────────────────┐
│ 🔥 15 Day Streak!                                           │
│                                                              │
│ This Week:                                                  │
│ M  T  W  T  F  S  S                                        │
│ ●  ●  ●  ●  ●  ◐  ○                                        │
│                                                              │
│ Keep it up! Study today to maintain your streak.            │
└─────────────────────────────────────────────────────────────┘
```

### Time Analytics

```text
Time Spent Learning
┌─────────────────────────────────────────────────────────────┐
│ This Week: 12h 45m                                          │
│ Last Week: 10h 30m (+21%)                                   │
│                                                              │
│ By Subject:                                                 │
│ Physics      ████████████░░  4h 30m                        │
│ Chemistry    ██████████░░░░  3h 15m                        │
│ Mathematics  ████████░░░░░░  3h 00m                        │
│ Biology      ████░░░░░░░░░░  2h 00m                        │
│                                                              │
│ Peak Study Time: 4-6 PM                                     │
└─────────────────────────────────────────────────────────────┘
```

### Achievements

```text
Earned Badges
┌─────────────────────────────────────────────────────────────┐
│ 🔥 15-Day Streak  │  ⚡ Speed Demon  │  🎯 Perfect Score   │
│ 📚 Bookworm       │  🌟 Top 10%      │  🔓 3 more locked   │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow

```text
Sources:
├── Content completion
├── Test/quiz results
├── Time tracking
├── Streak data
└── Badge achievements
         │
         ▼
Analytics:
├── Aggregate by subject
├── Calculate trends
├── Generate recommendations
         │
         ▼
Display:
├── Visual progress bars
├── Trend charts
└── Achievement badges
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Content Completion | Content Viewer | Upstream | Tracks completion |
| Test Scores | Test Player | Upstream | Records scores |
| Recommendations | My Path | Downstream | Feeds suggestions |

---

## Business Rules

1. **Progress = completed / total** content
2. **Streak breaks** at midnight if no study
3. **Time tracked** from content viewer
4. **Badges permanent** once earned
5. **Trends calculated** over 30 days
6. **Peak time** based on usage patterns

---

## Mobile Behavior

- Stats cards: 2-column grid
- Charts: Horizontal scroll
- Subject cards: Expandable
- Streak calendar: Compact view
- Touch targets: 44px minimum

---

## Related Documentation

- [Dashboard](./dashboard.md)
- [My Path Mode](./mypath-mode.md)
- [Test Results](./test-results.md)
- [Student Smoke Tests](../06-testing-scenarios/smoke-tests/student.md)

---

*Last Updated: January 2025*
