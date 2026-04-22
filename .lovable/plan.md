

# Fix Student Copilot Mock Data Seeding

## Problem

The current mock data seeding silently fails because thread/artifact IDs use non-UUID strings (e.g., `"t-mock-doubt-001"`) but all database columns are `uuid` type. The `localStorage` flag gets set even when inserts fail, so subsequent loads skip seeding entirely. Additionally, no `student_attempts` data is seeded, so the mastery pipeline has no data, and the `student_topic_mastery` view may not exist.

## Plan

### 1. Create `student_topic_mastery` database view (migration)

Run a migration to create the SQL view that aggregates `student_attempts` into mastery data:

```sql
CREATE OR REPLACE VIEW student_topic_mastery AS
SELECT student_id, subject, topic,
  COUNT(*) AS attempts,
  ROUND(100.0 * SUM(CASE WHEN correct THEN 1 ELSE 0 END) / COUNT(*)) AS accuracy,
  MAX(created_at) AS last_attempt_at,
  CASE
    WHEN ROUND(100.0 * SUM(CASE WHEN correct THEN 1 ELSE 0 END) / COUNT(*)) >= 80 THEN 'mastery_ready'
    WHEN ROUND(100.0 * SUM(CASE WHEN correct THEN 1 ELSE 0 END) / COUNT(*)) >= 65 THEN 'stable'
    WHEN ROUND(100.0 * SUM(CASE WHEN correct THEN 1 ELSE 0 END) / COUNT(*)) >= 40 THEN 'reinforcement'
    ELSE 'foundational_risk'
  END AS band
FROM student_attempts
WHERE subject IS NOT NULL AND topic IS NOT NULL
GROUP BY student_id, subject, topic;
```

### 2. Rewrite `src/data/student/copilotMockData.ts`

Replace all hardcoded string IDs with valid UUIDs (deterministic, using a fixed set of UUIDs). Keep all content structures identical but ensure:

- All `id`, `thread_id`, `artifact_id` values are valid UUIDs
- Add `MOCK_ATTEMPTS` array with ~30 `student_attempts` rows across Physics/Chemistry/Math/Biology topics (matching the doc's Part 9 seed data)
- Add `MOCK_EXAMS` array with 2 upcoming exams
- Ensure practice session `questions` content matches what `PracticeSessionView` expects (field: `question` not `prompt`)

### 3. Rewrite `src/components/student/copilot/seedCopilotData.ts`

Fix the seeder logic:

- Only set `localStorage` flag AFTER all inserts succeed (move it inside try, after all inserts)
- If any insert errors, do NOT set the flag so it retries next load
- Add seeding for `student_attempts` (for mastery data)
- Add seeding for `student_exams` (for exam prep context)
- Clear the old localStorage key (`copilot_mock_seeded_v1`) so existing users re-seed with fixed data

### 4. Update `StudentCopilotPage.tsx`

- After seeding, ensure `fetchTopicMastery` works against the new `student_topic_mastery` view
- The existing `useEffect` already calls `seedCopilotDataIfNeeded()` before fetches -- no structural change needed, just ensure the new seed key triggers a re-seed

### Files Changed

| File | Action |
|------|--------|
| `src/data/student/copilotMockData.ts` | Rewrite -- use valid UUIDs, add attempts + exams data |
| `src/components/student/copilot/seedCopilotData.ts` | Rewrite -- fix error handling, add attempts/exams seeding |
| Database migration | Create `student_topic_mastery` view |

