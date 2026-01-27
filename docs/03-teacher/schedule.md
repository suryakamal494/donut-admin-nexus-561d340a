# Teacher Schedule

> Weekly timetable view with lesson plan status and quick actions.

---

## Overview

The Schedule page displays the teacher's weekly timetable in a gateway-style format. Each slot shows the class, subject, and lesson plan status, enabling teachers to quickly add or access lesson plans for their scheduled classes.

## Access

- **Route**: `/teacher/schedule`
- **Login Types**: Teacher
- **Permissions Required**: Teacher account

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| PageHeader | Title + week navigation | Top |
| WeekSelector | Week picker | Below header |
| ViewToggle | Grid/List toggle | Header |
| ScheduleGrid | Weekly grid view | Main content |
| ScheduleList | List view | Main content |
| SlotCard | Individual class slot | Within grid/list |

---

## Features & Functionality

### View Modes

| Mode | Best For | Default On |
|------|----------|------------|
| Grid | Desktop, overview | Desktop |
| List | Mobile, quick scan | Mobile |

### Weekly Grid View

```text
Week of Jan 15-19, 2025
┌──────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
│          │   P1    │   P2    │   P3    │   P4    │   P5    │
├──────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ Monday   │ 10A     │   -     │ 10B     │ 11A     │   -     │
│          │ Physics │         │ Physics │ Physics │         │
│          │ ✓ Ready │         │ 📝 Draft│ + Add   │         │
├──────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ Tuesday  │   -     │ 10A     │   -     │ 10B     │ 11A     │
│          │         │ Physics │         │ Physics │ Physics │
│          │         │ ✓ Ready │         │ + Add   │ 📝 Draft│
└──────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
```

### Slot Status Indicators

| Status | Icon | Color | Meaning |
|--------|------|-------|---------|
| Ready | ✓ | Green | Plan complete |
| Draft | 📝 | Amber | Plan in progress |
| Pending | + Add | Green button | No plan yet |
| Holiday | 🔒 | Gray | Blocked |

### Slot Click Actions

Clicking a slot:
1. If no plan → Opens Lesson Workspace with context pre-filled
2. If has plan → Opens Lesson Workspace for editing
3. Context passed: batch, date, period, subject, chapter

### Week Navigation

- Previous/Next week buttons
- Week picker dropdown
- Current week highlighted
- Past weeks shown but read-only for plans

---

## Data Flow

```text
Source: Institute Timetable
         │
         ▼
Filter: Teacher's assigned classes only
         │
         ▼
Enhance: Add lesson plan status
         │
         ▼
Display: Grid or list view
         │
         ▼
Action: Click → Lesson Workspace
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Timetable | Institute Workspace | Upstream | Schedule source |
| Slot click | Lesson Workspace | Local | Opens with context |
| Slot click | Lesson Plans | Local | Creates/opens plan |

---

## Business Rules

1. **Only teacher's classes** shown (filtered by assignment)
2. **Subject-scoped** - only assigned subjects visible
3. **Past slots** can have plans edited but not created
4. **Holiday/Exam blocks** shown but not clickable
5. **Week boundaries** are Monday-Sunday

---

## Mobile Behavior

- Default: List view
- Grid: Horizontal scroll
- Slots: Full-width cards
- Navigation: Swipe for weeks
- Touch targets: 44px minimum

### List View Format

```text
Monday, Jan 15
├── P1: 10A - Physics - Motion [✓ Ready]
├── P3: 10B - Physics - Force [📝 Draft]
└── P4: 11A - Physics - Thermo [+ Add Plan]

Tuesday, Jan 16
├── P2: 10A - Physics - Motion [✓ Ready]
└── ...
```

---

## Related Documentation

- [Lesson Plans](./lesson-plans.md)
- [Lesson Workspace](./lesson-workspace.md)
- [Dashboard](./dashboard.md)
- [Timetable Flow](../05-cross-login-flows/timetable-flow.md)
- [Teacher Smoke Tests](../06-testing-scenarios/smoke-tests/teacher.md)

---

*Last Updated: January 2025*
