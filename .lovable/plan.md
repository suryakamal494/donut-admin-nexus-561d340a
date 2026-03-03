

# Institute Batch Reports — Phased Enhancement Plan

## Phase 1: Batch Health Summary + Subject Comparison Chart ✅
**Pure frontend, no AI, no edge functions**

### 1A — Batch Health Summary Card
A compact executive summary card placed between the PageHeader and Tabs in `BatchReportDetail.tsx`. Collapsible (defaults collapsed on mobile). Computed entirely from existing `batch.subjects` data.

**Content:**
- Strongest subject (name + %) and weakest subject (name + %)
- Trend momentum: "3 improving, 1 declining, 2 stable"
- Multi-subject at-risk count (students at risk in 2+ subjects — computed from `getStudentsByBatch`)
- Urgent flag if any subject dropped >5% from previous average

**Files:**
| File | Action |
|------|--------|
| `src/components/institute/reports/BatchHealthSummary.tsx` | New — the card component |
| `src/pages/institute/reports/BatchReportDetail.tsx` | Add BatchHealthSummary between header and tabs |

---

### 1B — Subject Comparison Bar Chart
A horizontal bar chart (Recharts, already installed) showing all subjects ranked by class average, color-coded by 4-tier system. Placed at the top of the Subjects tab, above the existing cards.

**Files:**
| File | Action |
|------|--------|
| `src/components/institute/reports/SubjectComparisonChart.tsx` | New — Recharts horizontal bar chart |
| `src/pages/institute/reports/BatchReportDetail.tsx` | Add chart above `SubjectOverviewCards` in subjects tab |

---

## Phase 2: Multi-Subject Risk Filter in Students Tab ✅
Add a toggle/filter in `BatchStudentsTab.tsx` to surface students at risk in 2+ subjects. Shows which subjects each flagged student is struggling in. Uses existing student data — no new data generation needed.

**Files:**
| File | Action |
|------|--------|
| `src/components/institute/reports/BatchStudentsTab.tsx` | Add "Multi-Subject Risk" filter pill + filtered view |

---

## Phase 3: Cross-Batch Chapter Comparison in SubjectDetail
When viewing a chapter in `SubjectDetail.tsx`, show a small contextual note: "This chapter across all batches: Batch A 34%, Batch B 72%, Batch C 48%". Uses existing `getSubjectDetail()` calls for other batches with the same subject name.

**Files:**
| File | Action |
|------|--------|
| `src/data/institute/reportsData.ts` | Add `getCrossBatchChapterComparison(subjectName, chapterName)` helper |
| `src/pages/institute/reports/SubjectDetail.tsx` | Add comparison note below each chapter card's stats row |

---

## Phase 4: AI Batch Insights (Edge Function)
An on-demand AI analysis card (button-triggered, collapsible) that sends batch-level cross-subject data to an edge function and returns structured insights for the principal.

### 4A — Edge Function
New `analyze-batch-report` edge function. Follows the same pattern as `analyze-exam-results` (Lovable AI gateway, `google/gemini-3-flash-preview`). Input: all subject averages, trends, at-risk counts, chapter weak/strong counts. Output: 5 structured insights (priority alert, cross-subject pattern, teacher coaching suggestion, student intervention, positive signal).

### 4B — Frontend Component
`BatchAIInsights.tsx` — a collapsible card with "Generate AI Analysis" button. Displays structured insight cards after response. Placed below the Batch Health Summary in `BatchReportDetail.tsx`.

**Files:**
| File | Action |
|------|--------|
| `supabase/functions/analyze-batch-report/index.ts` | New edge function |
| `supabase/config.toml` | Add `[functions.analyze-batch-report]` with `verify_jwt = false` |
| `src/components/institute/reports/BatchAIInsights.tsx` | New — AI insights card |
| `src/pages/institute/reports/BatchReportDetail.tsx` | Add BatchAIInsights below health summary |

---

## Phase 5: Documentation Update
Update `docs/02-institute/reports-overview.md` and `.lovable/plan.md` to reflect all new components, data helpers, and the edge function.

---

## Dependency Order

```text
Phase 1A ──┐
Phase 1B ──┤── no dependencies, can be done together
Phase 2  ──┘
Phase 3  ──── depends on nothing (uses existing data)
Phase 4  ──── independent (edge function + component)
Phase 5  ──── after all above
```

Phases 1–3 are pure frontend with zero backend dependency. Phase 4 introduces the AI edge function. Each phase is self-contained and testable independently.
