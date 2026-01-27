# Student Dashboard

> Mobile-first daily hub with schedule, homework, and AI recommendations.

---

## Overview

The Student Dashboard is the primary landing page for students, designed mobile-first with a premium aesthetic. It displays today's schedule, pending homework, AI-driven recommendations, and provides quick access to learning content.

## Access

- **Route**: `/student/dashboard`
- **Login Types**: Student
- **Permissions Required**: Student account with batch enrollment

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| DashboardHeader | Name + streak | Top |
| AIRecommendations | Swipeable cards | Top section |
| TodaySchedule | Interactive timeline | Main content |
| PendingHomework | Urgent items | Below schedule |
| ClassDetailSheet | Class info | Bottom drawer |

---

## Features & Functionality

### Dashboard Header

```text
┌─────────────────────────────────────────────────────────────┐
│ Good Morning, Rahul! 👋                    🔥 5 day streak │
│ Ready to learn?                                             │
└─────────────────────────────────────────────────────────────┘
```

### AI Recommendations Carousel

Swipeable glassmorphic cards with orange gradient accents:

```text
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ 🎯 High Priority│ │ 📈 Improve      │ │ 🔄 Revise       │
│                 │ │                 │ │                 │
│ Laws of Motion  │ │ Thermodynamics  │ │ Kinematics      │
│ 3 weak areas    │ │ 85% mastery     │ │ Last week       │
│                 │ │                 │ │                 │
│ [Start Now]     │ │ [Practice]      │ │ [Quick Review]  │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

Card Design:
- Light glassmorphic background
- Orange gradient icons
- Left-border accent
- Tap to navigate

### Today's Schedule (Interactive Timeline)

```text
Today's Classes - Monday, Jan 15
┌─────────────────────────────────────────────────────────────┐
│ 08:00  ● Period 1 - Physics                                 │
│           Motion - Dr. Kumar                                │
│           ✓ Completed                                       │
├─────────────────────────────────────────────────────────────┤
│ 09:45  ◉ Period 3 - Chemistry          LIVE NOW            │
│           Chemical Bonding - Mrs. Singh                     │
│           [Join Class]                                      │
├─────────────────────────────────────────────────────────────┤
│ 11:45  ○ Period 5 - Mathematics                             │
│           Polynomials - Mr. Sharma                          │
│           Upcoming                                          │
└─────────────────────────────────────────────────────────────┘
```

### Class Detail Sheet

Tapping a class opens detail drawer:

```text
Period 3 - Chemistry
┌─────────────────────────────────────────────────────────────┐
│ Chemical Bonding                                            │
│ Mrs. Priya Singh                                            │
│ 09:45 - 10:30 (45 min)                                     │
│ Room: 302                                                   │
├─────────────────────────────────────────────────────────────┤
│ Today's Lesson:                                             │
│ • Ionic Bonding Introduction                                │
│ • Covalent Bonds                                            │
│                                                              │
│ Resources Available: 2 videos, 1 PDF                        │
│                                                              │
│ [Join Class] [View Content] [Take Notes]                    │
└─────────────────────────────────────────────────────────────┘
```

### Pending Homework

```text
⚠️ Homework Due Soon
┌─────────────────────────────────────────────────────────────┐
│ 🔴 Motion Worksheet                          Due: Today     │
│    Physics • Practice                                       │
│    [Submit]                                                 │
├─────────────────────────────────────────────────────────────┤
│ 🟡 Atomic Structure Quiz                     Due: Tomorrow  │
│    Chemistry • Test                                         │
│    [Start]                                                  │
└─────────────────────────────────────────────────────────────┘
```

### Quick Stats (Hidden on Mobile)

On desktop sidebar:
- Study streak
- Weekly progress
- Upcoming tests

---

## Data Flow

```text
Sources:
├── Batch Timetable (today's classes)
├── Teacher Lesson Plans (content)
├── Homework Assignments (pending)
├── AI Analysis (recommendations)
└── Progress Data (streak)
         │
         ▼
Dashboard:
├── Filter for today
├── Calculate urgency
└── Prioritize display
```

---

## Cross-Login Connections

| Dashboard Element | Source | What It Shows |
|-------------------|--------|---------------|
| Schedule | Institute Timetable | Today's classes |
| Lesson content | Teacher Lesson Plans | Class resources |
| Homework | Teacher Assignments | Pending items |
| AI recommendations | Performance Analysis | Personalized paths |

---

## Business Rules

1. **Schedule shows** only student's batch classes
2. **Live class** highlighted with pulse
3. **Homework urgency** based on due date
4. **AI recommendations** update daily
5. **Streak tracks** consecutive study days
6. **Quick Stats** hidden on mobile to reduce scroll

---

## Mobile Behavior

- Header: Compact with essential info
- Recommendations: Horizontal swipe carousel
- Schedule: Vertical timeline, tap to expand
- Homework: Full-width cards with urgency indicators
- Touch targets: 44px minimum
- Pull-to-refresh: Updates all sections

---

## Related Documentation

- [Subjects](./subjects.md)
- [Chapter View](./chapter-view.md)
- [Homework](./homework.md)
- [Student Smoke Tests](../06-testing-scenarios/smoke-tests/student.md)

---

*Last Updated: January 2025*
