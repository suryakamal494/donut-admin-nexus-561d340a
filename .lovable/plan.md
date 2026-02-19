

# Building Real Exam UIs: JEE Advanced, NEET, CBSE Math, CBSE Hindi

## What We Are Solving

The Student Test Player currently has a single generic UI that works the same for all exam types. Real competitive exams have very different structures, and the current player is missing:

- **Section-wise navigation within subjects** (critical for JEE Advanced where each subject has 4 sections: Single Correct, Multiple Correct, Numerical, Paragraph)
- **Stress-tested UI for high question counts** (NEET has 160 questions, current test only has 23)
- **Real exam content** with LaTeX math, chemistry diagrams, physics figures, and Hindi text
- **Pattern-specific layouts** that match what students actually see in their real exams

We need to build 4 complete exam papers with real content, ensuring the UI never breaks regardless of question count, content complexity, or device size.

## Design Principles (Carried Forward)

- Mobile-first responsive (320px and up)
- "Sophisticated Warmth" aesthetic with glassmorphism and smooth micro-interactions
- 44px+ touch targets on all interactive elements
- Plus Jakarta Sans typography with clear hierarchy
- Subject color coding: Physics (purple), Chemistry (emerald), Math (blue), Biology (rose)
- Bottom sheet patterns on mobile, sidebar on desktop
- Framer Motion animations for state transitions
- Session persistence via localStorage

---

## Phased Approach

### Phase 1: JEE Advanced Pattern (81 questions)

This is the most complex UI challenge and must be built first because it introduces the **section-within-subject navigation** pattern that other exams can inherit.

**New UI Elements to Build:**

1. **Section Navigation Bar** -- Below the subject tabs, a secondary row showing sections within the selected subject (e.g., "Sec 1: Single Correct | Sec 2: Multi Correct | Sec 3: Numerical | Sec 4: Paragraph"). Horizontally scrollable on mobile, inline on desktop.

2. **Updated Question Palette** -- When palette is open, questions grouped by section with section headers. Each section shows its own answered/total count.

3. **Section Instructions** -- Brief instruction text at the top of each section (e.g., "This section contains 7 single-correct MCQs. +3 for correct, -1 for wrong.").

**Data Files:**

| File | Purpose |
|------|---------|
| `src/data/student/jeeAdvancedQuestions.ts` | 81 real JEE Advanced questions (27 per subject x 3 subjects) with LaTeX, images, and paragraph passages |
| `src/data/student/jeeAdvancedSession.ts` | Session config with 12 sections (4 per subject), marking schemes per section |

**Question Distribution per Subject (27 questions):**

| Section | Type | Questions | Marks | Marking |
|---------|------|-----------|-------|---------|
| Section 1 | Single Correct MCQ | 7 | +3/-1 each | 21 marks |
| Section 2 | Multiple Correct MCQ | 7 | +4/-2 partial | 28 marks |
| Section 3 | Numerical Value | 7 | +4/0 each | 28 marks |
| Section 4 | Paragraph Based (2 paragraphs, 3-4 Qs each) | 6 | +3/-1 each | 18 marks |

**Real Content Research:** Questions will be sourced/modeled from actual JEE Advanced 2024 papers covering:
- Physics: Mechanics, Electrodynamics (circuit diagrams), Optics (ray diagrams), Thermodynamics
- Chemistry: Organic reaction mechanisms, Coordination compounds, Electrochemistry, P-block elements
- Mathematics: Calculus (definite integrals), Matrices, Probability, Conic sections

**Component Changes:**

| Component | Change |
|-----------|--------|
| `TestPlayerHeader.tsx` | Add section sub-tabs below subject tabs when exam has sections within subjects |
| `QuestionPalette.tsx` | Group questions by section with collapsible section headers |
| `QuestionNavigation.tsx` | Show current section name alongside question number |
| `TestPlayer.tsx` (page) | Route to JEE Advanced session data when test ID matches |

**Files Created/Modified:**

| File | Action |
|------|--------|
| `src/data/student/jeeAdvancedQuestions.ts` | Create -- 81 questions with real content |
| `src/data/student/jeeAdvancedSession.ts` | Create -- session config with 12 sections |
| `src/components/student/tests/player/SectionNavigation.tsx` | Create -- new section sub-navigation component |
| `src/components/student/tests/player/TestPlayerHeader.tsx` | Modify -- integrate section tabs |
| `src/components/student/tests/player/QuestionPalette.tsx` | Modify -- section-grouped grid |
| `src/components/student/tests/player/QuestionNavigation.tsx` | Modify -- show section context |
| `src/pages/student/TestPlayer.tsx` | Modify -- load correct session based on test ID |
| `src/data/student/tests.ts` | Modify -- add JEE Advanced test entry |
| `src/data/student/testQuestions.ts` | Modify -- add `sectionName` field to TestSection type |

---

### Phase 2: NEET Pattern (160 questions)

NEET has no sections within subjects but tests the UI at scale (160 questions). The question palette must handle a large grid without breaking.

**Key UI Challenge:** 40 questions per subject in the palette grid. Need to ensure the wrap grid stays usable on mobile (potentially 8 columns x 5 rows per subject).

**Data Files:**

| File | Purpose |
|------|---------|
| `src/data/student/neetQuestions.ts` | 160 real NEET questions (40 per subject x 4 subjects) |
| `src/data/student/neetSession.ts` | Session config with 4 subject-level sections |

**Question Distribution:**

