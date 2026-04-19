import { Sheet, SheetContent } from "@/components/ui/sheet";
import LeftRail from "./LeftRail";
import type { Batch, Routine, Thread } from "./types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  batches: Batch[];
  routines: Routine[];
  threads: Thread[];
  selectedBatchId: string | null;
  selectedRoutineKey: string | null;
  selectedThreadId: string | null;
  onSelectBatch: (id: string) => void;
  onSelectRoutine: (key: string) => void;
  onSelectThread: (id: string) => void;
  onNewThread: () => void;
}

export default function MobileLeftRailSheet({
  open,
  onOpenChange,
  ...railProps
}: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0 w-[280px] sm:w-[320px] flex flex-col">
        <LeftRail
          {...railProps}
          onSelectBatch={(id) => {
            railProps.onSelectBatch(id);
          }}
          onSelectRoutine={(key) => {
            railProps.onSelectRoutine(key);
            onOpenChange(false);
          }}
          onSelectThread={(id) => {
            railProps.onSelectThread(id);
            onOpenChange(false);
          }}
          onNewThread={() => {
            railProps.onNewThread();
            onOpenChange(false);
          }}
        />
      </SheetContent>
    </Sheet>
  );
}
