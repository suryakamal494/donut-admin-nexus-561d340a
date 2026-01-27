# Teacher Exams

> Create and manage classroom assessments with question bank integration.

---

## Overview

The Teacher Exams module enables creation and management of classroom assessments. Teachers can create quizzes and tests using questions from the question bank, with support for various question types and automatic grading.

## Access

- **Route**: `/teacher/exams`
- **Login Types**: Teacher
- **Permissions Required**: Teacher account

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| PageHeader | Title + create action | Top |
| ExamTabs | Draft/Scheduled/Completed | Below header |
| ExamTable | Assessment list | Main content |
| ExamCard | Assessment summary | Within list |
| ExamBuilder | Creation wizard | Full page |
| QuestionSheet | Question selection | Bottom sheet |
| PreviewDrawer | Exam preview | Drawer |
| ResultsView | Analytics display | Page |

---

## Features & Functionality

### Exam Types

| Type | Duration | Auto-grade | Use Case |
|------|----------|------------|----------|
| Quiz | 5-15 min | Yes | Quick check |
| Test | 15-60 min | Yes | Assessment |
| Poll | 1-5 min | No | Feedback |

### Exam Card

```text
┌─────────────────────────────────────────────────────────────┐
│ [Quiz]  Physics - Motion                                    │
│                                                              │
│ Motion Concepts Check                                       │
│ 10A • 10 Questions • 15 min                                 │
│                                                              │
│ Status: Scheduled for Jan 20, 2:00 PM                       │
│                                                              │
│ [Preview] [Edit] [View Results]                             │
└─────────────────────────────────────────────────────────────┘
```

### Create Exam Flow

**Step 1: Exam Details**
- Title
- Type (Quiz/Test/Poll)
- Subject (auto-filtered)
- Duration
- Schedule (optional)

**Step 2: Select Questions**
- Browse question bank
- Filter by chapter, type, difficulty
- Add/remove questions
- Set marks per question

**Step 3: Configuration**
- Marking scheme
- Negative marking (optional)
- Shuffle options
- Time per question (optional)

**Step 4: Review & Assign**
- Preview full exam
- Assign to batches
- Schedule or publish immediately

### Question Selection Sheet

Mobile-optimized with virtualization:

```text
Select Questions (Physics - Motion)
┌─────────────────────────────────────────────────────────────┐
│ 🔍 Search...                                                │
│ [MCQ] [Integer] [All Difficulty]                           │
├─────────────────────────────────────────────────────────────┤
│ ☑ Q1: A particle moves with velocity v = 3t²...            │
│   [MCQ Single] [Medium] [Preview]                          │
├─────────────────────────────────────────────────────────────┤
│ ☐ Q2: Calculate the acceleration when...                   │
│   [Integer] [Hard] [Preview]                               │
├─────────────────────────────────────────────────────────────┤
│ ...                                                         │
└─────────────────────────────────────────────────────────────┘
Selected: 8/10 questions                    [Add Selected]
```

### Question Types Supported

| Type | Description | Grading |
|------|-------------|---------|
| MCQ Single | One correct | Auto |
| MCQ Multiple | Multiple correct | Auto |
| True/False | Binary | Auto |
| Integer | Numeric | Auto |
| Assertion-Reasoning | Two statements | Auto |
| Matrix Match | Column matching | Auto |

### Exam Preview

```text
Exam Preview - Motion Concepts Check
┌─────────────────────────────────────────────────────────────┐
│ Question 1 of 10                              Marks: 4      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ A particle moves along a straight line with velocity        │
│ v = 3t² - 2t + 1 m/s. Find the acceleration at t = 2s.     │
│                                                              │
│ ○ A) 8 m/s²                                                 │
│ ○ B) 10 m/s²                                                │
│ ○ C) 12 m/s²                                                │
│ ○ D) 14 m/s²                                                │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ ● ● ○ ○ ○ ○ ○ ○ ○ ○                          ◀ 1/10 ▶       │
└─────────────────────────────────────────────────────────────┘
```

### Results Analytics

```text
Motion Concepts Check - Results
┌─────────────────────────────────────────────────────────────┐
│ Class Average: 72%  │  Highest: 95%  │  Lowest: 45%        │
├─────────────────────────────────────────────────────────────┤
│ Attempts: 32/35 (91%)                                       │
│                                                              │
│ Question Analysis:                                          │
│ Q1: 85% correct  Q2: 72% correct  Q3: 45% correct ⚠️       │
│                                                              │
│ [View Detailed] [Export Results]                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow

```text
Sources:
├── Question Bank (global, institute, filtered)
└── Teacher's subject scope
         │
         ▼
Exam Builder:
├── Question selection
├── Configuration
└── Batch assignment
         │
         ▼
Storage: assessments[] in teacherData
         │
         ▼
Downstream:
├── Student Tests (available for attempt)
└── Results Analytics
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Exam Creation | Student Tests | Downstream | Available for attempt |
| Question Selection | Question Bank | Local | Uses global + institute |
| Batch Assignment | Student | Downstream | Shows in test list |
| Results | Progress Tracking | Downstream | Updates analytics |

---

## Business Rules

1. **Subject-scoped** - only teacher's subjects
2. **Question source** - global, institute, or own
3. **Schedule optional** - can publish immediately
4. **Live exams** cannot be edited
5. **Results persist** after exam ends
6. **Negative marking** configurable per exam
7. **Shuffle** can be per-student

---

## Mobile Behavior

- Exam list: Card view
- Question sheet: Bottom drawer, virtualized
- Preview: Full-screen, swipe navigation
- Results: Card-based analytics
- Touch targets: 44px minimum

### Mobile Overflow Prevention

- Question preview: Constrained height
- Drawer: Smooth scrolling
- Actions: Responsive button layout

---

## Related Documentation

- [Institute Question Bank](../02-institute/question-bank.md)
- [Student Test Player](../04-student/test-player.md)
- [Exam Flow](../05-cross-login-flows/exam-flow.md)
- [Teacher Smoke Tests](../06-testing-scenarios/smoke-tests/teacher.md)

---

*Last Updated: January 2025*
