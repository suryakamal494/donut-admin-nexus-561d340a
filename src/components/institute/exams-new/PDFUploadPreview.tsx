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
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import {
  Check,
  X,
  CheckCircle2,
  XCircle,
  FileText,
  RefreshCw,
  Calculator,
  Image,
  Loader2,
  Upload,
  AlertTriangle,
  FileWarning,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { AddedQuestion } from "@/hooks/useExamCreationNew";
import { QuestionType, questionTypeLabels } from "@/data/examPatternsData";

// Mock extracted questions from PDF
const generateMockPDFQuestions = (
  files: File[],
  subjects: string[]
): ExtractedQuestion[] => {
  const questions: ExtractedQuestion[] = [];
  const difficulties = ["easy", "medium", "hard"] as const;
  const types: QuestionType[] = ["single_correct", "multiple_correct", "numerical", "integer"];
  const cognitiveTypes = ["logical", "conceptual", "analytical", "application"];

  const sampleQuestions = [
    { text: "A train travels 120 km in 2 hours. What is its average speed?", subject: "physics", hasMath: false, confidence: 0.95 },
    { text: "If $x^2 + 5x + 6 = 0$, find the roots of the equation.", subject: "mathematics", hasMath: true, confidence: 0.88 },
    { text: "Which of the following is a noble gas? (A) Oxygen (B) Nitrogen (C) Helium (D) Hydrogen", subject: "chemistry", hasMath: false, confidence: 0.92 },
    { text: "The powerhouse of the cell is called:", subject: "biology", hasMath: false, confidence: 0.97 },
    { text: "Calculate the area of a circle with radius $r = 7$ cm. Use $\\pi = 22/7$.", subject: "mathematics", hasMath: true, confidence: 0.91 },
    { text: "A body of mass 5 kg is moving with velocity 10 m/s. Calculate its kinetic energy.", subject: "physics", hasMath: true, confidence: 0.89 },
    { text: "Balance the chemical equation: $H_2 + O_2 \\rightarrow H_2O$", subject: "chemistry", hasMath: true, confidence: 0.85 },
    { text: "Name the process by which amoeba obtains food.", subject: "biology", hasMath: false, confidence: 0.94 },
    { text: "[Partially extracted] The resistance of a conductor is... [Text unclear]", subject: "physics", hasMath: false, confidence: 0.45, hasWarning: true },
    { text: "Find the derivative of $f(x) = 3x^4 - 2x^2 + 5$", subject: "mathematics", hasMath: true, confidence: 0.93 },
    { text: "Which vitamin is synthesized by skin in presence of sunlight?", subject: "biology", hasMath: false, confidence: 0.96 },
    { text: "Calculate the molarity of a solution containing 58.5g NaCl in 500mL water.", subject: "chemistry", hasMath: true, confidence: 0.87 },
  ];

  // Generate questions based on number of files
  const questionCount = files.length * 5;

  for (let i = 0; i < questionCount; i++) {
    const template = sampleQuestions[i % sampleQuestions.length];
    const validSubject = subjects.includes(template.subject) ? template.subject : subjects[0];
    const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];

    questions.push({
      id: `pdf_${Date.now()}_${i}`,
      text: template.text,
      type: types[Math.floor(Math.random() * types.length)],
      subject: validSubject,
      difficulty,
      cognitiveType: cognitiveTypes[Math.floor(Math.random() * cognitiveTypes.length)],
      marks: difficulty === "hard" ? 4 : difficulty === "medium" ? 3 : 2,
      hasMath: template.hasMath,
      confidence: template.confidence,
      hasWarning: template.hasWarning,
      sourceFile: files[i % files.length].name,
      pageNumber: Math.floor(Math.random() * 10) + 1,
      status: "pending",
    });
  }

  return questions;
};

interface ExtractedQuestion extends Omit<AddedQuestion, "source"> {
  hasMath?: boolean;
  hasImage?: boolean;
  confidence: number;
  hasWarning?: boolean;
  sourceFile: string;
  pageNumber: number;
  status: "pending" | "accepted" | "rejected";
}

