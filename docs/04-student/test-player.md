# Test Player

> Exam interface for taking assessments.

---

## Overview

The Test Player is a focused, distraction-free interface for taking quizzes and exams. It supports various question types, includes navigation tools, flagging for review, and provides immediate or deferred results based on exam settings.

## Access

- **Route**: `/student/test/:id`
- **Login Types**: Student
- **Permissions Required**: Test assigned to batch

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| TestHeader | Timer + question count | Top (sticky) |
| QuestionDisplay | Current question | Main content |
| AnswerOptions | MCQ/input options | Below question |
| NavigationDots | Question progress | Bottom |
| FlagButton | Mark for review | Per question |
| SubmitDialog | Confirmation | End of test |

---

## Features & Functionality

### Test Header

```text
┌─────────────────────────────────────────────────────────────┐
│ Motion Concepts Quiz       Q 5/10       ⏱️ 08:32 remaining  │
└─────────────────────────────────────────────────────────────┘
```

### Question Display

```text
┌─────────────────────────────────────────────────────────────┐
│ Question 5                                    🚩 Flag       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ A particle moves along a straight line with velocity        │
│ v = 3t² - 2t + 1 m/s.                                       │
│                                                              │
│ Find the acceleration at t = 2 seconds.                     │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ ○ A) 8 m/s²                                                 │
│                                                              │
│ ● B) 10 m/s²                                                │
│                                                              │
│ ○ C) 12 m/s²                                                │
│                                                              │
│ ○ D) 14 m/s²                                                │
├─────────────────────────────────────────────────────────────┤
│ ● ● ● ● ◐ ○ ○ ○ ○ ○                          ◀ Prev Next ▶ │
└─────────────────────────────────────────────────────────────┘
```

### Question Types

| Type | Input Method | Display |
|------|--------------|---------|
| MCQ Single | Radio buttons | Vertical options |
| MCQ Multiple | Checkboxes | Vertical options |
| True/False | Radio buttons | Two options |
| Integer | Number input | Input field |
| Fill in Blank | Text input | Inline blank |
| Matrix Match | Drag-drop | Column grid |

### Question States

| State | Dot | Meaning |
|-------|-----|---------|
| Answered | ● Filled | Response selected |
| Current | ◐ Half | Currently viewing |
| Unanswered | ○ Empty | No response |
| Flagged | 🚩 Flag | Marked for review |

### Navigation

- **Dots**: Tap to jump to question
- **Prev/Next**: Sequential navigation
- **Swipe**: Left/right on mobile
- **Submit**: Only after all viewed

### Flag for Review

Flagged questions:
- Visible in navigation
- Listed before submit
- Optional to answer

### Submit Flow

```text
Submit Test
┌─────────────────────────────────────────────────────────────┐
│ Are you sure you want to submit?                            │
│                                                              │
│ Summary:                                                     │
│ • Answered: 8/10                                            │
│ • Flagged: 2 questions                                      │
│ • Unanswered: 2 questions                                   │
│                                                              │
│ ⚠️ You have 2 unanswered questions                          │
│                                                              │
│ [Review Flagged] [Submit Anyway] [Cancel]                   │
└─────────────────────────────────────────────────────────────┘
```

### Timer Behavior

| Time Remaining | Visual |
|----------------|--------|
| > 5 min | Normal display |
| 1-5 min | Amber warning |
| < 1 min | Red + pulse |
| 0 | Auto-submit |

---

## Data Flow

```text
Source: Exam/Quiz assignment
         │
         ▼
Test Player:
├── Load questions
├── Track responses
├── Manage timer
├── Handle navigation
         │
         ▼
Submission:
├── Send responses
├── Calculate score (if auto)
├── Store attempt
         │
         ▼
Results: Navigate to results page
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Test Assignment | Teacher Exams | Upstream | Loads test |
| Submission | Results | Downstream | Shows score |
| Attempt | Progress | Updates | Analytics data |

---

## Business Rules

1. **One attempt** per test (unless configured)
2. **Timer enforced** - auto-submit at zero
3. **Cannot go back** after submit
4. **Responses saved** periodically
5. **Browser close** - attempt preserved
6. **Negative marking** applied if configured

---

## Mobile Behavior

- One question per screen
- Swipe for navigation
- Large touch targets for options
- Timer always visible
- Submit button prominent
- Full-screen encouraged

### PWA Support

- Offline capability for tests
- Auto-sync on reconnect
- Local storage backup

---

## Related Documentation

- [Test Results](./test-results.md)
- [Teacher Exams](../03-teacher/exams.md)
- [Exam Flow](../05-cross-login-flows/exam-flow.md)
- [Student Smoke Tests](../06-testing-scenarios/smoke-tests/student.md)

---

*Last Updated: January 2025*
