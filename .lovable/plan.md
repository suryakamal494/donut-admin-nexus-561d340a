

The user wants a **single, copy-pasteable spec/brief** they can hand to the "main environment" team (the production Lovable Cloud build) so that team can wire the **Exam Analysis / Reports agent** end-to-end. The brief must list every report, every metric, every formula, every entity, and every tool the agent needs — so the agent can answer ANY natural-language teacher question about reports.

I'll deliver this as a downloadable Markdown file in `/mnt/documents/` plus an inline preview. No code changes — just the spec.

## Plan

Generate one comprehensive document: **`teacher-reports-agent-spec.md`** with these sections:

1. **Mission** — one paragraph stating the agent must answer ANY question about ANY report data with same-source-of-truth numbers.

2. **Data inventory** (everything the agent must "know"):
   - **Batch level**: classAverage, previousAverage, trend, totalExamsConducted, atRiskCount, recentExamAvg, overallTrend, batch health summary
   - **Exam level**: averageScore, highestScore, lowestScore, passPercentage, scoreDistribution (4 quartiles), attemptedCount, questionAnalysis[], topicFlags[], batchComparison[], verdict, performance bands, difficulty mix, cognitive-type mix, actionable insights (reteach/practice/celebrate/attention)
   - **Chapter level**: avgSuccessRate, weakTopicCount, status, examsCovering, topics[], examBreakdown, student buckets in chapter
   - **Topic level**: success rate trend, exams testing it, affected students
   - **Student level**: overallAccuracy, performanceIndex (with breakdown), consistency, trend, secondaryTags, chapterMastery[], weakTopics[], difficultyBreakdown, examHistory, suggestedDifficulty, AI summary
   - **Cross-cutting**: compare two exams, compare two students, multi-subject risk, declined-this-term

3. **Formulas** (verbatim, so the wiring team uses identical math):
   - PI = 0.50×Accuracy + 0.20×Consistency + 0.15×TimeEfficiency + 0.15×AttemptRate
   - Consistency = 100 − (stdDev/30)×100
   - Trend = linear regression slope (>2 up, <−2 down)
   - Plateau = ≥3 exams, stdDev<5, |slope|<1.5
   - Performance bands: Mastery ≥75, Stable 50–74, Reinforcement 35–49, Risk <35
   - Topic flags: strong ≥75, moderate ≥50, weak <50
   - Difficulty: easy >65%, medium >40%, hard ≤40%
   - Pass = score ≥40% of maxScore
   - Secondary tags rules (improving, declining, plateaued, inconsistent, speed-issue, low-attempt)

4. **Tool catalogue** (the 18 tools the agent must expose, with input/output schemas):
   `get_batch_overview`, `get_recent_exams`, `get_exam_analysis`, `get_question_analysis`, `get_difficulty_analysis`, `get_chapter_health`, `get_chapter_deep_dive`, `get_chapter_search`, `get_topic_analysis`, `get_at_risk_students`, `get_top_performers`, `get_student_search`, `get_student_profile`, `get_compare_students`, `get_compare_exams`, `get_batch_health_summary`, `get_actionable_insights`, `get_multi_subject_risk`

5. **Routing decision rules** (so the model picks the right tool):
   - Names a student → `get_student_search` → `get_student_profile`
   - Names a topic/chapter → `get_chapter_search` → `get_topic_analysis` or `get_chapter_deep_dive`
   - "Compare X and Y" → `get_compare_students` / `get_compare_exams`
   - "What should I reteach?" / "Today's focus" → `get_batch_health_summary` + `get_actionable_insights`
   - "At risk in 2+ subjects" → `get_multi_subject_risk`
   - Drill-downs ("now her difficulty mix") → re-use last entity from context

6. **Source-of-truth rule** — every tool MUST call existing generators (`getBatchHealth`, `generateVerdictSummary`, `computeStudentPI`, `getStudentBatchProfile`, `getChapterDetail`, `computePerformanceBands`, `computeTopicFlags`, `generateMockActionableInsights`, `generateMockStudentInsight`). No re-implementation.

7. **System prompt** — full ready-to-paste system prompt for the agent (mission + tool list + routing rules + answer format: card + 2–4 sentence plain-language insight).

8. **UI contract** — list of inline cards the agent can emit (StudentProfileCard, ChapterDeepDiveCard, TopicCard, DifficultyMixCard, QuestionAnalysisCard, ExamCompareCard, StudentCompareCard, TodaysFocusCard, ActionableInsightCard, MultiSubjectRiskCard) and the SSE event shape (`rp_report_data`).

9. **Cross-routine handoff** — Generate Homework button payload `{ topic, difficulty, studentIds, contextBanner }` → switches to Homework routine, fresh thread, prefilled draft.

10. **Quick-start chips** (8): How did the last exam go / How is [top student] doing / Show me [topic] performance / What should I reteach this week / Easy vs hard performance / Compare last two exams / Students at risk in 2+ subjects / Today's focus.

11. **Acceptance criteria / QA script** — 12 sample questions the wiring team must verify (named-student probe, topic probe, compare, drill-down, multi-subject, declined-this-term, etc.) with expected card + insight sentence pattern.

12. **Out of scope** — no editing reports from chat, no cross-batch institute queries, read-only.

### Deliverable

One file: `/mnt/documents/teacher-reports-agent-spec.md` (~8–10 KB), plus a `<lov-artifact>` tag in the response so the user can download it.

