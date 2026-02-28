

## Docs Audit — Teacher Reports Module

### Audit Summary

After thorough comparison of the three docs (`reports-chapters.md`, `reports-exams.md`, `reports-students.md`) against the actual codebase, the documentation is **largely accurate and comprehensive**. The key structures, data flows, components, routes, PI formulas, band thresholds, and homework generation flows are all correctly documented.

### Gaps Identified

The gaps are minor and relate to implementation details that evolved during recent iterations:

---

#### Gap 1: Reports Landing Page Not Documented

**Missing**: The `/teacher/reports` landing page (`Reports.tsx`) — the batch selection grid — is not documented anywhere. It shows batch cards with class average, trend, at-risk count, and exam count. This is the entry point to the entire Reports module.

**Fix**: Add a new section at the top of `reports-chapters.md` (or create a brief "Reports Overview" preamble) documenting the landing page: route, batch card data points (className, batchName, totalStudents, classAverage, trend, atRiskCount, totalExamsConducted), card colors, and navigation behavior.

---

#### Gap 2: Practice Review — Regenerate Feature Underdocumented

**Current docs**: Mention "Remove individual questions (toggle — can restore)" in Step 2 (Review).

**Missing**: The **Regenerate** button that replaces removed questions with new ones (`handleRegenerate` in `ChapterPracticeReview.tsx`). The docs say questions can be "restored" but the actual implementation has a "Regenerate" action that fetches replacement questions for deleted ones, distinct from simply un-toggling removal.

**Fix**: Update the Review step section in `reports-chapters.md` to document the Regenerate feature: button placement, behavior (replaces removed questions with fresh ones via `getReplacementQuestions`), and toast feedback.

---

#### Gap 3: Practice Session Detail — Question Card Solution Toggle

**Current docs**: Show question text, topic badge, difficulty badge, success rate, and attempts.

**Missing**: The **"View Solution" toggle** on each question card that reveals answer options with the correct answer highlighted in emerald, plus the red/amber background tint on low-accuracy questions. This is documented in the memory but not in the actual markdown file for the Questions tab within Practice Session Detail.

**Fix**: Update Section 4c (Questions Tab) in `reports-chapters.md` to document: "View Solution" toggle, options display with correct answer highlighted, left-border color coding by success rate, and background tint for <35% questions.

---

#### Gap 4: AI Homework Generator — Context Source Types

**Current docs (reports-students.md)**: Document the `AIHomeworkPrefill` fields (subject, batchId, instructions, contextBanner).

**Missing**: The `AIHomeworkGeneratorDialog` supports **context sources** — Content Library picker, Lesson Plan picker, and document upload — via `ContextSourceSelector`. The dialog has been refactored into sub-components (`AIHomeworkForm`, `AIHomeworkPreview`, `AIHomeworkActions`) under `src/components/teacher/ai-homework/`. These context sources (document, content, lesson_plan) are passed to the `assessment-ai` edge function.

**Fix**: Add a subsection under Location 3 in `reports-students.md` documenting: context source types (Content Library, Lesson Plan, Document Upload), the refactored component structure, and how context flows to the edge function.

---

#### Gap 5: Edge Function — Context Support in assessment-ai

**Current docs**: The `assessment-ai` edge function is referenced but its context support (`contextType`, `contextContent`, `customInstructions`) for homework generation is not documented.

**Fix**: Add a brief "Edge Function Payload" subsection in `reports-students.md` (under Generate Homework) showing the full request body structure including `contextType`, `contextContent`, and `customInstructions` fields.

---

### Implementation Plan

**Phase 1**: Update `reports-chapters.md`
- Add Reports Landing Page section (batch grid, card data, navigation)
- Update Practice Review Step 2 with Regenerate feature
- Update Practice Session Detail Questions Tab with View Solution toggle and visual styling

**Phase 2**: Update `reports-students.md`
- Add Context Source documentation under Location 3 (Student Profile → Generate Homework)
- Add edge function payload structure for `assessment-ai` with context fields
- Document the refactored component structure (`ai-homework/` subdirectory)

**Phase 3**: Minor touch-ups
- Update `reports-exams.md` if any edge cases found during implementation
- Verify all "Last Updated" dates are set to current month

**Files modified**: 
- `docs/03-teacher/reports-chapters.md`
- `docs/03-teacher/reports-students.md`

