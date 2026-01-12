// First-time onboarding tooltip for learning modes
// Shows once per student, stored in localStorage

import { useState, useEffect } from "react";
import { School, Target, Trophy, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "student-mode-onboarding-seen";

interface ModeOnboardingTooltipProps {
  onDismiss?: () => void;
}

export function ModeOnboardingTooltip({ onDismiss }: ModeOnboardingTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeen = localStorage.getItem(STORAGE_KEY);
    if (!hasSeen) {
      // Small delay for smooth page load
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsVisible(false);
    onDismiss?.();
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const modes = [
    {
      icon: School,
      label: "Classroom",
      description: "Teacher-led lessons & homework",
      color: "text-cyan-600",
      bgColor: "bg-cyan-500/10",
    },
    {
      icon: Target,
      label: "My Path",
      description: "AI finds your weak spots",
      color: "text-donut-coral",
      bgColor: "bg-donut-coral/10",
    },
    {
      icon: Trophy,
      label: "Compete",
      description: "Challenge yourself & rank up",
      color: "text-amber-600",
      bgColor: "bg-amber-500/10",
    },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
          className={cn(
            "relative bg-white/95 backdrop-blur-xl",
            "rounded-2xl border border-white/50 shadow-xl",
            "p-4 mx-2 mt-2"
          )}
        >
          {/* Decorative gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 via-transparent to-amber-50/50 rounded-2xl pointer-events-none" />
          
          {/* Header */}
          <div className="relative flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-donut-coral to-donut-orange flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-sm text-foreground">
                3 Ways to Learn
              </span>
            </div>
            <button
              onClick={handleDismiss}
              className="w-7 h-7 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Mode explanations */}
          <div className="relative space-y-2">
            {modes.map((mode, index) => {
              const Icon = mode.icon;
              return (
                <motion.div
                  key={mode.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="flex items-center gap-3 p-2 rounded-xl bg-white/60"
                >
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", mode.bgColor)}>
                    <Icon className={cn("w-4 h-4", mode.color)} />
                  </div>
                  <div className="min-w-0">
                    <p className={cn("font-semibold text-sm", mode.color)}>
                      {mode.label}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {mode.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Got it button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={handleDismiss}
            className={cn(
              "w-full mt-3 py-2.5 px-4 rounded-xl",
              "bg-gradient-to-r from-donut-coral to-donut-orange",
              "text-white font-semibold text-sm",
              "active:scale-[0.98] transition-transform"
            )}
          >
            Got it!
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook to check if onboarding should be shown
export function useShowModeOnboarding() {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem(STORAGE_KEY);
    setShouldShow(!hasSeen);
  }, []);

  return shouldShow;
}

// Reset function for testing
export function resetModeOnboarding() {
  localStorage.removeItem(STORAGE_KEY);
}
