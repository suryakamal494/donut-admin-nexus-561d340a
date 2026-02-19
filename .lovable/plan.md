

# Subject Tests Page: Replace Popup with Dedicated Full Page

## Pain Point

When a student clicks on a subject (e.g., Physics) under "My Tests", a side sheet/popup opens showing the tests. This approach has serious limitations:

- **Not scalable**: A popup cannot handle 15-20+ tests comfortably, especially on mobile
- **Poor navigation**: Students can't bookmark or share subject test pages
- **Limited space**: No room for date-wise grouping, detailed test cards, and proper filtering
- **Inconsistent UX**: Every other drill-down in the student portal (subjects, chapters, bundles) uses a dedicated page -- tests should too

## What We Will Build

A new dedicated page at `/student/tests/:subject` (e.g., `/student/tests/physics`) that:

1. Shows a premium header with subject icon, color, test counts, and live indicator
2. Has filter tabs (All, Live, Upcoming, Attempted, Missed) with counts
3. Groups tests **date-wise** (Today, This Week, Earlier, Upcoming dates)
4. Shows proper action buttons: "Start Test" (live), "View" (upcoming), "View Results" (attempted)
5. Handles 15-20+ tests per subject with smooth scrolling
6. Removes the old SubjectTestsSheet popup entirely

Additionally, we will expand the sample test data from 3 tests per subject to **15-20 tests per subject** across Physics, Chemistry, Mathematics, and Biology -- giving realistic topic names, varied statuses, dates, scores, and teacher names.

## Execution Plan

### Step 1: Expand Test Data (15-20 tests per subject)

Update `src/data/student/tests.ts` to add realistic teacher-assigned tests:

| Subject | Total Tests | Live | Upcoming | Attempted | Missed |
|---------|-------------|------|----------|-----------|--------|
| Physics | 18 | 2 | 4 | 9 | 3 |
| Chemistry | 16 | 2 | 3 | 8 | 3 |
| Mathematics | 17 | 1 | 5 | 8 | 3 |
| Biology | 15 | 1 | 3 | 8 | 3 |

Tests will use real topic names (e.g., "Electromagnetic Induction Unit Test", "Coordination Compounds Quiz", "Definite Integrals Practice") with varied durations, question counts, teacher names, dates spanning Dec 2025 to Feb 2026, and realistic scores for attempted tests.

### Step 2: Create Subject Tests Page

New file: `src/pages/student/SubjectTests.tsx`

**Layout (mobile-first):**

```text
+----------------------------------+
| <- Back    Physics Tests         |
|    18 tests . 2 live now         |
+----------------------------------+
| [All 18] [Live 2] [Upcoming 4]  |
| [Attempted 9] [Missed 3]        |
+----------------------------------+
|                                  |
| TODAY                            |
| +------------------------------+|
| | * Laws of Motion Quiz   LIVE ||
| |   Mr. Verma . 25Q . 45 min  ||
| |          [Start Test ->]     ||
| +------------------------------+|
| | * Electromagnetic Induction  ||
| |   Mr. Verma . 30Q . 60 min  ||
| |          [Start Test ->]     ||
| +------------------------------+|
|                                  |
| THIS WEEK                        |
| +------------------------------+|
| | o Thermodynamics Unit Test   ||
| |   Mr. Verma . 30Q . 60 min  ||
| |   Jan 12 . 10:00 AM  [View] ||
| +------------------------------+|
|                                  |
| COMPLETED                        |
| +------------------------------+|
| | v Work & Energy Practice     ||
| |   Mr. Verma . 20Q . 40 min  ||
| |   Score: 90% [View Results]  ||
| +------------------------------+|
| | v Kinematics Quiz            ||
| |   ...                        ||
| +------------------------------+|
| ...scrolls naturally...          |
+----------------------------------+
```

**Features:**
- Back button navigates to `/student/tests`
- Subject icon + gradient header matching the subject color
- Filter tabs with counts (horizontally scrollable on mobile)
- Date-wise sections: "Live Now", "Upcoming (by date)", "Completed (newest first)", "Missed"
- Each test card shows: status dot, test name, teacher, question count, duration, date
- Action buttons: "Start Test" (live, gradient CTA), "View" (upcoming), "View Results" (attempted, green), "Expired" (missed, greyed out)
- Score percentage badge for attempted tests
- Smooth scroll, no virtualization needed for 15-20 items

### Step 3: Add Route

Update `src/routes/StudentRoutes.tsx` to add:
```
<Route path="tests/subject/:subject" element={<StudentSubjectTests />} />
```

### Step 4: Update SubjectTestCard Navigation

Modify `src/components/student/tests/SubjectTestCard.tsx` to use `useNavigate` instead of `onOpenSheet` callback, navigating to `/student/tests/subject/${subject}`.

### Step 5: Clean Up Tests Page

Update `src/pages/student/Tests.tsx` to remove the `SubjectTestsSheet` usage (no more popup). The `selectedSubject` state and sheet handlers can be removed.

### Step 6: Remove Sheet Import (Optional Cleanup)

The `SubjectTestsSheet` component stays in the codebase but is no longer used from the main Tests page.

---

## Technical Details

### Files Created

| File | Purpose |
|------|---------|
| `src/pages/student/SubjectTests.tsx` | New dedicated subject tests page with filters, date grouping, and test cards |

### Files Modified

| File | Change |
|------|--------|
| `src/data/student/tests.ts` | Expand teacherTests from 11 to ~66 entries (15-18 per subject) |
| `src/routes/StudentRoutes.tsx` | Add `tests/subject/:subject` route inside StudentLayout |
| `src/components/student/tests/SubjectTestCard.tsx` | Change onClick to navigate to new page instead of opening sheet |
| `src/pages/student/Tests.tsx` | Remove SubjectTestsSheet usage and related state |

### Design Principles Applied

- Mobile-first layout (320px+)
- 44px+ touch targets on all buttons and filter tabs
- Glassmorphism cards (bg-white/70, backdrop-blur-xl, border-white/50)
- Subject color-coded header with gradient icon
- Plus Jakarta Sans typography
- Framer Motion entrance animations for test cards
- Natural scroll (no virtualization for 15-20 items -- keeps it simple and performant)

