

## What You're Asking

The Practice History rows are clickable but don't navigate anywhere. You want each practice session to open a **dedicated detail page** showing comprehensive performance analysis — similar to how exam results pages work, but tailored to practice assignments with per-band breakdowns.

After assigning practice, the teacher needs to know:
- Per band: completion rate, accuracy, which students completed/pending
- Overall trends across bands
- Question-level performance (which questions were hard/easy)
- Comparison across bands to see if the practice achieved its goal

## Reasoning

This is the right approach. The practice history currently is a dead-end — data with no drill-down. The exam results page already establishes the pattern: overview banner → performance breakdown → question analysis → student list. The practice detail page should follow the same structure but organized by **band** since that's the unique dimension of practice assignments.

## Implementation Plan

| Action | File | Description |
|--------|------|-------------|
| **Create** | `src/pages/teacher/PracticeSessionDetail.tsx` | Full detail page for a single practice session |
| **Create** | `src/data/teacher/practiceSessionDetailData.ts` | Mock data generator: per-band student results, per-question accuracy, completion stats |
| **Modify** | `src/components/teacher/reports/ChapterPracticeHistory.tsx` | Add `onClick` → navigate to `/teacher/reports/:batchId/chapters/:chapterId/practice/:sessionId` |
| **Modify** | `src/routes/TeacherRoutes.tsx` | Add route for `practice/:sessionId` |

### Page Structure: `PracticeSessionDetail.tsx`

**PageHeader** — breadcrumbs back to chapter report, date, chapter name

**Overview Banner** — total questions, overall completion %, overall accuracy, bands count

**Band Performance Cards (grid)** — one card per band (color-coded emerald/teal/amber/red):
- Band label, student count, completion rate (X/Y completed)
- Avg accuracy with color indicator
- Question count
- Mini progress bar for completion

**Tabbed Detail Section:**
- **Band-wise tab** (default) — expandable accordion per band showing:
  - Student list with completion status, score, accuracy per student
  - Pending vs completed count
- **Questions tab** — grouped by band, showing per-question success rate (reuse the accuracy band pattern from exam results)

### Mock Data Shape

```typescript
interface PracticeSessionDetail {
  session: PracticeSession; // existing
  bandDetails: {
    key: string;
    label: string;
    students: { id: string; name: string; completed: boolean; accuracy: number; score: number; maxScore: number }[];
    questions: { id: string; text: string; topic: string; difficulty: string; successRate: number }[];
  }[];
}
```

Deterministic mock generation using the session ID as seed, cached via Map.

