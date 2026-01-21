import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Award, Minus, PercentCircle } from "lucide-react";
import { SectionDraft } from "@/hooks/usePatternBuilder";

interface MarkingStepProps {
  sections: SectionDraft[];
  hasUniformMarking: boolean;
  setHasUniformMarking: (value: boolean) => void;
  defaultMarksPerQuestion: number;
  setDefaultMarksPerQuestion: (marks: number) => void;
  hasNegativeMarking: boolean;
  setHasNegativeMarking: (value: boolean) => void;
  defaultNegativeMarks: number;
  setDefaultNegativeMarks: (marks: number) => void;
  hasPartialMarking: boolean;
  setHasPartialMarking: (value: boolean) => void;
  canProceed: boolean;
  onNext: () => void;
  onBack: () => void;
}

export function MarkingStep({
  sections,
  hasUniformMarking,
  setHasUniformMarking,
  defaultMarksPerQuestion,
  setDefaultMarksPerQuestion,
  hasNegativeMarking,
  setHasNegativeMarking,
  defaultNegativeMarks,
  setDefaultNegativeMarks,
  hasPartialMarking,
  setHasPartialMarking,
  canProceed,
  onNext,
  onBack,
}: MarkingStepProps) {
  // Calculate totals
  const totalQuestions = sections.reduce((total, section) => {
    if (section.isOptional && section.attemptLimit) {
      return total + section.attemptLimit;
    }
    return total + section.questionCount;
  }, 0);

  const totalMarks = sections.reduce((total, section) => {
    const marks = hasUniformMarking ? defaultMarksPerQuestion : section.marksPerQuestion;
    const count = section.isOptional && section.attemptLimit 
      ? section.attemptLimit 
      : section.questionCount;
    return total + (count * marks);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Marking Scheme</h2>
        <p className="text-sm text-muted-foreground">
          Configure marks, negative marking, and partial credit
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold">{totalQuestions}</p>
            <p className="text-sm text-muted-foreground">Total Questions</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold">{totalMarks}</p>
            <p className="text-sm text-muted-foreground">Total Marks</p>
          </CardContent>
        </Card>
      </div>

      {/* Uniform Marking */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <div>
                <Label htmlFor="uniform-marking" className="text-base">Uniform Marking</Label>
                <p className="text-sm text-muted-foreground">
                  Same marks for all questions across sections
                </p>
              </div>
            </div>
            <Switch
              id="uniform-marking"
              checked={hasUniformMarking}
              onCheckedChange={setHasUniformMarking}
            />
          </div>

          {hasUniformMarking && (
            <div className="mt-4 pt-4 border-t">
              <div className="space-y-2">
                <Label>Marks per Question</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    value={defaultMarksPerQuestion}
                    onChange={(e) => setDefaultMarksPerQuestion(parseFloat(e.target.value) || 1)}
                    className="w-24 text-center text-lg font-semibold"
                    min={0.5}
                    step={0.5}
                  />
                  <span className="text-muted-foreground">marks</span>
                </div>
              </div>
            </div>
          )}

          {!hasUniformMarking && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Individual section marks are configured in the Sections step.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Negative Marking */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <Minus className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <Label htmlFor="negative-marking" className="text-base">Negative Marking</Label>
                <p className="text-sm text-muted-foreground">
                  Deduct marks for wrong answers
                </p>
              </div>
            </div>
            <Switch
              id="negative-marking"
              checked={hasNegativeMarking}
              onCheckedChange={setHasNegativeMarking}
            />
          </div>

          {hasNegativeMarking && (
            <div className="mt-4 pt-4 border-t">
              <div className="space-y-2">
                <Label>Negative Marks per Wrong Answer</Label>
                <div className="flex items-center gap-3">
                  <span className="text-destructive font-semibold">−</span>
                  <Input
                    type="number"
                    value={defaultNegativeMarks}
                    onChange={(e) => setDefaultNegativeMarks(parseFloat(e.target.value) || 0)}
                    className="w-24 text-center text-lg font-semibold"
                    min={0}
                    step={0.25}
                  />
                  <span className="text-muted-foreground">marks</span>
                </div>
              </div>
              
              {/* Common presets */}
              <div className="flex flex-wrap gap-2 mt-3">
                {[0.25, 0.33, 0.5, 1].map((preset) => (
                  <Button
                    key={preset}
                    type="button"
                    variant={defaultNegativeMarks === preset ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDefaultNegativeMarks(preset)}
                    className="h-10 sm:h-9 min-w-[50px]"
                  >
                    −{preset}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Partial Marking */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent">
                <PercentCircle className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <Label htmlFor="partial-marking" className="text-base">Partial Marking</Label>
                <p className="text-sm text-muted-foreground">
                  Award partial credit for multiple correct answers
                </p>
              </div>
            </div>
            <Switch
              id="partial-marking"
              checked={hasPartialMarking}
              onCheckedChange={setHasPartialMarking}
            />
          </div>

          {hasPartialMarking && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                For questions with multiple correct options, students get proportional 
                marks based on correct selections. Individual section partial marking 
                settings can be configured in the Sections step.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info */}
      <div className="p-4 rounded-lg bg-muted/50 border">
        <h4 className="font-medium text-sm mb-2">💡 Marking Tips</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• JEE Main uses +4/−1 for MCQs, +4/0 for numerical</li>
          <li>• JEE Advanced uses partial marking for multiple correct questions</li>
          <li>• NEET uses +4/−1 across all questions</li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-4 border-t pb-20 sm:pb-0">
        <Button variant="outline" onClick={onBack} className="h-11 sm:h-10">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={onNext} disabled={!canProceed} className="h-11 sm:h-10">
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
