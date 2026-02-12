# SuperAdmin Intra-Login Tests

> Workflow tests within the SuperAdmin portal, ordered by sidebar navigation flow.

---

## Overview

These tests verify that modules within the SuperAdmin portal work correctly together as **end-to-end workflows**. Each test case represents a complete flow with embedded checkpoints -- not isolated smoke checks. Sections follow the SuperAdmin sidebar order: Institutes → Roles & Access → Master Data → Question Bank → Exams → Content Library.

---

## Institutes → Users

| Test ID | Workflow | Precondition | Steps & Checkpoints | Expected Result |
|---------|----------|--------------|---------------------|-----------------|
| SA-IL-001 | Institute creation auto-creates admin | None | 1. Create a new institute. 2. Go to Users. 3. Verify an admin user was automatically created for the institute. | Institute admin user is auto-created with the institute |
| SA-IL-002 | Inactive institute blocks user access | Institute with admin exists | 1. Deactivate the institute. 2. Attempt to login as the institute admin. 3. Verify login is blocked/rejected. | Deactivated institute prevents its admin from logging in |

---

## Institutes → Curriculum

| Test ID | Workflow | Precondition | Steps & Checkpoints | Expected Result |
|---------|----------|--------------|---------------------|-----------------|
| SA-IL-003 | Curriculum assignment grants institute access | Institute exists, curriculum exists | 1. Assign a curriculum to the institute. 2. Login as institute admin. 3. Verify the institute can access the assigned curriculum. | Assigned curriculum is accessible to the institute |
| SA-IL-004 | Curriculum removal warns about dependencies | Institute actively using curriculum in batches | 1. Try to remove the curriculum from the institute. 2. Verify a warning is shown about batches using this curriculum. | Warning displayed about dependent batches before removal |

---

## Roles → Users

| Test ID | Workflow | Precondition | Steps & Checkpoints | Expected Result |
|---------|----------|--------------|---------------------|-----------------|
| SA-IL-005 | Role lifecycle reflects in user assignment | None | 1. Create a new role with specific permissions. 2. Go to Users, add/edit a user. 3. Verify the new role appears in the role dropdown. 4. Assign the role to the user. 5. Delete the role. 6. Verify users with that role are flagged for reassignment. | New roles appear in user assignment; deleted roles trigger reassignment |
| SA-IL-006 | Role permission change propagates to users | User with an assigned role | 1. Edit the role's permissions (add/remove specific permissions). 2. Have the user log out and log back in. 3. Verify the user now has the updated permissions active. | Permission changes on a role are immediately reflected for all users with that role |

---

## Master Data (Curriculum) → Courses

| Test ID | Workflow | Precondition | Steps & Checkpoints | Expected Result |
|---------|----------|--------------|---------------------|-----------------|
| SA-IL-007 | Curriculum chapters available for course mapping | Curriculum with chapters exists | 1. Create a new course. 2. Map chapters from the curriculum to the course. 3. Verify all curriculum chapters are selectable. 4. Rename a mapped chapter in curriculum. 5. Verify the course shows the updated chapter name. | Curriculum chapters are available for course mapping and name changes propagate |
| SA-IL-008 | Deleting mapped chapter warns about course usage | Chapter mapped to a course | 1. Go to Master Data, try to delete the mapped chapter. 2. Verify a warning is shown about course usage. | Deletion is blocked/warned when chapter is used by a course |

---

## Master Data (Curriculum) → Question Bank

| Test ID | Workflow | Precondition | Steps & Checkpoints | Expected Result |
|---------|----------|--------------|---------------------|-----------------|
| SA-IL-009 | Curriculum-mode cascade flow in Question Bank | Curriculum with full hierarchy (Curriculum → Class → Subject → Chapter → Topic) exists | 1. Go to Question Bank, create question. 2. Select Curriculum mode. 3. Pick a curriculum -- verify only active curriculums shown. 4. Pick a class -- verify classes for that curriculum populate. 5. Pick a subject -- verify subjects for that class populate. 6. Pick a chapter -- verify chapters for that subject populate. 7. Pick a topic -- verify topics for that chapter populate. 8. Change the class selection -- verify Subject, Chapter, Topic all reset to empty. 9. Make a full selection again, change subject -- verify Chapter, Topic reset. | Complete cascade works top-to-bottom; changing any parent resets all children below it |
| SA-IL-010 | New master data reflects in Question Bank | Question creation page open | 1. Note current chapters for a subject. 2. Go to Master Data, add a new chapter under that subject. 3. Return to Question Bank, create question, navigate to same subject. 4. Verify new chapter appears in dropdown. 5. Add a topic under that chapter in Master Data. 6. Return, select the new chapter -- verify topic appears. | Newly created chapters and topics are immediately available in Question Bank dropdowns |
| SA-IL-011 | Question Bank listing filters match master data | Questions exist with various classifications | 1. Go to Question Bank listing page. 2. Open Class filter dropdown -- verify it matches master data classes. 3. Open Subject filter dropdown -- verify it matches master data subjects. 4. Filter by a specific class -- verify only questions of that class shown. 5. Filter by a specific subject -- verify correct filtering. | Listing page filter dropdowns are populated from and stay in sync with master data |

