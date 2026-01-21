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
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Select Subjects</h2>
        <p className="text-sm text-muted-foreground">
          {isQuickTest
            ? "Choose subjects for your quick test"
            : "Select subjects to use with this pattern"}
        </p>
      </div>

      {/* Subject Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
              <CardContent className="p-4 flex items-center justify-between">
                <span className={cn(
                  "font-medium",
                  isSelected && "text-primary"
                )}>
                  {subject.name}
                </span>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selection Summary */}
      {selectedSubjects.length > 0 && (
        <div className="p-3 rounded-lg bg-muted/50">
          <p className="text-sm">
            <span className="font-medium">{selectedSubjects.length}</span> subject{selectedSubjects.length !== 1 ? "s" : ""} selected: {selectedSubjects.map(s => 
              availableSubjects.find(sub => sub.id === s)?.name
            ).join(", ")}
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={onNext} disabled={!canProceed}>
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
