# theDonutAI — Pricing vs Product Gap Analysis

> **Last Updated:** April 2026
> **Purpose:** Feature-by-feature audit of every pricing line item against the current codebase
> **Scope:** Essentials, Accelerate, Elevate tiers + Consumables/Add-ons (Silver Striker excluded)

---

## Executive Summary

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Fully Built | 1 | 2% |
| 🟡 Partially Built | 16 | 36% |
| 🔧 Built Differently | 2 | 5% |
| ❌ Not Built | 25 | 57% |
| **Total Features Audited** | **44** | **100%** |

### Bottom Line

The product has **extensive UI scaffolding** across all portals — dashboards, reports, exam flows, timetables, content libraries, and AI generation dialogs all exist. However, almost everything runs on **mock data with no database persistence**. The three cross-cutting gaps that affect every tier are:

1. **No real authentication** — login pages exist but do not use Supabase Auth
2. **No database persistence** — all CRUD operations use in-memory mock data
3. **No WhatsApp integration** — referenced in pricing but zero implementation

---

## How to Read This Document

| Label | Meaning |
|-------|---------|
| ✅ **Fully Built** | End-to-end working. UI + backend + data persistence all functional. |
| 🟡 **Partially Built** | UI exists but incomplete — typically missing database persistence, backend logic, or a key sub-feature. |
| 🔧 **Built Differently** | Similar functionality exists but works differently from what the pricing describes. |
| ❌ **Not Built** | Feature does not exist in the codebase at all. |

Each feature row includes:
- **What Exists** — specific files, components, and flows found in the codebase
- **What Is Missing** — gaps that must be closed before the feature matches the pricing promise

---

## Tier 1: Essentials — ₹2,00,000/year

> *Go digital. No complexity.*

### School Management

| # | Feature | Status | What Exists | What Is Missing |
|---|---------|--------|-------------|-----------------|
| 1 | **Principal, teacher, student logins** | 🟡 Partially Built | `Login.tsx` general login page exists. `StudentLogin.tsx` exists with a student-specific flow. Role-based routing exists (`/superadmin`, `/institute`, `/teacher`, `/student` routes). | No real authentication — all logins are mock navigation. No Supabase Auth integration. No principal-specific login (principal maps to institute admin). No password reset, email verification, or session management. |
| 2 | **Batch and class management** | 🟡 Partially Built | `InstituteBatches.tsx` with batch listing, filtering, and detail views. `BatchDetail.tsx` shows students, subjects, timetable per batch. CRUD dialogs exist for create/edit. | All data is mock (`mockData.ts`). No database tables for batches. No real create/update/delete operations. No class vs section hierarchy. |
| 3 | **Timetable management** | 🟡 Partially Built | Extensive timetable system: `TimetableSetup.tsx` (constraint definition), `TimetableGrid.tsx` (visual grid), `TimetableWorkspace.tsx` (drag-and-drop scheduling), `SubstitutionManager.tsx` (teacher substitution). | All mock data. No database persistence. No conflict validation backend. No integration with real teacher/batch data. |
| 4 | **Student and teacher profiles** | 🟡 Partially Built | `StudentProfile.tsx` with academic history, performance charts. `TeacherSchedule.tsx`, teacher listing pages. Student360 comprehensive profile view. | Mock data only. No profile CRUD against database. No photo upload. No parent contact details management. |
| 5 | **Result entry and report cards** | 🟡 Partially Built | `StudentReportCard.tsx` with PDF and image export (using `jspdf` and `html2canvas`). Report card displays subject-wise marks, grades, remarks. | No result **entry** UI — results come from mock exam data only. No manual marks input form. No term-wise result compilation. No report card template customization. |
| 6 | **WhatsApp communication (pay-as-you-go)** | ❌ Not Built | Nothing. Zero WhatsApp references anywhere in the codebase. | Everything — WhatsApp Business API integration, message templates, credit bucket system, send/receive flow, delivery tracking, contact management. |

### Manual Test Creation — Unlimited

