# Cross-Login Flows Overview

> How data and actions flow between SuperAdmin, Institute, Teacher, and Student portals.

---

## Purpose

This section documents how data created in one portal affects and becomes visible in other portals. Understanding these flows is critical for:
- **Developers**: Implementing features that span portals
- **Testers**: Creating cross-portal test scenarios
- **Product Team**: Understanding system dependencies

---

## Flow Summary

| Flow | From | To | Document |
|------|------|----|----|
| [Content Propagation](./content-propagation.md) | SA → Inst → Teacher → Student | Content visibility |
| [Question Propagation](./question-propagation.md) | SA → Inst → Teacher | Question bank |
| [Exam Flow](./exam-flow.md) | SA/Inst/Teacher → Student | Exam creation to attempt |
| [Curriculum Flow](./curriculum-course-flow.md) | SA → All | Master data |
| [Timetable Flow](./timetable-flow.md) | Inst → Teacher/Student | Scheduling |
| [Academic Schedule Flow](./academic-schedule-flow.md) | Inst → Teacher → Inst | Planning to confirmation |
| [Homework Flow](./homework-flow.md) | Teacher → Student → Teacher | Assignment cycle |
| [Batch-Student Flow](./batch-student-flow.md) | Inst → Student | Enrollment visibility |

---

## Key Principles

1. **Data flows downstream** by default (SA → Inst → Teacher → Student)
2. **Confirmations flow upstream** (Student → Teacher → Institute)
3. **Scoping filters** at each level (curriculum, subject, batch)
4. **Read-only downstream** for global content
5. **Local ownership** for editable content

---

*Last Updated: January 2025*
