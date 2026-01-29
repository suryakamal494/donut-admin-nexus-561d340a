# Master Data - Course Builder

> Create specialized courses (JEE, NEET, Olympiad) by mapping curriculum chapters and adding exclusive content.

---

## Overview

The Course Builder allows creation of specialized academic tracks that combine standard curriculum chapters with course-specific content. Unlike Curriculums which follow a Class-based hierarchy, Courses are flexible structures designed for competitive exams and specialized programs.

**Key Concept**: Courses PULL content from existing Curricula while allowing exclusive additions.

## Access

- **Route**: `/superadmin/parameters/courses` (Courses View)
- **Route**: `/superadmin/parameters/course-builder` (Course Builder)
- **Login Types**: SuperAdmin
- **Permissions Required**: `masterData.view`, `masterData.create`, `masterData.edit`, `masterData.delete`

---

## How Courses Are Created

Courses are specialized academic tracks (JEE, NEET, Olympiad, Foundation) that combine content from multiple curriculum sources.

### Content Composition

| Type | Percentage | Description |
|------|------------|-------------|
| **Mapped Chapters** | ~80% | Pulled from existing Curricula (read-only reference) |
| **Course-Only Chapters** | ~20% | Exclusive to this course (owned by course) |
| **Course-Only Topics** | Variable | Topics under course-only chapters |

### Course Creation Flow (via Course Builder)

```text
Step 1: Create New Course
        ├── Enter Course Name (e.g., "JEE Mains")
        ├── Select Course Type (Competitive/Foundation)
        ├── Check Allowed Curriculums (CBSE, ICSE, etc.)
        └── Check Allowed Classes (Class 11, 12, etc.)
                │
                ▼
Step 2: Map Chapters from Curricula (Split View)
        Left Panel: Curriculum Tree
        ├── Select Curriculum (e.g., CBSE)
        ├── Select Class (e.g., Class 11)
        ├── Select Subject (only course-allowed subjects shown)
        └── Check desired chapters → Add to course
                │
                ▼
Step 3: Create Course-Only Content
        ├── Create Course-Only Chapters (exclusive to course)
        └── Create Course-Only Topics (under course-only chapters)
                │
                ▼
Step 4: Save and Publish
```

### Relationship Between Curricula and Courses

| Aspect | Behavior |
|--------|----------|
| Mapped chapters | Read-only reference to curriculum chapters |
| Curriculum updates | Propagate automatically to courses |
| Course-only chapters | Independent, owned by course |
| Institute assignment | Can be assigned both Curricula AND Courses |

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| **Courses Page** | | |
| PageHeader | Title + "Course Builder" / "Manage Courses" buttons | Top |
| CoursesPanel | Left panel with course list | Left |
| SubjectsPanel | Middle panel with subjects | Center |
| ContentPanel | Right panel with chapters/topics | Right |
| **Course Builder Page** | | |
| CourseSelector | Dropdown to select/create course | Top |
| SourcePanel | Left panel - Curriculum tree for chapter selection | Left |
| TargetPanel | Right panel - Current course content | Right |
| ActionButtons | Create Course-Only Chapter/Topic buttons | Bottom |

---

## Features & Functionality

### Courses Page (`/superadmin/parameters/courses`)

The Courses page provides a read-only view of all courses:

| Action | How | Result |
|--------|-----|--------|
| View Course | Click on course card | Shows course subjects |
| View Subject | Click on subject | Shows chapters with topics |
| Expand Chapter | Click expand arrow | Shows topics under chapter |
| Open Course Builder | Click "Course Builder" button | Navigates to builder |
| Manage Courses | Click "Manage Courses" button | Opens management dialog |

### Course Builder (`/superadmin/parameters/course-builder`)

#### Create New Course

1. Click "Create New Course" button
2. Popup opens with:
   - Course Name (text input)
   - Course Type (dropdown: Competitive, Foundation, etc.)
   - Allowed Curriculums (checkboxes: CBSE, ICSE, etc.)
   - Allowed Classes (checkboxes: Class 11, 12, etc.)
