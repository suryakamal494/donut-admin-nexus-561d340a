// One-time onboarding tooltip for the curriculum switcher
// Shows on first visit to a multi-curriculum subject, dismissed on tap

import { useState, useEffect } from "react";
import { X, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "curriculum_switcher_onboarded";

interface CurriculumOnboardingTooltipProps {
  className?: string;
}

const CurriculumOnboardingTooltip = ({ className }: CurriculumOnboardingTooltipProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onboarded = localStorage.getItem(STORAGE_KEY);
    if (!onboarded) {
      // Small delay so the switcher renders first
      const timer = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "true");
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className={cn(
            "relative bg-foreground text-background rounded-2xl px-4 py-3 shadow-xl max-w-xs",
            className
          )}
        >
          {/* Arrow pointing up at the switcher */}
          <div className="absolute -top-2 left-6 w-4 h-4 bg-foreground rotate-45 rounded-sm" />

          <div className="flex items-start gap-3 relative z-10">
            <div className="flex-1">
              <p className="text-sm font-semibold mb-0.5">
                Curriculum Tracks
              </p>
              <p className="text-xs opacity-80 leading-relaxed">
                Switch between your curriculum tracks here. Your chapters and progress are tracked separately for each.
              </p>
            </div>
            <button
              onClick={dismiss}
              className="shrink-0 p-1 rounded-full hover:bg-background/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={dismiss}
            className="mt-2 text-xs font-medium bg-background/20 hover:bg-background/30 px-3 py-1.5 rounded-lg transition-colors"
          >
            Got it
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CurriculumOnboardingTooltip;
