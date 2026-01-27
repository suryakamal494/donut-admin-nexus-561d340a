# Timetable Flow

> From Institute schedule creation to Teacher/Student visibility.

---

## Flow Diagram

```text
INSTITUTE ADMIN                              TEACHER                              STUDENT
───────────────                              ───────                              ───────

Setup Phase:
├── Define Periods         
├── Configure Breaks       
├── Set Holidays           
└── Block Exam Dates       

Workspace Phase:                             
├── Assign Teachers        ──────────────►   My Schedule Page
├── Map Subjects                             ├── Own classes only
└── Resolve Conflicts                        ├── Subject-filtered
                                             └── Lesson plan links
Publish:                                     
└── Timetable Active       ──────────────────────────────────────►   Dashboard Schedule
                                                                      └── Today's classes

Substitution:                                Sees substitution duty
├── Mark Absence           ──────────────►   in schedule
└── Assign Substitute      
```

## Key Rules

1. **Teachers see** only their assigned classes
2. **Students see** only their batch's schedule
3. **Substitutions** update both original and substitute teacher views
4. **Holidays/Exams** block slots in all views

---

*Last Updated: January 2025*
