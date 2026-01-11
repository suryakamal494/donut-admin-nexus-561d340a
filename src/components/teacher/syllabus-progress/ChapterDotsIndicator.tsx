import { cn } from "@/lib/utils";

interface ChapterDotsIndicatorProps {
  totalChapters: number;
  completedChapters: number;
  currentChapterIndex: number;
  maxVisible?: number;
  size?: "sm" | "md";
}

export function ChapterDotsIndicator({
  totalChapters,
  completedChapters,
  currentChapterIndex,
  maxVisible = 8,
  size = "md",
}: ChapterDotsIndicatorProps) {
  const dotSize = size === "sm" ? "w-2 h-2" : "w-2.5 h-2.5";
  const currentDotSize = size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3";
  const gap = size === "sm" ? "gap-1" : "gap-1.5";

  // If too many chapters, show compressed view
  const showCompressed = totalChapters > maxVisible;
  
  if (showCompressed) {
    // Show first few, ellipsis, current area, ellipsis, last few
    const visibleDots = [];
    
    // Always show first 2
    for (let i = 0; i < Math.min(2, totalChapters); i++) {
      visibleDots.push({ index: i, type: "dot" });
    }
    
    // Add ellipsis if current is far from start
    if (currentChapterIndex > 3) {
      visibleDots.push({ index: -1, type: "ellipsis" });
    }
    
    // Show around current (if not at edges)
    const currentStart = Math.max(2, currentChapterIndex - 1);
    const currentEnd = Math.min(totalChapters - 2, currentChapterIndex + 2);
    
    if (currentStart <= currentEnd && currentChapterIndex >= 2 && currentChapterIndex < totalChapters - 2) {
      for (let i = currentStart; i <= currentEnd; i++) {
        if (!visibleDots.some(d => d.index === i)) {
          visibleDots.push({ index: i, type: "dot" });
        }
      }
    }
    
    // Add ellipsis if current is far from end
    if (currentChapterIndex < totalChapters - 4) {
      visibleDots.push({ index: -2, type: "ellipsis" });
    }
    
    // Always show last 2
    for (let i = Math.max(totalChapters - 2, 0); i < totalChapters; i++) {
      if (!visibleDots.some(d => d.index === i)) {
        visibleDots.push({ index: i, type: "dot" });
      }
    }
    
    return (
      <div className={cn("flex items-center", gap)}>
        {visibleDots.map((item, idx) => {
          if (item.type === "ellipsis") {
            return (
              <span key={`ellipsis-${item.index}`} className="text-muted-foreground text-xs px-0.5">
                ···
              </span>
            );
          }
          
          const i = item.index;
          const isCompleted = i < completedChapters;
          const isCurrent = i === currentChapterIndex;
          const isNotStarted = i > currentChapterIndex;
          
          return (
            <div
              key={i}
              className={cn(
                "rounded-full transition-all",
                isCurrent ? currentDotSize : dotSize,
                isCompleted && "bg-emerald-500",
                isCurrent && "bg-teal-500 ring-2 ring-teal-200 ring-offset-1",
                isNotStarted && "bg-muted-foreground/30"
              )}
            />
          );
        })}
      </div>
    );
  }

  // Normal view - show all dots
  return (
    <div className={cn("flex items-center flex-wrap", gap)}>
      {Array.from({ length: totalChapters }).map((_, i) => {
        const isCompleted = i < completedChapters;
        const isCurrent = i === currentChapterIndex;
        const isNotStarted = i > currentChapterIndex;

        return (
          <div
            key={i}
            className={cn(
              "rounded-full transition-all",
              isCurrent ? currentDotSize : dotSize,
              isCompleted && "bg-emerald-500",
              isCurrent && "bg-teal-500 ring-2 ring-teal-200 ring-offset-1",
              isNotStarted && "bg-muted-foreground/30"
            )}
            title={`Chapter ${i + 1}: ${isCompleted ? "Completed" : isCurrent ? "In Progress" : "Not Started"}`}
          />
        );
      })}
    </div>
  );
}
