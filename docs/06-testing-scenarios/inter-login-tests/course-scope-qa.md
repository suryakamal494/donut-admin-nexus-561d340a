# Course Builder & Course Filtering QA — Chapter Isolation, Exam Creation, and Batch Assignment Testing

> This guide focuses on how **courses** (JEE Mains, NEET, Olympiad, etc.) interact with chapter filters, question banks, exam creation, and batch/teacher assignment across all portals. It complements the [Curriculum Scope QA](./curriculum-scope-qa.md), which covers curriculum-level isolation. Read this document when testing any feature that involves courses — the core rule is simple: **when a course is selected, only that course's chapters should appear. Nothing else.**

---

## Before You Begin

> **New to the platform or coming from the Curriculum Scope doc?** This section defines course-specific terms and clarifies how courses differ from curriculums. If you've already read the Curriculum Scope QA glossary, focus on the new terms marked with ★.

### Course-Specific Glossary

| Term | What It Means | Example |
|------|---------------|---------|
| **Course** | A competitive exam or specialised learning track that pulls chapters from one or more curriculums. Courses are **class-agnostic** — they span across class levels and are not tied to any single grade. | JEE Mains, NEET Foundation, Math Olympiad |
| **Curriculum** | A board-level academic structure (classes, subjects, chapters, topics). Courses source ~80% of their content from curriculum trees. | CBSE, ICSE, Telangana State Board |
| ★ **Course Builder** | The SuperAdmin tool used to construct a course by pulling chapters from existing curriculum trees and/or adding course-exclusive chapters. Found in SuperAdmin → Master Data → Courses tab. | Building JEE Mains by pulling Physics chapters from CBSE Class 11 and Class 12 |
| ★ **Mapped Chapter** | A curriculum chapter that has been linked into a course via the Course Builder. The chapter lives in the curriculum tree but is also accessible within the course context. ~80% of course content comes from mapped chapters. | "Electric Charges" from CBSE Class 12 Physics → mapped into JEE Mains Physics |
| ★ **Course-Only Chapter** (Course-Owned) | A chapter created exclusively for a course — it does **not** exist in any curriculum tree. Created using the "Add Course Only Chapters" option in the Course Builder. ~20% of course content is typically course-exclusive. | "JEE Problem Strategies" — exists only inside JEE Mains, not in CBSE or ICSE |
| ★ **Class-Agnostic** | Courses are not linked to any specific class (grade level). In batch creation, when a class is selected, all institute courses are displayed regardless of the selected class. Curriculums, by contrast, filter by class. | Selecting "Class 10" shows CBSE Class 10 and ICSE Class 10 as curriculum options, but **all** courses (JEE, NEET, Olympiad) are shown because they have no class binding. |
| ★ **Class as Difficulty Filter** | In teacher exam creation, the "Class" dropdown in the question generation step sets the **difficulty level** of questions, not the scope. Selecting "Class 10" means "generate questions at Class 10 difficulty" — it does NOT switch the chapter tree to that class's curriculum chapters. | Teacher selects JEE Mains course → picks Class 10 for difficulty → chapters shown are still JEE Mains chapters, not CBSE Class 10 chapters |
| **Batch** | A group of students that can have one or more curriculums AND/OR one or more courses assigned, each with their own subject selections. | "11-A JEE+CBSE" — has JEE Mains (Physics, Chemistry, Maths) and CBSE Class 11 (Physics, Chemistry, Maths) |
| **Content Classification** | The tagging system for questions, content, and exams. Every item is tagged to a curriculum/course → subject → chapter → topic chain. | A question tagged as JEE Mains → Physics → Electric Charges → Coulomb's Law |

### How Courses Differ from Curriculums — Key Distinctions

| Aspect | Curriculum | Course |
|--------|-----------|--------|
| **Class binding** | Tied to specific classes (Class 10, Class 11, etc.) | Class-agnostic — spans all class levels |
| **Chapter source** | Owns all its chapters natively | Pulls mapped chapters from curriculums + has its own course-only chapters |
| **Batch creation filtering** | Filtered by selected class | Always shown (all institute courses appear regardless of class) |
| **Subject ownership** | Subjects belong to curriculum + class combination | Subjects belong directly to the course |
| **In batch creation** | Subjects shown under curriculum header | Subjects shown under separate course header |

### Where to Find Course-Related Features in the UI

