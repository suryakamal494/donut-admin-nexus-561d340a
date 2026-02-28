import { useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Users, BookOpen, FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { batchInfoMap } from "@/data/teacher/examResults";
import { getBatchChapters, getBatchExamHistory, getBatchInstituteTests, getBatchHealth } from "@/data/teacher/reportsData";
import { getBatchStudentRoster } from "@/data/teacher/studentReportData";
import { currentTeacher } from "@/data/teacher/profile";
import { ChaptersTab, ExamsTab, StudentsTab, BatchHealthCard } from "@/components/teacher/reports";

const BatchReport = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("chapters");

  const batchInfo = batchId ? batchInfoMap[batchId] : null;
  const chapters = useMemo(() => (batchId ? getBatchChapters(batchId) : []), [batchId]);
  const allExamHistory = useMemo(() => (batchId ? getBatchExamHistory(batchId) : []), [batchId]);
  const instituteTests = useMemo(() => (batchId ? getBatchInstituteTests(batchId, currentTeacher.subjects[0] || "Physics") : []), [batchId]);
  const studentRoster = useMemo(() => (batchId ? getBatchStudentRoster(batchId) : []), [batchId]);

  const batchHealth = useMemo(() => {
    if (!batchId) return null;
    return getBatchHealth(batchId, chapters, allExamHistory, studentRoster);
  }, [batchId, chapters, allExamHistory, studentRoster]);

  const handleNavigateToStudent = useCallback((studentId: string) => {
    navigate(`/teacher/reports/${batchId}/students/${studentId}`);
  }, [navigate, batchId]);

  if (!batchId || !batchInfo) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-4">
        <Users className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Batch Not Found</h2>
        <Button onClick={() => navigate("/teacher/reports")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Reports
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-w-7xl mx-auto pb-20 md:pb-6">
      {/* Compact breadcrumbs */}
      <nav className="flex items-center gap-1 text-xs text-muted-foreground">
        <a href="/teacher" className="hover:text-foreground transition-colors">Teacher</a>
        <span>›</span>
        <a href="/teacher/reports" className="hover:text-foreground transition-colors">Reports</a>
        <span>›</span>
        <span className="text-foreground font-medium">{batchInfo.name}</span>
      </nav>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-2">
        {/* Title + tabs on same row on desktop */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="min-w-0">
            <h1 className="text-lg md:text-xl font-bold text-foreground truncate">
              {batchInfo.className} — {batchInfo.name}
            </h1>
            <p className="text-xs text-muted-foreground">Chapter-wise & exam performance</p>
          </div>
          <TabsList className="w-full sm:w-auto h-auto p-0.5 grid grid-cols-3 sm:flex sm:ml-auto">
            <TabsTrigger value="chapters" className="text-xs gap-1 px-2.5 py-1.5">
              <BookOpen className="w-3 h-3" />
              Chapters
            </TabsTrigger>
            <TabsTrigger value="exams" className="text-xs gap-1 px-2.5 py-1.5">
              <FileText className="w-3 h-3" />
              Exams ({allExamHistory.length})
            </TabsTrigger>
            <TabsTrigger value="students" className="text-xs gap-1 px-2.5 py-1.5">
              <Users className="w-3 h-3" />
              Students ({studentRoster.length})
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Today's Focus — always visible, between tabs and content */}
        {batchHealth && (
          <BatchHealthCard
            health={batchHealth}
            batchId={batchId}
            onNavigateToStudent={handleNavigateToStudent}
          />
        )}

        <TabsContent value="chapters" className="mt-0">
          <ChaptersTab chapters={chapters} batchId={batchId} />
        </TabsContent>

        <TabsContent value="exams" className="mt-0">
          <ExamsTab allExamHistory={allExamHistory} instituteTests={instituteTests} batchId={batchId} />
        </TabsContent>

        <TabsContent value="students" className="mt-0">
          <StudentsTab studentRoster={studentRoster} batchId={batchId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BatchReport;
