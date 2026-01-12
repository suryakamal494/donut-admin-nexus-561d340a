// Mode Switcher - Creative mode navigation component
// Mobile: Horizontal scrollable pills (always visible)
// Desktop: Traditional horizontal tabs

import { School, Target, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import type { LearningMode } from "./ModeSelectionSheet";

interface ModeConfig {
  id: LearningMode;
  icon: typeof School;
  label: string;
  mobileLabel: string;
  color: string;
  activeGradient: string;
  activeBorder: string;
  activeBg: string;
  activeText: string;
}

const modes: ModeConfig[] = [
  {
    id: "classroom",
    icon: School,
    label: "CLASSROOM",
    mobileLabel: "Class",
    color: "text-cyan-600",
    activeGradient: "from-cyan-500/20 to-cyan-400/10",
    activeBorder: "border-cyan-500",
    activeBg: "bg-cyan-500",
    activeText: "text-white",
  },
  {
    id: "mypath",
    icon: Target,
    label: "MY PATH",
    mobileLabel: "AI Path",
    color: "text-donut-coral",
    activeGradient: "from-donut-coral/20 to-donut-orange/10",
    activeBorder: "border-donut-coral",
    activeBg: "bg-donut-coral",
    activeText: "text-white",
  },
  {
    id: "compete",
    icon: Trophy,
    label: "COMPETE",
    mobileLabel: "Compete",
    color: "text-amber-600",
    activeGradient: "from-amber-500/20 to-amber-400/10",
    activeBorder: "border-amber-500",
    activeBg: "bg-amber-500",
    activeText: "text-white",
  },
];

interface ModeSwitcherProps {
  currentMode: LearningMode;
  onModeChange: (mode: LearningMode) => void;
  modeCounts?: { classroom: number; mypath: number; compete: number };
}

export function ModeSwitcher({
  currentMode,
  onModeChange,
  modeCounts = { classroom: 0, mypath: 0, compete: 0 },
}: ModeSwitcherProps) {
  const isMobile = useIsMobile();

  const handleModeChange = (mode: LearningMode) => {
    // Haptic feedback on mobile
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    onModeChange(mode);
  };

  // Mobile: Horizontal scrollable pills - always visible
  if (isMobile) {
    return (
      <div 
        className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-1 scrollbar-hide"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = currentMode === mode.id;
          const count = modeCounts[mode.id];

          return (
            <button
              key={mode.id}
              onClick={() => handleModeChange(mode.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-full shrink-0",
                "min-h-[44px] transition-all duration-200 active:scale-[0.97]",
                isActive
                  ? cn(mode.activeBg, mode.activeText, "shadow-sm")
                  : "bg-white/60 text-muted-foreground border border-white/50 backdrop-blur-sm"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-white" : mode.color)} />
              <span className={cn("font-semibold text-sm whitespace-nowrap", isActive && "text-white")}>
                {mode.mobileLabel}
              </span>
              {count > 0 && (
                <span className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center",
                  isActive 
                    ? "bg-white/25 text-white"
                    : "bg-muted/50 text-muted-foreground"
                )}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Desktop: Horizontal tabs
  return (
    <div className="flex items-center gap-2 p-1.5 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = currentMode === mode.id;
        const count = modeCounts[mode.id];

        return (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200",
              isActive
                ? cn("bg-gradient-to-r", mode.activeGradient, "border", mode.activeBorder)
                : "hover:bg-white/50 border border-transparent"
            )}
          >
            <Icon className={cn("w-4 h-4", isActive ? mode.color : "text-muted-foreground")} />
            <span className={cn(
              "font-semibold text-sm",
              isActive ? mode.color : "text-muted-foreground"
            )}>
              {mode.label}
            </span>
            {count > 0 && (
              <span className={cn(
                "text-xs px-1.5 py-0.5 rounded-full",
                isActive 
                  ? cn("bg-white/60", mode.color)
                  : "bg-muted/50 text-muted-foreground"
              )}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default ModeSwitcher;
