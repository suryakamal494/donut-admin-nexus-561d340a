

## Plan: Full-Page Practice Generator + Practice History (Teacher UI Only)

No database, no student-side changes, no real submission tracking. Pure teacher-side UI with mock data.

---

### What Changes

| Action | File | Description |
|--------|------|-------------|
| **Create** | `src/pages/teacher/ChapterPracticeReview.tsx` | Full-page 3-step flow replacing the popup dialog |
| **Create** | `src/components/teacher/reports/ChapterPracticeHistory.tsx` | Card showing chronological list of past practice sessions with mock completion/accuracy stats |
| **Create** | `src/data/teacher/practiceHistoryData.ts` | Mock data: 2-3 past practice sessions per chapter with per-band completion rates, accuracy, dates |
| **Modify** | `src/routes/TeacherRoutes.tsx` | Add route: `reports/:batchId/chapters/:chapterId/practice` |
| **Modify** | `src/pages/teacher/ChapterReport.tsx` | Replace dialog open with `navigate(...)` to practice page. Add `ChapterPracticeHistory` section below StudentBuckets |
| **Delete** | `src/components/teacher/reports/ChapterPracticeGenerator.tsx` | Replaced by the full page |

---

### New Page: `ChapterPracticeReview.tsx`

Route: `/teacher/reports/:batchId/chapters/:chapterId/practice`

**Step 1 — Configure** (full-width, not a popup)
- PageHeader with breadcrumbs back to chapter report
- Band summary chips (color-coded, showing student count per band)
- Question count selector (5 or 10 per band)
- Common instructions textarea
- Expandable per-band instruction overrides
- "Generate" button

**Step 2 — Review** (the key improvement over the popup)
- Full-width tabbed layout, one tab per band (color-coded)
- Each tab shows question cards with: question text, 4 options (correct highlighted), difficulty badge, topic badge
- Remove/restore per question
- Per-band "Assign" button + "Assign All" button
- Proper spacing — no cramped popup, questions are readable

**Step 3 — Confirmation**
- Summary: X practice sets, Y questions, Z students
- "Back to Chapter Report" button → navigates back

Reuses the existing edge function `generate-chapter-practice` for AI generation. Same logic as the current `ChapterPracticeGenerator.tsx`, just rendered as a page.

---

### Practice History Section on Chapter Report

Added between `StudentBuckets` and `ChapterExamBreakdown`.

Shows a card titled "Practice History" with a chronological list of past sessions:
- Each row: date, total questions, bands included (color dots), mock completion % per band, mock avg accuracy
- Click row → navigates to a read-only view of that practice session (same review page, pre-populated with mock data, no assign buttons)
- "No practice sessions yet" empty state

All data is mock — generated deterministically per chapter using the same Map-based caching pattern used elsewhere in `reportsData.ts`.

---

### Mock Data Shape

```typescript
interface PracticeSession {
  id: string;
  createdAt: string; // date string
  chapterId: string;
  bands: {
    key: string;
    label: string;
    questionCount: number;
    studentsAssigned: number;
    completedCount: number; // mock
    avgAccuracy: number;    // mock
  }[];
}
```

2-3 sessions per chapter, spaced 1-2 weeks apart, with realistic mock stats.

