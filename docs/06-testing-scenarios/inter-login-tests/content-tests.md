# Content Cross-Portal Tests

> Tests for content propagation across SuperAdmin, Institute, Teacher, and Student portals.

---

## Overview

These tests verify that content flows correctly between portals, respecting visibility rules, edit permissions, and assignment scoping. Content visibility is strictly controlled by curriculum/course assignments and tier settings.

---

## Critical Business Rules

1. **Content tagged with CBSE** is ONLY visible to institutes assigned CBSE
2. **Content tagged with ICSE** is NOT visible to CBSE-only institutes
3. **Content tagged with BOTH** CBSE and ICSE is visible to BOTH types of institutes
4. **Tier must enable** Content Library access for content to be visible
5. **Global content is read-only** - institutes/teachers cannot edit SuperAdmin content
6. **Institute content is private** - other institutes cannot see it

---

## SuperAdmin → Institute Content Flow

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CT-001 | Global content visible to institute | SA creates content, Institute views library | Content visible with "Global" badge |
| CT-002 | Global content not editable | Institute clicks edit on global content | No edit option available |
| CT-003 | Global content subject-filtered | SA creates Physics content, Institute filters | Shows in Physics filter |
| CT-004 | Updated global content reflects | SA updates content, Institute refreshes | Updated content shown |
| CT-005 | Deleted global content removed | SA deletes content, Institute refreshes | Content not visible |

---

## Institute → Teacher Content Flow

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CT-006 | Institute content visible to teacher | Institute creates content, Teacher views | Content visible with "Institute" badge |
| CT-007 | Institute content not editable by teacher | Teacher clicks edit on institute content | No edit option |
| CT-008 | Teacher sees only assigned subjects | Teacher has Physics only, Institute has all | Teacher sees only Physics content |
| CT-009 | New institute content appears | Institute creates, Teacher refreshes | New content visible |

---

## Teacher → Student Content Flow

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CT-010 | Assigned content visible to student | Teacher assigns to batch, Student views | Content visible in chapter |
| CT-011 | Unassigned content not visible | Teacher creates but doesn't assign | Student doesn't see it |
| CT-012 | Lesson content visible | Teacher adds to lesson, Student in class | Content in Classroom mode |
| CT-013 | Content in correct chapter | Teacher classifies to Ch. 3 | Student sees in Ch. 3 |

---

## Global → Student Flow

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CT-014 | Global content via teacher | SA creates, Teacher assigns, Student views | Content visible |
| CT-015 | Direct global not visible | SA creates, no assignment | Student doesn't see |

---

## Multi-Source Content Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CT-016 | All sources in teacher library | Global + Institute + Teacher content | All three visible with badges |
| CT-017 | Source filter works | Teacher filters by source | Correct filtering |
| CT-018 | Teacher can assign all sources | Teacher assigns global/institute/own | All assignable |

---

## Edit Permission Matrix Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CT-019 | SA edits global | SA opens global content | Edit available |
| CT-020 | Institute can't edit global | Institute opens global | Edit not available |
| CT-021 | Institute edits own | Institute opens own content | Edit available |
| CT-022 | Teacher can't edit institute | Teacher opens institute content | Edit not available |
| CT-023 | Teacher edits own | Teacher opens own content | Edit available |
| CT-024 | Student can't edit anything | Student views any content | No edit options |

---

## Deletion Impact Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CT-025 | Assigned content deletion blocked | Try to delete assigned content | Warning about assignments |
| CT-026 | Lesson content deletion blocked | Try to delete in-lesson content | Warning about lesson |
| CT-027 | Unassigned deletion allowed | Delete unassigned content | Deletion succeeds |
| CT-028 | Cascade visibility on delete | Delete unassigned, check downstream | No orphan references |

---

## Assignment Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CT-029 | Batch assignment works | Assign to batch | All batch students see |
| CT-030 | Multi-batch assignment | Assign to 2 batches | Both batches see |
| CT-031 | Remove assignment | Unassign from batch | Students no longer see |
| CT-032 | Student count shown | View assignment dialog | Student count per batch |

---

## Performance Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CT-033 | Large library loads | 500+ content items | Loads within 3s |
| CT-034 | Filter doesn't freeze | Apply filters rapidly | Responsive filtering |
| CT-035 | Student library fast | Student with 50+ content | Loads within 2s |

---

## Content Visibility Based on Curriculum/Course Assignment

### Purpose

Content visibility is STRICTLY controlled by institute curriculum/course assignments. When SuperAdmin creates content with visibility set to specific curricula/courses, only institutes with matching assignments can access that content.

### Boundary Enforcement

