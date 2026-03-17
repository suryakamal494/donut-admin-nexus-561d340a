

## Plan: Generate Developer Guide Document

I'll create a comprehensive developer guide as a downloadable Markdown file at `/mnt/documents/AI_Question_Generation_Developer_Guide.md`. This document will contain:

1. **Problem statement** — why the current flat prompt produces inconsistent questions
2. **The two files to create** — `prompt-definitions.ts` (difficulty scales, cognitive definitions, question type formats) and `prompt-builder.ts` (dynamic assembler)
3. **Edge function update** — how to add `generate_questions` action to `assessment-ai/index.ts`
4. **Frontend wiring** — replacing the `setTimeout` mock in both `AIQuestions.tsx` pages with real edge function calls
5. **Full example** — showing exactly what the assembled prompt looks like for "CBSE Class 10 Physics, medium+hard, analytical+numerical, 5 questions"
6. **Testing instructions** — curl command to test the edge function directly
7. **Files summary table** — what to create, what to update

This is a single document generation task — no UI changes needed.

### Also: Fix 4 TypeScript build errors

The `NodeJS.Timeout` errors in 4 files need fixing by changing to `ReturnType<typeof setTimeout>`:
- `src/components/academic-schedule/SortableChapterCell.tsx` line 71
- `src/components/academic-schedule/month-plan-grid/ChapterCell.tsx` line 53
- `src/components/teacher/lesson-workspace/AnnotationCanvas.tsx` line 38
- `src/hooks/useTestSessionPersistence.ts` line 34

