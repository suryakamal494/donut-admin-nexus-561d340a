import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { batchInfoMap } from "@/data/teacher/examResults";
import { getChapterDetail } from "@/data/teacher/reportsData";
import { generateMockQuestions, getReplacementQuestions } from "@/data/teacher/mockPracticeQuestions";
import {
  ConfigureStep, ReviewStep, DoneStep,
  allBandKeys, bandMeta,
} from "@/components/teacher/practice-review";
import type { BandResult } from "@/components/teacher/practice-review";

type Step = "configure" | "review" | "done";

const ChapterPracticeReview = () => {
  const { batchId, chapterId } = useParams<{ batchId: string; chapterId: string }>();
  const navigate = useNavigate();

  const batchInfo = batchId ? batchInfoMap[batchId] : null;
  const chapter = useMemo(
    () => (batchId && chapterId ? getChapterDetail(chapterId, batchId) : null),
    [batchId, chapterId]
  );

  const bandList = useMemo(() => {
    const buckets = chapter?.studentBuckets || [];
    return allBandKeys.map(key => {
      const found = buckets.find(b => b.key === key);
      return { key, label: bandMeta[key].label, count: found?.count ?? 0 };
    });
  }, [chapter]);

  const [step, setStep] = useState<Step>("configure");
  const [commonInstructions, setCommonInstructions] = useState("");
  const [bandInstructions, setBandInstructions] = useState<Record<string, string>>({});
  const [showPerBand, setShowPerBand] = useState(false);
  const [questionCount, setQuestionCount] = useState<"5" | "10">("5");
  const [results, setResults] = useState<Record<string, BandResult>>({});
  const [removedQuestions, setRemovedQuestions] = useState<Record<string, Set<string>>>({});
  const [assignedBands, setAssignedBands] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<string>(allBandKeys[0]);

  const totalRemovedCount = useMemo(() =>
    Object.values(removedQuestions).reduce((sum, set) => sum + set.size, 0),
  [removedQuestions]);

  const getActiveQuestions = (bandKey: string) => {
    const all = results[bandKey]?.questions || [];
    const removed = removedQuestions[bandKey] || new Set();
    return all.filter(q => !removed.has(q.id));
  };

  const totalActiveQuestions = useMemo(() =>
    bandList.reduce((sum, b) => sum + getActiveQuestions(b.key).length, 0),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [results, removedQuestions, bandList]);

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

  const handleGenerate = () => {
    const mockResults = generateMockQuestions(allBandKeys as unknown as string[], parseInt(questionCount));
    setResults(mockResults);
    setRemovedQuestions({});
    setActiveTab(allBandKeys[0]);
    setStep("review");
    toast.success(`Generated ${parseInt(questionCount) * 4} questions across 4 bands`);
  };

  const toggleRemove = (bandKey: string, qId: string) => {
    setRemovedQuestions(prev => {
      const s = new Set(prev[bandKey] || []);
      s.has(qId) ? s.delete(qId) : s.add(qId);
      return { ...prev, [bandKey]: s };
    });
  };

  const handleRegenerate = () => {
    setResults(prev => {
      const next = { ...prev };
      for (const [bandKey, removedSet] of Object.entries(removedQuestions)) {
        if (removedSet.size === 0) continue;
        const currentQuestions = next[bandKey]?.questions || [];
        const activeIds = new Set(currentQuestions.filter(q => !removedSet.has(q.id)).map(q => q.id));
        const replacements = getReplacementQuestions(bandKey, activeIds, removedSet.size);
        next[bandKey] = {
          ...next[bandKey],
          questions: [...currentQuestions.filter(q => !removedSet.has(q.id)), ...replacements],
        };
      }
      return next;
    });
    const count = totalRemovedCount;
    setRemovedQuestions({});
    toast.success(`Regenerated ${count} question${count > 1 ? "s" : ""}`);
  };

  const handleAssignBand = (bandKey: string) => {
    const qs = getActiveQuestions(bandKey);
    if (qs.length === 0) return;
    setAssignedBands(prev => new Set([...prev, bandKey]));
    const band = bandList.find(b => b.key === bandKey);
    toast.success(`${qs.length} questions assigned to ${band?.count || 0} students in "${band?.label}"`);
  };

  const handleAssignAll = () => {
    bandList.forEach(b => {
      if (!assignedBands.has(b.key) && getActiveQuestions(b.key).length > 0) handleAssignBand(b.key);
    });
    setStep("done");
  };

  const allAssigned = bandList.every(b => assignedBands.has(b.key) || getActiveQuestions(b.key).length === 0);
  const goBack = () => navigate(`/teacher/reports/${batchId}/chapters/${chapterId}`);
  const totalQ = parseInt(questionCount) * bandList.length;

  const totalAssigned = bandList.reduce((sum, b) => sum + (assignedBands.has(b.key) ? getActiveQuestions(b.key).length : 0), 0);
  const totalStudents = bandList.reduce((sum, b) => sum + (assignedBands.has(b.key) ? b.count : 0), 0);

  return (
    <div className="space-y-2 max-w-7xl mx-auto pb-4 md:pb-6">
      <nav className="flex items-center gap-1 text-xs text-muted-foreground">
        <a href="/teacher/reports" className="hover:text-foreground transition-colors">Reports</a>
        <span>›</span>
        <a href={`/teacher/reports/${batchId}`} className="hover:text-foreground transition-colors">{batchInfo.name}</a>
        <span>›</span>
        <a href={`/teacher/reports/${batchId}/chapters/${chapterId}`} className="hover:text-foreground transition-colors">{chapter.chapterName}</a>
        <span>›</span>
        <span className="text-foreground font-medium">
          {step === "done" ? "Assigned" : step === "review" ? "Review" : "Generate"}
        </span>
      </nav>

      <div>
        <h1 className="text-lg font-bold text-foreground">
          {step === "done" ? "Practice Assigned" : step === "review" ? "Review Questions" : "Generate Practice"}
        </h1>
        {step !== "configure" && (
          <p className="text-xs text-muted-foreground">
            {chapter.chapterName} · {chapter.subject} · {batchInfo.className} {batchInfo.name}
          </p>
        )}
      </div>

      {step === "configure" && (
        <ConfigureStep
          bandList={bandList}
          questionCount={questionCount}
          setQuestionCount={setQuestionCount}
          commonInstructions={commonInstructions}
          setCommonInstructions={setCommonInstructions}
          bandInstructions={bandInstructions}
          setBandInstructions={setBandInstructions}
          showPerBand={showPerBand}
          setShowPerBand={setShowPerBand}
          totalQ={totalQ}
          chapterName={chapter.chapterName}
          subject={chapter.subject}
          className={batchInfo.className}
          batchName={batchInfo.name}
          onGenerate={handleGenerate}
        />
      )}

      {step === "review" && (
        <ReviewStep
          bandList={bandList}
          results={results}
          removedQuestions={removedQuestions}
          assignedBands={assignedBands}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          totalRemovedCount={totalRemovedCount}
          totalActiveQuestions={totalActiveQuestions}
          getActiveQuestions={getActiveQuestions}
          toggleRemove={toggleRemove}
          handleRegenerate={handleRegenerate}
          handleAssignAll={handleAssignAll}
          allAssigned={allAssigned}
          onReconfigure={() => { setStep("configure"); setResults({}); setRemovedQuestions({}); setAssignedBands(new Set()); }}
          onDone={() => setStep("done")}
        />
      )}

      {step === "done" && (
        <DoneStep
          assignedBandCount={assignedBands.size}
          totalAssigned={totalAssigned}
          totalStudents={totalStudents}
          onGoBack={goBack}
        />
      )}
    </div>
  );
};

export default ChapterPracticeReview;
