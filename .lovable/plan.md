

# Master Data Intra-Login Testing: SuperAdmin Panel

## Context

Master Data (Curriculum + Courses) is the foundation layer of the SuperAdmin panel. After creation in the Master Data module, this data is consumed by **4 downstream SuperAdmin modules**: Institute Management, Question Bank, Exams, and Content Library. The current documentation and test cases cover this partially but have significant gaps.

---

## Part 1: Documentation Gaps in SuperAdmin Docs

### What EXISTS and is documented well

| Document | Coverage |
|----------|----------|
| `master-data-curriculum.md` | Creation hierarchy, bulk entry, data flow diagram listing consumers (Content Library, Question Bank, Exam Builder, Course Builder) |
| `master-data-courses.md` | Course creation flow, 80/20 split, mapped vs exclusive chapters |
| `institutes.md` | Step 4 of wizard (Assign Curriculum/Courses), Assign dialog from action menu |
| `question-bank.md` | Classification flow for both Curriculum (7 tags) and Course (6 tags) modes |
| `content-library.md` | Classification flow with Source Type toggle, visibility settings |
| `exams.md` | Grand Test Step 1 has Content Source (Curriculum/Course) selection |

### What is MISSING or needs enhancement

**1. `master-data-curriculum.md` -- Missing "Downstream Impact" section**
- The "Data Flow" section lists consumers but does not detail HOW each consumer uses the data
- Missing: which specific dropdowns/filters in Question Bank, Content Library, and Exams pull from curriculum data
- Missing: cascade reset behavior (e.g., changing class resets subject, chapter, topic selections downstream)

**2. `master-data-courses.md` -- Missing downstream consumption details**
- Lists consumers but does not explain the Course-mode classification path (Course -> Subject -> Chapter -> Topic) used in Question Bank, Content Library, and Exams
- Missing: how `getAllCourseChapters()` combines mapped + owned chapters for downstream dropdowns

**3. `question-bank.md` -- Missing filter dependency on master data**
- Documents classification in creation flows but does NOT mention the listing page filters (Subject, Class) that also depend on master data
- Missing: how the Subject filter dropdown on `/superadmin/questions` is populated from master data subjects

**4. `content-library.md` -- Missing filter dependency on master data**
- Documents classification but does NOT mention the listing page filters (Class, Subject, Chapter) that depend on master data
- The `Content.tsx` page has `classFilter`, `subjectFilter` that match against `classId`, `subjectId` from master data

**5. `exams.md` -- Incomplete master data dependency**
- Grand Test creation Step 1 mentions Content Source but does not detail that the curriculum/course selection populates from `getActiveCurriculums()` and `getPublishedCourses()`
- Missing: PYP creation does NOT use master data directly (it uses exam body selection), which should be documented as a distinction

---

## Part 2: Existing Intra-Login Test Coverage Analysis

### Current tests in `superadmin.md` (intra-login)

| Section | Test IDs | What it covers | Gap |
|---------|----------|----------------|-----|
| Curriculum -> Content Library | SA-IL-001 to 003 | Subject appears/removed/renamed in content classification | Missing: Class, Chapter, Topic cascade in content creation; Course-mode chapters in content |
| Curriculum -> Question Bank | SA-IL-004 to 006 | Chapters/Topics available in question classification | Missing: Curriculum/Course toggle; Course-mode chapter listing; Filters on listing page |
| Curriculum -> Courses | SA-IL-007 to 009 | Chapter mapping and renaming | Adequate for basic flow |
| Content Library -> Exams | SA-IL-010 | Classification alignment | Very thin -- only 1 test |
| Question Bank -> Exams | SA-IL-011 to 015 | Question selection and filtering | No master data specific tests |
| Institutes -> Curriculum | SA-IL-021 to 022 | Assignment and removal | Missing: Step 4 wizard dropdown population; Custom course builder |

### MISSING test sections entirely

1. **Curriculum -> Exams (Grand Test creation)** -- No tests for Content Source selection populating from master data
2. **Courses -> Question Bank** -- No tests for Course-mode classification (Course -> Subject -> Chapter -> Topic)
3. **Courses -> Content Library** -- No tests for Course-mode content creation
4. **Courses -> Exams** -- No tests for Course-mode Grand Test creation
5. **Master Data -> Listing Page Filters** -- No tests verifying that Question Bank and Content Library filters reflect master data
6. **Cascade Reset Tests** -- No tests verifying that changing a parent dropdown resets child selections
7. **AI Generation Classification** -- No tests for master data in AI Question Generator or AI Content Generator

