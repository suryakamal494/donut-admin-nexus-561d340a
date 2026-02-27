import { useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { batchInfoMap } from "@/data/teacher/examResults";
import { getChapterDetail } from "@/data/teacher/reportsData";
import type { ChapterStudentBucket } from "@/data/teacher/reportsData";
import { AIHomeworkGeneratorDialog } from "@/components/teacher/AIHomeworkGeneratorDialog";
import type { AIHomeworkPrefill } from "@/components/teacher/AIHomeworkGeneratorDialog";
import {
  ChapterOverviewBanner, TopicHeatmapGrid,
  StudentBuckets, ChapterExamBreakdown,
} from "@/components/teacher/reports";

const ChapterReport = () => {
  const { batchId, chapterId } = useParams<{ batchId: string; chapterId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [aiPrefill, setAiPrefill] = useState<AIHomeworkPrefill | undefined>();

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

  const handleGeneratePractice = (bucket: ChapterStudentBucket, e: React.MouseEvent) => {
    e.stopPropagation();
    const isUpperBand = bucket.key === "mastery" || bucket.key === "stable";
    const focusTopics = isUpperBand
      ? chapter.topics.filter(t => t.status === "strong").map(t => t.topicName)
      : [...chapter.topics.filter(t => t.status === "weak").map(t => t.topicName), ...chapter.topics.filter(t => t.status === "moderate").map(t => t.topicName)];
    const instructions = isUpperBand
      ? (bucket.key === "mastery"
        ? `Generate advanced/challenge-level practice for top performers on ${chapter.chapterName}. Topics: ${focusTopics.join(", ") || chapter.chapterName}.`
        : `Generate reinforcement practice to solidify understanding on ${chapter.chapterName}. Topics: ${focusTopics.join(", ") || chapter.chapterName}.`)
      : (focusTopics.length > 0
        ? `Focus on weak topics: ${focusTopics.join(", ")}. Generate practice for students in the "${bucket.label}" band.`
        : `Generate practice for "${bucket.label}" band — ${chapter.chapterName}.`);
    setAiPrefill({
      title: `${chapter.chapterName} Practice — ${bucket.label}`,
      subject: chapter.subject,
      batchId: batchId || "batch-10a",
      instructions,
      contextBanner: `Pre-filled from: ${chapter.chapterName} · ${bucket.label} · ${focusTopics.length} focus topic${focusTopics.length !== 1 ? "s" : ""}`,
    });
    setShowAIGenerator(true);
  };

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

      <StudentBuckets buckets={chapter.studentBuckets} onGeneratePractice={handleGeneratePractice} />

      <ChapterExamBreakdown
        examBreakdown={chapter.examBreakdown}
        batchId={batchId!}
        currentPath={location.pathname}
      />

      <AIHomeworkGeneratorDialog
        open={showAIGenerator}
        onOpenChange={(v) => { setShowAIGenerator(v); if (!v) setAiPrefill(undefined); }}
        prefill={aiPrefill}
      />
    </div>
  );
};

export default ChapterReport;
