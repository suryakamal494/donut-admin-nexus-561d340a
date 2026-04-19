

## What I'm hearing you ask for

You want the Reports routine in Copilot to behave like a **true analyst that already knows everything in the Teacher Reports module** — not a tool that only answers a fixed set of pre-wired questions.

In your words, restated:

> "Whatever data exists anywhere in the Teacher Reports module — for this batch, for any exam in it, for any chapter, for any student, for any topic — if a teacher asks about it in chat, the agent must be able to answer. Don't limit me to 'How did the last exam go?' or 'Who is at risk?'. If I ask 'How is Aarav doing in Optics specifically?' or 'Compare Riya's accuracy on hard questions vs Kavya's' or 'Which topic in Thermodynamics is the weakest and which 4 students are pulling it down?' — the agent must answer, with the same numbers the report pages show."

So the requirement has **three parts**:

### 1. Total coverage of report data (no blind spots)
Every metric, every entity, every signal that the Teacher Reports module computes today must be reachable by the agent. That includes:
- **Batch level** — class average, trend, PI distribution, exam count, batch health
- **Exam level** — verdict, score distribution, performance bands, question-by-question analysis, difficulty mix, cognitive-type mix, topic flags, batch comparison
- **Chapter level** — topic heatmap, weak topics, per-exam breakdown, student buckets within the chapter
- **Topic level** — success rate trend, exams testing it, students struggling
- **Student level** — full profile (PI breakdown, chapter mastery, weak topics, difficulty/cognitive mix, exam history, AI summary, suggested difficulty)
- **Cross-cutting** — compare two exams, compare two students, "students weak in 2+ subjects", "students who declined this term"
- **Actionable insights** — reteach / practice / celebrate / attention cards with the same prefill payload the Reports pages use

### 2. Same source of truth (no invented numbers)
Every answer must come from the **same generators** the report pages already use (`getBatchHealth`, `generateVerdictSummary`, `computeStudentPI`, `getStudentBatchProfile`, `getChapterDetail`, `computePerformanceBands`, `computeTopicFlags`, `generateMockActionableInsights`, `generateMockStudentInsight`). Same seed → same output → identical numbers in `/teacher/reports/...` and in chat.

### 3. Open-ended Q&A, not fixed buttons
Quick-start chips are just shortcuts. The real requirement is that the agent can **interpret any natural-language question about reports**, pick the right tool(s), and answer — including drill-down questions ("now show me her difficulty mix"), comparison questions, and questions that combine signals ("students who are at risk AND declining").

---

## Implementation plan

### Phase A — Expand server-side report tools

Add to `supabase/functions/routine-pilot-chat/index.ts` (Reports-only, on top of the 6 tools already wired):

| New tool | What it answers |
|---|---|
| `get_student_profile` | Per-student deep profile: PI breakdown, chapter mastery, weak topics, difficulty/cognitive mix, exam history, AI summary, suggested difficulty |
| `get_chapter_deep_dive` | One chapter: topic heatmap, per-exam breakdown, 4-bucket student counts, weak-topic list |
| `get_topic_analysis` | One topic across all exams: success-rate trend, affected students, exam list |
| `get_difficulty_analysis` | Exam-level easy/medium/hard accuracy + cognitive-type distribution |
| `get_question_analysis` | Per-question stats for an exam (correct/incorrect/unattempted, avg time, success rate) |
| `get_compare_exams` | Side-by-side delta of two exams (avg, pass%, weak topics joined/dropped) |
| `get_compare_students` | Side-by-side two-student delta (PI, accuracy, weak chapters, trend) |
| `get_batch_health_summary` | Full "Today's Focus" (priority topics + students-to-check-in + suggested focus) |
| `get_actionable_insights` | Reteach / practice / celebrate / attention cards for an exam, **with `actionPayload`** for one-click homework prefill |
| `get_student_search` | Resolve "Aarav" / "Kavya M." → student record (name + roll + id) so other tools can be called with an id |
| `get_chapter_search` | Resolve "Optics" / "Wave Optics" → chapter or topic record |
| `get_multi_subject_risk` | Students appearing in risk/reinforcement across multiple subjects |

