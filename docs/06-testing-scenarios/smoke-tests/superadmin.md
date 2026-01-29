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

### Purpose

The Content Library is the central repository for all educational materials. SuperAdmin creates global content that flows to institutes based on curriculum/course visibility settings.

**Four Content Types:**
1. **Video** - Lecture videos, tutorials (MP4, WebM, MOV)
2. **Document** - PDFs, presentations, Word docs (PDF, PPT, PPTX, DOC, DOCX)
3. **HTML** - Interactive HTML files, iframe content (HTML, HTM)
4. **External URL** - YouTube, Vimeo, Google Slides embeds

**Classification Requirements:**
- Curriculum: Curriculum → Class → Subject → Chapter → Topic (ALL mandatory)
- Course: Course → Subject → Chapter → Topic (ALL mandatory)

**Visibility Logic:**
Content visibility is set per curriculum/course. Only institutes with matching curriculum/course assignments can access the content.

### Content Library Page Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-CL-001 | Content library page loads | Navigate to `/superadmin/content` | Page loads with header, search bar, filters, view toggle (Grid/List), Create Content button, AI Content Generator button, content grid, and pagination | Critical |
| SA-CL-002 | Default view is Grid | Open content library | Grid view is active by default, content displayed as cards | High |
| SA-CL-003 | Search by title works | Enter title text in search box | Content filters by title match in real-time | Critical |
| SA-CL-004 | Search by description works | Enter description text in search | Content filters by description match | High |
| SA-CL-005 | Search clears correctly | Click clear/X on search | All content displays again, search box empty | Medium |
| SA-CL-006 | Type filter works | Select "Video" from type dropdown | Only video content displays | High |
| SA-CL-007 | Subject filter works | Select "Physics" from subject filter | Only Physics content displays | High |
| SA-CL-008 | Class filter works | Select "Class 11" from class filter | Content filters to Class 11 only | High |
| SA-CL-009 | Chapter filter works | Select specific chapter | Content filters to that chapter only | Medium |
| SA-CL-010 | Multiple filters combine | Apply type + subject + class filters | Content matches ALL selected filters (AND logic) | Critical |
| SA-CL-011 | Filter reset works | Click reset/clear all filters button | All filters cleared, full content shown | Medium |
| SA-CL-012 | Grid view displays cards | View in Grid mode | Content cards with thumbnail, title, type badge, classification, action buttons visible | High |
| SA-CL-013 | List view displays rows | Click List view toggle | Content displays as rows with columns: Title, Type, Subject, Chapter, Actions | High |
| SA-CL-014 | Toggle between views | Switch Grid → List → Grid | View changes correctly, content remains intact | Medium |
| SA-CL-015 | Pagination displays | Scroll to bottom of content | Page numbers or "Load More" button visible | High |
| SA-CL-016 | Pagination navigation | Click page 2 or "Load More" | New content loads, page indicator updates | High |
| SA-CL-017 | Pagination with filters | Apply filter, then paginate | Pagination respects active filters, only matching content shown | High |

### Content Card Functionality Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-CL-018 | Preview button works | Click Preview on any content card | Preview dialog/page opens showing full content with player/viewer | Critical |
| SA-CL-019 | Video preview plays | Preview a video content item | Video player loads, playback controls work, video plays without errors | Critical |
| SA-CL-020 | PDF preview displays | Preview a PDF document | PDF viewer loads, all pages viewable, scrolling works, no "document not supported" error | Critical |
| SA-CL-021 | PPT preview displays | Preview a PPT/PPTX document | Presentation viewer loads, slides navigable, no rendering errors | Critical |
| SA-CL-022 | HTML content preview | Preview HTML content | HTML renders correctly in iframe, no 504 or server errors | High |
| SA-CL-023 | External URL preview (YouTube) | Preview YouTube/Vimeo content | Video embed displays, playback works, no "error with link" message | Critical |
| SA-CL-024 | External URL preview (Google Slides) | Preview Google Slides embed | Slides display in embed, navigation works | High |
| SA-CL-025 | Edit button works | Click Edit on any content card | Edit form opens with all fields pre-filled with current values | Critical |
| SA-CL-026 | Edit saves changes | Modify title/description, save | Changes saved, reflected immediately in library view | High |
| SA-CL-027 | Delete button works | Click Delete on unassigned content | Confirmation dialog appears with warning | High |
| SA-CL-028 | Delete confirmation | Confirm deletion in dialog | Content removed from library, success message shown | Medium |
| SA-CL-029 | Content type badge visible | View any content card | Type badge (Video, PDF, PPT, HTML, URL) displayed prominently | Medium |
| SA-CL-030 | Classification visible on card | View any content card | Subject, Chapter, and Topic tags visible on card | Medium |
| SA-CL-031 | Visibility tags shown | View any content card | Curriculum/Course visibility badges displayed | Medium |

