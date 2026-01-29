
# Comprehensive Documentation Update: Exams & Roles and Access

## Summary

Based on my exploration of the current codebase and documentation, I will update the following areas:
1. **Exams Feature Documentation** - Enhance with detailed PYP and Grand Test workflows
2. **Exams Smoke Tests** - Expand from 9 basic tests to 60+ comprehensive tests
3. **Exams Inter-Login Tests** - Add Grand Test assignment flow and schedule/audience propagation tests
4. **Roles & Access Feature Documentation** - Add detailed module permissions and team member workflows
5. **Roles & Access Smoke Tests** - Expand from 9 basic tests to 40+ comprehensive tests
6. **Roles & Access Inter-Login Tests** - Create new file for cross-login permission verification

---

## PART 1: Exams Feature Documentation Updates

### File: `docs/01-superadmin/exams.md`

**Updates Required:**

### 1.1 Add Previous Year Papers Display Section
```markdown
## Previous Year Papers Tab

### Purpose
Previous Year Papers (PYP) are official historical question papers from competitive exams (JEE Mains, JEE Advanced, NEET). They are organized by exam type and displayed year-wise for easy navigation.

### Display Structure
Papers are grouped hierarchically:
- **Exam Type** (JEE Mains, JEE Advanced, NEET)
  - **Year** (2024, 2023, 2022, etc.)
    - **Individual Papers** (with session info if applicable)

### Paper Card Actions
| Action | Icon | Description |
|--------|------|-------------|
| View | Eye | Opens full preview of question paper with all questions |
| Edit | Pencil | Opens review/configure page to modify questions, tagging |
| Stats | BarChart | Shows performance statistics across attempts |
```

### 1.2 Add Grand Tests Section
```markdown
## Grand Tests Tab

### Purpose
Grand Tests are platform-wide mock examinations created by SuperAdmin to be conducted across multiple institutes. They serve as benchmarking assessments where students from different institutes compete together.

### Display Structure
Grand Tests are displayed in a **grid layout** (not year-wise like PYP).

### Grand Test Card Actions
| Action | Icon | Description |
|--------|------|-------------|
| View | Eye | Opens full preview of question paper |
| Edit | Pencil | Opens exam editor to modify questions |
| Schedule | Calendar | Set date and time for exam availability |
| Audience | Users | Select which institutes can take this test |
| Stats | BarChart | View performance analytics |
| Delete | Trash | Remove draft tests |

### Schedule Functionality
- **Purpose**: Set when students can start taking the exam
- **Fields**: Date picker + Time slot selector (30-minute intervals)
- **Constraint**: Can only select future dates
- **Effect**: Students can only start exam after scheduled time

### Audience Functionality
- **Purpose**: Select which institutes participate in this Grand Test
- **Options**:
  - Direct Users (platform-registered students)
  - All Institutes (automatic assignment)
  - Selected Institutes (choose specific ones)
- **Effect**: Only assigned institutes see the test in their portal
- **Cascade**: Institute then assigns to specific batches
```

### 1.3 Update Create PYP Flow
```markdown
## Create Previous Year Paper Flow

### Purpose
Upload official competitive exam papers to create tests that match actual exam format.

### 3-Step Wizard

**Step 1: Exam Configuration**
| Field | Required | Description |
|-------|----------|-------------|
| Competitive Exam | Yes | JEE Main, JEE Advanced, NEET |
| Exam Year | Yes | Year of the paper (2024, 2023, etc.) |
| Session | No | January, February, etc. (for multi-session exams) |
| Paper Name | Yes | Auto-generated from above, can customize |

**Step 2: Upload PDF**
- Upload official question paper PDF (max 50MB)
- System extracts questions, sections, and marking scheme
- Processing indicator shown during extraction

**Step 3: Review & Configure**
- All extracted questions displayed for verification
- Check: 
  - Question count matches original paper
  - Question text, options, solutions correctly extracted
  - Math formulas (LaTeX) render correctly
  - Images/diagrams display properly
  - Chapter/Topic tags AI-assigned correctly
  - Difficulty/Cognitive tags assigned
- Edit any question before publishing
- Publish when verification complete
```

