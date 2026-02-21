

# Fix: Subject Icon & Color Mismatch on Test Detail Pages

## The Problem

When you tap a subject card on the Tests listing page (e.g., Artificial Intelligence with its BrainCircuit icon), the detail page shows a wrong icon (BookOpen) and possibly wrong colors. This affects most subjects beyond the original 6 (Physics, Chemistry, Math, Biology, English, CS).

**Root cause**: The file `src/pages/student/SubjectTests.tsx` has its own **local icon and color mappings** that only cover 6 subjects. Everything else falls back to the generic `BookOpen` icon and blue color. Meanwhile, the listing cards use the shared system from `subjectColors.ts` which correctly maps all 24 subjects.

## The Fix

Replace the local mappings in `SubjectTests.tsx` with imports from the shared `subjectColors.ts` system -- the single source of truth that already handles all 24 subjects correctly.

### Changes to `src/pages/student/SubjectTests.tsx`

**Remove** (lines 42-69):
- Local `iconMap` (only 6 subjects)
- Local `colorConfig` (only 6 color schemes)
- Local `subjectColorKey` (only 6 mappings)

**Replace with** imports from the shared system:
- `getSubjectIcon(subject)` -- returns the correct Lucide icon for any of the 24 subjects
- `getSubjectColors(colorKey)` -- returns the full color scheme for any subject
- Use the `subjectColorMap` from `data/student/tests.ts` (which already maps all 24 subjects to their color keys)

**Update usage** at line 299-301:
- Instead of `iconMap[subjectKey] || BookOpen`, use `getSubjectIcon(subjectKey)`
- Instead of local color lookups, use `getSubjectColors(subjectColorMap[subjectKey] || "blue")`

**Adapt color property names**: The shared `SubjectColorScheme` uses property names like `headerGradient` and `iconBg` while the local config used `gradient` and `bg`. The filter tabs and test items will be updated to use the correct shared property names.

### Subjects Affected

These 18 subjects currently show the wrong icon (BookOpen) on their detail pages:
Hindi, Sanskrit, Social Science, History, Geography, Political Science, Economics, Science, Zoology, Botany, Environmental Studies, Fine Arts, Physical Education, Accountancy, Business Studies, **Artificial Intelligence**, Informatics Practices, Home Science

### No Other Files Need Changes

The listing page (`SubjectTestCard.tsx`) and the group component (`SubjectTestGroup.tsx`) already use the shared system or their own complete local maps. Only the detail page is broken.

## Summary

One file changed. Local duplicate mappings removed. Shared single-source-of-truth system used instead. All 24 subjects will display correct icons and colors on their test detail pages.
