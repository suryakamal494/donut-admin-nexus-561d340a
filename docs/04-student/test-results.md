# Test Results

> Score display and performance analysis.

---

## Overview

The Test Results page displays scores, correct answers, and performance analysis after test completion. It provides detailed feedback for learning improvement and comparison with peer performance.

## Access

- **Route**: `/student/test/:id/results`
- **Login Types**: Student
- **Permissions Required**: Test completed

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| ResultsHeader | Score summary | Top |
| ScoreCard | Visual score display | Top section |
| QuestionReview | Answer breakdown | Main content |
| AnalysisSection | Performance insights | Bottom |

---

## Features & Functionality

### Score Summary

```text
┌─────────────────────────────────────────────────────────────┐
│ Motion Concepts Quiz - Results                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│              ┌─────────────┐                                │
│              │             │                                │
│              │    85%      │                                │
│              │   17/20     │                                │
│              │             │                                │
│              └─────────────┘                                │
│                                                              │
│ 🎉 Great job! Above class average                           │
│                                                              │
│ Time Taken: 12:45 / 15:00                                   │
│ Class Average: 72%                                          │
│ Your Rank: 5/45                                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Score Visualization

| Score Range | Color | Message |
|-------------|-------|---------|
| 90-100% | Green | Excellent! |
| 75-89% | Blue | Great job! |
| 50-74% | Amber | Good effort |
| < 50% | Red | Keep practicing |

### Question Review

```text
Question Review
┌─────────────────────────────────────────────────────────────┐
│ Q1. A particle moves with velocity v = 3t²...               │
│                                                              │
│ Your Answer: B) 10 m/s²                           ✓ Correct │
│ Correct Answer: B) 10 m/s²                                  │
│                                                              │
│ [View Explanation]                                          │
├─────────────────────────────────────────────────────────────┤
│ Q2. Newton's First Law states...                            │
│                                                              │
│ Your Answer: A) Force equals mass times acceleration        │
│ Correct Answer: C) An object at rest stays at rest  ✗ Wrong │
│                                                              │
│ [View Explanation]                                          │
├─────────────────────────────────────────────────────────────┤
│ Q3. ...                                                     │
└─────────────────────────────────────────────────────────────┘
```

### Question States

| State | Icon | Color |
|-------|------|-------|
| Correct | ✓ | Green |
| Wrong | ✗ | Red |
| Skipped | ○ | Gray |
| Partial | ◐ | Amber |

### Explanation View

```text
┌─────────────────────────────────────────────────────────────┐
│ Explanation - Question 2                                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Newton's First Law (Law of Inertia) states that an          │
│ object at rest stays at rest, and an object in motion       │
│ stays in motion, unless acted upon by an external force.    │
│                                                              │
│ Option A describes Newton's Second Law (F = ma).            │
│                                                              │
│ Key Concept: Inertia                                        │
│ Related Topics: Force, Motion                               │
│                                                              │
│ [Close]                                                     │
└─────────────────────────────────────────────────────────────┘
```

### Analysis Section

```text
Performance Analysis
┌─────────────────────────────────────────────────────────────┐
│ Topic Breakdown:                                            │
│                                                              │
│ Newton's Laws      ████████████████░░░░  80% (4/5)         │
│ Motion             ██████████████████░░  90% (9/10)        │
│ Force              ████████████░░░░░░░░  60% (3/5)         │
│                                                              │
│ 💡 Recommendation: Focus on Force concepts                  │
│                                                              │
│ [Practice Weak Areas]                                       │
└─────────────────────────────────────────────────────────────┘
```

### Comparison Stats

| Metric | Display |
|--------|---------|
| Your Score | Primary, large |
| Class Average | Comparison |
| Highest Score | Benchmark |
| Your Rank | Position |

---

## Data Flow

```text
Source: Test attempt data
         │
         ▼
Processing:
├── Calculate score
├── Mark correct/wrong
├── Generate analysis
├── Compare with peers
         │
         ▼
Display:
├── Score summary
├── Question review
└── Topic analysis
         │
         ▼
Action: Link to practice weak areas
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Test Attempt | Test Player | Upstream | Provides responses |
| Analysis | My Path | Downstream | Feeds recommendations |
| Score | Progress | Updates | Analytics data |
| Weak Areas | Practice Content | Navigation | Links to content |

---

## Business Rules

1. **Results available** immediately or after deadline
2. **Explanations** if teacher enabled
3. **Correct answers** shown based on settings
4. **Rank calculation** within batch
5. **Analysis feeds** My Path recommendations
6. **Re-attempt** if teacher allows

---

## Mobile Behavior

- Score: Prominent, centered
- Questions: Expandable cards
- Analysis: Collapsible sections
- Navigation: Back to test list
- Touch targets: 44px minimum

---

## Related Documentation

- [Test Player](./test-player.md)
- [My Path Mode](./mypath-mode.md)
- [Progress Analytics](./progress.md)
- [Student Smoke Tests](../06-testing-scenarios/smoke-tests/student.md)

---

*Last Updated: January 2025*
