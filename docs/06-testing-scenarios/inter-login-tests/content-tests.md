# Content Cross-Portal Tests

> Tests for content propagation across SuperAdmin, Institute, Teacher, and Student portals.

---

## Overview

These tests verify that content flows correctly between portals, respecting visibility rules, edit permissions, and assignment scoping.

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

*Last Updated: January 2025*
