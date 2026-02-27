

## Your Pain Point — My Understanding

**The problem:** Every path to view exam results — whether from the Exams page, the BatchReport exams tab, or the ChapterReport exam breakdown — redirects to `/teacher/exams/:examId/results`. This means the teacher always leaves their current context (Reports) and lands in the Exams section. The back navigation then takes them to the Exams list, not back to where they came from. Even with the `returnTo` fix we added, it's a band-aid — the fundamental issue is that exam results live under the wrong parent.

**Your proposal:** Move the exam results page to live under the Reports section. The Exams page should redirect *to* Reports when viewing results. This way:
- Teacher in Reports → clicks exam → stays in Reports → back button stays in Reports
- Teacher in Exams → clicks results → goes to Reports → natural flow since results *are* reports

**You are completely right.** Results are analytical/reflective content — they belong in Reports, not in the action-oriented Exams section. The Exams section is for creating, editing, scheduling. Reports is for reviewing outcomes. Mixing them creates a navigation dead-end every time.

---

## What Changes

### Current Navigation
```text
/teacher/exams/:examId/results          ← ALL exam result views go here
  ├── from Exams page (no context)
  ├── from BatchReport exams tab (loses Reports context)
  └── from ChapterReport breakdown (loses Reports context)
```

### Proposed Navigation
```text
/teacher/reports/:batchId/exams/:examId  ← NEW home for exam results
  ├── from BatchReport exams tab (stays in Reports)
  ├── from ChapterReport breakdown (stays in Reports, back = chapter)
  └── from Exams page (redirects here, breadcrumb shows Reports path)
```

---

## Implementation Plan

### 1. Add new route in `TeacherRoutes.tsx`
- Add: `reports/:batchId/exams/:examId` → renders the same `ExamResults` component
- Keep the old `exams/:examId/results` route temporarily (redirect to new path)

### 2. Update `ExamResults.tsx` to read `batchId` from URL
- Read `batchId` from `useParams` (new route provides it natively)
- Update breadcrumbs to always show: Teacher → Reports → Batch → Exam Results
- Remove the `returnTo` query param hack — no longer needed since we're in Reports context
- Back navigation naturally goes to `/teacher/reports/:batchId`

### 3. Update navigation sources
- **`BatchReport.tsx`**: Change exam click from `/teacher/exams/${examId}/results?batch=X` → `/teacher/reports/${batchId}/exams/${examId}`
- **`ChapterReport.tsx`**: Change exam breakdown click from `/teacher/exams/${examId}/results?batch=X&returnTo=...` → `/teacher/reports/${batchId}/exams/${examId}?returnTo=...` (returnTo still useful here to go back to specific chapter, not just batch)
- **`Exams.tsx`**: Change "View Results" to navigate to `/teacher/reports/${batchId}/exams/${examId}` — requires knowing the batchId from exam data

### 4. Handle Exams page → Reports redirect
- In `Exams.tsx`, the exam cards have `batchIds[]`. Use the first batchId (or selected batch) to construct the Reports URL
- If multi-batch exam, navigate with the first batch pre-selected (batch selector on results page handles switching)

### Files to modify:
| File | Change |
|------|--------|
| `src/routes/TeacherRoutes.tsx` | Add `reports/:batchId/exams/:examId` route |
| `src/pages/teacher/ExamResults.tsx` | Read `batchId` from params, update breadcrumbs to Reports context |
| `src/pages/teacher/BatchReport.tsx` | Update navigate path to Reports-based URL |
| `src/pages/teacher/ChapterReport.tsx` | Update navigate path to Reports-based URL |
| `src/pages/teacher/Exams.tsx` | Update "View Results" to navigate to Reports-based URL |

