# Course Assignment & Scope QA — Does the Course Reach the Right People and Batches?

> This guide focuses on how **courses flow through the platform** — from SuperAdmin to Institute to Batch to Teacher — and whether assignment rules, exam distribution, and question bank isolation work correctly. For course **chapter filtering** scenarios (Course Builder, question bank filters, exam creation filters), see the companion doc: [Course Chapter Filtering QA](./course-chapter-filtering-qa.md).

---

## Before You Begin

> **Read the [Course Chapter Filtering QA](./course-chapter-filtering-qa.md) first** for the full glossary, Course Builder explanation, and the Golden Rule. This document assumes familiarity with those concepts and adds assignment-specific terms below.

### Assignment-Specific Terms

| Term | What It Means | Example |
|------|---------------|---------|
| **Batch-Course Linking** | During batch creation, the institute assigns one or more courses to a batch. Each course has its own subject selections independent of curriculums. | Batch "11-A JEE+CBSE" has JEE Mains (Physics, Chemistry) and CBSE Class 11 (Physics, Chemistry, Maths) |
| **Teacher-Course Assignment** | When creating a teacher, the institute assigns courses and subjects. The teacher can only see and operate within their assigned scope. | Teacher A → JEE Mains + Physics; Teacher B → CBSE + Maths |
| **Class-Agnostic (in batch context)** | When a class is selected during batch creation, ALL courses assigned to the institute appear — courses are not filtered by class. Only curriculums filter by class. | Select "Class 10" → CBSE Class 10 and ICSE Class 10 appear as curriculums, but JEE Mains, NEET, Olympiad ALL appear as courses |
| **Institute Question Bank Isolation** | Each institute's question bank is completely walled off from other institutes. SuperAdmin questions flow down; institute questions never flow up or sideways. | Institute A's JEE questions are invisible to Institute B, even with identical assignments |

---

## How Courses Flow Through the Platform

Unlike curriculums which follow a strict class hierarchy, courses flow differently through the platform because they are class-agnostic.

```
┌──────────────────┐
│   SUPER ADMIN     │  Builds courses using Course Builder
│                   │  Assigns courses to institutes
│                   │  Creates global exams/questions for courses
└────────┬─────────┘
         │ assigns courses to institute
         ▼
┌──────────────────┐
│   INSTITUTE       │  Receives assigned courses
│                   │  Creates batches with courses (class-agnostic)
│                   │  Creates teachers with course assignments
│                   │  Uses question bank filtered by course
│                   │  Creates exams filtered by course
└────────┬─────────┘
         │
    ┌────┴─────────────────────┐
    │                          │
    ▼                          ▼
┌──────────────┐      ┌──────────────┐
│    BATCH      │      │   TEACHER     │
│               │      │               │
│ Has courses + │      │ Has courses + │
│ curriculums   │      │ curriculums   │
│ + subjects    │      │ + subjects    │
│ per each      │      │ per each      │
│               │      │               │
│ Course is     │      │ Creates tests │
│ CLASS-        │      │ scoped to     │
│ AGNOSTIC:     │      │ assigned      │
│ shown for     │      │ course/curr.  │
│ ALL classes   │      │               │
└──────┬───────┘      └──────┬───────┘
       │                      │
       │         ┌────────────┘
       │         │ assigns test to batch
       ▼         ▼
┌──────────────────┐
│  TEST / EXAM      │
│                   │  Created under a specific course or curriculum
│                   │  Assignable ONLY to batches that have that
│                   │  specific course or curriculum
│                   │  Teacher can only assign to their own batches
│                   │  that match the test's course/curriculum
└──────────────────┘
```

### Key Difference from Curriculum Flow

In the curriculum flow: selecting a class filters which curriculums are shown.
In the course flow: **courses are always shown regardless of selected class** because courses span all class levels.

This means in batch creation:
- **Curriculum dropdown:** Filtered by selected class (Class 10 → only CBSE Class 10, ICSE Class 10, etc.)
- **Course dropdown:** Shows ALL courses assigned to the institute, regardless of class

### The Filtering Logic When Creating a Test Under a Course

```
Teacher opens "Create Test"
       │
       ▼
Curriculum/Course dropdown ──► Shows teacher's assigned curriculums AND courses
       │
       ▼
Teacher selects a COURSE (e.g., JEE Mains)
       │
       ▼
Subject dropdown ──► Shows ONLY subjects within JEE Mains
       │              that are assigned to this teacher
       │
       ▼
Class dropdown (in question step) ──► This is a DIFFICULTY FILTER
       │                               NOT a scope filter
       │                               Selecting "Class 10" means
       │                               "difficulty level = Class 10"
       │                               It does NOT change the chapter list
       │
       ▼
Chapter/Topic list ──► Shows ONLY JEE Mains chapters
       │                (mapped + course-only)
       │                Even if Class 10 was selected for difficulty,
       │                the chapters remain JEE Mains chapters.
       │                CBSE Class 10 chapters do NOT appear here.
       │
       ▼
Test is created under JEE Mains
       │
       ▼
"Assign to Batches" ──► Shows ONLY batches that:
                          1. Have JEE Mains as an assigned course
                          2. Are assigned to this teacher
                          3. Have the test's subject(s)
```

