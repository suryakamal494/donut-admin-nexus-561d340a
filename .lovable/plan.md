
# PYP Exam Testing: Intra-Login (SuperAdmin) + Inter-Login (Cross-Portal) Workflows

## What We Are Doing

Creating two sets of comprehensive workflow test cases for the Previous Year Paper (PYP) exam flow:

1. **Intra-login test** (added to SuperAdmin intra-login file): End-to-end PYP creation, editing, preview, and validation workflow within the SuperAdmin portal
2. **Inter-login test** (rewrite the existing exam-tests.md file): Complete cross-portal PYP flow from SuperAdmin creation through Institute assignment to Student attempt and Teacher/Institute report viewing

Both will follow the workflow-based format (not smoke test format) with Steps and Checkpoints.

---

## Where These Tests Will Be Added

| Test Type | File Location | Doc Browser Path |
|-----------|--------------|------------------|
| Intra-Login (SuperAdmin PYP) | `docs/06-testing-scenarios/intra-login-tests/superadmin.md` | `/docs/06-testing-scenarios/intra-login-tests/superadmin` |
| Inter-Login (Exam Flow) | `docs/06-testing-scenarios/inter-login-tests/exam-tests.md` | `/docs/06-testing-scenarios/inter-login-tests/exam-tests` |

---

## Part 1: SuperAdmin Intra-Login -- PYP Workflow Tests

These will be added as a **new section** in `superadmin.md` between the existing "Question Bank -> Exams" section and "Content Library -> Exams" section. Test IDs will be renumbered accordingly.

### New Section: "Previous Year Paper -- End-to-End Creation Workflow"

| Test ID | Workflow | Precondition | Steps and Checkpoints | Expected Result |
|---------|----------|--------------|---------------------|-----------------|
| SA-IL-031 | PYP creation and PDF extraction workflow | None | 1. Go to Exams, click "Create Previous Year Paper". 2. Select exam type (JEE Main) -- verify JEE Main, JEE Advanced, NEET options available. 3. Select year and session -- verify paper name auto-generates (e.g., "JEE Main 2025 - January Session"). 4. Customize the paper name if needed -- verify editable. 5. Proceed to Upload step. 6. Upload a PDF file -- verify only PDF accepted, max 50MB enforced. 7. Click "Upload and Create Test" -- verify upload completes and success confirmation shown. 8. Click "Review and Configure" -- verify redirected to Review page with questions extracted. 9. Verify questions are grouped by subjects (Physics, Chemistry, Mathematics for JEE Main). 10. Verify section structure matches exam pattern -- Section A (MCQ) and Section B (Numerical) for JEE Main. 11. Verify marking scheme is correct: +4/-1 for MCQ, +4/0 for Numerical. | Complete PYP creation flow works end-to-end: exam config, PDF upload, question extraction with correct pattern, sections, and marking |
| SA-IL-032 | PYP review and question validation workflow | PYP created and in review state | 1. Open the PYP review page. 2. Navigate between subjects using subject tabs -- verify question counts shown per subject. 3. Use Quick Navigation panel -- verify all question numbers visible and clickable. 4. Click a question number -- verify jumps to correct page. 5. Open a question -- verify question text, options, correct answer marked (green), chapter and topic shown. 6. Click "Show Solution" -- verify solution text displayed. 7. Click "Edit" on a question -- verify edit dialog opens with pre-filled data. 8. Modify question text, save -- verify status changes to "Edited" (orange). 9. Click "Delete" on a question -- verify status changes to "Deleted" (red, greyed out). 10. Click "Mark Reviewed" on a pending question -- verify status changes to "Reviewed" (green). 11. Verify progress badge on subject tabs updates (reviewed/total count). | Complete question review workflow functions: navigation, solution viewing, editing, deleting, and marking reviewed all work with correct status tracking |
| SA-IL-033 | PYP pattern verification across exam types | PYPs for JEE Main, JEE Advanced, and NEET created | 1. Open a JEE Main PYP -- verify 3 subjects (Physics, Chemistry, Mathematics), no sub-sections within subjects, Section A (20 MCQ, +4/-1) and Section B (10 Numerical, +4/0), total 90 questions, 300 marks. 2. Open a JEE Advanced PYP -- verify 3 subjects (Physics, Chemistry, Mathematics), each subject has multiple sections (Paper 1 and Paper 2 style), mix of single-choice, multi-choice, paragraph, and numerical, total 54 questions, 198 marks. 3. Open a NEET PYP -- verify 4 subjects (Physics, Chemistry, Botany, Zoology), Section A (35 MCQ) and Section B (15 MCQ, attempt any 10), total 180 questions (200 with Section B extras), 720 marks. | Each exam type follows its official pattern with correct subject splits, section structures, question types, and marking schemes |
| SA-IL-034 | PYP publish and audience assignment workflow | PYP reviewed and ready to publish | 1. On the review page, click "Publish Test" -- verify publish confirmation dialog appears. 2. Confirm publish -- verify test status changes to "Published" and redirected to exam listing. 3. Verify the published PYP appears in the listing under the correct exam type and year accordion. 4. Verify Rank and Percentile config section is available for PYPs. 5. Click "Audience" on the published PYP -- verify audience selection dialog opens. 6. Select specific institutes -- verify selected institutes listed. 7. Select "All Institutes" -- verify all institutes selected. 8. Save audience -- verify audience count displayed on the PYP card. | PYP can be published, listed correctly by exam type and year, rank/percentile configured, and audience assigned to specific or all institutes |
| SA-IL-035 | PYP edit and draft management | Published and draft PYPs exist | 1. Open a draft PYP -- verify edit and delete options available. 2. Open a published PYP -- verify view and audience options available but edit of questions is restricted. 3. View PYP stats (if completed) -- verify stats button works. 4. Verify draft PYPs are not visible to institutes. 5. Verify only published PYPs appear in institute view. | Draft PYPs are editable but hidden from institutes; published PYPs are view-only for questions but allow audience and schedule management |

