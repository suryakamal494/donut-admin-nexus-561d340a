import { useState, useMemo } from "react";
import { Sparkles, ChevronDown, ChevronUp, X, RotateCcw, Check, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { ChapterStudentBucket, ChapterTopicAnalysis } from "@/data/teacher/reportsData";

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

interface ChapterPracticeGeneratorProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  chapterName: string;
  subject: string;
  topics: ChapterTopicAnalysis[];
  buckets: ChapterStudentBucket[];
}

const bandMeta: Record<string, { dot: string; bg: string; tabBg: string; context: (topics: ChapterTopicAnalysis[]) => string }> = {
  mastery: {
    dot: "bg-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30", tabBg: "data-[state=active]:bg-emerald-100 dark:data-[state=active]:bg-emerald-900/40",
    context: (topics) => `Strong in all topics. Challenge with advanced/application-based questions. Strong topics: ${topics.filter(t => t.status === "strong").map(t => t.topicName).join(", ") || "all"}`,
  },
  stable: {
    dot: "bg-teal-500", bg: "bg-teal-50 dark:bg-teal-950/30", tabBg: "data-[state=active]:bg-teal-100 dark:data-[state=active]:bg-teal-900/40",
    context: (topics) => `Good understanding, needs reinforcement. Mix moderate and challenging questions. Focus: ${topics.filter(t => t.status === "moderate").map(t => t.topicName).join(", ") || "general review"}`,
  },
  reinforcement: {
    dot: "bg-amber-500", bg: "bg-amber-50 dark:bg-amber-950/30", tabBg: "data-[state=active]:bg-amber-100 dark:data-[state=active]:bg-amber-900/40",
    context: (topics) => {
      const weak = topics.filter(t => t.status === "weak").map(t => t.topicName);
      const mod = topics.filter(t => t.status === "moderate").map(t => t.topicName);
      return `Needs practice on fundamentals. Weak in: ${[...weak, ...mod].join(", ") || "multiple topics"}. Use easy-to-medium difficulty.`;
    },
  },
  risk: {
    dot: "bg-red-500", bg: "bg-red-50 dark:bg-red-950/30", tabBg: "data-[state=active]:bg-red-100 dark:data-[state=active]:bg-red-900/40",
    context: (topics) => {
      const weak = topics.filter(t => t.status === "weak").map(t => t.topicName);
      return `At risk — foundational gaps. Weak in: ${weak.join(", ") || "most topics"}. Generate easy conceptual questions to build confidence.`;
    },
  },
};

type Step = "configure" | "review" | "done";

