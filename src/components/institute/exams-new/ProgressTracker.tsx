import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, AlertCircle, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionProgress, availableSubjects, AddedQuestion } from "@/hooks/useExamCreationNew";
import { questionTypeLabels } from "@/data/examPatternsData";
import { AddedQuestionsSheet } from "./AddedQuestionsSheet";

interface ProgressTrackerProps {
  sectionProgress: SectionProgress[];
  totalRequired: number;
  totalAdded: number;
  isQuickTest: boolean;
  addedQuestions?: AddedQuestion[];
  onRemoveQuestion?: (questionId: string) => void;
}

export function ProgressTracker({
  sectionProgress,
  totalRequired,
  totalAdded,
  isQuickTest,
  addedQuestions = [],
  onRemoveQuestion,
}: ProgressTrackerProps) {
  const [viewingSection, setViewingSection] = useState<{
    id: string | null;
    name: string;
  } | null>(null);

  const overallPercent = Math.min((totalAdded / totalRequired) * 100, 100);
  const isComplete = totalAdded >= totalRequired;

  const getSubjectName = (id: string | null) => {
    if (!id) return "General";
    return availableSubjects.find(s => s.id === id)?.name || id;
  };

  const handleViewSection = (sectionId: string, sectionName: string) => {
    setViewingSection({ id: sectionId, name: sectionName });
  };

  const handleViewAll = () => {
    setViewingSection({ id: null, name: "All Sections" });
  };

  return (
    <>
      <Card className="sticky top-4">
        <CardHeader className="p-3 sm:pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <Badge 
              variant={isComplete ? "default" : "secondary"}
              className={cn(
                "text-xs px-2 py-1",
                isComplete && "bg-emerald-500 hover:bg-emerald-600"
              )}
            >
              {totalAdded}/{totalRequired}
            </Badge>
          </div>
          <Progress value={overallPercent} className="h-2.5 sm:h-2" />
        </CardHeader>

        <CardContent className="pt-0 p-3 sm:p-6 sm:pt-0">
          <ScrollArea className="h-[200px] sm:h-[250px] pr-2">
            <div className="space-y-3">
              {sectionProgress.map((section) => {
                const percent = Math.min((section.added / section.required) * 100, 100);
                const isSectionComplete = section.added >= section.required;
                const sectionName = isQuickTest ? getSubjectName(section.subjectId) : section.sectionName;

                return (
                  <div key={section.sectionId} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {isSectionComplete ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        )}
                        <span className="text-xs font-medium truncate">
                          {sectionName}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={cn(
                          "text-xs tabular-nums",
                          isSectionComplete ? "text-emerald-500" : "text-muted-foreground"
                        )}>
                          {section.added}/{section.required}
                        </span>
                        
                        {/* View button - only show if there are questions */}
                        {section.added > 0 && onRemoveQuestion && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewSection(section.sectionId, sectionName)}
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-primary"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <Progress 
                      value={percent} 
                      className={cn(
                        "h-1.5",
                        isSectionComplete && "[&>div]:bg-emerald-500"
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
          <div className="mt-4 pt-3 border-t space-y-2">
            {isComplete ? (
              <div className="flex items-center gap-2 text-xs text-emerald-600">
                <Check className="w-4 h-4" />
                <span>All sections complete!</span>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                {totalRequired - totalAdded} more question{totalRequired - totalAdded !== 1 ? "s" : ""} needed
              </p>
            )}
            
            {/* View All button */}
            {totalAdded > 0 && onRemoveQuestion && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewAll}
                className="w-full h-8 text-xs gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                View All Questions ({totalAdded})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Questions Sheet */}
      {viewingSection && onRemoveQuestion && (
        <AddedQuestionsSheet
          open={!!viewingSection}
          onOpenChange={(open) => !open && setViewingSection(null)}
          sectionId={viewingSection.id}
          sectionName={viewingSection.name}
          addedQuestions={addedQuestions}
          onRemoveQuestion={onRemoveQuestion}
        />
      )}
    </>
  );
}
