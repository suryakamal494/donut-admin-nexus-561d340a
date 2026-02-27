import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { PerformanceBand, BandKey } from "@/data/teacher/examResults";

interface PerformanceBandsProps {
  bands: PerformanceBand[];
}

const bandStyles: Record<BandKey, { dot: string; border: string; bg: string; badge: string }> = {
  mastery: {
    dot: "bg-emerald-500",
    border: "border-l-emerald-500",
    bg: "bg-emerald-50",
    badge: "bg-emerald-100 text-emerald-700",
  },
  stable: {
    dot: "bg-teal-500",
    border: "border-l-teal-500",
    bg: "bg-teal-50",
    badge: "bg-teal-100 text-teal-700",
  },
  reinforcement: {
    dot: "bg-amber-500",
    border: "border-l-amber-500",
    bg: "bg-amber-50",
    badge: "bg-amber-100 text-amber-700",
  },
  risk: {
    dot: "bg-red-500",
    border: "border-l-red-500",
    bg: "bg-red-50",
    badge: "bg-red-100 text-red-700",
  },
};

export const PerformanceBands = ({ bands }: PerformanceBandsProps) => {
  // Risk & reinforcement expanded by default
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    reinforcement: true,
    risk: true,
  });

  const toggle = (key: string) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Performance Bands</h3>
      {bands.map((band) => {
        if (band.count === 0) return null;
        const style = bandStyles[band.key];
        const isOpen = !!expanded[band.key];

        return (
          <div
            key={band.key}
            className={cn(
              "rounded-xl border border-border bg-card card-premium overflow-hidden border-l-4",
              style.border
            )}
          >
            {/* Header – tappable */}
            <button
              onClick={() => toggle(band.key)}
              className="flex items-center justify-between w-full p-3.5 sm:p-4 min-h-[48px] text-left"
            >
              <div className="flex items-center gap-2.5">
                <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", style.dot)} />
                <span className="text-sm font-semibold text-foreground">{band.label}</span>
                <span className={cn("text-xs font-medium rounded-full px-2 py-0.5", style.badge)}>
                  {band.count}
                </span>
              </div>
              {isOpen ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </button>

            {/* Body */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-3.5 pb-3.5 sm:px-4 sm:pb-4 space-y-1">
                    {band.students.map((s) => (
                      <div
                        key={s.id}
                        className={cn(
                          "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm",
                          style.bg
                        )}
                      >
                        <div className="min-w-0">
                          <p className="font-medium truncate">{s.studentName}</p>
                          <p className="text-xs text-muted-foreground">{s.rollNumber}</p>
                        </div>
                        <div className="text-right shrink-0 ml-3">
                          <p className="font-semibold">
                            {s.score}/{s.maxScore}
                          </p>
                          <p className="text-xs text-muted-foreground">{s.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
