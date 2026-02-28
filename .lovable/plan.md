

## Plan: Hide Totals Summary When Sections Are Enabled

**Problem**: When section-wise examination is ON, the "50 Total Questions / 200 Total Marks" summary is misleading — question count is already shown above, and marks aren't defined here (they're set in sections). Showing "200 marks" is incorrect.

**Change**: Wrap the totals summary `<div className="grid grid-cols-2 gap-3">` block (lines 317-333 in `DurationMarksStep.tsx`) in `{!hasSections && (...)}` so it only shows when sections are disabled.

**File**: `src/components/institute/exams-new/steps/DurationMarksStep.tsx` — single conditional wrapper around lines 318-333.

