import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { InstituteStudentSummary } from "@/data/institute/reportsData";

interface BatchStudentsTabStubProps {
  students: InstituteStudentSummary[];
  batchId: string;
}

function getBucket(avg: number) {
  if (avg >= 75) return { label: "Mastery", color: "bg-emerald-500" };
  if (avg >= 50) return { label: "Stable", color: "bg-teal-500" };
  if (avg >= 35) return { label: "Reinforcement", color: "bg-amber-500" };
  return { label: "Risk", color: "bg-red-500" };
}

const BatchStudentsTabStub = ({ students, batchId }: BatchStudentsTabStubProps) => {
  const navigate = useNavigate();

  if (students.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-8">No students found.</p>;
  }

  return (
    <div className="space-y-1.5">
      {students.map((student) => {
        const bucket = getBucket(student.overallAverage);
        const TrendIcon = student.trend === "up" ? TrendingUp : student.trend === "down" ? TrendingDown : Minus;

        return (
          <Card
            key={student.studentId}
            className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer"
            onClick={() => navigate(`/institute/reports/students/${student.studentId}`)}
          >
            <CardContent className="p-2.5 sm:p-3 flex items-center gap-2.5">
              {/* PI bucket indicator */}
              <div className={cn("w-1.5 h-10 rounded-full flex-shrink-0", bucket.color)} />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-semibold text-foreground truncate">{student.studentName}</h4>
                  <span className="text-[10px] text-muted-foreground">{student.rollNumber}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-[10px] sm:text-xs text-muted-foreground">
                  <span>{student.subjectCount} subjects</span>
                  <span>·</span>
                  <span>{student.examsTaken} exams</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="text-sm sm:text-base font-bold text-foreground">{student.overallAverage}%</span>
                <TrendIcon className={cn(
                  "w-3.5 h-3.5",
                  student.trend === "up" ? "text-emerald-500" :
                  student.trend === "down" ? "text-red-500" :
                  "text-muted-foreground"
                )} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default BatchStudentsTabStub;
