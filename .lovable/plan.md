

## Phase 1: Redesign ExamResults.tsx -- Insight-First Test Report

### What changes

The current `ExamResults.tsx` leads with stat cards and charts. We are flipping it to an **insight-first** layout where the teacher immediately sees a verdict, student performance bands, and topic flags -- charts become secondary.

### Data layer updates

**File: `src/data/teacher/examResults.ts`**
- Expand `generateExamAnalytics` to produce richer mock data:
  - Generate 25 full `StudentResult` entries (not just top 5) with realistic score distribution
  - Add `questionAnalysis` data for dynamically generated exams (currently returns empty array)
  - Add a helper `computePerformanceBands()` that buckets students into 4 bands based on percentage: **Mastery Ready** (>=75%), **Stable Progress** (50-74%), **Reinforcement Needed** (35-49%), **Foundational Risk** (<35%)
  - Add a helper `computeTopicFlags()` that identifies topics with class success rate <50% as "Needs Attention" flags
  - Add a helper `generateVerdictSummary()` that produces a plain-language string like "Class average 70%. 4 students below passing. Interference and Diffraction need reteaching."

### New components (all in `src/components/teacher/exams/results/`)

1. **`VerdictBanner.tsx`** -- Gradient banner (teal-cyan matching teacher theme) at the top
   - Shows exam name, date, batch
   - Large verdict text: "Class average 70% | 20 of 24 passed"
   - 2-3 compact insight pills: "4 at risk", "2 weak topics", "Top: Aarav 95%"
   - Uses `bg-gradient-to-r from-teal-500 to-cyan-500` with white text

2. **`PerformanceBands.tsx`** -- Collapsible student groups
   - 4 colored band cards stacked vertically (mobile-first):
     - Mastery Ready (green accent) -- collapsed by default, shows count
     - Stable Progress (blue accent) -- collapsed
     - Reinforcement Needed (amber accent) -- **expanded by default** (this is what teachers care about)
     - Foundational Risk (red accent) -- expanded by default
   - Each band header: color dot + band name + student count badge
   - Expanded state: list of students with name, score, percentage as compact rows
   - Uses Radix Collapsible for expand/collapse

3. **`TopicFlags.tsx`** -- Compact topic health indicators
   - Horizontal scrollable pills on mobile, wrapping grid on desktop
   - Each topic: name + success rate badge
   - Color coded: green (>70%), amber (40-70%), red (<40%)
   - Topics below 40% get a small "Needs Attention" label

4. **`InsightCards.tsx`** -- 2-3 small actionable insight cards
   - "Hardest Question: Q7 Interference (24% success)"
   - "Most Skipped: Q5 Optical Instruments (5 unattempted)"
   - Compact card design matching `card-premium` style

### Page restructure (`ExamResults.tsx`)

**New tab structure:**
- Tab 1: **"Insights"** (default) -- VerdictBanner + PerformanceBands + TopicFlags + InsightCards
- Tab 2: **"Analytics"** -- Score distribution chart + Attempt pie chart (existing charts moved here)
- Tab 3: **"Questions"** -- Existing question analysis (kept as-is)
- Tab 4: **"Students"** -- Full student list with search (existing, enhanced)

Remove the 4 stat cards from the top (their data is now in the verdict banner).
Remove the quick actions bar (Export/Share) and move them to PageHeader actions slot.

### Design specifications

- Mobile-first: verdict banner full-width, bands stack vertically, topic pills scroll horizontally
- Premium teal/cyan gradient on verdict banner matching teacher panel theme (`from-teal-500 to-cyan-500`)
- Band cards use `card-premium` class with left color accent border
- 44px+ touch targets on all interactive elements
- `pb-20` for bottom navigation clearance
- Tabs use compact 4-column grid on mobile (`grid-cols-4 text-xs`)

### Implementation phases (within this task)

1. Update `examResults.ts` with band computation helpers, verdict generator, and richer mock data
2. Create `VerdictBanner.tsx` component
3. Create `PerformanceBands.tsx` with collapsible student groups
4. Create `TopicFlags.tsx` for topic health pills
5. Create `InsightCards.tsx` for actionable highlights
6. Restructure `ExamResults.tsx` with new Insights tab as default, move charts to Analytics tab
7. Update `index.ts` exports

