import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Check,
  Clock,
  FileQuestion,
  Award,
  Minus,
  PercentCircle,
  Edit,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionDraft, availableSubjects } from "@/hooks/usePatternBuilder";
import { ExamPattern, questionTypeLabels, formatDuration } from "@/data/examPatternsData";

interface ReviewStepProps {
  name: string;
  description: string;
  hasFixedSubjects: boolean;
  subjects: string[];
  category: ExamPattern["category"];
  tags: string[];
  totalDuration: number;
  hasSectionWiseTime: boolean;
  sections: SectionDraft[];
  hasSections: boolean;
  hasUniformMarking: boolean;
  defaultMarksPerQuestion: number;
  hasNegativeMarking: boolean;
  defaultNegativeMarks: number;
  hasPartialMarking: boolean;
  totalQuestions: number;
  totalMarks: number;
  subjectQuestionCounts: Record<string, number>;
  isEditing: boolean;
  isProcessing: boolean;
  goToStep: (step: number) => void;
  onSave: () => void;
  onBack: () => void;
}

const categoryLabels: Record<ExamPattern["category"], string> = {
  competitive: "Competitive",
  board: "Board",
  custom: "Custom",
};

export function ReviewStep({
  name,
  description,
  hasFixedSubjects,
  subjects,
  category,
  tags,
  totalDuration,
  hasSectionWiseTime,
  sections,
  hasSections,
  hasUniformMarking,
  defaultMarksPerQuestion,
  hasNegativeMarking,
  defaultNegativeMarks,
  hasPartialMarking,
  totalQuestions,
  totalMarks,
  subjectQuestionCounts,
  isEditing,
  isProcessing,
  goToStep,
  onSave,
  onBack,
}: ReviewStepProps) {
  const getSubjectName = (id: string) => 
    availableSubjects.find(s => s.id === id)?.name || id;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Review Pattern</h2>
        <p className="text-sm text-muted-foreground">
          Review your pattern configuration before saving
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-3 sm:p-4 text-center">
            <FileQuestion className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-primary mb-1" />
            <p className="text-xl sm:text-2xl font-bold">{totalQuestions}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Questions</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-3 sm:p-4 text-center">
            <Award className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-primary mb-1" />
            <p className="text-xl sm:text-2xl font-bold">{totalMarks}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Total Marks</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-3 sm:p-4 text-center">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-primary mb-1" />
            <p className="text-xl sm:text-2xl font-bold">{formatDuration(totalDuration)}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Duration</p>
          </CardContent>
        </Card>
      </div>

      {/* Basic Info Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Basic Information</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => goToStep(1)}
              className="h-10 sm:h-8 text-xs min-w-[60px]"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Pattern Name</p>
            <p className="font-medium">{name}</p>
          </div>
          {description && (
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="text-sm">{description}</p>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{categoryLabels[category]}</Badge>
            {hasFixedSubjects ? (
              subjects.map(s => (
                <Badge key={s} variant="secondary">{getSubjectName(s)}</Badge>
              ))
            ) : (
              <Badge variant="secondary">Any Subjects</Badge>
            )}
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map(tag => (
                <span 
                  key={tag} 
                  className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Duration & Marks */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Duration & Marks</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => goToStep(2)}
              className="h-10 sm:h-8 text-xs min-w-[60px]"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Per-subject breakdown */}
          {hasFixedSubjects && subjects.length > 0 && (
            <div className="space-y-2">
              {subjects.map(s => (
                <div key={s} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{getSubjectName(s)}</span>
                  <span className="font-medium">{subjectQuestionCounts[s] || 0} questions</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {hasUniformMarking && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
                <Award className="w-4 h-4 text-primary" />
                <span className="text-sm">+{defaultMarksPerQuestion} per correct</span>
              </div>
            )}
            {hasNegativeMarking && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10">
                <Minus className="w-4 h-4 text-destructive" />
                <span className="text-sm">−{defaultNegativeMarks} per wrong</span>
              </div>
            )}
            {hasPartialMarking && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent">
                <PercentCircle className="w-4 h-4 text-accent-foreground" />
                <span className="text-sm">Partial marking enabled</span>
              </div>
            )}
            {!hasNegativeMarking && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
                <Check className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">No negative marking</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sections (only if enabled) */}
      {hasSections && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Sections ({sections.length})</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => goToStep(3)}
                className="h-10 sm:h-8 text-xs min-w-[60px]"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {sections.map((section, index) => (
              <div 
                key={section.id} 
                className={cn(
                  "p-3 rounded-lg bg-muted/50",
                  index > 0 && "mt-2"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{section.name}</span>
                    {section.isOptional && (
                      <Badge variant="outline" className="text-xs">Optional</Badge>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Questions: </span>
                    <span className="font-medium">
                      {section.isOptional && section.attemptLimit 
                        ? `${section.attemptLimit}/${section.questionCount}` 
                        : section.questionCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Marks: </span>
                    <span className="font-medium">
                      {hasUniformMarking ? defaultMarksPerQuestion : section.marksPerQuestion}
                    </span>
                  </div>
                  {section.negativeMarks > 0 && (
                    <div>
                      <span className="text-muted-foreground">Negative: </span>
                      <span className="font-medium text-destructive">−{section.negativeMarks}</span>
                    </div>
                  )}
                  {hasSectionWiseTime && section.timeLimit && (
                    <div>
                      <span className="text-muted-foreground">Time: </span>
                      <span className="font-medium">{section.timeLimit} min</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {section.questionTypes.map(type => (
                    <span 
                      key={type} 
                      className="text-[10px] px-1.5 py-0.5 rounded bg-background text-muted-foreground"
                    >
                      {questionTypeLabels[type]}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-4 border-t pb-20 sm:pb-0">
        <Button variant="outline" onClick={onBack} disabled={isProcessing} className="h-11 sm:h-10">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={onSave} disabled={isProcessing} className="h-11 sm:h-10">
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              {isEditing ? "Update Pattern" : "Save Pattern"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