| Feature | Portal | Navigation Path |
|---------|--------|-----------------|
| Course Builder (create/edit courses) | SuperAdmin | Sidebar → Master Data → Courses tab |
| Course Chapter Mapping (view mapped chapters) | SuperAdmin | Master Data → Courses tab → Select course → Chapters panel |
| Add Course-Only Chapters | SuperAdmin | Master Data → Courses tab → Select course → "Add Course Only Chapters" button |
| Question Bank (course filter) | SuperAdmin | Sidebar → Question Bank → Course dropdown |
| Question Bank (course filter) | Institute | Sidebar → Question Bank → Course dropdown |
| Exam Creation (course selection) | SuperAdmin | Sidebar → Exams → Create → Step 1: Select course |
| Exam Creation (course selection) | Institute | Sidebar → Exams → Create → Step 1: Select course |
| Quick Test Creation (course selection) | Teacher | Sidebar → Exams → Create Exam → Step 1: Select course |
| Batch Creation (course assignment) | Institute | Sidebar → Batches → Create → Step: Assign Courses & Subjects |
| Teacher Creation (course assignment) | Institute | Sidebar → Teachers → Create → Assign Curriculums/Courses |
| Exam Assignment to Batches | Teacher / Institute | Exam → Assign → Batch selection dialog |

### Prerequisites for Testing

Before executing any test scenario in this document, ensure you have:

1. **Test accounts** for all three portals — SuperAdmin, Institute Admin, and Teacher.
2. **Pre-configured test data:**
   - At least one institute with two curriculums (e.g., CBSE and ICSE) and two courses (e.g., JEE Mains and NEET)
   - At least one course built with the Course Builder that has both mapped chapters (from CBSE) and course-only chapters
   - At least two batches — one with only a course, one with curriculum + course
   - At least two teachers with different course/curriculum assignments
3. **Familiarity with the Curriculum Scope QA** — Read the [Curriculum Scope QA](./curriculum-scope-qa.md) first. This document builds on those concepts and focuses specifically on course-related filtering.
4. **Understanding of the Course Builder** — The next section explains how courses are constructed. Every filtering scenario in this document traces back to how the Course Builder defines a course's chapter list.

---

## How the Course Builder Works

