# Homework System

> Three-mode homework assignments with submission tracking.

---

## Overview

The Teacher Homework module implements a "3-Mode Model" for assignments: Practice (file/text/link upload), Test (auto-graded MCQ), and Project (multi-file upload). Teachers can create assignments quickly via a 3-step flow or directly from lesson plan blocks.

## Access

- **Route**: `/teacher/homework`
- **Login Types**: Teacher
- **Permissions Required**: Teacher account

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| PageHeader | Title + create action | Top |
| FilterBar | Subject, batch, status | Below header |
| HomeworkTable | Assignment list | Main content |
| HomeworkCard | Assignment summary | Within list |
| CreateDialog | 3-step creation | Dialog |
| ReviewSheet | Submission review | Drawer |

---

## Features & Functionality

### Homework Types

| Type | Badge Color | Submission Format | Grading |
|------|-------------|-------------------|---------|
| **Practice** | Blue | File/Text/Link | Manual |
| **Test** | Purple | MCQ answers | Auto |
| **Project** | Orange | Multi-file | Manual |

### Homework Card

```text
┌─────────────────────────────────────────────────────────────┐
│ [Practice]  Physics - Laws of Motion                        │
│                                                              │
│ Newton's Laws Worksheet                                     │
│ 10A • Due: Jan 20, 2025                                     │
│                                                              │
│ Submissions: 28/35 (80%)                                    │
│                                                              │
│ [View Details] [Review Submissions]                         │
└─────────────────────────────────────────────────────────────┘
```

### Create Homework Flow

**Step 1: Type Selection**
- Practice: General assignments
- Test: Auto-graded quiz
- Project: Multi-part work

**Step 2: Details**
- Title
- Instructions
- Due date/time
- Attachments (optional)
- For Test: Select questions

**Step 3: Assignment**
- Select batches
- Preview
- Confirm

### Homework from Lesson Plan

When adding a Homework block in Lesson Workspace:
1. Type selection dialog opens
2. Context auto-filled (subject, chapter, batch)
3. Simplified 2-step flow
4. Creates both block and assignment

### Submission Status

| Status | Visual | Meaning |
|--------|--------|---------|
| Pending | Default | Not yet due |
| Submitted | Count badge | Partial submissions |
| Overdue | Red | Past due date |
| Completed | Green | All submitted |

### Review Submissions

The "Review Submissions" system adapts by type:

**Practice/Project:**
```text
Submission Review - Newton's Laws Worksheet
┌─────────────────────────────────────────────────────────────┐
│ Rahul Sharma                                                │
│ Submitted: Jan 18, 2025 at 3:45 PM                         │
│                                                              │
│ 📄 worksheet_answers.pdf                                    │
│ 📝 "I found Newton's Second Law most interesting..."       │
│                                                              │
│ Grade: [___] / 10    Feedback: [________________]          │
│                                                              │
│ [View Document] [Mark as Reviewed]                          │
├─────────────────────────────────────────────────────────────┤
│ Priya Gupta                                                 │
│ Submitted: Jan 19, 2025 at 10:30 AM                        │
│ ...                                                         │
└─────────────────────────────────────────────────────────────┘
```

**Test:**
```text
Test Results - Motion Quiz
┌─────────────────────────────────────────────────────────────┐
│ Student          │ Score    │ Time     │ Status            │
├──────────────────┼──────────┼──────────┼───────────────────┤
│ Rahul Sharma     │ 8/10     │ 12 min   │ ✓ Completed       │
│ Priya Gupta      │ 9/10     │ 10 min   │ ✓ Completed       │
│ Amit Kumar       │ -        │ -        │ ○ Not Started     │
└─────────────────────────────────────────────────────────────┘

Class Average: 8.2/10
```

### Submission Viewer

For Practice/Project types:
- PDF preview
- Image gallery
- Text answer display
- Download option

---

## Data Flow

```text
Source: Teacher creates homework
         │
         ▼
Storage: homework[] in teacherData
         ├── Assignment details
         ├── Type configuration
         ├── Batch assignments
         └── Submission tracking
         │
         ▼
Downstream:
├── Student Dashboard (pending list)
├── Student Chapter (homework items)
└── Submission collection
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Assignment | Student Dashboard | Downstream | Shows in pending |
| Assignment | Student Chapter | Downstream | Shows in homework list |
| Test Type | Test Player | Downstream | Opens for attempt |
| Lesson Block | Workspace | Local | Auto-creates assignment |

---

## Business Rules

1. **Due date required** for all types
2. **Batch must have students** for assignment
3. **Test type requires** linked questions
4. **Late submissions** allowed but marked
5. **Grading required** for Practice/Project
6. **Auto-grade** for Test type
7. **Edit blocked** after submissions received

---

## Mobile Behavior

- Homework list: Card view
- Create dialog: Full-screen stepped
- Review: Bottom drawer
- Document viewer: Full-screen
- Touch targets: 44px minimum
- Camera access: For photo uploads

---

## Related Documentation

- [Lesson Workspace](./lesson-workspace.md)
- [Student Homework](../04-student/homework.md)
- [Homework Flow](../05-cross-login-flows/homework-flow.md)
- [Teacher Smoke Tests](../06-testing-scenarios/smoke-tests/teacher.md)

---

*Last Updated: January 2025*
