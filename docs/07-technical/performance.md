# Performance

> Optimization patterns and best practices.

---

## Overview

DonutAI implements several performance optimization patterns to ensure smooth user experience across all portals, especially on mobile devices with slower connections.

---

## Code Splitting

### Module-Level Splitting

Each portal loads independently:

```typescript
// App.tsx
import { lazy } from 'react';
const SuperAdminRoutes = lazy(() => import('./routes/SuperAdminRoutes'));
const InstituteRoutes = lazy(() => import('./routes/InstituteRoutes'));
const TeacherRoutes = lazy(() => import('./routes/TeacherRoutes'));
const StudentRoutes = lazy(() => import('./routes/StudentRoutes'));
```

**Impact**: Only the active portal's code loads, reducing initial bundle by ~70%.

### Component-Level Splitting

Heavy components load on demand:

```typescript
const RichTextEditor = lazy(() => import('./components/RichTextEditor'));
const PDFViewer = lazy(() => import('./components/PDFViewer'));
```

### Preloading Strategy

Critical paths preload after initial render:

```typescript
import { useEffect } from 'react';

useEffect(() => {
  const timer = setTimeout(() => {
    // Preload Institute module (most common next navigation)
    import('./routes/InstituteRoutes');
  }, 1500);
  return () => clearTimeout(timer);
}, []);
```

---

## Virtualization

Lists exceeding 10 items use virtualization:

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

function VirtualizedList({ items }) {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120, // Estimated row height
    overscan: 5, // Render extra items above/below viewport
  });
  
  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.key}
            style={{
              position: 'absolute',
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <ItemCard item={items[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Applied to**:
- Question Bank lists
- Content Library grids
- Lesson Bundles (student)
- Homework lists
- AI Path items

---

## Memoization

### Component Memoization

```typescript
import React from 'react';

// Prevent re-render if props unchanged
const QuestionCard = React.memo(function QuestionCard({ question, onEdit }) {
  return (/* ... */);
});
```

### Callback Memoization

```typescript
import { useCallback } from 'react';

// Stable callback reference
const handleItemClick = useCallback((id: string) => {
  setSelectedId(id);
}, []); // No dependencies = never changes
```

### Computed Value Memoization

```typescript
import { useMemo } from 'react';

// Only recompute when dependencies change
const filteredQuestions = useMemo(() => {
  return questions.filter(q => 
    (!filters.type || q.type === filters.type) &&
    (!filters.difficulty || q.difficulty === filters.difficulty) &&
    (!filters.chapter || q.chapterId === filters.chapter)
  );
}, [questions, filters.type, filters.difficulty, filters.chapter]);
```

### Functional State Updates

```typescript
// Avoid stale closure issues
setState(prev => ({
  ...prev,
  [key]: value
}));
```

---

## Data Modularization

Large data files split for tree-shaking:

```typescript
// Instead of one large file
// src/data/lessonBundles.ts (500KB)

// Split into modules
// src/data/student/types.ts (10KB)
// src/data/student/bundles.ts (100KB)
// src/data/student/content.ts (200KB)
// src/data/student/helpers.ts (20KB)
// src/data/student/index.ts (re-exports)
```

---

## Image Optimization

### Lazy Loading

```tsx
<img 
  src={thumbnail}
  alt={title}
  loading="lazy"
  className="object-cover"
/>
```

### Responsive Images

```tsx
<img
  srcSet={`${smallUrl} 400w, ${mediumUrl} 800w, ${largeUrl} 1200w`}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  alt={title}
/>
```

### Placeholder Skeletons

```tsx
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { cn } from '@/lib/utils';

function ImageWithSkeleton({ src, alt }) {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <div className="relative aspect-video">
      {!loaded && <Skeleton className="absolute inset-0" />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={cn(
          "w-full h-full object-cover",
          !loaded && "opacity-0"
        )}
      />
    </div>
  );
}
```

---

## Animation Performance

### Hardware Acceleration

Use transform/opacity for animations:

```tsx
import { motion } from 'framer-motion';

// Good - GPU accelerated
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
>

// Avoid - triggers layout
<motion.div
  initial={{ height: 0 }}
  animate={{ height: 'auto' }}
>
```

### Reduced Motion

Respect user preferences:

```tsx
import { useReducedMotion } from 'framer-motion';

const prefersReducedMotion = useReducedMotion();

<motion.div
  animate={{ scale: prefersReducedMotion ? 1 : 1.05 }}
>
```

---

## React Query Optimization

### Stale Time Configuration

```typescript
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
    },
  },
});
```

### Query Keys

```typescript
// Consistent key structure for cache hits
const questionKeys = {
  all: ['questions'] as const,
  lists: () => [...questionKeys.all, 'list'] as const,
  list: (filters: Filters) => [...questionKeys.lists(), filters] as const,
  details: () => [...questionKeys.all, 'detail'] as const,
  detail: (id: string) => [...questionKeys.details(), id] as const,
};
```

---

## Bundle Size Monitoring

### Tree Shaking

Import only what's needed:

```typescript
// Good - tree shakeable
import { Button } from '@/components/ui/button';
import { useCallback } from 'react';

// Avoid - imports entire module
import * as UI from '@/components/ui';
import React from 'react';
```

### Dynamic Imports

For conditional features:

```typescript
async function enableAdvancedFeature() {
  const { AdvancedEditor } = await import('./AdvancedEditor');
  // Use component
}
```

---

## Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| First Contentful Paint | < 1.5s | Lighthouse |
| Time to Interactive | < 3.5s | Lighthouse |
| Largest Contentful Paint | < 2.5s | Lighthouse |
| Cumulative Layout Shift | < 0.1 | Lighthouse |
| List scroll | 60fps | Chrome DevTools |
| Route transition | < 300ms | Perceived |

---

## Testing Performance

```typescript
// React Developer Tools Profiler
// 1. Enable "Record why each component rendered"
// 2. Start profiling
// 3. Interact with app
// 4. Analyze flamegraph

// Chrome DevTools
// 1. Performance tab
// 2. Record interaction
// 3. Look for long tasks (>50ms)
```

---

*Last Updated: January 2025*
