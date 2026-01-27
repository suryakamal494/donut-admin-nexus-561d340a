# Academic Planner

> Auto-generate and manage academic plans with chapter-week mappings.

---

## Overview

The Academic Planner automates syllabus planning by calculating chapter-week mappings using timetable slots and academic setup hours. It provides a visual monthly grid display and supports manual adjustments with full history tracking.

## Access

- **Route**: `/institute/academic-schedule/plans`
- **Login Types**: Institute Admin
- **Permissions Required**: `academicSchedule.view`, `academicSchedule.edit`

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| PageHeader | Title + generate action | Top |
| BatchSelectionHub | Entry point grid | Initial view |
| MonthlyGridDisplay | Subject × Week grid | Main content |
| ChapterBar | Chapter timeline bar | Within grid |
| AdjustmentPopover | Fine-tune controls | On chapter click |
| PublishDialog | Publish confirmation | Dialog |
| HistoryPanel | Adjustment history | Side panel |

---

## Features & Functionality

### Batch Selection Hub

Grid of batch cards showing plan status:

```text
Select Batch to View/Create Plan
┌─────────────────┬─────────────────┬─────────────────┐
│     10A         │     10B         │     11A         │
│  ✓ Published    │  📝 Draft       │  ○ No Plan      │
│  Jan - Mar      │  Jan - Feb      │  [Generate]     │
└─────────────────┴─────────────────┴─────────────────┘
```

| Status | Display | Meaning |
|--------|---------|---------|
| No Plan | Gray circle | Not generated |
| Draft | Amber pen | Generated, not published |
| Published | Green check | Active and locked |

### Monthly Grid Display

```text
10A Academic Plan - January 2025
┌─────────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
│   Subject   │ Week 1  │ Week 2  │ Week 3  │ Week 4  │ Week 5  │
├─────────────┼─────────┴─────────┴─────────┴─────────┴─────────┤
│ Physics     │ ████ Motion ████████│███ Force ██████████████│  │
├─────────────┼─────────────────────────────────────────────────┤
│ Chemistry   │ █████ Atoms █████│█████ Chemical Bonds █████│   │
├─────────────┼─────────────────────────────────────────────────┤
│ Mathematics │ ██ Polynomials ███│████ Linear Equations █████│ │
└─────────────┴─────────────────────────────────────────────────┘
```

### Chapter Bars

| Element | Description |
|---------|-------------|
| Bar length | Duration (weeks) |
| Bar color | Subject color |
| Chapter name | Inside bar |
| Edited badge | Dashed border |

### Generate Plan

1. Select batch from hub
2. Click "Generate" button
3. System calculates:
   - Available periods per week (from timetable)
   - Chapter hours (from academic setup)
   - Chapter-week mappings
4. Plan generated with loading indicator
5. Review and adjust as needed

### Manual Adjustments

**Adjust Duration:**
1. Click on chapter bar
2. Adjustment popover opens
3. Use +/- to add/remove hours
4. See impact preview
5. Apply changes

**Move Chapter:**
1. Drag chapter bar
2. Drop on new week position
3. Subsequent chapters shift

**Add Pending Chapter:**
1. Click + on empty week
2. Select from pending chapters
3. Chapter added to plan

### Adjustment Popover

```text
┌─────────────────────────────────┐
│ Motion (Physics)                │
├─────────────────────────────────┤
│ Planned Hours: 12               │
│ Current: 14 (+2)         [- +]  │
│                                 │
│ Impact: Ends Week 4 instead     │
│         of Week 3               │
│                                 │
│ [Cancel]  [Apply]               │
└─────────────────────────────────┘
```

### Publish Workflow

1. Review draft plan
2. Click "Publish"
3. Confirmation dialog
4. On publish:
   - Past and current month lock
   - Teachers can view plan
   - Confirmation workflow enabled

### Adjustment History

```text
History - Motion (Physics)
├── Jan 5: Added 2 hours (Admin)
├── Jan 3: Moved to Week 2 (Admin)
└── Jan 1: Generated (System)

[Undo Last]
```

---

## Data Flow

```text
Sources:
├── Timetable (periods per subject per week)
├── Academic Setup (hours per chapter)
├── Holidays/Exams (blocked dates)
         │
         ▼
Generator (useAcademicPlanGenerator.ts):
├── Calculate available teaching days
├── Map chapters to weeks
├── Handle holidays and exams
├── Apply memoization for performance
         │
         ▼
Storage:
├── Draft plans
├── Published plans
├── Adjustment history
         │
         ▼
Downstream:
├── Batch Progress (target tracking)
├── Teacher Academic Progress (confirmation reference)
└── Drift Management (variance calculation)
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Published Plan | Teacher Academic Progress | Downstream | Shows expected progress |
| Published Plan | Batch Progress | Local | Enables tracking |
| Adjustments | Drift Management | Local | Updates targets |

---

## Business Rules

1. **Timetable required** before plan generation
2. **Academic setup required** (hours allocated)
3. **Past months cannot be edited** after publish
4. **Current month locked** on publish
5. **Chapters cannot overlap** in same subject
6. **Holidays auto-excluded** from available days
7. **Edited chapters** marked with visual indicator
8. **History preserved** for all adjustments

---

## Mobile Behavior

- Batch hub: 2-column grid
- Monthly grid: Horizontal scroll
- Subject rows: Sticky left column
- Chapter adjustment: Bottom sheet
- Month navigation: Swipe gestures
- Generate button: Floating action

---

## Related Documentation

- [Academic Setup](./academic-schedule-setup.md)
- [Batch Progress](./batch-progress.md)
- [Teacher Academic Progress](../03-teacher/academic-progress.md)
- [Academic Schedule Flow](../05-cross-login-flows/academic-schedule-flow.md)
- [Institute Smoke Tests](../06-testing-scenarios/smoke-tests/institute.md)

---

*Last Updated: January 2025*
