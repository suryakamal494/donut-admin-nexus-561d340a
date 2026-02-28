import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { InstituteExamEntry } from "@/data/institute/reportsData";

interface BatchExamsTabStubProps {
  exams: InstituteExamEntry[];
}

const typeBadge: Record<string, { label: string; className: string }> = {
  teacher: { label: "Teacher", className: "bg-blue-100 text-blue-700" },
  institute: { label: "Institute", className: "bg-purple-100 text-purple-700" },
  grand_test: { label: "Grand Test", className: "bg-amber-100 text-amber-700" },
};

const BatchExamsTabStub = ({ exams }: BatchExamsTabStubProps) => {
  if (exams.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-8">No exams found for this batch.</p>;
  }

  return (
    <div className="space-y-1.5">
      {exams.map((exam) => {
        const badge = typeBadge[exam.type] ?? typeBadge.teacher;
        return (
          <Card key={exam.examId} className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <CardContent className="p-2.5 sm:p-3 flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-semibold text-foreground truncate">{exam.examName}</h4>
                  <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0", badge.className)}>
                    {badge.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-[10px] sm:text-xs text-muted-foreground">
                  <span>{exam.subject}</span>
                  <span>·</span>
                  <span>{new Date(exam.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                  <span>·</span>
                  <span>{exam.passPercentage}% pass</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm sm:text-base font-bold text-foreground">{exam.classAverage}/{exam.totalMarks}</p>
                <p className="text-[10px] text-muted-foreground">class avg</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default BatchExamsTabStub;
