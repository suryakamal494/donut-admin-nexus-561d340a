

## Plan: Merge Missing Scenarios from DOCX into Course Scope QA

### Audit Summary

**Our platform doc** has 6 groups (A–F) with 46 scenarios + 6 Known Bug Patterns.
**The DOCX** has 8 groups (A–H) with ~25 scenarios + a summary table.

Our doc is significantly more comprehensive overall. However, the DOCX contains **4 scenario types we don't have**:

| What's Missing | DOCX Location | Why It's Interesting |
|---|---|---|
| **Institute Question Bank Isolation** — questions are invisible between institutes; SA pushes down but institutes never push up or sideways; teachers see only their assigned subjects' questions within their own institute bank | E2, E3, E4 | Entirely absent from our doc — a real isolation concern |
| **Multi-subject switching within same course** — selecting Physics then Chemistry within JEE must completely replace the chapter list, not append | A3 | Our doc tests course-level switching but not subject-level within a course |
| **Question permanence under Course-Only Chapter** — a question created under a course-only chapter must never surface when browsing under any curriculum, even later | B4 | Our B8 tests the filter; this tests the question record itself post-creation |
| **Known defect verification targets** (H1–H3) — specific current-build bugs to confirm fixed/still-present: curriculum chapter bleed at institute level, course chapter bleed in teacher test, class selector re-filtering | H1, H2, H3 | More actionable than our "Known Bug Patterns" — explicitly says "verify if still broken" |

Everything else in the DOCX is already covered (often in more detail) by our existing scenarios.

---

### Implementation

**File:** `docs/06-testing-scenarios/inter-login-tests/course-scope-qa.md`

**Changes (additions only — no existing scenarios modified):**

1. **Add scenario A9** (after A8) — "Multi-Subject Switching Within Same Course": switching subjects within a course completely replaces the chapter list with no carry-over.

2. **Add scenario B10** (after B9) — "Question Created Under Course-Only Chapter Stays Scoped": a question tagged to a course-only chapter must never appear when browsing under any curriculum, even after the question is saved and time has passed. This is a post-creation searchability test.

3. **Add new Group G — Institute Question Bank Isolation** (after F, before Quick Reference Matrix) with 3 scenarios:
   - G1: Questions created by Institute A are invisible to Institute B
   - G2: SA questions flow down to institutes; institute questions never flow up to SA
   - G3: Teacher within an institute sees only questions for their assigned subjects, not the full institute bank

4. **Rename existing "Known Bug Patterns" section to "Known Bug Patterns & Active Defect Checks"** and add 3 specific verification targets (from DOCX H1–H3) as a sub-section called "Active Defect Verification Targets" — these tell the tester to confirm whether each specific defect is still present or resolved.

5. **Update the summary table in Quick Reference Matrix** to include the new Institute Q.Bank row.

No existing scenarios are renumbered or modified. Total scenarios after changes: 46 + 4 new = 50, plus 3 defect verification targets.

