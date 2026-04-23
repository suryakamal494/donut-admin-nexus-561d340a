

# Student Timetable — Rename "Plan" Label and Link to Lesson Bundles

## Summary

Rename the "Plan" chip to "Notes" (better describes teacher-shared materials — PDFs, images, resources), and wire it to navigate directly to the specific lesson bundle within the subject's chapter view.

## Changes

### 1. Update Mock Data Mapping — `src/data/student/weeklySchedule.ts`

- Replace arbitrary `lessonPlanId` values (e.g., `lp-math-quad-01`) with actual bundle IDs from the lesson bundles data (e.g., `bundle-math-ch1-1`)
- Add a corresponding `lessonBundleRoute` or reuse existing subject/chapter info to construct the full navigation path
- Since each schedule entry already has `subject`, we can derive the `subjectId` from it; the `lessonPlanId` will now store a real bundle ID that maps to a known `chapterId`

### 2. Update `TimetableDayCard.tsx`

**Label change:**
- Rename "Plan" to "Notes" — this better communicates "teacher-shared materials" rather than "lesson plan" which sounds like a teacher-internal document

**Navigation update:**
- Instead of navigating to `/student/subjects` (generic), navigate to `/student/subjects/:subjectId/:chapterId/:bundleId`
- Import `getLessonBundleById` from the lesson bundles data to look up the bundle and get its `chapterId`
- Construct the full route: `/student/subjects/${subjectId}/${bundle.chapterId}/${bundleId}`
- The `subject` field on the schedule item maps to the subject ID directly

### Files Changed

| File | Action |
|------|--------|
| `src/data/student/weeklySchedule.ts` | Edit — replace fake lessonPlanId values with real bundle IDs from bundles data |
| `src/components/student/timetable/TimetableDayCard.tsx` | Edit — rename "Plan" to "Notes", update navigation to full bundle route |

No new files. No database changes.