### Create Content - Manual Upload Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-CC-001 | Create Content page loads | Click "Create Content" button | Split screen: Content Type & Details (left 2/3) + Classification & Visibility (right 1/3) | Critical |
| SA-CC-002 | Four content types visible | View content type section | Video, Document, HTML, External URL cards/options displayed | Critical |
| SA-CC-003 | Video type selection | Click Video type card | Card highlighted, file upload zone shows "MP4, WebM, MOV" accepted formats | High |
| SA-CC-004 | Document type selection | Click Document type card | Card highlighted, file upload shows "PDF, PPT, PPTX, DOC, DOCX" formats | High |
| SA-CC-005 | HTML type selection | Click HTML type card | Card highlighted, file upload shows "HTML, HTM" formats | High |
| SA-CC-006 | External URL selection | Click External URL type | URL input field appears instead of file upload | High |

### Classification Validation Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-CC-007 | Curriculum requires all fields | Select Curriculum source, leave Chapter empty, try Save | Validation error: "Please select Chapter" or similar | Critical |
| SA-CC-008 | Topic is mandatory | Select Curriculum → Class → Subject → Chapter, leave Topic empty, try Save | Validation error: "Please select Topic" | Critical |
| SA-CC-009 | Course requires all fields | Select Course source, leave Chapter empty, try Save | Validation error: "Please select Chapter" | Critical |
| SA-CC-010 | Classification cascade (Class → Subject) | Select Class | Subject dropdown populates with subjects for that class | High |
| SA-CC-011 | Classification cascade (Subject → Chapter) | Select Subject | Chapter dropdown populates with chapters for that subject | High |
| SA-CC-012 | Classification cascade (Chapter → Topic) | Select Chapter | Topic dropdown populates with topics for that chapter | High |

### Visibility Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-CC-013 | Visibility section present | View Classification sidebar | Visibility section with curriculum/course checkboxes visible | Critical |
| SA-CC-014 | Multiple curriculum selection | Check CBSE, ICSE, State Board checkboxes | All three selected, shown in selection summary/badges | High |
| SA-CC-015 | Multiple course selection | Check JEE, NEET checkboxes | Both courses selected, shown in summary | High |
| SA-CC-016 | Mixed visibility selection | Select CBSE curriculum + JEE course | Both visible in selection summary | High |

### Content Type Creation Flow Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-CC-017 | Video upload complete flow | Select Video, upload MP4 file, fill title/description, complete classification, set visibility, Save | Content saved successfully, redirects to Content Library, new video visible in grid | Critical |
| SA-CC-018 | Video preview after creation | After saving video, click Preview on new content | Video plays correctly with full playback controls, no errors | Critical |
| SA-CC-019 | Document PDF upload flow | Select Document, upload PDF file, fill details, complete classification, Save | PDF content saved, visible in library | Critical |
| SA-CC-020 | PDF preview after creation | After saving PDF, click Preview | PDF displays, pages navigable, no "document not supported" error | Critical |
| SA-CC-021 | Document PPT upload flow | Select Document, upload PPTX file, fill details, complete classification, Save | PPT content saved, visible in library | Critical |
| SA-CC-022 | PPT preview after creation | After saving PPT, click Preview | Slides display correctly, navigation works | Critical |
| SA-CC-023 | HTML file upload flow | Select HTML, upload .html file, fill details, complete classification, Save | HTML content saved to library | High |
| SA-CC-024 | HTML preview after creation | After saving HTML, click Preview | HTML renders in iframe, no 504 or server errors, interactive elements work | High |
| SA-CC-025 | External URL - YouTube flow | Select External URL, paste YouTube embed URL, fill details, complete classification, Save | Content saved with URL reference | Critical |
| SA-CC-026 | YouTube preview after creation | After saving, click Preview | Video embeds and plays correctly, no "error with link" message | Critical |
| SA-CC-027 | External URL - Vimeo flow | Select External URL, paste Vimeo URL, fill details, Save | Content saved | High |
| SA-CC-028 | External URL - Google Slides flow | Select External URL, paste Google Slides embed URL, fill details, Save | Content saved | High |
| SA-CC-029 | Google Slides preview | After saving, click Preview | Slides display in embed, navigation works | High |

### Complete Lifecycle Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-CC-030 | Create → Preview → Edit cycle | Create video content, preview it, then click Edit | Full cycle works: Create saves successfully, Preview shows video playing, Edit opens form with all values pre-filled | Critical |
| SA-CC-031 | Edit updates correctly | In Edit mode, change title, save | Title updated in library view immediately | High |
| SA-CC-032 | Content visible after refresh | Create content, refresh browser page | New content still visible in library (persisted) | High |

### AI Content Generator Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-AG-001 | AI Generator page loads | Click "AI Content Generator" button | 3-step wizard opens with Step 1 (Classification) active | Critical |
| SA-AG-002 | Step indicator visible | View wizard header | Steps 1-2-3 indicator shows current step highlighted | Medium |

