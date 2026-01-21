import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  FileText,
  Target,
  Minus,
  Percent,
  BookOpen,
  ChevronRight,
  Copy,
  Edit,
  Layers,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import {
  getPatternById,
  getPatternTotalQuestions,
  getPatternTotalMarks,
  formatDuration,
  questionTypeLabels,
  ExamSection,
} from "@/data/examPatternsData";

const categoryConfig = {
  competitive: { label: "Competitive", color: "bg-purple-100 text-purple-700 border-purple-200" },
  board: { label: "Board Exam", color: "bg-blue-100 text-blue-700 border-blue-200" },
  custom: { label: "Custom", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
};

const questionTypeIconMap: Record<string, React.ReactNode> = {
  single_correct: <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />,
  multiple_correct: <Layers className="h-3 w-3 sm:h-4 sm:w-4" />,
  integer: <Target className="h-3 w-3 sm:h-4 sm:w-4" />,
  numerical: <Target className="h-3 w-3 sm:h-4 sm:w-4" />,
  assertion_reasoning: <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4" />,
  paragraph: <FileText className="h-3 w-3 sm:h-4 sm:w-4" />,
  match_the_following: <Layers className="h-3 w-3 sm:h-4 sm:w-4" />,
  fill_in_blanks: <Edit className="h-3 w-3 sm:h-4 sm:w-4" />,
  short_answer: <FileText className="h-3 w-3 sm:h-4 sm:w-4" />,
  long_answer: <FileText className="h-3 w-3 sm:h-4 sm:w-4" />,
  true_false: <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />,
};

function SectionCard({ section, index }: { section: ExamSection; index: number }) {
  return (
    <Card className="border-l-4 border-l-primary/50">
      <CardHeader className="p-3 sm:p-6 pb-2 sm:pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                Section {index + 1}
              </span>
              {section.isOptional && (
                <Badge variant="outline" className="text-[10px] sm:text-xs h-5">
                  Optional
                </Badge>
              )}
            </div>
            <CardTitle className="text-sm sm:text-base line-clamp-1">{section.name}</CardTitle>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xl sm:text-2xl font-bold text-primary">{section.questionCount}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Questions</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0 space-y-3 sm:space-y-4">
        {/* Question Types */}
        <div>
          <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-1.5 sm:mb-2">Question Types</p>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {section.questionTypes.map((type) => (
              <Badge key={type} variant="secondary" className="gap-1 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                {questionTypeIconMap[type]}
                <span className="hidden xs:inline">{questionTypeLabels[type]}</span>
                <span className="xs:hidden">{questionTypeLabels[type].split(' ')[0]}</span>
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Marking Scheme */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <div className="bg-muted/50 rounded-lg p-2 sm:p-2.5 text-center">
            <p className="text-base sm:text-lg font-semibold text-green-600">+{section.marksPerQuestion}</p>
            <p className="text-[9px] sm:text-xs text-muted-foreground">Per Correct</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-2 sm:p-2.5 text-center">
            <p className="text-base sm:text-lg font-semibold text-red-600">
              {section.negativeMarks > 0 ? `-${section.negativeMarks}` : "0"}
            </p>
            <p className="text-[9px] sm:text-xs text-muted-foreground">Negative</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-2 sm:p-2.5 text-center">
            <p className="text-base sm:text-lg font-semibold">
              {section.questionCount * section.marksPerQuestion}
            </p>
            <p className="text-[9px] sm:text-xs text-muted-foreground">Max Marks</p>
          </div>
          {section.timeLimit && (
            <div className="bg-muted/50 rounded-lg p-2 sm:p-2.5 text-center">
              <p className="text-base sm:text-lg font-semibold">{section.timeLimit}</p>
              <p className="text-[9px] sm:text-xs text-muted-foreground">Minutes</p>
            </div>
          )}
        </div>

        {/* Optional Section Details */}
        {section.isOptional && section.attemptLimit && (
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground bg-amber-50 dark:bg-amber-950/20 p-2 sm:p-2.5 rounded-lg">
            <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600 shrink-0" />
            <span>
              Attempt any <strong>{section.attemptLimit}</strong> out of {section.questionCount} questions
            </span>
          </div>
        )}

        {/* Partial Marking */}
        {section.partialMarkingEnabled && (
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-2 sm:p-2.5 rounded-lg">
            <Percent className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 shrink-0" />
            <span>
              Partial marking at <strong>{section.partialMarkingPercent}%</strong>
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function PatternView() {
  const navigate = useNavigate();
  const { patternId } = useParams<{ patternId: string }>();

  const pattern = patternId ? getPatternById(patternId) : undefined;

  if (!pattern) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 px-4">
        <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground" />
        <h2 className="text-lg sm:text-xl font-semibold text-center">Pattern Not Found</h2>
        <p className="text-sm text-muted-foreground text-center">The requested exam pattern could not be found.</p>
        <Button onClick={() => navigate("/institute/exams-new/patterns")}>
          Back to Patterns
        </Button>
      </div>
    );
  }

  const totalQuestions = getPatternTotalQuestions(pattern);
  const totalMarks = getPatternTotalMarks(pattern);
  const category = categoryConfig[pattern.category];

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-8">
      <PageHeader
        title={pattern.name}
        description={pattern.description}
        breadcrumbs={[
          { label: "Exams New", href: "/institute/exams-new" },
          { label: "Patterns", href: "/institute/exams-new/patterns" },
          { label: pattern.name },
        ]}
      />

      {/* Action Bar - Stack on mobile */}
      <div className="flex flex-col gap-3">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <Badge className={`${category.color} border text-[10px] sm:text-xs`}>{category.label}</Badge>
          {pattern.isSystemPreset && (
            <Badge variant="outline" className="gap-1 text-[10px] sm:text-xs">
              <CheckCircle2 className="h-3 w-3" />
              System Preset
            </Badge>
          )}
          {pattern.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px] sm:text-xs">
              {tag}
            </Badge>
          ))}
          {pattern.tags.length > 3 && (
            <Badge variant="secondary" className="text-[10px] sm:text-xs">
              +{pattern.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Action Buttons - Full width on mobile */}
        <div className="flex flex-col sm:flex-row gap-2">
          {!pattern.isSystemPreset && (
            <Button
              variant="outline"
              size="sm"
              className="h-9 sm:h-8 text-xs sm:text-sm"
              onClick={() => navigate(`/institute/exams-new/patterns/${pattern.id}/edit`)}
            >
              <Edit className="h-4 w-4 mr-1.5" />
              Edit Pattern
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="h-9 sm:h-8 text-xs sm:text-sm"
            onClick={() => {/* TODO: Implement duplicate */}}
          >
            <Copy className="h-4 w-4 mr-1.5" />
            Duplicate
          </Button>
          <Button
            size="sm"
            className="h-9 sm:h-8 text-xs sm:text-sm flex-1 sm:flex-none"
            onClick={() => navigate(`/institute/exams-new/create?patternId=${pattern.id}`)}
          >
            Use This Pattern
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:pt-4 sm:pb-4 sm:px-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-lg sm:text-2xl font-bold">{totalQuestions}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Questions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:pt-4 sm:pb-4 sm:px-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
              <div className="min-w-0">
                <p className="text-lg sm:text-2xl font-bold">{totalMarks}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Marks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:pt-4 sm:pb-4 sm:px-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-lg sm:text-2xl font-bold truncate">{formatDuration(pattern.totalDuration)}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Duration</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:pt-4 sm:pb-4 sm:px-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                <Layers className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              </div>
              <div className="min-w-0">
                <p className="text-lg sm:text-2xl font-bold">{pattern.sections.length}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Sections</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subjects */}
      {pattern.hasFixedSubjects && pattern.subjects.length > 0 && (
        <Card>
          <CardHeader className="p-3 sm:p-6 pb-2 sm:pb-3">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Subjects
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {pattern.subjects.map((subject) => (
                <Badge key={subject} variant="outline" className="text-xs sm:text-sm py-0.5 sm:py-1 px-2 sm:px-3">
                  {subject}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Marking Scheme Summary */}
      <Card>
        <CardHeader className="p-3 sm:p-6 pb-2 sm:pb-3">
          <CardTitle className="text-sm sm:text-base">Marking Scheme</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-muted/50 rounded-lg">
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-background flex items-center justify-center shrink-0">
                <Target className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium truncate">
                  {pattern.hasUniformMarking ? "Uniform" : "Variable"} Marking
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                  {pattern.hasUniformMarking
                    ? `${pattern.defaultMarksPerQuestion} marks/question`
                    : "Section-wise marks"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-muted/50 rounded-lg">
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-background flex items-center justify-center shrink-0">
                <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium truncate">
                  {pattern.hasNegativeMarking ? "Negative Marking" : "No Negative"}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                  {pattern.hasNegativeMarking
                    ? `${pattern.defaultNegativeMarks} marks deducted`
                    : "No penalty"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-muted/50 rounded-lg">
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-background flex items-center justify-center shrink-0">
                <Percent className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium truncate">
                  {pattern.hasPartialMarking ? "Partial Marking" : "No Partial"}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                  {pattern.hasPartialMarking ? "Credit for partial" : "Full or zero"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Duration Info */}
      <Card>
        <CardHeader className="p-3 sm:p-6 pb-2 sm:pb-3">
          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Time Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0">
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-6">
            <div>
              <p className="text-[10px] sm:text-sm text-muted-foreground">Total Duration</p>
              <p className="text-base sm:text-lg font-semibold">{formatDuration(pattern.totalDuration)}</p>
            </div>
            <div>
              <p className="text-[10px] sm:text-sm text-muted-foreground">Time Distribution</p>
              <p className="text-base sm:text-lg font-semibold">
                {pattern.hasSectionWiseTime ? "Section-wise" : "Combined"}
              </p>
            </div>
            {pattern.hasSectionWiseTime && (
              <div className="flex-1">
                <p className="text-[10px] sm:text-sm text-muted-foreground mb-1.5 sm:mb-2">Section Breakdown</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {pattern.sections
                    .filter((s) => s.timeLimit)
                    .map((section, idx) => (
                      <Badge key={idx} variant="outline" className="text-[10px] sm:text-xs">
                        {section.name}: {section.timeLimit}m
                      </Badge>
                    ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold">Sections ({pattern.sections.length})</h3>
        <div className="grid gap-3 sm:gap-4">
          {pattern.sections.map((section, index) => (
            <SectionCard key={section.id} section={section} index={index} />
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="text-center sm:text-left">
              <h3 className="font-semibold text-base sm:text-lg">Ready to create an exam?</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Use this pattern to quickly set up your exam
              </p>
            </div>
            <Button
              size="lg"
              className="w-full sm:w-auto h-10 sm:h-11"
              onClick={() => navigate(`/institute/exams-new/create?patternId=${pattern.id}`)}
            >
              Use This Pattern
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}