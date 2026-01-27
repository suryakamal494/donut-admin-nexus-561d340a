# Compete Mode

> Challenges, leaderboards, and mastery tests.

---

## Overview

Compete Mode provides challenging content designed to test mastery against benchmarks and peers. It includes daily challenges, chapter mastery tests, and leaderboards to motivate competitive learning.

## Access

- **Route**: `/student/chapter/:id` (Compete tab)
- **Login Types**: Student
- **Permissions Required**: Chapter access

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| ChallengeSection | Daily/Weekly challenges | Top |
| LeaderboardWidget | Peer rankings | Middle |
| MasteryTestCard | Chapter mastery test | Bottom |
| BadgeDisplay | Earned achievements | Within cards |

---

## Features & Functionality

### Daily Challenge

```text
┌─────────────────────────────────────────────────────────────┐
│ 🏆 Daily Challenge                              NEW! 🔔     │
├─────────────────────────────────────────────────────────────┤
│ Laws of Motion Speed Quiz                                   │
│                                                              │
│ • 10 questions                                              │
│ • 5 minute time limit                                       │
│ • Top 10% earns "Speed Demon" badge                        │
│                                                              │
│ Today's Participants: 127                                   │
│ Your Best: Not attempted                                    │
│                                                              │
│ [Start Challenge →]                                         │
└─────────────────────────────────────────────────────────────┘
```

### Challenge Types

| Type | Frequency | Format | Reward |
|------|-----------|--------|--------|
| Daily | Every day | Speed quiz | Badges |
| Weekly | Mondays | Mixed questions | Points |
| Special | Events | Themed content | Special badges |

### Leaderboard

```text
┌─────────────────────────────────────────────────────────────┐
│ 📊 Chapter Leaderboard                                      │
├─────────────────────────────────────────────────────────────┤
│ 🥇 1. Priya Gupta         │ 95%  │ ⭐⭐⭐               │
│ 🥈 2. Amit Kumar          │ 92%  │ ⭐⭐                │
│ 🥉 3. You (Rahul)         │ 88%  │ ⭐⭐                │
│    4. Sneha Patel         │ 85%  │ ⭐                  │
│    5. Vikram Singh        │ 82%  │ ⭐                  │
├─────────────────────────────────────────────────────────────┤
│ Your Rank: 3/45 in 10A                                      │
│ [View Full Leaderboard]                                     │
└─────────────────────────────────────────────────────────────┘
```

### Leaderboard Scopes

| Scope | Description |
|-------|-------------|
| Batch | Within class section |
| Chapter | For this chapter only |
| Subject | Overall subject ranking |
| All-Time | Historical performance |

### Mastery Test

```text
┌─────────────────────────────────────────────────────────────┐
│ 🎯 Chapter Mastery Test                                     │
├─────────────────────────────────────────────────────────────┤
│ Prove your mastery of Laws of Motion                        │
│                                                              │
│ • 20 questions (mixed difficulty)                           │
│ • 30 minute time limit                                      │
│ • Covers all topics in chapter                              │
│                                                              │
│ Requirements:                                               │
│ ✓ Complete at least 80% of Classroom content               │
│ ✓ Attempt My Path prescriptions                             │
│                                                              │
│ Your Status: Ready to attempt                               │
│                                                              │
│ [Take Mastery Test →]                                       │
└─────────────────────────────────────────────────────────────┘
```

### Badges & Achievements

| Badge | Criteria | Visual |
|-------|----------|--------|
| Speed Demon | Top 10% in speed quiz | ⚡ |
| Perfectionist | 100% on any test | 💯 |
| Consistent | 5-day streak | 🔥 |
| Master | Pass mastery test | 🎓 |

### Badge Display

```text
Your Achievements - Laws of Motion
⚡ Speed Demon  💯 Perfectionist  🔥 5-Day Streak
```

---

## Data Flow

```text
Source: Curated Challenge Content
         │
         ▼
Challenge System:
├── Daily refresh
├── Participation tracking
└── Score recording
         │
         ▼
Leaderboards:
├── Real-time ranking
├── Batch filtering
└── Historical tracking
         │
         ▼
Display: Compete Mode UI
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Challenges | Question Bank | Reference | Uses curated questions |
| Leaderboard | Peer Scores | Local | Comparative ranking |
| Mastery Test | Progress | Prerequisite | Requires completion |
| Badges | Profile | Local | Displayed achievements |

---

## Business Rules

1. **Daily challenge resets** at midnight
2. **Leaderboard updates** in real-time
3. **Mastery test** requires classroom completion
4. **Badges permanent** once earned
5. **One attempt** per daily challenge
6. **Anonymous option** for leaderboard

---

## Mobile Behavior

- Challenge cards: Full-width, prominent CTA
- Leaderboard: Scrollable with sticky header
- Badges: Horizontal scroll display
- Touch targets: 44px minimum
- Animations: Celebratory on achievement

---

## Related Documentation

- [Chapter View](./chapter-view.md)
- [Test Player](./test-player.md)
- [Progress Analytics](./progress.md)
- [Student Smoke Tests](../06-testing-scenarios/smoke-tests/student.md)

---

*Last Updated: January 2025*
