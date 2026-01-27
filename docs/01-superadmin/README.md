# SuperAdmin Portal

> Platform-wide administration for curricula, institutes, global content, and system configuration.

---

## Portal Overview

The SuperAdmin portal is the **platform administration layer** that manages:
- Curriculum and course structures
- Institute onboarding and management
- Global content library
- Platform-wide question bank
- Previous Year Papers (PYP) and Grand Tests
- Role-based access control for admin users

### Access

- **Base Route**: `/superadmin/*`
- **Login**: Portal selection at `/` → SuperAdmin
- **Role Required**: SuperAdmin or delegated admin role

---

## Portal Features

| Feature | Route | Description |
|---------|-------|-------------|
| [Dashboard](./dashboard.md) | `/superadmin/dashboard` | Platform overview and quick actions |
| [Master Data - Curriculum](./master-data-curriculum.md) | `/superadmin/curriculum` | Curriculum management (CBSE, ICSE, etc.) |
| [Master Data - Courses](./master-data-courses.md) | `/superadmin/courses` | Course builder (JEE, NEET, etc.) |
| [Institutes](./institutes.md) | `/superadmin/institutes` | Institute management and tier configuration |
| [Users](./users.md) | `/superadmin/users` | Platform user management |
| [Content Library](./content-library.md) | `/superadmin/content` | Global content management |
| [Question Bank](./question-bank.md) | `/superadmin/questions` | Global question bank with AI generation |
| [Exams](./exams.md) | `/superadmin/exams` | PYP and Grand Test management |
| [Roles & Access](./roles-access.md) | `/superadmin/roles` | RBAC for admin users |

---

## Data Ownership

SuperAdmin is the **source of truth** for:

```text
┌─────────────────────────────────────────────────────────────────────┐
│                     SUPERADMIN DATA OWNERSHIP                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  CREATES & OWNS                          VISIBILITY                  │
│  ─────────────────                       ──────────                  │
│  • Curricula (CBSE, ICSE)        →       All Institutes              │
│  • Courses (JEE, NEET)           →       Subscribed Institutes       │
│  • Classes, Subjects             →       All Institutes              │
│  • Chapters, Topics              →       All Institutes              │
│  • Global Content                →       All (read-only)             │
│  • Global Questions              →       All (for exam creation)     │
│  • PYP/Grand Tests               →       Assigned Institutes         │
│  • Institute Tiers               →       Institutes (for features)   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Permission Model

SuperAdmin roles have granular permissions:

| Module | Actions | Scope Options |
|--------|---------|---------------|
| Dashboard | View | N/A |
| Institutes | View, Create, Edit, Delete | + Tier Management |
| Users | View, Create, Edit, Delete | N/A |
| Master Data | View, Create, Edit, Delete | N/A |
| Content Library | View, Create, Edit, Delete | Class/Subject scope |
| Question Bank | View, Create, Edit, Delete | Class/Subject scope + AI/PDF capabilities |
| Exams | View, Create, Edit, Delete | PYP/Grand Test types |
| Roles & Access | View, Create, Edit, Delete | N/A |

---

## Key Workflows

### 1. Curriculum Setup Flow
```text
Create Curriculum → Add Classes → Add Subjects → Add Chapters → Add Topics
```

### 2. Course Setup Flow
```text
Create Course → Select Subjects → Map Chapters (from Curriculum) → Add Exclusive Chapters
```

### 3. Institute Onboarding Flow
```text
Create Institute → Assign Tier → Assign Curricula/Courses → Activate
```

### 4. Content Creation Flow
```text
Select Classification → Upload/Generate Content → Preview → Publish
```

### 5. Question Creation Flow
```text
Select Classification → Manual Entry OR AI Generate OR PDF Upload → Review → Save
```

---

## Cross-Login Connections

| SuperAdmin Action | Affects | How |
|-------------------|---------|-----|
| Creates Curriculum | Institute Master Data | Visible as read-only |
| Creates Global Content | Institute/Teacher Libraries | Visible with "Global" badge |
| Creates Global Questions | Institute/Teacher Question Banks | Available for exam creation |
| Creates PYP/Grand Test | Institute Exams | Can be assigned to batches |
| Updates Curriculum | All downstream | Propagates chapter/topic changes |
| Manages Institute Tier | Institute Features | Enables/disables features |

---

## Mobile Behavior

- **Dashboard**: Full-width cards, stacked stats
- **Tables**: Horizontal scroll, priority column hiding
- **Filters**: Horizontal scroll pills
- **Dialogs**: Full-screen drawers on mobile
- **Touch Targets**: Minimum 44px

---

## Related Documentation

- [Content Propagation Flow](../05-cross-login-flows/content-propagation.md)
- [Curriculum Flow](../05-cross-login-flows/curriculum-course-flow.md)
- [SuperAdmin Smoke Tests](../06-testing-scenarios/smoke-tests/superadmin.md)
- [Technical Architecture](../ARCHITECTURE.md)

---

*Last Updated: January 2025*
