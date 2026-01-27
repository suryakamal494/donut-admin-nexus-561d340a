# Institute Intra-Login Tests

> Module dependency tests within the Institute Admin portal.

---

## Overview

These tests verify that modules within the Institute portal work correctly together. They test internal dependencies where one module's output affects another module's behavior.

---

## Batches → Timetable

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| IN-IL-001 | Batch appears in timetable workspace | Batch created | Go to timetable workspace | Batch in dropdown |
| IN-IL-002 | Batch subjects available for scheduling | Batch with subjects | Select batch in workspace | Subjects available |
| IN-IL-003 | New batch immediately available | Workspace open | Create batch in new tab, refresh | Batch appears |
| IN-IL-004 | Deleted batch removed from timetable | Empty batch | Delete batch | Not in timetable |

---

## Teachers → Batches

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| IN-IL-005 | Teacher with expertise appears in batch wizard | Teacher exists | Create batch, step 3 | Teacher in subject dropdown |
| IN-IL-006 | Teacher without expertise hidden | Teacher with Physics only | Create batch with Chemistry | Teacher not shown for Chemistry |
| IN-IL-007 | New teacher immediately available | Batch wizard open | Add teacher in new tab | Teacher in dropdown after refresh |

---

## Teachers → Timetable

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| IN-IL-008 | Teacher appears in workspace | Teacher assigned to batch | Open workspace for batch | Teacher available for assignment |
| IN-IL-009 | Teacher load limits enforced | Load limits configured | Assign beyond limit | Warning shown |
| IN-IL-010 | Inactive teacher blocked | Teacher deactivated | Try to assign | Teacher not available |

---

## Students → Batches

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| IN-IL-011 | Batch appears in student enrollment | Batch exists | Add student | Batch in dropdown |
| IN-IL-012 | Student count updates | Student enrolled | View batch | Count incremented |
| IN-IL-013 | Deletion blocked with students | Batch has students | Try to delete batch | Blocked with warning |

---

## Timetable Setup → Workspace

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| IN-IL-014 | Periods appear in workspace | Periods configured | Open workspace | Period columns match |
| IN-IL-015 | Breaks shown correctly | Breaks configured | Open workspace | Break slots visible |
| IN-IL-016 | Holidays block slots | Holiday added | View holiday date | Slots blocked |
| IN-IL-017 | Exam blocks shown | Exam block added | View exam dates | Slots blocked with exam label |

---

## Timetable → Academic Schedule

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| IN-IL-018 | Periods per week calculated | Timetable published | Go to academic setup | Hours reflect periods |
| IN-IL-019 | Week calculation uses timetable | Timetable with 4 Physics periods | Generate plan | Weeks = hours/4 |
| IN-IL-020 | No timetable blocks planning | No timetable | Try to generate plan | Error: timetable required |

---

## Academic Setup → Planner

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| IN-IL-021 | Hours available for planning | Hours configured | Generate plan | Uses configured hours |
| IN-IL-022 | Reordered chapters in sequence | Chapters reordered | Generate plan | Sequence matches |
| IN-IL-023 | No setup blocks planning | No hour allocation | Try to generate plan | Error: setup required |

---

## Academic Planner → Batch Progress

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| IN-IL-024 | Published plan enables tracking | Plan published | View batch progress | Tracking active |
| IN-IL-025 | Draft plan not tracked | Plan in draft | View batch progress | Tracking inactive |
| IN-IL-026 | Plan changes update targets | Plan adjusted | View batch progress | New targets shown |

---

## Content Library → Batches

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| IN-IL-027 | Batch available for content assignment | Batch exists | Assign content | Batch in list |
| IN-IL-028 | Empty batch hidden from assignment | Batch with no students | Assign content | Batch shown (warning about empty) |

---

## Question Bank → Exams

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| IN-IL-029 | Questions available for exam | Questions created | Create exam | Questions selectable |
| IN-IL-030 | Global + Institute questions shown | Both exist | Add questions to exam | Both sources available |
| IN-IL-031 | Section type enforces question type | MCQ section | Add questions | Only MCQ selectable |

---

## Exams → Batches

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| IN-IL-032 | Batch available for exam assignment | Batch exists | Assign exam | Batch in list |
| IN-IL-033 | Assigned exam visible to batch | Exam assigned | Check batch | Exam listed |

---

## Substitution → Timetable

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| IN-IL-034 | Timetable slots shown in substitution | Timetable published | Mark absence | Affected slots listed |
| IN-IL-035 | Available teachers from timetable | Teachers have free periods | View substitutes | Free teachers shown |

---

## Roles → Staff Actions

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| IN-IL-036 | Permission restricts module access | Limited role | Login as staff | Restricted modules hidden |
| IN-IL-037 | Permission restricts actions | View-only role | Login, try to create | Create button hidden |

---

## Test Execution Order

1. Teachers → Batches (assignment dependencies)
2. Batches → Timetable (scheduling dependencies)
3. Timetable Setup → Workspace (configuration dependencies)
4. Timetable → Academic Schedule (planning dependencies)
5. Content/Questions → Exams (selection dependencies)

---

*Last Updated: January 2025*
