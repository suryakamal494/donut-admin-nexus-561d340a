# DonutAI Documentation

> Complete documentation system for developers, QA testers, and product teams.

---

## Quick Navigation

| Portal | Description | Link |
|--------|-------------|------|
| 🔴 **SuperAdmin** | Platform-wide management: curricula, institutes, global content | [SuperAdmin Docs](./01-superadmin/README.md) |
| 🟢 **Institute** | School administration: batches, teachers, students, timetables | [Institute Docs](./02-institute/README.md) |
| 🔵 **Teacher** | Classroom management: lessons, content, homework, exams | [Teacher Docs](./03-teacher/README.md) |
| 🟣 **Student** | Learning experience: subjects, lessons, tests, progress | [Student Docs](./04-student/README.md) |

---

## Documentation Categories

### 📚 Feature Documentation
Detailed documentation for each portal and its features.

- [SuperAdmin Portal](./01-superadmin/README.md) - Global platform administration
- [Institute Portal](./02-institute/README.md) - School-level administration
- [Teacher Portal](./03-teacher/README.md) - Classroom and content management
- [Student Portal](./04-student/README.md) - Learning experience

### 🔄 Cross-Login Flows
How data and actions flow between different user types.

- [Cross-Login Overview](./05-cross-login-flows/README.md)
- [Content Propagation](./05-cross-login-flows/content-propagation.md) - SA → Institute → Teacher → Student
- [Exam Flow](./05-cross-login-flows/exam-flow.md) - Exam creation to student attempt
- [Timetable Flow](./05-cross-login-flows/timetable-flow.md) - Schedule to teacher/student
- [Curriculum Flow](./05-cross-login-flows/curriculum-course-flow.md) - Master data propagation
- [Academic Schedule Flow](./05-cross-login-flows/academic-schedule-flow.md) - Planning to confirmation

### 🧪 Testing Scenarios
Test cases for QA teams organized by test type.

- [Testing Overview](./06-testing-scenarios/README.md)
- [Smoke Tests](./06-testing-scenarios/smoke-tests/) - Page-level verification
- [Intra-Login Tests](./06-testing-scenarios/intra-login-tests/) - Module dependencies within a portal
- [Inter-Login Tests](./06-testing-scenarios/inter-login-tests/) - Cross-portal scenarios

### ⚙️ Technical Documentation
Developer-focused architecture and patterns.

- [Technical Overview](./07-technical/README.md)
- [Project Structure](./07-technical/project-structure.md)
- [Routing Architecture](./07-technical/routing.md)
- [Data Layer](./07-technical/data-layer.md)
- [Component Patterns](./07-technical/component-patterns.md)

---

## System Architecture Overview

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                          DONUTAI PLATFORM                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐                                                        │
│  │  SUPERADMIN  │  Creates: Curricula, Courses, Global Content,         │
│  │   (Platform) │          Questions, Exams, Institutes                  │
│  └──────┬───────┘                                                        │
│         │                                                                │
│         │ propagates curriculum, content, questions                      │
│         ▼                                                                │
│  ┌──────────────┐                                                        │
│  │  INSTITUTE   │  Creates: Batches, Teachers, Students, Timetables,    │
│  │   (School)   │          Academic Plans, Local Content                 │
│  └──────┬───────┘                                                        │
│         │                                                                │
│         │ assigns batches, schedules, academic plans                     │
│         ▼                                                                │
│  ┌──────────────┐                                                        │
│  │   TEACHER    │  Creates: Lesson Plans, Content, Homework, Exams      │
│  │  (Classroom) │  Consumes: Timetable, Academic Plan                    │
│  └──────┬───────┘                                                        │
│         │                                                                │
│         │ assigns content, homework, assessments                         │
│         ▼                                                                │
│  ┌──────────────┐                                                        │
│  │   STUDENT    │  Consumes: All assigned content, lessons, tests       │
│  │  (Learner)   │  Creates: Submissions, Test Attempts                   │
│  └──────────────┘                                                        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Portal Access Routes

| Portal | Base Route | Login Page |
|--------|------------|------------|
| SuperAdmin | `/superadmin/*` | `/` (Portal Selection) |
| Institute | `/institute/*` | `/` (Portal Selection) |
| Teacher | `/teacher/*` | `/login` |
| Student | `/student/*` | `/student/login` |

---

## Key Concepts

### Master Data Hierarchy
```text
Curriculum (CBSE, ICSE, State Boards)
└── Class (1-12)
    └── Subject (Physics, Chemistry, Maths)
        └── Chapter (Newton's Laws, Thermodynamics)
            └── Topic (First Law, Second Law)

Course (JEE Mains, NEET, Foundation)
└── Subject
    └── Chapter (mapped from curriculum + exclusive)
        └── Topic
```

### Content Types
| Type | Description | Formats |
|------|-------------|---------|
| Video | Lecture recordings, animations | YouTube, Vimeo, MP4 |
| Document | Reading materials | PDF, DOCX, PPTX |
| Interactive | Simulations, games | HTML5, Widgets |
| Quiz | Quick assessments | In-platform |
| Notes | Text-based content | Markdown |

### User Scoping
- **SuperAdmin**: Platform-wide access
- **Institute**: Filtered by assigned curriculum and courses
- **Teacher**: Filtered by assigned subjects and batches
- **Student**: Filtered by enrolled batch and assigned content

---

## How to Use This Documentation

### For New Developers
1. Start with [Architecture Overview](./ARCHITECTURE.md)
2. Review [Technical Documentation](./07-technical/README.md)
3. Explore the portal you'll be working on
4. Check [Cross-Login Flows](./05-cross-login-flows/README.md) for data dependencies

### For QA Testers
1. Start with [Testing Overview](./06-testing-scenarios/README.md)
2. Use smoke tests for page-level verification
3. Use intra-login tests for module dependencies
4. Use inter-login tests for cross-portal scenarios

### For Product Team
1. Review portal overview pages for feature understanding
2. Check cross-login flows for business logic
3. Reference feature docs for detailed capabilities

---

## Documentation Maintenance

### When Adding New Features
1. Create documentation file in appropriate portal folder
2. Update portal README.md with link
3. Add cross-login flow if feature spans portals
4. Add testing scenarios

### When Modifying Features
1. Update relevant feature documentation
2. Update cross-login flows if behavior changed
3. Update testing scenarios

---

## File Structure

```text
/docs
├── README.md                           # This file
├── ARCHITECTURE.md                     # System architecture
│
├── 01-superadmin/                      # SuperAdmin portal docs
├── 02-institute/                       # Institute portal docs
├── 03-teacher/                         # Teacher portal docs
├── 04-student/                         # Student portal docs
│
├── 05-cross-login-flows/               # Inter-portal data flows
├── 06-testing-scenarios/               # QA test cases
└── 07-technical/                       # Developer documentation
```

---

*Last Updated: January 2025*
