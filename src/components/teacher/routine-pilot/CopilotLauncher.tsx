import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import RoutinePilotPage from "./RoutinePilotPage";
import { cn } from "@/lib/utils";

export default function CopilotLauncher() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button - bottom right */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open Copilot"
        className={cn(
          "fixed z-40 right-4 md:right-6",
          // sit above the mobile bottom nav (h-16 ≈ 64px) on small screens
          "bottom-20 md:bottom-6",
          "flex items-center gap-2 pl-4 pr-5 h-12 md:h-14 rounded-full",
          "bg-gradient-to-r from-primary to-accent text-white",
          "shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40",
          "hover:scale-105 active:scale-95 transition-all duration-200",
          "ring-1 ring-white/20"
        )}
      >
        <Sparkles className="w-5 h-5" />
        <span className="font-semibold text-sm md:text-base">Copilot</span>
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="p-0 w-full sm:max-w-full md:max-w-[95vw] lg:max-w-[1400px] h-full flex flex-col gap-0 border-l"
        >
          {/* Header */}
          <div className="h-14 flex items-center justify-between px-4 border-b bg-card/80 backdrop-blur-xl flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-sm leading-tight">Copilot</h2>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  AI workspace for your batches
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              aria-label="Close Copilot"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Workspace */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <RoutinePilotPage />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
