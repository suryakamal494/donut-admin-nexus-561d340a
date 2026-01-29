

# Comprehensive Documentation Update Plan: Content Library & Question Bank Enhancements

## Summary of Your Requirements

Based on your detailed instructions, the following areas need to be updated:

---

## PART 1: Question Bank Smoke Test Enhancements

### Issue 1.1: Add Display Verification to Manual Question Creation

**Current Gap**: Expected results don't explicitly mention verification of math type, images, LaTeX, ChemSketch display after saving.

**Solution**: Update smoke tests SA-QB-016 through SA-QB-024 to include display verification in expected results:

| Test ID | Current Expected Result | Updated Expected Result |
|---------|------------------------|-------------------------|
| SA-QB-016 | Question saved, redirects to bank, card displays correctly with MCQ badge | Question saved, redirects to bank. **Verify**: Card displays MCQ badge, question text renders correctly (math formulas via KaTeX, images display, ChemSketch diagrams visible), all classification tags shown (Subject, Chapter, Topic, Difficulty, Cognitive) |
| SA-QB-017 to SA-QB-024 | Similar updates for each question type | Add math type, image, and tag verification to each |

### Issue 1.2: AI Question Generator - Add Tag Verification

**Current Gap**: SA-QB-040 doesn't explicitly verify all classification tags are correctly assigned.

**Solution**: Expand SA-QB-039 and SA-QB-040:

| Test ID | Updated Expected Result |
|---------|-------------------------|
| SA-QB-039 | Selected questions saved to bank. **Verify**: All 7 tags (Curriculum, Class, Subject, Chapter, Topic, Difficulty, Cognitive) OR 6 tags for Course automatically assigned |
| SA-QB-040 | Questions appear with: (1) Correct classification tags displayed, (2) Math formulas rendered, (3) Images intact, (4) AI-assigned difficulty/cognitive visible |

### Issue 1.3: Upload PDF - Add Tag & OCR Verification

**Current Gap**: SA-QB-046-051 need stronger emphasis on verifying AI-assigned tags and OCR quality.

**Solution**: Expand expected results:

| Test ID | Updated Expected Result |
|---------|-------------------------|
| SA-QB-046 | **Critical Check**: Chapter, Topic, Difficulty, Cognitive Type automatically tagged by AI. Verify all fields populated (no empty tags) |
| SA-QB-047 | LaTeX formulas extracted correctly. **Verify**: Mathematical expressions render via KaTeX, no broken symbols or garbled text |
| SA-QB-048 | Images extracted. **Verify**: All diagrams/images from PDF display correctly, no missing images |
| SA-QB-051 | After adding to bank, **full verification cycle**: Preview each type, verify math/images render, confirm all 7/6 tags assigned and displayed on card |

---

## PART 2: Content Library Smoke Tests - Complete Overhaul

### Issue 2.1: Current Content Library Smoke Tests are Too Basic

**Current State** (from file review):
```
| SA-CL-001 | Content page loads | Navigate to `/superadmin/content` | Grid loads | Critical |
| SA-CL-002 | Filters work | Apply type/class/subject filters | Grid filters | High |
... (8 basic tests total)
```

**Solution**: Replace with comprehensive 40+ test cases organized by functionality.

