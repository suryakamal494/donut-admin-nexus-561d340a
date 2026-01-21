import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionProgress, availableSubjects } from "@/hooks/useExamCreationNew";
import { questionTypeLabels } from "@/data/examPatternsData";

interface ProgressTrackerProps {
  sectionProgress: SectionProgress[];
  totalRequired: number;
  totalAdded: number;
  isQuickTest: boolean;
}

export function ProgressTracker({
  sectionProgress,
  totalRequired,
  totalAdded,
  isQuickTest,
}: ProgressTrackerProps) {
  const overallPercent = Math.min((totalAdded / totalRequired) * 100, 100);
  const isComplete = totalAdded >= totalRequired;

  const getSubjectName = (id: string | null) => {
    if (!id) return "General";
    return availableSubjects.find(s => s.id === id)?.name || id;
  };

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Progress</CardTitle>
          <Badge 
            variant={isComplete ? "default" : "secondary"}
            className={cn(
              "text-xs",
              isComplete && "bg-green-500 hover:bg-green-600"
            )}
          >
            {totalAdded}/{totalRequired}
          </Badge>
        </div>
        <Progress value={overallPercent} className="h-2" />
      </CardHeader>

      <CardContent className="pt-0">
        <ScrollArea className="h-[250px] pr-2">
          <div className="space-y-3">
            {sectionProgress.map((section) => {
              const percent = Math.min((section.added / section.required) * 100, 100);
              const isSectionComplete = section.added >= section.required;

              return (
                <div key={section.sectionId} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      {isSectionComplete ? (
                        <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      )}
                      <span className="text-xs font-medium truncate">
                        {isQuickTest ? getSubjectName(section.subjectId) : section.sectionName}
                      </span>
                    </div>
                    <span className={cn(
                      "text-xs tabular-nums",
                      isSectionComplete ? "text-green-500" : "text-muted-foreground"
                    )}>
                      {section.added}/{section.required}
                    </span>
                  </div>

                  <Progress 
                    value={percent} 
                    className={cn(
                      "h-1.5",
                      isSectionComplete && "[&>div]:bg-green-500"
                    )} 
                  />

                  {!isQuickTest && section.questionTypes.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {section.questionTypes.slice(0, 2).map(type => (
                        <span
                          key={type}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                        >
                          {questionTypeLabels[type]}
                        </span>
                      ))}
                      {section.questionTypes.length > 2 && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                          +{section.questionTypes.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Summary */}
        <div className="mt-4 pt-3 border-t">
          {isComplete ? (
            <div className="flex items-center gap-2 text-xs text-green-600">
              <Check className="w-4 h-4" />
              <span>All sections complete!</span>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              {totalRequired - totalAdded} more question{totalRequired - totalAdded !== 1 ? "s" : ""} needed
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
