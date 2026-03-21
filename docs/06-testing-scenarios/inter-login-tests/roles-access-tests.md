# Roles & Access Cross-Portal Tests

> Tests for role permissions affecting team member login experience.

---

## Overview

These tests verify that role permissions correctly control what team members can see and do when they log in to the SuperAdmin portal with their assigned role. The principle is: permissions defined in SuperAdmin must accurately reflect in the team member's portal experience.

**Key Concept**: Team members are SuperAdmin portal users with limited access based on their assigned role type. Unlike the main SuperAdmin account, they only see and can interact with modules and features enabled in their role.

---

## Sidebar Visibility Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| RA-001 | Only permitted modules in sidebar | Create role with only QB View, assign to member, member logs in | Member sidebar shows only Dashboard, Question Bank (no other modules) |
| RA-002 | All modules with full permissions | Assign role with all View permissions enabled | All modules visible in sidebar |
| RA-003 | Institutes visibility | Role has Institutes View enabled | Institutes visible in sidebar |
| RA-004 | Institutes hidden | Role has Institutes View disabled | Institutes NOT in sidebar |
| RA-005 | Exams visibility | Role has Exams View enabled | Exams visible in sidebar |
| RA-006 | Content Library visibility | Role has Content Library View enabled | Content Library visible in sidebar |
| RA-007 | Roles & Access visibility | Role has Roles View enabled | Roles & Access visible in sidebar |
| RA-008 | Question Bank visibility | Role has Question Bank View enabled | Question Bank visible in sidebar |
| RA-009 | Master Data visibility | Role has Master Data View enabled | Master Data visible in sidebar |

---

## Action Button Visibility Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| RA-010 | Create button with permission | Role has QB Create enabled | "Add Question" button visible in Question Bank |
| RA-011 | Create button without permission | Role has QB View only (no Create) | "Add Question" button hidden/not visible |
| RA-012 | Edit button with permission | Role has QB Edit enabled | Edit button visible on question cards |
| RA-013 | Edit button without permission | Role has QB View only (no Edit) | No Edit button on question cards |
| RA-014 | Delete button with permission | Role has QB Delete enabled | Delete button visible on question cards |
| RA-015 | Delete button without permission | Role has no QB Delete | No Delete button on question cards |
| RA-016 | Content Create button | Role has Content Create enabled | "Create Content" button visible |
| RA-017 | Content Create hidden | Role has Content View only | "Create Content" button hidden |
| RA-018 | Exam Create button | Role has Exams Create enabled | Create exam buttons visible |
| RA-019 | Exam Create hidden | Role has Exams View only | Create exam buttons hidden |

---

## Capability Visibility Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| RA-020 | AI Generation enabled | Role has QB + AI Generation capability | "Generate with AI" button visible in Question Bank |
| RA-021 | AI Generation disabled | Role has QB + NO AI capability | "Generate with AI" button hidden |
| RA-022 | PDF Upload enabled | Role has QB + PDF Upload capability | "Upload PDF" button visible in Question Bank |
| RA-023 | PDF Upload disabled | Role has QB + NO PDF capability | "Upload PDF" button hidden |
| RA-024 | Manual only capabilities | Role has QB + Manual only (no AI, no PDF) | Only "Add Question" visible, AI and PDF buttons hidden |
| RA-025 | All QB capabilities | Role has QB + all three capabilities enabled | Add Question, Generate with AI, Upload PDF all visible |
| RA-026 | Content AI enabled | Role has Content Library + AI capability | "AI Content Generator" button visible |
| RA-027 | Content AI disabled | Role has Content Library + NO AI capability | "AI Content Generator" button hidden |
| RA-028 | Content Manual only | Role has Content Library + Manual Upload only | Only "Create Content" visible, no AI Generator |

---

## Scope Restriction Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| RA-029 | All subjects visible | Role scope: All Subjects enabled | All subjects appear in subject filter dropdown |
| RA-030 | Specific subjects only | Role scope: Physics, Chemistry only selected | Only Physics, Chemistry in subject filter dropdown |
| RA-031 | Filtered questions by scope | Role scope: Physics only | Only Physics questions displayed in Question Bank |
| RA-032 | Create within scope | Role scope: Physics, member creates Physics question | Question saved successfully, visible to SuperAdmin |
| RA-033 | All classes visible | Role scope: All Classes enabled | All classes appear in class filter dropdown |
| RA-034 | Specific classes only | Role scope: Class 11, 12 only selected | Only Class 11, 12 in class filter dropdown |
| RA-035 | Content filtered by scope | Role scope: Physics only | Only Physics content displayed in Content Library |
| RA-036 | Exams filtered by scope | Role scope: Physics only | Only exams with Physics questions visible (if scope applies) |

