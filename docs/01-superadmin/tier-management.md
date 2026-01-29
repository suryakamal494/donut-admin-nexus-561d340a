# Tier Management

> Define feature packages and user limits that control institute capabilities.

---

## Overview

Tier Management is the feature control center for the platform. It defines what features, limits, and capabilities each institute receives based on their subscription plan. When an institute is created and assigned a tier, only the features enabled in that tier will appear in the institute portal.

## Access

- **Route**: `/superadmin/institutes/tiers`
- **Login Types**: SuperAdmin
- **Permissions Required**: `tiers.view`, `tiers.create`, `tiers.edit`, `tiers.delete`

---

## Purpose

**Why Tier Management Exists:**
1. **Feature Control**: Enable/disable specific features for different subscription levels
2. **Resource Limits**: Set maximum users, batches, and storage per tier
3. **Revenue Model**: Create Basic, Pro, Enterprise tiers with different pricing
4. **Institute Customization**: Match features to institute needs and budget

**How It Affects Institutes:**
- Features toggled OFF in a tier will NOT appear in the institute portal sidebar
- User limits (students, teachers) are enforced at institute level
- AI feature quotas (question generation, content generation) are tier-specific
- Storage and bandwidth limits apply per tier

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| TierCards | Plan cards showing name, price, key features | Top section |
| FeatureComparison | Full matrix of all features across tiers | Main content |
| CreateTierDialog | Form for creating new tier | Dialog |
| EditTierPage | Full edit page with all tier settings | Full page |

---

## How Tiers Work

### Tier-to-Institute Connection

