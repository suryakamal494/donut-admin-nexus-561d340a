# User Management

> Manage platform-level users including SuperAdmin team members.

---

## Overview

The Users module manages SuperAdmin-level users who have access to the SuperAdmin portal. These are platform administrators, content managers, and support staff who operate at the platform level (not institute-specific).

## Access

- **Route**: `/superadmin/users`
- **Login Types**: SuperAdmin
- **Permissions Required**: `users.view`, `users.create`, `users.edit`, `users.delete`

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| PageHeader | Title + "Add User" action | Top |
| FilterBar | Search, role, status filters | Below header |
| UserTable | List of platform users | Main content |
| UserForm | Create/edit user | Dialog |
| RoleAssignment | Role selection | Within form |

---

## Features & Functionality

### User Properties

| Field | Type | Description |
|-------|------|-------------|
| Name | Text | Full name |
| Email | Email | Login email (unique) |
| Mobile | Text | Contact number |
| Role | Select | Assigned admin role |
| Status | Enum | Active, Inactive |
| Created | Date | Account creation date |
| Last Login | Date | Most recent login |

### Create User Flow

1. Click "Add User"
2. Enter name, email, mobile
3. Select role (from Roles & Access)
4. Set initial password or send invite
5. User can login after activation

### User Roles

Users are assigned roles defined in [Roles & Access](./roles-access.md):

| Role Type | Typical Access |
|-----------|----------------|
| Super Admin | Full platform access |
| Content Manager | Content + Questions only |
| Support Staff | View-only + Institute support |
| Exam Manager | Exams + Questions |

### Manage Users

| Action | How | Result |
|--------|-----|--------|
| View Profile | Click row | Opens profile view |
| Edit | Click edit icon | Edit dialog |
| Change Status | Status toggle | Activate/deactivate |
| Change Role | Role dropdown | Updates permissions |
| Reset Password | Action menu | Sends reset email |
| Delete | Click delete | Confirmation + remove |

### Bulk Actions

| Action | Description |
|--------|-------------|
| Export | Download user list as CSV |
| Bulk Status | Change status for selected |
| Bulk Role | Change role for selected |

---

## Data Flow

```text
Source: SuperAdmin creates user
         │
         ▼
Storage: User accounts + role assignments
         │
         ▼
Authentication:
├── Login validation
├── Role-based permissions
└── Session management
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| User Creation | SuperAdmin Portal Access | Downstream | Enables login |
| Role Assignment | Permission System | Downstream | Determines what user can do |
| Status Change | Login System | Downstream | Blocks/allows login |

---

## Business Rules

1. **Email must be unique** across all platform users
2. **At least one Super Admin** must exist (cannot delete last one)
3. **Password requirements** - minimum 8 chars, mixed case, number
4. **Inactive users** cannot login
5. **Role changes** take effect on next login
6. **Self-deletion prevented** - cannot delete own account
7. **Audit trail** - all user changes logged

---

## Mobile Behavior

- User list: Card view on mobile
- Filters: Collapsible panel
- Create form: Full-screen
- Actions: Bottom action sheet

---

## Related Documentation

- [Roles & Access](./roles-access.md)
- [SuperAdmin Smoke Tests](../06-testing-scenarios/smoke-tests/superadmin.md)

---

*Last Updated: January 2025*
