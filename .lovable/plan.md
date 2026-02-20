

# Generate "The Bite" Logo and Integrate Across App

## Overview

Create a clean, minimal SVG logo component -- a geometric donut ring with a small "bite" gap -- using the brand coral-to-orange gradient. Then replace the current `Sparkles` icon placeholder across all portals (Super Admin, Institute, Teacher, Student) and login screens with this new logo. Also generate a favicon.

---

## Step 1: Create the DonutLogo SVG Component

**New file:** `src/components/shared/DonutLogo.tsx`

A reusable React component rendering an inline SVG of "The Bite" concept:
- A thick circular ring (stroke-based, not filled) with a small gap at the top-right (~30-40 degree arc removed), creating the "bite"
- The ring uses a `linearGradient` from `hsl(12, 85%, 65%)` (coral) to `hsl(25, 90%, 58%)` (orange) at 135 degrees
- Rounded stroke-linecap for smooth ends at the gap
- Props: `size` (default 40), `className` (optional)
- At small sizes (favicon, collapsed sidebar), the ring alone is the mark
- Clean, geometric, scales perfectly from 16px to 200px+

The SVG will be approximately:
```
<svg viewBox="0 0 100 100">
  <defs>
    <linearGradient id="donut-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(12, 85%, 65%)" />
      <stop offset="100%" stop-color="hsl(25, 90%, 58%)" />
    </linearGradient>
  </defs>
  <!-- Donut ring with bite gap -->
  <circle cx="50" cy="50" r="35" 
    stroke="url(#donut-grad)" 
    stroke-width="16" 
    fill="none" 
    stroke-linecap="round"
    stroke-dasharray="188 32"  <!-- creates the bite gap -->
    transform="rotate(-60 50 50)" <!-- positions gap at top-right -->
  />
</svg>
```

## Step 2: Generate Favicon

**New file:** `public/favicon.svg`

The same donut ring SVG exported as a standalone favicon file. Update `index.html` to reference it:
```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
```

## Step 3: Integrate Across All Sidebars

Replace `<Sparkles>` icon with `<DonutLogo>` in these files:

| File | Current | After |
|------|---------|-------|
| `src/components/layout/Sidebar.tsx` (Super Admin) | `<Sparkles>` in gradient-button div | `<DonutLogo size={24} />` (no wrapper div needed) |
| `src/components/layout/InstituteSidebar.tsx` | `<Sparkles>` in gradient-button div | `<DonutLogo size={24} />` |
| `src/components/layout/TeacherSidebar.tsx` | `<Sparkles>` in gradient-button div (x2: expanded + collapsed) | `<DonutLogo size={24} />` |
| `src/components/student/layout/StudentSidebar.tsx` | `<Sparkles>` in coral gradient div | `<DonutLogo size={24} />` |

The existing gradient wrapper divs (`w-9 h-9 rounded-xl gradient-button`) will be **kept** -- only the icon inside changes. The DonutLogo renders white strokes on the gradient background.

Alternatively, if the logo looks better standalone (gradient already baked into the SVG), remove the gradient-button wrapper and render the logo directly at `size={36}`.

## Step 4: Integrate on Login Screens

| File | Change |
|------|--------|
| `src/pages/Login.tsx` (Super Admin) | Replace `<Sparkles>` in the 20x20 gradient circle with `<DonutLogo size={48} />` |
| `src/pages/student/Login.tsx` | Replace `<Sparkles>` in the 8x8 branding section with `<DonutLogo size={32} />` |

Update the brand text from "DonutAI" / "Donut AI" to "theDonutAI" across all these locations.

## Step 5: Update Brand Name Consistency

Replace all instances of "DonutAI" and "Donut AI" with "theDonutAI" across:
- All 4 sidebars
- Both login pages
- `index.html` title and meta tags
- `src/components/docs/DocsLayout.tsx`

---

## Files Summary

| File | Action |
|------|--------|
| `src/components/shared/DonutLogo.tsx` | **Create** - SVG logo component |
| `public/favicon.svg` | **Create** - SVG favicon |
| `index.html` | **Modify** - Favicon link, title to "theDonutAI" |
| `src/components/layout/Sidebar.tsx` | **Modify** - Replace Sparkles with DonutLogo |
| `src/components/layout/InstituteSidebar.tsx` | **Modify** - Replace Sparkles with DonutLogo |
| `src/components/layout/TeacherSidebar.tsx` | **Modify** - Replace Sparkles with DonutLogo |
| `src/components/student/layout/StudentSidebar.tsx` | **Modify** - Replace Sparkles with DonutLogo |
| `src/pages/Login.tsx` | **Modify** - Replace Sparkles with DonutLogo, update name |
| `src/pages/student/Login.tsx` | **Modify** - Replace Sparkles with DonutLogo, update name |
| `src/components/docs/DocsLayout.tsx` | **Modify** - Update name |

## Design Decisions

- The logo is a **pure SVG component** -- no raster images, perfect at every size
- The "bite" gap is at the **top-right** (~1-2 o'clock position), giving a dynamic, forward-leaning feel
- Gradient direction matches the brand's signature 135-degree angle
- Stroke-linecap is **round** for warmth (not sharp/butt)
- The component accepts a `variant` prop: `"gradient"` (default, colored) and `"white"` (for use on colored backgrounds like sidebar icon containers)

