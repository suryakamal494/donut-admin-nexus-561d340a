
# UI Fixes & Enhancements Implementation Plan

## Issue Summary

I've analyzed all the issues you've raised. Here's my understanding and the solutions for each:

---

## Issue 1: Remove "Add Course" from Curriculum Quick Add Menu

**Location:** `/superadmin/parameters` - Curriculum page Quick Add menu

**Current State:** The Quick Add dropdown menu shows: Add Class, **Add Course**, Add Curriculum, Add Subject, Add Chapter, Add Topic

**Problem:** "Add Course" doesn't belong in the Curriculum page - courses are managed separately in `/superadmin/parameters/courses` or Course Builder.

**Solution:** Remove the "Add Course" menu item from `QuickAddMenu.tsx`. The menu will show only curriculum-related items.

---

## Issue 2: Add "Create Course-Only Topic" in Course Builder

**Location:** `/superadmin/parameters/course-builder`

**Current State:** Course Builder has a dialog to create "Course-Only Chapters" that belong exclusively to that course. However, there's no option to add course-only topics.

**Problem:** When course-only chapters are created, there's no UI to add topics to them.

**Solution:** Create a new `CreateTopicDialog.tsx` component in the course-builder folder:
- Subject dropdown (from course's available subjects)
- Chapter dropdown (filtered to course-owned chapters only)
- Topic name input (supports bulk paste like other dialogs)
- Integrate into SourcePanel with a new "Create Course-Only Topic" button

---

## Issue 3: Remove Duplicate "Question Text" for Fill in Blanks

**Location:** `/superadmin/questions/create` - Fill in Blanks type

**Current State (from image 1):**
- "Question Text" textarea (generic)
- "Question with Blanks" textarea (specific for blanks)

**Problem:** Having both is confusing. The "Question with Blanks" field already serves as the question text.

**Solution:** When question type is "fill" (Fill in Blanks), hide the generic "Question Text" textarea. Only show the specialized "Question with Blanks" field.

---

## Issue 4: Remove Duplicate "Question Text" for Paragraph Based

**Location:** `/superadmin/questions/create` - Paragraph Based type

**Current State (from image 2):**
- "Question Text" textarea (generic)
- "Passage / Paragraph" textarea (specific for passage)

**Problem:** Similar confusion - the passage IS the question context. The sub-questions handle individual question text.

**Solution:** When question type is "paragraph", hide the generic "Question Text" textarea. Only show the "Passage / Paragraph" field.

---

## Issue 5: Add Fill in Blanks and True/False to Paragraph Sub-Questions

**Location:** `/superadmin/questions/create` - Paragraph Based sub-questions

**Current State:** Sub-question type dropdown has: MCQ (Single), Multiple Correct, Numerical

**Problem:** Missing "Fill in Blanks" and "True/False" as sub-question types.

**Solution:** Expand the SubQuestion interface and dropdown to include:
- MCQ (Single)
- Multiple Correct
- Numerical
- Fill in Blanks (new)
- True/False (new)

Each type will render its appropriate UI (blanks with answer fields, true/false with radio buttons).

---

## Issue 6: Add Multi-Select Topic Filter in AI Question Generator

**Location:** `/superadmin/questions/ai`

**Current State:** After selecting Chapter, there's a single-select Topic dropdown (optional).

**Problem:** Users should be able to select multiple topics to generate questions across multiple topics.

**Solution:** Replace the single-select with a multi-select checkbox list:
- Show all topics under the selected chapter
- Allow multiple selection via checkboxes
- Update state to store array of topic IDs
- Display selected count badge

---

## Issue 7: Update Content Edit Dialog Visibility

**Location:** `/superadmin/content` - Edit Content dialog

**Current State:** 
- Settings section has "Duration (minutes)" field
- Visibility options: Public, Private, Restricted (RadioGroup)

**Problem:** Duration doesn't belong in edit. Visibility should show Curriculum/Course checkboxes like Create Content page.

**Solution:** 
1. Remove "Duration (minutes)" field from the edit dialog
2. Remove the Public/Private/Restricted RadioGroup
3. Replace with visibility checkboxes matching Create Content:
   - "Regular Curriculum" checkbox
   - List of published courses (checkboxes for each)

---

## Issue 8: Review Edit Options for Master Data Items + Fix Scroll

**Location:** `/superadmin/parameters` - Curriculum panel

**Current State (after review):**
- Classes: Has edit option in ClassPanel
- Subjects: Has edit option in SubjectPanel  
- Chapters: Has edit option (Edit icon) in ContentPanel
- Topics: Has edit option (Edit icon) in ContentPanel

**UI Bug:** The chapters list in ContentPanel doesn't scroll properly when there are many topics expanded.

**Solution:** 
1. Verify all edit icons are working (they appear to be present)
2. Fix the scroll issue by ensuring the ContentPanel's ScrollArea properly handles the full height and allows scrolling for the chapters list
3. Review the height calculation in the grid layout

---

## Technical Implementation Details

### Files to Modify:

| File | Changes |
|------|---------|
| `src/components/parameters/QuickAddMenu.tsx` | Remove "Add Course" menu item |
| `src/components/parameters/course-builder/CreateTopicDialog.tsx` | **NEW** - Course-only topic creation dialog |
| `src/components/parameters/course-builder/SourcePanel.tsx` | Add "Create Course-Only Topic" button |
| `src/components/parameters/course-builder/index.ts` | Export new dialog |
| `src/hooks/useCourseBuilder.ts` | Add topic creation state and handlers |
| `src/pages/questions/CreateQuestion.tsx` | Hide Question Text for fill/paragraph, expand sub-question types |
| `src/pages/questions/AIQuestions.tsx` | Multi-select topic filter |
| `src/components/content/ContentEditDialog.tsx` | Replace visibility with curriculum/course checkboxes |
| `src/components/parameters/ContentPanel.tsx` | Fix scroll for chapters list |

### Sub-Question Type Enhancement:

```typescript
// Updated interface
interface SubQuestion {
  type: 'mcq' | 'multiple' | 'numerical' | 'fill' | 'truefalse';
  text: string;
  options: string[];
  correctAnswer: string;
  blankAnswers?: string[]; // for fill type
}
```

### ContentPanel Scroll Fix:

The issue is likely in the ScrollArea height calculation. Will ensure:
```tsx
<ScrollArea className="flex-1 h-full overflow-y-auto">
```

---

## Execution Order

1. **Quick wins first:**
   - Remove "Add Course" from Quick Add menu
   - Hide duplicate Question Text for fill/paragraph types
   - Add sub-question types (Fill/True-False)

2. **Medium complexity:**
   - Fix ContentPanel scroll issue
   - Update Content Edit dialog visibility
   - Add multi-select topics in AI Generator

3. **New feature:**
   - Create Course-Only Topic dialog and integration
