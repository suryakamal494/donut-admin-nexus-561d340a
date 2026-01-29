# Tier-to-Institute Cross-Portal Tests

> Tests verifying tier features propagate correctly to institute portals.

---

## Overview

These tests verify that when a tier is assigned to an institute, the correct features, limits, and capabilities are reflected in the institute portal. This is critical for subscription-based access control.

---

## Purpose

**Why These Tests Matter:**
- Tiers control which sidebar items appear in institutes
- Tiers control AI feature availability (Question Generator, Content Generator)
- Tiers control user limits (students, teachers, batches)
- Incorrect tier propagation = institutes seeing features they shouldn't (or missing features they should have)

**Key Verification Points:**
1. Sidebar items match tier feature toggles
2. AI buttons appear/hide based on tier
3. User limits are enforced
4. Tier upgrades reflect immediately

---

## Tier Feature Propagation Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| TI-001 | Basic tier sidebar | Create institute with Basic tier, login to institute | Limited sidebar: Dashboard, Batches, Teachers, Students, Question Bank, Content Library, Exams only |
| TI-002 | Standard tier sidebar | Create institute with Standard tier, login to institute | Full sidebar minus Enterprise features |
| TI-003 | Premium tier sidebar | Create institute with Premium tier, login to institute | All sidebar items visible |
| TI-004 | Timetable visibility | Basic tier (Timetable OFF), login | Timetable NOT in sidebar |
| TI-005 | Syllabus Tracker visibility | Basic tier (Tracker OFF), login | Syllabus Tracker NOT in sidebar |
| TI-006 | Roles & Access visibility | Basic tier (Roles OFF), login | Roles & Access NOT in sidebar |

---

## AI Feature Visibility Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| TI-007 | AI Question Generator hidden | Basic tier, go to Question Bank | "Generate with AI" button NOT visible |
| TI-008 | AI Question Generator visible | Standard/Premium tier, go to Question Bank | "Generate with AI" button visible |
| TI-009 | PDF Upload hidden | Basic tier, go to Question Bank | "Upload PDF" button NOT visible |
| TI-010 | PDF Upload visible | Standard/Premium tier, go to Question Bank | "Upload PDF" button visible |
| TI-011 | AI Content Generator hidden | Basic tier, go to Content Library | "AI Generate" button NOT visible |
| TI-012 | AI Content Generator visible | Standard/Premium tier, go to Content Library | "AI Generate" button visible |

---

## User Limit Enforcement Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| TI-013 | Student limit enforced | Basic tier (100 limit), try to add student #101 | Error: "Student limit reached" |
| TI-014 | Teacher limit enforced | Basic tier (10 limit), try to add teacher #11 | Error: "Teacher limit reached" |
| TI-015 | Batch limit enforced | Basic tier (5 limit), try to create batch #6 | Error: "Batch limit reached" |
| TI-016 | Unlimited works | Premium tier (unlimited), add 500+ students | No limit error |
| TI-017 | Limit counter displayed | View any limit page | "X of Y used" shown |

---

## Tier Upgrade/Downgrade Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| TI-018 | Tier upgrade immediate | Upgrade institute from Basic to Pro | New features appear in sidebar immediately |
| TI-019 | AI features appear on upgrade | Upgrade Basic to Pro, check Question Bank | "Generate with AI" now visible |
| TI-020 | Limit increase on upgrade | Upgrade tier, check limits | New limits reflected |
| TI-021 | Tier downgrade warning | SuperAdmin downgrades tier | Warning shows affected features |
| TI-022 | Features hidden on downgrade | Downgrade Pro to Basic | AI buttons disappear |

---

## Curriculum/Course Assignment Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| TI-023 | Assigned curriculum visible | Create institute with CBSE assigned | Only CBSE visible in Master Data |
| TI-024 | Assigned course visible | Create institute with JEE assigned | JEE visible alongside curriculum |
| TI-025 | Unassigned curriculum hidden | Institute has CBSE only | ICSE NOT visible in Master Data |
| TI-026 | Custom course visible | Create custom course during institute creation | Custom course visible in institute |
| TI-027 | Multiple assignments work | Assign CBSE + ICSE + JEE | All three visible in institute |

---

## Combined Tier + Assignment Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| TI-028 | Basic tier + single curriculum | Basic tier + CBSE only | Limited sidebar + only CBSE data |
| TI-029 | Premium tier + all curricula | Premium tier + all curricula/courses | Full sidebar + all data |
| TI-030 | Question Bank scoped | Institute has CBSE, view Question Bank | Only CBSE questions visible |
| TI-031 | Content Library scoped | Institute has JEE, view Content Library | Only JEE content visible |

---

## Edge Cases

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| TI-032 | New tier takes effect | Create new tier, assign to institute | New tier features apply |
| TI-033 | Deleted tier reassign | Delete tier, reassign institutes | Institutes use new tier |
| TI-034 | Feature toggle change | Change tier feature toggle | Affected institutes update |
| TI-035 | Limit change mid-use | Reduce limit below current usage | Warning shown, no data loss |

---

## Verification Checklist

When verifying tier propagation:

- [ ] Login to institute portal after tier assignment
- [ ] Count sidebar items vs tier feature count
- [ ] Navigate to Question Bank, check button visibility
- [ ] Navigate to Content Library, check button visibility
- [ ] Check user limit displays match tier limits
- [ ] Verify Master Data shows only assigned curricula/courses

---

*Last Updated: January 2025*
