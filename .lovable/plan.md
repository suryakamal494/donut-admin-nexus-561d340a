

# Documentation Navigation Audit & Fix Plan

## Audit Summary

I've compared the actual files in the `/docs` folder against the navigation configuration in `src/data/docsNavigation.ts`. Here are the findings:

---

## Missing Navigation Routes Found

### 1. SuperAdmin Portal - Tier Management (MISSING)
**File exists:** `docs/01-superadmin/tier-management.md`
**Navigation:** NOT in sidebar - should be under "Institutes" or as a separate item

### 2. SuperAdmin Portal - Users (MISSING)
**File exists:** `docs/01-superadmin/users.md`
**Navigation:** NOT in sidebar

### 3. Inter-Login Tests - Tier Institute Tests (MISSING)
**File exists:** `docs/06-testing-scenarios/inter-login-tests/tier-institute-tests.md`
**Navigation:** NOT in sidebar - this is the one you noticed

### 4. Inter-Login Tests - Question Bank Tests (MISSING)
**File exists:** `docs/06-testing-scenarios/inter-login-tests/question-bank-tests.md`
**Navigation:** NOT in sidebar

---

## Current Navigation vs. Actual Files

### Inter-Login Tests Section
| Current Navigation | Files on Disk | Status |
|-------------------|---------------|--------|
| Content Tests | content-tests.md | OK |
| Exam Tests | exam-tests.md | OK |
| Timetable Tests | timetable-tests.md | OK |
| Curriculum Tests | curriculum-tests.md | OK |
| - | tier-institute-tests.md | **MISSING** |
| - | question-bank-tests.md | **MISSING** |

### SuperAdmin Portal Section
| Current Navigation | Files on Disk | Status |
|-------------------|---------------|--------|
| Overview | README.md | OK |
| Dashboard | dashboard.md | OK |
| Master Data (Curriculum, Courses) | master-data-curriculum.md, master-data-courses.md | OK |
| Institutes | institutes.md | OK |
| Content Library | content-library.md | OK |
| Question Bank | question-bank.md | OK |
| Exams | exams.md | OK |
| Roles & Access | roles-access.md | OK |
| - | tier-management.md | **MISSING** |
| - | users.md | **MISSING** |

---

## Implementation Plan

### File to Modify
`src/data/docsNavigation.ts`

### Changes Required

#### 1. Add Tier Management to SuperAdmin Portal
Add after "Institutes" item to show the relationship:

```typescript
{ title: "Institutes", path: "01-superadmin/institutes" },
{ title: "Tier Management", path: "01-superadmin/tier-management" },  // NEW
```

#### 2. Add Users to SuperAdmin Portal (if needed)
Add to SuperAdmin items:

```typescript
{ title: "Users", path: "01-superadmin/users" },  // NEW
```

#### 3. Add Tier Institute Tests to Inter-Login Tests
Add to Inter-Login Tests children:

```typescript
{
  title: "Inter-Login Tests",
  path: "06-testing-scenarios/inter-login-tests",
  children: [
    { title: "Content Tests", path: "06-testing-scenarios/inter-login-tests/content-tests" },
    { title: "Exam Tests", path: "06-testing-scenarios/inter-login-tests/exam-tests" },
    { title: "Timetable Tests", path: "06-testing-scenarios/inter-login-tests/timetable-tests" },
    { title: "Curriculum Tests", path: "06-testing-scenarios/inter-login-tests/curriculum-tests" },
    { title: "Tier Management Tests", path: "06-testing-scenarios/inter-login-tests/tier-institute-tests" },  // NEW
    { title: "Question Bank Tests", path: "06-testing-scenarios/inter-login-tests/question-bank-tests" },  // NEW
  ],
},
```

---

## Complete Navigation Update

The updated `docsNavigation` array will include:

### SuperAdmin Portal (Lines 29-47)
Add Tier Management after Institutes:
- Position: After line 42 (`{ title: "Institutes", path: "01-superadmin/institutes" },`)
- New line: `{ title: "Tier Management", path: "01-superadmin/tier-management" },`

### Inter-Login Tests (Lines 167-175)
Add 2 new items to the children array:
- `{ title: "Tier Management Tests", path: "06-testing-scenarios/inter-login-tests/tier-institute-tests" }`
- `{ title: "Question Bank Tests", path: "06-testing-scenarios/inter-login-tests/question-bank-tests" }`

---

## Verification After Implementation

Once implemented, the sidebar will show:

**SuperAdmin Portal:**
- Overview
- Dashboard
- Master Data (Curriculum, Courses)
- Institutes
- **Tier Management** (NEW)
- Content Library
- Question Bank
- Exams
- Roles & Access

**Testing Scenarios → Inter-Login Tests:**
- Content Tests
- Exam Tests
- Timetable Tests
- Curriculum Tests
- **Tier Management Tests** (NEW)
- **Question Bank Tests** (NEW)

---

## Technical Details

**File:** `src/data/docsNavigation.ts`

**Change 1 - SuperAdmin Section (around line 42):**
Insert after Institutes:
```typescript
{ title: "Tier Management", path: "01-superadmin/tier-management" },
```

**Change 2 - Inter-Login Tests Section (around line 169-174):**
Add to children array:
```typescript
{ title: "Tier Management Tests", path: "06-testing-scenarios/inter-login-tests/tier-institute-tests" },
{ title: "Question Bank Tests", path: "06-testing-scenarios/inter-login-tests/question-bank-tests" },
```

