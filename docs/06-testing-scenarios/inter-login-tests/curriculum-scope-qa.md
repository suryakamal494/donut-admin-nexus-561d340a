# Curriculum Scope QA — Batch, Teacher, Student & Exam Isolation Testing

> This guide explains how curriculum and subject assignments flow through the platform, what constraints exist at each level, and what scenarios a QA tester should verify. Read this top-to-bottom before beginning any test execution — once you understand the model, the scenarios will feel natural.

---

## How the Platform Links Everything Together

The platform's data model is built around a chain of ownership and filtering. Every entity downstream inherits and narrows the scope set by the entity above it. Nothing in the platform exists in isolation — a student's experience is ultimately shaped by decisions made at the institute level, filtered through the batch and teacher layers.

Here is the chain:

```
┌──────────────┐
│   INSTITUTE   │  ← Owns one or more Curriculums (CBSE, ICSE, State Board...)
│               │    and one or more Courses (JEE Mains, NEET, Olympiad...)
│               │    Note: The platform treats both as "Courses" in the UI.
└──────┬───────┘
       │ selects from institute's pool
       ▼
┌──────────────┐
│    BATCH      │  ← Created with specific Curriculum(s) + Subject(s)
│               │    A batch can have 1 curriculum or many.
│               │    Subjects are chosen per-curriculum at batch creation.
└──────┬───────┘
       │ assigned to batch
       ▼
┌──────────────┐
│   STUDENT     │  ← Added to a batch. Sees ONLY the subjects
│               │    and content that belong to that batch's
│               │    curriculum(s). Nothing more.
└──────────────┘

       ┌──────────────┐
       │   TEACHER     │  ← Created with Curriculum(s) + Subject(s)
       │               │    Then assigned to specific Batches.
       │               │    A batch only appears for assignment if
       │               │    it shares BOTH the teacher's curriculum
       │               │    AND at least one of the teacher's subjects.
       └──────┬───────┘
              │ creates
              ▼
       ┌──────────────┐
       │  TEST / EXAM  │  ← Scoped to the teacher's curriculum.
       │               │    Can only be assigned to batches matching
       │               │    that curriculum. Students in those batches
       │               │    see the test automatically.
       └──────────────┘
```

### The Golden Rule

**Every dropdown, every filter, every assignment in the platform is constrained by curriculum + subject ownership.** If an entity doesn't own a curriculum, nothing from that curriculum should ever appear — not in dropdowns, not in chapter lists, not in batch assignment options. This is the single most important thing to verify.

---

## Entity Relationship Model

```
INSTITUTE
  ├── has Curriculum(s): [CBSE, ICSE, JEE Mains, ...]
  ├── has Course(s): [JEE Mains, NEET, ...]
  │   (Both displayed as "Courses" in the UI)
  │
  ├── BATCH (many)
  │     ├── assigned Curriculum(s): subset of Institute's
  │     ├── assigned Subject(s): per curriculum
  │     ├── STUDENT (many)
  │     │     └── sees: only this batch's curriculum subjects
  │     └── linked TEACHER(s)
  │           └── must match: batch curriculum ∩ teacher curriculum
  │                          AND batch subjects ∩ teacher subjects
  │
  └── TEACHER (many)
        ├── assigned Curriculum(s): subset of Institute's
        ├── assigned Subject(s): can be 1 or many
        ├── assigned Batch(es): filtered by curriculum+subject match
        └── creates Tests/Exams
              ├── scoped to: teacher's curriculum
              ├── chapters/topics: filtered by selected curriculum
              └── assignable to: only matching batches
```

### The Filtering Logic When a Teacher Creates a Test

This is the most critical flow to understand because it exercises every constraint simultaneously:

```
Teacher opens "Create Test"
       │
       ▼
Curriculum dropdown ──► Shows ONLY the curriculum(s) assigned to this teacher
       │                 (NOT the institute's full list)
       │
       ▼
Teacher selects a curriculum (e.g., CBSE)
       │
       ▼
Subject dropdown ──► Shows ONLY subjects assigned to this teacher
       │              within the selected curriculum
       │
       ▼
Chapter/Topic list ──► Shows ONLY chapters belonging to that
       │                curriculum + subject combination
       │                ICSE chapters must NOT appear here
       │
       ▼
Question Bank ──► Questions are filtered by the same curriculum
       │           + subject scope. Global questions (SuperAdmin)
       │           are visible if they match the curriculum.
       │
       ▼
Test is created
       │
       ▼
"Assign to Batches" ──► Shows ONLY batches that:
       │                   1. Have the test's curriculum
       │                   2. Are assigned to this teacher
       │                   3. Have the test's subject(s)
       │
       ▼
Students in those batches ──► Automatically see the test
```

