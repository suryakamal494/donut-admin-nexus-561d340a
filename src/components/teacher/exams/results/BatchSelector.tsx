import { cn } from "@/lib/utils";
import { batchInfoMap } from "@/data/teacher/examResults";

interface BatchSelectorProps {
  batchIds: string[];
  selectedBatchId: string;
  onSelect: (batchId: string) => void;
}

export const BatchSelector = ({ batchIds, selectedBatchId, onSelect }: BatchSelectorProps) => {
  if (batchIds.length <= 1) return null;

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
      {batchIds.map((batchId) => {
        const info = batchInfoMap[batchId];
        const label = info ? `${info.className} - ${info.name}` : batchId;
        const isActive = selectedBatchId === batchId;

        return (
          <button
            key={batchId}
            onClick={() => onSelect(batchId)}
            className={cn(
              "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              "active:scale-[0.98] min-h-[32px] min-w-[44px]",
              isActive
                ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-sm"
                : "bg-muted/70 hover:bg-muted text-muted-foreground"
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};
