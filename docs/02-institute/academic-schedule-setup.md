# Academic Schedule Setup

> Allocate teaching hours per chapter and define teaching sequence.

---

## Overview

The Academic Schedule Setup page enables hour allocation and sequence management for chapters within each subject. This configuration feeds into the Academic Planner for automatic schedule generation. The interface supports drag-and-drop reordering and hour adjustment for customized teaching plans.

## Access

- **Route**: `/institute/academic-schedule/setup`
- **Login Types**: Institute Admin
- **Permissions Required**: `academicSchedule.view`, `academicSchedule.edit`

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| PageHeader | Title + batch selector | Top |
| BatchSelector | Choose batch to configure | Header |
| SubjectTabs | Switch between subjects | Below header |
| ChapterList | Draggable chapter list | Main content |
| HourAdjuster | Hour allocation controls | Per chapter |
| TotalsSummary | Hours and weeks totals | Bottom |

---

## Features & Functionality

### Selection Flow

1. Select batch (e.g., "10A")
2. Select subject (e.g., "Physics")
3. View/configure chapters for that subject

### Chapter Configuration

```text
Physics - Class 10A (Total: 120 hours)

┌─────────────────────────────────────────────────────┐
│ ≡  1. Motion                                        │
│     • Hours Allocated: 12                    [- +]  │
│     • Estimated Weeks: 3                            │
│     • Topics: 4                                     │
├─────────────────────────────────────────────────────┤
│ ≡  2. Force and Laws of Motion                     │
│     • Hours Allocated: 15                    [- +]  │
│     • Estimated Weeks: 4                            │
│     • Topics: 5                                     │
├─────────────────────────────────────────────────────┤
│ ≡  3. Gravitation                                   │
│     • Hours Allocated: 10                    [- +]  │
│     • Estimated Weeks: 3                            │
│     • Topics: 3                                     │
└─────────────────────────────────────────────────────┘

Summary:
• Total Chapters: 12
• Total Hours: 120
• Estimated Duration: 32 weeks
```

### Hour Allocation

| Control | Action |
|---------|--------|
| + Button | Increase hours by 1 |
| - Button | Decrease hours by 1 |
| Direct Input | Type specific hours |
| Reset | Return to recommended |

### Recommended Hours

System suggests hours based on:
- Topic count
- Standard curriculum guidelines
- Historical averages

### Sequence Reordering

**Drag-and-Drop:**
1. Grab the ≡ (grip) handle
2. Drag chapter to new position
3. Sequence numbers auto-update
4. Reorder restricted to vertical axis

### Auto-Reset Behavior

When Class or Track changes:
- Subject selection resets
- Chapter list refreshes
- Previously configured hours preserved

---

## Data Flow

```text
Source: Master Data chapters
         │
         ▼
Setup:
├── Filter chapters by batch subject
├── Allow hour adjustment
├── Allow sequence reordering
├── Calculate week estimates
         │
         ▼
Storage: academicScheduleData.ts
         ├── chapterHours[]
         └── chapterSequence[]
         │
         ▼
Downstream:
├── Academic Planner (uses hours)
├── Batch Progress (completion tracking)
└── Teacher Academic Progress (confirmation)
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Hour Allocation | Academic Planner | Local | Drives auto-planning |
| Hour Allocation | Batch Progress | Local | Sets completion targets |
| Sequence | Academic Planner | Local | Determines chapter order |

---

## Business Rules

1. **Read-only chapters** - can't add/delete chapters (from curriculum)
2. **Minimum 1 hour** per chapter
3. **Maximum 50 hours** per chapter
4. **Week calculation** = hours ÷ periods per week
5. **Sequence must be contiguous** - no gaps
6. **Changes saved automatically** on modification
7. **Bilingual support** for Hindi subjects

---

## Week Calculation

```text
Chapter: Laws of Motion
├── Allocated Hours: 15
├── Physics Periods/Week: 4 (from timetable)
└── Estimated Weeks: 15 ÷ 4 = 3.75 → 4 weeks
```

---

## Mobile Behavior

- Batch/Subject: Dropdown selectors
- Chapter list: Vertical scroll with touch reordering
- Hour controls: Large touch targets (44px+)
- Drag handle: Prominent grip icon
- Summary: Sticky footer

---

## Related Documentation

- [Academic Planner](./academic-planner.md)
- [Batch Progress](./batch-progress.md)
- [Teacher Academic Progress](../03-teacher/academic-progress.md)
- [Academic Schedule Flow](../05-cross-login-flows/academic-schedule-flow.md)
- [Institute Smoke Tests](../06-testing-scenarios/smoke-tests/institute.md)

---

*Last Updated: January 2025*
