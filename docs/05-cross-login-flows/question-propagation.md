# Question Propagation - Cross-Login Flow

> How questions flow from SuperAdmin through Institute to Teacher and finally to Students, with strict curriculum/course-based access control.

---

## Flow Overview

Questions are created at multiple levels (SuperAdmin, Institute, Teacher) and propagate downstream for exam creation and student consumption. This flow documents visibility, editing rights, and usage patterns.

**Critical Business Rule:** Questions are ONLY visible to institutes based on their assigned curricula and courses. This boundary must be strictly enforced.

---

## Flow Diagram

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                     QUESTION PROPAGATION FLOW                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                    SUPERADMIN (GLOBAL)                             │ │
│  │  Creates: Global questions (source: 'global')                      │ │
│  │  Methods: Manual, AI Generation, PDF Upload                        │ │
│  │  Classification: Curriculum/Course + Subject + Chapter + Topic     │ │
│  │  Visibility: Institutes with matching curriculum/course ONLY       │ │
│  │  Editability: SuperAdmin only                                      │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                    │                                     │
│                    visible (filtered by assignment)                      │
│                                    ▼                                     │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                    INSTITUTE (LOCAL)                               │ │
│  │  Creates: Institute questions (source: 'institute')               │ │
│  │  Methods: Manual, AI Generation, PDF Upload                        │ │
│  │  Sees: Global (matching assigned curriculum/course) + Own          │ │
│  │  Edits: Own institute questions only                              │ │
│  │  Uses: All visible questions for exam creation                    │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                    │                                     │
│                    visible (subject-scoped)                              │
│                                    ▼                                     │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                        TEACHER                                     │ │
│  │  Creates: Quick quiz questions (source: 'teacher')                │ │
│  │  Sees: Global + Institute + Own (subject-filtered)                │ │
│  │  Edits: Own questions only                                        │ │
│  │  Uses: All visible questions for assessments                      │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                    │                                     │
│                    via exam assignment                                   │
│                                    ▼                                     │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                        STUDENT                                     │ │
│  │  Creates: Nothing                                                  │ │
│  │  Sees: Questions only through assigned exams                      │ │
│  │  Interaction: Attempt, submit answers                             │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Curriculum/Course Filtering Rules

### Critical: Assignment-Based Visibility

When SuperAdmin creates questions, they are tagged to a specific:
- **Curriculum** (CBSE, ICSE, State Board) + Class + Subject + Chapter + Topic
- OR **Course** (JEE, NEET, Olympiad) + Subject + Chapter + Topic

Institutes are assigned specific curricula and courses during creation. **Only questions matching those assignments are visible.**

### Filtering Example

