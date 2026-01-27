# Institute Roles & Access

> Manage staff roles and permissions for institute administration.

---

## Overview

The Institute Roles & Access module manages staff members and their permissions within the institute. Unlike SuperAdmin RBAC (which manages platform admins), this module focuses on school-specific roles like Vice Principal, Academic Coordinator, and Administrative Staff.

## Access

- **Route**: `/institute/roles`
- **Login Types**: Institute Admin
- **Permissions Required**: `rolesAccess.view`, `rolesAccess.create`, `rolesAccess.edit`, `rolesAccess.delete`

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| PageHeader | Title + add staff action | Top |
| RoleTabs | Roles / Staff tabs | Below header |
| RoleTable | List of defined roles | Roles tab |
| StaffTable | List of staff members | Staff tab |
| RoleBuilder | Permission configuration | Dialog |
| StaffForm | User-role assignment | Dialog |

---

## Features & Functionality

### Tab Structure

| Tab | Purpose | Actions |
|-----|---------|---------|
| **Roles** | Define permission sets | Create, Edit, Delete |
| **Staff** | Assign users to roles | Add, Edit, Remove |

### Default Roles

| Role | Description | Editable |
|------|-------------|----------|
| Principal | Full access | No |
| Vice Principal | Full except roles | Yes |
| Academic Coordinator | Academic modules only | Yes |
| Admin Staff | Student/Teacher management | Yes |

### Permission Modules

| Module | Available Permissions |
|--------|----------------------|
| Dashboard | View |
| Batches | View, Create, Edit, Delete |
| Teachers | View, Create, Edit, Delete |
| Students | View, Create, Edit, Delete |
| Master Data | View |
| Timetable | View, Create, Edit |
| Academic Schedule | View, Create, Edit |
| Content Library | View, Create, Edit, Delete |
| Question Bank | View, Create, Edit, Delete |
| Exams | View, Create, Edit, Delete |
| Roles & Access | View, Create, Edit, Delete |

### Create Custom Role

1. Go to "Roles" tab
2. Click "Create Role"
3. Enter role name and description
4. Configure permissions per module
5. Save

### Add Staff Member

1. Go to "Staff" tab
2. Click "Add Staff"
3. Enter details:
   - Name
   - Email
   - Mobile
   - Role (from defined roles)
4. Account created with invitation email

### Permission Matrix View

```text
Academic Coordinator Role:
┌─────────────────┬────────┬────────┬──────┬────────┐
│ Module          │ View   │ Create │ Edit │ Delete │
├─────────────────┼────────┼────────┼──────┼────────┤
│ Dashboard       │ ✓      │ -      │ -    │ -      │
│ Batches         │ ✓      │ ✓      │ ✓    │ ✗      │
│ Teachers        │ ✓      │ ✗      │ ✗    │ ✗      │
│ Students        │ ✓      │ ✗      │ ✗    │ ✗      │
│ Master Data     │ ✓      │ -      │ -    │ -      │
│ Timetable       │ ✓      │ ✓      │ ✓    │ -      │
│ Academic Sched. │ ✓      │ ✓      │ ✓    │ -      │
│ Content Library │ ✓      │ ✓      │ ✓    │ ✗      │
│ Question Bank   │ ✓      │ ✓      │ ✓    │ ✗      │
│ Exams           │ ✓      │ ✓      │ ✓    │ ✗      │
│ Roles & Access  │ ✗      │ ✗      │ ✗    │ ✗      │
└─────────────────┴────────┴────────┴──────┴────────┘
```

### Staff List

```text
Staff Members
┌─────────────────────────────────────────────────────────────┐
│ Name              │ Email              │ Role     │ Status  │
├───────────────────┼────────────────────┼──────────┼─────────┤
│ Dr. Sharma        │ sharma@school.edu  │ Principal│ Active  │
│ Mrs. Gupta        │ gupta@school.edu   │ VP       │ Active  │
│ Mr. Patel         │ patel@school.edu   │ Academic │ Active  │
│ Ms. Singh         │ singh@school.edu   │ Admin    │ Inactive│
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow

```text
Source: Institute creates roles/staff
         │
         ▼
Storage: instituteRolesData.ts
         ├── roles[]
         │   └── permissions per module
         └── staffMembers[]
             └── role assignments
         │
         ▼
Application:
├── Login → Load permissions
├── Navigation → Filter menu items
├── Pages → Show/hide actions
└── API → Validate operations
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Role Creation | Staff Assignment | Local | Roles available |
| Staff Creation | Institute Portal | Local | Enables login |
| Permissions | All Modules | Local | Controls access |

---

## Business Rules

1. **Principal role cannot be modified** or deleted
2. **At least one Principal** must exist
3. **Role deletion** requires reassigning staff first
4. **Email must be unique** within institute
5. **Inactive staff** cannot login
6. **Permission changes** take effect on next login
7. **Audit logging** for all changes

---

## Mobile Behavior

- Tabs: Horizontal scroll
- Role list: Card view
- Staff list: Card view
- Permission builder: Accordion with toggles
- Forms: Full-screen
- Actions: Bottom action sheet

### Mobile Table Behavior

- Tables use horizontal scroll
- Priority columns shown first
- Action menus always visible (touch-friendly)
- Search/filters stack vertically

---

## Related Documentation

- [SuperAdmin Roles](../01-superadmin/roles-access.md)
- [Dashboard](./dashboard.md)
- [Institute Smoke Tests](../06-testing-scenarios/smoke-tests/institute.md)

---

*Last Updated: January 2025*