### 1.4 Update Create Grand Test Flow
```markdown
## Create Grand Test Flow

### Purpose
Create mock tests to conduct across institutes for benchmarking.

### 4-Step Wizard

**Step 1: Test Configuration**
| Field | Required | Description |
|-------|----------|-------------|
| Test Name | Yes | Custom name for the test |
| Content Source | Yes | Curriculum OR Course selection |
| Exam Pattern | Yes | JEE Main, JEE Advanced, NEET |

**Step 2: Creation Method**
| Method | Description |
|--------|-------------|
| Generate using AI | AI creates questions based on specifications |
| Upload PDF | Extract questions from existing document |

**Step 3: AI Settings (if AI method)**
| Configuration | Description |
|---------------|-------------|
| Subject Distribution | Questions per subject (Physics, Chemistry, Math/Bio) |
| Difficulty Distribution | Easy %, Medium %, Hard % (must total 100%) |
| Cognitive Distribution | Logical %, Analytical %, Conceptual %, Numerical %, Application %, Memory % (must total 100%) |

**Step 3: Upload PDF (if PDF method)**
- Same as PYP flow

**Step 4: Complete**
- Redirects to Review & Configure page
- Same verification process as PYP
```

### 1.5 Add Cross-Login Assignment Flow
```markdown
## Grand Test Assignment Flow

### SuperAdmin → Institute → Batch → Student

```text
SuperAdmin creates Grand Test
         │
         ▼
SuperAdmin clicks "Audience" → Selects Institutes
         │
         ▼
Selected Institutes see Grand Test in their Exams module
         │
         ▼
Institute assigns Grand Test to specific Batches
         │
         ▼
Students in assigned Batches see test in Tests list
         │
         ▼
Students can start ONLY after scheduled time
```

### Key Business Rules
1. Grand Test created by SA is NOT automatically visible to all institutes
2. SA must explicitly assign via Audience dialog
3. Assigned institutes can only assign to their own batches (not edit test)
4. Only students in assigned batches can attempt
5. Schedule controls when exam becomes available
```

---

## PART 2: Exams Smoke Tests (Complete Overhaul)

### File: `docs/06-testing-scenarios/smoke-tests/superadmin.md`

**Replace Exams Smoke Tests section with:**

### Exams Page Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-EX-001 | Exams page loads | Navigate to `/superadmin/exams` | Page loads with two tabs: Previous Year Papers, Grand Tests | Critical |
| SA-EX-002 | Previous Year Papers tab active by default | Open page | PYP tab highlighted, content shows | High |
| SA-EX-003 | Grand Tests tab switch | Click Grand Tests tab | Tab switches, Grand Tests grid displays | High |
| SA-EX-004 | PYP search works | Enter text in PYP search box | Papers filter by name match | High |
| SA-EX-005 | PYP exam type filter | Select "JEE Main" from filter | Only JEE Main papers display | High |
| SA-EX-006 | GT search works | In Grand Tests tab, enter text | Tests filter by name match | High |
| SA-EX-007 | GT status filter | Select "Scheduled" from status filter | Only scheduled tests display | High |

### PYP Display Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-EX-008 | PYP grouped by exam type | View PYP tab | Papers grouped under JEE Main, JEE Advanced, NEET sections | Critical |
| SA-EX-009 | Year accordion displays | View any exam type section | Years displayed (2024, 2023, etc.) as expandable accordions | Critical |
| SA-EX-010 | Year accordion expands | Click on year accordion | Papers for that year display | High |
| SA-EX-011 | Paper card displays | View any paper in expanded year | Card shows paper name, session, question count | High |
| SA-EX-012 | View button works | Click View on any paper | Redirects to exam review page with question preview | Critical |
| SA-EX-013 | Edit button works | Click Edit on any paper | Redirects to exam review page in edit mode | High |
| SA-EX-014 | Stats button works | Click Stats on any paper | Stats display (or toast if not implemented) | Medium |