The Course Builder is the foundation of everything in this document. It determines which chapters belong to a course, and therefore what should (and shouldn't) appear in every downstream filter.

### The Two Sources of Course Chapters

A course's chapter list comes from exactly two sources:

```
┌─────────────────────────────────────────────────────┐
│                   COURSE BUILDER                     │
│                                                      │
│   Source 1: MAPPED CHAPTERS (~80%)                   │
│   ┌─────────────────────────────────────────┐       │
│   │  Pull chapters from existing curriculum  │       │
│   │  trees. SuperAdmin selects:              │       │
│   │    • Which curriculum (CBSE, ICSE, ...)  │       │
│   │    • Which class (11, 12, ...)           │       │
│   │    • Which subject (Physics, Chem, ...)  │       │
│   │    • Which specific chapters             │       │
│   │                                          │       │
│   │  These chapters ALSO remain in their     │       │
│   │  original curriculum tree.               │       │
│   └─────────────────────────────────────────┘       │
│                                                      │
│   Source 2: COURSE-ONLY CHAPTERS (~20%)              │
│   ┌─────────────────────────────────────────┐       │
│   │  Created exclusively for this course.    │       │
│   │  They do NOT exist in any curriculum     │       │
│   │  tree. Used for:                         │       │
│   │    • Course-specific strategies          │       │
│   │    • Problem-solving techniques          │       │
│   │    • Content that doesn't fit any board  │       │
│   └─────────────────────────────────────────┘       │
│                                                      │
│   RESULT: Combined Chapter List                      │
│   ┌─────────────────────────────────────────┐       │
│   │  Mapped: Kinematics (CBSE 11)           │       │
│   │  Mapped: Laws of Motion (CBSE 11)       │       │
│   │  Mapped: Electric Charges (CBSE 12)     │       │
│   │  Mapped: Thermodynamics (ICSE 11)       │       │
│   │  Course-Only: JEE Problem Strategies    │       │
│   │  Course-Only: Advanced Derivations      │       │
│   └─────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────┘
```

### The Golden Rule for Courses

**When a course is selected anywhere in the platform — in a question bank filter, in exam creation, in content tagging — only that course's combined chapter list (mapped + course-only) should appear. No other chapters from any curriculum or course should be visible.**

Conversely: **When a curriculum is selected (not a course), course-only chapters must NOT appear.** A course-only chapter belongs exclusively to its course and should never bleed into curriculum context.

### What This Means in Practice

| User Selects... | Chapters Shown | Chapters NOT Shown |
|----------------|---------------|-------------------|
| JEE Mains (course) | All mapped chapters from CBSE/ICSE that were linked to JEE + all JEE course-only chapters | CBSE chapters not mapped to JEE, ICSE chapters not mapped to JEE, NEET chapters |
| CBSE Class 11 Physics (curriculum) | All CBSE Class 11 Physics chapters | JEE course-only chapters, ICSE chapters, mapped chapters that happen to also be in JEE (they appear here because they're CBSE chapters — not because of JEE) |
| NEET (course) | All NEET mapped chapters + NEET course-only chapters | JEE chapters (even if some chapters overlap — the selection is NEET, so only NEET's list is shown) |

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

Each scenario below describes a situation and the expected platform behavior. The QA tester decides how to set up and verify each one. The platform should behave correctly regardless of the exact sequence of actions taken.

> **Cross-reference:** For curriculum-level isolation scenarios (batch creation with curriculums, teacher-curriculum assignment, student visibility), refer to the [Curriculum Scope QA](./curriculum-scope-qa.md). This document focuses specifically on course-related behavior.

---

### A. Course Builder Verification (SuperAdmin)

These scenarios verify that the Course Builder correctly constructs a course's chapter list and that the list is accurate when viewed downstream.

**A1 — Mapped Chapters from Single Curriculum**
SuperAdmin builds a course (e.g., JEE Mains) and maps chapters from CBSE Class 11 Physics (Kinematics, Laws of Motion, Thermodynamics). Open the course's chapter view — exactly these three chapters should appear under the "Mapped" or "From Curriculum" section. No other CBSE chapters should be present. No ICSE chapters should appear.

**A2 — Mapped Chapters from Multiple Curriculums**
SuperAdmin builds a course that pulls chapters from both CBSE and ICSE. For example: JEE Mains pulls "Electric Charges" from CBSE Class 12 and "Thermodynamics" from ICSE Class 11. Both chapters should appear in the course's chapter list. The source curriculum should be identifiable (either labeled or shown in a "source" column).

**A3 — Course-Only Chapters**
SuperAdmin uses "Add Course Only Chapters" to create "JEE Problem Strategies" and "Advanced Derivations" exclusively for JEE Mains. These chapters should appear in the course's chapter list alongside mapped chapters. They should NOT appear in any curriculum tree (CBSE, ICSE, etc.) — verify by browsing the CBSE chapter list and confirming these course-only chapters are absent.

**A4 — Chapters from Unrelated Curriculum Do Not Appear**
A course maps chapters only from CBSE. Open the course's chapter view. No ICSE chapters, no State Board chapters should appear — even if the platform has those curriculums configured. Only explicitly mapped chapters should be in the list.

**A5 — Edit Course: Add Chapters**
SuperAdmin adds two new mapped chapters to an existing course. The course's chapter list should immediately reflect the addition. Downstream: if a teacher has this course, the new chapters should appear in their question bank and exam creation chapter filters the next time they open those flows.

**A6 — Edit Course: Remove Chapters**
SuperAdmin removes a mapped chapter from a course. The chapter should disappear from the course's chapter list. Downstream impact: existing questions tagged to this chapter under this course — verify handling (are they orphaned? hidden? still accessible?). The chapter should still exist in its original curriculum tree.

**A7 — Course with Zero Course-Only Chapters**
A course is built entirely from mapped chapters (100% from curriculums, 0% course-only). The course should function normally. The "Course-Only" section should be empty or hidden, not showing an error.

**A8 — Course with Only Course-Only Chapters**
A course is built with zero mapped chapters and only course-only chapters. This is an edge case but should work. The course's chapter list should show only the course-only chapters. No curriculum content should appear.

---

### B. Question Bank Chapter Filtering (SuperAdmin, Institute, Teacher)

These scenarios test that the question bank's chapter filter correctly responds to course and curriculum selections. This is where the cross-contamination bug is most visible.

**B1 — SuperAdmin: Select Course → Only Course Chapters**
SuperAdmin opens the question bank. In the course/curriculum filter, they select "JEE Mains." The chapter dropdown/list should show ONLY JEE Mains chapters (mapped from curriculums + course-only). Chapters from CBSE that are NOT mapped to JEE should not appear. Chapters from NEET should not appear.

**B2 — SuperAdmin: Select Curriculum → No Course-Only Chapters**
SuperAdmin selects "CBSE" (a curriculum, not a course) in the question bank filter. The chapter list should show CBSE chapters only. JEE course-only chapters (like "JEE Problem Strategies") must NOT appear here — they belong to JEE, not to CBSE, even though JEE pulls some chapters from CBSE.

**B3 — SuperAdmin: Switch Between Course and Curriculum**
SuperAdmin selects JEE Mains → sees JEE chapters. Then switches to CBSE → the entire chapter tree should swap to CBSE chapters. Then switches back to JEE → JEE chapters again. At no point should chapters from the previously selected option linger in the list.

**B4 — Institute: Select Assigned Course → Only That Course's Chapters**
Institute admin opens the question bank and selects JEE Mains (an assigned course). Only JEE Mains chapters should appear. Chapters from CBSE that are not mapped to JEE should not appear, even though the institute also has CBSE assigned.

**B5 — Institute: Select Curriculum → No Course Chapter Bleed**
Institute admin selects ICSE in the question bank. Only ICSE chapters should appear. No JEE course-only chapters, no CBSE chapters, no NEET chapters. Even if some ICSE chapters are also mapped into a course, they appear here because they're ICSE chapters — the course context is irrelevant.

**B6 — Teacher: Course Filter Scoped to Teacher's Assignments**
A teacher assigned to JEE Mains + Physics opens the question bank. The course dropdown should show only JEE Mains (and any other courses assigned to the teacher). When JEE Mains is selected, only JEE Mains Physics chapters should appear — not JEE Chemistry, not CBSE Physics, not any other course's chapters.

**B7 — Cross-Contamination Test: ICSE Selected, JEE Chapters Appear**
This is the specific bug to hunt for. Select ICSE as the curriculum. Verify that absolutely zero JEE Mains chapters appear in the chapter list. Zero CBSE chapters appear. Zero course-only chapters from any course appear. If any non-ICSE chapter is visible, that is a critical filtering bug.

**B8 — Course-Only Chapter Isolation**
A course-only chapter (e.g., "JEE Problem Strategies") should appear ONLY when JEE Mains is selected as the filter. It should NOT appear when:
- CBSE is selected (even though JEE pulls from CBSE)
- NEET is selected (different course entirely)
- No filter is selected (depends on platform behavior — verify whether "all" shows everything or nothing)
- ICSE is selected

**B9 — Overlapping Mapped Chapters**
A chapter like "Thermodynamics" exists in CBSE Class 11 Physics and is also mapped into both JEE Mains and NEET. When JEE is selected, it appears. When NEET is selected, it appears. When CBSE is selected, it appears (because it's a CBSE chapter natively). But in each case, the chapter appears because of the current selection — not because it happens to be shared. Verify that selecting JEE doesn't accidentally also show NEET's version or CBSE chapters that aren't mapped to JEE.

---

## What "Working Correctly" Looks Like — Summary (Phase 1)

For the scenarios covered in this phase (Course Builder + Question Bank filtering), the platform is working correctly when:

1. **Course Builder accurately reflects the combined chapter list.** Mapped chapters from selected curriculums + course-only chapters, nothing more.
2. **Selecting a course in any filter shows ONLY that course's chapters.** No chapters from other courses, no chapters from curriculums that aren't mapped to the course.
3. **Selecting a curriculum never shows course-only chapters.** Course-only chapters are exclusive to their parent course.
4. **Switching between course and curriculum in filters completely swaps the chapter tree.** No lingering data from the previous selection.
5. **Teacher scope applies on top of course filtering.** A teacher sees only courses and subjects assigned to them, further narrowed by the selected course.

---

> **Next:** Phase 2 will add scenarios for Exam Creation Chapter Filtering (Group C), Batch Creation with Courses (Group D), and Exam Assignment Filtering (Group E). Phase 3 will add Teacher Scope scenarios (Group F), the Quick Reference Matrix, and Known Bug Patterns.

---

*Last Updated: March 2025*
