

# UI Audit: AI Question Generator -- Complete Findings

## Audit Scope
Audited both the SuperAdmin (`/superadmin/questions/ai`) and Institute (`/institute/questions/ai`) AI Question Generators, including the shared `TypeConfigPanel` component, across desktop and mobile viewports. Compared layout, responsiveness, consistency, and identified UI issues.

---

## Issue 1: Label Truncation in Institute Panel (CRITICAL -- visible in your screenshot)

**What you see:** Your screenshot shows question type labels truncated to "MC...", "Num...", "Ass...", "Para...", "Matr..." on desktop.

**Root Cause:** The Institute panel uses `grid-cols-2` with `truncate` class on labels inside a narrow `lg:col-span-1` card (~33% width). Since the settings panel is only 1/3 of the screen on desktop, the 2-column grid squeezes each type checkbox into ~140px, which is not enough for labels like "Assertion-Reasoning" (18 characters) or "MCQ (Multiple)" (14 characters).

**SuperAdmin comparison:** SuperAdmin uses `lg:col-span-2` (66% width) for its form + `md:grid-cols-3`, giving each label ~200px -- no truncation.

**Fix:** Change the Institute question type grid to `grid-cols-1 sm:grid-cols-2` so on narrow containers it stacks vertically, and reduce font size with `text-xs` to prevent truncation. Alternatively, use shorter labels when inside the narrow Institute sidebar.

---

## Issue 2: Negative Default Value (-1) in Custom Setup (CRITICAL -- visible in your screenshot)

**What you see:** Your second screenshot shows "MCQ (Single)" with a value of "-1" in the Type Distribution panel.

**Root Cause:** In `TypeConfigPanel.tsx` (line 79-86), when custom mode is enabled, the distribution initialization calculates:
```
perType = Math.floor(totalCount / selectedTypes.length)
newDist[firstType] = totalCount - perType * (selectedTypes.length - 1)
```
The Institute panel passes `totalCount={typeConfig?.mode === 'custom' ? 0 : questionCount}`. When custom mode activates, totalCount becomes 0, so:
- `perType = Math.floor(0 / 2) = 0`
- First type gets `0 - 0 * 1 = 0` ...but this doesn't explain -1.

Actually, the issue is more subtle: on initial toggle, `totalCount` is still the slider value (e.g., 5). But with 3 types selected (MCQ + Paragraph + Matrix), paragraph auto-calculates as `count * subQuestionsPerParagraph = 1 * 3 = 3`, matrix as 1, leaving `5 - 3*(3-1) = 5 - 6 = -1` for the first type.

**Fix:** Add a `Math.max(0, ...)` guard on the first type's distribution calculation.

---

## Issue 3: Section Ordering Inconsistency Between Panels

**SuperAdmin order:**
1. Question Types
2. Custom Setup Panel (TypeConfigPanel)
3. Difficulty Mix
4. Cognitive Types
5. Number of Questions (hidden in custom mode)
6. Additional Instructions

**Institute order:**
1. Course Selection
2. Class/Subject/Chapter dropdowns
3. Number of Questions (hidden in custom mode)
4. Question Types
5. Custom Setup Panel (TypeConfigPanel)
6. Difficulty Mix
7. Cognitive Types
8. Additional Instructions

**Issue:** In the Institute panel, "Number of Questions" appears BEFORE Question Types, which is confusing -- users pick a count before seeing what types are available. In SuperAdmin, it's placed after types, which is more logical.

**Fix:** Move "Number of Questions" to appear AFTER Question Types in the Institute panel, consistent with SuperAdmin.

---

## Issue 4: Layout Architecture Difference

**SuperAdmin:** Uses a 2-column + 1-sidebar layout (`lg:col-span-2` for form, `lg:col-span-1` for classification). The form gets 66% width on desktop.

**Institute:** Uses a 1-column + 2-column layout (`lg:col-span-1` for settings, `lg:col-span-2` for generated questions). The settings panel only gets 33% width.

**Impact:** This is the fundamental cause of Issue 1. The Institute settings panel is squeezed into 1/3 of the screen, making all form elements cramped. Question type checkboxes, TypeConfigPanel inputs, and cognitive type chips all suffer.

**Fix:** This is an intentional layout difference (Institute shows generated questions alongside). The fix should focus on making the form elements adapt to the narrower width: use smaller text, single-column type grids, or collapsible sections. No layout restructure needed.

---

