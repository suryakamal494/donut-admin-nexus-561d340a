# Content Library

> Create and manage global educational content available across all institutes.

---

## Overview

The SuperAdmin Content Library manages platform-wide educational content that becomes available to all institutes, teachers, and students (based on their curriculum/subject scope). Content created here is marked as "Global" and cannot be edited by downstream users.

## Access

- **Route**: `/superadmin/content`
- **Login Types**: SuperAdmin
- **Permissions Required**: `contentLibrary.view`, `contentLibrary.create`, `contentLibrary.edit`, `contentLibrary.delete`

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| PageHeader | Title + "Create Content" and "AI Content Generator" buttons | Top |
| SearchBar | Title and description search | Below header |
| FilterBar | Type, class, subject, chapter filters | Below search |
| ViewToggle | Grid/List view switcher | With filters |
| ContentGrid | Content cards with pagination | Main content |
| CreateContentPage | Manual content creation | Full page |
| AIContentGenerator | AI presentation wizard | Full page (3 steps) |

---

## Content Types

| Type | Icon | Description | Formats | Upload Method |
|------|------|-------------|---------|---------------|
| Video | 🎬 | Lecture videos, tutorials, animations | MP4, WebM, MOV | File upload |
| Document | 📄 | PDFs, presentations, Word documents, images | PDF, PPT, PPTX, DOC, DOCX | File upload |
| HTML | 🌐 | Interactive HTML content, iframe embeds | HTML, HTM | File upload |
| External URL | 🔗 | Embedded external services | YouTube, Vimeo, Google Slides | URL input |

---

## Features & Functionality

### Create Content - Manual Upload

**Page Layout**: Split screen with Content Details (left 2/3) and Classification + Visibility (right 1/3)

**Step 1: Select Content Type**
Choose from 4 types:
- **Video** - Accepts MP4, WebM, MOV files
- **Document** - Accepts PDF, PPT, PPTX, DOC, DOCX files
- **HTML** - Accepts HTML, HTM files for interactive content
- **External URL** - Paste embed URLs for YouTube, Vimeo, Google Slides

**Step 2: Upload or Enter URL**
- Video/Document/HTML: Drag & drop file or click to browse
- External URL: Paste the embed URL directly

**Step 3: Content Details**
- Title (required)
- Description (optional but recommended)
- Learning Objectives (optional)

**Step 4: Classification** (ALL fields mandatory)
- **Source Type**: Choose Curriculum OR Course
- **For Curriculum**: Curriculum → Class → Subject → Chapter → Topic
- **For Course**: Course → Subject → Chapter → Topic

**Step 5: Visibility** (Critical for propagation)
- Select which curricula should see this content
- Select which courses should see this content
- Content appears ONLY to institutes with matching assignments

---

### AI Content Generator

The AI Content Generator creates PowerPoint-style presentations automatically based on classification and user instructions.

**Objective**: Generate teaching slides quickly based on topic context and custom prompts.

**3-Step Wizard:**

**Step 1: Classification**
- Select source type (Curriculum or Course)
- Complete full classification:
  - Curriculum mode: Curriculum → Class → Subject → Chapter → Topic
  - Course mode: Course → Subject → Chapter → Topic
- Set visibility (which curricula/courses should see this content)

**Step 2: Describe Content**
- Enter detailed prompt (minimum 20 characters recommended)
- Select style: **Detailed** (comprehensive explanations) or **Concise** (brief points)
- Set slide count (1-20 slides)

**Step 3: Preview & Edit**
- View generated slides in split panel layout
- **Left panel**: Slide thumbnails with drag-drop reordering
- **Right panel**: Full slide preview with editable content
- **Available actions**:
  - Click on text to edit content directly
  - Delete unwanted slides
  - Duplicate slides
  - Drag thumbnails to reorder
- Click "Save to Library" when satisfied

**Output**: Presentation saved to Content Library, accessible based on visibility settings

---

### Visibility & Propagation Rules

**How Visibility Works:**
When creating content, the Visibility section determines which institutes can access the content.

| Visibility Setting | Who Sees It |
|--------------------|-------------|
| CBSE only | Only institutes assigned CBSE curriculum |
| ICSE only | Only institutes assigned ICSE curriculum |
| CBSE + ICSE | Institutes assigned CBSE OR ICSE |
| JEE course | Only institutes assigned JEE course |
| CBSE + JEE | Institutes assigned CBSE curriculum OR JEE course |

