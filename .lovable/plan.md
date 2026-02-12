

# Add Missing Master Data Workflow Tests: Course-Only Content, Chapter Ordering, and Edit Propagation

## Your Pain Point

The current intra-login tests are missing several critical Master Data workflows:

1. **Course-only chapters/topics** -- When course-exclusive chapters and topics are created in the Course Builder, we need to verify they appear in Question Bank, Content Library, and Exams dropdowns under Course mode.
2. **Chapter ordering preservation** -- Both Curriculum and Course views support drag-and-drop reordering of chapters. After saving the new order, every downstream dropdown (Question Bank, Content Library, Exams) must display chapters in that same saved order. This is not tested at all today.
3. **Chapter rename propagation** -- There is no delete option for chapters, only edit. Renaming a chapter must propagate across all downstream modules. The current SA-IL-022 covers this partially but does not explicitly state "no delete exists" or test course-owned chapter renames.
4. **New curriculum chapter reflecting in Courses** -- When a new chapter is added to a curriculum, it should be available for mapping in the Course Builder. And when a topic is added to a mapped chapter, it should reflect inside the course view too.

## What is Currently Covered vs Missing

| Scenario | Currently Covered? | Where |
|----------|-------------------|-------|
| Curriculum cascade in QB/Content | Yes | SA-IL-009, SA-IL-013 |
| Course cascade in QB/Content | Yes | SA-IL-012, SA-IL-016 |
| New curriculum chapter in QB | Yes | SA-IL-010 |
| New curriculum chapter available in Course Builder | Partially | SA-IL-007 (mapping only) |
| New topic on mapped chapter reflects in Course view | No | Missing |
| Course-only chapter/topic reflects in QB/Content/Exams | No | Missing |
| Chapter ordering preserved in downstream dropdowns | No | Missing entirely |
| Chapter rename (no delete) propagation | Partial | SA-IL-022 mentions rename but not "no delete" context |
| Course-only chapter rename propagation | No | Missing |

## Proposed Changes

### File: `docs/06-testing-scenarios/intra-login-tests/superadmin.md`

Add 5 new workflow test cases and enhance 2 existing ones. Total test count goes from 30 to 35.

### New Test Cases

**1. In "Master Data (Curriculum) -> Courses" section -- add 1 test:**

| Test ID | Workflow | Precondition | Steps & Checkpoints | Expected Result |
|---------|----------|--------------|---------------------|-----------------|
| SA-IL-NEW-1 | New curriculum data reflects in Course view | Course with mapped chapters exists | 1. Note existing chapters mapped from CBSE to the course. 2. Go to Master Data Curriculum, add a new chapter under a mapped subject. 3. Go to Course Builder -- verify the new chapter is available for mapping. 4. Map the new chapter to the course. 5. Go back to curriculum, add a topic under an already-mapped chapter. 6. Go to Course view -- verify the new topic appears under that mapped chapter. | New curriculum chapters are available for course mapping; new topics on mapped chapters reflect automatically in course view |

**2. New section "Master Data (Courses) -> Question Bank / Content Library / Exams" -- add 1 workflow test:**

| Test ID | Workflow | Precondition | Steps & Checkpoints | Expected Result |
|---------|----------|--------------|---------------------|-----------------|
| SA-IL-NEW-2 | Course-only chapters and topics reflect in downstream modules | Published course exists with a subject | 1. Go to Course Builder, create a course-only chapter under a subject. 2. Add 2-3 topics under that chapter. 3. Save the course. 4. Go to Question Bank, select Course mode, pick the course and subject -- verify the course-only chapter appears in the chapter dropdown. 5. Select it -- verify the topics appear. 6. Go to Content Library, select Course mode -- verify same course-only chapter and topics are available. 7. Go to Exams, create Grand Test with Course source -- verify course-only chapters are selectable. | Course-only chapters and their topics are immediately available in Question Bank, Content Library, and Exams under Course mode |

**3. New section "Chapter Ordering Across Platform" -- add 2 workflow tests:**

