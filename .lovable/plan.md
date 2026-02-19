

# Test Reports Enhancement Plan

## Pain Points Identified

### Pain Point 1: "View Details" on Upcoming/Scheduled Tests Exposes Questions
**You are absolutely right.** Currently, when a student clicks "View Details" on an upcoming test, it navigates to `/student/tests/:testId` -- the same route used for starting a live test. This means students can potentially see the question paper before the test begins, which defeats the purpose of a scheduled test.

**Fix:** Replace "View Details" with a disabled/informational button that shows when the test is scheduled (e.g., "Starts in 3 hours" or "Scheduled: Feb 22, 10:00 AM"). The button should NOT navigate anywhere. No question paper exposure before the test starts.

### Pain Point 2: Section-wise Analysis Tab is Redundant for Single-Subject Tests
**Completely valid.** For a subject test (e.g., "Physics - Work & Energy Practice"), there is only one section. The "Sections" tab just shows a single card that, when clicked, takes you to the Review tab -- adding no value. The 4-tab layout (Overview, Sections, Time, Review) should be simplified for single-subject tests.

**Fix:** Detect whether the test has 1 section or multiple sections. For single-subject tests, reduce to 3 tabs: **Overview, Time, Review**. The Overview tab will show the score breakdown and performance comparison (without redundant section cards). For grand tests (multi-subject), keep all 4 tabs.

### Pain Point 3: Time Analysis Needs More Depth
**Good call.** The current Time Analysis only shows basic distribution buckets and time-by-section bars. It does not answer the real questions students have:
- How much time did I waste on wrong answers?
- Which questions ate the most time and were they even correct?
- For grand tests: which subject consumed disproportionate time?

**Fix:** Enhance the Time Analysis with:
1. **Time on Correct vs Wrong vs Skipped** -- a clear breakdown showing where time was productive vs wasted
2. **Top Time-Consuming Questions** -- a ranked list of the 5 slowest questions with their correct/wrong status
3. **For grand tests: Subject-wise time breakdown** with efficiency metrics (time per correct answer vs time per wrong answer)
4. **Time Efficiency Score** -- a simple metric: "X% of your time was spent on questions you got right"

---

## Technical Plan

### Step 1: Fix "View Details" Button Behavior

**Files modified:**
- `src/components/student/tests/TestCard.tsx` -- Change "upcoming" case from navigating to showing schedule info
- `src/components/student/tests/GrandTestCard.tsx` -- Same change
- `src/pages/student/SubjectTests.tsx` -- Same change for subject test items

Changes:
- Remove navigation on "upcoming" click
- Replace button text with schedule countdown (e.g., "Starts Feb 22, 10 AM")
- Make button visually disabled/muted (not clickable)
- Remove `onView` prop usage for upcoming tests entirely

### Step 2: Simplify Tabs for Single-Subject Tests

**File modified:**
- `src/pages/student/TestResults.tsx`

Changes:
- Add logic: `const isMultiSection = result.sections.length > 1`
- If single section: show only 3 tabs (Overview, Time, Review) -- hide "Sections" tab
- In Overview tab for single-subject: skip the SectionAnalysis component, keep ScoreBreakdown and PerformanceComparison
- For grand tests: keep all 4 tabs as-is

### Step 3: Enhance Time Analysis

**File modified:**
- `src/components/student/tests/results/TimeAnalysis.tsx`

New sections added to the Time Analysis card:

1. **Time Efficiency Summary** (top of card)
   - "X% of time spent on correct answers" with a visual ring/bar
   - Total time on correct | wrong | skipped

2. **Correct vs Wrong Time Comparison** (new section)
   - Two horizontal bars: "Time on Correct" (green) vs "Time on Wrong" (red) vs "Time on Skipped" (grey)
   - Average time per correct question vs average time per wrong question

3. **Slowest Questions** (new section)
   - Top 5 questions ranked by time spent
   - Each shows: question number, time taken, correct/wrong badge, subject (for grand tests)
   - Helps students identify where they spent the most time and whether it was worth it

4. **Subject-wise Time Breakdown** (for grand tests only, replaces current section bars)
   - Per subject: total time, time on correct, time on wrong
   - Efficiency ratio per subject