⚠️ **Critical Bug Pattern:** The class filter in the question generation step should NOT change the chapter tree when a course is selected. If selecting "Class 10" causes the chapter list to switch from JEE Mains chapters to CBSE Class 10 chapters, that is a critical bug.

---

## Test Scenarios

Each scenario below describes a situation and the expected platform behavior. The QA tester decides how to set up and verify each one.

> **Cross-reference:** For chapter filtering scenarios (Course Builder, question bank filters, exam creation filters), see [Course Chapter Filtering QA](./course-chapter-filtering-qa.md). For curriculum-level isolation, see [Curriculum Scope QA](./curriculum-scope-qa.md).

---

### D. Batch Creation with Courses (Institute)

These scenarios test how courses behave during batch creation — specifically the class-agnostic nature of courses and the separate display of course subjects vs. curriculum subjects.

**D1 — Class Selected: All Courses Shown (Class-Agnostic)**
Institute creates a new batch and selects "Class 10" in the first step. In the curriculum/course assignment step:
- **Curriculums:** Only curriculums that have Class 10 are shown (e.g., CBSE Class 10, ICSE Class 10). Curriculums without Class 10 are hidden.
- **Courses:** ALL courses assigned to the institute are shown (JEE Mains, NEET, Olympiad, etc.) regardless of the selected class, because courses are class-agnostic.

**D2 — Course Subjects Displayed Separately from Curriculum Subjects**
A batch is assigned CBSE (curriculum) and JEE Mains (course). In the subject selection step, the subjects should be displayed under separate headers:
- **CBSE:** Physics, Chemistry, Mathematics, Biology, ...
- **JEE Mains:** Physics, Chemistry, Mathematics, ...

The institute can independently select different subjects for each. The subjects should NOT be merged into a single flat list.

**D3 — Batch with Only Course, No Curriculum**
An institute creates a batch assigned to JEE Mains only (no CBSE, no ICSE). Subject selection should show only JEE Mains subjects. Downstream: the batch should only have JEE content. Teachers assigned to this batch need JEE in their scope. Students see only JEE subjects.

**D4 — Batch with Curriculum and Course**
A batch has both CBSE Class 11 and JEE Mains. Both sets of subjects are shown separately during creation. After creation:
- The batch has two distinct scope contexts: CBSE and JEE
- Teachers need either CBSE or JEE in their scope to be linked
- Students see subjects from both, labeled by source
- Exams created under CBSE can be assigned to this batch (it has CBSE)
- Exams created under JEE can also be assigned (it has JEE)

**D5 — Multiple Courses in One Batch**
A batch is assigned JEE Mains and NEET. Each course's subjects should be listed independently in the creation flow. After creation, the batch has two course contexts. Exams under JEE can be assigned. Exams under NEET can also be assigned. But a JEE exam cannot be assigned just because the batch has NEET — the specific course must match.

**D6 — Batch with Multiple Curriculums and Multiple Courses**
Stress test: a batch has CBSE, ICSE, JEE Mains, and NEET. All four should have their subjects listed separately during creation. This is the maximum-complexity scenario — every downstream filter must correctly scope to the selected curriculum/course without cross-contamination.

**D7 — Course Subjects Not Duplicated with Curriculum Subjects**
JEE Mains has "Physics" and CBSE also has "Physics." These are separate entities — JEE Physics chapters differ from CBSE Physics chapters. In batch creation, Physics should appear under both headers but should not be merged or deduplicated into a single "Physics" entry. Each is scoped to its own curriculum/course.

---

### E. Exam Assignment Filtering

These scenarios verify that when an exam is created under a specific course or curriculum, it can only be assigned to batches that have that specific course or curriculum.

**E1 — JEE Exam → Only JEE Batches**
An exam is created under JEE Mains. When assigning this exam to batches, only batches that have JEE Mains assigned should appear in the batch list. Batches with only CBSE or only NEET should NOT appear, even if they belong to the same institute.

**E2 — CBSE Exam → NOT Assignable to JEE-Only Batches**
An exam is created under CBSE curriculum. A batch that has only JEE Mains (no CBSE) should NOT appear in the assignment list. A batch that has both CBSE and JEE should appear (because it has CBSE).

**E3 — Teacher Exam → Only Teacher's Batches with Matching Course**
A teacher creates a JEE Mains exam. The batch assignment list should show only batches that:
1. Have JEE Mains as a course
2. Are assigned to this teacher
3. Have the exam's subject(s)
All three conditions must be met simultaneously.

