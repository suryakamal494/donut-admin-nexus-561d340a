# Classroom Mode

> Teacher-led content structured as lesson bundles.

---

## Overview

Classroom Mode presents teacher-created lesson plans as "Lesson Bundles" - structured sequences of content that follow the LEARN → CHECK → PRACTICE → SUBMIT flow. Students progress through content as designed by their teacher.

## Access

- **Route**: `/student/chapter/:id` (Classroom tab)
- **Login Types**: Student
- **Permissions Required**: Enrolled in batch with assigned lessons

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| BundleList | Virtualized lesson list | Main content |
| BundleCard | Lesson session summary | Within list |
| BundleHeader | Date + teacher info | Card header |
| ContentItemCard | Individual content piece | Within bundle |
| HomeworkTag | Homework indicator | On content item |

---

## Features & Functionality

### Lesson Bundle Card

```text
┌─────────────────────────────────────────────────────────────┐
│ Class Session: January 15, 2025                             │
│ Dr. Rajesh Kumar                                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ ✓ 🎬 Newton's Laws Introduction              15 min        │
│ ✓ 📝 Key Concepts - Force and Motion         5 min         │
│ ○ ❓ Quick Check Quiz                         5 min         │
│ ○ 📚 Practice Worksheet              [Due: Jan 18]         │
│                                                              │
│ Progress: 2/4 complete                                      │
├─────────────────────────────────────────────────────────────┤
│ [Continue →]                                                │
└─────────────────────────────────────────────────────────────┘
```

### Bundle Components

| Type | Icon | Description |
|------|------|-------------|
| Video | 🎬 | Lecture videos |
| Notes | 📝 | Reading material |
| Quiz | ❓ | Quick assessment |
| Homework | 📚 | Assignment with deadline |
| Activity | 🎯 | Interactive content |
| Resource | 📎 | Additional materials |

### Content Item States

| State | Visual | Meaning |
|-------|--------|---------|
| Completed | ✓ Green | Finished |
| In Progress | ◐ Amber | Started |
| Available | ○ Gray | Ready to start |
| Locked | 🔒 | Complete previous first |

### Homework Tag

```text
📚 Practice Worksheet [Practice] [Due: Jan 18]
   Submit file or text answer
   [Open Submission →]
```

Homework types shown:
- Practice (blue)
- Test (purple)
- Project (orange)

### Sequential Flow

Within a bundle, content follows teacher-defined sequence:
1. Complete item → Next unlocks
2. Skip available → Continue but incomplete
3. All complete → Bundle marked done

---

## Data Flow

```text
Source: Teacher Lesson Plans
         │
         ▼
Transform: Group by session/date
         │
         ▼
Display: Lesson bundles
         │
         ▼
Interaction:
├── View content → Content Viewer
├── Take quiz → Quiz interface
├── Submit homework → Submission Sheet
└── Track progress → Update completion
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Lesson Bundles | Teacher Lesson Plans | Upstream | Content source |
| Content Items | Content Viewer | Navigation | Opens viewer |
| Homework | Homework Submission | Navigation | Opens submission |
| Progress | Teacher View | Upstream | Teacher sees completion |

---

## Business Rules

1. **Only assigned bundles** visible
2. **Sequence enforced** if teacher set
3. **Due dates respected** for homework
4. **Completion tracked** per item
5. **Bundle date** = class session date
6. **Late access allowed** for past lessons

---

## Mobile Behavior

- Bundle list: Virtualized for performance
- Bundle cards: Full-width, expandable
- Content items: Tap to open
- Homework: Opens submission sheet
- Touch targets: 44px minimum

### Virtualization

Uses `@tanstack/react-virtual`:
- 60fps scrolling
- Dynamic row heights
- Overscan for smoothness

---

## Related Documentation

- [Chapter View](./chapter-view.md)
- [Content Viewer](./content-viewer.md)
- [Homework Submission](./homework.md)
- [Student Smoke Tests](../06-testing-scenarios/smoke-tests/student.md)

---

*Last Updated: January 2025*
