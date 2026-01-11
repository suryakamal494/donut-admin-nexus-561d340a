import { Globe, Building2, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface SourceBadgeProps {
  source?: "global" | "institute" | "teacher";
  className?: string;
}

export const SourceBadge = ({ source = "global", className }: SourceBadgeProps) => {
  const isGlobal = source === "global";
  const isTeacher = source === "teacher";
  
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
        isGlobal
          ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          : isTeacher
            ? "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400"
            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
        className
      )}
    >
      {isGlobal ? (
        <>
          <Globe className="w-3 h-3" />
          <span>Global</span>
        </>
      ) : isTeacher ? (
        <>
          <User className="w-3 h-3" />
          <span>My Content</span>
        </>
      ) : (
        <>
          <Building2 className="w-3 h-3" />
          <span>Institute</span>
        </>
      )}
    </div>
  );
};