```text
┌────────────────────────────────────────────────────────────────────┐
│                   ASSIGNMENT-BASED FILTERING                        │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  SuperAdmin Creates Questions:                                      │
│  ├── CBSE > Class 11 > Physics > Kinematics (50 questions)         │
│  ├── ICSE > Class 10 > Chemistry > Acids (30 questions)            │
│  ├── JEE Mains > Physics > Mechanics (40 questions)                │
│  └── NEET > Biology > Genetics (25 questions)                      │
│                                                                     │
│                         │                                           │
│              ┌──────────┴──────────┐                                │
│              ▼                     ▼                                │
│  ┌─────────────────────┐  ┌─────────────────────┐                  │
│  │    Institute A      │  │    Institute B      │                  │
│  │  Assigned:          │  │  Assigned:          │                  │
│  │  • CBSE             │  │  • ICSE             │                  │
│  │  • JEE Mains        │  │  • NEET             │                  │
│  │                     │  │                     │                  │
│  │  SEES:              │  │  SEES:              │                  │
│  │  ✓ CBSE Physics     │  │  ✓ ICSE Chemistry   │                  │
│  │    (50 questions)   │  │    (30 questions)   │                  │
│  │  ✓ JEE Physics      │  │  ✓ NEET Biology     │                  │
│  │    (40 questions)   │  │    (25 questions)   │                  │
│  │                     │  │                     │                  │
│  │  HIDDEN:            │  │  HIDDEN:            │                  │
│  │  ✗ ICSE Chemistry   │  │  ✗ CBSE Physics     │                  │
│  │  ✗ NEET Biology     │  │  ✗ JEE Physics      │                  │
│  └─────────────────────┘  └─────────────────────┘                  │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

### Boundary Enforcement

This is a **strict security boundary**. An institute with only CBSE assigned should NEVER be able to:
- See ICSE questions in their Question Bank
- Search and find ICSE questions
- Use ICSE questions in exams
- Access ICSE questions via direct URL

---

## Step-by-Step Flow

### Step 1: SuperAdmin Creates Global Questions

- **Login**: SuperAdmin
- **Location**: `/superadmin/questions`
- **Action**: Creates questions via Manual/AI/PDF with full classification
- **Classification Required**: 
  - Curriculum: Curriculum + Class + Subject + Chapter + Topic + Difficulty + Cognitive
  - Course: Course + Subject + Chapter + Topic + Difficulty + Cognitive
- **Result**: Questions with `source: 'global'` created

### Step 2: Institute Views Filtered Questions

- **Login**: Institute Admin
- **Location**: `/institute/questions`
- **Action**: Views Question Bank
- **Result**: 
  - Sees ONLY global questions matching assigned curricula/courses
  - Questions show "Global" badge
  - Edit/Delete buttons NOT visible (read-only)

### Step 3: Institute Creates Local Questions

- **Login**: Institute Admin
- **Location**: `/institute/questions`
- **Action**: Creates questions via Manual/AI/PDF
- **Result**: Questions with `source: 'institute'` created
- **Note**: Institute questions tagged to their assigned curricula/courses only

### Step 4: Institute Creates Exam Using Questions

- **Login**: Institute Admin
- **Location**: `/institute/exams`
- **Action**: Creates exam, selects questions from bank
- **Result**: Exam created using Global + Institute questions

### Step 5: Teacher Sees Subject-Scoped Questions

- **Login**: Teacher
- **Location**: `/teacher/exams` or Question Bank
- **Action**: Views available questions
- **Result**: 
  - Sees Global + Institute questions filtered by assigned subjects
  - Physics teacher sees only Physics questions

### Step 6: Teacher Creates Quick Questions

- **Login**: Teacher
- **Location**: Lesson Workspace or Exam creation
- **Action**: Creates ad-hoc questions for quizzes
- **Result**: Questions with `source: 'teacher'` created (personal)

### Step 7: Student Attempts Exam

- **Login**: Student
- **Location**: `/student/test/:id`
- **Action**: Takes assigned exam
- **Result**: Sees questions from exam, regardless of source

---

## Permission Matrix

| Action | SuperAdmin | Institute | Teacher | Student |
|--------|------------|-----------|---------|---------|
| Create Global | ✓ | ✗ | ✗ | ✗ |
| Create Institute | ✗ | ✓ | ✗ | ✗ |
| Create Teacher | ✗ | ✗ | ✓ | ✗ |
| View Global | ✓ | ✓ (filtered) | ✓ (scoped) | ✗ |
| View Institute | ✗ | ✓ | ✓ (scoped) | ✗ |
| View Teacher | ✗ | ✗ | ✓ (own) | ✗ |
| Edit Global | ✓ | ✗ | ✗ | ✗ |
| Edit Institute | ✗ | ✓ | ✗ | ✗ |
| Edit Teacher | ✗ | ✗ | ✓ (own) | ✗ |
| Use in Exam | ✓ | ✓ | ✓ | ✗ |
| Attempt | ✗ | ✗ | ✗ | ✓ |

---

## Question Source Badges

| Source | Badge | Color | Edit Rights | Delete Rights |
|--------|-------|-------|-------------|---------------|
| `global` | Global | 🔵 Blue | SuperAdmin only | SuperAdmin only |
| `institute` | Institute | 🟢 Green | Institute Admin | Institute Admin |
| `teacher` | My Question | 🟣 Purple | Creator only | Creator only |

---

## Question Classification Tags

### For Curriculum Questions (7 tags)

| Tag | Description |
|-----|-------------|
| Curriculum | CBSE, ICSE, State Board |
| Class | Class 6-12 |
| Subject | Physics, Chemistry, etc. |
| Chapter | Specific chapter |
| Topic | Specific topic |
| Difficulty | Easy, Medium, Hard, Expert |
| Cognitive | Logical, Analytical, Conceptual, Numerical, Application, Memory |

### For Course Questions (6 tags)

| Tag | Description |
|-----|-------------|
| Course | JEE Mains, NEET, Olympiad, etc. |
| Subject | Physics, Chemistry, etc. |
| Chapter | Course chapter |
| Topic | Specific topic |
| Difficulty | Easy, Medium, Hard, Expert |
| Cognitive | Logical, Analytical, Conceptual, Numerical, Application, Memory |

**Note**: Courses do NOT have Class context.

---

## Scope Filtering Rules

### Institute Visibility

Institutes see questions filtered by:
1. **Assigned Curricula**: Questions tagged to assigned curricula only
2. **Assigned Courses**: Questions tagged to assigned courses only
3. **Combined**: Both curriculum AND course questions visible

### Teacher Visibility

Teachers see questions filtered by:
1. **Institute Visibility**: Same base filter as institute
2. **Subject**: Only their assigned subjects
3. **Class**: Only classes they teach
4. **Source**: Global + Institute + Own

### Student Visibility

Students see questions only via:
1. **Assigned Exams**: Questions included in exam
2. **Homework Tests**: If homework includes test-type

---

## Constraints & Rules

1. **Global questions are immutable downstream** - Cannot edit at Institute or Teacher level
2. **Institute questions cannot be edited by teachers** - Read-only for teachers
3. **Teacher questions are personal to creator** - Other teachers cannot see
4. **Deletion blocked if question used in published exam** - Must unpublish first
5. **AI-generated questions require review before use** - Not auto-saved to bank
6. **PDF-extracted questions may need manual correction** - OCR not perfect
7. **Curriculum/Course boundary is strict** - No cross-boundary access

---

## What Could Go Wrong

| Scenario | Cause | Effect | How to Verify |
|----------|-------|--------|---------------|
| Institute sees wrong questions | Incorrect assignment | Access to unassigned curriculum | Search for unassigned content, verify 0 results |
| Empty question bank | No questions for assigned curriculum | Cannot create exams | Check question count per curriculum |
| Wrong difficulty mix | No variety in questions | Unbalanced exam | Check difficulty distribution |
| LaTeX render failure | Invalid formula syntax | Question displays incorrectly | Preview before saving |
| Cross-curriculum leak | Filter bug | Security violation | Test with multiple institutes |

---

## Verification Checklist

After setting up institutes and questions:

- [ ] Create questions in multiple curricula/courses
- [ ] Create test institutes with different assignments
- [ ] Login to each institute, verify only assigned questions visible
- [ ] Search for unassigned curriculum questions, verify 0 results
- [ ] Verify Global badge on SA questions
- [ ] Verify no Edit/Delete buttons on Global questions
- [ ] Create institute question, verify Institute badge
- [ ] Verify Edit/Delete available on own questions

---

## Test Scenarios

See:
- [Question Bank Tests](../06-testing-scenarios/inter-login-tests/question-bank-tests.md)
- [Exam Tests](../06-testing-scenarios/inter-login-tests/exam-tests.md)
- [SuperAdmin Smoke Tests](../06-testing-scenarios/smoke-tests/superadmin.md)

---

*Last Updated: January 2025*