### Grand Test Display Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-EX-015 | GT displays in grid | View Grand Tests tab | Tests displayed as cards in grid layout | Critical |
| SA-EX-016 | GT card info displays | View any GT card | Shows: Name, pattern, status badge, question count, created date | High |
| SA-EX-017 | View button works | Click View on GT card | Redirects to exam review page | Critical |
| SA-EX-018 | Edit button works | Click Edit on GT card | Redirects to exam review page | High |
| SA-EX-019 | Schedule button works | Click Schedule on GT card | Schedule dialog opens | Critical |
| SA-EX-020 | Audience button works | Click Audience on GT card | Audience dialog opens | Critical |

### Schedule Dialog Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-EX-021 | Schedule dialog loads | Click Schedule on GT | Dialog opens with date picker and time selector | Critical |
| SA-EX-022 | Date picker works | Click date picker | Calendar opens, can select date | High |
| SA-EX-023 | Past dates disabled | View calendar | Past dates are grayed out/unselectable | Critical |
| SA-EX-024 | Time selector works | Click time dropdown | 30-minute time slots available (00:00 to 23:30) | High |
| SA-EX-025 | Save schedule | Select date and time, click Save | Schedule saved, toast confirmation shown | Critical |
| SA-EX-026 | Cancel schedule | Click Cancel | Dialog closes, no changes saved | Medium |

### Audience Dialog Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-EX-027 | Audience dialog loads | Click Audience on GT | Dialog opens with Direct Users and Institutes sections | Critical |
| SA-EX-028 | Direct Users toggle | Toggle Direct Users switch | Switch enables/disables, count updates | High |
| SA-EX-029 | Institutes toggle | Toggle Institutes switch | Switch enables/disables, institute options appear | High |
| SA-EX-030 | All Institutes option | Select "All Institutes" radio | All institutes count displayed | High |
| SA-EX-031 | Select Specific Institutes | Select "Select Specific Institutes" radio | Institute list appears with checkboxes | Critical |
| SA-EX-032 | Institute checkbox toggle | Check/uncheck institute | Selected count updates | High |
| SA-EX-033 | Select All button | Click "Select All" | All institutes checked | Medium |
| SA-EX-034 | Estimated participants | Make selections | Participant count updates in summary | High |
| SA-EX-035 | Save audience | Make selections, click Save | Audience saved, toast confirmation | Critical |
| SA-EX-036 | Validation - no audience | Uncheck all, try Save | Error: "Please select at least one audience" | High |

### Create PYP Wizard Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-EX-037 | Create PYP page loads | Click "Create Previous Year Paper" | 3-step wizard opens, Step 1 active | Critical |
| SA-EX-038 | Step 1: Competitive Exam selection | Select "JEE Main" | Selection highlighted | Critical |
| SA-EX-039 | Step 1: Year selection | Select year from dropdown | Year selected | Critical |
| SA-EX-040 | Step 1: Session selection (optional) | Select session | Session selected | Medium |
| SA-EX-041 | Step 1: Paper name auto-generates | Select exam type and year | Paper name auto-fills (e.g., "JEE Main 2024") | High |
| SA-EX-042 | Step 1: Paper name editable | Edit auto-generated name | Custom name accepted | Medium |
| SA-EX-043 | Step 1: Next button validation | Leave exam type empty, try Next | Next button disabled | Critical |
| SA-EX-044 | Step 1: Proceed to Step 2 | Fill all required, click Next | Advances to Step 2 | Critical |
| SA-EX-045 | Step 2: Upload area displays | View Step 2 | Drag-drop upload area visible | High |
| SA-EX-046 | Step 2: File upload | Select PDF file | File name displayed, success state | Critical |
| SA-EX-047 | Step 2: Non-PDF rejection | Try to upload non-PDF | Error toast: "Please upload a PDF file" | High |
| SA-EX-048 | Step 2: Large file rejection | Try to upload >50MB file | Error toast: "File size must be less than 50MB" | High |
| SA-EX-049 | Step 2: Upload & Create | Click "Upload & Create Test" | Processing indicator, then Step 3 | Critical |
| SA-EX-050 | Step 3: Success state | After upload completes | Success message, "Review & Configure" button | Critical |
| SA-EX-051 | Step 3: Navigate to review | Click "Review & Configure" | Redirects to exam review page | Critical |

