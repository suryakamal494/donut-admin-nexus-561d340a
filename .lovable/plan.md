

# Redesign: Donut Bot — Where the Donut IS the Character

## The Problem with the Current Logo

The rounded-square bot head has zero connection to "Donut." It could be any bot for any brand. The donut philosophy — the ring, the hole, the warm baked identity — is completely missing.

## The Fix: The Donut Ring IS the Bot's Body

Instead of a generic square head with a face, the **donut torus shape becomes the character itself**. The thick ring has eyes on the upper curve and a smile on the lower curve. The hole in the center remains visible — making it unmistakably a donut.

```text
         ╭╮          antenna nub
     ╭───┴───╮
    │  ◉   ◉  │      eyes on the upper ring
    │ ╭─────╮ │      
    │ │     │ │      visible donut hole (center cutout)
    │ ╰─────╯ │
    │  ╰───╯  │      smile on the lower ring
     ╰────────╯
       ▓▓▓▓▓         floating shadow
```

## Why This Works

- **Unmistakably a donut**: The visible center hole is the defining feature of a donut — no other bot logo has this
- **Still a companion**: Eyes + smile on the ring surface give it personality and life
- **Trademark-safe**: A donut torus with a face is a completely unique combination
- **3D depth preserved**: Gradient fill, gloss highlight, and drop shadow all remain
- **Philosophy**: The "hole" represents the learning gap that theDonutAI fills — the empty center is where personalized intelligence lives

## Design Specifications

### Shape
- **Outer circle**: r=40, the full donut body
- **Inner circle (hole)**: r=16, creating the visible donut hole in the center
- **Ring thickness**: ~24px — thick enough for eyes to sit on comfortably

### Eyes (tweaked for better expression)
- **Larger, rounder**: r=7 white base (up from 8, but on a ring surface they read bigger)
- **Pupils looking slightly up-right**: Gives curiosity and intelligence, not staring straight
- **Sparkle highlights**: Two tiny white dots per eye for that "alive" glimmer
- **Position**: Sitting on the upper half of the ring, at roughly 10 o'clock and 2 o'clock positions

### Smile
- **Wider, gentler curve**: Positioned on the lower half of the ring
- **Softer opacity**: 0.7 for subtlety — not a grin, more of a content expression

### 3D Depth
- **Gradient fill**: Coral to pink across the ring (same palette)
- **Inner hole shading**: A subtle darker gradient inside the hole to create depth (like looking into the donut)
- **Top gloss**: Semi-transparent white ellipse on the upper-left of the ring
- **Drop shadow**: Soft ellipse below for floating effect

### Antenna
- **Small nub**: Sits on top of the ring — a tiny rounded rectangle with a circle tip
- **Purpose**: Distinguishes it from a plain donut shape, signals "bot/AI"

### Blush marks
- **Two small pink circles**: On the sides of the ring near the smile area

## Files to Modify

| File | Change |
|------|--------|
| `src/components/shared/DonutLogo.tsx` | Redesign from rounded-square to donut-ring character with visible hole, repositioned eyes/smile on the ring surface |
| `public/favicon.svg` | Match the new donut-ring character |

## Technical Details

The SVG will use the 100x100 viewBox with these layers:

1. **Drop shadow ellipse** at bottom (dark radial gradient, low opacity)
2. **Antenna nub** — small rounded rect + circle on top center
3. **Main donut ring** — achieved by drawing a thick-stroked circle (`cx=50, cy=50, r=32, strokeWidth=22`) filled with gradient, OR by using two circles (outer filled, inner cut out with a mask/clip-path)
4. **Inner hole depth** — a circle in the center with a slightly darker shade to simulate looking "into" the donut
5. **Gloss highlight** — white semi-transparent ellipse on upper-left of the ring
6. **Left eye** — white circle (r=6) + dark pupil (r=3, offset up-right) + sparkle dot (r=1.5)
7. **Right eye** — mirrored
8. **Smile** — curved path on the lower ring surface, white, strokeWidth 2.5
9. **Blush marks** — two small pink circles on the ring sides

### Implementation approach
The donut ring shape will be created using a thick-stroked circle rather than complex clip-paths, keeping the SVG simple and performant:

```
circle cx="50" cy="50" r="32" stroke="gradient" strokeWidth="22" fill="none"
```

This creates a ring from radius 21 to 43 — a natural donut cross-section. The center (r less than 21) stays empty — the visible hole.

The eyes will be positioned at approximately:
- Left eye: cx=34, cy=38 (on the upper-left ring surface)
- Right eye: cx=66, cy=38 (on the upper-right ring surface)

The smile will arc across the bottom ring surface at approximately y=62.

### Color Palette (unchanged)
- **Ring fill**: Coral `hsl(12, 85%, 65%)` to Pink `hsl(350, 70%, 60%)`
- **Hole depth**: A subtle darker shade `hsl(12, 40%, 88%)` or light background
- **Eyes**: White with dark coral pupils `hsl(12, 60%, 35%)`
- **Smile**: White at 70% opacity
- **Gloss**: White at 30% opacity
- **Shadow**: Black at 15% opacity

