# Student Notifications

> Alerts for homework, tests, and content updates.

---

## Overview

The Student Notifications page displays alerts for homework deadlines, upcoming tests, new content availability, and achievement notifications. Designed for quick scanning with priority-based organization.

## Access

- **Route**: `/student/notifications`
- **Login Types**: Student
- **Permissions Required**: Student account

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| NotificationHeader | Title + unread count | Top |
| FilterTabs | Category filters | Below header |
| NotificationList | Alert cards | Main content |
| NotificationCard | Individual alert | Within list |
| QuickActions | Mark read, dismiss | Per card |

---

## Features & Functionality

### Notification Categories

| Category | Icon | Examples |
|----------|------|----------|
| **Homework** | 📚 | Deadlines, new assignments |
| **Tests** | 📝 | Upcoming, results available |
| **Content** | 📖 | New lessons, materials |
| **Achievements** | 🏆 | Badges, streaks |

### Notification Card

```text
┌─────────────────────────────────────────────────────────────┐
│ 📚 Homework Due Tomorrow                    🔴 5 hours ago │
├─────────────────────────────────────────────────────────────┤
│ Motion Worksheet is due tomorrow at 11:59 PM                │
│ Physics • Laws of Motion                                    │
│                                                              │
│ [Open Homework] [Dismiss]                                   │
└─────────────────────────────────────────────────────────────┘
```

### Priority Indicators

| Priority | Visual | Examples |
|----------|--------|----------|
| Urgent | 🔴 Red dot | Due today |
| High | 🟠 Orange dot | Due tomorrow |
| Medium | 🔵 Blue dot | This week |
| Low | No dot | Informational |

### Notification Types

**Homework Notifications:**
- New assignment
- Deadline reminder (24h, 1h)
- Graded feedback available

**Test Notifications:**
- New test assigned
- Upcoming test reminder
- Results available

**Content Notifications:**
- New lesson available
- Content recommended
- Updated materials

**Achievement Notifications:**
- Badge earned
- Streak milestone
- Leaderboard position

### Actions

| Action | Description |
|--------|-------------|
| Open | Navigate to related item |
| Dismiss | Remove from list |
| Mark as Read | Clear indicator |

### Header Badge

Unread count in app header:
```text
🔔 (3)
```

---

## Data Flow

```text
Sources:
├── Homework assignments
├── Test schedules
├── Content updates
├── Achievement system
         │
         ▼
Notification System:
├── Generate alerts
├── Set priority
├── Schedule reminders
         │
         ▼
Display:
├── Categorized list
├── Priority sorting
└── Unread indicators
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Homework | Teacher Assignments | Upstream | Triggers notifications |
| Tests | Teacher Exams | Upstream | Triggers notifications |
| Content | Lesson Plans | Upstream | Triggers notifications |

---

## Business Rules

1. **Deadline reminders** at 24h and 1h before
2. **Test reminders** at 24h before
3. **Persist until dismissed** or 7 days
4. **Priority auto-calculated** from due date
5. **Max display** = 50 notifications
6. **Mark all read** per category

---

## Mobile Behavior

- List: Full-width cards
- Swipe: Left to dismiss
- Tap: Opens related content
- Tabs: Horizontal scroll
- Badge: Header icon

---

## Related Documentation

- [Dashboard](./dashboard.md)
- [Homework](./homework.md)
- [Test Player](./test-player.md)
- [Student Smoke Tests](../06-testing-scenarios/smoke-tests/student.md)

---

*Last Updated: January 2025*
