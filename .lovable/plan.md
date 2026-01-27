
# Remove Technical Section from Front-End Documentation UI

## Overview

Remove the "Technical" section (Overview, Project Structure, Routing, Data Layer, Component Patterns, Responsive Design, Performance) from the front-end documentation browser navigation while keeping the actual markdown files in the codebase for developer reference via Git/IDE.

---

## What Will Change

### File to Modify
**`src/data/docsNavigation.ts`**

Remove the "Technical" section object from the `docsNavigation` array (lines 178-191):

```typescript
// REMOVE THIS ENTIRE SECTION:
{
  title: "Technical",
  icon: "⚙️",
  color: "text-gray-600",
  items: [
    { title: "Overview", path: "07-technical/README" },
    { title: "Project Structure", path: "07-technical/project-structure" },
    { title: "Routing", path: "07-technical/routing" },
    { title: "Data Layer", path: "07-technical/data-layer" },
    { title: "Component Patterns", path: "07-technical/component-patterns" },
    { title: "Responsive Design", path: "07-technical/responsive-design" },
    { title: "Performance", path: "07-technical/performance" },
  ],
},
```

---

## What Will NOT Change

- **Backend files preserved**: All files in `docs/07-technical/` remain in the codebase
- **Other navigation sections**: Getting Started, SuperAdmin, Institute, Teacher, Student, Cross-Login Flows, and Testing Scenarios remain visible
- **Search functionality**: Technical docs will no longer appear in search results (since `flattenDocsNavigation()` iterates over `docsNavigation`)

---

## Result

### Before (8 sections):
1. Getting Started
2. SuperAdmin Portal
3. Institute Portal
4. Teacher Portal
5. Student Portal
6. Cross-Login Flows
7. Testing Scenarios
8. ~~Technical~~ (removed from UI)

### After (7 sections):
1. Getting Started
2. SuperAdmin Portal
3. Institute Portal
4. Teacher Portal
5. Student Portal
6. Cross-Login Flows
7. Testing Scenarios

---

## Impact

| Area | Impact |
|------|--------|
| Sidebar Navigation | Technical section no longer visible |
| Search Results | Technical docs excluded from search |
| Docs Index Page | Technical card removed from grid |
| Backend Files | No change - `docs/07-technical/*` remains |
| Direct URL Access | `/docs/07-technical/*` routes will show "not found" or fallback |

---

## Implementation

Single edit to `src/data/docsNavigation.ts`:
- Remove lines 178-191 (the Technical section object)
- Keep the comma handling clean (remove trailing comma from Testing Scenarios section)
