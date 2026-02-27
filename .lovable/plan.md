

## Fix: Enable "Generate Practice" for ALL Performance Buckets

### Current state
Line 184 in `ChapterReport.tsx` restricts the button to only `reinforcement` and `risk` buckets:
```tsx
{(bucket.key === "reinforcement" || bucket.key === "risk") && (
```

### Change
Remove the conditional — show the "Generate Practice" button on ALL 4 buckets (mastery, stable, reinforcement, risk). Adjust the prefill instructions per band:

- **Mastery Ready**: "Generate advanced/challenge-level practice for top performers on [chapter]"
- **Stable Progress**: "Generate reinforcement practice to solidify understanding on [chapter]"
- **Reinforcement Needed**: Keep current (focus on weak topics)
- **Foundational Risk**: Keep current (focus on weak topics)

### File to modify
| File | Change |
|------|--------|
| `src/pages/teacher/ChapterReport.tsx` | Remove the `bucket.key === "reinforcement" || bucket.key === "risk"` condition (line 184). Update the instructions builder to vary by band type — challenge problems for mastery/stable, remediation for reinforcement/risk. |

### Implementation detail
Replace the conditional rendering with unconditional rendering. Update the `onClick` handler to select focus topics and instruction text based on `bucket.key`:
- `mastery` / `stable` → use strong topics, instruction says "challenge" or "extend"
- `reinforcement` / `risk` → use weak+moderate topics, instruction says "focus on gaps"

One file, ~15 lines changed.

