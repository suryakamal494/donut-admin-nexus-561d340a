# SuperAdmin Intra-Login Tests

> Module dependency tests within the SuperAdmin portal, ordered by sidebar navigation flow.

---

## Overview

These tests verify that modules within the SuperAdmin portal work correctly together. They test internal dependencies where one module's output affects another module's behavior. Sections follow the SuperAdmin sidebar order: Institutes → Users → Master Data → Roles & Access → Question Bank → Exams → Content Library.

---

## Institutes → Users

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| SA-IL-001 | Institute admin created with institute | None | Create institute | Admin user created |
| SA-IL-002 | Inactive institute blocks user login | Institute with admin | Deactivate institute | Admin cannot login |

---

## Institutes → Curriculum

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| SA-IL-003 | Curriculum assignment enables access | Institute exists | Assign curriculum to institute | Institute can access |
| SA-IL-004 | Curriculum removal warning | Institute using curriculum | Try to remove curriculum | Warning about batches |

---

## Roles → Users

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| SA-IL-005 | New role appears in user assignment | None | Create new role, add user | New role in dropdown |
| SA-IL-006 | Deleted role removes from users | Role with users | Delete role | Users reassignment required |
| SA-IL-007 | Role permission change affects user | User with role | Edit role permissions, user logs in | New permissions active |

---

## Master Data (Curriculum) → Courses

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| SA-IL-008 | Curriculum chapters available for mapping | Curriculum exists | Create course, map chapters | Curriculum chapters selectable |
| SA-IL-009 | Updated chapter name reflects in course | Chapter mapped to course | Rename chapter in curriculum | Course shows new name |
| SA-IL-010 | Deleted chapter warning in course | Chapter mapped to course | Try to delete chapter | Warning about course usage |

---

## Master Data (Curriculum) → Question Bank

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| SA-IL-011 | Curriculum dropdown shows active curriculums | Active curriculums exist | Create question, select Curriculum mode | Only active curriculums in dropdown |
| SA-IL-012 | Class dropdown populates after curriculum | Curriculum with classes exists | Select curriculum | Classes for that curriculum shown |
| SA-IL-013 | Subject dropdown populates after class | Class with subjects exists | Select class | Subjects for that class shown |
| SA-IL-014 | Chapter dropdown populates after subject | Subject with chapters exists | Select subject | Chapters for that subject shown |
| SA-IL-015 | Topic dropdown populates after chapter | Chapter with topics exists | Select chapter | Topics for that chapter shown |
| SA-IL-016 | Cascade reset: changing class resets children | Full selection made | Change class after full selection | Subject, Chapter, Topic reset to empty |
| SA-IL-017 | Cascade reset: changing subject resets children | Full selection made | Change subject | Chapter, Topic reset to empty |
| SA-IL-018 | New chapter appears in question creation | Question creation open | Add chapter in master data, return to create question | New chapter in dropdown |
| SA-IL-019 | Subject filter on listing page uses master data | Questions exist | View question bank listing | Subject dropdown matches master data subjects |
| SA-IL-020 | Class filter on listing page uses master data | Questions exist | View question bank listing | Class dropdown matches master data classes |
| SA-IL-021 | Chapters available for question classification | Curriculum with chapters exists | Go to Questions, create question | All chapters in dropdown |
| SA-IL-022 | Topics available for granular classification | Topics exist | Create question, select chapter | Topics appear |
| SA-IL-023 | New chapter appears immediately | Questions page open | Add chapter in another tab, refresh | New chapter available |

---

## Master Data (Courses) → Question Bank

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| SA-IL-024 | Course dropdown shows published courses | Published courses exist | Create question, select Course mode | Only published courses shown |
| SA-IL-025 | Course chapters include mapped + owned | Course with both types exists | Select course, then subject | Both mapped and course-owned chapters listed |
| SA-IL-026 | Course-owned chapter marked distinctly | Course-owned chapters exist | View chapter dropdown in Course mode | Course-exclusive chapters identifiable |
| SA-IL-027 | No Class dropdown in Course mode | None | Select Course mode | Class field hidden, flow goes Course → Subject |
| SA-IL-028 | Topics load for course chapters | Course chapters with topics exist | Select course chapter | Topics shown in dropdown |

---

## Master Data (Curriculum) → Content Library

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| SA-IL-029 | New subject appears in content classification | Curriculum with subjects exists | Add new subject to curriculum, go to Content Library, create content | New subject appears in dropdown |
| SA-IL-030 | Deleted subject removed from classification | Subject has no content | Delete subject, go to Content Library | Subject not in dropdown |
| SA-IL-031 | Renamed subject reflects in content | Subject has content | Rename subject, view content | Content shows new name |
| SA-IL-032 | Full cascade in content creation (Curriculum) | Curriculum data exists | Create content, Curriculum mode | Curriculum → Class → Subject → Chapter → Topic all cascade correctly |
| SA-IL-033 | No Difficulty/Cognitive fields in content | None | Create content | Difficulty and Cognitive Type fields absent |
| SA-IL-034 | Class filter on listing uses master data | Content exists | View content listing | Class dropdown matches master data |
| SA-IL-035 | Subject filter on listing uses master data | Content exists | View content listing | Subject dropdown matches master data |

