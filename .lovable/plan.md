

## Phase 6: Advanced Bucketing Logic — Detailed Explanation

### What Exists Today

Currently, **student bucketing is simple and single-dimensional**. In two places:

1. **Chapter Report** (`ChapterReport.tsx` → `reportsData.ts`): Each student gets a single `avgPercentage` (randomly generated). They are bucketed purely by that number:
   - Mastery Ready: ≥ 75%
   - Stable Progress: 50–74%
   - Reinforcement Needed: 35–49%
   - Foundational Risk: < 35%

2. **Exam Results** (`ExamResults.tsx` → `examResults.ts`): Similar — `computePerformanceBands()` uses `percentage` from a single exam to sort students into the same 4 bands.

**Problems with current approach:**
- Bucketing is based on a **single percentage** — no depth
- No **trend tracking** — a student who dropped from 80% to 40% across exams is just "reinforcement," no different from someone who's always been at 40%
- No **secondary tags** — you can't distinguish a "mastery" student who is plateauing from one who is still climbing
- No **composite scoring** — accuracy alone decides the bucket, ignoring consistency, time efficiency, or attempt patterns

### What Phase 6 Adds

Phase 6 replaces the naive percentage-based bucketing with a **multi-factor Performance Index (PI)** and adds secondary behavioral tags and trend detection.

---

### 1. Performance Index (PI) — Composite Score

Instead of using raw `avgPercentage` alone, each student gets a **Performance Index** calculated from multiple signals:

```text
PI = (0.50 × Accuracy) + (0.20 × Consistency) + (0.15 × Time Efficiency) + (0.15 × Attempt Rate)
```

Where:
- **Accuracy** = average percentage across exams (what we use today)
- **Consistency** = inverse of score variance across exams (low variance = high consistency)
- **Time Efficiency** = how well the student uses allotted time (not too fast, not too slow)
- **Attempt Rate** = percentage of questions actually attempted (unattempted = penalized)

The PI is a 0–100 score. Bucketing thresholds remain the same (≥75 mastery, 50–74 stable, 35–49 reinforcement, <35 risk) but now reflect a **richer picture**.

**Where this appears:** The `ChapterStudentEntry` interface in `reportsData.ts` gains new fields: `performanceIndex`, `consistency`, `timeEfficiency`, `attemptRate`. The bucket row in `ChapterReport.tsx` shows the PI instead of (or alongside) the raw average, and a small breakdown tooltip or inline detail.

---

### 2. Secondary Tags

Each student gets **1–2 secondary tags** that describe behavioral patterns overlaid on their primary band. These are small badges shown next to the student's name inside the bucket:

| Tag | Meaning | When Applied |
|-----|---------|-------------|
| `improving` | Score trending upward across last 3+ exams | Positive slope in exam scores |
| `declining` | Score trending downward | Negative slope |
| `plateaued` | Scores flat despite multiple exams | Low variance + no slope |
| `inconsistent` | High variance between exams | Std dev > threshold |
| `speed-issue` | Accuracy OK but time usage is poor | Time efficiency < 40% |
| `low-attempt` | Skipping too many questions | Attempt rate < 60% |