---

## Part 3: Proposed Changes

### A. Documentation Updates (2 files)

**File: `docs/01-superadmin/master-data-curriculum.md`**
Add a new section "## Downstream Impact Within SuperAdmin" after the existing "Data Flow" section:

```text
## Downstream Impact Within SuperAdmin

Master Data is consumed by 4 modules within the SuperAdmin panel itself:

### 1. Institute Management
- WHERE: Add Institute Wizard Step 4, Assign Curriculum/Courses dialog
- WHAT: Curriculum checkboxes and Course checkboxes populated from
  getActiveCurriculums() and getPublishedCourses()
- BEHAVIOR: Multi-select, no cascade

### 2. Question Bank
- WHERE: Create Question (classification panel), AI Generator (classification),
  PDF Upload (classification), Question listing (filters)
- CREATION FLOW (Curriculum mode):
  Curriculum -> Class -> Subject -> Chapter -> Topic -> Difficulty -> Cognitive
- CREATION FLOW (Course mode):
  Course -> Subject -> Chapter -> Topic -> Difficulty -> Cognitive
- LISTING FILTERS: Subject dropdown, Class dropdown populated from master data
- CASCADE: Changing Class resets Subject, Chapter, Topic
  Changing Subject resets Chapter, Topic
  Changing Chapter resets Topic

### 3. Content Library
- WHERE: Create Content (classification panel), AI Content Generator,
  Content listing (filters)
- CREATION FLOW (Curriculum mode):
  Curriculum -> Class -> Subject -> Chapter -> Topic
- CREATION FLOW (Course mode):
  Course -> Subject -> Chapter -> Topic
- LISTING FILTERS: Class, Subject, Chapter dropdowns populated from master data
- NOTE: No Difficulty or Cognitive Type (exclusive to Question Bank)

### 4. Exams
- WHERE: Create Grand Test Step 1 (Content Source selection)
- WHAT: Curriculum dropdown from getActiveCurriculums(),
  Course dropdown from getPublishedCourses()
- NOTE: PYP creation uses Exam Body (JEE/NEET) not master data directly
```

**File: `docs/01-superadmin/master-data-courses.md`**
Add a similar "## Downstream Impact Within SuperAdmin" section explaining how Course-mode classification works differently (no Class level, `getAllCourseChapters()` combines mapped + owned).

---

### B. Intra-Login Test Cases (1 file)

**File: `docs/06-testing-scenarios/intra-login-tests/superadmin.md`**
Add the following new test sections:

#### New Section: Curriculum -> Question Bank (Extended)

| Test ID | Test Case | Steps | Expected |
|---------|-----------|-------|----------|
| SA-IL-027 | Curriculum dropdown shows active curriculums | Create question, select Curriculum mode | Only active curriculums in dropdown |
| SA-IL-028 | Class dropdown populates after curriculum | Select curriculum | Classes for that curriculum shown |
| SA-IL-029 | Subject dropdown populates after class | Select class | Subjects for that class shown |
| SA-IL-030 | Chapter dropdown populates after subject | Select subject | Chapters for that subject shown |
| SA-IL-031 | Topic dropdown populates after chapter | Select chapter | Topics for that chapter shown |
| SA-IL-032 | Cascade reset: changing class resets subject/chapter/topic | Change class after full selection | Subject, Chapter, Topic reset to empty |
| SA-IL-033 | Cascade reset: changing subject resets chapter/topic | Change subject | Chapter, Topic reset |
| SA-IL-034 | New chapter appears in question creation | Add chapter in master data, go to create question | New chapter in dropdown |
| SA-IL-035 | Subject filter on listing page uses master data | View question bank listing | Subject dropdown matches master data subjects |
| SA-IL-036 | Class filter on listing page uses master data | View listing | Class dropdown matches master data classes |

#### New Section: Courses -> Question Bank

| Test ID | Test Case | Steps | Expected |
|---------|-----------|-------|----------|
| SA-IL-037 | Course dropdown shows published courses | Create question, select Course mode | Only published courses shown |
| SA-IL-038 | Course chapters include mapped + owned | Select course | Both mapped and course-owned chapters listed |
| SA-IL-039 | Course-owned chapter marked distinctly | View chapter dropdown | Course-exclusive chapters identifiable |
| SA-IL-040 | No Class dropdown in Course mode | Select Course mode | Class field hidden |
| SA-IL-041 | Topics load for course chapters | Select course chapter | Topics shown |