### Content Library Page Smoke Tests (NEW)

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-CL-001 | Content library page loads | Navigate to `/superadmin/content` | Page loads with header, search bar, filters, view toggle (Grid/List), two action buttons (Create Content, AI Content Generator), content grid, and pagination | Critical |
| SA-CL-002 | Default view is Grid | Open content library | Grid view is active by default | High |
| SA-CL-003 | Search by title works | Enter title text in search box | Content filters by title match | Critical |
| SA-CL-004 | Search by description works | Enter description text in search | Content filters by description match | High |
| SA-CL-005 | Search clears correctly | Click clear/X on search | All content displays again | Medium |
| SA-CL-006 | Type filter works | Select "Video" from type filter | Only video content displays | High |
| SA-CL-007 | Subject filter works | Select "Physics" from subject filter | Only Physics content displays | High |
| SA-CL-008 | Class filter works | Select "Class 11" | Content filters to Class 11 only | High |
| SA-CL-009 | Chapter filter works | Select chapter | Content filters to that chapter | Medium |
| SA-CL-010 | Multiple filters combine | Apply type + subject + class | Content matches ALL selected filters | Critical |
| SA-CL-011 | Filter reset works | Click reset/clear all | All filters cleared, full content shown | Medium |
| SA-CL-012 | Grid view displays cards | View in Grid mode | Content cards with thumbnail, title, type badge, actions visible | High |
| SA-CL-013 | List view displays rows | Click List view toggle | Content displays as rows with details | High |
| SA-CL-014 | Toggle between views | Switch Grid → List → Grid | View changes correctly, content intact | Medium |
| SA-CL-015 | Pagination displays | Scroll to bottom | Page numbers or Load More visible | High |
| SA-CL-016 | Pagination navigation | Click page 2 or Load More | New content loads, page updates | High |
| SA-CL-017 | Pagination with filters | Apply filter, then paginate | Pagination respects active filters | High |

### Content Card Functionality Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-CL-018 | Preview button works | Click Preview on any card | Preview dialog/page opens showing full content | Critical |
| SA-CL-019 | Video preview plays | Preview a video content | Video player loads, playback works | Critical |
| SA-CL-020 | PDF preview displays | Preview a PDF document | PDF viewer loads, pages viewable | Critical |
| SA-CL-021 | PPT preview displays | Preview a PPT document | Presentation viewer loads, slides navigable | Critical |
| SA-CL-022 | HTML content preview | Preview HTML content | HTML renders correctly in iframe | High |
| SA-CL-023 | External URL preview | Preview YouTube/external URL | Embed displays, video playable | Critical |
| SA-CL-024 | Edit button works | Click Edit on any card | Edit form opens with pre-filled values | Critical |
| SA-CL-025 | Edit saves changes | Modify title, save | Changes saved, reflected in list | High |
| SA-CL-026 | Delete button works | Click Delete on content | Confirmation dialog appears | High |
| SA-CL-027 | Delete confirmation | Confirm deletion | Content removed from list | Medium |
| SA-CL-028 | Content type badge visible | View any card | Type badge (Video, PDF, PPT, etc.) displayed | Medium |
| SA-CL-029 | Classification visible | View any card | Subject, Chapter visible on card | Medium |

---

## PART 3: Create Content Smoke Tests (4 Content Types)

### Purpose Section to Add

```markdown
### Purpose

The Create Content feature allows SuperAdmin to add educational content to the global library. Content is classified by curriculum/course hierarchy and made visible to institutes based on visibility settings.

**Four Content Types:**
1. **Video** - Upload MP4, WebM, MOV files for lecture videos
2. **Document** - Upload PDF, PPT, PPTX, DOC, DOCX for reading materials
3. **HTML** - Upload HTML/HTM files for interactive content or iframe embeds
4. **External URL** - Embed YouTube, Vimeo, Google Slides, or other external services

**Classification Rules:**
- Curriculum: Curriculum → Class → Subject → Chapter → Topic (all mandatory)
- Course: Course → Subject → Chapter → Topic (all mandatory)

**Visibility Purpose:**
Content can be visible across multiple curricula and courses simultaneously. When creating content, selecting multiple curricula/courses means:
- Content appears for ALL institutes assigned those curricula/courses
- Strict boundary: If content is tagged CBSE, institutes with only ICSE won't see it
```

### Create Content Smoke Tests (NEW)

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-CC-001 | Create Content page loads | Click "Create Content" button | Split screen: Content Type & Upload (left 2/3) + Classification & Visibility (right 1/3) | Critical |
| SA-CC-002 | Four content types visible | View content type section | Video, Document, HTML, External URL cards displayed | Critical |
| SA-CC-003 | Video type selection | Click Video type card | Card selected (highlighted), file upload shows "MP4, WebM, MOV" | High |
| SA-CC-004 | Document type selection | Click Document type card | Card selected, file upload shows "PDF, PPT, DOC" | High |
| SA-CC-005 | HTML type selection | Click HTML type card | Card selected, file upload shows "HTML, HTM" | High |
| SA-CC-006 | External URL selection | Click External URL type | URL input field appears instead of file upload | High |

