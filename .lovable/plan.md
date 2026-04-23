

# Student Timetable — Lesson Plan Icon Repositioning and Linking

## Summary

Move the lesson plan icon from the far-right corner into the meta row (inline with time, teacher, room), change the icon to `BookOpen` for better clarity, add a small "Plan" label next to it, and wire it to navigate to the lesson plan route.

## Changes

### `src/components/student/timetable/TimetableDayCard.tsx`

**Remove the icon from the subject header row:**
- Remove the `{item.lessonPlanId && ...}` block from the `flex items-center justify-between` div that contains the subject name

**Add it to the meta row instead:**
- Place a new chip-style element at the end of the meta row (after time, teacher, room)
- Use `BookOpen` icon (from lucide) instead of `FileText` -- visually communicates "lesson plan" better than a generic document
- Add a tiny "Plan" label next to the icon so it's self-explanatory
- Style it as a subtle tappable chip: `bg-primary/10 text-primary rounded-full px-2 py-0.5` so it looks like a mini action button within the row
- On tap, navigate to `/student/subjects` as a placeholder route (the actual lesson plan viewer can be wired later, but the navigation call will be in place using `useNavigate`)

**Result:** The icon sits right next to the class metadata, visible but not floating in empty space. On mobile the meta row wraps naturally so the chip appears near the other details. On desktop it stays inline instead of drifting to the far edge.

### Files Changed

| File | Action |
|------|--------|
| `src/components/student/timetable/TimetableDayCard.tsx` | Edit -- move lesson plan from header to meta row, change icon, add label, wire navigation |

No new files. No data or routing changes.

