

## Confirmation

Yes, your understanding is correct. Here is the structure:

```text
Reports (sidebar menu)
├── Batch Reports (sub-menu)
├── Exam Reports (sub-menu)  
└── Student Reports (sub-menu)
```

- **Batch Reports**: Batch listing → click batch → Subjects tab (subject-wise overview cards), Exams tab (all exams), Students tab (all students)
- **Exam Reports**: All exams across batches (teacher exams, institute exams, grand tests) — click exam → results view (multi-subject for grand tests)
- **Student Reports**: Batch-wise student cards → click student → 360° profile (all subjects at once)

---

## Implementation Plan — Institute Reports

### Phase 1: Foundation — Sidebar, Routes, Landing Page

**What**: Add "Reports" menu with 3 sub-menus to sidebar. Create the Reports landing page, route structure, and mock data layer.

**Files to create:**
| File | Purpose |
|------|---------|
| `src/pages/institute/reports/ReportsLanding.tsx` | Landing page with 3 cards (Batch / Exam / Student Reports) |
| `src/data/institute/reportsData.ts` | Mock data: batch summaries with subject-wise stats, exam listings, student aggregates |

**Files to modify:**
| File | Change |
|------|--------|
| `src/components/layout/InstituteSidebar.tsx` | Add "Reports" nav item with sub-items: Batch Reports, Exam Reports, Student Reports |
| `src/routes/InstituteRoutes.tsx` | Add lazy routes: `reports`, `reports/batches`, `reports/batches/:batchId`, `reports/exams`, `reports/exams/:examId`, `reports/students`, `reports/students/:studentId` |

**Deliverable**: Sidebar menu works, landing page shows 3 cards, clicking each navigates to the sub-section.

---

### Phase 2: Batch Reports — Listing + Batch Detail with Subjects Tab

**What**: Batch listing page (compact cards per batch showing subject count, student count, overall avg). Clicking a batch opens a detail page with 3 tabs: **Subjects**, **Exams**, **Students**.

The **Subjects tab** (default) shows compact subject overview cards: subject name, assigned teacher, class average, trend arrow, at-risk student count. Clicking a subject navigates to a subject detail page.

**Files to create:**
| File | Purpose |
|------|---------|
| `src/pages/institute/reports/BatchReports.tsx` | Batch listing — compact cards grouped by class, similar to teacher Reports landing |
| `src/pages/institute/reports/BatchReportDetail.tsx` | Tabs: Subjects / Exams / Students |
| `src/components/institute/reports/SubjectOverviewCards.tsx` | Subject cards grid for Subjects tab |

**Design notes:**
- Batch cards: compact, same density as teacher batch cards (gradient strip, inline stats row)
- Subject cards: 2-column grid on mobile, 3 on desktop. Each card ~100px tall. Shows: subject icon/color, teacher name, avg %, trend pill, at-risk badge
- Tabs use same pattern as teacher BatchReport (title + tabs on same row)

---

### Phase 3: Batch Detail — Exams Tab + Students Tab

**What**: 
- **Exams tab**: Lists all exams for this batch (teacher + institute + grand tests) in a compact timeline. Type badge (Teacher/Institute/Grand Test). Click navigates to exam results.
- **Students tab**: All students in the batch with overall avg across all subjects. Compact rows with PI bucket color. Click navigates to student 360° profile.

**Files to create:**
| File | Purpose |
|------|---------|
| `src/components/institute/reports/BatchExamsTab.tsx` | Exam listing with type badges and filters |
| `src/components/institute/reports/BatchStudentsTab.tsx` | Student listing with cross-subject averages |

**Design notes:**
- Exams tab: filter chips for exam type (All / Teacher / Institute / Grand Test). Compact rows, not cards.
- Students tab: searchable, sortable by name/avg. Color-coded PI bucket indicator on each row.

---

### Phase 4: Subject Detail Page

**What**: When institute clicks a subject card from Subjects tab, they see chapter-wise analysis for that subject in that batch. Reuses teacher's `ChaptersTab` component pattern but adapted for institute context (shows teacher name, no homework actions).

**Files to create:**
| File | Purpose |
|------|---------|
| `src/pages/institute/reports/SubjectDetail.tsx` | Chapter-wise analysis for a specific subject within a batch |

**Design notes:**
- Breadcrumb: Reports › Batch Reports › 10A › Physics
- Shows assigned teacher name prominently
- Chapter cards reuse the same compact card pattern from teacher reports
- No "Generate Homework" buttons — institute observes, doesn't create assignments
- Click chapter could deep-link to teacher's chapter report (future enhancement)

---

### Phase 5: Exam Reports — Cross-Batch Exam Listing + Single-Subject Exam Results

