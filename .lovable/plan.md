

# Student Timetable Page — Full Week View

## Your Requirement (as I understood it)

You want a dedicated **Timetable** page in the student panel (not just the "Today's Schedule" widget on the dashboard). This page should:

1. Show the **full week's timetable** (Monday-Saturday) for the student's batch
2. Have a **week slider** at the top with left/right arrows to navigate previous/next weeks
3. Include a **month picker** so they can jump to any month and then browse weeks within that month
4. Follow the student portal's **mobile-first design language** (warm gradients, glassmorphic cards, orange accents, 44px touch targets, floating bottom nav clearance)
5. Each period/class card shows subject, topic, teacher, room, and time
6. Lesson plan linking is deferred to a future phase

The teacher's "My Schedule" page serves as the functional reference for week navigation and data structure, but the student version will use the student's own visual language (warm orange tones, rounded glassmorphic cards, no lesson-plan-status badges).

---

## Implementation Plan

### 1. Mock Data — `src/data/student/weeklySchedule.ts`

Create a new file that generates a full week of schedule data for the student's batch, reusing the existing `ScheduleItem` interface from `dashboard.ts`. The data generator will:
- Accept a week start date and return `Record<string, ScheduleItem[]>` (date string to daily slots)
- Use the existing `todaySchedule` as the template and vary it slightly per day (different topics)
- Include breaks (lunch, short break) in the schedule
- Cover Monday through Saturday

### 2. Student Week Navigator — `src/components/student/timetable/StudentWeekNavigator.tsx`

A student-styled version of the teacher's `WeekNavigator`, adapted to the warm design language:
- Left/right chevron arrows (44px touch targets) to move between weeks
- Center label showing date range (e.g., "Apr 20 - Apr 26")
- "This Week" pill button when viewing a non-current week
- **Month picker dropdown** above or integrated — tap the month name to open a month selector, which resets the week view to the first week of that month
- Orange gradient accents on active/current indicators

### 3. Timetable Page — `src/pages/student/Timetable.tsx`

The main page component:
- **Header**: "Timetable" title with the current week's date range
- **Week Navigator**: The `StudentWeekNavigator` at the top
- **Day-by-day list view** (mobile-first, same pattern as teacher's list view but student-styled):
  - Day header with date box (orange gradient for today), day name, class count
  - Cards for each period: subject color dot, time, subject name, topic, teacher, room
  - Break slots shown as dashed/muted rows
  - "LIVE" badge on current period (today only)
  - Tap a class to open the existing `ClassDetailSheet` bottom drawer
- No grid view initially (list-only keeps it simple and mobile-optimized)

### 4. Navigation — Add "Timetable" to sidebar and bottom nav

**`StudentSidebar.tsx`**: Add a new nav item after "Home":
```
{ id: "timetable", label: "Timetable", icon: Calendar, path: "/student/timetable" }
```

**`StudentBottomNav.tsx`**: Add the same entry. The bottom nav will now have 5 items: Home, Timetable, Subjects, Tests, Progress.

### 5. Routing — `src/routes/StudentRoutes.tsx`

Add the new route inside the `StudentLayout` group:
```
<Route path="timetable" element={<StudentTimetable />} />
```

---

## Files Changed/Created

| File | Action |
|------|--------|
| `src/data/student/weeklySchedule.ts` | Create — weekly schedule data generator |
| `src/components/student/timetable/StudentWeekNavigator.tsx` | Create — week + month navigation |
| `src/components/student/timetable/TimetableDayCard.tsx` | Create — single day's schedule card |
| `src/pages/student/Timetable.tsx` | Create — main timetable page |
| `src/components/student/layout/StudentSidebar.tsx` | Edit — add Timetable nav item |
| `src/components/student/layout/StudentBottomNav.tsx` | Edit — add Timetable nav item |
| `src/routes/StudentRoutes.tsx` | Edit — add timetable route |

No database changes required. All data is mock for now.

