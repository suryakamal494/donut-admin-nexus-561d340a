# Master Data View

> Read-only view of curriculum and course structures assigned to the institute.

---

## Overview

The Master Data view provides institute administrators with a read-only view of the curriculum and course structures assigned by SuperAdmin. This is the reference for academic content structure that powers batches, timetables, and content classification.

## Access

- **Route**: `/institute/masterdata`
- **Login Types**: Institute Admin
- **Permissions Required**: `masterData.view`

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| PageHeader | Title (no actions - read-only) | Top |
| TrackTabs | Tabs for curricula + courses | Below header |
| ClassPanel | Class list (curriculum tracks) | Left panel |
| SubjectPanel | Subject list | Center panel |
| ContentPanel | Chapters + topics | Right panel |

---

## Features & Functionality

### Unified Track View

The view treats **Curricula** and **Courses** identically as "Tracks":

```text
Track Tabs:
├── CBSE (Curriculum)
├── ICSE (Curriculum)
├── JEE Mains (Course)
└── NEET Foundation (Course)
```

### Layout Adaptation

| Track Type | Layout | Panels |
|------------|--------|--------|
| Curriculum (CBSE) | 3-Panel | Class → Subject → Content |
| Course (JEE) | 2-Panel | Subject → Content |

### Curriculum View (3-Panel)

```text
┌─────────────┬─────────────┬────────────────────────┐
│   CLASSES   │  SUBJECTS   │       CHAPTERS         │
├─────────────┼─────────────┼────────────────────────┤
│ • Class 10  │ • Physics   │ ▼ Motion               │
│   Class 11  │ • Chemistry │   • Uniform Motion     │
│   Class 12  │   Maths     │   • Non-uniform Motion │
│             │   English   │ ▼ Force and Laws       │
│             │             │   • Newton's First Law │
└─────────────┴─────────────┴────────────────────────┘
```

### Course View (2-Panel)

```text
┌─────────────────┬──────────────────────────────────┐
│    SUBJECTS     │           CHAPTERS               │
├─────────────────┼──────────────────────────────────┤
│ • Physics       │ ▼ From CBSE 11                   │
│   Chemistry     │   • Motion in a Straight Line   │
│   Mathematics   │   • Laws of Motion              │
│                 │ ▼ From CBSE 12                   │
│                 │   • Electric Charges            │
│                 │ ▼ Course Exclusive               │
│                 │   • JEE Problem Strategies      │
└─────────────────┴──────────────────────────────────┘
```

### Chapter Source Grouping

For course tracks, chapters are grouped by their source:

| Source | Display | Description |
|--------|---------|-------------|
| From CBSE 11 | Section header | Mapped from curriculum |
| From CBSE 12 | Section header | Mapped from curriculum |
| Course Exclusive | Highlighted | Course-specific content |

### Stats Display

| Stat | Description |
|------|-------------|
| Total Subjects | Count for selected track/class |
| Total Chapters | Count for selected subject |
| Total Topics | Count for selected chapter |

### Navigation

- Click class → Filters subjects for that class
- Click subject → Shows chapters in content panel
- Click chapter → Expands to show topics
- All read-only - no edit actions

---

## Data Flow

```text
Source: SuperAdmin Master Data
         ├── Curriculums assigned to institute
         ├── Courses assigned to institute
         ├── Classes, Subjects, Chapters, Topics
         └── Course-chapter mappings
         │
         ▼
Institute View:
├── Filtered by assignment
├── Grouped by track type
└── Read-only display
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Master Data | Batch Creation | Local | Class options |
| Master Data | Content Creation | Local | Classification options |
| Master Data | Question Creation | Local | Classification options |
| Master Data | Academic Setup | Local | Chapter list for planning |

---

## Business Rules

1. **Read-only** - no editing allowed at institute level
2. **Filtered by assignment** - only shows assigned curricula/courses
3. **Real-time sync** - updates when SuperAdmin changes
4. **Subject filtering** - only subjects with data shown
5. **Dynamic layout** - adapts to track type

---

## Mobile Behavior

- Single panel view with navigation
- Swipe between Class → Subject → Content
- Breadcrumb navigation at top
- Collapsible sections for chapters/topics
- Search available within panels

---

## Related Documentation

- [SuperAdmin Master Data](../01-superadmin/master-data-curriculum.md)
- [Batches](./batches.md)
- [Curriculum Flow](../05-cross-login-flows/curriculum-course-flow.md)
- [Institute Smoke Tests](../06-testing-scenarios/smoke-tests/institute.md)

---

*Last Updated: January 2025*
