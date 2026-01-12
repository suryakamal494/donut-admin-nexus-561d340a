import { ChevronRight, Lock, GripVertical, Plus } from "lucide-react";

export function PlanGridLegend() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-2 border-t">
      <span className="font-medium">Legend:</span>
      <div className="flex items-center gap-1.5">
        <div className="w-8 h-3 bg-primary/70 rounded" />
        <span>Full week</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-8 h-3 bg-primary/40 rounded-l" />
        <span>Continues</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-8 h-3 bg-primary/40 rounded-r flex items-center justify-end pr-1">
          <ChevronRight className="w-2 h-2" />
        </div>
        <span>Continues next</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Lock className="w-3 h-3 text-amber-600" />
        <span>Locked</span>
      </div>
      <div className="flex items-center gap-1.5">
        <GripVertical className="w-3 h-3" />
        <span>Draggable</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-1 h-3 bg-orange-400 rounded" />
        <span>Modified</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Plus className="w-3 h-3 text-primary" />
        <span>Add chapter</span>
      </div>
    </div>
  );
}
