# Timetable Cross-Portal Tests

> Tests for timetable propagation from Institute to Teacher and Student portals.

---

## Overview

These tests verify that timetables created by Institute correctly propagate to Teacher and Student schedules, including substitutions and holidays.

---

## Institute → Teacher Schedule Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| TT-001 | Teacher sees assigned classes | Create timetable, assign teacher | Classes appear in teacher schedule |
| TT-002 | Only assigned classes shown | Teacher assigned to 10A not 10B | Only 10A classes visible |
| TT-003 | Subject matches assignment | Teacher assigned Physics | Schedule shows Physics |
| TT-004 | Multiple batches shown | Teacher in 10A and 10B | Both batches' classes visible |
| TT-005 | Week view correct | View week schedule | All days/periods accurate |

---

## Institute → Student Schedule Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| TT-006 | Student sees batch schedule | Timetable published, student enrolled | Schedule on dashboard |
| TT-007 | Today's classes accurate | View dashboard | Today's classes match timetable |
| TT-008 | Teacher names shown | View class details | Teacher name displayed |
| TT-009 | Subject shown | View class details | Subject displayed |

---

## Timetable Changes Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| TT-010 | Updated schedule propagates | Institute modifies slot | Teacher/Student see new schedule |
| TT-011 | Added slot appears | Add new class to schedule | Downstream sees new class |
| TT-012 | Removed slot disappears | Remove class from schedule | Downstream no longer sees class |
| TT-013 | Teacher change reflects | Change teacher for slot | New teacher sees class, old doesn't |

---

## Holiday Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| TT-014 | Holiday blocks institute | Add holiday | Slots blocked in workspace |
| TT-015 | Holiday shows to teacher | Holiday configured | Teacher sees holiday in schedule |
| TT-016 | Holiday shows to student | Holiday configured | Student sees holiday in schedule |
| TT-017 | No classes on holiday | Holiday date | Dashboard shows no classes |

---

## Exam Block Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| TT-018 | Exam blocks in workspace | Add exam block | Slots blocked with exam label |
| TT-019 | Exam period to teacher | Exam block configured | Teacher sees exam indicator |
| TT-020 | Exam period to student | Exam block configured | Student sees exam period |

---

## Substitution Flow Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| TT-021 | Absence marked | Mark teacher absent | Absence recorded |
| TT-022 | Affected slots identified | View absence | Correct slots listed |
| TT-023 | Substitute assigned | Assign substitute | Substitution recorded |
| TT-024 | Teacher sees substitution duty | Assigned as substitute | Substitution appears in schedule |
| TT-025 | Original teacher sees absence | Marked absent | Own classes marked |
| TT-026 | Student sees substitute | Substitution assigned | Student sees substitute name |
| TT-027 | Notification to substitute | Assigned | Notification received |
| TT-028 | Notification to absent teacher | Substitute assigned | Notification received |

---

## Timetable → Lesson Plans Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| TT-029 | Scheduled slots enable plans | Timetable published | Teacher can create plans for slots |
| TT-030 | Plan context from slot | Click "Add Plan" on slot | Pre-filled with slot info |
| TT-031 | Removed slot orphans plan | Remove slot with plan | Plan shows warning |

---

## Timetable → Academic Progress Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| TT-032 | Scheduled classes for confirmation | Timetable published | Teacher sees confirmable classes |
| TT-033 | Past classes confirmable | Classes in past | Confirmation available |
| TT-034 | Confirmation updates progress | Confirm teaching | Syllabus progress updates |

---

## Timetable → Academic Planner Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| TT-035 | Periods per week calculated | Timetable configured | Planner uses correct periods |
| TT-036 | Week calculation accurate | Generate plan | Weeks = hours / periods |
| TT-037 | Holiday weeks excluded | Holidays configured | Planning skips holidays |

---

## Conflict Detection Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| TT-038 | Teacher clash detected | Assign same teacher to 2 batches same slot | Clash warning shown |
| TT-039 | Overload warning | Exceed teacher load limit | Overload warning shown |
| TT-040 | Conflict visible in report | Conflicts exist | Conflict panel shows issues |

---

## Copy Week Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| TT-041 | Copy week works | Use copy week feature | Next week populated |
| TT-042 | Skip holidays | Copy over holiday | Holiday slots skipped |
| TT-043 | Skip exam blocks | Copy over exam dates | Exam slots skipped |

---

## Publish/Unpublish Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| TT-044 | Unpublished not visible | Don't publish timetable | Teacher/Student don't see |
| TT-045 | Published visible | Publish timetable | Downstream sees schedule |
| TT-046 | Republish updates | Edit and republish | Updates propagate |

---

*Last Updated: March 2025*
