import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Upload,
  Library,
  Search,
  FileText,
  X,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CreationMethod,
  AIConfig,
  AddedQuestion,
  SectionProgress,
  availableSubjects,
  cognitiveTypes,
} from "@/hooks/useExamCreationNew";
import { ExamPattern, QuestionType, questionTypeLabels } from "@/data/examPatternsData";
import { ProgressTracker } from "../ProgressTracker";

// Mock questions for the bank
const mockBankQuestions = [
  { id: "q1", text: "What is Newton's first law of motion?", type: "single_correct" as QuestionType, subject: "physics", difficulty: "easy", cognitiveType: "conceptual", chapter: "Laws of Motion" },
  { id: "q2", text: "Calculate the acceleration of a 5kg mass with 10N force.", type: "numerical" as QuestionType, subject: "physics", difficulty: "medium", cognitiveType: "numerical", chapter: "Laws of Motion" },
  { id: "q3", text: "Explain the principle of conservation of momentum.", type: "short_answer" as QuestionType, subject: "physics", difficulty: "medium", cognitiveType: "conceptual", chapter: "Laws of Motion" },
  { id: "q4", text: "What is the atomic number of Carbon?", type: "single_correct" as QuestionType, subject: "chemistry", difficulty: "easy", cognitiveType: "memory", chapter: "Periodic Table" },
  { id: "q5", text: "Balance the equation: H2 + O2 → H2O", type: "single_correct" as QuestionType, subject: "chemistry", difficulty: "medium", cognitiveType: "application", chapter: "Chemical Equations" },
  { id: "q6", text: "Solve: x² - 5x + 6 = 0", type: "numerical" as QuestionType, subject: "mathematics", difficulty: "easy", cognitiveType: "numerical", chapter: "Quadratic Equations" },
  { id: "q7", text: "Find the derivative of sin(x)cos(x).", type: "single_correct" as QuestionType, subject: "mathematics", difficulty: "medium", cognitiveType: "application", chapter: "Differentiation" },
  { id: "q8", text: "What is the powerhouse of the cell?", type: "single_correct" as QuestionType, subject: "biology", difficulty: "easy", cognitiveType: "memory", chapter: "Cell Biology" },
  { id: "q9", text: "Describe the process of photosynthesis.", type: "long_answer" as QuestionType, subject: "biology", difficulty: "medium", cognitiveType: "conceptual", chapter: "Plant Physiology" },
  { id: "q10", text: "A projectile is launched at 45°. Find max height if v=20m/s.", type: "numerical" as QuestionType, subject: "physics", difficulty: "hard", cognitiveType: "numerical", chapter: "Projectile Motion" },
];

interface QuestionAdditionStepProps {
  selectedPattern: ExamPattern | null;
  selectedSubjects: string[];
  activeMethod: CreationMethod;
  setActiveMethod: (method: CreationMethod) => void;
  aiConfig: AIConfig;
  adjustDifficulty: (key: "easy" | "medium" | "hard", value: number) => void;
  toggleCognitiveType: (typeId: string) => void;
  addedQuestions: AddedQuestion[];
  selectedBankQuestionIds: string[];
  toggleBankQuestion: (questionId: string, question: AddedQuestion) => void;
  uploadedFiles: File[];
  handleFileUpload: (files: File[]) => void;
  removeFile: (fileName: string) => void;
  isLargeUpload: boolean;
  sectionProgress: SectionProgress[];
  totalQuestionsRequired: number;
  totalQuestionsAdded: number;
  isQuickTest: boolean;
  canProceed: boolean;
  onNext: () => void;
  onBack: () => void;
}

