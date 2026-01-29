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

## Purpose

**Why the Question Bank Exists:**
1. **Central Repository**: Single source of truth for all educational questions
2. **Quality Control**: SuperAdmin creates and validates questions before distribution
3. **Multi-Format Support**: Handle complex question types with LaTeX, images, diagrams
4. **Scalable Distribution**: Questions propagate to institutes based on assignments

**How Questions Flow:**
- SuperAdmin creates questions tagged to Curriculum OR Course
- Questions become visible to institutes with matching assignments
- Institutes can use these questions in exams (read-only access)
- Teachers can see questions scoped to their assigned subjects

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| PageHeader | Title + 3 action buttons (Upload PDF, Generate with AI, Add Question) | Top |
| FilterBar | Subject, Type, Difficulty, Cognitive filters | Below header |
| SearchBox | Text search across questions | Below header |
| QuestionList | Virtualized question cards | Main content |
| QuestionCard | Individual question with badges and actions | Main content |
| QuestionForm | Manual question entry | Full page |
| AIGeneratorPage | AI question generation | Full page |
| PDFExtractorWizard | PDF question extraction | Full page/3-step wizard |
| QuestionPreview | Detailed question view | Dialog/Drawer |

---

## Question Classification

### For Curriculum-Based Questions

When adding questions to a curriculum, **7 tags are required**:

| Tag | Description | Example |
|-----|-------------|---------|
| 1. Curriculum | Academic board | CBSE, ICSE, State Board |
| 2. Class | Grade level | Class 6, Class 11 |
| 3. Subject | Academic subject | Physics, Chemistry |
| 4. Chapter | Specific chapter | Kinematics, Organic Chemistry |
| 5. Topic | Specific topic | Projectile Motion, Alkanes |
| 6. Difficulty | Question difficulty | Easy, Medium, Hard, Expert |
| 7. Cognitive Type | Mental process required | Logical, Analytical, Conceptual, Numerical, Application, Memory |

### For Course-Based Questions

When adding questions to a course, **6 tags are required** (no Class):

| Tag | Description | Example |
|-----|-------------|---------|
| 1. Course | Competitive track | JEE Mains, NEET, Olympiad |
| 2. Subject | Academic subject | Physics, Chemistry |
| 3. Chapter | Course chapter | Mechanics, Thermodynamics |
| 4. Topic | Specific topic | Rotational Dynamics |
| 5. Difficulty | Question difficulty | Easy, Medium, Hard, Expert |
| 6. Cognitive Type | Mental process required | Logical, Analytical, etc. |

**Key Difference**: Courses do NOT have a Class context. The hierarchy is Course → Subject → Chapter → Topic.

---

## Nine Question Types

| Type | UI Elements | Answer Format | Display |
|------|-------------|---------------|---------|
| **MCQ (Single)** | 4 options with radio buttons | One correct option | Radio button selection |
| **Multiple Correct** | 4+ options with checkboxes | Multiple correct options | Checkbox selection |
| **Numerical** | Number input field | Exact value or range | Input box with decimal support |
| **True/False** | Two radio buttons | Boolean (T/F) | Two button selection |
| **Fill in Blanks** | Text with `___blank___` markers | Text answer per blank | Input fields per blank |
| **Assertion-Reasoning** | Assertion text + Reason text + 4 standard options | One correct option (A/B/C/D) | Special AR layout |
| **Paragraph Based** | Passage + 2-5 sub-questions | Mixed types per sub-question | Passage + sub-question cards |
| **Short Answer** | Text area (100 chars) | Keyword matching | Expandable text area |
| **Long Answer** | Text area (1000 chars) | Manual grading rubric | Large text area |

### Paragraph Sub-Question Types

Paragraph-based questions support these sub-question types:
- MCQ (Single)
- Multiple Correct
- Numerical
- Fill in Blanks
- True/False

### Assertion-Reasoning Options

Standard options for A-R questions:
- (A) Both Assertion and Reason are correct, and Reason explains Assertion
- (B) Both Assertion and Reason are correct, but Reason does not explain Assertion
- (C) Assertion is correct, but Reason is incorrect
- (D) Assertion is incorrect, but Reason is correct

---

## Question Propagation to Institutes

### Critical Business Rule

**Questions are ONLY visible to institutes based on their assigned curricula and courses.**

This is a strict boundary that must be enforced.

### Propagation Example

**SuperAdmin creates:**
- CBSE Class 11 Physics questions
- ICSE Class 10 Chemistry questions
- JEE Mains Physics questions
- NEET Biology questions

**Institute A is assigned:** CBSE, JEE Mains
**Institute B is assigned:** ICSE, NEET

