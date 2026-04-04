# Exam Distribution & Reporting QA — End-to-End Testing Guide

> This guide covers the complete exam lifecycle — from creation in SuperAdmin, through distribution to institutes, assignment to student batches, student test attempts, and finally results reporting across all portals. It is written for testers who may be new to the platform. Read the entire "Before You Begin" section and the distribution model explanation before executing any scenario. Once you understand how exams flow through the system, the scenarios will feel intuitive.

---

## Before You Begin

> **First time testing this platform?** This section is essential. It defines every term you will encounter, tells you exactly where to find each feature in the UI, and lists everything you need to have ready before you start testing. Do not skip this section — the scenarios below assume you understand these concepts.

### Domain Glossary

| Term | What It Means | Example |
|------|---------------|---------|
| **Previous Year Paper (PYP)** | A digitised version of an actual exam paper from a previous year. PYPs are created exclusively by SuperAdmin by uploading a PDF, extracting questions, and tagging them to an exam pattern. Institutes and teachers cannot create PYPs — they can only view and assign them. | JEE Main 2024 Paper 1, NEET 2023 |
| **Grand Test (GT)** | A full-length mock test created by SuperAdmin that simulates a real competitive exam. Grand Tests follow a specific exam pattern (JEE Main, JEE Advanced, NEET) and are scheduled for a specific date and time. Like PYPs, they are created centrally and distributed to institutes. | JEE Main Mock Test #5, NEET Full Syllabus Test |
| **Institute-Created Exam** | An exam created by an institute admin directly — not received from SuperAdmin. These follow the same pattern-based or quick-test creation flow but exist only within that institute. They are assigned directly to batches. | "Physics Unit Test — Mechanics" created by Institute A |
| **Audience** | The SuperAdmin panel where PYPs and Grand Tests are assigned to specific institutes. This is the first distribution step. Think of it as "who is allowed to see this exam." If an institute is not in the Audience list, the exam is invisible to them — it simply does not exist from their perspective. | Audience for JEE Main 2024 PYP: Institute A, Institute B (Institute C is excluded) |
| **Batch Assignment** | The institute-level action of assigning an exam (PYP, GT, or institute-created) to specific student batches. This is the second distribution step. Even if an institute can see an exam, students cannot see it until it is explicitly assigned to their batch. | Institute A assigns JEE Main 2024 PYP to "JEE Batch A" and "JEE Batch B" |
| **Exam Pattern** | The structure and rules of an exam — number of subjects, sections per subject, question types, marking scheme, and duration. Each PYP and GT follows a specific pattern. | JEE Main: 3 subjects, 2 sections each (MCQ + Numerical), 75 questions, 180 minutes, +4/−1 MCQ, +4/0 Numerical |
| **Schedule** | The date and time when a Grand Test becomes available for students to take. Before the scheduled time, students can see the exam in their list but cannot start it — the Start button is disabled and a countdown is displayed. PYPs typically do not have schedules — they are available immediately once assigned. | GT scheduled for April 15, 2025 at 10:00 AM IST |
| **Test Player** | The full-screen exam interface where students take tests. It includes a timer, question navigation palette, subject tabs, mark-for-review functionality, and the submission flow. The Test Player's UI changes based on the exam pattern — JEE Main uses NTA-style interface, JEE Advanced uses IIT-style, NEET uses NTA NEET interface. | Student opens JEE Main 2024 PYP → NTA-style Test Player loads with Physics, Chemistry, Mathematics tabs |
| **Question Palette** | The grid of numbered buttons in the Test Player that shows the status of every question at a glance. Each question number is colour-coded: green (answered), red (not answered but visited), purple/orange (marked for review), and grey (not visited). | Palette shows Q1-Q25 for Physics section: 15 green, 5 red, 3 purple, 2 grey |
| **Subject-Scoped Reports** | Teachers see exam results only for the subjects they are assigned to teach — not the full exam. A Physics teacher sees only the Physics section results; Chemistry and Mathematics results are hidden from them. This is by design, not a bug. | Physics teacher for Batch A sees: Physics section scores, question-level analytics for Physics only |
| **Aggregate Reports** | Institute admins see the complete exam report — all subjects, all students, all batches. They can drill down by batch, by student, and by question. This is the highest-level view of exam performance. | Institute admin sees: overall scores, batch comparison, subject-wise breakdown, individual student drill-down |
| **Auto-Submit** | When the exam timer reaches zero, the system automatically submits whatever the student has answered so far. Unanswered questions are scored as zero marks (not negative). The student sees a submission confirmation and is redirected to the results page. | Student has answered 60 of 75 questions when time expires → 60 answers submitted, 15 scored as 0 |

### Where to Find Things in the UI

| Feature | Portal | Navigation Path |
|---------|--------|-----------------|
| PYP Creation | SuperAdmin | Sidebar → Exams → Previous Year Papers → Create PYP |
| Grand Test Creation | SuperAdmin | Sidebar → Exams → Grand Tests → Create Grand Test |
| Audience Management | SuperAdmin | Inside any PYP or GT → click "Audience" button |
| PYP List (received from SA) | Institute | Sidebar → Exams → Previous Year Papers tab |
| GT List (received from SA) | Institute | Sidebar → Exams → Grand Tests tab |
| Batch Assignment (for PYP/GT) | Institute | Inside any PYP or GT → click "Assign" or "Assign Batches" button |
| Student Tests Page | Student | Sidebar → Tests (or Home → Tests) |
| Grand Tests & PYPs Tab | Student | Tests page → "Grand Tests & PYPs" tab |
| Test Player | Student | Click "Start" on any available test → Instructions page → Begin |
| Test Results (Student) | Student | After submission → automatic redirect, or Tests → Completed tab → View Results |
| Exam Reports (Teacher) | Teacher | Sidebar → Reports → select batch → select exam |
| Exam Reports (Institute) | Institute | Sidebar → Reports → Exams section |

### Prerequisites for Testing

Before executing any scenario, ensure you have:

1. **Test accounts** — You need login credentials for:
   - 1 SuperAdmin account
   - 3 Institute admin accounts (we'll call them Institute A, Institute B, and Institute C)
   - At least 2 teacher accounts per institute, each assigned to different subjects (e.g., one Physics teacher and one Chemistry teacher)
   - At least 3 student accounts per institute, distributed across different batches

2. **Pre-configured institutes** — Each institute should have:
   - At least one curriculum and/or course assigned (e.g., Institute A has JEE Mains, Institute B has JEE Mains + NEET, Institute C has only NEET)
   - At least 3 batches (Batch A, Batch B, Batch C) with students enrolled
   - Teachers assigned to specific subjects and linked to specific batches

3. **Pre-configured exam content** — In SuperAdmin:
   - At least 2 PYPs created and published (e.g., JEE Main 2024 Paper 1, JEE Main 2023 Paper 1)
   - At least 2 Grand Tests created with different schedules
   - All exams should have questions with LaTeX formulas and images to test rich content rendering

4. **Understanding of the distribution chain** — Read the next section ("How Exam Distribution Works") carefully. Every scenario in this document tests some aspect of this chain.

---

## How Exam Distribution Works

The exam distribution model is a two-step chain with strict visibility rules at each step. Nothing is visible by default — every level of access requires explicit assignment. Here is the complete flow:

```
┌──────────────────┐
│   SUPER ADMIN     │  ← Creates PYPs and Grand Tests
│                    │    These exams exist only in SuperAdmin until shared
│                    │    No institute, teacher, or student can see them yet
└────────┬─────────┘
         │ Step 1: "Audience" — SA selects which institutes can see this exam
         │ This is a whitelist. If an institute is not in the list, the exam
         │ does not exist from their perspective. They cannot search for it,
         │ browse to it, or access it via direct URL.
         ▼
┌──────────────────┐
│   INSTITUTE       │  ← Sees only exams shared with them via Audience
│                    │    PYPs and GTs appear as read-only — no editing, no deleting
│                    │    Institute can PREVIEW content and ASSIGN to batches
│                    │    But students cannot see them yet — batch assignment is required
└────────┬─────────┘
         │ Step 2: "Assign to Batches" — Institute selects which batches get this exam
         │ Again, this is a whitelist. Only students in assigned batches can see the exam.
         │ Students in non-assigned batches within the same institute cannot see it.
         ▼
┌──────────────────┐
│   STUDENT         │  ← Sees only exams assigned to their specific batch
│                    │    For GTs with schedules: sees the exam but cannot start until scheduled time
│                    │    For PYPs: can start immediately once assigned
│                    │    Takes the exam in the Test Player
└────────┬─────────┘
         │ Step 3: Student submits exam → Results are generated
         │ Results flow BACK UP to three destinations:
         ▼
┌─────────────────────────────────────────────────────────────────┐
│ RESULTS DISTRIBUTION                                             │
│                                                                   │
│ Student ──► Sees their own full results (all subjects, all Qs)   │
│                                                                   │
│ Teacher ──► Sees ONLY their subject's results for their batches  │
│             Physics teacher sees Physics scores only              │
│             Chemistry teacher sees Chemistry scores only          │
│             They do NOT see each other's subject data             │
│                                                                   │
│ Institute ──► Sees EVERYTHING: all subjects, all students,       │
│               all batches, aggregate analytics, drill-down        │
└─────────────────────────────────────────────────────────────────┘
```

### The Golden Rules

1. **Visibility is always governed by explicit assignment, never implicit.** An exam shared with Institute A is invisible to Institute B — even if both institutes have the same curriculum, same pattern, same everything. The Audience list is the single source of truth.

2. **The two-step chain cannot be skipped.** SuperAdmin → Institute (via Audience) → Student (via Batch Assignment). An institute cannot assign an exam it hasn't received. A student cannot see an exam their batch hasn't been assigned.

3. **Read-only at the institute level.** Institutes can preview and assign SuperAdmin exams, but they cannot edit questions, change marking schemes, or modify any content. The exam is a sealed package.

4. **Reports are subject-scoped for teachers.** A teacher never sees the full exam results — only the sections that match their assigned subjects. This is a feature, not a limitation. It ensures teachers focus on their domain.

5. **Complete isolation between institutes.** Even if the same exam is shared with Institute A and Institute B, the two institutes' data is completely separate. Institute A's batch assignments, student responses, and reports have zero visibility into Institute B's data.

---

## Test Scenarios

Each scenario below describes a situation in detail — what to set up, what to do, and what to verify. The descriptions are deliberately thorough because the person testing may not be familiar with the platform. If something seems obvious, it's stated anyway — obvious things are where bugs hide.

---

### Group A — SuperAdmin to Institute: PYP Distribution

> **What this group tests:** Whether the Audience mechanism correctly controls which institutes can see a PYP. These scenarios verify that sharing works when it should, and — critically — that exams are invisible when they should be invisible.

**A1 — PYP Shared with Two of Three Institutes**

*Setup:* Log in as SuperAdmin. Create a new PYP — for example, "JEE Main 2024 Paper 1." Upload the PDF, extract questions, review them, and publish the PYP. Now go to the Audience panel for this PYP and select Institute A and Institute B. Do NOT select Institute C. Save.

*What to verify:*
- Log in as Institute A admin. Go to Exams → Previous Year Papers tab. The "JEE Main 2024 Paper 1" should be visible in the list. Note the exam name, year, and pattern displayed.
- Log in as Institute B admin. Go to the same location. The same PYP should be visible with identical details.
- Log in as Institute C admin. Go to the same location. The PYP should NOT be visible — not in the list, not via search, not anywhere. If Institute C can see this PYP in any way, that is a critical bug.

*Why this matters:* This is the most fundamental distribution test. If this fails, the entire Audience mechanism is broken. In a real-world scenario, institutes pay for access to specific content — showing exams to non-paying institutes would be a business and trust violation.

*Common failure points:*
- The PYP appears for all institutes regardless of Audience selection (Audience filter not applied)
- The PYP appears for Institute C after a page refresh or cache clear (caching bug)
- The PYP count or year grouping is wrong at one institute but correct at another (data transformation bug)

---

**A2 — Two PYPs with Different Audience Splits**

*Setup:* In SuperAdmin, create two PYPs:
- PYP-1: "JEE Main 2024 Paper 1" → Audience: Institute A, Institute B
- PYP-2: "JEE Main 2024 Paper 2" → Audience: Institute A, Institute C

*What to verify:*
- Institute A should see BOTH PYP-1 and PYP-2 (they are in both audiences).
- Institute B should see ONLY PYP-1. PYP-2 must be invisible.
- Institute C should see ONLY PYP-2. PYP-1 must be invisible.
- Verify the count of PYPs shown to each institute matches expectations (A sees 2, B sees 1, C sees 1).

*Why this matters:* This tests that the Audience filter is applied per-exam, not globally. A common bug is when sharing one exam "opens up" visibility for other exams from the same pattern or year.

*Common failure points:*
- Both PYPs appear for all institutes (global visibility leak)
- The count shows correctly but clicking into the wrong PYP shows content (list vs detail mismatch)
- After creating PYP-2, PYP-1's audience is accidentally modified (audience state corruption)

---

**A3 — PYP Shared with All Institutes**

*Setup:* Create a PYP and in the Audience panel, select all available institutes (A, B, and C). Save.

*What to verify:*
- Log in to each institute one by one. All three should see the PYP.
- Verify the PYP details (name, year, pattern, question count) are identical across all three.
- If a fourth institute is created later and NOT added to the Audience, it should NOT see this PYP — "shared with all" means "shared with the institutes that were selected," not "auto-shared with every institute that will ever exist."

*Why this matters:* Tests the "select all" flow and ensures it doesn't create an automatic future-sharing behaviour.

---

**A4 — PYP Audience Revoked After Initial Share**

*Setup:* Create a PYP and share with Institute A and Institute B. Verify both can see it. Now go back to the Audience panel and REMOVE Institute B from the list. Save.

*What to verify:*
- Institute A should still see the PYP.
- Institute B should NO LONGER see the PYP. It should disappear from their Previous Year Papers list completely.
- If Institute B had already assigned this PYP to batches before the revocation — what happens? This is a critical edge case. Ideally, the assignment should also be removed, and students who had access should lose it. Verify this explicitly.

*Why this matters:* Audience revocation must be immediate and complete. In a real scenario, a SuperAdmin might accidentally share a PYP with the wrong institute and need to revoke it urgently. If revocation doesn't work, confidential exam content could remain exposed.

*Common failure points:*
- The PYP remains visible to Institute B after revocation (revocation not applied)
- The PYP disappears from Institute B's list but the previously assigned batches still have access (cascade failure)
- Institute B's students who already started the exam mid-test — verify behaviour (should they be kicked out? should the attempt be voided?)

---

**A5 — Read-Only Enforcement at Institute Level**

*Setup:* Share any PYP with Institute A. Log in as Institute A admin and navigate to the PYP.

*What to verify:*
- There should be NO "Edit" button on the PYP.
- There should be NO "Delete" button or option.
- There should be NO way to modify the questions, marking scheme, or any exam configuration.
- The only actions available should be: "Preview" (to view the content) and "Assign" (to assign to batches).
- Right-clicking, inspecting elements, or attempting to navigate to an edit URL directly should not bypass this restriction.

*Why this matters:* PYPs are standardised official papers. If an institute could modify questions, it would compromise exam integrity. This is a security test as much as a UI test.

---

**A6 — Content Consistency Between SuperAdmin and Institute Preview**

*Setup:* In SuperAdmin, note the exact details of a PYP: total question count, number of subjects, sections per subject (e.g., Section A: MCQ, Section B: Numerical), marking scheme per section, and pick 2-3 specific questions that have LaTeX formulas and images.

*What to verify:*
- At Institute preview, the total question count must match exactly.
- Subject tabs must match (Physics, Chemistry, Mathematics for JEE Main).
- Section structure must match (Section A, Section B per subject).
- Marking scheme must match (+4/−1 for MCQ, +4/0 for Numerical).
- The specific LaTeX questions you noted — do the formulas render correctly? Compare visually with SuperAdmin.
- The image-based questions — do images load and display at the correct size?
- Check pagination if the PYP has many questions — can you navigate through all of them?

*Why this matters:* If content gets corrupted during distribution, students will take a different exam than what was intended. Even a single missing formula or broken image can invalidate a question.

---

**A7 — Year-Wise Grouping at Institute Level**

*Setup:* Create 3 PYPs for the same pattern: "JEE Main 2025," "JEE Main 2024," and "JEE Main 2023." Share all three with Institute A.

*What to verify:*
- At Institute A, the PYPs should be grouped into year-wise accordions: 2025, 2024, 2023.
- The most recent year (2025) should appear first (or at the top).
- Expanding a year shows only the PYPs from that year.
- The grouping and ordering should match what SuperAdmin sees.

*Why this matters:* Students and institute staff use year-wise grouping to find specific papers quickly. Incorrect grouping (e.g., a 2024 paper appearing under 2023) would cause confusion during exam preparation.

---

**A8 — Curriculum Mismatch: JEE PYP Sent to NEET-Only Institute**

*Setup:* Institute C is configured with only NEET curriculum (no JEE). In SuperAdmin, create a JEE Main PYP and include Institute C in the Audience.

*What to verify:*
- Does the SuperAdmin panel allow this? Ideally, the Audience selection should either warn or block sharing a JEE PYP with a NEET-only institute.
- If it does allow it: log in as Institute C. Does the PYP appear? If it appears, can students take it? This is a grey area — document the actual behaviour.
- If it blocks it: verify the error message is clear and helpful.

*Why this matters:* This is an edge case that tests whether the system has curriculum-awareness in the distribution layer. A JEE paper appearing in a NEET-only institute would confuse staff and students. Even if the system allows it (because PYPs might be useful cross-curriculum), it should be a deliberate decision, not an oversight.

---

**A9 — Duplicate Audience Assignment**

*Setup:* Create a PYP. Share it with Institute A. Save. Open the Audience panel again and share it with Institute A a second time. Save.

*What to verify:*
- Institute A should see the PYP exactly once — not duplicated.
- No error should occur during the second save.
- The PYP list at Institute A should not show two entries for the same paper.

*Why this matters:* Duplicate entries in exam lists confuse testers and students alike. They also indicate potential database-level issues (missing unique constraints).

---

**A10 — PYP Created with Empty Audience**

*Setup:* Create a PYP in SuperAdmin. Publish it. But do NOT open the Audience panel — leave it with no institutes selected.

*What to verify:*
- The PYP should exist in SuperAdmin's PYP list.
- No institute should see it — log in to A, B, and C and verify.
- The PYP should have some visual indicator in SuperAdmin that it has not been shared yet (e.g., "No Audience" badge or "0 Institutes" count).

*Why this matters:* A published but unshared PYP is a common real-world state — the SuperAdmin creates papers in advance and shares them later. The system must handle this gracefully.

---

**A11 — PYP with Zero Questions**

*Setup:* In SuperAdmin, attempt to create a PYP but do not add any questions (or add questions and then remove them all). Try to publish and share it.

*What to verify:*
- The system should ideally block publishing a PYP with zero questions — showing a clear error message like "Cannot publish a paper with no questions."
- If it allows publishing: sharing with an institute should still show it, but when previewed, it should show an empty state — not a crash or error page.
- If it allows students to take it: the Test Player should handle the empty exam gracefully (not an infinite spinner or a crash).

*Why this matters:* This is a defensive test. Empty exams should be caught at creation, but if they slip through, the downstream experience should not break.

---

**A12 — Multiple PYPs, Same Year, Different Patterns**

*Setup:* Create two PYPs for the same year but different patterns:
- "JEE Main 2025 Paper 1" (JEE Main pattern)
- "JEE Advanced 2025 Paper 1" (JEE Advanced pattern)

Share both with Institute A.

*What to verify:*
- Both PYPs should appear under the 2025 year group, but as separate entries.
- The pattern label (JEE Main vs JEE Advanced) should be clearly visible on each entry.
- Clicking into each should load the correct pattern-specific questions and structure.
- They should not be merged or confused — they are two distinct exams.

*Why this matters:* A common real-world scenario. JEE Main and JEE Advanced have completely different structures (number of sections, question types, marking schemes). Mixing them up would be a serious error.

---

**A13 — Bulk Audience Assignment: Multiple PYPs Shared at Once**

*Setup:* In SuperAdmin, create 10 PYPs (or use 10 existing ones). Now go to the Audience panel and attempt to share all 10 with Institute A in rapid succession — or, if the UI supports it, select multiple PYPs and share them to Institute A in a single bulk operation.

*What to verify:*
- Log in as Institute A admin. Go to Exams → Previous Year Papers tab. All 10 PYPs should be visible — not 9, not 11, exactly 10.
- Verify that each PYP has the correct name, year, and pattern — no data got swapped or mixed up during the bulk operation.
- Check the year-wise accordion grouping — if the 10 PYPs span multiple years (2023, 2024, 2025), each should appear under the correct year group with the correct count.
- If the UI does NOT support bulk sharing (i.e., you must share one PYP at a time), verify that sharing 10 PYPs sequentially does not cause any of the earlier shares to be overwritten or lost. After sharing PYP #10, go back and confirm PYP #1 is still visible at the institute.
- Performance check: does the Institute's PYP list load within a reasonable time (under 5 seconds) with 10+ PYPs? Scroll through the entire list — no lazy-loading gaps or missing entries.

*Why this matters:* In real-world usage, SuperAdmins share dozens of PYPs and Grand Tests at the start of an academic year. If bulk operations silently drop some exams or corrupt data during rapid-fire sharing, institutes will have incomplete content — and the bug may go unnoticed for weeks.

*Common failure points:*
- Race condition: sharing PYP #5 overwrites the audience list from PYP #4 (if the system uses a single audience list per action instead of per-exam)
- The institute's PYP list shows a stale count until a hard refresh (caching issue)
- The 10th PYP appears but the 1st one disappears (FIFO queue bug in the audience assignment)

---

### Group B — SuperAdmin to Institute: Grand Test Distribution

> **What this group tests:** The same Audience-based distribution as Group A, but for Grand Tests. Grand Tests add an additional layer of complexity: they have schedules. These scenarios verify that schedule information is preserved during distribution and that time-based access controls work correctly.

**B1 — GT Shared with Specific Institutes**

*Setup:* In SuperAdmin, create a Grand Test (e.g., "JEE Main Full Mock #1") with a future schedule (e.g., tomorrow at 10:00 AM). Open the Audience panel and select Institute A and Institute B. Do NOT select Institute C. Save.

*What to verify:*
- Institute A sees the GT with the correct name, pattern, and scheduled date/time displayed.
- Institute B sees the same GT with identical details.
- Institute C does NOT see the GT anywhere.
- The schedule date and time shown at the institute level matches exactly what was set in SuperAdmin (account for timezone display if applicable).

*Why this matters:* Same as A1 — fundamental distribution test. The addition here is verifying schedule data integrity during distribution.

*Common failure points:*
- Schedule shows the wrong time (timezone conversion error)
- Schedule shows "No Date" even though one was set (data field not propagated)
- GT appears for Institute C (audience filter failure)

---

**B2 — GT Shared with All Institutes**

*Setup:* Create a GT and share with all institutes via the Audience panel.

*What to verify:*
- All institutes see the GT.
- Schedule is consistent across all.
- A newly created institute (after the GT was shared) should NOT automatically receive this GT.

*Why this matters:* Mirrors A3. Confirms "select all" is a snapshot, not a live subscription.

---

**B3 — GT Audience Revoked After Initial Share**

*Setup:* Create a GT and share with Institute A and B. Verify both see it. Now remove Institute B from the Audience. Save.

*What to verify:*
- Same verification as A4, but with the additional GT-specific check:
- If Institute B had assigned this GT to batches AND students were waiting for the scheduled start time — what happens when the audience is revoked? Does the GT disappear from the students' upcoming tests list? Document the actual behaviour.

*Why this matters:* GT revocation is more sensitive than PYP because students may be actively preparing for a scheduled test. Sudden disappearance needs to be handled gracefully — ideally with some indication rather than silent removal.

---

**B4 — Multiple GTs with Different Audience Splits**

*Setup:* Create two GTs:
- GT-1: "JEE Mock #1" → Audience: Institute A, Institute B → Schedule: April 15
- GT-2: "JEE Mock #2" → Audience: Institute A, Institute C → Schedule: April 20

*What to verify:*
- Institute A sees both GTs with correct individual schedules (April 15 and April 20).
- Institute B sees only GT-1 with the April 15 schedule.
- Institute C sees only GT-2 with the April 20 schedule.
- No GT shows the wrong schedule at any institute.

---

**B5 — GT Read-Only and Schedule Display at Institute**

*Setup:* Share any GT (with a future schedule) with Institute A. Log in as Institute A admin.

*What to verify:*
- The GT shows with the scheduled date and time prominently displayed.
- No Edit or Delete buttons are available (same read-only rules as PYPs).
- The only available actions are Preview and Assign.
- The schedule cannot be changed by the institute — if there's a schedule field, it should be read-only or non-editable.

---

**B6 — Multiple GTs with Different Schedules at Same Institute**

*Setup:* Share 3 GTs with Institute A, each with a different schedule:
- GT-A: April 10 at 9:00 AM
- GT-B: April 15 at 2:00 PM
- GT-C: April 20 at 10:00 AM

*What to verify:*
- All three GTs appear in the Institute's GT list.
- Each shows its own correct schedule — GT-A shows April 10, GT-B shows April 15, GT-C shows April 20.
- Schedules are not swapped or mixed up between GTs.
- If the list is sorted by date, verify the sort order is correct.

---

**B7 — GT Shared with Curriculum-Mismatched Institute**

*Setup:* Create a JEE Main pattern GT. Share it with Institute C, which has only NEET curriculum.

*What to verify:* Same verification as A8 — does the system allow it? Does the GT appear at the institute? Document the behaviour. If it appears, can the institute assign it to NEET batches? This would be a mismatch.

---

**B8 — GT Created Without a Schedule**

*Setup:* In SuperAdmin, create a GT but do NOT set a schedule (leave the date/time empty or skip that step). Share with Institute A.

*What to verify:*
- Does SuperAdmin allow creating a GT without a schedule?
- If yes: how does it appear at the institute? Is there a "No Date" label, or "Available Immediately," or is the date field blank?
- If the institute assigns this to a batch: can students start it immediately (since there's no schedule restriction)?
- If no (system blocks it): verify the error message is clear.

*Why this matters:* Scheduleless GTs are an edge case that can either be a feature (immediate availability) or a bug (missing data). The behaviour should be intentional and documented.

---

**B9 — GT Audience Changed After Institute Already Assigned to Batches**

*Setup:* 
1. SuperAdmin creates GT and shares with Institute A.
2. Institute A assigns the GT to Batch X and Batch Y.
3. SuperAdmin goes back to the Audience panel and REMOVES Institute A.

*What to verify:*
- Does the GT disappear from Institute A's list?
- Do the batch assignments (Batch X and Batch Y) get automatically removed?
- Do students in Batch X and Batch Y lose access to the GT?
- If any students had already started the GT (if the schedule had passed), what happens to their in-progress or completed attempts?

*Why this matters:* This is a cascade test. Audience revocation must cascade all the way down to students. Orphaned batch assignments (pointing to a GT the institute can no longer see) would cause data integrity issues.

---

**B10 — Two GTs, Same Pattern, Same Date, Different Times**

*Setup:* Create two GTs:
- GT-Morning: "JEE Mock — Morning Session" → Schedule: April 15 at 9:00 AM
- GT-Afternoon: "JEE Mock — Afternoon Session" → Schedule: April 15 at 2:00 PM

Share both with Institute A.

*What to verify:*
- Both appear as separate entries at Institute A.
- Each shows its correct time (9:00 AM vs 2:00 PM).
- They are not merged, collapsed, or confused as a single entry.
- If assigned to the same batch, students should see two separate test entries.

---

### Group C — Institute to Student: Batch Assignment

> **What this group tests:** Whether the Batch Assignment mechanism correctly controls which students can see and access an exam. These scenarios verify that the second step of the distribution chain works correctly — exams are visible only to students in explicitly assigned batches.

**C1 — Exam Assigned to One Batch Only**

*Setup:* Institute A has received a PYP from SuperAdmin. Institute A admin clicks "Assign" on the PYP and selects only Batch A. Saves.

*What to verify:*
- Log in as a student in Batch A. Go to Tests page → Grand Tests & PYPs tab. The PYP should be visible and available to start.
- Log in as a student in Batch B (same institute). Go to the same page. The PYP should NOT be visible — not in the list, not via search.
- Log in as a student in Batch C (same institute). Same check — PYP must be invisible.

*Why this matters:* This is the most fundamental batch isolation test. If a student in Batch B can see an exam assigned only to Batch A, the batch assignment mechanism is broken. In practice, different batches may be at different stages of preparation, and showing them an exam they're not ready for creates confusion and unfair advantage.

*Common failure points:*
- All students in the institute see the PYP regardless of batch (batch filter not applied)
- The PYP appears in the wrong tab (e.g., under "Subject Tests" instead of "Grand Tests & PYPs")
- The PYP appears for Batch B students but the Start button is broken (partial visibility bug)

---

**C2 — Exam Assigned to Two of Three Batches**

*Setup:* Institute A assigns the same PYP to Batch A and Batch B but NOT Batch C.

*What to verify:*
- Student in Batch A sees the PYP — can start and take it.
- Student in Batch B sees the same PYP — can start and take it.
- Student in Batch C does NOT see the PYP.
- Verify the PYP details (name, pattern, question count) are identical for Batch A and Batch B students.

---

**C3 — Exam Assigned to All Batches**

*Setup:* Institute A assigns the PYP to all available batches.

*What to verify:*
- Every student in the institute sees the PYP.
- A new batch created AFTER the assignment — does it automatically get the exam? It should NOT (unless explicitly assigned). Verify this.

---

**C4 — Two Exams with Different Batch Assignments**

*Setup:* Institute A has two PYPs:
- PYP-1: Assigned to Batch A
- PYP-2: Assigned to Batch B

*What to verify:*
- Student in Batch A sees ONLY PYP-1, not PYP-2.
- Student in Batch B sees ONLY PYP-2, not PYP-1.
- A student in Batch C (no assignments) sees neither.

*Why this matters:* Tests per-exam isolation at the batch level. This is the batch equivalent of A2.

---

**C5 — Exam Unassigned from Batch After Initial Assignment**

*Setup:* Institute A assigns a PYP to Batch A. Verify students in Batch A can see it. Now, the Institute A admin goes back and removes Batch A from the assignment (unassigns).

*What to verify:*
- Students in Batch A should NO LONGER see the PYP on their Tests page.
- If any student had already started the exam but not submitted — what happens? Is their progress lost? Are they kicked out? Document the actual behaviour.
- If any student had already completed the exam — do their results survive? Can they still see their results in the Completed tab, or does the entire exam disappear from their history?

*Why this matters:* Unassignment is a common real-world action (e.g., wrong batch was selected, or the batch isn't ready yet). The system must handle it cleanly without causing data loss for students who already interacted with the exam.

---

**C6 — Scheduled GT: Student Sees Countdown Before Start Time**

*Setup:* Institute A assigns a GT with a future schedule (e.g., tomorrow at 10:00 AM) to Batch A.

*What to verify:*
- Log in as a student in Batch A. Go to Tests page.
- The GT should be visible in the list.
- It should show the scheduled date and time (e.g., "Available at April 15, 10:00 AM").
- The "Start" button should be DISABLED or replaced with a countdown.
- If the student tries to click Start (if the button is somehow enabled) — the system should block the attempt with a clear message.
- On mobile: verify the countdown/schedule display works on smaller screens.

---

**C7 — Scheduled GT: Start Button Activates When Schedule Arrives**

*Setup:* This is a continuation of C6. Wait until the scheduled time arrives (or, if possible, ask a SuperAdmin to change the schedule to the current time).

*What to verify:*
- After the scheduled time: refresh the Tests page.
- The "Start" button should now be ACTIVE/ENABLED.
- The student should be able to click Start and enter the Test Player.
- The countdown or "Available at" label should be replaced with "Start Now" or equivalent.

*Common failure points:*
- The Start button remains disabled even after the schedule time (time comparison bug, timezone mismatch)
- The page requires a hard refresh — the button doesn't activate on a soft refresh (real-time update issue)
- The schedule check is done client-side only, allowing manipulation by changing the device clock

---

**C8 — GT with Past Schedule: Immediate Availability**

*Setup:* Institute A assigns a GT whose schedule has already passed (e.g., the GT was scheduled for yesterday).

*What to verify:*
- Student should be able to start the exam immediately — no countdown, no disabled button.
- The schedule should show as "Available Now" or simply not display a future date.

---

**C9 — Same GT Assigned Across Two Institutes: Complete Isolation**

*Setup:*
1. SuperAdmin shares a GT with Institute A and Institute B.
2. Institute A assigns it to Batch X (Institute A's batch).
3. Institute B assigns it to Batch Y (Institute B's batch).

*What to verify:*
- Student in Institute A's Batch X can take the GT. Their responses are recorded.
- Student in Institute B's Batch Y can take the same GT. Their responses are recorded separately.
- Institute A's admin can see results ONLY for their students (Batch X). They should NOT see Batch Y's data.
- Institute B's admin can see results ONLY for their students (Batch Y). They should NOT see Batch X's data.
- No cross-institute data leakage in any report, analytics, or student list.

*Why this matters:* This is one of the most critical isolation tests. Institutes are separate organisations — any data leakage between them is a privacy violation and a critical bug.

---

**C10 — Batch with No Exams Assigned: Empty State**

*Setup:* Ensure Batch C in Institute A has no exams assigned — no PYPs, no GTs, no institute-created exams.

*What to verify:*
- Student in Batch C goes to Tests page.
- The page should show a clean empty state — a message like "No tests available" or "No exams assigned yet."
- It should NOT show an error page, a spinner that never resolves, or a blank white screen.
- The empty state should be helpful, not confusing.

---

**C11 — Student Added to Batch AFTER Exam Was Assigned**

*Setup:*
1. Institute A assigns a PYP to Batch A (Batch A currently has students S1, S2, S3).
2. A new student S4 is added to Batch A after the exam assignment.

*What to verify:*
- Student S4 should see the PYP on their Tests page — just like S1, S2, and S3.
- The exam assignment is to the BATCH, not to individual students. Any student who joins the batch should automatically inherit all batch-level exam assignments.
- If S4 cannot see the exam, that indicates the assignment was snapshot-based (tied to students present at assignment time) rather than batch-based — which would be a bug.

*Why this matters:* New students join batches throughout the year. They should have access to the same exams as existing students without requiring the institute to re-assign.

---

**C12 — Student Moved from One Batch to Another**

*Setup:*
1. Student S1 is in Batch A. Batch A has PYP-1 assigned.
2. Student S1 is moved from Batch A to Batch B. Batch B has PYP-2 assigned.

*What to verify:*
- After the move: S1 should see PYP-2 (Batch B's exam) on their Tests page.
- S1 should NOT see PYP-1 (Batch A's exam) anymore — unless they already completed it, in which case it may appear in completed history.
- If S1 had started PYP-1 but not submitted — what happens? Is the in-progress attempt voided? Can they still access it? Document the behaviour.

---

**C13 — Exam Pattern Filter on Student Tests Page**

*Setup:* A student's batch has been assigned multiple exams of different patterns:
- 2 JEE Main PYPs
- 1 JEE Advanced PYP
- 1 NEET Grand Test (if the batch has NEET curriculum)
- 1 institute-created subject test

*What to verify:*
- Go to the student's Tests page. All assigned exams should be visible in their respective tabs (Grand Tests & PYPs tab for PYPs and GTs, Subject Tests tab for institute-created exams).
- If a pattern filter exists on the Tests page (e.g., a dropdown or chip filter for "JEE Main," "JEE Advanced," "NEET"): select "JEE Main" — only the 2 JEE Main PYPs should appear. The JEE Advanced and NEET exams should be hidden.
- Switch the filter to "JEE Advanced" — only the 1 JEE Advanced PYP should appear.
- Switch to "NEET" — only the NEET GT should appear.
- Clear the filter (select "All" or remove the filter) — all exams should reappear.
- Verify the filter count badge (if any) matches the number of exams shown (e.g., "JEE Main (2)").
- Verify the filter does NOT affect the Subject Tests tab — institute-created exams should remain visible regardless of the pattern filter applied to the Grand Tests & PYPs tab.
- Edge case: if the student's batch has only one pattern (e.g., all JEE Main), does the filter still work? It should — showing the same results whether filtered or not.

*Why this matters:* Students preparing for JEE Main don't want to scroll through NEET papers to find their practice tests. The pattern filter is a key usability feature, especially when a batch has 20+ exams assigned. If the filter shows wrong results or hides exams that should be visible, students will miss tests.

*Common failure points:*
- The filter shows all exams regardless of selection (filter not applied to the query)
- The filter hides exams from the wrong tab (e.g., filtering on Grand Tests tab also hides Subject Tests)
- After applying and clearing a filter, some exams don't reappear (state not reset properly)
- The filter dropdown shows patterns that the student has no exams for (e.g., "NEET" appears even though no NEET exams are assigned — this is confusing but not critical)

---

### Group D — Student Test Attempt

> **What this group tests:** The student's exam-taking experience from start to finish. These scenarios verify the Test Player's functionality, including pattern-specific UI, navigation, timer, submission, and edge cases like browser crashes and network issues. This is where the student directly interacts with exam content, so every detail matters.

**D1 — Full Happy Path: Complete Exam Attempt**

*Setup:* Log in as a student whose batch has a PYP assigned (one that is currently available, not scheduled for the future).

*What to verify — step by step:*

1. **Finding the exam:** Go to Tests page. Find the PYP in the "Grand Tests & PYPs" tab. It should show the exam name, pattern, number of questions, duration, and a "Start" button.

2. **Instructions page:** Click Start. An instructions page should appear showing:
   - Exam name and pattern
   - Total duration
   - Total number of questions
   - Marking scheme (+4/−1 for MCQ, +4/0 for Numerical, etc.)
   - Any specific instructions (e.g., "Section B: Attempt any 5 out of 10")
   - A "Begin Exam" or equivalent button

3. **Test Player loads:** Click Begin. The Test Player should load with:
   - The correct pattern-specific UI (JEE Main → NTA-style, JEE Advanced → IIT-style, NEET → NTA NEET-style)
   - Subject tabs at the top (Physics, Chemistry, Mathematics for JEE; add Biology for NEET)
   - A timer counting down from the total duration
   - A question displayed with its text, options, and marks indicator

4. **Question display:** Verify the first question:
   - Question text renders correctly (no broken HTML, no raw LaTeX code visible)
   - If the question has a LaTeX formula — it should render as a proper mathematical expression
   - If the question has an image — it should load and display at a reasonable size
   - MCQ options should be clearly listed with radio buttons (for single correct) or checkboxes (for multiple correct)

5. **Navigation — Next/Previous:** Click "Next" to go to Question 2. Click "Previous" to go back to Question 1. Both should work smoothly without page reload or data loss. The answer you selected on Question 1 should be preserved when you come back.

6. **Subject switching:** Click on a different subject tab (e.g., switch from Physics to Chemistry). The question should change to the first question of the new subject. Navigate back to Physics — your previous position and answers should be preserved.

7. **Mark for Review:** On any question, click "Mark for Review." The question number in the palette should change colour (typically purple or orange) to indicate it's marked. Navigate away and come back — the mark should persist.

8. **Question Palette:** Open the question palette (the grid of numbered buttons). Verify the colour coding:
   - Green: Questions you've answered
   - Red: Questions you've visited but not answered
   - Purple/Orange: Questions marked for review
   - Grey: Questions you haven't visited yet
   - The counts at the bottom should match (e.g., "Answered: 15, Not Answered: 10, Marked: 3, Not Visited: 47")

9. **Clear Response:** Answer a question, then click "Clear Response." The answer should be deselected and the question should revert to "Not Answered" status in the palette.

10. **Timer:** Verify the timer is counting down in real-time. It should show hours:minutes:seconds or minutes:seconds depending on the remaining time. The timer should be visible at all times.

11. **Submission:** Answer several questions (doesn't need to be all). Click "Submit." A confirmation dialog should appear showing:
    - Number of questions answered
    - Number of questions unanswered
    - Number marked for review
    - A clear warning that submission is final
    - "Confirm Submit" and "Go Back" buttons

12. **Post-submission:** Click Confirm Submit. The exam should submit successfully and redirect to the results page (or show a success message).

*Why this matters:* This is the most important scenario in this entire document. If the exam-taking experience is broken, nothing else matters — students can't complete their tests.

---

**D2 — Unauthorised Access: Student from Non-Assigned Batch**

*Setup:* A PYP is assigned to Batch A only. Get the exam URL (the direct link to start or view the exam). Log in as a student from Batch B.

*What to verify:*
- Try navigating to the exam URL directly. The student should be blocked — either redirected to an error page or shown an "Access Denied" message.
- The exam should NOT load in the Test Player.
- This tests that access control is enforced server-side, not just by hiding the UI button. A student cannot bypass batch restrictions by guessing the URL.

*Common failure points:*
- The exam loads if the student has the direct URL (client-side-only access control)
- The exam loads but with empty questions (partial access control failure)
- An error occurs but it's a generic "500 Internal Server Error" instead of a clear access denial message

---

**D3 — Timer Expiry: Auto-Submit**

*Setup:* Start an exam with a short duration (or wait until the timer runs very low).

*What to verify:*
- When the timer reaches 0:00, the exam should auto-submit.
- The student should see a clear notification: "Time's up! Your exam has been submitted automatically."
- All answered questions should be included in the submission.
- Unanswered questions should be scored as zero marks — NOT as negative marks.
- The student should be redirected to the results page.
- The auto-submission should happen without the student clicking anything.

*Common failure points:*
- Timer reaches zero but nothing happens — the student can continue answering (timer not enforced)
- Timer reaches zero and the page crashes instead of submitting
- Auto-submitted exam shows incorrect scores because of timing edge cases

---

**D4 — Mark for Review: Palette Accuracy**

*Setup:* During an exam, deliberately create all four question states:
- Answer Question 1 (green)
- Visit Question 2 but don't answer (red)
- Answer Question 3 and mark for review (marked + answered)
- Don't visit Question 4 at all (grey)

*What to verify:*
- Open the question palette. Each question should show the correct colour/status.
- The count summary should be accurate.
- Click on a marked question from the palette — it should navigate directly to that question.
- After reviewing the marked question and answering it, the status should update (from "marked" to "answered" or "marked + answered" depending on the design).

---

**D5 — Clear Response Behaviour**

*Setup:* During an exam, answer Question 5 by selecting Option B. Then click "Clear Response."

*What to verify:*
- Option B should be deselected — no option should be highlighted.
- In the palette, Question 5 should change from "Answered" (green) to "Not Answered but Visited" (red).
- If you navigate away and come back, the cleared state should persist — Option B should not reappear.
- Clearing should work for all question types (MCQ Single, MCQ Multiple, Numerical).

---

**D6 — Submit with Unanswered Questions: Confirmation Dialog**

*Setup:* During an exam, answer only 10 out of 75 questions. Click Submit.

*What to verify:*
- The confirmation dialog should clearly show: "Answered: 10, Unanswered: 65, Marked for Review: [count]."
- There should be a prominent warning: "You have 65 unanswered questions. Are you sure you want to submit?"
- Clicking "Go Back" should return to the exam — no data should be lost.
- Clicking "Confirm Submit" should submit the exam with only 10 answered questions.

---

**D7 — Browser Refresh During Exam**

*Setup:* Start an exam. Answer 10 questions. Now hard-refresh the browser (Ctrl+R or F5).

*What to verify:*
- After refresh, the Test Player should reload with your exam still active.
- All 10 answers you previously selected should be preserved — not lost.
- The timer should continue from where it was (not restart from the beginning).
- The question palette should still show the correct statuses for all questions.

*Common failure points:*
- All answers are lost on refresh (state not saved to server periodically)
- The timer restarts from the full duration (timer synced from server, not local)
- The exam shows "Already submitted" error even though it wasn't submitted
- The exam loads but shows a blank question (question state not restored)

---

**D8 — Re-Attempt Prevention: Student Tries to Take Exam Twice**

*Setup:* Complete and submit an exam as a student. After the results page, go back to the Tests page.

*What to verify:*
- The exam should appear in a "Completed" state — either in a separate "Completed" tab or with a "Completed" badge.
- The "Start" button should be replaced with "View Results" or similar.
- If the student tries to navigate to the exam's start URL directly — they should be blocked from starting a new attempt.
- Only one submission per student per exam should exist.

---

**D9 — Network Disconnection During Exam**

*Setup:* Start an exam. Answer a few questions. Then disconnect from the internet (turn off WiFi or enable airplane mode).

*What to verify:*
- The Test Player should show a network error notification (e.g., "You are offline. Your answers are saved locally and will sync when you reconnect").
- The student should still be able to navigate between questions and change answers while offline (if the exam was loaded).
- When the network is restored: answers should sync to the server automatically.
- If the timer expires while offline: verify what happens upon reconnection — does the auto-submit trigger?

*Why this matters:* Network issues during exams are extremely common in India, especially on mobile networks. The system must be resilient to temporary disconnections.

---

**D10 — Rich Content Rendering on Mobile and Desktop**

*Setup:* Find questions in the exam that have: (a) LaTeX formulas, (b) images/diagrams, (c) tables or matrix-match questions.

*What to verify:*
- **Desktop:** All LaTeX renders as proper math notation. Images display at full resolution. Tables are properly aligned.
- **Mobile:** LaTeX formulas scale to fit the screen without horizontal scrolling. Images resize proportionally. The overall layout doesn't break — no content overflows off-screen.
- Verify on at least one mobile device (or use browser dev tools responsive mode at 375px width).

---

**D11 — Mobile Test Player: Touch Navigation, Palette, and Responsiveness**

*Setup:* Start an exam on a mobile device (or use browser dev tools responsive mode at 375px × 667px, simulating an iPhone SE or similar). The exam should have at least 3 subjects and 25+ questions per subject to stress-test the interface.

*What to verify — step by step:*

1. **Instructions page on mobile:** The instructions page should be fully readable without horizontal scrolling. The "Begin Exam" button should be easily tappable — at least 44px tall (Apple's minimum touch target guideline). If there's a long list of instructions, it should scroll vertically without cutting off the Begin button.

2. **Subject tabs on small screens:** With 3+ subject tabs (Physics, Chemistry, Mathematics), verify they fit on the screen. If they don't fit in a single row, they should be horizontally scrollable with a clear scroll indicator — NOT hidden or truncated. The active tab should be clearly highlighted. Tapping between tabs should be responsive (no double-tap required).

3. **Question text and options:** Long question text should wrap properly — no text overflowing off the right edge of the screen. LaTeX formulas should scale down proportionally. If a formula is too wide for the screen, it should be scrollable within its container (not cause the entire page to scroll horizontally). MCQ options should have generous tap targets — a user should be able to tap the option text OR the radio button, not just a tiny circle.

4. **Question palette on mobile:** Open the question palette. On a 75-question exam, the palette grid should be scrollable within a drawer or modal — not push the entire page down. Each question number button should be at least 40px × 40px for easy tapping. Tapping a question number should navigate to that question and close the palette. The colour-coding (green, red, purple, grey) should be clearly distinguishable on mobile screens (some cheap phones have lower colour accuracy).

5. **Swipe navigation (if supported):** If the Test Player supports swiping left/right to navigate between questions — verify it works smoothly. Swipe left = next question, swipe right = previous question. The swipe should not interfere with scrolling (vertical scroll for long questions should work independently).

6. **Timer visibility:** The timer should remain visible at all times on mobile — not hidden behind a scroll, not obscured by other elements. If the top bar is sticky, verify it doesn't overlap question content.

7. **Mark for Review button:** The "Mark for Review" button should be easily accessible on mobile — not hidden in a menu or behind a long scroll. It should be tappable without accidentally tapping an MCQ option.

8. **Submit button:** The Submit button should be in a predictable location. On mobile, if it's at the bottom of the page, verify it doesn't get hidden behind the phone's navigation bar or keyboard. The submission confirmation dialog should be fully visible on mobile — not cut off at the bottom.

9. **Landscape mode:** Rotate the phone to landscape. The Test Player should adapt — not break or show a blank area. Questions and options should reflow appropriately.

10. **Tablet view (768px):** Test on a tablet-sized viewport. The layout should use the available space well — not just stretch the mobile layout. Ideally, the question palette could be shown as a sidebar instead of a modal on tablet.

*Why this matters:* In Indian coaching institutes, a significant percentage of students take exams on their phones — not laptops. A Test Player that works perfectly on desktop but is unusable on a 5.5-inch phone screen is effectively broken for a large portion of users. Touch targets that are too small, palettes that don't scroll, and formulas that overflow are the most common mobile complaints.

*Common failure points:*
- Question palette buttons are too small to tap accurately (under 36px)
- LaTeX formulas cause horizontal page scroll (breaks the entire layout)
- The Submit button is hidden behind the phone's bottom navigation bar
- Subject tabs are cut off on small screens with no scroll indicator
- Double-tap required to select an MCQ option (touch event handling bug)
- The timer disappears when scrolling down on a long question

---

### Group E — Results & Role-Based Reporting

> **What this group tests:** After an exam is submitted, results must flow correctly to three different audiences — the student, the teacher, and the institute admin. Each sees a different slice of the data, scoped by their role. This group verifies that the right data reaches the right person and — just as importantly — that no one sees data they shouldn't.

**E1 — Student Sees Full Results Immediately**

*Setup:* A student has just submitted an exam (PYP or GT). They should be on the results page (auto-redirected after submission) or can navigate to Tests → Completed → View Results.

*What to verify:*
- The total score is displayed (e.g., "Score: 156 / 300").
- A question-by-question breakdown is available — each question shows:
  - The student's answer
  - The correct answer
  - Whether it was correct (✓), incorrect (✗), or unanswered (—)
  - Marks awarded for each question
- Subject-wise score breakdown (e.g., Physics: 52/100, Chemistry: 48/100, Mathematics: 56/100).
- The results should be available immediately after submission — no "Results pending" or waiting period (unless the exam specifically has delayed results).

---

**E2 — Score Calculation Accuracy**

*Setup:* Take an exam where you know exactly which questions you answered correctly and incorrectly. For example, answer 20 MCQ questions correctly (+4 each = +80), answer 5 MCQ questions incorrectly (−1 each = −5), and leave 50 questions unanswered (0 each).

*What to verify:*
- Total score should be: 80 − 5 + 0 = 75.
- Physics, Chemistry, and Mathematics section scores should each be calculated independently.
- Numerical type questions with +4/0 marking: correct = +4, incorrect = 0 (NOT −1).
- The marks shown on the results page must match the marking scheme exactly.

*Why this matters:* Score calculation bugs are the most damaging bugs in an exam platform. Students make life-altering decisions based on these scores. Even a 1-mark error in the scoring algorithm is a critical bug.

---

**E3 — Teacher Sees Only Their Subject's Results**

*Setup:*
1. A student in Batch A completes a JEE Main exam (Physics + Chemistry + Mathematics).
2. Log in as the Physics teacher assigned to Batch A.
3. Go to Reports → select Batch A → find the exam.

*What to verify:*
- The teacher should see Physics section results ONLY.
- The Chemistry and Mathematics sections should not appear anywhere — not as tabs, not as collapsed sections, not as greyed-out sections.
- The teacher should see:
  - Individual student scores for Physics
  - Question-wise analysis for Physics questions only
  - Class average, highest, lowest for Physics
  - Analytics (score distribution, difficulty analysis) for Physics only
- If the teacher tries to access the full report URL (e.g., by modifying the URL parameters) — they should still only see Physics data.

*Why this matters:* Subject-scoped reporting is a deliberate design decision. A Physics teacher should focus on Physics performance and not be overwhelmed by data from other subjects. It also protects the other teachers' performance data — a Physics teacher should not judge how well or poorly students did in Chemistry.

---

**E4 — Two Teachers, Same Batch, Same Exam, Different Subjects**

*Setup:*
1. Physics teacher (assigned to Batch A, Physics) and Chemistry teacher (assigned to Batch A, Chemistry) both exist.
2. Students in Batch A complete a JEE Main exam.

*What to verify:*
- Physics teacher sees ONLY Physics results for Batch A. Zero Chemistry or Mathematics data.
- Chemistry teacher sees ONLY Chemistry results for Batch A. Zero Physics or Mathematics data.
- Both teachers see the same student list (all students in Batch A who attempted).
- The scores they see are different — Physics teacher sees Physics marks, Chemistry teacher sees Chemistry marks.
- Neither teacher can see the other's subject data through any navigation path.

*Common failure points:*
- Both teachers see all subjects (subject filter not applied)
- One teacher sees the other's subject data in a "summary" or "overview" section
- The total score column shows the full exam score instead of the subject-specific score

---

**E5 — Teacher Assigned to Multiple Batches**

*Setup:* A Physics teacher is assigned to Batch A and Batch B. Both batches took the same GT.

*What to verify:*
- The teacher should see two separate batch entries in their Reports.
- Batch A report shows Physics results for Batch A students only.
- Batch B report shows Physics results for Batch B students only.
- The reports should NOT be merged — they are separate batch-level reports.
- The teacher can compare the two reports by switching between them, but the data is always batch-scoped.

---

**E6 — Teacher with No Student Attempts**

*Setup:* A Physics teacher is assigned to Batch C. An exam is assigned to Batch C, but no student has attempted it yet.

*What to verify:*
- The teacher should see the exam in their Reports list.
- Opening the report should show a clean empty state: "No students have attempted this exam yet" or similar.
- It should NOT show an error, a crash, a spinner that never resolves, or "0/0" calculations that produce NaN.

---

**E7 — Institute Sees Complete Aggregate Report**

*Setup:* Students from multiple batches have taken the same exam. Log in as Institute admin.

*What to verify:*
- The exam report at the institute level should show:
  - Overall statistics: total students who attempted, average score, highest score, lowest score
  - ALL subjects: Physics, Chemistry, Mathematics — not filtered by any subject
  - Batch-wise comparison: average score per batch, comparison charts
  - Individual student list with scores
- The institute admin should be able to drill down:
  - Click on a batch → see batch-specific data
  - Click on a student → see that student's question-by-question breakdown
- All data should be available without any subject restriction.

---

**E8 — Institute Drills Down to Individual Student**

*Setup:* From the institute report (E7), click on an individual student.

*What to verify:*
- The student's complete results should load: all subjects, all questions, all answers.
- The view should match what the student sees on their own results page — same scores, same question-by-question breakdown.
- If the student's answers are different from what's shown (data mismatch between student view and institute view), that is a critical bug.

---

**E9 — Institute with Multiple Batches: Batch Comparison**

*Setup:* Institute A has 3 batches (Batch A, B, C) and all took the same exam.

*What to verify:*
- The institute report should allow comparing all three batches side by side.
- Batch-level metrics (average score, completion rate, subject-wise averages) should be available for each batch.
- The institute should be able to identify which batch performed best/worst.
- Drilling into any batch should show only that batch's students.

---

**E10 — Results Parity: PYP vs GT**

*Setup:* Have students take both a PYP and a GT. Compare the reporting experience.

*What to verify:*
- The same reporting features should be available for both PYPs and GTs:
  - Student results page: identical layout and data
  - Teacher subject-scoped reports: identical filtering
  - Institute aggregate reports: identical drill-down capability
- If there are any differences between PYP and GT reporting, they should be intentional and documented — not accidental gaps.

---

**E11 — Student Who Didn't Attempt the Exam**

*Setup:* An exam is assigned to Batch A. Students S1, S2, S3 attempt it. Student S4 (also in Batch A) does NOT attempt it.

*What to verify:*
- **Teacher's report:** S4 should either not appear in the results (only attempted students shown) OR appear with an "Absent" or "Not Attempted" label. S4 should NOT appear with a "0" score — that would imply they attempted and scored zero, which is misleading.
- **Institute's report:** Same handling as teacher — S4 is clearly absent, not "scored zero."
- **Statistics:** When calculating "Class Average," is S4 included in the denominator? If yes, the average will be artificially lower. Verify how the system handles this.

*Why this matters:* The distinction between "absent" and "scored zero" is critical for academic reporting. A student who was absent due to illness is different from a student who attempted and scored zero.

---

**E12 — Partial Submission: Timer Expired with Unanswered Questions**

*Setup:* A student answers 50 of 75 questions. The timer expires and the exam is auto-submitted.

*What to verify:*
- The student's results should show:
  - 50 questions answered (scored normally: +4 for correct, −1 for incorrect MCQ, +4/0 for numerical)
  - 25 questions unanswered: scored as 0 marks each — NOT as negative marks
- The total score should be the sum of marks from the 50 answered questions.
- In the question-by-question breakdown, the 25 unanswered questions should be marked as "Not Attempted" — not as "Incorrect."
- Teacher and institute reports should reflect the same data.

---

**E13 — Delayed Rank Publication: Controlled Release of Results**

*Setup:* This scenario tests whether the institute can control when ranks and detailed results are shown to students. Some exams (especially Grand Tests) use a "delayed publication" model where:
- Students submit the exam and see a "Results pending" or "Awaiting Publication" status.
- The institute reviews the results, resolves any disputes, and then "publishes" the results.
- Only after publication do students see their scores, ranks, and detailed breakdowns.

To set this up: create a Grand Test with the "delayed results" or "manual publication" setting enabled (if available in the exam configuration). Share it with an institute, assign to a batch, and have students take it.

*What to verify:*

1. **Before publication (student view):**
   - After submitting the exam, the student should see a status like "Results Awaiting Publication" or "Your results will be available once published by your institute."
   - The student should NOT see their score, rank, or question-by-question breakdown yet.
   - The "View Results" button should either be disabled or show the pending status when clicked.
   - The student should not be able to access results by manipulating the URL (e.g., directly navigating to `/tests/results/[exam-id]` should show the pending status, not the actual results).

2. **Before publication (teacher view):**
   - Can the teacher see the raw results before the institute publishes? This depends on the product decision:
     - If yes: verify the teacher sees their subject-scoped results as usual, but with a "Not Published" indicator.
     - If no: the teacher should see the same pending status as the student.
   - Document the actual behaviour.

3. **Before publication (institute view):**
   - The institute admin should be able to see the full results — scores, ranks, analytics — even before publishing. This is the review phase.
   - There should be a "Publish Results" button or action clearly visible.
   - The institute should be able to review and verify before making results available to students.

4. **Publishing action:**
   - The institute admin clicks "Publish Results."
   - A confirmation dialog should appear: "Publishing will make results visible to all students. This action cannot be undone. Proceed?"
   - After confirmation, the publish action should complete.

5. **After publication (student view):**
   - The student should now see their full results: score, rank (if applicable), question-by-question breakdown.
   - If push notifications are enabled, the student should receive a notification: "Results for [Exam Name] have been published."
   - The status should change from "Awaiting Publication" to "Published" or simply show the results directly.

6. **After publication (teacher view):**
   - The teacher should now see the subject-scoped results (if they were hidden before publication).
   - Analytics and reports should be fully available.

7. **Partial publication (edge case):**
   - If the system supports publishing results for specific batches (not all at once): verify that publishing for Batch A makes results visible to Batch A students but NOT Batch B students who also took the exam.
   - If the system does NOT support partial publication: all students should see results simultaneously.

8. **Re-publication after correction:**
   - After publishing, if the institute discovers a scoring error and needs to correct it — can they "unpublish," fix, and re-publish? Or are published results locked?
   - Document the actual behaviour.

*Why this matters:* In competitive exam coaching, premature result release can cause panic — especially if there are scoring disputes or question errors. The delayed publication model gives institutes control over the release timeline. If results leak before publication (through URL manipulation or caching), it undermines the institute's authority and can cause student unrest. This is both a UX and a security test.

*Common failure points:*
- Results are visible to students immediately despite the "delayed publication" setting (setting not enforced)
- The "Publish" button is missing or hidden in the institute UI (feature exists but is undiscoverable)
- After publishing, the student still sees "Awaiting Publication" until they hard-refresh (real-time update failure)
- Push notification is sent before the publish action is confirmed (premature notification)
- Rank calculation changes after publication (late-arriving submissions or score corrections cause rank shifts that confuse students)

---

### Group F — Cross-Cutting & Edge Scenarios

> **What this group tests:** End-to-end flows that exercise the entire distribution chain in complex, real-world-like scenarios. These scenarios combine multiple aspects from Groups A through E and introduce edge cases that are likely to cause failures. If Groups A-E pass but Group F fails, there are integration bugs hiding in the seams between features.

**F1 — Full End-to-End: Creation to Reporting**

*Setup:* This is the master scenario. Execute the following steps in order, verifying at each stage:

1. **SuperAdmin:** Create a Grand Test (JEE Main pattern, 75 questions across 3 subjects, scheduled for a specific time). Add questions that include LaTeX and images.
2. **SuperAdmin:** Share the GT with Institute A and Institute B (NOT Institute C).
3. **Institute A:** Log in, verify the GT is visible with the correct schedule. Assign it to Batch X.
4. **Institute B:** Log in, verify the GT is visible. Assign it to Batch Y.
5. **Institute C:** Log in, verify the GT is NOT visible.
6. **Student in Batch X (Institute A):** Wait for the schedule. Start the exam. Answer all questions. Submit.
7. **Student in Batch Y (Institute B):** Same as step 6.
8. **Student in Batch Z (Institute A, not assigned):** Verify the GT is NOT visible.
9. **Physics Teacher (Institute A, Batch X):** Check exam reports. Verify only Physics results for Batch X students are visible.
10. **Chemistry Teacher (Institute A, Batch X):** Check exam reports. Verify only Chemistry results for Batch X students are visible.
11. **Institute A Admin:** Check full report — all subjects, all students from Batch X. Verify no Batch Y or Institute B data is visible.
12. **Institute B Admin:** Check full report — all subjects, all students from Batch Y. Verify no Batch X or Institute A data is visible.

*This single scenario exercises: audience distribution, read-only enforcement, batch assignment, schedule controls, test player, auto-grading, subject-scoped reporting, aggregate reporting, and inter-institute isolation.*

---

**F2 — Same Exam, Two Institutes, Complete Data Isolation**

*Setup:*
1. SuperAdmin shares a PYP with Institute A and Institute B.
2. Institute A assigns it to Batch X (students: S1, S2, S3).
3. Institute B assigns it to Batch Y (students: S4, S5, S6).
4. All students complete the exam.

*What to verify:*
- Institute A's reports show ONLY S1, S2, S3 — never S4, S5, S6.
- Institute B's reports show ONLY S4, S5, S6 — never S1, S2, S3.
- Aggregate statistics (average, highest, lowest) are calculated independently for each institute.
- No API call, report export, or drill-down should ever leak data across institutes.
- The "Total Attempts" count at each institute should reflect only their students.

---

**F3 — Multiple Exam Types in Same Batch**

*Setup:* Batch A in Institute A has three exams assigned:
- A PYP (from SuperAdmin, via Audience + Batch Assignment)
- A Grand Test (from SuperAdmin, via Audience + Batch Assignment)
- An institute-created exam (created directly by Institute A admin)

*What to verify:*
- Student in Batch A sees all three exams on their Tests page.
- Each exam appears under the correct tab or category:
  - PYP appears under "Grand Tests & PYPs" tab
  - GT appears under "Grand Tests & PYPs" tab
  - Institute-created exam appears under the appropriate tab (may be "Subject Tests" or similar depending on the exam type)
- Each exam has the correct metadata (pattern, duration, question count).
- The student can take each exam independently — completing one does not affect the others.

---

**F4 — SuperAdmin Modifies PYP After Institute Assignment**

*Setup:*
1. SuperAdmin creates and publishes a PYP with 75 questions. Shares with Institute A.
2. Institute A assigns it to Batch A. Students can see it.
3. SuperAdmin goes back and modifies the PYP — adds 5 questions or changes a marking scheme.

*What to verify:*
- Does the change propagate to Institute A's view? When the institute previews the PYP, do they see 80 questions or still 75?
- Does the change propagate to students? If a student starts the exam after the modification, do they get the updated version?
- If a student had already started the exam before the modification — what happens? Do they continue with the old version?
- Document the actual behaviour — this is an area where the expected behaviour should be explicitly defined by the product team.

*Why this matters:* Modifying a live exam is a dangerous operation. The system needs a clear policy — either modifications propagate immediately (risky if students are mid-exam), or modifications are frozen once the exam is assigned (safer but less flexible).

---

**F5 — Institute-Created Exam: Same Flow Without SuperAdmin**

*Setup:* Institute A admin creates their own exam (not from SuperAdmin). They assign it to Batch A.

*What to verify:*
- Students in Batch A see the exam. Students in Batch B do not.
- The Test Player works identically to PYP/GT exams.
- Results flow to the teacher (subject-scoped) and institute (aggregate) correctly.
- This verifies that the entire flow works even without the SuperAdmin → Institute distribution step — the batch assignment and downstream flow should be identical.

---

**F6 — Mixed Question Types in a Single Exam**

*Setup:* An exam contains MCQ Single Correct, MCQ Multiple Correct, Numerical (Integer type), and Assertion-Reasoning questions.

*What to verify:*
- Each question type renders correctly in the Test Player:
  - MCQ Single: radio buttons, only one selectable
  - MCQ Multiple: checkboxes, multiple selectable
  - Numerical: text input field for number entry
  - Assertion-Reasoning: two statements with option combinations
- Scoring is correct per type:
  - MCQ Single: +4 correct, −1 incorrect, 0 unanswered
  - MCQ Multiple: partial marking if applicable, or full marks only if all correct
  - Numerical: +4 correct, 0 incorrect (no negative marking for numerical)
- Results page shows each question type correctly with proper labelling.

---

**F7 — Large-Scale Stress Scenario**

*Setup:* A GT is assigned to a batch with 50+ students. The exam has 75 questions across 3 subjects. All 50 students take the exam.

*What to verify:*
- All 50 students can start and complete the exam without performance issues.
- The results page for each student loads within a reasonable time (under 5 seconds).
- The teacher's report loads with all 50 students' data without timeout or truncation.
- The institute's aggregate report handles 50 students smoothly — charts render, drill-down works.
- Search and filter in the report work on 50 students.

*Why this matters:* Performance issues often hide in small-scale testing. This scenario deliberately pushes toward real-world volumes. A batch of 50 is a typical Indian coaching class size.

---

**F8 — Concurrent Access: Multiple Students Starting Simultaneously**

*Setup:* Two students from the same batch start the same GT at exactly the same time (or within seconds of each other).

*What to verify:*
- Both students can start without errors.
- Each student's responses are saved independently — Student A's answers do not overwrite Student B's.
- Both students can submit successfully.
- Both students' results are correct and independent.
- If both submit at the same time — no data corruption or "duplicate submission" error.

---

**F9 — Batch Curriculum Changed After Exam Assignment**

*Setup:*
1. Batch A has CBSE curriculum. A CBSE-pattern exam is assigned to Batch A.
2. An admin changes Batch A's curriculum from CBSE to ICSE.

*What to verify:*
- Does the CBSE exam remain assigned to Batch A?
- Can students in Batch A still see and take the CBSE exam?
- Or does the curriculum change invalidate the exam assignment?
- Document the actual behaviour — this is an edge case that the product team should define a policy for.

---

**F10 — Security Test: Cross-Institute Access Attempt**

*Setup:*
1. A GT is shared with Institute A and assigned to Batch X.
2. Log in as a student from Institute B (who should have zero access to this GT).

*What to verify:*
- The GT does not appear on the student's Tests page.
- If the student somehow obtains the exam URL (e.g., shared by a friend from Institute A) and tries to navigate to it directly — they should be blocked with an access denied error.
- The response should NOT leak any exam data — no question text, no metadata, no indication of the exam's existence.
- API-level: if the student's session token is used to make direct API calls to fetch exam data — the API should return a 403 or 404, not the exam content.

*Why this matters:* This is a security scenario. In competitive exam coaching, there is a real incentive for students to try to access exams from other institutes or batches. The system must enforce access control at every layer, not just the UI.

---

## Quick Reference Matrix

| Role | Can See | Can Do | Must NOT See |
|------|---------|--------|--------------|
| **SuperAdmin** | All PYPs and GTs they created | Create, edit, publish, manage Audience | Student responses or individual scores (unless report feature exists) |
| **Institute Admin** | Only PYPs/GTs shared via Audience + their own institute-created exams | Preview, assign to batches, view all reports | Other institutes' exams, other institutes' student data |
| **Teacher** | Exams assigned to their batches | View subject-scoped reports for their batches | Other subjects' results, other teachers' batches' data |
| **Student** | Only exams assigned to their specific batch | Take exams, view own results | Other batches' exams, other students' results, other institutes' data |
| **Unassigned Institute** | Nothing from SuperAdmin that wasn't shared with them | N/A | Any PYP or GT not in their Audience list |
| **Unassigned Batch Student** | Nothing — batch wasn't assigned | N/A | Any exam not assigned to their batch |

---

## What "Working Correctly" Looks Like — Summary

The exam distribution and reporting system is working correctly when:

1. **The Audience whitelist is absolute.** If an institute is not in the Audience list for an exam, that exam does not exist from their perspective — not in any list, not via any URL, not through any API.

2. **The Batch Assignment whitelist is absolute.** If a batch is not assigned an exam, students in that batch cannot see, access, or know about that exam.

3. **The two-step chain is unbreakable.** SuperAdmin → Institute (via Audience) → Student (via Batch Assignment). No step can be skipped, no shortcut exists.

4. **Read-only at institute level.** SuperAdmin exams are sealed packages at the institute level — viewable and assignable, never editable.

5. **Reports are subject-scoped for teachers.** A teacher sees only their subject's data — this is a feature that ensures focus and protects cross-subject privacy.

6. **Reports are complete for institutes.** The institute admin sees everything — all subjects, all students, all batches — with full drill-down capability.

7. **Inter-institute isolation is total.** Two institutes sharing the same exam have zero visibility into each other's data — no student lists, no scores, no analytics leak across the boundary.

---

## Related Documents

- [Curriculum Scope QA](./curriculum-scope-qa.md) — Entity-level scoping and curriculum filtering tests
- [Course Chapter Filtering QA](./course-chapter-filtering-qa.md) — Course-specific chapter isolation
- [Course Assignment & Scope QA](./course-assignment-scope-qa.md) — Course batch and teacher scope
- [Exam Flow](../../05-cross-login-flows/exam-flow.md) — High-level exam lifecycle diagram
- [Teacher Exams](../../03-teacher/exams.md) — Teacher exam creation feature documentation

---

*Last Updated: April 2025*
