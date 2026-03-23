# DonutAI — Phase 1 Completion Summary

> Technical onboarding document for new team members. Covers everything built in Phase 1 so you know where to start for Phase 2.

---

## Table of Contents

1. [Platform Overview](#platform-overview)
2. [Curriculum Tree Architecture](#curriculum-tree-architecture)
3. [SuperAdmin Panel — Completed](#superadmin-panel--completed)
4. [Institute Panel — Completed](#institute-panel--completed)
5. [Teacher Panel — Completed](#teacher-panel--completed)
6. [Student Panel — Completed](#student-panel--completed)
7. [Cross-Portal Data Flow](#cross-portal-data-flow)
8. [What's NOT Built Yet](#whats-not-built-yet)

---

## Platform Overview

DonutAI is a multi-portal educational platform with four distinct user panels. Data flows **downstream** — SuperAdmin creates foundational data, Institutes configure it for their context, Teachers operate within their assigned scope, and Students consume the end result.

```text
SuperAdmin  →  Institute  →  Teacher  →  Student
(creates)      (configures)   (operates)   (consumes)
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 + TypeScript |
| Styling | Tailwind CSS + Shadcn/UI |
| Routing | React Router v6 (lazy-loaded portals) |
| State | TanStack Query + local state + URL state |
| Animations | Framer Motion |
| Charts | Recharts |

### Portal Routing

- `/superadmin/*` — Platform administration (lazy loaded)
- `/institute/*` — Institute management (lazy loaded)
- `/teacher/*` — Teacher workspace (lazy loaded)
- `/student/*` — Student experience (eager loaded for instant navigation)

---

## Curriculum Tree Architecture

This is the foundational data model. Understanding this is critical before touching any feature.

### Core Principle: Independent Entities, Linked at Chapter Level

Curriculum, Class, and Subject are **independent entities**. They exist on their own. They only become connected when a **Chapter** is created — a Chapter requires all three: a Curriculum, a Class, and a Subject.

```text
Curriculum (CBSE, ICSE, State Board...)     ← independent
Class (Class 9, Class 10, Class 11...)      ← independent
Subject (Physics, Chemistry, Math...)       ← independent

Chapter = Curriculum + Class + Subject      ← this is where linking happens
  └── Topic                                 ← sits under Chapter
```

**Example:** "Kinematics" is a Chapter that belongs to `CBSE → Class 11 → Physics`. The same subject "Physics" can have completely different chapters under `ICSE → Class 11 → Physics`.

### Course System (JEE, NEET, Olympiad, Foundation)

Courses are **curriculum-agnostic containers** for competitive/entrance exam preparation. They pull content from the curriculum tree:

- **Mapped Chapters (~80%):** Chapters pulled from the curriculum tree into a course. Example: JEE Mains maps "Kinematics" from `CBSE → Class 11 → Physics`.
- **Course-Owned Chapters (~20%):** Chapters exclusive to a course that don't exist in any curriculum. Example: "Advanced Problem Solving Techniques" owned by JEE Mains.

```text
Course (JEE Mains)
├── Mapped Chapter → pulled from CBSE Class 11 Physics (Kinematics)
├── Mapped Chapter → pulled from CBSE Class 11 Physics (Laws of Motion)
└── Course-Owned Chapter → exclusive to JEE (no curriculum link)
```

### How This Affects Everything Downstream

- **Batches** are linked to specific curriculums + subjects
- **Teachers** are assigned specific curriculums + subjects → they only see batches that match
- **Exams** are classified under a curriculum → only shared to matching batches
- **Students** see content filtered by their batch's curriculum assignments

---

## SuperAdmin Panel — Completed

### Institute Creation ✅

- Create institutes with name, location, contact details
- Assign curriculums and courses to each institute
- Institute gets access only to assigned curriculum/course data

### Tier Management ✅ (Creation Only)

- Tiers can be created with feature selections (e.g., "Basic" tier with only Exams, "Premium" tier with all features)
- **⚠️ NOT enforced:** Tier restrictions are not yet applied to downstream panels. All features are currently hardcoded as available in Institute/Teacher panels regardless of tier assignment.

### Master Data ✅

**Curriculum Management:**
- Full CRUD for Curriculums, Classes, Subjects, Chapters, Topics
- Drag-and-drop reordering for chapters and topics
- Bulk paste for rapid chapter/topic creation
- Multi-language support (Hindi, transliterated names)

**Course Builder:**
- Create courses (JEE, NEET, Foundation, Olympiad types)
- Map chapters from curriculum tree into courses
- Create course-owned exclusive chapters
- Configure allowed curriculums and class levels per course

### Question Bank ✅

- **Classification modes:** Questions can be classified under curriculum path (Curriculum → Class → Subject → Chapter → Topic) or course path
- **Question types:** MCQ Single, MCQ Multiple, True/False, Fill in Blank, Integer Type, Subjective, Assertion-Reasoning, Matrix Match, Paragraph-based
- **Difficulty levels:** Easy, Medium, Hard, Expert
- **Creation methods:**
  - Manual creation with LaTeX support for mathematical notation
  - AI-powered question generation (generates questions from topic/chapter context)
  - PDF upload with extraction (upload question papers, system extracts questions)
- **Bulk operations:** Multi-select, bulk tagging, bulk difficulty assignment

### Exams ✅

**PYP (Previous Year Papers):**
- Create PYPs organized by Exam Body (JEE, NEET, etc.)
- Full exam structure with sections, marking schemes, question mapping

**Grand Tests:**
- Multi-step wizard: Configure → Add Sections → Add Questions → Review
- Section-wise configuration (subject, question type, marking scheme)
- Question selection from global question bank

**Distribution:**
- Exams created by SuperAdmin can be shared/distributed to institutes
- Institutes receive these exams and can assign them to their batches (covered in Institute section below)

### NOT Completed in SuperAdmin

- Content Library (video, PDF, notes management)
- Roles & Access Control configuration

---

## Institute Panel — Completed

### Batch Creation ✅

- Create batches by selecting: Class + Subjects + Curriculums + Courses
- Each batch is a container: it defines what content scope its students and teachers operate in
- A batch can have multiple curriculums (e.g., a batch doing both CBSE board prep and JEE competitive prep)

### Student Management ✅

- **Individual creation:** Add students one by one with details
- **Bulk upload:** CSV/Excel upload for batch student creation
- Assign students to one or more batches

### Teacher Creation ✅

- Create teacher profiles with credentials
- **Curriculum assignment:** Assign one or more curriculums to a teacher
- **Subject assignment:** Assign specific subjects (scoped to assigned curriculums)
- **Batch assignment:** Assign batches — but only batches that match the teacher's curriculum + subject assignments
- This scoping is enforced: a teacher cannot access batches outside their assigned curriculum/subject combination

### Question Bank ✅

- Same functionality as SuperAdmin question bank but institute-private
- Questions created here are visible only within this institute
- Teachers can use institute questions in their exams

### Exams New ✅

**Pattern Builder:**
- Create reusable exam patterns (e.g., "JEE Pattern: 30 MCQ + 10 Integer, -1 negative marking")
- Patterns define sections, question types, marking schemes
- Patterns can be reused across multiple exams

**Exam Creation:**
- **Pattern-based exams:** Select a pattern → system auto-structures the exam → fill in questions
- **Quick/Flexible exams:** Create exams without a predefined pattern, manual section configuration

**Scheduling & Assignment:**
- Set exam schedule (available from/until dates and times)
- Assign to one batch or multiple batches
- **Curriculum-scoped assignment:** Only batches matching the exam's curriculum can receive it

**SuperAdmin Exam Assignment:**
- Exams distributed from SuperAdmin appear in institute's exam list
- Institute can assign these to their batches (curriculum-matching enforced)

### NOT Completed in Institute

- Exam Reports
- Timetable Management
- Academic Schedule / Planning
- Content Library
- Roles & Staff Management
- Master Data view (read-only curriculum browse)

---

## Teacher Panel — Completed

### Scope Enforcement ✅

Teachers operate within a strictly scoped environment:

```text
Teacher sees only:
├── Curriculums assigned to them
├── Subjects assigned to them (within those curriculums)
└── Batches that have matching curriculum + subject combinations
```

A teacher assigned `CBSE + Physics` will only see batches that include CBSE Physics. They cannot access a batch that only has ICSE Physics or CBSE Chemistry.

### Exam Creation ✅

- Teachers can create Quick Tests for their assigned batches
- Exams are scoped: teacher can only create exams for their assigned curriculum + subjects
- Exams can only be assigned to batches the teacher has access to

### Exam Reports ✅ (Exam-Level Only)

- **Exam-based reports:** View batch-level results for completed exams — average scores, question-wise analysis, pass/fail distribution
- **NOT built:** Chapter-wise reports (performance by chapter across exams)
- **NOT built:** Student-specific reports (individual student performance tracking)

### NOT Completed in Teacher

- Dashboard (today's overview)
- Schedule / Timetable view
- Lesson Plans & Lesson Workspace
- Content Library
- Homework System
- Academic Progress / Teaching Confirmations
- Chapter Reports
- Student Reports
- Notifications
- Profile Settings

---

## Student Panel — Completed

### Tests ✅

This is the **only completed feature** in the student panel.

**Test Listing:**
- Subject-wise test listing with curriculum tags on subject cards
- Grand Test listing with filters
- Tests assigned by institute or from SuperAdmin are visible

**Test Player:**
- Full exam-taking experience
- Timer with countdown
- Question navigation panel (jump to any question)
- Mark for review functionality
- Auto-submit when timer expires
- Manual submit with confirmation

**Test Results:**
- Post-exam score display
- Question-wise review (correct/incorrect/skipped)
- Section-wise breakdown
- Analytics: accuracy percentage, time per question, difficulty distribution

### NOT Completed in Student

- My Subjects grid / Subject Detail / Chapter views
- Curriculum Switcher (UI exists but not connected to live data flow)
- Content viewing (videos, PDFs, notes)
- AI-powered learning paths (My Path)
- Practice modes
- Homework
- Progress Dashboard
- Classroom experience
- Notifications

---

## Cross-Portal Data Flow

The end-to-end exam flow that's fully functional in Phase 1:

```text
SUPERADMIN                    INSTITUTE                   TEACHER                    STUDENT
──────────                    ─────────                   ───────                    ───────

1. Creates Curriculum         3. Creates Batches          6. Sees only               9. Sees tests
   Tree (Curriculum →            (Class + Subjects +         assigned                    assigned to
   Class → Subject →             Curriculums)                curriculum/                 their batch
   Chapter → Topic)                                          subjects/batches

2. Creates Questions       4. Creates Teachers          7. Creates exams          10. Takes test
   + Exams (PYP/              (assigns curriculum +        (scoped to                  (timer,
   Grand Tests)                subjects + batches)          their scope)                navigation,
                                                                                        auto-submit)

   Distributes exams ──►  5. Assigns exams to          8. Assigns to             11. Views results
   to institutes              batches (curriculum-         their batches                (score,
                              matched)                                                  analytics)
```

### Curriculum Scoping Chain

This is the key architectural pattern — curriculum acts as a filter at every level:

```text
Batch (has Curriculum X + Subject Y)
  └── Teacher (assigned Curriculum X + Subject Y) → can access this batch
       └── Exam (classified under Curriculum X + Subject Y) → can be assigned to this batch
            └── Student (enrolled in this batch) → can see and take this exam
```

If any link in this chain doesn't match, the data doesn't flow through.

---

## What's NOT Built Yet

A brief orientation for Phase 2 planning:

| Area | What's Missing |
|------|---------------|
| **SuperAdmin** | Content Library, Roles & Access, Tier enforcement |
| **Institute** | Timetable, Academic Schedule, Content Library, Exam Reports, Roles, Master Data view |
| **Teacher** | Dashboard, Schedule, Lesson Plans, Content, Homework, Academic Progress, Chapter Reports, Student Reports, Notifications |
| **Student** | Subject browsing, Chapter views, Content consumption, Curriculum Switcher (live), AI paths, Practice, Homework, Progress, Classroom, Notifications |
| **Cross-Portal** | Content flow (SA → Institute → Teacher → Student), Homework flow, Academic planning flow, Notification system, Tier enforcement |

---

*Last Updated: March 2026*
