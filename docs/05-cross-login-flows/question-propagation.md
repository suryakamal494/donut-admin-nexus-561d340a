# Question Propagation - Cross-Login Flow

> How questions flow from SuperAdmin through Institute to Teacher and finally to Students.

---

## Flow Overview

Questions are created at multiple levels (SuperAdmin, Institute, Teacher) and propagate downstream for exam creation and student consumption. This flow documents visibility, editing rights, and usage patterns.

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
│  │  Visibility: All institutes, all teachers                         │ │
│  │  Editability: SuperAdmin only                                      │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                    │                                     │
│                    visible (read-only)                                   │
│                                    ▼                                     │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                    INSTITUTE (LOCAL)                               │ │
│  │  Creates: Institute questions (source: 'institute')               │ │
│  │  Methods: Manual, AI Generation, PDF Upload                        │ │
│  │  Sees: Global + Own institute questions                           │ │
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

## Step-by-Step Flow

### Step 1: SuperAdmin Creates Global Questions

- **Login**: SuperAdmin
- **Location**: `/superadmin/questions`
- **Action**: Creates questions via Manual/AI/PDF
- **Result**: Questions with `source: 'global'` created

### Step 2: Institute Views Global Questions

- **Login**: Institute Admin
- **Location**: `/institute/questions`
- **Action**: Toggles to "All" or "Global" source
- **Result**: Sees global questions (read-only, "Global" badge)

### Step 3: Institute Creates Local Questions

- **Login**: Institute Admin
- **Location**: `/institute/questions`
- **Action**: Creates questions via Manual/AI/PDF
- **Result**: Questions with `source: 'institute'` created

### Step 4: Institute Creates Exam Using Questions

- **Login**: Institute Admin
- **Location**: `/institute/exams-new`
- **Action**: Selects questions from Global + Institute pools
- **Result**: Exam created with mixed question sources

### Step 5: Teacher Sees Available Questions

- **Login**: Teacher
- **Location**: `/teacher/exams`
- **Action**: Creates assessment, browses question bank
- **Result**: Sees Global + Institute questions (subject-scoped)

### Step 6: Teacher Creates Quick Questions

- **Login**: Teacher
- **Location**: Lesson Workspace or Exam creation
- **Action**: Creates ad-hoc questions for quizzes
- **Result**: Questions with `source: 'teacher'` created

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
| View Global | ✓ | ✓ | ✓ (scoped) | ✗ |
| View Institute | ✗ | ✓ | ✓ (scoped) | ✗ |
| View Teacher | ✗ | ✗ | ✓ (own) | ✗ |
| Edit Global | ✓ | ✗ | ✗ | ✗ |
| Edit Institute | ✗ | ✓ | ✗ | ✗ |
| Edit Teacher | ✗ | ✗ | ✓ (own) | ✗ |
| Use in Exam | ✓ | ✓ | ✓ | ✗ |
| Attempt | ✗ | ✗ | ✗ | ✓ |

---

## Question Source Badges

| Source | Badge | Edit Rights | Delete Rights |
|--------|-------|-------------|---------------|
| `global` | 🔵 Global | SuperAdmin only | SuperAdmin only |
| `institute` | 🟢 Institute | Institute Admin | Institute Admin |
| `teacher` | 🟣 My Question | Creator only | Creator only |

---

## Scope Filtering Rules

### Teacher Visibility

Teachers see questions filtered by:
1. **Subject**: Only their assigned subjects
2. **Class**: Only classes they teach
3. **Source**: Global + Institute + Own

### Student Visibility

Students see questions only via:
1. **Assigned Exams**: Questions included in exam
2. **Homework Tests**: If homework includes test-type

---

## Constraints & Rules

1. **Global questions are immutable downstream**
2. **Institute questions cannot be edited by teachers**
3. **Teacher questions are personal to creator**
4. **Deletion blocked if question used in published exam**
5. **AI-generated questions require review before use**
6. **PDF-extracted questions may need manual correction**

---

## What Could Go Wrong

| Scenario | Cause | Effect | How to Verify |
|----------|-------|--------|---------------|
| Empty question bank | No questions for subject | Cannot create exam | Check question count per subject |
| Wrong difficulty mix | No variety in questions | Unbalanced exam | Check difficulty distribution |
| LaTeX render failure | Invalid formula syntax | Question displays incorrectly | Preview before saving |
| Duplicate questions | Same question added twice | Redundant exam content | Run duplicate detection |

---

## Test Scenarios

See:
- [Exam Tests](../06-testing-scenarios/inter-login-tests/exam-tests.md)
- [Question Bank Smoke Tests](../06-testing-scenarios/smoke-tests/superadmin.md)

---

*Last Updated: January 2025*