### Create Grand Test Wizard Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-EX-052 | Create GT page loads | Click "Create Grand Test" | 4-step wizard opens, Step 1 active | Critical |
| SA-EX-053 | Step 1: Test name entry | Enter test name | Name accepted | Critical |
| SA-EX-054 | Step 1: Content source toggle | Click Curriculum/Course | Selection toggles correctly | High |
| SA-EX-055 | Step 1: Curriculum dropdown | Select curriculum | Dropdown populates and selects | High |
| SA-EX-056 | Step 1: Course dropdown | Switch to Course, select | Course selected | High |
| SA-EX-057 | Step 1: Pattern selection | Select JEE Main pattern | Pattern highlighted with description | Critical |
| SA-EX-058 | Step 1: Next validation | Leave test name empty | Next disabled | High |
| SA-EX-059 | Step 2: Method selection | View Step 2 | AI Generate and Upload PDF options visible | Critical |
| SA-EX-060 | Step 2: AI method selection | Click "Generate using AI" | AI option highlighted | High |
| SA-EX-061 | Step 2: PDF method selection | Click "Upload PDF" | PDF option highlighted | High |
| SA-EX-062 | Step 3 (AI): Subject distribution | View AI settings | Subject sliders for Physics, Chemistry, Math/Bio | High |
| SA-EX-063 | Step 3 (AI): Difficulty distribution | View difficulty sliders | Easy, Medium, Hard sliders (total 100%) | High |
| SA-EX-064 | Step 3 (AI): Cognitive distribution | View cognitive sliders | All 6 cognitive types with percentages | High |
| SA-EX-065 | Step 3 (AI): Generate | Click "Create Grand Test" | Processing, then Step 4 | Critical |
| SA-EX-066 | Step 4: Success state | After creation | Success message with navigation options | Critical |

---

## PART 3: Exams Inter-Login Tests Updates

### File: `docs/06-testing-scenarios/inter-login-tests/exam-tests.md`

**Add new sections:**

### Grand Test Assignment Flow Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| EX-050 | GT not visible without audience | SA creates GT, does NOT assign audience | Institute does NOT see GT |
| EX-051 | GT visible after audience assigned | SA assigns Institute A in Audience | Institute A sees GT in Exams |
| EX-052 | Unassigned institute doesn't see GT | SA assigns only Institute A | Institute B does NOT see GT |
| EX-053 | Multiple institutes see GT | SA assigns Institute A and B | Both see GT |
| EX-054 | GT read-only at Institute | Institute opens assigned GT | View only, no edit/delete |
| EX-055 | Institute assigns GT to batch | Institute clicks Assign on GT | Batch selection available |
| EX-056 | Unassigned batch doesn't see GT | GT assigned to Batch A only | Batch B students don't see |
| EX-057 | Student sees assigned GT | Student in assigned batch | Test appears in Tests list |

### Schedule Propagation Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| EX-058 | Schedule reflects at Institute | SA schedules GT for tomorrow 9 AM | Institute sees same schedule |
| EX-059 | Student can't start before schedule | GT scheduled for future | "Available at [time]" shown |
| EX-060 | Student can start after schedule | Current time > scheduled time | "Start Test" button active |
| EX-061 | Schedule change propagates | SA changes schedule | Institute/Student see updated time |

### PYP Propagation Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| EX-062 | PYP visible to Institute | SA creates PYP, assigns | Institute sees in PYP tab |
| EX-063 | PYP year grouping at Institute | Institute views PYP | Same year-wise grouping as SA |
| EX-064 | PYP preview works at Institute | Institute clicks View | Full question preview displays |
| EX-065 | PYP read-only at Institute | Institute views PYP | No edit/delete options |

---

## PART 4: Roles & Access Feature Documentation Updates

### File: `docs/01-superadmin/roles-access.md`

**Updates Required:**

