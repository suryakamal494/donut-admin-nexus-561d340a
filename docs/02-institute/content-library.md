# Institute Content Library

> Manage institute-specific content alongside global content.

---

## Overview

The Institute Content Library provides a unified interface for managing both institute-created content and viewing global content from SuperAdmin. Institute admins can create local content, upload materials, and use AI generation while having read-only access to platform-wide resources.

## Access

- **Route**: `/institute/content`
- **Login Types**: Institute Admin
- **Permissions Required**: `contentLibrary.view`, `contentLibrary.create`, `contentLibrary.edit`, `contentLibrary.delete`

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| PageHeader | Title + create actions | Top |
| SourceToggle | Global / Institute filter | Below header |
| FilterBar | Type, class, subject filters | With toggle |
| ContentGrid | Content cards with pagination | Main content |
| ContentForm | Create/edit content | Full page |
| AIGenerator | AI content wizard | Dialog |

---

## Features & Functionality

### Source Toggle

| Source | Description | Actions |
|--------|-------------|---------|
| **All** | Global + Institute content | Mixed view |
| **Global** | SuperAdmin content | View only |
| **Institute** | Local content | Full CRUD |

### Content Cards

```text
┌─────────────────────────────────────────────────────────────┐
│ 📄 [PDF]  [Global]                                          │
│                                                              │
│ NCERT Physics Chapter 3 - Motion                            │
│ Class 10 • Physics • Motion                                 │
│                                                              │
│ 12 pages • Added Jan 5, 2025                                │
│                                                              │
│ [View] [Assign] (no edit/delete for Global)                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 🎬 [Video]  [Institute]                                     │
│                                                              │
│ Force and Motion - Visual Explanation                       │
│ Class 10 • Physics • Force                                  │
│                                                              │
│ 15 min • Added Jan 10, 2025                                 │
│                                                              │
│ [View] [Edit] [Delete] [Assign]                             │
└─────────────────────────────────────────────────────────────┘
```

### Create Content Paths

**Path 1: Manual Upload**
1. Click "Upload Content"
2. Select file (mobile: native file picker)
3. Fill classification
4. Add metadata
5. Save

**Path 2: AI Generation**
1. Click "AI Generate"
2. Step 1: Classification
3. Step 2: Prompt + format selection
4. Step 3: Preview + edit
5. Save

### Filtering

| Filter | Options | Notes |
|--------|---------|-------|
| Source | All, Global, Institute | Primary filter |
| Type | Video, PDF, etc. | Content format |
| Class | From curriculum | Cascading |
| Subject | Filtered by class | Cascading |
| Chapter | Filtered by subject | Optional |

### Pagination

- 15 items per page
- Load more button
- Total count displayed

---

## Data Flow

```text
Sources:
├── SuperAdmin Content (source: 'global')
└── Institute Content (source: 'institute')
         │
         ▼
Display:
├── Merged by source toggle
├── Filtered by classification
└── Sorted by date
         │
         ▼
Downstream:
├── Teacher Content Library (subject-scoped)
└── Student (via assignment)
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Global Content | SuperAdmin | Upstream | Read-only view |
| Institute Content | Teacher Library | Downstream | Subject-scoped view |
| Content Assignment | Students | Downstream | Batch assignment |

---

## Business Rules

1. **Global content read-only** - cannot edit/delete
2. **Institute content editable** by any admin
3. **Classification required** for all content
4. **File size limits** enforced (video: 500MB)
5. **Supported formats** validated
6. **Assignment requires** active batches
7. **Deletion blocked** if content assigned

---

## Mobile Behavior

- Content grid: 1 column
- Filters: Horizontal scroll pills
- Source toggle: Segmented control
- Create: FAB (Floating Action Button)
- Upload: Native file picker
- Preview: Full-screen viewer
- Actions: Stacked on mobile (icons only)

---

## Related Documentation

- [SuperAdmin Content Library](../01-superadmin/content-library.md)
- [Teacher Content Library](../03-teacher/content-library.md)
- [Content Propagation](../05-cross-login-flows/content-propagation.md)
- [Institute Smoke Tests](../06-testing-scenarios/smoke-tests/institute.md)

---

*Last Updated: January 2025*
