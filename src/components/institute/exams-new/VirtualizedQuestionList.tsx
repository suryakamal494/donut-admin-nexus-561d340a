import { useRef, useMemo, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertCircle,
  Image,
  Calculator,
  BookOpen,
  Columns,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AddedQuestion } from "@/hooks/useExamCreationNew";
import { questionTypeLabels } from "@/data/examPatternsData";
import { 
  BankQuestion, 
  Passage,
  groupQuestionsByPassage 
} from "@/data/examQuestionBankData";

interface VirtualizedQuestionListProps {
  questions: BankQuestion[];
  selectedQuestionIds: string[];
  onToggleQuestion: (questionId: string, question: AddedQuestion) => void;
}

type VirtualItem = 
  | { type: "passage-header"; passage: Passage; questionCount: number }
  | { type: "question"; question: BankQuestion; isPassageQuestion?: boolean }
  | { type: "empty" };

const difficultyColors = {
  easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  hard: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

export function VirtualizedQuestionList({
  questions,
  selectedQuestionIds,
  onToggleQuestion,
}: VirtualizedQuestionListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Transform questions into flat virtual items list
  const virtualItems = useMemo<VirtualItem[]>(() => {
    if (questions.length === 0) {
      return [{ type: "empty" }];
    }

    const { standalone, passageGroups } = groupQuestionsByPassage(questions);
    const items: VirtualItem[] = [];

    // Add passage groups first
    passageGroups.forEach(({ passage, questions: passageQuestions }) => {
      // Add passage header
      items.push({ 
        type: "passage-header", 
        passage, 
        questionCount: passageQuestions.length 
      });
      // Add passage questions
      passageQuestions.forEach((q) => {
        items.push({ type: "question", question: q, isPassageQuestion: true });
      });
    });

    // Add standalone questions
    standalone.forEach((q) => {
      items.push({ type: "question", question: q });
    });

    return items;
  }, [questions]);

  // Estimate size based on item type
  const estimateSize = useCallback((index: number) => {
    const item = virtualItems[index];
    if (!item) return 80;
    
    switch (item.type) {
      case "passage-header":
        return 100; // Passage headers are taller
      case "question":
        return item.isPassageQuestion ? 90 : 95; // Slightly different for passage questions
      case "empty":
        return 120;
      default:
        return 80;
    }
  }, [virtualItems]);

  const virtualizer = useVirtualizer({
    count: virtualItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize,
    overscan: 5,
    gap: 8,
  });

  const handleToggle = useCallback((question: BankQuestion) => {
    onToggleQuestion(question.id, {
      id: question.id,
      text: question.text,
      type: question.type,
      subject: question.subject,
      difficulty: question.difficulty,
      cognitiveType: question.cognitiveType,
      marks: question.marks || 4,
      source: "bank",
    });
  }, [onToggleQuestion]);

  // Render passage header
  const renderPassageHeader = (passage: Passage, questionCount: number) => (
    <div className="border rounded-lg overflow-hidden bg-muted/30">
      <div className="bg-muted/50 p-2.5 sm:p-3">
        <div className="flex items-center gap-2 mb-1.5">
          <BookOpen className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs sm:text-sm font-medium">Passage-Based Questions</span>
          <Badge variant="secondary" className="text-[9px] ml-auto">
            {questionCount} questions
          </Badge>
          <Badge variant="outline" className="text-[9px] capitalize">
            {passage.subject}
          </Badge>
        </div>
        <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2">
          {passage.text.replace(/\$[^$]+\$/g, '[formula]').replace(/\[Image:[^\]]+\]/g, '[diagram]').substring(0, 180)}...
        </p>
        <div className="flex gap-1 mt-1.5">
          {passage.hasMath && (
            <Badge variant="outline" className="text-[8px] px-1 gap-0.5">
              <Calculator className="w-2 h-2" />
              Math
            </Badge>
          )}
          {passage.hasImage && (
            <Badge variant="outline" className="text-[8px] px-1 gap-0.5">
              <Image className="w-2 h-2" />
              Diagram
            </Badge>
          )}
        </div>
      </div>
    </div>
  );

  // Render question card
  const renderQuestionCard = (question: BankQuestion, isPassageQuestion?: boolean) => {
    const isSelected = selectedQuestionIds.includes(question.id);

    return (
      <Card
        className={cn(
          "cursor-pointer transition-all",
          isSelected ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "hover:border-primary/50",
          isPassageQuestion && "ml-2 sm:ml-3 border-l-2 border-l-primary/30"
        )}
        onClick={() => handleToggle(question)}
      >
        <CardContent className="p-2.5 sm:p-3">
          <div className="flex items-start gap-2 sm:gap-3">
            <Checkbox checked={isSelected} className="mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              {/* Question text */}
              <p className="text-xs sm:text-sm line-clamp-2">
                {question.text.replace(/\$[^$]+\$/g, '[formula]').substring(0, 150)}
                {question.text.length > 150 ? '...' : ''}
              </p>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-1.5 sm:mt-2">
                <Badge variant="outline" className="text-[9px] sm:text-[10px] capitalize px-1 sm:px-1.5">
                  {question.subject}
                </Badge>
                <Badge className={cn("text-[9px] sm:text-[10px] px-1 sm:px-1.5", difficultyColors[question.difficulty])}>
                  {question.difficulty}
                </Badge>
                <Badge variant="secondary" className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 hidden sm:inline-flex">
                  {questionTypeLabels[question.type]}
                </Badge>
                
                {/* Content indicators */}
                {question.hasMath && (
                  <Badge variant="outline" className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 gap-0.5">
                    <Calculator className="w-2.5 h-2.5" />
                    <span className="hidden sm:inline">Math</span>
                  </Badge>
                )}
                {question.hasImage && (
                  <Badge variant="outline" className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 gap-0.5">
                    <Image className="w-2.5 h-2.5" />
                    <span className="hidden sm:inline">Image</span>
                  </Badge>
                )}
                {question.type === "match_the_following" && (
                  <Badge variant="outline" className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 gap-0.5">
                    <Columns className="w-2.5 h-2.5" />
                    <span className="hidden sm:inline">Matrix</span>
                  </Badge>
                )}
                {question.type === "multiple_correct" && (
                  <Badge variant="outline" className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 gap-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span className="hidden sm:inline">Multi</span>
                  </Badge>
                )}
                {question.type === "assertion_reasoning" && (
                  <Badge variant="outline" className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 gap-0.5">
                    <HelpCircle className="w-2.5 h-2.5" />
                    <span className="hidden sm:inline">A&R</span>
                  </Badge>
                )}
              </div>
              
              {/* Chapter & Marks */}
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[10px] text-muted-foreground truncate max-w-[150px]">
                  {question.chapter}
                </span>
                <span className="text-[10px] font-medium text-muted-foreground">
                  {question.marks} marks
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render empty state
  const renderEmpty = () => (
    <div className="text-center py-6 sm:py-8 text-muted-foreground">
      <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-50" />
      <p className="text-xs sm:text-sm">No questions found</p>
      <p className="text-[10px] sm:text-xs mt-1">Try adjusting your filters</p>
    </div>
  );

  return (
    <div
      ref={parentRef}
      className="h-[320px] sm:h-[400px] overflow-auto pr-2"
      style={{ contain: "strict" }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const item = virtualItems[virtualRow.index];
          if (!item) return null;

          return (
            <div
              key={virtualRow.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {item.type === "passage-header" && renderPassageHeader(item.passage, item.questionCount)}
              {item.type === "question" && renderQuestionCard(item.question, item.isPassageQuestion)}
              {item.type === "empty" && renderEmpty()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
