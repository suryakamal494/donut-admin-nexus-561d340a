# Exam Cross-Portal Workflow Tests

> End-to-end workflow tests for exam and question flow across SuperAdmin, Institute, Teacher, and Student portals.

---

## Overview

These tests verify the complete exam lifecycle across portals -- from creation in SuperAdmin through institute assignment, student attempt, and result reporting. Each test is a workflow with numbered Steps and Checkpoints, not isolated smoke checks. The two primary flows are Previous Year Papers (PYP) and Grand Tests (GT).

---

## PYP End-to-End Flow

### EX-001: PYP Creation to Institute Visibility

| Field | Detail |
|-------|--------|
| **Logins** | SuperAdmin → Institute |
| **Precondition** | PYP created and published in SuperAdmin |

**Steps and Checkpoints:**

**SuperAdmin:**
1. Create PYP (JEE Main 2025).
2. Upload PDF, review questions, publish.
3. Click Audience, assign to Institute A and Institute B.

**Institute A:**
4. Login as Institute A admin.
5. Go to Exams, Previous Year Papers tab.
6. Verify the JEE Main 2025 PYP is visible.
7. Verify year-wise accordion grouping matches SuperAdmin (2025, 2024, etc.).
8. Verify PYP is read-only -- no edit or delete buttons.

**Institute B:**
9. Login as Institute B admin.
10. Verify the same PYP is visible.

**Unassigned Institute C:**
11. Login as Institute C admin.
12. Verify the PYP is NOT visible.

**Expected Result:** PYP is visible only to assigned institutes, read-only, with correct year grouping.

---

### EX-002: Institute PYP Preview and Content Consistency

| Field | Detail |
|-------|--------|
| **Login** | Institute |
| **Precondition** | PYP assigned to institute |

**Steps and Checkpoints:**

1. Go to Previous Year Papers.
2. Click View on a PYP.
3. Verify preview page loads with subject tabs (Physics, Chemistry, Mathematics for JEE Main).
4. Navigate between subjects -- verify question counts match SuperAdmin's version.
5. Verify section structure preserved (Section A MCQ, Section B Numerical).
6. Verify marking scheme matches (+4/-1 MCQ, +4/0 Numerical).
7. Verify math formulas (LaTeX) render correctly.
8. Verify images display properly.
9. Verify solutions are viewable.
10. Check pagination works for navigating through questions.

**Expected Result:** Institute preview shows identical content to SuperAdmin: same questions, sections, marking, and all rich content (math, images) renders correctly.

---

### EX-003: Institute Assigns PYP to Student Batches

| Field | Detail |
|-------|--------|
| **Logins** | Institute → Student |
| **Precondition** | PYP visible in institute |

**Steps and Checkpoints:**

**Institute:**
1. Click Assign on the PYP.
2. Verify batch selection dialog opens.
3. Select Batch A and Batch B.
4. Save.

**Student in Batch A:**
5. Login as student.
6. Go to Tests page.
7. Verify the PYP appears in the Grand Tests and PYPs tab.
8. Verify exam pattern filter works (filter by JEE Main shows the PYP).

**Student in Batch B:**
9. Verify same PYP visible.

**Student in Batch C (not assigned):**
10. Verify PYP is NOT visible.

**Expected Result:** PYP appears for students in assigned batches only, with correct pattern filtering.

---

### EX-004: Student Takes PYP Exam End-to-End

| Field | Detail |
|-------|--------|
| **Login** | Student |
| **Precondition** | PYP assigned to student's batch |

**Steps and Checkpoints:**

1. Go to Tests, find the PYP.
2. Click Start -- verify instruction page displays with exam name, duration, total questions, marking scheme.
3. Verify correct exam UI loads based on pattern: JEE Main loads NTA-style interface, JEE Advanced loads IIT-style interface, NEET loads NTA NEET interface.
4. Verify subjects displayed in the player match the exam pattern (Physics, Chemistry, Mathematics for JEE; NEET adds Biology).
5. Navigate to a question -- verify question text, options render correctly.
6. Verify math formulas (LaTeX) render in the test player.
7. Verify images load and display properly.
8. Select an answer -- verify option highlights.
9. Navigate to next question using Next button -- verify navigation works.
10. Navigate to previous question -- verify back navigation works (if allowed by pattern).
11. Switch between subjects using subject tabs -- verify smooth transition.
12. Mark a question for review -- verify flag indicator appears on the question number in the palette.
13. Open question palette -- verify all question statuses shown (answered, not answered, marked for review, not visited).
14. Verify timer is running and displays correct remaining time.
15. Clear a response -- verify answer deselected.
16. Answer all questions, click Submit -- verify submission confirmation dialog shows summary (answered, unanswered, marked counts).
17. Confirm submission -- verify exam submits successfully.

**Expected Result:** Complete exam-taking experience works: instructions, pattern-specific UI, question display (text, math, images), navigation, subject switching, mark for review, timer, and submission.

---

### EX-005: PYP Results and Reporting Across Portals

