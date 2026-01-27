# Student Registration

> Enroll and manage students with streamlined registration and bulk upload.

---

## Overview

The Students module manages student enrollment within the institute. It features a streamlined, mobile-first registration form focused on essential fields, with support for bulk import to handle mass enrollments efficiently.

## Access

- **Route**: `/institute/students`
- **Login Types**: Institute Admin
- **Permissions Required**: `students.view`, `students.create`, `students.edit`, `students.delete`

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| PageHeader | Title + Add/Bulk actions | Top |
| FilterBar | Batch, class filters | Below header |
| StudentTable | List of students | Main content |
| StudentForm | Registration accordion | Dialog |
| BulkUpload | Multi-student import | Dialog |
| StudentDetail | Full student profile | Slide-over |

---

## Features & Functionality

### Registration Form Structure

The form uses **collapsible accordion sections** with completion badges:

**Section 1: Student Details (Required)** ✓
- Full Name *
- Date of Birth *
- Gender *
- Mobile Number *
- Email ID *
- Username *
- Password *

**Section 2: Parent/Guardian Info (Optional)**
- Father's Name
- Mother's Name
- Guardian Name
- Guardian Mobile
- Guardian Email

**Section 3: Address (Optional)**
- Address Line 1
- Address Line 2
- City
- State
- PIN Code

**Section 4: Academic Details (Optional)**
- Previous School
- Transfer Certificate Number
- Batch Assignment

### Removed Fields (Streamlined)

The following fields were removed to reduce registration friction:
- Roll Number (auto-generated or assigned later)
- Blood Group
- Emergency & Medical section
- Photo upload (optional, can add later)

### Add Single Student

1. Click "Add Student"
2. **Required Section** (mandatory, expanded by default)
   - Enter 7 mandatory fields
   - Form validates in real-time
3. **Optional Sections** (collapsed by default)
   - Expand to add additional info
   - SectionBadge shows completion status
4. **Batch Assignment**
   - Select batch from dropdown
   - Or leave for later assignment
5. Save

### Bulk Upload

**Method 1: Copy & Paste**
```
Name    DOB    Gender    Mobile    Email    Username    Password
Rahul Sharma    2010-05-15    Male    9876543210    rahul@email.com    rahul123    Pass@123
Priya Gupta    2010-08-22    Female    9876543211    priya@email.com    priya123    Pass@123
```

**Method 2: CSV Upload**
1. Download template with 7 mandatory columns
2. Fill student data
3. Upload and preview
4. Fix validation errors
5. Import valid rows

### Bulk Upload Fields (Mandatory Only)

| Field | Format | Validation |
|-------|--------|------------|
| Full Name | Text | Required |
| Date of Birth | YYYY-MM-DD | Valid date |
| Gender | Male/Female/Other | Enum |
| Mobile | 10 digits | Format |
| Email | Valid email | Unique |
| Username | Text | Unique, no spaces |
| Password | Text | Min 8 chars |

### Manage Students

| Action | How | Result |
|--------|-----|--------|
| View Profile | Click row | Opens full profile |
| Edit | Click edit | Edit dialog |
| Change Batch | From profile | Batch reassignment |
| Deactivate | Status toggle | Blocks login |
| Delete | Click delete | Removes student |
| Reset Password | Action menu | Sends reset |

### Student Profile View

```text
Rahul Sharma (rahul123)
├── Class: 10 | Batch: 10A
├── DOB: May 15, 2010 | Gender: Male
├── Contact: 9876543210 | rahul@email.com
├── Parent: Mr. Vijay Sharma
├── Enrolled: Jan 5, 2024
└── Status: Active
```

---

## Data Flow

```text
Source: Institute creates student
         │
         ▼
Storage: students[] in instituteData
         ├── Profile data
         ├── Batch enrollment
         └── Academic records
         │
         ▼
Downstream:
├── Student Portal (login access)
├── Batch (student count)
├── Teacher (student visibility)
└── Progress Tracking (personal data)
```

---

## Cross-Login Connections

| This Feature | Connects To | Direction | What Happens |
|--------------|-------------|-----------|--------------|
| Student Creation | Student Portal | Downstream | Enables login |
| Batch Assignment | Student Dashboard | Downstream | Shows batch schedule |
| Batch Assignment | Teacher | Downstream | Student visible in class |
| Status Change | Student Login | Downstream | Blocks/allows access |

---

## Business Rules

1. **Email and Username must be unique** across institute
2. **Mobile validation** - valid format required
3. **Password requirements** - min 8 chars, complexity
4. **Date of Birth** - reasonable age range
5. **Batch assignment optional** at registration
6. **Inactive students** cannot login
7. **Deletion allowed** only for recent enrollments

---

## Mobile Behavior

- Student list: Card view with avatar
- Registration form: Full-screen accordion
- Accordion sections: Tap to expand/collapse
- SectionBadge: Shows completion count
- Bulk upload: Bottom sheet with paste area
- Actions: Bottom action sheet

---

## Section Badge Logic

| Section | Badge Display |
|---------|---------------|
| Required | "7/7" or "5/7 remaining" |
| Parent Info | "0/5" or "3/5 filled" |
| Address | "0/5" or "Complete" |
| Academic | "0/3" or "Complete" |

---

## Related Documentation

- [Batches](./batches.md)
- [Student Portal Overview](../04-student/README.md)
- [Batch-Student Flow](../05-cross-login-flows/batch-student-flow.md)
- [Institute Smoke Tests](../06-testing-scenarios/smoke-tests/institute.md)

---

*Last Updated: January 2025*
