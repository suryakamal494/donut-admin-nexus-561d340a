import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, Search, ArrowUpDown } from "lucide-react";
import { getPerformanceColor } from "@/lib/reportColors";
import type { InstituteStudentSummary } from "@/data/institute/reportsData";

interface BatchStudentsTabProps {
  students: InstituteStudentSummary[];
  batchId: string;
}

type SortKey = "name" | "avg";
type SortDir = "asc" | "desc";

const BatchStudentsTab = ({ students, batchId }: BatchStudentsTabProps) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("avg");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "avg" ? "desc" : "asc");
    }
  };

  const filtered = useMemo(() => {
    let list = students;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.studentName.toLowerCase().includes(q) ||
          s.rollNumber.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => {
      const mult = sortDir === "asc" ? 1 : -1;
      if (sortKey === "name") return mult * a.studentName.localeCompare(b.studentName);
      return mult * (a.overallAverage - b.overallAverage);
    });
  }, [students, search, sortKey, sortDir]);

  // Bucket counts
  const buckets = useMemo(() => {
    const counts = { mastery: 0, stable: 0, reinforcement: 0, risk: 0 };
    students.forEach((s) => {
      if (s.overallAverage >= 75) counts.mastery++;
      else if (s.overallAverage >= 50) counts.stable++;
      else if (s.overallAverage >= 35) counts.reinforcement++;
      else counts.risk++;
    });
    return counts;
  }, [students]);

  return (
    <div className="space-y-3">
      {/* Bucket summary pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { label: "Mastery", count: buckets.mastery, color: "bg-emerald-500" },
          { label: "Stable", count: buckets.stable, color: "bg-teal-500" },
          { label: "Reinforce", count: buckets.reinforcement, color: "bg-amber-500" },
          { label: "At Risk", count: buckets.risk, color: "bg-red-500" },
        ].map((b) => (
          <div key={b.label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-xs flex-shrink-0">
            <div className={cn("w-2 h-2 rounded-full", b.color)} />
            <span className="text-muted-foreground">{b.label}</span>
            <span className="font-semibold text-foreground">{b.count}</span>
          </div>
        ))}
      </div>

      {/* Search + Sort controls */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search name or roll no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
        <button
          onClick={() => toggleSort("name")}
          className={cn(
            "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors",
            sortKey === "name" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          Name
          <ArrowUpDown className="w-3 h-3" />
        </button>
        <button
          onClick={() => toggleSort("avg")}
          className={cn(
            "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors",
            sortKey === "avg" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          Avg
          <ArrowUpDown className="w-3 h-3" />
        </button>
      </div>

      {/* Student rows */}
      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No students found.</p>
      ) : (
        <div className="space-y-1.5">
          {filtered.map((student) => {
            const colors = getPerformanceColor(student.overallAverage);
            const TrendIcon = student.trend === "up" ? TrendingUp : student.trend === "down" ? TrendingDown : Minus;

            return (
              <Card
                key={student.studentId}
                className={cn(
                  "border-0 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.99] border-l-[3px]",
                  colors.border
                )}
                onClick={() => navigate(`/institute/reports/students/${student.studentId}`)}
              >
                <CardContent className="p-2.5 sm:p-3 flex items-center gap-2.5">
                  {/* Student info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-semibold text-foreground truncate">{student.studentName}</h4>
                      <span className="text-[10px] text-muted-foreground flex-shrink-0">{student.rollNumber}</span>
                    </div>
                    {/* Subject mini-bars */}
                    <div className="flex items-center gap-1.5 mt-1">
                      {student.subjects.map((sub) => (
                        <div key={sub.subjectName} className="flex items-center gap-0.5" title={`${sub.subjectName}: ${sub.average}%`}>
                          <div
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: `hsl(${sub.subjectColor})` }}
                          />
                          <span className="text-[9px] text-muted-foreground">{sub.average}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Overall avg + trend */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className={cn("text-sm sm:text-base font-bold", colors.text)}>{student.overallAverage}%</span>
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
      )}
    </div>
  );
};

export default BatchStudentsTab;
