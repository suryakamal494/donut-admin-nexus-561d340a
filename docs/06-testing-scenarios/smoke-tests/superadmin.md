# SuperAdmin Smoke Tests

> Page-level verification tests for the SuperAdmin portal.

---

## Overview

These smoke tests verify that each SuperAdmin page loads correctly and core functionality works. Run these after deployments or major changes.

**Test Execution Notes:**
1. **Run order**: Dashboard → Master Data → Tier Management → Institutes → Users → Content → Questions → Exams → Roles
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

## Tier Management Smoke Tests

### Purpose

Tier Management controls which features each institute has access to. When an institute is created and assigned a tier, only the features enabled in that tier will appear in the institute portal.

**Key Concepts:**
- Tiers define feature access (sidebar items, AI capabilities, limits)
- User limits (students, teachers, batches) are tier-specific
- Tier changes reflect immediately in institute portals

**Feature Categories:**
- Content Management (Content Library, AI Content Generator)
- Question Management (Question Bank, AI Question Generator, PDF Upload)
- Exam Management (Exams, Patterns, Live Assessments)
- Academic Tools (Timetable, Syllabus Tracker)
- Analytics (Basic Reports, Advanced Analytics, Custom Reports)
- Administration (Roles & Access)

### Tier Page Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-TM-001 | Tier page loads | Navigate to `/superadmin/institutes/tiers` | Page loads with tier cards and feature comparison table | Critical |
| SA-TM-002 | All tier cards displayed | View page | Basic, Standard/Pro, Premium/Enterprise cards visible with pricing | High |
| SA-TM-003 | Feature comparison shows all features | Scroll feature comparison table | All 18+ features listed in categories | Critical |
| SA-TM-004 | Feature categories grouped | View comparison table | Content, Questions, Exams, Analytics, Administration sections visible | High |
| SA-TM-005 | Edit tier button works | Click "Edit" on any tier card | Navigates to tier edit page/dialog | High |

### Create Tier Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-TM-006 | Create new tier button | Click "Create New Tier" button | Form opens with 3 sections: Basic Info, User Limits, Features by Category | Critical |
| SA-TM-007 | Basic info form | Fill tier name, price, billing cycle, description | Form accepts input, validation works | High |
| SA-TM-008 | User limits form | Set max students, max teachers, max batches, storage | Limits saved correctly, 0 = unlimited | High |
| SA-TM-009 | Feature toggles work | Toggle individual features in each category | Toggles enable/disable features | Critical |
| SA-TM-010 | All institute features listed | View feature toggles section | Dashboard, Batches, Teachers, Students, Timetable, Syllabus Tracker, Question Bank, AI Question Generator, PDF Question Upload, Content Library, AI Content Generator, Exams, Exam Patterns, Live Assessments, Basic Reports, Advanced Analytics, Custom Reports, Roles & Access all present | Critical |
| SA-TM-011 | Save new tier | Complete all sections, click Save | Tier created successfully, appears in comparison | Critical |
| SA-TM-012 | New tier in comparison | After creating tier | New column appears in comparison table with correct feature toggles | High |

---

## Institutes Smoke Tests

### Purpose

The Institutes module manages all educational institutions on the platform. SuperAdmin can create institutes, assign curricula/courses, configure tiers, and monitor institute health.

**Key Concepts:**
- Institutes are assigned Curricula AND/OR Courses
- Tier-based feature access (Basic, Standard, Premium)
- 4-step wizard for institute creation
- Custom courses can be created specifically for an institute

**How Tiers Affect Institutes:**
When a tier is assigned, only enabled features appear in the institute sidebar. AI buttons (Generate with AI, Upload PDF) are hidden if those features are disabled in the tier.

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

### Purpose

The Question Bank is the central repository for all educational questions. Questions created here propagate to institutes based on their curriculum/course assignments.

**Key Concepts:**
- Questions require full classification: Curriculum/Course + Subject + Chapter + Topic + Difficulty + Cognitive Type
- 9 question types: MCQ, Multiple Correct, Numerical, True/False, Fill in Blanks, Assertion-Reasoning, Paragraph, Short Answer, Long Answer
- 3 creation methods: Manual Entry, AI Generation, PDF Extraction
- Questions propagate ONLY to institutes with matching curriculum/course assignments

**Propagation Rule:**
If SuperAdmin creates a CBSE Physics question, only institutes assigned CBSE will see it. Institutes assigned only ICSE will NOT see CBSE questions.

### Question Bank Page Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-QB-001 | Questions page loads | Navigate to `/superadmin/questions` | Page loads with filters, 3 action buttons (Upload PDF, Generate with AI, Add Question), question cards | Critical |
| SA-QB-002 | Subject filter works | Select subject from dropdown | List filters to selected subject only | High |
| SA-QB-003 | Type filter works | Select MCQ/Numerical/etc from dropdown | List filters to selected type only | High |
| SA-QB-004 | Difficulty filter works | Select Easy/Medium/Hard/Expert | List filters to selected difficulty | High |
| SA-QB-005 | Cognitive filter works | Select Logical/Analytical/Conceptual/etc | List filters to selected cognitive type | High |
| SA-QB-006 | Search works | Type in search box | Questions filter by text match | High |
| SA-QB-007 | Question card displays all info | View any question card | Shows: Type badge, Difficulty badge, Cognitive badge, Subject, Chapter, Topic, Curriculum/Course tag | Critical |
| SA-QB-008 | Preview button works | Click Preview button on any card | Question preview dialog opens with full content, options, solution | Critical |
| SA-QB-009 | View Solution works | Click View Solution in preview | Solution and explanation displayed | High |
| SA-QB-010 | Math type (LaTeX) renders | View question with mathematical formulas | Formulas render correctly via KaTeX | High |
| SA-QB-011 | Images display | View question with images | Images load and display correctly | High |
| SA-QB-012 | Edit button works | Click Edit button on question | Edit form opens with current values pre-filled | High |
| SA-QB-013 | Delete button works | Click Delete on unused question | Confirmation dialog, then question removed | Medium |