```text
┌──────────────────────────────────────────────────────────────────┐
│                       TIER MANAGEMENT FLOW                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    SUPERADMIN                                │ │
│  │  Creates tiers with feature toggles and limits               │ │
│  │  Example: Basic (limited), Pro (AI features), Enterprise     │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│                    tier assigned at creation                      │
│                              ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    INSTITUTE CREATION                        │ │
│  │  Step 3: Plan Selection → Tier assigned to institute         │ │
│  │  Tier determines: sidebar items, AI access, limits           │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│                    features enabled/disabled                      │
│                              ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    INSTITUTE PORTAL                          │ │
│  │  Sidebar shows ONLY enabled features                         │ │
│  │  AI buttons show ONLY if AI features enabled                 │ │
│  │  User creation blocked when limit reached                    │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### When Tier is Assigned

1. Institute sidebar filters to show only enabled features
2. AI generation buttons appear only if AI features are ON
3. PDF upload buttons appear only if PDF features are ON
4. User creation is blocked when tier limits are reached
5. Storage upload is blocked when storage limit is reached

---

## Complete Feature Matrix

The feature matrix must include ALL institute portal features:

### Core Features

| Feature | Description | Affects |
|---------|-------------|---------|
| Dashboard | Institute dashboard access | Always enabled |
| Batches | Create and manage student batches | Sidebar item |
| Teachers | Manage teachers | Sidebar item |
| Students | Manage students | Sidebar item |
| Timetable | Weekly timetable management | Sidebar item |
| Syllabus Tracker | Track curriculum progress | Sidebar item |
| Master Data | View curriculum/course structure | Sidebar item |
| Roles & Access | Role-based permissions | Sidebar item |

### Question Bank Features

| Feature | Description | Affects |
|---------|-------------|---------|
| Question Bank | View and create questions | Sidebar item |
| AI Question Generator | Generate questions with AI | Button visibility |
| PDF Question Upload | Extract questions from PDF | Button visibility |
| Manual Question Entry | Create questions manually | Always if QB enabled |

### Content Library Features

| Feature | Description | Affects |
|---------|-------------|---------|
| Content Library | View and create content | Sidebar item |
| AI Content Generator | Generate PPTs/content with AI | Button visibility |
| Manual Content Upload | Upload content manually | Always if CL enabled |

### Exam Features

| Feature | Description | Affects |
|---------|-------------|---------|
| Exams | Create and manage exams | Sidebar item |
| AI Exam Creation | AI-assisted exam building | Feature visibility |
| PDF Exam Upload | Upload exam from PDF | Button visibility |
| Exam Patterns | Use predefined exam patterns | Feature visibility |
| Live Assessments | Real-time assessments | Feature visibility |

### Analytics & Reports

| Feature | Description | Affects |
|---------|-------------|---------|
| Basic Reports | Standard reports | Always enabled |
| Advanced Analytics | Deep performance insights | Tier-gated |
| Custom Reports | Create custom report templates | Tier-gated |
| Export Reports | Export to PDF/Excel | Tier-gated |

### Support Features

| Feature | Description | Affects |
|---------|-------------|---------|
| Email Support | Standard email support | Always enabled |
| Priority Support | Faster response times | Tier-gated |
| Dedicated Manager | Account manager | Enterprise only |

---

## User Limits by Tier

| Limit | Basic | Standard | Premium |
|-------|-------|----------|---------|
| Maximum Students | 100 | 500 | Unlimited |
| Maximum Teachers | 10 | 50 | Unlimited |
| Maximum Batches | 5 | 20 | Unlimited |
| Storage (GB) | 5 | 25 | 100 |
| AI Questions/Month | 0 | 500 | 5000 |
| AI Content/Month | 0 | 100 | 1000 |

---

## Create Tier Flow

### Step 1: Basic Information

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Tier Name | Text | Yes | Display name (e.g., "Pro Plan") |
| Tier Code | Text | Yes | Internal code (e.g., "pro") |
| Price | Number | Yes | Monthly price |
| Billing Cycle | Dropdown | Yes | Monthly, Quarterly, Yearly |
| Description | Textarea | No | Marketing description |
| Badge Color | Color picker | No | Display color |

### Step 2: User Limits

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Max Students | Number | Yes | 0 = unlimited |
| Max Teachers | Number | Yes | 0 = unlimited |
| Max Batches | Number | Yes | 0 = unlimited |
| Storage (GB) | Number | Yes | Storage allocation |
| AI Question Quota | Number | Yes | Monthly AI question limit |
| AI Content Quota | Number | Yes | Monthly AI content limit |

### Step 3: Features by Category

Each feature has a toggle (ON/OFF):

**Content Management**
- [ ] Content Library
- [ ] AI Content Generator
- [ ] Manual Upload

**Question Management**
- [ ] Question Bank
- [ ] AI Question Generator
- [ ] PDF Question Upload

**Exam Management**
- [ ] Exams Module
- [ ] Exam Patterns
- [ ] PDF Exam Upload
- [ ] Live Assessments

**Academic Tools**
- [ ] Timetable
- [ ] Syllabus Tracker
- [ ] Academic Calendar

**Analytics**
- [ ] Basic Reports
- [ ] Advanced Analytics
- [ ] Custom Reports
- [ ] Export to PDF/Excel

**Administration**
- [ ] Roles & Access
- [ ] Batch Management
- [ ] Teacher Management
- [ ] Student Management

---

## Feature Comparison Table

The main page displays a comparison matrix:

| Feature | Basic | Standard | Premium |
|---------|-------|----------|---------|
| Dashboard | ✓ | ✓ | ✓ |
| Batches | ✓ | ✓ | ✓ |
| Teachers | ✓ | ✓ | ✓ |
| Students | ✓ | ✓ | ✓ |
| Timetable | ✗ | ✓ | ✓ |
| Syllabus Tracker | ✗ | ✓ | ✓ |
| Question Bank | ✓ | ✓ | ✓ |
| AI Question Generator | ✗ | ✓ | ✓ |
| PDF Question Upload | ✗ | ✓ | ✓ |
| Content Library | ✓ | ✓ | ✓ |
| AI Content Generator | ✗ | ✓ | ✓ |
| Exams | ✓ | ✓ | ✓ |
| Exam Patterns | ✗ | ✓ | ✓ |
| Live Assessments | ✗ | ✗ | ✓ |
| Advanced Analytics | ✗ | ✗ | ✓ |
| Custom Reports | ✗ | ✗ | ✓ |
| Roles & Access | ✗ | ✓ | ✓ |
| Priority Support | ✗ | ✗ | ✓ |

---

## Cross-Login Impact

| Tier Feature | Institute Effect |
|--------------|------------------|
| AI Question Generator OFF | "Generate with AI" button hidden in Question Bank |
| PDF Question Upload OFF | "Upload PDF" button hidden in Question Bank |
| AI Content Generator OFF | "AI Generate" button hidden in Content Library |
| Timetable OFF | Timetable menu item hidden in sidebar |
| Syllabus Tracker OFF | Syllabus menu item hidden in sidebar |
| Advanced Analytics OFF | Analytics section simplified |
| Roles & Access OFF | Roles menu item hidden, default roles only |

---

## Business Rules

1. **Tier required for institute creation** - Cannot skip plan selection
2. **Tier upgrade immediate** - New features appear instantly
3. **Tier downgrade warning** - Shows affected features before applying
4. **Default tier required** - One tier must be marked as default
5. **Cannot delete used tier** - Reassign institutes first
6. **Limit enforcement** - Cannot exceed tier limits (user creation blocked)

---

## Verification Points

When testing tier functionality:

1. **After Creating Tier**: Verify appears in comparison matrix
2. **After Assigning to Institute**: Login to institute, verify sidebar matches tier features
3. **After Tier Upgrade**: Verify new features appear in institute portal
4. **AI Features**: Verify AI buttons visible/hidden based on tier
5. **User Limits**: Verify cannot add users beyond tier limit

---

## Mobile Behavior

- Tier cards: Swipeable carousel
- Feature comparison: Horizontal scroll table
- Create tier: Full-screen multi-step form
- Toggles: Touch-friendly 44px+ targets

---

## Related Documentation

- [Institutes Management](./institutes.md)
- [Institute Onboarding Flow](../05-cross-login-flows/institute-onboarding.md)
- [SuperAdmin Smoke Tests](../06-testing-scenarios/smoke-tests/superadmin.md)

---

*Last Updated: January 2025*