#### New Section: Curriculum -> Content Library (Extended)

| Test ID | Test Case | Steps | Expected |
|---------|-----------|-------|----------|
| SA-IL-042 | Full cascade in content creation (Curriculum) | Create content, Curriculum mode | Curriculum -> Class -> Subject -> Chapter -> Topic all cascade |
| SA-IL-043 | No Difficulty/Cognitive in content | Create content | These fields absent |
| SA-IL-044 | Class filter on listing uses master data | View content listing | Class dropdown matches master data |
| SA-IL-045 | Subject filter on listing uses master data | View content listing | Subject dropdown matches master data |

#### New Section: Courses -> Content Library

| Test ID | Test Case | Steps | Expected |
|---------|-----------|-------|----------|
| SA-IL-046 | Course mode in content creation | Create content, Course mode | Course -> Subject -> Chapter -> Topic (no Class) |
| SA-IL-047 | Course chapters available | Select course | Course chapters in dropdown |

#### New Section: Curriculum/Courses -> Exams

| Test ID | Test Case | Steps | Expected |
|---------|-----------|-------|----------|
| SA-IL-048 | Grand Test Step 1 Curriculum dropdown | Create Grand Test, select Curriculum | Active curriculums shown |
| SA-IL-049 | Grand Test Step 1 Course dropdown | Create Grand Test, select Course | Published courses shown |
| SA-IL-050 | PYP does NOT use curriculum dropdown | Create PYP | Uses Exam Body (JEE/NEET), not curriculum selection |

#### New Section: Curriculum/Courses -> AI Generators

| Test ID | Test Case | Steps | Expected |
|---------|-----------|-------|----------|
| SA-IL-051 | AI Question Generator uses curriculum cascade | Open AI generator, Curriculum mode | Full cascade: Curriculum -> Class -> Subject -> Chapter -> Topics (multi) |
| SA-IL-052 | AI Question Generator uses course cascade | Open AI generator, Course mode | Course -> Subject -> Chapter -> Topics (multi) |
| SA-IL-053 | AI Content Generator uses curriculum cascade | Open AI content generator | Full cascade works |
| SA-IL-054 | AI Content Generator uses course cascade | Open AI content generator, Course mode | Course cascade works |
| SA-IL-055 | PDF Upload uses curriculum cascade | Open PDF upload, Curriculum mode | Curriculum -> Class -> Subject shown (no chapter -- AI detects) |
| SA-IL-056 | PDF Upload uses course cascade | Open PDF upload, Course mode | Course -> Subject shown |

#### New Section: Master Data Deletion/Edit Impact

| Test ID | Test Case | Steps | Expected |
|---------|-----------|-------|----------|
| SA-IL-057 | Renamed subject reflects in Question Bank filters | Rename subject in master data | Filter shows new name |
| SA-IL-058 | Renamed chapter reflects in Content Library | Rename chapter | Content cards show new name |
| SA-IL-059 | Deleted unused topic removed from creation | Delete unused topic | Not in dropdown |
| SA-IL-060 | Delete blocked for chapter with questions | Try delete chapter used by questions | Warning/block |
| SA-IL-061 | Delete blocked for chapter with content | Try delete chapter used by content | Warning/block |

#### Updated Test Execution Order

```text
1. Master Data CRUD (curriculum + courses baseline)
2. Master Data -> Question Bank classification (SA-IL-027 to 041)
3. Master Data -> Content Library classification (SA-IL-042 to 047)
4. Master Data -> Exams (SA-IL-048 to 050)
5. Master Data -> AI Generators (SA-IL-051 to 056)
6. Master Data -> Deletion/Edit impact (SA-IL-057 to 061)
7. Master Data -> Institutes (SA-IL-021 to 022, existing)
8. Question Bank -> Exams (SA-IL-011 to 015, existing)
```

---

## Summary of Deliverables

| Deliverable | File | Action |
|-------------|------|--------|
| Curriculum doc enhancement | `docs/01-superadmin/master-data-curriculum.md` | Add "Downstream Impact" section |
| Courses doc enhancement | `docs/01-superadmin/master-data-courses.md` | Add "Downstream Impact" section |
| Intra-login test expansion | `docs/06-testing-scenarios/intra-login-tests/superadmin.md` | Add 35 new test cases (SA-IL-027 to SA-IL-061) across 6 new sections |

