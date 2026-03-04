

# Implementation Plan: Remaining Enhancements

## Cross-Batch Chapter Comparison — Reasoning

**What it does:** When a principal views a chapter (e.g., "Kinematics") in one batch's Physics subject, they see a single line: *"Across batches: Batch A 34% · Batch B 72% · Batch C 48%"*

**Why it matters:** This is the single most decision-critical signal for a principal. It answers one question that no other component answers:

> "Is this a curriculum problem or a teaching/batch problem?"

- If Kinematics is 34% in ALL batches → the chapter is inherently hard or the curriculum needs revision. Action: institute-level syllabus review.
- If Kinematics is 34% in Batch A but 72% in Batch B → the teacher or batch cohort is the variable. Action: peer observation, resource sharing between teachers.

Without this, the principal sees "Kinematics: 34% — Weak" and has no frame of reference. They can't act because they don't know *why* it's weak.

**Cost:** Minimal — a single helper function + one line of text per chapter card. No new page, no new component, no clutter.

**Verdict:** Implement. High signal, near-zero space cost.

---

## Phase-Wise Plan

### Phase A: Institute-Wide Subject Health on Landing Page
**Goal:** Give the principal a subject-level pulse on the landing page — "How is Physics doing across the entire institute?" — before they drill into any batch.

**What to build:**
- A compact section below the 3-column stats bar on `ReportsLanding.tsx`
- Shows each subject as a small horizontal bar or inline row: subject name, institute-wide average (mean across all batches that teach it), and a trend indicator
- Sorted worst-to-best so the principal sees problem areas first
- Collapsible on mobile (same pattern as BatchHealthSummary)

**Positioning:** Between the stats bar and the 3 report section cards. This fills the gap where the principal currently sees "67% avg" but doesn't know *which subjects* are pulling that down.

**Space budget:** ~80px collapsed (header only), ~200px expanded. No new page.

**Files:**
| File | Action |
|------|--------|
| `src/components/institute/reports/InstituteSubjectHealth.tsx` | New — compact subject health rows |
| `src/pages/institute/reports/ReportsLanding.tsx` | Add between stats bar and section cards |

---

### Phase B: Cross-Batch Chapter Comparison in SubjectDetail
**Goal:** Add contextual cross-batch data to each chapter card in `SubjectDetail.tsx`.

**What to build:**
- A helper function `getCrossBatchChapterComparison(subjectName, chapterName)` in `reportsData.ts` that looks up the same chapter across all batches teaching that subject
- A single compact line below each chapter card's stats row: `"Across batches: Batch A 58% · Batch B 34% · Batch C 71%"` with mini color-coded dots
- Only shows when 2+ batches have the same chapter (otherwise hidden — no wasted space)

**Positioning:** Inside existing chapter cards, below the stats row (topics · exams · weak count). Adds ~16px per card. No layout change.

**Files:**
| File | Action |
|------|--------|
| `src/data/institute/reportsData.ts` | Add `getCrossBatchChapterComparison()` helper |
| `src/pages/institute/reports/SubjectDetail.tsx` | Add comparison line in chapter cards |

---

### Phase C: Documentation Update
Update `docs/02-institute/reports-overview.md` and `.lovable/plan.md` to reflect all new components (InstituteSubjectHealth, cross-batch chapter helper) and mark all phases complete.

**Files:**
| File | Action |
|------|--------|
| `docs/02-institute/reports-overview.md` | Add InstituteSubjectHealth + cross-batch docs |
| `.lovable/plan.md` | Mark all phases done |

---

## Dependency Order

```text
Phase A ──── independent (landing page addition)
Phase B ──── independent (subject detail addition)
Phase C ──── after A and B
```

Both A and B can be implemented together — they touch different pages with no shared dependencies.

---

## What is NOT in this plan (and why)

| Skipped | Reason |
|---------|--------|
| Teacher ranking dashboard | Signal already embedded in subject cards + AI insights. Separate dashboard adds clutter and political sensitivity. |
| Intervention tracking | Workflow feature, not a report. Needs DB tables, forms, status management. Separate product module. |
| Curriculum alignment | No curriculum metadata in data model. Massive scope creep. |
| Student attrition | No enrollment/withdrawal data. Administrative feature, not academic. |
| Sparklines on subject cards | Trend arrow + AI insights cover the signal. Sparklines add visual noise on mobile. |

