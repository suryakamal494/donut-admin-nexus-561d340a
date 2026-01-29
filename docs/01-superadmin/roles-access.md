# Roles & Access

> Define granular permissions for SuperAdmin team members.

---

## Overview

The Roles & Access module implements Role-Based Access Control (RBAC) for the SuperAdmin portal. It allows creation of custom roles with granular permissions, enabling delegation of specific platform management tasks to team members.

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
| RoleTable | List of defined roles as cards | Roles tab |
| MemberTable | List of team members | Members tab |
| RoleBuilder | Permission configuration form | Dialog |
| MemberForm | User-role assignment form | Dialog |

---

## Role Types Tab

### Purpose

Role Types define permission templates that can be assigned to team members. Each role type specifies which modules a member can access and what actions they can perform.

### Display

Roles are displayed as cards showing:
- **Role name** - The role identifier
- **Description** - Brief description of the role's purpose
- **Member count** - Number of team members currently assigned this role
- **System role badge** - "System" badge for protected roles like Super Admin
- **Action buttons** - Edit, Delete (for non-system roles only)

### System Roles

System roles are pre-defined and cannot be modified or deleted:

| Role | Description | Editable | Deletable |
|------|-------------|----------|-----------|
| Super Admin | Full access to all modules and actions | No | No |

### Create Role Flow

1. Click "Create Role" button
2. Fill **Basic Info**:
   - Role Name (required)
   - Description (optional)
3. Configure **Module Permissions**:
   - Dashboard: View only
   - Institutes: View, Create, Edit, Delete + Tier Management toggle
   - Question Bank: VCUD + Scope (Class/Subject) + Capabilities (Manual, AI, PDF)
   - Exams: VCUD + Types (Grand Tests, PYP) + Scope
   - Content Library: VCUD + Capabilities (Manual, AI) + Scope
   - Master Data: VCUD
   - Users: VCUD
   - Roles & Access: VCUD
4. Click Create/Save

---

## Team Members Tab

### Purpose

Team Members are SuperAdmin portal users who have limited access based on their assigned role type. This enables delegation of specific tasks without giving full platform access.

### Display

Members are displayed in a table showing:
- **Name** - Full name of the team member
- **Email** - Login email address
- **Mobile** - Contact number (optional)
- **Role Type** - Assigned role name
- **Status** - Active/Inactive badge
- **Created Date** - When the member was added
- **Actions** - Edit, Delete buttons

### Add Member Flow

1. Click "Add Member" button
2. Fill member details:
   - Full Name (required)
   - Email (required) - must be unique
   - Mobile Number (optional)
   - Select Role Type (required) - dropdown of available roles
   - Set Status (Active/Inactive) - defaults to Active
3. Click Save

### Edit Member

- Change role type assignment
- Update status (Active/Inactive)
- Modify contact details (name, email, mobile)

### Member Lifecycle

- **Active** members can log in and access their permitted modules
- **Inactive** members cannot log in (credentials rejected)
- Reactivating a member restores their access

---

## Module Permission Matrix

### Permission Types

| Permission | Description |
|------------|-------------|
| View | Can see the module in sidebar and view its content |
| Create | Can create new items (questions, content, exams, etc.) |
| Edit | Can modify existing items |
| Delete | Can remove items |

### Special Permissions by Module

| Module | Special Permission | Description |
|--------|-------------------|-------------|
| Institutes | Tier Management | Can create/edit tier plans, not just institutes |
| Question Bank | Scope | Limit visibility to specific classes and/or subjects |
| Question Bank | Capabilities | Manual Entry, AI Generation, PDF Upload toggles |
| Exams | Types | Grand Tests, Previous Year Papers toggles |
| Exams | Scope | Inherits from Question Bank or custom configuration |
| Content Library | Capabilities | Manual Upload, AI Generation toggles |
| Content Library | Scope | Inherits from Question Bank or custom configuration |

### Scope Configuration

Scope limits visibility to specific classes and/or subjects:

| Option | Description |
|--------|-------------|
| All Classes | Access to all class levels (default) |
| Specific Classes | Manually select which classes are accessible |
| All Subjects | Access to all subjects (default) |
| Specific Subjects | Manually select which subjects are accessible |
| Inherit from Question Bank | Reuse QB scope for Exams/Content (avoids duplication) |

### Capabilities Configuration

| Capability | Applies To | Description |
|------------|------------|-------------|
| Manual Entry | Questions | Can create questions manually |
| AI Generation | Questions, Content | Can use AI tools to generate content |
| PDF Upload | Questions | Can extract questions from PDF files |
| Manual Upload | Content | Can upload content files manually |

---

## How Permissions Affect Team Member Login

When a team member logs in with their credentials:

1. **System loads their assigned role type**
2. **Sidebar shows ONLY modules they have View permission for**
3. **Within modules**:
   - Create button hidden if no Create permission
   - Edit button hidden if no Edit permission  
   - Delete button hidden if no Delete permission
4. **Capabilities control available actions**:
   - No AI permission = "Generate with AI" button hidden
   - No PDF permission = "Upload PDF" button hidden
5. **Scope limits visible content**:
   - Only assigned subjects/classes visible in filters and lists
   - Cannot see or interact with out-of-scope content

### Example: Content Manager - Physics Only

```text
Role Configuration:
- Dashboard: View ✓
- Institutes: View ✓ (Tier Management ✗)
- Content Library: View ✓, Create ✓, Edit ✓, Delete ✗
  - Capabilities: Manual ✓, AI ✗
  - Scope: Physics only
- Question Bank: View ✓, Create ✓, Edit ✓, Delete ✗
  - Capabilities: Manual ✓, AI ✓, PDF ✓
  - Scope: Physics only

Result for Team Member:
─────────────────────────────────
Sidebar Shows: Dashboard, Institutes, Content Library, Question Bank
Institutes: View only (no tier management)
Content Library: Create Content button ✓, AI Generator button ✗
Question Bank: Add Question ✓, Generate with AI ✓, Upload PDF ✓
Visible Content: Only Physics questions/content
Delete Actions: Hidden on all items
```

### Content Created by Team Member

- Content is **NOT exclusive** to the team member who created it
- All content created appears in the main SuperAdmin view
- SuperAdmin can **edit/delete** content created by team members
- Content follows **global visibility rules** (curriculum/course assignment)
- Other team members with the same permissions can also see the content

---

## Permission Examples

### Exam Manager Role

```text
┌─────────────────┬────────┬────────┬──────┬────────┐
│ Module          │ View   │ Create │ Edit │ Delete │
├─────────────────┼────────┼────────┼──────┼────────┤
│ Dashboard       │ ✓      │ -      │ -    │ -      │
│ Institutes      │ ✓      │ ✗      │ ✗    │ ✗      │
│ Question Bank   │ ✓      │ ✓      │ ✓    │ ✗      │
│ Exams           │ ✓      │ ✓      │ ✓    │ ✓      │
│ Content Library │ ✓      │ ✗      │ ✗    │ ✗      │
│ Master Data     │ ✓      │ ✗      │ ✗    │ ✗      │
│ Users           │ ✗      │ ✗      │ ✗    │ ✗      │
│ Roles & Access  │ ✗      │ ✗      │ ✗    │ ✗      │
└─────────────────┴────────┴────────┴──────┴────────┘

Exams Types: Grand Tests ✓, PYP ✓
Question Bank Scope: All Classes, All Subjects
Capabilities: Manual ✓, AI ✓, PDF ✓
```

### Content Manager Role

