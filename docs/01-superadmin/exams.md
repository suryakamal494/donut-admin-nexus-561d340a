# Exams - PYP & Grand Tests

> Create platform-wide examinations including Previous Year Papers and Grand Tests.

---

## Overview

The SuperAdmin Exams module manages platform-level examinations that can be assigned to institutes. This includes Previous Year Papers (PYP) from competitive exams and Grand Tests for benchmarking across institutes.

## Access

- **Route**: `/superadmin/exams`
- **Login Types**: SuperAdmin
- **Permissions Required**: `exams.view`, `exams.create`, `exams.edit`, `exams.delete`
- **Types**: `previousYearPapers`, `grandTests`

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| PageHeader | Title + "Create Exam" action | Top |
| ExamTabs | PYP / Grand Tests tabs | Below header |
| FilterBar | Year, subject, status filters | With tabs |
| ExamTable | List of exams | Main content |
| ExamBuilder | Exam creation wizard | Full page |
| ExamPreview | Question-by-question preview | Dialog |

---

## Previous Year Papers Tab

### Purpose

Previous Year Papers (PYP) are official historical question papers from competitive exams (JEE Mains, JEE Advanced, NEET). They are organized by exam type and displayed year-wise for easy navigation.

### Display Structure

Papers are grouped hierarchically:
- **Exam Type** (JEE Mains, JEE Advanced, NEET)
  - **Year** (2024, 2023, 2022, etc.) - displayed as expandable accordions
    - **Individual Papers** (with session info if applicable)

### Paper Card Actions

| Action | Icon | Description |
|--------|------|-------------|
| View | Eye | Opens full preview of question paper with all questions, sections, and marking scheme |
| Edit | Pencil | Opens review/configure page to modify questions, tagging, and settings |
| Stats | BarChart | Shows performance statistics across all student attempts |

### Year-wise Organization

Papers are automatically grouped by year under each exam type. When you expand a year accordion, you see all papers from that year (e.g., JEE Mains 2024 January Session, JEE Mains 2024 April Session).

---

## Grand Tests Tab

### Purpose

Grand Tests are platform-wide mock examinations created by SuperAdmin to be conducted across multiple institutes. They serve as benchmarking assessments where students from different institutes compete together.

### Display Structure

Grand Tests are displayed in a **grid layout** (not year-wise like PYP). Each test card shows:
- Test name
- Pattern (JEE Main, JEE Advanced, NEET)
- Status badge (Draft, Scheduled, Live, Completed)
- Question count
- Created date

### Grand Test Card Actions

| Action | Icon | Description |
|--------|------|-------------|
| View | Eye | Opens full preview of question paper |
| Edit | Pencil | Opens exam editor to modify questions and settings |
| Schedule | Calendar | Set date and time for exam availability |
| Audience | Users | Select which institutes can take this test |
| Stats | BarChart | View performance analytics (after completion) |
| Delete | Trash | Remove draft tests (not available for published) |

### Schedule Functionality

- **Purpose**: Set when students can start taking the exam
- **Fields**: Date picker + Time slot selector (30-minute intervals: 00:00, 00:30, 01:00, etc.)
- **Constraint**: Can only select future dates - past dates are disabled in calendar
- **Effect**: Students can ONLY start the exam after the scheduled time
- **Display**: Institute and students see the scheduled time; countdown shown before start

### Audience Functionality

- **Purpose**: Select which institutes participate in this Grand Test
- **Options**:
  - **Direct Users**: Platform-registered individual students
  - **All Institutes**: Automatic assignment to every institute
  - **Selected Institutes**: Choose specific institutes from checklist
- **Effect**: Only assigned institutes see the test in their Exams module
- **Cascade**: Institute then assigns the Grand Test to specific batches within their institute
- **Participant Count**: Shows estimated total participants based on selections

---

## Features & Functionality

### Exam Types

