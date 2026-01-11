// Test Status Filter Pills - Horizontal scrollable filter
// Used in SubjectTestsSheet to filter by status

import { memo } from "react";
import { cn } from "@/lib/utils";
import type { TestStatus } from "@/data/student/tests";

type FilterStatus = TestStatus | "all";

interface TestStatusFilterProps {
  selectedStatus: FilterStatus;
  onStatusChange: (status: FilterStatus) => void;
  counts: Record<FilterStatus, number>;
  className?: string;
}

const statusConfig: { id: FilterStatus; label: string; activeClass: string }[] = [
  {
    id: "all",
    label: "All",
    activeClass: "bg-foreground text-white",
  },
  {
    id: "live",
    label: "Live",
    activeClass: "bg-rose-500 text-white",
  },
  {
    id: "upcoming",
    label: "Upcoming",
    activeClass: "bg-amber-500 text-white",
  },
  {
    id: "attempted",
    label: "Done",
    activeClass: "bg-emerald-500 text-white",
  },
  {
    id: "missed",
    label: "Missed",
    activeClass: "bg-gray-500 text-white",
  },
];

const TestStatusFilter = memo(function TestStatusFilter({
  selectedStatus,
  onStatusChange,
  counts,
  className,
}: TestStatusFilterProps) {
  return (
    <div className={cn("flex gap-2 overflow-x-auto pb-1 scrollbar-hide", className)}>
      {statusConfig.map((status) => {
        const count = counts[status.id];
        const isActive = selectedStatus === status.id;

        // Hide filters with 0 tests (except "all")
        if (count === 0 && status.id !== "all") return null;

        return (
          <button
            key={status.id}
            onClick={() => onStatusChange(status.id)}
            className={cn(
              "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
              "border border-transparent",
              isActive
                ? status.activeClass
                : "bg-white/60 text-muted-foreground hover:bg-white/80 border-white/50"
            )}
          >
            {status.label}
            {count > 0 && (
              <span
                className={cn(
                  "ml-1.5 px-1.5 py-0.5 rounded-full text-[10px]",
                  isActive ? "bg-white/20" : "bg-muted/50"
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
});

export default TestStatusFilter;
