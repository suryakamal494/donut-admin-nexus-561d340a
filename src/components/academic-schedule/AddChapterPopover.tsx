// Add Chapter Popover Component
// Allows adding pending chapters to empty week cells

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, BookOpen, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { PendingChapter } from "@/types/academicPlanner";

interface AddChapterPopoverProps {
  subjectId: string;
  subjectName: string;
  weekIndex: number;
  weeklyHours: number;
  pendingChapters: PendingChapter[];
  onAddChapter: (chapterId: string, hours: number) => void;
  children?: React.ReactNode;
}

export function AddChapterPopover({
  subjectId,
  subjectName,
  weekIndex,
  weeklyHours,
  pendingChapters,
  onAddChapter,
  children,
}: AddChapterPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<PendingChapter | null>(null);
  const [hours, setHours] = useState<string>(weeklyHours.toString());

  const handleAddChapter = () => {
    if (selectedChapter && hours) {
      const hoursValue = parseInt(hours);
      if (hoursValue > 0) {
        onAddChapter(selectedChapter.chapterId, hoursValue);
        setIsOpen(false);
        setSelectedChapter(null);
        setHours(weeklyHours.toString());
      }
    }
  };

  const hasPendingChapters = pendingChapters.length > 0;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {children || (
          <button
            className={cn(
              "h-16 w-full flex flex-col items-center justify-center",
              "border border-dashed border-muted-foreground/30 rounded-lg",
              "bg-muted/10 hover:bg-muted/30 hover:border-primary/50 transition-all",
              "cursor-pointer group"
            )}
          >
            <div className="flex items-center gap-1 text-muted-foreground/60 group-hover:text-primary transition-colors">
              <Plus className="w-4 h-4" />
              <span className="text-xs font-medium">Add</span>
            </div>
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" align="center">
        <div className="space-y-3">
          {/* Header */}
          <div>
            <h4 className="font-medium text-sm">Add Chapter to Week {weekIndex + 1}</h4>
            <p className="text-xs text-muted-foreground">{subjectName}</p>
          </div>

          {hasPendingChapters ? (
            <>
              {/* Chapter Selection */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">Select Chapter</Label>
                <ScrollArea className="h-40 border rounded-md">
                  <div className="p-1 space-y-1">
                    {pendingChapters.map((chapter) => (
                      <button
                        key={chapter.chapterId}
                        className={cn(
                          "w-full text-left px-2 py-2 rounded-md text-xs transition-colors",
                          selectedChapter?.chapterId === chapter.chapterId
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        )}
                        onClick={() => {
                          setSelectedChapter(chapter);
                          setHours(Math.min(chapter.plannedHours, weeklyHours).toString());
                        }}
                      >
                        <div className="flex items-start gap-2">
                          <BookOpen className="w-3 h-3 mt-0.5 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="font-medium truncate">{chapter.chapterName}</p>
                            <div className="flex items-center gap-1 text-[10px] opacity-70">
                              <Clock className="w-2.5 h-2.5" />
                              <span>{chapter.plannedHours}h planned</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Hours Input */}
              {selectedChapter && (
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Hours for this week</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      min="1"
                      max={selectedChapter.plannedHours}
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      className="h-8 text-xs"
                    />
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      / {selectedChapter.plannedHours}h total
                    </span>
                  </div>
                </div>
              )}

              {/* Add Button */}
              <Button
                className="w-full h-9"
                onClick={handleAddChapter}
                disabled={!selectedChapter || !hours || parseInt(hours) <= 0}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Chapter
              </Button>
            </>
          ) : (
            <div className="py-6 text-center">
              <BookOpen className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">No pending chapters</p>
              <p className="text-xs text-muted-foreground/70">All chapters are already assigned</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}