### Renumbering Impact

Current SA-IL-029 to SA-IL-035 will shift to SA-IL-036 to SA-IL-040. Total count goes from 35 to 40.

---

## Part 2: Inter-Login -- PYP Exam Flow (Rewrite exam-tests.md)

The existing `exam-tests.md` has scattered smoke-test-style rows. It will be **completely rewritten** in the workflow format with two major sections:

1. **PYP End-to-End Flow** (cross-portal)
2. **Grand Test End-to-End Flow** (cross-portal, already partially covered -- will be rewritten in workflow format)

### PYP Inter-Login Workflow Tests

| Test ID | Workflow | Login | Precondition | Steps and Checkpoints | Expected Result |
|---------|----------|-------|--------------|---------------------|-----------------|
| EX-001 | PYP creation to institute visibility | SuperAdmin then Institute | PYP created and published in SuperAdmin | **SuperAdmin:** 1. Create PYP (JEE Main 2025). 2. Upload PDF, review questions, publish. 3. Click Audience, assign to Institute A and Institute B. **Institute A:** 4. Login as Institute A admin. 5. Go to Exams, Previous Year Papers tab. 6. Verify the JEE Main 2025 PYP is visible. 7. Verify year-wise accordion grouping matches SuperAdmin (2025, 2024, etc.). 8. Verify PYP is read-only -- no edit or delete buttons. **Institute B:** 9. Login as Institute B admin. 10. Verify the same PYP is visible. **Unassigned Institute C:** 11. Login as Institute C admin. 12. Verify the PYP is NOT visible. | PYP is visible only to assigned institutes, read-only, with correct year grouping |
| EX-002 | Institute PYP preview and content consistency | Institute | PYP assigned to institute | 1. Go to Previous Year Papers. 2. Click View on a PYP. 3. Verify preview page loads with subject tabs (Physics, Chemistry, Mathematics for JEE Main). 4. Navigate between subjects -- verify question counts match SuperAdmin's version. 5. Verify section structure preserved (Section A MCQ, Section B Numerical). 6. Verify marking scheme matches (+4/-1 MCQ, +4/0 Numerical). 7. Verify math formulas (LaTeX) render correctly. 8. Verify images display properly. 9. Verify solutions are viewable. 10. Check pagination works for navigating through questions. | Institute preview shows identical content to SuperAdmin: same questions, sections, marking, and all rich content (math, images) renders correctly |
| EX-003 | Institute assigns PYP to student batches | Institute then Student | PYP visible in institute | **Institute:** 1. Click Assign on the PYP. 2. Verify batch selection dialog opens. 3. Select Batch A and Batch B. 4. Save. **Student in Batch A:** 5. Login as student. 6. Go to Tests page. 7. Verify the PYP appears in the Grand Tests and PYPs tab. 8. Verify exam pattern filter works (filter by JEE Main shows the PYP). **Student in Batch B:** 9. Verify same PYP visible. **Student in Batch C (not assigned):** 10. Verify PYP is NOT visible. | PYP appears for students in assigned batches only, with correct pattern filtering |
| EX-004 | Student takes PYP exam end-to-end | Student | PYP assigned to student's batch | 1. Go to Tests, find the PYP. 2. Click Start -- verify instruction page displays with exam name, duration, total questions, marking scheme. 3. Verify correct exam UI loads based on pattern: JEE Main loads NTA-style interface, JEE Advanced loads IIT-style interface, NEET loads NTA NEET interface. 4. Verify subjects displayed in the player match the exam pattern (Physics, Chemistry, Mathematics for JEE/NEET adds Biology). 5. Navigate to a question -- verify question text, options render correctly. 6. Verify math formulas (LaTeX) render in the test player. 7. Verify images load and display properly. 8. Select an answer -- verify option highlights. 9. Navigate to next question using Next button -- verify navigation works. 10. Navigate to previous question -- verify back navigation works (if allowed by pattern). 11. Switch between subjects using subject tabs -- verify smooth transition. 12. Mark a question for review -- verify flag indicator appears on the question number in the palette. 13. Open question palette -- verify all question statuses shown (answered, not answered, marked for review, not visited). 14. Verify timer is running and displays correct remaining time. 15. Clear a response -- verify answer deselected. 16. Answer all questions, click Submit -- verify submission confirmation dialog shows summary (answered, unanswered, marked counts). 17. Confirm submission -- verify exam submits successfully. | Complete exam-taking experience works: instructions, pattern-specific UI, question display (text, math, images), navigation, subject switching, mark for review, timer, and submission |
| EX-005 | PYP results and reporting across portals | Student, Teacher, Institute | Student has submitted PYP | **Student:** 1. After submission, verify results page opens. 2. Verify score is calculated correctly based on marking scheme (+4/-1). 3. Verify question-by-question breakdown available -- showing correct/incorrect/unanswered per question. **Teacher (subject-specific):** 4. Login as a teacher assigned to Physics for the batch. 5. Go to Exam Results. 6. Verify only Physics results for this PYP are visible (not Chemistry or Mathematics). 7. Verify student scores for Physics section listed. 8. Verify score distribution chart and analytics available for Physics. **Institute:** 9. Login as institute admin. 10. Verify complete test report visible with all subjects. 11. Verify batch-level performance analytics (average score, top performers). 12. Verify individual student drill-down available. | Results flow correctly to all stakeholders: student sees full results, teacher sees only their subject, institute sees complete aggregate analytics |