**Example:** A student in the "Stable Progress" band might show badges like `improving` (they're on their way to mastery) or `plateaued` (stuck at the same level). This is far more actionable for the teacher than just seeing "52%".

**Where this appears:** Inside each bucket's student row in `ChapterReport.tsx`, after the student name — small colored badges. Tags like `improving` get a green badge, `declining` gets red, `plateaued` gets gray, etc.

---

### 3. Plateau Detection

A specific algorithm to flag students whose performance has **flatlined**:

```text
If a student has 3+ exams AND the standard deviation of their last 3 scores < 5% AND the slope ≈ 0:
  → Tag as "plateaued"
```

This is especially important for "Stable Progress" and "Reinforcement Needed" students who are stuck and need a different teaching approach. The teacher sees this as a `plateaued` badge and can act on it (e.g., change practice difficulty, assign different resources).

---

### 4. Trend Tracking Across Multiple Tests

Currently, each student's data is isolated per chapter — there's no memory of how they performed across exams. Phase 6 adds:

- **Per-student exam history** (mock): An array of `{ examId, percentage, date }` entries for each student in the chapter context
- **Trend arrow** on each student row: ↑ (improving), ↓ (declining), → (flat/plateaued)
- **Trend line sparkline** (optional): A tiny inline chart showing the student's last 3–5 exam scores as a micro-trend

**Where this appears:** In the student row inside each bucket on `ChapterReport.tsx`, a small trend indicator (arrow + optional sparkline) appears next to their percentage.

---

### What Changes, File by File

| File | Current State | After Phase 6 |
|------|--------------|---------------|
| `src/data/teacher/reportsData.ts` | `ChapterStudentEntry` has `id, studentName, rollNumber, avgPercentage, examsAttempted` | Gains: `performanceIndex`, `consistency`, `timeEfficiency`, `attemptRate`, `secondaryTags[]`, `trend: "up" \| "down" \| "flat"`, `examHistory: {examId, percentage, date}[]` |
| `src/data/teacher/reportsData.ts` | Bucketing uses `avgPercentage` thresholds | Bucketing uses `performanceIndex` thresholds instead |
| `src/pages/teacher/ChapterReport.tsx` | Student rows show `name, roll, avgPercentage%, examsAttempted` | Student rows show `name, roll, PI score, trend arrow, secondary tag badges` |
| (new) `src/lib/performanceIndex.ts` | Does not exist | Utility functions: `calculatePI()`, `detectTrend()`, `assignSecondaryTags()`, `detectPlateau()` |

---

### What the Teacher Sees — Before vs After

**Before (current):**
```text
┌─ Mastery Ready (5) ──────────────────┐
│  Aarav Sharma      R101       82%    │
│  Priya Patel       R102       78%    │
│  ...                                  │
└───────────────────────────────────────┘
```

**After (Phase 6):**
```text
┌─ Mastery Ready (5) ──────────────────────────┐
│  Aarav Sharma   R101   PI: 84  ↑  improving  │
│  Priya Patel    R102   PI: 76  →  plateaued   │
│  ...                                          │
└───────────────────────────────────────────────┘
```

Each student row now communicates:
- **PI score** (composite, not just accuracy)
- **Trend arrow** (↑↓→)
- **Secondary tag** (improving, plateaued, declining, inconsistent, speed-issue, low-attempt)

The bucket assignment itself may shift for some students — a student with 55% average but terrible consistency and low attempt rate might drop from "Stable" to "Reinforcement" under PI-based bucketing, which is more accurate.

---

### Implementation Steps

1. **Create `src/lib/performanceIndex.ts`** — Pure utility functions for PI calculation, trend detection, plateau detection, and secondary tag assignment
2. **Extend `ChapterStudentEntry`** in `reportsData.ts` — Add new fields, update mock data generator to produce exam histories and compute PI/tags
3. **Update bucketing logic** in `reportsData.ts` — Switch from `avgPercentage` thresholds to `performanceIndex` thresholds
4. **Update `ChapterReport.tsx`** — Render PI, trend arrows, and secondary tag badges in student rows

### Files to Create/Modify

| File | Change |
|------|--------|
| `src/lib/performanceIndex.ts` | **New** — `calculatePI()`, `detectTrend()`, `assignSecondaryTags()`, `detectPlateau()` |
| `src/data/teacher/reportsData.ts` | Extend `ChapterStudentEntry` with PI fields, update `generateChapterDetail()` to produce exam histories and compute PI/tags, switch bucketing to PI |
| `src/pages/teacher/ChapterReport.tsx` | Update student rows to show PI, trend arrow, secondary tag badges |

