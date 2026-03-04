import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { InstituteExamEntry } from "@/data/institute/reportsData";

interface BatchExamsTabProps {
  exams: InstituteExamEntry[];
}

type ExamFilter = "all" | "teacher" | "institute" | "grand_test";

const filterChips: { key: ExamFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "teacher", label: "Teacher" },
  { key: "institute", label: "Institute" },
  { key: "grand_test", label: "Grand Test" },
];

const typeBadgeStyles: Record<string, { label: string; className: string }> = {
  teacher: { label: "Teacher", className: "bg-blue-100 text-blue-700" },
  institute: { label: "Institute", className: "bg-purple-100 text-purple-700" },
  grand_test: { label: "Grand Test", className: "bg-amber-100 text-amber-700" },
};

const BatchExamsTab = ({ exams }: BatchExamsTabProps) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<ExamFilter>("all");

  const filtered = filter === "all" ? exams : exams.filter((e) => e.type === filter);

  const handleExamClick = (exam: InstituteExamEntry) => {
    if (exam.type === "grand_test") {
      navigate(`/institute/reports/exams/${exam.examId}/grand-test`);
    } else {
      navigate(`/institute/reports/exams/${exam.examId}`);
    }
  };

  return (
    <div className="space-y-3">
      {/* Filter chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
        {filterChips.map((chip) => {
          const count = chip.key === "all" ? exams.length : exams.filter((e) => e.type === chip.key).length;
          if (count === 0 && chip.key !== "all") return null;
          return (
            <button
              key={chip.key}
              onClick={() => setFilter(chip.key)}
              className={cn(
                "px-3 py-2 sm:py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0",
                filter === chip.key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {chip.label}
              <span className="ml-1 opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Exam rows */}
      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No exams match this filter.</p>
      ) : (
        <div className="space-y-1.5">
          {filtered.map((exam) => {
            const badge = typeBadgeStyles[exam.type] ?? typeBadgeStyles.teacher;
            const avgPercent = Math.round((exam.classAverage / exam.totalMarks) * 100);

            return (
              <Card
                key={exam.examId}
                className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
                onClick={() => handleExamClick(exam)}
              >
                <CardContent className="p-2.5 sm:p-3 flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-semibold text-foreground truncate">{exam.examName}</h4>
                      <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0", badge.className)}>
                        {badge.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] sm:text-xs text-muted-foreground">
                      <span>{exam.type === "grand_test" ? exam.subjectNames?.join(", ") : exam.subject}</span>
                      <span>·</span>
                      <span>{new Date(exam.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}</span>
                      <span>·</span>
                      <span>{exam.passPercentage}% pass</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm sm:text-base font-bold text-foreground">{avgPercent}%</p>
                    <p className="text-[10px] text-muted-foreground">{exam.classAverage}/{exam.totalMarks}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BatchExamsTab;
