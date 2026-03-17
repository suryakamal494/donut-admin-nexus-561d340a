

# Corrected Developer Guide — AI Question Generation

## What's Being Done

Regenerating the developer guide document (`AI_Question_Generation_Developer_Guide.md`) with all 6 audit issues fixed:

### 🔴 Critical Fixes (3)

1. **Deno dynamic import → static import**: The `import()` inside the switch case will fail in Deno. Will show a static `import` at the top of `assessment-ai/index.ts`.

2. **`req.body` access pattern → destructure from parsed body**: The existing edge function already does `const { action, topic, ... } = await req.json()`. The guide will show the new fields (`curriculum`, `classLevel`, `difficulties`, `cognitiveTypes`, `topics`, `questionTypes`) destructured from the same parsed body — not accessed via `req.body`.

3. **Empty array guard**: Add fallback defaults at the top of `buildQuestionGenerationPrompt()`:
   ```
   if (!difficulties.length) difficulties = ["medium"];
   if (!cognitiveTypes.length) cognitiveTypes = ["conceptual"];
   ```

### 🟡 Important Fixes (3)

4. **Metadata self-reporting → server-side computation**: Instead of asking the AI to fill `difficultyDistribution` in the response, compute it server-side by counting the `difficulty` field across the returned questions array after parsing.

5. **SuperAdmin review route confirmed**: The route `/superadmin/questions/review` exists (`ReviewQuestions.tsx`) but currently reads from mock data, not from navigation state. The guide will instruct the developer to either (a) pass generated questions via `navigate` state and read them in `ReviewQuestions`, or (b) render results inline on the AI page (safer default — the Institute page already does this).

6. **Timeout guard**: Add an `AbortController` with 30s timeout on the frontend `supabase.functions.invoke` calls, and a loading state timeout fallback.

### Document Structure

The regenerated guide will have these sections:
1. Problem Statement (unchanged)
2. Architecture Overview (unchanged)
3. File 1: `prompt-definitions.ts` (unchanged)
4. File 2: `prompt-builder.ts` — with empty array guards added
5. File 3: `assessment-ai/index.ts` — with static import, proper destructuring from parsed body, and server-side metadata computation
6. File 4-5: Frontend wiring — with timeout guard and inline results rendering recommendation
7. Full assembled prompt example (unchanged)
8. Testing curl command (unchanged)
9. **NEW Section**: Audit checklist — a table of all 6 issues and their fixes for developer reference

No codebase changes — this is a document-only task written to `/mnt/documents/AI_Question_Generation_Developer_Guide_v2.md`.