export function QuestionAdditionStep({
  selectedPattern,
  selectedSubjects,
  activeMethod,
  setActiveMethod,
  aiConfig,
  adjustDifficulty,
  toggleCognitiveType,
  addedQuestions,
  selectedBankQuestionIds,
  toggleBankQuestion,
  uploadedFiles,
  handleFileUpload,
  removeFile,
  isLargeUpload,
  sectionProgress,
  totalQuestionsRequired,
  totalQuestionsAdded,
  isQuickTest,
  canProceed,
  onNext,
  onBack,
}: QuestionAdditionStepProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);
  const [showMobileProgress, setShowMobileProgress] = useState(false);

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return mockBankQuestions.filter(q => {
      if (!selectedSubjects.includes(q.subject)) return false;
      if (searchQuery && !q.text.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (difficultyFilter && q.difficulty !== difficultyFilter) return false;
      if (subjectFilter && q.subject !== subjectFilter) return false;
      return true;
    });
  }, [selectedSubjects, searchQuery, difficultyFilter, subjectFilter]);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type === "application/pdf");
    if (files.length > 0) handleFileUpload(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) handleFileUpload(files);
  };

  const difficultyColors = {
    easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg sm:text-xl font-semibold">Add Questions</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Build your exam using AI, Question Bank, or PDF uploads
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1fr,280px]">
        {/* Main Content */}
        <div className="space-y-3 sm:space-y-4">
          {/* Method Tabs */}
          <Tabs value={activeMethod} onValueChange={(v) => setActiveMethod(v as CreationMethod)}>
            <TabsList className="grid grid-cols-3 w-full h-9 sm:h-10">
              <TabsTrigger value="ai" className="gap-1 sm:gap-1.5 text-[10px] sm:text-sm px-1 sm:px-3">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">AI Generate</span>
                <span className="sm:hidden">AI</span>
              </TabsTrigger>
              <TabsTrigger value="bank" className="gap-1 sm:gap-1.5 text-[10px] sm:text-sm px-1 sm:px-3">
                <Library className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Question Bank</span>
                <span className="sm:hidden">Bank</span>
              </TabsTrigger>
              <TabsTrigger value="pdf" className="gap-1 sm:gap-1.5 text-[10px] sm:text-sm px-1 sm:px-3">
                <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Upload PDF</span>
                <span className="sm:hidden">PDF</span>
              </TabsTrigger>
            </TabsList>

            {/* AI Tab */}
            <TabsContent value="ai" className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
              <Card>
                <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
                  <CardTitle className="text-xs sm:text-sm">Difficulty Distribution</CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4">
                  {(["easy", "medium", "hard"] as const).map((level) => (
                    <div key={level} className="space-y-1.5 sm:space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="capitalize text-xs sm:text-sm">{level}</Label>
                        <span className="text-xs sm:text-sm font-medium">{aiConfig[level]}%</span>
                      </div>
                      <Slider
                        value={[aiConfig[level]]}
                        onValueChange={([value]) => adjustDifficulty(level, value)}
                        max={100}
                        step={5}
                        className="touch-none"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
                  <CardTitle className="text-xs sm:text-sm">Cognitive Types</CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {cognitiveTypes.map((type) => {
                      const isSelected = aiConfig.cognitiveTypes.includes(type.id);
                      return (
                        <button
                          key={type.id}
                          onClick={() => toggleCognitiveType(type.id)}
                          className={cn(
                            "px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium transition-all min-h-[32px] sm:min-h-[36px]",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted hover:bg-muted/80 text-muted-foreground"
                          )}
                        >
                          {type.name}
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full gap-2 h-9 sm:h-10 text-xs sm:text-sm">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Generate Questions
              </Button>
            </TabsContent>

            {/* Question Bank Tab */}
            <TabsContent value="bank" className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 sm:h-10 text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={subjectFilter || ""}
                    onChange={(e) => setSubjectFilter(e.target.value || null)}
                    className="h-9 sm:h-10 px-2 sm:px-3 rounded-md border bg-background text-xs sm:text-sm flex-1 sm:flex-none"
                  >
                    <option value="">All Subjects</option>
                    {selectedSubjects.map((s) => (
                      <option key={s} value={s}>
                        {availableSubjects.find((sub) => sub.id === s)?.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={difficultyFilter || ""}
                    onChange={(e) => setDifficultyFilter(e.target.value || null)}
                    className="h-9 sm:h-10 px-2 sm:px-3 rounded-md border bg-background text-xs sm:text-sm flex-1 sm:flex-none"
                  >
                    <option value="">All Levels</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* Questions List */}
              <ScrollArea className="h-[280px] sm:h-[350px] pr-2">
                <div className="space-y-2">
                  {filteredQuestions.map((question) => {
                    const isSelected = selectedBankQuestionIds.includes(question.id);

                    return (
                      <Card
                        key={question.id}
                        className={cn(
                          "cursor-pointer transition-all",
                          isSelected ? "border-primary bg-primary/5" : "hover:border-primary/50"
                        )}
                        onClick={() =>
                          toggleBankQuestion(question.id, {
                            id: question.id,
                            text: question.text,
                            type: question.type,
                            subject: question.subject,
                            difficulty: question.difficulty,
                            cognitiveType: question.cognitiveType,
                            marks: 4,
                            source: "bank",
                          })
                        }
                      >
                        <CardContent className="p-2.5 sm:p-3">
                          <div className="flex items-start gap-2 sm:gap-3">
                            <Checkbox checked={isSelected} className="mt-0.5 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm line-clamp-2">{question.text}</p>
                              <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-1.5 sm:mt-2">
                                <Badge variant="outline" className="text-[9px] sm:text-[10px] capitalize px-1 sm:px-1.5">
                                  {question.subject}
                                </Badge>
                                <Badge className={cn("text-[9px] sm:text-[10px] px-1 sm:px-1.5", difficultyColors[question.difficulty as keyof typeof difficultyColors])}>
                                  {question.difficulty}
                                </Badge>
                                <Badge variant="secondary" className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 hidden sm:inline-flex">
                                  {questionTypeLabels[question.type]}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}

                  {filteredQuestions.length === 0 && (
                    <div className="text-center py-6 sm:py-8 text-muted-foreground">
                      <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-xs sm:text-sm">No questions found</p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="text-xs sm:text-sm text-muted-foreground">
                {selectedBankQuestionIds.length} question{selectedBankQuestionIds.length !== 1 ? "s" : ""} selected
              </div>
            </TabsContent>

            {/* PDF Tab */}
            <TabsContent value="pdf" className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                className="border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-colors hover:border-primary/50"
              >
                <Upload className="w-8 h-8 sm:w-10 sm:h-10 mx-auto text-muted-foreground mb-2 sm:mb-3" />
                <p className="text-xs sm:text-sm font-medium mb-0.5 sm:mb-1">Drop PDF files here</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 sm:mb-3">or click to browse</p>
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                  id="pdf-upload"
                />
                <Button variant="outline" size="sm" asChild className="h-8 sm:h-9 text-xs sm:text-sm">
                  <label htmlFor="pdf-upload" className="cursor-pointer">
                    Browse Files
                  </label>
                </Button>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.name}
                      className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-muted/50 gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
                        <span className="text-xs sm:text-sm truncate">{file.name}</span>
                        <span className="text-[10px] sm:text-xs text-muted-foreground shrink-0">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.name)}
                        className="h-7 w-7 sm:h-8 sm:w-8 p-0 shrink-0"
                      >
                        <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  ))}

                  {isLargeUpload && (
                    <div className="p-2.5 sm:p-3 rounded-lg bg-primary/10 text-xs sm:text-sm">
                      <p className="font-medium mb-0.5 sm:mb-1">Large upload detected</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        Processing may take a few minutes.
                      </p>
                    </div>
                  )}

                  <Button className="w-full gap-2 h-9 sm:h-10 text-xs sm:text-sm">
                    <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Process PDFs
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Progress Tracker Sidebar - Desktop */}
        <div className="hidden lg:block">
          <ProgressTracker
            sectionProgress={sectionProgress}
            totalRequired={totalQuestionsRequired}
            totalAdded={totalQuestionsAdded}
            isQuickTest={isQuickTest}
          />
        </div>
      </div>

      {/* Mobile Progress Summary - Expandable */}
      <div className="lg:hidden">
        <button
          onClick={() => setShowMobileProgress(!showMobileProgress)}
          className="w-full p-3 sm:p-4 rounded-lg bg-muted/50 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-medium">Progress</span>
            <Badge variant={totalQuestionsAdded >= totalQuestionsRequired ? "default" : "secondary"} className="text-[10px] sm:text-xs">
              {totalQuestionsAdded}/{totalQuestionsRequired}
            </Badge>
          </div>
          {showMobileProgress ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        
        {showMobileProgress && (
          <div className="mt-2">
            <ProgressTracker
              sectionProgress={sectionProgress}
              totalRequired={totalQuestionsRequired}
              totalAdded={totalQuestionsAdded}
              isQuickTest={isQuickTest}
            />
          </div>
        )}
      </div>

      {/* Warning if below requirement */}
      {totalQuestionsAdded < totalQuestionsRequired && totalQuestionsAdded > 0 && (
        <div className="flex items-start gap-2 p-2.5 sm:p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400">
          <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 shrink-0" />
          <p className="text-[10px] sm:text-xs">
            You need {totalQuestionsRequired - totalQuestionsAdded} more questions
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