import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  Check,
  X,
  CheckCircle2,
  XCircle,
  Sparkles,
  RefreshCw,
  Calculator,
  Image,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { AddedQuestion, AIConfig } from "@/hooks/useExamCreationNew";
import { QuestionType, questionTypeLabels } from "@/data/examPatternsData";

// Mock AI-generated questions for preview
const generateMockAIQuestions = (
  subjects: string[],
  config: AIConfig,
  count: number = 10
): GeneratedQuestion[] => {
  const questions: GeneratedQuestion[] = [];
  const difficulties = ["easy", "medium", "hard"] as const;
  const types: QuestionType[] = ["single_correct", "multiple_correct", "numerical", "integer", "assertion_reasoning"];
  
  const sampleQuestions = [
    { text: "If $f(x) = x^3 - 3x^2 + 2x$, find the critical points.", subject: "mathematics", hasMath: true },
    { text: "A particle moves in a circle of radius $r$ with constant speed $v$. Calculate the centripetal acceleration.", subject: "physics", hasMath: true },
    { text: "The hybridization of carbon in ethene ($C_2H_4$) is:", subject: "chemistry", hasMath: true },
    { text: "Which organelle is responsible for ATP synthesis in eukaryotic cells?", subject: "biology", hasMath: false },
    { text: "Evaluate: $\\int_0^{\\pi/2} \\sin^2(x) dx$", subject: "mathematics", hasMath: true },
    { text: "**Assertion (A):** Light travels faster in vacuum than in any medium.\n\n**Reason (R):** Refractive index of vacuum is 1.", subject: "physics", hasMath: false },
    { text: "Which of the following are properties of ionic compounds? (Select all that apply)", subject: "chemistry", hasMath: false },
    { text: "The process by which plants convert light energy to chemical energy is called:", subject: "biology", hasMath: false },
    { text: "Find the value of $\\lim_{x \\to 0} \\frac{\\sin x}{x}$", subject: "mathematics", hasMath: true },
    { text: "A body is thrown vertically upward with velocity $u$. The time taken to reach maximum height is:", subject: "physics", hasMath: true },
    { text: "Balance the equation: $MnO_4^- + Fe^{2+} \\rightarrow Mn^{2+} + Fe^{3+}$ in acidic medium", subject: "chemistry", hasMath: true },
    { text: "The double helix model of DNA was proposed by:", subject: "biology", hasMath: false },
  ];

  for (let i = 0; i < count; i++) {
    const template = sampleQuestions[i % sampleQuestions.length];
    const validSubject = subjects.includes(template.subject) ? template.subject : subjects[0];
    
    // Distribute difficulties based on config
    let difficulty: "easy" | "medium" | "hard";
    const rand = Math.random() * 100;
    if (rand < config.easy) difficulty = "easy";
    else if (rand < config.easy + config.medium) difficulty = "medium";
    else difficulty = "hard";

    questions.push({
      id: `ai_${Date.now()}_${i}`,
      text: template.text,
      type: types[Math.floor(Math.random() * types.length)],
      subject: validSubject,
      difficulty,
      cognitiveType: config.cognitiveTypes[Math.floor(Math.random() * config.cognitiveTypes.length)] || "conceptual",
      marks: difficulty === "hard" ? 4 : difficulty === "medium" ? 3 : 2,
      hasMath: template.hasMath,
      status: "pending",
    });
  }

  return questions;
};

interface GeneratedQuestion extends Omit<AddedQuestion, "source"> {
  hasMath?: boolean;
  hasImage?: boolean;
  status: "pending" | "accepted" | "rejected";
}

interface AIGenerationPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subjects: string[];
  aiConfig: AIConfig;
  onAcceptQuestions: (questions: AddedQuestion[]) => void;
  sectionId?: string;
}

const difficultyColors = {
  easy: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-rose-100 text-rose-700",
};

