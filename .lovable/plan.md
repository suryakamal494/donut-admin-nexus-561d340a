

# Redesign: theDonutAI Logo — Target/Bullseye Concept

## Problem

The current "bite" logo (broken circle) looks like a horseshoe. It has no visual meaning — users cannot understand that a gap in a circle represents "filling learning gaps." It fails to communicate the product's purpose.

## New Concept: Target/Bullseye Donut

Inspired by the reference image, the logo becomes **concentric circles with a center dot** — a target/bullseye shape that is still a donut (ring shape) but now conveys meaning:

- **Outer ring**: The learning ecosystem / diagnostic layer
- **Inner ring**: The assessment / validation layer  
- **Center dot**: The student at the center of everything
- **Overall shape**: A target = precision, focus, aiming toward learning goals

```text
    ╭──────────╮
   │  ╭──────╮  │
   │ │  ╭──╮  │ │
   │ │ │ ** │ │ │    ** = center dot (student)
   │ │  ╰──╯  │ │    inner ring = assessment
   │  ╰──────╯  │    outer ring = diagnostic
    ╰──────────╯
```

Uses the brand coral-to-pink gradient (`hsl(12, 85%, 65%)` to `hsl(350, 70%, 60%)`).

## What Changes

### 1. Redesign `src/components/shared/DonutLogo.tsx`

Replace the current single broken circle with three concentric elements:

- **Outer ring**: `circle` with `r="42"`, `stroke-width="8"`, no fill
- **Inner ring**: `circle` with `r="24"`, `stroke-width="6"`, no fill  
- **Center dot**: `circle` with `r="8"`, filled solid

All three use the same coral-to-pink linear gradient. The component keeps the same props (`size`, `className`, `variant` with "gradient" and "white" options).

### 2. Update `public/favicon.svg`

Same concentric circle design exported as standalone SVG favicon.

### 3. No Other Files Change

The logo is already integrated across all sidebars and login screens from the previous implementation. Since we're only changing the SVG internals of `DonutLogo.tsx`, every location that uses `<DonutLogo />` will automatically get the new design.

## Files Modified

| File | Change |
|------|--------|
| `src/components/shared/DonutLogo.tsx` | Redesign SVG from broken circle to concentric target/bullseye |
| `public/favicon.svg` | Match new concentric design |

No other files need changes — the component is already used everywhere.

## Design Details

- Gradient: coral `hsl(12, 85%, 65%)` to pink `hsl(350, 70%, 60%)` at 135 degrees
- Outer ring stroke-width is thicker than inner ring for visual hierarchy
- Center dot is solid filled (not stroked) for emphasis
- All elements use rounded edges
- Scales cleanly from 16px (favicon) to 200px+
- White variant for use on colored backgrounds (sidebar icon containers)