### Grand Test Inter-Login Workflow Tests

| Test ID | Workflow | Login | Precondition | Steps and Checkpoints | Expected Result |
|---------|----------|-------|--------------|---------------------|-----------------|
| EX-006 | Grand Test creation to institute visibility | SuperAdmin then Institute | None | **SuperAdmin:** 1. Create Grand Test (JEE Main pattern). 2. Add questions (AI or Question Bank). 3. Configure schedule (date and time). 4. Click Audience, assign to specific institutes. **Institute:** 5. Login as assigned institute. 6. Verify GT visible with correct schedule date/time. 7. Verify GT is read-only (no edit/delete). **Unassigned Institute:** 8. Verify GT not visible. | GT visible only to assigned institutes, read-only, with schedule displayed |
| EX-007 | Grand Test schedule controls student access | SuperAdmin, Institute, Student | GT assigned to institute, institute assigned to batch | **Future schedule:** 1. SA sets GT schedule for tomorrow. 2. Student logs in -- verify "Available at [date/time]" shown, Start button disabled. 3. Verify countdown timer displayed. **Schedule arrives:** 4. SA changes schedule to current time. 5. Student refreshes -- verify Start button becomes active. **Past schedule:** 6. GT with past schedule -- verify student can start immediately. | Schedule controls exam access: disabled before time, enabled after, countdown shown for near-future |
| EX-008 | Grand Test student attempt and results | Student, Teacher, Institute | GT available and schedule active | Same as EX-004 flow but for Grand Test: student takes test, submits, results flow to student/teacher/institute with same verification points. | Complete GT exam-taking and result-reporting works identically to PYP flow |

