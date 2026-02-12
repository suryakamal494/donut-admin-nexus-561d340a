

# Restructure Intra-Login Tests: Workflow Format (Not Smoke Test Format)

## The Problem

Current test cases are written as atomic smoke-test checks:

```text
SA-IL-011: Curriculum dropdown shows active curriculums
SA-IL-012: Class dropdown populates after curriculum
SA-IL-013: Subject dropdown populates after class
SA-IL-014: Chapter dropdown populates after subject
SA-IL-015: Topic dropdown populates after chapter
... (13 rows for one section)
```

This creates confusion for testers. They see 13 disconnected items instead of understanding one workflow. Intra-login tests are **workflow tests** -- they verify that data flows correctly between modules. The test case format should reflect that.

## The Solution

Rewrite each section as **workflow test cases** where one test case = one complete flow with embedded checkpoints.

### Example: Before vs After

**BEFORE (smoke-test style, 13 rows):**

| Test ID | Test Case |
|---------|-----------|
| SA-IL-011 | Curriculum dropdown shows active curriculums |
| SA-IL-012 | Class dropdown populates after curriculum |
| SA-IL-013 | Subject dropdown populates after class |
| SA-IL-014 | Chapter dropdown populates after subject |
| SA-IL-015 | Topic dropdown populates after chapter |
| SA-IL-016 | Cascade reset: changing class resets children |
| SA-IL-017 | Cascade reset: changing subject resets children |
| SA-IL-018 | New chapter appears in question creation |
| SA-IL-019 | Subject filter on listing page |
| SA-IL-020 | Class filter on listing page |
| ... | ... |

**AFTER (workflow style, ~4 tests):**

| Test ID | Workflow | Precondition | Steps & Checkpoints | Expected Result |
|---------|----------|--------------|---------------------|-----------------|
| SA-IL-011 | Curriculum-mode cascade flow in Question Bank | Curriculum with full hierarchy exists | 1. Go to Question Bank, create question. 2. Select Curriculum mode. 3. Pick a curriculum -- verify only active curriculums shown. 4. Pick a class -- verify classes for that curriculum populate. 5. Pick a subject -- verify subjects for that class populate. 6. Pick a chapter -- verify chapters for that subject populate. 7. Pick a topic -- verify topics for that chapter populate. 8. Now change the class selection -- verify Subject, Chapter, Topic all reset to empty. 9. Make a full selection again, change subject -- verify Chapter, Topic reset. | Complete cascade works top-to-bottom; changing any parent resets all children below it |
| SA-IL-012 | New master data reflects in Question Bank | Question creation page open | 1. Note current chapters for a subject. 2. Go to Master Data, add a new chapter under that subject. 3. Return to Question Bank, create question, navigate to same subject. 4. Verify new chapter appears in dropdown. 5. Add a topic under that chapter in Master Data. 6. Return, select the new chapter -- verify topic appears. | Newly created chapters and topics are immediately available in Question Bank dropdowns |
| SA-IL-013 | Question Bank listing filters match master data | Questions exist with various classifications | 1. Go to Question Bank listing page. 2. Open Class filter dropdown -- verify it matches master data classes. 3. Open Subject filter dropdown -- verify it matches master data subjects. 4. Filter by a specific class -- verify only questions of that class shown. 5. Filter by a specific subject -- verify correct filtering. | Listing page filter dropdowns are populated from and stay in sync with master data |

## New Structure for All Sections

The table format changes from 5 columns to a workflow-oriented format:

| Column | Purpose |
|--------|---------|
| Test ID | Unique identifier |
| Workflow | Short name describing the complete flow being tested |
| Precondition | What must exist before starting |
| Steps & Checkpoints | Numbered steps with embedded verification points |
| Expected Result | Overall expected outcome of the workflow |

### Collapsed Test Count by Section

| Section | Current Tests | New Workflow Tests | What changes |
|---------|--------------|-------------------|--------------|
| Institutes to Users | 2 | 2 | Minor -- already concise |
| Institutes to Curriculum | 2 | 2 | Minor -- already concise |
| Roles to Users | 3 | 2 | Merge role CRUD + permission change into workflows |
| Master Data (Curriculum) to Courses | 3 | 2 | Merge mapping + rename + delete warning |
| Master Data (Curriculum) to Question Bank | 13 | 4 | Major collapse: cascade flow, new data sync, listing filters, immediate refresh |
| Master Data (Courses) to Question Bank | 5 | 2 | Course-mode cascade flow, course chapter types |
| Master Data (Curriculum) to Content Library | 7 | 3 | Cascade flow, CRUD sync, listing filters |
| Master Data (Courses) to Content Library | 2 | 1 | Single course-mode workflow |
| Master Data to Exams | 3 | 2 | Grand Test flow, PYP distinction |
| Master Data to AI Generators | 6 | 3 | AI Question Gen, AI Content Gen, PDF Upload |
| Master Data Deletion/Edit Impact | 5 | 2 | Rename propagation flow, delete protection flow |
| Question Bank to Exams | 5 | 2 | Selection + filtering flow, add/remove flow |
| Content Library to Exams | 1 | 1 | Already concise |
| Content Library to Institutes | 1 | 1 | Already concise |
| Questions to Institutes | 1 | 1 | Already concise |
| Exams to Institutes | 2 | 2 | Already concise |

**Total: 61 tests collapse to ~30 workflow tests** (same coverage, better readability)

### Renumbering

All test IDs will be renumbered SA-IL-001 through SA-IL-030 (approximate) sequentially following sidebar order.

## File Modified

| File | Action |
|------|--------|
| `docs/06-testing-scenarios/intra-login-tests/superadmin.md` | Rewrite all sections in workflow format with collapsed, numbered-step test cases |

## What Does NOT Change

- Section order (already correct -- follows sidebar flow)
- Section groupings (Institutes, Roles, Master Data, QB, Exams, Content Library)
- Coverage (every checkpoint from the 61 tests is preserved as a step within a workflow)
- The overview description and document structure

