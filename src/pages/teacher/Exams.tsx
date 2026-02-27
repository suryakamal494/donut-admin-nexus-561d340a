import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Search, 
  FileQuestion,
  Clock,
  Calendar,
  CheckCircle,
  Users
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { TeacherExamCard } from "@/components/teacher/exams";
import { ExamPreviewDialog } from "@/components/teacher/exams/ExamPreviewDialog";
import { AssignBatchesDialog } from "@/components/teacher/exams/AssignBatchesDialog";
import { ScheduleExamDialog } from "@/components/teacher/exams/ScheduleExamDialog";
import { teacherExams as initialExams } from "@/data/teacher/exams";
import { batchInfoMap } from "@/data/teacher/examResults";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { TeacherExam } from "@/data/teacher/types";

// Debounce hook for search
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useMemo(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};

const Exams = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [batchFilter, setBatchFilter] = useState<string>("all");
  const [exams, setExams] = useState<TeacherExam[]>(initialExams);

  // Dialog states
  const [previewExam, setPreviewExam] = useState<TeacherExam | null>(null);
  const [assignExam, setAssignExam] = useState<TeacherExam | null>(null);
  const [scheduleExam, setScheduleExam] = useState<TeacherExam | null>(null);

  // Handlers for exam actions
  const handleView = useCallback((exam: TeacherExam) => {
    setPreviewExam(exam);
  }, []);

  const handleEdit = useCallback((examId: string) => {
    navigate(`/teacher/exams/${examId}/edit`);
  }, [navigate]);

  const handleAssign = useCallback((exam: TeacherExam) => {
    setAssignExam(exam);
  }, []);

  const handleSchedule = useCallback((exam: TeacherExam) => {
    setScheduleExam(exam);
  }, []);

  const handleDelete = useCallback((examId: string) => {
    setExams(prev => prev.filter(e => e.id !== examId));
    toast.success("Exam deleted");
  }, []);

  const handleViewResults = useCallback((examId: string) => {
    const exam = exams.find(e => e.id === examId);
    const firstBatch = exam?.batchIds[0] || "batch-10a";
    navigate(`/teacher/reports/${firstBatch}/exams/${examId}`);
  }, [navigate, exams]);

  const handleAssignBatches = useCallback((examId: string, batchIds: string[]) => {
    setExams(prev => prev.map(e => 
      e.id === examId ? { ...e, batchIds } : e
    ));
  }, []);

  const handleScheduleExam = useCallback((examId: string, date: Date, time: string) => {
    setExams(prev => prev.map(e => 
      e.id === examId 
        ? { ...e, scheduledDate: date.toISOString(), scheduledTime: time, status: "scheduled" as const } 
        : e
    ));
  }, []);

  // Collect unique batch IDs across all exams
  const allBatchIds = useMemo(() => {
    const ids = new Set<string>();
    exams.forEach(e => e.batchIds.forEach(b => ids.add(b)));
    return Array.from(ids);
  }, [exams]);

  const filteredExams = useMemo(() => exams.filter((e) => {
    const matchesSearch = e.name.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesStatus = statusFilter === "all" || e.status === statusFilter;
    const matchesBatch = batchFilter === "all" || e.batchIds.includes(batchFilter);
    return matchesSearch && matchesStatus && matchesBatch;
  }), [exams, debouncedSearch, statusFilter, batchFilter]);

  const stats = useMemo(() => ({
    total: exams.length,
    draft: exams.filter(e => e.status === "draft").length,
    scheduled: exams.filter(e => e.status === "scheduled").length,
    completed: exams.filter(e => e.status === "completed").length,
  }), [exams]);

  // Status filters - removed "live"
  const statusFilters = [
    { id: "all", label: "All", count: stats.total, icon: FileQuestion },
    { id: "draft", label: "Drafts", count: stats.draft, icon: Clock },
    { id: "scheduled", label: "Scheduled", count: stats.scheduled, icon: Calendar },
    { id: "completed", label: "Done", count: stats.completed, icon: CheckCircle },
  ];

  return (
    <div className="space-y-3 sm:space-y-5 max-w-7xl mx-auto pb-20 md:pb-6">
      <PageHeader
        title="Exams"
        description="Create and manage tests for your students"
        breadcrumbs={[
          { label: "Teacher", href: "/teacher" },
          { label: "Exams" },
        ]}
      />

      {/* Compact Stats Row - Inline badges on mobile */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {statusFilters.map((stat) => {
          const Icon = stat.icon;
          const isActive = statusFilter === stat.id;
          return (
            <button
              key={stat.id}
              onClick={() => setStatusFilter(stat.id)}
              className={cn(
                "shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs font-medium transition-all",
                "active:scale-[0.98] min-h-[32px] sm:min-h-[36px]",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/70 hover:bg-muted text-muted-foreground"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{stat.label}</span>
              <span className={cn(
                "px-1.5 py-0.5 rounded text-[10px] font-semibold",
                isActive ? "bg-white/20" : "bg-background"
              )}>
                {stat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Batch Filter Row */}
      {allBatchIds.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          <Users className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <button
            onClick={() => setBatchFilter("all")}
            className={cn(
              "shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
              "active:scale-[0.98] min-h-[32px]",
              batchFilter === "all"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/70 hover:bg-muted text-muted-foreground"
            )}
          >
            All Batches
          </button>
          {allBatchIds.map((batchId) => {
            const info = batchInfoMap[batchId];
            const label = info ? info.name : batchId;
            const isActive = batchFilter === batchId;
            return (
              <button
                key={batchId}
                onClick={() => setBatchFilter(batchId)}
                className={cn(
                  "shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
                  "active:scale-[0.98] min-h-[32px]",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/70 hover:bg-muted text-muted-foreground"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* Search & Create - Compact */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search exams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
        
        <Button 
          className="gradient-button h-10 px-3 sm:px-4 shrink-0"
          onClick={() => navigate("/teacher/exams/create")}
        >
          <Plus className="w-4 h-4 sm:mr-1.5" />
          <span className="hidden sm:inline">Create</span>
        </Button>
      </div>

      {/* Exams Grid */}
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredExams.map((exam) => (
          <TeacherExamCard
            key={exam.id}
            exam={exam}
            onView={() => handleView(exam)}
            onEdit={() => handleEdit(exam.id)}
            onAssign={() => handleAssign(exam)}
            onSchedule={() => handleSchedule(exam)}
            onDelete={() => handleDelete(exam.id)}
            onViewResults={() => handleViewResults(exam.id)}
          />
        ))}
        
        {filteredExams.length === 0 && (
          <Card className="col-span-full border-dashed">
            <CardContent className="p-6 sm:p-8 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <FileQuestion className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1 text-sm sm:text-base">No exams found</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 max-w-xs">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Create your first exam to get started"}
              </p>
              <Button 
                onClick={() => navigate("/teacher/exams/create")} 
                className="gradient-button h-9"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Create Exam
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Mobile FAB */}
      <div className="fixed bottom-20 right-4 md:hidden z-40">
        <Button 
          size="lg"
          className="w-12 h-12 rounded-full gradient-button shadow-lg shadow-primary/30"
          onClick={() => navigate("/teacher/exams/create")}
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {/* Dialogs */}
      <ExamPreviewDialog
        open={!!previewExam}
        onOpenChange={(open) => !open && setPreviewExam(null)}
        exam={previewExam}
      />

      <AssignBatchesDialog
        open={!!assignExam}
        onOpenChange={(open) => !open && setAssignExam(null)}
        exam={assignExam}
        onAssign={handleAssignBatches}
      />

      <ScheduleExamDialog
        open={!!scheduleExam}
        onOpenChange={(open) => !open && setScheduleExam(null)}
        exam={scheduleExam}
        onSchedule={handleScheduleExam}
      />
    </div>
  );
};

export default Exams;
