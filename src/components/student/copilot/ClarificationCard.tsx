// ClarificationCard — agent asks 1-3 clarifying questions before generating artifacts
import React, { useState } from "react";
import { MessageCircleQuestion, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ClarificationContent } from "./types";

interface Props {
  content: ClarificationContent;
  onSubmit: (answers: Record<string, string | string[]>) => void;
  disabled?: boolean;
}

const ClarificationCard: React.FC<Props> = ({ content, onSubmit, disabled }) => {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [otherTexts, setOtherTexts] = useState<Record<string, string>>({});

  const toggleOption = (qId: string, value: string, multi?: boolean) => {
    setAnswers((prev) => {
      const current = prev[qId];
      if (multi) {
        const arr = Array.isArray(current) ? [...current] : [];
        const idx = arr.indexOf(value);
        if (idx >= 0) arr.splice(idx, 1);
        else arr.push(value);
        return { ...prev, [qId]: arr };
      }
      return { ...prev, [qId]: value };
    });
  };

  const isSelected = (qId: string, value: string) => {
    const a = answers[qId];
    if (Array.isArray(a)) return a.includes(value);
    return a === value;
  };

  const allAnswered = content.questions.every((q) => {
    const a = answers[q.id];
    if (!a) return false;
    if (Array.isArray(a)) return a.length > 0;
    return a.length > 0;
  });

  const handleSubmit = () => {
    // Merge "other" free-text into answers
    const final: Record<string, string | string[]> = { ...answers };
    for (const q of content.questions) {
      if (isSelected(q.id, "__other__") && otherTexts[q.id]) {
        if (q.multi_select) {
          const arr = Array.isArray(final[q.id]) ? [...(final[q.id] as string[])] : [];
          const idx = arr.indexOf("__other__");
          if (idx >= 0) arr[idx] = otherTexts[q.id];
          final[q.id] = arr;
        } else {
          final[q.id] = otherTexts[q.id];
        }
      }
    }
    onSubmit(final);
  };

  return (
    <div className="rounded-xl border bg-card p-3 sm:p-4 space-y-4 max-w-full">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-donut-coral/10 flex items-center justify-center flex-shrink-0">
          <MessageCircleQuestion className="w-4 h-4 text-donut-coral" />
        </div>
        <div>
          {content.title && <p className="text-sm font-semibold">{content.title}</p>}
          {content.intro && (
            <p className="text-xs text-muted-foreground">{content.intro}</p>
          )}
        </div>
      </div>

      {/* Questions */}
      {content.questions.map((q) => (
        <div key={q.id} className="space-y-2">
          <p className="text-sm font-medium">{q.question}</p>
          <div className="flex flex-wrap gap-2">
            {q.options.map((opt) => (
              <button
                key={opt.value}
                disabled={disabled || content.answered}
                onClick={() => toggleOption(q.id, opt.value, q.multi_select)}
                className={cn(
                  "px-3 py-1.5 rounded-full border text-sm transition-colors min-h-[36px]",
                  isSelected(q.id, opt.value)
                    ? "bg-donut-coral text-white border-donut-coral"
                    : "hover:bg-muted/50",
                  (disabled || content.answered) && "opacity-60 cursor-default"
                )}
              >
                {opt.label}
              </button>
            ))}
            {q.allow_other !== false && (
              <button
                disabled={disabled || content.answered}
                onClick={() => toggleOption(q.id, "__other__", q.multi_select)}
                className={cn(
                  "px-3 py-1.5 rounded-full border text-sm transition-colors min-h-[36px]",
                  isSelected(q.id, "__other__")
                    ? "bg-donut-coral text-white border-donut-coral"
                    : "hover:bg-muted/50",
                  (disabled || content.answered) && "opacity-60 cursor-default"
                )}
              >
                Other
              </button>
            )}
          </div>
          {isSelected(q.id, "__other__") && !content.answered && (
            <Input
              placeholder="Type your answer…"
              value={otherTexts[q.id] ?? ""}
              onChange={(e) =>
                setOtherTexts((prev) => ({ ...prev, [q.id]: e.target.value }))
              }
              className="text-sm h-9"
            />
          )}
        </div>
      ))}

      {/* Submit */}
      {!content.answered && !disabled && (
        <div className="flex justify-end">
          <Button
            size="sm"
            disabled={!allAnswered}
            onClick={handleSubmit}
            className="h-9 gap-1.5 bg-gradient-to-r from-donut-coral to-donut-orange text-white"
          >
            <Send className="w-3.5 h-3.5" /> Continue
          </Button>
        </div>
      )}
    </div>
  );
};

export default React.memo(ClarificationCard);