

# Reorder SuperAdmin Intra-Login Test Cases to Match Sidebar Flow

## Problem

The test case sections are scattered randomly and have duplicates (e.g., "Curriculum -> Question Bank" appears twice -- original SA-IL-004 to 006 AND extended SA-IL-027 to 041). The order does not follow the SuperAdmin sidebar navigation flow.

## SuperAdmin Sidebar Order (from code)

1. Dashboard
2. Institutes (All Institutes, Tier Management)
3. Users
4. Master Data (Curriculum, Courses)
5. Roles & Access
6. Question Bank
7. Exams
8. Content Library

## New Section Order (following sidebar flow)

The sections will be reorganized by **source module** in sidebar order. Duplicate sections will be merged. Test IDs will be renumbered sequentially.

```text
Section Order (Source -> Target):

1. Institutes -> Users (SA-IL-001 to 002)
2. Institutes -> Curriculum (SA-IL-003 to 004)
3. Roles -> Users (SA-IL-005 to 007)
4. Master Data (Curriculum) -> Courses (SA-IL-008 to 010)
5. Master Data (Curriculum) -> Question Bank [MERGED] (SA-IL-011 to 023)
6. Master Data (Courses) -> Question Bank (SA-IL-024 to 028)
7. Master Data (Curriculum) -> Content Library [MERGED] (SA-IL-029 to 035)
8. Master Data (Courses) -> Content Library (SA-IL-036 to 037)
9. Master Data (Curriculum/Courses) -> Exams (SA-IL-038 to 040)
10. Master Data (Curriculum/Courses) -> AI Generators (SA-IL-041 to 046)
11. Master Data Deletion/Edit Impact (SA-IL-047 to 051)
12. Question Bank -> Exams (SA-IL-052 to 056)
13. Content Library -> Exams (SA-IL-057)
14. Content Library -> Institutes (SA-IL-058)
15. Questions -> Institutes (SA-IL-059)
16. Exams -> Institutes (SA-IL-060 to 061)
```

## Key Changes

- **Merged duplicates**: "Curriculum -> Question Bank" (old SA-IL-004 to 006) merged with "Curriculum -> Question Bank Extended" (old SA-IL-027 to 036) into one unified section
- **Merged duplicates**: "Curriculum -> Content Library" (old SA-IL-001 to 003) merged with "Curriculum -> Content Library Extended" (old SA-IL-042 to 045) into one unified section
- **Reordered**: Institutes and Roles sections moved to the top (they come first in sidebar)
- **Reordered**: Master Data impact sections grouped together in the middle
- **Reordered**: Question Bank -> Exams and Content Library -> Exams moved after all Master Data sections
- **Renumbered**: All test IDs renumbered SA-IL-001 through SA-IL-061 sequentially
- **Updated execution order**: Matches the new section flow

## File Modified

| File | Action |
|------|--------|
| `docs/06-testing-scenarios/intra-login-tests/superadmin.md` | Complete rewrite with merged, reordered, and renumbered sections |

## Total Test Cases

61 test cases (same count, no tests removed or added -- only reordered, merged, and renumbered)

