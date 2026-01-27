# Teacher Intra-Login Tests

> Module dependency tests within the Teacher portal.

---

## Overview

These tests verify that modules within the Teacher portal work correctly together. They test internal dependencies where one module's output affects another module's behavior.

---

## Schedule → Dashboard

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| TE-IL-001 | Today's classes from schedule | Timetable published | View dashboard | Today's classes shown |
| TE-IL-002 | Current class highlighted | During class time | View dashboard | Current class indicated |
| TE-IL-003 | No schedule shows empty | No timetable | View dashboard | "No classes today" message |

---

## Schedule → Lesson Plans

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| TE-IL-004 | Scheduled slots enable plan creation | Schedule exists | Click "Add Plan" on slot | Plan form opens with context |
| TE-IL-005 | Plan linked to schedule slot | Plan created | View schedule | Plan indicator on slot |
| TE-IL-006 | No slot no plan | No schedule | Try to create plan | No slots available |

---

## Lesson Plans → Lesson Workspace

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| TE-IL-007 | Plan opens in workspace | Plan exists | Click plan | Workspace opens with blocks |
| TE-IL-008 | Draft plan editable | Draft plan | Open workspace | Edit actions available |
| TE-IL-009 | Saved blocks persist | Blocks added | Close and reopen | Blocks still there |

---

## Lesson Workspace → Presentation

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| TE-IL-010 | Present mode shows blocks | Plan with blocks | Click "Present" | Full-screen presentation |
| TE-IL-011 | Navigation works | Multiple blocks | Navigate forward/back | Blocks navigate correctly |
| TE-IL-012 | Empty plan blocks present | No blocks | Click "Present" | "Add blocks first" message |

---

## Content Library → Lesson Workspace

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| TE-IL-013 | Content available for blocks | Content exists | Add block, select content | Content in picker |
| TE-IL-014 | Created content in workspace | Create content | Add content block | New content available |
| TE-IL-015 | Subject-scoped content | Teacher has Physics only | View content picker | Only Physics content |

---

## Content Library → Batches

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| TE-IL-016 | Assigned batches for content | Batches assigned | Click "Assign" on content | Batches in list |
| TE-IL-017 | Student count shown | Batch with students | View assignment dialog | Count displayed |

---

## Homework → Batches

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| TE-IL-018 | Batches available for homework | Batches assigned | Create homework | Batches selectable |
| TE-IL-019 | Homework linked to batch | Homework assigned | View homework list | Batch shown |

---

## Exams → Question Bank

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| TE-IL-020 | Questions available for exam | Questions exist | Create exam | Questions in picker |
| TE-IL-021 | Subject-scoped questions | Teacher has Physics | View question bank | Only Physics questions |
| TE-IL-022 | Global + Institute + Own | All sources exist | View question bank | All sources visible |

---

## Exams → Batches

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| TE-IL-023 | Exam assignable to batches | Exam created | Assign exam | Batches available |
| TE-IL-024 | Results per batch | Exam completed | View results | Batch filter works |

---

## Academic Progress → Schedule

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| TE-IL-025 | Classes from schedule shown | Schedule exists | View academic progress | Classes listed |
| TE-IL-026 | Pending confirmation shown | Classes not confirmed | View progress | Pending badge |
| TE-IL-027 | Past classes confirmable | Classes in past | View progress | Confirm button active |

---

## Academic Progress → Syllabus

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| TE-IL-028 | Confirmation updates progress | Class pending | Confirm teaching | Progress increments |
| TE-IL-029 | Topics marked as taught | Confirm with topics | View chapter | Topics show taught |
| TE-IL-030 | Not taught logged | Mark as not taught | View history | Reason recorded |

---

## Notifications → Actions

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| TE-IL-031 | Pending confirmation reminder | Unconfirmed classes | Check notifications | Reminder present |
| TE-IL-032 | Substitution notification | Assigned substitution | Check notifications | Substitution alert |
| TE-IL-033 | Notification links work | Notification exists | Click notification | Navigates correctly |

---

## Test Execution Order

1. Schedule → Dashboard (display dependencies)
2. Schedule → Lesson Plans (creation dependencies)
3. Lesson Plans → Workspace (editing dependencies)
4. Content → Workspace/Batches (usage dependencies)
5. Academic Progress → Schedule (confirmation dependencies)

---

*Last Updated: January 2025*
