# Exams New (Pattern-Based Exams)

> Create structured assessments using exam patterns with advanced configuration.

---

## Overview

The "Exams New" module implements an intent-first exam creation flow that separates pattern configuration from exam setup. It supports complex templates (JEE, CBSE) with section-wise rules, marking schemes, and question type enforcement. The module provides two creation paths: pattern-based exams and quick tests.

## Access

- **Route**: `/institute/exams-new`
- **Login Types**: Institute Admin
- **Permissions Required**: `exams.view`, `exams.create`, `exams.edit`, `exams.delete`

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| PageHeader | Title + create action | Top |
| ExamTable | List of created exams | Main content |
| CreationWizard | Multi-step exam builder | Full page |
| PatternLibrary | Standard/custom patterns | Step 1 |
| SectionConfigurator | Section setup | Step 2 |
| QuestionBankSheet | Question selection | Step 3 |
| AIGeneratorDialog | AI question creation | Within step 3 |
| PDFExtractorDialog | PDF question extraction | Within step 3 |
| ProgressTracker | Section completion sidebar | Step 3 |
| AddedQuestionsSheet | Review added questions | Drawer |

---

## Features & Functionality

### Creation Paths

**Path 1: Use a Pattern**
- Select from standard patterns (JEE, NEET, CBSE)
- Or use a custom pattern
- Pattern defines sections, question types, marking

**Path 2: Quick Test**
- Flat configuration
- Simple question addition
- Basic marking scheme
- Faster for informal assessments

### Creation Wizard Steps

**Step 1: Pattern Selection**
```text
Standard Patterns:
┌─────────────────┬─────────────────┬─────────────────┐
│   JEE Mains     │   NEET          │   CBSE Board    │
│   3 Sections    │   4 Sections    │   5 Sections    │
│   90 Questions  │   180 Questions │   40 Questions  │
│   [Select]      │   [Select]      │   [Select]      │
└─────────────────┴─────────────────┴─────────────────┘

Custom Patterns:
┌─────────────────┐
│   + Create New  │
│   Pattern       │
└─────────────────┘
```

**Step 2: Exam Details**
- Exam name
- Scheduled date/time
- Duration
- Target batches
- Instructions

**Step 3: Add Questions**
- Section-by-section addition
- Three sources: AI, Question Bank, PDF
- Real-time progress tracking

### Pattern Structure

```text
JEE Mains Pattern
├── Section A: Physics (30 Questions)
│   ├── MCQ: 20 questions (+4/-1)
│   └── Integer: 10 questions (+4/0)
├── Section B: Chemistry (30 Questions)
│   ├── MCQ: 20 questions (+4/-1)
│   └── Integer: 10 questions (+4/0)
└── Section C: Mathematics (30 Questions)
    ├── MCQ: 20 questions (+4/-1)
    └── Integer: 10 questions (+4/0)
```

### Progress Tracker

```text
Section Progress:
├── Physics MCQ [15/20] 🟡
├── Physics Integer [8/10] 🟡
├── Chemistry MCQ [20/20] ✓
├── Chemistry Integer [10/10] ✓
├── Mathematics MCQ [5/20] 🔴
└── Mathematics Integer [0/10] 🔴

[View Added Questions]
```

### Question Addition Sources

| Source | Flow | Best For |
|--------|------|----------|
| **Question Bank** | Search → Select → Add | Existing questions |
| **AI Generation** | Configure → Generate → Review → Accept | New questions |
| **PDF Upload** | Upload → Extract → Review → Accept | Paper digitization |

### Question Bank Sheet

- Virtualized for 200+ questions
- Filters: Type, difficulty, chapter
- Preview modal with LaTeX
- Direct Add/Remove actions
- Shows already-added questions

### AI Generation Preview

```text
AI Generated 10 Questions
├── Q1: [MCQ] Newton's First Law... [Accept] [Reject] [Edit]
├── Q2: [MCQ] Momentum concept... [Accept] [Reject] [Edit]
├── Q3: [Integer] Calculate force... [Accept] [Reject] [Edit]
└── ... (7 more)

[Accept All] [Reject All] [Add Selected]
```

---

## Data Flow

```text
Sources:
├── Pattern Library (templates)
├── Question Bank (existing questions)
├── AI Generator (new questions)
└── PDF Extractor (uploaded papers)
         │
         ▼
Exam Builder:
├── Pattern selection
├── Configuration
├── Question mapping
└── Section validation
         │
         ▼
Storage:
├── Exam definition
├── Section configuration
├── Question assignments
└── Batch assignments
         │
         ▼
Downstream:
├── Teacher (view assigned exams)
├── Student (attempt exam)
└── Results (after attempt)
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Exam Creation | Teacher Exams | Downstream | Visible in teacher's list |
| Batch Assignment | Student Tests | Downstream | Available for attempt |
| Question Selection | Question Bank | Local | Uses global + institute questions |
| Results | Progress Tracking | Downstream | Updates student analytics |

---

## Business Rules

1. **Pattern defines constraints** - cannot exceed section limits
2. **Question types must match** section requirements
3. **All sections required** for pattern-based exams
4. **Quick tests** have no section constraints
5. **Marking scheme** from pattern or custom
6. **Draft exams** not visible to students
7. **Published exams** cannot modify questions

---

## Mobile Behavior

- Wizard: Full-screen stepped flow
- Pattern grid: 1 column, vertical scroll
- Section config: Accordion
- Question bank: Bottom sheet with virtualization
- Progress tracker: Collapsed sidebar
- Touch targets: 44px+ minimum
- Stepper: Visual icon-based navigation

### Mobile-Specific Optimizations

- Vertical stacking of configuration options
- Horizontal scroll for section tabs
- Bottom clearance (pb-20) for navigation
- Swipe gestures for wizard navigation

---

## Related Documentation

- [Institute Question Bank](./question-bank.md)
- [SuperAdmin Exams](../01-superadmin/exams.md)
- [Teacher Exams](../03-teacher/exams.md)
- [Student Test Player](../04-student/test-player.md)
- [Exam Flow](../05-cross-login-flows/exam-flow.md)
- [Institute Smoke Tests](../06-testing-scenarios/smoke-tests/institute.md)

---

*Last Updated: January 2025*
