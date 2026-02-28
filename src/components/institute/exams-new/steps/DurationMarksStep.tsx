import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Award,
  Minus,
  PercentCircle,
  LayoutGrid,
  BookOpen,
  Calculator,
} from "lucide-react";
import { formatDuration } from "@/data/examPatternsData";
import { availableSubjects } from "@/hooks/usePatternBuilder";

interface DurationMarksStepProps {
  // Duration
  totalDuration: number;
  setTotalDuration: (duration: number) => void;
  hasSectionWiseTime: boolean;
  setHasSectionWiseTime: (value: boolean) => void;
  // Marking
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
  // Per-subject questions
  hasFixedSubjects: boolean;
  subjects: string[];
  subjectQuestionCounts: Record<string, number>;
  setSubjectQuestionCount: (subjectId: string, count: number) => void;
  // Sections toggle
  hasSections: boolean;
  setHasSections: (value: boolean) => void;
  // Computed
  totalQuestions: number;
  totalMarks: number;
  // Navigation
  canProceed: boolean;
  onNext: () => void;
  onBack: () => void;
}

const durationPresets = [30, 45, 60, 90, 120, 180, 200];

export function DurationMarksStep({
  totalDuration,
  setTotalDuration,
  hasSectionWiseTime,
  setHasSectionWiseTime,
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
  hasFixedSubjects,
  subjects,
  subjectQuestionCounts,
  setSubjectQuestionCount,
  hasSections,
  setHasSections,
  totalQuestions,
  totalMarks,
  canProceed,
  onNext,
  onBack,
}: DurationMarksStepProps) {
  const getSubjectName = (id: string) =>
    availableSubjects.find((s) => s.id === id)?.name || id;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Duration & Marks</h2>
        <p className="text-sm text-muted-foreground">
          Set duration, marking scheme, and question counts
        </p>
      </div>

      {/* ========== DURATION ========== */}
      <Card>
        <CardContent className="p-4 sm:p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-bold">{formatDuration(totalDuration)}</p>
              <p className="text-sm text-muted-foreground">Total Duration</p>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Adjust Duration (10 – 240 minutes)</Label>
            <Slider
              value={[totalDuration]}
              onValueChange={([value]) => setTotalDuration(value)}
              min={10}
              max={240}
              step={5}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Quick Select</Label>
            <div className="flex flex-wrap gap-2">
              {durationPresets.map((preset) => (
                <Button
                  key={preset}
                  type="button"
                  variant={totalDuration === preset ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTotalDuration(preset)}
                  className="min-w-[70px] h-10 sm:h-9"
                >
                  {formatDuration(preset)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section-wise Time */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="section-time" className="text-base">
                Section-wise Time Limits
              </Label>
              <p className="text-sm text-muted-foreground">
                Allow individual time limits for each section
              </p>
            </div>
            <Switch
              id="section-time"
              checked={hasSectionWiseTime}
              onCheckedChange={setHasSectionWiseTime}
            />
          </div>
        </CardContent>
      </Card>

      {/* ========== MARKING SCHEME ========== */}

      {/* Uniform Marking */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <div>
                <Label htmlFor="uniform-marking" className="text-base">
                  Uniform Marking
                </Label>
                <p className="text-sm text-muted-foreground">
                  Same marks for all questions
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
                    onChange={(e) =>
                      setDefaultMarksPerQuestion(parseFloat(e.target.value) || 1)
                    }
                    className="w-24 text-center text-lg font-semibold"
                    min={0.5}
                    step={0.5}
                  />
                  <span className="text-muted-foreground">marks</span>
                </div>
              </div>
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
                <Label htmlFor="negative-marking" className="text-base">
                  Negative Marking
                </Label>
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
                    onChange={(e) =>
                      setDefaultNegativeMarks(parseFloat(e.target.value) || 0)
                    }
                    className="w-24 text-center text-lg font-semibold"
                    min={0}
                    step={0.25}
                  />
                  <span className="text-muted-foreground">marks</span>
                </div>
              </div>

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
                <Label htmlFor="partial-marking" className="text-base">
                  Partial Marking
                </Label>
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
        </CardContent>
      </Card>

      {/* ========== QUESTIONS PER SUBJECT ========== */}
      {hasFixedSubjects && subjects.length > 0 && (
        <Card>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Questions per Subject</p>
                <p className="text-sm text-muted-foreground">
                  Enter the number of questions for each subject
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {subjects.map((subjectId) => (
                <div
                  key={subjectId}
                  className="flex items-center justify-between gap-4 p-3 rounded-lg bg-muted/50"
                >
                  <Label className="text-sm font-medium min-w-0 truncate">
                    {getSubjectName(subjectId)}
                  </Label>
                  <Input
                    type="number"
                    value={subjectQuestionCounts[subjectId] || ""}
                    onChange={(e) =>
                      setSubjectQuestionCount(
                        subjectId,
                        parseInt(e.target.value) || 0
                      )
                    }
                    placeholder="0"
                    className="w-24 text-center"
                    min={0}
                  />
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <Calculator className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-xl font-bold">{totalQuestions}</p>
                  <p className="text-xs text-muted-foreground">Total Questions</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <Award className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-xl font-bold">{totalMarks}</p>
                  <p className="text-xs text-muted-foreground">Total Marks</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ========== SECTION-WISE EXAM TOGGLE ========== */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <LayoutGrid className="w-5 h-5 text-primary" />
              </div>
              <div>
                <Label htmlFor="enable-sections" className="text-base">
                  Section-wise Examination
                </Label>
                <p className="text-sm text-muted-foreground">
                  Divide questions into sections with different types
                </p>
              </div>
            </div>
            <Switch
              id="enable-sections"
              checked={hasSections}
              onCheckedChange={setHasSections}
            />
          </div>

          {hasSections && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                You'll configure sections (e.g., Section A: MCQs, Section B: Numerical)
                in the next step. The same section structure applies to all subjects.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <div className="p-4 rounded-lg bg-muted/50 border">
        <h4 className="font-medium text-sm mb-2">💡 Tips</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• JEE Main: 180 min, +4/−1, 25 questions per subject</li>
          <li>• NEET: 200 min, +4/−1, 45 questions per subject</li>
          <li>• JEE Advanced: 180 min, sections with different question types</li>
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
