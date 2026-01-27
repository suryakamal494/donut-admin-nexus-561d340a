# Roles & Access

> Define granular permissions for SuperAdmin team members.

---

## Overview

The Roles & Access module implements Role-Based Access Control (RBAC) for the SuperAdmin portal. It allows creation of custom roles with granular permissions, enabling delegation of specific platform management tasks.

## Access

- **Route**: `/superadmin/roles`
- **Login Types**: SuperAdmin
- **Permissions Required**: `rolesAccess.view`, `rolesAccess.create`, `rolesAccess.edit`, `rolesAccess.delete`

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| PageHeader | Title + "Create Role" action | Top |
| RoleTabs | Roles / Team Members tabs | Below header |
| RoleTable | List of defined roles | Roles tab |
| MemberTable | List of team members | Members tab |
| RoleBuilder | Permission configuration | Dialog |
| MemberForm | User-role assignment | Dialog |

---

## Features & Functionality

### Permission Structure

```typescript
interface ModulePermission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

interface QuestionBankPermission extends ModulePermission {
  scope: {
    allClasses: boolean;
    classIds: string[];
    allSubjects: boolean;
    subjectIds: string[];
  };
  capabilities: {
    manual: boolean;
    aiGeneration: boolean;
    pdfUpload: boolean;
  };
}
```

### Available Modules

| Module | Permissions | Special Options |
|--------|-------------|-----------------|
| Dashboard | View | - |
| Institutes | View, Create, Edit, Delete | + Tier Management |
| Users | View, Create, Edit, Delete | - |
| Master Data | View, Create, Edit, Delete | - |
| Content Library | View, Create, Edit, Delete | + Scope, + Capabilities |
| Question Bank | View, Create, Edit, Delete | + Scope, + Capabilities |
| Exams | View, Create, Edit, Delete | + Type Access (PYP/Grand) |
| Roles & Access | View, Create, Edit, Delete | - |

### Scope Configuration

For Content Library and Question Bank:

| Scope Option | Description |
|--------------|-------------|
| All Classes | Access to all class levels |
| Specific Classes | Limited to selected classes |
| All Subjects | Access to all subjects |
| Specific Subjects | Limited to selected subjects |

### Capabilities Configuration

| Capability | Applies To | Description |
|------------|------------|-------------|
| Manual Entry | Questions, Content | Can create manually |
| AI Generation | Questions, Content | Can use AI tools |
| PDF Upload | Questions | Can extract from PDFs |

### System Roles

| Role | Description | Editable |
|------|-------------|----------|
| Super Admin | Full platform access | No |
| Content Manager | Content + Questions only | Yes |
| Exam Manager | Exams + Questions | Yes |
| Support Staff | View-only + limited actions | Yes |

### Create Custom Role

1. Click "Create Role"
2. **Basic Info**
   - Role name
   - Description
3. **Permissions**
   - Toggle modules on/off
   - Set CRUD permissions per module
   - Configure scope and capabilities
4. **Review & Save**

### Assign Members

1. Go to "Team Members" tab
2. Click "Add Member"
3. Select user (from Users module)
4. Assign role
5. Save

---

## Data Flow

```text
Source: SuperAdmin creates roles
         │
         ▼
Storage: rolesData.ts
         ├── roles[]
         │   ├── permissions
         │   └── scope configurations
         └── memberAssignments[]
         │
         ▼
Application:
├── Login → Load role permissions
├── Navigation → Filter sidebar items
├── Pages → Show/hide actions
└── API → Validate operations
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Role Creation | Users | Downstream | Roles available for assignment |
| Permission Config | All Modules | Downstream | Controls access |
| Scope Config | Content/Questions | Downstream | Filters visible items |

---

## Business Rules

1. **Super Admin role cannot be modified** or deleted
2. **At least one Super Admin** must exist
3. **Role deletion** requires reassigning members first
4. **Scope is additive** - user sees union of allowed scopes
5. **Capabilities are subtractive** - only enabled capabilities work
6. **Permission inheritance** - View required for other actions
7. **Audit logging** - all role changes are logged

---

## Permission Matrix Example

```text
Content Manager Role:
┌─────────────────┬────────┬────────┬──────┬────────┐
│ Module          │ View   │ Create │ Edit │ Delete │
├─────────────────┼────────┼────────┼──────┼────────┤
│ Dashboard       │ ✓      │ -      │ -    │ -      │
│ Institutes      │ ✓      │ ✗      │ ✗    │ ✗      │
│ Users           │ ✗      │ ✗      │ ✗    │ ✗      │
│ Master Data     │ ✓      │ ✗      │ ✗    │ ✗      │
│ Content Library │ ✓      │ ✓      │ ✓    │ ✓      │
│ Question Bank   │ ✓      │ ✓      │ ✓    │ ✗      │
│ Exams           │ ✓      │ ✗      │ ✗    │ ✗      │
│ Roles & Access  │ ✗      │ ✗      │ ✗    │ ✗      │
└─────────────────┴────────┴────────┴──────┴────────┘

Scope: All Classes, Subjects: Physics, Chemistry
Capabilities: Manual ✓, AI ✓, PDF ✗
```

---

## Mobile Behavior

- Role list: Card view with permission summary
- Permission builder: Accordion with toggles
- Scope selector: Bottom sheet with checkboxes
- Member list: Full-width cards
- Actions: Bottom action sheet

---

## Related Documentation

- [Users Management](./users.md)
- [Institute Roles](../02-institute/roles-access.md)
- [SuperAdmin Smoke Tests](../06-testing-scenarios/smoke-tests/superadmin.md)

---

*Last Updated: January 2025*
