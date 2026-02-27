

## Issues Identified & Reasoning

### Issue 1: Topic Heatmap — All Topics Show Same Color
**Root Cause Found:** In `src/data/teacher/reportsData.ts` line 179, the status is set using old 3-tier thresholds: `sr >= 65 ? "strong" : sr >= 40 ? "moderate" : "weak"`. Then `TopicHeatmapGrid.tsx` calls `getStatusColor(topic.status)` which maps "moderate" to teal. So 40%, 44%, 58% all become "moderate" → same teal color. Similarly, `computeTopicFlags` in `examResults.ts` line 127 uses 70/40 thresholds.

**Fix:** Stop routing through `status` for color. Use `getPerformanceColor(avgSuccessRate)` directly on the percentage value. This gives the correct 4-tier color: 40% → red, 44% → amber, 58% → teal, 79% → emerald.

### Issue 2: Analytics Tab — "Overall Attempt Analysis" Is Not Actionable
**Your point is valid.** Showing "118 correct, 118 incorrect, 14 unattempted" as a pie chart gives no actionable takeaway. A teacher can't act on that.

**Replace with two actionable charts:**
1. **Difficulty-wise Class Performance** — Bar chart showing class average accuracy for Easy/Medium/Hard questions. Teacher can see "My class is scoring 80% on Easy but only 25% on Hard" → actionable.
2. **Cognitive Type Performance** — Radar or bar chart showing accuracy across Logical/Analytical/Conceptual/Numerical/Application/Memory types. Teacher can see "Students struggle with Application-type questions" → actionable.

The Score Distribution bar chart stays — it IS useful (shows how many students fall in each marks range).

### Issue 3: AI-Generated Insights — When to Generate?
**Your pain point:** Results update dynamically as students submit. When should the teacher generate insights?

**Solution:** Add a button labeled **"Analyze Results"** (not "Generate Insights" — "Analyze" feels natural to teachers, like analyzing answer sheets). When clicked, it calls Lovable AI to produce a 4-5 point summary of: what went well, what needs reteaching, which students need attention, and a recommended next step. The AI output appears in a card below the button.

**Why "Analyze Results"?** Teachers already "analyze" papers. It's familiar language. It implies the teacher is in control of when analysis happens, not that it's auto-generated on incomplete data.

### Issue 4: Questions Tab — Area Chart Is Useless
**Your point is valid.** The curve chart of Q1→Q10 success rates doesn't show any pattern because question order is arbitrary (Q1 isn't inherently related to Q2). It just looks like random noise.

**Replace with:** Remove the chart entirely. Instead, group questions into **4 accuracy bands** displayed as collapsible sections, ordered from worst to best:

1. **Needs Reteaching** (< 35% accuracy) — shown first, expanded by default, red accent
2. **Review Recommended** (35–50%) — amber accent
3. **Satisfactory** (50–75%) — teal accent
4. **Well Understood** (≥ 75%) — emerald accent, collapsed by default

This way, with 30 questions, the teacher immediately sees "5 questions need reteaching" at the top. They don't have to scan 30 cards.

### Issue 5: Questions — Show Actual Question Text, Not "Q1"
**Your point is valid.** "Question 1" tells the teacher nothing. They need to see the actual question to know what to reteach.

**Fix:** Show a truncated question text (first ~80 chars) on each card. Add an **"View Question"** expand/dialog that shows the full question text, options (if MCQ), correct answer highlighted, and the class accuracy stats.

The `QuestionAnalysis` type currently doesn't have `questionText`. I'll extend it to include `questionText` and `options` fields, populated from `examQuestionsData.ts` which already has full question content.

### Issue 6: Collapsible Grouping — Expand/Collapse?
**Recommendation:** Use collapsible sections (Accordion pattern). The worst-performing group (< 35%) is **expanded by default** since that's where the teacher needs to act. The best group (≥ 75%) is **collapsed by default** since those are fine. This keeps the page short on mobile while surfacing the most important questions first.

---

## Implementation Plan

### Files to modify/create:

| File | Change |
|---|---|
| `src/data/teacher/reportsData.ts` | Fix topic status thresholds to use 4-tier (75/50/35) instead of 3-tier (65/40) |
| `src/data/teacher/examResults.ts` | 1) Fix `computeTopicFlags` thresholds (75/50/35). 2) Extend `QuestionAnalysis` with `questionText`, `options`, `cognitiveType`. 3) Update `generateQuestionAnalysis` to pull from `examQuestionsData.ts` |
| `src/components/teacher/reports/TopicHeatmapGrid.tsx` | Use `getPerformanceColor(topic.avgSuccessRate)` directly instead of `getStatusColor(topic.status)` |
| `src/pages/teacher/ExamResults.tsx` | 1) Replace Analytics tab: remove pie chart, add Difficulty + Cognitive charts, add "Analyze Results" AI button. 2) Replace Questions tab: remove area chart, add grouped accordion layout |
| `src/components/teacher/exams/results/QuestionAnalysisCard.tsx` | Show truncated question text instead of "Question 1". Add "View Question" expand |
| `src/components/teacher/exams/results/QuestionGroupAccordion.tsx` | **New** — Accordion component that groups questions by accuracy band with color-coded headers |
| `src/components/teacher/exams/results/DifficultyChart.tsx` | **New** — Bar chart showing class accuracy by difficulty level |
| `src/components/teacher/exams/results/CognitiveChart.tsx` | **New** — Bar chart showing class accuracy by cognitive type |
| `src/components/teacher/exams/results/AIAnalysisCard.tsx` | **New** — "Analyze Results" button + AI-generated insight display card |
| `supabase/functions/analyze-exam-results/index.ts` | **New** — Edge function calling Lovable AI to generate exam analysis summary |

