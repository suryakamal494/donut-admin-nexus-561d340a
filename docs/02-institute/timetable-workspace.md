# Timetable Workspace

> Create and edit class schedules with conflict detection and drag-drop assignment.

---

## Overview

The Timetable Workspace is the interactive scheduling interface where institute administrators assign teachers to periods. It supports two views (Teacher-First and Batch-First), drag-and-drop assignment, real-time conflict detection, and intelligent copy features.

## Access

- **Route**: `/institute/timetable/workspace`
- **Login Types**: Institute Admin
- **Permissions Required**: `timetable.create`, `timetable.edit`

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| PageHeader | Title + view toggle + actions | Top |
| ViewToggle | Teacher-First / Batch-First | Header |
| WeekSelector | Week navigation | Below header |
| ScheduleGrid | Main timetable grid | Main content |
| ConflictPanel | Conflict warnings | Sidebar/Bottom |
| TeacherPicker | Available teachers | Click-to-assign |
| CopyWeekDialog | Week copy options | Dialog |

---

## Features & Functionality

### View Modes

**Teacher-First View**
- Row: Days of week
- Columns: Periods
- Shows one teacher's schedule
- Switch between teachers

**Batch-First View**
- Row: Days of week
- Columns: Periods
- Shows one batch's schedule
- Switch between batches

### Grid Display

```text
Batch 10A - Week of Jan 15, 2025
┌──────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
│          │   P1    │   P2    │  Break  │   P3    │   P4    │   P5    │
├──────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ Monday   │ Physics │Chemistry│   🍴    │  Maths  │ English │ Physics │
│          │Dr.Kumar │Mrs.Singh│         │Mr.Sharma│Ms.Gupta │Dr.Kumar │
├──────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ Tuesday  │Chemistry│ Physics │   🍴    │ English │  Maths  │   Lab   │
│          │Mrs.Singh│Dr.Kumar │         │Ms.Gupta │Mr.Sharma│Dr.Kumar │
├──────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ Wed      │   🔒    │   🔒    │   🔒    │   🔒    │   🔒    │   🔒    │
│          │ Holiday │ Holiday │ Holiday │ Holiday │ Holiday │ Holiday │
└──────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
```

### Slot States

| State | Visual | Meaning |
|-------|--------|---------|
| Assigned | Subject + Teacher | Normal slot |
| Empty | "+" icon | Unassigned |
| Break | 🍴 icon | Break period |
| Holiday | 🔒 Red/Amber | Blocked by holiday |
| Exam Block | 🔒 with name | Blocked by exam |
| Conflict | ⚠️ Red border | Scheduling conflict |

### Assignment Methods

**Method 1: Click-to-Assign**
1. Click empty slot
2. Select subject from dropdown
3. Select teacher from filtered list
4. Confirm

**Method 2: Drag-and-Drop**
1. Drag from teacher sidebar
2. Drop on empty slot
3. Auto-assigns teacher's subject

### Conflict Detection

| Conflict Type | Display | Cause |
|---------------|---------|-------|
| **Teacher Clash** | Red border | Same teacher, same period, different batches |
| **Overload** | Amber warning | Exceeds daily/consecutive limits |
| **Missing** | Yellow | Required slots not filled |

### Conflict Panel

```text
⚠️ 2 Conflicts Detected

1. Teacher Clash
   Dr. Kumar assigned to both 10A and 10B
   Monday, Period 1
   [Resolve]

2. Overload Warning
   Mr. Sharma exceeds 6 periods on Tuesday
   [View]
```

### Copy Week Feature

| Option | Description |
|--------|-------------|
| Copy to Next Week | Duplicates schedule |
| Skip Holidays | Doesn't copy to holidays |
| Skip Exam Days | Doesn't copy to exam blocks |
| Copy Specific Days | Select which days |

---

## Data Flow

```text
Source: Setup configuration
         ├── Periods, Breaks
         ├── Holidays
         ├── Exam Blocks
         └── Teacher Load
         │
         ▼
Workspace:
├── Display grid based on config
├── Apply blocking rules
├── Check conflicts on assignment
└── Save schedule entries
         │
         ▼
Downstream:
├── View Timetable (read-only)
├── Teacher Schedule
├── Student Schedule
└── Substitution (for absences)
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Schedule Creation | Teacher Portal | Downstream | Populates My Schedule |
| Schedule Creation | Student Portal | Downstream | Shows classes |
| Schedule Creation | Lesson Plans | Downstream | Enables plan creation |
| Schedule Creation | Academic Progress | Downstream | Enables confirmation |

---

## Business Rules

1. **Slots blocked** by holidays/exams cannot be assigned
2. **Teacher must have subject expertise** for assignment
3. **Conflicts are warnings** - can proceed but highlighted
4. **Copy week** skips blocked dates automatically
5. **Changes auto-save** on modification
6. **Undo available** for recent changes
7. **Publish required** to make visible to teachers/students

### Course-Based Constraints

Teachers are filtered by batch assignment:
- Teacher can only be scheduled for batches in their `allowedBatches` list
- Batches are linked to courses (CBSE/JEE)
- Ensures academic integrity without UI complexity

---

## Mobile Behavior

- Grid: Horizontal scroll, pinch zoom
- Day view: Single day at a time on mobile
- Assignment: Bottom sheet picker
- Conflicts: Floating indicator
- Actions: Sticky bottom bar

---

## Keyboard Shortcuts (Desktop)

| Key | Action |
|-----|--------|
| ← → | Navigate periods |
| ↑ ↓ | Navigate days |
| Enter | Edit selected slot |
| Delete | Clear selected slot |
| Ctrl+C | Copy slot |
| Ctrl+V | Paste slot |

---

## Related Documentation

- [Timetable Setup](./timetable-setup.md)
- [Substitution](./timetable-substitution.md)
- [Teacher Schedule](../03-teacher/schedule.md)
- [Timetable Flow](../05-cross-login-flows/timetable-flow.md)
- [Institute Smoke Tests](../06-testing-scenarios/smoke-tests/institute.md)

---

*Last Updated: January 2025*
