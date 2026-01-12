import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { CheckCircle, BookOpen, BookMarked, Timer, Calendar, GraduationCap, Target, Clock, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChapterDetail } from "./types";
import { getTopicsForChapter } from "./topics";

interface ChapterDetailSheetProps {
  selectedChapter: ChapterDetail | null;
  onClose: () => void;
}

export function ChapterDetailSheet({
  selectedChapter,
  onClose,
}: ChapterDetailSheetProps) {
  if (!selectedChapter) return null;

  const topics = getTopicsForChapter(selectedChapter.chapter.chapterId, selectedChapter.chapter.chapterName);
  const completedTopics = topics.filter(t => t.status === "completed").length;
  const progressPercent = (completedTopics / topics.length) * 100;

  return (
    <Sheet open={!!selectedChapter} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              selectedChapter.isCompleted ? "bg-emerald-100" :
              selectedChapter.isCurrent ? "bg-primary/20" : "bg-muted"
            )}>
              {selectedChapter.isCompleted ? (
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              ) : selectedChapter.isCurrent ? (
                <BookOpen className="w-6 h-6 text-primary" />
              ) : (
                <BookMarked className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div>
              <SheetTitle className="text-left">{selectedChapter.chapter.chapterName}</SheetTitle>
              <SheetDescription className="text-left">
                {selectedChapter.subjectName} • Chapter {selectedChapter.chapter.order}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Status Badge */}
        <div className="mb-4">
          <Badge className={cn(
            "gap-1.5",
            selectedChapter.isCompleted ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
            selectedChapter.isCurrent ? "bg-primary/10 text-primary border-primary/20" :
            "bg-muted text-muted-foreground"
          )}>
            {selectedChapter.isCompleted ? (
              <><CheckCircle className="w-3.5 h-3.5" /> Completed</>
            ) : selectedChapter.isCurrent ? (
              <><Target className="w-3.5 h-3.5" /> In Progress</>
            ) : (
              <><Clock className="w-3.5 h-3.5" /> Upcoming</>
            )}
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3 rounded-lg bg-muted/30 border text-center">
            <Timer className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-lg font-bold">{selectedChapter.chapter.plannedHours}h</p>
            <p className="text-xs text-muted-foreground">Planned</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 border text-center">
            <Calendar className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-lg font-bold">{selectedChapter.chapter.weeksNeeded}</p>
            <p className="text-xs text-muted-foreground">Week{selectedChapter.chapter.weeksNeeded > 1 ? 's' : ''}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 border text-center">
            <GraduationCap className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-lg font-bold">{topics.length}</p>
            <p className="text-xs text-muted-foreground">Topics</p>
          </div>
        </div>

        {/* Topic Breakdown */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2 text-sm">
            <BookOpen className="w-4 h-4" />
            Topic Breakdown
          </h4>
          
          <div className="space-y-2">
            {topics.map((topic, idx) => (
              <div 
                key={topic.id}
                className={cn(
                  "p-3 rounded-lg border flex items-center gap-3",
                  topic.status === "completed" && "border-emerald-200 bg-emerald-50/30",
                  topic.status === "in_progress" && "border-primary/30 bg-primary/5",
                  topic.status === "pending" && "border-muted"
                )}
              >
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-medium",
                  topic.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                  topic.status === "in_progress" ? "bg-primary/10 text-primary" : 
                  "bg-muted text-muted-foreground"
                )}>
                  {topic.status === "completed" ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    idx + 1
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "font-medium text-sm",
                    topic.status === "completed" && "text-muted-foreground"
                  )}>
                    {topic.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{topic.duration} estimated</p>
                </div>
                <Badge variant="outline" className={cn(
                  "text-xs shrink-0",
                  topic.status === "completed" && "text-emerald-600 border-emerald-300",
                  topic.status === "in_progress" && "text-primary border-primary/30",
                  topic.status === "pending" && "text-muted-foreground"
                )}>
                  {topic.status === "completed" ? "Done" :
                   topic.status === "in_progress" ? "Current" : "Pending"}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Summary */}
        <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Topic Progress</span>
            <span className="text-sm text-muted-foreground">
              {completedTopics} / {topics.length}
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
