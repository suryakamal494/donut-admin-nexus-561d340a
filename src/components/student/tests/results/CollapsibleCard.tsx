// CollapsibleCard Component
// Reusable wrapper that collapses analysis cards with a summary line

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface CollapsibleCardProps {
  icon: React.ReactNode;
  title: string;
  summary: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const CollapsibleCard = ({
  icon,
  title,
  summary,
  defaultOpen = false,
  children,
}: CollapsibleCardProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full flex items-center gap-2 p-4 sm:p-5 text-left"
      >
        {icon}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm sm:text-base">{title}</h3>
          <AnimatePresence mode="wait">
            {!isOpen && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs text-muted-foreground mt-0.5 truncate"
              >
                {summary}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 sm:px-5 sm:pb-5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollapsibleCard;
