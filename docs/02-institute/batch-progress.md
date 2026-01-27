# Batch Progress (Syllabus Tracker)

> Track syllabus completion, drift, and teaching confirmation status.

---

## Overview

The Batch Progress page (Syllabus Tracker) is a consolidated dashboard for monitoring academic progress across batches. It integrates yearly plans, subject progress tracking, pending confirmations, and drift management into a single view.

## Access

- **Route**: `/institute/academic-schedule`
- **Login Types**: Institute Admin
- **Permissions Required**: `academicSchedule.view`

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| PageHeader | Title + batch selector | Top |
| BatchProgressHeader | Batch summary stats | Top section |
| SubjectProgressSection | Subject-wise progress | Main content |
| ChapterTimelineGrid | Visual chapter timeline | Per subject |
| LostDaysBreakdown | Missed class analysis | Expandable |
| ChapterDetailSheet | Chapter deep-dive | Drawer/Dialog |
| DriftSummarySheet | Cross-batch drift issues | Drawer/Dialog |

---

## Features & Functionality

### Consolidated Batch View

```text
Batch 10A - Academic Progress
┌─────────────────────────────────────────────────────────────┐
│ Overall Progress: 65%        On Track: 3/5 subjects         │
│ Critical Drift: 1            Lost Days: 8                   │
└─────────────────────────────────────────────────────────────┘

Physics (Dr. Kumar)
├── Progress: 68% ████████░░░░
├── Current Chapter: Force and Laws of Motion
├── Lost Days: 3 (Teacher Absence: 2, Holiday: 1)
├── Drift: +2h (Amber)
└── [View Details]

Chemistry (Mrs. Singh)
├── Progress: 72% █████████░░░
├── Current Chapter: Chemical Bonding
├── Lost Days: 1
├── Drift: On Track ✓
└── [View Details]
```

### Subject Progress Section

| Element | Description |
|---------|-------------|
| Progress Bar | Visual completion |
| Completion % | Numeric progress |
| Current Chapter | Active chapter |
| Lost Days | Missed classes count |
| Teacher Name | Assigned teacher |
| Drift Indicator | Variance status |

### Chapter Timeline Grid

```text
Physics Chapters - 10A

│ Jan Week 1 │ Jan Week 2 │ Jan Week 3 │ Jan Week 4 │
├────────────┼────────────┼────────────┼────────────┤
│████ Motion ████████│███ Force ████████   +2h   │
                     │ (Edited)  ─ ─ ─ ─│
```

### Drift Indicators

| Indicator | Color | Meaning |
|-----------|-------|---------|
| On Track | Green | No variance |
| +1-2h | Amber | Minor delay |
| +3h+ | Red | Critical delay |
| -1h+ | Blue | Ahead of schedule |

### Drift Cause Analysis

| Cause | Description |
|-------|-------------|
| `extended_teaching` | Chapter took longer than planned |
| `teacher_absence` | Teacher was absent |
| `other_absence` | Other reasons (events, etc.) |
| `behind_schedule` | General delay |

### Lost Days Breakdown

```text
Physics - Lost Days Analysis
├── Teacher Absence: 2 days
│   • Jan 8 (Dr. Kumar - Sick)
│   • Jan 15 (Dr. Kumar - Training)
├── Other: 1 day
│   • Jan 20 (School Event)
└── Total: 3 days (6 periods)
```

### Chapter Detail Sheet

```text
Chapter: Force and Laws of Motion
┌─────────────────────────────────────────────────────────────┐
│ Planned Hours: 15        Actual Hours: 17                   │
│ Planned Weeks: 4         Actual Weeks: 4.5                  │
│ Status: In Progress      Drift: +2h                         │
├─────────────────────────────────────────────────────────────┤
│ Topics:                                                      │
│ ✓ Newton's First Law (3h)                                   │
│ ✓ Newton's Second Law (4h)                                  │
│ ○ Newton's Third Law (3h) - In Progress                     │
│ ○ Friction (5h) - Pending                                   │
├─────────────────────────────────────────────────────────────┤
│ Teacher: Dr. Rajesh Kumar                                   │
│ Last Confirmation: Jan 18 - Newton's Second Law             │
└─────────────────────────────────────────────────────────────┘
```

### Drift Summary Dashboard

Accessible via "Drift Issues" stat card:

```text
Institute Drift Summary
┌─────────────────────────────────────────────────────────────┐
│ 5 Critical Issues Across 3 Batches                          │
├─────────────────────────────────────────────────────────────┤
│ 10A - Physics: Force (+4h) - Critical                       │
│ 10B - Chemistry: Atoms (+3h) - Critical                     │
│ 11A - Mathematics: Calculus (+5h) - Critical                │
└─────────────────────────────────────────────────────────────┘
[Open Adjustment for each]
```

---

## Data Flow

```text
Sources:
├── Academic Planner (planned schedule)
├── Teaching Confirmations (actual progress)
├── Substitution (absences)
├── Holidays (blocked days)
         │
         ▼
Calculation:
├── Compare planned vs actual hours
├── Calculate drift per chapter
├── Aggregate lost days by cause
├── Determine teacher attribution
         │
         ▼
Display:
├── Progress bars
├── Timeline visualization
├── Drift indicators
└── Lost days breakdown
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Teacher Confirmations | Progress Update | Upstream | Feeds completion data |
| Academic Planner | Target Setting | Upstream | Provides planned hours |
| Substitution | Lost Days | Upstream | Tracks teacher absences |
| Drift Issues | Schedule Adjustment | Local | Enables correction |

---

## Business Rules

1. **Progress calculated** from teaching confirmations
2. **Drift = Actual - Planned** hours
3. **Lost days attributed** to primary cause
4. **Teacher attribution** tracks who taught each chapter
5. **Critical drift threshold** = 3+ hours behind
6. **Timeline updates** as confirmations come in
7. **Historical data** preserved for analysis

---

## Mobile Behavior

- Subject cards: Vertical stack
- Timeline: Horizontal scroll
- Progress bars: Full-width
- Detail sheet: Bottom drawer
- Drift summary: Full-screen on mobile

### Mobile Height Constraints

Chapter detail sheet has fixed height with internal scroll:
- `max-h-[60vh]` on mobile
- Ensures chapter list scrollable

---

## Related Documentation

- [Academic Setup](./academic-schedule-setup.md)
- [Academic Planner](./academic-planner.md)
- [Teacher Academic Progress](../03-teacher/academic-progress.md)
- [Academic Schedule Flow](../05-cross-login-flows/academic-schedule-flow.md)
- [Institute Smoke Tests](../06-testing-scenarios/smoke-tests/institute.md)

---

*Last Updated: January 2025*