This is the most critical test category - strict boundaries must be enforced to prevent content leakage between curricula/courses.

### Curriculum-Based Visibility Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CT-040 | CBSE content to CBSE institute | SA creates content with CBSE visibility, Institute is assigned CBSE | Content visible in institute library |
| CT-041 | CBSE content NOT to ICSE institute | SA creates content with CBSE visibility only, Institute has only ICSE | Content NOT visible in institute library |
| CT-042 | Multi-curriculum content visibility | SA creates content with CBSE + ICSE visibility, Institute has CBSE only | Content visible (has at least one matching curriculum) |
| CT-043 | State Board content isolation | SA creates State Board content, Institute has CBSE | Content NOT visible |
| CT-044 | All-curriculum visibility | SA creates content visible to all curricula, any institute | Content visible to all institutes with Content Library access |

### Course-Based Visibility Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CT-045 | JEE content to JEE institute | SA creates content with JEE visibility, Institute is assigned JEE | Content visible |
| CT-046 | JEE content NOT to NEET institute | SA creates JEE content, Institute has only NEET | Content NOT visible |
| CT-047 | Multi-course content visibility | SA creates content with JEE + NEET visibility, Institute has JEE only | Content visible |
| CT-048 | Foundation content visibility | SA creates Foundation content, Institute has Foundation | Content visible |

### Mixed Curriculum + Course Visibility

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CT-049 | CBSE + JEE content to CBSE institute | SA creates content with CBSE + JEE visibility, Institute has CBSE only (no JEE) | Content visible (has CBSE) |
| CT-050 | CBSE + JEE content to JEE institute | SA creates content with CBSE + JEE visibility, Institute has JEE only (no CBSE) | Content visible (has JEE) |
| CT-051 | No matching visibility | SA creates CBSE content, Institute has ICSE + NEET | Content NOT visible |

### Tier-Based Access Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CT-052 | Tier blocks content access | Institute tier has Content Library disabled | Content Library not in sidebar, no access to any content |
| CT-053 | Tier enables content access | Institute tier has Content Library enabled | Content Library visible in sidebar, content accessible |
| CT-054 | Tier change immediately affects access | SA disables Content Library in institute tier | Content Library disappears from institute sidebar on refresh |

---

## Content Preview Across Logins

### Purpose

Verify that all content types preview correctly across all portal types. Sometimes content works in one portal but fails in another due to rendering or permission issues.

### Video Content Preview Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CT-055 | Video preview at SuperAdmin | SA creates video, clicks Preview | Video plays correctly with playback controls |
| CT-056 | Same video at Institute | Institute views same video content, clicks Preview | Video plays correctly, no errors |
| CT-057 | Same video at Teacher | Teacher views same video content, clicks Preview | Video plays correctly, no playback issues |
| CT-058 | Video plays for Student | Teacher assigns video, Student views | Video plays in content viewer |

### PDF Document Preview Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CT-059 | PDF preview at SuperAdmin | SA creates PDF, clicks Preview | PDF displays, all pages navigable |
| CT-060 | Same PDF at Institute | Institute views same PDF, clicks Preview | PDF displays correctly, no "document not supported" error |
| CT-061 | Same PDF at Teacher | Teacher views same PDF, clicks Preview | PDF displays, pages scrollable |
| CT-062 | PDF displays for Student | Teacher assigns PDF, Student views | PDF renders in content viewer |

### PPT Document Preview Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CT-063 | PPT preview at SuperAdmin | SA creates PPT, clicks Preview | Slides display, navigation works |
| CT-064 | Same PPT at Institute | Institute views same PPT, clicks Preview | Slides display correctly, no errors |
| CT-065 | Same PPT at Teacher | Teacher views same PPT, clicks Preview | Slides display, can navigate |
| CT-066 | PPT displays for Student | Teacher assigns PPT, Student views | Slides render in content viewer |

### HTML Content Preview Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CT-067 | HTML preview at SuperAdmin | SA creates HTML content, clicks Preview | HTML renders in iframe correctly |
| CT-068 | HTML at Institute | Institute views same HTML, clicks Preview | HTML renders, no 504 or server errors |
| CT-069 | HTML at Teacher | Teacher views same HTML, clicks Preview | HTML renders correctly |
| CT-070 | HTML for Student | Teacher assigns HTML, Student views | HTML interactive content works |