```text
┌─────────────────┬────────┬────────┬──────┬────────┐
│ Module          │ View   │ Create │ Edit │ Delete │
├─────────────────┼────────┼────────┼──────┼────────┤
│ Dashboard       │ ✓      │ -      │ -    │ -      │
│ Institutes      │ ✓      │ ✗      │ ✗    │ ✗      │
│ Content Library │ ✓      │ ✓      │ ✓    │ ✓      │
│ Question Bank   │ ✓      │ ✓      │ ✓    │ ✗      │
│ Exams           │ ✓      │ ✗      │ ✗    │ ✗      │
│ Master Data     │ ✓      │ ✗      │ ✗    │ ✗      │
│ Users           │ ✗      │ ✗      │ ✗    │ ✗      │
│ Roles & Access  │ ✗      │ ✗      │ ✗    │ ✗      │
└─────────────────┴────────┴────────┴──────┴────────┘

Scope: All Classes, Subjects: Physics, Chemistry
Capabilities: Manual ✓, AI ✓, PDF ✗
```

### Support Staff Role (View-Only)

```text
┌─────────────────┬────────┬────────┬──────┬────────┐
│ Module          │ View   │ Create │ Edit │ Delete │
├─────────────────┼────────┼────────┼──────┼────────┤
│ Dashboard       │ ✓      │ -      │ -    │ -      │
│ Institutes      │ ✓      │ ✗      │ ✗    │ ✗      │
│ Content Library │ ✓      │ ✗      │ ✗    │ ✗      │
│ Question Bank   │ ✓      │ ✗      │ ✗    │ ✗      │
│ Exams           │ ✓      │ ✗      │ ✗    │ ✗      │
│ Master Data     │ ✓      │ ✗      │ ✗    │ ✗      │
│ Users           │ ✓      │ ✗      │ ✗    │ ✗      │
│ Roles & Access  │ ✗      │ ✗      │ ✗    │ ✗      │
└─────────────────┴────────┴────────┴──────┴────────┘

Scope: All Classes, All Subjects (view only)
Capabilities: None (view only)
```

---

## Data Flow

```text
Source: SuperAdmin creates roles
         │
         ▼
Storage: rolesData.ts
         ├── roles[]
         │   ├── permissions per module
         │   ├── scope configurations
         │   └── capability toggles
         └── memberAssignments[]
             ├── member details
             └── roleId reference
         │
         ▼
Application:
├── Login → Load role permissions
├── Navigation → Filter sidebar items based on View permissions
├── Pages → Show/hide action buttons based on CRUD permissions
├── Filters → Limit options based on scope
└── Capabilities → Show/hide AI/PDF/Manual buttons
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Role Creation | Team Members | Downstream | Roles available for assignment |
| Permission Config | All Modules | Downstream | Controls visibility and actions |
| Scope Config | Content/Questions | Downstream | Filters visible items by class/subject |
| Capabilities | Question Bank, Content | Downstream | Controls AI/PDF/Manual buttons |

---

## Business Rules

1. **Super Admin role cannot be modified** or deleted (system role)
2. **At least one Super Admin** must exist at all times
3. **Role deletion requires reassigning members first** - cannot delete role with assigned members
4. **Scope is additive** - user sees union of allowed scopes
5. **Capabilities are subtractive** - only enabled capabilities show as buttons
6. **Permission inheritance** - View required for other actions (can't edit without view)
7. **Audit logging** - all role changes are logged for security
8. **Team member content is NOT private** - all content visible to SuperAdmin and other permitted members
9. **Inactive members cannot login** - immediate effect on deactivation

---

## Mobile Behavior

- Role cards: Vertical stack on mobile, full-width cards
- Permission builder: Accordion sections with toggles
- Scope selector: Bottom sheet with checkboxes
- Member table: Horizontal scroll with priority column hiding
- Member list: Full-width cards on very small screens
- Actions: Bottom action sheet for edit/delete
- Dialogs: Full-screen drawers on mobile

---

## Related Documentation

- [Users Management](./users.md)
- [Institute Roles](../02-institute/roles-access.md)
- [SuperAdmin Smoke Tests](../06-testing-scenarios/smoke-tests/superadmin.md)
- [Roles & Access Cross-Portal Tests](../06-testing-scenarios/inter-login-tests/roles-access-tests.md)

---

*Last Updated: January 2025*
