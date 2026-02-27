import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Users, ChevronRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getPerformanceColor } from "@/lib/reportColors";
import { motion } from "framer-motion";
import type { StudentRosterEntry } from "@/data/teacher/studentReportData";

interface StudentsTabProps {
  studentRoster: StudentRosterEntry[];
  batchId: string;
}

const bucketStyles: Record<string, { badge: string; label: string }> = {
  mastery: { badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400", label: "Mastery" },
  stable: { badge: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400", label: "Stable" },
  reinforcement: { badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400", label: "Reinforce" },
  risk: { badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400", label: "At Risk" },
};

export const StudentsTab = ({ studentRoster, batchId }: StudentsTabProps) => {
  const navigate = useNavigate();
  const [studentSearch, setStudentSearch] = useState("");

  const filtered = studentRoster.filter(s =>
    s.studentName.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search students..."
          value={studentSearch}
          onChange={(e) => setStudentSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {filtered.map((student, i) => {
        const bs = bucketStyles[student.piBucket];
        const TrendIcon = student.trend === "up" ? TrendingUp : student.trend === "down" ? TrendingDown : Minus;
        const trendColor = student.trend === "up" ? "text-emerald-500" : student.trend === "down" ? "text-red-500" : "text-muted-foreground";

        return (
          <motion.div key={student.studentId} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: i * 0.03 }}>
            <Card
              className="card-premium cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99]"
              onClick={() => navigate(`/teacher/reports/${batchId}/students/${student.studentId}`)}
            >
              <CardContent className="p-3.5 sm:p-4 flex items-center gap-3">
                <div className={cn(
                  "shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm",
                  getPerformanceColor(student.avgPercentage).bg
                )}>
                  {student.avgPercentage}%
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <h3 className="text-sm font-semibold text-foreground truncate">{student.studentName}</h3>
                    <Badge variant="secondary" className={cn("text-[10px] px-1.5 py-0 font-medium", bs.badge)}>{bs.label}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>{student.rollNumber}</span>
                    <span>·</span>
                    <span>{student.examsAttempted} exams</span>
                    <TrendIcon className={cn("w-3 h-3", trendColor)} />
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </CardContent>
            </Card>
          </motion.div>
        );
      })}

      {studentRoster.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold mb-1">No student data</h3>
            <p className="text-sm text-muted-foreground">Conduct exams to see student-wise analytics.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
