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
| PageHeader | Title + "Create Content" action | Top |
| FilterBar | Type, class, subject, chapter filters | Below header |
| SourceToggle | All/Global filter | With filters |
| ContentGrid | Content cards with pagination | Main content |
| ContentForm | Create/edit content | Full page |
| AIGenerator | AI content creation wizard | Dialog |

---

## Features & Functionality

### Content Types

| Type | Icon | Description | Formats |
|------|------|-------------|---------|
| Video | 🎬 | Lecture videos, animations | YouTube, Vimeo, MP4 |
| Document | 📄 | Reading materials | PDF, DOCX, PPTX |
| Presentation | 📊 | Slide decks | PPTX, Google Slides |
| Animation | 🎞️ | Interactive animations | HTML5, Lottie |
| Simulation | 🔬 | Interactive simulations | PhET, HTML5 |
| Quiz | ❓ | Quick assessments | In-platform |
| Notes | 📝 | Text-based content | Markdown |
| Worksheet | 📋 | Practice materials | PDF |

### Create Content - Manual Upload

1. Click "Create Content"
2. **Step 1: Classification**
   - Select Class
   - Select Subject
   - Select Chapter
   - (Optional) Select Topic
3. **Step 2: Content Details**
   - Title
   - Description
   - Content Type
   - Upload file OR enter URL
   - Duration/Pages
4. **Step 3: Preview & Save**
   - Preview content
   - Add tags
   - Publish or save as draft

### Create Content - AI Generation

1. Click "AI Generate"
2. **Step 1: Classification**
   - Select Class, Subject, Chapter
3. **Step 2: Prompt**
   - Describe content needed
   - Select format (Notes, Quiz, Presentation)
   - Choose length/detail level
4. **Step 3: Preview & Edit**
   - Review AI-generated content
   - Edit as needed
   - Save or regenerate

### Content Card Information

| Element | Description |
|---------|-------------|
| Thumbnail | Preview image or type icon |
| Title | Content name |
| Type Badge | Video, PDF, etc. |
| Source Badge | Global (for SA content) |
| Classification | Class > Subject > Chapter |
| Duration/Size | Time or page count |
| Actions | View, Edit, Delete |

### Manage Content

| Action | How | Result |
|--------|-----|--------|
| View | Click card | Opens content viewer |
| Edit | Click edit | Opens edit form |
| Delete | Click delete | Confirmation dialog |
| Duplicate | Action menu | Creates copy |

### Filtering & Search

| Filter | Options |
|--------|---------|
| Search | Title, description |
| Type | Any content type |
| Class | From curriculum |
| Subject | Filtered by class |
| Chapter | Filtered by subject |
| Status | Published, Draft |

---

## Data Flow

```text
Source: SuperAdmin creates content
         │
         ▼
Storage: contentLibraryData.ts
         ├── content items with source: 'global'
         └── file storage references
         │
         ▼
Visibility:
├── Institute Content Library (read-only, "Global" badge)
├── Teacher Content Library (read-only, "Global" badge)
└── Student (via assignment only)
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Global Content | Institute Library | Downstream | Visible with "Global" badge |
| Global Content | Teacher Library | Downstream | Visible, can assign to batches |
| Content Assignment | Student | Downstream | Appears in chapter view |
| Content Classification | Master Data | Upstream | Uses curriculum hierarchy |

---

## Business Rules

1. **Global content is read-only** downstream - institutes/teachers cannot edit
2. **Classification required** - must have at least class + subject
3. **Unique titles encouraged** within same classification
4. **File size limits** - based on content type (video: 500MB, doc: 50MB)
5. **Supported formats** validated on upload
6. **Draft content** not visible downstream
7. **Deletion impact** - check if content is assigned before deleting

---

## Mobile Behavior

- Content grid: 1 column on mobile, 2-3 on tablet+
- Filters: Horizontal scroll pills
- Create flow: Full-screen stepped wizard
- AI generator: Bottom sheet
- Preview: Full-screen viewer
- Touch targets: 44px minimum

---

## Related Documentation

- [Institute Content Library](../02-institute/content-library.md)
- [Teacher Content Library](../03-teacher/content-library.md)
- [Content Propagation Flow](../05-cross-login-flows/content-propagation.md)
- [SuperAdmin Smoke Tests](../06-testing-scenarios/smoke-tests/superadmin.md)

---

*Last Updated: January 2025*
