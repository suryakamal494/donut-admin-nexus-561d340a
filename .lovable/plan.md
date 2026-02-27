

## Understanding Your Requirement

You want to replace the current per-band "Generate Practice" buttons with a **single "Generate Practice" button** at the Student Performance Buckets card header level. When clicked, it should NOT open the generic homework dialog. Instead, it opens a **custom multi-band practice generation flow**:

1. **Input Step** — Teacher optionally adds instructions (common or per-band)
2. **Generation** — AI generates up to 10 questions per band (4 bands = up to 40 questions), using chapter context (weak topics, student issues) as automatic prompt context
3. **Review Step** — Teacher reviews generated questions organized by band tabs/sections. They can accept or skip individual bands
4. **Assign** — Creates up to 4 separate practice assignments, one per band, sent only to students in that band

## My Reasoning

**Your approach is correct.** Here's why:

- **Per-band buttons are redundant.** The teacher has to click 4 times, fill 4 forms, review 4 times. That's 12+ interactions for what should be 1 flow.
- **Single button, multi-band output is the right pattern.** The AI already knows the chapter context, weak topics, and which students are in which band. One click should produce all 4 practice sets.
- **NOT reusing the generic homework dialog is correct.** The homework dialog is designed for general-purpose homework creation. This flow is context-aware — it automatically pulls chapter data, topic weaknesses, and student groupings. Different purpose, different UI.
- **10-question limit per band is practical.** Practice should be focused, not exhaustive. 10 questions per band keeps it digestible for students.
- **Optional per-band instructions are important.** A teacher might want "focus on numerical problems" for the risk band but "include challenging derivations" for mastery. But making instructions optional (with smart defaults from the AI) keeps it low-friction.

## Implementation Plan

### New Component: `ChapterPracticeGenerator`
A multi-step dialog/drawer component with 3 steps:

**Step 1 — Configure (compact form)**
- Shows which bands have students (skip empty bands)
- Common instructions textarea (applies to all bands)
- Expandable per-band instruction overrides (optional)
- Question count selector (5 or 10 per band)
- "Generate Practice" button

**Step 2 — Review (tabbed by band)**
- Tab for each non-empty band (color-coded)
- Each tab shows the generated questions (question text, options, difficulty)
- Teacher can remove individual questions
- "Regenerate" button per band if unsatisfied
- "Assign All" or per-band "Assign" buttons

**Step 3 — Confirmation**
- Summary: "4 practice sets created, assigned to X students"
- Toast notification

### Files to Create/Modify

| File | Change |
|---|---|
| `src/components/teacher/reports/ChapterPracticeGenerator.tsx` | **New** — Multi-step dialog with configure → review → assign flow |
| `src/components/teacher/reports/StudentBuckets.tsx` | Remove per-band Generate Practice buttons. Add single "Generate Practice" button in CardHeader. Accept `onGeneratePractice` as a simple `() => void` callback (no bucket param) |
| `src/pages/teacher/ChapterReport.tsx` | Remove `handleGeneratePractice` per-bucket logic. Replace `AIHomeworkGeneratorDialog` with `ChapterPracticeGenerator`. Pass chapter context (topics, buckets, subject) to the new component |
| `supabase/functions/generate-chapter-practice/index.ts` | **New** — Edge function that calls Lovable AI to generate band-specific practice questions. Accepts chapter context + per-band instructions, returns structured questions per band |

### Edge Function Design
The edge function receives:
```json
{
  "chapter": "Kinematics",
  "subject": "Physics",
  "bands": [
    { "key": "mastery", "label": "Mastery Ready", "studentCount": 5, "instructions": "...", "questionCount": 10, "context": "Strong in all topics, challenge them" },
    { "key": "risk", "label": "Foundational Risk", "studentCount": 3, "instructions": "...", "questionCount": 10, "context": "Weak in: Projectile Motion, Relative Motion" }
  ],
  "topics": [{ "name": "Projectile Motion", "status": "weak", "avgSuccessRate": 38 }, ...]
}
```
Returns structured questions per band using tool calling for reliable JSON output.

