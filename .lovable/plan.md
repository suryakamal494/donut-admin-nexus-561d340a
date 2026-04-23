

# Student Timetable — Auto-scroll, Day Selector Strip, and Compact Layout

## Summary

Three improvements to the timetable page: (1) auto-scroll to today on load, (2) a horizontal day selector strip for quick day jumping, and (3) tighter spacing throughout to reduce whitespace.

## Changes

### 1. Auto-scroll to Today — `src/pages/student/Timetable.tsx`

- Add a `useEffect` that runs after initial render (and when `weekStart` changes)
- If today's date exists in the current week's schedule, scroll the corresponding `TimetableDayCard` into view using `scrollIntoView({ behavior: 'smooth', block: 'start' })`
- Each day card gets a `ref` via a `data-date` attribute or a ref map keyed by date string
- No "Jump to Today" button needed — it happens automatically

### 2. Horizontal Day Selector Strip — New section in `src/pages/student/Timetable.tsx`

- A row of 6 pill-shaped day buttons (Mon–Sat) placed between the week navigator and the day cards
- Each pill shows: short day name + date number (e.g., "Mon 21")
- Today's pill gets the orange gradient highlight; selected/tapped pill gets a subtle ring
- Tapping a pill scrolls to that day's card smoothly
- Horizontally scrollable on very narrow screens, but 6 pills fit comfortably on 320px+

### 3. Compact Layout — `src/components/student/timetable/TimetableDayCard.tsx` and `Timetable.tsx`

- Reduce `space-y-6` between day cards to `space-y-4`
- Reduce day header date box from `w-12 h-12` to `w-10 h-10` with smaller text
- Reduce period card padding from `p-3` to `p-2.5`
- Reduce `space-y-2` between period cards to `space-y-1.5`
- Reduce meta row `mt-2` to `mt-1`
- Reduce left indent `pl-[60px]` to `pl-[52px]` to match smaller date box
- Trim the navigator wrapper padding from `p-3` to `p-2.5` and `mb-6` to `mb-3`
- Reduce page header `mb-4` to `mb-3`

### Files Changed

| File | Action |
|------|--------|
| `src/pages/student/Timetable.tsx` | Edit — add auto-scroll logic, day selector strip, tighten spacing |
| `src/components/student/timetable/TimetableDayCard.tsx` | Edit — compact padding, smaller date box, tighter gaps |

No new files created. No data or routing changes.

