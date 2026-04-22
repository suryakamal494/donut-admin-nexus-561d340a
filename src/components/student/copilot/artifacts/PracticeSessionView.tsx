import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, RotateCcw, Dumbbell } from "lucide-react";
import MathMarkdown from "../MathMarkdown";

interface MCQOption {
  label: string;
  text: string;
}

interface Question {
  id: string;
  type: "mcq" | "short" | "integer" | "true_false";
  question: string;
  options?: MCQOption[];
  correct_answer: string;
  explanation?: string;
  topic?: string;
  difficulty?: string;
}

interface PracticeSessionContent {
  title: string;
  subject?: string;
  topic?: string;
  questions: Question[];
}

interface Props {
  content: PracticeSessionContent;
}

export default function PracticeSessionView({ content }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Set<string>>(new Set());

  const setAnswer = (qId: string, val: string) => {
    if (submitted.has(qId)) return;
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const submitAnswer = (qId: string) => {
    setSubmitted((prev) => new Set(prev).add(qId));
  };

  const resetAll = () => {
    setAnswers({});
    setSubmitted(new Set());
  };

  const totalQ = content.questions?.length ?? 0;
  const answeredCount = submitted.size;
  const correctCount = content.questions?.filter(
    (q) => submitted.has(q.id) && answers[q.id]?.toLowerCase().trim() === q.correct_answer.toLowerCase().trim()
  ).length ?? 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm text-foreground">{content.title}</h3>
        </div>
        {answeredCount > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-emerald-600 font-medium">{correctCount}/{answeredCount}</span>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px]" onClick={resetAll}>
              <RotateCcw className="h-3 w-3 mr-1" /> Reset
            </Button>
          </div>
        )}
      </div>

      {/* Score dots */}
      {totalQ > 0 && (
        <div className="flex gap-1 flex-wrap">
          {content.questions.map((q, i) => {
            const isSubmitted = submitted.has(q.id);
            const isCorrect = isSubmitted && answers[q.id]?.toLowerCase().trim() === q.correct_answer.toLowerCase().trim();
            return (
              <div
                key={q.id}
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-medium border",
                  !isSubmitted && "bg-muted border-border text-muted-foreground",
                  isSubmitted && isCorrect && "bg-emerald-100 border-emerald-500 text-emerald-700",
                  isSubmitted && !isCorrect && "bg-red-100 border-red-500 text-red-700"
                )}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
      )}

      <div className="space-y-3">
        {content.questions?.map((q, qIdx) => {
          const isSubmitted = submitted.has(q.id);
          const isCorrect = isSubmitted && answers[q.id]?.toLowerCase().trim() === q.correct_answer.toLowerCase().trim();

          return (
            <Card key={q.id} className={cn(isSubmitted && isCorrect && "border-emerald-500/30", isSubmitted && !isCorrect && "border-red-500/30")}>
              <CardContent className="p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-xs font-bold text-primary shrink-0">Q{qIdx + 1}</span>
                  <MathMarkdown compact>{q.question}</MathMarkdown>
                </div>

                {q.type === "mcq" && q.options && (
                  <div className="grid gap-1.5 ml-5">
                    {q.options.map((opt) => {
                      const selected = answers[q.id] === opt.label;
                      const isCorrectOpt = isSubmitted && opt.label.toLowerCase() === q.correct_answer.toLowerCase();
                      return (
                        <button
                          key={opt.label}
                          className={cn(
                            "flex items-center gap-2 text-left p-2 rounded-md border text-xs transition-colors",
                            !isSubmitted && selected && "border-primary bg-primary/10",
                            !isSubmitted && !selected && "border-border hover:bg-accent/50",
                            isSubmitted && isCorrectOpt && "border-emerald-500 bg-emerald-50",
                            isSubmitted && selected && !isCorrectOpt && "border-red-500 bg-red-50",
                            isSubmitted && !selected && !isCorrectOpt && "border-border opacity-60"
                          )}
                          onClick={() => setAnswer(q.id, opt.label)}
                          disabled={isSubmitted}
                        >
                          <span className="font-medium text-muted-foreground w-4">{opt.label}.</span>
                          <MathMarkdown compact inline>{opt.text}</MathMarkdown>
                          {isSubmitted && isCorrectOpt && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 ml-auto shrink-0" />}
                          {isSubmitted && selected && !isCorrectOpt && <XCircle className="h-3.5 w-3.5 text-red-600 ml-auto shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}

                {(q.type === "short" || q.type === "integer") && (
                  <div className="ml-5">
                    <input
                      type={q.type === "integer" ? "number" : "text"}
                      className="w-full border rounded-md px-2 py-1.5 text-xs bg-background"
                      placeholder={q.type === "integer" ? "Enter number..." : "Type your answer..."}
                      value={answers[q.id] ?? ""}
                      onChange={(e) => setAnswer(q.id, e.target.value)}
                      disabled={isSubmitted}
                    />
                  </div>
                )}

                {q.type === "true_false" && (
                  <div className="ml-5 flex gap-2">
                    {["True", "False"].map((v) => {
                      const selected = answers[q.id] === v;
                      const isCorrectOpt = isSubmitted && v.toLowerCase() === q.correct_answer.toLowerCase();
                      return (
                        <button
                          key={v}
                          className={cn(
                            "px-4 py-1.5 rounded-md border text-xs font-medium transition-colors",
                            !isSubmitted && selected && "border-primary bg-primary/10",
                            !isSubmitted && !selected && "border-border hover:bg-accent/50",
                            isSubmitted && isCorrectOpt && "border-emerald-500 bg-emerald-50",
                            isSubmitted && selected && !isCorrectOpt && "border-red-500 bg-red-50"
                          )}
                          onClick={() => setAnswer(q.id, v)}
                          disabled={isSubmitted}
                        >
                          {v}
                        </button>
                      );
                    })}
                  </div>
                )}

                {!isSubmitted && answers[q.id] && (
                  <div className="ml-5">
                    <Button size="sm" className="h-7 text-xs" onClick={() => submitAnswer(q.id)}>
                      Check Answer
                    </Button>
                  </div>
                )}

                {isSubmitted && (
                  <div className={cn("ml-5 p-2 rounded text-xs", isCorrect ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800")}>
                    <div className="flex items-center gap-1 font-medium mb-0.5">
                      {isCorrect ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                      {isCorrect ? "Correct!" : `Incorrect — Answer: ${q.correct_answer}`}
                    </div>
                    {q.explanation && <MathMarkdown compact className="text-xs mt-1">{q.explanation}</MathMarkdown>}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}