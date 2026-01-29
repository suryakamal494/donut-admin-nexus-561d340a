# SuperAdmin Smoke Tests

> Page-level verification tests for the SuperAdmin portal.

---

## Overview

These smoke tests verify that each SuperAdmin page loads correctly and core functionality works. Run these after deployments or major changes.

**Test Execution Notes:**
1. **Run order**: Dashboard → Master Data → Institutes → Users → Content → Questions → Exams → Roles
2. **Data setup**: Ensure at least one of each entity exists
3. **Cleanup**: Delete test data after verification
4. **Screenshots**: Capture failures for debugging

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

### Purpose

The Curriculum module manages standard academic board structures (CBSE, ICSE, State Boards). It defines the hierarchical content structure that flows to all institutes, teachers, and students.

**Understanding the Hierarchy:**
- **Independent Elements**: Curriculum, Class, and Subject can be created separately without dependencies
- **Dependent Elements**: Chapters require (Curriculum + Class + Subject), Topics require (+ Chapter)

**Creation Flows:**
1. Curriculum → independent creation
2. Class → independent creation (appears under selected curriculum)
3. Subject → independent creation (appears under selected class)
4. Chapter → requires Curriculum → Class → Subject selection first
5. Topic → requires Curriculum → Class → Subject → Chapter selection first

### Smoke Test Cases

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-MC-001 | Curriculum page loads | Navigate to `/superadmin/parameters` | Page loads with curriculum tabs and 3-panel layout (Class, Subject, Content) | Critical |
| SA-MC-002 | Curriculum tabs switch | Click each curriculum tab (CBSE, ICSE, etc.) | Panels update with correct data for selected curriculum | High |
| SA-MC-003 | Add curriculum (independent) | Click Quick Add → Add Curriculum, fill name, save | New curriculum tab appears | Critical |
| SA-MC-004 | Add class (independent) | In ClassPanel, click "+", enter class name, save | New class appears in ClassPanel list | Critical |
| SA-MC-005 | Add subject (independent) | Select any class, in SubjectPanel click "+", fill form, save | New subject appears in SubjectPanel | Critical |
| SA-MC-006 | Add single chapter | Select Curriculum → Class → Subject, click Quick Add → Add Chapter, enter 1 chapter name, save | Chapter appears in ContentPanel | Critical |
| SA-MC-007 | Add multiple chapters (bulk) | Select Curriculum → Class → Subject, click Quick Add → Add Chapter, paste multiple lines (one chapter per line), save | All chapters created and visible in ContentPanel | Critical |
| SA-MC-008 | Add single topic | Select Curriculum → Class → Subject → expand Chapter, click Quick Add → Add Topic, enter 1 topic name, save | Topic appears under the expanded chapter | High |
| SA-MC-009 | Add multiple topics (bulk) | Select Curriculum → Class → Subject → expand Chapter, click Quick Add → Add Topic, paste multiple lines (one topic per line), save | All topics created under the chapter | High |
| SA-MC-010 | Edit class/subject/chapter/topic | Click edit icon on any item | Edit dialog opens, changes save correctly | Medium |
| SA-MC-011 | ContentPanel scroll works | Expand multiple chapters with many topics | Scroll appears in ContentPanel, all content accessible | Medium |
| SA-MC-012 | Reorder items | Drag and drop chapter/topic | Order changes persist | Low |

---

## Master Data - Courses Smoke Tests

### Purpose

The Courses module manages specialized academic tracks (JEE, NEET, Olympiad, Foundation). Courses combine chapters from multiple curriculum sources (~80% mapped from curricula) with course-exclusive content (~20% course-only chapters/topics).

**Key Concepts:**
- Courses don't follow Class hierarchy like Curriculums
- Courses PULL chapters from existing Curricula (read-only references)
- Course-only chapters/topics are exclusive and independent of Curricula

### Courses Page Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-CO-001 | Courses page loads | Navigate to `/superadmin/parameters/courses` | Page loads with 3-panel layout: Courses list, Subjects, Content | Critical |
| SA-CO-002 | Course selection | Click on a course (e.g., JEE Mains) | Subjects panel populates with subjects for that course | High |
| SA-CO-003 | Subject selection | Click on a subject | Content panel shows chapters with expandable topics | High |
| SA-CO-004 | Topic expansion | Click expand arrow on a chapter | Topics display under the chapter | Medium |
| SA-CO-005 | Navigate to Course Builder | Click "Course Builder" button | Redirects to `/superadmin/parameters/course-builder` | Critical |
| SA-CO-006 | Navigate to Manage Courses | Click "Manage Courses" button | Management dialog/page opens | Medium |

