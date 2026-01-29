

# Comprehensive Documentation Update Plan

## Summary of Your Requirements

Based on your detailed explanation, the following issues need to be addressed across Feature Documentation, Smoke Tests, and Inter/Intra-Login Tests:

---

## PART 1: Tier Management Documentation & Smoke Tests

### Issue 1.1: Tier Management Feature Documentation is Missing

**Current State**: The file `docs/01-superadmin/tier-management.md` does not exist, but it's referenced in `institutes.md`.

**Solution**: Create a comprehensive `tier-management.md` file with:

| Section | Content |
|---------|---------|
| Overview | Purpose: Define feature packages assigned to institutes at creation |
| How Tiers Work | Tiers control which features are enabled/disabled for institutes |
| Feature Categories | Content, Questions, Exams, Analytics, Customization, Support |
| Complete Feature Matrix | Full list of 18+ features with Basic/Pro/Enterprise toggles |
| Institute Connection | When tier assigned → features enabled in institute portal |
| Create Tier Flow | Basic info → User limits → Feature toggles by category |
| Cross-Login Impact | Tier affects what institute sees (Question Bank, AI Generator, etc.) |

**Key Descriptions to Include**:
- Purpose: "Tier Management controls which features each institute has access to. When an institute is created and assigned a tier, only the features enabled in that tier will appear in the institute portal."
- The tier feature list must match ALL institute sidebar items: Dashboard, Batches, Teachers, Students, Timetable, Syllabus Tracker, Question Bank, Content Library, Exams, Master Data, Roles & Access

---

### Issue 1.2: Tier Management Smoke Tests are Missing

**Current State**: No smoke tests exist for `/superadmin/institutes/tiers`

**Solution**: Add a complete "Tier Management Smoke Tests" section with:

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-TM-001 | Tier page loads | Navigate to `/superadmin/institutes/tiers` | Page loads with tier cards and feature comparison table | Critical |
| SA-TM-002 | All tier cards displayed | View page | Basic, Pro, Enterprise cards visible with pricing | High |
| SA-TM-003 | Feature comparison shows all features | Scroll comparison table | All 18+ features listed in categories | Critical |
| SA-TM-004 | Feature categories grouped | View table | Content, Questions, Exams, Analytics, Customization, Support sections | High |
| SA-TM-005 | Edit tier button works | Click "Edit Tier" on any card | Navigates to tier edit page | High |
| SA-TM-006 | Create new tier | Click "Create New Tier" | Form opens with Basic Info, User Limits, Features by Category sections | Critical |
| SA-TM-007 | Basic info form | Fill tier name, price, billing cycle | Form accepts input, validation works | High |
| SA-TM-008 | User limits form | Set max students, max teachers | Limits saved correctly | High |
| SA-TM-009 | Feature toggles work | Toggle each feature category | Toggles enable/disable features | Critical |
| SA-TM-010 | All institute features listed | View feature toggles | Timetable, Syllabus Tracker, AI Question Generator, AI Content Generator, PDF Upload, etc. all present | Critical |
| SA-TM-011 | Save new tier | Complete form, click Save | Tier appears in comparison table | Critical |
| SA-TM-012 | New tier in comparison | After creating tier | New column appears with correct features | High |

---

### Issue 1.3: Tier-to-Institute Cross-Login Test

**Current State**: No explicit test verifies that tier features propagate to institute portal

**Solution**: Add to `docs/06-testing-scenarios/inter-login-tests/` a new section or update existing files:

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| TI-001 | Basic tier institute sees limited features | Create institute with Basic tier, login to institute | AI Question Generator not visible, limited content access |
| TI-002 | Pro tier institute sees AI features | Create institute with Pro tier, login | AI Question Generator visible with limit badge |
| TI-003 | Enterprise tier has all features | Create institute with Enterprise, login | All sidebar items visible, no limits |
| TI-004 | Tier upgrade reflects immediately | Upgrade institute from Basic to Pro | New features appear in institute portal |
| TI-005 | Assigned curriculum appears | Create institute with CBSE assigned | Only CBSE visible in Master Data |
| TI-006 | Assigned course appears | Create institute with JEE assigned | JEE visible alongside curriculum |
| TI-007 | Custom course appears | Create custom course during institute creation | Custom course visible in institute |

---

## PART 2: Question Bank Documentation & Smoke Tests

