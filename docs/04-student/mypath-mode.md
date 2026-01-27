# My Path Mode

> AI-driven personalized learning prescriptions.

---

## Overview

My Path Mode provides AI-generated learning prescriptions based on student performance analysis. Content is prioritized by urgency (High/Medium/Low) and targets specific knowledge gaps identified from quiz and test performance.

## Access

- **Route**: `/student/chapter/:id` (My Path tab)
- **Login Types**: Student
- **Permissions Required**: Performance data available

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| PrescriptionList | Prioritized recommendations | Main content |
| PrescriptionCard | Individual recommendation | Within list |
| PriorityBadge | Urgency indicator | Card header |
| ContentPreview | What's included | Card body |
| StartButton | Begin learning | Card footer |

---

## Features & Functionality

### Priority Levels

| Priority | Badge | Color | Criteria |
|----------|-------|-------|----------|
| High | 🔴 | Red | < 50% in recent quiz |
| Medium | 🟡 | Amber | 50-70% or needs revision |
| Low | 🟢 | Green | > 70%, maintenance |

### Prescription Card

```text
┌─────────────────────────────────────────────────────────────┐
│ 🔴 HIGH PRIORITY                                            │
│                                                              │
│ Newton's Third Law - Action Reaction                        │
│                                                              │
│ Why: You scored 40% on related questions in the last quiz  │
│                                                              │
│ Prescription:                                               │
│ • Watch: Action-Reaction Explained (8 min)                  │
│ • Practice: 5 targeted questions                            │
│ • Verify: Quick mastery check                               │
│                                                              │
│ Estimated time: 20 minutes                                  │
│                                                              │
│ [Start Practice →]                                          │
└─────────────────────────────────────────────────────────────┘
```

### Prescription Flow

```text
DIAGNOSE → LEARN → PRACTICE → VERIFY

1. Diagnose: AI identifies weakness
2. Learn: Targeted content (video/notes)
3. Practice: Focused questions
4. Verify: Mastery check quiz
```

### AI Analysis Factors

| Factor | Weight | Description |
|--------|--------|-------------|
| Quiz Performance | High | Recent quiz scores |
| Test Results | High | Exam performance |
| Time Since Practice | Medium | Spaced repetition |
| Topic Difficulty | Medium | Complexity rating |
| Upcoming Exams | High | Relevance to tests |

### Progress Tracking

```text
My Path Progress - Laws of Motion
├── Completed: 5 prescriptions
├── In Progress: 1 prescription
├── Pending: 3 prescriptions
│
└── Mastery Improvement: +15% since last week
```

### Recommendation Updates

- Recalculates after each quiz/test
- Updates daily based on new data
- Manual refresh available
- Considers latest class content

---

## Data Flow

```text
Source: Student Performance Data
         │
         ▼
AI Analysis:
├── Quiz scores by topic
├── Test results
├── Time patterns
└── Peer comparisons
         │
         ▼
Generate: Prescriptions with priority
         │
         ▼
Display: Prioritized list
         │
         ▼
Track: Prescription completion
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Performance Data | Quiz/Test Results | Upstream | Analysis source |
| Content Selection | Content Library | Reference | Targeted content |
| Questions | Question Bank | Reference | Practice questions |
| Progress | Overall Analytics | Local | Updates mastery |

---

## Business Rules

1. **Minimum data needed** - requires some quiz/test history
2. **Priority refresh** - updates on new performance data
3. **Content scoped** - only available content used
4. **Prescription complete** - all steps must finish
5. **Verify required** - mastery check mandatory
6. **Spaced repetition** - considers time since last practice

---

## Mobile Behavior

- Prescription cards: Full-width, expandable
- Priority badges: Color-coded, prominent
- Progress indicators: Visual bars
- Start buttons: Large touch targets
- List: Virtualized for performance

---

## Related Documentation

- [Chapter View](./chapter-view.md)
- [Content Viewer](./content-viewer.md)
- [Progress Analytics](./progress.md)
- [Student Smoke Tests](../06-testing-scenarios/smoke-tests/student.md)

---

*Last Updated: January 2025*
