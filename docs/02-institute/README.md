# Institute Admin Portal

> School-level administration for batches, teachers, students, timetables, and academic planning.

---

## Portal Overview

The Institute Admin portal is the **school administration layer** that manages:
- Batch creation and configuration
- Teacher and student onboarding
- Timetable creation and substitution
- Academic schedule planning and tracking
- Local content and question management
- Staff roles and access

### Access

- **Base Route**: `/institute/*`
- **Login**: Portal selection at `/` → Institute
- **Role Required**: Institute Admin or delegated staff role

---

## Portal Features

| Feature | Route | Description |
|---------|-------|-------------|
| [Dashboard](./dashboard.md) | `/institute/dashboard` | Setup checklist and quick actions |
| [Batches](./batches.md) | `/institute/batches` | Batch creation wizard |
| [Teachers](./teachers.md) | `/institute/teachers` | Teacher management + bulk upload |
| [Students](./students.md) | `/institute/students` | Student registration + bulk upload |
| [Master Data](./master-data.md) | `/institute/masterdata` | Read-only curriculum view |
| [Timetable Setup](./timetable-setup.md) | `/institute/timetable/setup` | Periods, holidays, exam blocks |
| [Timetable Workspace](./timetable-workspace.md) | `/institute/timetable/workspace` | Schedule creation |
| [Timetable View](./timetable-view.md) | `/institute/timetable/view` | Published schedule view |
| [Substitution](./timetable-substitution.md) | `/institute/timetable/substitution` | Teacher replacement |
| [Academic Setup](./academic-schedule-setup.md) | `/institute/academic-schedule/setup` | Hour allocation per chapter |
| [Academic Planner](./academic-planner.md) | `/institute/academic-schedule/plans` | Auto-plan generation |
| [Batch Progress](./batch-progress.md) | `/institute/academic-schedule` | Syllabus tracking + drift |
| [Content Library](./content-library.md) | `/institute/content` | Institute content |
| [Question Bank](./question-bank.md) | `/institute/questions` | Institute questions |
| [Exams](./exams-new.md) | `/institute/exams-new` | Pattern-based exam creation |
| [Roles & Access](./roles-access.md) | `/institute/roles` | Staff management |

---

## Data Ownership

Institute Admin manages:

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    INSTITUTE DATA OWNERSHIP                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  CREATES & OWNS                          VISIBILITY                  │
│  ─────────────────                       ──────────                  │
│  • Batches                       →       Teachers, Students          │
│  • Teacher Accounts              →       Teachers (own profile)      │
│  • Student Accounts              →       Students (own profile)      │
│  • Timetable                     →       Teachers, Students          │
│  • Academic Plans                →       Teachers                    │
│  • Institute Content             →       Teachers (subject-scoped)   │
│  • Institute Questions           →       Teachers (subject-scoped)   │
│  • Institute Exams               →       Teachers, Students          │
│  • Staff Roles                   →       Staff Members               │
│                                                                      │
│  CONSUMES (READ-ONLY)                                                │
│  ────────────────────                                                │
│  • Curricula from SuperAdmin                                         │
│  • Courses from SuperAdmin                                           │
│  • Global Content from SuperAdmin                                    │
│  • Global Questions from SuperAdmin                                  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Permission Model

Institute staff roles have granular permissions:

| Module | Actions | Notes |
|--------|---------|-------|
| Dashboard | View | Always enabled |
| Batches | View, Create, Edit, Delete | |
| Teachers | View, Create, Edit, Delete | + Bulk upload |
| Students | View, Create, Edit, Delete | + Bulk upload |
| Master Data | View | Read-only from SuperAdmin |
| Timetable | View, Create, Edit | + Substitution |
| Academic Schedule | View, Create, Edit | + Plan generation |
| Content Library | View, Create, Edit, Delete | Subject-scoped |
| Question Bank | View, Create, Edit, Delete | Subject-scoped + AI/PDF |
| Exams | View, Create, Edit, Delete | Pattern-based |
| Roles & Access | View, Create, Edit, Delete | |

---

## Key Workflows

### 1. Initial Setup Flow
```text
Dashboard Checklist:
1. Create Batches (select class, assign teachers)
2. Add Teachers (single or bulk upload)
3. Add Students (single or bulk upload)
4. Configure Timetable Setup (periods, holidays)
5. Create Timetable (assign teachers to slots)
6. Generate Academic Plan
```

### 2. Batch Creation Flow
```text
Step 1: Select Class (from assigned curriculum)
Step 2: Batch Details (name, year, track)
Step 3: Assign Subjects & Teachers
```

### 3. Timetable Creation Flow
```text
Setup Phase:
├── Define Periods (start/end times)
├── Configure Breaks
├── Set Holidays
└── Block Exam Dates

Workspace Phase:
├── Select Batch/Teacher view
├── Drag-drop or click-assign
├── Resolve conflicts
└── Publish timetable
```

### 4. Academic Planning Flow
```text
Setup: Hour Allocation → Define hours per chapter
Planner: Generate Plan → Auto-calculate chapter-week mappings
Progress: Track Drift → Monitor actual vs planned
```

---

## Cross-Login Connections

| Institute Action | Affects | How |
|------------------|---------|-----|
| Creates Batch | Teacher schedule options | Available for assignment |
| Assigns Teacher to Batch | Teacher portal | Sees classes for that batch |
| Publishes Timetable | Teacher/Student | Visible in their schedules |
| Generates Academic Plan | Teacher | Visible in syllabus progress |
| Creates Content | Teacher | Visible in library (subject-scoped) |
| Creates Exam | Teacher/Student | Can be assigned/taken |

---

## Mobile Behavior

- **Dashboard**: Stacked checklist cards
- **Batch Creation**: Full-screen wizard
- **Bulk Upload**: Copy-paste table with preview
- **Timetable**: Swipe navigation, pinch zoom
- **Dialogs**: Bottom drawers on mobile
- **Tables**: Priority column hiding

---

## Prerequisite Dependencies

```text
Before Batches    → Curriculum must be assigned by SuperAdmin
Before Timetable  → Batches, Teachers must exist
Before Academic Plan → Timetable, Hour Allocation must exist
Before Teacher Schedule → Timetable must be published
Before Student Access → Student must be enrolled in batch
```

---

## Related Documentation

- [Timetable Flow](../05-cross-login-flows/timetable-flow.md)
- [Academic Schedule Flow](../05-cross-login-flows/academic-schedule-flow.md)
- [Batch-Student Flow](../05-cross-login-flows/batch-student-flow.md)
- [Institute Smoke Tests](../06-testing-scenarios/smoke-tests/institute.md)
- [Technical Architecture](../ARCHITECTURE.md)

---

*Last Updated: January 2025*
