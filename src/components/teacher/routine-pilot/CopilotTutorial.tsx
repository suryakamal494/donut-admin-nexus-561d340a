import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const LS_COUNT = "copilot.tutorial.shownCount";
const LS_SKIPPED = "copilot.tutorial.skipped";
const MAX_SHOWS = 5;

interface Step {
  title: string;
  body: string;
  align: "left-top" | "left-list" | "center-bottom" | "right" | "top-left";
}

const STEPS: Step[] = [
  {
    title: "1. Pick a batch",
    body: "Everything you do here — chats, tests, homework — is scoped to the batch you select at the top-left.",
    align: "left-top",
  },
  {
    title: "2. Choose a routine",
    body: "Routines are what Copilot can do for you: Lesson Prep, Test Creation, Homework, and more.",
    align: "left-list",
  },
  {
    title: "3. Just type",
    body: "Describe what you want in plain English. Use the suggestion chips above the box for quick starts.",
    align: "center-bottom",
  },
  {
    title: "4. Artifacts live here",
    body: "Anything Copilot builds — tests, slide decks, homework sets — appears in the Artifacts panel on the right.",
    align: "right",
  },
  {
    title: "5. Exit anytime",
    body: "Press Esc or use ← Exit Copilot at the top-left to return to your previous screen.",
    align: "top-left",
  },
];

interface Props {
  onDone: () => void;
}

export default function CopilotTutorial({ onDone }: Props) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Increment shown count on first mount of this session
    const curr = parseInt(window.localStorage.getItem(LS_COUNT) || "0", 10);
    window.localStorage.setItem(LS_COUNT, String(curr + 1));
  }, []);

  const finish = (skipped: boolean) => {
    if (skipped) window.localStorage.setItem(LS_SKIPPED, "1");
    onDone();
  };

  const s = STEPS[step];

  // Position the bubble based on which UI element it's pointing to
  const bubblePosition: Record<Step["align"], string> = {
    "left-top": "top-20 left-4 md:left-[280px]",
    "left-list": "top-44 left-4 md:left-[280px]",
    "center-bottom": "bottom-28 left-1/2 -translate-x-1/2",
    "right": "top-1/3 right-4 md:right-[420px]",
    "top-left": "top-16 left-4",
  };

  return (
    <div
      className="fixed inset-0 z-[80] bg-background/40 backdrop-blur-[1px] animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Copilot tutorial"
      onClick={() => finish(false)}
    >
      <div
        className={`absolute ${bubblePosition[s.align]} max-w-[300px] w-[calc(100vw-2rem)] rounded-xl border bg-card shadow-2xl p-4 animate-in zoom-in-95`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-semibold">{s.title}</h3>
          <button
            type="button"
            onClick={() => finish(true)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Skip tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mb-4">{s.body}</p>
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => finish(true)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip tour
          </button>
          <div className="flex items-center gap-1">
            {step > 0 && (
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-xs"
                onClick={() => setStep((v) => v - 1)}
              >
                <ChevronLeft className="w-3.5 h-3.5 mr-0.5" />
                Back
              </Button>
            )}
            {step < STEPS.length - 1 ? (
              <Button
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={() => setStep((v) => v + 1)}
              >
                Next
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </Button>
            ) : (
              <Button size="sm" className="h-7 px-3 text-xs" onClick={() => finish(false)}>
                Done
              </Button>
            )}
          </div>
        </div>
        <div className="mt-3 flex gap-1 justify-center">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all ${
                i === step ? "w-4 bg-primary" : "w-1 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function shouldShowTutorial(): boolean {
  if (typeof window === "undefined") return false;
  if (window.localStorage.getItem(LS_SKIPPED) === "1") return false;
  const count = parseInt(window.localStorage.getItem(LS_COUNT) || "0", 10);
  return count < MAX_SHOWS;
}