### 4.1 Add Role Types Tab Section
```markdown
## Role Types Tab

### Purpose
Role Types define permission templates that can be assigned to team members. Each role type specifies which modules a member can access and what actions they can perform.

### Display
Roles are displayed as cards showing:
- Role name
- Description
- Member count (number of team members with this role)
- System role badge (if applicable)
- Action buttons (Edit, Delete for non-system roles)

### System Roles
System roles are pre-defined and cannot be deleted:
| Role | Description | Editable |
|------|-------------|----------|
| Super Admin | Full access to all modules | No |

### Create Role Flow
1. Click "Create Role" button
2. Fill Basic Info:
   - Role Name (required)
   - Description
3. Configure Module Permissions:
   - Dashboard: View only
   - Institutes: View, Create, Edit, Delete + Tier Management toggle
   - Question Bank: VCUD + Scope (Class/Subject) + Capabilities (Manual, AI, PDF)
   - Exams: VCUD + Types (Grand Tests, PYP) + Scope
   - Content Library: VCUD + Capabilities (Manual, AI) + Scope
   - Master Data: VCUD
   - Users: VCUD
   - Roles & Access: VCUD
4. Click Create
```

### 4.2 Add Team Members Tab Section
```markdown
## Team Members Tab

### Purpose
Team Members are SuperAdmin portal users who have limited access based on their assigned role type. This enables delegation of specific tasks to team members.

### Display
Members displayed in a table showing:
- Name
- Email
- Mobile
- Role Type
- Status (Active/Inactive)
- Created Date
- Actions (Edit, Delete)

### Add Member Flow
1. Click "Add Member" button
2. Fill member details:
   - Full Name (required)
   - Email (required)
   - Mobile Number
   - Select Role Type (required)
   - Set Status (Active/Inactive)
3. Click Save

### Edit Member
- Change role type
- Update status
- Modify contact details
```

### 4.3 Add Module Permissions Detail
```markdown
## Module Permission Matrix

### Permission Types
| Permission | Description |
|------------|-------------|
| View | Can see the module and its content |
| Create | Can create new items (questions, content, exams) |
| Edit | Can modify existing items |
| Delete | Can remove items |

### Special Permissions
| Module | Special Permission | Description |
|--------|-------------------|-------------|
| Institutes | Tier Management | Can create/edit tier plans |
| Question Bank | Scope | Limit to specific classes/subjects |
| Question Bank | Capabilities | Manual, AI Generation, PDF Upload toggles |
| Exams | Types | Grand Tests, Previous Year Papers toggles |
| Exams | Scope | Inherits from Question Bank or custom |
| Content Library | Capabilities | Manual Upload, AI Generation toggles |
| Content Library | Scope | Inherits from Question Bank or custom |

### Scope Configuration
Scope limits visibility to specific classes and/or subjects:
- **All Classes / Specific Classes**: Toggle or multi-select
- **All Subjects / Specific Subjects**: Toggle or multi-select
- **Inherit from Question Bank**: Reuse QB scope for Exams/Content
```

### 4.4 Add Cross-Login Permission Effect
```markdown
## How Permissions Affect Team Member Login

When a team member logs in with their credentials:
1. System loads their assigned role type
2. Sidebar shows ONLY modules they have View permission for
3. Within modules:
   - Create button hidden if no Create permission
   - Edit button hidden if no Edit permission
   - Delete button hidden if no Delete permission
4. Capabilities control available actions:
   - No AI permission = "Generate with AI" button hidden
   - No PDF permission = "Upload PDF" button hidden
5. Scope limits visible content:
   - Only assigned subjects/classes visible in filters and lists

### Example: Content Manager - Physics
```text
Sidebar Shows: Dashboard, Institutes (view only), Content Library, Question Bank
Content Library Actions: Create, Edit (AI hidden, only Manual Upload)
Question Bank Actions: Create, Edit (AI, PDF visible)
Visible Content: Only Physics questions/content
```

### Content Created by Team Member
- Content is NOT exclusive to the team member
- All content created appears in SuperAdmin view
- Follows global visibility rules (curriculum/course assignment)
- SuperAdmin can edit/delete content created by team members
```

---

## PART 5: Roles & Access Smoke Tests

### File: `docs/06-testing-scenarios/smoke-tests/superadmin.md`

**Replace Roles & Access section with:**

### Roles & Access Page Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-RA-001 | Roles page loads | Navigate to `/superadmin/roles` | Page loads with two tabs: Role Types, Team Members | Critical |
| SA-RA-002 | Role Types tab active by default | Open page | Role Types tab highlighted, role cards display | High |
| SA-RA-003 | Team Members tab switch | Click Team Members tab | Tab switches, member table displays | High |
| SA-RA-004 | Create Role button visible | View Role Types tab | "Create Role" button in header | High |
| SA-RA-005 | Add Member button visible | View Team Members tab | "Add Member" button in header | High |

