import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef, useCallback } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getInstituteBatchById, getExamsByBatch, getStudentsByBatch } from "@/data/institute/reportsData";
import SubjectOverviewCards from "@/components/institute/reports/SubjectOverviewCards";
import BatchExamsTab from "@/components/institute/reports/BatchExamsTab";
import BatchStudentsTab from "@/components/institute/reports/BatchStudentsTab";
import BatchHealthSummary from "@/components/institute/reports/BatchHealthSummary";
import SubjectComparisonChart from "@/components/institute/reports/SubjectComparisonChart";
import BatchAIInsights from "@/components/institute/reports/BatchAIInsights";
import BatchSummaryCard from "@/components/institute/reports/export/BatchSummaryCard";
import ExportDropdown from "@/components/institute/reports/export/ExportDropdown";
import { BookOpen, ClipboardList, Users } from "lucide-react";

const BatchReportDetail = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("subjects");
  const batchSummaryRef = useRef<HTMLDivElement>(null);
  const getBatchSummaryElement = useCallback(() => batchSummaryRef.current, []);

  const batch = batchId ? getInstituteBatchById(batchId) : undefined;
  const exams = batch ? getExamsByBatch(batch.batchId) : [];
  const students = batch ? getStudentsByBatch(batch.batchId) : [];

  if (!batch) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Batch not found.
      </div>
    );
  }

  const handleSubjectClick = (subjectId: string) => {
    navigate(`/institute/reports/batches/${batch.batchId}/subjects/${subjectId}`);
  };

  return (
    <div className="space-y-3 max-w-7xl mx-auto pb-6">
      {/* Compact header with inline stats */}
      <PageHeader
        title={`${batch.className} — ${batch.batchName}`}
        description={
          <span className="flex items-center gap-2 flex-wrap text-xs">
            <span>{batch.totalStudents} students</span>
            <span className="text-muted-foreground">·</span>
            <span>{batch.subjectCount} subjects</span>
            <span className="text-muted-foreground">·</span>
            <span className="font-semibold text-foreground">{batch.overallAverage}% avg</span>
            <span className="text-muted-foreground">·</span>
            <span>{batch.totalExams} exams</span>
          </span>
        }
        breadcrumbs={[
          { label: "Institute", href: "/institute" },
          { label: "Reports", href: "/institute/reports" },
          { label: "Batches", href: "/institute/reports/batches" },
          { label: `${batch.className} ${batch.batchName}` },
        ]}
        actions={
          <ExportDropdown
            getElement={getBatchSummaryElement}
            filename={`Batch-Summary-${batch.className}-${batch.batchName}`.replace(/\s+/g, "-")}
          />
        }
      />

      {/* Batch Health Summary — executive overview */}
      <BatchHealthSummary subjects={batch.subjects} students={students} />

      {/* AI Batch Insights — on-demand analysis */}
      <BatchAIInsights
        batchName={batch.batchName}
        className={batch.className}
        totalStudents={batch.totalStudents}
        overallAverage={batch.overallAverage}
        subjects={batch.subjects}
        students={students}
      />

      {/* Tabs — same row pattern as teacher BatchReport */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-3 h-9">
          <TabsTrigger value="subjects" className="text-xs sm:text-sm gap-1">
            <BookOpen className="w-3.5 h-3.5 hidden sm:inline" />
            Subjects
            <span className="text-[10px] text-muted-foreground ml-0.5">({batch.subjects.length})</span>
          </TabsTrigger>
          <TabsTrigger value="exams" className="text-xs sm:text-sm gap-1">
            <ClipboardList className="w-3.5 h-3.5 hidden sm:inline" />
            Exams
            <span className="text-[10px] text-muted-foreground ml-0.5">({exams.length})</span>
          </TabsTrigger>
          <TabsTrigger value="students" className="text-xs sm:text-sm gap-1">
            <Users className="w-3.5 h-3.5 hidden sm:inline" />
            Students
            <span className="text-[10px] text-muted-foreground ml-0.5">({students.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subjects" className="mt-3 space-y-3">
          <SubjectComparisonChart subjects={batch.subjects} />
          <SubjectOverviewCards
            subjects={batch.subjects}
            onSubjectClick={handleSubjectClick}
          />
        </TabsContent>

        <TabsContent value="exams" className="mt-3">
          <BatchExamsTab exams={exams} />
        </TabsContent>

        <TabsContent value="students" className="mt-3">
          <BatchStudentsTab students={students} batchId={batch.batchId} />
        </TabsContent>
      </Tabs>

      {/* Hidden printable batch summary */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <BatchSummaryCard
          ref={batchSummaryRef}
          className={batch.className}
          batchName={batch.batchName}
          overallAverage={batch.overallAverage}
          totalStudents={batch.totalStudents}
          totalExams={batch.totalExams}
          subjects={batch.subjects}
          students={students}
        />
      </div>
    </div>
  );
};

export default BatchReportDetail;
