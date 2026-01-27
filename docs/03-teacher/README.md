# Teacher Portal

> Classroom management for lesson plans, content delivery, homework, and student assessments.

---

## Portal Overview

The Teacher portal is the **classroom delivery layer** that enables:
- Daily schedule and class management
- Lesson plan creation and presentation
- Content creation and assignment
- Homework assignment with multiple modes
- Assessment creation and grading
- Academic progress tracking and confirmation

### Access

- **Base Route**: `/teacher/*`
- **Login**: `/login` with teacher credentials
- **Role Required**: Teacher account created by Institute

---

## Portal Features

| Feature | Route | Description |
|---------|-------|-------------|
| [Dashboard](./dashboard.md) | `/teacher/dashboard` | Today's classes + pending actions |
| [Schedule](./schedule.md) | `/teacher/schedule` | Weekly timetable view |
| [Lesson Plans](./lesson-plans.md) | `/teacher/lesson-plans` | Plan management portal |
| [Lesson Workspace](./lesson-workspace.md) | `/teacher/lesson-workspace/:id` | Block editor + presentation |
| [Content Library](./content-library.md) | `/teacher/content` | Create + assign content |
| [Homework](./homework.md) | `/teacher/homework` | 3-mode homework system |
| [Exams](./exams.md) | `/teacher/exams` | Teacher assessments |
| [Academic Progress](./academic-progress.md) | `/teacher/academic-progress` | Teaching confirmation |
| [Notifications](./notifications.md) | `/teacher/notifications` | Alert system |
| [Profile](./profile.md) | `/teacher/profile` | Profile management |

---

## Data Ownership

Teacher manages:

```text
┌─────────────────────────────────────────────────────────────────────┐
│                      TEACHER DATA OWNERSHIP                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  CREATES & OWNS                          VISIBILITY                  │
│  ─────────────────                       ──────────                  │
│  • Lesson Plans                  →       Own use + cloning           │
│  • Teacher Content               →       Assigned batches            │
│  • Homework Assignments          →       Assigned batches            │
│  • Assessments                   →       Assigned batches            │
│  • Teaching Confirmations        →       Institute tracking          │
│                                                                      │
│  CONSUMES (SUBJECT-SCOPED)                                           │
│  ─────────────────────────                                           │
│  • Timetable (own classes only)                                      │
│  • Academic Plan (own subjects only)                                 │
│  • Global Content (assigned subjects)                                │
│  • Institute Content (assigned subjects)                             │
│  • Global Questions (for exam creation)                              │
│  • Institute Questions (for exam creation)                           │
│                                                                      │
│  SCOPE FILTERS                                                       │
│  ─────────────                                                       │
│  • Subjects: Only assigned subjects                                  │
│  • Batches: Only assigned batches                                    │
│  • Classes: Derived from batch assignments                           │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Key Workflows

### 1. Daily Teaching Flow
```text
Dashboard → View today's classes
         → Check pending confirmations
         → Access lesson plan for current class
         → Present lesson in workspace
         → Confirm teaching after class
```

### 2. Lesson Plan Creation Flow
```text
Schedule → Click "Add Plan" on class slot
        → Opens Lesson Workspace with context pre-filled
        → Add blocks: Video, Explain, Quiz, Activity, Homework
        → Save as Draft or Ready
        → Present when in class
```

### 3. Content Creation Flow
```text
Content Library → Create New Content
              → Choose: Upload OR AI Generate
              → Fill classification (subject, chapter)
              → Save → Assign to batches
```

### 4. Homework Assignment Flow
```text
Homework → Create Assignment
        → Choose Type: Practice / Project / Test
        → Set deadline, instructions
        → Assign to batches
        → Track submissions
```

### 5. Teaching Confirmation Flow
```text
Academic Progress → View pending classes
                 → Click "Confirm" on class
                 → Select topic(s) taught OR mark "Not Taught"
                 → Submit → Updates syllabus progress
```

---

## Cross-Login Connections

| Teacher Action | Affects | How |
|----------------|---------|-----|
| Confirms Teaching | Institute Batch Progress | Updates completion % |
| Creates Content | Students in assigned batches | Visible in their library |
| Assigns Homework | Students in assigned batches | Appears in homework list |
| Creates Exam | Students in assigned batches | Available for attempt |
| Saves Lesson Plan | Own future use | Can clone for other classes |

---

## Lesson Workspace Blocks

The lesson workspace supports these block types:

| Block Type | Icon | Purpose |
|------------|------|---------|
| **Video** | 🎬 | YouTube, Vimeo, or uploaded videos |
| **Explain** | 📝 | Text notes with rich formatting |
| **Quiz** | ❓ | Quick check questions |
| **Activity** | 🎯 | Interactive exercises |
| **Resource** | 📎 | PDFs, documents, links |
| **Homework** | 📚 | Homework assignment block |

### Presentation Mode
- Full-screen presentation of lesson blocks
- Sequential navigation through blocks
- Annotation tools for live drawing
- Timer for pacing

---

## Mobile Behavior

- **Dashboard**: Stacked cards, swipe for classes
- **Schedule**: List view default, grid toggle available
- **Lesson Workspace**: Full-width blocks, floating toolbar
- **Content Creation**: Bottom sheet for classification
- **Dialogs**: Bottom drawers with swipe-to-dismiss
- **Touch Targets**: 44px minimum

---

## Notification Categories

| Category | Examples |
|----------|----------|
| **Schedule** | Timetable changes, substitution requests |
| **Academic** | Pending confirmations, syllabus updates |
| **Communication** | Messages from institute |
| **System** | App updates, maintenance |

### Confirmation Reminders
Automated reminders for pending teaching confirmations:
- End of school day reminder
- Next morning reminder
- Configurable in notification settings

---

## Prerequisites

```text
Before Dashboard → Teacher account created by Institute
Before Schedule → Timetable published by Institute
Before Lesson Plans → Classes scheduled in timetable
Before Content Assignment → Batches exist with students
Before Teaching Confirmation → Academic plan exists
```

---

## Related Documentation

- [Timetable Flow](../05-cross-login-flows/timetable-flow.md)
- [Academic Schedule Flow](../05-cross-login-flows/academic-schedule-flow.md)
- [Homework Flow](../05-cross-login-flows/homework-flow.md)
- [Content Propagation](../05-cross-login-flows/content-propagation.md)
- [Teacher Smoke Tests](../06-testing-scenarios/smoke-tests/teacher.md)

---

*Last Updated: January 2025*
