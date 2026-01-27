# Master Data - Course Builder

> Create specialized courses (JEE, NEET) by mapping curriculum chapters and adding exclusive content.

---

## Overview

The Course Builder allows creation of specialized academic tracks that combine standard curriculum chapters with course-specific content. Courses like "JEE Mains", "NEET", or "Foundation" can map chapters from multiple curriculum classes and add exclusive chapters.

## Access

- **Route**: `/superadmin/courses`
- **Login Types**: SuperAdmin
- **Permissions Required**: `masterData.view`, `masterData.create`, `masterData.edit`, `masterData.delete`

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| PageHeader | Title + "Create Course" action | Top |
| CourseGrid | Cards for each course | Main content |
| CourseBuilder | Multi-step creation wizard | Dialog |
| ChapterMapper | Chapter selection interface | Within builder |

---

## Features & Functionality

### Course Structure

```text
Course (e.g., JEE Mains)
├── Subject: Physics
│   ├── Mapped Chapter: Mechanics (from CBSE 11)
│   ├── Mapped Chapter: Thermodynamics (from CBSE 11)
│   ├── Mapped Chapter: Electromagnetism (from CBSE 12)
│   └── Exclusive Chapter: JEE Advanced Problems
├── Subject: Chemistry
│   ├── Mapped Chapters...
│   └── Exclusive Chapters...
└── Subject: Mathematics
    └── ...
```

### Create Course Wizard

**Step 1: Course Details**
- Course name
- Description
- Target audience
- Duration

**Step 2: Select Subjects**
- Choose subjects to include
- Subjects can span multiple curriculum classes

**Step 3: Map Chapters**
- For each subject:
  - Select chapters from curriculum (CBSE 11, CBSE 12, etc.)
  - Add course-exclusive chapters
  - Set chapter sequence

**Step 4: Review & Create**
- Preview complete structure
- Confirm and create

### Chapter Types

| Type | Description | Source |
|------|-------------|--------|
| **Mapped Chapter** | Linked to curriculum chapter | From CBSE/ICSE class |
| **Exclusive Chapter** | Course-specific content | Created in course |

### Manage Courses

| Action | How | Result |
|--------|-----|--------|
| Create Course | Click "Create Course" | Opens wizard |
| Edit Course | Click edit on card | Modify structure |
| Delete Course | Click delete on card | Removes course |
| View Details | Click course card | Expands structure |

### Chapter Mapping

```text
JEE Mains Physics:
├── From CBSE 11:
│   ├── ✓ Units and Measurements
│   ├── ✓ Motion in a Straight Line
│   ├── ✓ Laws of Motion
│   └── ...
├── From CBSE 12:
│   ├── ✓ Electric Charges and Fields
│   ├── ✓ Electrostatic Potential
│   └── ...
└── Course Exclusive:
    ├── + JEE Problem Solving Strategies
    └── + Previous Year Analysis
```

---

## Data Flow

```text
Source: Curriculum chapters (masterData.ts)
         │
         ▼
Mapping: Course-Chapter Relationships
         ├── courseId → chapterId (mapped)
         └── courseId → exclusiveChapters[]
         │
         ▼
Storage: masterData.ts
         ├── courses[]
         └── courseChapterMappings[]
         │
         ▼
Consumers:
├── Institute Master Data (track view)
├── Batch Creation (track selection)
├── Content Classification
└── Question Classification
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Course | Institute Track View | Downstream | Visible in unified track list |
| Course | Batch Creation | Downstream | Available as academic track |
| Mapped Chapters | Content/Questions | Downstream | Classification includes course context |
| Exclusive Chapters | Content Creation | Downstream | Only course-linked content |

---

## Business Rules

1. **Course names must be unique** across the platform
2. **Subjects must match curriculum** - can only include subjects that exist in some curriculum
3. **Mapped chapters maintain link** - updates in curriculum propagate to course
4. **Exclusive chapters are owned** - only editable in course context
5. **80/20 typical ratio** - ~80% mapped, ~20% exclusive chapters
6. **Multi-class mapping** - can map chapters from different classes (e.g., Class 11 + 12)

---

## Mobile Behavior

- Course cards: Full-width stacked
- Creation wizard: Full-screen stepped flow
- Chapter mapper: Accordion with checkboxes
- Drag-and-drop disabled on mobile (use move buttons)

---

## Related Documentation

- [Master Data - Curriculum](./master-data-curriculum.md)
- [Institute Master Data View](../02-institute/master-data.md)
- [Curriculum Flow](../05-cross-login-flows/curriculum-course-flow.md)
- [SuperAdmin Smoke Tests](../06-testing-scenarios/smoke-tests/superadmin.md)

---

*Last Updated: January 2025*