Each tool runs against the existing generators (no re-rolling), serializes via `reportContext.ts`, and emits `rp_report_data` SSE for the inline card renderer.

### Phase B — Expand the system prompt + routing

Rewrite the Reports system prompt so the model:
- Knows the **full tool catalogue** and when to pick each one (decision rules: "if the question names a student → `get_student_search` then `get_student_profile`", "if it names a topic → `get_topic_analysis`", "if it asks 'compare' → `get_compare_*`", etc.)
- Always cites numbers from tool results, never guesses
- Is allowed to **chain tools** in one turn (search → fetch → summarize)
- Always follows a tool call with a 2–4 sentence plain-language insight (already wired)

### Phase C — New inline cards (in `src/components/teacher/routine-pilot/reports-cards/`)

| Card | Data source |
|---|---|
| `StudentProfileCard` | header + PI bar + chapter strip + weak topics + "Generate Homework" CTA |
| `ChapterDeepDiveCard` | topic heatmap mini + 4-bucket student counts + per-exam mini-list |
| `TopicCard` | spark + status + affected student count |
| `DifficultyMixCard` | easy/medium/hard chart + cognitive-type pie |
| `QuestionAnalysisCard` | per-question rows (correct/incorrect, time, success rate) |
| `ExamCompareCard` | two-column delta with arrows |
| `StudentCompareCard` | two-column delta with arrows |
| `TodaysFocusCard` | gradient header + suggestedFocus + priority list |
| `ActionableInsightCard[]` | colour-coded by severity, **with one-click "Generate Homework" handoff** |
| `MultiSubjectRiskCard` | students-at-risk-in-N-subjects list |

Register all of these in `ReportCardRenderer.tsx`.

### Phase D — Cross-routine handoff (the actionable bit)

Wire the "Generate Homework" / "Assign Practice" CTA on `ActionableInsightCard` so it:
1. Switches Copilot to the Homework routine
2. Creates a fresh thread
3. Prefills the input with `{ topic, difficulty, studentIds, contextBanner }` — same payload shape `ExamResults.tsx` uses for `AIHomeworkGeneratorDialog`

This makes Copilot Reports actually **reduce teacher effort**, not just describe data.

### Phase E — Context expansion

Extend `reportContext.ts` with lazy resolvers for student profiles, chapter deep dives, topic analysis, difficulty mix, question analysis, exam comparisons, and multi-subject risk — all calling the existing generators in `reportsData.ts` / `examResults.ts` / `studentReportData.ts` / `lib/performanceIndex.ts`.

### Phase F — Updated quick-start chips

Replace the 5 chips with 8 that **showcase open-ended Q&A** (and signal to the teacher that anything is fair game):
- "How did the last exam go?"
- "How is [top student] doing?"
- "Show me Wave Optics performance"
- "What should I reteach this week?"
- "Easy vs hard question performance"
- "Compare last two exams"
- "Students at risk in 2+ subjects"
- "Today's focus"

### Files touched

| File | Change |
|---|---|
| `supabase/functions/routine-pilot-chat/index.ts` | +12 new `get_*` tools + handlers; updated system prompt |
| `src/components/teacher/routine-pilot/reports-cards/reportContext.ts` | +7 resolvers (student, chapter, topic, difficulty, question, compare, multi-subject) |
| `src/components/teacher/routine-pilot/reports-cards/` | +9 new card components + `TopicHeatmapMini`, `DifficultyMiniChart` |
| `src/components/teacher/routine-pilot/reports-cards/ReportCardRenderer.tsx` | Register new card kinds |
| `src/components/teacher/routine-pilot/ChatPane.tsx` | Wire "Generate Homework" handoff (switch routine + prefill) |
| DB — `rp_routines` row (reports) | Update quick-start chips |

### Out of scope (same as before)

- No real (non-mock) student data — uses the same generators the Reports pages use
- No editing reports from chat (read-only)
- Cross-batch institute-wide queries — strictly active-batch only

### Phasing

Single implementation pass: Phase A → B → C → D → E → F → end-to-end QA on 8+ open-ended questions including ones not in the chip list.

