# Technical Documentation Overview

> Developer-focused architecture and patterns.

---

## Documentation

| Document | Purpose |
|----------|---------|
| [Project Structure](./project-structure.md) | File organization |
| [Routing](./routing.md) | Route architecture |
| [Data Layer](./data-layer.md) | Mock data structure |
| [Component Patterns](./component-patterns.md) | Shared component usage |
| [Responsive Design](./responsive-design.md) | Mobile-first standards |
| [Performance](./performance.md) | Optimization patterns |

---

## Quick Reference

### Tech Stack
- React 18, TypeScript, Tailwind CSS
- Shadcn/UI, React Router v6, TanStack Query
- Framer Motion, Recharts

### Key Patterns
- Module-level code splitting
- Unified components with `mode` prop
- ResponsiveDialog (Dialog on desktop, Drawer on mobile)
- Virtualization for lists > 10 items
- Mobile-first with 44px touch targets

### File Locations
- Pages: `src/pages/{portal}/`
- Components: `src/components/{portal}/`
- Data: `src/data/`
- Routes: `src/routes/`

---

*Last Updated: January 2025*