---

## Master Data (Courses) → Question Bank

| Test ID | Workflow | Precondition | Steps & Checkpoints | Expected Result |
|---------|----------|--------------|---------------------|-----------------|
| SA-IL-012 | Course-mode cascade flow in Question Bank | Published course with subjects, chapters, topics exists | 1. Go to Question Bank, create question. 2. Select Course mode. 3. Verify Class field is hidden (Course mode skips Class). 4. Pick a course -- verify only published courses shown. 5. Pick a subject -- verify subjects for that course populate. 6. Pick a chapter -- verify both mapped curriculum chapters and course-owned chapters are listed. 7. Verify course-exclusive chapters are visually distinguishable. 8. Pick a topic -- verify topics load for the selected chapter. | Course-mode cascade works without Class; both mapped and course-owned chapters appear distinctly |

---

## Master Data (Curriculum) → Content Library

| Test ID | Workflow | Precondition | Steps & Checkpoints | Expected Result |
|---------|----------|--------------|---------------------|-----------------|
| SA-IL-013 | Curriculum-mode cascade flow in Content Library | Curriculum with full hierarchy exists | 1. Go to Content Library, create content. 2. Select Curriculum mode. 3. Verify full cascade works: Curriculum → Class → Subject → Chapter → Topic. 4. Verify Difficulty and Cognitive Type fields are absent (content doesn't use these). 5. Change a parent selection -- verify children reset. | Cascade works identically to Question Bank minus Difficulty/Cognitive fields |
| SA-IL-014 | Master data CRUD reflects in Content Library | Content exists with classifications | 1. Add a new subject in Master Data. 2. Go to Content Library, create content -- verify new subject appears. 3. Rename the subject in Master Data. 4. View existing content -- verify it shows the new name. 5. Delete an unused subject. 6. Verify it no longer appears in Content Library dropdowns. | Content Library classification dropdowns stay in sync with master data changes |
| SA-IL-015 | Content Library listing filters match master data | Content exists with various classifications | 1. Go to Content Library listing page. 2. Open Class filter -- verify matches master data. 3. Open Subject filter -- verify matches master data. 4. Apply filters -- verify correct filtering. | Listing filters are populated from and sync with master data |

---

## Master Data (Courses) → Content Library

| Test ID | Workflow | Precondition | Steps & Checkpoints | Expected Result |
|---------|----------|--------------|---------------------|-----------------|
| SA-IL-016 | Course-mode flow in Content Library | Published course with chapters exists | 1. Go to Content Library, create content. 2. Select Course mode. 3. Verify cascade: Course → Subject → Chapter → Topic (no Class). 4. Verify course chapters appear in the dropdown. | Course-mode content creation works without Class level |

---

## Master Data (Curriculum/Courses) → Exams

| Test ID | Workflow | Precondition | Steps & Checkpoints | Expected Result |
|---------|----------|--------------|---------------------|-----------------|
| SA-IL-017 | Grand Test uses master data dropdowns | Active curriculums and published courses exist | 1. Create a Grand Test. 2. Select Curriculum source -- verify active curriculums shown. 3. Select Course source -- verify published courses shown. 4. Verify cascade selections work for section creation. | Grand Test can source from both curriculum and course master data |
| SA-IL-018 | PYP uses Exam Body, not curriculum | None | 1. Create a PYP exam. 2. Verify it uses Exam Body selection (JEE/NEET), not curriculum/course dropdowns. | PYP categorization is independent of master data curriculum structure |

---

## Master Data (Curriculum/Courses) → AI Generators

| Test ID | Workflow | Precondition | Steps & Checkpoints | Expected Result |
|---------|----------|--------------|---------------------|-----------------|
| SA-IL-019 | AI Question Generator cascade flow | Curriculum data and published course exist | 1. Open AI Question Generator. 2. Select Curriculum mode -- verify full cascade: Curriculum → Class → Subject → Chapter → Topics (multi-select). 3. Switch to Course mode -- verify cascade: Course → Subject → Chapter → Topics (multi-select). | AI Question Generator supports both modes with correct cascade and multi-select topics |
| SA-IL-020 | AI Content Generator cascade flow | Curriculum data and published course exist | 1. Open AI Content Generator. 2. Select Curriculum mode -- verify full cascade works. 3. Switch to Course mode -- verify course cascade works. | AI Content Generator supports both classification modes |
| SA-IL-021 | PDF Upload classification flow | Curriculum data and published course exist | 1. Open PDF Upload. 2. Select Curriculum mode -- verify Curriculum → Class → Subject shown. 3. Switch to Course mode -- verify Course → Subject shown. | PDF Upload supports both modes with appropriate cascade depth |

---

## Master Data Deletion/Edit Impact

| Test ID | Workflow | Precondition | Steps & Checkpoints | Expected Result |
|---------|----------|--------------|---------------------|-----------------|
| SA-IL-022 | Rename propagation across modules | Subject and chapter with linked questions and content exist | 1. Rename a subject in Master Data. 2. Go to Question Bank filters -- verify new name shown. 3. Go to Content Library -- verify content cards show new name. 4. Rename a chapter. 5. Verify Question Bank and Content Library both reflect the change. | Renaming master data items propagates to all downstream modules |
| SA-IL-023 | Delete protection for used master data | Chapter used by questions and content exists; unused topic exists | 1. Try to delete a chapter that has questions -- verify warning/block. 2. Try to delete a chapter that has content -- verify warning/block. 3. Delete an unused topic -- verify it succeeds and disappears from dropdowns. | Deletion is blocked for master data with dependencies; unused items can be deleted |

---

## Question Bank → Exams

| Test ID | Workflow | Precondition | Steps & Checkpoints | Expected Result |
|---------|----------|--------------|---------------------|-----------------|
| SA-IL-024 | Question selection and filtering in exam builder | Questions of various types and difficulties exist | 1. Create an exam, go to add questions. 2. Verify questions are available for selection. 3. Filter by question type (e.g., MCQ) -- verify only MCQ shown. 4. Filter by difficulty (e.g., Hard) -- verify only hard questions shown. 5. Select some questions -- verify they are added to the exam. | Exam builder provides filterable access to the question bank |
| SA-IL-025 | Question add/remove flow in exam | Exam with some questions selected | 1. Note which questions are selected. 2. Try to add more questions -- verify already-selected questions are hidden/excluded. 3. Remove a question from the exam. 4. Go back to add questions -- verify the removed question is available again. | Selected questions are excluded from the pool; removed questions return to the pool |

---

## Content Library → Exams

| Test ID | Workflow | Precondition | Steps & Checkpoints | Expected Result |
|---------|----------|--------------|---------------------|-----------------|
| SA-IL-026 | Content classification aligns with exam sections | Content exists with subject classifications | 1. Create an exam with sections matching a subject. 2. Verify content classifications align with exam section structure. | Content and exam classifications use the same master data taxonomy |

---

## Content Library → Institutes

| Test ID | Workflow | Precondition | Steps & Checkpoints | Expected Result |
|---------|----------|--------------|---------------------|-----------------|
| SA-IL-027 | Global content visible to institutes | Global content created by SuperAdmin exists | 1. Login as an institute admin. 2. Go to Content Library. 3. Verify global content is visible with a "Global" badge. | SuperAdmin's global content is accessible (read-only) to all institutes |

---

## Questions → Institutes

| Test ID | Workflow | Precondition | Steps & Checkpoints | Expected Result |
|---------|----------|--------------|---------------------|-----------------|
| SA-IL-028 | Global questions available for institute exams | Global questions created by SuperAdmin exist | 1. Login as institute admin. 2. Create an exam, go to add questions. 3. Verify global questions are selectable alongside institute-specific questions. | Institutes can use SuperAdmin's global questions in their exams |

---

## Exams → Institutes

| Test ID | Workflow | Precondition | Steps & Checkpoints | Expected Result |
|---------|----------|--------------|---------------------|-----------------|
| SA-IL-029 | Assigned exam visible to institute | PYP or Grand Test exists | 1. Assign the exam to a specific institute. 2. Login as that institute's admin. 3. Verify the exam is visible. | Assigned exams appear in the institute's exam list |
| SA-IL-030 | Unassigned exam hidden from institute | Exam exists but not assigned to the institute | 1. Login as the institute admin. 2. Browse exams. 3. Verify unassigned exams are not visible. | Only assigned exams are accessible to institutes |

---

## Test Execution Order

1. Institutes → Users (SA-IL-001 to 002)
2. Institutes → Curriculum (SA-IL-003 to 004)
3. Roles → Users (SA-IL-005 to 006)
4. Master Data (Curriculum) → Courses (SA-IL-007 to 008)
5. Master Data (Curriculum) → Question Bank (SA-IL-009 to 011)
6. Master Data (Courses) → Question Bank (SA-IL-012)
7. Master Data (Curriculum) → Content Library (SA-IL-013 to 015)
8. Master Data (Courses) → Content Library (SA-IL-016)
9. Master Data (Curriculum/Courses) → Exams (SA-IL-017 to 018)
10. Master Data (Curriculum/Courses) → AI Generators (SA-IL-019 to 021)
11. Master Data Deletion/Edit Impact (SA-IL-022 to 023)
12. Question Bank → Exams (SA-IL-024 to 025)
13. Content Library → Exams (SA-IL-026)
14. Content Library → Institutes (SA-IL-027)
15. Questions → Institutes (SA-IL-028)
16. Exams → Institutes (SA-IL-029 to 030)

---

*Last Updated: February 2025*