### Step 1 - Classification Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-AG-003 | Classification panel visible | View Step 1 | Source type toggle, curriculum/course dropdowns, visibility section all present | Critical |
| SA-AG-004 | Curriculum classification flow | Select Curriculum → Class → Subject → Chapter → Topic | All dropdowns cascade correctly, each filters based on previous | Critical |
| SA-AG-005 | Course classification flow | Switch to Course, select Course → Subject → Chapter → Topic | Dropdowns work correctly for course mode | High |
| SA-AG-006 | Visibility multi-select | Check multiple curricula/courses in visibility section | All selected items shown in selection summary | High |
| SA-AG-007 | Cannot proceed without classification | Leave Chapter or Topic empty, click Next | Next button disabled or validation error shown | Critical |
| SA-AG-008 | Proceed to Step 2 | Complete all classification, click Next | Advances to Step 2 (Describe Content) | Critical |

### Step 2 - Prompt & Options Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-AG-009 | Prompt section visible | View Step 2 | Text area for prompt, style selector (Detailed/Concise), slide count control | Critical |
| SA-AG-010 | Prompt text area works | Enter detailed prompt (50+ characters) | Text accepted, character count shown | High |
| SA-AG-011 | Style preset selection | Click "Concise" option | Concise option selected/highlighted | Medium |
| SA-AG-012 | Slide count control | Adjust slider/input to 15 slides | Control updates, count shows "15" | Medium |
| SA-AG-013 | Minimum prompt validation | Enter less than 20 characters, try Generate | Validation error or Generate button disabled | High |
| SA-AG-014 | Generate button initiates | Complete prompt, click "Generate Presentation" | Loading indicator appears, button shows processing state | Critical |
| SA-AG-015 | Generation progress | Wait during AI generation | Progress indicator/spinner visible, then transitions to Step 3 | Critical |

### Step 3 - Preview & Edit Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-AG-016 | Slides generated display | After generation completes | Split view: Slide thumbnails on left panel, full slide preview on right panel | Critical |
| SA-AG-017 | Slide count matches request | Requested 10 slides in Step 2 | 10 slide thumbnails visible in left panel | High |
| SA-AG-018 | Slide navigation | Click slide 3 thumbnail | Slide 3 displays in main preview panel | High |
| SA-AG-019 | Drag and drop reorder | Drag slide 2 to position 5 | Slide order updates, slide 2 now in position 5, order persists | High |
| SA-AG-020 | Content within slide boundaries | View any generated slide | Text/content contained within slide boundaries, no overflow | Critical |
| SA-AG-021 | Edit slide content | Click on slide text, modify content | Text updates in real-time on the slide | High |
| SA-AG-022 | Delete slide | Click delete icon/button on slide 3 | Slide removed, thumbnail list updates, count decreases | Medium |
| SA-AG-023 | Duplicate slide | Click duplicate on slide 1 | New slide added after slide 1 with identical content | Medium |
| SA-AG-024 | Save to Library button | Click "Save to Library" | Presentation saved, redirects to Content Library homepage | Critical |

### Post-Save Verification Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-AG-025 | Content visible in library | After save, view Content Library | New AI-generated presentation appears in content grid | Critical |
| SA-AG-026 | Preview generated content | Click Preview on new AI content | All slides display correctly with proper formatting | Critical |
| SA-AG-027 | Edit generated content | Click Edit on new AI content | Edit form opens with title, description, classification pre-filled | High |
| SA-AG-028 | Classification correct on card | View content card for AI content | Correct subject, chapter, topic badges displayed | High |

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

**Display Verification Requirements:**
After creating any question, verify:
1. Math formulas render correctly via KaTeX (no broken symbols)
2. Images display properly (no missing images)
3. ChemSketch diagrams visible (for Chemistry questions)
4. All classification tags displayed (Subject, Chapter, Topic, Difficulty, Cognitive)

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
| SA-QB-010 | Math type (LaTeX) renders | View question with mathematical formulas | Formulas render correctly via KaTeX, no broken symbols or garbled text | High |
| SA-QB-011 | Images display | View question with images | Images load and display correctly, no missing images | High |
| SA-QB-012 | Edit button works | Click Edit button on question | Edit form opens with current values pre-filled | High |
| SA-QB-013 | Delete button works | Click Delete on unused question | Confirmation dialog, then question removed | Medium |

