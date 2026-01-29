# Master Data - Curriculum Management

> Create and manage curriculum structures: classes, subjects, chapters, and topics.

---

## Overview

The Curriculum Management module is the foundation of the platform's academic structure. It defines the hierarchy of educational content that flows down to all institutes, teachers, and students.

A **Curriculum** represents a standard academic board structure (e.g., CBSE, ICSE, State Board). It serves as the top-level organizational unit for academic content.

## Access

- **Route**: `/superadmin/parameters`
- **Login Types**: SuperAdmin
- **Permissions Required**: `masterData.view`, `masterData.create`, `masterData.edit`, `masterData.delete`

---

## How Curriculums Are Created

Understanding the creation hierarchy is essential for proper data entry:

### Independent Elements

These can be created separately without any dependencies:

| Element | Description | How to Create |
|---------|-------------|---------------|
| **Curriculum** | Board/framework (CBSE, ICSE) | Quick Add → Add Curriculum |
| **Class** | Grade levels (Class 1-12) | Click "+" in ClassPanel |
| **Subject** | Academic subjects (Physics, Chemistry) | Select any class → Click "+" in SubjectPanel |

### Dependent Elements

These require parent elements to be selected first:

| Element | Required Selection | How to Create |
|---------|-------------------|---------------|
| **Chapter** | Curriculum → Class → Subject | Quick Add → Add Chapter |
| **Topic** | Curriculum → Class → Subject → Chapter | Quick Add → Add Topic |

### Creation Flow

```text
1. Create Curriculum (e.g., CBSE) ─────────────────► Independent
2. Create Classes (e.g., Class 11, 12) ────────────► Independent  
3. Create Subjects (e.g., Physics, Chemistry) ─────► Independent
4. Select Curriculum → Class → Subject ────────────► Then Add Chapters
5. Select Curriculum → Class → Subject → Chapter ──► Then Add Topics
```

### Bulk Entry Support

Chapters and Topics support **bulk paste** (one item per line):
1. Copy multiple chapter/topic names from any source
2. Paste into the Add Chapter/Topic dialog
3. System parses each line as a separate entry
4. All items created in one operation

This is useful for quickly populating curriculum structure from existing syllabi.

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| PageHeader | Title + Quick Add dropdown | Top |
| CurriculumTabs | Tab per curriculum (CBSE, ICSE, etc.) | Below header |
| ClassPanel | Left panel with class list | Left sidebar |
| SubjectPanel | Middle panel with subjects | Center |
| ContentPanel | Right panel with chapters/topics | Right (scrollable) |

---

## Curriculum Structure

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

---

## Features & Functionality

### Create Curriculum

1. Click Quick Add → "Add Curriculum"
2. Enter curriculum name (e.g., "CBSE", "ICSE")
3. Curriculum created as new tab

### Manage Classes

| Action | How | Result |
|--------|-----|--------|
| Add Class | Click "+" in ClassPanel | New class added (independent) |
| Rename Class | Click edit icon | Edit dialog opens |
| Reorder | Drag and drop | Updates display order |

### Manage Subjects

| Action | How | Result |
|--------|-----|--------|
| Add Subject | Select any class → Click "+" in SubjectPanel | New subject added (independent) |
| Edit Subject | Click edit icon | Edit name, color, icon |

### Manage Chapters

**Prerequisite**: Must select Curriculum → Class → Subject first

| Action | How | Result |
|--------|-----|--------|
| Add Single Chapter | Quick Add → Add Chapter, enter 1 name | Chapter added to selected subject |
| Add Multiple Chapters | Quick Add → Add Chapter, paste multiple lines | All chapters created |
| Edit Chapter | Click edit icon in ContentPanel | Edit name, description |
| Reorder | Drag and drop | Updates sequence |

### Manage Topics

**Prerequisite**: Must select Curriculum → Class → Subject → Chapter first

| Action | How | Result |
|--------|-----|--------|
| Add Single Topic | Quick Add → Add Topic, enter 1 name | Topic added under selected chapter |
| Add Multiple Topics | Quick Add → Add Topic, paste multiple lines | All topics created |
| Edit Topic | Click edit icon | Edit name |
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
| Chapters | Course Builder | Downstream | Available for mapping to courses |

---

## Business Rules

1. **Curriculum names must be unique** across the platform
2. **Classes are sequential** (1-12 for K-12, or custom)
3. **Subjects require a class selection** for association (but can be created independently)
4. **Chapters require Curriculum + Class + Subject** - must be selected first
5. **Topics require Curriculum + Class + Subject + Chapter** - must be selected first
6. **Deletion cascades** - deleting a class removes all children
7. **Used items cannot be deleted** - if content/questions reference a chapter, it cannot be deleted

---

## Mobile Behavior

- Three-panel view collapses to single panel with navigation
- Swipe between Class → Subject → Content panels
- Bottom sheet for add/edit dialogs
- Long-press for context menu (edit)
- Touch targets minimum 44px

---

## Related Documentation

- [Master Data - Courses](./master-data-courses.md)
- [Institute Master Data View](../02-institute/master-data.md)
- [Curriculum Flow](../05-cross-login-flows/curriculum-course-flow.md)
- [SuperAdmin Smoke Tests](../06-testing-scenarios/smoke-tests/superadmin.md)

---

*Last Updated: January 2025*
