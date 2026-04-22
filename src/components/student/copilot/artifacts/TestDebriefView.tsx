import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, MinusCircle, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import MathMarkdown from "../MathMarkdown";

interface DebriefQuestion {
  question_number: number;
  question_text?: string;
  topic?: string;
  correct: boolean;
  attempted: boolean;
  your_answer?: string;
  correct_answer?: string;
  explanation?: string;
}

interface TestDebriefContent {
  title: string;
  subject?: string;
  total_questions: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  accuracy: number;
  questions: DebriefQuestion[];
  weak_topics?: string[];
  follow_up?: string[];
}

interface Props {
  content: TestDebriefContent;
}

export default function TestDebriefView({ content }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ClipboardList className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm text-foreground">{content.title}</h3>
      </div>

      {/* Score summary */}
      <div className="grid grid-cols-4 gap-2">
        <Card className="bg-primary/5">
          <CardContent className="p-2 text-center">
            <p className="text-[9px] text-muted-foreground">Accuracy</p>
            <p className="text-lg font-bold text-foreground">{content.accuracy}%</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50">
          <CardContent className="p-2 text-center">
            <p className="text-[9px] text-emerald-600">Correct</p>
            <p className="text-lg font-bold text-emerald-700">{content.correct}</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50">
          <CardContent className="p-2 text-center">
            <p className="text-[9px] text-red-600">Wrong</p>
            <p className="text-lg font-bold text-red-700">{content.incorrect}</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/50">
          <CardContent className="p-2 text-center">
            <p className="text-[9px] text-muted-foreground">Skipped</p>
            <p className="text-lg font-bold text-muted-foreground">{content.unattempted}</p>
          </CardContent>
        </Card>
      </div>

      {/* Dot grid */}
      <div className="flex gap-1 flex-wrap">
        {content.questions?.map((q) => (
          <div
            key={q.question_number}
            className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-medium",
              q.correct && "bg-emerald-100 text-emerald-700",
              !q.correct && q.attempted && "bg-red-100 text-red-700",
              !q.attempted && "bg-muted text-muted-foreground"
            )}
          >
            {q.question_number}
          </div>
        ))}
      </div>

      {/* Question details — only incorrect/unattempted */}
      <div className="space-y-2">
        {content.questions?.filter((q) => !q.correct).map((q) => (
          <Card key={q.question_number} className={cn(!q.attempted ? "border-border" : "border-red-500/20")}>
            <CardContent className="p-3 space-y-1.5">
              <div className="flex items-start gap-2">
                {q.attempted ? (
                  <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                ) : (
                  <MinusCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">Q{q.question_number}</span>
                    {q.topic && <span className="text-[9px] bg-accent px-1.5 py-0.5 rounded">{q.topic}</span>}
                  </div>
                  {q.question_text && <MathMarkdown compact className="text-xs mt-1">{q.question_text}</MathMarkdown>}
                </div>
              </div>
              {q.attempted && q.your_answer && (
                <p className="text-[10px] text-red-600 ml-6">Your answer: {q.your_answer}</p>
              )}
              {q.correct_answer && (
                <p className="text-[10px] text-emerald-600 ml-6">Correct: {q.correct_answer}</p>
              )}
              {q.explanation && (
                <div className="ml-6 mt-1 p-2 bg-muted/30 rounded text-xs">
                  <MathMarkdown compact>{q.explanation}</MathMarkdown>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weak topics + follow up */}
      {content.weak_topics && content.weak_topics.length > 0 && (
        <Card className="border-amber-500/20 bg-amber-50/50">
          <CardContent className="p-3">
            <p className="text-xs font-medium text-amber-700 mb-1">Topics to Revise</p>
            <div className="flex flex-wrap gap-1">
              {content.weak_topics.map((t, i) => (
                <span key={i} className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">{t}</span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {content.follow_up && content.follow_up.length > 0 && (
        <Card className="border-primary/10 bg-primary/5">
          <CardContent className="p-3">
            <p className="text-xs font-medium text-primary mb-1">Next Steps</p>
            <ul className="space-y-0.5">
              {content.follow_up.map((f, i) => (
                <li key={i} className="text-[11px] text-muted-foreground">• {f}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}