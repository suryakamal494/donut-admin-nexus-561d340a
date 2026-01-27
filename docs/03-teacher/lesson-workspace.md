# Lesson Workspace

> Block-based lesson editor with presentation mode and annotations.

---

## Overview

The Lesson Workspace is the primary tool for creating and delivering lesson plans. It features a block-based editor for adding content, quizzes, and homework, along with a full-screen presentation mode with annotation tools for live teaching.

## Access

- **Route**: `/teacher/lesson-plans/:id` or `/teacher/lesson-plans/new`
- **Login Types**: Teacher
- **Permissions Required**: Teacher account

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| WorkspaceHeader | Title, save, present actions | Top |
| ContextPanel | Class/chapter context | Left sidebar |
| BlockList | Draggable block list | Main content |
| BlockCard | Individual content block | Within list |
| AddBlockMenu | Block type selector | Bottom of list |
| PresentationMode | Full-screen delivery | Overlay |
| AnnotationTools | Drawing/markup | In presentation |

---

## Features & Functionality

### Context Modes

| Mode | Description | When Used |
|------|-------------|-----------|
| Context Mode | Pre-filled from schedule | Default entry |
| Selection Mode | Manual dropdowns | Manual creation |

### Context Panel (Read-Only)

```text
Lesson Context
┌─────────────────────────────────────────────────────────────┐
│ Class: 10A                                                  │
│ Subject: Physics                                            │
│ Chapter: Laws of Motion                                     │
│ Date: Jan 15, 2025                                          │
│ Period: 3 (9:45 - 10:30)                                    │
└─────────────────────────────────────────────────────────────┘
[Switch to Selection Mode]
```

### Block Types

| Type | Icon | Purpose | Source Options |
|------|------|---------|----------------|
| **Video** | 🎬 | Lecture videos | Library, YouTube, Upload |
| **Explain** | 📝 | Text notes | Custom, Library |
| **Quiz** | ❓ | Quick checks | Question Bank, AI |
| **Homework** | 📚 | Assignments | Creates homework |
| **Activity** | 🎯 | Interactive | Library, Custom |
| **Resource** | 📎 | Documents | Library, Upload |

### Block Card

```text
┌─────────────────────────────────────────────────────────────┐
│ ≡  🎬 Video: Newton's Laws Introduction                     │
│                                                              │
│    Source: YouTube • Duration: 12 min                       │
│    [Preview] [Edit] [Delete]                                │
└─────────────────────────────────────────────────────────────┘
```

### Block Actions

| Action | How | Result |
|--------|-----|--------|
| Add | Click "Add Content" | Block type menu |
| Reorder | Drag grip handle | Move block |
| Edit | Click edit icon | Edit dialog |
| Delete | Click delete | Remove block |
| Preview | Click preview | Quick view |

### Add Block Dialogs

Each block type has a dedicated dialog (ResponsiveDialog pattern):

**Add Video Dialog**
- Search content library
- Paste YouTube/Vimeo URL
- Upload file

**Add Explain Dialog**
- Rich text editor
- Import from library
- AI generate

**Add Quiz Dialog**
- Select from question bank
- AI generate questions
- Set question count

**Add Homework Dialog**
- 3-mode selection (Practice/Test/Project)
- Auto-fills context
- Creates homework assignment

### Drag-and-Drop Reordering

- Uses @dnd-kit library
- Vertical axis only
- Visual drag overlay (rotation, shadow)
- Smooth animations

### Presentation Mode

Full-screen delivery with:

```text
┌─────────────────────────────────────────────────────────────┐
│ ◀ Block 2/7: Newton's First Law              🖊️ ⏱️ 📷 🤖   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                    [Video Player]                            │
│                                                              │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ ● ● ○ ○ ○ ○ ○                              ◀ Previous Next ▶│
└─────────────────────────────────────────────────────────────┘
```

### Presentation Tools

| Tool | Icon | Purpose |
|------|------|---------|
| Annotation | 🖊️ | Draw on screen |
| Timer | ⏱️ | Pace tracking |
| Screenshot | 📷 | Capture annotated |
| AI Assist | 🤖 | Get suggestions |

### Annotation Layer

- Fabric.js canvas
- Drawing tools (pen, highlighter)
- Colors and sizes
- Undo/redo
- Toggle visibility

---

## Data Flow

```text
Sources:
├── Schedule context (batch, date, period)
├── Content Library (videos, docs)
├── Question Bank (quiz questions)
└── Homework system (assignments)
         │
         ▼
Workspace:
├── Blocks array with content references
├── Sequence order
├── Duration calculations
         │
         ▼
Storage: lessonPlans[]
         │
         ▼
Downstream:
├── Presentation Mode
├── Student Classroom Mode
└── Teaching Confirmation
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Lesson Plan | Student Classroom | Downstream | Visible as lesson bundle |
| Video blocks | Content items | Reference | Linked content |
| Quiz blocks | Questions | Reference | Linked questions |
| Homework blocks | Homework | Creates | New assignment |

---

## Business Rules

1. **Context required** - cannot save without classification
2. **At least one block** required for Ready status
3. **Block sources validated** - referenced content must exist
4. **Homework block** creates actual homework assignment
5. **Save options**: Draft or Ready
6. **Presentation requires** Ready status

---

## Mobile Behavior

- Context: Collapsible top section
- Blocks: Full-width cards
- Reorder: Touch-hold + drag
- Add menu: Bottom sheet
- Dialogs: Full-screen drawers
- Presentation: Landscape encouraged

### Mobile Dialog Standards

- 50vh scroll heights
- Swipe-to-dismiss gesture
- Haptic feedback (10ms)
- Large touch targets (44px+)

---

## Performance Optimizations

- Annotation canvas: CSS toggle (not recreated)
- AI requests: AbortController for cancellation
- Rate limiting: 2s cooldown on AI
- Screenshot: 1s debounce
- Quiz filtering: Memoized

---

## Related Documentation

- [Lesson Plans Portal](./lesson-plans.md)
- [Content Library](./content-library.md)
- [Homework](./homework.md)
- [Teacher Smoke Tests](../06-testing-scenarios/smoke-tests/teacher.md)

---

*Last Updated: January 2025*
