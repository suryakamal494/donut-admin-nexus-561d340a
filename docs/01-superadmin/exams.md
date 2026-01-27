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

## Features & Functionality

### Exam Types

| Type | Description | Use Case |
|------|-------------|----------|
| **Previous Year Paper** | Historical competitive exam papers | JEE, NEET, Board exams |
| **Grand Test** | Platform-wide benchmark tests | Monthly/quarterly assessments |

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

### Create PYP Flow

1. Click "Create Exam" → "Previous Year Paper"
2. **Exam Details**
   - Select exam body (JEE Mains, NEET, etc.)
   - Select year
   - Title (auto-generated or custom)
   - Duration
3. **Section Configuration**
   - Define sections (Physics, Chemistry, Math)
   - Questions per section
   - Marking scheme
4. **Add Questions**
   - Select from Question Bank
   - Or upload paper PDF for extraction
   - Map to sections
5. **Review & Publish**

### Create Grand Test Flow

1. Click "Create Exam" → "Grand Test"
2. **Test Details**
   - Title
   - Description
   - Schedule date
   - Duration
3. **Target Configuration**
   - Select classes
   - Select subjects
   - Select chapters (optional)
4. **Section Configuration**
   - Define sections
   - Question types per section
   - Marking scheme
5. **Add Questions**
   - Select from Question Bank
   - AI Generate for sections
   - Review and adjust
6. **Institute Assignment**
   - Select institutes
   - Set availability window
7. **Publish**

### Exam Structure

```text
JEE Mains 2024 - Paper 1
├── Section A: Physics (20 MCQ, 10 Integer)
│   ├── Marking: +4/-1 MCQ, +4/0 Integer
│   └── Questions from: Mechanics, Electromagnetism, etc.
├── Section B: Chemistry (20 MCQ, 10 Integer)
│   └── ...
└── Section C: Mathematics (20 MCQ, 10 Integer)
    └── ...
```

### Manage Exams

| Action | How | Result |
|--------|-----|--------|
| Preview | Click exam row | Opens question preview |
| Edit | Click edit | Opens exam builder |
| Publish | Click publish | Makes available to institutes |
| Archive | Click archive | Removes from active list |
| Duplicate | Action menu | Creates copy |
| View Results | Click results | Shows aggregated analytics |

### Institute Assignment

| Field | Description |
|-------|-------------|
| Target Institutes | Select which institutes can use this exam |
| Availability Window | Start and end dates |
| Auto-assign | Automatically assign to matching batches |
| Proctoring | Enable/disable proctoring requirements |

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
         └── institute assignments
         │
         ▼
Visibility:
├── Institute Exam Management (can assign to batches)
├── Teacher (can see assigned exams)
└── Student (can attempt assigned exams)
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| PYP/Grand Test | Institute Exams | Downstream | Available for batch assignment |
| Exam Assignment | Student Tests | Downstream | Appears in test list |
| Question Selection | Question Bank | Upstream | Uses global questions |
| Results | Institute Analytics | Downstream | Performance data flows |

---

## Business Rules

1. **PYP must have year and exam body** specified
2. **Grand Tests require target institutes** for publishing
3. **Section totals must match** question count
4. **Marking scheme required** for each section
5. **Questions must match section type** (MCQ in MCQ section)
6. **Published exams** cannot modify questions (only schedule)
7. **Archive removes** from institute access
8. **Results persist** even after archiving

---

## Mobile Behavior

- Exam list: Horizontal scroll table
- Exam builder: Full-screen stepped wizard
- Question selection: Bottom sheet with search
- Preview: Full-screen with swipe navigation
- Results: Card-based analytics

---

## Related Documentation

- [Institute Exams](../02-institute/exams-new.md)
- [Teacher Exams](../03-teacher/exams.md)
- [Student Test Player](../04-student/test-player.md)
- [Exam Flow](../05-cross-login-flows/exam-flow.md)
- [SuperAdmin Smoke Tests](../06-testing-scenarios/smoke-tests/superadmin.md)

---

*Last Updated: January 2025*