### External URL (YouTube/Vimeo) Preview Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CT-071 | YouTube at SuperAdmin | SA creates YouTube embed, clicks Preview | Video plays in embed |
| CT-072 | YouTube at Institute | Institute views same YouTube, clicks Preview | Video plays, no "error with link" message |
| CT-073 | YouTube at Teacher | Teacher views same YouTube, clicks Preview | Video plays correctly |
| CT-074 | YouTube for Student | Teacher assigns YouTube, Student views | Video plays in content viewer |
| CT-075 | Vimeo at all portals | SA creates Vimeo, all portals preview | Plays correctly in all portals |
| CT-076 | Google Slides at all portals | SA creates Google Slides embed, all portals preview | Slides display and navigate in all portals |

---

## Institute-Created Content Privacy

### Purpose

Content created by an institute must remain private to that institute and its teachers/students. Other institutes and SuperAdmin should NOT have access.

### Institute Content Isolation Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CT-077 | Institute A content NOT visible to SuperAdmin | Institute A creates content | SuperAdmin CANNOT see Institute A's content in their library |
| CT-078 | Institute A content NOT visible to Institute B | Institute A creates content | Institute B CANNOT see Institute A's content |
| CT-079 | Institute content visible to own teachers | Institute creates content | Teachers of that institute CAN see content with "Institute" badge |
| CT-080 | Institute content NOT visible to other teachers | Institute A creates content | Teachers of Institute B CANNOT see content |
| CT-081 | Institute content visible to own students (via assignment) | Institute creates, teacher assigns | Students in that institute see assigned content |
| CT-082 | Institute content NOT visible to other students | Institute A creates content | Students of Institute B never see it |

### Content Source Badge Verification

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CT-083 | Global badge on SA content | SA creates content, Institute views | "Global" badge displayed on content card |
| CT-084 | Institute badge on local content | Institute creates content, Teacher views | "Institute" badge displayed |
| CT-085 | Teacher badge on teacher content | Teacher creates content | "My Content" or "Teacher" badge displayed |
| CT-086 | Badge consistent across views | View same content in Grid and List | Badge visible in both view modes |

---

## Global Content Read-Only Enforcement

### Purpose

SuperAdmin-created global content must remain read-only for all downstream users. Only preview and assign actions should be available.

### Read-Only Enforcement Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CT-087 | Global content read-only at Institute | Institute views global content | No Edit button visible, no Delete button, only Preview available |
| CT-088 | Global content read-only at Teacher | Teacher views global content | No Edit/Delete buttons visible, only Preview and Assign |
| CT-089 | Institute content editable by Institute | Institute views own content | Edit and Delete buttons available and functional |
| CT-090 | Teacher content editable by Teacher | Teacher views own content | Edit and Delete buttons available and functional |
| CT-091 | Institute content read-only at Teacher | Teacher views institute content | No Edit/Delete, only Preview and Assign |

### Edit Action Protection Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CT-092 | Direct URL to edit global fails | Institute attempts `/content/edit/{global-id}` | Redirected or error, cannot edit |
| CT-093 | API protection on global edit | Direct API call to edit global content | 403 Forbidden or equivalent error |

---

## Content Type Cross-Portal Matrix

### Purpose

Comprehensive verification that each content type works correctly when created at one portal and viewed at another.

| Test ID | Content Type | Created At | Viewed At | Expected Result |
|---------|--------------|------------|-----------|-----------------|
| CT-094 | Video (MP4) | SuperAdmin | Institute | Plays correctly |
| CT-095 | Video (MP4) | SuperAdmin | Teacher | Plays correctly |
| CT-096 | Video (MP4) | Institute | Teacher | Plays correctly |
| CT-097 | PDF | SuperAdmin | Institute | Displays correctly |
| CT-098 | PDF | SuperAdmin | Teacher | Displays correctly |
| CT-099 | PDF | Institute | Teacher | Displays correctly |
| CT-100 | PPT | SuperAdmin | Institute | Slides work |
| CT-101 | PPT | SuperAdmin | Teacher | Slides work |
| CT-102 | HTML | SuperAdmin | Institute | Renders correctly |
| CT-103 | HTML | SuperAdmin | Teacher | Renders correctly |
| CT-104 | YouTube | SuperAdmin | Institute | Plays in embed |
| CT-105 | YouTube | SuperAdmin | Teacher | Plays in embed |

---

## Visibility Change Propagation

### Purpose

Test that visibility changes (adding/removing curricula) propagate correctly to downstream portals.

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CT-106 | Add visibility propagates | SA adds ICSE to CBSE-only content, ICSE Institute refreshes | Content now visible |
| CT-107 | Remove visibility propagates | SA removes CBSE from content, CBSE Institute refreshes | Content no longer visible |
| CT-108 | Assigned content visibility change | SA removes visibility, content was assigned | Warning shown, assignment affected |

---

*Last Updated: March 2025*