export const ChapterPracticeGenerator = ({
  open, onOpenChange, chapterName, subject, topics, buckets,
}: ChapterPracticeGeneratorProps) => {
  const activeBuckets = useMemo(() => buckets.filter(b => b.count > 0), [buckets]);

  const [step, setStep] = useState<Step>("configure");
  const [commonInstructions, setCommonInstructions] = useState("");
  const [bandInstructions, setBandInstructions] = useState<Record<string, string>>({});
  const [expandedBands, setExpandedBands] = useState<Record<string, boolean>>({});
  const [questionCount, setQuestionCount] = useState<"5" | "10">("5");
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<Record<string, BandResult>>({});
  const [removedQuestions, setRemovedQuestions] = useState<Record<string, Set<string>>>({});
  const [assignedBands, setAssignedBands] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState(activeBuckets[0]?.key || "");

  const reset = () => {
    setStep("configure");
    setCommonInstructions("");
    setBandInstructions({});
    setExpandedBands({});
    setQuestionCount("5");
    setIsGenerating(false);
    setResults({});
    setRemovedQuestions({});
    setAssignedBands(new Set());
    setActiveTab(activeBuckets[0]?.key || "");
  };

  const handleClose = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

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
          chapter: chapterName,
          subject,
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
    // In a real implementation, this would save to database
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

  // ── Render helpers ──

  const renderConfigure = () => (
    <div className="space-y-4">
      {/* Active bands summary */}
      <div className="flex flex-wrap gap-2">
        {activeBuckets.map(b => (
          <div key={b.key} className={cn("flex items-center gap-1.5 text-xs font-medium rounded-full px-2.5 py-1", bandMeta[b.key]?.bg)}>
            <span className={cn("w-2 h-2 rounded-full", bandMeta[b.key]?.dot)} />
            {b.label} ({b.count})
          </div>
        ))}
      </div>

      {/* Question count */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Questions per band</Label>
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
      </div>

      {/* Common instructions */}
      <div>
        <Label className="text-sm font-medium mb-1.5 block">Instructions (optional)</Label>
        <Textarea
          placeholder="e.g., Focus on numerical problems, include diagram-based questions..."
          value={commonInstructions}
          onChange={e => setCommonInstructions(e.target.value)}
          className="min-h-[72px] text-sm"
        />
        <p className="text-[11px] text-muted-foreground mt-1">Applies to all bands. You can add band-specific instructions below.</p>
      </div>

      {/* Per-band instructions (expandable) */}
      <div className="space-y-1.5">
        {activeBuckets.map(b => (
          <div key={b.key} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedBands(prev => ({ ...prev, [b.key]: !prev[b.key] }))}
              className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-left hover:bg-muted/50"
            >
              <div className="flex items-center gap-1.5">
                <span className={cn("w-2 h-2 rounded-full", bandMeta[b.key]?.dot)} />
                {b.label} — specific instructions
              </div>
              {expandedBands[b.key] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {expandedBands[b.key] && (
              <div className="px-3 pb-2.5">
                <Textarea
                  placeholder={`e.g., For ${b.label}: focus on conceptual clarity...`}
                  value={bandInstructions[b.key] || ""}
                  onChange={e => setBandInstructions(prev => ({ ...prev, [b.key]: e.target.value }))}
                  className="min-h-[56px] text-xs"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-3">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start gap-1 h-auto flex-wrap bg-transparent p-0">
          {activeBuckets.map(b => {
            const qs = getActiveQuestions(b.key);
            const isAssigned = assignedBands.has(b.key);
            return (
              <TabsTrigger
                key={b.key}
                value={b.key}
                className={cn(
                  "text-xs gap-1 px-2.5 py-1.5 rounded-full border",
                  bandMeta[b.key]?.tabBg,
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
            <TabsContent key={b.key} value={b.key} className="mt-3 space-y-2">
              {bandResult?.error && (
                <p className="text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">{bandResult.error}</p>
              )}

              {isAssigned ? (
                <div className="flex items-center gap-2 py-4 justify-center text-sm text-emerald-600 dark:text-emerald-400">
                  <Check className="w-4 h-4" /> Assigned to {b.count} students
                </div>
              ) : (
                <>
                  <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
                    {(bandResult?.questions || []).map((q, idx) => {
                      const isRemoved = removed.has(q.id);
                      return (
                        <div
                          key={q.id}
                          className={cn(
                            "border rounded-lg p-3 text-sm transition-opacity",
                            isRemoved ? "opacity-40 bg-muted/30" : bandMeta[b.key]?.bg
                          )}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <p className="font-medium text-foreground text-sm leading-snug">
                              <span className="text-muted-foreground mr-1.5">Q{idx + 1}.</span>
                              {q.text}
                            </p>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 shrink-0"
                              onClick={() => toggleRemove(b.key, q.id)}
                            >
                              {isRemoved ? <RotateCcw className="w-3 h-3" /> : <X className="w-3 h-3" />}
                            </Button>
                          </div>
                          {!isRemoved && (
                            <>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-2">
                                {q.options.map(opt => (
                                  <div
                                    key={opt.label}
                                    className={cn(
                                      "text-xs rounded px-2 py-1.5",
                                      opt.label === q.correctAnswer
                                        ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-medium"
                                        : "bg-background"
                                    )}
                                  >
                                    <span className="font-medium mr-1">{opt.label}.</span> {opt.text}
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2 mt-1.5">
                                <span className="text-[10px] text-muted-foreground bg-muted/50 rounded-full px-2 py-0.5">{q.difficulty}</span>
                                <span className="text-[10px] text-muted-foreground bg-muted/50 rounded-full px-2 py-0.5">{q.topic}</span>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {qs.length > 0 && (
                    <Button
                      size="sm"
                      className="w-full gradient-button"
                      onClick={() => handleAssignBand(b.key)}
                    >
                      <Send className="w-3.5 h-3.5 mr-1.5" />
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

  const renderDone = () => {
    const totalAssigned = activeBuckets.reduce((sum, b) => sum + (assignedBands.has(b.key) ? getActiveQuestions(b.key).length : 0), 0);
    const totalStudents = activeBuckets.reduce((sum, b) => sum + (assignedBands.has(b.key) ? b.count : 0), 0);
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
          <Check className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <p className="font-semibold text-foreground">Practice Assigned!</p>
          <p className="text-sm text-muted-foreground mt-1">
            {assignedBands.size} practice set{assignedBands.size > 1 ? "s" : ""} created · {totalAssigned} questions · {totalStudents} students
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => handleClose(false)}>Done</Button>
      </div>
    );
  };

  const footer = step === "configure" ? (
    <Button
      className="w-full gradient-button"
      onClick={handleGenerate}
      disabled={isGenerating || activeBuckets.length === 0}
    >
      {isGenerating ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1.5" />}
      {isGenerating ? "Generating..." : `Generate ${parseInt(questionCount) * activeBuckets.length} Questions`}
    </Button>
  ) : step === "review" ? (
    <div className="flex gap-2 w-full">
      <Button variant="outline" size="sm" className="flex-1" onClick={() => { setStep("configure"); setResults({}); setRemovedQuestions({}); setAssignedBands(new Set()); }}>
        Back
      </Button>
      {!allAssigned && (
        <Button size="sm" className="flex-1 gradient-button" onClick={handleAssignAll}>
          <Send className="w-3.5 h-3.5 mr-1.5" />
          Assign All
        </Button>
      )}
      {allAssigned && (
        <Button size="sm" className="flex-1 gradient-button" onClick={() => setStep("done")}>
          <Check className="w-3.5 h-3.5 mr-1.5" />
          Done
        </Button>
      )}
    </div>
  ) : undefined;

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={handleClose}
      title={step === "done" ? "Practice Assigned" : step === "review" ? "Review Questions" : "Generate Practice"}
      description={step === "configure" ? `${chapterName} · ${subject}` : undefined}
      footer={footer}
      className={step === "review" ? "max-w-2xl" : undefined}
    >
      {step === "configure" && renderConfigure()}
      {step === "review" && renderReview()}
      {step === "done" && renderDone()}
    </ResponsiveDialog>
  );
};