| # | Feature | Status | What Exists | What Is Missing |
|---|---------|--------|-------------|-----------------|
| 7 | **Build tests from question bank** | 🟡 Partially Built | Question bank exists at SuperAdmin (`QuestionBankManagement.tsx`) and Institute level. Exam creation flow (`CreateExam.tsx`) with question picker, pattern definition, section setup. Question types: MCQ, subjective, fill-in-blank. | No database persistence. Questions are hardcoded in mock data. No real question CRUD. No tagging/filtering by chapter, topic, difficulty against real curriculum data. |
| 8 | **Unlimited tests per term** | 🟡 Partially Built | No quota restrictions in the UI — exam creation is open-ended. | No database to track test count. No term concept implemented. Mock data only. |
| 9 | **Assign to any batch or section** | 🟡 Partially Built | Batch assignment step exists in `CreateExam.tsx` flow. Batch selector dropdown present. | Mock assignment only — no database write. No section-level granularity. No scheduling (date/time assignment). |
| 10 | **Scoring and result entry** | 🟡 Partially Built | `TestPlayer.tsx` auto-scores MCQ answers in real-time. Score summary shown at end of test. `TestResults.tsx` displays detailed results with question-wise breakdown. | Auto-scoring is client-side only (not persisted). No manual scoring for subjective questions. No teacher-side result entry interface. No partial marking support. |

### Reports and Analytics

| # | Feature | Status | What Exists | What Is Missing |
|---|---------|--------|-------------|-----------------|
| 11 | **Batch-wise performance analytics** | 🟡 Partially Built | `BatchReport.tsx` with batch health cards, subject-wise breakdown, performance distribution charts. `BatchHealthCard.tsx` shows pass rate, average score, at-risk count. | All mock data. No database-backed analytics. No real exam result aggregation. |
| 12 | **Subject-level breakdown** | 🟡 Partially Built | Subject health cards exist in reports. Chapter-wise breakdown in `ChapterReport.tsx`. Topic mastery indicators present. | Mock data. No real subject-to-exam-result mapping. |
| 13 | **Student-level detailed reports** | 🟡 Partially Built | `StudentReport.tsx`, `Student360Profile.tsx` with comprehensive student view — performance trend, subject radar, exam history, behavioral tags. | Mock data. No database queries. No real student performance tracking over time. |
| 14 | **Principal overview dashboard** | 🟡 Partially Built | `InstituteDashboard.tsx` with KPI cards (total students, teachers, batches), recent activity feed, quick actions. | Mock data. No real-time metrics. No database aggregation queries. |

---

## Tier 2: Accelerate — ₹699/student/year (min 500)

> *Give every teacher an AI co-pilot.*

### AI Test and Question Creation — Unlimited

| # | Feature | Status | What Exists | What Is Missing |
|---|---------|--------|-------------|-----------------|
| 15 | **AI-generated test papers — unlimited** | 🟡 Partially Built | Edge function `assessment-ai` exists, calls Lovable AI gateway (Gemini). Supports `generate_questions` and `generate_homework` actions. `AIQuestions.tsx` at SuperAdmin level provides UI for AI generation with subject, chapter, difficulty, question type inputs. | Generated questions display in UI but are **not persisted to database**. No "create full test paper" flow — generates individual questions only. No template/format selection (half-yearly, unit test, etc.). |
| 16 | **AI-generated questions — unlimited** | 🟡 Partially Built | Same as above — the edge function generates questions based on parameters. Teacher-level AI question generation also exists. | No persistence. No review/edit before adding to question bank. No bulk generation. |
| 17 | **Topic, difficulty, format controls** | 🟡 Partially Built | AI generation UI includes: subject selector, chapter selector, difficulty level (Easy/Medium/Hard), question type (MCQ/Short/Long), count selector. | Chapter/topic data is mock. No real curriculum-linked topic hierarchy. Difficulty distribution is a simple selector, not a smart distribution algorithm. |
| 18 | **PDF → Test (upload past papers)** | 🟡 Partially Built | `UploadPDF.tsx` exists at SuperAdmin and Institute level. Two-step flow: Step 1 — classify PDF (exam type, subject, class). Step 2 — upload file. File upload UI with drag-and-drop. | **No actual PDF parsing backend.** Upload shows a mock success toast. No OCR, no question extraction, no AI-powered paper digitization. The entire backend pipeline is missing. |

### Teacher Intelligence

