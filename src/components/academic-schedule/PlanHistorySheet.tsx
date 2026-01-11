// Plan History Sheet Component
// Displays the history of adjustments made to the academic plan with undo functionality

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  History,
  Undo2,
  Clock,
  ArrowDownUp,
  ArrowLeft,
  ArrowRight,
  Lock,
  Unlock,
  Plus,
  Minus,
  Trash2,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PlanHistoryEntry } from "@/hooks/useAcademicPlanGenerator";
import { ChapterAdjustment } from "@/types/academicPlanner";
import { formatDistanceToNow } from "date-fns";

interface PlanHistorySheetProps {
  history: PlanHistoryEntry[];
  onUndo: (entryId: string) => void;
  onClearHistory: () => void;
  children?: React.ReactNode;
}

const ADJUSTMENT_ICONS: Record<ChapterAdjustment['type'], React.ReactNode> = {
  extend: <ArrowRight className="w-3.5 h-3.5" />,
  compress: <ArrowLeft className="w-3.5 h-3.5" />,
  lock: <Lock className="w-3.5 h-3.5" />,
  unlock: <Unlock className="w-3.5 h-3.5" />,
  swap: <ArrowDownUp className="w-3.5 h-3.5" />,
  addHours: <Plus className="w-3.5 h-3.5" />,
  removeHours: <Minus className="w-3.5 h-3.5" />,
  setHours: <Settings2 className="w-3.5 h-3.5" />,
  removeFromWeek: <Trash2 className="w-3.5 h-3.5" />,
};

const ADJUSTMENT_COLORS: Record<ChapterAdjustment['type'], string> = {
  extend: "bg-blue-100 text-blue-700 border-blue-200",
  compress: "bg-amber-100 text-amber-700 border-amber-200",
  lock: "bg-purple-100 text-purple-700 border-purple-200",
  unlock: "bg-green-100 text-green-700 border-green-200",
  swap: "bg-indigo-100 text-indigo-700 border-indigo-200",
  addHours: "bg-emerald-100 text-emerald-700 border-emerald-200",
  removeHours: "bg-orange-100 text-orange-700 border-orange-200",
  setHours: "bg-sky-100 text-sky-700 border-sky-200",
  removeFromWeek: "bg-red-100 text-red-700 border-red-200",
};

export function PlanHistorySheet({
  history,
  onUndo,
  onClearHistory,
  children,
}: PlanHistorySheetProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleUndo = (entryId: string) => {
    onUndo(entryId);
    // Keep sheet open to see the result
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="gap-1.5 h-8">
            <History className="w-3.5 h-3.5" />
            History
            {history.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                {history.length}
              </Badge>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-[380px] sm:w-[440px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Adjustment History
          </SheetTitle>
          <SheetDescription>
            View and undo recent changes to the plan
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {/* Clear All Button */}
          {history.length > 0 && (
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-destructive"
                onClick={onClearHistory}
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Clear History
              </Button>
            </div>
          )}

          {/* History List */}
          <ScrollArea className="h-[calc(100vh-220px)]">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Clock className="w-12 h-12 text-muted-foreground/30 mb-3" />
                <p className="text-sm font-medium text-muted-foreground">No changes yet</p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Adjustments you make will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-3 pr-4">
                {history.map((entry, index) => (
                  <div
                    key={entry.id}
                    className={cn(
                      "p-3 rounded-lg border bg-card",
                      index === 0 && "ring-2 ring-primary/20"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={cn(
                        "p-1.5 rounded-md border shrink-0",
                        ADJUSTMENT_COLORS[entry.type]
                      )}>
                        {ADJUSTMENT_ICONS[entry.type]}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium truncate">
                            {entry.chapterName}
                          </span>
                          {index === 0 && (
                            <Badge variant="secondary" className="text-[9px] h-4 px-1">
                              Latest
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-xs text-muted-foreground">
                          {entry.description}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] text-muted-foreground/70">
                            {entry.subjectName}
                          </span>
                          <span className="text-[10px] text-muted-foreground/50">•</span>
                          <span className="text-[10px] text-muted-foreground/70">
                            {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
                          </span>
                        </div>
                      </div>

                      {/* Undo Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs gap-1 shrink-0"
                        onClick={() => handleUndo(entry.id)}
                      >
                        <Undo2 className="w-3 h-3" />
                        Undo
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