| Type | Description | Use Case |
|------|-------------|----------|
| **Previous Year Paper** | Historical competitive exam papers | JEE, NEET, Board exams practice |
| **Grand Test** | Platform-wide benchmark tests | Monthly/quarterly assessments across institutes |

### Exam Properties

| Field | Type | Description |
|-------|------|-------------|
| Title | Text | Exam name |
| Type | Enum | PYP or Grand Test |
| Year | Number | Exam year (for PYP) |
| Exam Body | Text | JEE, NEET, CBSE (for PYP) |
| Duration | Number | Time in minutes |
| Total Marks | Number | Maximum score |
| Subjects | Multi-select | Included subjects |
| Sections | Array | Section configuration |
| Status | Enum | Draft, Published, Archived |

---

## Create Previous Year Paper Flow

### Purpose

Upload official competitive exam papers to create tests that match actual exam format. Questions are extracted from the uploaded PDF using AI.

### 3-Step Wizard

**Step 1: Exam Configuration**

| Field | Required | Description |
|-------|----------|-------------|
| Competitive Exam | Yes | JEE Main, JEE Advanced, NEET, or other exam bodies |
| Exam Year | Yes | Year of the paper (2024, 2023, etc.) |
| Session | No | January, February, April, etc. (for multi-session exams) |
| Paper Name | Yes | Auto-generated from above selections, can customize |

**Step 2: Upload PDF**
- Upload official question paper PDF (max 50MB)
- Drag-drop or click to browse for file
- Only PDF format accepted - other formats show error
- Processing indicator shown during AI extraction
- System extracts questions, sections, and marking scheme automatically

**Step 3: Review & Configure**
After upload completes, click "Review & Configure" to verify:
- **Question Count**: Verify all questions extracted (e.g., 75 for JEE Mains)
- **Question Text**: Check text, options, solutions correctly extracted
- **Math Formulas**: LaTeX renders correctly via KaTeX (no broken symbols)
- **Images/Diagrams**: All diagrams from PDF display properly
- **Classification Tags**: Chapter, Topic, Difficulty, Cognitive tags AI-assigned
- **Edit Capability**: Modify any question before publishing

Click "Publish" when verification is complete.

---

## Create Grand Test Flow

### Purpose

Create mock tests to conduct across institutes for benchmarking student performance.

### 4-Step Wizard

**Step 1: Test Configuration**

| Field | Required | Description |
|-------|----------|-------------|
| Test Name | Yes | Custom name for the test |
| Content Source | Yes | Toggle: Curriculum OR Course selection |
| Curriculum/Course | Yes | Select the content source for questions |
| Exam Pattern | Yes | JEE Main, JEE Advanced, NEET (defines section structure) |

**Step 2: Creation Method**

| Method | Description |
|--------|-------------|
| Generate using AI | AI creates questions based on specifications you provide |
| Upload PDF | Extract questions from an existing question paper document |

**Step 3: AI Settings (if AI method selected)**

| Configuration | Description |
|---------------|-------------|
| Subject Distribution | Questions per subject (Physics, Chemistry, Math/Biology) |
| Difficulty Distribution | Easy %, Medium %, Hard % (sliders, must total 100%) |
| Cognitive Distribution | Logical %, Analytical %, Conceptual %, Numerical %, Application %, Memory % (must total 100%) |

**Step 3: Upload PDF (if PDF method selected)**
- Same flow as PYP upload
- Upload question paper, wait for extraction

**Step 4: Complete**
- Success message shown
- Options: "Review & Configure" or "Go to Exams"
- Redirects to Review & Configure page for same verification as PYP

---

## Grand Test Assignment Flow

### SuperAdmin → Institute → Batch → Student

```text
SuperAdmin creates Grand Test
         │
         ▼
SuperAdmin clicks "Audience" → Selects Institutes
         │
         ▼
Selected Institutes see Grand Test in their Exams module
         │
         ▼
Institute Admin assigns Grand Test to specific Batches
         │
         ▼
Students in assigned Batches see test in their Tests list
         │
         ▼
Students can start ONLY after scheduled time passes
```

