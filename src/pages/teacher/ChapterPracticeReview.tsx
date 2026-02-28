import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Sparkles, ChevronDown, ChevronUp, X, RotateCcw, Check, Send, ArrowLeft, BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { batchInfoMap } from "@/data/teacher/examResults";
import { getChapterDetail } from "@/data/teacher/reportsData";
import type { ChapterTopicAnalysis } from "@/data/teacher/reportsData";
import { generateMockQuestions } from "@/data/teacher/mockPracticeQuestions";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// ── Types ──

interface GeneratedQuestion {
  id: string;
  text: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
  difficulty: string;
  topic: string;
}

interface BandResult {
  questions: GeneratedQuestion[];
  error?: string;
}

const allBandKeys = ["mastery", "stable", "reinforcement", "risk"] as const;

const bandMeta: Record<string, { label: string; dot: string; bg: string; tabBg: string; border: string; context: (topics: ChapterTopicAnalysis[]) => string }> = {
  mastery: {
    label: "Mastery Ready", dot: "bg-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-800",
    tabBg: "data-[state=active]:bg-emerald-100 dark:data-[state=active]:bg-emerald-900/40",
    context: (topics) => `Strong in all topics. Challenge with advanced/application-based questions. Strong topics: ${topics.filter(t => t.status === "strong").map(t => t.topicName).join(", ") || "all"}`,
  },
  stable: {
    label: "Stable Progress", dot: "bg-teal-500", bg: "bg-teal-50 dark:bg-teal-950/30", border: "border-teal-200 dark:border-teal-800",
    tabBg: "data-[state=active]:bg-teal-100 dark:data-[state=active]:bg-teal-900/40",
    context: (topics) => `Good understanding, needs reinforcement. Focus: ${topics.filter(t => t.status === "moderate").map(t => t.topicName).join(", ") || "general review"}`,
  },
  reinforcement: {
    label: "Reinforcement", dot: "bg-amber-500", bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-200 dark:border-amber-800",
    tabBg: "data-[state=active]:bg-amber-100 dark:data-[state=active]:bg-amber-900/40",
    context: (topics) => {
      const weak = topics.filter(t => t.status === "weak").map(t => t.topicName);
      const mod = topics.filter(t => t.status === "moderate").map(t => t.topicName);
      return `Needs practice on fundamentals. Weak in: ${[...weak, ...mod].join(", ") || "multiple topics"}. Use easy-to-medium difficulty.`;
    },
  },
  risk: {
    label: "Foundational Risk", dot: "bg-red-500", bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-200 dark:border-red-800",
    tabBg: "data-[state=active]:bg-red-100 dark:data-[state=active]:bg-red-900/40",
    context: (topics) => {
      const weak = topics.filter(t => t.status === "weak").map(t => t.topicName);
      return `At risk — foundational gaps. Weak in: ${weak.join(", ") || "most topics"}. Generate easy conceptual questions.`;
    },
  },
};

type Step = "configure" | "review" | "done";