### Exam Content Consistency Tests

| Test ID | Workflow | Login | Precondition | Steps and Checkpoints | Expected Result |
|---------|----------|-------|--------------|---------------------|-----------------|
| EX-009 | Question count and structure consistency across portals | SuperAdmin, Institute, Student | Published exam with sections | 1. SA creates exam with 75 questions across 3 subjects. 2. Institute previews -- verify exactly 75 questions, same 3 sections. 3. Student opens in test player -- verify same question count and section structure. 4. Verify marking scheme consistent across all views (+4/-1). | Question count, section structure, and marking are identical across all portals |
| EX-010 | Rich content rendering across portals | SuperAdmin, Institute, Student | Exam with LaTeX and images | 1. SA creates exam with LaTeX formulas and image-based questions. 2. Institute previews -- verify formulas and images render. 3. Student opens in test player -- verify same rendering on both mobile and desktop. | Math formulas and images display correctly across all portals and devices |

### Question Permission Tests

| Test ID | Workflow | Login | Precondition | Steps and Checkpoints | Expected Result |
|---------|----------|-------|--------------|---------------------|-----------------|
| EX-011 | Question permission boundaries across portals | SuperAdmin, Institute, Teacher | Questions exist at different levels | 1. SA creates global questions -- verify Institute sees with "Global" badge (read-only). 2. Institute creates questions -- verify Teacher sees with "Institute" badge (read-only). 3. Teacher creates questions -- verify only that teacher sees them. 4. Verify editing is blocked for non-owned questions at each level. | Question visibility follows hierarchy: global is read-only downstream, institute is read-only for teachers, teacher questions are private |

---

## Files Modified

| File | Action |
|------|--------|
| `docs/06-testing-scenarios/intra-login-tests/superadmin.md` | Add new "Previous Year Paper" section (5 workflow tests), renumber SA-IL-031 to SA-IL-040 |
| `docs/06-testing-scenarios/inter-login-tests/exam-tests.md` | Complete rewrite in workflow format with PYP flow, GT flow, consistency, and permissions (11 workflow tests replacing 75 smoke tests) |

## Summary

| Area | Before | After |
|------|--------|-------|
| SuperAdmin intra-login total | 35 tests | 40 tests (+5 PYP workflows) |
| Inter-login exam tests | 75 scattered smoke tests | 11 comprehensive workflow tests (same coverage, better readability) |
| Format | Mixed smoke/atomic | Consistent workflow with Steps and Checkpoints |
