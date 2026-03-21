# Course Chapter Filtering QA — Does the Course Show the Right Chapters?

> This guide focuses on whether **selecting a course** in any filter (question bank, exam creation, content tagging) shows **only that course's chapters**. It covers Course Builder verification, question bank filtering, and exam creation filtering across SuperAdmin, Institute, and Teacher portals. For course **assignment** scenarios (batch creation, exam assignment, teacher scope), see the companion doc: [Course Assignment & Scope QA](./course-assignment-scope-qa.md).

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

### Prerequisites for Testing

Before executing any test scenario in this document, ensure you have:

1. **Test accounts** for all three portals — SuperAdmin, Institute Admin, and Teacher.
2. **Pre-configured test data:**
   - At least one institute with two curriculums (e.g., CBSE and ICSE) and two courses (e.g., JEE Mains and NEET)
   - At least one course built with the Course Builder that has both mapped chapters (from CBSE) and course-only chapters
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

## Test Scenarios

Each scenario below describes a situation and the expected platform behavior. The QA tester decides how to set up and verify each one. The platform should behave correctly regardless of the exact sequence of actions taken.

> **Cross-reference:** For curriculum-level isolation scenarios (batch creation with curriculums, teacher-curriculum assignment, student visibility), refer to the [Curriculum Scope QA](./curriculum-scope-qa.md). For course assignment and batch/teacher scope scenarios, see [Course Assignment & Scope QA](./course-assignment-scope-qa.md).

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

**A9 — Multi-Subject Switching Within Same Course**
A course (e.g., JEE Mains) has multiple subjects: Physics, Chemistry, Mathematics. SuperAdmin (or any user with access) views the course's chapter list and selects "Physics" — only JEE Physics chapters appear. They switch to "Chemistry" — the entire chapter list is replaced with JEE Chemistry chapters. No Physics chapters should linger or append to the Chemistry list. This tests that subject-level switching within a single course is a full replacement, not an accumulation.

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

**B10 — Question Created Under Course-Only Chapter Stays Scoped**
A SuperAdmin or Institute admin creates a question and tags it to a course-only chapter (e.g., "JEE Problem Strategies" under JEE Mains). After saving the question, browse the question bank under CBSE curriculum. The question must NOT appear — even though it exists in the database, it was tagged to a course-only chapter and should never surface in a curriculum context. This is a **post-creation searchability test**: the question is saved, time passes, and it still does not leak into curriculum browsing. Repeat the check under ICSE and any other curriculum — zero results for this question outside of JEE Mains.

---

### C. Exam Creation Chapter Filtering (SuperAdmin, Institute, Teacher)

These scenarios verify that when creating an exam under a course, the chapter/topic selection is correctly scoped to that course — and that the class filter in the teacher's question step behaves as a difficulty selector, not a scope changer.

**C1 — SuperAdmin Creates Exam Under Course**
SuperAdmin creates an exam and selects JEE Mains as the course. In the chapter/topic selection step, only JEE Mains chapters (mapped + course-only) should appear. CBSE chapters not mapped to JEE should be absent. NEET chapters should be absent.

**C2 — SuperAdmin Creates Exam Under Curriculum**
SuperAdmin creates an exam and selects CBSE Class 11 Physics. Only CBSE Class 11 Physics chapters should appear. No JEE course-only chapters, no NEET chapters. Even if some CBSE chapters are also mapped into JEE, they appear here because they are CBSE chapters — not because of any course.

**C3 — SuperAdmin Switches Between Course and Curriculum Mid-Creation**
SuperAdmin starts creating an exam under JEE Mains, sees JEE chapters. Then goes back and switches to CBSE. The chapter list should completely swap — no JEE chapters should remain. This tests that the filter resets cleanly on selection change.

**C4 — Institute Creates Exam Under Course**
Institute admin creates an exam and selects an assigned course. The same filtering rules as SuperAdmin apply: only that course's chapters are shown. The institute should not see chapters from courses not assigned to them.

**C5 — Teacher Creates Quick Test Under Course**
Teacher selects JEE Mains in the exam creation flow. Only JEE Mains chapters appear for the teacher's assigned subjects. If the teacher has JEE Mains Physics, only JEE Mains Physics chapters should be in the list — not JEE Mains Chemistry, not CBSE Physics.

**C6 — Teacher: Class Filter is Difficulty, NOT Scope**
This is the critical scenario for the class filter bug. A teacher selects JEE Mains as the course. In the question generation step, there is a class dropdown (e.g., Class 10, Class 11, Class 12). The teacher selects "Class 10."

Expected behavior:
- The chapter list remains JEE Mains chapters (mapped + course-only)
- The class selection tells the system "generate questions at Class 10 difficulty level"
- CBSE Class 10 chapters do NOT replace the JEE chapter list

Bug behavior (what should NOT happen):
- Selecting Class 10 switches the chapter list to CBSE Class 10 chapters
- JEE course-only chapters disappear because "Class 10" has no course-only chapters
- The chapter list becomes a mix of JEE and Class 10 curriculum chapters

**C7 — Teacher: Subject Filter Within Course**
Teacher has JEE Mains with both Physics and Chemistry. When creating a test under JEE, selecting Physics as the subject should show only JEE Physics chapters. Switching to Chemistry should show only JEE Chemistry chapters. At no point should Physics and Chemistry chapters appear together (unless multi-subject test is being created and both are selected).

