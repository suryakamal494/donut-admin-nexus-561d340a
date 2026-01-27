# DonutAI - System Architecture

> Technical overview of the DonutAI platform architecture, data flows, and design patterns.

---

## Table of Contents

1. [Platform Overview](#platform-overview)
2. [Portal Architecture](#portal-architecture)
3. [Data Flow Architecture](#data-flow-architecture)
4. [Component Architecture](#component-architecture)
5. [Routing Architecture](#routing-architecture)
6. [State Management](#state-management)
7. [Performance Patterns](#performance-patterns)

---

## Platform Overview

DonutAI is a multi-portal educational platform built with:

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling |
| **Shadcn/UI** | Component library |
| **React Router v6** | Routing |
| **TanStack Query** | Server state |
| **Framer Motion** | Animations |
| **Recharts** | Data visualization |

### Design Principles

1. **Mobile-First**: All UIs designed for 320px+ screens first
2. **Component Reuse**: Shared components across portals with mode props
3. **Code Splitting**: Module-level lazy loading for performance
4. **Type Safety**: Full TypeScript coverage with strict mode

---

## Portal Architecture

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                            APP.TSX (ROOT)                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│    ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌───────────┐  │
│    │ SuperAdmin  │   │  Institute  │   │   Teacher   │   │  Student  │  │
│    │   Routes    │   │   Routes    │   │   Routes    │   │  Routes   │  │
│    │  (Lazy)     │   │   (Lazy)    │   │   (Lazy)    │   │  (Eager)  │  │
│    └──────┬──────┘   └──────┬──────┘   └──────┬──────┘   └─────┬─────┘  │
│           │                 │                 │                 │        │
│           ▼                 ▼                 ▼                 ▼        │
│    /superadmin/*     /institute/*      /teacher/*       /student/*      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Module-Level Code Splitting

Each portal is a separate route tree that loads independently:

```typescript
// App.tsx structure
const SuperAdminRoutes = lazy(() => import('./routes/SuperAdminRoutes'));
const InstituteRoutes = lazy(() => import('./routes/InstituteRoutes'));
const TeacherRoutes = lazy(() => import('./routes/TeacherRoutes'));
// StudentRoutes loaded eagerly for instant navigation
```

**Why Student is Eager**: Student portal requires instant transitions between subjects, chapters, and modes for optimal learning experience.

---

## Data Flow Architecture

### Master Data Source of Truth

All curriculum and course data flows from a single source:

```text
src/data/masterData.ts
├── Curriculums (CBSE, ICSE, State Boards)
├── Courses (JEE, NEET, Foundation)
├── Classes
├── Subjects
├── Chapters (curriculum-linked + course-owned)
└── Topics
```

### Cross-Portal Data Flow

```text
SUPERADMIN CREATES
├── Curriculum → visible to all Institutes with that curriculum
├── Courses → visible to all Institutes with that course
├── Global Content → visible (read-only) to Institute, Teacher
├── Global Questions → available for Institute/Teacher exams
└── PYP/Grand Tests → can be assigned to Institutes

INSTITUTE CREATES
├── Batches → maps Class + Teachers + Students
├── Teachers → assigned to Subjects + Batches
├── Students → enrolled in Batches
├── Timetable → visible to assigned Teachers and Students
├── Academic Plan → visible to assigned Teachers
├── Local Content → visible to Teachers (subject-scoped)
└── Local Questions → available for Teacher exams

TEACHER CREATES
├── Lesson Plans → for their scheduled classes
├── Content → visible to assigned Batches
├── Homework → assigned to specific Batches
├── Assessments → for their Batches
└── Teaching Confirmations → updates Academic Progress

STUDENT CONSUMES
├── Assigned Content (via batch assignment)
├── Lesson Content (via class sessions)
├── Homework (via batch assignment)
├── Tests (via batch assignment)
└── Progress Tracking (personal)
```

---

## Component Architecture

### Unified Component Pattern

Core components are shared across portals using a `mode` prop:

```typescript
// Example: QuestionCard component
interface QuestionCardProps {
  question: Question;
  mode: 'superadmin' | 'institute' | 'teacher';
  onEdit?: () => void;
  onDelete?: () => void;
}

function QuestionCard({ question, mode, onEdit, onDelete }: QuestionCardProps) {
  const canEdit = mode === 'superadmin' || 
                  (mode === 'institute' && question.source === 'institute') ||
                  (mode === 'teacher' && question.createdByTeacherId === currentTeacher.id);
  
  return (
    <Card>
      {/* Shared UI */}
      {canEdit && <EditButton onClick={onEdit} />}
    </Card>
  );
}
```

### Component Categories

| Category | Location | Description |
|----------|----------|-------------|
| **UI Components** | `src/components/ui/` | Shadcn/UI primitives |
| **Shared Components** | `src/components/` | Cross-portal components |
| **Portal Components** | `src/components/{portal}/` | Portal-specific components |
| **Page Components** | `src/pages/{portal}/` | Route-level components |

### Key Shared Components

| Component | Used By | Purpose |
|-----------|---------|---------|
| `PageHeader` | All portals | Consistent page headers with actions |
| `QuestionCard` | SA, Inst, Teacher | Question display with mode-based permissions |
| `ContentCard` | SA, Inst, Teacher | Content item display |
| `ResponsiveDialog` | All portals | Dialog on desktop, Drawer on mobile |
| `DataTable` | All portals | Consistent table patterns |

---

## Routing Architecture

### Route Structure

```text
/                           → Landing (Portal Selection)
/login                      → Teacher/Admin Login
/student/login              → Student Login

/superadmin
├── /dashboard              → Platform overview
├── /curriculum             → Curriculum management
├── /courses                → Course builder
├── /institutes             → Institute management
├── /users                  → User management
├── /content                → Global content library
├── /questions              → Global question bank
├── /exams                  → PYP/Grand Tests
└── /roles                  → RBAC management

/institute
├── /dashboard              → Setup checklist
├── /batches                → Batch management
├── /teachers               → Teacher management
├── /students               → Student management
├── /masterdata             → Read-only curriculum view
├── /timetable/*            → Timetable system
├── /academic-schedule/*    → Academic planning
├── /content                → Institute content
├── /questions              → Institute questions
├── /exams-new              → Pattern-based exams
└── /roles                  → Staff management

/teacher
├── /dashboard              → Today's overview
├── /schedule               → Weekly timetable
├── /lesson-plans           → Plan management
├── /lesson-workspace/:id   → Block editor
├── /content                → Content library
├── /homework               → Homework system
├── /exams                  → Assessments
├── /academic-progress      → Teaching confirmation
├── /notifications          → Alert system
└── /profile                → Profile settings

/student
├── /dashboard              → Daily hub
├── /subjects               → Subject cards
├── /subject/:id            → Chapter list
├── /chapter/:id            → Three-mode view
├── /content/:id            → Content viewer
├── /tests                  → Test list
├── /test/:id               → Test player
├── /progress               → Analytics
└── /notifications          → Alerts
```

---

## State Management

### Data Layer

```text
src/data/
├── masterData.ts           → Unified curriculum/course data
├── contentLibraryData.ts   → Content items
├── questionsData.ts        → Question bank
├── examsData.ts            → Exam definitions
├── timetableData.ts        → Schedule data
├── academicScheduleData.ts → Academic plans
└── teacher/                → Teacher-specific data
    ├── types.ts
    ├── schedule.ts
    ├── lessonPlans.ts
    └── index.ts
```

### State Patterns

| Pattern | Use Case |
|---------|----------|
| **React Query** | Server state, caching, refetching |
| **Local State** | UI state (modals, filters) |
| **URL State** | Filters, pagination, navigation context |
| **Context** | Auth, theme, portal-wide settings |

---

## Performance Patterns

### Code Splitting Strategy

```typescript
// Module-level lazy loading
const SuperAdminRoutes = lazy(() => import('./routes/SuperAdminRoutes'));

// Component-level lazy loading for heavy components
const RichTextEditor = lazy(() => import('./components/RichTextEditor'));
```

### Virtualization

Lists exceeding 10 items use `@tanstack/react-virtual`:

```typescript
// Used in: Question Bank, Content Library, Lesson Bundles
const virtualizer = useVirtualizer({
  count: items.length,
  getScrollElement: () => scrollRef.current,
  estimateSize: () => 120,
});
```

### Memoization Patterns

```typescript
// Heavy computations
const filteredData = useMemo(() => 
  data.filter(item => matchesFilters(item, filters)),
  [data, filters]
);

// Event handlers in lists
const handleClick = useCallback((id: string) => {
  setSelected(id);
}, []);

// Functional state updates
setState(prev => ({ ...prev, [key]: value }));
```

### Mobile Optimization

- **Touch Targets**: Minimum 44px for all interactive elements
- **Scroll Areas**: Native scrolling with `-webkit-overflow-scrolling: touch`
- **Images**: Lazy loading with intersection observer
- **Animations**: Hardware-accelerated transforms only

---

## Security Patterns

### Role-Based Access Control

```typescript
interface Permission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

interface RolePermissions {
  dashboard: { view: boolean };
  content: Permission & { scope: ScopeConfig };
  questions: Permission & { capabilities: CapabilityConfig };
  // ...
}
```

### Content Scoping

| User Type | Scope Rules |
|-----------|-------------|
| SuperAdmin | Platform-wide access |
| Institute | Own institute data only |
| Teacher | Assigned subjects + batches only |
| Student | Enrolled batch + assigned content only |

---

## Related Documentation

- [Project Structure](./07-technical/project-structure.md)
- [Routing Details](./07-technical/routing.md)
- [Data Layer](./07-technical/data-layer.md)
- [Component Patterns](./07-technical/component-patterns.md)
- [Responsive Design](./07-technical/responsive-design.md)

---

*Last Updated: January 2025*
