

## Issues Identified

### Issue 1 — No Collapse/Expand for Band Sections in Questions Tab
Currently the Questions tab renders each band's questions inside a plain `Card` with no collapsible behavior. All bands are always fully visible. The Students tab already uses `Accordion` with `defaultValue` set to all bands expanded — the Questions tab should follow the same pattern.

**Solution**: Replace the static `Card` wrapper in the Questions tab with `Accordion` (same as Students tab). Default all bands to expanded. Teacher can collapse any band they don't need.

### Issue 2 — No Visual Alert for Low Success Rate Questions
All question cards currently use the same `bg-muted/20` background and band-colored border regardless of success rate. A question with 15% success looks identical to one with 90%. Teachers can't quickly scan for problem questions.

**Solution**: Apply the 4-tier color system to each question card's **left border** based on `successRate`:
- **Emerald** (≥75%): `border-l-emerald-500` — students are doing well
- **Teal** (50–74%): `border-l-teal-500` — stable
- **Amber** (35–49%): `border-l-amber-500` — needs attention
- **Red** (<35%): `border-l-red-500 bg-red-500/5` — requires teacher focus, subtle red tint background

This gives instant visual scanning without cluttering the UI.

---

## Implementation

**File**: `src/pages/teacher/PracticeSessionDetail.tsx`

### Change 1 — Questions Tab: Replace Card with Accordion
- Replace the `<Card>` per band (lines 131–144) with `<Accordion type="multiple" defaultValue={bandDetails.map(b => b.key)}>` containing `<AccordionItem>` per band
- Same trigger style as Students tab: band dot + label + question count badge
- Content area contains the question cards

### Change 2 — QuestionCard: Color-coded left border by success rate
- Add a utility function `successBorderColor(pct)` returning border + background classes
- Apply `border-l-4` + color class to each question card div
- For <35% questions, also add a subtle red background tint (`bg-red-500/5`) to make them stand out

| Success Rate | Left Border | Background |
|---|---|---|
| ≥75% | `border-l-emerald-500` | `bg-muted/20` (default) |
| 50–74% | `border-l-teal-500` | `bg-muted/20` |
| 35–49% | `border-l-amber-500` | `bg-amber-500/5` |
| <35% | `border-l-red-500` | `bg-red-500/5` |

