// Question Review Component
// Full option-level display with green/red color coding, View Solution, question jump strip

import { memo, useState, useMemo, useRef, useCallback } from "react";
import { 
  CheckCircle2, XCircle, MinusCircle, ChevronDown, ChevronUp,
  Clock, BookOpen, Lightbulb, Eye, EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SectionResult } from "@/data/student/testResults";
import { formatDuration, getDifficultyColor, getSubjectColor } from "@/data/student/testResults";
import { questionTypeLabels } from "@/data/student/testQuestions";
import type { EnhancedQuestionResult } from "@/data/student/testResultsGenerator";

interface QuestionReviewProps {
  questions: EnhancedQuestionResult[];
  sections: SectionResult[];
}

type FilterType = "all" | "correct" | "incorrect" | "skipped";

const QuestionReview = memo(function QuestionReview({
  questions,
  sections,
}: QuestionReviewProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [solutionVisible, setSolutionVisible] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const filteredQuestions = useMemo(() => {
    let filtered = questions;
    if (activeSection) {
      filtered = filtered.filter(q => q.sectionId === activeSection);
    }
    switch (filter) {
      case "correct": return filtered.filter(q => q.isCorrect);
      case "incorrect": return filtered.filter(q => q.isAttempted && !q.isCorrect);
      case "skipped": return filtered.filter(q => !q.isAttempted);
      default: return filtered;
    }
  }, [questions, filter, activeSection]);

  const toggleQuestion = useCallback((questionId: string) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) newSet.delete(questionId);
      else newSet.add(questionId);
      return newSet;
    });
  }, []);

  const toggleSolution = useCallback((questionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSolutionVisible(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) newSet.delete(questionId);
      else newSet.add(questionId);
      return newSet;
    });
  }, []);

  const jumpToQuestion = useCallback((questionId: string) => {
    // Ensure it's expanded
    setExpandedQuestions(prev => new Set(prev).add(questionId));
    // Scroll to it
    setTimeout(() => {
      questionRefs.current[questionId]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  }, []);

  const getStatusIcon = (question: EnhancedQuestionResult) => {
    if (question.isCorrect) return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    if (question.isAttempted) return <XCircle className="w-5 h-5 text-red-500" />;
    return <MinusCircle className="w-5 h-5 text-slate-400" />;
  };

  const getStatusBg = (question: EnhancedQuestionResult) => {
    if (question.isCorrect) return "border-l-emerald-500 bg-emerald-50/50";
    if (question.isAttempted) return "border-l-red-500 bg-red-50/50";
    return "border-l-slate-400 bg-slate-50/50";
  };

  const getJumpDotColor = (q: EnhancedQuestionResult) => {
    if (q.isCorrect) return "bg-emerald-500 text-white";
    if (q.isAttempted) return "bg-red-500 text-white";
    return "bg-slate-300 text-slate-600";
  };

  return (
    <div className="space-y-4">
      {/* Question Jump Strip */}
      <div className="bg-white rounded-xl border border-border p-3">
        <p className="text-xs text-muted-foreground mb-2 font-medium">Quick Jump</p>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {questions.map(q => (
            <button
              key={q.id}
              onClick={() => jumpToQuestion(q.id)}
              className={cn(
                "min-w-[32px] h-8 rounded-md text-xs font-bold flex items-center justify-center transition-all shrink-0",
                getJumpDotColor(q),
                "hover:scale-110 active:scale-95"
              )}
              title={`Q.${q.questionNumber} - ${q.isCorrect ? "Correct" : q.isAttempted ? "Wrong" : "Skipped"}`}
            >
              {q.questionNumber}
            </button>
          ))}
        </div>
        <div className="flex gap-3 mt-2 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Correct</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-red-500" /> Wrong</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-slate-300" /> Skipped</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border p-4">
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Question Review
        </h3>

        {/* Section Pills */}
        {sections.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={() => setActiveSection(null)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                !activeSection ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}
            >
              All
            </button>
            {sections.map(section => {
              const colors = getSubjectColor(section.subject);
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(isActive ? null : section.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                    isActive ? colors.bg + " text-white" : colors.light + " " + colors.text
                  )}
                >
                  {section.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg mb-4">
          {([
            { key: "all" as FilterType, label: "All", count: questions.length },
            { key: "correct" as FilterType, label: "✓", count: questions.filter(q => q.isCorrect).length },
            { key: "incorrect" as FilterType, label: "✗", count: questions.filter(q => q.isAttempted && !q.isCorrect).length },
            { key: "skipped" as FilterType, label: "—", count: questions.filter(q => !q.isAttempted).length },
          ]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={cn(
                "flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors",
                filter === tab.key ? "bg-white text-foreground shadow-sm" : "text-muted-foreground"
              )}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Questions List */}
        <div className="space-y-3">
          {filteredQuestions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No questions match the selected filters</p>
          ) : (
            filteredQuestions.map((question, index) => {
              const isExpanded = expandedQuestions.has(question.id);
              const showSolution = solutionVisible.has(question.id);

              return (
                <motion.div
                  key={question.id}
                  ref={(el) => { questionRefs.current[question.id] = el; }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.015 }}
                  className={cn(
                    "border border-border rounded-xl overflow-hidden border-l-4",
                    getStatusBg(question)
                  )}
                >
                  {/* Question Header */}
                  <button
                    onClick={() => toggleQuestion(question.id)}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-muted/30 transition-colors"
                  >
                    {getStatusIcon(question)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-foreground">Q.{question.questionNumber}</span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {questionTypeLabels[question.type]}
                        </Badge>
                        <Badge className={cn("text-[10px] px-1.5 py-0 border-0", getDifficultyColor(question.difficulty))}>
                          {question.difficulty}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{question.text}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={cn(
                        "text-sm font-bold",
                        question.marksObtained > 0 ? "text-emerald-600" :
                        question.marksObtained < 0 ? "text-red-600" : "text-muted-foreground"
                      )}>
                        {question.marksObtained > 0 ? "+" : ""}{question.marksObtained}
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </div>
                  </button>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-3 pt-0 border-t border-border/50 space-y-3">
                          {/* Not Attempted Badge */}
                          {!question.isAttempted && (
                            <div className="mt-3">
                              <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">
                                Not Attempted
                              </Badge>
                            </div>
                          )}

                          {/* Assertion & Reason */}
                          {question.assertionText && (
                            <div className="mt-3 space-y-2">
                              <div className="bg-blue-50 rounded-lg p-3">
                                <p className="text-xs font-semibold text-blue-700 mb-1">Assertion (A)</p>
                                <p className="text-sm text-foreground">{question.assertionText}</p>
                              </div>
                              <div className="bg-purple-50 rounded-lg p-3">
                                <p className="text-xs font-semibold text-purple-700 mb-1">Reason (R)</p>
                                <p className="text-sm text-foreground">{question.reasonText}</p>
                              </div>
                            </div>
                          )}

                          {/* Paragraph */}
                          {question.paragraphText && (
                            <div className="mt-3 bg-slate-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                              <p className="text-xs font-semibold text-slate-600 mb-1">Passage</p>
                              <p className="text-sm text-foreground leading-relaxed">{question.paragraphText}</p>
                            </div>
                          )}

                          {/* Full Question Text */}
                          <div className="bg-muted/50 rounded-lg p-3 mt-3">
                            <p className="text-sm text-foreground leading-relaxed">{question.text}</p>
                          </div>

                          {/* Option-Level Display for MCQ types */}
                          {question.options && question.options.length > 0 && (
                            <OptionDisplay
                              options={question.options}
                              userAnswer={question.userAnswer}
                              isAttempted={question.isAttempted}
                              isMultiple={question.type === "mcq_multiple"}
                            />
                          )}

                          {/* Integer/Numerical Display */}
                          {question.type === "integer" && (
                            <IntegerDisplay
                              userAnswer={question.userAnswer as number | undefined}
                              correctAnswer={question.correctAnswer as number}
                              isAttempted={question.isAttempted}
                              isCorrect={question.isCorrect}
                            />
                          )}

                          {/* Fill in Blank Display */}
                          {question.type === "fill_blank" && (
                            <FillBlankDisplay
                              userAnswer={question.userAnswer as Record<string, string> | undefined}
                              correctAnswer={question.correctAnswer as Record<string, string>}
                              isAttempted={question.isAttempted}
                            />
                          )}

                          {/* Matrix Match Display */}
                          {question.type === "matrix_match" && (
                            <MatrixMatchDisplay
                              userAnswer={question.userAnswer as Record<string, string> | undefined}
                              correctAnswer={question.correctAnswer as Record<string, string>}
                              isAttempted={question.isAttempted}
                            />
                          )}

                          {/* Meta Info */}
                          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDuration(question.timeSpent)}
                            </span>
                            <span>
                              Marks: {question.marksObtained}/{question.maxMarks}
                              {question.negativeMarks > 0 && ` (−${question.negativeMarks})`}
                            </span>
                          </div>

                          {/* View Solution */}
                          {question.solution && (
                            <div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => toggleSolution(question.id, e)}
                                className="w-full justify-center gap-2 text-primary hover:text-primary hover:bg-primary/5"
                              >
                                <Lightbulb className="w-4 h-4" />
                                {showSolution ? "Hide Solution" : "View Solution"}
                                {showSolution ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </Button>
                              <AnimatePresence>
                                {showSolution && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-1">
                                      <p className="text-xs font-semibold text-amber-700 mb-1 flex items-center gap-1">
                                        <Lightbulb className="w-3.5 h-3.5" /> Solution
                                      </p>
                                      <p className="text-sm text-foreground leading-relaxed">{question.solution}</p>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
});

// ============ Sub-components ============

// MCQ Option Display with green/red color coding
function OptionDisplay({
  options,
  userAnswer,
  isAttempted,
  isMultiple,
}: {
  options: { id: string; text: string; isCorrect: boolean }[];
  userAnswer?: string | string[] | number | Record<string, string>;
  isAttempted: boolean;
  isMultiple: boolean;
}) {
  const isSelected = (optId: string) => {
    if (!userAnswer) return false;
    if (isMultiple && Array.isArray(userAnswer)) return userAnswer.includes(optId);
    return userAnswer === optId;
  };

  const optionLabels = ["A", "B", "C", "D", "E", "F"];

  return (
    <div className="space-y-2">
      {options.map((opt, idx) => {
        const selected = isSelected(opt.id);
        const correct = opt.isCorrect;

        // Determine styling
        let borderClass = "border-border bg-white";
        let iconNode: React.ReactNode = null;

        if (selected && correct) {
          // Student selected + correct = green
          borderClass = "border-emerald-500 bg-emerald-50";
          iconNode = <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
        } else if (selected && !correct) {
          // Student selected + wrong = red
          borderClass = "border-red-500 bg-red-50";
          iconNode = <XCircle className="w-4 h-4 text-red-600 shrink-0" />;
        } else if (!selected && correct) {
          // Correct answer not selected = green outline
          borderClass = "border-emerald-500 bg-emerald-50/30";
          iconNode = <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
        }

        return (
          <div
            key={opt.id}
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg border-2 transition-all",
              borderClass
            )}
          >
            <span className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
              selected && correct ? "bg-emerald-500 text-white" :
              selected && !correct ? "bg-red-500 text-white" :
              !selected && correct ? "bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500" :
              "bg-muted text-muted-foreground"
            )}>
              {optionLabels[idx]}
            </span>
            <p className="text-sm text-foreground flex-1 pt-1">{opt.text}</p>
            {iconNode}
          </div>
        );
      })}
    </div>
  );
}

// Integer/Numerical Display
function IntegerDisplay({
  userAnswer,
  correctAnswer,
  isAttempted,
  isCorrect,
}: {
  userAnswer?: number;
  correctAnswer: number;
  isAttempted: boolean;
  isCorrect: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className={cn(
        "p-3 rounded-lg border-2",
        isAttempted
          ? isCorrect ? "bg-emerald-50 border-emerald-500" : "bg-red-50 border-red-500"
          : "bg-slate-50 border-slate-200"
      )}>
        <p className="text-xs text-muted-foreground mb-1">Your Answer</p>
        <p className={cn(
          "font-bold text-lg",
          isCorrect ? "text-emerald-600" : isAttempted ? "text-red-600" : "text-slate-400"
        )}>
          {isAttempted ? userAnswer : "—"}
        </p>
      </div>
      <div className="p-3 rounded-lg bg-emerald-50 border-2 border-emerald-500">
        <p className="text-xs text-muted-foreground mb-1">Correct Answer</p>
        <p className="font-bold text-lg text-emerald-600">{correctAnswer}</p>
      </div>
    </div>
  );
}

// Fill in Blank Display
function FillBlankDisplay({
  userAnswer,
  correctAnswer,
  isAttempted,
}: {
  userAnswer?: Record<string, string>;
  correctAnswer: Record<string, string>;
  isAttempted: boolean;
}) {
  return (
    <div className="space-y-2">
      {Object.entries(correctAnswer).map(([blankId, correct], idx) => {
        const userVal = userAnswer?.[blankId];
        const isRight = userVal?.toLowerCase() === correct.toLowerCase();
        return (
          <div key={blankId} className="flex items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground w-16">Blank {idx + 1}</span>
            <div className={cn(
              "flex-1 p-2 rounded border-2 text-sm",
              isAttempted
                ? isRight ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "bg-red-50 border-red-500 text-red-700"
                : "bg-slate-50 border-slate-200 text-slate-400"
            )}>
              {isAttempted ? userVal || "—" : "—"}
            </div>
            <div className="flex-1 p-2 rounded border-2 bg-emerald-50 border-emerald-500 text-sm text-emerald-700">
              {correct}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Matrix Match Display
function MatrixMatchDisplay({
  userAnswer,
  correctAnswer,
  isAttempted,
}: {
  userAnswer?: Record<string, string>;
  correctAnswer: Record<string, string>;
  isAttempted: boolean;
}) {
  return (
    <div className="space-y-2">
      {Object.entries(correctAnswer).map(([rowId, correctCol]) => {
        const userCol = userAnswer?.[rowId];
        const isRight = userCol === correctCol;
        return (
          <div key={rowId} className="flex items-center gap-2 text-sm">
            <span className="font-medium text-foreground w-16">{rowId}</span>
            <span className="text-muted-foreground">→</span>
            <span className={cn(
              "px-2 py-1 rounded border",
              isAttempted
                ? isRight ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "bg-red-50 border-red-500 text-red-700"
                : "bg-slate-50 border-slate-200 text-slate-400"
            )}>
              {isAttempted ? userCol || "—" : "—"}
            </span>
            {!isRight && (
              <>
                <span className="text-muted-foreground">✓</span>
                <span className="px-2 py-1 rounded border bg-emerald-50 border-emerald-500 text-emerald-700">{correctCol}</span>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default QuestionReview;
