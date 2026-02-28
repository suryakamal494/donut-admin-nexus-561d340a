export const bandConfig: Record<string, { color: string; bg: string; border: string; text: string }> = {
  mastery: { color: "bg-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-700 dark:text-emerald-400" },
  stable: { color: "bg-teal-500", bg: "bg-teal-500/10", border: "border-teal-500/30", text: "text-teal-700 dark:text-teal-400" },
  reinforcement: { color: "bg-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-700 dark:text-amber-400" },
  risk: { color: "bg-red-500", bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-700 dark:text-red-400" },
};

export const accuracyColor = (pct: number) =>
  pct >= 75 ? "text-emerald-600 dark:text-emerald-400" :
  pct >= 50 ? "text-teal-600 dark:text-teal-400" :
  pct >= 35 ? "text-amber-600 dark:text-amber-400" :
  "text-red-600 dark:text-red-400";
