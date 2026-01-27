# Subjects & Navigation

> Subject cards and chapter navigation for learning content.

---

## Overview

The Subjects page displays all subjects in the student's curriculum as visually distinct cards. Each subject uses consistent branding (colors, icons, patterns) that flows through to chapters and content, creating a cohesive learning experience.

## Access

- **Route**: `/student/subjects`
- **Login Types**: Student
- **Permissions Required**: Enrolled in batch

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| PageHeader | Title | Top |
| SubjectGrid | Subject cards | Main content |
| SubjectCard | Individual subject | Within grid |
| ProgressBadge | Completion indicator | On card |

---

## Features & Functionality

### Subject Card

```text
┌─────────────────────────────────────────────────────────────┐
│ ┌───────────────────────────────────────────────────────┐   │
│ │                                                       │   │
│ │                    ⚛️ Physics                         │   │
│ │                                                       │   │
│ │     ████████████████░░░░░░░░  68% Complete           │   │
│ │                                                       │   │
│ │     12 Chapters • 4 Active                           │   │
│ │                                                       │   │
│ └───────────────────────────────────────────────────────┘   │
│                                                              │
│ [Continue Learning →]                                        │
└─────────────────────────────────────────────────────────────┘
```

### Subject Color Schemes

Each subject has a consistent color scheme used throughout:

| Subject | Colors | Gradient |
|---------|--------|----------|
| Physics | Blue | from-blue-500 to-blue-600 |
| Chemistry | Purple | from-purple-500 to-purple-600 |
| Mathematics | Green | from-green-500 to-green-600 |
| Biology | Red | from-red-500 to-red-600 |
| English | Amber | from-amber-500 to-amber-600 |

### Subject Icons

Mapped via `subjectIconMap`:
- Physics: ⚛️ Atom
- Chemistry: 🧪 Flask
- Mathematics: 📐 Ruler
- Biology: 🧬 DNA
- English: 📖 Book

### Progress Display

| Progress | Visual | State |
|----------|--------|-------|
| 0-25% | Red progress | Just started |
| 25-50% | Amber progress | In progress |
| 50-75% | Blue progress | Good progress |
| 75-100% | Green progress | Near complete |

### Card Interactions

- **Tap card**: Navigate to subject detail
- **Continue button**: Go to active chapter
- **Progress bar**: Visual completion

---

## Subject Detail Page

**Route**: `/student/subject/:id`

Displays chapter list for selected subject:

```text
Physics - Chapters
┌─────────────────────────────────────────────────────────────┐
│ 1. Motion                                        ✓ Complete │
│    4 lessons • 2 quizzes                                    │
├─────────────────────────────────────────────────────────────┤
│ 2. Laws of Motion                               ◐ 60%      │
│    6 lessons • 3 quizzes                                    │
│    [Continue →]                                             │
├─────────────────────────────────────────────────────────────┤
│ 3. Gravitation                                   ○ Locked   │
│    5 lessons • 2 quizzes                                    │
└─────────────────────────────────────────────────────────────┘
```

### Chapter States

| State | Icon | Meaning |
|-------|------|---------|
| Complete | ✓ | All content finished |
| In Progress | ◐ % | Partially complete |
| Available | ○ | Can start |
| Locked | 🔒 | Prerequisites needed |

---

## Data Flow

```text
Source: Batch curriculum assignment
         │
         ▼
Filter: Student's enrolled subjects
         │
         ▼
Enhance: Add progress data
         │
         ▼
Display: Color-coded cards
         │
         ▼
Navigation: Subject → Chapters → Content
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Subjects | Batch Curriculum | Upstream | Determines visible subjects |
| Progress | Content Completion | Local | Tracks completion |
| Chapters | Chapter View | Navigation | Opens three-mode view |

---

## Business Rules

1. **Only enrolled subjects** shown
2. **Progress calculated** from content completion
3. **Chapter locking** based on sequence or teacher setting
4. **Color consistency** maintained across views
5. **Active chapters** prioritized in display

---

## Mobile Behavior

- Subject cards: Full-width stack
- Progress bar: Touch to see details
- Navigation: Swipe between subjects
- Chapter list: Vertical scroll
- Touch targets: 44px minimum

### Shared Branding Utility

`subjectColors.ts` provides:
- `subjectColorSchemes`: 6 color variants
- `gradient`: Light background wash
- `headerGradient`: Solid color header
- `subjectIconMap`: Icon mappings
- `subjectPatternMap`: Background patterns

---

## Related Documentation

- [Chapter View](./chapter-view.md)
- [Classroom Mode](./classroom-mode.md)
- [Dashboard](./dashboard.md)
- [Student Smoke Tests](../06-testing-scenarios/smoke-tests/student.md)

---

*Last Updated: January 2025*
