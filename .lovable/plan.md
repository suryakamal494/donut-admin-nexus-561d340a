

# Build "The Donut Companion" Logo

## The Concept

Transform the "O" from "Donut" into a friendly, premium companion character. The logo is a donut ring (hollow circle) with two simple dot eyes placed inside, plus a subtle inner arc that adds depth and personality -- like a slight smile or inner glow. This creates a face-like character that feels warm, approachable, and unmistakably unique to theDonutAI.

```text
     ╭─────────────╮
    │               │
    │    ●     ●    │    ● = dot eyes
    │               │
    │    ╰─────╯    │    subtle inner arc (smile/depth)
    │               │
     ╰─────────────╯
```

## Design Specifications

- **Outer ring**: Thick stroked circle (r=38, stroke-width=10) -- the "donut body"
- **Two dot eyes**: Small filled circles (r=4) positioned symmetrically inside the upper half, slightly above center
- **Inner arc**: A subtle curved line below the eyes (like a gentle smile), using a thinner stroke and lower opacity for depth
- **Gradient**: Coral `hsl(12, 85%, 65%)` to Pink `hsl(350, 70%, 60%)` at 135 degrees
- **White variant**: All elements render in white for use on colored backgrounds

## Why This Works

- **Trademark-safe**: A donut ring with eyes and an inner arc is a unique combination not used by Duolingo (owl), ChatGPT (abstract flower), or Hugging Face (emoji face)
- **Premium**: Clean geometry, gradient coloring, no cartoonish details -- just pure minimal shapes
- **Cute and approachable**: The two dots trigger pareidolia (humans see faces), making the logo feel like a companion
- **Scalable**: Works from 16px favicon to 200px+ hero placement
- **Meaningful**: It is literally a donut with a personality -- the AI companion

## Files to Modify

| File | Change |
|------|--------|
| `src/components/shared/DonutLogo.tsx` | Replace concentric circles with companion design (ring + eyes + inner arc) |
| `public/favicon.svg` | Match the new companion design |

No other files need changes -- the component is already integrated across all sidebars, login screens, and documentation layouts.

## Technical Details

The SVG structure inside `DonutLogo.tsx` will be:

1. Gradient definition (coral-to-pink, same as current)
2. Outer ring circle (the donut body)
3. Left eye -- small filled circle at roughly (38, 42)
4. Right eye -- small filled circle at roughly (62, 42)
5. Inner smile arc -- a path element drawing a subtle curve below the eyes, with reduced opacity (0.5-0.6) and thinner stroke

The component keeps the same props interface: `size`, `className`, and `variant` ("gradient" or "white").

