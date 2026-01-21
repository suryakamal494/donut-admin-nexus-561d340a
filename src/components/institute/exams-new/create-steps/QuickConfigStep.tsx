import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, ArrowRight, FileQuestion, Clock, Award, AlertCircle } from "lucide-react";
import { QuickTestConfig } from "@/hooks/useExamCreationNew";
import { formatDuration } from "@/data/examPatternsData";

interface QuickConfigStepProps {
  config: QuickTestConfig;
  selectedSubjects: string[];
  updateConfig: (updates: Partial<QuickTestConfig>) => void;
  canProceed: boolean;
  onNext: () => void;
  onBack: () => void;
}

export function QuickConfigStep({
  config,
  selectedSubjects,
  updateConfig,
  canProceed,
  onNext,
  onBack,
}: QuickConfigStepProps) {
  const totalMarks = config.totalQuestions * config.marksPerQuestion;
  const showWarning = config.totalQuestions > 50;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg sm:text-xl font-semibold">Configure Test</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Set up your quick test parameters
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-2.5 sm:p-3 text-center">
            <FileQuestion className="w-4 h-4 sm:w-5 sm:h-5 mx-auto text-primary mb-0.5 sm:mb-1" />
            <p className="text-lg sm:text-xl font-bold">{config.totalQuestions}</p>
            <p className="text-[9px] sm:text-[10px] text-muted-foreground">Questions</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-2.5 sm:p-3 text-center">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 mx-auto text-primary mb-0.5 sm:mb-1" />
            <p className="text-lg sm:text-xl font-bold">{totalMarks}</p>
            <p className="text-[9px] sm:text-[10px] text-muted-foreground">Marks</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-2.5 sm:p-3 text-center">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 mx-auto text-primary mb-0.5 sm:mb-1" />
            <p className="text-lg sm:text-xl font-bold truncate">{formatDuration(config.duration)}</p>
            <p className="text-[9px] sm:text-[10px] text-muted-foreground">Duration</p>
          </CardContent>
        </Card>
      </div>

      {/* Total Questions */}
      <Card>
        <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Total Questions</Label>
            <span className="text-base sm:text-lg font-semibold">{config.totalQuestions}</span>
          </div>
          <Slider
            value={[config.totalQuestions]}
            onValueChange={([value]) => updateConfig({ totalQuestions: value })}
            min={5}
            max={100}
            step={5}
            className="touch-none"
          />
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            ~{Math.ceil(config.totalQuestions / selectedSubjects.length)} questions per subject
          </p>
          
          {showWarning && (
            <div className="flex items-start gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400">
              <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 shrink-0" />
              <p className="text-[10px] sm:text-xs">
                More than 50 questions. Consider using Exam Patterns for better structure.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Duration */}
      <Card>
        <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Duration</Label>
            <span className="text-base sm:text-lg font-semibold">{formatDuration(config.duration)}</span>
          </div>
          <Slider
            value={[config.duration]}
            onValueChange={([value]) => updateConfig({ duration: value })}
            min={10}
            max={180}
            step={5}
            className="touch-none"
          />
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {[15, 30, 45, 60, 90].map((preset) => (
              <Button
                key={preset}
                type="button"
                variant={config.duration === preset ? "default" : "outline"}
                size="sm"
                onClick={() => updateConfig({ duration: preset })}
                className="text-[10px] sm:text-xs h-7 sm:h-8 px-2 sm:px-3 min-w-[40px]"
              >
                {preset}m
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Marks per Question */}
      <Card>
        <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
          <Label className="text-sm">Marks per Question</Label>
          <div className="flex gap-1.5 sm:gap-2">
            {[1, 2, 3, 4, 5].map((marks) => (
              <Button
                key={marks}
                type="button"
                variant={config.marksPerQuestion === marks ? "default" : "outline"}
                size="sm"
                onClick={() => updateConfig({ marksPerQuestion: marks })}
                className="flex-1 h-9 sm:h-10 text-xs sm:text-sm"
              >
                {marks}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Negative Marking */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <Label htmlFor="negative-marking" className="text-sm">Negative Marking</Label>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                Deduct marks for wrong answers
              </p>
            </div>
            <Switch
              id="negative-marking"
              checked={config.hasNegativeMarking}
              onCheckedChange={(checked) => updateConfig({ hasNegativeMarking: checked })}
            />
          </div>
          
          {config.hasNegativeMarking && (
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
              <Label className="text-xs sm:text-sm">Negative marks per wrong answer</Label>
              <div className="flex gap-1.5 sm:gap-2 mt-2">
                {[0.25, 0.5, 1].map((marks) => (
                  <Button
                    key={marks}
                    type="button"
                    variant={config.negativeMarks === marks ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateConfig({ negativeMarks: marks })}
                    className="h-8 sm:h-9 text-xs sm:text-sm px-3 sm:px-4"
                  >
                    −{marks}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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