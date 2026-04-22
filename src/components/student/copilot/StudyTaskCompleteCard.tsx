// StudyTaskCompleteCard — inline "did you understand?" with mark-complete and need-help
import React from "react";
import { CheckCircle2, HelpCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  taskLabel: string;
  dayIndex: number;
  itemIndex: number;
  completed: boolean;
  onMarkComplete: (dayIndex: number, itemIndex: number) => void;
  onNeedHelp: (taskLabel: string) => void;
}

const StudyTaskCompleteCard: React.FC<Props> = ({
  taskLabel,
  dayIndex,
  itemIndex,
  completed,
  onMarkComplete,
  onNeedHelp,
}) => {
  return (
    <div className="rounded-xl border bg-card p-3 sm:p-4 max-w-full">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium mb-1">Did you finish this?</p>
          <p className="text-xs text-muted-foreground mb-3 truncate">{taskLabel}</p>
          {completed ? (
            <div className="flex items-center gap-1.5 text-sm text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
              Completed!
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                className="h-9 gap-1.5 min-w-[44px]"
                onClick={() => onMarkComplete(dayIndex, itemIndex)}
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Yes, done!
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 min-w-[44px]"
                onClick={() => onNeedHelp(taskLabel)}
              >
                <HelpCircle className="w-3.5 h-3.5" /> Need help
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(StudyTaskCompleteCard);