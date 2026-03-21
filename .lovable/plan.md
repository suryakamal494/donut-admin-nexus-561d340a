

## Plan: Course Builder & Course Filtering QA Document

### What You Asked

You want a new QA testing document — similar in style to curriculum-scope-qa.md — focused specifically on **how courses interact with chapter filters, exam creation, question banks, and batch/teacher assignment** across SuperAdmin, Institute, and Teacher portals. The core bug you're seeing: **chapters from wrong courses/curriculums bleed into filters when a specific course is selected.**

You also asked me to:
1. Identify what overlaps with the existing curriculum-scope-qa and what's missing there
2. Write the new document in the same narrative-scenario style
3. Phase the implementation so quality stays high

---

### Overlap Analysis: What's Already in curriculum-scope-qa vs. What's Missing

The existing curriculum-scope-qa covers:
- Batch creation with curriculums and subjects (A1–A8) ✓
- Teacher assignment and scope filtering (B1–B8) ✓
- Test creation chapter isolation by **curriculum** (C1–C5) ✓
- Mid-year edits (D1–D8) ✓
- Student visibility (E1–E5) ✓

**What's NOT covered (and needs the new document):**
- Course Builder verification (mapped chapters + course-only chapters)
- Chapter filtering when a **course** (not curriculum) is selected in Question Bank or Exam creation
- Course being **class-agnostic** in batch creation (all courses shown regardless of class)
- Subjects displayed separately per course vs. per curriculum in batch creation
- Teacher test creation: class filter as **difficulty level selector**, not a scope filter
- Exam assignment restricted to batches that have the **specific course** (not just curriculum)
- Cross-contamination bug: selecting JEE shows CBSE chapters or vice versa
- Institute question bank: course filter showing wrong chapters

**Items to add to curriculum-scope-qa (small additions):**
- A note in section A (Batch Creation) clarifying course is class-agnostic
- A note in section C (Cross-Entity Scope) clarifying that "curriculum" rules apply equally to "course" selections

---

### New Document Structure: `course-scope-qa.md`

**File:** `docs/06-testing-scenarios/inter-login-tests/course-scope-qa.md`

The document will follow the exact same narrative style as curriculum-scope-qa.md:

#### Section 1: Before You Begin
- Brief glossary refresh (Mapped Chapter, Course-Only Chapter, Course Builder, class-agnostic)
- How courses differ from curriculums (no class hierarchy, pulls chapters from multiple curriculums)
- UI location table for course-related features

#### Section 2: How the Course Builder Works
- Narrative explanation of the two chapter sources (mapped from curriculum tree + course-only)
- Visual diagram showing: Curriculum Tree → Course Builder → Mapped Chapters + Course-Only Chapters → Combined Course Chapter List
- The golden rule: **When a course is selected anywhere in the platform, only that course's chapter list (mapped + course-only) should appear. No other chapters.**

#### Section 3: How Courses Flow Through the Platform
- Chain diagram similar to curriculum-scope-qa but course-specific:
  - SuperAdmin builds course → assigns to institute
  - Institute creates batch (course is class-agnostic, all assigned courses shown)
  - Batch subjects: curriculum subjects and course subjects shown separately
  - Teacher assigned to course + subjects → scoped to course chapters only

#### Section 4: Test Scenarios

**Group A — Course Builder Verification (SuperAdmin)**
- A1: Verify mapped chapters from CBSE appear in JEE course
- A2: Verify course-only chapters appear in course
- A3: Verify chapters from unrelated curriculum do NOT appear
- A4: Verify editing course (add/remove chapters) updates downstream
- A5: Verify course with chapters from multiple curriculums shows all correctly

**Group B — Question Bank Chapter Filtering (SuperAdmin, Institute, Teacher)**
- B1: SA selects JEE course in question bank → only JEE chapters shown
- B2: SA selects CBSE curriculum → only CBSE chapters shown, no JEE-only chapters
- B3: Institute selects assigned course → only that course's chapters
- B4: Institute selects curriculum → no course-only chapters bleed in
- B5: Teacher selects course → only course chapters within teacher's subject scope
- B6: Cross-contamination test: select ICSE, verify zero JEE chapters appear
- B7: Course-only chapter appears ONLY when parent course is selected

**Group C — Exam Creation Chapter Filtering (SuperAdmin, Institute, Teacher)**
- C1: SA creates exam under JEE → only JEE chapters in question selection
- C2: Teacher creates quick test under JEE → only JEE chapters shown
- C3: Class filter in teacher exam creation = difficulty level, NOT scope filter (verify selecting Class 10 doesn't show Class 10 curriculum chapters when a course is selected)
- C4: Institute creates exam under course → same filtering rules as SA
- C5: Switching between course and curriculum in exam creation swaps entire chapter tree

**Group D — Batch Creation with Courses (Institute)**
- D1: Class selected → all institute courses shown (class-agnostic), only matching curriculums shown
- D2: Course subjects displayed separately from curriculum subjects
- D3: Batch with only course (no curriculum) → only course subjects/chapters downstream
- D4: Batch with curriculum + course → both sets of subjects shown separately
- D5: Multiple courses in one batch → each course's subjects listed independently

**Group E — Exam Assignment Filtering**
- E1: Exam created under JEE → assignable only to batches with JEE
- E2: Exam created under CBSE → NOT assignable to JEE-only batches
- E3: Teacher exam → assignable only to teacher's batches that have the exam's course
- E4: Institute exam → same course-match rule for batch assignment
- E5: SuperAdmin grand test under JEE → only JEE institutes/batches can receive it

**Group F — Teacher Scope with Courses**
- F1: Teacher assigned to JEE + Physics → sees only JEE Physics chapters in test creation
- F2: Teacher assigned to CBSE + JEE → curriculum dropdown shows both, chapter tree swaps on selection
- F3: Teacher with JEE only → batch list shows only batches with JEE
- F4: Teacher creates JEE test → assign to JEE batches only

#### Section 5: Quick Reference Matrix
- Table mapping: entity → course constraint → what filters

#### Section 6: Known Bug Patterns
- Chapters from all curriculums showing when course selected
- Course-only chapters appearing in curriculum context
- Class filter in exam creation acting as scope instead of difficulty

---

### Additions to Existing curriculum-scope-qa.md

Small insertions (not changing existing scenarios):
1. Add a note under "The Golden Rule" clarifying it applies equally to courses
2. Add a brief note in Batch Creation (section A) about courses being class-agnostic
3. Add a cross-reference link to the new course-scope-qa.md

---

### Phased Implementation

**Phase 1: Core Document — Course Builder + Chapter Filtering**
- Create `course-scope-qa.md` with sections 1–3 (Before You Begin, How Course Builder Works, Flow Diagram) and Groups A + B (Course Builder Verification + Question Bank Filtering)
- This covers the most critical bug area you described

**Phase 2: Exam & Batch Scenarios**
- Add Groups C + D (Exam Creation Filtering + Batch Creation with Courses)
- Add Group E (Exam Assignment Filtering)

**Phase 3: Teacher Scope + Cross-References**
- Add Group F (Teacher Scope with Courses)
- Add sections 5 + 6 (Quick Reference Matrix + Known Bug Patterns)
- Update curriculum-scope-qa.md with small additions and cross-reference links
- Add navigation entry for the new doc