---

## Exam Type Restriction Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| RA-037 | Grand Tests enabled | Role has Exams View + Grand Tests type enabled | Grand Tests tab visible and functional |
| RA-038 | Grand Tests disabled | Role has Exams View + Grand Tests type disabled | Grand Tests tab hidden or disabled |
| RA-039 | PYP enabled | Role has Exams View + Previous Year Papers type enabled | Previous Year Papers tab visible and functional |
| RA-040 | PYP disabled | Role has Exams View + Previous Year Papers type disabled | PYP tab hidden or disabled |
| RA-041 | Both types enabled | Role has both GT and PYP types enabled | Both tabs visible and functional |
| RA-042 | Can create GT only | Role has GT enabled but PYP disabled | Can create Grand Test, cannot create PYP |
| RA-043 | Can create PYP only | Role has PYP enabled but GT disabled | Can create PYP, cannot create Grand Test |

---

## Content Creation Attribution Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| RA-044 | Team member creates question | Member with QB Create creates a question | Question visible in SuperAdmin Question Bank |
| RA-045 | Team member creates content | Member with Content Create creates content | Content visible in SuperAdmin Content Library |
| RA-046 | Team member creates exam | Member with Exams Create creates Grand Test | GT visible in SuperAdmin Exams |
| RA-047 | SuperAdmin can edit member content | SuperAdmin views question created by member | Edit/Delete buttons available for SuperAdmin |
| RA-048 | Content follows visibility rules | Member creates with CBSE visibility | CBSE-assigned institutes can see the content |
| RA-049 | No exclusive content | Member creates content | Content NOT hidden from SuperAdmin or other team members |
| RA-050 | Another member can see content | Member A creates, Member B (with same permissions) views | Member B can see content created by Member A |

---

## Tier Management Permission Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| RA-051 | Tier Management enabled | Role has Institutes View + Tier Management toggle ON | Tier Management page/section accessible |
| RA-052 | Tier Management disabled | Role has Institutes View + Tier Management toggle OFF | Tier Management page/section not accessible or hidden |
| RA-053 | Can create tier | Role has Tier Management + Create permissions | Create Tier button visible and works |
| RA-054 | Can only view tiers | Role has Tier Management view only | View tiers but no create/edit buttons |
| RA-055 | Can edit tiers | Role has Tier Management + Edit permission | Edit button visible on tier cards |

---

## Users Module Permission Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| RA-056 | Users visible | Role has Users View enabled | Users visible in sidebar, can view user list |
| RA-057 | Can add users | Role has Users Create enabled | "Add User" button visible and works |
| RA-058 | Can edit users | Role has Users Edit enabled | Edit button visible on user rows |
| RA-059 | Cannot delete users | Role has no Users Delete | No delete button on user rows |

---

## Roles & Access Module Permission Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| RA-060 | Can view roles | Role has Roles View | Can see role list and member list |
| RA-061 | Can create roles | Role has Roles Create | "Create Role" button visible and works |
| RA-062 | Can assign members | Role has Roles Create or Edit | "Add Member" button works |
| RA-063 | Cannot delete roles | Role has no Roles Delete | No delete button on role cards |
| RA-064 | Recursive permission check | Member tries to give themselves more permissions | Should not be able to escalate own permissions |

---

## Edge Cases

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| RA-065 | Role change reflects immediately | Change member's role, member refreshes | Next page load shows new permissions |
| RA-066 | Member deactivated | Set member status to Inactive | Member cannot log in (invalid credentials or error) |
| RA-067 | Member reactivated | Set member status back to Active | Member can log in again |
| RA-068 | Delete role with members warning | Try to delete role that has assigned members | Warning shown, must reassign members first |
| RA-069 | Empty scope behavior | Role has QB but no subjects selected in scope | Behavior verified (either no content visible or all) |
| RA-070 | System role protected | Try to edit Super Admin role | Edit not allowed or critical permissions locked |
| RA-071 | System role delete prevented | Try to delete Super Admin role | Delete button not available or action blocked |
| RA-072 | Last Super Admin protected | Try to remove Super Admin role from last member | Action prevented with warning |

---

## Cross-Module Consistency Tests

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| RA-073 | Scope inherits to Exams | QB scope: Physics only, Exams: inherit from QB | Exams creation shows only Physics questions available |
| RA-074 | Scope inherits to Content | QB scope: Class 11 only, Content: inherit from QB | Content shows only Class 11 content |
| RA-075 | Custom scope on Exams | QB scope: Physics, Exams: custom scope Chemistry | Exams shows Chemistry questions (independent scope) |

---

*Last Updated: March 2025*