### Create Question - Manual Entry Tests (9 Types)

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-QB-014 | Create Question page loads | Click "Add Question" button | Split screen opens: Question Details (left) + Classification (right) | Critical |
| SA-QB-015 | Classification validation | Fill question but leave Chapter empty | Validation error, cannot save | High |
| SA-QB-016 | MCQ Single creation | Select MCQ type, fill question text, add 4 options, select 1 correct, add solution, select full classification, save | Question saved, redirects to bank, card displays correctly with MCQ badge | Critical |
| SA-QB-017 | Multiple Correct creation | Select Multiple Correct, fill question, add options, check 2+ correct answers, complete classification, save | Question saved with multiple correct answers visible | Critical |
| SA-QB-018 | Numerical creation | Select Numerical, fill question text, enter numeric answer (with optional range), save | Question saved, displays with number input preview | Critical |
| SA-QB-019 | True/False creation | Select True/False, fill question, select True or False answer, save | Question saved with T/F option preview | Critical |
| SA-QB-020 | Fill in Blanks creation | Select Fill in Blanks, enter question with `___blank___` markers, fill answers for each blank, save | Question saved, blanks detected correctly, answers saved per blank | Critical |
| SA-QB-021 | Assertion-Reasoning creation | Select Assertion-Reasoning, enter Assertion text, enter Reason text, select correct option (A/B/C/D), save | Question saved with standard AR format and options | Critical |
| SA-QB-022 | Paragraph Based creation | Select Paragraph, enter passage text, add 3 sub-questions with different types (MCQ, Numerical, True/False), save | Paragraph with all sub-questions saved correctly | Critical |
| SA-QB-023 | Short Answer creation | Select Short Answer, fill question, enter expected answer, save | Question saved | High |
| SA-QB-024 | Long Answer creation | Select Long Answer, fill question, enter model answer, save | Question saved | High |
| SA-QB-025 | Each type displays correctly | After creating each of 9 types, view in bank | Each card shows correct type badge, preview renders type-specific UI | Critical |
| SA-QB-026 | Each type editable | Click Edit on each question type | Edit form shows correct fields for that specific type | High |

### AI Question Generator Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-QB-027 | AI Generator page loads | Click "Generate with AI" button | AI Question Generator page opens with classification panel (left) and generation options (right) | Critical |
| SA-QB-028 | Question types multi-select | Click on multiple question type chips | Can select multiple types simultaneously (MCQ + Numerical + etc.) | High |
| SA-QB-029 | Difficulty level selection | Select difficulty levels | Single or multiple difficulties selectable | High |
| SA-QB-030 | Cognitive type selection | Select cognitive types | Selection works correctly | High |
| SA-QB-031 | Number of questions | Enter count (1-50) | Accepts valid number, rejects invalid | High |
| SA-QB-032 | Classification: Curriculum flow | Select Curriculum → Class → Subject → Chapter | Each dropdown filters based on previous selection | High |
| SA-QB-033 | Topic MULTI-SELECT | After chapter selected, view topics list | Can select MULTIPLE topics simultaneously | Critical |
| SA-QB-034 | Additional instructions | Enter custom instructions in text area | Text area accepts input | Medium |
| SA-QB-035 | Generate button works | Fill all required fields, click Generate Questions | Progress indicator appears, then review page loads with generated questions | Critical |
| SA-QB-036 | Review page shows questions | After generation completes | All generated questions displayed with preview capability | Critical |
| SA-QB-037 | Select/deselect questions | Click checkboxes on individual questions | Can select/deselect specific questions | High |
| SA-QB-038 | Edit question in review | Click Edit on generated question | Can modify question before saving to bank | High |
| SA-QB-039 | Add selected to bank | Select desired questions, click "Add to Bank" | Selected questions saved to bank, redirects to Question Bank | Critical |
| SA-QB-040 | Verify in bank | After adding, view in Question Bank | New questions appear with correct classification and tags | Critical |

### Upload PDF Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-QB-041 | Upload PDF page loads | Click "Upload PDF" button | 3-step wizard opens: Step 1 Classification active | Critical |
| SA-QB-042 | Step 1: Select classification | Select Curriculum → Class → Subject (NO chapter required) | Proceeds to Step 2 when Continue clicked | High |
| SA-QB-043 | Step 2: Upload file | Select PDF file via file picker or drag-drop | File uploads, progress indicator shown, success message | Critical |
| SA-QB-044 | Step 2: Processing indicator | After upload | "Processing..." indicator, then "Upload successful. Click Review to continue." | High |
| SA-QB-045 | Step 3: Review page | Click "Go to Review" or navigate to Step 3 | Extracted questions displayed in grid/list format | Critical |
| SA-QB-046 | AI-assigned chapter/topic | View extracted questions in review | Chapter, Topic, Difficulty, Cognitive Type automatically tagged by AI | Critical |
| SA-QB-047 | OCR verification - Math | View question with mathematical content | LaTeX formulas extracted and rendered correctly | High |
| SA-QB-048 | OCR verification - Images | View question with images | Images extracted and displayed correctly | High |
| SA-QB-049 | Edit in review | Click Edit on extracted question | Can modify question text, options, classification before saving | High |
| SA-QB-050 | Preview in review | Click Preview on question | Full question preview with formatting | High |
| SA-QB-051 | Add selected to bank | Select questions, click "Add to Bank" | Selected questions saved with OCR-extracted content | Critical |

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
