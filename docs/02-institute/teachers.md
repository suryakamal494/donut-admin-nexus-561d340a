# Teacher Management

> Register and manage teaching staff with subject expertise and batch assignments.

---

## Overview

The Teachers module manages all teaching staff within the institute. It supports individual and bulk registration, subject expertise mapping, and tracks teacher-batch assignments that feed into timetabling.

## Access

- **Route**: `/institute/teachers`
- **Login Types**: Institute Admin
- **Permissions Required**: `teachers.view`, `teachers.create`, `teachers.edit`, `teachers.delete`

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| PageHeader | Title + Add/Bulk actions | Top |
| FilterBar | Subject, status filters | Below header |
| TeacherTable | List of teachers | Main content |
| TeacherForm | Single teacher registration | Dialog |
| BulkUpload | Multi-teacher import | Dialog |
| TeacherDetail | Full teacher profile | Slide-over |

---

## Features & Functionality

### Teacher Properties

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Name | Text | Yes | Full name |
| Email | Email | Yes | Login email |
| Mobile | Text | Yes | Contact number |
| Subject Expertise | Multi-select | Yes | Subjects teacher can teach |
| Assigned Batches | Multi-select | No | Batches currently assigned |
| Status | Enum | Yes | Active, Inactive |
| Employee ID | Text | No | Internal reference |
| Join Date | Date | No | Employment start |

### Add Single Teacher

1. Click "Add Teacher"
2. **Basic Details**
   - Full name
   - Email (becomes login username)
   - Mobile number
   - Employee ID (optional)
3. **Subject Expertise**
   - Select subjects teacher can teach
   - Multiple subjects allowed
4. **Batch Assignment** (optional)
   - Assign to existing batches
   - Or assign later via Batch management
5. **Account Setup**
   - Auto-generate password OR
   - Send email invitation
6. Save

### Bulk Upload

Two methods supported:

**Method 1: Copy & Paste**
1. Click "Bulk Upload"
2. Paste tab/comma-separated data from spreadsheet:
   ```
   Name    Email    Mobile    Subjects
   Dr. Kumar    kumar@school.edu    9876543210    Physics, Chemistry
   Mrs. Singh    singh@school.edu    9876543211    Mathematics
   ```
3. Review parsed data in preview table
4. Fix any validation errors (highlighted in red)
5. Import valid rows

**Method 2: CSV Upload**
1. Click "Bulk Upload"
2. Download template CSV
3. Fill template with teacher data
4. Upload CSV file
5. Review and import

### Manage Teachers

| Action | How | Result |
|--------|-----|--------|
| View Profile | Click row | Opens full profile |
| Edit | Click edit | Edit dialog |
| Deactivate | Status toggle | Blocks login |
| Delete | Click delete | Removes teacher |
| Reset Password | Action menu | Sends reset email |
| Assign Batches | From profile | Batch assignment dialog |

### Subject Expertise Mapping

```text
Dr. Rajesh Kumar
├── Can Teach: Physics, Chemistry
├── Currently Assigned:
│   ├── 10A - Physics
│   ├── 10B - Physics
│   └── 11A - Physics
└── Available For: Chemistry (no assignment)
```

---

## Data Flow

```text
Source: Institute creates teacher
         │
         ▼
Storage: teachers[] in instituteData
         ├── Basic profile
         ├── Subject expertise
         └── Batch assignments
         │
         ▼
Downstream:
├── Batch Creation (teacher selection)
├── Timetable (teacher availability)
├── Teacher Portal (login access)
└── Academic Progress (teaching records)
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Teacher Creation | Teacher Portal | Downstream | Enables login |
| Subject Expertise | Batch Assignment | Local | Filters teacher options |
| Batch Assignment | Timetable | Downstream | Teacher schedule populated |
| Status Change | Teacher Login | Downstream | Blocks/allows access |

---

## Business Rules

1. **Email must be unique** across all institute users
2. **At least one subject** required for expertise
3. **Mobile validation** - valid format required
4. **Batch assignment** requires matching subject expertise
5. **Inactive teachers** cannot login but records preserved
6. **Deletion blocked** if teacher has active assignments
7. **Bulk upload** - only 7 mandatory fields processed

---

## Bulk Upload Fields

| Field | Required | Format |
|-------|----------|--------|
| Full Name | Yes | Text |
| Email | Yes | Valid email |
| Mobile | Yes | 10 digits |
| Subject(s) | Yes | Comma-separated |
| Employee ID | No | Text |
| Join Date | No | YYYY-MM-DD |
| Status | No | Active (default) |

---

## Mobile Behavior

- Teacher list: Card view
- Add form: Full-screen
- Bulk upload: Bottom sheet with paste area
- Profile view: Full-screen with tabs
- Actions: Bottom action sheet

---

## Related Documentation

- [Batches](./batches.md)
- [Timetable Workspace](./timetable-workspace.md)
- [Teacher Portal Overview](../03-teacher/README.md)
- [Institute Smoke Tests](../06-testing-scenarios/smoke-tests/institute.md)

---

*Last Updated: January 2025*