If any dropdown in this flow shows data from a curriculum/subject that doesn't belong to the teacher, that is a critical bug.

---

## What Happens When Edits Are Made Mid-Year

The platform allows editing curriculum and subject assignments after creation. These edits must cascade correctly. Here is the cascade model:

```
EDIT: Add JEE Mains to an existing CBSE-only batch
  │
  ├──► Teachers with JEE curriculum can NOW be linked to this batch
  ├──► JEE exams can NOW be assigned to this batch
  ├──► Students in this batch NOW see JEE subjects too
  └──► Existing CBSE assignments remain untouched

EDIT: Remove CBSE from a teacher, add JEE Mains
  │
  ├──► Teacher loses access to all CBSE-linked batches immediately
  ├──► Teacher gains access to JEE-linked batches (if subject also matches)
  ├──► Any draft tests the teacher created for CBSE — verify behavior
  │    (should they remain? become orphaned? this needs verification)
  └──► Teacher's dropdowns now show only JEE curriculum data

EDIT: Institute adds a new curriculum mid-year
  │
  ├──► New curriculum appears in batch creation/edit
  ├──► New curriculum appears in teacher creation/edit
  ├──► Existing batches and teachers are NOT affected until explicitly edited
  └──► Question bank and content library now accept the new curriculum
```

---

## Test Scenarios

Each scenario below describes a situation and what the expected platform behavior should be. The QA tester decides how to set up and verify each one — the platform should behave correctly regardless of the exact sequence of actions taken.

---

### A. Batch Creation Scenarios

**A1 — Single Curriculum, Few Subjects**
An institute with CBSE and ICSE creates a batch assigned to only CBSE, with Math, Physics, and Chemistry as subjects. The batch should never display ICSE subjects anywhere. Students added to this batch should see exactly three subjects — no more, no less.

**A2 — Single Curriculum, All Subjects**
A batch is created with CBSE and every available subject selected. Every CBSE chapter and topic should be accessible within this batch's scope. No ICSE or JEE content should bleed through.

**A3 — Multiple Curriculums, Overlapping Subjects**
A batch is assigned both CBSE and ICSE, with Physics selected under both. The student in this batch should see Physics content from both curriculums, but the content must be separated — CBSE Physics chapters and ICSE Physics chapters should not be merged into a single list. The curriculum label should be visible wherever disambiguation is needed.

**A4 — Multiple Curriculums, Non-Overlapping Subjects**
A batch has CBSE (Math, Physics) and JEE Mains (Physics, Chemistry). Physics overlaps; Math is CBSE-only; Chemistry is JEE-only. Each subject should appear under its correct curriculum. A teacher with only CBSE curriculum should not see this batch's JEE Chemistry.

**A5 — Course-Only Batch**
A batch is created with only JEE Mains (a course, not a board curriculum). All subjects, chapters, and topics should come from the JEE course definition. No CBSE/ICSE content should appear even if the institute has those curriculums.

**A6 — Batch With Maximum Diversity**
An institute has CBSE, ICSE, and JEE Mains. A batch is created with all three, with different subject selections per curriculum. This is the stress test — every filter and dropdown in the platform must correctly scope to the selected curriculum when interacting with this batch.

**A7 — Two Batches, Same Curriculum, Different Subjects**
Two batches are both CBSE, but Batch A has Math and Physics while Batch B has Chemistry and Biology. A teacher assigned to CBSE + Math should see only Batch A when assigning tests. A teacher assigned to CBSE + Chemistry should see only Batch B.

**A8 — Empty Subject Selection**
What happens if someone attempts to create a batch with a curriculum selected but no subjects? The platform should either prevent this or handle it gracefully — a batch with zero subjects is functionally useless and should be blocked at creation.

---

### B. Teacher Assignment Scenarios

**B1 — Single Curriculum, Single Subject**
A teacher is created with only CBSE and only Physics. Only batches that have CBSE curriculum AND Physics as a subject should appear for assignment. If a batch has CBSE but only Math and Chemistry, it should NOT appear.

**B2 — Single Curriculum, Multiple Subjects**
A teacher has CBSE with Math, Physics, and Chemistry. Any CBSE batch that has at least one of these three subjects should be available for assignment. The teacher's test creation should allow selecting any of their three subjects.

**B3 — Multiple Curriculums, Single Subject Each**
A teacher has CBSE (Physics) and JEE Mains (Physics). Batches with either curriculum should appear, as long as Physics is one of the batch's subjects. When creating a test, the teacher selects which curriculum first, and the chapters should differ based on that selection.

**B4 — Multiple Curriculums, Multiple Subjects**
A teacher has CBSE (Math, Physics) and ICSE (Math, Science). This is the full-matrix case. The teacher should see batches from both curriculums, filtered by subject overlap. When creating a test under CBSE, only CBSE chapters appear. Switching to ICSE in the dropdown should swap the entire chapter and topic tree.