### Issue 2.1: Question Bank Feature Documentation Updates

**Current State**: `docs/01-superadmin/question-bank.md` exists but lacks detailed classification and propagation rules.

**Updates Required**:

**A. Add Classification Details Section**:

```markdown
## Question Classification

### For Curriculum-Based Questions
When adding questions to a curriculum, 7 tags are required:
1. **Curriculum** (CBSE, ICSE, State Board)
2. **Class** (Class 6-12)
3. **Subject** (Physics, Chemistry, Mathematics, etc.)
4. **Chapter** (specific to curriculum + class + subject)
5. **Topic** (specific to chapter)
6. **Difficulty** (Easy, Medium, Hard, Expert)
7. **Cognitive Type** (Logical, Analytical, Conceptual, Numerical, Application, Memory)

### For Course-Based Questions
When adding questions to a course, 6 tags are required:
1. **Course** (JEE Mains, NEET, Foundation, etc.)
2. **Subject** (Physics, Chemistry, Mathematics, etc.)
3. **Chapter** (course-owned or mapped chapter)
4. **Topic** (specific to chapter)
5. **Difficulty** (Easy, Medium, Hard, Expert)
6. **Cognitive Type** (Logical, Analytical, Conceptual, Numerical, Application, Memory)

Note: Courses do NOT have class context.
```

**B. Add Question Types Detail**:

```markdown
## Nine Question Types

| Type | UI Elements | Answer Format |
|------|-------------|---------------|
| MCQ (Single) | 4 options, radio buttons | One correct |
| Multiple Correct | 4+ options, checkboxes | Multiple correct |
| Numerical | Number input field | Exact value/range |
| True/False | Two radio buttons | Boolean |
| Fill in Blanks | Text with ___blank___ markers | Text per blank |
| Assertion-Reasoning | Assertion + Reason + 4 standard options | One correct option |
| Paragraph Based | Passage + 2-5 sub-questions | Mixed types (MCQ, Multiple, Numerical, Fill, True/False) |
| Short Answer | Text area (100 chars) | Keyword matching |
| Long Answer | Text area (1000 chars) | Manual grading |
```

**C. Add Propagation Rules Section**:

```markdown
## Question Propagation to Institutes

### Critical Business Rule
Questions are ONLY visible to institutes based on their assigned curricula and courses.

**Example**:
- SuperAdmin creates questions under CBSE Class 11 Physics
- SuperAdmin creates questions under JEE Mains Physics
- Institute A is assigned: CBSE, JEE Mains
- Institute B is assigned: ICSE, NEET

**Result**:
- Institute A sees: CBSE questions + JEE Mains questions
- Institute B sees: ICSE questions + NEET questions (NOT CBSE or JEE)

### Verification Required
After adding questions at SuperAdmin level:
1. Login to institute with specific assignments
2. Verify ONLY assigned curriculum/course questions appear
3. Verify OTHER curriculum/course questions do NOT appear

This is a strict boundary that must be enforced.
```

---

### Issue 2.2: Question Bank Smoke Tests - Detailed Update

**Current State**: Basic smoke tests exist but lack detail for all 9 question types and workflows.

**Solution**: Replace/expand the Question Bank smoke tests section:

**Question Bank Page Smoke Tests**:

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-QB-001 | Questions page loads | Navigate to `/superadmin/questions` | Page loads with filters, 3 action buttons (Upload PDF, Generate with AI, Add Question), question cards | Critical |
| SA-QB-002 | Subject filter works | Select subject from dropdown | List filters to selected subject only | High |
| SA-QB-003 | Type filter works | Select MCQ/Numerical/etc | List filters to selected type | High |
| SA-QB-004 | Difficulty filter works | Select Easy/Medium/Hard | List filters to selected difficulty | High |
| SA-QB-005 | Cognitive filter works | Select Logical/Analytical/etc | List filters to selected cognitive type | High |
| SA-QB-006 | Search works | Type in search box | Questions filter by text match | High |
| SA-QB-007 | Question card displays all info | View any question card | Shows: Type badge, Difficulty, Cognitive type, Subject, Chapter, Topic, Curriculum/Course tag | Critical |
| SA-QB-008 | Preview button works | Click preview on any card | Question preview opens with full content, options, solution | Critical |
| SA-QB-009 | View Solution works | Click View Solution in preview | Solution and explanation displayed | High |
| SA-QB-010 | Math type renders | View question with LaTeX | Formulas render correctly via KaTeX | High |
| SA-QB-011 | Images display | View question with images | Images load and display | High |
| SA-QB-012 | Edit button works | Click edit on question | Edit form opens with current values | High |
| SA-QB-013 | Delete button works | Click delete on unused question | Confirmation, then question removed | Medium |