**What**: 
- Exam Reports landing: lists all exams across all batches. Filter by type (Teacher/Institute/Grand Test), by batch, by subject. Compact table/list view.
- Single-subject exam results: reuse teacher's ExamResults view but in institute context (read-only, no homework actions). Shows batch comparison if exam is assigned to multiple batches.

**Files to create:**
| File | Purpose |
|------|---------|
| `src/pages/institute/reports/ExamReports.tsx` | Cross-batch exam listing with filters |
| `src/pages/institute/reports/ExamResultDetail.tsx` | Single-subject exam results (adapted from teacher) |

**Design notes:**
- Exam listing: compact rows with batch name, subject, date, avg score, type badge
- For single-subject exams, reuse teacher's verdict/bands/topic flags components (read-only)
- No homework generation actions

---

### Phase 6: Grand Test Results — Multi-Subject View

**What**: When a grand test is clicked from Exam Reports, show a multi-subject results page. This is genuinely new — not present in teacher module.

**Files to create:**
| File | Purpose |
|------|---------|
| `src/pages/institute/reports/GrandTestResults.tsx` | Multi-subject exam results view |
| `src/components/institute/reports/SubjectScoreCard.tsx` | Per-subject summary card (avg, highest, weak topics) |
| `src/components/institute/reports/GrandTestLeaderboard.tsx` | Overall leaderboard with per-subject score columns |

**Design notes:**
- Top: Overall summary bar (total avg, pass %, top student)
- Middle: 3 subject score cards side-by-side (Physics / Chemistry / Maths) — each shows avg, highest, pass %, top weak topic
- Bottom: Student leaderboard table with overall rank + individual subject scores in columns
- If assigned to multiple batches: batch comparison section (Batch A vs B avg per subject)

---

### Phase 7: Student Reports — Listing + 360° Profile

**What**: 
- Student Reports landing: batch-wise grouping. Click a batch to see students. Or search across all students.
- Student 360° Profile: all subjects on one page. Header with overall stats, then subject cards grid, then recent exams timeline.

**Files to create:**
| File | Purpose |
|------|---------|
| `src/pages/institute/reports/StudentReports.tsx` | Batch-wise student listing with search |
| `src/pages/institute/reports/StudentProfile360.tsx` | 360° cross-subject student profile |
| `src/components/institute/reports/SubjectPerformanceCard.tsx` | Per-subject card in 360° view (avg, trend, teacher, exam count) |
| `src/components/institute/reports/StudentRecentExams.tsx` | Cross-subject recent exams timeline |

**Design notes:**
- 360° Profile header: student name, batch, overall avg across all subjects, trend
- Subject cards: 2-column grid on mobile. Each card: subject color strip, avg %, trend arrow, teacher name, exam count. Click card → navigates to SubjectDetail page
- Recent exams: compact timeline showing last 5-8 exams across all subjects with subject badge on each
- No homework actions — institute doesn't assign homework

---

### Phase 8: Mock Data Layer + Documentation

**What**: Complete mock data generation for all institute report views and update documentation.

**Files to create/modify:**
| File | Change |
|------|--------|
| `src/data/institute/reportsData.ts` | Complete mock data: batch summaries with subjects, subject-wise analytics, cross-subject student profiles, grand test results |
| `docs/02-institute/reports-overview.md` | New: Institute Reports overview, navigation map, design principles |
| `docs/02-institute/reports-batches.md` | New: Batch reports spec (subjects tab, exams tab, students tab) |
| `docs/02-institute/reports-exams.md` | New: Exam reports spec (single-subject + grand test) |
| `docs/02-institute/reports-students.md` | New: Student 360° profile spec |
| `src/data/docsNavigation.ts` | Add Reports section under Institute Portal |

---

### Summary

| Phase | What | New Files | Modified Files |
|-------|------|-----------|----------------|
| 1 | Sidebar + Routes + Landing | 2 | 2 |
| 2 | Batch listing + Subjects tab | 3 | 0 |
| 3 | Exams tab + Students tab | 2 | 0 |
| 4 | Subject Detail page | 1 | 0 |
| 5 | Exam Reports listing + single-subject results | 2 | 0 |
| 6 | Grand Test multi-subject results | 3 | 0 |
| 7 | Student Reports + 360° Profile | 4 | 0 |
| 8 | Mock data + Documentation | 5 | 1 |

**Total: ~22 new files, 3 modified files across 8 phases.**

### Key Design Principles
- **Compact, dense UI** — same density standards as teacher reports (inline stats, tight padding, no oversized cards)
- **No action buttons** — institute observes and delegates, doesn't create homework/practice
- **Teacher attribution** — every subject card shows the assigned teacher so the principal knows who to talk to
- **Mobile-first** — 2-column grids on mobile, single-row tabs, compact stat rows
- **Reuse where possible** — teacher report components (ChaptersTab, VerdictBanner, PerformanceBands) used in read-only mode

