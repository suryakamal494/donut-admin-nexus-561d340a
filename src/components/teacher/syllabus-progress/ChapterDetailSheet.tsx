import { X, CheckCircle, Clock, Circle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import type { SectionProgress, ChapterInfo } from "@/hooks/useTeacherSyllabusProgress";

interface ChapterDetailSheetProps {
  section: SectionProgress | null;
  open: boolean;
  onClose: () => void;
}

function ChapterRow({ chapter, index }: { chapter: ChapterInfo; index: number }) {
  const statusIcons = {
    completed: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    in_progress: <MapPin className="w-5 h-5 text-teal-500" />,
    not_started: <Circle className="w-5 h-5 text-muted-foreground/50" />,
  };

  const statusBg = {
    completed: "bg-emerald-50 border-emerald-200",
    in_progress: "bg-teal-50 border-teal-200 ring-2 ring-teal-200",
    not_started: "bg-muted/30 border-border",
  };

  return (
    <div
      className={cn(
        "p-3 rounded-lg border transition-all",
        statusBg[chapter.status]
      )}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">
          {statusIcons[chapter.status]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-muted-foreground">
              Ch. {index + 1}
            </span>
            {chapter.status === "in_progress" && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-teal-100 text-teal-700 font-medium">
                Current
              </span>
            )}
          </div>
          <h4 className="font-medium text-foreground text-sm leading-snug">
            {chapter.chapterName}
          </h4>
          
          {/* Hours Progress */}
          <div className="flex items-center gap-2 mt-2">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {chapter.actualHours}h / {chapter.plannedHours}h
            </span>
            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full",
                  chapter.status === "completed" && "bg-emerald-500",
                  chapter.status === "in_progress" && "bg-teal-500",
                  chapter.status === "not_started" && "bg-muted-foreground/20"
                )}
                style={{
                  width: `${Math.min(100, (chapter.actualHours / chapter.plannedHours) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SheetContent({ section }: { section: SectionProgress }) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header Stats */}
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 border-b border-teal-100/50 shrink-0">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-foreground">
              {section.completedChapters}/{section.totalChapters}
            </p>
            <p className="text-xs text-muted-foreground">Chapters</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {section.hoursTaken}h
            </p>
            <p className="text-xs text-muted-foreground">Taught</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-teal-600">
              {section.hoursRemaining}h
            </p>
            <p className="text-xs text-muted-foreground">Remaining</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-semibold">{section.percentComplete}%</span>
          </div>
          <Progress value={section.percentComplete} className="h-2" />
        </div>
      </div>

      {/* Chapter List - Scrollable */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-3 pb-8">
          {section.chapters.map((chapter, idx) => (
            <ChapterRow key={chapter.chapterId} chapter={chapter} index={idx} />
          ))}
          
          {section.chapters.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Circle className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
              <p>No chapter data available</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export function ChapterDetailSheet({ section, open, onClose }: ChapterDetailSheetProps) {
  const isMobile = useIsMobile();

  if (!section) return null;

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DrawerContent className="max-h-[85vh] flex flex-col">
          <DrawerHeader className="border-b shrink-0">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-left">
                {section.batchName}
              </DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>
          <div className="flex-1 min-h-0 overflow-hidden">
            <SheetContent section={section} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md h-[80vh] max-h-[600px] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 border-b shrink-0">
          <DialogTitle>{section.batchName}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-hidden">
          <SheetContent section={section} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
