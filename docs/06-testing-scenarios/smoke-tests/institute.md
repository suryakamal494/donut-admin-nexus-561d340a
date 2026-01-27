# Institute Smoke Tests

> Page-level verification tests for the Institute Admin portal.

---

## Overview

These smoke tests verify that each Institute page loads correctly and core functionality works. Run these after deployments or major changes.

---

## Dashboard Smoke Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| IN-D-001 | Dashboard loads | Navigate to `/institute/dashboard` | Page loads | Critical |
| IN-D-002 | Checklist shows | View dashboard | Setup checklist visible | High |
| IN-D-003 | Checklist navigation | Click checklist item | Navigates correctly | High |
| IN-D-004 | Stats display | View stats section | Numbers displayed | Medium |
| IN-D-005 | Quick actions work | Click quick action | Dialog/navigation works | Medium |

---

## Batches Smoke Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| IN-B-001 | Batches page loads | Navigate to `/institute/batches` | Table loads | Critical |
| IN-B-002 | Create batch wizard | Click "Create Batch" | Wizard opens | Critical |
| IN-B-003 | Step 1 - Class | Select class, next | Proceeds | High |
| IN-B-004 | Step 2 - Details | Fill details, next | Proceeds | High |
| IN-B-005 | Step 3 - Teachers | Assign teachers, save | Batch created | Critical |
| IN-B-006 | View batch | Click batch row | Detail opens | High |
| IN-B-007 | Edit batch | Click edit | Edit dialog opens | Medium |
| IN-B-008 | Filter by class | Apply class filter | Table filters | Medium |

---

## Teachers Smoke Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| IN-T-001 | Teachers page loads | Navigate to `/institute/teachers` | Table loads | Critical |
| IN-T-002 | Add single teacher | Click "Add Teacher", fill form, save | Teacher created | Critical |
| IN-T-003 | Subject expertise | Select subjects in form | Saved correctly | High |
| IN-T-004 | Bulk upload paste | Paste data, review, import | Teachers created | High |
| IN-T-005 | Bulk upload CSV | Upload CSV, review, import | Teachers created | High |
| IN-T-006 | View profile | Click teacher row | Profile opens | High |
| IN-T-007 | Edit teacher | Click edit, modify, save | Changes saved | Medium |
| IN-T-008 | Toggle status | Toggle active/inactive | Status changes | Medium |

---

## Students Smoke Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| IN-S-001 | Students page loads | Navigate to `/institute/students` | Table loads | Critical |
| IN-S-002 | Add student form | Click "Add Student" | Accordion form opens | Critical |
| IN-S-003 | Required section | Fill 7 required fields | Validates correctly | Critical |
| IN-S-004 | Optional sections | Expand and fill optional | Saves correctly | Medium |
| IN-S-005 | Batch assignment | Select batch | Assigned correctly | High |
| IN-S-006 | Bulk upload | Paste/upload, review, import | Students created | High |
| IN-S-007 | Filter by batch | Apply batch filter | Table filters | Medium |
| IN-S-008 | View profile | Click student row | Profile opens | Medium |

---

## Master Data Smoke Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| IN-MD-001 | Master data loads | Navigate to `/institute/masterdata` | Page loads | Critical |
| IN-MD-002 | Track tabs work | Click different tracks | View changes | High |
| IN-MD-003 | Curriculum 3-panel | Select curriculum track | 3 panels show | High |
| IN-MD-004 | Course 2-panel | Select course track | 2 panels show | High |
| IN-MD-005 | Navigation works | Click class → subject → chapter | Drills down | High |
| IN-MD-006 | Read-only enforced | Try to edit | No edit actions | High |

---

## Timetable Setup Smoke Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| IN-TS-001 | Setup page loads | Navigate to `/institute/timetable/setup` | Page loads | Critical |
| IN-TS-002 | Tabs switch | Click each tab | Content changes | High |
| IN-TS-003 | Add period | Add new period slot | Period added | Critical |
| IN-TS-004 | Add break | Add break slot | Break added | High |
| IN-TS-005 | Set times | Configure start/end | Times saved | High |
| IN-TS-006 | Add holiday | Add holiday date | Holiday saved | High |
| IN-TS-007 | Teacher load | Configure max periods | Settings saved | Medium |
| IN-TS-008 | Exam block | Add exam block | Block saved | High |

---