### Key Business Rules

1. **Grand Test is NOT automatically visible** to all institutes after creation
2. SuperAdmin must **explicitly assign via Audience dialog** for institutes to see it
3. Assigned institutes can **only assign to their batches** - they cannot edit the test
4. Only students in **assigned batches can attempt** the test
5. **Schedule controls availability** - students cannot start before scheduled time
6. **Schedule changes propagate** immediately to all institutes and students

---

## Exam Structure Example

```text
JEE Mains 2024 - Paper 1
├── Section A: Physics (20 MCQ, 10 Integer)
│   ├── Marking: +4/-1 MCQ, +4/0 Integer
│   └── Questions from: Mechanics, Electromagnetism, etc.
├── Section B: Chemistry (20 MCQ, 10 Integer)
│   ├── Marking: +4/-1 MCQ, +4/0 Integer
│   └── Questions from: Organic, Inorganic, Physical
└── Section C: Mathematics (20 MCQ, 10 Integer)
    ├── Marking: +4/-1 MCQ, +4/0 Integer
    └── Questions from: Calculus, Algebra, Geometry
```

---

## Manage Exams

| Action | How | Result |
|--------|-----|--------|
| View/Preview | Click View on exam card | Opens question-by-question preview |
| Edit | Click Edit on exam card | Opens review/configure page |
| Schedule | Click Schedule on GT card | Opens schedule dialog with date/time picker |
| Audience | Click Audience on GT card | Opens institute selection dialog |
| Publish | Click Publish on draft exam | Makes available to assigned institutes |
| Archive | Click Archive | Removes from active list, results preserved |
| Delete | Click Delete on draft | Removes exam permanently (drafts only) |

---

## Data Flow

```text
Source: SuperAdmin creates exam
         │
         ▼
Storage: examsData.ts
         ├── exam definition
         ├── section configuration
         ├── question mappings
         ├── schedule settings
         └── institute assignments (Audience)
         │
         ▼
Visibility:
├── Institute Exam Management (can assign to batches)
├── Teacher (can see assigned exams, view only)
└── Student (can attempt assigned exams after schedule)
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Audience Assignment | Institute Exams | Downstream | GT appears in institute's Exams module |
| Schedule | Student Tests | Downstream | Controls when "Start" button activates |
| PYP/Grand Test | Institute Exams | Downstream | Available for batch assignment |
| Exam Assignment | Student Tests | Downstream | Appears in student's test list |
| Question Selection | Question Bank | Upstream | Uses global questions |
| Results | Institute Analytics | Downstream | Performance data flows to reports |

---

## Business Rules

1. **PYP must have year and exam body** specified
2. **Grand Tests require audience assignment** before institutes can see them
3. **Schedule must be future date** - past dates are disabled
4. **Section totals must match** question count in pattern
5. **Marking scheme required** for each section
6. **Questions must match section type** (MCQ in MCQ section)
7. **Published exams** cannot modify questions (only schedule)
8. **Archive removes** from institute access but preserves results
9. **Institutes cannot edit** SuperAdmin-created exams (view and assign only)

---

## Mobile Behavior

- Exam list: Horizontal scroll table on PYP, card grid on GT
- Exam builder: Full-screen stepped wizard
- Schedule dialog: Full-screen drawer with date picker
- Audience dialog: Full-screen drawer with institute checklist
- Question preview: Full-screen with swipe navigation
- Results: Card-based analytics with charts

---

## Related Documentation

- [Institute Exams](../02-institute/exams-new.md)
- [Teacher Exams](../03-teacher/exams.md)
- [Student Test Player](../04-student/test-player.md)
- [Exam Flow](../05-cross-login-flows/exam-flow.md)
- [SuperAdmin Smoke Tests](../06-testing-scenarios/smoke-tests/superadmin.md)
- [Exam Cross-Portal Tests](../06-testing-scenarios/inter-login-tests/exam-tests.md)

---

*Last Updated: January 2025*
