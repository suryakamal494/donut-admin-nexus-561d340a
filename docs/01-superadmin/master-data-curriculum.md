# Master Data - Curriculum Management

> Create and manage curriculum structures: classes, subjects, chapters, and topics.

---

## Overview

The Curriculum Management module is the foundation of the platform's academic structure. It defines the hierarchy of educational content that flows down to all institutes, teachers, and students.

## Access

- **Route**: `/superadmin/curriculum`
- **Login Types**: SuperAdmin
- **Permissions Required**: `masterData.view`, `masterData.create`, `masterData.edit`, `masterData.delete`

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| PageHeader | Title + "Add Curriculum" action | Top |
| CurriculumTabs | Tab per curriculum (CBSE, ICSE, etc.) | Below header |
| ClassPanel | Left panel with class list | Left sidebar |
| SubjectPanel | Middle panel with subjects | Center |
| ContentPanel | Right panel with chapters/topics | Right |

---

## Features & Functionality

### Curriculum Structure

```text
Curriculum (e.g., CBSE)
├── Class 1
│   ├── Mathematics
│   │   ├── Chapter: Numbers
│   │   │   ├── Topic: Counting
│   │   │   └── Topic: Addition
│   │   └── Chapter: Shapes
│   └── Science
│       └── Chapter: Plants
├── Class 2
│   └── ...
└── Class 12
    └── ...
```

### Create Curriculum

1. Click "Add Curriculum"
2. Enter curriculum name (e.g., "CBSE", "ICSE")
3. Curriculum created with empty class structure

### Manage Classes

| Action | How | Result |
|--------|-----|--------|
| Add Class | Click "+" in class panel | New class added |
| Rename Class | Click edit icon | Edit dialog opens |
| Delete Class | Click delete icon | Removes class + all children |
| Reorder | Drag and drop | Updates display order |

### Manage Subjects

| Action | How | Result |
|--------|-----|--------|
| Add Subject | Click "+" in subject panel | New subject added to class |
| Edit Subject | Click edit icon | Edit name, color, icon |
| Delete Subject | Click delete icon | Removes subject + chapters |

### Manage Chapters

| Action | How | Result |
|--------|-----|--------|
| Add Chapter | Click "+" in content panel | New chapter in subject |
| Edit Chapter | Click edit icon | Edit name, description |
| Delete Chapter | Click delete icon | Removes chapter + topics |
| Reorder | Drag and drop | Updates sequence |

### Manage Topics

| Action | How | Result |
|--------|-----|--------|
| Add Topic | Click "+" under chapter | New topic in chapter |
| Edit Topic | Click edit icon | Edit name |
| Delete Topic | Click delete icon | Removes topic |
| Reorder | Drag and drop | Updates sequence |

---

## Data Flow

```text
Source: SuperAdmin creates curriculum structure
         │
         ▼
Storage: masterData.ts
         ├── curriculums[]
         ├── classes[]
         ├── subjects[]
         ├── chapters[]
         └── topics[]
         │
         ▼
Consumers:
├── Institute Master Data (read-only view)
├── Course Builder (chapter mapping)
├── Content Library (classification)
├── Question Bank (classification)
└── Exam Builder (classification)
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Curriculum | Institute Master Data | Downstream | Visible as read-only |
| Classes | Batch Creation | Downstream | Available for batch assignment |
| Subjects | Teacher Assignment | Downstream | Available for teacher scope |
| Chapters | Content/Questions | Downstream | Classification options |
| Chapters | Course Builder | Downstream | Available for mapping |

---

## Business Rules

1. **Curriculum names must be unique** across the platform
2. **Classes are sequential** (1-12 for K-12, or custom)
3. **Subjects require a class** - cannot exist independently
4. **Chapters require a subject** - cannot exist independently
5. **Topics require a chapter** - cannot exist independently
6. **Deletion cascades** - deleting a class removes all children
7. **Used items cannot be deleted** - if content/questions reference a chapter, it cannot be deleted

---

## Mobile Behavior

- Three-panel view collapses to single panel with navigation
- Swipe between Class → Subject → Content panels
- Bottom sheet for add/edit dialogs
- Long-press for context menu (edit, delete)

---

## Related Documentation

- [Master Data - Courses](./master-data-courses.md)
- [Institute Master Data View](../02-institute/master-data.md)
- [Curriculum Flow](../05-cross-login-flows/curriculum-course-flow.md)
- [SuperAdmin Smoke Tests](../06-testing-scenarios/smoke-tests/superadmin.md)

---

*Last Updated: January 2025*
