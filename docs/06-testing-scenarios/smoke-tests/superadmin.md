# SuperAdmin Smoke Tests

> Page-level verification tests for the SuperAdmin portal.

---

## Overview

These smoke tests verify that each SuperAdmin page loads correctly and core functionality works. Run these after deployments or major changes.

---

## Dashboard Smoke Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-D-001 | Dashboard loads | Navigate to `/superadmin/dashboard` | Page loads with stats | Critical |
| SA-D-002 | Stats display | View dashboard | All 5 stat cards show numbers | High |
| SA-D-003 | Quick actions work | Click each quick action | Navigates to correct page | Medium |
| SA-D-004 | Recent activity shows | View dashboard | Activity list populated | Low |

---

## Master Data - Curriculum Smoke Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-MC-001 | Curriculum page loads | Navigate to `/superadmin/curriculum` | Page loads with tabs | Critical |
| SA-MC-002 | Curriculum tabs switch | Click each curriculum tab | Panel updates | High |
| SA-MC-003 | Add curriculum | Click "Add Curriculum", fill form, save | Curriculum created | Critical |
| SA-MC-004 | Add class | Select curriculum, click "+", add class | Class appears | High |
| SA-MC-005 | Add subject | Select class, click "+", add subject | Subject appears | High |
| SA-MC-006 | Add chapter | Select subject, click "+", add chapter | Chapter appears | High |
| SA-MC-007 | Add topic | Expand chapter, click "+", add topic | Topic appears | Medium |
| SA-MC-008 | Edit item | Click edit icon on any item | Edit dialog opens | Medium |
| SA-MC-009 | Delete item | Click delete on unused item | Item removed | Medium |
| SA-MC-010 | Reorder items | Drag and drop chapter/topic | Order changes | Low |

---

## Master Data - Courses Smoke Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-CO-001 | Courses page loads | Navigate to `/superadmin/courses` | Page loads with grid | Critical |
| SA-CO-002 | Create course wizard | Click "Create Course" | Wizard opens | Critical |
| SA-CO-003 | Step 1 - Details | Fill course details, next | Proceeds to step 2 | High |
| SA-CO-004 | Step 2 - Subjects | Select subjects, next | Proceeds to step 3 | High |
| SA-CO-005 | Step 3 - Chapters | Map chapters, next | Proceeds to step 4 | High |
| SA-CO-006 | Step 4 - Review | Review and create | Course created | Critical |
| SA-CO-007 | Edit course | Click edit on course card | Wizard opens with data | Medium |
| SA-CO-008 | Delete course | Click delete on unused course | Course removed | Medium |

---

## Institutes Smoke Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-IN-001 | Institutes page loads | Navigate to `/superadmin/institutes` | Table loads | Critical |
| SA-IN-002 | Search works | Type in search box | Table filters | High |
| SA-IN-003 | Filters work | Apply status/tier filters | Table filters | High |
| SA-IN-004 | Add institute | Click "Add", fill form, save | Institute created | Critical |
| SA-IN-005 | Assign curriculum | Select curricula in form | Assignment saved | Critical |
| SA-IN-006 | Change status | Toggle active/inactive | Status changes | High |
| SA-IN-007 | Change tier | Click tier button, select | Tier changes | High |
| SA-IN-008 | Edit institute | Click edit, modify, save | Changes saved | Medium |
| SA-IN-009 | Delete institute | Click delete on empty institute | Institute removed | Low |

---

## Users Smoke Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-US-001 | Users page loads | Navigate to `/superadmin/users` | Table loads | Critical |
| SA-US-002 | Add user | Click "Add User", fill form, save | User created | Critical |
| SA-US-003 | Assign role | Select role in form | Role assigned | High |
| SA-US-004 | Change status | Toggle active/inactive | Status changes | High |
| SA-US-005 | Reset password | Click reset in menu | Reset initiated | Medium |
| SA-US-006 | Edit user | Click edit, modify, save | Changes saved | Medium |
| SA-US-007 | Delete user | Click delete (not self) | User removed | Low |

---

