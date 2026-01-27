# Homework Submission

> Submit assignments with multiple formats.

---

## Overview

The Homework Submission system allows students to submit assignments based on homework type: Practice (file/text/link), Project (multi-file), and Test (redirects to Test Player). It includes mobile camera access for quick photo uploads.

## Access

- **Route**: Via homework item tap (opens sheet)
- **Login Types**: Student
- **Permissions Required**: Homework assigned to batch

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| HomeworkSheet | Submission drawer | Bottom sheet |
| SubmissionForm | Input based on type | Within sheet |
| FileUploader | File/photo upload | Within form |
| TextInput | Text answer area | Within form |
| SubmissionStatus | Current status | Sheet header |

---

## Features & Functionality

### Homework Types

| Type | Badge | Submission Format |
|------|-------|-------------------|
| Practice | Blue | File, text, or link |
| Project | Orange | Multi-file upload |
| Test | Purple | Opens Test Player |

### Homework Sheet

```text
┌─────────────────────────────────────────────────────────────┐
│ Motion Worksheet                                   [Practice]│
│ Physics • Laws of Motion                                    │
│ Due: January 20, 2025 at 11:59 PM                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Instructions:                                               │
│ Complete the worksheet and upload your answers.             │
│ Show all working for calculation questions.                 │
│                                                              │
│ 📎 Attachment: worksheet.pdf [Download]                     │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ Your Submission:                                            │
│                                                              │
│ [📷 Take Photo] [📁 Upload File] [✍️ Type Answer]          │
│                                                              │
│ Or paste a link:                                            │
│ [                                            ]              │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ Status: Not Submitted                                       │
│                                                              │
│ [Submit Homework]                                           │
└─────────────────────────────────────────────────────────────┘
```

### Submission Options

**Practice Type:**
- Upload file (PDF, DOC, image)
- Take photo (camera access)
- Type text answer
- Paste link (Google Docs, etc.)

**Project Type:**
- Multi-file upload
- Section labels
- Progress per section

**Test Type:**
- Opens Test Player
- Auto-graded
- Score returned

### File Upload

```text
Upload Your Answer
┌─────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                                                         │ │
│ │              [Tap to upload or take photo]              │ │
│ │                                                         │ │
│ │          Supported: PDF, DOC, DOCX, JPG, PNG            │ │
│ │                   Max size: 10 MB                       │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ Files:                                                      │
│ ✓ my_answers.pdf (2.3 MB)                          [Remove] │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Camera Access (Mobile)

1. Tap "Take Photo"
2. Native camera opens
3. Capture image
4. Preview and confirm
5. Uploads to submission

### Submission Status

| Status | Visual | Actions |
|--------|--------|---------|
| Not Submitted | Gray | Submit |
| Submitted | Green | View, Edit |
| Graded | With score | View feedback |
| Late | Amber | View (marked late) |
| Overdue | Red | Submit anyway |

### Post-Submission View

```text
┌─────────────────────────────────────────────────────────────┐
│ Motion Worksheet                                   [Practice]│
│ Status: ✓ Submitted                                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Your Submission:                                            │
│ 📄 my_answers.pdf                                           │
│ Submitted: Jan 18, 2025 at 3:45 PM                         │
│                                                              │
│ Grade: 8/10 ⭐                                              │
│ Feedback: "Good work! Review Q5 solution."                  │
│                                                              │
│ [View Submission] [Edit Submission]                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow

```text
Source: Teacher homework assignment
         │
         ▼
Submission Flow:
├── Open submission sheet
├── Select input method
├── Upload/enter content
├── Submit
         │
         ▼
Storage:
├── Files to storage
├── Metadata to database
└── Link to assignment
         │
         ▼
Teacher View: Available for review
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Assignment | Teacher Homework | Upstream | Loads details |
| Submission | Teacher Review | Downstream | Available for grading |
| Test Type | Test Player | Navigation | Opens test |
| Status | Dashboard | Local | Updates pending |

---

## Business Rules

1. **Deadline enforced** - late submissions marked
2. **File size limits** - 10MB per file
3. **Format validation** - supported types only
4. **Edit until graded** - can modify before review
5. **Test type** - no file upload, opens player
6. **Project sections** - may require all parts

---

## Mobile Behavior

- Sheet: Bottom drawer (60vh max)
- Camera: Native access
- File picker: Native gallery/files
- Text input: Expanding textarea
- Upload: Progress indicator
- Touch targets: 44px minimum

---

## Related Documentation

- [Teacher Homework](../03-teacher/homework.md)
- [Test Player](./test-player.md)
- [Dashboard](./dashboard.md)
- [Homework Flow](../05-cross-login-flows/homework-flow.md)
- [Student Smoke Tests](../06-testing-scenarios/smoke-tests/student.md)

---

*Last Updated: January 2025*