### Create Question - Manual Entry Tests (9 Types)

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-QB-014 | Create Question page loads | Click "Add Question" button | Split screen opens: Question Details (left) + Classification (right) | Critical |
| SA-QB-015 | Classification validation | Fill question but leave Chapter empty | Validation error, cannot save | High |
| SA-QB-016 | MCQ Single creation | Select MCQ type, fill question text, add 4 options, select 1 correct, add solution, complete classification (Curriculum/Course → Subject → Chapter → Topic → Difficulty → Cognitive), save | Question saved, redirects to bank. **Verify**: Card displays MCQ badge, question text renders correctly (math formulas via KaTeX display properly, images visible, ChemSketch diagrams render), all classification tags shown (Subject, Chapter, Topic, Difficulty, Cognitive badges visible) | Critical |
| SA-QB-017 | Multiple Correct creation | Select Multiple Correct, fill question, add options, check 2+ correct answers, complete classification, save | Question saved with multiple correct answers. **Verify**: Card shows Multiple Correct badge, all selected correct options marked, math/images render, all tags displayed | Critical |
| SA-QB-018 | Numerical creation | Select Numerical, fill question text with mathematical content, enter numeric answer (with optional range), complete classification, save | Question saved, displays with number input preview. **Verify**: Mathematical expressions render via KaTeX, numeric answer format shown, all classification tags visible | Critical |
| SA-QB-019 | True/False creation | Select True/False, fill question, select True or False answer, complete classification, save | Question saved with T/F option preview. **Verify**: Question renders correctly, selected answer visible, all tags displayed | Critical |
| SA-QB-020 | Fill in Blanks creation | Select Fill in Blanks, enter question with `___blank___` markers, fill answers for each blank, complete classification, save | Question saved, blanks detected correctly, answers saved per blank. **Verify**: Blank markers render as input fields in preview, all tags displayed | Critical |
| SA-QB-021 | Assertion-Reasoning creation | Select Assertion-Reasoning, enter Assertion text, enter Reason text, select correct option (A/B/C/D), complete classification, save | Question saved with standard AR format and options. **Verify**: Both assertion and reason display, options A-D visible, all tags displayed | Critical |
| SA-QB-022 | Paragraph Based creation | Select Paragraph, enter passage text with mathematical content, add 3 sub-questions with different types (MCQ, Numerical, True/False), complete classification, save | Paragraph with all sub-questions saved correctly. **Verify**: Passage text renders (math formulas via KaTeX, images display), all sub-questions visible with their types, all tags displayed | Critical |
| SA-QB-023 | Short Answer creation | Select Short Answer, fill question with any images/math, enter expected answer, complete classification, save | Question saved. **Verify**: Question content renders correctly, answer field visible, all tags displayed | High |
| SA-QB-024 | Long Answer creation | Select Long Answer, fill question with diagrams/images, enter model answer, complete classification, save | Question saved. **Verify**: Question renders with all images/diagrams, model answer visible in preview, all tags displayed | High |
| SA-QB-025 | Each type displays correctly | After creating each of 9 types, view in bank | Each card shows correct type badge, preview renders type-specific UI, math/images render correctly | Critical |
| SA-QB-026 | Each type editable | Click Edit on each question type | Edit form shows correct fields for that specific type, existing content pre-filled | High |

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
| SA-QB-039 | Add selected to bank | Select desired questions, click "Add to Bank" | Selected questions saved to bank, redirects to Question Bank. **Verify**: All 7 tags (Curriculum, Class, Subject, Chapter, Topic, Difficulty, Cognitive) OR 6 tags for Course mode automatically assigned and visible on each card | Critical |
| SA-QB-040 | Verify AI questions in bank | After adding, view new questions in Question Bank | Questions appear with: (1) Correct classification tags displayed on cards, (2) Math formulas rendered via KaTeX without broken symbols, (3) Any images intact and displaying, (4) AI-assigned difficulty/cognitive badges visible | Critical |

### Upload PDF Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-QB-041 | Upload PDF page loads | Click "Upload PDF" button | 3-step wizard opens: Step 1 Classification active | Critical |
| SA-QB-042 | Step 1: Select classification | Select Curriculum → Class → Subject (NO chapter required at this step) | Proceeds to Step 2 when Continue clicked | High |
| SA-QB-043 | Step 2: Upload file | Select PDF file via file picker or drag-drop | File uploads, progress indicator shown, success message | Critical |
| SA-QB-044 | Step 2: Processing indicator | After upload | "Processing..." indicator, then "Upload successful. Click Review to continue." | High |
| SA-QB-045 | Step 3: Review page | Click "Go to Review" or navigate to Step 3 | Extracted questions displayed in grid/list format | Critical |
| SA-QB-046 | AI-assigned chapter/topic | View extracted questions in review | **Critical Check**: Chapter, Topic, Difficulty, Cognitive Type automatically tagged by AI. Verify ALL fields populated (no empty tags) | Critical |
| SA-QB-047 | OCR verification - Math | View question with mathematical content | **Verify**: LaTeX formulas extracted and rendered correctly via KaTeX, no broken symbols or garbled text | High |
| SA-QB-048 | OCR verification - Images | View question with images/diagrams | **Verify**: All diagrams/images from PDF extracted and display correctly, no missing images | High |
| SA-QB-049 | Edit in review | Click Edit on extracted question | Can modify question text, options, classification before saving | High |
| SA-QB-050 | Preview in review | Click Preview on question | Full question preview with formatting, math rendering, images | High |
| SA-QB-051 | Add selected to bank | Select questions, click "Add to Bank" | Selected questions saved with OCR-extracted content. **Full verification cycle**: Preview each type after adding, verify math/images render correctly, confirm all 7/6 tags assigned and displayed on card | Critical |

---

## Exams Smoke Tests

### Purpose