**C8 — Exam Creation with Course-Only Chapters**
When creating an exam under JEE Mains, course-only chapters like "JEE Problem Strategies" should appear in the chapter list alongside mapped chapters. The teacher should be able to create questions tagged to these course-only chapters. When creating an exam under CBSE, these course-only chapters must NOT appear.

---

## What "Working Correctly" Looks Like — Summary

The platform is working correctly when:

1. **Course Builder accurately reflects the combined chapter list.** Mapped chapters from selected curriculums + course-only chapters, nothing more.
2. **Selecting a course in any filter shows ONLY that course's chapters.** No chapters from other courses, no chapters from curriculums that aren't mapped to the course.
3. **Selecting a curriculum never shows course-only chapters.** Course-only chapters are exclusive to their parent course.
4. **Switching between course and curriculum in filters completely swaps the chapter tree.** No lingering data from the previous selection.
5. **Class filter in exam creation is a difficulty selector, not a scope changer.** Selecting a class does not switch the chapter tree away from the selected course.
6. **No data leaks between courses.** JEE chapters never appear in NEET context. NEET chapters never appear in CBSE context. Every filter is watertight.

---

## Known Bug Patterns & Active Defect Checks

These are the specific bug patterns that this document's scenarios are designed to catch. When testing, actively look for these:

### 1. Cross-Curriculum Chapter Bleed
**Symptom:** Selecting JEE Mains in the question bank or exam creation shows chapters from CBSE and ICSE that are NOT mapped to JEE.
**Root Cause:** The filter queries all chapters linked to the institute's curriculums instead of only chapters linked to the selected course.
**Where to Test:** Question Bank (B1, B4, B6, B7), Exam Creation (C1, C4, C5)

### 2. Course-Only Chapters in Curriculum Context
**Symptom:** Selecting CBSE (a curriculum) shows course-only chapters like "JEE Problem Strategies."
**Root Cause:** The query doesn't distinguish between curriculum-owned chapters and course-only chapters.
**Where to Test:** Question Bank (B2, B5, B8, B10), Exam Creation (C2)

### 3. Class Filter Overriding Course Scope
**Symptom:** Teacher selects JEE Mains, then selects "Class 10" for difficulty. The chapter list switches from JEE chapters to CBSE Class 10 chapters.
**Root Cause:** The class dropdown triggers a curriculum-based chapter query instead of only setting the difficulty parameter.
**Where to Test:** Exam Creation (C6)

### Active Defect Verification Targets

These are specific defects observed in the current build. During each test cycle, explicitly verify whether each defect is **still present** or **resolved**. Mark status and build version.

**H1 — Curriculum Chapter Bleed at Institute Level**
**Defect:** When an Institute admin selects a specific curriculum (e.g., ICSE) in the question bank, chapters from other curriculums (CBSE) and/or course-only chapters appear in the chapter list.
**Steps to Reproduce:** Log in as Institute → Question Bank → Select ICSE → Check chapter list.
**Expected:** Only ICSE chapters. **Observed (when broken):** CBSE chapters and/or JEE course-only chapters also appear.
**Status:** ☐ Still present / ☐ Resolved — Build: ___________
**Related Scenarios:** B4, B5, B7

**H2 — Course Chapter Bleed in Teacher Test Creation**
**Defect:** When a Teacher selects a course (e.g., JEE Mains) during test creation, chapters from curriculums not mapped to JEE appear in the chapter selection step.
**Steps to Reproduce:** Log in as Teacher → Exams → Create → Select JEE Mains → Select subject → View chapter list.
**Expected:** Only JEE Mains chapters for the selected subject. **Observed (when broken):** All CBSE chapters for that subject appear alongside JEE chapters.
**Status:** ☐ Still present / ☐ Resolved — Build: ___________
**Related Scenarios:** C5, C7

**H3 — Class Selector Re-Filtering Chapters**
**Defect:** When a Teacher has a course selected (e.g., JEE Mains) and changes the Class dropdown in the question generation step, the chapter list switches from course chapters to curriculum chapters for that class.
**Steps to Reproduce:** Log in as Teacher → Exams → Create → Select JEE Mains → Go to question step → Change Class dropdown from "Class 11" to "Class 10" → Observe chapter list.
**Expected:** Chapter list remains JEE Mains chapters (class is difficulty only). **Observed (when broken):** Chapter list switches to CBSE Class 10 chapters.
**Status:** ☐ Still present / ☐ Resolved — Build: ___________
**Related Scenarios:** C6

---

## Cross-References

- **Course assignment, batch creation, teacher scope:** See [Course Assignment & Scope QA](./course-assignment-scope-qa.md) for Groups D–G covering batch creation with courses, exam assignment filtering, teacher scope, and institute question bank isolation.
- **Curriculum-level isolation:** See [Curriculum Scope QA](./curriculum-scope-qa.md) for scenarios focused on curriculum assignment, teacher-batch mapping, and student visibility.
- **Batch creation fundamentals:** Curriculum Scope QA, Group A (A1–A8)
- **Teacher assignment fundamentals:** Curriculum Scope QA, Group B (B1–B8)
- **Mid-year edit cascades:** Curriculum Scope QA, Group D (D1–D8) — the same cascade logic applies when courses are added/removed

---

*Last Updated: March 2025*
