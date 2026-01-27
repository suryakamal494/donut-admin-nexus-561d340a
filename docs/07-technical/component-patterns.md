# Component Patterns

> Shared component usage and conventions.

---

## Overview

DonutAI uses a component library built on Shadcn/UI with custom patterns for consistency across portals. This document covers the key patterns and how to use them.

---

## Unified Component Pattern

Core components are shared across portals using a `mode` prop:

```typescript
interface QuestionCardProps {
  question: Question;
  mode: 'superadmin' | 'institute' | 'teacher';
  onEdit?: () => void;
  onDelete?: () => void;
}

function QuestionCard({ question, mode, onEdit, onDelete }: QuestionCardProps) {
  const canEdit = mode === 'superadmin' || 
    (mode === 'institute' && question.source === 'institute') ||
    (mode === 'teacher' && question.createdByTeacherId === currentTeacherId);
  
  return (
    <Card>
      {/* Shared UI */}
      {canEdit && <Button onClick={onEdit}>Edit</Button>}
    </Card>
  );
}
```

### Benefits
- Single source of truth for UI
- Consistent behavior across portals
- Easier maintenance

---

## ResponsiveDialog Pattern

Dialogs adapt to screen size:

```typescript
import { ResponsiveDialog } from '@/components/shared/ResponsiveDialog';

function MyComponent() {
  const [open, setOpen] = useState(false);
  
  return (
    <ResponsiveDialog 
      open={open} 
      onOpenChange={setOpen}
      title="Edit Item"
    >
      <FormContent />
    </ResponsiveDialog>
  );
}
```

### Behavior
- **Desktop (≥768px)**: Renders as `Dialog`
- **Mobile (<768px)**: Renders as `Drawer` (bottom sheet)

---

## PageHeader Pattern

Consistent page headers:

```typescript
import { PageHeader } from '@/components/shared/PageHeader';

function BatchesPage() {
  return (
    <div>
      <PageHeader 
        title="Batches"
        description="Manage class sections"
        actions={
          <Button onClick={handleCreate}>Create Batch</Button>
        }
      />
      {/* Page content */}
    </div>
  );
}
```

### Mobile Behavior
- Title and actions stack vertically
- Actions become full-width

---

## FilterBar Pattern

Horizontal filter controls:

```typescript
import { FilterBar } from '@/components/shared/FilterBar';

function ContentLibrary() {
  return (
    <FilterBar>
      <Select value={type} onValueChange={setType}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Content Type" />
        </SelectTrigger>
        {/* ... */}
      </Select>
      <Select value={subject} onValueChange={setSubject}>
        {/* ... */}
      </Select>
      <Input 
        placeholder="Search..." 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </FilterBar>
  );
}
```

### Mobile Behavior
- Filters scroll horizontally
- Pills style on mobile

---

## DataTable Pattern

Tables with mobile responsiveness:

```typescript
import { DataTable } from '@/components/shared/DataTable';

const columns = [
  { accessorKey: 'name', header: 'Name', priority: 1 },
  { accessorKey: 'email', header: 'Email', priority: 2 },
  { accessorKey: 'status', header: 'Status', priority: 3 },
  { accessorKey: 'actions', header: '', priority: 1 },
];

function TeachersTable({ data }) {
  return (
    <DataTable 
      columns={columns} 
      data={data}
      onRowClick={(row) => handleView(row)}
    />
  );
}
```

### Mobile Behavior
- Horizontal scroll
- Priority columns shown first
- Lower priority columns hidden on narrow screens

---

## Card Grid Pattern

Responsive card layouts:

```typescript
function ContentGrid({ items }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(item => (
        <ContentCard key={item.id} content={item} />
      ))}
    </div>
  );
}
```

---

## Badge Pattern

Consistent status indicators:

```typescript
import { Badge } from '@/components/ui/badge';

// Source badges
<Badge variant="outline" className="bg-blue-50 text-blue-700">Global</Badge>
<Badge variant="outline" className="bg-green-50 text-green-700">Institute</Badge>
<Badge variant="outline" className="bg-purple-50 text-purple-700">My Content</Badge>

// Status badges
<Badge variant="default">Published</Badge>
<Badge variant="secondary">Draft</Badge>
<Badge variant="destructive">Overdue</Badge>
```

---

## Form Pattern

Consistent form layouts:

```typescript
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

function CreateBatchForm() {
  const form = useForm({
    resolver: zodResolver(batchSchema),
    defaultValues: { name: '', classId: '' }
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Batch Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* More fields */}
        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
}
```

---

## Virtualized List Pattern

For lists >10 items:

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function QuestionList({ questions }) {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: questions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
  });
  
  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div
        style={{ height: `${virtualizer.getTotalSize()}px` }}
        className="relative"
      >
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <QuestionCard question={questions[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Memoization Pattern

Prevent unnecessary re-renders:

```typescript
// Memoize components
const QuestionCard = React.memo(function QuestionCard({ question, onEdit }) {
  return (/* ... */);
});

// Memoize callbacks
const handleEdit = useCallback((id: string) => {
  setEditingId(id);
}, []);

// Memoize computations
const filteredQuestions = useMemo(() => 
  questions.filter(q => matchesFilters(q, filters)),
  [questions, filters]
);
```

---

## Touch Target Pattern

Ensure 44px minimum:

```typescript
// Good - explicit sizing
<Button className="h-11 px-4">Click Me</Button>

// Good - icon button with proper size
<Button variant="ghost" size="icon" className="h-11 w-11">
  <Edit className="h-4 w-4" />
</Button>

// Bad - too small
<Button className="h-8 px-2">Click Me</Button>
```

---

## Loading State Pattern

Skeleton loading:

```typescript
import { Skeleton } from '@/components/ui/skeleton';

function ContentCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-4 w-[200px]" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-20 w-full" />
      </CardContent>
    </Card>
  );
}
```

---

*Last Updated: January 2025*