### Role Types Tab Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-RA-006 | Role cards display | View Role Types | Cards show name, description, member count | High |
| SA-RA-007 | System role badge | View Super Admin card | "System" badge visible | Medium |
| SA-RA-008 | System role no delete | View Super Admin card | No Delete button | Critical |
| SA-RA-009 | Custom role has edit/delete | View custom role card | Edit and Delete buttons visible | High |

### Create Role Dialog Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-RA-010 | Create role dialog opens | Click "Create Role" | Dialog opens with form | Critical |
| SA-RA-011 | Role name required | Leave name empty, try save | Save disabled | Critical |
| SA-RA-012 | Description optional | Leave description empty, fill name | Can save | Medium |
| SA-RA-013 | Dashboard permission | View Dashboard section | Only View toggle available | High |
| SA-RA-014 | Institutes permissions | View Institutes section | View, Create, Edit, Delete + Tier Management | High |
| SA-RA-015 | Tier Management toggle | Toggle Tier Management | Checkbox works | High |
| SA-RA-016 | Question Bank permissions | View Question Bank section | VCUD + Scope + Capabilities sections | Critical |
| SA-RA-017 | QB Scope - All Classes | Toggle "All Classes" | All classes selected | High |
| SA-RA-018 | QB Scope - Specific Classes | Uncheck All Classes | Class multi-select appears | High |
| SA-RA-019 | QB Capabilities - Manual | Toggle Manual | Checkbox toggles | High |
| SA-RA-020 | QB Capabilities - AI | Toggle AI Generation | Checkbox toggles | High |
| SA-RA-021 | QB Capabilities - PDF | Toggle PDF Upload | Checkbox toggles | High |
| SA-RA-022 | Exams permissions | View Exams section | VCUD + Types + Scope | Critical |
| SA-RA-023 | Exams Types - Grand Tests | Toggle Grand Tests | Checkbox toggles | High |
| SA-RA-024 | Exams Types - PYP | Toggle Previous Year Papers | Checkbox toggles | High |
| SA-RA-025 | Exams Scope inherit | View Scope section | "Inherit from QB" option available | High |
| SA-RA-026 | Content Library permissions | View Content Library section | VCUD + Capabilities + Scope | Critical |
| SA-RA-027 | CL Capabilities | Toggle Manual Upload, AI | Checkboxes toggle | High |
| SA-RA-028 | Master Data permissions | View Master Data section | VCUD toggles | High |
| SA-RA-029 | Users permissions | View Users section | VCUD toggles | High |
| SA-RA-030 | Roles & Access permissions | View Roles & Access section | VCUD toggles | High |
| SA-RA-031 | Save new role | Fill form, click Create | Role card appears in list, toast confirmation | Critical |
| SA-RA-032 | Cancel create | Click Cancel | Dialog closes, no role created | Medium |

### Edit Role Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-RA-033 | Edit dialog opens | Click Edit on role card | Dialog opens with pre-filled values | Critical |
| SA-RA-034 | Name pre-filled | View dialog | Role name shown | High |
| SA-RA-035 | Permissions pre-filled | View dialog | Current permissions reflected | High |
| SA-RA-036 | Save changes | Modify and save | Role updated, toast confirmation | Critical |

### Delete Role Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-RA-037 | Delete custom role | Click Delete on custom role | Role removed, toast confirmation | High |
| SA-RA-038 | System role protected | Try to delete Super Admin | Delete button not available | Critical |

### Team Members Tab Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-RA-039 | Member table displays | View Team Members tab | Table with columns: Name, Email, Role, Status, Actions | Critical |
| SA-RA-040 | Member row shows role | View any row | Role type name displayed | High |
| SA-RA-041 | Edit button visible | View member row | Edit action available | High |
| SA-RA-042 | Delete button visible | View member row | Delete action available | High |