| Field | Detail |
|-------|--------|
| **Logins** | Student → Teacher → Institute |
| **Precondition** | Student has submitted PYP |

**Steps and Checkpoints:**

**Student:**
1. After submission, verify results page opens.
2. Verify score is calculated correctly based on marking scheme (+4/-1).
3. Verify question-by-question breakdown available -- showing correct/incorrect/unanswered per question.

**Teacher (subject-specific):**
4. Login as a teacher assigned to Physics for the batch.
5. Go to Exam Results.
6. Verify only Physics results for this PYP are visible (not Chemistry or Mathematics).
7. Verify student scores for Physics section listed.
8. Verify score distribution chart and analytics available for Physics.

**Institute:**
9. Login as institute admin.
10. Verify complete test report visible with all subjects.
11. Verify batch-level performance analytics (average score, top performers).
12. Verify individual student drill-down available.

**Expected Result:** Results flow correctly to all stakeholders: student sees full results, teacher sees only their subject, institute sees complete aggregate analytics.

---

## Grand Test End-to-End Flow

### EX-006: Grand Test Creation to Institute Visibility

| Field | Detail |
|-------|--------|
| **Logins** | SuperAdmin → Institute |
| **Precondition** | None |

**Steps and Checkpoints:**

**SuperAdmin:**
1. Create Grand Test (JEE Main pattern).
2. Add questions (AI or Question Bank).
3. Configure schedule (date and time).
4. Click Audience, assign to specific institutes.

**Institute:**
5. Login as assigned institute.
6. Verify GT visible with correct schedule date/time.
7. Verify GT is read-only (no edit/delete).

**Unassigned Institute:**
8. Verify GT not visible.

**Expected Result:** GT visible only to assigned institutes, read-only, with schedule displayed.

---

### EX-007: Grand Test Schedule Controls Student Access

| Field | Detail |
|-------|--------|
| **Logins** | SuperAdmin → Institute → Student |
| **Precondition** | GT assigned to institute, institute assigned to batch |

**Steps and Checkpoints:**

**Future schedule:**
1. SA sets GT schedule for tomorrow.
2. Student logs in -- verify "Available at [date/time]" shown, Start button disabled.
3. Verify countdown timer displayed.

**Schedule arrives:**
4. SA changes schedule to current time.
5. Student refreshes -- verify Start button becomes active.

**Past schedule:**
6. GT with past schedule -- verify student can start immediately.

**Expected Result:** Schedule controls exam access: disabled before time, enabled after, countdown shown for near-future.

---

### EX-008: Grand Test Student Attempt and Results

| Field | Detail |
|-------|--------|
| **Logins** | Student → Teacher → Institute |
| **Precondition** | GT available and schedule active |

**Steps and Checkpoints:**

Same as EX-004 flow but for Grand Test: student takes test, submits, results flow to student/teacher/institute with the same verification points as EX-005.

**Expected Result:** Complete GT exam-taking and result-reporting works identically to PYP flow.

---

## Exam Content Consistency Tests

### EX-009: Question Count and Structure Consistency Across Portals

| Field | Detail |
|-------|--------|
| **Logins** | SuperAdmin → Institute → Student |
| **Precondition** | Published exam with sections |

**Steps and Checkpoints:**

1. SA creates exam with 75 questions across 3 subjects.
2. Institute previews -- verify exactly 75 questions, same 3 sections.
3. Student opens in test player -- verify same question count and section structure.
4. Verify marking scheme consistent across all views (+4/-1).

**Expected Result:** Question count, section structure, and marking are identical across all portals.

---

### EX-010: Rich Content Rendering Across Portals

| Field | Detail |
|-------|--------|
| **Logins** | SuperAdmin → Institute → Student |
| **Precondition** | Exam with LaTeX and images |

**Steps and Checkpoints:**

1. SA creates exam with LaTeX formulas and image-based questions.
2. Institute previews -- verify formulas and images render.
3. Student opens in test player -- verify same rendering on both mobile and desktop.

**Expected Result:** Math formulas and images display correctly across all portals and devices.

---

## Question Permission Tests

### EX-011: Question Permission Boundaries Across Portals

| Field | Detail |
|-------|--------|
| **Logins** | SuperAdmin → Institute → Teacher |
| **Precondition** | Questions exist at different levels |

**Steps and Checkpoints:**

1. SA creates global questions -- verify Institute sees with "Global" badge (read-only).
2. Institute creates questions -- verify Teacher sees with "Institute" badge (read-only).
3. Teacher creates questions -- verify only that teacher sees them.
4. Verify editing is blocked for non-owned questions at each level.

**Expected Result:** Question visibility follows hierarchy: global is read-only downstream, institute is read-only for teachers, teacher questions are private.

---

## Test Execution Order

1. PYP End-to-End Flow (EX-001 to 005)
2. Grand Test End-to-End Flow (EX-006 to 008)
3. Exam Content Consistency (EX-009 to 010)
4. Question Permissions (EX-011)

---

*Last Updated: February 2026*
