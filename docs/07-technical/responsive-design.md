# Responsive Design

> Mobile-first design standards.

---

## Overview

DonutAI follows a mobile-first responsive approach, starting with 320px screens and scaling up. The student portal prioritizes touch interactions while admin portals adapt between mobile and desktop patterns.

---

## Breakpoints

| Breakpoint | Width | Tailwind | Usage |
|------------|-------|----------|-------|
| Mobile | 0-639px | Default | Single column, touch |
| Tablet | 640-1023px | `sm:`, `md:` | 2 columns, hybrid |
| Desktop | 1024px+ | `lg:`, `xl:` | Multi-column, mouse |

---

## Mobile-First Pattern

Always start with mobile styles, then add larger breakpoints:

```tsx
// Good - mobile first
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// Bad - desktop first (don't do this)
<div className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
```

---

## Touch Targets

All interactive elements must meet 44px minimum:

```tsx
// Button minimum heights
<Button className="h-11">Default Button</Button>
<Button size="icon" className="h-11 w-11">Icon</Button>

// List items with padding
<div className="py-3 px-4">Tappable list item</div>

// Checkbox/radio with wrapper
<label className="flex items-center min-h-[44px] gap-3">
  <Checkbox />
  <span>Option label</span>
</label>
```

---

## ResponsiveDialog Pattern

Use `ResponsiveDialog` for all modal content:

```tsx
<ResponsiveDialog open={open} onOpenChange={setOpen}>
  <ResponsiveDialogTrigger asChild>
    <Button>Open</Button>
  </ResponsiveDialogTrigger>
  <ResponsiveDialogContent>
    {/* Desktop: centered modal */}
    {/* Mobile: bottom drawer */}
  </ResponsiveDialogContent>
</ResponsiveDialog>
```

---

## Navigation Patterns

### Sidebar Collapse

```tsx
// Desktop: Full sidebar
// Tablet: Icon-only sidebar
// Mobile: Off-canvas drawer

function AppSidebar() {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return <MobileSidebarDrawer />;
  }
  
  return <DesktopSidebar collapsible />;
}
```

### Bottom Navigation (Student)

```tsx
// Student portal uses bottom nav on mobile
<div className="fixed bottom-0 inset-x-0 lg:hidden">
  <BottomNavigation items={navItems} />
</div>

// Main content needs bottom padding
<main className="pb-20 lg:pb-0">
```

---

## Table Responsiveness

Tables use horizontal scroll with priority columns:

```tsx
// Priority 1: Always visible
// Priority 2: Hidden on narrow mobile
// Priority 3: Hidden on mobile

const columns = [
  { key: 'name', priority: 1 },      // Always shown
  { key: 'email', priority: 2 },     // Hidden < 400px
  { key: 'phone', priority: 3 },     // Hidden < 640px
  { key: 'actions', priority: 1 },   // Always shown
];

<div className="overflow-x-auto">
  <Table className="min-w-[600px]">
    {/* Table content */}
  </Table>
</div>
```

---

## Grid Responsiveness

Common grid patterns:

```tsx
// Card grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

// Stats grid
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

// Form two-column
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

// Sidebar layout
<div className="flex flex-col lg:flex-row gap-6">
  <aside className="lg:w-64 shrink-0">Sidebar</aside>
  <main className="flex-1">Content</main>
</div>
```

---

## Typography Scaling

```tsx
// Headings scale down on mobile
<h1 className="text-2xl md:text-3xl lg:text-4xl">

// Body text remains consistent
<p className="text-sm md:text-base">
```

---

## Spacing

Use consistent spacing that scales:

```tsx
// Page padding
<div className="p-4 md:p-6 lg:p-8">

// Section spacing
<section className="mb-6 md:mb-8">

// Component gaps
<div className="gap-3 md:gap-4">
```

---

## Filter Bar

Filters scroll horizontally on mobile:

```tsx
<div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:overflow-visible">
  <Badge>Filter 1</Badge>
  <Badge>Filter 2</Badge>
  <Badge>Filter 3</Badge>
  {/* Scrolls horizontally on mobile */}
</div>
```

---

## Condensed Action Bar

High-density pages use condensed headers on tablet+:

```tsx
<header className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
  <h1 className="text-xl md:text-lg">Title</h1>
  <div className="flex gap-2 text-sm text-muted-foreground md:ml-auto">
    <Badge>Week 4</Badge>
    <Badge>Jan 2025</Badge>
  </div>
</header>
```

---

## Form Responsiveness

Forms adapt layout:

```tsx
// Single column on mobile, two on desktop
<form className="space-y-4">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <FormField name="firstName" />
    <FormField name="lastName" />
  </div>
  
  {/* Full width on all sizes */}
  <FormField name="email" />
  
  {/* Buttons */}
  <div className="flex flex-col-reverse md:flex-row md:justify-end gap-2">
    <Button variant="outline">Cancel</Button>
    <Button type="submit">Save</Button>
  </div>
</form>
```

---

## Images

Responsive images with aspect ratio:

```tsx
<div className="aspect-video w-full">
  <img 
    src={thumbnail} 
    alt={title}
    className="object-cover w-full h-full rounded-lg"
    loading="lazy"
  />
</div>
```

---

## Testing Checklist

- [ ] Works at 320px width
- [ ] Works at 375px width (iPhone SE)
- [ ] Works at 768px width (iPad)
- [ ] Works at 1024px width (small laptop)
- [ ] Touch targets ≥44px
- [ ] Horizontal scroll where needed
- [ ] No content overflow
- [ ] Dialogs become drawers on mobile
- [ ] Navigation adapts correctly

---

*Last Updated: January 2025*
