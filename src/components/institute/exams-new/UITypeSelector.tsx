import { Monitor, MonitorPlay, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type UIType = "platform" | "real_exam";

interface UITypeSelectorProps {
  selectedUIType: UIType;
  onSelectUIType: (type: UIType) => void;
  realExamUIAvailable: boolean;
  realExamUILabel: string | null;
}

export function UITypeSelector({
  selectedUIType,
  onSelectUIType,
  realExamUIAvailable,
  realExamUILabel,
}: UITypeSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h4 className="text-sm font-medium">Student Interface</h4>
        {realExamUIAvailable && (
          <Badge variant="secondary" className="text-[9px] px-1.5 gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            Real UI Available
          </Badge>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Platform UI Option */}
        <button
          onClick={() => onSelectUIType("platform")}
          className={cn(
            "p-3 sm:p-4 rounded-xl border-2 text-left transition-all min-h-[100px]",
            selectedUIType === "platform"
              ? "border-primary bg-primary/5 shadow-sm"
              : "border-border hover:border-primary/50"
          )}
        >
          <div className="flex items-start justify-between mb-2">
            <Monitor
              className={cn(
                "w-8 h-8 sm:w-10 sm:h-10",
                selectedUIType === "platform" ? "text-primary" : "text-muted-foreground"
              )}
            />
            {selectedUIType === "platform" && (
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
          </div>
          <h4 className="font-semibold text-sm mb-1">Platform UI</h4>
          <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
            Standard interface with navigation aids, question palette, and review features
          </p>
        </button>

        {/* Real Exam UI Option */}
        <button
          onClick={() => realExamUIAvailable && onSelectUIType("real_exam")}
          disabled={!realExamUIAvailable}
          className={cn(
            "p-3 sm:p-4 rounded-xl border-2 text-left transition-all min-h-[100px] relative",
            !realExamUIAvailable && "opacity-50 cursor-not-allowed",
            selectedUIType === "real_exam"
              ? "border-primary bg-primary/5 shadow-sm"
              : realExamUIAvailable
                ? "border-border hover:border-primary/50"
                : "border-border bg-muted/30"
          )}
        >
          <div className="flex items-start justify-between mb-2">
            <MonitorPlay
              className={cn(
                "w-8 h-8 sm:w-10 sm:h-10",
                selectedUIType === "real_exam" ? "text-primary" : "text-muted-foreground"
              )}
            />
            {selectedUIType === "real_exam" && (
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
          </div>
          <h4 className="font-semibold text-sm mb-1">Real Exam Experience</h4>
          {realExamUIAvailable && realExamUILabel ? (
            <>
              <p className="text-[10px] text-primary font-medium mb-0.5">{realExamUILabel}</p>
              <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                Simulates the actual examination interface for authentic practice
              </p>
            </>
          ) : (
            <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
              Not available for this pattern. Only supported for JEE Main, JEE Advanced, and NEET patterns.
            </p>
          )}
        </button>
      </div>
    </div>
  );
}
