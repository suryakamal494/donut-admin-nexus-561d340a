# Lesson Plans Portal

> Manage, browse, and clone lesson plans across classes.

---

## Overview

The Lesson Plans portal is a comprehensive management page for all lesson plans created by the teacher. It provides filtering, status tracking, and the ability to clone plans for reuse across different batches or dates.

## Access

- **Route**: `/teacher/lesson-plans`
- **Login Types**: Teacher
- **Permissions Required**: Teacher account

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| PageHeader | Title + "Create Plan" action | Top |
| StatsBar | Plan counts by status | Below header |
| FilterBar | Subject, batch, status filters | Below stats |
| PlanGrid | Lesson plan cards | Main content |
| PlanCard | Individual plan summary | Within grid |

---

## Features & Functionality

### Header Stats

| Stat | Description | Color |
|------|-------------|-------|
| Total | All plans | Default |
| Ready | Complete plans | Green |
| Draft | In-progress | Amber |
| Used | Already taught | Gray |

### Plan Card

```text
┌─────────────────────────────────────────────────────────────┐
│ Laws of Motion - Class 10A                                  │
│ Physics • Chapter 2                                         │
├─────────────────────────────────────────────────────────────┤
│ Topics: Newton's First Law, Second Law                      │
│                                                              │
│ Blocks: 🎬 2  📝 3  ❓ 1  📚 1                               │
│                                                              │
│ Duration: 45 min │ Date: Jan 15, 2025                       │
│ Status: ✓ Ready                                             │
├─────────────────────────────────────────────────────────────┤
│ [View Plan] [Clone] [Present]                               │
└─────────────────────────────────────────────────────────────┘
```

### Card Elements

| Element | Description |
|---------|-------------|
| Title | Plan/chapter name |
| Batch | Target class section |
| Subject | Subject name |
| Topics | Covered topics list |
| Block Summary | Icons + counts per type |
| Duration | Total planned time |
| Date | Scheduled date |
| Status | Ready/Draft/Used |

### Block Type Icons

| Icon | Type | Description |
|------|------|-------------|
| 🎬 | Video | Video content |
| 📝 | Explain | Text/notes |
| ❓ | Quiz | Assessment |
| 📚 | Homework | Assignment |
| 🎯 | Activity | Interactive |
| 📎 | Resource | Attachments |

### Actions

| Action | Description | Result |
|--------|-------------|--------|
| View Plan | Open in workspace | Edit/present mode |
| Clone | Duplicate for reuse | New plan with same blocks |
| Present | Start presentation | Full-screen mode |
| Delete | Remove plan | Confirmation dialog |

### Clone Workflow

1. Click "Clone" on any plan
2. Dialog opens:
   - Select target batch
   - Select target date
   - Modify title (optional)
3. Create clone
4. New plan created with same blocks

### Filtering

| Filter | Options |
|--------|---------|
| Subject | Teacher's subjects |
| Batch | Assigned batches |
| Status | All, Ready, Draft, Used |
| Date Range | Custom range |

---

## Data Flow

```text
Source: Teacher's lesson plans
         │
         ▼
Storage: lessonPlans[] in teacherData
         ├── Plan metadata
         ├── Block configurations
         └── Content references
         │
         ▼
Display: Filtered, sorted cards
         │
         ▼
Actions:
├── View → Workspace
├── Clone → New plan
└── Present → Presentation mode
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Lesson Plan | Student Classroom Mode | Downstream | Visible as lesson bundle |
| Plan blocks | Content items | Reference | Links to content library |
| Quiz blocks | Questions | Reference | Links to question bank |
| Homework blocks | Homework | Creates | Generates homework assignment |

---

## Business Rules

1. **Plans are private** to creating teacher
2. **Clone creates independent copy** - no link maintained
3. **Used plans** can be edited but change doesn't affect past
4. **Draft plans** not visible to students
5. **Deletion requires confirmation**
6. **Block content references** are preserved in clones

---

## Mobile Behavior

- Stats bar: Horizontal scroll chips
- Plan cards: Full-width vertical stack
- Filters: Collapsible panel
- Actions: Bottom sheet on card tap
- Clone dialog: Full-screen on mobile

---

## Related Documentation

- [Lesson Workspace](./lesson-workspace.md)
- [Schedule](./schedule.md)
- [Content Library](./content-library.md)
- [Teacher Smoke Tests](../06-testing-scenarios/smoke-tests/teacher.md)

---

*Last Updated: January 2025*
