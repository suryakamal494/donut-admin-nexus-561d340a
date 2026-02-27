import { useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { batchInfoMap } from "@/data/teacher/examResults";
import { getChapterDetail } from "@/data/teacher/reportsData";
import {
  ChapterOverviewBanner, TopicHeatmapGrid,
  StudentBuckets, ChapterExamBreakdown,
} from "@/components/teacher/reports";
import { ChapterPracticeGenerator } from "@/components/teacher/reports/ChapterPracticeGenerator";

const ChapterReport = () => {
  const { batchId, chapterId } = useParams<{ batchId: string; chapterId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPracticeGenerator, setShowPracticeGenerator] = useState(false);

  const batchInfo = batchId ? batchInfoMap[batchId] : null;
  const chapter = useMemo(
    () => (batchId && chapterId ? getChapterDetail(chapterId, batchId) : null),
    [batchId, chapterId]
  );

  if (!chapter || !batchInfo) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-4">
        <BookOpen className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Chapter Not Found</h2>
        <Button onClick={() => navigate(batchId ? `/teacher/reports/${batchId}` : "/teacher/reports")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5 max-w-7xl mx-auto pb-20 md:pb-6">
      <PageHeader
        title={chapter.chapterName}
        description={`${chapter.subject} · ${batchInfo.className} ${batchInfo.name}`}
        breadcrumbs={[
          { label: "Teacher", href: "/teacher" },
          { label: "Reports", href: "/teacher/reports" },
          { label: batchInfo.name, href: `/teacher/reports/${batchId}` },
          { label: chapter.chapterName },
        ]}
      />

      <ChapterOverviewBanner
        chapterName={chapter.chapterName}
        overallSuccessRate={chapter.overallSuccessRate}
        examsCovering={chapter.examsCovering}
        totalQuestionsAsked={chapter.totalQuestionsAsked}
      />

      <TopicHeatmapGrid topics={chapter.topics} />

      <StudentBuckets
        buckets={chapter.studentBuckets}
        onGeneratePractice={() => setShowPracticeGenerator(true)}
      />

      <ChapterExamBreakdown
        examBreakdown={chapter.examBreakdown}
        batchId={batchId!}
        currentPath={location.pathname}
      />

      <ChapterPracticeGenerator
        open={showPracticeGenerator}
        onOpenChange={setShowPracticeGenerator}
        chapterName={chapter.chapterName}
        subject={chapter.subject}
        topics={chapter.topics}
        buckets={chapter.studentBuckets}
      />
    </div>
  );
};

export default ChapterReport;
