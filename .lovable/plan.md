

## Your Pain Points — My Understanding and Assessment

### Pain Point 1: Overview Banner Card is Hollow
**What you're saying:** The orange gradient card at the top shows "51%, 2 Strong, 1 Moderate, 2 Weak" but those Strong/Moderate/Weak counts have no explanation. What do they refer to? Topics? Students? And there's no tooltip anywhere in the reports explaining what any metric means.

**You are 100% right.** The Strong/Moderate/Weak counts refer to *topics* (from the heatmap below), but nothing on the card says that. A teacher glancing at it would have no idea. The card duplicates what the Topic Heatmap already shows more clearly — so it's noise, not signal.

**Fix:** Simplify the banner to show only: chapter name, overall success rate %, questions asked, and exam count. Remove the 3-column Strong/Moderate/Weak grid. Add info tooltips throughout the entire reports module (Topic Heatmap percentages, bucket labels, exam breakdown metrics).

---

### Pain Point 2: Only 3 Student Performance Buckets Visible
**What you're saying:** We designed 4 buckets (Mastery, Stable, Reinforcement, Risk) but only 3 show up.

**You are right.** The code has `if (bucket.count === 0) return null` — so if mock data randomly generates zero students for a bucket, it disappears entirely. This is confusing because the teacher doesn't know the bucket exists. With real data, the same issue would occur for small batches.

**Fix:** Always show all 4 buckets. If a bucket has 0 students, show it in a muted/empty state with "No students in this band" instead of hiding it.

---

### Pain Point 3: "Generate Practice" Button Hidden Inside Accordion
**What you're saying:** You have to expand the bucket first to find the Generate Practice button. It should be visible on the header row itself so teachers can act without expanding.

**You are right.** During the UI audit, I moved it inside the accordion to fix a mobile overflow issue, but that killed discoverability. The button is the primary action — hiding it defeats the purpose.

**Fix:** Put the Generate Practice button back on the header row. On mobile, use an icon-only variant (sparkle icon) with a tooltip. On desktop, show the full button. This solves both mobile overflow and discoverability.

---

### Pain Point 4: "PI: 78" is Meaningless Jargon for Teachers
**What you're saying:** No teacher knows what "PI" means. It's useful as a backend sorting/bucketing mechanism but showing "PI: 78" on the frontend adds confusion, not value.

**You are absolutely right.** The Performance Index is an internal scoring algorithm. Teachers need to see: student name, trend arrow, secondary tags (Improving/Declining/Plateaued), and the actual average percentage. The PI score should drive which bucket the student lands in, but never be displayed.

**Fix:** Remove "PI: 78" from student rows. Show `avgPercentage%` instead. Keep PI as the backend sorting mechanism. The trend arrow and secondary tags already communicate the behavioral insights.

---

### Pain Point 5: Exam-wise Breakdown Doesn't Scale
**What you're saying:** Only 3 exams show. What if there are 10 or 15? The UI will break.

**You are right.** The data generator has a hardcoded `.slice(0, 3)` limiting to 3 exams. Even if we remove that, showing 15 exam rows in a flat list would create excessive scrolling.

**Fix:** Remove the `.slice(0, 3)` limit. Show the first 3 exams by default with a "View all X exams" button that expands to show the rest. This handles scale gracefully.

---

### Pain Point 6: Exam Click Navigation is a Dead End
**What you're saying:** Clicking an exam in the chapter breakdown navigates to `/teacher/exams/:examId/results` (under the Exams section). Once there, the back button doesn't return to the chapter report — it goes to the Exams list. To get back, you have to manually navigate Reports → Batch → Chapter again. This is tedious.

**You are absolutely right. This is the most impactful UX bug.** The navigation breaks the user's mental context. They were in Reports, analyzing a chapter, and suddenly they're in a completely different section with no way back.

**Fix:** Pass the return path as a query parameter: `/teacher/exams/:examId/results?batch=X&returnTo=/teacher/reports/batch-10a/chapters/ch-kinematics`. On the ExamResults page, if `returnTo` exists, the back button uses it instead of the default Exams route.

---

## Implementation Plan

### File 1: `src/pages/teacher/ChapterReport.tsx`
1. **Simplify overview banner**: Remove the 3-column Strong/Moderate/Weak grid. Keep only chapter name, success rate %, questions asked, exam count badge.
2. **Add info tooltips**: Add `(i)` icon tooltips on: Topic Heatmap header ("% of students who answered correctly"), each bucket label ("Students are grouped by composite performance across exams"), exam breakdown header ("How this chapter was tested across exams").
3. **Always show all 4 buckets**: Remove `if (bucket.count === 0) return null`. Show empty buckets with muted text.
4. **Move Generate Practice back to header**: Show icon-only sparkle button on mobile (`sm:hidden`), full button on desktop (`hidden sm:inline-flex`). Both on the header row.
5. **Remove PI display**: Replace `PI: {s.performanceIndex}` with `{s.avgPercentage}%` in student rows.
6. **Exam breakdown scaling**: Show first 3, then "View all X exams" expand button.
7. **Fix exam navigation**: Change `navigate()` call to include `returnTo` query param pointing back to the current chapter report URL.

### File 2: `src/data/teacher/reportsData.ts`
1. Remove `.slice(0, 3)` from `examBreakdown` generation to allow all exams through.

### File 3: `src/pages/teacher/ExamResults.tsx` (or equivalent)
1. Read `returnTo` query param. If present, use it for the back/breadcrumb navigation instead of the default `/teacher/exams` path.

