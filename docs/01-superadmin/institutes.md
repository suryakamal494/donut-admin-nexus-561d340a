# Institute Management

> Onboard, configure, and manage educational institutes with tier-based feature access.

---

## Overview

The Institutes module manages all educational institutions on the platform. SuperAdmin can create institutes, assign curricula/courses, configure feature tiers, and monitor institute health.

## Access

- **Route**: `/superadmin/institutes`
- **Login Types**: SuperAdmin
- **Permissions Required**: `institutes.view`, `institutes.create`, `institutes.edit`, `institutes.delete`, `institutes.tierManagement`

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| PageHeader | Title + "Add Institute" action button | Top |
| FilterBar | Search box, Plan filter, Status filter | Below header |
| InstituteTable | List of all institutes with actions | Main content |
| ActionMenu | Per-row actions: View, Edit, Assign, Billing | Row actions |
| AddInstituteWizard | 4-step creation wizard | Full-page/Dialog |

---

## All Institutes Page

### Filters and Search

| Filter | Type | Function |
|--------|------|----------|
| Search | Text input | Filters by institute name or code |
| Plan | Dropdown | Filters by tier (Basic, Standard, Premium) |
| Status | Dropdown | Filters by status (Active, Inactive, Pending) |

### Action Menu

Each institute row has an Actions menu with:

| Action | Description | Result |
|--------|-------------|--------|
| **View Details** | Opens read-only detail page | Shows all institute information |
| **Edit** | Opens edit form | Modify institute details |
| **Assign Curriculum/Courses** | Opens assignment dialog | Multi-select curricula and courses |
| **Billing** | Opens billing management | View/modify billing status |

### Assign Curriculum/Courses Dialog

When clicking "Assign Curriculum/Courses":
1. Dialog opens with checkboxes for all available Curricula
2. Checkboxes for all available Courses
3. Multi-select allowed (can assign multiple)
4. **"Create Custom Course for this Institute"** button - Creates a course exclusive to this institute
5. Save updates the institute's assignments

---

## Add Institute Wizard

The "Add Institute" button opens a 4-step wizard:

### Step 1: Institute Details

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Institute Name | Text | Yes | Full name of institution |
| Institute Code | Text | Yes | Unique identifier |
| Institute Type | Dropdown | Yes | School, College, Coaching |
| Address | Textarea | Yes | Physical location |
| City | Text | Yes | City name |
| State | Text | Yes | State/Province |
| Contact Person | Text | Yes | Primary contact name |
| Email | Email | Yes | Official email |
| Phone | Text | Yes | Contact number |

### Step 2: Admin Setup

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Admin Name | Text | Yes | Institute admin's full name |
| Admin Email | Email | Yes | Admin login email |
| Mobile Number | Phone | Yes | Admin mobile with validation |
| Password | Password | Yes | Initial password with visibility toggle |
| Confirm Password | Password | Yes | Password confirmation |

### Step 3: Plan Selection

- Displays plan cards from Tier Management
- Each card shows:
  - Plan name and price
  - Feature list
  - Limits (batches, teachers, students)
  - **Preview button** - Opens popup with full plan details
- Select one plan to proceed

### Step 4: Assign Curriculums & Courses

| Element | Type | Description |
|---------|------|-------------|
| Curriculum Checkboxes | Multi-select | Check all curricula to assign |
| Course Checkboxes | Multi-select | Check all courses to assign |
| Selection Summary | Display | Shows count of selected items |
| Create Custom Course | Button | Opens custom course builder for this institute |
| Skip & Create | Button | Creates institute without assignments |
| Create Institute | Button | Creates institute with all selections |

**Create Custom Course for this Institute**: Opens a specialized course builder that creates a course exclusive to this institute, automatically assigned upon creation.

**Skip & Create**: Skips curriculum/course assignment (can be done later via Assign action). Creates institute immediately.

---

## Institute Properties

| Field | Type | Description |
|-------|------|-------------|
| Name | Text | Institute name |
| Code | Text | Unique identifier |
| Type | Enum | School, College, Coaching |
| Address | Text | Physical location |
| Contact | Text | Primary contact |
| Email | Email | Admin email |
| Phone | Text | Contact number |
| Status | Enum | Active, Inactive, Pending |
| Tier/Plan | Enum | Basic, Standard, Premium |
| Curricula | Multi-select | Assigned curricula |
| Courses | Multi-select | Assigned courses |

---

## Institute Tiers

| Tier | Features | Limits |
|------|----------|--------|
| **Basic** | Core features only | 5 batches, 10 teachers, 100 students |
| **Standard** | + AI features, Reports | 20 batches, 50 teachers, 500 students |
| **Premium** | + All features, Priority support | Unlimited |

### Tier Feature Matrix

| Feature | Basic | Standard | Premium |
|---------|-------|----------|---------|
| Batches | ✓ | ✓ | ✓ |
| Timetable | ✓ | ✓ | ✓ |
| Academic Planning | ✗ | ✓ | ✓ |
| AI Content Generation | ✗ | ✓ | ✓ |
| AI Question Generation | ✗ | ✓ | ✓ |
| Advanced Analytics | ✗ | ✗ | ✓ |
| Custom Reports | ✗ | ✗ | ✓ |
| API Access | ✗ | ✗ | ✓ |

---

## Data Flow

```text
Source: SuperAdmin creates institute
         │
         ▼
Storage: instituteData.ts
         ├── institutes[]
         ├── instituteCurricula[]
         └── instituteCourses[]
         │
         ▼
Downstream:
├── Institute Admin Portal access
├── Master Data filtering
├── Feature availability (tier-based)
└── Reporting scope
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Institute Creation | Institute Portal | Downstream | Enables admin login |
| Curriculum Assignment | Institute Master Data | Downstream | Filters visible curricula |
| Course Assignment | Institute Batch Creation | Downstream | Available track options |
| Tier Assignment | Institute Features | Downstream | Enables/disables features |
| Status Change | All Institute Users | Downstream | Login enabled/disabled |
| Custom Course | Course Builder | Both | Creates institute-specific course |

---

## Business Rules

1. **Institute codes must be unique** across platform
2. **At least one curriculum OR course recommended** for activation (can skip)
3. **Admin account created** with institute (Step 2)
4. **Tier limits enforced** - Cannot exceed batch/teacher/student limits
5. **Inactive institutes** - Users cannot login
6. **Curriculum removal** - Only if no batches using it
7. **Course removal** - Only if no batches using it
8. **Custom courses** - Exclusive to the creating institute

---

## Mobile Behavior

- Table: Horizontal scroll, priority columns
- Filters: Collapsible filter panel with pills
- Add Institute wizard: Full-screen stepped flow
- Actions: Bottom action sheet
- Plan selection: Swipeable card carousel
- Tier config: Bottom drawer
- Touch targets: Minimum 44px

---

## Related Documentation

- [Institute Portal Overview](../02-institute/README.md)
- [Users Management](./users.md)
- [Tier Management](./tier-management.md)
- [SuperAdmin Smoke Tests](../06-testing-scenarios/smoke-tests/superadmin.md)
- [Institute Intra-Login Tests](../06-testing-scenarios/intra-login-tests/superadmin.md)

---

*Last Updated: January 2025*