**Result:**
- Institute A sees: CBSE questions + JEE Mains questions
- Institute B sees: ICSE questions + NEET questions
- Institute A does NOT see ICSE or NEET
- Institute B does NOT see CBSE or JEE

### Propagation Diagram

```text
┌────────────────────────────────────────────────────────────────────┐
│                   QUESTION PROPAGATION                              │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  SuperAdmin Creates Questions                                       │
│  ├── CBSE > Class 11 > Physics > Kinematics                        │
│  ├── ICSE > Class 10 > Chemistry > Acids                           │
│  ├── JEE Mains > Physics > Mechanics                               │
│  └── NEET > Biology > Genetics                                     │
│                                                                     │
│                         │                                           │
│              ┌──────────┴──────────┐                                │
│              ▼                     ▼                                │
│  ┌─────────────────────┐  ┌─────────────────────┐                  │
│  │    Institute A      │  │    Institute B      │                  │
│  │  Assigned: CBSE,    │  │  Assigned: ICSE,    │                  │
│  │            JEE      │  │            NEET     │                  │
│  │                     │  │                     │                  │
│  │  Sees:              │  │  Sees:              │                  │
│  │  ✓ CBSE Physics     │  │  ✓ ICSE Chemistry   │                  │
│  │  ✓ JEE Physics      │  │  ✓ NEET Biology     │                  │
│  │  ✗ ICSE (hidden)    │  │  ✗ CBSE (hidden)    │                  │
│  │  ✗ NEET (hidden)    │  │  ✗ JEE (hidden)     │                  │
│  └─────────────────────┘  └─────────────────────┘                  │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

### Source Badges

| Source | Badge Color | Edit Rights | Delete Rights |
|--------|-------------|-------------|---------------|
| `global` | 🔵 Blue "Global" | SuperAdmin only | SuperAdmin only |
| `institute` | 🟢 Green "Institute" | Institute Admin | Institute Admin |
| `teacher` | 🟣 Purple "My Question" | Creator only | Creator only |

---

## Question Card Display

Each question card displays:

| Element | Description |
|---------|-------------|
| Question ID | Internal identifier (optional display) |
| Type Badge | MCQ, Numerical, True/False, etc. |
| Difficulty Badge | Easy (green), Medium (yellow), Hard (orange), Expert (red) |
| Cognitive Badge | Logical, Analytical, Conceptual, etc. |
| Subject | Physics, Chemistry, Mathematics, etc. |
| Chapter | Chapter name |
| Topic | Topic name |
| Curriculum/Course Tag | CBSE, JEE Mains, etc. |
| Question Preview | First 100 characters + LaTeX render |
| Actions | Preview, Edit, Delete buttons |
| View Solution | Expandable solution section |

---

## Create Question - Manual Entry

### Create Question Page Layout

The page is split into two sections:
- **Left Panel**: Question Details (type, text, options, solution)
- **Right Panel**: Classification (curriculum/course, subject, chapter, topic, difficulty, cognitive)

### Creation Flow

1. Click "Add Question"
2. **Select Question Type** (affects left panel UI)
3. **Fill Question Details**:
   - Question text (with LaTeX support via KaTeX)
   - Options (for MCQ types)
   - Correct answer selection
   - Solution/Explanation
   - Hint (optional)
4. **Fill Classification**:
   - Source Type: Curriculum or Course
   - If Curriculum: Curriculum → Class → Subject → Chapter → Topic
   - If Course: Course → Subject → Chapter → Topic
   - Difficulty level
   - Cognitive type
5. **Save Question**

### Type-Specific UI Changes

| Type | Question Details UI |
|------|---------------------|
| MCQ Single | Text + 4 options + radio for correct |
| Multiple Correct | Text + 4+ options + checkboxes for correct |
| Numerical | Text + number input + optional range |
| True/False | Text + T/F radio selection |
| Fill in Blanks | Text with `___blank___` markers + answers per blank |
| Assertion-Reasoning | Assertion text + Reason text + correct option |
| Paragraph | Passage text + add sub-questions button + sub-question forms |
| Short Answer | Text + expected answer + keywords |
| Long Answer | Text + model answer + grading rubric |

---

## Create Question - AI Generation

### AI Generator Page Layout

- **Left Panel**: Classification (Curriculum/Course selection)
- **Right Panel**: Generation options (types, difficulty, cognitive, count, instructions)

### Generation Flow

1. Click "Generate with AI"
2. **Select Classification**:
   - Source Type: Curriculum or Course
   - Navigate: Curriculum → Class → Subject → Chapter
   - **Select Topics** (MULTI-SELECT: can select multiple topics)
3. **Configure Generation**:
   - Question types (multi-select)
   - Difficulty levels (multi-select)
   - Cognitive types (multi-select)
   - Number of questions (1-50)
   - Additional instructions (optional text)
4. Click **Generate Questions**
5. **Review Page**:
   - All generated questions displayed
   - Select/deselect individual questions
   - Edit any question before saving
   - Preview each question
6. Click **Add Selected to Bank**
7. Redirects to Question Bank with new questions

### Key Features

- **Multi-Topic Selection**: After selecting chapter, can select multiple topics
- **Review Before Save**: All questions can be reviewed and edited
- **Selective Save**: Can deselect unwanted questions

---

## Create Question - PDF Extraction

### PDF Upload Wizard (3 Steps)

#### Step 1: Classification
- Select Source Type: Curriculum or Course
- If Curriculum: Select Curriculum → Class → Subject (NO chapter - AI will detect)
- If Course: Select Course → Subject (NO chapter - AI will detect)
- Click **Continue**

#### Step 2: Upload PDF
- Drag & drop or click to select PDF file
- Upload progress indicator
- Processing message: "Upload successful. Processing..."
- Click **Go to Review** (after processing complete)

#### Step 3: Review Extracted Questions
- All questions extracted from PDF displayed in grid
- **AI-Assigned Tags**: Chapter, Topic, Difficulty, Cognitive (auto-detected)
- Each question can be:
  - Previewed (full render with images/LaTeX)
  - Edited (modify text, options, classification)
  - Selected/deselected for saving
- **OCR Verification**: Check that:
  - Images extracted correctly
  - LaTeX/Math formulas preserved
  - ChemSketch diagrams rendered
  - Text not garbled
- Click **Add Selected to Bank**

### Important OCR Checks

| Element | Verification |
|---------|--------------|
| Math Formulas | LaTeX renders correctly |
| Chemical Formulas | Proper formatting |
| Images | Extracted and displayed |
| Diagrams | Clear and readable |
| Tables | Structure preserved |
| Text | No OCR errors |

---

## Difficulty Levels

| Level | Description | Typical Usage |
|-------|-------------|---------------|
| Easy | Basic recall, direct application | Warmup, practice |
| Medium | Application, multi-step | Regular assessment |
| Hard | Analysis, synthesis | Challenging assessment |
| Expert | Competition-level complexity | Advanced/Olympiad |

---

## Cognitive Types

| Type | Description | Example |
|------|-------------|---------|
| Logical | Reasoning, deduction | Syllogism, logic puzzles |
| Analytical | Breaking down problems | Data interpretation |
| Conceptual | Understanding concepts | Theory questions |
| Numerical | Calculation-based | Math problems |
| Application | Real-world application | Word problems |
| Memory | Recall of facts | Definitions, formulas |

---

## Rich Content Support

- **LaTeX**: Mathematical formulas with KaTeX rendering
- **Images**: Question images and diagram support
- **Tables**: Data tables in questions
- **Code**: Code blocks for programming questions
- **Chemical**: ChemSketch formulas

---

## Business Rules

1. **Classification required** - At least Curriculum/Course + Subject + Chapter + Topic
2. **Correct answer required** - All question types must have answer
3. **LaTeX validation** - Formulas must be valid before save
4. **Image alt text** - Required for accessibility
5. **Global questions immutable downstream** - Institutes cannot edit
6. **Duplicate detection** - Warns on similar questions
7. **Delete blocked if used** - Cannot delete questions used in published exams

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Global Questions | Institute Question Bank | Downstream | Available for exam creation (read-only) |
| Global Questions | Teacher Exam Creation | Downstream | Available in question picker (subject-scoped) |
| Question Classification | Master Data | Upstream | Uses curriculum/course hierarchy |
| Questions | Student Tests | Downstream | Questions in exams |

---

## Mobile Behavior

- Question list: Full-width cards, virtualized scroll
- Filters: Horizontal scroll pills
- Manual entry: Full-screen form
- AI generator: Full-screen with stepped flow
- PDF upload: Native file picker, full-screen review
- Question preview: Full-screen drawer
- LaTeX keyboard: Custom input panel

---

## Related Documentation

- [Institute Question Bank](../02-institute/question-bank.md)
- [Teacher Exams](../03-teacher/exams.md)
- [Question Propagation Flow](../05-cross-login-flows/question-propagation.md)
- [Question Bank Tests](../06-testing-scenarios/inter-login-tests/question-bank-tests.md)
- [SuperAdmin Smoke Tests](../06-testing-scenarios/smoke-tests/superadmin.md)

---

*Last Updated: January 2025*