## Content Library Smoke Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-CL-001 | Content page loads | Navigate to `/superadmin/content` | Grid loads | Critical |
| SA-CL-002 | Filters work | Apply type/class/subject filters | Grid filters | High |
| SA-CL-003 | Create content | Click "Create", fill form, upload | Content created | Critical |
| SA-CL-004 | AI generate | Click "AI Generate", configure, generate | Content created | High |
| SA-CL-005 | Preview content | Click view on card | Preview opens | High |
| SA-CL-006 | Edit content | Click edit, modify, save | Changes saved | Medium |
| SA-CL-007 | Delete content | Click delete on unassigned | Content removed | Medium |
| SA-CL-008 | Pagination works | Click load more | More items load | Low |

---

## Question Bank Smoke Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-QB-001 | Questions page loads | Navigate to `/superadmin/questions` | List loads | Critical |
| SA-QB-002 | Filters work | Apply type/difficulty filters | List filters | High |
| SA-QB-003 | Add manual question | Click "Add", fill form, save | Question created | Critical |
| SA-QB-004 | AI generate | Click "AI Generate", configure, review, accept | Questions created | High |
| SA-QB-005 | PDF upload | Upload PDF, review extraction, accept | Questions created | High |
| SA-QB-006 | Preview question | Click on question card | Preview opens | High |
| SA-QB-007 | LaTeX renders | Create question with formula | Formula displays | High |
| SA-QB-008 | Edit question | Click edit, modify, save | Changes saved | Medium |
| SA-QB-009 | Delete question | Click delete on unused | Question removed | Medium |
| SA-QB-010 | Virtual scroll works | Scroll through 100+ questions | Smooth scrolling | Low |

---

## Exams Smoke Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-EX-001 | Exams page loads | Navigate to `/superadmin/exams` | Table loads | Critical |
| SA-EX-002 | Tabs switch | Click PYP/Grand Test tabs | Table filters | High |
| SA-EX-003 | Create PYP | Click create, select PYP, configure | Exam created | Critical |
| SA-EX-004 | Create Grand Test | Click create, select GT, configure | Exam created | Critical |
| SA-EX-005 | Add questions | In wizard, select from bank | Questions added | High |
| SA-EX-006 | Preview exam | Click preview on exam | Preview opens | High |
| SA-EX-007 | Publish exam | Click publish | Status changes | High |
| SA-EX-008 | Assign institutes | Select institutes in wizard | Assignment saved | High |
| SA-EX-009 | Archive exam | Click archive | Exam archived | Medium |

---

## Roles & Access Smoke Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-RA-001 | Roles page loads | Navigate to `/superadmin/roles` | Tabs load | Critical |
| SA-RA-002 | Roles tab works | Click Roles tab | Role list shows | High |
| SA-RA-003 | Members tab works | Click Members tab | Member list shows | High |
| SA-RA-004 | Create role | Click "Create Role", configure, save | Role created | Critical |
| SA-RA-005 | Permission toggles | Toggle permissions in builder | Toggles work | High |
| SA-RA-006 | Scope config | Configure scope settings | Settings save | Medium |
| SA-RA-007 | Assign member | Add member, select role | Assignment works | High |
| SA-RA-008 | Edit role | Click edit, modify, save | Changes saved | Medium |
| SA-RA-009 | Delete role | Click delete (after reassign) | Role removed | Low |

---

## Mobile-Specific Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-M-001 | Responsive layout | View on 375px width | Layout adapts | Critical |
| SA-M-002 | Tables scroll | View tables on mobile | Horizontal scroll works | High |
| SA-M-003 | Dialogs work | Open any dialog on mobile | Full-screen drawer | High |
| SA-M-004 | Touch targets | Tap buttons/links | 44px+ targets | High |
| SA-M-005 | Filters collapse | View filter bar on mobile | Pills scroll | Medium |

---

## Test Execution Notes

1. **Run order**: Dashboard → Master Data → Institutes → Users → Content → Questions → Exams → Roles
2. **Data setup**: Ensure at least one of each entity exists
3. **Cleanup**: Delete test data after verification
4. **Screenshots**: Capture failures for debugging

---

*Last Updated: January 2025*