| # | Feature | Status | What Exists | What Is Missing |
|---|---------|--------|-------------|-----------------|
| 19 | **Pre-class brief — objectives, key focus areas** | ❌ Not Built | Nothing. No pre-class preparation feature. | Full feature — AI-generated brief before each class based on curriculum plan, previous class outcomes, student performance data. Delivery mechanism (in-app or WhatsApp). |
| 20 | **Post-assessment insights — why students failed** | ❌ Not Built | Nothing. No AI analysis of exam results. | Full feature — AI analysis of exam results identifying common failure patterns, misconception detection, topic-wise weakness mapping, actionable recommendations for teachers. |
| 21 | **Auto-grading and one-click report cards** | 🟡 Partially Built | MCQ auto-scoring exists in `TestPlayer.tsx` (client-side). Report card export exists via `StudentReportCard.tsx` with PDF/image download. | No subjective answer grading. No AI-assisted grading. "One-click" report card requires manual data — not auto-generated from exam results. No bulk report card generation for entire batch. |
| 22 | **Student band grouping within batch** | ✅ Fully Built | `StudentBuckets.tsx` implements PI-based student bucketing with 4 bands: Mastery Ready (PI ≥ 80), Stable (60-79), Reinforcement (40-59), Foundational Risk (PI < 40). Includes behavioral tags, visual indicators, and group-level insights. | Feature is complete in UI with sophisticated logic. **Note:** Currently runs on mock data — will need database-backed PI scores for production. |
| 23 | **Personalized homework for each classroom** | 🟡 Partially Built | `AIHomeworkGeneratorDialog.tsx` generates homework using the `assessment-ai` edge function with `generate_homework` action. Supports subject, chapter, difficulty, question count parameters. | Generated homework is **not persisted**. No assignment to specific batches/classrooms. No submission tracking. No deadline management. No student-facing homework view linked to this generation. |

### Offline Digitization — Homework and Class Tests

| # | Feature | Status | What Exists | What Is Missing |
|---|---------|--------|-------------|-----------------|
| 24 | **Homework photo → AI evaluation** | ❌ Not Built | Nothing. No photo upload for homework. | Full feature — camera/gallery upload, image preprocessing, AI-powered answer extraction, evaluation against answer key, score generation, feedback. |
| 25 | **Class test scan → AI evaluation** | ❌ Not Built | Nothing. No scan-to-evaluate pipeline. | Full feature — bulk scan upload, student identification, answer sheet processing, AI grading, result compilation. |
| 26 | **Teacher approval before result is shared** | ❌ Not Built | Nothing. No approval workflow. | Approval queue UI, review/edit capability, approve/reject actions, notification to students upon approval. |
| 27 | **Direct feedback mode for low-stakes work** | ❌ Not Built | Nothing. No feedback-only mode. | Mode toggle (graded vs feedback-only), AI-generated qualitative feedback, no score/grade — just comments and suggestions. |
| 28 | **Detailed reports for offline assessments** | ❌ Not Built | Nothing. No offline assessment tracking. | Report generation from digitized assessments, trend tracking across offline tests, comparison with online test performance. |

### Principal Intelligence

