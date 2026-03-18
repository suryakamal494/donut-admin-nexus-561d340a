
Docs mobile audit summary:

- The main problem is in the docs shell itself, not the markdown files. The docs area is currently built with a fixed-height wrapper (`h-[calc(100vh-7rem)]`) plus nested Radix `ScrollArea` containers. On mobile, that combination is very likely causing the “cannot scroll the docs” behavior.
- The header is also desktop-first: menu, title, home link, and search all compete in one row, which will get cramped on narrow screens.
- Markdown rendering is only partially mobile-safe today. Tables and code blocks already have horizontal overflow, but the overall reading layout, spacing, and long-content handling still need a mobile pass.

Implementation plan:

1. Fix the docs page layout so mobile scrolling works reliably
   - Update `src/components/docs/DocsLayout.tsx`
   - Replace the current fixed viewport-height math with a true flex layout using `min-h-dvh` / `min-h-0`
   - Remove the hard-coded content height wrapper and let the content area own scrolling properly
   - Keep the sticky header, but make the document region a valid mobile scroll container

2. Stop relying on nested custom `ScrollArea` for the main reading surface
   - Update `src/components/docs/DocsViewer.tsx` and `src/pages/docs/DocsIndex.tsx`
   - Switch the main docs content to native `overflow-y-auto` scrolling, especially on mobile
   - Keep horizontal scrolling for wide content like tables, code blocks, and ASCII diagrams
   - This is the safest and most robust fix for touch scrolling issues

3. Rework the docs header for mobile
   - Update `src/components/docs/DocsLayout.tsx` and `src/components/docs/DocsSearch.tsx`
   - Move to a mobile-friendly 2-row header or compact search behavior
   - Prevent the title/search area from squeezing or overflowing on 320–390px widths
   - Keep breadcrumbs horizontally scrollable without widening the page

4. Harden markdown rendering for narrow screens
   - Update `src/components/docs/DocsViewer.tsx`
   - Improve mobile padding, prose sizing, word breaking, and spacing
   - Ensure images, long inline text, and fenced diagrams stay readable
   - Preserve horizontal scroll where needed instead of forcing bad wraps

5. Tighten mobile drawer/sidebar behavior
   - Update `src/components/docs/DocsLayout.tsx` and `src/components/docs/DocsSidebar.tsx`
   - Ensure the sidebar sheet has its own reliable vertical scroll
   - Slightly refine width/padding for smaller devices
   - Make sure opening/closing the drawer does not interfere with document scrolling

6. Run a full docs mobile QA audit after the fix
   Routes to verify:
   - `/docs`
   - `/docs/06-testing-scenarios/inter-login-tests/curriculum-scope-qa`
   - `/docs/07-technical/responsive-design`
   - at least one page with nested navigation from another major section

   Breakpoints:
   - 320x568
   - 375x812
   - 390x844
   - 768x1024

   What will be checked:
   - long docs vertically scroll on mobile
   - tables/code/ASCII diagrams horizontally scroll without breaking layout
   - header, breadcrumbs, and search stay usable
   - sidebar drawer scrolls correctly
   - no dead space, clipping, or `100vh` issues
   - docs index cards and quick links remain readable on small screens

Files likely involved:
- `src/components/docs/DocsLayout.tsx`
- `src/components/docs/DocsViewer.tsx`
- `src/pages/docs/DocsIndex.tsx`
- `src/components/docs/DocsSearch.tsx`
- `src/components/docs/DocsSidebar.tsx`
- possibly `src/components/ui/scroll-area.tsx` if a small touch-scroll improvement is still needed after the main refactor

Expected result:
- The docs become properly mobile-readable
- Touch scrolling works on long documents
- Wide content stays accessible without breaking the viewport
- Desktop behavior stays intact while mobile gets a much more reliable reading experience