**B5 — Teacher Assigned to Batch, Then Batch's Curriculum Changes**
A teacher with CBSE is linked to a CBSE batch. The batch is later edited to remove CBSE and add ICSE. The teacher should lose access to this batch — it should disappear from their batch list and they should not be able to assign tests to it.

**B6 — Teacher's Curriculum Is Narrowed**
A teacher initially has CBSE and ICSE. They are linked to batches from both. An admin edits the teacher to remove ICSE. All ICSE-linked batches should immediately disappear from the teacher's scope. Any ICSE-specific content they created should be verified for orphan handling.

**B7 — Teacher With No Matching Batches**
A teacher is created with a curriculum and subject combination that no existing batch has. The batch assignment list should be empty. The teacher should still be able to exist but cannot do much until a matching batch is created.

**B8 — Five Teachers, Five Batches, Mixed Assignments**
This is the integration scenario. Create five batches with varying curriculum-subject combinations and five teachers with different scope profiles. Map out on paper which teacher should see which batch. Then verify every single mapping is correct. This is where most real-world bugs surface — not in simple 1:1 cases, but in the intersection of many entities.

---

### C. Cross-Entity Scope Validation

**C1 — Teacher Test Creation: Curriculum Isolation**
A teacher has only CBSE. When they open the test creation flow, the curriculum dropdown should show only CBSE. ICSE and JEE should not appear even if the institute has them.

**C2 — Teacher Test Creation: Subject Isolation**
After selecting CBSE, only the teacher's assigned subjects should appear. If the teacher has only Physics, the subject dropdown should not show Math, Chemistry, or any other CBSE subject.

**C3 — Teacher Test Creation: Chapter Isolation**
After selecting CBSE + Physics, only CBSE Physics chapters should appear. If the institute also has ICSE Physics, those chapters must NOT bleed into the CBSE chapter list. This tests whether the platform correctly isolates curriculum-specific chapter trees.

**C4 — Question Bank: Curriculum Filter**
When browsing or selecting questions from the question bank, selecting CBSE should show only CBSE-tagged questions (plus global questions from SuperAdmin that match CBSE). ICSE questions should be completely absent.

**C5 — Test Assignment: Batch Filtering**
A test created under CBSE curriculum can only be assigned to batches that include CBSE. Even if the teacher is linked to a JEE batch, that batch should not appear in the assignment list for a CBSE test.

**C6 — Student Sees Only Their Batch's Scope**
A student in a CBSE-only batch should see only CBSE subjects, chapters, and content. Even if the institute offers ICSE and JEE, none of that should be visible to this student.

**C7 — Student in Multi-Curriculum Batch**
A student in a batch with both CBSE and ICSE should see subjects from both curriculums. The subjects should be clearly separated by curriculum — not mixed into one flat list.

**C8 — Test Visibility: Student Only Sees Assigned Tests**
A teacher assigns a CBSE Physics test to Batch A. Students in Batch A should see the test. Students in Batch B (even if also CBSE) should NOT see the test unless Batch B was also explicitly assigned.

**C9 — Institute Creates Exam: Same Filtering Rules**
When the institute admin creates an exam (not a teacher), the same curriculum → subject → chapter → batch filtering rules should apply. The institute admin sees all the institute's curriculums, but the downstream assignment rules remain identical.

**C10 — SuperAdmin Global Content: Scoped Visibility**
SuperAdmin creates global questions tagged to CBSE Physics. These questions should appear in the question bank for any teacher or institute user who has CBSE Physics in their scope — but NOT for someone with only ICSE Physics.

---

### D. Edit & Mid-Year Change Scenarios

**D1 — Add Curriculum to Existing Batch**
A batch starts with only CBSE. Mid-year, JEE Mains is added. After the edit: JEE exams should now be assignable to this batch. Teachers with JEE curriculum should now see this batch. Students in this batch should now see JEE subjects. All existing CBSE data (tests, progress, content) must remain unaffected.

**D2 — Remove Curriculum from Existing Batch**
A batch has CBSE and ICSE. ICSE is removed mid-year. After the edit: ICSE teachers should lose access to this batch. ICSE-specific tests assigned to this batch — what happens? Students should no longer see ICSE subjects. Verify whether previously completed ICSE test results are still visible in history or are hidden.

**D3 — Add Subject to Existing Batch**
A CBSE batch has only Math and Physics. Biology is added mid-year. Teachers with CBSE + Biology should now be able to link to this batch. Students should see Biology as a new subject. Existing test assignments for Math and Physics should remain unchanged.

