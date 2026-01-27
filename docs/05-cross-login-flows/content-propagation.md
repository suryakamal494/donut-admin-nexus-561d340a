# Content Propagation Flow

> How content flows from SuperAdmin through Institute and Teacher to Students.

---

## Flow Diagram

```text
SUPERADMIN                    INSTITUTE                    TEACHER                    STUDENT
────────────                  ─────────                    ───────                    ───────
Creates Global      ──────►   Sees with "Global"   ──────►  Sees with "Global"   
Content                       badge (read-only)             badge (read-only)
                              
                              Creates Institute    ──────►  Sees with "Institute"
                              Content                       badge (read-only)
                                                            
                                                            Creates "My Content"
                                                            (full edit)
                              
                              Assigns to ────────────────►  Assigns to ──────────►  Sees assigned
                              batches                       batches                  content only
```

## Permission Matrix

| Action | SuperAdmin | Institute | Teacher | Student |
|--------|------------|-----------|---------|---------|
| Create | Global | Institute | Own | ❌ |
| Edit | Own only | Own only | Own only | ❌ |
| View Global | ✓ | ✓ | ✓ | ❌ |
| Assign | ✓ | ✓ | ✓ (own batches) | ❌ |

## Scoping Rules

1. **Teacher sees** content only for assigned subjects
2. **Student sees** only content assigned to their batch OR in lesson plans
3. **Institute cannot see** other institutes' content
4. **Global content** cannot be edited by Institute/Teacher

---

*Last Updated: January 2025*