## Timetable Workspace Smoke Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| IN-TW-001 | Workspace loads | Navigate to `/institute/timetable/workspace` | Grid loads | Critical |
| IN-TW-002 | View toggle | Switch Batch/Teacher view | View changes | High |
| IN-TW-003 | Week navigation | Navigate weeks | Week changes | High |
| IN-TW-004 | Click-assign | Click slot, select teacher | Assignment made | Critical |
| IN-TW-005 | Drag-drop | Drag teacher to slot | Assignment made | High |
| IN-TW-006 | Conflict shown | Create conflicting assignment | Warning appears | Critical |
| IN-TW-007 | Holiday blocked | Try to assign on holiday | Slot blocked | High |
| IN-TW-008 | Copy week | Use copy week feature | Schedule copied | Medium |

---

## Timetable Substitution Smoke Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| IN-SU-001 | Substitution loads | Navigate to `/institute/timetable/substitution` | Page loads | Critical |
| IN-SU-002 | Calendar works | Navigate months | Calendar updates | High |
| IN-SU-003 | Mark absence | Mark teacher absent | Absence recorded | Critical |
| IN-SU-004 | Affected slots show | View absence | Affected slots listed | High |
| IN-SU-005 | Assign substitute | Select available teacher | Assignment made | Critical |
| IN-SU-006 | Status updates | Complete all substitutions | Status changes to green | High |

---

## Academic Schedule Smoke Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| IN-AS-001 | Setup loads | Navigate to `/institute/academic-schedule/setup` | Page loads | Critical |
| IN-AS-002 | Batch selector | Select batch | Chapters load | High |
| IN-AS-003 | Subject tabs | Switch subjects | Chapters update | High |
| IN-AS-004 | Adjust hours | Use +/- buttons | Hours change | High |
| IN-AS-005 | Reorder chapters | Drag to reorder | Order changes | Medium |
| IN-AS-006 | Planner loads | Navigate to `/institute/academic-schedule/plans` | Hub loads | Critical |
| IN-AS-007 | Generate plan | Click generate | Plan created | Critical |
| IN-AS-008 | Adjust plan | Click chapter, adjust | Adjustment saved | High |
| IN-AS-009 | Publish plan | Click publish | Plan published | High |
| IN-AS-010 | Progress loads | Navigate to `/institute/academic-schedule` | Progress shows | High |

---

## Content Library Smoke Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| IN-CL-001 | Content loads | Navigate to `/institute/content` | Grid loads | Critical |
| IN-CL-002 | Source toggle | Switch Global/Institute | View changes | High |
| IN-CL-003 | Global read-only | View global content | No edit actions | High |
| IN-CL-004 | Create content | Create institute content | Content created | Critical |
| IN-CL-005 | Filters work | Apply filters | Grid filters | Medium |

---

## Question Bank Smoke Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| IN-QB-001 | Questions load | Navigate to `/institute/questions` | List loads | Critical |
| IN-QB-002 | Source toggle | Switch Global/Institute | View changes | High |
| IN-QB-003 | Global read-only | View global question | No edit actions | High |
| IN-QB-004 | Create question | Add institute question | Question created | Critical |
| IN-QB-005 | AI generate | Use AI generation | Questions created | High |

---

## Exams Smoke Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| IN-EX-001 | Exams page loads | Navigate to `/institute/exams-new` | Page loads | Critical |
| IN-EX-002 | Pattern selection | Select exam pattern | Pattern applied | Critical |
| IN-EX-003 | Quick test path | Choose quick test | Simple config opens | High |
| IN-EX-004 | Add questions | Select from bank | Questions added | Critical |
| IN-EX-005 | Section progress | View progress tracker | Progress updates | High |
| IN-EX-006 | Preview exam | Click preview | Preview works | High |

---

## Roles & Access Smoke Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| IN-RA-001 | Roles page loads | Navigate to `/institute/roles` | Page loads | Critical |
| IN-RA-002 | Create staff role | Create custom role | Role created | High |
| IN-RA-003 | Add staff member | Add staff with role | Member created | Critical |
| IN-RA-004 | Permissions work | Toggle permissions | Settings save | High |

---

## Mobile-Specific Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| IN-M-001 | Responsive layout | View on 375px width | Layout adapts | Critical |
| IN-M-002 | Timetable scroll | View timetable grid | Scrolls smoothly | High |
| IN-M-003 | Batch wizard | Complete wizard on mobile | Works correctly | High |
| IN-M-004 | Bulk upload | Paste data on mobile | Works correctly | High |
| IN-M-005 | Touch targets | Tap all buttons | 44px+ targets | High |

---

*Last Updated: January 2025*