export function AIGenerationPreview({
  open,
  onOpenChange,
  subjects,
  aiConfig,
  onAcceptQuestions,
  sectionId,
}: AIGenerationPreviewProps) {
  const isMobile = useIsMobile();
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);

  // Stats
  const stats = useMemo(() => {
    const accepted = questions.filter((q) => q.status === "accepted").length;
    const rejected = questions.filter((q) => q.status === "rejected").length;
    const pending = questions.filter((q) => q.status === "pending").length;
    return { accepted, rejected, pending, total: questions.length };
  }, [questions]);

  // Generate questions
  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const generated = generateMockAIQuestions(subjects, aiConfig, 8);
    setQuestions(generated);
    setHasGenerated(true);
    setIsGenerating(false);
  };

  // Regenerate all
  const handleRegenerate = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const generated = generateMockAIQuestions(subjects, aiConfig, 8);
    setQuestions(generated);
    setIsGenerating(false);
  };

  // Update question status
  const updateQuestionStatus = (id: string, status: "accepted" | "rejected") => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status } : q))
    );
  };

  // Bulk actions
  const acceptAll = () => {
    setQuestions((prev) =>
      prev.map((q) => (q.status === "pending" ? { ...q, status: "accepted" } : q))
    );
  };

  const rejectAll = () => {
    setQuestions((prev) =>
      prev.map((q) => (q.status === "pending" ? { ...q, status: "rejected" } : q))
    );
  };

  // Confirm and add accepted questions
  const handleConfirm = () => {
    const acceptedQuestions: AddedQuestion[] = questions
      .filter((q) => q.status === "accepted")
      .map((q) => ({
        id: q.id,
        text: q.text,
        type: q.type,
        subject: q.subject,
        difficulty: q.difficulty,
        cognitiveType: q.cognitiveType,
        marks: q.marks,
        source: "ai" as const,
        sectionId,
      }));

    onAcceptQuestions(acceptedQuestions);
    onOpenChange(false);
    // Reset state
    setQuestions([]);
    setHasGenerated(false);
  };

  // Question card renderer
  const renderQuestionCard = (question: GeneratedQuestion, index: number) => {
    const isAccepted = question.status === "accepted";
    const isRejected = question.status === "rejected";

    return (
      <div
        key={question.id}
        className={cn(
          "p-3 border rounded-lg transition-all",
          isAccepted && "border-emerald-300 bg-emerald-50/50",
          isRejected && "border-rose-300 bg-rose-50/50 opacity-60",
          !isAccepted && !isRejected && "bg-card"
        )}
      >
        <div className="flex items-start gap-3">
          {/* Index */}
          <div
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-medium",
              isAccepted && "bg-emerald-500 text-white",
              isRejected && "bg-rose-500 text-white",
              !isAccepted && !isRejected && "bg-muted"
            )}
          >
            {isAccepted ? <Check className="w-3 h-3" /> : isRejected ? <X className="w-3 h-3" /> : index + 1}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm line-clamp-3 mb-2">
              {question.text.replace(/\$[^$]+\$/g, "[formula]").substring(0, 150)}
              {question.text.length > 150 ? "..." : ""}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-1 mb-2">
              <Badge variant="outline" className="text-[9px] capitalize px-1.5">
                {question.subject}
              </Badge>
              <Badge
                className={cn(
                  "text-[9px] px-1.5",
                  difficultyColors[question.difficulty as keyof typeof difficultyColors]
                )}
              >
                {question.difficulty}
              </Badge>
              <Badge variant="secondary" className="text-[9px] px-1.5">
                {questionTypeLabels[question.type]}
              </Badge>
              {question.hasMath && (
                <Badge variant="outline" className="text-[9px] px-1.5 gap-0.5">
                  <Calculator className="w-2.5 h-2.5" />
                </Badge>
              )}
            </div>

            {/* Marks */}
            <span className="text-[10px] text-muted-foreground">
              {question.marks} marks
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-1 shrink-0">
            <Button
              variant={isAccepted ? "default" : "outline"}
              size="sm"
              onClick={() => updateQuestionStatus(question.id, "accepted")}
              className={cn(
                "h-8 w-8 p-0",
                isAccepted && "bg-emerald-500 hover:bg-emerald-600"
              )}
              disabled={isRejected}
            >
              <Check className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant={isRejected ? "default" : "outline"}
              size="sm"
              onClick={() => updateQuestionStatus(question.id, "rejected")}
              className={cn(
                "h-8 w-8 p-0",
                isRejected && "bg-rose-500 hover:bg-rose-600"
              )}
              disabled={isAccepted}
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Content shared between Sheet and Drawer
  const content = (
    <div className="flex flex-col h-full">
      {!hasGenerated ? (
        // Initial state - Generate button
        <div className="flex-1 flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-sm font-medium mb-1">AI Question Generator</h3>
          <p className="text-xs text-muted-foreground text-center mb-4 max-w-[250px]">
            Generate questions based on your difficulty and cognitive type preferences
          </p>
          
          {/* Config summary */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            <Badge variant="outline" className="text-xs">
              Easy: {aiConfig.easy}%
            </Badge>
            <Badge variant="outline" className="text-xs">
              Medium: {aiConfig.medium}%
            </Badge>
            <Badge variant="outline" className="text-xs">
              Hard: {aiConfig.hard}%
            </Badge>
          </div>

          <Button onClick={handleGenerate} disabled={isGenerating} className="gap-2">
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Questions
              </>
            )}
          </Button>
        </div>
      ) : (
        // Generated questions view
        <>
          {/* Stats bar */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg mb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>{stats.accepted} accepted</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <XCircle className="w-3.5 h-3.5 text-rose-500" />
                <span>{stats.rejected} rejected</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {stats.pending} pending
            </div>
          </div>

          {/* Progress */}
          <div className="mb-3">
            <Progress 
              value={(stats.accepted / stats.total) * 100} 
              className="h-1.5 [&>div]:bg-emerald-500" 
            />
          </div>

          {/* Bulk actions */}
          <div className="flex gap-2 mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={acceptAll}
              disabled={stats.pending === 0 || isGenerating}
              className="flex-1 h-9 text-xs gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Accept All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={rejectAll}
              disabled={stats.pending === 0 || isGenerating}
              className="flex-1 h-9 text-xs gap-1"
            >
              <XCircle className="w-3.5 h-3.5" />
              Reject All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="h-9 w-9 p-0"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", isGenerating && "animate-spin")} />
            </Button>
          </div>

          {/* Questions list */}
          <ScrollArea className="flex-1 pr-2">
            <div className="space-y-2">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Regenerating questions...</p>
                </div>
              ) : (
                questions.map((q, i) => renderQuestionCard(q, i))
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={stats.accepted === 0}
              className="flex-1 h-10 gap-1.5"
            >
              <Check className="w-4 h-4" />
              Add {stats.accepted} Questions
            </Button>
          </div>
        </>
      )}
    </div>
  );

  // Mobile: Use Drawer
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="pb-2">
            <DrawerTitle className="flex items-center gap-2 text-base">
              <Sparkles className="w-4 h-4 text-primary" />
              AI Question Generator
            </DrawerTitle>
            <DrawerDescription className="text-xs">
              Review and select questions to add to your exam
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4 flex-1 overflow-hidden flex flex-col" style={{ maxHeight: "calc(90vh - 100px)" }}>
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop: Use Sheet
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            AI Question Generator
          </SheetTitle>
          <SheetDescription>
            Review and select questions to add to your exam
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-hidden flex flex-col mt-4">
          {content}
        </div>
      </SheetContent>
    </Sheet>
  );
}