### Course Builder Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-CB-001 | Course Builder loads | Navigate to `/superadmin/parameters/course-builder` | Page loads with course selector dropdown and split panel layout | Critical |
| SA-CB-002 | Create new course popup | Click "Create New Course" button | Popup opens with fields: Course Name, Course Type, Allowed Curriculums (checkboxes), Allowed Classes (checkboxes) | Critical |
| SA-CB-003 | Fill and create course | Enter name, select type, check curriculums and classes, click Create | Course created, appears in course dropdown selector | Critical |
| SA-CB-004 | Select course for mapping | Select an existing course from dropdown | Split view appears: Curriculum tree (left panel) + Course content (right panel) | High |
| SA-CB-005 | Filtered subjects verification | In left panel, select Curriculum → Class | Only subjects allowed for this course are displayed | High |
| SA-CB-006 | Add chapters from curriculum | Select Curriculum → Class → Subject, check desired chapters, click "Add Selected" | Selected chapters appear in right panel under course content | Critical |
| SA-CB-007 | Create course-only chapter | Click "Create Course-Only Chapter" button at bottom | Dialog opens: select Subject, enter Chapter name, save | Critical |
| SA-CB-008 | Verify course-only chapter | After creating course-only chapter | Chapter appears in course content with "Course Exclusive" label | High |
| SA-CB-009 | Create course-only topic | Click "Create Course-Only Topic" button at bottom | Dialog opens: select Subject → Chapter (course-owned), enter Topic name, save | Critical |
| SA-CB-010 | Verify course-only topic | After creating course-only topic | Topic appears under specified chapter in course content | High |

---

## Institutes Smoke Tests

### Purpose

The Institutes module manages all educational institutions on the platform. SuperAdmin can create institutes, assign curricula/courses, configure tiers, and monitor institute health.

**Key Concepts:**
- Institutes are assigned Curricula AND/OR Courses
- Tier-based feature access (Basic, Standard, Premium)
- 4-step wizard for institute creation
- Custom courses can be created specifically for an institute

### All Institutes Page Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-IN-001 | Institutes page loads | Navigate to `/superadmin/institutes` | Page loads with institute table and filters | Critical |
| SA-IN-002 | Search works | Type in search box | Table filters by institute name or code | High |
| SA-IN-003 | Plan filter works | Select plan from filter dropdown | Table shows only institutes with selected plan | High |
| SA-IN-004 | Status filter works | Select status from filter dropdown | Table shows only institutes with selected status | High |
| SA-IN-005 | View Details action | Click Actions menu → View Details on any institute | Navigates to institute detail page showing all info | High |
| SA-IN-006 | Edit action | Click Actions menu → Edit on any institute | Edit page/dialog opens with editable form | High |
| SA-IN-007 | Assign Curriculum/Courses action | Click Actions menu → Assign Curriculum/Courses | Dialog opens with curriculum and course checkboxes for multi-select | Critical |
| SA-IN-008 | Modify curriculum assignment | In Assign dialog, add/remove curriculums and courses, save | Changes saved, reflected in institute record | High |
| SA-IN-009 | Create Custom Course in Assign dialog | In Assign dialog, click "Create Custom Course for this Institute" | Navigates to custom course builder specific to this institute | High |
| SA-IN-010 | Billing action | Click Actions menu → Billing | Billing management opens (or appropriate message if not implemented) | Medium |

### Add Institute Wizard Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-IN-011 | Add Institute button | Click "Add Institute" button | 4-step wizard opens with Step 1 (Institute Details) active | Critical |
| SA-IN-012 | Step 1: Institute Details | Fill all fields (name, code, type, address, contact info), click Next | Form validates successfully, proceeds to Step 2 | Critical |
| SA-IN-013 | Step 2: Admin Setup | Fill admin name, email, mobile number, set password, click Next | Form validates, proceeds to Step 3 | Critical |
| SA-IN-014 | Step 2: Mobile number validation | Enter mobile number in admin setup | Mobile number field accepts and validates correctly | High |
| SA-IN-015 | Step 2: Password field | Set password in admin setup | Password field works with visibility toggle | Medium |
| SA-IN-016 | Step 3: Plan Selection | View plan cards displayed | All plans from tier management are visible as cards | Critical |
| SA-IN-017 | Step 3: Plan Preview | Click preview button/icon on any plan card | Plan details popup appears showing all plan features | Medium |
| SA-IN-018 | Step 3: Select Plan | Click to select a plan, click Next | Plan selected (highlighted), proceeds to Step 4 | Critical |
| SA-IN-019 | Step 4: Multi-select Curriculums | Check multiple curriculum checkboxes | All selected curriculums appear in selection summary | High |
| SA-IN-020 | Step 4: Multi-select Courses | Check multiple course checkboxes | All selected courses appear in selection summary | High |
| SA-IN-021 | Step 4: Create Custom Course | Click "Create Custom Course for this Institute" | Navigates to custom course builder | Medium |
| SA-IN-022 | Step 4: Skip & Create | Click "Skip & Create" button | Institute created without curriculum/course assignment, redirects to institutes list | High |
| SA-IN-023 | Step 4: Create Institute | Select curriculums/courses, click "Create Institute" | Institute created with all selections, redirects to institutes list or dashboard | Critical |

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

*Last Updated: January 2025*
