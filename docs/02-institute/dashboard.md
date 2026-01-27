# Institute Dashboard

> Setup checklist and quick actions for school administration.

---

## Overview

The Institute Dashboard serves as a task-oriented "Orientation Screen" for principals and institute administrators. It tracks academic setup status, provides a snapshot of today's activities, and offers quick actions for common tasks.

## Access

- **Route**: `/institute/dashboard`
- **Login Types**: Institute Admin, Staff with dashboard access
- **Permissions Required**: `dashboard.view`

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| PageHeader | Institute name + date | Top |
| SetupChecklist | Onboarding progress tracker | Top section |
| TodaySnapshot | Current day overview | Middle section |
| QuickActions | Common task shortcuts | Right sidebar/Bottom |
| StatsCards | Key metrics | Below checklist |

---

## Features & Functionality

### Setup Checklist

The checklist guides new institutes through required setup steps:

| Step | Status | Description | Link |
|------|--------|-------------|------|
| 1. Create Batches | ✓/○ | Define class sections | `/institute/batches` |
| 2. Add Teachers | ✓/○ | Register teaching staff | `/institute/teachers` |
| 3. Add Students | ✓/○ | Enroll students | `/institute/students` |
| 4. Setup Timetable | ✓/○ | Configure periods | `/institute/timetable/setup` |
| 5. Create Schedule | ✓/○ | Assign teachers to slots | `/institute/timetable/workspace` |
| 6. Academic Planning | ✓/○ | Set chapter hours | `/institute/academic-schedule/setup` |

### Completion States

| State | Visual | Meaning |
|-------|--------|---------|
| Complete | ✓ Green | Step finished |
| In Progress | ○ Amber | Partially done |
| Pending | ○ Gray | Not started |

### Today's Snapshot

| Widget | Description |
|--------|-------------|
| Classes Today | Number of scheduled classes |
| Tests This Week | Upcoming assessments |
| Pending Substitutions | Teachers needing replacement |
| Attendance Rate | Today's attendance (if tracked) |

### Quick Actions

| Action | Description | Route |
|--------|-------------|-------|
| Add Teacher | Quick teacher registration | Dialog |
| Add Student | Quick student registration | Dialog |
| View Timetable | Published schedule | `/institute/timetable/view` |
| Create Exam | New assessment | `/institute/exams-new` |

### Stats Cards

| Stat | Description |
|------|-------------|
| Total Batches | Active batch count |
| Total Teachers | Registered teachers |
| Total Students | Enrolled students |
| Syllabus Progress | Average completion % |

---

## Data Flow

```text
Data Sources:
├── batches[] → Batch count, status
├── teachers[] → Teacher count
├── students[] → Student count
├── timetable[] → Today's classes
└── academicPlans[] → Progress metrics
         │
         ▼
Dashboard:
└── Aggregates and displays metrics
```

---

## Cross-Login Connections

| Dashboard Element | Source | What It Shows |
|-------------------|--------|---------------|
| Curriculum info | SuperAdmin | Assigned curricula |
| Setup status | Local creation | Progress on setup tasks |
| Today's classes | Timetable | Scheduled periods |
| Teacher availability | Substitution | Absent teachers |

---

## Business Rules

1. **Checklist persists** until all steps complete
2. **Steps have dependencies** - can't create timetable without teachers/batches
3. **Snapshot updates daily** at midnight
4. **Quick actions respect permissions** of logged-in user
5. **First-time users** see expanded checklist

---

## Mobile Behavior

- Checklist: Full-width cards, vertical stack
- Stats: 2x2 grid
- Snapshot: Horizontal scroll cards
- Quick actions: Fixed bottom bar
- Touch targets: 44px minimum

---

## Related Documentation

- [Batches](./batches.md)
- [Teachers](./teachers.md)
- [Students](./students.md)
- [Timetable Setup](./timetable-setup.md)
- [Institute Smoke Tests](../06-testing-scenarios/smoke-tests/institute.md)

---

*Last Updated: January 2025*
