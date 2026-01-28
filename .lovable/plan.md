
# Classification Flow Fixes Implementation Plan

## Overview

This plan updates the classification flow across Question Bank and Content Library creation pages to ensure consistency:
1. **Remove** Class context dropdown when Course mode is selected
2. **Add** mandatory Topic selection after Chapter
3. **Add** Difficulty selection in classification sidebar (after Topic)
4. **Add** Cognitive Type selection in Create Question (after Difficulty)

---

## Current State vs Required State

| Field | Curriculum Mode | Course Mode | Notes |
|-------|-----------------|-------------|-------|
| Curriculum/Course | Required | Required | Source selector |
| Class | Required | **REMOVE** | No class context for courses |
| Subject | Required | Required | |
| Chapter | Required | Required | |
| Topic | **ADD (Mandatory)** | **ADD (Mandatory)** | Currently missing or optional |
| Difficulty | **ADD in sidebar** | **ADD in sidebar** | Move/add to classification |
| Cognitive Type | **ADD** (Questions only) | **ADD** (Questions only) | New field |

---

## Implementation Details

### 1. Super Admin - Create Question (`src/pages/questions/CreateQuestion.tsx`)

**Changes:**

**a) Remove Class Context in Course Mode (lines 550-563)**
- Delete the entire "Class (Context)" dropdown block that appears after Course selection
- Flow becomes: Course → Chapter → Topic

**b) Add Topic State and Dropdown**
```typescript
// Add state
const [selectedTopicId, setSelectedTopicId] = useState("");

// Add topic getter (import from cbseMasterData)
import { getTopicsByChapter } from "@/data/cbseMasterData";

// Get topics based on selected chapter
const availableTopics = selectedChapterId 
  ? getTopicsByChapter(selectedChapterId) 
  : [];
```

**c) Add Topic Dropdown (after Chapter)**
```tsx
{selectedChapterId && (
  <div className="space-y-2">
    <Label>Topic *</Label>
    <Select value={selectedTopicId} onValueChange={setSelectedTopicId}>
      <SelectTrigger><SelectValue placeholder="Select topic" /></SelectTrigger>
      <SelectContent>
        {availableTopics.map((topic) => (
          <SelectItem key={topic.id} value={topic.id}>{topic.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
)}
```

**d) Add Cognitive Type State and Dropdown (after Difficulty)**
```typescript
// Add state
const [selectedCognitiveType, setSelectedCognitiveType] = useState("");

// Add cognitive types array
const cognitiveTypes = [
  { id: "logical", label: "Logical" },
  { id: "analytical", label: "Analytical" },
  { id: "conceptual", label: "Conceptual" },
  { id: "numerical", label: "Numerical" },
  { id: "application", label: "Application" },
  { id: "memory", label: "Memory" },
];
```

**e) Reset cascade on parent change**
- When Chapter changes: reset Topic
- Update validation to require Topic

---

### 2. Super Admin - Create Content (`src/pages/content/CreateContent.tsx`)

**Changes:**

**a) Add Topic State**
```typescript
const [selectedTopicId, setSelectedTopicId] = useState("");
```

**b) Update Topic Dropdown to be Mandatory**
- Change label from "Topic" to "Topic *"
- Change placeholder from "Select topic (optional)" to "Select topic"
- Wire up to actual data using `getTopicsByChapter`

**c) Add Difficulty Dropdown (after Topic)**
```tsx
<div className="space-y-2">
  <Label>Difficulty</Label>
  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
    <SelectTrigger><SelectValue placeholder="Select difficulty" /></SelectTrigger>
    <SelectContent>
      <SelectItem value="easy">Easy</SelectItem>
      <SelectItem value="medium">Medium</SelectItem>
      <SelectItem value="hard">Hard</SelectItem>
    </SelectContent>
  </Select>
</div>
```

**d) Remove hard-coded topic options**
- Currently shows "Newton's Laws" and "Work & Energy" as static options
- Replace with dynamic data from `getTopicsByChapter()`

---

### 3. Institute - Create Question (`src/pages/institute/questions/CreateQuestion.tsx`)

**Review Current State:**
- Already has Difficulty and Cognitive Type selectors
- Uses different track selection (assignedTracks)
- Need to verify Topic is present and mandatory

**Changes Required:**
- Ensure Topic dropdown appears after Chapter
- Mark Topic as mandatory (Label should show *)
- Verify Course mode doesn't show Class dropdown

---

### 4. Institute - Create Content (`src/pages/institute/content/CreateContent.tsx`)

**Current State:**
- Has Topic dropdown but shows as "Select topic (optional)"
- No Difficulty selector

**Changes:**
- Change Topic label to "Topic *"
- Change placeholder to "Select topic"
- Add Difficulty dropdown after Topic
- Update submit validation to require Topic

---

## Technical Notes

### Data Helper Functions

Already available in `src/data/cbseMasterData.ts`:
```typescript
// Get topics for a chapter
export const getTopicsByChapter = (chapterId: string): CBSETopic[] => {
  return allCBSETopics.filter(t => t.chapterId === chapterId);
};
```

For course-owned chapters, need to check `src/data/masterData.ts` for topic retrieval.

### Reset Cascade Logic

When a parent selection changes, all children must reset:
```typescript
// On Course change
setSelectedCourseId(v);
setSelectedChapterId("");
setSelectedTopicId("");

// On Chapter change  
setSelectedChapterId(v);
setSelectedTopicId("");
```

### Validation Updates

Add Topic to required fields validation:
```typescript
if (!selectedTopicId) {
  toast.error("Please select a topic");
  return;
}
```

---

## File Change Summary

| File | Changes |
|------|---------|
| `src/pages/questions/CreateQuestion.tsx` | Remove Class in Course mode, Add Topic (mandatory), Add Cognitive Type |
| `src/pages/content/CreateContent.tsx` | Make Topic mandatory with real data, Add Difficulty |
| `src/pages/institute/questions/CreateQuestion.tsx` | Verify Topic mandatory, remove Class in Course mode if present |
| `src/pages/institute/content/CreateContent.tsx` | Make Topic mandatory, Add Difficulty |

---

## Classification Flow After Implementation

**Curriculum Mode (Create Question/Content):**
```
Curriculum → Class → Subject → Chapter → Topic* → Difficulty → Cognitive Type (Questions only)
```

**Course Mode (Create Question/Content):**
```
Course → Subject → Chapter → Topic* → Difficulty → Cognitive Type (Questions only)
```

\* = Mandatory field
