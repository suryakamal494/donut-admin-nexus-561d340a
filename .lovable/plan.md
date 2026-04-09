

## Plan: Pricing vs Product Gap Analysis Document

### What You Asked For

A detailed feature-by-feature audit of every item in the 3-tier pricing (Essentials, Accelerate, Elevate + Add-ons) mapped against the current codebase — classifying each as Fully Built, Partially Built, Built Differently, or Not Built — with specific notes on what exists and what is missing.

### What You Will Get

A markdown document at `docs/07-product-audit/pricing-feature-gap-analysis.md` with a table-driven format covering every single feature line item from the pricing. Plus a navigation entry in the docs sidebar.

### Summary of Findings (from codebase audit)

Here is what I found after scanning the entire codebase:

**Essentials Tier:**
- **Logins (Principal/Teacher/Student)** — Partially Built. Login pages exist for Student and a general Login page, but there is no real authentication (mock navigation only, no Supabase Auth integration). No principal-specific login.
- **Batch and Class Management** — Partially Built. Institute batch pages exist with CRUD UI, but all data is mock (no database persistence).
- **Timetable Management** — Partially Built. Extensive timetable UI exists (setup, grid, workspace, substitution) but runs on mock data.
- **Student and Teacher Profiles** — Partially Built. Profile pages exist for both roles with mock data.
- **Result Entry and Report Cards** — Partially Built. Report card export exists (StudentReportCard component with PDF/image export), but result *entry* is not built — results come from mock exam data only.
- **WhatsApp Communication** — Not Built. Zero WhatsApp references in the codebase.
- **Manual Test Creation (Unlimited)** — Partially Built. Question bank exists at SuperAdmin and Institute level. Exam creation flows exist (CreateExam, question bank picker). But no database persistence — all mock.
- **Assign to Batch** — Partially Built. Batch assignment UI exists in exam flows but is mock-driven.
- **Scoring and Result Entry** — Partially Built. Student test player exists with auto-scoring for MCQ. Manual scoring/result entry does not exist.
- **Reports and Analytics** — Partially Built. Extensive report components exist (BatchReport, ChapterReport, StudentReport, Student360 profile, subject health cards, student bucketing with PI logic). All mock data. No real database-backed analytics.

**Accelerate Tier:**
- **AI Test Generation (Unlimited)** — Partially Built. Edge function `assessment-ai` exists and calls Lovable AI gateway. UI for AI question generation exists at both SuperAdmin (`AIQuestions.tsx`) and Teacher level. However, generated questions are not persisted to database.
- **AI Question Generation (Unlimited)** — Same as above — the edge function supports it.
- **PDF → Test** — Partially Built. `UploadPDF.tsx` exists at both SuperAdmin and Institute level with a 2-step flow (classify → upload). But the actual PDF extraction/parsing backend is not implemented — it shows a success mock.
- **Pre-class Brief** — Not Built. No pre-class brief feature found.
- **Post-assessment Insights** — Not Built. No "why students failed" AI analysis found.
- **Auto-grading** — Partially Built. MCQ auto-scoring exists in test player. No grading for subjective/written answers.
- **One-click Report Cards** — Partially Built. Export dropdown with PDF/image exists for Student360 profile. Not a true "one-click" generation from exam results.
- **Student Band Grouping** — Built. `StudentBuckets` component with PI-based bucketing (Mastery Ready, Stable, Reinforcement, Foundational Risk) and behavioral tags exists.
- **Personalized Homework per Classroom** — Partially Built. AI homework generator exists (`AIHomeworkGeneratorDialog`, `assessment-ai` edge function with homework action). Creates homework content but does not persist or assign to students in database.
- **Homework Photo → AI Evaluation** — Not Built. No photo upload or offline digitization.
- **Class Test Scan → AI Evaluation** — Not Built.
- **Teacher Approval before Result Shared** — Not Built.
- **Direct Feedback Mode** — Not Built.
- **Offline Assessment Reports** — Not Built.
- **Morning Pulse Report (WhatsApp)** — Not Built.
- **At-risk Student Flags** — Partially Built. At-risk indicators appear in reports UI (BatchHealthCard, report cards) but not as a standalone alert/flag system.
- **Principal Dashboard** — Partially Built. Institute Dashboard page exists with mock data.

**Elevate Tier:**
- **Conversational Analytics** — Not Built. No natural language query interface exists.
- **Topper Focus Tools** — Partially Built. Topper comparison exists in student test results (PerformanceComparison component shows topper vs student vs class average). But no dedicated topper tracking dashboard, olympiad readiness, or challenge content system.
- **Content Support / Classroom Projection** — Partially Built. Content Library exists at Institute level (upload PPTs, PDFs, videos + AI generation). No smartboard/projection mode.
- **Custom Branding** — Not Built. Custom branding exists as a tier feature definition in mockData but no actual branding customization UI or enforcement.
- **Personalized Homework per Individual Student** — Not Built. Current homework is classroom-level only.

**Add-ons / Consumables:**
- **WhatsApp Messaging (credit bucket)** — Not Built.
- **PDF → Test Top-up** — Not Built (no quota tracking system).
- **Offline Evaluation Top-up** — Not Built (no offline evaluation exists).

### File Changes

| File | Action |
|------|--------|
| `docs/07-product-audit/pricing-feature-gap-analysis.md` | Create — Full gap analysis with per-feature tables |
| `src/data/docsNavigation.ts` | Add navigation entry for new doc |

### Document Structure

1. **Executive Summary** — Quick counts (X fully built, Y partial, Z not built)
2. **How to Read This Document** — Legend for status labels
3. **Tier 1: Essentials** — Table with every feature, status, and detailed notes on what exists/what is missing
4. **Tier 2: Accelerate** — Same format
5. **Tier 3: Elevate** — Same format
6. **Consumables / Add-ons** — Same format
7. **Priority Gaps** — Top items that need building for launch readiness
8. **Cross-cutting Gaps** — Authentication, database persistence, WhatsApp integration (affects all tiers)

No code logic changes. Documentation only.

