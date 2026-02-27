

## Implementation: Phase 3 Gap Fix + Phase 4

### Gap Fix: Pre-fill AIHomeworkGeneratorDialog from bucket context

**Problem**: The "Generate Practice" button on ChapterReport opens the AI Homework Generator but passes zero context — no chapter name, batch, subject, or weak topics. The dialog opens blank.

**Fix**:
1. **Add optional `prefill` prop to `AIHomeworkGeneratorDialog`** — a new interface `AIHomeworkPrefill` with fields: `title`, `subject`, `batchId`, `instructions` (containing weak topics).
2. **In `AIHomeworkGeneratorDialog`**: When `prefill` is provided and dialog opens, use it to set initial `formData` values instead of defaults.
3. **In `ChapterReport.tsx`**: Track which bucket was clicked. Build prefill object: title = `"[ChapterName] Practice — [BandLabel]"`, subject from chapter data, batchId from URL, instructions = `"Focus on weak topics: [list of weak topic names]"`. Pass to dialog.

### Phase 4: Homework Generation from Buckets — Full Flow

**What this does**: Completes the data-to-action loop. Teacher sees student buckets → taps "Generate Practice" → dialog opens pre-filled with context → AI generates tailored homework → teacher reviews/edits → assigns with one tap.

**Implementation steps**:

1. **Add `AIHomeworkPrefill` type** to `src/components/teacher/ai-homework/types.ts`
   - Fields: `title?: string`, `subject?: string`, `batchId?: string`, `instructions?: string`

2. **Update `AIHomeworkGeneratorDialog` props and reset logic**
   - Add `prefill?: AIHomeworkPrefill` prop
   - In the `useEffect` that runs when `open` changes: if opening with prefill, merge prefill into formData instead of resetting to defaults

3. **Update `ChapterReport.tsx`**
   - Add state: `selectedBucketKey` to track which bucket's "Generate Practice" was clicked
   - Build prefill object from chapter data + weak topics + bucket info
   - Pass prefill to `AIHomeworkGeneratorDialog`

4. **Add a context banner in `AIHomeworkForm`**
   - When the dialog is opened with prefill context, show a small teal banner at the top: "Pre-filled from: Kinematics · Reinforcement Needed · 3 weak topics" — so the teacher knows the form is contextually loaded
   - Add optional `contextBanner?: string` prop to `AIHomeworkForm`

### Files to modify

| File | Change |
|------|--------|
| `src/components/teacher/ai-homework/types.ts` | Add `AIHomeworkPrefill` interface |
| `src/components/teacher/AIHomeworkGeneratorDialog.tsx` | Accept `prefill` prop, use it on open |
| `src/components/teacher/ai-homework/AIHomeworkForm.tsx` | Add optional context banner |
| `src/pages/teacher/ChapterReport.tsx` | Build and pass prefill from bucket click |

