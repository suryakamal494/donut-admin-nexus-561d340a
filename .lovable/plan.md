

# Phased Implementation Plan: Tests Page UI Improvements + Full Subject Coverage

## Overview

Three distinct phases addressing: (1) Desktop layout polish for the Tests page, (2) Adding a "Subject Tests" section divider, and (3) Expanding the subject system to cover all CBSE/ICSE K-12 subjects with proper icons, colors, patterns, and mock test data.

---

## Phase 1: Desktop Tests Page Layout Refinements

### 1A. Move Search Bar Inline with Header (Desktop Only)

**File:** `src/pages/student/Tests.tsx`

On desktop (lg+), place the search icon/bar to the right of the "Tests & Practice" header, removing the separate full-width search bar row. On mobile, keep the search bar below the header as-is.

- Wrap the header in a `flex justify-between items-center` container
- On `lg:`, render a compact search icon button that expands into the search bar on click (or render the search bar inline at ~300px width)
- On mobile (`lg:hidden`), keep the current full-width `TestSearchBar` below the header

### 1B. Add "Subject Tests" Label Between Live Now and Subject Cards

**File:** `src/pages/student/Tests.tsx`

After `LiveTestsSection` and before the subject cards grid, add a small, subtle section label:

```
<p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
  By Subject
</p>
```

This creates clear visual separation between the Live Now carousel and the static subject cards, without a heavy header.

---

## Phase 2: Expand Subject System for All CBSE/ICSE Subjects

### Subjects to Add

Based on CBSE and ICSE curricula (Classes 1-12), the following subjects are missing from the current 6 (Mathematics, Physics, Chemistry, Biology, English, Computer Science):

| Subject | Color Key | Lucide Icon | Pattern Style |
|---------|-----------|-------------|---------------|
| Hindi | orange | Languages | Text/Devanagari-inspired lines |
| Sanskrit | indigo | ScrollText | Ancient script motifs |
| Social Science | slate | Globe | Map contour lines |
| History | brown | Landmark | Pillars/timeline |
| Geography | teal | Mountain | Terrain contours |
| Political Science / Civics | sky | Scale | Balance scales |
| Economics | emerald | TrendingUp | Charts/graphs |
| Science (combined, Classes 6-10) | lime | Microscope | Microscope + beaker |
| Zoology (NEET) | pink | Bug | Animal cell outlines |
| Botany (NEET) | green (reuse) | Sprout | Plant cell outlines |
| Environmental Studies (EVS) | teal | TreePine | Trees/nature |
| Art / Fine Arts | fuchsia | Palette | Paint strokes |
| Physical Education | orange | Dumbbell | Sports elements |
| Accountancy | stone | Receipt | Ledger lines |
| Business Studies | zinc | Briefcase | Org chart |
| Artificial Intelligence | violet | BrainCircuit | Neural network nodes |
| Informatics Practices | sky | Database | Data flow |
| Home Science | rose | Home | Kitchen/home elements |

### 2A. Add New Color Schemes

**File:** `src/components/student/shared/subjectColors.ts`

- Expand `SubjectColorKey` type to include: `"orange"`, `"indigo"`, `"slate"`, `"brown"`, `"sky"`, `"lime"`, `"pink"`, `"fuchsia"`, `"stone"`, `"zinc"`
- Expand `SubjectPattern` type to include all new subject patterns
- Add corresponding entries to `subjectColorSchemes` following the exact same structure (gradient, headerGradient, iconBg, numberBg, progressBg, progressFill, progressBar, textAccent, patternColor, border, pattern)
- Expand `subjectIconMap` with all new Lucide icons
- Expand `subjectPatternMap` with all new subject ID mappings

### 2B. Add New Background Patterns

**File:** `src/components/student/subjects/SubjectBackgroundPattern.tsx`

Add new SVG pattern components for each new subject, following the exact same structure as existing ones (decorative, low-opacity, positioned top-right):