### Add Member Dialog Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-RA-043 | Add member dialog opens | Click "Add Member" | Dialog opens with form | Critical |
| SA-RA-044 | Name required | Leave name empty | Save disabled | Critical |
| SA-RA-045 | Email required | Leave email empty | Save disabled | Critical |
| SA-RA-046 | Mobile optional | Leave mobile empty | Can save | Medium |
| SA-RA-047 | Role type dropdown | Click role type | All created roles available | Critical |
| SA-RA-048 | Status toggle | Toggle Active/Inactive | Status changes | High |
| SA-RA-049 | Save member | Fill form, save | Member appears in table, toast confirmation | Critical |
| SA-RA-050 | Role member count updates | After adding member | Role card shows incremented count | High |

### Edit Member Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-RA-051 | Edit member dialog opens | Click Edit on member | Dialog with pre-filled values | Critical |
| SA-RA-052 | Change role type | Select different role | Change accepted | High |
| SA-RA-053 | Save member changes | Modify and save | Member updated, toast | Critical |

### Delete Member Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-RA-054 | Delete member | Click Delete on member | Member removed, toast | High |
| SA-RA-055 | Role count decrements | After delete | Role card shows decremented count | High |

---

## PART 6: Roles & Access Inter-Login Tests (NEW FILE)

### File: `docs/06-testing-scenarios/inter-login-tests/roles-access-tests.md`

**Create new file with:**

```markdown
# Roles & Access Cross-Portal Tests

> Tests for role permissions affecting team member login experience.

---

## Overview

These tests verify that role permissions correctly control what team members can see and do when they log in. The principle is: permissions defined in SuperAdmin must accurately reflect in the team member's portal experience.

---

## Sidebar Visibility Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| RA-001 | Only permitted modules in sidebar | Create role with only QB View, assign to member, member logs in | Member sidebar shows only Dashboard, Question Bank |
| RA-002 | All modules with full permissions | Assign role with all View permissions | All modules visible in sidebar |
| RA-003 | Institutes visibility | Role has Institutes View | Institutes visible in sidebar |
| RA-004 | Institutes hidden | Role has NO Institutes View | Institutes NOT in sidebar |
| RA-005 | Exams visibility | Role has Exams View | Exams visible in sidebar |
| RA-006 | Content Library visibility | Role has Content View | Content Library visible in sidebar |
| RA-007 | Roles & Access visibility | Role has Roles View | Roles & Access visible in sidebar |

---

## Action Button Visibility Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| RA-008 | Create button with permission | Role has QB Create | "Add Question" button visible |
| RA-009 | Create button without permission | Role has QB View only | "Add Question" button hidden |
| RA-010 | Edit button with permission | Role has QB Edit | Edit button on question cards |
| RA-011 | Edit button without permission | Role has QB View only | No Edit button on cards |
| RA-012 | Delete button with permission | Role has QB Delete | Delete button on cards |
| RA-013 | Delete button without permission | Role has no QB Delete | No Delete button on cards |

---

## Capability Visibility Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| RA-014 | AI Generation enabled | Role has QB + AI capability | "Generate with AI" button visible |
| RA-015 | AI Generation disabled | Role has QB + NO AI | "Generate with AI" button hidden |
| RA-016 | PDF Upload enabled | Role has QB + PDF capability | "Upload PDF" button visible |
| RA-017 | PDF Upload disabled | Role has QB + NO PDF | "Upload PDF" button hidden |
| RA-018 | Manual only | Role has QB + Manual only | Only "Add Question" visible, AI/PDF hidden |
| RA-019 | Content AI enabled | Role has CL + AI capability | AI Content Generator button visible |
| RA-020 | Content AI disabled | Role has CL + NO AI | AI Content Generator hidden |

---

## Scope Restriction Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| RA-021 | All subjects visible | Role scope: All Subjects | All subjects in filters |
| RA-022 | Specific subjects only | Role scope: Physics, Chemistry only | Only Physics, Chemistry in subject filter |
| RA-023 | Filtered questions | Role scope: Physics only | Only Physics questions displayed |
| RA-024 | Create within scope | Role scope: Physics, member creates | Question saved, visible to SA |
| RA-025 | All classes visible | Role scope: All Classes | All classes in filters |
| RA-026 | Specific classes only | Role scope: Class 11, 12 | Only 11, 12 in class filter |

---

## Exam Type Restriction Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| RA-027 | Grand Tests enabled | Role has Exams + GT type | Grand Tests tab visible |
| RA-028 | Grand Tests disabled | Role has Exams + NO GT | Grand Tests tab hidden or disabled |
| RA-029 | PYP enabled | Role has Exams + PYP type | Previous Year Papers tab visible |
| RA-030 | PYP disabled | Role has Exams + NO PYP | PYP tab hidden or disabled |
| RA-031 | Both types enabled | Role has both types | Both tabs functional |

---

## Content Creation Attribution Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| RA-032 | Team member creates content | Member creates question | Question visible in SuperAdmin QB |
| RA-033 | Team member creates exam | Member creates GT (if permitted) | GT visible in SuperAdmin Exams |
| RA-034 | SuperAdmin can edit member content | View question created by member | Edit/Delete available for SA |
| RA-035 | Content follows visibility rules | Member creates with CBSE visibility | CBSE institutes can see content |
| RA-036 | No exclusive content | Member creates content | Content NOT hidden from SA or other members |

---

## Tier Management Permission Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| RA-037 | Tier Management enabled | Role has Institutes + Tier Mgmt | Tier Management accessible |
| RA-038 | Tier Management disabled | Role has Institutes + NO Tier | Tier page/section not accessible |
| RA-039 | Can create tier | Role has Tier + Create | Create Tier button works |
| RA-040 | Can only view tiers | Role has Tier view only | View tiers, no create/edit buttons |

---

## Edge Cases

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| RA-041 | Role change reflects | Change member's role | Next login shows new permissions |
| RA-042 | Member deactivated | Set member status Inactive | Cannot log in |
| RA-043 | Member reactivated | Set member status Active | Can log in again |
| RA-044 | Delete role with members | Try to delete role with assigned members | Warning or prevented |
| RA-045 | Empty scope | Role has QB but no subjects selected | No content visible (or all - verify behavior) |

---

*Last Updated: January 2025*
```

