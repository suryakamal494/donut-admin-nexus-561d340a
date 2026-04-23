

# Student Timetable — Lesson Plan Links and Exam Slots

## Summary

Two enhancements: (1) show a small lesson plan icon on class cards when the teacher has shared one, tappable to view it; (2) add exam/test slots into the daily schedule with a visually distinct design (purple/violet theme) so students can immediately distinguish exams from regular classes.

## Changes

### 1. Extend `ScheduleItem` Interface — `src/data/student/dashboard.ts`

Add optional fields to `ScheduleItem`:
- `lessonPlanId?: string` — present when teacher has shared a lesson plan for this class
- `type` expanded from `'class' | 'break'` to `'class' | 'break' | 'exam'`
- `examTitle?: string` — name of the exam (e.g., "Unit Test - Quadratic Equations")
- `examType?: 'quiz' | 'test' | 'exam'` — to show severity level

### 2. Add Mock Exam Slots and Lesson Plan IDs — `src/data/student/weeklySchedule.ts`

- Add `lessonPlanId` to some class entries (e.g., 60% of classes have a shared lesson plan) to simulate teacher sharing
- For today's date specifically, inject one exam slot (e.g., replacing the 4th period with an exam) so it's immediately visible as a demo
- Add a Wednesday exam slot as well for variety
- Exam slots use `type: 'exam'` with `examTitle`, `examType`, and relevant subject/time fields

### 3. Update `TimetableDayCard` — `src/components/student/timetable/TimetableDayCard.tsx`

**Lesson Plan Icon on Class Cards:**
- When `item.lessonPlanId` exists, show a small `FileText` icon (from lucide) in the top-right area of the class card
- Tapping it navigates to `/student/lesson-plan/{lessonPlanId}` (or opens a sheet — for now, just a link placeholder)
- Icon styled subtly (muted color, 14px) with a tooltip-like label "Lesson Plan"

**Exam Card Design (distinct from class cards):**
- `type === 'exam'` renders a completely different card style:
  - Purple/violet gradient border and left accent stripe
  - `ClipboardCheck` or `Award` icon instead of subject dot
  - Exam title displayed prominently
  - Badge showing exam type ("Quiz", "Unit Test", "Exam") in purple
  - Slightly larger card with more visual weight than regular class cards
  - No teacher/room meta (or optional if present)
- Day header class count updated to also show exam count (e.g., "4 classes, 1 exam")

### 4. Update Day Header in `TimetableDayCard`

- Count exams separately: `items.filter(i => i.type === 'exam').length`
- Show "4 classes · 1 exam" in the subtitle when exams exist
- Exam count shown in purple text for visual distinction

## Files Changed

| File | Action |
|------|--------|
| `src/data/student/dashboard.ts` | Edit — extend `ScheduleItem` with `lessonPlanId`, expand `type` to include `'exam'`, add `examTitle` and `examType` |
| `src/data/student/weeklySchedule.ts` | Edit — add lesson plan IDs to some classes, inject exam slots on select days |
| `src/components/student/timetable/TimetableDayCard.tsx` | Edit — add lesson plan icon on class cards, add distinct exam card rendering, update day header counts |

No routing or navigation changes needed. No database changes.

