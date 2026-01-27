# Student Intra-Login Tests

> Module dependency tests within the Student portal.

---

## Overview

These tests verify that modules within the Student portal work correctly together. They test internal dependencies where one module's output affects another module's behavior.

---

## Dashboard → Schedule

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| ST-IL-001 | Today's classes shown | Timetable published | View dashboard | Classes listed |
| ST-IL-002 | Current class highlighted | During class time | View dashboard | Current class indicated |
| ST-IL-003 | Empty schedule message | No timetable | View dashboard | "No classes" message |

---

## Dashboard → Homework

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| ST-IL-004 | Pending homework shown | Homework assigned | View dashboard | Homework listed |
| ST-IL-005 | Due date displayed | Homework with deadline | View dashboard | Due date visible |
| ST-IL-006 | Overdue highlighted | Past deadline | View dashboard | Overdue badge |

---

## Subjects → Batch Curriculum

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| ST-IL-007 | Subjects from batch | Enrolled in batch | View subjects | Batch subjects shown |
| ST-IL-008 | Subject progress shown | Progress exists | View subjects | Progress bar visible |
| ST-IL-009 | Empty batch no subjects | Enrolled but no curriculum | View subjects | "No subjects" message |

---

## Subjects → Chapter View

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| ST-IL-010 | Tap subject opens chapters | Subject exists | Tap subject card | Chapter list opens |
| ST-IL-011 | Chapter count accurate | Chapters exist | View subject | Count matches |
| ST-IL-012 | Chapter progress shown | Some progress | View chapters | Progress indicators |

---

## Chapter View → Three Modes

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| ST-IL-013 | Classroom mode available | Lesson content exists | View chapter | Classroom tab active |
| ST-IL-014 | My Path mode available | AI recommendations | View chapter | My Path tab active |
| ST-IL-015 | Compete mode available | Challenges exist | View chapter | Compete tab active |
| ST-IL-016 | Mode switching works | All modes available | Switch modes | Content updates |

---

## Classroom Mode → Lesson Bundles

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| ST-IL-017 | Bundles from lesson plans | Teacher created plans | View Classroom | Bundles listed |
| ST-IL-018 | Bundle content sequential | Bundle with content | Open bundle | Content in order |
| ST-IL-019 | Progress tracked per bundle | Some content viewed | View Classroom | Progress shown |

---

## My Path → AI Recommendations

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| ST-IL-020 | AI items based on performance | Test results exist | View My Path | Recommendations shown |
| ST-IL-021 | Priority indicators | Various priorities | View My Path | High/Medium/Low badges |
| ST-IL-022 | Completing item updates | Complete AI item | Refresh My Path | Item removed/updated |

---

## Content Viewer → Content Types

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| ST-IL-023 | Video plays | Video content | Open content | Video player works |
| ST-IL-024 | PDF displays | PDF content | Open content | PDF viewer works |
| ST-IL-025 | Completion tracked | View content | Complete viewing | Progress updates |

---

## Tests → Test Player

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| ST-IL-026 | Test opens player | Test assigned | Tap test | Player opens |
| ST-IL-027 | Questions load | Test with questions | Start test | Questions display |
| ST-IL-028 | Timer works | Timed test | Start test | Timer counts down |
| ST-IL-029 | Submit saves answers | Answers selected | Submit | Answers recorded |

---

## Test Player → Results

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| ST-IL-030 | Results after submit | Test completed | Submit | Results page opens |
| ST-IL-031 | Score displayed | Test graded | View results | Score shown |
| ST-IL-032 | Analysis available | Test completed | View results | Question analysis shown |

---

## Homework → Submission

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| ST-IL-033 | Submission form opens | Homework pending | Tap homework | Submission sheet opens |
| ST-IL-034 | File upload works | Practice homework | Upload file | File attached |
| ST-IL-035 | Test homework opens player | Test-type homework | Tap homework | Test player opens |
| ST-IL-036 | Submission status updates | Submit homework | View homework | Status changed |

---

## Progress → All Modules

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| ST-IL-037 | Subject progress aggregated | Activity exists | View progress | Per-subject stats |
| ST-IL-038 | Test scores included | Tests completed | View progress | Test scores shown |
| ST-IL-039 | Content completion tracked | Content viewed | View progress | Completion % shown |
| ST-IL-040 | Time spent tracked | Activity logged | View progress | Time displayed |

---

## Notifications → Actions

| Test ID | Test Case | Precondition | Steps | Expected Result |
|---------|-----------|--------------|-------|-----------------|
| ST-IL-041 | New homework notification | Homework assigned | Check notifications | Notification present |
| ST-IL-042 | Test reminder | Test upcoming | Check notifications | Reminder present |
| ST-IL-043 | Notification links work | Notification exists | Tap notification | Navigates correctly |

---

## Test Execution Order

1. Dashboard → Schedule/Homework (display dependencies)
2. Subjects → Chapter View (navigation dependencies)
3. Chapter View → Modes (content dependencies)
4. Tests → Player → Results (flow dependencies)
5. Progress → All (aggregation dependencies)

---

*Last Updated: January 2025*
