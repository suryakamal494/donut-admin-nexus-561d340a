# SuperAdmin Intra-Login Tests

> Module dependency tests within the SuperAdmin portal.

---

## Overview

These tests verify that modules within the SuperAdmin portal work correctly together. They test internal dependencies where one module's output affects another module's behavior.

---

## Curriculum → Content Library

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| SA-IL-001 | New subject appears in content classification | Curriculum with subjects exists | Add new subject to curriculum, go to Content Library, create content | New subject appears in dropdown |
| SA-IL-002 | Deleted subject removed from classification | Subject has no content | Delete subject, go to Content Library | Subject not in dropdown |
| SA-IL-003 | Renamed subject reflects in content | Subject has content | Rename subject, view content | Content shows new name |

---

## Curriculum → Question Bank

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| SA-IL-004 | Chapters available for question classification | Curriculum with chapters exists | Go to Questions, create question | All chapters in dropdown |
| SA-IL-005 | Topics available for granular classification | Topics exist | Create question, select chapter | Topics appear |
| SA-IL-006 | New chapter appears immediately | Questions page open | Add chapter in another tab, refresh | New chapter available |

---

## Curriculum → Courses

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| SA-IL-007 | Curriculum chapters available for mapping | Curriculum exists | Create course, map chapters | Curriculum chapters selectable |
| SA-IL-008 | Updated chapter name reflects in course | Chapter mapped to course | Rename chapter in curriculum | Course shows new name |
| SA-IL-009 | Deleted chapter warning in course | Chapter mapped to course | Try to delete chapter | Warning about course usage |

---

## Content Library → Exams

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| SA-IL-010 | Content classification matches exam sections | Content exists | Create exam with same subject | Classifications align |

---

## Question Bank → Exams

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| SA-IL-011 | Questions available for exam selection | Questions exist | Create exam, add questions | Questions selectable |
| SA-IL-012 | Question type filter works | Various types exist | Filter by MCQ in exam builder | Only MCQ shown |
| SA-IL-013 | Difficulty filter works | Various difficulties exist | Filter by Hard | Only hard questions shown |
| SA-IL-014 | Selected questions excluded | Some questions selected | Continue adding | Already-added hidden |
| SA-IL-015 | Question removal from exam | Exam with questions | Remove question | Question available again |

---

## Roles → Users

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| SA-IL-016 | New role appears in user assignment | None | Create new role, add user | New role in dropdown |
| SA-IL-017 | Deleted role removes from users | Role with users | Delete role | Users reassignment required |
| SA-IL-018 | Role permission change affects user | User with role | Edit role permissions, user logs in | New permissions active |

---

## Institutes → Users

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| SA-IL-019 | Institute admin created with institute | None | Create institute | Admin user created |
| SA-IL-020 | Inactive institute blocks user login | Institute with admin | Deactivate institute | Admin cannot login |

---

## Institutes → Curriculum

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| SA-IL-021 | Curriculum assignment enables access | Institute exists | Assign curriculum to institute | Institute can access |
| SA-IL-022 | Curriculum removal warning | Institute using curriculum | Try to remove curriculum | Warning about batches |

---

## Content Library → Institutes

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| SA-IL-023 | Global content visible to all institutes | Global content exists | Login to institute | Content visible with Global badge |

---

## Questions → Institutes

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| SA-IL-024 | Global questions available for institutes | Global questions exist | Institute creates exam | Global questions selectable |

---

## Exams → Institutes

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| SA-IL-025 | Assigned exam visible to institute | PYP/Grand Test exists | Assign to institute, login | Exam visible |
| SA-IL-026 | Unassigned exam hidden | Exam not assigned | Login to institute | Exam not visible |

---

## Test Execution Order

1. Curriculum → Other modules (classification dependencies)
2. Roles → Users (permission dependencies)
3. Content/Questions → Exams (selection dependencies)
4. Institutes → Everything (visibility dependencies)

---

*Last Updated: January 2025*
