import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { availableSubjects } from "@/hooks/useExamCreationNew";

interface SubjectSelectStepProps {
  selectedSubjects: string[];
  toggleSubject: (subjectId: string) => void;
  isQuickTest: boolean;
  canProceed: boolean;
  onNext: () => void;
  onBack: () => void;
}

export function SubjectSelectStep({
  selectedSubjects,
  toggleSubject,
  isQuickTest,
  canProceed,
  onNext,
  onBack,
}: SubjectSelectStepProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg sm:text-xl font-semibold">Select Subjects</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {isQuickTest
            ? "Choose subjects for your quick test"
            : "Select subjects to use with this pattern"}
        </p>
      </div>

      {/* Subject Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
        {availableSubjects.map((subject) => {
          const isSelected = selectedSubjects.includes(subject.id);
          
          return (
            <Card
              key={subject.id}
              className={cn(
                "cursor-pointer transition-all duration-200",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "hover:border-primary/50"
              )}
              onClick={() => toggleSubject(subject.id)}
            >
              <CardContent className="p-3 sm:p-4 flex items-center justify-between gap-2">
                <span className={cn(
                  "text-sm sm:text-base font-medium truncate",
                  isSelected && "text-primary"
                )}>
                  {subject.name}
                </span>
                {isSelected && (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary-foreground" />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selection Summary */}
      {selectedSubjects.length > 0 && (
        <div className="p-2.5 sm:p-3 rounded-lg bg-muted/50">
          <p className="text-xs sm:text-sm">
            <span className="font-medium">{selectedSubjects.length}</span> subject{selectedSubjects.length !== 1 ? "s" : ""} selected: {selectedSubjects.map(s => 
              availableSubjects.find(sub => sub.id === s)?.name
            ).join(", ")}
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-3 sm:pt-4 border-t gap-2">
        <Button variant="outline" onClick={onBack} className="h-9 sm:h-10 text-xs sm:text-sm">
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          Back
        </Button>
        <Button onClick={onNext} disabled={!canProceed} className="h-9 sm:h-10 text-xs sm:text-sm">
          Next
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 sm:ml-2" />
        </Button>
      </div>
    </div>
  );
}