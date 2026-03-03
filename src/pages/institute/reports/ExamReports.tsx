import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Search, X } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getInstituteExams, getInstituteBatchReports, type InstituteExamEntry } from "@/data/institute/reportsData";

const EXAMS_PAGE_SIZE = 20;

type ExamFilter = "all" | "teacher" | "institute" | "grand_test";

const filterChips: { key: ExamFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "teacher", label: "Teacher" },
  { key: "institute", label: "Institute" },
  { key: "grand_test", label: "Grand Test" },
];

const typeBadgeStyles: Record<string, { label: string; className: string }> = {
  teacher: { label: "Teacher", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
  institute: { label: "Institute", className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" },
  grand_test: { label: "Grand Test", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
};

const ExamReports = () => {
  const navigate = useNavigate();
  const allExams = useMemo(() => getInstituteExams(), []);
  const batches = useMemo(() => getInstituteBatchReports(), []);

  const [typeFilter, setTypeFilter] = useState<ExamFilter>("all");
  const [batchFilter, setBatchFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(EXAMS_PAGE_SIZE);

  // Derive unique subjects
  const subjects = useMemo(() => {
    const set = new Set<string>();
    allExams.forEach(e => {
      if (e.type !== "grand_test") set.add(e.subject);
    });
    return Array.from(set).sort();
  }, [allExams]);

  const filtered = useMemo(() => {
    let result = allExams;
    if (typeFilter !== "all") result = result.filter(e => e.type === typeFilter);
    if (batchFilter !== "all") result = result.filter(e => e.batchId === batchFilter);
    if (subjectFilter !== "all") result = result.filter(e => e.subject === subjectFilter || (e.subjectNames && e.subjectNames.includes(subjectFilter)));
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(e => e.examName.toLowerCase().includes(q));
    }
    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [allExams, typeFilter, batchFilter, subjectFilter, search]);

  // Reset visible count when filters change
  const filteredKey = `${typeFilter}-${batchFilter}-${subjectFilter}-${search}`;
  useMemo(() => { setVisibleCount(EXAMS_PAGE_SIZE); }, [filteredKey]);

  const visibleExams = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleExamClick = (exam: InstituteExamEntry) => {
    if (exam.type === "grand_test") {
      navigate(`/institute/reports/exams/${exam.examId}/grand-test`);
    } else {
      navigate(`/institute/reports/exams/${exam.examId}`);
    }
  };

  return (
    <div className="space-y-3 max-w-7xl mx-auto pb-20 md:pb-6">
      <PageHeader
        title="Exam Reports"
        description={`${filtered.length} exam${filtered.length !== 1 ? "s" : ""} across all batches`}
        breadcrumbs={[
          { label: "Institute", href: "/institute" },
          { label: "Reports", href: "/institute/reports" },
          { label: "Exam Reports" },
        ]}
      />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search exams..."
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

      {/* Type filter chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
        {filterChips.map(chip => {
          const count = chip.key === "all" ? allExams.length : allExams.filter(e => e.type === chip.key).length;
          if (count === 0 && chip.key !== "all") return null;
          return (
            <button
              key={chip.key}
              onClick={() => setTypeFilter(chip.key)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0",
                typeFilter === chip.key
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

      {/* Batch & Subject filter row */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <select
          value={batchFilter}
          onChange={e => setBatchFilter(e.target.value)}
          className="h-8 px-2 rounded-md border border-input bg-background text-xs flex-shrink-0"
        >
          <option value="all">All Batches</option>
          {batches.map(b => (
            <option key={b.batchId} value={b.batchId}>
              {b.className} {b.batchName}
            </option>
          ))}
        </select>
        <select
          value={subjectFilter}
          onChange={e => setSubjectFilter(e.target.value)}
          className="h-8 px-2 rounded-md border border-input bg-background text-xs flex-shrink-0"
        >
          <option value="all">All Subjects</option>
          {subjects.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Exam list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ClipboardList className="w-12 h-12 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">No exams match your filters.</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {visibleExams.map(exam => {
            const badge = typeBadgeStyles[exam.type] ?? typeBadgeStyles.teacher;
            const avgPercent = Math.round((exam.classAverage / exam.totalMarks) * 100);
            return (
              <Card
                key={`${exam.examId}-${exam.batchId}`}
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
                      <span className="font-medium text-foreground/70">{exam.batchName}</span>
                      <span>·</span>
                      <span>{exam.type === "grand_test" ? exam.subjectNames?.join(", ") : exam.subject}</span>
                      <span>·</span>
                      <span>{new Date(exam.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm sm:text-base font-bold text-foreground">{avgPercent}%</p>
                    <p className="text-[10px] text-muted-foreground">{exam.passPercentage}% pass</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {hasMore && (
            <div className="text-center pt-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-primary"
                onClick={() => setVisibleCount(prev => prev + EXAMS_PAGE_SIZE)}
              >
                Show more ({filtered.length - visibleCount} remaining)
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExamReports;
