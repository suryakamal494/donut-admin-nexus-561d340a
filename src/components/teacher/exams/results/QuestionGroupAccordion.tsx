import { ChevronDown, AlertTriangle, XCircle, CheckCircle, AlertCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { QuestionAnalysisCard } from "./QuestionAnalysisCard";
import type { QuestionAnalysis } from "@/data/teacher/examResults";

interface QuestionGroupAccordionProps {
  questions: QuestionAnalysis[];
}

interface Band {
  key: string;
  label: string;
  icon: typeof XCircle;
  min: number;
  max: number;
  colorClasses: { bg: string; text: string; badge: string; border: string };
}

const bands: Band[] = [
  {
    key: "reteach",
    label: "Needs Reteaching",
    icon: XCircle,
    min: 0,
    max: 35,
    colorClasses: {
      bg: "bg-red-50 dark:bg-red-950/30",
      text: "text-red-700 dark:text-red-400",
      badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
      border: "border-l-4 border-l-red-500",
    },
  },
  {
    key: "review",
    label: "Review Recommended",
    icon: AlertTriangle,
    min: 35,
    max: 50,
    colorClasses: {
      bg: "bg-amber-50 dark:bg-amber-950/30",
      text: "text-amber-700 dark:text-amber-400",
      badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
      border: "border-l-4 border-l-amber-500",
    },
  },
  {
    key: "satisfactory",
    label: "Satisfactory",
    icon: AlertCircle,
    min: 50,
    max: 75,
    colorClasses: {
      bg: "bg-teal-50 dark:bg-teal-950/30",
      text: "text-teal-700 dark:text-teal-400",
      badge: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400",
      border: "border-l-4 border-l-teal-500",
    },
  },
  {
    key: "well-understood",
    label: "Well Understood",
    icon: CheckCircle,
    min: 75,
    max: 101,
    colorClasses: {
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      text: "text-emerald-700 dark:text-emerald-400",
      badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
      border: "border-l-4 border-l-emerald-500",
    },
  },
];

export const QuestionGroupAccordion = ({ questions }: QuestionGroupAccordionProps) => {
  const grouped = bands.map((band) => ({
    ...band,
    questions: questions
      .filter((q) => q.successRate >= band.min && q.successRate < band.max)
      .sort((a, b) => a.successRate - b.successRate),
  }));

  // Default open: worst band that has questions
  const defaultOpen = grouped.filter((g) => g.questions.length > 0).map((g) => g.key).slice(0, 2);

  return (
    <Accordion type="multiple" defaultValue={defaultOpen} className="space-y-3">
      {grouped
        .filter((g) => g.questions.length > 0)
        .map((group) => {
          const Icon = group.icon;
          return (
            <AccordionItem key={group.key} value={group.key} className={cn("rounded-xl border overflow-hidden", group.colorClasses.border)}>
              <AccordionTrigger className={cn("px-4 py-3 hover:no-underline", group.colorClasses.bg)}>
                <div className="flex items-center gap-2 w-full">
                  <Icon className={cn("w-4 h-4 shrink-0", group.colorClasses.text)} />
                  <span className={cn("font-semibold text-sm", group.colorClasses.text)}>{group.label}</span>
                  <Badge variant="secondary" className={cn("ml-auto mr-2 text-xs", group.colorClasses.badge)}>
                    {group.questions.length} question{group.questions.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-3 pb-3 pt-2">
                <div className="grid gap-3 sm:grid-cols-2">
                  {group.questions.map((q) => (
                    <QuestionAnalysisCard key={q.questionId} question={q} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
    </Accordion>
  );
};
