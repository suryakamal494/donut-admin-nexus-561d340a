

## Plan: Split Course Scope QA into Two Documents

### Overview

Split the current 593-line `course-scope-qa.md` into two focused documents, each under 300 lines. No scenarios are changed — only reorganized. Navigation updated to show both documents.

### Document 1: `course-chapter-filtering-qa.md`
**Theme:** "Does the course show the right chapters in filters?"

Contents (moved from current doc):
- Before You Begin: full glossary table, "How Courses Differ from Curriculums" table, UI Location Reference (filtered to relevant rows), Prerequisites
- How the Course Builder Works: two-source diagram, Golden Rule, "What This Means in Practice" table
- Group A — Course Builder Verification (A1–A9)
- Group B — Question Bank Chapter Filtering (B1–B10)
- Group C — Exam Creation Chapter Filtering (C1–C8)
- "What Working Correctly Looks Like" summary (points 1–4, 6, 9 from current summary)
- Known Bug Patterns 1–3 (Cross-Curriculum Bleed, Course-Only in Curriculum Context, Class Filter Override)
- Active Defect Targets H1–H3
- Cross-References section linking to Doc 2 and Curriculum Scope QA

**27 scenarios + 3 defect checks**

### Document 2: `course-assignment-scope-qa.md`
**Theme:** "Does the course reach the right batches, teachers, and students?"

Contents (moved from current doc):
- Before You Begin: short intro referencing Doc 1 for glossary, adds assignment-specific terms (Batch-Course linking, Teacher-Course assignment, class-agnostic in batch context)
- How Courses Flow Through the Platform: chain diagram (SA → Institute → Batch/Teacher → Exam), filtering logic diagram for teacher test creation
- Group D — Batch Creation with Courses (D1–D7)
- Group E — Exam Assignment Filtering (E1–E7)
- Group F — Teacher Scope with Courses (F1–F7)
- Group G — Institute Question Bank Isolation (G1–G3)
- "What Working Correctly Looks Like" summary (points 5, 7, 8 from current summary)
- Quick Reference Matrix (full matrix stays here as it covers assignment rules)
- Filtering Rules Quick Check table
- Known Bug Patterns 4–6 (Wrong Batch Assignment, Subject Merging, Teacher Sees All Courses)
- Cross-References section linking to Doc 1 and Curriculum Scope QA

**24 scenarios**

### Navigation Update

**File:** `src/data/docsNavigation.ts`

Replace the single "Course Scope QA" entry with two entries:
```
{ title: "Course Filtering QA", path: "06-testing-scenarios/inter-login-tests/course-chapter-filtering-qa" },
{ title: "Course Assignment QA", path: "06-testing-scenarios/inter-login-tests/course-assignment-scope-qa" },
```

### File Changes

| Action | File |
|--------|------|
| Create | `docs/06-testing-scenarios/inter-login-tests/course-chapter-filtering-qa.md` |
| Create | `docs/06-testing-scenarios/inter-login-tests/course-assignment-scope-qa.md` |
| Delete | `docs/06-testing-scenarios/inter-login-tests/course-scope-qa.md` |
| Edit | `src/data/docsNavigation.ts` — update nav entries |
| Edit | `docs/06-testing-scenarios/inter-login-tests/curriculum-scope-qa.md` — update cross-reference links to point to the two new docs |

### What Does NOT Change
- Zero scenario text is modified — all A1–G3 scenarios move as-is
- No renumbering of scenario IDs
- Bug patterns and defect targets move verbatim
- Quick Reference Matrix content unchanged

