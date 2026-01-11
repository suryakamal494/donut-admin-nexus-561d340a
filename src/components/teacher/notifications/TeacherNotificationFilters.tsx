import { memo } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { NotificationCategory } from "@/types/teacherNotifications";

interface FilterOption {
  value: NotificationCategory;
  label: string;
  count: number;
}

interface TeacherNotificationFiltersProps {
  filters: FilterOption[];
  activeFilter: NotificationCategory;
  onFilterChange: (filter: NotificationCategory) => void;
}

export const TeacherNotificationFilters = memo(function TeacherNotificationFilters({
  filters,
  activeFilter,
  onFilterChange
}: TeacherNotificationFiltersProps) {
  return (
    <ScrollArea className="w-full">
      <div className="flex gap-2 pb-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all",
              "border min-h-[36px] sm:min-h-[40px]",
              activeFilter === filter.value
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-background text-muted-foreground border-muted hover:bg-muted/50 hover:text-foreground"
            )}
          >
            {filter.label}
            {filter.count > 0 && (
              <Badge 
                variant={activeFilter === filter.value ? "secondary" : "outline"}
                className={cn(
                  "h-5 min-w-[20px] px-1.5 text-[10px]",
                  activeFilter === filter.value 
                    ? "bg-primary-foreground/20 text-primary-foreground border-transparent" 
                    : "bg-muted"
                )}
              >
                {filter.count}
              </Badge>
            )}
          </button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="invisible" />
    </ScrollArea>
  );
});
