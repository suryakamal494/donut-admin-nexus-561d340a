# Curriculum & Course Flow - Cross-Login Flow

> How curriculum and course master data propagates across all portals.

---

## Flow Overview

Curriculum and Course structures created in SuperAdmin form the foundational classification system used across all portals. This flow documents how master data propagates and where it's consumed.

## Flow Diagram

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                     CURRICULUM & COURSE FLOW                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                        SUPERADMIN CREATES                          │ │
│  │  Curriculum (CBSE, ICSE) → Classes → Subjects → Chapters → Topics │ │
│  │  Course (JEE, NEET) → Subjects → Mapped + Exclusive Chapters      │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                    │                                     │
│                                    ▼                                     │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                     INSTITUTE CONSUMES                             │ │
│  │  Master Data View (read-only)                                      │ │
│  │  Batch Creation → Select Class from assigned curriculum           │ │
│  │  Teacher Assignment → Subject expertise from curriculum           │ │
│  │  Timetable → Subject-period mapping                               │ │
│  │  Content Library → Classification options                         │ │
│  │  Question Bank → Classification options                           │ │
│  │  Exam Creation → Section/subject structure                        │ │
│  │  Academic Setup → Chapter list for hour allocation                │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                    │                                     │
│                                    ▼                                     │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                      TEACHER CONSUMES                              │ │
│  │  Schedule → Subject-period assignments                            │ │
│  │  Lesson Plans → Chapter/topic context                             │ │
│  │  Content Library → Classification filters                         │ │
│  │  Homework → Chapter/topic assignment                              │ │
│  │  Exams → Question classification                                  │ │
│  │  Academic Progress → Chapter completion tracking                  │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                    │                                     │
│                                    ▼                                     │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                      STUDENT CONSUMES                              │ │
│  │  Subjects Page → Subject cards from batch curriculum              │ │
│  │  Chapter View → Chapter list from subject                         │ │
│  │  Content Viewer → Content classified by chapter/topic             │ │
│  │  Tests → Questions classified by chapter                          │ │
│  │  Progress → Chapter-wise completion tracking                      │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Flow

### Step 1: SuperAdmin Creates Curriculum

- **Login**: SuperAdmin
- **Location**: `/superadmin/curriculum`
- **Action**: Creates curriculum with full hierarchy
- **Result**: Curriculum available for institute assignment

### Step 2: SuperAdmin Creates Course (Optional)

- **Login**: SuperAdmin
- **Location**: `/superadmin/courses`
- **Action**: Creates course mapping curriculum chapters
- **Result**: Course available for institute assignment

### Step 3: SuperAdmin Assigns to Institute

- **Login**: SuperAdmin
- **Location**: `/superadmin/institutes`
- **Action**: Assigns curricula/courses to institute
- **Result**: Institute can access assigned structures

### Step 4: Institute Views Master Data

- **Login**: Institute Admin
- **Location**: `/institute/masterdata`
- **Action**: Views assigned curricula/courses (read-only)
- **Result**: Reference for batch creation

### Step 5: Institute Creates Batches

- **Login**: Institute Admin
- **Location**: `/institute/batches`
- **Action**: Creates batch selecting class from curriculum
- **Result**: Batch linked to curriculum class

### Step 6: Institute Creates Timetable

- **Login**: Institute Admin
- **Location**: `/institute/timetable/workspace`
- **Action**: Assigns subjects from curriculum to periods
- **Result**: Subject-period mappings created

### Step 7: Teacher Sees Schedule

- **Login**: Teacher
- **Location**: `/teacher/schedule`
- **Action**: Views assigned subjects from curriculum
- **Result**: Knows what subjects to teach

### Step 8: Student Sees Subjects

- **Login**: Student
- **Location**: `/student/subjects`
- **Action**: Views subjects from batch curriculum
- **Result**: Can navigate to chapters

---

## Permission Matrix

| Action | SuperAdmin | Institute | Teacher | Student |
|--------|------------|-----------|---------|---------|
| Create Curriculum | ✓ | ✗ | ✗ | ✗ |
| Edit Curriculum | ✓ | ✗ | ✗ | ✗ |
| Delete Curriculum | ✓ | ✗ | ✗ | ✗ |
| View Curriculum | ✓ | ✓ (assigned) | ✓ (scoped) | ✓ (batch) |
| Create Course | ✓ | ✗ | ✗ | ✗ |
| Assign to Institute | ✓ | ✗ | ✗ | ✗ |
| Use for Classification | ✓ | ✓ | ✓ | ✗ |

---

## Downstream Impact Points

### When Curriculum Changes

| Change | Impact | Affected Portals |
|--------|--------|------------------|
| Add Subject | New subject available | Inst, Teacher, Student |
| Rename Chapter | Label updates everywhere | All |
| Delete Chapter | ⚠️ Blocked if content exists | N/A |
| Reorder Topics | Sequence updates | Teacher lesson plans |

### When Course Changes

| Change | Impact | Affected Portals |
|--------|--------|------------------|
| Map new chapter | Chapter available in course context | Institute, Teacher |
| Unmap chapter | ⚠️ Blocked if content exists | N/A |
| Add exclusive chapter | New chapter for course only | Institute, Teacher |

---

## Constraints & Rules

1. **Curriculum is read-only downstream** - Only SuperAdmin can modify
2. **Deletion blocked if used** - Cannot delete if content/questions reference it
3. **Assignment required** - Institute must be assigned curriculum to use it
4. **Scope filtering** - Teachers see only their assigned subjects
5. **Student scope** - Students see only their batch curriculum

---

## What Could Go Wrong

| Scenario | Cause | Effect | How to Verify |
|----------|-------|--------|---------------|
| Missing subjects | Curriculum not assigned | Empty subject dropdown | Check institute assignments |
| Wrong chapters | Wrong curriculum selected | Mismatched content | Verify batch curriculum |
| Empty classification | No topics created | Cannot classify granularly | Check topic creation |
| Broken references | Chapter deleted | Orphaned content | Run integrity check |

---

## Test Scenarios

See:
- [Curriculum Tests](../06-testing-scenarios/inter-login-tests/curriculum-tests.md)
- [SuperAdmin Smoke Tests](../06-testing-scenarios/smoke-tests/superadmin.md)

---

*Last Updated: January 2025*