The Exams module manages platform-wide examinations: Previous Year Papers (PYP) from competitive exams and Grand Tests for benchmarking across institutes.

**Key Concepts:**
- PYP: Official historical papers organized by exam type (JEE, NEET) and year
- Grand Tests: Custom mock exams assigned to specific institutes via Audience
- Schedule: Controls when students can start the exam
- Both types require PDF upload or AI generation for questions

### Exams Page Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-EX-001 | Exams page loads | Navigate to `/superadmin/exams` | Page loads with two tabs: Previous Year Papers, Grand Tests | Critical |
| SA-EX-002 | Previous Year Papers tab active by default | Open exams page | PYP tab highlighted, PYP content displays | High |
| SA-EX-003 | Grand Tests tab switch | Click Grand Tests tab | Tab switches, Grand Tests grid displays | High |
| SA-EX-004 | PYP search works | Enter text in PYP search box | Papers filter by name match | High |
| SA-EX-005 | PYP exam type filter | Select "JEE Main" from filter dropdown | Only JEE Main papers display | High |
| SA-EX-006 | GT search works | In Grand Tests tab, enter text in search | Tests filter by name match | High |
| SA-EX-007 | GT status filter | Select "Scheduled" from status filter | Only scheduled tests display | High |

### PYP Display Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-EX-008 | PYP grouped by exam type | View PYP tab | Papers grouped under JEE Main, JEE Advanced, NEET sections | Critical |
| SA-EX-009 | Year accordion displays | View any exam type section | Years displayed (2024, 2023, etc.) as expandable accordions | Critical |
| SA-EX-010 | Year accordion expands | Click on year accordion | Papers for that year display with session info | High |
| SA-EX-011 | Paper card displays info | View any paper in expanded year | Card shows paper name, session (if applicable), question count | High |
| SA-EX-012 | View button works | Click View on any paper | Redirects to exam review page with full question preview | Critical |
| SA-EX-013 | Edit button works | Click Edit on any paper | Redirects to exam review page in edit mode | High |
| SA-EX-014 | Stats button works | Click Stats on any paper | Stats display (performance analytics) | Medium |

### Grand Test Display Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-EX-015 | GT displays in grid | View Grand Tests tab | Tests displayed as cards in grid layout | Critical |
| SA-EX-016 | GT card info displays | View any GT card | Shows: Name, pattern badge, status badge, question count, created date | High |
| SA-EX-017 | View button works | Click View on GT card | Redirects to exam review page with question preview | Critical |
| SA-EX-018 | Edit button works | Click Edit on GT card | Redirects to exam review page in edit mode | High |
| SA-EX-019 | Schedule button works | Click Schedule on GT card | Schedule dialog opens | Critical |
| SA-EX-020 | Audience button works | Click Audience on GT card | Audience dialog opens | Critical |
| SA-EX-021 | Delete button works (draft) | Click Delete on draft GT | Confirmation dialog, then GT removed | Medium |
| SA-EX-022 | Delete hidden for published | View published GT card | Delete button not visible | Medium |

### Schedule Dialog Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-EX-023 | Schedule dialog loads | Click Schedule on GT | Dialog opens with date picker and time selector | Critical |
| SA-EX-024 | Date picker works | Click date picker | Calendar opens, can select future date | High |
| SA-EX-025 | Past dates disabled | View calendar | Past dates are grayed out/unselectable | Critical |
| SA-EX-026 | Time selector works | Click time dropdown | 30-minute time slots available (00:00, 00:30, 01:00, etc.) | High |
| SA-EX-027 | Save schedule | Select date and time, click Save | Schedule saved, toast confirmation, dialog closes | Critical |
| SA-EX-028 | Cancel schedule | Click Cancel | Dialog closes, no changes saved | Medium |
| SA-EX-029 | Schedule reflected on card | After saving schedule | GT card shows scheduled date/time badge | High |

### Audience Dialog Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-EX-030 | Audience dialog loads | Click Audience on GT | Dialog opens with Direct Users toggle and Institutes section | Critical |
| SA-EX-031 | Direct Users toggle | Toggle Direct Users switch | Switch enables/disables, count updates | High |
| SA-EX-032 | Institutes toggle | Toggle Institutes switch | Switch enables/disables, institute options appear | High |
| SA-EX-033 | All Institutes option | Select "All Institutes" radio | All institutes count displayed in summary | High |
| SA-EX-034 | Select Specific Institutes | Select "Select Specific Institutes" radio | Institute checklist appears with search | Critical |
| SA-EX-035 | Institute checkbox toggle | Check/uncheck individual institutes | Selected count updates in summary | High |
| SA-EX-036 | Institute search | Type in institute search box | List filters by institute name | Medium |
| SA-EX-037 | Select All button | Click "Select All" | All institutes checked | Medium |
| SA-EX-038 | Deselect All button | Click "Deselect All" | All institutes unchecked | Medium |
| SA-EX-039 | Estimated participants | Make selections | Participant count updates in summary | High |
| SA-EX-040 | Save audience | Make selections, click Save | Audience saved, toast confirmation, dialog closes | Critical |
| SA-EX-041 | Validation - no audience | Uncheck all, try Save | Error: "Please select at least one audience" | High |

