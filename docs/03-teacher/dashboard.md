# Teacher Dashboard

> Today's classes, pending actions, and quick access to teaching tools.

---

## Overview

The Teacher Dashboard is the daily command center designed for classroom teachers. It displays today's schedule, pending teaching confirmations, upcoming tasks, and provides quick access to lesson planning and content creation tools.

## Access

- **Route**: `/teacher/dashboard`
- **Login Types**: Teacher
- **Permissions Required**: Teacher account (auto-granted)

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| PageHeader | Teacher name + date | Top |
| TodayTimetable | Today's classes | Main content |
| PendingBanner | Confirmation alerts | Top (amber) |
| AlertsWidget | Urgent notifications | Right sidebar |
| AIAssistant | Teaching help | Right sidebar |
| QuickActions | Common tasks | Bottom/Sidebar |

---

## Features & Functionality

### Today's Timetable

```text
Today's Classes - Monday, Jan 15

┌─────────────────────────────────────────────────────────────┐
│ Period 1 (8:00 - 8:45)          COMPLETED                   │
│ 10A - Physics - Motion                                      │
│ [View Plan] [Confirm Teaching]                              │
├─────────────────────────────────────────────────────────────┤
│ Period 3 (9:45 - 10:30)         LIVE NOW                    │
│ 10B - Physics - Force                                       │
│ [Present] [View Plan]                                       │
├─────────────────────────────────────────────────────────────┤
│ Period 5 (11:45 - 12:30)        UPCOMING                    │
│ 11A - Physics - Thermodynamics                              │
│ [Add Plan] [View Details]                                   │
└─────────────────────────────────────────────────────────────┘
```

### Class Status Indicators

| Status | Visual | Actions |
|--------|--------|---------|
| Completed | Gray + checkmark | Confirm, View |
| Live Now | Green pulse | Present, View |
| Upcoming | Default | Add Plan, View |
| No Plan | Amber warning | Add Plan |

### Pending Confirmations Banner

```text
┌─────────────────────────────────────────────────────────────┐
│ ⚠️ 3 Pending Confirmations                                  │
│ You have classes from the past week that need confirmation  │
│ [Bulk Confirm] [View All]                                   │
└─────────────────────────────────────────────────────────────┘
```

### Alerts & Tasks Widget

Limited to 3 most urgent items:
- Substitution requests
- Pending homework reviews
- Syllabus update notifications

### AI Teaching Assistant

Quick access to AI features:
- Generate quiz questions
- Create lesson content
- Get teaching suggestions

---

## Data Flow

```text
Sources:
├── Timetable (today's classes)
├── Lesson Plans (plan status)
├── Teaching Confirmations (pending)
├── Notifications (alerts)
└── Homework (pending reviews)
         │
         ▼
Dashboard:
└── Aggregates and prioritizes
```

---

## Cross-Login Connections

| Dashboard Element | Source | What It Shows |
|-------------------|--------|---------------|
| Today's classes | Institute Timetable | Scheduled periods |
| Lesson plan status | Own lesson plans | Ready/Draft/None |
| Pending confirmations | Academic Progress | Unconfirmed classes |
| Alerts | Institute notifications | Schedule changes |

---

## Business Rules

1. **Demo mode** ensures 5-6 visible classes for testing
2. **Past classes** show "Confirm" button if unconfirmed
3. **Live class** highlighted with pulse animation
4. **Confirmation reminder** settings on Notifications page
5. **Quick actions** respect teacher's subject scope

---

## Mobile Behavior

- Classes: Vertical swipeable cards
- Banner: Full-width, sticky
- Sidebar: Moves to bottom tabs
- Quick actions: FAB menu
- Touch targets: 44px minimum

---

## Related Documentation

- [Schedule](./schedule.md)
- [Lesson Plans](./lesson-plans.md)
- [Academic Progress](./academic-progress.md)
- [Teacher Smoke Tests](../06-testing-scenarios/smoke-tests/teacher.md)

---

*Last Updated: January 2025*
