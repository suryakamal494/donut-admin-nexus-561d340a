import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  AlertCircle,
  BookOpen,
  Clock,
  ChevronRight,
  ChevronLeft,
  ListChecks,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { SectionProgress, ChapterInfo } from "@/hooks/useTeacherSyllabusProgress";

export interface PendingClass {
  id: string;
  batchId: string;
  batchName: string;
  subjectId: string;
  subjectName: string;
  date: string;
  periodsCount: number;
  chapters: ChapterInfo[];
  suggestedChapterId?: string;
}

interface BulkConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pendingClasses: PendingClass[];
  onConfirmAll: (confirmations: BulkConfirmationResult[]) => void;
}

export interface BulkConfirmationResult {
  classId: string;
  batchName: string;
  didTeach: boolean;
  chapterId?: string;
  chapterName?: string;
}

interface ClassConfirmationState {
  classId: string;
  selected: boolean;
  didTeach: boolean | null;
  chapterId: string;
}

export function BulkConfirmationDialog({
  open,
  onOpenChange,
  pendingClasses,
  onConfirmAll,
}: BulkConfirmationDialogProps) {
  const isMobile = useIsMobile();
  const [step, setStep] = useState<"select" | "confirm" | "review">("select");
  
  // State for each class
  const [classStates, setClassStates] = useState<Map<string, ClassConfirmationState>>(
    () => new Map()
  );

  // Initialize states when dialog opens
  useMemo(() => {
    if (open && pendingClasses.length > 0) {
      const newStates = new Map<string, ClassConfirmationState>();
      pendingClasses.forEach((pc) => {
        newStates.set(pc.id, {
          classId: pc.id,
          selected: true,
          didTeach: null,
          chapterId: pc.suggestedChapterId || "",
        });
      });
      setClassStates(newStates);
      setStep("select");
    }
  }, [open, pendingClasses]);

  const selectedClasses = useMemo(() => {
    return pendingClasses.filter((pc) => classStates.get(pc.id)?.selected);
  }, [pendingClasses, classStates]);

  const allConfirmed = useMemo(() => {
    return selectedClasses.every((pc) => {
      const state = classStates.get(pc.id);
      return state && state.didTeach !== null && (state.didTeach === false || state.chapterId);
    });
  }, [selectedClasses, classStates]);

  const toggleClassSelection = (classId: string) => {
    setClassStates((prev) => {
      const newMap = new Map(prev);
      const current = newMap.get(classId);
      if (current) {
        newMap.set(classId, { ...current, selected: !current.selected });
      }
      return newMap;
    });
  };

  const selectAll = () => {
    setClassStates((prev) => {
      const newMap = new Map(prev);
      newMap.forEach((state, key) => {
        newMap.set(key, { ...state, selected: true });
      });
      return newMap;
    });
  };

  const updateClassConfirmation = (
    classId: string,
    updates: Partial<ClassConfirmationState>
  ) => {
    setClassStates((prev) => {
      const newMap = new Map(prev);
      const current = newMap.get(classId);
      if (current) {
        newMap.set(classId, { ...current, ...updates });
      }
      return newMap;
    });
  };

  const markAllAsTaught = () => {
    setClassStates((prev) => {
      const newMap = new Map(prev);
      selectedClasses.forEach((pc) => {
        const current = newMap.get(pc.id);
        if (current) {
          newMap.set(pc.id, {
            ...current,
            didTeach: true,
            chapterId: current.chapterId || pc.suggestedChapterId || pc.chapters[0]?.chapterId || "",
          });
        }
      });
      return newMap;
    });
  };

  const handleSubmit = () => {
    const results: BulkConfirmationResult[] = selectedClasses.map((pc) => {
      const state = classStates.get(pc.id)!;
      const chapter = pc.chapters.find((c) => c.chapterId === state.chapterId);
      return {
        classId: pc.id,
        batchName: pc.batchName,
        didTeach: state.didTeach ?? false,
        chapterId: state.didTeach ? state.chapterId : undefined,
        chapterName: state.didTeach ? chapter?.chapterName : undefined,
      };
    });

    onConfirmAll(results);
    onOpenChange(false);
  };

  const handleClose = () => {
    setStep("select");
    onOpenChange(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Step 1: Select classes
  const SelectStep = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Select classes to confirm ({selectedClasses.length}/{pendingClasses.length})
        </p>
        <Button variant="ghost" size="sm" onClick={selectAll}>
          Select All
        </Button>
      </div>

      <ScrollArea className="max-h-[300px] sm:max-h-[350px]">
        <div className="space-y-2 pr-2">
          {pendingClasses.map((pc) => {
            const state = classStates.get(pc.id);
            return (
              <div
                key={pc.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                  state?.selected
                    ? "bg-teal-50 border-teal-200"
                    : "bg-card hover:bg-muted/50"
                )}
                onClick={() => toggleClassSelection(pc.id)}
              >
                <Checkbox
                  checked={state?.selected || false}
                  onCheckedChange={() => toggleClassSelection(pc.id)}
                  className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground truncate">
                      {pc.batchName}
                    </span>
                    <Badge variant="outline" className="shrink-0 text-xs">
                      {pc.subjectName}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(pc.date)}</span>
                    <span>•</span>
                    <span>{pc.periodsCount} period{pc.periodsCount !== 1 ? "s" : ""}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );

  // Step 2: Confirm each class
  const ConfirmStep = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Confirm teaching for each class
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={markAllAsTaught}
          className="gap-1.5"
        >
          <CheckCircle className="w-3.5 h-3.5" />
          Mark All Taught
        </Button>
      </div>

      <ScrollArea className="max-h-[320px] sm:max-h-[380px]">
        <div className="space-y-3 pr-2">
          {selectedClasses.map((pc) => {
            const state = classStates.get(pc.id);
            return (
              <div
                key={pc.id}
                className="p-3 rounded-lg border bg-card space-y-3"
              >
                {/* Class Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{pc.batchName}</p>
                    <p className="text-xs text-muted-foreground">
                      {pc.subjectName} • {formatDate(pc.date)}
                    </p>
                  </div>
                  {state?.didTeach !== null && (
                    <Badge
                      variant="outline"
                      className={cn(
                        state.didTeach
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      )}
                    >
                      {state.didTeach ? "Taught" : "Not Taught"}
                    </Badge>
                  )}
                </div>

                {/* Quick Toggle */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant={state?.didTeach === true ? "default" : "outline"}
                    className={cn(
                      "h-10 gap-1.5",
                      state?.didTeach === true && "bg-emerald-600 hover:bg-emerald-700"
                    )}
                    onClick={() => updateClassConfirmation(pc.id, { didTeach: true })}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Yes
                  </Button>
                  <Button
                    size="sm"
                    variant={state?.didTeach === false ? "default" : "outline"}
                    className={cn(
                      "h-10 gap-1.5",
                      state?.didTeach === false && "bg-amber-600 hover:bg-amber-700"
                    )}
                    onClick={() => updateClassConfirmation(pc.id, { didTeach: false })}
                  >
                    <AlertCircle className="w-4 h-4" />
                    No
                  </Button>
                </div>

                {/* Chapter Selection (if taught) */}
                {state?.didTeach === true && (
                  <Select
                    value={state.chapterId}
                    onValueChange={(v) => updateClassConfirmation(pc.id, { chapterId: v })}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select chapter" />
                    </SelectTrigger>
                    <SelectContent>
                      {pc.chapters.map((ch) => (
                        <SelectItem key={ch.chapterId} value={ch.chapterId}>
                          <span className="text-muted-foreground text-xs mr-1.5">
                            Ch {ch.order}
                          </span>
                          {ch.chapterName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );

  // Step 3: Review
  const ReviewStep = () => {
    const taughtCount = selectedClasses.filter(
      (pc) => classStates.get(pc.id)?.didTeach
    ).length;
    const notTaughtCount = selectedClasses.length - taughtCount;

    return (
      <div className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
            <p className="text-2xl font-bold text-emerald-700">{taughtCount}</p>
            <p className="text-xs text-emerald-600">Classes Taught</p>
          </div>
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-center">
            <p className="text-2xl font-bold text-amber-700">{notTaughtCount}</p>
            <p className="text-xs text-amber-600">Not Taught</p>
          </div>
        </div>

        {/* Confirmation List */}
        <ScrollArea className="max-h-[250px]">
          <div className="space-y-2 pr-2">
            {selectedClasses.map((pc) => {
              const state = classStates.get(pc.id);
              const chapter = pc.chapters.find((c) => c.chapterId === state?.chapterId);
              return (
                <div
                  key={pc.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border",
                    state?.didTeach
                      ? "bg-emerald-50/50 border-emerald-200"
                      : "bg-amber-50/50 border-amber-200"
                  )}
                >
                  {state?.didTeach ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">
                      {pc.batchName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {state?.didTeach && chapter
                        ? `${chapter.chapterName}`
                        : "Not taught"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="p-3 rounded-lg bg-teal-50 border border-teal-200">
          <p className="text-sm text-teal-700 text-center">
            Ready to submit {selectedClasses.length} confirmation{selectedClasses.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    );
  };

  const content = (
    <div className="space-y-4">
      {/* Progress Indicator */}
      <div className="flex items-center gap-2 mb-2">
        {["select", "confirm", "review"].map((s, idx) => (
          <div key={s} className="flex-1 flex items-center gap-2">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                step === s
                  ? "bg-teal-600 text-white"
                  : idx <
                    ["select", "confirm", "review"].indexOf(step)
                  ? "bg-teal-100 text-teal-700"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {idx + 1}
            </div>
            {idx < 2 && (
              <div
                className={cn(
                  "flex-1 h-1 rounded-full",
                  idx < ["select", "confirm", "review"].indexOf(step)
                    ? "bg-teal-400"
                    : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {step === "select" && <SelectStep />}
      {step === "confirm" && <ConfirmStep />}
      {step === "review" && <ReviewStep />}
    </div>
  );

  const footer = (
    <div className="flex items-center justify-between gap-3 w-full">
      {step !== "select" ? (
        <Button
          variant="outline"
          onClick={() =>
            setStep(step === "review" ? "confirm" : "select")
          }
          className="gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
      ) : (
        <Button variant="outline" onClick={handleClose}>
          Cancel
        </Button>
      )}

      {step === "select" && (
        <Button
          onClick={() => setStep("confirm")}
          disabled={selectedClasses.length === 0}
          className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 gap-1.5"
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}

      {step === "confirm" && (
        <Button
          onClick={() => setStep("review")}
          disabled={!allConfirmed}
          className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 gap-1.5"
        >
          Review
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}

      {step === "review" && (
        <Button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 gap-1.5"
        >
          <ListChecks className="w-4 h-4" />
          Submit All
        </Button>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-teal-600" />
              Bulk Confirmation
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-2">{content}</div>
          <DrawerFooter className="pt-2">{footer}</DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-teal-600" />
            Bulk Confirmation
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">{content}</div>
        <DialogFooter className="pt-4">{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
