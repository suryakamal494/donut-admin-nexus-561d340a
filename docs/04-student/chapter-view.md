# Chapter View & Three Modes

> Three-lens learning system: Classroom, My Path, and Compete.

---

## Overview

The Chapter View is the central learning hub where students access content through three distinct modes: Classroom (teacher-led), My Path (AI-driven), and Compete (challenges). The mode switcher uses horizontally scrollable pills with color-coding and haptic feedback.

## Access

- **Route**: `/student/chapter/:id`
- **Login Types**: Student
- **Permissions Required**: Enrolled in subject

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| ChapterHeader | Chapter name + subject | Top |
| ModeSwitcher | Horizontal scroll pills | Below header |
| ModeContent | Active mode content | Main content |
| ModeOnboardingTooltip | First-visit explanation | Overlay |

---

## Features & Functionality

### Mode Switcher

```text
┌─────────────────────────────────────────────────────────────┐
│ [🏫 Classroom (5)] [🎯 My Path (3)] [🏆 Compete (2)]        │
│      Active            Available         Available          │
└─────────────────────────────────────────────────────────────┘
```

### Mode Pill Design

| Mode | Color | Icon | Label |
|------|-------|------|-------|
| Classroom | Blue | 🏫 | Classroom |
| My Path | Purple | 🎯 | My Path |
| Compete | Amber | 🏆 | Compete |

### Pill Interactions

- Tap to switch mode
- 10ms haptic feedback
- Item count shown
- Active state highlighted
- Horizontal scroll on overflow

### First-Visit Onboarding

```text
┌─────────────────────────────────────────────────────────────┐
│ Welcome to Chapter Learning! 👋                             │
│                                                              │
│ 🏫 Classroom: Follow your teacher's lessons                 │
│ 🎯 My Path: AI recommendations just for you                 │
│ 🏆 Compete: Challenge yourself with quizzes                 │
│                                                              │
│ [Got it!]                                                   │
└─────────────────────────────────────────────────────────────┘
```

One-time tooltip stored in localStorage.

---

## Three Modes Detail

### Classroom Mode

Teacher-led narrative structured as "Class Sessions":

```text
Classroom - Laws of Motion
┌─────────────────────────────────────────────────────────────┐
│ Class Session: Jan 15 - Introduction                        │
│ Dr. Rajesh Kumar                                            │
├─────────────────────────────────────────────────────────────┤
│ 📹 Newton's Laws Video                      15 min    ✓    │
│ 📝 Key Concepts Notes                       5 min     ✓    │
│ ❓ Quick Check Quiz                         5 min     ○    │
│ 📚 Practice Worksheet [Homework]            -         ○    │
└─────────────────────────────────────────────────────────────┘
```

Flow: LEARN → CHECK → PRACTICE → SUBMIT

### My Path Mode

AI-driven prescriptions for personalized learning:

```text
My Path - Laws of Motion
┌─────────────────────────────────────────────────────────────┐
│ 🔴 High Priority                                            │
│ Newton's Third Law - Action Reaction                        │
│ You struggled with this in the last quiz                    │
│ [Start Practice]                                            │
├─────────────────────────────────────────────────────────────┤
│ 🟡 Medium Priority                                          │
│ Free Body Diagrams                                          │
│ Strengthen your understanding                               │
│ [Practice Now]                                              │
├─────────────────────────────────────────────────────────────┤
│ 🟢 Low Priority                                             │
│ Conservation of Momentum                                    │
│ Quick revision recommended                                  │
│ [Review]                                                    │
└─────────────────────────────────────────────────────────────┘
```

Priority based on:
- Quiz performance
- Time since last practice
- Topic difficulty
- Upcoming exams

### Compete Mode

Challenges and benchmarks for mastery testing:

```text
Compete - Laws of Motion
┌─────────────────────────────────────────────────────────────┐
│ 🏆 Daily Challenge                           New!           │
│ Laws of Motion Speed Quiz                                   │
│ 10 questions • 5 min • Top 10% earns badge                 │
│ [Start Challenge]                                           │
├─────────────────────────────────────────────────────────────┤
│ 📊 Leaderboard                                              │
│ 1. Priya G. - 95%    2. Amit K. - 92%    3. You - 88%     │
├─────────────────────────────────────────────────────────────┤
│ 🎯 Mastery Test                                             │
│ Prove your understanding of the full chapter               │
│ [Take Test]                                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow

```text
Sources:
├── Teacher Lesson Plans → Classroom Mode
├── AI Performance Analysis → My Path Mode
├── Challenge Content → Compete Mode
└── Student Progress → All modes
         │
         ▼
Chapter View:
├── Display by active mode
├── Track completion
└── Update recommendations
```

---

## Cross-Login Connections

| Mode | Content Source | Updates |
|------|----------------|---------|
| Classroom | Teacher Lesson Plans | Lesson bundles visible |
| My Path | AI Analysis | Personalized paths |
| Compete | Curated Challenges | Leaderboards |

---

## Business Rules

1. **Mode switch** doesn't leave chapter context
2. **Classroom** shows teacher-assigned content only
3. **My Path** recalculates on performance change
4. **Compete** challenges refresh periodically
5. **Progress persists** across mode switches
6. **Onboarding** shown once per device

---

## Mobile Behavior

- Mode pills: Horizontal scroll with momentum
- Content: Vertical scroll within mode
- Haptic: 10ms feedback on mode select
- Touch targets: 44px minimum
- Transitions: Smooth fade between modes

---

## Related Documentation

- [Classroom Mode](./classroom-mode.md)
- [My Path Mode](./mypath-mode.md)
- [Compete Mode](./compete-mode.md)
- [Content Viewer](./content-viewer.md)
- [Student Smoke Tests](../06-testing-scenarios/smoke-tests/student.md)

---

*Last Updated: January 2025*
