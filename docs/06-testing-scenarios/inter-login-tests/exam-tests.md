# Exam Cross-Portal Tests

> Tests for exam and question flow across SuperAdmin, Institute, Teacher, and Student portals.

---

## Overview

These tests verify that exams and questions flow correctly between portals, from creation through to student attempts and results.

---

## Question Propagation Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| EX-001 | Global questions visible to institute | SA creates questions, Institute views | Questions visible with "Global" badge |
| EX-002 | Global questions in teacher bank | SA creates, Teacher views | Questions visible (subject-scoped) |
| EX-003 | Institute questions visible to teacher | Institute creates, Teacher views | Questions visible with "Institute" badge |
| EX-004 | Teacher questions personal | Teacher creates | Only creator sees in bank |
| EX-005 | AI-generated questions saved | Generate via AI, accept | Questions in bank |
| EX-006 | PDF-extracted questions saved | Extract from PDF, accept | Questions in bank |

---

## Exam Creation Flow Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| EX-007 | SA creates PYP | Create PYP with questions | PYP in exam list |
| EX-008 | SA creates Grand Test | Create GT with questions | GT in exam list |
| EX-009 | Institute creates pattern exam | Use pattern, add questions | Exam created |
| EX-010 | Teacher creates assessment | Create quick test | Assessment saved |
| EX-011 | All question sources usable | Use global + institute + own | All work in exam |

---

## Exam Assignment Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| EX-012 | SA assigns to institute | Assign PYP/GT to institute | Institute sees exam |
| EX-013 | Institute assigns to batch | Assign exam to batch | Students see in tests |
| EX-014 | Teacher assigns assessment | Assign to batch | Students see in tests |
| EX-015 | Multi-batch assignment | Assign to multiple batches | All batches see |
| EX-016 | Unassigned exam hidden | Don't assign to batch | Students don't see |

---

## Student Exam Access Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| EX-017 | Test appears in list | Exam assigned to batch | Student sees in Tests |
| EX-018 | Test details correct | Open test info | Title, duration, questions shown |
| EX-019 | Test player opens | Click start | Player loads |
| EX-020 | Questions display | Navigate questions | All questions render |
| EX-021 | Timer works | Start timed test | Timer counts down |
| EX-022 | Flag for review | Flag question | Flag indicator shown |
| EX-023 | Submit exam | Click submit | Submission recorded |

---

## Exam Results Flow Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| EX-024 | Results shown after submit | Submit exam | Results page opens |
| EX-025 | Score calculated | View results | Correct score shown |
| EX-026 | Teacher sees results | View exam results | Student scores listed |
| EX-027 | Institute sees aggregate | View exam analytics | Batch performance shown |
| EX-028 | Individual analysis | Student views analysis | Question-by-question breakdown |

---

## Draft vs Published Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| EX-029 | Draft exam hidden from students | Save as draft | Students don't see |
| EX-030 | Published exam visible | Publish exam | Students see |
| EX-031 | Published exam locked | Try to edit questions | Editing blocked |
| EX-032 | Schedule editable after publish | Edit schedule | Schedule updates |

---

## Question Permission Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| EX-033 | Global questions read-only | Institute tries to edit | No edit option |
| EX-034 | Institute questions read-only to teacher | Teacher tries to edit | No edit option |
| EX-035 | Own questions editable | Creator tries to edit | Edit available |
| EX-036 | Used questions warn on edit | Edit used question | Warning shown |

---

## Pattern-Based Exam Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| EX-037 | Pattern constraints enforced | Add 21 MCQ to 20-limit section | Error shown |
| EX-038 | Section types enforced | Add Integer to MCQ section | Question filtered out |
| EX-039 | Progress tracker updates | Add questions | Progress reflects additions |
| EX-040 | All sections required | Leave section empty | Cannot publish |

---

## Availability Window Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| EX-041 | Before window hidden | Set future start | Students don't see |
| EX-042 | In window visible | Current time in window | Students see |
| EX-043 | After window archived | Set past end | Students don't see |
| EX-044 | Results available after | Complete before window ends | Results still visible |