**Critical Boundary Rule:**
Content created for CBSE is NEVER visible to institutes with only ICSE assignment. This boundary is strictly enforced to prevent content leakage.

**Tier Requirement:**
Institute must have Content Library enabled in their tier (configured in Tier Management) to access any content.

---

### Content Card Information

| Element | Description |
|---------|-------------|
| Thumbnail | Preview image or type icon |
| Title | Content name |
| Type Badge | Video, PDF, PPT, HTML, URL |
| Source Badge | Global (for SA content) |
| Classification | Class > Subject > Chapter |
| Visibility Badges | Curricula/Courses this content is visible to |
| Actions | Preview, Edit, Delete |

---

### Manage Content

| Action | How | Result |
|--------|-----|--------|
| Preview | Click Preview icon on card | Opens content viewer (video player, PDF viewer, etc.) |
| Edit | Click Edit icon on card | Opens edit form with pre-filled values |
| Delete | Click Delete icon on card | Confirmation dialog, then removes content |

---

### Filtering & Search

| Filter | Options |
|--------|---------|
| Search | Title, description (real-time filtering) |
| Type | Video, Document, HTML, External URL |
| Class | From curriculum hierarchy |
| Subject | Filtered by class selection |
| Chapter | Filtered by subject selection |

| View Mode | Description |
|-----------|-------------|
| Grid | Cards with thumbnails (default) |
| List | Rows with columns |

---

## Data Flow

```text
Source: SuperAdmin creates content
         │
         ▼
Classification: Curriculum/Course → Subject → Chapter → Topic
         │
         ▼
Visibility: Select target curricula/courses
         │
         ▼
Storage: contentLibraryData.ts
         ├── content items with source: 'global'
         ├── file storage references
         └── visibility mappings
         │
         ▼
Propagation (based on visibility):
├── Institute Content Library (read-only, "Global" badge)
│   └── Only if institute curriculum/course matches visibility
├── Teacher Content Library (read-only, "Global" badge)
│   └── Only if teacher's institute has matching assignment
└── Student (via assignment by teacher)
    └── Appears in chapter view after teacher assigns
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Global Content | Institute Library | Downstream | Visible with "Global" badge if curriculum/course matches |
| Global Content | Teacher Library | Downstream | Visible, can assign to batches |
| Content Assignment | Student | Downstream | Appears in chapter view |
| Content Classification | Master Data | Upstream | Uses curriculum/course hierarchy |
| Content Visibility | Tier Management | Upstream | Institute tier must enable Content Library |
| Content Visibility | Institute Curriculum | Upstream | Only matching curricula/courses see content |

---

## Business Rules

1. **Global content is read-only** downstream - institutes/teachers cannot edit SuperAdmin content
2. **Classification required** - must complete full path: Curriculum/Course → Subject → Chapter → Topic
3. **Visibility is mandatory** - must select at least one curriculum or course
4. **File size limits** - based on content type:
   - Video: 500MB max
   - Document: 50MB max
   - HTML: 10MB max
5. **Supported formats validated** - only accepted file types allowed
6. **Draft content** - not visible downstream (future feature)
7. **Deletion impact** - check if content is assigned before deleting

---

## Preview Requirements by Content Type

| Content Type | Preview Behavior | Success Criteria |
|--------------|-----------------|------------------|
| Video | Video player with playback controls | Video plays, no errors |
| PDF | PDF viewer with page navigation | All pages render, scrolling works |
| PPT/PPTX | Slide viewer with navigation | Slides display correctly |
| HTML | Iframe rendering | Content renders, no 504 errors |
| YouTube | Embedded video player | Video plays in embed |
| Vimeo | Embedded video player | Video plays in embed |
| Google Slides | Embedded slide viewer | Slides display and navigate |

---

## Mobile Behavior

- Content grid: 1 column on mobile, 2-3 on tablet+
- Filters: Horizontal scroll pills
- Create flow: Full-screen stepped wizard
- AI generator: Full-screen 3-step wizard
- Preview: Full-screen viewer with gesture controls
- Touch targets: 44px minimum
- View toggle: Visible on all screen sizes

---

## Related Documentation

- [Institute Content Library](../02-institute/content-library.md)
- [Teacher Content Library](../03-teacher/content-library.md)
- [Content Propagation Flow](../05-cross-login-flows/content-propagation.md)
- [Content Cross-Portal Tests](../06-testing-scenarios/inter-login-tests/content-tests.md)
- [SuperAdmin Smoke Tests](../06-testing-scenarios/smoke-tests/superadmin.md)

---

*Last Updated: January 2025*
