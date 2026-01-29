
# Comprehensive Documentation Update Plan

## Overview

This plan addresses all the issues you've raised regarding the smoke tests and feature documentation for the Super Admin portal. The updates will ensure accuracy, clarity, and alignment between the actual UI implementation and the documentation.

---

## Issue Analysis & Solutions

### ISSUE 1: Master Data - Curriculum Smoke Tests Corrections

**Current Problem:**
- Smoke tests incorrectly show Class, Subject, Curriculum creation as dependent flows
- Chapter and Topic creation steps are incorrectly documented
- Delete item test case should be removed
- Single vs Multiple addition testing not specified

**What You Requested:**
1. Curriculum, Class, and Subject are INDEPENDENT (can be created independently)
2. Chapter creation requires: Curriculum → Class → Subject → then Add Chapter
3. Topic creation requires: Curriculum → Class → Subject → Chapter → then Add Topic
4. Test both single and multiple chapter/topic additions
5. Remove "Delete item" test case

**Solution:**
Update `docs/06-testing-scenarios/smoke-tests/superadmin.md`:

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-MC-001 | Curriculum page loads | Navigate to `/superadmin/curriculum` | Page loads with curriculum tabs and 3-panel layout | Critical |
| SA-MC-002 | Curriculum tabs switch | Click each curriculum tab (CBSE, ICSE, etc.) | Panels update with correct data | High |
| SA-MC-003 | Add curriculum (independent) | Click Quick Add → Add Curriculum, fill form, save | New curriculum tab appears | Critical |
| SA-MC-004 | Add class (independent) | Click "+" in ClassPanel, enter name, save | New class appears in list | Critical |
| SA-MC-005 | Add subject (independent) | Select any class, click "+" in SubjectPanel, fill form, save | New subject appears | Critical |
| SA-MC-006 | Add single chapter | Select Curriculum → Class → Subject, click Quick Add → Add Chapter, enter 1 chapter, save | Chapter appears in ContentPanel | Critical |
| SA-MC-007 | Add multiple chapters (bulk) | Select Curriculum → Class → Subject, click Quick Add → Add Chapter, paste multiple lines, save | All chapters created | Critical |
| SA-MC-008 | Add single topic | Select Curriculum → Class → Subject → Chapter, click Quick Add → Add Topic, enter 1 topic, save | Topic appears under chapter | High |
| SA-MC-009 | Add multiple topics (bulk) | Select Curriculum → Class → Subject → Chapter, click Quick Add → Add Topic, paste multiple lines, save | All topics created under chapter | High |
| SA-MC-010 | Edit item | Click edit icon on any class/subject/chapter/topic | Edit dialog opens, changes save | Medium |
| SA-MC-011 | Reorder items | Drag and drop chapter/topic | Order changes persist | Low |

---

### ISSUE 2: Master Data - Courses Smoke Tests Corrections

