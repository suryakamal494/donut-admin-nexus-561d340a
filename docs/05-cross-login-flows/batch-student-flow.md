# Batch-Student Flow - Cross-Login Flow

> How batch creation and student enrollment affects visibility across portals.

---

## Flow Overview

Batches are the organizational unit connecting students to curriculum, teachers, and content. This flow documents how batch creation and student enrollment propagates to create the student experience.

## Flow Diagram

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                      BATCH-STUDENT FLOW                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                    INSTITUTE CREATES                               │ │
│  │                                                                    │ │
│  │  Batch "10A"                                                       │ │
│  │  ├── Class: Class 10 (from CBSE curriculum)                       │ │
│  │  ├── Track: CBSE                                                  │ │
│  │  ├── Year: 2024-25                                                │ │
│  │  ├── Subjects: Physics, Chemistry, Maths, English                 │ │
│  │  └── Teachers:                                                    │ │
│  │      ├── Physics → Dr. Kumar                                      │ │
│  │      ├── Chemistry → Mrs. Singh                                   │ │
│  │      ├── Maths → Mr. Sharma                                       │ │
│  │      └── English → Ms. Gupta                                      │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                    │                                     │
│              ┌────────────────────┴────────────────────┐                │
│              ▼                                          ▼                │
│  ┌─────────────────────────┐              ┌─────────────────────────┐   │
│  │   TEACHER IMPACT        │              │   TIMETABLE IMPACT      │   │
│  │                         │              │                         │   │
│  │   Dr. Kumar sees:       │              │   Slots available for:  │   │
│  │   ├── 10A in batches    │              │   ├── Physics periods   │   │
│  │   ├── Physics schedule  │              │   ├── Chemistry periods │   │
│  │   └── 10A students      │              │   └── etc.              │   │
│  └─────────────────────────┘              └─────────────────────────┘   │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                    STUDENT ENROLLED                                │ │
│  │                                                                    │ │
│  │  Student "Rahul" → Batch "10A"                                    │ │
│  │  Result:                                                          │ │
│  │  ├── Dashboard: Shows 10A schedule                                │ │
│  │  ├── Subjects: Physics, Chemistry, Maths, English cards           │ │
│  │  ├── Chapters: All chapters from Class 10 subjects                │ │
│  │  ├── Content: Only content assigned to 10A                        │ │
│  │  ├── Homework: Only homework assigned to 10A                      │ │
│  │  ├── Tests: Only tests assigned to 10A                            │ │
│  │  └── Teachers: Sees Dr. Kumar for Physics, etc.                   │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Flow

### Step 1: Institute Creates Batch

- **Login**: Institute Admin
- **Location**: `/institute/batches`
- **Action**: Creates batch with class, subjects, teachers
- **Result**: Batch available for student enrollment

### Step 2: Institute Assigns Teachers

- **Login**: Institute Admin
- **Location**: `/institute/batches` (wizard step 3)
- **Action**: Maps subjects to teachers
- **Result**: Teachers linked to batch

### Step 3: Teacher Sees Batch

- **Login**: Teacher
- **Location**: `/teacher/dashboard`
- **Action**: Views assigned batches
- **Result**: Batch appears in teacher's scope

### Step 4: Institute Enrolls Student

- **Login**: Institute Admin
- **Location**: `/institute/students`
- **Action**: Assigns student to batch
- **Result**: Student linked to batch

### Step 5: Student Accesses Dashboard

- **Login**: Student
- **Location**: `/student/dashboard`
- **Action**: Views dashboard
- **Result**: Sees schedule from batch timetable

### Step 6: Student Views Subjects

- **Login**: Student
- **Location**: `/student/subjects`
- **Action**: Views subject cards
- **Result**: Sees subjects from batch curriculum

### Step 7: Teacher Assigns Content

- **Login**: Teacher
- **Location**: `/teacher/content`
- **Action**: Assigns content to batch
- **Result**: Content visible to batch students

### Step 8: Student Sees Content

- **Login**: Student
- **Location**: `/student/subject/:id` → Chapter
- **Action**: Browses content
- **Result**: Sees assigned content

---

## Permission Matrix

| Action | Institute | Teacher | Student |
|--------|-----------|---------|---------|
| Create Batch | ✓ | ✗ | ✗ |
| Edit Batch | ✓ | ✗ | ✗ |
| Delete Batch | ✓ (if empty) | ✗ | ✗ |
| Enroll Students | ✓ | ✗ | ✗ |
| View Batch Students | ✓ | ✓ (assigned) | ✗ |
| Assign Content to Batch | ✓ | ✓ | ✗ |
| View Batch Content | ✓ | ✓ | ✓ (enrolled) |

---

## What Batch Controls

| Aspect | How Batch Controls It |
|--------|----------------------|
| **Schedule** | Timetable created for batch |
| **Subjects** | From batch class curriculum |
| **Chapters** | From batch subjects |
| **Teachers** | Assigned per subject |
| **Content** | Assigned to batch |
| **Homework** | Assigned to batch |
| **Tests** | Assigned to batch |
| **Progress** | Tracked per batch |

---

## Student Visibility Rules

Student sees content if:

```text
1. Content assigned to their batch
   OR
2. Content is part of lesson plan for their class
   OR
3. Content is homework for their batch
   OR
4. Content is in exam assigned to their batch
```

Student does NOT see:

```text
- Global content (unless assigned)
- Institute content (unless assigned)
- Other batches' content
- Teacher's personal content (unless assigned)
```

---

## Constraints & Rules

1. **One batch per student** (typically)
2. **Batch deletion blocked** if students enrolled
3. **Teacher must have subject expertise** for assignment
4. **Batch class determines curriculum**
5. **Academic year tied to batch**
6. **Timetable per batch**

---

## What Could Go Wrong

| Scenario | Cause | Effect | How to Verify |
|----------|-------|--------|---------------|
| Empty subjects | Wrong class selected | Student sees no subjects | Check batch class |
| Wrong teacher | Expertise mismatch | Teacher can't see batch | Verify teacher subjects |
| No schedule | Timetable not created | Empty dashboard | Check timetable status |
| Missing content | Not assigned to batch | Empty chapter view | Check content assignments |
| No homework | Not assigned to batch | Empty homework list | Check homework assignments |

---

## Test Scenarios

See:
- [Batch Tests](../06-testing-scenarios/intra-login-tests/institute.md)
- [Student Visibility Tests](../06-testing-scenarios/inter-login-tests/content-tests.md)

---

*Last Updated: January 2025*