**Create Question Smoke Tests (9 Question Types)**:

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-QB-014 | Create Question page loads | Click "Add Question" | Split screen: Question Details (left) + Classification (right) | Critical |
| SA-QB-015 | Classification required | Fill form but leave chapter empty | Validation error, cannot save | High |
| SA-QB-016 | MCQ Single creation | Select MCQ, fill question text, 4 options, select correct, fill solution, select classification | Question saved, redirects to bank, card displays correctly | Critical |
| SA-QB-017 | Multiple Correct creation | Select Multiple Correct, fill question, options, check 2+ correct answers | Question saved with multiple correct answers | Critical |
| SA-QB-018 | Numerical creation | Select Numerical, fill question, enter numeric answer with range | Question saved with numeric answer | Critical |
| SA-QB-019 | True/False creation | Select True/False, fill question, select True or False | Question saved with boolean answer | Critical |
| SA-QB-020 | Fill in Blanks creation | Select Fill in Blanks, enter question with ___blank___ markers, fill answers per blank | Question saved, blanks count detected, answers saved | Critical |
| SA-QB-021 | Assertion-Reasoning creation | Select Assertion-Reasoning, enter Assertion text, enter Reason text, select correct option (A/B/C/D) | Question saved with standard AR options | Critical |
| SA-QB-022 | Paragraph Based creation | Select Paragraph, enter passage, select 3 sub-questions, configure each sub-question type (MCQ/Multiple/Numerical/Fill/TrueFalse) | All sub-questions saved with passage | Critical |
| SA-QB-023 | Short Answer creation | Select Short Answer, fill question, enter expected answer | Question saved | High |
| SA-QB-024 | Long Answer creation | Select Long Answer, fill question, enter model answer | Question saved | High |
| SA-QB-025 | Each type displays correctly | After creating each type, view in bank | Card shows correct type badge, preview renders correctly | Critical |
| SA-QB-026 | Each type editable | Edit each question type | Edit form shows correct fields for type | High |

**AI Question Generator Smoke Tests**:

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-QB-027 | AI Generator page loads | Click "Generate with AI" | AI Question Generator page opens with classification panel and generation options | Critical |
| SA-QB-028 | Question types multi-select | Click on question types | Can select multiple types simultaneously | High |
| SA-QB-029 | Difficulty selection | Select difficulty levels | Single or multiple difficulties selectable | High |
| SA-QB-030 | Cognitive type selection | Select cognitive types | Selection works | High |
| SA-QB-031 | Number of questions | Enter count (1-50) | Accepts valid number | High |
| SA-QB-032 | Classification: Curriculum flow | Select Curriculum → Class → Subject → Chapter | Each dropdown filters based on previous | High |
| SA-QB-033 | Topic multi-select | After chapter selected, select topics | Can select MULTIPLE topics from list | Critical |
| SA-QB-034 | Additional instructions | Enter custom instructions | Text area accepts input | Medium |
| SA-QB-035 | Generate button works | Fill all required fields, click Generate | Progress indicator, then review page with generated questions | Critical |
| SA-QB-036 | Review page shows questions | After generation | All generated questions displayed with preview | Critical |
| SA-QB-037 | Select/deselect questions | Click checkboxes on questions | Can select/deselect individual questions | High |
| SA-QB-038 | Edit question in review | Click edit on generated question | Can modify before saving | High |
| SA-QB-039 | Add selected to bank | Select questions, click Add to Bank | Selected questions saved, redirects to bank | Critical |
| SA-QB-040 | Verify in bank | After adding | Questions appear with correct classification | Critical |

