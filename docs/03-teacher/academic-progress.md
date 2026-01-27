# Academic Progress (Syllabus Tracker)

> Teaching confirmation and syllabus progress monitoring.

---

## Overview

The Academic Progress page enables teachers to confirm their teaching after each class and view their syllabus completion status. It provides a "Teaching Snapshot" with week-based context and supports bulk confirmation for multiple pending classes.

## Access

- **Route**: `/teacher/academic-progress`
- **Login Types**: Teacher
- **Permissions Required**: Teacher account

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| PageHeader | Title + bulk action | Top |
| WeekContextBanner | Current week label | Below header |
| SubjectSection | Subject-grouped view | Main content |
| SectionCard | Batch progress card | Within subject |
| ChapterDotsIndicator | Visual progress | Within card |
| ConfirmDialog | Teaching confirmation | Dialog |
| BulkConfirmDialog | Multi-class confirm | Dialog |
| ChapterDetailSheet | Chapter deep-dive | Drawer |

---

## Features & Functionality

### Week Context Banner

```text
┌─────────────────────────────────────────────────────────────┐
│ 📅 January Week 4 (Jan 22-28)            [◀ Previous Week] │
│ 3 Classes Pending Confirmation                              │
└─────────────────────────────────────────────────────────────┘
```

### Subject-First Layout

```text
Physics
├── 10A - Progress: 68% ████████░░░░
│   Current: Laws of Motion
│   Allotted: 12h │ Taken: 10h │ Pending: 2 classes
│   [View Chapters] [Confirm Pending]
│
└── 10B - Progress: 72% █████████░░░
    Current: Laws of Motion  
    Allotted: 12h │ Taken: 11h │ Pending: 1 class
    [View Chapters] [Confirm Pending]
```

### Chapter Dots Indicator

Visual representation of chapter status:

```text
●●●●○○○○○○  (4/10 chapters complete)
```

| Dot | Color | Meaning |
|-----|-------|---------|
| ● Filled | Green | Completed |
| ◐ Half | Amber | In Progress |
| ○ Empty | Gray | Not Started |

### Teaching Confirmation Dialog

Single class confirmation:

```text
Confirm Teaching - 10A Period 3 (Jan 22)
┌─────────────────────────────────────────────────────────────┐
│ What did you teach?                                         │
│                                                              │
│ Chapter: Laws of Motion                                     │
│                                                              │
│ Topics Covered:                                             │
│ ☑ Newton's First Law                                       │
│ ☑ Newton's Second Law                                      │
│ ☐ Newton's Third Law                                       │
│                                                              │
│ ○ Class Taught (as planned)                                 │
│ ○ Partial Teaching (select topics)                          │
│ ○ Not Taught (substitution/absence)                         │
│                                                              │
│ [Cancel] [Confirm]                                          │
└─────────────────────────────────────────────────────────────┘
```

### Bulk Confirmation Workflow

For 2+ pending confirmations:

**Step 1: Select Classes**
```text
Select Classes to Confirm (Jan 22-28)
☑ Mon P3 - 10A Physics (Laws of Motion)
☑ Tue P1 - 10B Physics (Laws of Motion)
☐ Wed P4 - 11A Physics (Thermodynamics)
[Continue with 2 selected]
```

**Step 2: Confirm Each**
```text
Class 1/2: 10A - Monday P3
[Topics selection + taught/not taught]
[Next →]
```

**Step 3: Review**
```text
Review Confirmations:
• 10A Mon P3: Taught - Newton's 1st, 2nd Laws
• 10B Tue P1: Not Taught - Teacher Absence
[Submit All]
```

### Chapter Detail Sheet

```text
Chapter: Laws of Motion
┌─────────────────────────────────────────────────────────────┐
│ Batch: 10A                                                  │
│ Status: In Progress                                         │
│                                                              │
│ Hours: Allotted 15h │ Taken 11h │ Remaining 4h             │
├─────────────────────────────────────────────────────────────┤
│ Topics:                                                      │
│ ✓ Newton's First Law - 3h (Jan 15, 16)                     │
│ ✓ Newton's Second Law - 4h (Jan 17, 18, 19)                │
│ ◐ Newton's Third Law - 2h/3h (Jan 22)                      │
│ ○ Friction - 0h/5h                                          │
├─────────────────────────────────────────────────────────────┤
│ Teaching History:                                            │
│ • Jan 22: Newton's Third Law intro (2h)                     │
│ • Jan 19: Newton's Second Law examples (2h)                 │
│ • ...                                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow

```text
Sources:
├── Academic Plan (expected progress)
├── Timetable (scheduled classes)
├── Previous Confirmations
└── Substitution Records
         │
         ▼
Display:
├── Calculate pending confirmations
├── Compute progress percentages
├── Group by subject → batch
         │
         ▼
Actions:
├── Single confirmation → Updates progress
├── Bulk confirmation → Batch update
└── View details → Chapter sheet
         │
         ▼
Downstream:
└── Institute Batch Progress (aggregated)
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Teaching Confirmation | Institute Progress | Upstream | Updates completion % |
| Academic Plan | Institute Planner | Upstream | Provides targets |
| Pending Classes | Timetable | Upstream | Determines what to confirm |
| Not Taught | Substitution | Reference | Records absence reason |

---

## Business Rules

1. **Confirmation required** for all scheduled classes
2. **Past classes only** - cannot confirm future
3. **Topics optional** but encouraged
4. **Not Taught** requires reason
5. **Bulk minimum** = 2 pending classes
6. **Progress calculation** = confirmed hours / planned hours
7. **Week boundaries** Monday-Sunday

---

## Mobile Behavior

- Subject sections: Accordion
- Section cards: Full-width
- Dots indicator: Horizontal scroll if many
- Confirm dialog: Bottom drawer
- Bulk flow: Full-screen stepped
- Chapter sheet: Fixed height, internal scroll

### Height Constraints

Chapter detail sheet:
- `max-h-[60vh]` on mobile
- Internal scroll for topic list
- Ensures dismissability

---

## Related Documentation

- [Dashboard](./dashboard.md)
- [Institute Batch Progress](../02-institute/batch-progress.md)
- [Academic Schedule Flow](../05-cross-login-flows/academic-schedule-flow.md)
- [Teacher Smoke Tests](../06-testing-scenarios/smoke-tests/teacher.md)

---

*Last Updated: January 2025*
