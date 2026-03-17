

# Plan: Curriculum-Batch-Teacher-Student QA Testing Guide

## What Gets Built

**Phase 1: The QA document** — A comprehensive Markdown file at `docs/06-testing-scenarios/inter-login-tests/curriculum-scope-qa.md` that covers:

1. **The Relationship Model** — A narrative explanation (not step-by-step instructions) of how Institute → Batch → Teacher → Student → Exam are linked through curriculum and subject assignments. Written so a first-time QA person understands the "why" behind each constraint.

2. **Mermaid Diagrams** embedded in the Markdown:
   - Entity relationship diagram showing Institute ↔ Curriculum/Course, Batch ↔ Curriculum + Subjects, Teacher ↔ Curriculum + Subjects + Batches, Student ↔ Batch
   - Filtering logic flowchart: when a teacher creates a test, what determines which curriculum appears, which subjects appear, which batches can receive the test
   - Edit impact cascade: what happens downstream when a batch's curriculum is changed mid-year, or a teacher's curriculum is removed

3. **Test Scenarios** — Not step-by-step execution instructions, but scenario descriptions that a QA person reads and understands what to verify. Organized into:

   **A. Batch Creation Scenarios** (~8 scenarios)
   - Single curriculum, limited subjects (e.g., CBSE + Math, Physics, Chemistry only)
   - Single curriculum, all subjects
   - Multiple curriculums (CBSE + JEE Mains) with overlapping subjects
   - Course-only batch (JEE Mains without CBSE)

   **B. Teacher Assignment Scenarios** (~8 scenarios)
   - Single curriculum, single subject teacher
   - Single curriculum, multi-subject teacher
   - Multi-curriculum teacher (CBSE + JEE)
   - Verifying that only batches matching BOTH the teacher's curriculum AND subjects appear for assignment

   **C. Cross-Entity Scope Validation** (~10 scenarios)
   - Teacher creates test → only their assigned curriculum's chapters/topics appear in dropdowns
   - Teacher assigns test → only batches with matching curriculum are available
   - Student in a CBSE-only batch → sees only CBSE subjects and content
   - Student in a dual-curriculum batch → sees both curriculum's subjects
   - Question bank filtering → selecting CBSE shows only CBSE chapters, not JEE chapters

   **D. Edit & Mid-Year Change Scenarios** (~8 scenarios)
   - Adding a new curriculum to an existing batch mid-year → new exam assignments become possible
   - Removing a curriculum from a teacher → batches linked to that curriculum disappear from teacher's scope
   - Adding a new curriculum to the institute → downstream batch/teacher creation now includes it
   - Changing a teacher's subjects → batch mappings auto-filter

   **E. Student Visibility Scenarios** (~5 scenarios)
   - Student added to batch → only batch's subjects visible
   - Teacher linked to batch → can create and assign tests to that batch's students
   - Test created for CBSE curriculum → cannot be assigned to JEE-only batch

4. **Quick Reference Matrix** — A table showing: for each entity (Batch, Teacher, Student, Exam, Question Bank), what curriculum/subject constraints apply and where to verify them.

**Phase 2: Navigation update** — Add the new document to `src/data/docsNavigation.ts` under "Inter-Login Tests" so it's visible in the docs sidebar.

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `docs/06-testing-scenarios/inter-login-tests/curriculum-scope-qa.md` | **Create** | The full QA testing guide with diagrams and scenarios |
| `src/data/docsNavigation.ts` | **Modify** | Add "Curriculum Scope QA" entry under Inter-Login Tests children |

## Writing Style

- Natural language descriptions, not numbered execution steps
- Each scenario reads as "Here is a situation. Here is what should happen. Here is what would be wrong."
- Mermaid diagrams rendered inline via the existing ReactMarkdown + remarkGfm setup (the DocsViewer doesn't render Mermaid natively, so diagrams will be presented as ASCII/text-based flow diagrams inside code blocks — matching the existing pattern in `curriculum-course-flow.md`)
- No "Step 1: Click Create Batch" instructions — the QA person decides their own execution path

