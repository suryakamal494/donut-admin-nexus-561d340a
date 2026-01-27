# Timetable Setup

> Configure periods, breaks, holidays, and exam schedules for timetable creation.

---

## Overview

The Timetable Setup page is the configuration hub for all scheduling parameters. It defines the framework within which actual schedules are created, including period timing, breaks, holidays, teacher load limits, and exam blocks.

## Access

- **Route**: `/institute/timetable/setup`
- **Login Types**: Institute Admin
- **Permissions Required**: `timetable.view`, `timetable.edit`

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| PageHeader | Title + save action | Top |
| SetupTabs | Configuration categories | Below header |
| PeriodConfig | Period time slots | Periods tab |
| BreakConfig | Break definitions | Periods tab |
| HolidayCalendar | Holiday management | Holidays tab |
| TeacherLoadConfig | Load limits | Settings tab |
| ExamScheduleManager | Exam block management | Exams tab |

---

## Features & Functionality

### Tab Structure

| Tab | Purpose |
|-----|---------|
| **Periods** | Define period start/end times and breaks |
| **Holidays** | Manage holidays and non-working days |
| **Settings** | Teacher load limits, facilities |
| **Exam Schedule** | Block dates for examinations |

### Periods Configuration

```text
Period Configuration:
├── Period 1: 08:00 - 08:45
├── Period 2: 08:45 - 09:30
├── Break 1: 09:30 - 09:45 (Short Break)
├── Period 3: 09:45 - 10:30
├── Period 4: 10:30 - 11:15
├── Break 2: 11:15 - 11:45 (Lunch)
├── Period 5: 11:45 - 12:30
├── Period 6: 12:30 - 13:15
└── Period 7: 13:15 - 14:00
```

| Field | Description |
|-------|-------------|
| Period Number | Sequential identifier |
| Start Time | Period begins |
| End Time | Period ends |
| Duration | Auto-calculated |
| Type | Period / Break |

### Break Types

| Type | Typical Duration | Purpose |
|------|------------------|---------|
| Short Break | 10-15 min | Bathroom, water |
| Long Break | 20-30 min | Snack, rest |
| Lunch | 30-45 min | Meal time |

### Holiday Management

| Field | Description |
|-------|-------------|
| Date | Holiday date |
| Name | Holiday name |
| Type | National / Regional / Custom |
| Recurring | Annual repeat |
| Batches Affected | All or specific batches |

### Teacher Load Settings

| Setting | Description | Default |
|---------|-------------|---------|
| Max Periods/Day | Daily teaching limit | 6 |
| Max Consecutive | Back-to-back limit | 3 |
| Min Breaks | Required breaks | 1 |

### Exam Schedule (Consolidated)

The Exam Schedule functionality is integrated as a tab within Timetable Setup:

| Field | Description |
|-------|-------------|
| Exam Name | e.g., "Mid-Term Exams" |
| Start Date | First exam day |
| End Date | Last exam day |
| Affected Batches | Which batches |
| Block Type | No Classes / Modified Schedule |

---

## Data Flow

```text
Source: Institute creates configuration
         │
         ▼
Storage: timetableData.ts
         ├── periods[]
         ├── breaks[]
         ├── holidays[]
         ├── teacherLoad settings
         └── examBlocks[]
         │
         ▼
Downstream:
├── Timetable Workspace (uses periods)
├── isSlotBlocked() utility (holidays, exams)
├── Teacher Schedule (respects limits)
└── Academic Planning (working days calc)
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Period Config | Workspace | Local | Defines slots |
| Holidays | Workspace | Local | Blocks dates |
| Exam Blocks | Workspace | Local | Blocks dates |
| Holidays | Academic Planning | Local | Adjusts working days |
| Exam Blocks | Teacher Schedule | Downstream | Shows blocked |

---

## Business Rules

1. **Periods must be sequential** - no gaps
2. **End time > Start time** validation
3. **At least one break** required for full day
4. **Holidays cannot overlap** with exam blocks
5. **Teacher load** enforced in workspace
6. **Exam blocks** take priority over regular scheduling
7. **Changes require** timetable regeneration

---

## Time Mapping Toggle

| Setting | Display |
|---------|---------|
| Clock Times | "08:00 - 08:45" |
| Period Labels | "Period 1" |

---

## Mobile Behavior

- Tabs: Horizontal scroll
- Period list: Vertical cards
- Time picker: Native mobile picker
- Calendar: Month view with touch
- Settings: Accordion sections

---

## Related Documentation

- [Timetable Workspace](./timetable-workspace.md)
- [Substitution](./timetable-substitution.md)
- [Academic Planner](./academic-planner.md)
- [Timetable Flow](../05-cross-login-flows/timetable-flow.md)
- [Institute Smoke Tests](../06-testing-scenarios/smoke-tests/institute.md)

---

*Last Updated: January 2025*
