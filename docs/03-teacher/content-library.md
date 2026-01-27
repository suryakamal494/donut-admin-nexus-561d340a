# Teacher Content Library

> Create, manage, and assign content to student batches.

---

## Overview

The Teacher Content Library provides access to global, institute, and personally created content. Teachers can create new content via upload or AI generation, and assign content to their batches for student access.

## Access

- **Route**: `/teacher/content`
- **Login Types**: Teacher
- **Permissions Required**: Teacher account

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| PageHeader | Title + create actions | Top |
| SourceToggle | Global/Institute/My Content | Below header |
| FilterPanel | Collapsible filters | Below toggle |
| ContentGrid | Content cards | Main content |
| ContentForm | Upload content | Full page |
| AIGenerator | AI content wizard | Dialog |
| AssignDialog | Batch assignment | Dialog |

---

## Features & Functionality

### Source Toggle

| Source | Description | Actions |
|--------|-------------|---------|
| **All** | All accessible content | View, Assign |
| **Global** | SuperAdmin content | View only |
| **Institute** | Institute content | View, Assign |
| **My Content** | Teacher-created | Full CRUD |

### Content Ownership

| Ownership | Badge | Edit | Delete | Assign |
|-----------|-------|------|--------|--------|
| Global | "Global" | ❌ | ❌ | ✅ |
| Institute | "Institute" | ❌ | ❌ | ✅ |
| Own | "My Content" + User icon | ✅ | ✅ | ✅ |

### Content Card

```text
┌─────────────────────────────────────────────────────────────┐
│ 🎬 [Video]  [My Content] 👤                                 │
│                                                              │
│ Force and Motion Explained                                  │
│ Physics • Laws of Motion • Class 10                         │
│                                                              │
│ 15 min • Created Jan 10, 2025                               │
│                                                              │
│ [View] [Edit] [Delete] [Assign]                             │
└─────────────────────────────────────────────────────────────┘
```

### Create Content Paths

**Path 1: Upload Content**
1. Click "Upload Content"
2. Select file (mobile: native picker)
3. Fill classification (subject, chapter)
4. Add metadata
5. Save

**Path 2: AI Generate**
1. Click "AI Generate"
2. Step 1: Classification
3. Step 2: Prompt + format
4. Step 3: Preview + edit
5. Save

### Assign to Batches

1. Click "Assign" on content
2. ResponsiveDialog opens:
   ```text
   Assign Content to Batches
   ┌─────────────────────────────────────────────────────────┐
   │ ☐ 10A - Physics Morning (35 students)                  │
   │ ☐ 10B - Physics Evening (32 students)                  │
   │ ☑ 11A - JEE Physics (45 students)                      │
   └─────────────────────────────────────────────────────────┘
   [Cancel] [Assign to Selected]
   ```
3. Select batches
4. Confirm assignment

### Filtering

| Filter | Options | Notes |
|--------|---------|-------|
| Source | All/Global/Institute/My | Primary |
| Subject | Teacher's subjects | Scoped |
| Chapter | By subject | Cascading |
| Type | Video, PDF, etc. | Format |

---

## Data Flow

```text
Sources:
├── Global Content (SuperAdmin)
├── Institute Content
└── Teacher Content (own creation)
         │
         ▼
Filter: By teacher's assigned subjects
         │
         ▼
Display: Merged with source badges
         │
         ▼
Actions:
├── Create → Adds to "My Content"
├── Assign → Links to batch
└── Edit/Delete → Own content only
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Global Content | SuperAdmin | Upstream | Read-only |
| Institute Content | Institute | Upstream | Read-only |
| Content Assignment | Student | Downstream | Visible in chapter |
| Lesson Plan | Workspace | Local | Can add to blocks |

---

## Business Rules

1. **Subject-scoped view** - only assigned subjects
2. **Own content editable** - others read-only
3. **Assignment requires** active batches
4. **File size limits** enforced
5. **Classification required** for creation
6. **Deletion blocked** if in active lesson plans

---

## Mobile Behavior

- Content grid: 1 column
- Filters: Collapsible panel
- Create: FAB with menu
- Upload: Native file picker
- Assign: Bottom drawer
- Actions: Stacked, icons on mobile

---

## Related Documentation

- [Institute Content Library](../02-institute/content-library.md)
- [Lesson Workspace](./lesson-workspace.md)
- [Content Propagation](../05-cross-login-flows/content-propagation.md)
- [Teacher Smoke Tests](../06-testing-scenarios/smoke-tests/teacher.md)

---

*Last Updated: January 2025*