---

## Performance Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| EX-045 | Large question bank | 500+ questions | Loads within 3s |
| EX-046 | Virtual scroll works | Scroll through 200 questions | Smooth 60fps |
| EX-047 | Exam loads quickly | 100 question exam | Loads within 2s |
| EX-048 | LaTeX renders | Questions with formulas | Formulas display |

---

## Grand Test Assignment Flow Tests

### Purpose

These tests verify that Grand Tests created by SuperAdmin correctly propagate to institutes and subsequently to students through the assignment chain.

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| EX-050 | GT not visible without audience | SA creates GT, does NOT assign any audience | Institute does NOT see GT in their Exams module |
| EX-051 | GT visible after audience assigned | SA creates GT, assigns Institute A in Audience dialog | Institute A sees GT in their Exams module |
| EX-052 | Unassigned institute doesn't see GT | SA assigns GT only to Institute A | Institute B does NOT see the GT |
| EX-053 | Multiple institutes see GT | SA assigns GT to Institute A and Institute B | Both institutes see the GT in their Exams |
| EX-054 | GT read-only at Institute | Institute opens assigned GT | View only mode, no edit/delete buttons available |
| EX-055 | Institute assigns GT to batch | Institute clicks Assign on GT | Batch selection dialog opens, can select batches |
| EX-056 | Unassigned batch doesn't see GT | GT assigned to Batch A only | Students in Batch B do not see the test |
| EX-057 | Student sees assigned GT | Student is in assigned batch | Test appears in student's Tests list |
| EX-058 | GT with no batch assignment | Institute doesn't assign GT to any batch | No students see the test |

---

## Schedule Propagation Tests

### Purpose

These tests verify that schedule settings from SuperAdmin correctly propagate and control exam availability for institutes and students.

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| EX-059 | Schedule reflects at Institute | SA schedules GT for tomorrow 9:00 AM | Institute sees same schedule date/time on GT card |
| EX-060 | Student can't start before schedule | GT scheduled for future time | "Available at [date/time]" shown, Start button disabled |
| EX-061 | Student can start after schedule | Current time > scheduled time | "Start Test" button is active/enabled |
| EX-062 | Schedule change propagates | SA changes schedule to different date/time | Institute and Student see updated schedule immediately |
| EX-063 | Past schedule allows immediate start | GT scheduled for past time (already passed) | Student can start immediately |
| EX-064 | Countdown displayed | GT scheduled for near future | Countdown timer shown to students |

---

## PYP Propagation Tests

### Purpose

These tests verify that Previous Year Papers created by SuperAdmin correctly propagate to institutes.

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| EX-065 | PYP visible to Institute | SA creates PYP, assigns to institute | Institute sees PYP in their Previous Year Papers tab |
| EX-066 | PYP year grouping at Institute | Institute views PYP tab | Same year-wise accordion grouping as SuperAdmin (2024, 2023, etc.) |
| EX-067 | PYP preview works at Institute | Institute clicks View on PYP | Full question preview displays correctly |
| EX-068 | PYP read-only at Institute | Institute views PYP | No edit/delete options available, view and assign only |
| EX-069 | Institute assigns PYP to batch | Institute assigns PYP to specific batch | Students in batch see the PYP in their tests |
| EX-070 | PYP questions render at Institute | Institute previews PYP questions | Math formulas, images render correctly |

---

## Exam Content Consistency Tests

### Purpose

These tests verify that exam content (questions, sections, marking) is consistent across all portals.

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| EX-071 | Question count matches | SA creates 75-question exam, Institute views | Institute sees exactly 75 questions |
| EX-072 | Section structure preserved | SA creates 3-section exam | Institute sees same 3 sections with same question distribution |
| EX-073 | Marking scheme preserved | SA sets +4/-1 for MCQ | Institute and student see same marking scheme |
| EX-074 | Math renders at Student | SA creates exam with LaTeX questions | Student sees formulas rendered correctly in test player |
| EX-075 | Images display at Student | SA creates exam with images | Student sees all images in test player |

---

*Last Updated: January 2025*
