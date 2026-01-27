# Student Portal

> Mobile-first learning experience with classroom content, AI-driven paths, and competitive challenges.

---

## Portal Overview

The Student portal is the **learning consumption layer** that provides:
- Daily schedule and homework tracking
- Subject and chapter navigation
- Three learning modes (Classroom, My Path, Compete)
- Content viewing across all formats
- Test taking with real-time feedback
- Progress tracking and analytics

### Access

- **Base Route**: `/student/*`
- **Login**: `/student/login` with student credentials
- **Role Required**: Student account created by Institute

---

## Portal Features

| Feature | Route | Description |
|---------|-------|-------------|
| [Dashboard](./dashboard.md) | `/student/dashboard` | Today's schedule + homework |
| [Subjects](./subjects.md) | `/student/subjects` | Subject cards + navigation |
| [Subject Detail](./subject-detail.md) | `/student/subject/:id` | Chapter list |
| [Chapter View](./chapter-view.md) | `/student/chapter/:id` | Three-mode system |
| [Classroom Mode](./classroom-mode.md) | (within chapter) | Teacher-led content |
| [My Path Mode](./mypath-mode.md) | (within chapter) | AI-driven learning |
| [Compete Mode](./compete-mode.md) | (within chapter) | Challenges + benchmarks |
| [Content Viewer](./content-viewer.md) | `/student/content/:id` | All content types |
| [Tests](./tests.md) | `/student/tests` | Test list |
| [Test Player](./test-player.md) | `/student/test/:id` | Exam interface |
| [Test Results](./test-results.md) | `/student/test/:id/results` | Score + analysis |
| [Progress](./progress.md) | `/student/progress` | Analytics + tracking |
| [Notifications](./notifications.md) | `/student/notifications` | Student alerts |

---

## Data Visibility

Student consumes:

```text
┌─────────────────────────────────────────────────────────────────────┐
│                     STUDENT DATA VISIBILITY                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  CONSUMES (BATCH-SCOPED)                                             │
│  ───────────────────────                                             │
│  • Today's Schedule         (from batch timetable)                   │
│  • Assigned Content         (from teacher assignments)               │
│  • Lesson Content           (from teacher lesson plans)              │
│  • Homework                 (from teacher assignments)               │
│  • Tests/Exams              (from teacher/institute assignments)     │
│  • AI Recommendations       (based on performance)                   │
│                                                                      │
│  CREATES (PERSONAL)                                                  │
│  ──────────────────                                                  │
│  • Homework Submissions                                              │
│  • Test Attempts                                                     │
│  • Progress Data                                                     │
│  • Bookmarks                                                         │
│                                                                      │
│  SCOPE FILTERS                                                       │
│  ─────────────                                                       │
│  • Batch: Student's enrolled batch                                   │
│  • Subjects: Subjects in batch curriculum                            │
│  • Chapters: All chapters in subjects                                │
│  • Content: Only assigned or lesson-linked content                   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## The Three Learning Modes

The student experience is built on the **"Three Lenses" Philosophy**:

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    THREE LEARNING MODES                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  🏫 CLASSROOM MODE                                                   │
│  ─────────────────                                                   │
│  What: Teacher-led narrative structured as "Class Sessions"         │
│  Flow: LEARN (Video/Reading) → CHECK (Quiz) → PRACTICE → SUBMIT    │
│  Source: Lesson plans created by teacher                             │
│  When: Following along with class instruction                        │
│                                                                      │
│  🎯 MY PATH MODE                                                     │
│  ───────────────                                                     │
│  What: AI-driven prescriptions for personalized learning             │
│  Flow: Diagnose weakness → Targeted content → Practice → Verify     │
│  Source: AI analysis of student performance                          │
│  When: Self-study, catching up, strengthening weak areas            │
│  Priority: High / Medium / Low based on urgency                      │
│                                                                      │
│  🏆 COMPETE MODE                                                     │
│  ──────────────                                                      │
│  What: Challenges and benchmarks for mastery testing                 │
│  Flow: Challenge → Attempt → Compare with peers → Leaderboard       │
│  Source: Curated challenging content                                 │
│  When: Testing limits, preparing for competitions                    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Mode Switching
- Modes are accessible via horizontal scrollable pills at chapter level
- Students can switch modes without leaving the chapter context
- Each mode shows item count and completion status
- One-time onboarding tooltip explains the modes

---

## Key Workflows

### 1. Daily Learning Flow
```text
Dashboard → View today's schedule
         → Check pending homework
         → Tap class to see details
         → Access content from class or subject
```

### 2. Subject Navigation Flow
```text
Subjects → Tap subject card
        → View chapter list with progress
        → Tap chapter → Enter three-mode view
        → Switch between Classroom/My Path/Compete
```

### 3. Classroom Mode Flow
```text
Chapter → Classroom tab
       → View lesson bundles (class sessions)
       → Tap bundle → Sequential content flow
       → Watch video → Take quiz → Submit homework
```

### 4. Homework Submission Flow
```text
Homework item → Tap to open submission sheet
            → Type depends on homework mode:
              - Practice: File/text/link upload
              - Project: Multi-file upload
              - Test: Opens TestPlayer
            → Submit → Track status
```

### 5. Test Taking Flow
```text
Tests → Tap test to start
     → Instructions screen
     → Question-by-question navigation
     → Flag for review
     → Submit → View results
```

---

## Cross-Login Connections

| Source | Affects Student | How |
|--------|-----------------|-----|
| Teacher Lesson Plan | Classroom Mode content | Visible as lesson bundles |
| Teacher Content Assignment | Content Library | Appears in subject/chapter |
| Teacher Homework | Dashboard + Homework list | Pending items shown |
| Teacher/Institute Exam | Tests list | Available for attempt |
| Institute Timetable | Dashboard schedule | Today's classes shown |
| AI Analysis | My Path Mode | Personalized recommendations |

---

## Mobile-First Design

The student portal is **designed for mobile first**:

| Pattern | Implementation |
|---------|----------------|
| **Subject Cards** | Full-width cards, swipe navigation |
| **Chapter List** | Vertical scroll, tap-to-expand |
| **Mode Switcher** | Horizontal scroll pills with haptic feedback |
| **Content Viewer** | Full-screen with floating controls |
| **Test Player** | One question per screen, swipe navigation |
| **Homework Sheet** | Bottom drawer with camera access |

### Touch Interactions
- **44px minimum** touch targets
- **Swipe gestures** for navigation
- **Pull-to-refresh** on lists
- **Haptic feedback** on mode selection
- **Native camera** for homework uploads

---

## Performance Optimizations

| Optimization | Where Applied |
|--------------|---------------|
| **Virtualization** | Lesson bundles, homework lists, AI paths |
| **Code Splitting** | Lazy routes (except student core) |
| **Image Lazy Loading** | Subject cards, content thumbnails |
| **Offline Support** | PWA caching for tests |

---

## Prerequisites

```text
Before Dashboard → Student account + batch enrollment
Before Schedule → Timetable published
Before Subjects → Curriculum assigned to batch
Before Content → Content assigned by teacher
Before Homework → Homework assigned by teacher
Before Tests → Tests assigned by teacher/institute
```

---

## Related Documentation

- [Content Propagation](../05-cross-login-flows/content-propagation.md)
- [Homework Flow](../05-cross-login-flows/homework-flow.md)
- [Exam Flow](../05-cross-login-flows/exam-flow.md)
- [Batch-Student Flow](../05-cross-login-flows/batch-student-flow.md)
- [Student Smoke Tests](../06-testing-scenarios/smoke-tests/student.md)

---

*Last Updated: January 2025*
