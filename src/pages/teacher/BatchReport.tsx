import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Users, BookOpen, FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/ui/page-header";
import { useState } from "react";
import { batchInfoMap } from "@/data/teacher/examResults";
import { getBatchChapters, getBatchExamHistory, getBatchInstituteTests } from "@/data/teacher/reportsData";
import { getBatchStudentRoster } from "@/data/teacher/studentReportData";
import { currentTeacher } from "@/data/teacher/profile";
import { InfoTooltip } from "@/components/timetable/InfoTooltip";
import { ChaptersTab, ExamsTab, StudentsTab } from "@/components/teacher/reports";

const BatchReport = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("chapters");

  const batchInfo = batchId ? batchInfoMap[batchId] : null;
  const chapters = useMemo(() => (batchId ? getBatchChapters(batchId) : []), [batchId]);
  const allExamHistory = useMemo(() => (batchId ? getBatchExamHistory(batchId) : []), [batchId]);
  const instituteTests = useMemo(() => (batchId ? getBatchInstituteTests(batchId, currentTeacher.subjects[0] || "Physics") : []), [batchId]);
  const studentRoster = useMemo(() => (batchId ? getBatchStudentRoster(batchId) : []), [batchId]);

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
    <div className="space-y-3 max-w-7xl mx-auto pb-20 md:pb-6">
      <PageHeader
        title={`${batchInfo.className} — ${batchInfo.name}`}
        description="Chapter-wise & exam performance"
        breadcrumbs={[
          { label: "Teacher", href: "/teacher" },
          { label: "Reports", href: "/teacher/reports" },
          { label: batchInfo.name },
        ]}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-3">
        <TabsList className="w-full sm:w-auto h-auto p-1 grid grid-cols-3 sm:flex max-w-md">
          <TabsTrigger value="chapters" className="text-xs sm:text-sm gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            Chapters
            <InfoTooltip content="Chapter-wise performance overview — average success rate, topic count, and weak areas for each chapter." />
          </TabsTrigger>
          <TabsTrigger value="exams" className="text-xs sm:text-sm gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            Exams ({allExamHistory.length})
            <InfoTooltip content="All completed exams for this batch — click any exam to view detailed results and analytics." />
          </TabsTrigger>
          <TabsTrigger value="students" className="text-xs sm:text-sm gap-1.5">
            <Users className="w-3.5 h-3.5" />
            Students ({studentRoster.length})
            <InfoTooltip content="Student-wise performance overview — click any student to see their detailed report across all chapters and exams." />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chapters">
          <ChaptersTab chapters={chapters} batchId={batchId} />
        </TabsContent>

        <TabsContent value="exams">
          <ExamsTab allExamHistory={allExamHistory} instituteTests={instituteTests} batchId={batchId} />
        </TabsContent>

        <TabsContent value="students">
          <StudentsTab studentRoster={studentRoster} batchId={batchId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BatchReport;