### Classification Validation Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-CC-007 | Curriculum source requires all fields | Select Curriculum, leave Chapter empty, try Save | Validation error: "Please select Chapter" | Critical |
| SA-CC-008 | Topic is mandatory | Select Curriculum → Class → Subject → Chapter, leave Topic empty, try Save | Validation error: "Please select Topic" | Critical |
| SA-CC-009 | Course source requires all fields | Select Course mode, leave Chapter empty, try Save | Validation error: "Please select Chapter" | Critical |
| SA-CC-010 | Classification cascade | Select Class | Subject dropdown populates with subjects for that class | High |
| SA-CC-011 | Chapter cascade | Select Subject | Chapter dropdown populates with chapters for that subject | High |
| SA-CC-012 | Topic cascade | Select Chapter | Topic dropdown populates with topics for that chapter | High |

### Visibility Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-CC-013 | Visibility section present | View Classification sidebar | Visibility section with curriculum/course checkboxes visible | Critical |
| SA-CC-014 | Multiple curriculum selection | Check CBSE, ICSE, State Board | All three selected, shown in selection | High |
| SA-CC-015 | Multiple course selection | Check JEE, NEET | Both courses selected | High |
| SA-CC-016 | Mixed visibility | Select CBSE curriculum + JEE course | Both visible in selection summary | High |

### Content Type-Specific Creation Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-CC-017 | Video upload flow | Select Video, upload MP4, fill title, select classification, save | Content saved, redirects to library | Critical |
| SA-CC-018 | Video preview verification | After saving, click Preview on new video | Video plays correctly, no errors | Critical |
| SA-CC-019 | Document PDF upload | Select Document, upload PDF, fill details, save | PDF content saved | Critical |
| SA-CC-020 | PDF preview verification | Preview the uploaded PDF | PDF displays, pages navigable, no "document not supported" error | Critical |
| SA-CC-021 | Document PPT upload | Select Document, upload PPTX, fill details, save | PPT content saved | Critical |
| SA-CC-022 | PPT preview verification | Preview the uploaded PPT | Slides display correctly, navigation works | Critical |
| SA-CC-023 | HTML file upload | Select HTML, upload .html file, fill details, save | HTML content saved | High |
| SA-CC-024 | HTML preview verification | Preview the HTML content | HTML renders in iframe, no 504 or server errors | High |
| SA-CC-025 | External URL - YouTube | Select External URL, paste YouTube embed URL, save | Content saved with URL | Critical |
| SA-CC-026 | YouTube preview verification | Preview the YouTube content | Video embeds and plays correctly, no "error with link" | Critical |
| SA-CC-027 | External URL - Vimeo | Select External URL, paste Vimeo URL, save | Content saved | High |
| SA-CC-028 | External URL - Google Slides | Select External URL, paste Google Slides embed, save | Content saved | High |
| SA-CC-029 | Google Slides preview | Preview Google Slides content | Slides display in embed | High |

### Complete Cycle Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-CC-030 | Create → View → Edit cycle | Create video, preview, then edit | Full cycle works: Create saves, Preview shows video, Edit opens form with values | Critical |
| SA-CC-031 | Edit updates correctly | In Edit, change title, save | Title updated in library view | High |
| SA-CC-032 | Content visible after refresh | Create content, refresh page | New content visible in library | High |

---

## PART 4: AI Content Generator Smoke Tests (Complete)

### Purpose Section to Add

```markdown
### Purpose

The AI Content Generator creates PowerPoint presentations automatically based on classification and prompts. Teachers and institutes use this to quickly generate teaching materials.

**3-Step Process:**
1. **Step 1 - Classification**: Select curriculum/course → class → subject → chapter → topic + set visibility
2. **Step 2 - Prompt**: Describe content needs, select detailed/concise style, set slide count
3. **Step 3 - Preview & Edit**: Review generated slides, reorder via drag-drop, edit content, save to library

**Output**: PowerPoint-style presentations saved as library content
```

