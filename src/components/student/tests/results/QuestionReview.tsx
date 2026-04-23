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
import { OptionDisplay } from "./review/OptionDisplay";
import { IntegerDisplay } from "./review/IntegerDisplay";
import { FillBlankDisplay } from "./review/FillBlankDisplay";
import { MatrixMatchDisplay } from "./review/MatrixMatchDisplay";
import { WrongAnswerVideoButton } from "./WrongAnswerVideoButton";
import { VideoPlayerModal } from "./VideoPlayerModal";
import { getVideoForQuestionNumber } from "@/data/student/videoExplanations";

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
  const [videoModal, setVideoModal] = useState<{ open: boolean; url: string; title: string }>({ open: false, url: "", title: "" });
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
    setExpandedQuestions(prev => new Set(prev).add(questionId));
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
                          {!question.isAttempted && (
                            <div className="mt-3">
                              <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">
                                Not Attempted
                              </Badge>
                            </div>
                          )}

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

                          {question.paragraphText && (
                            <div className="mt-3 bg-slate-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                              <p className="text-xs font-semibold text-slate-600 mb-1">Passage</p>
                              <p className="text-sm text-foreground leading-relaxed">{question.paragraphText}</p>
                            </div>
                          )}

                          <div className="bg-muted/50 rounded-lg p-3 mt-3">
                            <p className="text-sm text-foreground leading-relaxed">{question.text}</p>
                          </div>

                          {question.options && question.options.length > 0 && (
                            <OptionDisplay
                              options={question.options}
                              userAnswer={question.userAnswer}
                              isAttempted={question.isAttempted}
                              isMultiple={question.type === "mcq_multiple"}
                            />
                          )}

                          {question.type === "integer" && (
                            <IntegerDisplay
                              userAnswer={question.userAnswer as number | undefined}
                              correctAnswer={question.correctAnswer as number}
                              isAttempted={question.isAttempted}
                              isCorrect={question.isCorrect}
                            />
                          )}

                          {question.type === "fill_blank" && (
                            <FillBlankDisplay
                              userAnswer={question.userAnswer as Record<string, string> | undefined}
                              correctAnswer={question.correctAnswer as Record<string, string>}
                              isAttempted={question.isAttempted}
                            />
                          )}

                          {question.type === "matrix_match" && (
                            <MatrixMatchDisplay
                              userAnswer={question.userAnswer as Record<string, string> | undefined}
                              correctAnswer={question.correctAnswer as Record<string, string>}
                              isAttempted={question.isAttempted}
                            />
                          )}

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

                          {question.solution && (
                            <div>
                              {/* Video explanation button for wrong answers */}
                              {!question.isCorrect && (() => {
                                const video = getVideoForQuestionNumber(question.questionNumber);
                                return video ? (
                                  <div className="mb-2 flex justify-center">
                                    <WrongAnswerVideoButton
                                      duration={video.duration}
                                      onClick={() => setVideoModal({ open: true, url: video.videoUrl, title: `Q${question.questionNumber} — ${video.chapter}` })}
                                    />
                                  </div>
                                ) : null;
                              })()}
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

export default QuestionReview;