| Subject | Questions | Type | Marking |
|---------|-----------|------|---------|
| Physics | 40 | All MCQ Single Correct | +4/-1 |
| Chemistry | 40 | All MCQ Single Correct | +4/-1 |
| Botany | 40 | All MCQ Single Correct | +4/-1 |
| Zoology | 40 | All MCQ Single Correct | +4/-1 |

**Real Content:** Questions modeled from NEET 2024 covering:
- Physics: Mechanics, Waves, Optics, Modern Physics
- Chemistry: Organic, Inorganic, Physical Chemistry
- Botany: Plant Physiology, Ecology, Cell Biology, Genetics
- Zoology: Human Physiology, Animal Kingdom, Reproduction, Evolution

**Component Changes:**

| Component | Change |
|-----------|--------|
| `QuestionPalette.tsx` | Optimize grid for 40-question sections (compact mode for large counts) |
| `TestPlayerHeader.tsx` | Add "Botany" and "Zoology" subject color definitions |

**Files Created/Modified:**

| File | Action |
|------|--------|
| `src/data/student/neetQuestions.ts` | Create -- 160 NEET questions |
| `src/data/student/neetSession.ts` | Create -- session config |
| `src/data/student/tests.ts` | Modify -- add NEET test entry |
| `src/components/student/tests/player/TestPlayerHeader.tsx` | Modify -- add botany/zoology colors |
| `src/components/student/tests/player/QuestionPalette.tsx` | Modify -- compact grid mode for 40+ questions |
| `src/pages/student/TestPlayer.tsx` | Modify -- route to NEET session |

---

### Phase 3: CBSE Math Paper

CBSE board exam format is different from competitive exams. Typically has sections (A, B, C, D, E) with different question types (1-mark, 2-mark, 3-mark, 5-mark). This tests the UI with long-answer and short-answer question types.

**Data Files:**

| File | Purpose |
|------|---------|
| `src/data/student/cbseMathQuestions.ts` | Full CBSE Class 10/12 Math paper (~38 questions) |
| `src/data/student/cbseMathSession.ts` | Session config with CBSE sections |

**CBSE Math Structure (Class 12, 2024 pattern):**

| Section | Type | Questions | Marks |
|---------|------|-----------|-------|
| Section A | MCQ / Assertion-Reasoning | 20 | 1 mark each |
| Section B | Very Short Answer | 5 | 2 marks each |
| Section C | Short Answer | 6 | 3 marks each |
| Section D | Long Answer | 4 | 5 marks each |
| Section E | Case Study (Paragraph) | 3 | 4 marks each |

**Real Content:** Modeled from CBSE Class 12 Math 2024:
- Algebra: Matrices, Determinants
- Calculus: Integration, Differential Equations
- Geometry: 3D Geometry, Vectors
- Probability and Linear Programming

**Files Created/Modified:**

| File | Action |
|------|--------|
| `src/data/student/cbseMathQuestions.ts` | Create -- ~38 CBSE Math questions |
| `src/data/student/cbseMathSession.ts` | Create -- session config |
| `src/data/student/tests.ts` | Modify -- add CBSE Math test entry, add `cbse` ExamPattern |
| `src/pages/student/TestPlayer.tsx` | Modify -- route to CBSE session |

---

### Phase 4: CBSE Hindi Paper (Multilingual)

This is the acid test for multilingual support. Hindi text (Devanagari script) must render correctly in questions, options, and the palette.

**Data Files:**

| File | Purpose |
|------|---------|
| `src/data/student/cbseHindiQuestions.ts` | Full CBSE Hindi paper (~40 questions) in Devanagari |
| `src/data/student/cbseHindiSession.ts` | Session config |

**CBSE Hindi Structure:**

| Section | Type | Questions | Marks |
|---------|------|-----------|-------|
| Section A | Reading Comprehension (Apathit Gadyansh) | 10 | MCQ 1 mark each |
| Section B | Grammar (Vyakaran) | 10 | MCQ/Fill 1 mark each |
| Section C | Literature (Sahitya) | 10 | Short Answer 2-3 marks |
| Section D | Writing (Lekhan) | 5 | Long Answer 5 marks |

**Key Technical Challenge:** Ensuring Devanagari text renders with proper line height, word spacing, and font rendering. May need to add a Hindi-compatible font (Noto Sans Devanagari) for clean rendering.

**Files Created/Modified:**

| File | Action |
|------|--------|
| `src/data/student/cbseHindiQuestions.ts` | Create -- Hindi paper in Devanagari |
| `src/data/student/cbseHindiSession.ts` | Create -- session config |
| `src/data/student/tests.ts` | Modify -- add CBSE Hindi test entry |
| `src/pages/student/TestPlayer.tsx` | Modify -- route to Hindi session |
| `index.html` or `tailwind.config.ts` | Modify -- add Noto Sans Devanagari font if needed |

---

## Summary

| Phase | Exam | Questions | Key UI Feature | New Files | Modified Files |
|-------|------|-----------|---------------|-----------|----------------|
| 1 | JEE Advanced | 81 | Section navigation within subjects | 3 | 6 |
| 2 | NEET | 160 | Large-scale palette, 4 subjects | 2 | 4 |
| 3 | CBSE Math | ~38 | CBSE section format, long answers | 2 | 2 |
| 4 | CBSE Hindi | ~40 | Hindi/Devanagari multilingual | 2 | 3 |

Each phase produces a fully working, mobile-responsive exam that students can take end-to-end. No phase depends on a later phase, and each phase gets full design attention.

