
# UI Review Fixes Implementation Plan

## Overview

This plan addresses 7 UI issues identified in the Donut AI UI Review document across Super Admin and Institute login portals. The fixes focus on making non-functional buttons work, adding missing question types, and implementing intuitive bulk data entry workflows.

---

## Issue Summary

| # | Module | Issue | Complexity |
|---|--------|-------|------------|
| 1 | Master Data | Add Chapter/Topic not functional | High |
| 2 | Users | View button not functional | Low |
| 3 | Courses | Edit button not available | Medium |
| 4 | Questions | Paragraph-based question missing | High |
| 5 | Questions | No class-chapter relation in Course mode | Medium |
| 6 | Exams | Exam flow document | Skipped |
| 7 | Questions | Missing UI for Assertion-Reasoning, True/False, Fill in Blanks | Medium |

---

## Implementation Details

### Issue 1: Add Chapter & Add Topic Dialogs (High Priority)

**Current Problem**: QuickAdd menu shows toast messages instead of opening creation dialogs.

**Solution**: Create two new dialog components with bulk copy-paste support.

**Files to Create**:
- `src/components/parameters/AddChapterDialog.tsx`
- `src/components/parameters/AddTopicDialog.tsx`

**AddChapterDialog Flow**:
1. Select Curriculum (dropdown)
2. Select Class (dropdown)
3. Select Subject (dropdown)
4. Text input area supporting:
   - Single chapter entry
   - Multi-line paste (one chapter per line)
5. Preview parsed chapters before submission
6. Submit creates all chapters linked to selected curriculum/class/subject

**AddTopicDialog Flow**:
1. Select Curriculum (dropdown)
2. Select Class (dropdown) - filters subjects
3. Select Subject (dropdown) - filters chapters
4. Select Chapter (dropdown) - required, topics go under this chapter
5. Text input area supporting:
   - Single topic entry
   - Multi-line paste (one topic per line)
6. Preview parsed topics before submission

**Bulk Parse Logic**:
```typescript
// Example: Parse newline-separated input
const parseMultipleEntries = (text: string): string[] => {
  return text
    .split(/[\n\r]+/)
    .map(line => line.trim())
    .filter(line => line.length > 0);
};
```

**File to Modify**: `src/pages/parameters/Parameters.tsx`
- Import new dialogs
- Add state for dialog visibility
- Update QuickAddMenu `onAddChapter` and `onAddTopic` to open dialogs

---

### Issue 2: User View Dialog (Low Priority)

**Current Problem**: "View" dropdown option has no handler.

**Solution**: Create a simple user detail dialog.

**File to Create**: `src/components/users/UserViewDialog.tsx`

**Content** (Basic Info):
- Full Name
- Email Address
- Mobile Number
- Role (Student/Teacher/Parent)
- Status (Active/Inactive badge)
- Class (if applicable)
- Course (if applicable)

**File to Modify**: `src/pages/users/Users.tsx`
- Import UserViewDialog
- Add state: `selectedUser` and `showViewDialog`
- Add `onClick` handler to View menu item

---

### Issue 3: Course Edit Functionality (Medium Priority)

**Current Problem**: No way to edit course metadata from the course list.

**Solution**: Add Edit button to course cards and create edit dialog.

**File to Create**: `src/components/parameters/courses/CourseEditDialog.tsx`

**Editable Fields**:
- Course Name
- Description
- Category (Foundation/Competitive)
- Status (Draft/Published)
- Associated Curriculums (multi-select)
- Associated Classes (multi-select)

**Files to Modify**:
- `src/components/parameters/courses/CourseListPanel.tsx` - Add Edit icon button to each course card
- `src/pages/parameters/Courses.tsx` - Add dialog state and handlers

---

### Issue 4: Paragraph-Based Question Type (High Priority)

**Current Problem**: No support for paragraph questions where multiple sub-questions relate to one passage.

**Solution**: Add "Paragraph Based" question type with nested question creation.

**File to Modify**: `src/pages/questions/CreateQuestion.tsx`

**UI Flow**:
1. Select "Paragraph Based" from question types
2. Enter the paragraph/passage text
3. Select number of questions for this paragraph (1-10 selector)
4. For each sub-question:
   - Question type dropdown (MCQ/Multiple/Numerical only for sub-questions)
   - Question text
   - Options (if MCQ/Multiple)
   - Answer input
