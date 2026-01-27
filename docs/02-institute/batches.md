# Batch Management

> Create and manage class sections with teacher and subject assignments.

---

## Overview

The Batches module manages the creation of class sections (batches) that group students for academic tracking. Each batch maps a class level to a specific set of teachers and subjects, forming the foundation for timetables and academic planning.

## Access

- **Route**: `/institute/batches`
- **Login Types**: Institute Admin
- **Permissions Required**: `batches.view`, `batches.create`, `batches.edit`, `batches.delete`

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| PageHeader | Title + "Create Batch" action | Top |
| FilterBar | Class, year, status filters | Below header |
| BatchTable | List of batches | Main content |
| BatchWizard | 3-step creation wizard | Dialog/Full-screen |
| BatchDetail | Batch overview | Slide-over |

---

## Features & Functionality

### Batch Properties

| Field | Type | Description |
|-------|------|-------------|
| Name | Text | Batch identifier (e.g., "10A", "10-Morning") |
| Class | Select | Class level from curriculum |
| Track | Select | Curriculum or Course (CBSE, JEE, etc.) |
| Academic Year | Text | e.g., "2024-25" |
| Subjects | Multi-select | Subjects for this batch |
| Teachers | Mapping | Subject-to-teacher assignments |
| Status | Enum | Active, Archived |

### Create Batch Wizard

**Step 1: Select Class**
- Choose curriculum/course (filtered by institute assignment)
- Select class level
- Class determines available subjects

**Step 2: Batch Details**
- Batch name (e.g., "10A")
- Academic year
- Optional description
- Track selection (if multiple curricula)

**Step 3: Assign Subjects & Teachers**
- Select subjects to include
- Assign teacher to each subject
- Teacher dropdown filtered by subject expertise

### Batch Structure

```text
Batch: 10A - CBSE
├── Class: Class 10
├── Track: CBSE
├── Year: 2024-25
├── Subjects:
│   ├── Physics → Dr. Rajesh Kumar
│   ├── Chemistry → Mrs. Priya Singh
│   ├── Mathematics → Mr. Amit Sharma
│   └── English → Ms. Deepa Gupta
└── Students: 35 enrolled
```

### Manage Batches

| Action | How | Result |
|--------|-----|--------|
| View | Click row | Opens batch detail |
| Edit | Click edit | Modify assignments |
| Archive | Click archive | Removes from active list |
| Delete | Click delete | Removes batch (if empty) |
| Add Students | From detail view | Link to student enrollment |

### Subject-Teacher Mapping

| Subject | Available Teachers | Assigned |
|---------|-------------------|----------|
| Physics | Dr. Kumar, Mr. Patel | Dr. Kumar |
| Chemistry | Mrs. Singh, Dr. Rao | Mrs. Singh |
| Mathematics | Mr. Sharma, Ms. Joshi | Mr. Sharma |

---

## Data Flow

```text
Source: Master Data (Classes, Subjects from curriculum)
         │
         ▼
Creation: Institute creates batch
         ├── Class selection
         ├── Subject-teacher mapping
         └── Student enrollment
         │
         ▼
Downstream:
├── Timetable (batch schedules)
├── Academic Planning (batch syllabus)
├── Teacher Portal (assigned batches)
└── Student Portal (enrolled batch)
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Batch Creation | Timetable | Downstream | Available for scheduling |
| Teacher Assignment | Teacher Portal | Downstream | Teacher sees batch |
| Student Enrollment | Student Portal | Downstream | Student sees content |
| Subject Mapping | Content/Questions | Downstream | Scopes visibility |

---

## Business Rules

1. **Class must be from assigned curriculum** - only available classes shown
2. **Each batch needs unique name** within same class
3. **At least one subject required** for batch creation
4. **Teacher must have subject expertise** for assignment
5. **Batch deletion blocked** if students enrolled
6. **Archived batches** remain visible but inactive
7. **Year format validated** (e.g., 2024-25)

---

## Mobile Behavior

- Batch list: Card view with key info
- Creation wizard: Full-screen stepped flow
- Subject-teacher mapping: Vertical cards
- Actions: Bottom sheet menu

---

## Related Documentation

- [Teachers](./teachers.md)
- [Students](./students.md)
- [Timetable Workspace](./timetable-workspace.md)
- [Academic Setup](./academic-schedule-setup.md)
- [Batch-Student Flow](../05-cross-login-flows/batch-student-flow.md)
- [Institute Smoke Tests](../06-testing-scenarios/smoke-tests/institute.md)

---

*Last Updated: January 2025*