### Create PYP Wizard Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-EX-042 | Create PYP button works | Click "Create Previous Year Paper" button | 3-step wizard opens with Step 1 active | Critical |
| SA-EX-043 | Step 1: Competitive Exam selection | Select "JEE Main" from exam type | Selection highlighted | Critical |
| SA-EX-044 | Step 1: Year selection | Select year from dropdown (2024, 2023, etc.) | Year selected | Critical |
| SA-EX-045 | Step 1: Session selection (optional) | Select session (January, April) | Session selected | Medium |
| SA-EX-046 | Step 1: Paper name auto-generates | Select exam type and year | Paper name auto-fills (e.g., "JEE Main 2024") | High |
| SA-EX-047 | Step 1: Paper name editable | Edit auto-generated name | Custom name accepted | Medium |
| SA-EX-048 | Step 1: Next button validation | Leave exam type empty, try Next | Next button disabled or validation error | Critical |
| SA-EX-049 | Step 1: Proceed to Step 2 | Fill all required fields, click Next | Advances to Step 2 (Upload PDF) | Critical |
| SA-EX-050 | Step 2: Upload area displays | View Step 2 | Drag-drop upload area visible with accepted formats | High |
| SA-EX-051 | Step 2: File upload success | Select PDF file via picker or drag-drop | File name displayed, upload progress, success state | Critical |
| SA-EX-052 | Step 2: Non-PDF rejection | Try to upload non-PDF file (.doc, .jpg) | Error toast: "Please upload a PDF file" | High |
| SA-EX-053 | Step 2: Large file rejection | Try to upload file >50MB | Error toast: "File size must be less than 50MB" | High |
| SA-EX-054 | Step 2: Upload & Create | Click "Upload & Create Test" | Processing indicator shown during extraction | Critical |
| SA-EX-055 | Step 3: Success state | After upload/extraction completes | Success message displayed, "Review & Configure" button available | Critical |
| SA-EX-056 | Step 3: Navigate to review | Click "Review & Configure" | Redirects to exam review page with extracted questions | Critical |

### Create Grand Test Wizard Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-EX-057 | Create GT button works | Click "Create Grand Test" button | 4-step wizard opens with Step 1 active | Critical |
| SA-EX-058 | Step 1: Test name entry | Enter test name | Name accepted in input field | Critical |
| SA-EX-059 | Step 1: Content source toggle | Click Curriculum/Course toggle | Selection toggles between Curriculum and Course | High |
| SA-EX-060 | Step 1: Curriculum dropdown | Select curriculum from dropdown | Dropdown populates and selects correctly | High |
| SA-EX-061 | Step 1: Course dropdown | Switch to Course mode, select course | Course selected correctly | High |
| SA-EX-062 | Step 1: Pattern selection | Select JEE Main pattern | Pattern card highlighted with section description | Critical |
| SA-EX-063 | Step 1: Next validation | Leave test name empty, try Next | Next button disabled or validation error | High |
| SA-EX-064 | Step 1: Proceed to Step 2 | Fill all required, click Next | Advances to Step 2 (Creation Method) | Critical |
| SA-EX-065 | Step 2: Method options visible | View Step 2 | "Generate using AI" and "Upload PDF" options displayed | Critical |
| SA-EX-066 | Step 2: AI method selection | Click "Generate using AI" | AI option highlighted/selected | High |
| SA-EX-067 | Step 2: PDF method selection | Click "Upload PDF" | PDF option highlighted/selected | High |
| SA-EX-068 | Step 3 (AI): Subject sliders | View AI settings step | Subject distribution sliders for Physics, Chemistry, Math/Bio | High |
| SA-EX-069 | Step 3 (AI): Difficulty sliders | View difficulty distribution | Easy, Medium, Hard sliders (must total 100%) | High |
| SA-EX-070 | Step 3 (AI): Difficulty validation | Set sliders that don't total 100% | Validation error shown | High |
| SA-EX-071 | Step 3 (AI): Cognitive sliders | View cognitive distribution | All 6 cognitive types with percentage sliders | High |
| SA-EX-072 | Step 3 (AI): Generate button | Click "Create Grand Test" | Processing indicator, AI generation starts | Critical |
| SA-EX-073 | Step 4: Success state | After generation completes | Success message, navigation options displayed | Critical |
| SA-EX-074 | Step 4: Go to Review | Click "Review & Configure" | Redirects to exam review page | Critical |

