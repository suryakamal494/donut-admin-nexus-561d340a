

## Plan: Exam Distribution & Reporting QA — Narrative Scenario Guide

### Overview

Create a comprehensive, intern-friendly QA testing guide at `docs/06-testing-scenarios/inter-login-tests/exam-distribution-qa.md`. This replaces the existing checklist-style `exam-tests.md` with narrative scenarios in the same style as `curriculum-scope-qa.md` — detailed descriptions, failure reasoning, and "why this matters" context so interns with no platform knowledge can execute confidently.

**Delivered in two phases** to avoid compromising depth.

---

### Phase 1 — Distribution & Visibility (~400 lines)

Covers the upstream half: creation, sharing, assignment, and access control.

**Sections:**

1. **Before You Begin**
   - Domain glossary (PYP, Grand Test, Audience, Batch Assignment, Schedule, Pattern)
   - Where to find things in the UI (SuperAdmin Exams, Institute Exams tab, Student Tests page)
   - Prerequisites (3 test institutes, 3+ batches per institute, teachers with subject assignments, student accounts per batch)

2. **How Exam Distribution Works** — narrative + ASCII diagram of the full chain: SuperAdmin creates → shares to Institutes via Audience → Institute assigns to Batches → Students see in Tests → Results flow back up

3. **Group A — SuperAdmin to Institute: PYP Distribution** (~12 scenarios)
   - A1: PYP shared with Institute A and B — Institute C must not see it. Detailed description of how to create PYP, use the Audience panel, and what to verify at each institute login
   - A2: Two PYPs with different audience splits (A+B vs A+C) — verify each institute sees only their assigned papers, not the other
   - A3: PYP shared with all institutes — universal visibility
   - A4: PYP initially shared with A+B, then B is removed from audience — verify it disappears from B's exam list, remains in A
   - A5: Read-only enforcement — institute cannot edit, delete, or modify SuperAdmin PYPs. Describe what buttons should be absent
   - A6: Content consistency — question count, sections, marking scheme, LaTeX, images match exactly between SuperAdmin and Institute preview
   - A7: Year-wise grouping — PYPs from 2023, 2024, 2025 should appear in correct accordion groups at institute level
   - A8: Curriculum scoping — a JEE PYP should not appear in an institute that only has NEET curriculum (failure scenario)
   - A9: Duplicate sharing — what happens if SuperAdmin shares the same PYP to Institute A twice? Should not create duplicates
   - A10: Empty audience — PYP created but shared with zero institutes. No institute should see it
   - A11: PYP with zero questions published — should the system allow sharing? Verify error handling
   - A12: Multiple PYPs, same year, different patterns (JEE Main + JEE Advanced 2025) — both should appear separately

4. **Group B — SuperAdmin to Institute: Grand Test Distribution** (~10 scenarios)
   - B1-B4: Mirror A1-A4 patterns but for Grand Tests
   - B5: Schedule display — GT with future date shows correct date/time at institute, read-only
   - B6: Multiple GTs with different schedules assigned to same institute — verify all show with correct individual schedules
   - B7: GT shared to institute but institute has no matching curriculum — should it still appear? (failure/edge scenario)
   - B8: GT created without schedule — verify how institute sees it (no date vs error)
   - B9: GT audience changed after institute already assigned it to batches — does batch assignment survive?
   - B10: Two GTs, same pattern, same date, different times — verify they appear as distinct entries

