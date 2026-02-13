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
| SA-IL-009 | New curriculum data reflects in Course view | Course with mapped chapters exists | 1. Note existing chapters mapped from CBSE to the course. 2. Go to Master Data Curriculum, add a new chapter under a mapped subject. 3. Go to Course Builder -- verify the new chapter is available for mapping. 4. Map the new chapter to the course. 5. Go back to curriculum, add a topic under an already-mapped chapter. 6. Go to Course view -- verify the new topic appears under that mapped chapter. | New curriculum chapters are available for course mapping; new topics on mapped chapters reflect automatically in course view |

---

## Master Data (Curriculum) → Question Bank

| Test ID | Workflow | Precondition | Steps & Checkpoints | Expected Result |
|---------|----------|--------------|---------------------|-----------------|
| SA-IL-010 | Curriculum-mode cascade flow in Question Bank | Curriculum with full hierarchy (Curriculum → Class → Subject → Chapter → Topic) exists | 1. Go to Question Bank, create question. 2. Select Curriculum mode. 3. Pick a curriculum -- verify only active curriculums shown. 4. Pick a class -- verify classes for that curriculum populate. 5. Pick a subject -- verify subjects for that class populate. 6. Pick a chapter -- verify chapters for that subject populate. 7. Pick a topic -- verify topics for that chapter populate. 8. Change the class selection -- verify Subject, Chapter, Topic all reset to empty. 9. Make a full selection again, change subject -- verify Chapter, Topic reset. | Complete cascade works top-to-bottom; changing any parent resets all children below it |
| SA-IL-011 | New master data reflects in Question Bank | Question creation page open | 1. Note current chapters for a subject. 2. Go to Master Data, add a new chapter under that subject. 3. Return to Question Bank, create question, navigate to same subject. 4. Verify new chapter appears in dropdown. 5. Add a topic under that chapter in Master Data. 6. Return, select the new chapter -- verify topic appears. | Newly created chapters and topics are immediately available in Question Bank dropdowns |
| SA-IL-012 | Question Bank listing filters match master data | Questions exist with various classifications | 1. Go to Question Bank listing page. 2. Open Class filter dropdown -- verify it matches master data classes. 3. Open Subject filter dropdown -- verify it matches master data subjects. 4. Filter by a specific class -- verify only questions of that class shown. 5. Filter by a specific subject -- verify correct filtering. | Listing page filter dropdowns are populated from and stay in sync with master data |

---

## Master Data (Courses) → Question Bank

| Test ID | Workflow | Precondition | Steps & Checkpoints | Expected Result |
|---------|----------|--------------|---------------------|-----------------|
| SA-IL-013 | Course-mode cascade flow in Question Bank | Published course with subjects, chapters, topics exists | 1. Go to Question Bank, create question. 2. Select Course mode. 3. Verify Class field is hidden (Course mode skips Class). 4. Pick a course -- verify only published courses shown. 5. Pick a subject -- verify subjects for that course populate. 6. Pick a chapter -- verify both mapped curriculum chapters and course-owned chapters are listed. 7. Verify course-exclusive chapters are visually distinguishable. 8. Pick a topic -- verify topics load for the selected chapter. | Course-mode cascade works without Class; both mapped and course-owned chapters appear distinctly |

---

## Master Data (Course-Only Content) → QB / Content Library / Exams

| Test ID | Workflow | Precondition | Steps & Checkpoints | Expected Result |
|---------|----------|--------------|---------------------|-----------------|
| SA-IL-014 | Course-only chapters and topics reflect in downstream modules | Published course exists with a subject | 1. Go to Course Builder, create a course-only chapter under a subject. 2. Add 2-3 topics under that chapter. 3. Save the course. 4. Go to Question Bank, select Course mode, pick the course and subject -- verify the course-only chapter appears in the chapter dropdown. 5. Select it -- verify the topics appear. 6. Go to Content Library, select Course mode -- verify same course-only chapter and topics are available. 7. Go to Exams, create Grand Test with Course source -- verify course-only chapters are selectable. | Course-only chapters and their topics are immediately available in Question Bank, Content Library, and Exams under Course mode |