- `HindiPattern`: Devanagari-inspired script lines
- `SanskritPattern`: Ancient scroll motifs
- `SocialSciencePattern`: Map contour lines with compass
- `HistoryPattern`: Pillars and timeline dots
- `GeographyPattern`: Mountain contours and compass rose
- `CivicsPattern`: Balance scale outline
- `EconomicsPattern`: Rising chart line with bar graph
- `SciencePattern`: Microscope silhouette with beaker
- `ZoologyPattern`: Animal cell with organelles
- `BotanyPattern`: Plant cell with chloroplast shapes
- `EVSPattern`: Trees and nature elements
- `ArtPattern`: Paint palette and brush strokes
- `PEPattern`: Running figure or sports elements
- `AccountancyPattern`: Ledger lines with currency
- `BusinessPattern`: Organization chart nodes
- `AIPattern`: Neural network nodes and connections
- `InformaticsPattern`: Database cylinders and data flow
- `HomeSciencePattern`: Home silhouette elements

### 2C. Add New Subjects to Student Data

**File:** `src/data/student/subjects.ts`

Add all new subjects to `studentSubjects[]` array with appropriate:
- `id`, `name`, `icon` (matching the new Lucide icon name)
- `progress` (varied mock values)
- `status` (varied statuses)
- `color` (matching the new color key)
- `chaptersTotal` / `chaptersCompleted` (realistic numbers)

### 2D. Update Color Maps in Test Components

**Files:**
- `src/components/student/tests/SubjectTestCard.tsx` -- expand `subjectColorMap` and `iconMap` and `colorConfig`
- `src/components/student/tests/LiveTestsSection.tsx` -- expand `subjectColorMap`, `iconMap`, and `colorConfig`
- `src/data/student/tests.ts` -- expand `subjectColorMap`

All three files have local copies of subject-to-color and subject-to-icon mappings. Each needs the new subjects added.

---

## Phase 3: Add Mock Test Data for New Subjects

**File:** `src/data/student/tests.ts`

Add teacher test entries for each new subject (at least 3-5 tests per subject with varied statuses: live, upcoming, attempted, missed) so the UI renders subject cards for them. This ensures developers see a complete picture of how every subject card looks.

Example for Hindi:
```typescript
{ id: "tt-h1", name: "Hindi Grammar Quiz", type: "teacher", subject: "hindi", totalQuestions: 20, totalMarks: 80, duration: 40, negativeMarking: false, status: "live", teacherName: "Mrs. Joshi", batchName: "Class 10-A" },
{ id: "tt-h2", name: "Hindi Literature Test", type: "teacher", subject: "hindi", totalQuestions: 25, totalMarks: 100, duration: 50, negativeMarking: false, status: "upcoming", scheduledDate: "2026-02-25", scheduledTime: "10:00 AM", teacherName: "Mrs. Joshi", batchName: "Class 10-A" },
// ... etc
```

Repeat for all new subjects (Hindi, Sanskrit, Social Science, History, Geography, Civics, Economics, Science, Zoology, Botany, EVS, Art, Physical Education, Accountancy, Business Studies, AI, Informatics Practices, Home Science).

---

## Files Summary

| File | Phase | Action | Change |
|------|-------|--------|--------|
| `src/pages/student/Tests.tsx` | 1 | Modify | Inline search on desktop, add "By Subject" divider |
| `src/components/student/shared/subjectColors.ts` | 2 | Modify | Add ~12 new color schemes, icons, patterns |
| `src/components/student/subjects/SubjectBackgroundPattern.tsx` | 2 | Modify | Add ~18 new SVG pattern components |
| `src/data/student/subjects.ts` | 2 | Modify | Add ~18 new subject entries |
| `src/components/student/tests/SubjectTestCard.tsx` | 2 | Modify | Expand color/icon maps |
| `src/components/student/tests/LiveTestsSection.tsx` | 2 | Modify | Expand color/icon maps |
| `src/data/student/tests.ts` | 3 | Modify | Add ~60-90 mock test entries for new subjects |

## Design Rules Followed

- All new color schemes follow the exact `SubjectColorScheme` interface (gradient, headerGradient, iconBg, etc.)
- All new SVG patterns follow the same opacity levels (0.2-0.4), positioning (top-right 2/3 width), and style
- All Lucide icons are from the existing `lucide-react` package (no new dependencies)
- No existing subject cards or colors are modified
- New cards will render identically to existing ones -- same `SubjectTestCard`, `SubjectCard`, `SubjectHeader` components