const ChapterPracticeReview = () => {
  const { batchId, chapterId } = useParams<{ batchId: string; chapterId: string }>();
  const navigate = useNavigate();

  const batchInfo = batchId ? batchInfoMap[batchId] : null;
  const chapter = useMemo(
    () => (batchId && chapterId ? getChapterDetail(chapterId, batchId) : null),
    [batchId, chapterId]
  );

  // Always show all 4 bands with student counts from data (or 0)
  const bandList = useMemo(() => {
    const buckets = chapter?.studentBuckets || [];
    return allBandKeys.map(key => {
      const found = buckets.find(b => b.key === key);
      return {
        key,
        label: bandMeta[key].label,
        count: found?.count ?? 0,
      };
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
    const mockResults = generateMockQuestions(
      allBandKeys as unknown as string[],
      parseInt(questionCount)
    );
    setResults(mockResults);
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

  const getActiveQuestions = (bandKey: string) => {
    const all = results[bandKey]?.questions || [];
    const removed = removedQuestions[bandKey] || new Set();
    return all.filter(q => !removed.has(q.id));
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
      if (!assignedBands.has(b.key) && getActiveQuestions(b.key).length > 0) {
        handleAssignBand(b.key);
      }
    });
    setStep("done");
  };

  const allAssigned = bandList.every(b => assignedBands.has(b.key) || getActiveQuestions(b.key).length === 0);
  const goBack = () => navigate(`/teacher/reports/${batchId}/chapters/${chapterId}`);
  const totalQ = parseInt(questionCount) * bandList.length;

  // ── Step 1: Configure — Single compact form ──
  const renderConfigure = () => (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Bands as inline chips */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">Performance Bands</p>
        <div className="flex flex-wrap gap-1.5">
          {bandList.map(b => (
            <div key={b.key} className={cn("flex items-center gap-1.5 text-xs font-medium rounded-full px-2.5 py-1 border", bandMeta[b.key]?.bg, bandMeta[b.key]?.border)}>
              <span className={cn("w-2 h-2 rounded-full", bandMeta[b.key]?.dot)} />
              {b.label} <span className="font-bold">{b.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Question count — inline */}
      <div className="flex items-center gap-3">
        <p className="text-xs font-medium text-muted-foreground shrink-0">Questions per band:</p>
        <RadioGroup value={questionCount} onValueChange={(v) => setQuestionCount(v as "5" | "10")} className="flex gap-3">
          <div className="flex items-center gap-1.5">
            <RadioGroupItem value="5" id="q5" className="w-3.5 h-3.5" />
            <Label htmlFor="q5" className="text-xs cursor-pointer">5</Label>
          </div>
          <div className="flex items-center gap-1.5">
            <RadioGroupItem value="10" id="q10" className="w-3.5 h-3.5" />
            <Label htmlFor="q10" className="text-xs cursor-pointer">10</Label>
          </div>
        </RadioGroup>
        <span className="text-xs text-muted-foreground ml-auto">{totalQ} total</span>
      </div>

      {/* Instructions — collapsible */}
      <div className="space-y-2">
        <Textarea
          placeholder="Instructions (optional) — e.g., Focus on numerical problems, include diagram-based questions..."
          value={commonInstructions}
          onChange={e => setCommonInstructions(e.target.value)}
          className="min-h-[56px] text-xs"
        />

        <Collapsible open={showPerBand} onOpenChange={setShowPerBand}>
          <CollapsibleTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            {showPerBand ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            Per-band instructions
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1.5 mt-2">
            {bandList.map(b => (
              <div key={b.key} className="flex items-start gap-2">
                <span className={cn("w-2 h-2 rounded-full mt-2 shrink-0", bandMeta[b.key]?.dot)} />
                <Textarea
                  placeholder={`${b.label} — specific instructions...`}
                  value={bandInstructions[b.key] || ""}
                  onChange={e => setBandInstructions(prev => ({ ...prev, [b.key]: e.target.value }))}
                  className="min-h-[40px] text-xs flex-1"
                />
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Generate button — always visible */}
      <Button className="w-full gradient-button h-10" onClick={handleGenerate}>
        <Sparkles className="w-4 h-4 mr-2" />
        Generate {totalQ} Questions
      </Button>
    </div>
  );

  // ── Step 2: Review — Compact cards + sticky band tabs ──
  const renderReview = () => (
    <div className="space-y-2">
      {/* Top actions */}
      <div className="flex items-center justify-between gap-2">
        <Button variant="ghost" size="sm" className="h-8 text-xs px-2" onClick={() => { setStep("configure"); setResults({}); setRemovedQuestions({}); setAssignedBands(new Set()); }}>
          <ArrowLeft className="w-3 h-3 mr-1" /> Configure
        </Button>
        {!allAssigned ? (
          <Button size="sm" className="gradient-button h-8 text-xs" onClick={handleAssignAll}>
            <Send className="w-3 h-3 mr-1" /> Assign All
          </Button>
        ) : (
          <Button size="sm" className="gradient-button h-8 text-xs" onClick={() => setStep("done")}>
            <Check className="w-3 h-3 mr-1" /> Done
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Sticky band tabs */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm pb-2 -mx-1 px-1">
          <TabsList className="w-full justify-start gap-1 h-auto flex-wrap bg-transparent p-0">
            {bandList.map(b => {
              const qs = getActiveQuestions(b.key);
              const isAssigned = assignedBands.has(b.key);
              return (
                <TabsTrigger
                  key={b.key}
                  value={b.key}
                  className={cn(
                    "text-[11px] gap-1 px-2 py-1.5 rounded-full border",
                    bandMeta[b.key]?.tabBg,
                    bandMeta[b.key]?.border,
                    isAssigned && "opacity-50"
                  )}
                >
                  <span className={cn("w-1.5 h-1.5 rounded-full", bandMeta[b.key]?.dot)} />
                  {b.label} ({qs.length})
                  {isAssigned && <Check className="w-2.5 h-2.5 text-emerald-500" />}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {bandList.map(b => {
          const bandResult = results[b.key];
          const qs = getActiveQuestions(b.key);
          const removed = removedQuestions[b.key] || new Set();
          const isAssigned = assignedBands.has(b.key);

          return (
            <TabsContent key={b.key} value={b.key} className="mt-0 space-y-1">
              {bandResult?.error && (
                <p className="text-xs text-destructive bg-destructive/10 rounded px-3 py-2">{bandResult.error}</p>
              )}

              {isAssigned ? (
                <div className="flex items-center gap-2 py-6 justify-center text-sm text-emerald-600 dark:text-emerald-400">
                  <Check className="w-4 h-4" /> Assigned to {b.count} students
                </div>
              ) : (
                <>
                  {/* Compact question cards — inline options */}
                  <div className="divide-y divide-border">
                    {(bandResult?.questions || []).map((q, idx) => {
                      const isRemoved = removed.has(q.id);
                      return (
                        <div key={q.id} className={cn("py-2.5 px-1", isRemoved && "opacity-30")}>
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs sm:text-sm text-foreground leading-snug flex-1">
                              <span className="text-muted-foreground font-medium mr-1">Q{idx + 1}.</span>
                              {q.text}
                            </p>
                            <button
                              className="shrink-0 p-1 rounded hover:bg-muted transition-colors"
                              onClick={() => toggleRemove(b.key, q.id)}
                            >
                              {isRemoved ? <RotateCcw className="w-3 h-3 text-muted-foreground" /> : <X className="w-3 h-3 text-muted-foreground" />}
                            </button>
                          </div>
                          {!isRemoved && (
                            <>
                              {/* Inline options: A/B/C/D on one or two rows */}
                              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5 ml-5">
                                {q.options.map(opt => (
                                  <span
                                    key={opt.label}
                                    className={cn(
                                      "text-[11px] sm:text-xs",
                                      opt.label === q.correctAnswer
                                        ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                                        : "text-muted-foreground"
                                    )}
                                  >
                                    {opt.label === q.correctAnswer ? "✓" : ""}{opt.label}. {opt.text}
                                  </span>
                                ))}
                              </div>
                              <div className="flex gap-1.5 mt-1 ml-5">
                                <span className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">{q.difficulty}</span>
                                <span className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">{q.topic}</span>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {qs.length > 0 && (
                    <Button className="w-full gradient-button h-9 text-xs mt-2" onClick={() => handleAssignBand(b.key)}>
                      <Send className="w-3 h-3 mr-1.5" />
                      Assign {qs.length} questions to {b.count} students
                    </Button>
                  )}
                </>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );

  // ── Step 3: Done ──
  const renderDone = () => {
    const totalAssigned = bandList.reduce((sum, b) => sum + (assignedBands.has(b.key) ? getActiveQuestions(b.key).length : 0), 0);
    const totalStudents = bandList.reduce((sum, b) => sum + (assignedBands.has(b.key) ? b.count : 0), 0);
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 max-w-sm mx-auto">
        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
          <Check className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <p className="text-base font-semibold text-foreground">Practice Assigned!</p>
          <p className="text-xs text-muted-foreground mt-1">
            {assignedBands.size} sets · {totalAssigned} questions · {totalStudents} students
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={goBack}>
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Chapter
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-2 max-w-7xl mx-auto pb-20 md:pb-6">
      {/* Compact header */}
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
        <p className="text-xs text-muted-foreground">
          {chapter.chapterName} · {chapter.subject} · {batchInfo.className} {batchInfo.name}
        </p>
      </div>

      {step === "configure" && renderConfigure()}
      {step === "review" && renderReview()}
      {step === "done" && renderDone()}
    </div>
  );
};

export default ChapterPracticeReview;