5. Navigation: "Previous Question" / "Next Question" buttons or horizontal stepper
6. All sub-questions share the same classification (curriculum/class/subject/chapter)

**Mobile-First Design**:
- Stacked layout for paragraph + questions
- Swipe or button navigation between sub-questions
- Clear progress indicator (1/5, 2/5, etc.)
- Save progress locally before final submit

**Data Structure**:
```typescript
interface ParagraphQuestion {
  type: 'paragraph';
  passage: string;
  subQuestions: {
    type: 'mcq' | 'multiple' | 'numerical';
    text: string;
    options?: string[];
    correctAnswer: string | number;
  }[];
}
```

---




### Issue 7: Missing Question Type UIs (Medium Priority)

**Current Problem**: Assertion-Reasoning, True/False, and Fill in Blanks lack specialized input UIs.

**Files to Modify**: `src/pages/questions/CreateQuestion.tsx`

#### 7a. True/False Question Type
- Add "True/False" to `questionTypes` array
- UI: Question text + two radio buttons (True/False) for correct answer

#### 7b. Assertion-Reasoning UI
- When "Assertion-Reasoning" is selected, show:
  - Assertion (Statement 1) textarea
  - Reasoning (Statement 2) textarea
  - Options (A, B, C, D with standard assertion-reasoning combinations):
    - A: Both true, reasoning explains assertion
    - B: Both true, reasoning doesn't explain
    - C: Assertion true, reasoning false
    - D: Assertion false, reasoning true
  - Correct option selector

#### 7c. Fill in Blanks UI
- When "Fill in Blanks" is selected, show:
  - Rich text input with blank marker support (e.g., `____` or `[blank]`)
  - Multiple blanks support with ordered answers
  - Answer inputs for each blank (auto-detect from question text)
  - Example: "The capital of France is ____" -> Answer: "Paris"

---

## File Change Summary

| Action | File Path |
|--------|-----------|
| Create | `src/components/parameters/AddChapterDialog.tsx` |
| Create | `src/components/parameters/AddTopicDialog.tsx` |
| Create | `src/components/users/UserViewDialog.tsx` |
| Create | `src/components/parameters/courses/CourseEditDialog.tsx` |
| Modify | `src/pages/parameters/Parameters.tsx` |
| Modify | `src/pages/users/Users.tsx` |
| Modify | `src/pages/parameters/Courses.tsx` |
| Modify | `src/components/parameters/courses/CourseListPanel.tsx` |
| Modify | `src/pages/questions/CreateQuestion.tsx` |
| Modify | `src/components/parameters/index.ts` (export new components) |
| Modify | `src/components/users/index.ts` (create if needed) |

---

## Technical Implementation Notes

### Bulk Copy-Paste Parser
```typescript
// Shared utility for parsing multi-line input
// Location: src/lib/parseUtils.ts

export const parseBulkInput = (input: string): string[] => {
  return input
    .split(/[\n\r]+/)
    .map(line => line.trim())
    .filter(line => line.length > 0 && line.length <= 200);
};
```

### Mobile-First Responsive Considerations
- All new dialogs use `ResponsiveDialog` pattern (Drawer on mobile, Dialog on desktop)
- Touch targets minimum 44px
- Dropdowns use proper z-index and solid backgrounds
- Paragraph question navigation uses large tap buttons, not swipe gestures for accessibility

### Validation
- Chapter/Topic names: Required, 1-200 characters, trim whitespace
- Paragraph passage: Required, 10-5000 characters
- Sub-questions: Minimum 1, maximum 10 per paragraph
- All inputs sanitized before submission

---

## Implementation Order

1. **Phase 1** (Quick Wins):
   - Issue 2: User View Dialog
   - Issue 7a: True/False question type

2. **Phase 2** (Medium Effort):
   - Issue 3: Course Edit Dialog
   - Issue 5: Class dropdown in Course mode
   - Issue 7b & 7c: Assertion-Reasoning and Fill in Blanks UIs

3. **Phase 3** (High Effort):
   - Issue 1: Add Chapter Dialog with bulk support
   - Issue 1: Add Topic Dialog with bulk support
   - Issue 4: Paragraph-Based Question Type

---

## Estimated Scope

- **New Components**: 4 dialog components + 1 utility file
- **Modified Files**: 7 existing files
- **Total Changes**: ~800-1000 lines of code
