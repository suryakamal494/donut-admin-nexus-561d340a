# Question Bank

> Create and manage global questions with manual entry, AI generation, and PDF extraction.

---

## Overview

The SuperAdmin Question Bank is the platform's global repository of educational questions. Questions created here become available to institutes and teachers for exam creation. The module supports three creation methods: manual entry, AI generation, and PDF extraction.

## Access

- **Route**: `/superadmin/questions`
- **Login Types**: SuperAdmin
- **Permissions Required**: `questionBank.view`, `questionBank.create`, `questionBank.edit`, `questionBank.delete`
- **Capabilities**: `manual`, `aiGeneration`, `pdfUpload`

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| PageHeader | Title + creation actions | Top |
| FilterBar | Type, difficulty, class, subject filters | Below header |
| QuestionList | Virtualized question cards | Main content |
| QuestionForm | Manual question entry | Full page |
| AIGeneratorDialog | AI question generation | Dialog |
| PDFExtractorDialog | PDF question extraction | Dialog |
| QuestionPreview | Detailed question view | Dialog/Drawer |

---

## Features & Functionality

### Question Types

| Type | Description | Answer Format |
|------|-------------|---------------|
| **MCQ Single** | Multiple choice, one correct | Radio buttons |
| **MCQ Multiple** | Multiple choice, multiple correct | Checkboxes |
| **True/False** | Binary choice | Radio buttons |
| **Fill in Blank** | Text completion | Text input |
| **Integer** | Numeric answer | Number input |
| **Subjective** | Long-form answer | Text area |
| **Assertion-Reasoning** | Two statements with relationship | Special MCQ |
| **Matrix Match** | Column matching | Drag-drop grid |
| **Paragraph** | Passage with multiple questions | Question group |

### Difficulty Levels

| Level | Description | Point Range |
|-------|-------------|-------------|
| Easy | Basic recall | 1-2 points |
| Medium | Application | 2-3 points |
| Hard | Analysis/Synthesis | 3-4 points |
| Expert | Competition level | 4-5 points |

### Create Question - Manual Entry

1. Click "Add Question"
2. **Classification**
   - Select Class, Subject, Chapter, Topic
3. **Question Details**
   - Question type
   - Question text (with LaTeX support)
   - Add images if needed
   - Options (for MCQ types)
   - Correct answer
   - Explanation
   - Difficulty level
   - Tags
4. **Preview & Save**

### Create Question - AI Generation

1. Click "AI Generate"
2. **Configuration**
   - Select classification (class, subject, chapter)
   - Number of questions (1-50)
   - Question types to generate
   - Difficulty distribution
3. **Generation**
   - AI generates questions
   - Progress indicator
4. **Review**
   - Preview each question
   - Accept, Reject, or Edit individually
   - Save accepted questions

### Create Question - PDF Extraction

1. Click "Upload PDF"
2. **Upload**
   - Select PDF file
   - Upload with OCR processing
3. **Review Grid**
   - Extracted questions shown in grid
   - Edit classification per question
   - Fix OCR errors
   - Accept or reject each
4. **Save**
   - Save accepted questions to bank

### Question Card Display

| Element | Description |
|---------|-------------|
| Type Badge | MCQ, Integer, etc. |
| Difficulty | Easy/Medium/Hard/Expert |
| Question Preview | First 100 chars + LaTeX render |
| Classification | Subject > Chapter |
| Source | Global badge |
| Actions | View, Edit, Delete |

### Rich Content Support

- **LaTeX**: Mathematical formulas with KaTeX rendering
- **Images**: Question images and diagram support
- **Tables**: Data tables in questions
- **Code**: Code blocks for programming questions

---

## Data Flow

```text
Source: SuperAdmin creates questions
         │
         ▼
Storage: questionsData.ts
         ├── questions with source: 'global'
         ├── LaTeX formulas
         └── image references
         │
         ▼
Visibility:
├── Institute Question Bank (for exam creation)
├── Teacher Question Bank (for exam creation)
└── Student (via exam attempt only)
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Global Questions | Institute Question Bank | Downstream | Available for exam creation |
| Global Questions | Teacher Exam Creation | Downstream | Available in question picker |
| Question Classification | Master Data | Upstream | Uses curriculum hierarchy |
| PYP/Grand Tests | Student Tests | Downstream | Questions in exams |

---

## Business Rules

1. **Global questions are read-only** downstream
2. **Classification required** - at least class + subject + chapter
3. **Correct answer required** for all question types
4. **LaTeX validation** - formulas must be valid
5. **Image alt text** required for accessibility
6. **Difficulty distribution** - AI maintains requested ratios
7. **PDF extraction** - questions may need manual correction
8. **Duplicate detection** - warns on similar questions

---

## Mobile Behavior

- Question list: Full-width cards, virtualized scroll
- Filters: Horizontal scroll pills
- Manual entry: Full-screen form
- AI generator: Bottom sheet with stepped flow
- PDF upload: Native file picker
- Question preview: Full-screen drawer
- LaTeX keyboard: Custom input panel

---

## Related Documentation

- [Institute Question Bank](../02-institute/question-bank.md)
- [Teacher Exams](../03-teacher/exams.md)
- [Exams (PYP/Grand Tests)](./exams.md)
- [Question Propagation Flow](../05-cross-login-flows/question-propagation.md)
- [SuperAdmin Smoke Tests](../06-testing-scenarios/smoke-tests/superadmin.md)

---

*Last Updated: January 2025*
