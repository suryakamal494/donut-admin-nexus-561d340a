# Timetable Substitution

> Manage teacher absences and assign replacement teachers.

---

## Overview

The Substitution module handles teacher absences by facilitating temporary replacement assignments. It provides a calendar-based workflow for marking absences and assigning substitute teachers while maintaining schedule integrity.

## Access

- **Route**: `/institute/timetable/substitution`
- **Login Types**: Institute Admin
- **Permissions Required**: `timetable.edit`

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| PageHeader | Title + date selector | Top |
| CalendarView | Month/week absence calendar | Left panel |
| AbsenceList | Day's absences | Center panel |
| SubstitutePicker | Available replacements | Right panel |
| AbsenceDialog | Mark absence form | Dialog |
| SubstitutionSummary | Day's assignments | Bottom |

---

## Features & Functionality

### Mark Teacher Absence

1. Select date on calendar
2. Click "Mark Absence" or click teacher
3. **Absence Details**
   - Select teacher
   - Select date range (single or multiple days)
   - Reason (Sick, Personal, Training, Other)
   - Full day or specific periods
4. Save

### Absence Display

```text
January 15, 2025 - Absences
┌─────────────────────────────────────────────────┐
│ 🔴 Dr. Rajesh Kumar                             │
│    Sick Leave - Full Day                        │
│    Affected: 10A (P1, P3, P5), 10B (P2, P4)    │
│    Status: 2/5 slots substituted               │
│    [Assign Substitutes]                         │
├─────────────────────────────────────────────────┤
│ 🟡 Mrs. Priya Singh                             │
│    Training - Periods 1-4 only                  │
│    Affected: 10A (P2), 11A (P1, P3, P4)        │
│    Status: All substituted ✓                   │
└─────────────────────────────────────────────────┘
```

### Assign Substitute

1. Click "Assign Substitutes" on absence
2. For each affected slot:
   - See available teachers (free in that period)
   - Filter by subject (if needed)
   - Select substitute
   - Or mark as "Free Period" / "Self Study"
3. Save assignments

### Substitute Selection

```text
Period 1: 10A - Physics (Dr. Kumar absent)
Available Substitutes:
├── Mr. Patel - Physics (Free, Same Subject) ✓ Recommended
├── Dr. Rao - Chemistry (Free, Different Subject)
├── Ms. Joshi - Mathematics (Free, Different Subject)
└── [Mark as Self Study]
```

### Substitution Status

| Status | Color | Meaning |
|--------|-------|---------|
| Unassigned | Red | No substitute yet |
| Partially Assigned | Yellow | Some slots filled |
| Fully Assigned | Green | All slots covered |

### Calendar View

```text
January 2025
┌─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│ Sun │ Mon │ Tue │ Wed │ Thu │ Fri │ Sat │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│     │     │     │  1  │  2  │  3  │  4  │
│     │     │     │     │     │     │     │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│  5  │  6  │  7  │  8  │  9  │ 10  │ 11  │
│     │     │     │     │     │     │     │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│ 12  │ 13  │ 14  │ 🔴  │ 🟡  │ 17  │ 18  │
│     │     │     │ 15  │ 16  │     │     │
└─────┴─────┴─────┴─────┴─────┴─────┴─────┘

🔴 = Unassigned absences   🟡 = Partially assigned
```

---

## Data Flow

```text
Source: Regular timetable
         │
         ▼
Substitution:
├── Mark absence → Creates absence record
├── Find affected slots → From timetable
├── Find available teachers → Free in period
├── Assign substitutes → Creates temp entries
         │
         ▼
Downstream:
├── Teacher Schedule (shows substitution duty)
├── Student Schedule (shows substitute teacher)
└── Notification (alerts involved teachers)
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Mark Absence | Teacher Schedule | Downstream | Removes original classes |
| Assign Substitute | Substitute's Schedule | Downstream | Adds substitution |
| Assign Substitute | Student Schedule | Downstream | Shows substitute name |
| Mark Absence | Notifications | Downstream | Alerts absent teacher |
| Assign Substitute | Notifications | Downstream | Alerts substitute |

---

## Business Rules

1. **Only future dates** can have absences marked
2. **Substitute must be free** in that period
3. **Same subject preferred** but not required
4. **Teacher load limits** apply to substitutes
5. **Notification sent** to both absent and substitute teachers
6. **Historical absences** visible but not editable
7. **Recurring absences** supported for planned leave

---

## Notification Flow

```text
When absence marked:
├── Absent Teacher: "Your absence recorded for [date]"
└── Admin: "Substitution pending for [teacher]"

When substitute assigned:
├── Substitute: "You have a substitution duty: [details]"
├── Absent Teacher: "[Substitute] will cover your classes"
└── Admin: "Substitution assigned successfully"
```

---

## Mobile Behavior

- Calendar: Month view with swipe navigation
- Absence list: Card view with swipe actions
- Substitute picker: Bottom sheet with search
- Multi-day selection: Long-press + drag
- Quick actions: Floating action button

---

## Related Documentation

- [Timetable Workspace](./timetable-workspace.md)
- [Teacher Schedule](../03-teacher/schedule.md)
- [Timetable Flow](../05-cross-login-flows/timetable-flow.md)
- [Institute Smoke Tests](../06-testing-scenarios/smoke-tests/institute.md)

---

*Last Updated: January 2025*