| # | Feature | Status | What Exists | What Is Missing |
|---|---------|--------|-------------|-----------------|
| 29 | **Morning pulse report via WhatsApp** | ❌ Not Built | Nothing. No scheduled reports. No WhatsApp integration. | Full feature — daily automated report generation, WhatsApp Business API integration, scheduled delivery (morning), content: attendance summary, today's exams, pending tasks, alerts. |
| 30 | **Batch and class-level analytics** | 🟡 Partially Built | Report components exist (see Essentials #11-12). | Mock data. Same gap as Essentials analytics. |
| 31 | **At-risk student flags** | 🔧 Built Differently | At-risk indicators appear within `BatchHealthCard.tsx` (count of at-risk students) and `StudentReport.tsx` (performance warnings). PI-based bucketing identifies "Foundational Risk" students. | **Differs from pricing promise:** Not a standalone alert/flag system. No proactive notifications. No early warning triggers. No configurable thresholds. It's embedded within reports, not surfaced as actionable alerts to principals. |
| 32 | **Structured reports — read and review** | 🟡 Partially Built | Multiple report views exist (batch, chapter, student, exam reports). Export capability (PDF/image). | Mock data. No database-backed report generation. No saved/archived reports. |

### Quotas & Limits (Accelerate)

| # | Feature | Status | What Exists | What Is Missing |
|---|---------|--------|-------------|-----------------|
| 33 | **PDF → Test: 10,000 pages/year quota** | ❌ Not Built | No quota tracking system. | Quota counter, usage tracking, limit enforcement, usage dashboard, warning notifications near limit. |
| 34 | **Offline evaluation: 15,000 pages/year quota** | ❌ Not Built | No offline evaluation exists, so no quota needed yet. | Depends on offline digitization being built first. Then: quota tracking, enforcement, usage analytics. |

---

## Tier 3: Elevate — ₹1,499/student/year (min 1,000)

> *The whole school, running smarter.*

### Conversational Analytics — Principal and Teacher *(ELEVATE ONLY)*

| # | Feature | Status | What Exists | What Is Missing |
|---|---------|--------|-------------|-----------------|
| 35 | **Natural language query interface** | ❌ Not Built | Nothing. No conversational UI. | Full feature — chat interface for principals/teachers, natural language to database query translation, AI-summarized responses, context-aware follow-ups. Covers: results, homework, syllabus coverage, student performance. |
| 36 | **AI-summarized insights to WhatsApp** | ❌ Not Built | Nothing. | WhatsApp delivery of AI-generated insights. Requires both conversational analytics engine AND WhatsApp integration. |

### Topper Focus — Tools for Performance Excellence *(ELEVATE ONLY)*

| # | Feature | Status | What Exists | What Is Missing |
|---|---------|--------|-------------|-----------------|
| 37 | **Identify and track top 10% performers** | 🔧 Built Differently | `PerformanceComparison.tsx` in student test results shows topper vs student vs class average comparison. Leaderboard exists in student compete mode. | **Differs from pricing:** Current implementation shows topper data per-exam, not as a persistent tracking system. No cross-batch topper identification. No historical tracking. No "top 10%" cohort management. |
| 38 | **Topper performance reports, challenge content, olympiad tracking** | ❌ Not Built | Nothing beyond per-exam topper score display. | Dedicated topper dashboard, progress/consistency reports, advanced challenge question sets, olympiad/competitive exam readiness metrics, principal view of batch-level topper production. |

### Content Support and Classroom Projection *(ELEVATE ONLY)*

| # | Feature | Status | What Exists | What Is Missing |
|---|---------|--------|-------------|-----------------|
| 39 | **Upload PPTs, PDFs, videos + platform content** | 🟡 Partially Built | `ContentLibrary.tsx` at Institute level with upload UI (supports PPT, PDF, video). AI content generation dialog exists. Content listing with filters. | Mock upload — files are not actually stored (no Supabase Storage integration). No real content management backend. AI-generated content is not persisted. |
| 40 | **Project on classroom smartboards** | ❌ Not Built | Nothing. No projection/presentation mode. | Full-screen presentation mode, smartboard-optimized layout, content sequencing, teacher controls (next/previous/annotate), device casting support. |

### Custom Branding *(ELEVATE ONLY)*

| # | Feature | Status | What Exists | What Is Missing |
|---|---------|--------|-------------|-----------------|
| 41 | **School name and logo across platform** | ❌ Not Built | `instituteTiers` in `mockData.ts` lists "Custom Branding" as a tier feature checkbox. But no actual branding system exists. | Logo upload, color scheme customization, branding preview, enforcement across all portal pages, branded PDF exports, branded login page. |

### Personalized Homework

| # | Feature | Status | What Exists | What Is Missing |
|---|---------|--------|-------------|-----------------|
| 42 | **Per individual student (Elevate level)** | ❌ Not Built | Current homework generation (`AIHomeworkGeneratorDialog`) is classroom-level — all students get the same set. | Individual student gap analysis, per-student question selection based on weak topics, personalized difficulty calibration, student-specific homework delivery. |

### Quotas & Limits (Elevate)

| # | Feature | Status | What Exists | What Is Missing |
|---|---------|--------|-------------|-----------------|
| — | **PDF → Test: 30,000 pages/year** | ❌ Not Built | Same as Accelerate #33 — no quota system. | Same requirements, higher limit. |
| — | **Offline evaluation: 50,000 pages/year** | ❌ Not Built | Same as Accelerate #34. | Same requirements, higher limit. |

---

## Consumables / Add-Ons

| # | Feature | Status | What Exists | What Is Missing |
|---|---------|--------|-------------|-----------------|
| 43 | **WhatsApp messaging — credit bucket** | ❌ Not Built | Nothing. | WhatsApp Business API, credit purchase flow, balance tracking, message type pricing (utility vs marketing vs service), usage dashboard, low-balance alerts. |
| 44 | **PDF → Test top-up (5,000 pages/pack)** | ❌ Not Built | No quota system exists. | Pack purchase flow, quota increment logic, purchase history, admin controls. |
| — | **Offline evaluation top-up (10,000 pages/pack)** | ❌ Not Built | No offline evaluation exists. | Same as above, dependent on offline digitization feature. |

---

## Priority Gaps — What Must Be Built for Launch

### Tier 1 (Essentials) — Launch Blockers

These are non-negotiable for any paying customer:

| Priority | Gap | Impact |
|----------|-----|--------|
| 🔴 P0 | **Real authentication** (Supabase Auth with role-based access) | Nothing works without real login |
| 🔴 P0 | **Database persistence** (all CRUD operations) | No data survives a page refresh |
| 🔴 P0 | **Result entry UI** (teacher enters marks manually) | Core promise of "result entry and report cards" |
| 🟠 P1 | **WhatsApp integration** (at least basic messaging) | Listed in Essentials pricing |
| 🟠 P1 | **Report cards from real data** (not mock) | Must work end-to-end with entered results |

### Tier 2 (Accelerate) — Key Differentiators

These justify the per-student pricing:

| Priority | Gap | Impact |
|----------|-----|--------|
| 🔴 P0 | **AI question persistence** (save generated questions to DB) | AI generation works but output is lost |
| 🔴 P0 | **PDF → Test backend** (actual PDF parsing + question extraction) | Upload UI exists but does nothing |
| 🟠 P1 | **Offline digitization pipeline** (photo → AI evaluation) | 5 features depend on this not existing |
| 🟠 P1 | **Pre-class brief + post-assessment insights** | Core "teacher intelligence" promise |
| 🟡 P2 | **Homework persistence + assignment flow** | AI generates but doesn't save or assign |

### Tier 3 (Elevate) — Premium Differentiators

These justify the 2× price jump:

| Priority | Gap | Impact |
|----------|-----|--------|
| 🟠 P1 | **Conversational analytics** | Flagship Elevate feature — "ask anything, get an answer" |
| 🟠 P1 | **Individual-level personalized homework** | Key differentiator from Accelerate |
| 🟡 P2 | **Topper focus dashboard** | Unique selling point for competitive schools |
| 🟡 P2 | **Custom branding** | Expected at premium tier |
| 🟡 P2 | **Smartboard projection mode** | Nice-to-have but mentioned in pricing |

---

## Cross-Cutting Gaps

These affect **every tier** and must be resolved before any feature can truly be "Fully Built":

### 1. Authentication & Authorization

- **Current state:** Login pages exist but use mock navigation (`navigate('/teacher/dashboard')`)
- **Required:** Supabase Auth integration with email/password + Google OAuth, role-based access control, session management, protected routes, password reset flow
- **Files affected:** `Login.tsx`, `StudentLogin.tsx`, all route guards, every data-fetching component

### 2. Database Persistence

- **Current state:** All data comes from `mockData.ts` (1,500+ lines of hardcoded data)
- **Required:** Supabase tables for: users, institutes, batches, students, teachers, subjects, chapters, questions, exams, exam_results, homework, content, timetables, academic_schedules
- **Impact:** Every "Partially Built" feature becomes "Fully Built" only after this migration

### 3. WhatsApp Integration

- **Current state:** Zero implementation
- **Required:** WhatsApp Business API (via provider like Gupshup/Twilio), message templates, credit tracking, delivery status webhooks
- **Impact:** Essentials tier promises this; Accelerate/Elevate build on it (morning pulse, AI insights delivery)

### 4. File Storage

- **Current state:** Upload UIs exist but files go nowhere
- **Required:** Supabase Storage buckets for: profile photos, content library (PPTs/PDFs/videos), homework submissions (photos), exam papers (PDFs)
- **Impact:** Content Library, PDF→Test, Offline Digitization, Custom Branding (logo upload)

### 5. Quota & Usage Tracking

- **Current state:** No tracking system
- **Required:** Usage counters per institute (PDF pages consumed, offline evaluations consumed), quota enforcement middleware, usage dashboards, top-up purchase flow
- **Impact:** Accelerate and Elevate quota limits, all consumable add-ons

---

## Summary: What "Launch Ready" Looks Like

For **Essentials** to be sellable:
- ✅ Real authentication with role-based access
- ✅ Database-backed batch, student, teacher management
- ✅ Working timetable with persistence
- ✅ Manual test creation → assign → student takes test → results saved
- ✅ Result entry + report card generation from real data
- ✅ Basic WhatsApp messaging (at minimum, result notifications)
- ✅ Dashboard with real metrics

For **Accelerate** to be sellable (on top of Essentials):
- ✅ AI-generated questions persisted to question bank
- ✅ PDF upload → actual parsing → test auto-creation
- ✅ At least one offline digitization flow (homework photo → evaluation)
- ✅ Pre-class brief and post-assessment insights
- ✅ Morning pulse report to principal (WhatsApp or in-app)
- ✅ Quota tracking and enforcement

For **Elevate** to be sellable (on top of Accelerate):
- ✅ Conversational analytics (natural language → insights)
- ✅ Individual-level personalized homework
- ✅ Topper tracking dashboard
- ✅ Custom branding (logo + school name)
- ✅ Content projection mode for smartboards
