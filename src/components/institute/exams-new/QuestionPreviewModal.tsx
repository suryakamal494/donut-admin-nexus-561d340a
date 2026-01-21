import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Check,
  X,
  Calculator,
  Image as ImageIcon,
  BookOpen,
  Columns,
  CheckCircle2,
  HelpCircle,
  Hash,
  ListChecks,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { BankQuestion, getPassageById } from "@/data/examQuestionBankData";
import { questionTypeLabels } from "@/data/examPatternsData";

interface QuestionPreviewModalProps {
  question: BankQuestion | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

const difficultyColors = {
  easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  hard: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

const cognitiveColors: Record<string, string> = {
  logical: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  analytical: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  conceptual: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  numerical: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  application: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  memory: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

// Simple LaTeX renderer - replaces common patterns with styled spans
const renderLatex = (text: string): React.ReactNode => {
  // Split by LaTeX delimiters
  const parts = text.split(/(\$[^$]+\$)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('$') && part.endsWith('$')) {
      // This is a LaTeX formula
      const formula = part.slice(1, -1);
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 mx-0.5 rounded bg-muted font-mono text-sm text-primary"
        >
          {formula}
        </code>
      );
    }
    // Handle newlines in regular text
    return part.split('\n').map((line, lineIndex) => (
      <span key={`${index}-${lineIndex}`}>
        {lineIndex > 0 && <br />}
        {line}
      </span>
    ));
  });
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "single_correct":
      return <CheckCircle2 className="w-4 h-4" />;
    case "multiple_correct":
      return <ListChecks className="w-4 h-4" />;
    case "numerical":
    case "integer":
      return <Hash className="w-4 h-4" />;
    case "assertion_reasoning":
      return <HelpCircle className="w-4 h-4" />;
    case "match_the_following":
      return <Columns className="w-4 h-4" />;
    case "paragraph":
      return <FileText className="w-4 h-4" />;
    default:
      return <CheckCircle2 className="w-4 h-4" />;
  }
};

export function QuestionPreviewModal({
  question,
  open,
  onOpenChange,
  isSelected,
  onToggleSelect,
}: QuestionPreviewModalProps) {
  const isMobile = useIsMobile();

  // Get passage if question is part of one
  const passage = useMemo(() => {
    if (question?.isPartOfPassage && question.passageId) {
      return getPassageById(question.passageId);
    }
    return null;
  }, [question]);

  if (!question) return null;

  const content = (
    <ScrollArea className="max-h-[70vh] pr-2">
      <div className="space-y-4 pb-4">
        {/* Metadata badges */}
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline" className="gap-1 capitalize">
            {getTypeIcon(question.type)}
            {questionTypeLabels[question.type]}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {question.subject}
          </Badge>
          <Badge className={cn("capitalize", difficultyColors[question.difficulty])}>
            {question.difficulty}
          </Badge>
          <Badge className={cn("capitalize", cognitiveColors[question.cognitiveType] || "bg-muted")}>
            {question.cognitiveType}
          </Badge>
          <Badge variant="secondary">
            {question.marks} marks
          </Badge>
        </div>

        {/* Content indicators */}
        <div className="flex flex-wrap gap-2">
          {question.hasMath && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calculator className="w-3.5 h-3.5" />
              <span>Contains formulas</span>
            </div>
          )}
          {question.hasImage && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Contains image</span>
            </div>
          )}
          {question.isPartOfPassage && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Passage-based</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Passage content if applicable */}
        {passage && (
          <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <BookOpen className="w-4 h-4 text-primary" />
              <span>Related Passage</span>
              <Badge variant="outline" className="text-[10px] ml-auto">
                {passage.chapter}
              </Badge>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {renderLatex(passage.text)}
            </p>
          </div>
        )}

        {/* Question text */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Question</h4>
          <div className="text-sm sm:text-base leading-relaxed">
            {renderLatex(question.text)}
          </div>
        </div>

        {/* Image placeholder */}
        {question.hasImage && (
          <div className="rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/30 p-6 text-center">
            <ImageIcon className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-xs text-muted-foreground">Question diagram/image</p>
          </div>
        )}

        {/* Options for MCQ types */}
        {question.options && question.options.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Options</h4>
            <div className="space-y-2">
              {question.options.map((option, index) => {
                const isCorrect = Array.isArray(question.correctAnswer)
                  ? question.correctAnswer.includes(option.id)
                  : question.correctAnswer === option.id;
                
                return (
                  <div
                    key={option.id}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border transition-colors",
                      isCorrect
                        ? "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30"
                        : "border-border bg-card"
                    )}
                  >
                    <span
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium shrink-0",
                        isCorrect
                          ? "bg-emerald-500 text-white"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {String.fromCharCode(65 + index)}
                    </span>
                    <div className="flex-1 text-sm">
                      {renderLatex(option.text)}
                    </div>
                    {isCorrect && (
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Matrix Match */}
        {question.type === "match_the_following" && question.matrixLeft && question.matrixRight && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Match the Following</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground mb-2">Column I</p>
                {question.matrixLeft.map((item, index) => (
                  <div key={index} className="p-2 rounded bg-muted/50 text-sm">
                    {renderLatex(item)}
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground mb-2">Column II</p>
                {question.matrixRight.map((item, index) => (
                  <div key={index} className="p-2 rounded bg-muted/50 text-sm">
                    {renderLatex(item)}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Correct matching */}
            {question.correctAnswer && (
              <div className="mt-3 p-3 rounded-lg border border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30">
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-2">
                  <Check className="w-4 h-4" />
                  Correct Matching
                </div>
                <p className="text-sm">
                  {Array.isArray(question.correctAnswer)
                    ? question.correctAnswer.join(", ")
                    : question.correctAnswer}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Numerical/Integer answer */}
        {(question.type === "numerical" || question.type === "integer") && question.correctAnswer !== undefined && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Correct Answer</h4>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30">
              <Check className="w-4 h-4 text-emerald-500" />
              <span className="text-lg font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                {question.correctAnswer}
              </span>
            </div>
          </div>
        )}

        {/* Chapter info */}
        <div className="pt-2">
          <p className="text-xs text-muted-foreground">
            Chapter: <span className="font-medium">{question.chapter}</span>
          </p>
        </div>
      </div>
    </ScrollArea>
  );

  const footer = onToggleSelect && (
    <div className="flex gap-2 pt-4 border-t">
      <Button
        variant="outline"
        onClick={() => onOpenChange(false)}
        className="flex-1"
      >
        Close
      </Button>
      <Button
        onClick={() => {
          onToggleSelect();
          onOpenChange(false);
        }}
        variant={isSelected ? "destructive" : "default"}
        className="flex-1 gap-2"
      >
        {isSelected ? (
          <>
            <X className="w-4 h-4" />
            Remove
          </>
        ) : (
          <>
            <Check className="w-4 h-4" />
            Add to Exam
          </>
        )}
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="pb-2">
            <DrawerTitle className="text-base">Question Preview</DrawerTitle>
            <DrawerDescription className="text-xs">
              ID: {question.id}
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4">
            {content}
            {footer}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Question Preview</DialogTitle>
          <DialogDescription>
            ID: {question.id}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          {content}
        </div>
        {footer}
      </DialogContent>
    </Dialog>
  );
}