---

## Master Data (Courses) → Content Library

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| SA-IL-036 | Course mode in content creation | Published course exists | Create content, Course mode | Course → Subject → Chapter → Topic (no Class) |
| SA-IL-037 | Course chapters available in content | Course with chapters exists | Select course in content creation | Course chapters in dropdown |

---

## Master Data (Curriculum/Courses) → Exams

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| SA-IL-038 | Grand Test Curriculum dropdown | Active curriculums exist | Create Grand Test, select Curriculum source | Active curriculums shown |
| SA-IL-039 | Grand Test Course dropdown | Published courses exist | Create Grand Test, select Course source | Published courses shown |
| SA-IL-040 | PYP does NOT use curriculum dropdown | None | Create PYP | Uses Exam Body (JEE/NEET), not curriculum selection |

---

## Master Data (Curriculum/Courses) → AI Generators

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| SA-IL-041 | AI Question Generator uses curriculum cascade | Curriculum data exists | Open AI generator, Curriculum mode | Full cascade: Curriculum → Class → Subject → Chapter → Topics (multi) |
| SA-IL-042 | AI Question Generator uses course cascade | Published course exists | Open AI generator, Course mode | Course → Subject → Chapter → Topics (multi) |
| SA-IL-043 | AI Content Generator uses curriculum cascade | Curriculum data exists | Open AI content generator, Curriculum mode | Full cascade works |
| SA-IL-044 | AI Content Generator uses course cascade | Published course exists | Open AI content generator, Course mode | Course cascade works |
| SA-IL-045 | PDF Upload uses curriculum cascade | Curriculum data exists | Open PDF upload, Curriculum mode | Curriculum → Class → Subject shown |
| SA-IL-046 | PDF Upload uses course cascade | Published course exists | Open PDF upload, Course mode | Course → Subject shown |

---

## Master Data Deletion/Edit Impact

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| SA-IL-047 | Renamed subject reflects in Question Bank filters | Subject with questions exists | Rename subject in master data | Filter shows new name |
| SA-IL-048 | Renamed chapter reflects in Content Library | Chapter with content exists | Rename chapter in master data | Content cards show new name |
| SA-IL-049 | Deleted unused topic removed from creation | Unused topic exists | Delete unused topic | Not in dropdown |
| SA-IL-050 | Delete blocked for chapter with questions | Chapter used by questions | Try to delete chapter | Warning/block message shown |
| SA-IL-051 | Delete blocked for chapter with content | Chapter used by content | Try to delete chapter | Warning/block message shown |

---

## Question Bank → Exams

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| SA-IL-052 | Questions available for exam selection | Questions exist | Create exam, add questions | Questions selectable |
| SA-IL-053 | Question type filter works | Various types exist | Filter by MCQ in exam builder | Only MCQ shown |
| SA-IL-054 | Difficulty filter works | Various difficulties exist | Filter by Hard | Only hard questions shown |
| SA-IL-055 | Selected questions excluded | Some questions selected | Continue adding | Already-added hidden |
| SA-IL-056 | Question removal from exam | Exam with questions | Remove question | Question available again |

---

## Content Library → Exams

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| SA-IL-057 | Content classification matches exam sections | Content exists | Create exam with same subject | Classifications align |

---

## Content Library → Institutes

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| SA-IL-058 | Global content visible to all institutes | Global content exists | Login to institute | Content visible with Global badge |

---

## Questions → Institutes

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| SA-IL-059 | Global questions available for institutes | Global questions exist | Institute creates exam | Global questions selectable |

---

## Exams → Institutes

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| SA-IL-060 | Assigned exam visible to institute | PYP/Grand Test exists | Assign to institute, login | Exam visible |
| SA-IL-061 | Unassigned exam hidden | Exam not assigned | Login to institute | Exam not visible |

---

## Test Execution Order

1. Institutes → Users (SA-IL-001 to 002)
2. Institutes → Curriculum (SA-IL-003 to 004)
3. Roles → Users (SA-IL-005 to 007)
4. Master Data (Curriculum) → Courses (SA-IL-008 to 010)
5. Master Data (Curriculum) → Question Bank (SA-IL-011 to 023)
6. Master Data (Courses) → Question Bank (SA-IL-024 to 028)
7. Master Data (Curriculum) → Content Library (SA-IL-029 to 035)
8. Master Data (Courses) → Content Library (SA-IL-036 to 037)
9. Master Data (Curriculum/Courses) → Exams (SA-IL-038 to 040)
10. Master Data (Curriculum/Courses) → AI Generators (SA-IL-041 to 046)
11. Master Data Deletion/Edit Impact (SA-IL-047 to 051)
12. Question Bank → Exams (SA-IL-052 to 056)
13. Content Library → Exams (SA-IL-057)
14. Content Library → Institutes (SA-IL-058)
15. Questions → Institutes (SA-IL-059)
16. Exams → Institutes (SA-IL-060 to 061)

---

*Last Updated: February 2025*
