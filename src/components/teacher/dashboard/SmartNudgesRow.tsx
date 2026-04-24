import { useMemo, useState } from "react";
import {
  BookOpen,
  GraduationCap,
  ClipboardList,
  Sparkles,
  ArrowRight,
  X,
  PlayCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCopilot } from "@/components/teacher/routine-pilot/CopilotContext";
import {
  generateSmartNudges,
  getDismissedNudgeIds,
  dismissNudgeId,
  type NudgeEngineInput,
  type SmartNudge,
} from "./nudgeEngine";
import { cn } from "@/lib/utils";

interface Props {
  input: NudgeEngineInput;
  maxVisible?: number;
}

const ICONS: Record<SmartNudge["icon"], React.ComponentType<{ className?: string }>> = {
  plan: BookOpen,
  remediate: GraduationCap,
  homework: ClipboardList,
  prep: Sparkles,
  continue: PlayCircle,
};

export default function SmartNudgesRow({ input, maxVisible = 2 }: Props) {
  const { openCopilot } = useCopilot();
  const [dismissedTick, setDismissedTick] = useState(0);

  const visible = useMemo(() => {
    const dismissed = getDismissedNudgeIds();
    return generateSmartNudges(input)
      .filter((n) => !dismissed.has(n.id))
      .slice(0, maxVisible);
    // dismissedTick forces a recompute when the user dismisses a card
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, maxVisible, dismissedTick]);

  if (visible.length === 0) return null;

  const handleAccept = (nudge: SmartNudge) => {
    openCopilot({
      routineKey: nudge.routineKey,
      batchId: nudge.batchId ?? undefined,
    });
  };

  const handleDismiss = (id: string) => {
    dismissNudgeId(id);
    setDismissedTick((t) => t + 1);
  };

  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="flex items-center gap-2 px-1">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-sm shadow-violet-500/30">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <h2 className="text-sm sm:text-base font-semibold text-foreground">
          Copilot Suggestions
        </h2>
        <span className="text-[10px] sm:text-xs uppercase tracking-wide font-semibold text-violet-600 px-2 py-0.5 rounded-full bg-violet-50 border border-violet-100">
          Premium
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        {visible.map((nudge) => {
          const Icon = ICONS[nudge.icon];
          return (
            <Card
              key={nudge.id}
              className={cn(
                "group relative overflow-hidden p-3 sm:p-4 cursor-pointer",
                "border-violet-200/60 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50/40",
                "hover:shadow-lg hover:shadow-violet-500/10 hover:-translate-y-0.5",
                "active:scale-[0.99] transition-all duration-200"
              )}
              onClick={() => handleAccept(nudge)}
            >
              {/* Dismiss */}
              <button
                type="button"
                aria-label="Dismiss suggestion"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDismiss(nudge.id);
                }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground/60 hover:text-foreground hover:bg-white/80 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-start gap-3 pr-7">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-violet-500/25">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-sm sm:text-[15px] text-foreground leading-snug truncate">
                    {nudge.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {nudge.context}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end mt-2 sm:mt-3">
                <Button
                  size="sm"
                  className="h-8 px-3 text-xs font-semibold bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white border-0 shadow-md shadow-violet-500/25 group-hover:shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAccept(nudge);
                  }}
                >
                  {nudge.ctaLabel}
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}