### AI Content Generator Tests (NEW)

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-AG-001 | AI Generator page loads | Click "AI Content Generator" button | 3-step wizard opens with Step 1 (Classification) active | Critical |
| SA-AG-002 | Step indicator visible | View header | Steps 1-2-3 indicator shows Step 1 highlighted | Medium |

### Step 1 - Classification Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-AG-003 | Classification panel visible | View Step 1 | Source type toggle, curriculum/course dropdowns, visibility section | Critical |
| SA-AG-004 | Curriculum flow | Select Curriculum → Class → Subject → Chapter → Topic | All dropdowns cascade correctly | Critical |
| SA-AG-005 | Course flow | Switch to Course, select Course → Chapter → Topic | Dropdowns work for course mode | High |
| SA-AG-006 | Visibility multi-select | Check multiple curricula/courses in visibility | All selected items shown | High |
| SA-AG-007 | Cannot proceed without classification | Leave Chapter empty, click Next | Next button disabled or validation error | Critical |
| SA-AG-008 | Proceed to Step 2 | Complete classification, click Next | Advances to Step 2 | Critical |

### Step 2 - Prompt Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-AG-009 | Prompt section visible | View Step 2 | Text area for prompt, style selector (Detailed/Concise), slide count slider | Critical |
| SA-AG-010 | Prompt text area | Enter detailed prompt (50+ characters) | Text accepted | High |
| SA-AG-011 | Style preset selection | Click "Concise" | Concise option selected | Medium |
| SA-AG-012 | Slide count slider | Adjust slider to 15 slides | Slider updates, count shows "15" | Medium |
| SA-AG-013 | Minimum prompt validation | Enter less than 20 characters, try Generate | Validation error or Generate disabled | High |
| SA-AG-014 | Generate button | Complete prompt, click "Generate Presentation" | Loading indicator appears | Critical |
| SA-AG-015 | Generation progress | Wait during generation | Progress/spinner visible, then Step 3 loads | Critical |

### Step 3 - Preview & Edit Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-AG-016 | Slides generated | After generation | Slide thumbnails on left, full slide preview on right | Critical |
| SA-AG-017 | Slide count matches | Requested 10 slides | 10 slide thumbnails visible | High |
| SA-AG-018 | Slide navigation | Click slide 3 thumbnail | Slide 3 displays in preview panel | High |
| SA-AG-019 | Drag and drop reorder | Drag slide 2 to position 5 | Slide order updates, slide 2 now in position 5 | High |
| SA-AG-020 | Content stays within slides | View any slide | Text/content contained within slide boundaries, not overflowing | Critical |
| SA-AG-021 | Edit slide content | Click on slide text, modify | Text updates in real-time | High |
| SA-AG-022 | Delete slide | Click delete on slide 3 | Slide removed, count decreases | Medium |
| SA-AG-023 | Duplicate slide | Click duplicate on slide 1 | New slide added after slide 1 | Medium |
| SA-AG-024 | Save to Library button | Click "Save to Library" | Presentation saved, redirects to Content Library | Critical |

### Post-Save Verification Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| SA-AG-025 | Content visible in library | After save, view Content Library | New AI-generated presentation appears in list | Critical |
| SA-AG-026 | Preview generated content | Click Preview on new content | All slides display correctly | Critical |
| SA-AG-027 | Edit generated content | Click Edit on new content | Edit form opens, can modify details | High |
| SA-AG-028 | Classification correct | View content card | Correct subject, chapter, topic displayed | High |

---

## PART 5: Content Library Cross-Login Tests (Inter-Login)

### Add to `docs/06-testing-scenarios/inter-login-tests/content-tests.md`

#### New Section: Content Visibility Based on Curriculum/Course Assignment