3. Click "Create Course"
4. Course created and selected in dropdown

#### Map Chapters from Curriculum

1. Select course from dropdown (or create new)
2. **Split view appears**:
   - **Left Panel (Source)**: Curriculum tree
   - **Right Panel (Target)**: Course content
3. In left panel, select:
   - Curriculum (e.g., CBSE)
   - Class (e.g., Class 11)
   - Subject (only allowed subjects shown)
4. Check desired chapters
5. Click "Add Selected" → Chapters appear in right panel

**Important**: Only subjects allowed for the course are displayed when selecting from curriculum tree.

#### Create Course-Only Chapter

1. Click "Create Course-Only Chapter" button (bottom of page)
2. Dialog opens:
   - Select Subject (from course's subjects)
   - Enter Chapter Name (supports bulk paste)
3. Save → Chapter appears in course content with "Course Exclusive" label

#### Create Course-Only Topic

1. Click "Create Course-Only Topic" button (bottom of page)
2. Dialog opens:
   - Select Subject
   - Select Chapter (only course-owned chapters shown)
   - Enter Topic Name (supports bulk paste)
3. Save → Topic appears under the chapter

### Course Structure

```text
Course (e.g., JEE Mains)
├── Subject: Physics
│   ├── From CBSE 11:
│   │   ├── Mapped: Units and Measurements
│   │   ├── Mapped: Motion in a Straight Line
│   │   └── Mapped: Laws of Motion
│   ├── From CBSE 12:
│   │   ├── Mapped: Electric Charges and Fields
│   │   └── Mapped: Electrostatic Potential
│   └── Course Exclusive:
│       ├── JEE Problem Solving Strategies
│       │   ├── Topic: Previous Year Analysis
│       │   └── Topic: Time Management
│       └── Advanced Numerical Techniques
├── Subject: Chemistry
│   └── ...
└── Subject: Mathematics
    └── ...
```

---

## Data Flow

```text
Source: Curriculum chapters (masterData.ts)
         │
         ▼
Mapping: Course-Chapter Relationships
         ├── courseId → chapterId (mapped from curriculum)
         └── courseId → exclusiveChapters[] (course-only)
         │
         ▼
Storage: masterData.ts
         ├── courses[]
         ├── courseChapterMappings[]
         └── courseExclusiveChapters[]
         │
         ▼
Consumers:
├── Institute Master Data (unified track view)
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
| Course-Only Chapters | Content Creation | Downstream | Only course-linked content |
| Course Settings | Institute Assignment | Downstream | Controls which institutes can use course |

---

## Business Rules

1. **Course names must be unique** across the platform
2. **Allowed subjects filter** - Only selected curriculum subjects appear in builder
3. **Mapped chapters maintain link** - Updates in curriculum propagate to course
4. **Course-only chapters are owned** - Only editable in course context
5. **80/20 typical ratio** - ~80% mapped, ~20% exclusive chapters
6. **Multi-curriculum mapping** - Can map chapters from CBSE, ICSE, etc.
7. **Multi-class mapping** - Can map chapters from Class 11 + 12 in same course

---

## Mobile Behavior

- Courses page: Full-width stacked panels
- Course Builder: Tab-based switch between Source/Target panels
- Chapter selection: Accordion with checkboxes
- Drag-and-drop disabled on mobile (use move buttons)
- Bottom sheet dialogs for create actions
- Touch targets minimum 44px

---

## Related Documentation

- [Master Data - Curriculum](./master-data-curriculum.md)
- [Institute Master Data View](../02-institute/master-data.md)
- [Curriculum Flow](../05-cross-login-flows/curriculum-course-flow.md)
- [SuperAdmin Smoke Tests](../06-testing-scenarios/smoke-tests/superadmin.md)

---

*Last Updated: January 2025*
