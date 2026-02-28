import { Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DoneStepProps {
  assignedBandCount: number;
  totalAssigned: number;
  totalStudents: number;
  onGoBack: () => void;
}

export function DoneStep({ assignedBandCount, totalAssigned, totalStudents, onGoBack }: DoneStepProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 max-w-sm mx-auto">
      <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
        <Check className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
      </div>
      <div>
        <p className="text-base font-semibold text-foreground">Practice Assigned!</p>
        <p className="text-xs text-muted-foreground mt-1">
          {assignedBandCount} sets · {totalAssigned} questions · {totalStudents} students
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onGoBack}>
        <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Chapter
      </Button>
    </div>
  );
}
