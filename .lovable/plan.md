

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

## Phase 3: Cross-Batch Chapter Comparison in SubjectDetail ✅
When viewing a chapter in `SubjectDetail.tsx`, show a compact contextual note: "Other batches: 10A 34% · 10B 72% · 10C 48%". Uses `getCrossBatchChapterComparison()` helper.

**Files:**
| File | Action |
|------|--------|
| `src/data/institute/reportsData.ts` | Added `getCrossBatchChapterComparison(subjectName, chapterName, excludeBatchId)` helper |
| `src/pages/institute/reports/SubjectDetail.tsx` | Added `CrossBatchLine` inline component below each chapter card's stats row |

---

## Phase 4: AI Batch Insights (Edge Function) ✅
An on-demand AI analysis card (button-triggered, collapsible) that sends batch-level cross-subject data to an edge function and returns structured insights for the principal.

**Files:**
| File | Action |
|------|--------|
| `supabase/functions/analyze-batch-report/index.ts` | Edge function using Lovable AI gateway |
| `src/components/institute/reports/BatchAIInsights.tsx` | AI insights card with Generate/Regenerate |
| `src/pages/institute/reports/BatchReportDetail.tsx` | Added below health summary |

---

## Phase 5: Institute-Wide Subject Health on Landing Page ✅
A compact, collapsible section on `ReportsLanding.tsx` showing each subject's average across all batches, sorted worst-to-best, with bar visualization and min-max spread.

**Files:**
| File | Action |
|------|--------|
| `src/components/institute/reports/InstituteSubjectHealth.tsx` | New — collapsible subject health rows with performance bars |
| `src/pages/institute/reports/ReportsLanding.tsx` | Added between stats bar and section cards |

---

## Phase 6: Documentation Update ✅
Updated plan.md to reflect all completed phases.
