# Routing Architecture

> Route structure and navigation patterns.

---

## Overview

DonutAI uses React Router v6 with module-level code splitting. Each portal has its own route tree that loads independently, reducing initial bundle size.

---

## Route Structure

### Root Routes (App.tsx)

```typescript
<Routes>
  <Route path="/" element={<Landing />} />
  <Route path="/superadmin/*" element={<SuperAdminRoutes />} />
  <Route path="/institute/*" element={<InstituteRoutes />} />
  <Route path="/teacher/*" element={<TeacherRoutes />} />
  <Route path="/student/*" element={<StudentRoutes />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

### Module Loading

```typescript
// Lazy-loaded modules
const SuperAdminRoutes = lazy(() => import('./routes/SuperAdminRoutes'));
const InstituteRoutes = lazy(() => import('./routes/InstituteRoutes'));
const TeacherRoutes = lazy(() => import('./routes/TeacherRoutes'));

// Student module is lazy at route level but eager internally
const StudentRoutes = lazy(() => import('./routes/StudentRoutes'));
```

---

## Portal Routes

### SuperAdmin Routes

| Route | Page | Description |
|-------|------|-------------|
| `/superadmin/dashboard` | Dashboard | Platform overview |
| `/superadmin/curriculum` | Parameters | Curriculum management |
| `/superadmin/courses` | Courses | Course builder |
| `/superadmin/institutes` | Institutes | Institute management |
| `/superadmin/users` | Users | User management |
| `/superadmin/content` | ContentLibrary | Global content |
| `/superadmin/questions` | QuestionsBank | Question bank |
| `/superadmin/exams` | Exams | PYP/Grand Tests |
| `/superadmin/roles` | RolesAccess | RBAC |

### Institute Routes

| Route | Page | Description |
|-------|------|-------------|
| `/institute/dashboard` | Dashboard | Setup checklist |
| `/institute/batches` | Batches | Batch management |
| `/institute/teachers` | Teachers | Teacher management |
| `/institute/students` | Students | Student registration |
| `/institute/masterdata` | MasterData | Curriculum view |
| `/institute/timetable/setup` | Setup | Period config |
| `/institute/timetable/workspace` | Workspace | Schedule creation |
| `/institute/timetable/view` | View | Published view |
| `/institute/timetable/substitution` | Substitution | Teacher replacement |
| `/institute/academic-schedule/setup` | Setup | Hour allocation |
| `/institute/academic-schedule/plans` | Plans | Plan generation |
| `/institute/academic-schedule` | Progress | Batch progress |
| `/institute/content` | ContentLibrary | Institute content |
| `/institute/questions` | QuestionBank | Institute questions |
| `/institute/exams-new` | ExamsNew | Exam creation |
| `/institute/roles` | RolesAccess | Staff roles |

### Teacher Routes

| Route | Page | Description |
|-------|------|-------------|
| `/teacher/dashboard` | Dashboard | Today's overview |
| `/teacher/schedule` | Schedule | Weekly timetable |
| `/teacher/lesson-plans` | LessonPlans | Plan management |
| `/teacher/lesson-workspace/:id` | LessonWorkspace | Block editor |
| `/teacher/content` | ContentLibrary | Content library |
| `/teacher/homework` | Homework | Homework system |
| `/teacher/exams` | Exams | Assessments |
| `/teacher/academic-progress` | AcademicProgress | Teaching confirmation |
| `/teacher/notifications` | Notifications | Alerts |
| `/teacher/profile` | Profile | Settings |

### Student Routes

| Route | Page | Description |
|-------|------|-------------|
| `/student/dashboard` | Dashboard | Daily hub |
| `/student/subjects` | Subjects | Subject cards |
| `/student/subject/:id` | SubjectDetail | Chapter list |
| `/student/chapter/:id` | ChapterView | Three-mode view |
| `/student/content/:id` | ContentViewer | Content player |
| `/student/tests` | Tests | Test list |
| `/student/test/:id` | TestPlayer | Exam interface |
| `/student/test/:id/results` | TestResults | Score analysis |
| `/student/homework` | Homework | Submission |
| `/student/progress` | Progress | Analytics |
| `/student/notifications` | Notifications | Alerts |

---

## Navigation Patterns

### Portal Selection

```text
Landing (/)
├── SuperAdmin → /superadmin/dashboard
├── Institute → /institute/dashboard
├── Teacher → /teacher/dashboard
└── Student → /student/dashboard
```

### Sidebar Navigation

Each portal has a sidebar with:
- Main navigation items
- Collapsible groups (e.g., Timetable, Academic Schedule)
- Active state highlighting
- Mobile drawer variant

### Breadcrumb Navigation

For nested routes:
```text
Institute > Timetable > Workspace
```

---

## Protected Routes

### Authentication Flow

```typescript
// Route guard pattern
function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();
  
  if (loading) return <PageSkeleton />;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== requiredRole) return <Navigate to="/" />;
  
  return children;
}
```

### Permission-Based Rendering

```typescript
// Component-level permission check
function FeatureButton({ permission, children }) {
  const { hasPermission } = usePermissions();
  
  if (!hasPermission(permission)) return null;
  
  return children;
}
```

---

## URL State

### Query Parameters

Used for:
- Filters: `?subject=physics&difficulty=hard`
- Pagination: `?page=2&limit=20`
- Search: `?q=motion`

### Route Parameters

Used for:
- Entity IDs: `/student/chapter/:chapterId`
- Nested resources: `/institute/timetable/view`

---

## Code Splitting Strategy

### Module Level

```typescript
// Each portal loads independently
const InstituteRoutes = lazy(() => import('./routes/InstituteRoutes'));
```

### Component Level

```typescript
// Heavy components within modules
const RichTextEditor = lazy(() => import('./components/RichTextEditor'));
```

### Preloading

```typescript
// Preload after initial render
useEffect(() => {
  const timer = setTimeout(() => {
    import('./routes/InstituteRoutes');
  }, 1500);
  return () => clearTimeout(timer);
}, []);
```

---

## Error Boundaries

### Module Boundary

```typescript
function ModuleBoundary({ children }) {
  return (
    <LazyErrorBoundary>
      <Suspense fallback={<PageSkeleton />}>
        {children}
      </Suspense>
    </LazyErrorBoundary>
  );
}
```

### Route Error Handling

```typescript
<Route 
  path="/institute/*" 
  element={
    <ErrorBoundary fallback={<ErrorPage />}>
      <InstituteRoutes />
    </ErrorBoundary>
  }
/>
```

---

*Last Updated: January 2025*