**E4 — Institute Exam → Same Course-Match Rule**
Institute admin creates an exam under NEET. The batch list should show only batches with NEET. The institute admin sees more batches than a teacher would (all institute batches with NEET, not just one teacher's), but the course-match rule is identical.

**E5 — SuperAdmin Grand Test Under Course**
SuperAdmin creates a grand test tagged to JEE Mains. When this test is distributed, only institutes with JEE assigned should receive it, and within those institutes, only batches with JEE should have the test assignable.

**E6 — Exam for Course-Only Chapter → Same Assignment Rules**
An exam is created under JEE Mains and its questions are tagged to a course-only chapter ("JEE Problem Strategies"). The assignment rules don't change — the exam is under JEE, so only JEE batches are eligible. The fact that the chapter is course-only vs. mapped doesn't affect batch assignment.

**E7 — Multi-Subject Exam: Batch Must Have All Subjects**
An exam under JEE Mains covers both Physics and Chemistry. Only batches that have JEE Mains with BOTH Physics and Chemistry should appear in the assignment list. A batch with JEE + Physics only should NOT be eligible (it's missing Chemistry).

---

### F. Teacher Scope with Courses

These scenarios verify that teacher-level course and subject assignments correctly constrain what the teacher sees and can do.

**F1 — Teacher with Course + Single Subject**
A teacher is assigned JEE Mains + Physics only. When creating a test:
- Course dropdown shows JEE Mains (and any other assigned courses/curriculums)
- Subject dropdown under JEE shows only Physics
- Chapter list shows only JEE Mains Physics chapters (mapped + course-only)
- Batch assignment shows only batches with JEE Mains + Physics that are assigned to this teacher

**F2 — Teacher with Both Curriculum and Course**
A teacher has CBSE (Physics) and JEE Mains (Physics). When creating a test:
- The curriculum/course dropdown shows both CBSE and JEE Mains
- Selecting CBSE → shows CBSE Physics chapters
- Switching to JEE Mains → the entire chapter tree swaps to JEE Mains Physics chapters
- No chapters from the previous selection should linger

**F3 — Teacher with Course Only → Batch List Scoped**
A teacher has only JEE Mains (no curriculum assignments). The teacher's batch list should show only batches that have JEE Mains. Even if the institute has 20 CBSE batches, the teacher sees zero of them.

**F4 — Teacher Creates JEE Test → Assign to JEE Batches Only**
A teacher with JEE Mains and CBSE creates a test under JEE Mains. In the batch assignment step, only batches with JEE Mains (that are also assigned to this teacher) should appear. CBSE-only batches should not appear, even though the teacher has CBSE access.

**F5 — Teacher with Multiple Courses**
A teacher has JEE Mains (Physics) and NEET (Biology). When creating a test:
- Course dropdown shows both JEE and NEET
- Selecting JEE → Physics subject → JEE Physics chapters
- Selecting NEET → Biology subject → NEET Biology chapters
- The two contexts never mix: no Biology chapters under JEE, no Physics chapters under NEET

**F6 — Teacher's Course Assignment Changes Mid-Year**
A teacher initially has JEE Mains. Admin removes JEE and adds NEET. After the edit:
- All JEE batches disappear from teacher's batch list
- NEET batches (with matching subjects) appear
- Test creation shows only NEET in the course dropdown
- Any draft JEE tests — verify handling (orphaned? blocked? still editable?)

**F7 — Teacher Exam Assignment: Subject Must Match Too**
A teacher has JEE Mains with Physics only. The teacher creates a Physics test under JEE. A batch has JEE Mains but with Chemistry only (no Physics). This batch should NOT appear in the assignment list — both the course AND the subject must match.

---

### G. Institute Question Bank Isolation

These scenarios verify that questions created by one institute are invisible to other institutes, that SuperAdmin questions flow downward but never upward, and that teachers within an institute are further scoped to their assigned subjects.

**G1 — Cross-Institute Question Invisibility**
Institute A creates a question under JEE Mains Physics, tagged to a specific chapter. Log in as Institute B (which also has JEE Mains Physics assigned). Browse the question bank under JEE Mains Physics — Institute A's question must NOT appear. Each institute's question bank is completely isolated; there is no cross-institute question sharing, even when both institutes have identical course and subject assignments.

**G2 — SuperAdmin Questions Flow Down, Institute Questions Do Not Flow Up**
SuperAdmin creates a question under JEE Mains Physics. Institute A opens the question bank under JEE Mains Physics — the SuperAdmin's question should be visible (pushed down). Now Institute A creates their own question under the same course/subject/chapter. Log in as SuperAdmin and browse the same chapter — Institute A's question must NOT appear in the SuperAdmin's question bank. The flow is strictly one-directional: SuperAdmin → Institute, never Institute → SuperAdmin.

**G3 — Teacher Sees Only Their Subject's Questions Within Institute Bank**
An institute has two teachers: Teacher X (JEE Physics) and Teacher Y (JEE Chemistry). Teacher X opens the question bank — they should see only JEE Physics questions from their institute's bank plus any SuperAdmin JEE Physics questions pushed down. They must NOT see JEE Chemistry questions, even though both teachers belong to the same institute. This verifies that teacher-level subject scoping is applied on top of institute-level isolation.

---

## What "Working Correctly" Looks Like — Summary

The platform is working correctly when:

1. **Teacher scope applies on top of course filtering.** A teacher sees only courses and subjects assigned to them, further narrowed by the selected course.
2. **Batch creation shows courses as class-agnostic.** All institute courses appear regardless of the selected class; curriculum subjects and course subjects are displayed separately.
3. **Exam assignment matches the exam's course/curriculum to the batch's course/curriculum.** No cross-assignment between unrelated courses.
4. **Institute question banks are completely isolated.** No cross-institute visibility; SA flows down, institutes never flow up.
5. **Teacher question bank is further scoped by subject.** Teachers see only their assigned subjects' questions within their institute's bank.

---

## Quick Reference Matrix

| Entity | Course Constraint | Subject Constraint | Chapter Source |
|--------|------------------|--------------------|---------------|
| **SuperAdmin** | Can create/edit all courses | All subjects available | Full Course Builder: mapped + course-only |
| **Institute** | Only assigned courses visible | Subjects per assigned course | Read-only: sees course's chapter list |
| **Batch** | Assigned courses (class-agnostic) | Subjects selected per course at creation | Inherits from assigned course definition |
| **Teacher** | Subset of institute's courses | Subjects assigned per course to teacher | Filtered: only assigned course's chapters for assigned subjects |
| **Student** | Inherited from batch | Inherited from batch | Sees batch's course subjects and chapters |
| **Exam/Test** | Scoped to selected course | Scoped to selected subject(s) | Chapters from selected course only |
| **Question Bank** | Filtered by selected course | Filtered by selected subject | Chapters from selected course only |
| **Institute Q.Bank** | Isolated per institute; SA flows down only | Teacher sees only assigned subjects | No cross-institute visibility |
| **Batch Assignment** | Must match exam's course | Must match exam's subject(s) | N/A |

### Filtering Rules Quick Check

| Action | What Filters By Course? | What Doesn't Filter By Course? |
|--------|------------------------|-------------------------------|
| Batch creation: course display | ✗ Courses are class-agnostic, always shown | Class filter does NOT hide courses |
| Batch creation: subject display | ✓ Subjects shown per course separately | Subjects are NOT merged across courses |
| Exam assignment: batch list | ✓ Only batches with the exam's course | — |
| Teacher test creation: course dropdown | ✓ Only teacher's assigned courses | Institute's full course list NOT shown |

---

## Known Bug Patterns

These are the specific bug patterns that this document's scenarios are designed to catch:

### 4. Exam Assigned to Wrong Batches
**Symptom:** A JEE exam appears in the assignment list for CBSE-only batches, or a CBSE exam can be assigned to JEE-only batches.
**Root Cause:** Batch assignment doesn't check whether the batch has the exam's specific course/curriculum.
**Where to Test:** Exam Assignment (E1, E2, E3, E4)

### 5. Course Subjects Merged with Curriculum Subjects
**Symptom:** In batch creation, Physics from CBSE and Physics from JEE appear as a single "Physics" entry instead of two separate entries under their respective headers.
**Root Cause:** Subject deduplication by name instead of by curriculum/course scope.
**Where to Test:** Batch Creation (D2, D7)

### 6. Teacher Sees All Institute Courses
**Symptom:** A teacher assigned to JEE only sees CBSE and NEET in their course dropdown during test creation.
**Root Cause:** The course dropdown queries institute-level assignments instead of teacher-level assignments.
**Where to Test:** Teacher Scope (F1, F3, F5)

---

## Cross-References

- **Course chapter filtering, Course Builder, question bank & exam creation filters:** See [Course Chapter Filtering QA](./course-chapter-filtering-qa.md) for Groups A–C and active defect verification targets H1–H3.
- **Curriculum-level isolation:** See [Curriculum Scope QA](./curriculum-scope-qa.md) for scenarios focused on curriculum assignment, teacher-batch mapping, and student visibility.
- **Batch creation fundamentals:** Curriculum Scope QA, Group A (A1–A8)
- **Teacher assignment fundamentals:** Curriculum Scope QA, Group B (B1–B8)
- **Mid-year edit cascades:** Curriculum Scope QA, Group D (D1–D8) — the same cascade logic applies when courses are added/removed

---

*Last Updated: March 2025*
