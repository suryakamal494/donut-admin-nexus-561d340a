# SuperAdmin Dashboard

> Platform overview with key metrics, recent activity, and quick actions.

---

## Overview

The SuperAdmin Dashboard provides a high-level view of platform health and recent activity. It serves as the landing page after login and offers quick navigation to common tasks.

## Access

- **Route**: `/superadmin/dashboard`
- **Login Types**: SuperAdmin, Admin roles with dashboard access
- **Permissions Required**: `dashboard.view`

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| PageHeader | "Dashboard" title | Top |
| StatsGrid | Key platform metrics | Below header |
| RecentActivity | Latest platform actions | Main content |
| QuickActions | Common task shortcuts | Sidebar/Bottom |

---

## Features & Functionality

### Platform Statistics

| Metric | Description | Data Source |
|--------|-------------|-------------|
| Total Institutes | Active institute count | `instituteData` |
| Total Users | Platform-wide user count | All user tables |
| Content Items | Global content count | `contentLibraryData` |
| Questions | Global question count | `questionsData` |
| Active Exams | Published PYP/Grand Tests | `examsData` |

### Recent Activity Feed

Displays recent platform actions:
- New institute registrations
- Content uploads
- Question bank additions
- Exam publications

### Quick Actions

| Action | Navigates To | Description |
|--------|--------------|-------------|
| Add Institute | `/superadmin/institutes` | Create new institute |
| Create Content | `/superadmin/content` | Add global content |
| Add Questions | `/superadmin/questions` | Add to question bank |
| Create Exam | `/superadmin/exams` | Create PYP/Grand Test |

---

## Data Flow

```text
Data Sources:
├── instituteData.ts → Institute count, status
├── contentLibraryData.ts → Content metrics
├── questionsData.ts → Question metrics
└── examsData.ts → Exam metrics

Aggregation:
└── Dashboard component → Computes totals, filters recent
```

---

## Cross-Login Connections

| Dashboard Element | Connects To | Direction | What Happens |
|-------------------|-------------|-----------|--------------|
| Institute count | Institute portals | Downstream | Shows active institutes |
| Content count | Institute/Teacher libraries | Downstream | Global content visible |
| Question count | Institute/Teacher question banks | Downstream | Available for exam creation |

---

## Business Rules

1. Dashboard loads with cached data for instant display
2. Metrics refresh on page reload
3. Recent activity shows last 10 items
4. Quick actions respect user permissions

---

## Mobile Behavior

- Stats grid: 2x2 on mobile, 4x1 on desktop
- Recent activity: Full-width cards
- Quick actions: Fixed bottom bar on mobile
- Touch targets: 44px minimum

---

## Related Documentation

- [Institutes Management](./institutes.md)
- [Content Library](./content-library.md)
- [Question Bank](./question-bank.md)
- [SuperAdmin Smoke Tests](../06-testing-scenarios/smoke-tests/superadmin.md)

---

*Last Updated: January 2025*