interface PDFUploadPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  files: File[];
  subjects: string[];
  onAcceptQuestions: (questions: AddedQuestion[]) => void;
  onClearFiles: () => void;
  sectionId?: string;
}

const difficultyColors = {
  easy: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-rose-100 text-rose-700",
};

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 0.9) return "text-emerald-600";
  if (confidence >= 0.7) return "text-amber-600";
  return "text-rose-600";
};

export function PDFUploadPreview({
  open,
  onOpenChange,
  files,
  subjects,
  onAcceptQuestions,
  onClearFiles,
  sectionId,
}: PDFUploadPreviewProps) {
  const isMobile = useIsMobile();
  const [isProcessing, setIsProcessing] = useState(false);
  const [questions, setQuestions] = useState<ExtractedQuestion[]>([]);
  const [hasProcessed, setHasProcessed] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  // Stats
  const stats = useMemo(() => {
    const accepted = questions.filter((q) => q.status === "accepted").length;
    const rejected = questions.filter((q) => q.status === "rejected").length;
    const pending = questions.filter((q) => q.status === "pending").length;
    const lowConfidence = questions.filter((q) => q.confidence < 0.7).length;
    return { accepted, rejected, pending, total: questions.length, lowConfidence };
  }, [questions]);

  // Process PDFs
  const handleProcess = async () => {
    setIsProcessing(true);
    setProcessingProgress(0);
    
    // Simulate processing progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      setProcessingProgress(i);
    }
    
    const extracted = generateMockPDFQuestions(files, subjects);
    setQuestions(extracted);
    setHasProcessed(true);
    setIsProcessing(false);
  };

  // Reprocess
  const handleReprocess = async () => {
    setIsProcessing(true);
    setProcessingProgress(0);
    
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      setProcessingProgress(i);
    }
    
    const extracted = generateMockPDFQuestions(files, subjects);
    setQuestions(extracted);
    setIsProcessing(false);
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

  const acceptHighConfidence = () => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.status === "pending" && q.confidence >= 0.7 ? { ...q, status: "accepted" } : q
      )
    );
  };

  const rejectAll = () => {
    setQuestions((prev) =>
      prev.map((q) => (q.status === "pending" ? { ...q, status: "rejected" } : q))
    );
  };

  const rejectLowConfidence = () => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.status === "pending" && q.confidence < 0.7 ? { ...q, status: "rejected" } : q
      )
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
        source: "pdf" as const,
        sectionId,
      }));

    onAcceptQuestions(acceptedQuestions);
    onOpenChange(false);
    onClearFiles();
    // Reset state
    setQuestions([]);
    setHasProcessed(false);
  };

  // Question card renderer
  const renderQuestionCard = (question: ExtractedQuestion, index: number) => {
    const isAccepted = question.status === "accepted";
    const isRejected = question.status === "rejected";
    const isLowConfidence = question.confidence < 0.7;

    return (
      <div
        key={question.id}
        className={cn(
          "p-3 border rounded-lg transition-all",
          isAccepted && "border-emerald-300 bg-emerald-50/50",
          isRejected && "border-rose-300 bg-rose-50/50 opacity-60",
          !isAccepted && !isRejected && isLowConfidence && "border-amber-300 bg-amber-50/30",
          !isAccepted && !isRejected && !isLowConfidence && "bg-card"
        )}
      >
        <div className="flex items-start gap-3">
          {/* Index */}
          <div
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-medium",
              isAccepted && "bg-emerald-500 text-white",
              isRejected && "bg-rose-500 text-white",
              !isAccepted && !isRejected && isLowConfidence && "bg-amber-500 text-white",
              !isAccepted && !isRejected && !isLowConfidence && "bg-muted"
            )}
          >
            {isAccepted ? (
              <Check className="w-3 h-3" />
            ) : isRejected ? (
              <X className="w-3 h-3" />
            ) : isLowConfidence ? (
              <AlertTriangle className="w-3 h-3" />
            ) : (
              index + 1
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm line-clamp-3 mb-2">
              {question.text.replace(/\$[^$]+\$/g, "[formula]").substring(0, 150)}
              {question.text.length > 150 ? "..." : ""}
            </p>

            {/* Warning for low confidence */}
            {question.hasWarning && (
              <div className="flex items-center gap-1 text-amber-600 mb-2">
                <FileWarning className="w-3 h-3" />
                <span className="text-[10px]">Extraction may be incomplete</span>
              </div>
            )}

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

            {/* Source & Confidence */}
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-muted-foreground">
                {question.sourceFile} • Page {question.pageNumber}
              </span>
              <span className={cn("font-medium", getConfidenceColor(question.confidence))}>
                {Math.round(question.confidence * 100)}% confidence
              </span>
            </div>
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
      {!hasProcessed ? (
        // Initial state - Process button
        <div className="flex-1 flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-sm font-medium mb-1">PDF Question Extractor</h3>
          <p className="text-xs text-muted-foreground text-center mb-4 max-w-[250px]">
            Extract and review questions from your uploaded PDFs
          </p>

          {/* Files summary */}
          <div className="flex flex-wrap gap-2 justify-center mb-6 max-w-[300px]">
            {files.map((file) => (
              <Badge key={file.name} variant="outline" className="text-xs gap-1">
                <FileText className="w-3 h-3" />
                {file.name.substring(0, 20)}{file.name.length > 20 ? '...' : ''}
              </Badge>
            ))}
          </div>

          {isProcessing ? (
            <div className="w-full max-w-[200px] space-y-2">
              <Progress value={processingProgress} className="h-2" />
              <p className="text-xs text-center text-muted-foreground">
                Processing... {processingProgress}%
              </p>
            </div>
          ) : (
            <Button onClick={handleProcess} className="gap-2">
              <Upload className="w-4 h-4" />
              Process PDFs
            </Button>
          )}
        </div>
      ) : (
        // Processed questions view
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
            <div className="flex items-center gap-2">
              {stats.lowConfidence > 0 && (
                <div className="flex items-center gap-1 text-xs text-amber-600">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{stats.lowConfidence} low conf.</span>
                </div>
              )}
              <span className="text-xs text-muted-foreground">
                {stats.pending} pending
              </span>
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
          <div className="grid grid-cols-2 gap-2 mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={acceptAll}
              disabled={stats.pending === 0 || isProcessing}
              className="h-9 text-xs gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Accept All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={acceptHighConfidence}
              disabled={stats.pending === 0 || isProcessing}
              className="h-9 text-xs gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              Accept High Conf.
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={rejectAll}
              disabled={stats.pending === 0 || isProcessing}
              className="h-9 text-xs gap-1"
            >
              <XCircle className="w-3.5 h-3.5" />
              Reject All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={rejectLowConfidence}
              disabled={stats.pending === 0 || isProcessing}
              className="h-9 text-xs gap-1"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Reject Low Conf.
            </Button>
          </div>

          {/* Reprocess button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReprocess}
            disabled={isProcessing}
            className="mb-3 h-8 text-xs gap-1 w-full"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isProcessing && "animate-spin")} />
            Reprocess PDFs
          </Button>

          {/* Questions list */}
          <ScrollArea className="flex-1 pr-2">
            <div className="space-y-2">
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Reprocessing PDFs...</p>
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
              <FileText className="w-4 h-4 text-primary" />
              PDF Question Extractor
            </DrawerTitle>
            <DrawerDescription className="text-xs">
              Review extracted questions and select which to add
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
            <FileText className="w-4 h-4 text-primary" />
            PDF Question Extractor
          </SheetTitle>
          <SheetDescription>
            Review extracted questions and select which to add
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-hidden flex flex-col mt-4">
          {content}
        </div>
      </SheetContent>
    </Sheet>
  );
}