### Exam Review & Configure Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-EX-075 | Review page loads | Navigate to exam review | Page loads with sections and questions | Critical |
| SA-EX-076 | Question count visible | View review page | Total question count matches expected | High |
| SA-EX-077 | Section tabs work | Click different section tabs | Questions filter by section | High |
| SA-EX-078 | Math formulas render | View question with LaTeX | Formulas render via KaTeX correctly | Critical |
| SA-EX-079 | Images display | View question with images | All images load and display | High |
| SA-EX-080 | Edit question | Click Edit on any question | Edit form opens with current values | High |
| SA-EX-081 | Save edits | Modify question and save | Changes saved, reflected in list | High |
| SA-EX-082 | Classification tags visible | View any question | Chapter, Topic, Difficulty, Cognitive tags displayed | High |
| SA-EX-083 | Publish exam | Click Publish button | Exam status changes to Published, toast confirmation | Critical |

---

## Roles & Access Smoke Tests

### Purpose

The Roles & Access module implements Role-Based Access Control for the SuperAdmin portal. It allows creation of custom roles with granular permissions, enabling delegation of specific platform management tasks to team members.

**Key Concepts:**
- Role Types: Define permission templates (what modules/actions are allowed)
- Team Members: Users assigned to role types (limited access based on role)
- Permissions: View, Create, Edit, Delete per module
- Special permissions: Tier Management, Scope (class/subject), Capabilities (AI, PDF)
- System roles (Super Admin) cannot be deleted

### Roles & Access Page Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-RA-001 | Roles page loads | Navigate to `/superadmin/roles` | Page loads with two tabs: Role Types, Team Members | Critical |
| SA-RA-002 | Role Types tab active by default | Open page | Role Types tab highlighted, role cards display | High |
| SA-RA-003 | Team Members tab switch | Click Team Members tab | Tab switches, member table displays | High |
| SA-RA-004 | Create Role button visible | View Role Types tab | "Create Role" button visible in header | High |
| SA-RA-005 | Add Member button visible | View Team Members tab | "Add Member" button visible in header | High |

### Role Types Tab Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-RA-006 | Role cards display | View Role Types tab | Cards show role name, description, member count | High |
| SA-RA-007 | System role badge | View Super Admin card | "System" badge visible indicating protected role | Medium |
| SA-RA-008 | System role no delete | View Super Admin card | No Delete button available for system roles | Critical |
| SA-RA-009 | Custom role has edit/delete | View any custom role card | Edit and Delete buttons visible | High |
| SA-RA-010 | Member count accurate | View role card | Member count matches actual assigned members | Medium |

### Create Role Dialog Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-RA-011 | Create role dialog opens | Click "Create Role" button | Dialog/page opens with form sections | Critical |
| SA-RA-012 | Role name required | Leave name empty, try save | Save button disabled or validation error | Critical |
| SA-RA-013 | Description optional | Leave description empty, fill name | Can save successfully | Medium |
| SA-RA-014 | Dashboard permission section | View Dashboard section | Only View toggle available (dashboard is view-only) | High |
| SA-RA-015 | Institutes permissions | View Institutes section | View, Create, Edit, Delete toggles + Tier Management checkbox | High |
| SA-RA-016 | Tier Management toggle | Toggle Tier Management checkbox | Checkbox enables/disables correctly | High |
| SA-RA-017 | Question Bank permissions | View Question Bank section | VCUD toggles + Scope section + Capabilities section | Critical |
| SA-RA-018 | QB Scope - All Classes toggle | Toggle "All Classes" | When ON, class multi-select hidden; when OFF, appears | High |
| SA-RA-019 | QB Scope - Specific Classes | Uncheck All Classes, select specific classes | Selected classes saved in scope | High |
| SA-RA-020 | QB Scope - All Subjects toggle | Toggle "All Subjects" | When ON, subject multi-select hidden; when OFF, appears | High |
| SA-RA-021 | QB Scope - Specific Subjects | Uncheck All Subjects, select specific subjects | Selected subjects saved in scope | High |
| SA-RA-022 | QB Capabilities - Manual | Toggle Manual Entry capability | Checkbox toggles correctly | High |
| SA-RA-023 | QB Capabilities - AI | Toggle AI Generation capability | Checkbox toggles correctly | High |
| SA-RA-024 | QB Capabilities - PDF | Toggle PDF Upload capability | Checkbox toggles correctly | High |
| SA-RA-025 | Exams permissions | View Exams section | VCUD toggles + Types section + Scope section | Critical |
| SA-RA-026 | Exams Types - Grand Tests | Toggle Grand Tests type | Checkbox toggles correctly | High |
| SA-RA-027 | Exams Types - PYP | Toggle Previous Year Papers type | Checkbox toggles correctly | High |
| SA-RA-028 | Exams Scope - Inherit option | View Scope section | "Inherit from Question Bank" option available | High |
| SA-RA-029 | Exams Scope - Custom | Uncheck inherit, configure custom scope | Custom scope fields appear | Medium |
| SA-RA-030 | Content Library permissions | View Content Library section | VCUD toggles + Capabilities + Scope | Critical |
| SA-RA-031 | CL Capabilities - Manual | Toggle Manual Upload capability | Checkbox toggles correctly | High |
| SA-RA-032 | CL Capabilities - AI | Toggle AI Generation capability | Checkbox toggles correctly | High |
| SA-RA-033 | Master Data permissions | View Master Data section | VCUD toggles available | High |
| SA-RA-034 | Users permissions | View Users section | VCUD toggles available | High |
| SA-RA-035 | Roles & Access permissions | View Roles & Access section | VCUD toggles available | High |
| SA-RA-036 | Save new role | Fill form completely, click Create/Save | Role card appears in list, toast confirmation | Critical |
| SA-RA-037 | Cancel create | Click Cancel | Dialog closes, no role created | Medium |

