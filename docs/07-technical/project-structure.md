# Project Structure

> File organization guide for the DonutAI codebase.

---

## Overview

The project follows a portal-based organization where code is grouped by user type (SuperAdmin, Institute, Teacher, Student) to enable code splitting and maintain clear boundaries.

---

## Root Structure

```text
donut-ai/
├── docs/                       # Documentation (you are here)
├── public/                     # Static assets
├── src/                        # Source code
│   ├── assets/                 # Images, fonts, static files
│   ├── components/             # Reusable components
│   ├── data/                   # Mock data layer
│   ├── hooks/                  # Custom React hooks
│   ├── integrations/           # External service integrations
│   ├── lib/                    # Utility functions
│   ├── pages/                  # Page components
│   ├── routes/                 # Route definitions
│   └── types/                  # TypeScript type definitions
├── supabase/                   # Supabase configuration
├── .lovable/                   # Lovable configuration
└── Configuration files...
```

---

## Source Code Organization

### `/src/pages/` - Page Components

```text
src/pages/
├── Landing.tsx                 # Portal selection page
├── NotFound.tsx                # 404 page
├── superadmin/                 # SuperAdmin pages
│   ├── Dashboard.tsx
│   ├── Parameters.tsx          # Curriculum
│   ├── Courses.tsx
│   ├── Institutes.tsx
│   ├── Users.tsx
│   ├── ContentLibrary.tsx
│   ├── QuestionsBank.tsx
│   ├── Exams.tsx
│   └── RolesAccess.tsx
├── institute/                  # Institute pages
│   ├── Dashboard.tsx
│   ├── Batches.tsx
│   ├── Teachers.tsx
│   ├── Students.tsx
│   ├── MasterData.tsx
│   ├── timetable/
│   │   ├── Setup.tsx
│   │   ├── Workspace.tsx
│   │   ├── View.tsx
│   │   └── Substitution.tsx
│   ├── academic-schedule/
│   │   ├── Setup.tsx
│   │   ├── Plans.tsx
│   │   └── Progress.tsx
│   ├── ContentLibrary.tsx
│   ├── QuestionBank.tsx
│   ├── ExamsNew.tsx
│   └── RolesAccess.tsx
├── teacher/                    # Teacher pages
│   ├── Dashboard.tsx
│   ├── Schedule.tsx
│   ├── LessonPlans.tsx
│   ├── LessonWorkspace.tsx
│   ├── ContentLibrary.tsx
│   ├── Homework.tsx
│   ├── Exams.tsx
│   ├── AcademicProgress.tsx
│   ├── Notifications.tsx
│   └── Profile.tsx
└── student/                    # Student pages
    ├── Dashboard.tsx
    ├── Subjects.tsx
    ├── SubjectDetail.tsx
    ├── ChapterView.tsx
    ├── ContentViewer.tsx
    ├── Tests.tsx
    ├── TestPlayer.tsx
    ├── TestResults.tsx
    ├── Homework.tsx
    ├── Progress.tsx
    └── Notifications.tsx
```

---

### `/src/components/` - Reusable Components

```text
src/components/
├── ui/                         # Shadcn UI primitives
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── sheet.tsx
│   └── ...
├── shared/                     # Cross-portal components
│   ├── PageHeader.tsx
│   ├── ResponsiveDialog.tsx
│   ├── DataTable.tsx
│   ├── FilterBar.tsx
│   └── ...
├── superadmin/                 # SuperAdmin-specific
│   ├── CurriculumPanel.tsx
│   ├── InstituteTable.tsx
│   └── ...
├── institute/                  # Institute-specific
│   ├── BatchWizard.tsx
│   ├── TimetableGrid.tsx
│   ├── AcademicPlanner.tsx
│   └── ...
├── teacher/                    # Teacher-specific
│   ├── LessonBlockEditor.tsx
│   ├── TeachingConfirmation.tsx
│   └── ...
└── student/                    # Student-specific
    ├── SubjectCard.tsx
    ├── ChapterModeSelector.tsx
    ├── LessonBundleCard.tsx
    └── ...
```

---

### `/src/data/` - Mock Data Layer

```text
src/data/
├── masterData.ts               # Unified curriculum/course data
├── instituteData.ts            # Institutes, batches
├── teacherData/                # Teacher-specific data
│   ├── types.ts
│   ├── schedule.ts
│   ├── lessonPlans.ts
│   └── index.ts
├── studentData/                # Student-specific data
│   ├── types.ts
│   ├── lessonBundles.ts
│   ├── homework.ts
│   └── index.ts
├── contentLibraryData.ts       # Content items
├── questionsData.ts            # Question bank
├── examsData.ts                # Exam definitions
├── timetableData.ts            # Timetable structures
└── academicScheduleData.ts     # Academic plans
```

---

### `/src/routes/` - Route Definitions

```text
src/routes/
├── SuperAdminRoutes.tsx        # Lazy-loaded module
├── InstituteRoutes.tsx         # Lazy-loaded module
├── TeacherRoutes.tsx           # Lazy-loaded module
└── StudentRoutes.tsx           # Eager-loaded (internal lazy)
```

---

### `/src/hooks/` - Custom Hooks

```text
src/hooks/
├── use-mobile.tsx              # Mobile detection
├── use-toast.ts                # Toast notifications
├── useAcademicPlanGenerator.ts # Plan generation logic
├── useTeachingConfirmation.ts  # Confirmation logic
└── ...
```

---

### `/src/lib/` - Utilities

```text
src/lib/
├── utils.ts                    # General utilities (cn, etc.)
├── examBlockUtils.ts           # Exam block helpers
└── ...
```

---

## Key Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Root component with routing |
| `src/index.css` | Global styles and design tokens |
| `tailwind.config.ts` | Tailwind configuration |
| `vite.config.ts` | Build configuration |
| `tsconfig.json` | TypeScript configuration |

---

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `BatchWizard.tsx` |
| Pages | PascalCase | `Dashboard.tsx` |
| Hooks | camelCase with `use` prefix | `useMobile.tsx` |
| Utils | camelCase | `examBlockUtils.ts` |
| Data files | camelCase | `masterData.ts` |
| Types | PascalCase | `Batch`, `Teacher` |

---

## Import Aliases

The project uses `@/` as an import alias for `src/`:

```typescript
// Instead of
import { Button } from '../../../components/ui/button';

// Use
import { Button } from '@/components/ui/button';
```

---

## Module Boundaries

Each portal is a distinct module for code splitting:

| Module | Load Strategy | Reason |
|--------|---------------|--------|
| SuperAdmin | Lazy | Admin-only, large |
| Institute | Lazy | School-specific |
| Teacher | Lazy | Teacher-only |
| Student | Eager internal | UX priority |

---

*Last Updated: January 2025*
