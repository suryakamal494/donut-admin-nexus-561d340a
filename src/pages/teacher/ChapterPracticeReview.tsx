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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { batchInfoMap } from "@/data/teacher/examResults";
import { getChapterDetail } from "@/data/teacher/reportsData";
import type { ChapterTopicAnalysis } from "@/data/teacher/reportsData";
import { generateMockQuestions, getReplacementQuestions } from "@/data/teacher/mockPracticeQuestions";
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

  // Count total removed across all bands — must be before early return
  const totalRemovedCount = useMemo(() => {
    return Object.values(removedQuestions).reduce((sum, set) => sum + set.size, 0);
  }, [removedQuestions]);

  const getActiveQuestions = (bandKey: string) => {
    const all = results[bandKey]?.questions || [];
    const removed = removedQuestions[bandKey] || new Set();
    return all.filter(q => !removed.has(q.id));
  };

  // Total active questions across all bands — must be before early return
  const totalActiveQuestions = useMemo(() => {
    return bandList.reduce((sum, b) => sum + getActiveQuestions(b.key).length, 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results, removedQuestions, bandList]);

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

  // Removed count for active band
  const activeRemovedCount = (removedQuestions[activeTab] || new Set()).size;

  const handleRegenerate = () => {
    // For each band with removed questions, get replacements
    setResults(prev => {
      const next = { ...prev };
      for (const [bandKey, removedSet] of Object.entries(removedQuestions)) {
        if (removedSet.size === 0) continue;
        const currentQuestions = next[bandKey]?.questions || [];
        const activeIds = new Set(currentQuestions.filter(q => !removedSet.has(q.id)).map(q => q.id));
        const replacements = getReplacementQuestions(bandKey, activeIds, removedSet.size);
        // Remove the deleted ones and append new ones
        next[bandKey] = {
          ...next[bandKey],
          questions: [
            ...currentQuestions.filter(q => !removedSet.has(q.id)),
            ...replacements,
          ],
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
      if (!assignedBands.has(b.key) && getActiveQuestions(b.key).length > 0) {
        handleAssignBand(b.key);
      }
    });
    setStep("done");
  };

  const allAssigned = bandList.every(b => assignedBands.has(b.key) || getActiveQuestions(b.key).length === 0);
  const goBack = () => navigate(`/teacher/reports/${batchId}/chapters/${chapterId}`);
  const totalQ = parseInt(questionCount) * bandList.length;


  // ── Step 1: Configure — Card container + Sticky bottom bar ──
  const renderConfigure = () => (
    <div className="max-w-2xl mx-auto pb-20">
      <Card className="border-border/60 shadow-sm">
        <CardHeader className={cn("pb-3 pt-4 px-4 sm:px-6 rounded-t-lg", "bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5")}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Configure Practice</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {chapter.chapterName} · {chapter.subject} · {batchInfo.className} {batchInfo.name}
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-5">
          {/* Performance Bands */}
          <div>
            <p className="text-xs font-semibold text-foreground mb-2.5">Performance Bands</p>
            <div className="flex flex-wrap gap-2">
              {bandList.map(b => (
                <div key={b.key} className={cn(
                  "flex items-center gap-2 text-xs font-medium rounded-lg px-3 py-2 border",
                  bandMeta[b.key]?.bg, bandMeta[b.key]?.border
                )}>
                  <span className={cn("w-2.5 h-2.5 rounded-full", bandMeta[b.key]?.dot)} />
                  <span>{b.label}</span>
                  <span className="font-bold text-foreground">{b.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border/50" />

          {/* Question count */}
          <div>
            <p className="text-xs font-semibold text-foreground mb-2.5">Questions per Band</p>
            <div className="flex items-center gap-4">
              <RadioGroup value={questionCount} onValueChange={(v) => setQuestionCount(v as "5" | "10")} className="flex gap-4">
                {["5", "10"].map(val => (
                  <div key={val} className="flex items-center gap-2">
                    <RadioGroupItem value={val} id={`q${val}`} className="w-4 h-4" />
                    <Label htmlFor={`q${val}`} className="text-sm cursor-pointer font-medium">{val} questions</Label>
                  </div>
                ))}
              </RadioGroup>
              <span className="text-xs text-muted-foreground ml-auto bg-muted px-2 py-1 rounded-md font-medium">
                {totalQ} total
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border/50" />

          {/* Instructions */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-foreground">Instructions <span className="font-normal text-muted-foreground">(optional)</span></p>
            <Textarea
              placeholder="e.g., Focus on numerical problems, include diagram-based questions, avoid repeated concepts..."
              value={commonInstructions}
              onChange={e => setCommonInstructions(e.target.value)}
              className="min-h-[64px] text-sm resize-none"
            />

            <Collapsible open={showPerBand} onOpenChange={setShowPerBand}>
              <CollapsibleTrigger className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors font-medium">
                {showPerBand ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                Band-specific instructions
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 mt-3">
                {bandList.map(b => (
                  <div key={b.key} className={cn("flex items-start gap-2.5 rounded-lg p-2.5 border", bandMeta[b.key]?.bg, bandMeta[b.key]?.border)}>
                    <span className={cn("w-2.5 h-2.5 rounded-full mt-2 shrink-0", bandMeta[b.key]?.dot)} />
                    <div className="flex-1">
                      <p className="text-[11px] font-medium text-foreground mb-1">{b.label}</p>
                      <Textarea
                        placeholder={`Instructions for ${b.label} group...`}
                        value={bandInstructions[b.key] || ""}
                        onChange={e => setBandInstructions(prev => ({ ...prev, [b.key]: e.target.value }))}
                        className="min-h-[40px] text-xs resize-none"
                      />
                    </div>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </CardContent>
      </Card>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground font-medium">
            {totalQ} questions · {bandList.length} bands
          </span>
          <Button className="gradient-button h-10 px-6" onClick={handleGenerate}>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate {totalQ} Questions
          </Button>
        </div>
      </div>
    </div>
  );

  // ── Step 2: Review — Individual question cards + sticky bottom bar ──
  const renderReview = () => (
    <div className="pb-20">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Sticky band tabs */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm pb-2 pt-1">
          <TabsList className="w-full justify-start gap-1.5 h-auto flex-wrap bg-transparent p-0">
            {bandList.map(b => {
              const qs = getActiveQuestions(b.key);
              const isAssigned = assignedBands.has(b.key);
              const removedCount = (removedQuestions[b.key] || new Set()).size;
              return (
                <TabsTrigger
                  key={b.key}
                  value={b.key}
                  className={cn(
                    "text-xs gap-1.5 px-3 py-2 rounded-lg border transition-all",
                    bandMeta[b.key]?.tabBg,
                    bandMeta[b.key]?.border,
                    isAssigned && "opacity-50"
                  )}
                >
                  <span className={cn("w-2 h-2 rounded-full", bandMeta[b.key]?.dot)} />
                  {b.label} ({qs.length})
                  {removedCount > 0 && <span className="text-destructive font-bold">-{removedCount}</span>}
                  {isAssigned && <Check className="w-3 h-3 text-emerald-500" />}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Regenerate bar — appears when questions are removed */}
          {totalRemovedCount > 0 && (
            <div className="mt-2 flex items-center justify-between bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
              <span className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                {totalRemovedCount} question{totalRemovedCount > 1 ? "s" : ""} removed across bands
              </span>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs gap-1.5 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40"
                onClick={handleRegenerate}
              >
                <RotateCcw className="w-3 h-3" />
                Regenerate {totalRemovedCount}
              </Button>
            </div>
          )}
        </div>

        {bandList.map(b => {
          const bandResult = results[b.key];
          const qs = getActiveQuestions(b.key);
          const removed = removedQuestions[b.key] || new Set();
          const isAssigned = assignedBands.has(b.key);

          return (
            <TabsContent key={b.key} value={b.key} className="mt-0">
              {bandResult?.error && (
                <p className="text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2 mb-2">{bandResult.error}</p>
              )}

              {isAssigned ? (
                <div className="flex items-center gap-2 py-8 justify-center text-sm text-emerald-600 dark:text-emerald-400">
                  <Check className="w-5 h-5" /> Assigned to {b.count} students
                </div>
              ) : (
                <div className="space-y-2.5 mt-1">
                  {(bandResult?.questions || []).map((q, idx) => {
                    const isRemoved = removed.has(q.id);
                    if (isRemoved) return null; // hide removed questions entirely
                    const activeIdx = qs.findIndex(aq => aq.id === q.id);
                    return (
                      <Card key={q.id} className={cn(
                        "border shadow-sm transition-all",
                        bandMeta[b.key]?.border,
                        "hover:shadow-md"
                      )}>
                        <div className="p-3 sm:p-4">
                          {/* Question header */}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="text-sm text-foreground leading-relaxed flex-1">
                              <span className={cn(
                                "inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-2 shrink-0",
                                bandMeta[b.key]?.bg, bandMeta[b.key]?.border, "border"
                              )}>
                                {activeIdx + 1}
                              </span>
                              {q.text}
                            </p>
                            <button
                              className="shrink-0 p-1.5 rounded-md hover:bg-destructive/10 transition-colors group"
                              onClick={() => toggleRemove(b.key, q.id)}
                              title="Remove question"
                            >
                              <X className="w-3.5 h-3.5 text-muted-foreground group-hover:text-destructive" />
                            </button>
                          </div>

                          {/* Options — inline but with clear visual treatment */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 ml-8">
                            {q.options.map(opt => (
                              <div
                                key={opt.label}
                                className={cn(
                                  "flex items-center gap-2 text-xs rounded-md px-2.5 py-1.5",
                                  opt.label === q.correctAnswer
                                    ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800"
                                    : "bg-muted/50 text-muted-foreground"
                                )}
                              >
                                <span className={cn(
                                  "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                                  opt.label === q.correctAnswer
                                    ? "bg-emerald-500 text-white"
                                    : "bg-muted text-muted-foreground"
                                )}>
                                  {opt.label}
                                </span>
                                {opt.text}
                              </div>
                            ))}
                          </div>

                          {/* Tags */}
                          <div className="flex gap-1.5 mt-2.5 ml-8">
                            <span className="text-[10px] text-muted-foreground bg-muted rounded-md px-2 py-0.5 font-medium">{q.difficulty}</span>
                            <span className="text-[10px] text-muted-foreground bg-muted rounded-md px-2 py-0.5 font-medium">{q.topic}</span>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5" onClick={() => { setStep("configure"); setResults({}); setRemovedQuestions({}); setAssignedBands(new Set()); }}>
              <ArrowLeft className="w-3 h-3" /> Reconfigure
            </Button>
            <span className="text-sm text-muted-foreground font-medium hidden sm:inline">
              {totalActiveQuestions} questions · {assignedBands.size}/{bandList.length} bands assigned
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground sm:hidden">
              {totalActiveQuestions}Q · {assignedBands.size}/{bandList.length}
            </span>
            {!allAssigned ? (
              <Button size="sm" className="gradient-button h-9 px-4 text-xs gap-1.5" onClick={handleAssignAll}>
                <Send className="w-3.5 h-3.5" /> Assign All Bands
              </Button>
            ) : (
              <Button size="sm" className="gradient-button h-9 px-4 text-xs gap-1.5" onClick={() => setStep("done")}>
                <Check className="w-3.5 h-3.5" /> Done
              </Button>
            )}
          </div>
        </div>
      </div>
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
    <div className="space-y-2 max-w-7xl mx-auto pb-4 md:pb-6">
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
        {step !== "configure" && (
          <p className="text-xs text-muted-foreground">
            {chapter.chapterName} · {chapter.subject} · {batchInfo.className} {batchInfo.name}
          </p>
        )}
      </div>

      {step === "configure" && renderConfigure()}
      {step === "review" && renderReview()}
      {step === "done" && renderDone()}
    </div>
  );
};

export default ChapterPracticeReview;
