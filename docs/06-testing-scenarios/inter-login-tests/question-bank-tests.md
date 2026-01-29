# Question Bank Cross-Portal Tests

> Tests verifying question propagation and access control across SuperAdmin, Institute, and Teacher portals.

---

## Overview

These tests verify that questions flow correctly from SuperAdmin to Institutes, respecting curriculum/course assignments. This is critical because institutes should ONLY see questions matching their assigned curricula and courses.

---

## Purpose

**Why These Tests Matter:**
- Questions are the core educational content
- Incorrect propagation = institutes seeing questions they shouldn't
- Strict boundaries must be enforced: institutes only see their assigned curriculum/course questions
- Global questions are read-only downstream

**Critical Business Rule:**
Questions are ONLY visible to institutes based on their assigned curricula and courses. An institute with CBSE assigned should NEVER see ICSE questions.

---

## Question Visibility by Curriculum

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| QP-001 | CBSE questions visible to CBSE institute | SA creates CBSE questions, Institute has CBSE assigned | Institute sees CBSE questions |
| QP-002 | ICSE questions visible to ICSE institute | SA creates ICSE questions, Institute has ICSE assigned | Institute sees ICSE questions |
| QP-003 | CBSE questions hidden from ICSE institute | SA creates CBSE questions, Institute has ICSE only | Institute does NOT see CBSE questions |
| QP-004 | ICSE questions hidden from CBSE institute | SA creates ICSE questions, Institute has CBSE only | Institute does NOT see ICSE questions |
| QP-005 | Multiple curricula work | Institute has CBSE + ICSE assigned | Institute sees both CBSE and ICSE questions |
| QP-006 | State Board questions scoped | SA creates State Board questions | Only institutes with that board assigned see them |

---

## Question Visibility by Course

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| QP-007 | JEE questions visible to JEE institute | SA creates JEE questions, Institute has JEE assigned | Institute sees JEE questions |
| QP-008 | NEET questions visible to NEET institute | SA creates NEET questions, Institute has NEET assigned | Institute sees NEET questions |
| QP-009 | JEE questions hidden from NEET institute | SA creates JEE questions, Institute has NEET only | Institute does NOT see JEE questions |
| QP-010 | NEET questions hidden from JEE institute | SA creates NEET questions, Institute has JEE only | Institute does NOT see NEET questions |
| QP-011 | Multiple courses work | Institute has JEE + NEET assigned | Institute sees both JEE and NEET questions |

---

## Mixed Curriculum + Course Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| QP-012 | CBSE curriculum + JEE course | Institute has CBSE + JEE | Sees CBSE questions + JEE questions only |
| QP-013 | ICSE curriculum + NEET course | Institute has ICSE + NEET | Sees ICSE questions + NEET questions only |
| QP-014 | All curricula + all courses | Institute has everything assigned | Sees all questions |
| QP-015 | Single curriculum + multiple courses | Institute has CBSE + JEE + NEET | Sees CBSE + JEE + NEET questions |

---

## Strict Boundary Verification Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| QP-016 | Create 3 test institutes | Institute A: CBSE, Institute B: ICSE, Institute C: JEE | Each created successfully |
| QP-017 | SA creates CBSE Physics question | Create question under CBSE > Class 11 > Physics | Question created |
| QP-018 | SA creates ICSE Chemistry question | Create question under ICSE > Class 10 > Chemistry | Question created |
| QP-019 | SA creates JEE Maths question | Create question under JEE > Mathematics | Question created |
| QP-020 | Institute A sees only CBSE | Login to Institute A, view Question Bank | Only CBSE Physics visible |
| QP-021 | Institute B sees only ICSE | Login to Institute B, view Question Bank | Only ICSE Chemistry visible |
| QP-022 | Institute C sees only JEE | Login to Institute C, view Question Bank | Only JEE Maths visible |
| QP-023 | Cross-check: A doesn't see ICSE | Institute A searches for ICSE question | No results found |
| QP-024 | Cross-check: B doesn't see CBSE | Institute B searches for CBSE question | No results found |
| QP-025 | Cross-check: C doesn't see CBSE | Institute C searches for CBSE question | No results found |

---

## Question Source Badge Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| QP-026 | Global badge on SA questions | Institute views SA question | "Global" badge displayed |
| QP-027 | Institute badge on own questions | Institute creates question, views in bank | "Institute" badge displayed |
| QP-028 | Badge color differentiation | View questions from different sources | Different badge colors (Global: blue, Institute: green) |

---

## Question Permission Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| QP-029 | Global questions read-only | Institute views global question | No Edit/Delete buttons visible |
| QP-030 | Institute questions editable | Institute creates question | Edit/Delete buttons visible |
| QP-031 | Cannot edit global from institute | Try to access edit URL directly | Access denied or redirect |
| QP-032 | Cannot delete global from institute | Try to access delete URL directly | Access denied or error |

---

## Question Type Verification Tests

For each of the 9 question types, verify visibility:

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| QP-033 | MCQ visible at institute | SA creates MCQ, institute views | MCQ displayed correctly |
| QP-034 | Multiple Correct visible | SA creates Multiple Correct | Displayed with checkboxes |
| QP-035 | Numerical visible | SA creates Numerical | Displayed with number input |
| QP-036 | True/False visible | SA creates True/False | Displayed with T/F options |
| QP-037 | Fill in Blanks visible | SA creates Fill in Blanks | Displayed with blank markers |
| QP-038 | Assertion-Reasoning visible | SA creates A-R | Displayed with AR options |
| QP-039 | Paragraph Based visible | SA creates Paragraph | Displayed with sub-questions |
| QP-040 | Short Answer visible | SA creates Short Answer | Displayed with text area |
| QP-041 | Long Answer visible | SA creates Long Answer | Displayed with large text area |

---

## Question Classification Verification

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| QP-042 | Curriculum classification visible | View question at institute | Shows: Curriculum, Class, Subject, Chapter, Topic |
| QP-043 | Course classification visible | View course question | Shows: Course, Subject, Chapter, Topic (no class) |
| QP-044 | Difficulty visible | View question | Difficulty badge displayed |
| QP-045 | Cognitive type visible | View question | Cognitive type badge displayed |

---

## Teacher Portal Scoping Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| QP-046 | Teacher sees institute questions | Teacher at institute views bank | Sees Global + Institute questions |
| QP-047 | Teacher scoped by subject | Teacher teaches Physics only | Sees only Physics questions |
| QP-048 | Teacher creates own question | Teacher creates question | "My Question" badge shown |
| QP-049 | Teacher question personal | Another teacher at same institute | Cannot see first teacher's questions |
| QP-050 | Teacher can use all visible | Create exam with Global + Institute questions | All usable in exam |

---

## Real-Time Update Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| QP-051 | New question appears | SA creates question while institute logged in | Question appears on refresh |
| QP-052 | Edited question updates | SA edits question | Changes visible at institute |
| QP-053 | Deleted question disappears | SA deletes question | Removed from institute view |

---

## Test Procedure

### Setup
1. Create 3 test institutes with different assignments
2. Login to SuperAdmin and create test questions in different curricula/courses
3. Login to each institute and verify visibility

### Verification Steps
1. Navigate to Question Bank
2. Check total question count matches expected
3. Use filters to verify only assigned content appears
4. Attempt to search for unassigned content (should return 0)
5. Verify badges, edit/delete permissions

### Cleanup
1. Delete test questions
2. Delete test institutes

---

*Last Updated: January 2025*
