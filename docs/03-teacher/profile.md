# Teacher Profile

> Profile management and account settings.

---

## Overview

The Teacher Profile page provides access to personal information management, password settings, and account preferences. It's accessible from the header dropdown and includes photo upload with Supabase storage integration.

## Access

- **Route**: `/teacher/profile`
- **Login Types**: Teacher
- **Permissions Required**: Teacher account

---

## UI Components

| Component | Description | Location |
|-----------|-------------|----------|
| ProfileHeader | Photo + name | Top |
| ProfileForm | Editable fields | Main content |
| PasswordDialog | Password change | Dialog |
| PhotoUploader | Image cropping | Dialog |
| PreferencesSection | App settings | Bottom |

---

## Features & Functionality

### Profile Information

| Field | Editable | Notes |
|-------|----------|-------|
| Profile Photo | Yes | Cropping supported |
| Display Name | Yes | Visible to students |
| Email | No | Login credential |
| Mobile | Yes | Contact number |
| Subjects | No | Set by institute |
| Assigned Batches | No | Set by institute |

### Profile Photo Management

1. Click photo or "Change Photo"
2. Select image (mobile: camera or gallery)
3. Crop to square
4. Upload to Supabase storage
5. Profile updated

Storage bucket: `teacher-avatars`

### Edit Profile Dialog

```text
Edit Profile
┌─────────────────────────────────────────────────────────────┐
│ Display Name                                                │
│ [Dr. Rajesh Kumar                    ]                      │
│                                                              │
│ Mobile Number                                               │
│ [+91 98765 43210                     ]                      │
│                                                              │
│ [Cancel] [Save Changes]                                     │
└─────────────────────────────────────────────────────────────┘
```

### Reset Password Dialog

```text
Reset Password
┌─────────────────────────────────────────────────────────────┐
│ Current Password                                            │
│ [••••••••                            ]                      │
│                                                              │
│ New Password                                                │
│ [••••••••••                          ]                      │
│ Strength: ████░░░░ Strong                                   │
│                                                              │
│ Confirm New Password                                        │
│ [••••••••••                          ]                      │
│                                                              │
│ [Cancel] [Update Password]                                  │
└─────────────────────────────────────────────────────────────┘
```

### Password Requirements

- Minimum 8 characters
- At least one uppercase
- At least one number
- Strength indicator shown

### Profile Dropdown (Header)

```text
┌─────────────────────────────────────────────────────────────┐
│ 👤 Dr. Rajesh Kumar                                         │
│    Physics Teacher                                          │
├─────────────────────────────────────────────────────────────┤
│ Edit Profile                                                │
│ Reset Password                                              │
│ Notification Settings                                       │
├─────────────────────────────────────────────────────────────┤
│ Sign Out                                                    │
└─────────────────────────────────────────────────────────────┘
```

### Sign Out

- Clears local session
- Navigates to login page
- Confirmation optional

---

## Data Flow

```text
Source: Teacher account
         │
         ▼
Profile Page:
├── Display profile data
├── Edit dialogs
└── Photo upload
         │
         ▼
Storage:
├── Profile data (database)
└── Avatar images (Supabase storage)
```

---

## Business Rules

1. **Email cannot change** - login identifier
2. **Photo size limit** - 5MB max
3. **Photo format** - JPEG, PNG
4. **Password validation** - strength requirements
5. **Sign out** clears all local state
6. **Profile photo** publicly accessible

---

## Mobile Behavior

- Profile header: Centered, larger photo
- Edit dialogs: Bottom drawer
- Photo picker: Native camera/gallery
- Form fields: Full-width
- Actions: Stacked buttons

---

## Related Documentation

- [Dashboard](./dashboard.md)
- [Notifications](./notifications.md)
- [Teacher Smoke Tests](../06-testing-scenarios/smoke-tests/teacher.md)

---

*Last Updated: January 2025*
