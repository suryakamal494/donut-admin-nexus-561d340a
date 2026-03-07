

## Understanding Your Pain Points

Here's what I understood from your request — three specific issues on the **Batch Dashboard** (`/institute/batches/batch-6a`):

### Problem 1: "Assign Courses" and "Edit Batch" buttons scroll away
The action buttons at the bottom of the page scroll with the content. When you're scrolling through subjects, students, and tests, you lose access to these key actions. You want them **fixed/sticky at the bottom** of the screen so they're always accessible.

### Problem 2: "Assign Teacher" quick action navigates away instead of inline assignment
Currently clicking "Assign Teacher" takes you to the teacher creation page (`/institute/teachers/create`), which is wrong. You want:
1. A popup/dialog opens
2. First, you select a **subject** from the batch's subjects
3. Then, it shows **teachers who teach that subject**
4. You select a teacher and assign them to that subject for this batch
5. All done inline without leaving the page

### Problem 3: "Add Student" quick action doesn't go to the right page
Currently it navigates to `/institute/students/add?batchId=...` which is correct, but you want to ensure:
1. It goes directly to the **manual add student** tab (not bulk upload)
2. The batch is **pre-selected and locked** so the user knows they're adding to this specific batch
3. After saving, the user is **redirected back to this batch dashboard** (not the general students page)

---

## Implementation Plan

### 1. Sticky Bottom Action Bar
- Extract the "Assign Courses" button and an "Edit Batch" button into a **fixed bottom bar** (`fixed bottom-0 left-0 right-0`)
- The bar will have a subtle top border and background blur, always visible
- Add `pb-16` padding to the main content so it doesn't get hidden behind the bar
- On mobile, the bar will be full-width with two equal buttons

### 2. Assign Teacher Dialog (new component)
Create `src/components/institute/batches/AssignTeacherDialog.tsx`:
- **Step 1 — Select Subject**: Show the batch's subjects as selectable cards/list
- **Step 2 — Select Teacher**: Filter teachers from `instituteData` whose `subjects` array includes the selected subject. Show them as selectable cards with name and current assignments
- **Confirm**: Assign the teacher to that subject for this batch, show success toast, close dialog
- Uses the existing `ResponsiveDialog` component (drawer on mobile, dialog on desktop)

### 3. Fix "Add Student" Navigation
- Update the "Add Students" quick action to navigate to `/institute/students/add?batchId=${batchId}&returnTo=/institute/batches/${batchId}`
- In `AddStudent.tsx`: read the `returnTo` query param and use it for the "Back" button and post-save redirect
- Ensure the "manual" tab is the default (it already is) and the batch selector is pre-filled (it already reads `batchId` from query params)

### Files to modify:
1. **`src/pages/institute/batches/BatchDashboard.tsx`** — Add sticky bottom bar, update quick action handlers, add AssignTeacherDialog
2. **`src/components/institute/batches/AssignTeacherDialog.tsx`** — New component for inline teacher assignment
3. **`src/pages/institute/students/AddStudent.tsx`** — Add `returnTo` support for post-save redirect back to batch

