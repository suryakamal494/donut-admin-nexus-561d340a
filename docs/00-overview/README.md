# DonutAI Documentation

Welcome to the DonutAI platform documentation. This comprehensive guide covers all portals, features, cross-login flows, and technical architecture.

## Platform Overview

DonutAI is a multi-portal educational platform designed for:
- **SuperAdmin**: Platform-wide management of curriculum, content, and institutes
- **Institute**: School-level operations including batches, timetables, and academic schedules
- **Teacher**: Classroom management, lesson planning, and student progress tracking
- **Student**: Personalized learning with classroom, self-paced, and competitive modes

## Documentation Structure

| Section | Description |
|---------|-------------|
| 01-superadmin | SuperAdmin portal features and workflows |
| 02-institute | Institute portal features and workflows |
| 03-teacher | Teacher portal features and workflows |
| 04-student | Student portal features and workflows |
| 05-cross-login-flows | Data propagation between portals |
| 06-testing-scenarios | Smoke, intra-login, and inter-login tests |
| 07-technical | Architecture, routing, and patterns |

## Key Concepts

### Cross-Login Dependencies

The platform uses a hierarchical data model where:

1. **SuperAdmin creates master data** (Curriculum, Courses, Content, Questions)
2. **Institutes adopt and extend** this data for their specific needs
3. **Teachers consume** Institute configurations for classroom delivery
4. **Students experience** the final curated learning paths

### Data Flow Direction

```
SuperAdmin (Global)
    ↓
Institute (School-Level)
    ↓
Teacher (Classroom-Level)
    ↓
Student (Individual-Level)
```

## How to Use This Documentation

1. **Start with the Overview** of each portal to understand its purpose
2. **Review specific features** for detailed UI and workflow information
3. **Check Cross-Login Flows** to understand data dependencies
4. **Use Testing Scenarios** for QA verification

## Quick Navigation

- [SuperAdmin Portal](./01-superadmin/README.md)
- [Institute Portal](./02-institute/README.md)
- [Teacher Portal](./03-teacher/README.md)
- [Student Portal](./04-student/README.md)
- [Cross-Login Flows](./05-cross-login-flows/README.md)
- [Testing Scenarios](./06-testing-scenarios/README.md)
- [Technical Documentation](./07-technical/README.md)
