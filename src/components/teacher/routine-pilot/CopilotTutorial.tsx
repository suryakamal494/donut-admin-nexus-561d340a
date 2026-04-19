import { useEffect, useLayoutEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const LS_COUNT = "copilot.tutorial.shownCount";
const LS_SKIPPED = "copilot.tutorial.skipped";
const MAX_SHOWS = 5;

type Side = "top" | "bottom" | "left" | "right";

interface Step {
  title: string;
  body: string;
  /** CSS selector of the element to anchor on. */
  target: string;
  /** Preferred side relative to the target. */
  side: Side;
  /** Fallback selector if the primary target is not in the DOM. */
  fallback?: string;
}

const STEPS: Step[] = [
  {
    title: "1. Pick a batch",
    body: "Everything you do here — chats, tests, homework — is scoped to the batch you select at the top-left.",
    target: '[data-tour="copilot-batch"]',
    side: "right",
    fallback: '[data-tour="copilot-exit"]',
  },
  {
    title: "2. Choose a routine",
    body: "Routines are what Copilot can do for you: Lesson Prep, Test Creation, Homework, and more.",
    target: '[data-tour="copilot-routines"]',
    side: "right",
    fallback: '[data-tour="copilot-exit"]',
  },
  {
    title: "3. Just type",
    body: "Describe what you want in plain English. Use the suggestion chips above the box for quick starts.",
    target: '[data-tour="copilot-composer"]',
    side: "top",
  },
  {
    title: "4. Artifacts live here",
    body: "Anything Copilot builds — tests, slide decks, homework sets — appears in the Artifacts panel on the right.",
    target: '[data-tour="copilot-artifacts"]',
    side: "left",
    // If the right pane is collapsed, point at the toggle that reopens it.
    fallback: '[data-tour="copilot-toggle-right"], [data-tour="copilot-mobile-artifacts"]',
  },
  {
    title: "5. Exit anytime",
    body: "Press Esc or use ← Exit Copilot at the top-left to return to your previous screen.",
    target: '[data-tour="copilot-exit"]',
    side: "bottom",
  },
];

interface Props {
  onDone: () => void;
}

const BUBBLE_W = 300;
const BUBBLE_H_EST = 180;
const GAP = 12;
const PAD = 12;

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function computeBubblePos(rect: DOMRect | null, side: Side) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  if (!rect) {
    // Center-screen fallback when no anchor exists.
    return {
      left: clamp((vw - BUBBLE_W) / 2, PAD, vw - BUBBLE_W - PAD),
      top: clamp((vh - BUBBLE_H_EST) / 2, PAD, vh - BUBBLE_H_EST - PAD),
    };
  }

  // Decide a side that actually fits in the viewport.
  const fits: Record<Side, boolean> = {
    top: rect.top - GAP - BUBBLE_H_EST >= PAD,
    bottom: vh - rect.bottom - GAP - BUBBLE_H_EST >= PAD,
    left: rect.left - GAP - BUBBLE_W >= PAD,
    right: vw - rect.right - GAP - BUBBLE_W >= PAD,
  };
  const order: Side[] = [side, "bottom", "top", "right", "left"];
  const chosen = order.find((s) => fits[s]) ?? side;

  let left = 0;
  let top = 0;

  switch (chosen) {
    case "top":
      left = rect.left + rect.width / 2 - BUBBLE_W / 2;
      top = rect.top - GAP - BUBBLE_H_EST;
      break;
    case "bottom":
      left = rect.left + rect.width / 2 - BUBBLE_W / 2;
      top = rect.bottom + GAP;
      break;
    case "left":
      left = rect.left - GAP - BUBBLE_W;
      top = rect.top + rect.height / 2 - BUBBLE_H_EST / 2;
      break;
    case "right":
      left = rect.right + GAP;
      top = rect.top + rect.height / 2 - BUBBLE_H_EST / 2;
      break;
  }

  return {
    left: clamp(left, PAD, vw - BUBBLE_W - PAD),
    top: clamp(top, PAD, vh - BUBBLE_H_EST - PAD),
  };
}

export default function CopilotTutorial({ onDone }: Props) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [pos, setPos] = useState<{ left: number; top: number }>({ left: 0, top: 0 });

  useEffect(() => {
    // Increment shown count on first mount of this session
    const curr = parseInt(window.localStorage.getItem(LS_COUNT) || "0", 10);
    window.localStorage.setItem(LS_COUNT, String(curr + 1));
  }, []);

  const s = STEPS[step];

  // Resolve the target rect (with fallback) and recompute on resize/scroll.
  useLayoutEffect(() => {
    const resolve = () => {
      let el = document.querySelector(s.target) as HTMLElement | null;
      if (!el && s.fallback) el = document.querySelector(s.fallback) as HTMLElement | null;
      const r = el ? el.getBoundingClientRect() : null;
      setRect(r);
      setPos(computeBubblePos(r, s.side));
    };
    resolve();
    // Re-resolve a couple of frames later in case panes are still mounting/animating.
    const t1 = window.setTimeout(resolve, 50);
    const t2 = window.setTimeout(resolve, 250);
    window.addEventListener("resize", resolve);
    window.addEventListener("scroll", resolve, true);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("resize", resolve);
      window.removeEventListener("scroll", resolve, true);
    };
  }, [s.target, s.fallback, s.side]);

  const finish = (skipped: boolean) => {
    if (skipped) window.localStorage.setItem(LS_SKIPPED, "1");
    onDone();
  };

  return (
    <div
      className="fixed inset-0 z-[80] bg-background/40 backdrop-blur-[1px] animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Copilot tutorial"
      onClick={() => finish(false)}
    >
      {/* Spotlight outline on the resolved target */}
      {rect && (
        <div
          className="pointer-events-none absolute rounded-lg ring-2 ring-primary/70 ring-offset-2 ring-offset-background transition-all"
          style={{
            left: rect.left - 4,
            top: rect.top - 4,
            width: rect.width + 8,
            height: rect.height + 8,
          }}
        />
      )}

      <div
        className="absolute rounded-xl border bg-card shadow-2xl p-4 animate-in zoom-in-95"
        style={{ left: pos.left, top: pos.top, width: BUBBLE_W }}
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
