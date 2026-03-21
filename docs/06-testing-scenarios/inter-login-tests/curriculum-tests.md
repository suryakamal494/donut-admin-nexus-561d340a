# Curriculum Cross-Portal Tests

> Tests for curriculum and course propagation from SuperAdmin through all downstream portals.

---

## Overview

These tests verify that curriculum and course master data created by SuperAdmin correctly propagates to Institute, Teacher, and Student portals for classification and navigation.

---

## SuperAdmin → Institute Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CU-001 | Assigned curriculum visible | SA assigns CBSE to institute | Institute sees CBSE in Master Data |
| CU-002 | Unassigned curriculum hidden | SA has ICSE, not assigned | Institute doesn't see ICSE |
| CU-003 | All classes visible | CBSE assigned | All CBSE classes shown |
| CU-004 | All subjects visible | Select class | Class subjects shown |
| CU-005 | All chapters visible | Select subject | Subject chapters shown |
| CU-006 | All topics visible | Expand chapter | Chapter topics shown |
| CU-007 | Read-only enforced | Try to edit | No edit actions |

---

## SuperAdmin → Institute (Courses) Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CU-008 | Assigned course visible | SA assigns JEE to institute | Institute sees JEE in Master Data |
| CU-009 | 2-panel layout for courses | Select course track | Subject → Content panels |
| CU-010 | Mapped chapters grouped | View course chapters | Grouped by source |
| CU-011 | Exclusive chapters marked | View course chapters | "Course Exclusive" section |

---

## Curriculum → Batch Creation Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CU-012 | Classes from curriculum | Create batch | Assigned classes in dropdown |
| CU-013 | Subjects from class | Select class | Class subjects available |
| CU-014 | Track selection works | Multiple curricula assigned | Track selector appears |
| CU-015 | Course track available | Courses assigned | Course track selectable |

---

## Curriculum → Content Classification Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CU-016 | Classes in content form | Create content | Classes in dropdown |
| CU-017 | Subjects cascade | Select class | Subjects update |
| CU-018 | Chapters cascade | Select subject | Chapters update |
| CU-019 | Topics cascade | Select chapter | Topics update |
| CU-020 | All portals use same structure | SA/Inst/Teacher create | Same hierarchy |

---

## Curriculum → Question Classification Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CU-021 | Full hierarchy in questions | Create question | All levels available |
| CU-022 | Required classifications | Leave chapter empty | Validation error |
| CU-023 | Classification in preview | View question | Classification shown |

---

## Curriculum → Exam Creation Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CU-024 | Subjects in exam sections | Create exam | Subjects available |
| CU-025 | Chapters for question filter | Filter questions | Chapters in filter |

---

## Curriculum → Teacher Scope Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CU-026 | Teacher sees assigned subjects | Teacher has Physics | Only Physics content/questions |
| CU-027 | Teacher sees assigned classes | Teacher has Class 10 | Only Class 10 in filters |
| CU-028 | Subject assignment from curriculum | Assign teacher to subject | Subject must exist in curriculum |

---

## Curriculum → Student Navigation Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CU-029 | Subjects from batch curriculum | View subjects | Batch subjects shown |
| CU-030 | Chapters in subject | Open subject | Subject chapters listed |
| CU-031 | Topics in chapter | View chapter content | Topics categorize content |
| CU-032 | Progress per chapter | View subject | Chapter-wise progress |

---

## Curriculum Update Impact Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CU-033 | New subject propagates | SA adds subject | Downstream sees new subject |
| CU-034 | Renamed chapter reflects | SA renames chapter | All portals show new name |
| CU-035 | Deleted chapter blocked | SA tries to delete used chapter | Warning about usage |
| CU-036 | Reordered topics reflect | SA reorders topics | New order downstream |

---

## Course Mapping Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CU-037 | Mapped chapters accessible | Course uses curriculum chapter | Chapter available in course context |
| CU-038 | Exclusive chapters isolated | Course has exclusive chapter | Only in course, not curriculum |
| CU-039 | Curriculum chapter in course | View mapped chapter | Shows "From CBSE 11" label |
| CU-040 | Course context in content | Create content for course | Course-linked classification |

---

## Academic Setup → Curriculum Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CU-041 | Chapters from curriculum | View academic setup | Curriculum chapters listed |
| CU-042 | Hours per chapter | Allocate hours | Saves to chapter |
| CU-043 | Topic count shown | View chapter | Topic count displayed |

---

## Performance Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CU-044 | Large curriculum loads | 12 classes, 20 subjects each | Loads within 2s |
| CU-045 | Navigation responsive | Click through hierarchy | Instant updates |
| CU-046 | Search works | Search in master data | Matching items shown |

---

*Last Updated: March 2025*
