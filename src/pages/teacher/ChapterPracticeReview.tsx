import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Sparkles, ChevronDown, ChevronUp, X, RotateCcw, Check, Loader2, Send, ArrowLeft, BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { batchInfoMap } from "@/data/teacher/examResults";
import { getChapterDetail } from "@/data/teacher/reportsData";
import type { ChapterTopicAnalysis, ChapterStudentBucket } from "@/data/teacher/reportsData";

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

const bandMeta: Record<string, { dot: string; bg: string; tabBg: string; border: string; context: (topics: ChapterTopicAnalysis[]) => string }> = {
  mastery: {
    dot: "bg-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-800",
    tabBg: "data-[state=active]:bg-emerald-100 dark:data-[state=active]:bg-emerald-900/40",
    context: (topics) => `Strong in all topics. Challenge with advanced/application-based questions. Strong topics: ${topics.filter(t => t.status === "strong").map(t => t.topicName).join(", ") || "all"}`,
  },
  stable: {
    dot: "bg-teal-500", bg: "bg-teal-50 dark:bg-teal-950/30", border: "border-teal-200 dark:border-teal-800",
    tabBg: "data-[state=active]:bg-teal-100 dark:data-[state=active]:bg-teal-900/40",
    context: (topics) => `Good understanding, needs reinforcement. Focus: ${topics.filter(t => t.status === "moderate").map(t => t.topicName).join(", ") || "general review"}`,
  },
  reinforcement: {
    dot: "bg-amber-500", bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-200 dark:border-amber-800",
    tabBg: "data-[state=active]:bg-amber-100 dark:data-[state=active]:bg-amber-900/40",
    context: (topics) => {
      const weak = topics.filter(t => t.status === "weak").map(t => t.topicName);
      const mod = topics.filter(t => t.status === "moderate").map(t => t.topicName);
      return `Needs practice on fundamentals. Weak in: ${[...weak, ...mod].join(", ") || "multiple topics"}. Use easy-to-medium difficulty.`;
    },
  },
  risk: {
    dot: "bg-red-500", bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-200 dark:border-red-800",
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

  const activeBuckets = useMemo(
    () => (chapter?.studentBuckets || []).filter(b => b.count > 0),
    [chapter]
  );

  const [step, setStep] = useState<Step>("configure");
  const [commonInstructions, setCommonInstructions] = useState("");
  const [bandInstructions, setBandInstructions] = useState<Record<string, string>>({});
  const [expandedBands, setExpandedBands] = useState<Record<string, boolean>>({});
  const [questionCount, setQuestionCount] = useState<"5" | "10">("5");
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<Record<string, BandResult>>({});
  const [removedQuestions, setRemovedQuestions] = useState<Record<string, Set<string>>>({});
  const [assignedBands, setAssignedBands] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("");

  // Set initial active tab when buckets load
  useMemo(() => {
    if (activeBuckets.length > 0 && !activeTab) {
      setActiveTab(activeBuckets[0].key);
    }
  }, [activeBuckets]);

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

  const topics = chapter.topics;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const bandsPayload = activeBuckets.map(b => ({
        key: b.key,
        label: b.label,
        studentCount: b.count,
        questionCount: parseInt(questionCount),
        instructions: [commonInstructions, bandInstructions[b.key]].filter(Boolean).join(". "),
        context: bandMeta[b.key]?.context(topics) || "",
      }));

      const { data, error } = await supabase.functions.invoke("generate-chapter-practice", {
        body: {
          chapter: chapter.chapterName,
          subject: chapter.subject,
          bands: bandsPayload,
          topics: topics.map(t => ({ name: t.topicName, status: t.status, avgSuccessRate: t.avgSuccessRate })),
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResults(data.results || {});
      setActiveTab(activeBuckets[0]?.key || "");
      setStep("review");
    } catch (e: any) {
      console.error("Generation error:", e);
      toast.error(e.message || "Failed to generate practice questions");
    } finally {
      setIsGenerating(false);
    }
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
    const bucket = activeBuckets.find(b => b.key === bandKey);
    toast.success(`${qs.length} questions assigned to ${bucket?.count || 0} students in "${bucket?.label}"`);
  };

  const handleAssignAll = () => {
    activeBuckets.forEach(b => {
      if (!assignedBands.has(b.key) && getActiveQuestions(b.key).length > 0) {
        handleAssignBand(b.key);
      }
    });
    setStep("done");
  };

  const allAssigned = activeBuckets.every(b => assignedBands.has(b.key) || getActiveQuestions(b.key).length === 0);

  const goBack = () => navigate(`/teacher/reports/${batchId}/chapters/${chapterId}`);

  // ── Step 1: Configure ──
  const renderConfigure = () => (
    <div className="space-y-5 max-w-3xl mx-auto">
      {/* Band summary chips */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Performance Bands</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {activeBuckets.map(b => (
              <div key={b.key} className={cn("flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1.5 border", bandMeta[b.key]?.bg, bandMeta[b.key]?.border)}>
                <span className={cn("w-2.5 h-2.5 rounded-full", bandMeta[b.key]?.dot)} />
                {b.label}
                <span className="font-bold ml-0.5">{b.count}</span>
                <span className="text-muted-foreground">students</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Total: {activeBuckets.reduce((s, b) => s + b.count, 0)} students across {activeBuckets.length} bands
          </p>
        </CardContent>
      </Card>

      {/* Question count */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Questions per Band</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={questionCount} onValueChange={(v) => setQuestionCount(v as "5" | "10")} className="flex gap-4">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="5" id="q5" />
              <Label htmlFor="q5" className="text-sm">5 questions</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="10" id="q10" />
              <Label htmlFor="q10" className="text-sm">10 questions</Label>
            </div>
          </RadioGroup>
          <p className="text-xs text-muted-foreground mt-2">
            Will generate {parseInt(questionCount) * activeBuckets.length} questions total ({questionCount} × {activeBuckets.length} bands)
          </p>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Instructions (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">Common instructions — applies to all bands</Label>
            <Textarea
              placeholder="e.g., Focus on numerical problems, include diagram-based questions..."
              value={commonInstructions}
              onChange={e => setCommonInstructions(e.target.value)}
              className="min-h-[72px] text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground block">Per-band overrides</Label>
            {activeBuckets.map(b => (
              <div key={b.key} className={cn("rounded-lg border overflow-hidden", bandMeta[b.key]?.border)}>
                <button
                  onClick={() => setExpandedBands(prev => ({ ...prev, [b.key]: !prev[b.key] }))}
                  className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-left hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full", bandMeta[b.key]?.dot)} />
                    {b.label}
                  </div>
                  {expandedBands[b.key] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedBands[b.key] && (
                  <div className="px-3 pb-3">
                    <Textarea
                      placeholder={`e.g., For ${b.label}: focus on conceptual clarity...`}
                      value={bandInstructions[b.key] || ""}
                      onChange={e => setBandInstructions(prev => ({ ...prev, [b.key]: e.target.value }))}
                      className="min-h-[56px] text-sm"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button
        className="w-full gradient-button h-11"
        onClick={handleGenerate}
        disabled={isGenerating || activeBuckets.length === 0}
      >
        {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
        {isGenerating ? "Generating..." : `Generate ${parseInt(questionCount) * activeBuckets.length} Questions`}
      </Button>
    </div>
  );

  // ── Step 2: Review ──
  const renderReview = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Button variant="outline" size="sm" onClick={() => { setStep("configure"); setResults({}); setRemovedQuestions({}); setAssignedBands(new Set()); }}>
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Configure
        </Button>
        <div className="flex gap-2">
          {!allAssigned && (
            <Button size="sm" className="gradient-button" onClick={handleAssignAll}>
              <Send className="w-3.5 h-3.5 mr-1.5" /> Assign All Bands
            </Button>
          )}
          {allAssigned && (
            <Button size="sm" className="gradient-button" onClick={() => setStep("done")}>
              <Check className="w-3.5 h-3.5 mr-1.5" /> Done
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start gap-1 h-auto flex-wrap bg-transparent p-0 mb-4">
          {activeBuckets.map(b => {
            const qs = getActiveQuestions(b.key);
            const isAssigned = assignedBands.has(b.key);
            return (
              <TabsTrigger
                key={b.key}
                value={b.key}
                className={cn(
                  "text-xs sm:text-sm gap-1.5 px-3 py-2 rounded-full border",
                  bandMeta[b.key]?.tabBg,
                  bandMeta[b.key]?.border,
                  isAssigned && "opacity-60"
                )}
              >
                <span className={cn("w-2 h-2 rounded-full", bandMeta[b.key]?.dot)} />
                {b.label} ({qs.length})
                {isAssigned && <Check className="w-3 h-3 text-emerald-500" />}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {activeBuckets.map(b => {
          const bandResult = results[b.key];
          const qs = getActiveQuestions(b.key);
          const removed = removedQuestions[b.key] || new Set();
          const isAssigned = assignedBands.has(b.key);

          return (
            <TabsContent key={b.key} value={b.key} className="mt-0 space-y-3">
              {bandResult?.error && (
                <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-3">{bandResult.error}</p>
              )}

              {isAssigned ? (
                <Card>
                  <CardContent className="flex items-center gap-2 py-8 justify-center text-sm text-emerald-600 dark:text-emerald-400">
                    <Check className="w-5 h-5" /> Assigned to {b.count} students
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="grid gap-3">
                    {(bandResult?.questions || []).map((q, idx) => {
                      const isRemoved = removed.has(q.id);
                      return (
                        <Card
                          key={q.id}
                          className={cn(
                            "transition-opacity",
                            isRemoved ? "opacity-40" : ""
                          )}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <p className="font-medium text-foreground text-sm sm:text-base leading-relaxed">
                                <span className="text-muted-foreground mr-2">Q{idx + 1}.</span>
                                {q.text}
                              </p>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 shrink-0"
                                onClick={() => toggleRemove(b.key, q.id)}
                              >
                                {isRemoved ? <RotateCcw className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                              </Button>
                            </div>
                            {!isRemoved && (
                              <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                                  {q.options.map(opt => (
                                    <div
                                      key={opt.label}
                                      className={cn(
                                        "text-sm rounded-lg px-3 py-2 border",
                                        opt.label === q.correctAnswer
                                          ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-medium"
                                          : "bg-muted/30 border-border"
                                      )}
                                    >
                                      <span className="font-semibold mr-1.5">{opt.label}.</span> {opt.text}
                                    </div>
                                  ))}
                                </div>
                                <div className="flex gap-2 mt-3">
                                  <span className="text-xs text-muted-foreground bg-muted rounded-full px-2.5 py-1">{q.difficulty}</span>
                                  <span className="text-xs text-muted-foreground bg-muted rounded-full px-2.5 py-1">{q.topic}</span>
                                </div>
                              </>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {qs.length > 0 && (
                    <Button className="w-full gradient-button h-10" onClick={() => handleAssignBand(b.key)}>
                      <Send className="w-4 h-4 mr-2" />
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
    const totalAssigned = activeBuckets.reduce((sum, b) => sum + (assignedBands.has(b.key) ? getActiveQuestions(b.key).length : 0), 0);
    const totalStudents = activeBuckets.reduce((sum, b) => sum + (assignedBands.has(b.key) ? b.count : 0), 0);
    return (
      <Card className="max-w-lg mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
            <Check className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">Practice Assigned!</p>
            <p className="text-sm text-muted-foreground mt-1.5">
              {assignedBands.size} practice set{assignedBands.size > 1 ? "s" : ""} created · {totalAssigned} questions · {totalStudents} students
            </p>
          </div>
          <Button variant="outline" onClick={goBack}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Chapter Report
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-5 max-w-7xl mx-auto pb-20 md:pb-6">
      <PageHeader
        title={step === "done" ? "Practice Assigned" : step === "review" ? "Review Questions" : "Generate Practice"}
        description={`${chapter.chapterName} · ${chapter.subject} · ${batchInfo.className} ${batchInfo.name}`}
        breadcrumbs={[
          { label: "Reports", href: "/teacher/reports" },
          { label: batchInfo.name, href: `/teacher/reports/${batchId}` },
          { label: chapter.chapterName, href: `/teacher/reports/${batchId}/chapters/${chapterId}` },
          { label: step === "done" ? "Assigned" : step === "review" ? "Review" : "Generate Practice" },
        ]}
      />

      {step === "configure" && renderConfigure()}
      {step === "review" && renderReview()}
      {step === "done" && renderDone()}
    </div>
  );
};

export default ChapterPracticeReview;