```markdown
## Content Visibility Based on Curriculum Assignment

### Purpose
Content visibility is STRICTLY controlled by institute curriculum/course assignments. When SuperAdmin creates content with visibility set to specific curricula/courses, only institutes with matching assignments can access that content.

### Critical Business Rules
1. Content tagged with CBSE is ONLY visible to institutes assigned CBSE
2. Content tagged with ICSE is NOT visible to CBSE-only institutes
3. Content tagged with BOTH CBSE and ICSE is visible to BOTH types of institutes
4. Tier must enable Content Library access for content to be visible

### Boundary Enforcement
This is the most critical test - strict boundaries must be enforced to prevent content leakage between curricula/courses.
```

#### New Test Cases

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CT-040 | CBSE content to CBSE institute | SA creates content with CBSE visibility, Institute has CBSE | Content visible in institute library |
| CT-041 | CBSE content NOT to ICSE institute | SA creates content with CBSE visibility, Institute has only ICSE | Content NOT visible in institute library |
| CT-042 | Multi-curriculum content visibility | SA creates content with CBSE + ICSE, Institute has CBSE | Content visible |
| CT-043 | Course-based visibility | SA creates content with JEE visibility, Institute has JEE | Content visible |
| CT-044 | Course content NOT to non-assigned | SA creates JEE content, Institute has only NEET | Content NOT visible |
| CT-045 | Mixed curriculum + course | SA creates CBSE + JEE content, Institute has CBSE only | Content visible (has CBSE) |
| CT-046 | Tier blocks content access | Institute tier has Content Library disabled | Content Library not in sidebar, no access |
| CT-047 | Tier enables content access | Institute tier has Content Library enabled | Content Library visible in sidebar |

#### Content Preview Across Logins

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CT-048 | Video preview works at SA | SA creates video, previews | Video plays correctly |
| CT-049 | Same video at Institute | Institute views same video | Video plays correctly (no errors) |
| CT-050 | Same video at Teacher | Teacher views same video | Video plays correctly |
| CT-051 | PDF preview works at SA | SA creates PDF, previews | PDF displays |
| CT-052 | Same PDF at Institute | Institute views same PDF | PDF displays (no "not supported" error) |
| CT-053 | Same PDF at Teacher | Teacher views same PDF | PDF displays correctly |
| CT-054 | PPT preview works at SA | SA creates PPT, previews | PPT displays |
| CT-055 | Same PPT at Institute | Institute views same PPT | PPT displays (no errors) |
| CT-056 | HTML preview across logins | SA creates HTML, Institute/Teacher view | HTML renders in all portals |
| CT-057 | External URL across logins | SA creates YouTube embed, all portals view | Video plays in all portals |

#### Institute-Created Content Privacy

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CT-058 | Institute A content NOT visible to SA | Institute A creates content | SuperAdmin CANNOT see Institute A's content |
| CT-059 | Institute A content NOT visible to Institute B | Institute A creates content | Institute B CANNOT see Institute A's content |
| CT-060 | Institute content visible to own teachers | Institute creates content | Teachers of that institute CAN see content |
| CT-061 | Institute content NOT visible to other teachers | Institute A creates content | Teachers of Institute B CANNOT see content |

#### Global Content Read-Only Enforcement

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CT-062 | Global content read-only at Institute | Institute views global content | No Edit/Delete buttons visible, only Preview |
| CT-063 | Global content read-only at Teacher | Teacher views global content | No Edit/Delete buttons visible, only Preview |
| CT-064 | Institute content editable by Institute | Institute views own content | Edit/Delete buttons available |

---

## PART 6: Feature Documentation Updates

### File: `docs/01-superadmin/content-library.md`

**Updates Required:**

1. **Replace Content Types Section**:

```markdown
### Content Types

| Type | Icon | Description | Formats | Upload Method |
|------|------|-------------|---------|---------------|
| Video | 🎬 | Lecture videos, tutorials | MP4, WebM, MOV | File upload |
| Document | 📄 | PDFs, presentations, Word docs | PDF, PPT, PPTX, DOC, DOCX | File upload |
| HTML | 🌐 | Interactive HTML content | HTML, HTM | File upload |
| External URL | 🔗 | Embedded external content | YouTube, Vimeo, Google Slides | URL input |
```

2. **Replace Create Content Section**:

```markdown
### Create Content - Manual Upload

**Page Layout**: Split screen with Content Details (left 2/3) and Classification + Visibility (right 1/3)

**Step 1: Select Content Type**
- Choose from 4 types: Video, Document, HTML, External URL
- Each type shows accepted formats

**Step 2: Upload or Enter URL**
- Video/Document/HTML: Drag & drop or browse for file
- External URL: Paste embed URL (YouTube, Vimeo, Google Slides, etc.)

**Step 3: Content Details**
- Title (required)
- Description
- Learning Objectives

**Step 4: Classification** (ALL fields mandatory)
- Source Type: Curriculum OR Course
- For Curriculum: Curriculum → Class → Subject → Chapter → Topic
- For Course: Course → Subject → Chapter → Topic

**Step 5: Visibility** (Critical for propagation)
- Select which curricula should see this content
- Select which courses should see this content
- Content appears ONLY to institutes with matching assignments
```

3. **Add Visibility Rules Section**:

```markdown
### Visibility & Propagation Rules

**How Visibility Works:**
When creating content, the Visibility section determines which institutes can access the content:

| Visibility Setting | Who Sees It |
|--------------------|-------------|
| CBSE only | Only institutes assigned CBSE |
| ICSE only | Only institutes assigned ICSE |
| CBSE + ICSE | Institutes assigned CBSE OR ICSE |
| JEE course | Only institutes assigned JEE |
| CBSE + JEE | Institutes assigned CBSE OR JEE |

**Critical Boundary Rule:**
Content created for CBSE is NEVER visible to institutes with only ICSE assignment. This boundary is strictly enforced.

**Tier Requirement:**
Institute must have Content Library enabled in their tier to access any content.
```

4. **Add AI Content Generator Section**:

```markdown
### AI Content Generator

The AI Content Generator creates PowerPoint presentations automatically.

**Objective**: Generate teaching slides based on topic context and user instructions.

**3-Step Wizard:**

**Step 1: Classification**
- Select source type (Curriculum/Course)
- Complete classification: Curriculum → Class → Subject → Chapter → Topic
- Set visibility (which curricula/courses should see this content)

**Step 2: Describe Content**
- Enter detailed prompt (minimum 20 characters)
- Select style: Detailed (comprehensive) or Concise (brief)
- Set slide count (1-20 slides)

**Step 3: Preview & Edit**
- View generated slides in split panel
- Left: Slide thumbnails with drag-drop reordering
- Right: Full slide preview with editable content
- Actions: Delete slide, Duplicate slide, Edit text
- Save to Library when complete

**Output**: 
Presentation saved to Content Library, accessible based on visibility settings
```

---

## PART 7: Navigation Verification

All files created/updated must be verified in `src/data/docsNavigation.ts`. Current state shows:

**Already Added:**
- Tier Management (line 43)
- Users (line 44)
- Tier Management Tests (inter-login)
- Question Bank Tests (inter-login)

**Verify Content Tests** are already in navigation (currently exists at path "06-testing-scenarios/inter-login-tests/content-tests")

---

## File Changes Summary

| File | Action | Changes |
|------|--------|---------|
| `docs/06-testing-scenarios/smoke-tests/superadmin.md` | UPDATE | Replace Content Library section (~8 tests → 65+ tests), add verification requirements to Question Bank tests |
| `docs/01-superadmin/content-library.md` | UPDATE | Add 4 content types, visibility rules, AI generator details, propagation rules |
| `docs/06-testing-scenarios/inter-login-tests/content-tests.md` | UPDATE | Add 25+ new tests for curriculum/course visibility boundaries, cross-portal preview verification, institute privacy |

---

## Execution Order

1. **Update Question Bank smoke tests** - Add display verification (math, images, tags) to expected results
2. **Overhaul Content Library smoke tests** - Replace basic tests with 65+ comprehensive tests
3. **Add Create Content tests** - 4 content types with full cycle verification
4. **Add AI Content Generator tests** - 3-step wizard with preview/edit tests
5. **Update Feature Documentation** - Content types, visibility rules, AI generator
6. **Expand Inter-Login Tests** - Curriculum/course visibility boundaries, cross-portal preview

