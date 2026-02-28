import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CircleCheck, CircleX, Timer } from "lucide-react";
import { accuracyColor } from "./constants";
import type { StudentResult } from "@/data/teacher/practiceSessionDetailData";

interface StudentRowProps {
  student: StudentResult;
}

export function StudentRow({ student }: StudentRowProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      {student.completed ? (
        <CircleCheck className="w-4 h-4 text-emerald-500 shrink-0" />
      ) : (
        <CircleX className="w-4 h-4 text-muted-foreground/50 shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{student.name}</p>
        <p className="text-xs text-muted-foreground">{student.rollNumber}</p>
      </div>
      {student.completed ? (
        <>
          <div className="text-right shrink-0">
            <p className="text-sm font-semibold">{student.score}/{student.maxScore}</p>
            <p className={cn("text-xs font-medium", accuracyColor(student.accuracy))}>{student.accuracy}%</p>
          </div>
          <div className="text-xs text-muted-foreground shrink-0 hidden sm:flex items-center gap-0.5">
            <Timer className="w-3 h-3" /> {student.timeTaken}m
          </div>
        </>
      ) : (
        <Badge variant="outline" className="text-xs text-muted-foreground">Pending</Badge>
      )}
    </div>
  );
}
