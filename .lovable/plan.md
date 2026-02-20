

# Fix: Subject Icons All Showing Same Icon + UI Breakage

## Root Cause

The `SubjectCard.tsx` component has its own **local** icon map and color config that only includes the original 6 subjects. It does NOT use the shared `subjectColors.ts` system that was expanded with all 24 subjects.

```text
SubjectCard.tsx (LOCAL - only 6 entries)     subjectColors.ts (SHARED - all 24 entries)
  iconMap: Calculator, Atom, FlaskConical,     subjectIconMap: All 24 Lucide icons
           Leaf, BookOpen, Code                 subjectColorSchemes: All 20 color keys
  colorConfig: blue, purple, green,
               red, amber, cyan

Result: Hindi ("Languages") -> not in local iconMap -> falls back to BookOpen
        Hindi ("orange") -> not in local colorConfig -> falls back to blue (or undefined = breakage)
```

This is why every new subject shows the same blue BookOpen icon.

The UI breakage (blank cards, broken layout in screenshot 2) happens because subjects like Sanskrit (color: "indigo"), History (color: "brown"), etc. return `undefined` from the local `colorConfig`, causing `colors.gradient`, `colors.shadow` etc. to be `undefined` -- breaking the Tailwind classes.

## Fix Plan

### Step 1: Rewire SubjectCard.tsx to Use Shared System

**File:** `src/components/student/SubjectCard.tsx`

- Remove the local `iconMap` (lines 19-26) -- replace with import of `subjectIconMap` from `subjectColors.ts`
- Remove the local `colorConfig` (lines 29-66) -- replace with import of `getSubjectColors` from `subjectColors.ts`
- Map the `SubjectColorScheme` fields to the card's needs (gradient for icon bg, textAccent for text, etc.)
- Add all missing Lucide icon imports

This is the only file that needs changing. The shared system already has all 24 subjects properly configured.

### Step 2: Verify Color Mapping Compatibility

The current `colorConfig` uses fields: `gradient`, `shadow`, `bg`, `text`. The shared `SubjectColorScheme` uses: `iconBg`, `textAccent`, `gradient` (for card bg), etc.

Mapping:
- `colors.gradient` (icon background) -> use `subjectColorSchemes[color].iconBg` (already has `bg-gradient-to-br from-X to-Y`)
- `colors.shadow` -> derive from the color key (e.g., `shadow-{color}-400/30`)
- `colors.bg` -> derive from `bg-{color}-50`
- `colors.text` -> use `subjectColorSchemes[color].textAccent`

A small helper inside SubjectCard will bridge this gap cleanly without changing the shared system.

## Technical Details

### Changes to `src/components/student/SubjectCard.tsx`

1. Replace Lucide imports: add Languages, ScrollText, Globe, Landmark, Mountain, Scale, TrendingUp, Microscope, Bug, Sprout, TreePine, Palette, Dumbbell, Receipt, Briefcase, BrainCircuit, Database, Home
2. Replace local `iconMap` with `subjectIconMap` from shared module
3. Replace local `colorConfig` with a function that reads from `getSubjectColors()` and maps to the card's styling needs
4. Ensure the fallback (`|| BookOpen` for icon, `|| colorConfig.blue` for colors) still works via the shared system's built-in defaults

### Impact

- Zero visual change for existing 6 subjects (same colors, same icons)
- All 18 new subjects get their correct unique icons and color schemes
- UI breakage eliminated (no more `undefined` color values)
- Single source of truth for subject styling

### Files Modified

| File | Change |
|------|--------|
| `src/components/student/SubjectCard.tsx` | Remove local icon/color maps, use shared `subjectColors.ts` |

No other files need changes -- the shared system is already complete.