**Upload PDF Smoke Tests**:

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-QB-041 | Upload PDF page loads | Click "Upload PDF" | 3-step wizard opens: Classification → Upload → Review | Critical |
| SA-QB-042 | Step 1: Classification | Select Curriculum → Class → Subject (no chapter) | Proceeds to Step 2 | High |
| SA-QB-043 | Step 2: Upload file | Select PDF file | File uploads, success message | Critical |
| SA-QB-044 | Step 2: Processing | After upload | "Processing..." indicator, then "Upload successful" | High |
| SA-QB-045 | Step 3: Review page | Navigate to review | Extracted questions displayed in grid | Critical |
| SA-QB-046 | AI-assigned chapter/topic | View extracted questions | Chapter, Topic, Difficulty, Cognitive automatically tagged | Critical |
| SA-QB-047 | OCR verification | View question text | Text extracted correctly, math/images preserved | High |
| SA-QB-048 | Edit in review | Click edit on extracted question | Can modify question, options, classification | High |
| SA-QB-049 | Preview in review | Click preview on question | Full question preview with formatting | High |
| SA-QB-050 | Add to bank | Select questions, click Add to Bank | Questions saved to bank | Critical |
| SA-QB-051 | Verify in bank | After adding | Questions appear with OCR-extracted content | High |

---

### Issue 2.3: Question Propagation Inter-Login Test Updates

**Update**: `docs/06-testing-scenarios/inter-login-tests/` needs expanded question propagation tests

**Add to exam-tests.md or create question-tests.md**:

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| QP-001 | Questions filter by institute curriculum | SA creates CBSE Q, Institute has CBSE assigned | Institute sees CBSE questions |
| QP-002 | Questions filter by institute course | SA creates JEE Q, Institute has JEE assigned | Institute sees JEE questions |
| QP-003 | Unassigned curriculum hidden | SA creates ICSE Q, Institute has only CBSE | Institute does NOT see ICSE questions |
| QP-004 | Unassigned course hidden | SA creates NEET Q, Institute has only JEE | Institute does NOT see NEET questions |
| QP-005 | Mixed assignment works | Institute has CBSE + JEE | Sees both CBSE and JEE questions only |
| QP-006 | Boundary verification | Create test institutes with different assignments | Each sees ONLY their assigned content |
| QP-007 | Global questions read-only at institute | Institute views global question | No edit/delete buttons visible |
| QP-008 | Institute questions editable | Institute creates question | Edit/delete available |

---

## PART 3: Feature Documentation Cross-Check

### Files to Verify & Update:

| File | Check/Update |
|------|--------------|
| `docs/01-superadmin/master-data-curriculum.md` | Verify independent/dependent creation flow documented |
| `docs/01-superadmin/master-data-courses.md` | Verify Course Builder workflow documented |
| `docs/01-superadmin/institutes.md` | Verify 4-step wizard, Create Custom Course, Skip & Create documented |
| `docs/01-superadmin/tier-management.md` | CREATE new file with full tier documentation |
| `docs/01-superadmin/question-bank.md` | Add classification details, 9 types, propagation rules |
| `docs/05-cross-login-flows/question-propagation.md` | Add curriculum/course filtering rules |

---

## PART 4: Smoke Test Description Standards

All smoke test sections will include:

```markdown
### Purpose
[What this module does and why it exists]

### Key Concepts
[Important terminology and relationships]

### Pre-requisites
[What must exist before testing]

### Test Cases
[Table of tests]
```

---

## File Changes Summary

| File | Action | Type |
|------|--------|------|
| `docs/01-superadmin/tier-management.md` | CREATE | New file |
| `docs/01-superadmin/question-bank.md` | UPDATE | Add classification, 9 types, propagation |
| `docs/06-testing-scenarios/smoke-tests/superadmin.md` | UPDATE | Add Tier Management section, expand Question Bank |
| `docs/05-cross-login-flows/question-propagation.md` | UPDATE | Add curriculum/course filtering |
| `docs/06-testing-scenarios/inter-login-tests/exam-tests.md` | UPDATE | Add question propagation boundary tests |
| `docs/01-superadmin/institutes.md` | VERIFY | Ensure tier connection documented |

---

## Execution Order

1. **Create tier-management.md** - Complete feature documentation
2. **Update superadmin smoke tests** - Add Tier Management section with all tests
3. **Update question-bank.md** - Add classification, 9 types, propagation rules
4. **Update superadmin smoke tests** - Expand Question Bank section with all detailed tests
5. **Update question-propagation.md** - Add curriculum/course filtering rules
6. **Update inter-login tests** - Add boundary verification tests for question propagation