5. **Group C — Institute to Student: Batch Assignment** (~12 scenarios)
   - C1: PYP assigned to Batch A only — students in B and C must not see it. Detailed login-by-login verification
   - C2: Same PYP assigned to Batch A and B — both see it, Batch C does not
   - C3: PYP assigned to all batches — universal student visibility within institute
   - C4: Two PYPs, one to Batch A, another to Batch B — each batch sees only their assigned paper
   - C5: PYP unassigned from Batch A after students already saw it — verify it disappears from their Tests page
   - C6: GT with future schedule assigned to batch — student sees it with countdown/disabled Start
   - C7: GT schedule arrives — student refreshes, Start button becomes active
   - C8: GT with past schedule — student can start immediately
   - C9: Same GT assigned to batches across two institutes — verify complete isolation (Institute A students cannot see Institute B's batch data)
   - C10: Batch with no exams assigned — Tests page should show empty state, not error
   - C11: Student added to batch AFTER exam was assigned — does the new student see the exam?
   - C12: Student moved from Batch A to Batch B — loses Batch A exams, gains Batch B exams

6. **Group D — Student Test Attempt** (~10 scenarios)
   - D1: Full happy path — instructions page, pattern-specific UI (JEE/NEET), question display, navigation, subject tabs, timer, submission
   - D2: Student in non-assigned batch tries to access exam URL directly — should be blocked
   - D3: Timer expiry — what happens when time runs out mid-exam? Auto-submit with whatever is answered
   - D4: Mark for review — verify palette shows correct status colors (answered, unanswered, marked, not visited)
   - D5: Clear response — answer a question, clear it, verify it reverts to unanswered status
   - D6: Submit with unanswered questions — confirmation dialog should show counts
   - D7: Browser refresh during exam — does the student lose progress or resume?
   - D8: Student tries to take same exam twice — should be blocked after first submission
   - D9: Network disconnection during exam — verify graceful error handling
   - D10: LaTeX and images render correctly in test player on both mobile and desktop

---

### Phase 2 — Results, Reporting & Edge Cases (~300 lines)

Covers the downstream half: what happens after submission.

**Sections:**

7. **Group E — Results & Role-Based Reporting** (~12 scenarios)
   - E1: Student sees full results immediately — score, question-by-question breakdown, correct/incorrect/unanswered
   - E2: Score calculation accuracy — verify marking scheme (+4/-1 for MCQ, +4/0 for numerical) applied correctly
   - E3: Physics teacher sees only Physics section results for the batch — Chemistry and Math sections must not appear
   - E4: Two teachers (Physics, Chemistry) for same batch, same exam — each sees only their subject
   - E5: Teacher assigned to multiple batches — sees results per batch, scoped to their subject
   - E6: Teacher with no students who attempted — should see empty state, not error
   - E7: Institute sees complete aggregate report — all subjects, all students, batch-level analytics
   - E8: Institute drills down to individual student — sees full per-question breakdown
   - E9: Institute with multiple batches — can compare batch performance side by side
   - E10: Results for PYP vs GT — verify both report types work identically
   - E11: Student who didn't attempt — how do they appear in teacher/institute reports? (absent vs 0 score)
   - E12: Partial submission (timer expired with unanswered questions) — verify results correctly show unanswered as zero marks, not negative

8. **Group F — Cross-Cutting & Edge Scenarios** (~10 scenarios)
   - F1: Full end-to-end — SuperAdmin creates GT, shares to 2 institutes, each assigns to different batches, students take it, results flow to all stakeholders
   - F2: Same PYP shared to two institutes — Institute A assigns to Batch X, Institute B assigns to Batch Y — verify complete data isolation in reports
   - F3: Multiple exam types in same batch — PYP + GT + institute-created exam — student sees all three, correctly categorized in tabs
   - F4: SuperAdmin modifies PYP questions after institute already assigned it — does the update propagate?
   - F5: Institute-created exam (not from SuperAdmin) — verify same batch assignment and reporting flow works
   - F6: Exam with mixed question types (MCQ + numerical + subjective) — verify each type renders and scores correctly
   - F7: Large-scale scenario — 50 students, 3 subjects, 75 questions — verify no performance degradation in results
   - F8: Concurrent access — two students from same batch start the same GT simultaneously — verify no data conflicts
   - F9: Exam assigned to batch, then batch curriculum is changed — does the exam assignment survive?
   - F10: Complete negative test — student from Institute A tries every possible way to access Institute B's exam (direct URL, API manipulation concept) — must be blocked

9. **Quick Reference Matrix** — Table showing what each role can do, can see, and must NOT see

10. **What "Working Correctly" Looks Like** — 6-7 bullet summary of the core invariants

---

### File

| File | Action |
|------|--------|
| `docs/06-testing-scenarios/inter-login-tests/exam-distribution-qa.md` | Create — Phase 1 + Phase 2 in a single file |

Single documentation file. No code changes, no UI impact.

