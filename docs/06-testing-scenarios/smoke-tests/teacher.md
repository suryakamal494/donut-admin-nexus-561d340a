# Teacher Smoke Tests

> Page-level verification for Teacher portal.

---

## Dashboard Tests

| ID | Test Case | Steps | Expected |
|----|-----------|-------|----------|
| T-SM-001 | Dashboard loads | Navigate to /teacher/dashboard | Shows today's classes |
| T-SM-002 | Pending banner | Have unconfirmed classes | Amber banner visible |
| T-SM-003 | Class card actions | Click on past class | Shows Confirm button |

## Schedule Tests

| ID | Test Case | Steps | Expected |
|----|-----------|-------|----------|
| T-SM-010 | Schedule loads | Navigate to /teacher/schedule | Grid displays correctly |
| T-SM-011 | Week navigation | Click next/previous | Week changes |
| T-SM-012 | Slot click | Click empty slot | Opens lesson workspace |

## Lesson Workspace Tests

| ID | Test Case | Steps | Expected |
|----|-----------|-------|----------|
| T-SM-020 | Workspace loads | Open /teacher/lesson-plans/new | Empty workspace |
| T-SM-021 | Add block | Click "Add Content" | Block menu opens |
| T-SM-022 | Drag reorder | Drag block grip | Block moves |
| T-SM-023 | Presentation mode | Click "Present" | Full-screen mode |

## Content Library Tests

| ID | Test Case | Steps | Expected |
|----|-----------|-------|----------|
| T-SM-030 | Library loads | Navigate to /teacher/content | Content grid shows |
| T-SM-031 | Source toggle | Toggle Global/Institute | Filters content |
| T-SM-032 | Assign dialog | Click "Assign" | Batch selection opens |

## Homework Tests

| ID | Test Case | Steps | Expected |
|----|-----------|-------|----------|
| T-SM-040 | Homework list | Navigate to /teacher/homework | Assignments shown |
| T-SM-041 | Create homework | Click "Create" | 3-step wizard |
| T-SM-042 | Review submissions | Click "Review" | Submission list |

---

*Last Updated: January 2025*