| Test ID | Workflow | Precondition | Steps & Checkpoints | Expected Result |
|---------|----------|--------------|---------------------|-----------------|
| SA-IL-NEW-3 | Curriculum chapter order preserved in downstream dropdowns | Curriculum with 5+ chapters under a subject exists | 1. Go to Master Data Curriculum view. 2. Select a class and subject with multiple chapters. 3. Drag chapters to create a custom order (e.g., move Chapter 5 to position 1). 4. Save the order. 5. Go to Question Bank, Curriculum mode, select same class and subject -- verify chapter dropdown shows chapters in the saved order. 6. Go to Content Library, same selection -- verify same order. 7. Go to AI Question Generator, same selection -- verify same order. | Chapter ordering set in Master Data Curriculum view is preserved in all downstream chapter dropdowns |
| SA-IL-NEW-4 | Course chapter order preserved in downstream dropdowns | Course with 5+ chapters (mix of mapped and course-only) | 1. Go to Course Builder. 2. Select the course and a subject. 3. Drag chapters to create a custom order (interleaving mapped and course-only chapters). 4. Save. 5. Go to Question Bank, Course mode, same course and subject -- verify chapter dropdown respects the saved order. 6. Go to Content Library, Course mode -- verify same order. 7. Go to Exams, Course source -- verify same order. | Chapter ordering set in Course Builder is preserved in all downstream chapter dropdowns for course mode |

**4. Enhance existing "Master Data Deletion/Edit Impact" section -- add 1 test and update SA-IL-022:**

Update SA-IL-022 to explicitly note: "Note: Chapter and topic deletion is not supported in the platform. Only edit/rename is available."

Add new test:

| Test ID | Workflow | Precondition | Steps & Checkpoints | Expected Result |
|---------|----------|--------------|---------------------|-----------------|
| SA-IL-NEW-5 | Course-only chapter rename propagates to downstream | Course-only chapter with questions/content classified under it | 1. Go to Course Builder, rename a course-only chapter. 2. Save the course. 3. Go to Question Bank, Course mode -- verify the renamed chapter appears with the new name. 4. View existing questions classified under it -- verify they show the new name. 5. Go to Content Library, Course mode -- verify renamed chapter in dropdown and on existing content cards. | Renaming a course-only chapter propagates to all downstream modules |

### Renumbering

All existing SA-IL-001 through SA-IL-030 will be renumbered to accommodate the new tests inserted at their logical positions. Final count: SA-IL-001 through SA-IL-035.

### Updated Section Order

```text
1. Institutes -> Users (SA-IL-001 to 002)
2. Institutes -> Curriculum (SA-IL-003 to 004)
3. Roles -> Users (SA-IL-005 to 006)
4. Master Data (Curriculum) -> Courses (SA-IL-007 to 009) [+1 new]
5. Master Data (Curriculum) -> Question Bank (SA-IL-010 to 012)
6. Master Data (Courses) -> Question Bank (SA-IL-013)
7. Master Data (Course-Only Content) -> QB / Content / Exams (SA-IL-014) [NEW section]
8. Master Data (Curriculum) -> Content Library (SA-IL-015 to 017)
9. Master Data (Courses) -> Content Library (SA-IL-018)
10. Master Data (Curriculum/Courses) -> Exams (SA-IL-019 to 020)
11. Master Data (Curriculum/Courses) -> AI Generators (SA-IL-021 to 023)
12. Chapter Ordering Across Platform (SA-IL-024 to 025) [NEW section]
13. Master Data Deletion/Edit Impact (SA-IL-026 to 028) [+1 new, 1 updated]
14. Question Bank -> Exams (SA-IL-029 to 030)
15. Content Library -> Exams (SA-IL-031)
16. Content Library -> Institutes (SA-IL-032)
17. Questions -> Institutes (SA-IL-033)
18. Exams -> Institutes (SA-IL-034 to 035)
```

## Summary

| Change | Details |
|--------|---------|
| New workflow tests added | 5 |
| Existing tests updated | 1 (SA-IL-022 enhanced with "no delete" note) |
| New sections | 2 (Course-Only Content downstream, Chapter Ordering) |
| Final total | 35 workflow tests (was 30) |
| File modified | `docs/06-testing-scenarios/intra-login-tests/superadmin.md` |

