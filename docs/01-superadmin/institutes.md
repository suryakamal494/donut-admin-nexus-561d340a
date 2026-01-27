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
| PageHeader | Title + "Add Institute" action | Top |
| FilterBar | Search, status, tier filters | Below header |
| InstituteTable | List of all institutes | Main content |
| InstituteForm | Create/edit institute | Dialog |
| TierConfigDialog | Tier assignment | Dialog |

---

## Features & Functionality

### Institute Properties

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
| Tier | Enum | Basic, Standard, Premium |
| Curricula | Multi-select | Assigned curricula |
| Courses | Multi-select | Assigned courses |

### Create Institute Flow

1. Click "Add Institute"
2. Fill basic details (name, code, type)
3. Add contact information
4. Select curricula and courses
5. Assign feature tier
6. Create admin account
7. Activate institute

### Institute Tiers

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

### Manage Institutes

| Action | How | Result |
|--------|-----|--------|
| View | Click row | Opens detail view |
| Edit | Click edit icon | Edit dialog |
| Change Status | Status dropdown | Activate/deactivate |
| Change Tier | Tier button | Tier config dialog |
| Delete | Click delete | Confirmation + remove |

### Assign Curricula/Courses

```text
Institute: ABC School
├── Assigned Curricula:
│   ├── ✓ CBSE
│   └── ✓ ICSE
└── Assigned Courses:
    ├── ✓ JEE Foundation
    └── ✓ NEET Foundation
```

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

---

## Business Rules

1. **Institute codes must be unique** across platform
2. **At least one curriculum required** for activation
3. **Admin account created** with institute
4. **Tier limits enforced** - cannot exceed batch/teacher/student limits
5. **Inactive institutes** - users cannot login
6. **Curriculum removal** - only if no batches using it
7. **Course removal** - only if no batches using it

---

## Mobile Behavior

- Table: Horizontal scroll, priority columns
- Filters: Collapsible filter panel
- Create form: Full-screen stepped flow
- Actions: Bottom action sheet
- Tier config: Bottom drawer

---

## Related Documentation

- [Institute Portal Overview](../02-institute/README.md)
- [Users Management](./users.md)
- [SuperAdmin Smoke Tests](../06-testing-scenarios/smoke-tests/superadmin.md)
- [Institute Intra-Login Tests](../06-testing-scenarios/intra-login-tests/superadmin.md)

---

*Last Updated: January 2025*
