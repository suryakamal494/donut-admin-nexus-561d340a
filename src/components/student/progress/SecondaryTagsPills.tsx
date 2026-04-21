import { motion } from "framer-motion";
import type { SecondaryTag } from "@/lib/performanceIndex";

interface SecondaryTagsPillsProps {
  tags: SecondaryTag[];
}

const tagConfig: Record<SecondaryTag, { label: string; bg: string; text: string; tooltip: string }> = {
  improving: { label: "Improving", bg: "bg-emerald-50", text: "text-emerald-700", tooltip: "Your scores are trending upward across recent exams" },
  declining: { label: "Declining", bg: "bg-red-50", text: "text-red-700", tooltip: "Your scores have been dropping — let's turn this around!" },
  plateaued: { label: "Plateaued", bg: "bg-amber-50", text: "text-amber-700", tooltip: "Scores have been steady — try challenging yourself with harder topics" },
  inconsistent: { label: "Inconsistent", bg: "bg-orange-50", text: "text-orange-700", tooltip: "Scores vary widely between exams — consistency practice helps" },
  "speed-issue": { label: "Speed Issue", bg: "bg-purple-50", text: "text-purple-700", tooltip: "You're accurate but slow — timed practice could help" },
  "low-attempt": { label: "Low Attempt", bg: "bg-slate-50", text: "text-slate-700", tooltip: "You're not attempting all questions — try to answer more" },
};

const SecondaryTagsPills = ({ tags }: SecondaryTagsPillsProps) => {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => {
        const cfg = tagConfig[tag];
        return (
          <motion.span
            key={tag}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`group relative text-[10px] font-semibold px-2 py-1 rounded-full ${cfg.bg} ${cfg.text} cursor-help`}
          >
            {cfg.label}
            {/* Tooltip */}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1.5 bg-foreground text-background text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 max-w-[200px] text-wrap">
              {cfg.tooltip}
            </span>
          </motion.span>
        );
      })}
    </div>
  );
};

export default SecondaryTagsPills;