## Issue 5: Mobile Responsiveness Gaps in Institute Panel

**TypeConfigPanel on mobile (inside Institute's narrow card):**
- The `grid-cols-2` for paragraph/matrix/fill config inputs works but is very tight
- Sub-question type chips wrap correctly but touch targets are small (py-1.5 = ~30px, below the 44px minimum)
- Number inputs (`w-16 h-8`) are small for touch interaction

**SuperAdmin on mobile:**
- Form has full width, so grid-cols-2 works well
- Touch targets meet 44px minimum thanks to `p-2 sm:p-2.5` on type checkboxes

**Fix:** Increase touch targets in TypeConfigPanel: sub-question chips should be `py-2` minimum, number inputs should be `h-10` on mobile.

---

## Issue 6: "questions" Label Hidden on Mobile But Layout Not Adjusted

In TypeConfigPanel (line 254), the "questions" text label is `hidden sm:inline` with `w-14`. On mobile, this text disappears but the `w-14` space is still reserved in the flex container since it's on the span, not the container.

**Fix:** Wrap the label in a container that is `hidden sm:flex` to fully remove it from layout on mobile.

---

## Issue 7: Missing Responsive Classes in Institute Panel

The Institute panel's question type checkboxes use:
```tsx
className="flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all text-sm"
```

While SuperAdmin uses responsive classes:
```tsx
className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-2.5 rounded-lg sm:rounded-xl border cursor-pointer transition-all"
```

**Fix:** Align Institute's type checkbox styling with SuperAdmin's responsive approach (smaller gaps/padding on mobile, larger on desktop).

---

## Issue 8: TypeConfigPanel totalCount Logic When Switching Modes

When the user toggles Custom Setup ON and then OFF, the `typeConfig.mode` switches back to "auto", but `typeDistribution` still contains stale per-type values. The parent page correctly shows the slider again, but the next time custom mode is toggled ON, the old distribution values persist.

**Fix:** Reset `typeDistribution` to empty when switching back to auto mode.

---

## Summary Table

| Issue | Severity | Panel | Status |
|-------|----------|-------|--------|
| 1. Label truncation ("MC...", "Para...") | Critical | Institute | Needs fix |
| 2. Negative value (-1) in distribution | Critical | Both | Needs fix |
| 3. Section ordering inconsistency | Medium | Institute | Needs fix |
| 4. Layout width difference (1/3 vs 2/3) | Info | Institute | By design, adapt components |
| 5. Touch targets below 44px in TypeConfigPanel | Medium | Both | Needs fix |
| 6. Hidden "questions" label layout gap | Low | Both | Needs fix |
| 7. Missing responsive classes in Institute | Medium | Institute | Needs fix |
| 8. Stale distribution on mode toggle | Low | Both | Needs fix |

---

## Proposed Fix Plan

### Phase 1: Institute Panel Fixes (Priority -- matches your screenshots)

**Step 1 -- Fix label truncation (Issue 1 + 7):**
- Change Institute type grid to `grid-cols-1 sm:grid-cols-2`
- Add responsive text classes: `text-xs sm:text-sm`
- Add responsive padding: `p-2 sm:p-2.5`

**Step 2 -- Fix negative value bug (Issue 2):**
- In `TypeConfigPanel.tsx`, add `Math.max(0, ...)` guard on first type calculation
- Initialize distribution with minimum of 1 per simple type

**Step 3 -- Fix section ordering (Issue 3):**
- Move "Number of Questions" slider to appear AFTER "Question Types" in Institute panel

### Phase 2: Shared Component Fixes (Both panels)

**Step 4 -- Fix touch targets (Issue 5):**
- Sub-question type chips: increase to `py-2 min-h-[44px]`
- Number inputs: `h-8 sm:h-10` for better mobile tapping

**Step 5 -- Fix "questions" label layout (Issue 6):**
- Change to `hidden sm:flex` wrapper instead of just `hidden sm:inline` on text

**Step 6 -- Fix stale distribution (Issue 8):**
- Reset `typeDistribution` to `{}` when switching from custom back to auto mode

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/questions/TypeConfigPanel.tsx` | Fix Issues 2, 5, 6, 8 |
| `src/pages/institute/questions/AIQuestions.tsx` | Fix Issues 1, 3, 7 |

### Files NOT Modified
- `src/pages/questions/AIQuestions.tsx` -- SuperAdmin form is already well-structured
- All other pages and components -- untouched