**D4 — Remove Subject from Existing Batch**
A CBSE batch has Math, Physics, Chemistry. Chemistry is removed. Chemistry teachers should lose access to this batch. Students should no longer see Chemistry. Existing Chemistry test results — verify handling (visible in history? hidden? error?).

**D5 — Change Teacher's Curriculum**
A teacher has CBSE. Admin changes it to JEE Mains. The teacher's entire scope should shift: all CBSE batches disappear from their list, JEE batches (if subject matches) appear. When creating a test, only JEE curriculum should be available.

**D6 — Change Teacher's Subjects**
A teacher has CBSE (Math, Physics). Physics is removed. The teacher should lose access to any batch where Physics was the only overlapping subject. Batches where Math is also a subject should remain accessible.

**D7 — Institute Adds New Curriculum Mid-Year**
For the first six months, an institute operates with only CBSE. Mid-year, ICSE is added. After the edit: batch creation now offers ICSE as an option. Teacher creation now offers ICSE. Existing batches and teachers are NOT automatically updated — only new or edited entities pick up the new curriculum.

**D8 — Institute Removes a Curriculum**
An institute has CBSE and ICSE. ICSE is removed. What happens to existing ICSE batches? Existing ICSE teachers? This is a destructive operation — verify whether the platform blocks it (if ICSE data exists) or cascades the removal.

---

### E. Student Visibility Scenarios

**E1 — Student Added to Single-Curriculum Batch**
A student joins a CBSE batch with Math, Physics, Chemistry. The student's dashboard should show exactly these three subjects. No other subjects or curriculums should appear anywhere in their experience.

**E2 — Student Added to Multi-Curriculum Batch**
A student joins a batch with CBSE and JEE Mains. The student should see subjects from both, clearly labeled by curriculum. Navigating into a CBSE subject should show CBSE chapters; navigating into a JEE subject should show JEE chapters.

**E3 — Student's Batch Gets New Curriculum**
A student is in a CBSE-only batch. The batch admin adds JEE mid-year. Without the student doing anything, JEE subjects should now appear on their dashboard. The student should be able to access JEE content and take JEE tests assigned to their batch.

**E4 — Student's Batch Loses a Curriculum**
A student is in a CBSE + ICSE batch. ICSE is removed. ICSE subjects should disappear from the student's view. Verify what happens to the student's ICSE test history and progress data.

**E5 — Teacher Creates Test, Student Sees It**
A teacher linked to Batch A creates a CBSE Physics test and assigns it to Batch A. Every student in Batch A should see the test. Students in other batches — even CBSE batches — should not see it. The test's curriculum scope is irrelevant to the student's visibility; what matters is the batch assignment.

---

## Quick Reference Matrix

| Entity | Curriculum Constraint | Subject Constraint | Affected By Edits To |
|--------|----------------------|-------------------|----------------------|
| **Institute** | Owns all curriculums and courses available on the platform for this institute | N/A — subjects are defined per curriculum in master data | SuperAdmin master data changes |
| **Batch** | Subset of institute's curriculums | Subjects selected per curriculum at creation | Institute curriculum edits, batch edits |
| **Teacher** | Subset of institute's curriculums | Selected per teacher; may span curriculums | Teacher edits, institute curriculum changes |
| **Teacher → Batch Link** | Must overlap: teacher curriculum ∩ batch curriculum | Must overlap: teacher subjects ∩ batch subjects | Changes to either teacher or batch scope |
| **Student** | Inherited from batch | Inherited from batch | Batch curriculum/subject edits |
| **Test/Exam** | Scoped to creating teacher's curriculum | Scoped to selected subject(s) | Teacher scope changes, batch assignment |
| **Question Bank** | Filtered by user's curriculum scope | Filtered by user's subject scope | Master data changes, scope edits |
| **Dropdowns (chapters, topics)** | Show ONLY selected curriculum's data | Show ONLY selected subject's data | Master data changes |

---

## What "Working Correctly" Looks Like — Summary

The platform is working correctly when:

1. **No data leaks across curriculum boundaries.** A CBSE user never sees ICSE content unless they have explicit ICSE access.
2. **Scope narrows at each level.** Institute → Batch → Teacher → Student. Each level can only see a subset of what's above it, never more.
3. **Edits cascade immediately.** When a curriculum is added or removed from any entity, all downstream filters update without requiring manual intervention.
4. **Dropdowns are honest.** Every dropdown in every form — curriculum, subject, chapter, topic, batch assignment — shows only what the current user has access to. If a dropdown shows something it shouldn't, that's a bug.
5. **Existing data survives edits.** When a curriculum is removed from a batch mid-year, existing test results and progress data should be handled gracefully — either preserved in history or explicitly cleaned up, never silently lost.

---

*Last Updated: March 2025*
