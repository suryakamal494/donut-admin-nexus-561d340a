

# Phase 1: Remotion Video Explanations — Demo Implementation

## What You Get Today

3-5 pre-rendered branded MP4 videos using Remotion, built from your existing mock exam data. These videos will be playable from two places in the platform:

1. **Test Results page** — a "Watch Explanation" button next to each wrong answer in the Question Review tab
2. **Student Copilot** — the Test Debrief artifact shows a play icon next to wrong answers, and the AI agent can proactively offer video links

No AWS account or external infrastructure needed. Videos are rendered in the sandbox using Remotion CLI and stored in your platform's file storage.

---

## What Gets Built

### A. Remotion Video Templates (rendered to MP4 in sandbox)

**Wrong Answer Explanation Video** (~20 seconds, 1280x720, 30fps)

4 scenes per the feature doc:
1. Question Recap — question text fades in, wrong option highlighted red
2. Correct Answer Reveal — correct option highlights green
3. Step-by-step Explanation — each step animates in sequentially
4. Summary — key takeaway + DonutAI branding

Data source: 3-5 wrong answers from `testResultsGenerator.ts` mock data (Physics/Math questions with solutions already written).

**Visual direction**: "Sophisticated Warmth" matching DonutAI brand — warm coral/orange palette, Plus Jakarta Sans, clean card-based layouts, spring animations.

### B. Frontend UI Components (4 new files)

| Component | Purpose | Location |
|-----------|---------|----------|
| `VideoPlayerModal.tsx` | Full-screen modal with HTML5 video player, close button, loading/error states | `src/components/student/tests/results/` |
| `WrongAnswerVideoButton.tsx` | "Watch Explanation" pill button with play icon | `src/components/student/tests/results/` |
| `WeeklyReportCard.tsx` | Dashboard card showing "Week 34 Report — Watch (0:40)" | `src/components/student/dashboard/` |
| `VideoExplanationButton.tsx` | Compact play button for copilot debrief cards | `src/components/student/copilot/artifacts/` |

### C. Integration Points (4 existing files modified)

| File | Change |
|------|--------|
| `QuestionReview.tsx` | Add `WrongAnswerVideoButton` next to each incorrect question's solution section |
| `TestDebriefView.tsx` | Add `VideoExplanationButton` next to each wrong question card |
| `StudentCopilotPage.tsx` | Wire video button click to open `VideoPlayerModal` |
| Student dashboard page | Add `WeeklyReportCard` component |

### D. Mock Video Data Layer

A `src/data/student/videoExplanations.ts` file mapping question IDs to video URLs (pointing to the pre-rendered MP4s stored in platform storage). This acts as the bridge between the existing question data and the video player.

---

## Technical Approach

### Remotion Rendering (sandbox, not in the app)

1. Create `remotion/` directory in project root with the WrongAnswerVideo composition
2. Install Remotion packages via bun
3. Build 4 scene components using `useCurrentFrame()` + `interpolate()` + `spring()` — no CSS animations
4. Render 3-5 MP4s using the programmatic render script, one per wrong question from mock data
5. Upload rendered MP4s to platform storage bucket (`explanation-videos`)
6. Map video URLs in `videoExplanations.ts`

### Video Storage

Create a `explanation-videos` storage bucket (public read) via SQL migration. Upload pre-rendered MP4s there. Frontend references them by signed URL.

### UI Flow

```text
Student finishes exam → Views Results → Review tab
  → Sees wrong answer Q3
  → Clicks "Watch Explanation (0:20)"
  → VideoPlayerModal opens → plays MP4

Student opens Copilot → Test Debrief artifact
  → Wrong answer card for Q3 has play icon
  → Clicks → same VideoPlayerModal
```

---

## Remotion Project Structure

```text
remotion/
  tsconfig.json
  package.json
  scripts/
    render-remotion.mjs
  src/
    index.ts
    Root.tsx
    WrongAnswerVideo.tsx
    scenes/
      QuestionRecap.tsx
      CorrectReveal.tsx
      ExplanationSteps.tsx
      Summary.tsx
    components/
      AnimatedText.tsx
      OptionBubble.tsx
      ProgressBar.tsx
    constants.ts
```

---

## Implementation Order

1. Set up Remotion project in `remotion/` directory, install deps, configure compositor
2. Build WrongAnswerVideo composition (4 scenes) with DonutAI branding
3. Render 3-5 MP4s from mock exam data
4. Create storage bucket and upload videos
5. Build `VideoPlayerModal` and `WrongAnswerVideoButton` components
6. Build `VideoExplanationButton` for copilot debrief
7. Create `videoExplanations.ts` mock data mapping
8. Integrate into `QuestionReview.tsx` (Test Results)
9. Integrate into `TestDebriefView.tsx` (Copilot)
10. Build `WeeklyReportCard` for dashboard (static demo — points to a placeholder video)

---

## What This Does NOT Include (Future Phase 2)

- Dynamic on-demand video rendering (requires AWS Lambda)
- Weekly report video generation (requires cron + batch rendering)
- Real student data integration (requires live database)
- Parent WhatsApp notifications with video links

These require AWS S3 + Lambda infrastructure which will be set up in a future phase.

