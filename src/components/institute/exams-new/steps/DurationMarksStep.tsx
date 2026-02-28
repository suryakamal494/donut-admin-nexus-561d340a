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
  Hash,
  FileQuestion,
} from "lucide-react";
import { formatDuration, questionTypeLabels, QuestionType } from "@/data/examPatternsData";
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
  questionsPerSubject: number;
  setQuestionsPerSubject: (count: number) => void;
  // Total questions (when no fixed subjects)
  totalQuestionCount: number;
  setTotalQuestionCount: (count: number) => void;
  // Sections toggle
  hasSections: boolean;
  setHasSections: (value: boolean) => void;
  // Global question type (when no sections)
  globalQuestionType: QuestionType;
  setGlobalQuestionType: (type: QuestionType) => void;
  // Computed
  totalQuestions: number;
  totalMarks: number;
  // Navigation
  canProceed: boolean;
  onNext: () => void;
  onBack: () => void;
}

const durationPresets = [30, 45, 60, 90, 120, 180, 200];

const selectableQuestionTypes: QuestionType[] = [
  'single_correct',
  'multiple_correct',
  'numerical',
  'integer',
  'true_false',
  'fill_in_blanks',
  'assertion_reasoning',
];

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
  questionsPerSubject,
  setQuestionsPerSubject,
  totalQuestionCount,
  setTotalQuestionCount,
  hasSections,
  setHasSections,
  globalQuestionType,
  setGlobalQuestionType,
  totalQuestions,
  totalMarks,
  canProceed,
  onNext,
  onBack,
}: DurationMarksStepProps) {
  const showPerSubject = hasFixedSubjects && subjects.length > 0;
  const showTotalQuestions = !showPerSubject;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Duration & Marks</h2>
        <p className="text-sm text-muted-foreground">
          Set duration, marking scheme, and question counts
        </p>
      </div>

      {/* ========== 1. DURATION ========== */}
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

      {/* ========== 2. QUESTIONS ========== */}
      {showPerSubject && (
        <Card>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Questions per Subject</p>
                <p className="text-sm text-muted-foreground">
                  Same number of questions for each subject
                </p>
              </div>
            </div>

            <Input
              type="number"
              value={questionsPerSubject || ""}
              onChange={(e) =>
                setQuestionsPerSubject(parseInt(e.target.value) || 0)
              }
              placeholder="e.g. 25"
              className="text-center text-lg font-semibold"
              min={1}
            />

            {questionsPerSubject > 0 && (
              <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                {subjects.length} subject{subjects.length > 1 ? "s" : ""} × {questionsPerSubject} questions = <span className="font-semibold text-foreground">{subjects.length * questionsPerSubject} total questions</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {showTotalQuestions && (
        <Card>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Hash className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Total Questions</p>
                <p className="text-sm text-muted-foreground">
                  Enter the total number of questions in the examination
                </p>
              </div>
            </div>
            <Input
              type="number"
              value={totalQuestionCount || ""}
              onChange={(e) =>
                setTotalQuestionCount(parseInt(e.target.value) || 0)
              }
              placeholder="Enter total questions"
              className="text-center text-lg font-semibold"
              min={1}
            />
          </CardContent>
        </Card>
      )}

      {/* ========== 3. SECTION-WISE EXAM TOGGLE ========== */}
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
                in the next step. Marking is configured per question type in each section.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ========== QUESTION TYPE (only when no sections) ========== */}
      {!hasSections && (
        <Card>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileQuestion className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Question Type</p>
                <p className="text-sm text-muted-foreground">
                  Select the type of questions for this exam
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectableQuestionTypes.map((type) => (
                <Button
                  key={type}
                  type="button"
                  variant={globalQuestionType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setGlobalQuestionType(type)}
                  className="h-10 sm:h-9"
                >
                  {questionTypeLabels[type]}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ========== SECTION-WISE TIME ========== */}
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

      {/* ========== TOTALS SUMMARY ========== */}
      <div className="grid grid-cols-2 gap-3">
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

      {/* ========== MARKING SCHEME (only when no sections) ========== */}
      {!hasSections && (
        <>
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
        </>
      )}

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