---

## PART 7: Navigation Update

### File: `src/data/docsNavigation.ts`

**Add Roles & Access Inter-Login Tests to navigation:**

In the Inter-Login Tests section (around line 169-175), add:
```typescript
{ title: "Roles & Access Tests", path: "06-testing-scenarios/inter-login-tests/roles-access-tests" },
```

---

## File Changes Summary

| File | Action | Changes |
|------|--------|---------|
| `docs/01-superadmin/exams.md` | UPDATE | Add PYP display structure, GT actions (Schedule, Audience), creation flows, assignment flow |
| `docs/01-superadmin/roles-access.md` | UPDATE | Add Role Types detail, Team Members detail, module permissions matrix, cross-login effect |
| `docs/06-testing-scenarios/smoke-tests/superadmin.md` | UPDATE | Replace Exams tests (9 → 66), replace Roles tests (9 → 55) |
| `docs/06-testing-scenarios/inter-login-tests/exam-tests.md` | UPDATE | Add GT assignment flow (8 tests), schedule propagation (4 tests), PYP propagation (4 tests) |
| `docs/06-testing-scenarios/inter-login-tests/roles-access-tests.md` | CREATE | New file with 45 cross-login permission tests |
| `src/data/docsNavigation.ts` | UPDATE | Add Roles & Access Tests to Inter-Login navigation |

---

## Execution Order

1. Update `docs/01-superadmin/exams.md` - Add PYP/GT display, actions, flows
2. Update `docs/06-testing-scenarios/smoke-tests/superadmin.md` - Replace Exams section with 66 tests
3. Update `docs/06-testing-scenarios/inter-login-tests/exam-tests.md` - Add 16 new assignment/schedule tests
4. Update `docs/01-superadmin/roles-access.md` - Add Role Types, Team Members, permissions detail
5. Update `docs/06-testing-scenarios/smoke-tests/superadmin.md` - Replace Roles section with 55 tests
6. Create `docs/06-testing-scenarios/inter-login-tests/roles-access-tests.md` - New file with 45 tests
7. Update `src/data/docsNavigation.ts` - Add Roles & Access Tests navigation
