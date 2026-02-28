import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Search, X, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getAllStudents, getInstituteBatchReports, type InstituteStudentSummary } from "@/data/institute/reportsData";
import { getPerformanceColor } from "@/lib/reportColors";

const trendIcon = (trend: string) => {
  if (trend === "up") return <TrendingUp className="w-3 h-3 text-emerald-500" />;
  if (trend === "down") return <TrendingDown className="w-3 h-3 text-red-500" />;
  return <Minus className="w-3 h-3 text-muted-foreground" />;
};

const StudentReports = () => {
  const navigate = useNavigate();
  const allStudents = useMemo(() => getAllStudents(), []);
  const batches = useMemo(() => getInstituteBatchReports(), []);

  const [search, setSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("all");

  const filtered = useMemo(() => {
    let result = allStudents;
    if (batchFilter !== "all") result = result.filter(s => s.batchId === batchFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.studentName.toLowerCase().includes(q) ||
        s.rollNumber.toLowerCase().includes(q)
      );
    }
    return result.sort((a, b) => b.overallAverage - a.overallAverage);
  }, [allStudents, batchFilter, search]);

  // PI bucket summary
  const buckets = useMemo(() => {
    const m = filtered.filter(s => s.overallAverage >= 75).length;
    const st = filtered.filter(s => s.overallAverage >= 50 && s.overallAverage < 75).length;
    const r = filtered.filter(s => s.overallAverage >= 35 && s.overallAverage < 50).length;
    const risk = filtered.filter(s => s.overallAverage < 35).length;
    return [
      { label: "Mastery", count: m, color: "bg-emerald-500" },
      { label: "Stable", count: st, color: "bg-teal-500" },
      { label: "Reinforce", count: r, color: "bg-amber-500" },
      { label: "At Risk", count: risk, color: "bg-red-500" },
    ];
  }, [filtered]);

  return (
    <div className="space-y-3 max-w-7xl mx-auto pb-20 md:pb-6">
      <PageHeader
        title="Student Reports"
        description={`${filtered.length} student${filtered.length !== 1 ? "s" : ""} across all batches`}
        breadcrumbs={[
          { label: "Institute", href: "/institute" },
          { label: "Reports", href: "/institute/reports" },
          { label: "Student Reports" },
        ]}
      />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or roll..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 h-9 text-sm"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Batch filter */}
      <div className="flex gap-2">
        <select
          value={batchFilter}
          onChange={e => setBatchFilter(e.target.value)}
          className="h-8 px-2 rounded-md border border-input bg-background text-xs"
        >
          <option value="all">All Batches</option>
          {batches.map(b => (
            <option key={b.batchId} value={b.batchId}>
              {b.className} {b.batchName}
            </option>
          ))}
        </select>
      </div>

      {/* PI bucket pills */}
      <div className="flex gap-2 flex-wrap">
        {buckets.map(b => (
          <div key={b.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className={cn("w-2.5 h-2.5 rounded-full", b.color)} />
            <span>{b.label}</span>
            <span className="font-bold text-foreground">{b.count}</span>
          </div>
        ))}
      </div>

      {/* Student list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <GraduationCap className="w-12 h-12 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">No students match your search.</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {filtered.map(student => {
            const color = getPerformanceColor(student.overallAverage);
            return (
              <Card
                key={student.studentId}
                className={cn("border-0 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.99] border-l-4", color.border)}
                onClick={() => navigate(`/institute/reports/students/${student.studentId}`)}
              >
                <CardContent className="p-2.5 sm:p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-semibold text-foreground truncate">{student.studentName}</h4>
                        {trendIcon(student.trend)}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] sm:text-xs text-muted-foreground">
                        <span>{student.rollNumber}</span>
                        <span>·</span>
                        <span>{student.batchName}</span>
                        <span>·</span>
                        <span>{student.examsTaken} exams</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={cn("text-sm sm:text-base font-bold", color.text)}>{student.overallAverage}%</p>
                    </div>
                  </div>
                  {/* Subject mini bars */}
                  <div className="flex gap-1.5 mt-2">
                    {student.subjects.map(sub => (
                      <div key={sub.subjectName} className="flex items-center gap-1 text-[9px] text-muted-foreground">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: `hsl(${sub.subjectColor})` }} />
                        <span>{sub.subjectName.slice(0, 3)}</span>
                        <span className="font-bold text-foreground">{sub.average}%</span>
                      </div>
                    ))}
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

export default StudentReports;