### Edit Role Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-RA-038 | Edit dialog opens | Click Edit on any custom role card | Dialog opens with pre-filled values | Critical |
| SA-RA-039 | Name pre-filled | View dialog | Current role name shown in field | High |
| SA-RA-040 | Permissions pre-filled | View dialog | Current permissions reflected (toggles in correct state) | High |
| SA-RA-041 | Save changes | Modify permissions, click Save | Role updated, toast confirmation | Critical |
| SA-RA-042 | Cancel edit | Click Cancel | Dialog closes, no changes saved | Medium |

### Delete Role Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-RA-043 | Delete custom role (no members) | Click Delete on role with 0 members | Role removed immediately, toast confirmation | High |
| SA-RA-044 | Delete role with members warning | Click Delete on role with assigned members | Warning: "Reassign members before deleting" | Critical |
| SA-RA-045 | System role protected | Try to delete Super Admin role | Delete button not available | Critical |

### Team Members Tab Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-RA-046 | Member table displays | View Team Members tab | Table with columns: Name, Email, Mobile, Role, Status, Actions | Critical |
| SA-RA-047 | Member row shows role | View any member row | Role type name displayed in Role column | High |
| SA-RA-048 | Status badge visible | View any member row | Active/Inactive status badge displayed | High |
| SA-RA-049 | Edit button visible | View member row | Edit action available (button or menu) | High |
| SA-RA-050 | Delete button visible | View member row | Delete action available | High |
| SA-RA-051 | Search members | Type in search box | Table filters by name or email match | Medium |

### Add Member Dialog Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-RA-052 | Add member dialog opens | Click "Add Member" button | Dialog opens with form fields | Critical |
| SA-RA-053 | Name required | Leave name empty, try save | Save disabled or validation error | Critical |
| SA-RA-054 | Email required | Leave email empty, try save | Save disabled or validation error | Critical |
| SA-RA-055 | Email validation | Enter invalid email format | Validation error shown | High |
| SA-RA-056 | Mobile optional | Leave mobile empty | Can save successfully | Medium |
| SA-RA-057 | Role type dropdown | Click role type dropdown | All created role types available in list | Critical |
| SA-RA-058 | Role type required | Leave role unselected, try save | Validation error | Critical |
| SA-RA-059 | Status toggle | Toggle Active/Inactive switch | Status changes correctly | High |
| SA-RA-060 | Default status Active | Open add dialog | Status defaults to Active | Medium |
| SA-RA-061 | Save member | Fill all required fields, click Save | Member appears in table, toast confirmation | Critical |
| SA-RA-062 | Role member count updates | After adding member | Role card shows incremented member count | High |

### Edit Member Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-RA-063 | Edit member dialog opens | Click Edit on member row | Dialog opens with pre-filled values | Critical |
| SA-RA-064 | Current values shown | View dialog | Name, email, role, status pre-filled correctly | High |
| SA-RA-065 | Change role type | Select different role from dropdown | Change accepted | High |
| SA-RA-066 | Change status | Toggle status Active/Inactive | Status changes | High |
| SA-RA-067 | Save member changes | Modify and click Save | Member updated in table, toast confirmation | Critical |

### Delete Member Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-RA-068 | Delete member confirmation | Click Delete on member | Confirmation dialog appears | High |
| SA-RA-069 | Confirm delete | Click Confirm in dialog | Member removed from table, toast confirmation | High |
| SA-RA-070 | Role count decrements | After deleting member | Role card shows decremented member count | High |
| SA-RA-071 | Cancel delete | Click Cancel in confirmation | Member not deleted | Medium |

---

## Mobile-Specific Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-M-001 | Responsive layout | View on 375px width | Layout adapts correctly | Critical |
| SA-M-002 | Tables scroll | View tables on mobile | Horizontal scroll works smoothly | High |
| SA-M-003 | Dialogs work | Open any dialog on mobile | Full-screen drawer instead of modal | High |
| SA-M-004 | Touch targets | Tap buttons/links | 44px+ touch targets | High |
| SA-M-005 | Filters collapse | View filter bar on mobile | Horizontal scroll for filter pills | Medium |
| SA-M-006 | Exams tabs work | Switch PYP/GT tabs on mobile | Tabs switch correctly | High |
| SA-M-007 | Role cards stack | View Role Types on mobile | Cards stack vertically | Medium |
| SA-M-008 | Member table scrolls | View Team Members on mobile | Horizontal scroll with priority columns | High |

---

*Last Updated: January 2025*
