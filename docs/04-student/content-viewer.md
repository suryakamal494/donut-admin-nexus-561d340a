# Content Viewer

> Universal viewer for all content types.

---

## Overview

The Content Viewer is a full-screen interface for consuming educational content across all formats - videos, PDFs, presentations, simulations, and more. It maintains subject branding and tracks completion for progress reporting.

## Access

- **Route**: `/student/content/:id`
- **Login Types**: Student
- **Permissions Required**: Content assigned or in lesson plan

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| ViewerHeader | Title + subject branding | Top |
| ContentArea | Main content display | Center |
| ProgressBar | Completion tracking | Bottom |
| ControlsOverlay | Playback/navigation | Floating |
| CompletionPrompt | Mark as done | End of content |

---

## Features & Functionality

### Content Types Supported

| Type | Viewer | Controls |
|------|--------|----------|
| Video | HTML5/Embed | Play, pause, seek, speed |
| PDF | PDF.js | Scroll, zoom, page nav |
| PPT/Slides | Slide viewer | Previous, next |
| Animation | HTML5 player | Interactive |
| Simulation | Iframe | Embedded controls |
| Notes | Markdown renderer | Scroll |
| Quiz | Quiz interface | Answer, submit |

### Video Viewer

```text
┌─────────────────────────────────────────────────────────────┐
│ ← Newton's Laws Introduction              Physics           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                    [Video Player]                            │
│                                                              │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ ▶️ ━━━━━━━━━━━━━━━━●━━━━━━━━━━━━━ 8:32 / 15:00    1x  ⛶   │
├─────────────────────────────────────────────────────────────┤
│ Progress: 57% ████████████░░░░░░░░░░                        │
└─────────────────────────────────────────────────────────────┘
```

### PDF Viewer

```text
┌─────────────────────────────────────────────────────────────┐
│ ← NCERT Physics Chapter 3              Physics              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                    [PDF Content]                             │
│                                                              │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ ◀ Page 5/24 ▶                           🔍 + −             │
├─────────────────────────────────────────────────────────────┤
│ Progress: ○○○○●○○○○○○○○○○○○○○○○○○○                         │
└─────────────────────────────────────────────────────────────┘
```

### Completion Logic

| Content Type | Completion Criteria |
|--------------|---------------------|
| Video | Watch 90% or reach end |
| PDF | View all pages |
| Quiz | Submit answers |
| Simulation | Interact for minimum time |
| Notes | Scroll to bottom |

### Completion Prompt

```text
┌─────────────────────────────────────────────────────────────┐
│ ✓ Content Completed!                                        │
│                                                              │
│ You've finished "Newton's Laws Introduction"                │
│                                                              │
│ [Mark as Complete] [Continue to Next]                       │
└─────────────────────────────────────────────────────────────┘
```

### Subject Branding

Header maintains subject color scheme:
- Background gradient from `subjectColors`
- Subject icon displayed
- Consistent with chapter view

---

## Data Flow

```text
Source: Content Library
         │
         ▼
Viewer:
├── Load content by type
├── Apply appropriate viewer
├── Track engagement
         │
         ▼
Completion:
├── Calculate based on type
├── Update progress
└── Report to lesson bundle
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Content | Content Library | Reference | Loads content |
| Completion | Lesson Bundle | Updates | Marks item done |
| Progress | Overall Analytics | Updates | Contributes to % |

---

## Business Rules

1. **Access required** - must be assigned or in lesson
2. **Completion tracked** per content type
3. **Resume position** saved for videos
4. **PDF page tracked** for resume
5. **Quiz completion** requires submission
6. **Progress persistent** across sessions

---

## Mobile Behavior

- Full-screen mode available
- Landscape encouraged for video
- Pinch-to-zoom for PDFs
- Floating controls auto-hide
- Swipe for navigation
- Touch targets: 44px minimum

### Gestures

| Gesture | Action |
|---------|--------|
| Tap | Show/hide controls |
| Double-tap | Toggle full-screen |
| Swipe left/right | Previous/next (PDFs) |
| Pinch | Zoom (PDFs) |

---

## Related Documentation

- [Classroom Mode](./classroom-mode.md)
- [Chapter View](./chapter-view.md)
- [Progress Analytics](./progress.md)
- [Student Smoke Tests](../06-testing-scenarios/smoke-tests/student.md)

---

*Last Updated: January 2025*
