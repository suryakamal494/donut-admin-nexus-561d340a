

## Analysis & Plan

### Part 1: Scalability Audit — 6-Month Market Numbers

**Typical coaching institute scale (6 months):**

| Metric | Market Standard | Our Current Mock | Gap |
|---|---|---|---|
| Students per batch | 30–60 | 20–25 | Under-represented |
| Batches per teacher | 3–6 | 3 | OK for now |
| Exams per batch (6 months) | 20–40 | 15 | Slightly low |
| Chapters per subject | 10–15 | 10 | OK |
| Questions per exam | 30–90 (JEE/NEET) | ~30 | OK |
| Total student records across batches | 150–300 | ~65 | Under-represented |

**UI Scalability Issues Found:**

1. **Student list (BatchReport Students tab):** No virtualization. At 40+ students it's fine, but at 60 students with search it still renders all filtered items as DOM nodes. Not a blocker now but should note.

2. **Exam History in StudentReport:** Renders ALL exams (up to 40 in 6 months) without pagination or "show more." At 15 exams it's fine. At 40 it'll be a long scroll on mobile.

3. **Weak Topics list in StudentReport:** Capped at 10 displayed (line 266: `.slice(0, 10)`). Scalable.

4. **Chapter Mastery Grid:** 10–15 chapters — all rendered. Fine.

5. **Student Roster generation:** Hardcoded to 25 names per batch. At 40–60 students, the name pool runs out.

**Verdict:** The UI handles current mock scale well. The main gap for 6-month realism is the exam history list (needs pagination/collapse at 20+) and student count cap. These are mock data limits, not architectural ones. The UI patterns (cached data, collapsible cards, pagination on Exams tab) are already scalable.

---

### Part 2: Color Consistency Fix

**Current thresholds (line 466–467 of BatchReport.tsx):**
- `≥65` → emerald (green)
- `≥40` → amber (yellow/orange)  
- `<40` → red

**Problem from screenshot:** 64% shows as amber, 56% as amber, 43% as amber, 40% as amber — all the same yellow. The band 40–64 is too wide (25 percentage points), making most students look the same. The user can't visually distinguish a 64% student from a 40% one.

**Proposed thresholds (aligned with PI bucketing and used consistently everywhere):**
- `≥75` → emerald (Mastery-level)
- `≥50` → teal/blue (Stable — competent but room to grow)
- `≥35` → amber (Reinforcement needed)
- `<35` → red (At Risk)

This matches the existing PI bucket boundaries: Mastery ≥75, Stable ≥50, Reinforcement ≥35, Risk <35. Using the same cutoffs for visual color creates consistency between the badge label ("Stable") and the circle color.

**Files to update with consistent color function:**

| File | Location | Change |
|---|---|---|
| `src/pages/teacher/BatchReport.tsx` | Line 464–467 (student percentage circle) | Use 4-tier thresholds: ≥75 emerald, ≥50 teal, ≥35 amber, <35 red |
| `src/pages/teacher/StudentReport.tsx` | Line 31–34 (`statusColor` for chapter mastery) | Already 3-tier (65/40) — align to same 4-tier |
| `src/pages/teacher/StudentReport.tsx` | Line 190–192 (exam history percentage) | Align to same 4-tier |
| `src/pages/teacher/BatchReport.tsx` | Line 35–39 (`getPassRateColor` for exams) | Already 3-tier (75/50) — align to 4-tier |

I'll create a shared utility `getPerformanceColor(percentage)` that returns the 4-tier color set, and use it across all report pages for visual consistency.

---

### Part 3: Exam History Pagination (Scalability)

Add a "Show more" pattern to the Exam History section in `StudentReport.tsx`. Show first 10 exams, with a "View all X exams" button to expand. This handles the 6-month scale of 20–40 exams.

---

### Files to create/modify

| File | Change |
|---|---|
| `src/lib/reportColors.ts` | **New** — shared `getPerformanceColor(pct)` utility with 4-tier thresholds |
| `src/pages/teacher/BatchReport.tsx` | Import shared color utility, replace inline thresholds in student list and exam pass rate |
| `src/pages/teacher/StudentReport.tsx` | Import shared color utility, replace `statusColor` and exam history colors. Add "show more" to exam history (cap at 10, expand button) |

