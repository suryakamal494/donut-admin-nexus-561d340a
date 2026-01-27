# Institute Question Bank

> Manage institute-specific questions with manual entry, AI generation, and PDF upload.

---

## Overview

The Institute Question Bank provides a comprehensive interface for managing questions at the institute level. It combines access to global questions from SuperAdmin with the ability to create institute-specific questions using multiple methods: manual entry, AI generation, and PDF extraction.

## Access

- **Route**: `/institute/questions`
- **Login Types**: Institute Admin
- **Permissions Required**: `questionBank.view`, `questionBank.create`, `questionBank.edit`, `questionBank.delete`
- **Capabilities**: `manual`, `aiGeneration`, `pdfUpload`

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| PageHeader | Title + creation actions | Top |
| SourceToggle | Global / Institute filter | Below header |
| FilterBar | Type, difficulty, class filters | With toggle |
| QuestionList | Virtualized question cards | Main content |
| QuestionForm | Manual question entry | Full page |
| AIGeneratorDialog | AI question generation | Dialog |
| PDFExtractorDialog | PDF question extraction | Dialog |
| QuestionPreview | Detailed question view | Drawer |

---

## Features & Functionality

### Source Toggle

| Source | Description | Actions |
|--------|-------------|---------|
| **All** | Global + Institute questions | Mixed view |
| **Global** | SuperAdmin questions | View only |
| **Institute** | Local questions | Full CRUD |

### Question Card

```text
┌─────────────────────────────────────────────────────────────┐
│ [MCQ Single] [Medium] [Global]                              │
│                                                              │
│ A particle moves along a straight line with velocity        │
│ v = 3t² - 2t + 1 m/s. Find the acceleration at t = 2s.     │
│                                                              │
│ Physics • Motion • Class 10                                 │
│                                                              │
│ [Preview]                                                   │
└─────────────────────────────────────────────────────────────┘
```

### Creation Methods

**Method 1: Manual Entry**
- Full form for question details
- LaTeX support for formulas
- Image upload for diagrams
- Multiple question types

**Method 2: AI Generation**
- Specify classification
- Set count and difficulty
- Preview and accept/reject
- Batch creation

**Method 3: PDF Upload**
- Upload exam paper PDF
- OCR extraction
- Review grid for corrections
- Batch import

### Question Types Supported

| Type | Description | For Exams |
|------|-------------|-----------|
| MCQ Single | One correct answer | All |
| MCQ Multiple | Multiple correct | Advanced |
| True/False | Binary choice | Quick tests |
| Integer | Numeric answer | JEE-style |
| Fill in Blank | Text completion | Practice |
| Assertion-Reasoning | Two statements | NEET-style |
| Matrix Match | Column matching | JEE-style |
| Paragraph | Passage-based | All |

### Virtualization

Questions are rendered using `@tanstack/react-virtual`:
- Smooth scrolling for 100+ questions
- 60fps performance maintained
- Dynamic row heights supported

---

## Data Flow

```text
Sources:
├── SuperAdmin Questions (source: 'global')
└── Institute Questions (source: 'institute')
         │
         ▼
Display:
├── Merged by source toggle
├── Filtered by criteria
├── Virtualized rendering
└── LaTeX rendered
         │
         ▼
Downstream:
├── Teacher Question Selection (exam creation)
├── Institute Exams
└── Student Tests (via exam)
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Global Questions | SuperAdmin | Upstream | Read-only access |
| Institute Questions | Teacher Exams | Downstream | Available for selection |
| Institute Questions | Institute Exams | Local | Exam creation |

---

## Business Rules

1. **Global questions read-only** - cannot edit/delete
2. **Institute questions editable** by any admin
3. **Classification required** - class + subject + chapter
4. **Correct answer required** for all types
5. **LaTeX must be valid** syntax
6. **PDF extraction** may need manual corrections
7. **Difficulty distribution** maintained in AI generation

---

## Mobile Behavior

- Question list: Full-width cards, virtualized
- Filters: Horizontal scroll pills
- Manual entry: Full-screen form
- AI generator: Bottom sheet
- PDF upload: Native file picker
- Question preview: Full-screen drawer
- LaTeX: Touch-friendly input

---

## Related Documentation

- [SuperAdmin Question Bank](../01-superadmin/question-bank.md)
- [Institute Exams](./exams-new.md)
- [Teacher Exams](../03-teacher/exams.md)
- [Question Propagation](../05-cross-login-flows/question-propagation.md)
- [Institute Smoke Tests](../06-testing-scenarios/smoke-tests/institute.md)

---

*Last Updated: January 2025*
