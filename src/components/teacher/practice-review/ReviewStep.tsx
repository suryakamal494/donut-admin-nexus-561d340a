import { Check, X, RotateCcw, Send, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { bandMeta } from "./types";
import type { BandItem, BandResult, GeneratedQuestion } from "./types";

interface ReviewStepProps {
  bandList: BandItem[];
  results: Record<string, BandResult>;
  removedQuestions: Record<string, Set<string>>;
  assignedBands: Set<string>;
  activeTab: string;
  setActiveTab: (v: string) => void;
  totalRemovedCount: number;
  totalActiveQuestions: number;
  getActiveQuestions: (bandKey: string) => GeneratedQuestion[];
  toggleRemove: (bandKey: string, qId: string) => void;
  handleRegenerate: () => void;
  handleAssignAll: () => void;
  allAssigned: boolean;
  onReconfigure: () => void;
  onDone: () => void;
}

export function ReviewStep({
  bandList, results, removedQuestions, assignedBands, activeTab, setActiveTab,
  totalRemovedCount, totalActiveQuestions, getActiveQuestions, toggleRemove,
  handleRegenerate, handleAssignAll, allAssigned, onReconfigure, onDone,
}: ReviewStepProps) {
  return (
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

          {/* Regenerate bar */}
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
                  {(bandResult?.questions || []).map((q) => {
                    const isRemoved = removed.has(q.id);
                    if (isRemoved) return null;
                    const activeIdx = qs.findIndex(aq => aq.id === q.id);
                    return (
                      <Card key={q.id} className={cn(
                        "border shadow-sm transition-all",
                        bandMeta[b.key]?.border,
                        "hover:shadow-md"
                      )}>
                        <div className="p-3 sm:p-4">
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
            <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5" onClick={onReconfigure}>
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
              <Button size="sm" className="gradient-button h-9 px-4 text-xs gap-1.5" onClick={onDone}>
                <Check className="w-3.5 h-3.5" /> Done
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
