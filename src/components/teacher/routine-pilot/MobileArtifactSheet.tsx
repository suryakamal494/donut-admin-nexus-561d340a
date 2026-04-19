import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Paperclip, ChevronUp } from "lucide-react";
import ArtifactPane from "./ArtifactPane";
import type { Batch, Thread } from "./types";

interface Props {
  batch: Batch | null;
  thread: Thread | null;
  artifactCount: number;
  routineKey?: string;
}

export default function MobileArtifactSheet({ batch, thread, artifactCount, routineKey }: Props) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button
          type="button"
          data-tour="copilot-mobile-artifacts"
          className="w-full flex items-center justify-between px-4 py-2.5 border-t bg-card/80 backdrop-blur-sm text-sm hover:bg-muted/50 transition-colors"
        >
          <span className="flex items-center gap-2 font-medium">
            <Paperclip className="w-4 h-4 text-muted-foreground" />
            {artifactCount} artifact{artifactCount === 1 ? "" : "s"}
          </span>
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        </button>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh]">
        <div className="flex-1 min-h-0 overflow-hidden">
          <ArtifactPane batch={batch} thread={thread} routineKey={routineKey} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