---

## Master Data (Curriculum) → Content Library

| Test ID | Workflow | Precondition | Steps & Checkpoints | Expected Result |
|---------|----------|--------------|---------------------|-----------------|
| SA-IL-015 | Curriculum-mode cascade flow in Content Library | Curriculum with full hierarchy exists | 1. Go to Content Library, create content. 2. Select Curriculum mode. 3. Verify full cascade works: Curriculum → Class → Subject → Chapter → Topic. 4. Verify Difficulty and Cognitive Type fields are absent (content doesn't use these). 5. Change a parent selection -- verify children reset. | Cascade works identically to Question Bank minus Difficulty/Cognitive fields |
| SA-IL-016 | Master data CRUD reflects in Content Library | Content exists with classifications | 1. Add a new subject in Master Data. 2. Go to Content Library, create content -- verify new subject appears. 3. Rename the subject in Master Data. 4. View existing content -- verify it shows the new name. 5. Delete an unused subject. 6. Verify it no longer appears in Content Library dropdowns. | Content Library classification dropdowns stay in sync with master data changes |
| SA-IL-017 | Content Library listing filters match master data | Content exists with various classifications | 1. Go to Content Library listing page. 2. Open Class filter -- verify matches master data. 3. Open Subject filter -- verify matches master data. 4. Apply filters -- verify correct filtering. | Listing filters are populated from and sync with master data |

---

## Master Data (Courses) → Content Library

| Test ID | Workflow | Precondition | Steps & Checkpoints | Expected Result |
|---------|----------|--------------|---------------------|-----------------|
| SA-IL-018 | Course-mode flow in Content Library | Published course with chapters exists | 1. Go to Content Library, create content. 2. Select Course mode. 3. Verify cascade: Course → Subject → Chapter → Topic (no Class). 4. Verify course chapters appear in the dropdown. | Course-mode content creation works without Class level |

---

## Master Data (Curriculum/Courses) → Exams

| Test ID | Workflow | Precondition | Steps & Checkpoints | Expected Result |
|---------|----------|--------------|---------------------|-----------------|
| SA-IL-019 | Grand Test uses master data dropdowns | Active curriculums and published courses exist | 1. Create a Grand Test. 2. Select Curriculum source -- verify active curriculums shown. 3. Select Course source -- verify published courses shown. 4. Verify cascade selections work for section creation. | Grand Test can source from both curriculum and course master data |
| SA-IL-020 | PYP uses Exam Body, not curriculum | None | 1. Create a PYP exam. 2. Verify it uses Exam Body selection (JEE/NEET), not curriculum/course dropdowns. | PYP categorization is independent of master data curriculum structure |

---

## Master Data (Curriculum/Courses) → AI Generators

| Test ID | Workflow | Precondition | Steps & Checkpoints | Expected Result |
|---------|----------|--------------|---------------------|-----------------|
| SA-IL-021 | AI Question Generator cascade flow | Curriculum data and published course exist | 1. Open AI Question Generator. 2. Select Curriculum mode -- verify full cascade: Curriculum → Class → Subject → Chapter → Topics (multi-select). 3. Switch to Course mode -- verify cascade: Course → Subject → Chapter → Topics (multi-select). | AI Question Generator supports both modes with correct cascade and multi-select topics |
| SA-IL-022 | AI Content Generator cascade flow | Curriculum data and published course exist | 1. Open AI Content Generator. 2. Select Curriculum mode -- verify full cascade works. 3. Switch to Course mode -- verify course cascade works. | AI Content Generator supports both classification modes |
| SA-IL-023 | PDF Upload classification flow | Curriculum data and published course exist | 1. Open PDF Upload. 2. Select Curriculum mode -- verify Curriculum → Class → Subject shown. 3. Switch to Course mode -- verify Course → Subject shown. | PDF Upload supports both modes with appropriate cascade depth |

---

## Chapter Ordering Across Platform

| Test ID | Workflow | Precondition | Steps & Checkpoints | Expected Result |
|---------|----------|--------------|---------------------|-----------------|
| SA-IL-024 | Curriculum chapter order preserved in downstream dropdowns | Curriculum with 5+ chapters under a subject exists | 1. Go to Master Data Curriculum view. 2. Select a class and subject with multiple chapters. 3. Drag chapters to create a custom order (e.g., move Chapter 5 to position 1). 4. Save the order. 5. Go to Question Bank, Curriculum mode, select same class and subject -- verify chapter dropdown shows chapters in the saved order. 6. Go to Content Library, same selection -- verify same order. 7. Go to AI Question Generator, same selection -- verify same order. | Chapter ordering set in Master Data Curriculum view is preserved in all downstream chapter dropdowns |
| SA-IL-025 | Course chapter order preserved in downstream dropdowns | Course with 5+ chapters (mix of mapped and course-only) | 1. Go to Course Builder. 2. Select the course and a subject. 3. Drag chapters to create a custom order (interleaving mapped and course-only chapters). 4. Save. 5. Go to Question Bank, Course mode, same course and subject -- verify chapter dropdown respects the saved order. 6. Go to Content Library, Course mode -- verify same order. 7. Go to Exams, Course source -- verify same order. | Chapter ordering set in Course Builder is preserved in all downstream chapter dropdowns for course mode |

---

## Master Data Deletion/Edit Impact

> **Note:** Chapter and topic deletion is not supported in the platform. Only edit/rename is available.

| Test ID | Workflow | Precondition | Steps & Checkpoints | Expected Result |
|---------|----------|--------------|---------------------|-----------------|
| SA-IL-026 | Rename propagation across modules | Subject and chapter with linked questions and content exist | 1. Rename a subject in Master Data. 2. Go to Question Bank filters -- verify new name shown. 3. Go to Content Library -- verify content cards show new name. 4. Rename a chapter. 5. Verify Question Bank and Content Library both reflect the change. | Renaming master data items propagates to all downstream modules |
| SA-IL-027 | Delete protection for used master data | Subject used by questions and content exists; unused topic exists | 1. Try to delete a subject that has questions -- verify warning/block. 2. Try to delete a subject that has content -- verify warning/block. 3. Delete an unused topic -- verify it succeeds and disappears from dropdowns. | Deletion is blocked for master data with dependencies; unused items can be deleted |
| SA-IL-028 | Course-only chapter rename propagates to downstream | Course-only chapter with questions/content classified under it | 1. Go to Course Builder, rename a course-only chapter. 2. Save the course. 3. Go to Question Bank, Course mode -- verify the renamed chapter appears with the new name. 4. View existing questions classified under it -- verify they show the new name. 5. Go to Content Library, Course mode -- verify renamed chapter in dropdown and on existing content cards. | Renaming a course-only chapter propagates to all downstream modules |

---

## Question Bank → Exams

| Test ID | Workflow | Precondition | Steps & Checkpoints | Expected Result |
|---------|----------|--------------|---------------------|-----------------|
| SA-IL-029 | Question selection and filtering in exam builder | Questions of various types and difficulties exist | 1. Create an exam, go to add questions. 2. Verify questions are available for selection. 3. Filter by question type (e.g., MCQ) -- verify only MCQ shown. 4. Filter by difficulty (e.g., Hard) -- verify only hard questions shown. 5. Select some questions -- verify they are added to the exam. | Exam builder provides filterable access to the question bank |
| SA-IL-030 | Question add/remove flow in exam | Exam with some questions selected | 1. Note which questions are selected. 2. Try to add more questions -- verify already-selected questions are hidden/excluded. 3. Remove a question from the exam. 4. Go back to add questions -- verify the removed question is available again. | Selected questions are excluded from the pool; removed questions return to the pool |

---

## Previous Year Paper — End-to-End Creation Workflow

| Test ID | Workflow | Precondition | Steps & Checkpoints | Expected Result |
|---------|----------|--------------|---------------------|-----------------|
| SA-IL-031 | PYP creation and PDF extraction workflow | None | 1. Go to Exams, click "Create Previous Year Paper". 2. Select exam type (JEE Main) -- verify JEE Main, JEE Advanced, NEET options available. 3. Select year and session -- verify paper name auto-generates (e.g., "JEE Main 2025 - January Session"). 4. Customize the paper name if needed -- verify editable. 5. Proceed to Upload step. 6. Upload a PDF file -- verify only PDF accepted, max 50MB enforced. 7. Click "Upload and Create Test" -- verify upload completes and success confirmation shown. 8. Click "Review and Configure" -- verify redirected to Review page with questions extracted. 9. Verify questions are grouped by subjects (Physics, Chemistry, Mathematics for JEE Main). 10. Verify section structure matches exam pattern -- Section A (MCQ) and Section B (Numerical) for JEE Main. 11. Verify marking scheme is correct: +4/-1 for MCQ, +4/0 for Numerical. | Complete PYP creation flow works end-to-end: exam config, PDF upload, question extraction with correct pattern, sections, and marking |
| SA-IL-032 | PYP review and question validation workflow | PYP created and in review state | 1. Open the PYP review page. 2. Navigate between subjects using subject tabs -- verify question counts shown per subject. 3. Use Quick Navigation panel -- verify all question numbers visible and clickable. 4. Click a question number -- verify jumps to correct page. 5. Open a question -- verify question text, options, correct answer marked (green), chapter and topic shown. 6. Click "Show Solution" -- verify solution text displayed. 7. Click "Edit" on a question -- verify edit dialog opens with pre-filled data. 8. Modify question text, save -- verify status changes to "Edited" (orange). 9. Click "Delete" on a question -- verify status changes to "Deleted" (red, greyed out). 10. Click "Mark Reviewed" on a pending question -- verify status changes to "Reviewed" (green). 11. Verify progress badge on subject tabs updates (reviewed/total count). | Complete question review workflow functions: navigation, solution viewing, editing, deleting, and marking reviewed all work with correct status tracking |
| SA-IL-033 | PYP pattern verification across exam types | PYPs for JEE Main, JEE Advanced, and NEET created | 1. Open a JEE Main PYP -- verify 3 subjects (Physics, Chemistry, Mathematics), no sub-sections within subjects, Section A (20 MCQ, +4/-1) and Section B (10 Numerical, +4/0), total 90 questions, 300 marks. 2. Open a JEE Advanced PYP -- verify 3 subjects (Physics, Chemistry, Mathematics), each subject has multiple sections (Paper 1 and Paper 2 style), mix of single-choice, multi-choice, paragraph, and numerical, total 54 questions, 198 marks. 3. Open a NEET PYP -- verify 4 subjects (Physics, Chemistry, Botany, Zoology), Section A (35 MCQ) and Section B (15 MCQ, attempt any 10), total 180 questions (200 with Section B extras), 720 marks. | Each exam type follows its official pattern with correct subject splits, section structures, question types, and marking schemes |
| SA-IL-034 | PYP publish and audience assignment workflow | PYP reviewed and ready to publish | 1. On the review page, click "Publish Test" -- verify publish confirmation dialog appears. 2. Confirm publish -- verify test status changes to "Published" and redirected to exam listing. 3. Verify the published PYP appears in the listing under the correct exam type and year accordion. 4. Verify Rank and Percentile config section is available for PYPs. 5. Click "Audience" on the published PYP -- verify audience selection dialog opens. 6. Select specific institutes -- verify selected institutes listed. 7. Select "All Institutes" -- verify all institutes selected. 8. Save audience -- verify audience count displayed on the PYP card. | PYP can be published, listed correctly by exam type and year, rank/percentile configured, and audience assigned to specific or all institutes |
| SA-IL-035 | PYP edit and draft management | Published and draft PYPs exist | 1. Open a draft PYP -- verify edit and delete options available. 2. Open a published PYP -- verify view and audience options available but edit of questions is restricted. 3. View PYP stats (if completed) -- verify stats button works. 4. Verify draft PYPs are not visible to institutes. 5. Verify only published PYPs appear in institute view. | Draft PYPs are editable but hidden from institutes; published PYPs are view-only for questions but allow audience and schedule management |

---

## Content Library → Exams

| Test ID | Workflow | Precondition | Steps & Checkpoints | Expected Result |
|---------|----------|--------------|---------------------|-----------------|
| SA-IL-036 | Content classification aligns with exam sections | Content exists with subject classifications | 1. Create an exam with sections matching a subject. 2. Verify content classifications align with exam section structure. | Content and exam classifications use the same master data taxonomy |

---

## Content Library → Institutes

| Test ID | Workflow | Precondition | Steps & Checkpoints | Expected Result |
|---------|----------|--------------|---------------------|-----------------|
| SA-IL-037 | Global content visible to institutes | Global content created by SuperAdmin exists | 1. Login as an institute admin. 2. Go to Content Library. 3. Verify global content is visible with a "Global" badge. | SuperAdmin's global content is accessible (read-only) to all institutes |

---

## Questions → Institutes

| Test ID | Workflow | Precondition | Steps & Checkpoints | Expected Result |
|---------|----------|--------------|---------------------|-----------------|
| SA-IL-038 | Global questions available for institute exams | Global questions created by SuperAdmin exist | 1. Login as institute admin. 2. Create an exam, go to add questions. 3. Verify global questions are selectable alongside institute-specific questions. | Institutes can use SuperAdmin's global questions in their exams |

---

## Exams → Institutes

| Test ID | Workflow | Precondition | Steps & Checkpoints | Expected Result |
|---------|----------|--------------|---------------------|-----------------|
| SA-IL-039 | Assigned exam visible to institute | PYP or Grand Test exists | 1. Assign the exam to a specific institute. 2. Login as that institute's admin. 3. Verify the exam is visible. | Assigned exams appear in the institute's exam list |
| SA-IL-040 | Unassigned exam hidden from institute | Exam exists but not assigned to the institute | 1. Login as the institute admin. 2. Browse exams. 3. Verify unassigned exams are not visible. | Only assigned exams are accessible to institutes |

---

## Test Execution Order

1. Institutes → Users (SA-IL-001 to 002)
2. Institutes → Curriculum (SA-IL-003 to 004)
3. Roles → Users (SA-IL-005 to 006)
4. Master Data (Curriculum) → Courses (SA-IL-007 to 009)
5. Master Data (Curriculum) → Question Bank (SA-IL-010 to 012)
6. Master Data (Courses) → Question Bank (SA-IL-013)
7. Master Data (Course-Only Content) → QB / Content Library / Exams (SA-IL-014)
8. Master Data (Curriculum) → Content Library (SA-IL-015 to 017)
9. Master Data (Courses) → Content Library (SA-IL-018)
10. Master Data (Curriculum/Courses) → Exams (SA-IL-019 to 020)
11. Master Data (Curriculum/Courses) → AI Generators (SA-IL-021 to 023)
12. Chapter Ordering Across Platform (SA-IL-024 to 025)
13. Master Data Deletion/Edit Impact (SA-IL-026 to 028)
14. Question Bank → Exams (SA-IL-029 to 030)
15. Previous Year Paper — End-to-End Creation (SA-IL-031 to 035)
16. Content Library → Exams (SA-IL-036)
17. Content Library → Institutes (SA-IL-037)
18. Questions → Institutes (SA-IL-038)
19. Exams → Institutes (SA-IL-039 to 040)

---

*Last Updated: February 2026*
