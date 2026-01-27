# Teacher Notifications

> Alert system for schedule changes, tasks, and reminders.

---

## Overview

The Teacher Notifications system provides categorized alerts for schedule changes, substitution requests, pending tasks, and system updates. It includes push notification support and configurable reminder settings for teaching confirmations.

## Access

- **Route**: `/teacher/notifications`
- **Login Types**: Teacher
- **Permissions Required**: Teacher account

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| PageHeader | Title + mark all read | Top |
| CategoryTabs | Filter by category | Below header |
| NotificationList | Alert cards | Main content |
| NotificationCard | Individual alert | Within list |
| SettingsSection | Preferences | Bottom section |
| ReminderSettings | Confirmation reminders | Within settings |

---

## Features & Functionality

### Notification Categories

| Category | Icon | Examples |
|----------|------|----------|
| **Schedule** | 📅 | Timetable changes, substitutions |
| **Academic** | 📚 | Pending confirmations, plan updates |
| **Communication** | 💬 | Messages from institute |
| **System** | ⚙️ | App updates, maintenance |

### Notification Card

```text
┌─────────────────────────────────────────────────────────────┐
│ 📅 Schedule Change                        🔴 2 hours ago   │
├─────────────────────────────────────────────────────────────┤
│ Your Period 3 class on Jan 25 has been moved to Period 5   │
│ due to school assembly.                                     │
│                                                              │
│ [View Schedule] [Dismiss]                                   │
└─────────────────────────────────────────────────────────────┘
```

### Priority Levels

| Priority | Visual | Examples |
|----------|--------|----------|
| Urgent | Red dot + badge | Substitution request |
| High | Amber dot | Pending confirmations |
| Medium | Blue dot | Schedule changes |
| Low | No dot | System updates |

### Notification Actions

| Action | Description |
|--------|-------------|
| View Details | Opens related page |
| Dismiss | Removes from list |
| Mark as Read | Removes indicator |

### Confirmation Reminder Settings

Located within settings section:

```text
Teaching Confirmation Reminders
┌─────────────────────────────────────────────────────────────┐
│ Get reminded about pending teaching confirmations           │
│                                                              │
│ ☑ End of school day (3:30 PM)                              │
│ ☑ Next morning (7:30 AM)                                   │
│                                                              │
│ Push Notifications: [Enabled ▼]                             │
└─────────────────────────────────────────────────────────────┘
```

### Push Notification Preferences

```text
Push Notification Settings
┌─────────────────────────────────────────────────────────────┐
│ Enable push notifications for:                              │
│                                                              │
│ Schedule Changes         [●]                                │
│ Substitution Requests    [●]                                │
│ Academic Updates         [●]                                │
│ Confirmation Reminders   [●]                                │
│ System Updates           [○]                                │
│                                                              │
│ Status: ✓ Push enabled on this device                       │
└─────────────────────────────────────────────────────────────┘
```

### Unread Badge

Header notification icon shows:
- Unread count badge
- Color indicates highest priority
- Preview of latest notification

---

## Data Flow

```text
Sources:
├── Institute (schedule changes, messages)
├── System (confirmations, reminders)
├── Substitution (requests)
└── Academic Plan (updates)
         │
         ▼
Storage:
├── notifications[]
├── read status
└── preferences
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
| Schedule Changes | Institute Timetable | Upstream | Triggered by changes |
| Substitution | Institute | Upstream | Request notifications |
| Confirmations | Academic Progress | Local | Reminder triggers |

---

## Business Rules

1. **Notifications persist** until dismissed or 30 days
2. **Urgent notifications** cannot be auto-dismissed
3. **Push requires** browser permission
4. **Reminders respect** configured times
5. **Mark all read** applies to current category
6. **Preferences persist** across sessions

---

## Mobile Behavior

- Category tabs: Horizontal scroll
- Notification cards: Full-width, swipe to dismiss
- Settings: Accordion sections
- Push toggle: Native switch
- Priority badge: Corner indicator

---

## Related Documentation

- [Dashboard](./dashboard.md)
- [Academic Progress](./academic-progress.md)
- [Schedule](./schedule.md)
- [Teacher Smoke Tests](../06-testing-scenarios/smoke-tests/teacher.md)

---

*Last Updated: January 2025*