**Current Problem:**
- Incorrect page load description (says "grid" but it's a 3-panel view)
- Incorrect course creation flow (no Step 1-4 wizard)
- Missing Course Builder navigation test
- Missing course-only chapter/topic creation tests

**What You Requested:**
1. Courses page shows: Courses panel → Subjects panel → Chapters panel (with topics)
2. Course Builder is accessed via a button (not on main Courses page)
3. Create Course is a popup with: name, type, allowed curriculums, allowed classes
4. After course creation: split view with curriculum tree (left) and course content (right)
5. Test course-only chapter and topic creation buttons

**Solution - Courses Page Tests:**

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-CO-001 | Courses page loads | Navigate to `/superadmin/parameters/courses` | Page loads with 3-panel layout: Courses, Subjects, Content | Critical |
| SA-CO-002 | Course selection | Click on a course (e.g., JEE Mains) | Subjects panel populates with course subjects | High |
| SA-CO-003 | Subject selection | Click on a subject | Content panel shows chapters with topics | High |
| SA-CO-004 | Topic expansion | Expand a chapter in content panel | Topics display under chapter | Medium |
| SA-CO-005 | Navigate to Course Builder | Click "Course Builder" button | Redirects to `/superadmin/parameters/course-builder` | Critical |
| SA-CO-006 | Navigate to Manage Courses | Click "Manage Courses" button | Management dialog opens | Medium |

**Solution - Course Builder Tests:**

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-CB-001 | Course Builder loads | Navigate to `/superadmin/parameters/course-builder` | Page loads with course selector and split panels | Critical |
| SA-CB-002 | Create new course | Click "Create New Course" button | Popup opens with: Name, Type, Allowed Curriculums, Allowed Classes | Critical |
| SA-CB-003 | Fill course details | Enter name, select type, check curriculums/classes, click Create | Course created, appears in course selector | Critical |
| SA-CB-004 | Select course for editing | Select a course from dropdown | Split view appears: Curriculum tree (left) + Course content (right) | High |
| SA-CB-005 | Verify filtered subjects | Select curriculum and class in left panel | Only course-allowed subjects are displayed | High |
| SA-CB-006 | Add chapters from curriculum | Select curriculum → class → subject, check chapters, click "Add Selected" | Chapters appear in right panel under course | Critical |
| SA-CB-007 | Create course-only chapter | Click "Create Course-Only Chapter" button | Dialog opens, can add chapter exclusive to course | Critical |
| SA-CB-008 | Create course-only topic | Click "Create Course-Only Topic" button | Dialog opens, select subject → chapter, add topics | Critical |
| SA-CB-009 | Verify course-only items | After creating course-only chapter/topic | Items appear in course content with "Course Exclusive" label | High |
| SA-CB-010 | Save and publish | Click "Save Draft" then "Publish" | Course saved with all mapped chapters | High |

---

### ISSUE 3: Institutes Smoke Tests Corrections

**Current Problem:**
- Missing search and filter tests
- Missing individual action button tests (View, Edit, Assign, Billing)
- Add Institute wizard steps not properly documented
- Missing "Create Custom Course" test
- Missing "Skip & Create" option test

**What You Requested:**
1. Test search and filters on All Institutes page
2. Test each action: View Details, Edit, Assign Curriculum/Courses, Billing
3. Add Institute has 4 steps: Institute Details, Admin Setup, Plan Selection, Curriculum & Courses
4. Test plan preview option
5. Test Skip & Create option
6. Test Create Custom Course button in Assign Curriculum/Courses dialog

**Solution:**

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-IN-001 | Institutes page loads | Navigate to `/superadmin/institutes` | Page loads with institute table | Critical |
| SA-IN-002 | Search works | Type in search box | Table filters by name/code | High |
| SA-IN-003 | Plan filter works | Select plan from dropdown | Table shows only matching plans | High |
| SA-IN-004 | Status filter works | Select status from dropdown | Table shows only matching status | High |
| SA-IN-005 | View Details action | Click Actions → View Details | Navigates to institute detail page | High |
| SA-IN-006 | Edit action | Click Actions → Edit | Navigates to edit page with form | High |
| SA-IN-007 | Assign Curriculum/Courses action | Click Actions → Assign Curriculum/Courses | Dialog opens with curriculum and course checkboxes | Critical |
| SA-IN-008 | Create Custom Course in Assign dialog | In Assign dialog, click "Create Custom Course for this Institute" | Navigates to custom course builder | High |
| SA-IN-009 | Billing action | Click Actions → Billing | Billing management opens (or toast if not implemented) | Medium |

**Add Institute Wizard Tests:**

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-IN-010 | Add Institute - Page loads | Click "Add Institute" button | 4-step wizard opens with Step 1 active | Critical |
| SA-IN-011 | Step 1: Institute Details | Fill name, code, address, contact fields, click Next | Form validates, proceeds to Step 2 | Critical |
| SA-IN-012 | Step 2: Admin Setup | Fill admin name, email, mobile, password, click Next | Form validates, proceeds to Step 3 | Critical |
| SA-IN-013 | Step 3: Plan Selection | View plan cards, select a plan, click Next | Plan selected, proceeds to Step 4 | Critical |
| SA-IN-014 | Step 3: Plan Preview | (If available) Click preview on plan card | Plan details popup appears | Medium |
| SA-IN-015 | Step 4: Assign Curriculums (multi-select) | Check multiple curriculums and courses | Selections appear in summary | High |
| SA-IN-016 | Step 4: Create Custom Course | Click "Create Custom Course for this Institute" | Navigates to custom course page | Medium |
| SA-IN-017 | Step 4: Skip & Create | Click "Skip & Create" button | Institute created without curriculum assignment | High |
| SA-IN-018 | Step 4: Create Institute | Select curriculums/courses, click "Create Institute" | Institute created, redirects to institutes list | Critical |

---

### ISSUE 4: Add Descriptive Overview Sections

**What You Requested:**
Add clear descriptions explaining:
1. What is a Curriculum and how is it created
2. What is a Course and how is it created
3. The relationship between Curriculums and Courses
4. Purpose of each module

**Solution - Add to `docs/01-superadmin/master-data-curriculum.md`:**

Add new section after Overview:

```markdown
## How Curriculums Are Created

A Curriculum represents a standard academic board structure (e.g., CBSE, ICSE, State Board). Here's the creation hierarchy:

**Independent Elements (can be created separately):**
- **Curriculum**: The board/framework (CBSE, ICSE)
- **Class**: Grade levels (Class 1-12)
- **Subject**: Academic subjects (Physics, Chemistry, Mathematics)

**Dependent Elements (require parent selection):**
- **Chapter**: Requires Curriculum + Class + Subject selected first
- **Topic**: Requires Curriculum + Class + Subject + Chapter selected first

**Creation Flow:**
1. Create Curriculum (e.g., CBSE) - independent
2. Create Classes (e.g., Class 11, Class 12) - independent
3. Create Subjects (e.g., Physics, Chemistry) - independent
4. Select Curriculum → Class → Subject, then Add Chapters
5. Select Curriculum → Class → Subject → Chapter, then Add Topics

**Bulk Entry Support:**
- Chapters and Topics support bulk paste (one per line)
- Useful for quickly populating curriculum structure
```

**Solution - Add to `docs/01-superadmin/master-data-courses.md`:**

Update the Overview section:

```markdown
## How Courses Are Created

Courses are specialized academic tracks (JEE, NEET, Olympiad) that combine content from multiple curriculum sources. Unlike Curriculums, Courses don't follow the standard Class hierarchy.

**Key Concept:**
- ~80% of course chapters come from existing Curriculums (mapped chapters)
- ~20% of course chapters are exclusive to the course (course-only chapters)

**Course Creation Flow (via Course Builder):**

1. **Create New Course**: Enter name, type (competitive/foundation), select allowed curriculums and classes
2. **Map Chapters from Curricula**: From the left panel, select:
   - Curriculum (e.g., CBSE)
   - Class (e.g., Class 11)
   - Subject (e.g., Physics)
   - Check desired chapters → Add to course
3. **Create Course-Only Content**: Use buttons to add:
   - Course-Only Chapters (exclusive to this course)
   - Course-Only Topics (under course-only chapters)
4. **Publish**: Save and publish the course

**Relationship Between Curricula and Courses:**
- Courses PULL chapters from Curricula (read-only reference)
- Changes in Curriculum chapters propagate to Courses
- Course-only chapters are independent of Curricula
- Institutes can be assigned both Curricula AND Courses
```

---

### ISSUE 5: Update Feature Documentation to Match UI

**Files to Review and Update:**

1. **`docs/01-superadmin/master-data-curriculum.md`**
   - Update "Manage Chapters" section to show correct flow
   - Update "Manage Topics" section to show correct flow
   - Add "Bulk Entry" section

2. **`docs/01-superadmin/master-data-courses.md`**
   - Update course creation from "wizard" to "popup"
   - Remove Step 1-4 references
   - Add Course Builder workflow
   - Add course-only chapter/topic creation

3. **`docs/01-superadmin/institutes.md`**
   - Update "Create Institute Flow" with accurate 4-step wizard
   - Add action button descriptions
   - Add "Create Custom Course" functionality

---

## File Modification Summary

| File | Type of Change |
|------|----------------|
| `docs/06-testing-scenarios/smoke-tests/superadmin.md` | Major rewrite of Master Data and Institutes sections |
| `docs/01-superadmin/master-data-curriculum.md` | Add overview section, update chapter/topic creation flow |
| `docs/01-superadmin/master-data-courses.md` | Major rewrite to reflect Course Builder approach |
| `docs/01-superadmin/institutes.md` | Update create flow, add action documentation |
| `docs/05-cross-login-flows/curriculum-course-flow.md` | Minor updates to reflect accurate flows |

---

## Detailed Changes Per File

### 1. `docs/06-testing-scenarios/smoke-tests/superadmin.md`

**Changes:**
- Rewrite "Master Data - Curriculum Smoke Tests" section with correct test cases
- Split "Master Data - Courses Smoke Tests" into Courses Page tests and Course Builder tests
- Expand "Institutes Smoke Tests" with detailed action and wizard step tests
- Add descriptive headers explaining the purpose of each section
- Remove SA-MC-009 (Delete item)
- Add bulk entry tests for chapters and topics

### 2. `docs/01-superadmin/master-data-curriculum.md`

**Changes:**
- Add "How Curriculums Are Created" section with creation flow
- Update "Manage Chapters" to show: Select Curriculum → Class → Subject → Add Chapter
- Update "Manage Topics" to show: Select Curriculum → Class → Subject → Chapter → Add Topic
- Add "Bulk Entry" subsection explaining copy-paste functionality
- Remove/update any references to dependent flows for Class/Subject

### 3. `docs/01-superadmin/master-data-courses.md`

**Changes:**
- Rewrite Overview to explain Course Builder concept
- Replace "Create Course Wizard" with "Course Builder Workflow"
- Add section on course-only chapters and topics
- Update UI Components table to reflect actual layout
- Add "How Courses Are Created" section with step-by-step flow

### 4. `docs/01-superadmin/institutes.md`

**Changes:**
- Update "Create Institute Flow" with accurate 4-step wizard
- Add detailed description of each wizard step
- Add "Action Buttons" section documenting View/Edit/Assign/Billing
- Add "Create Custom Course" functionality description
- Add "Skip & Create" option documentation

---

## Test Coverage Additions

After these changes, the smoke tests will cover:

**Curriculum (11 tests):**
- Page load, tab switching
- Independent creation: Curriculum, Class, Subject
- Dependent creation: Single/Multiple Chapters, Single/Multiple Topics
- Edit functionality
- Reorder functionality

**Courses (6 tests):**
- Page load, course selection, subject selection
- Navigation to Course Builder
- Management dialog

**Course Builder (10 tests):**
- Page load, create course popup
- Course selection, filtered subjects
- Add chapters from curriculum
- Create course-only chapter/topic
- Save and publish

**Institutes (18 tests):**
- Page load, search, filters
- All 4 action buttons
- All 4 wizard steps
- Plan preview, Skip & Create
- Create Custom Course
