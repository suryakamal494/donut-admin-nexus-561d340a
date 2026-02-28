import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { bandMeta } from "./types";
import type { BandItem } from "./types";

interface ConfigureStepProps {
  bandList: BandItem[];
  questionCount: "5" | "10";
  setQuestionCount: (v: "5" | "10") => void;
  commonInstructions: string;
  setCommonInstructions: (v: string) => void;
  bandInstructions: Record<string, string>;
  setBandInstructions: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  showPerBand: boolean;
  setShowPerBand: (v: boolean) => void;
  totalQ: number;
  chapterName: string;
  subject: string;
  className: string;
  batchName: string;
  onGenerate: () => void;
}

export function ConfigureStep({
  bandList, questionCount, setQuestionCount, commonInstructions, setCommonInstructions,
  bandInstructions, setBandInstructions, showPerBand, setShowPerBand, totalQ,
  chapterName, subject, className, batchName, onGenerate,
}: ConfigureStepProps) {
  return (
    <div className="max-w-2xl mx-auto pb-20">
      <Card className="border-border/60 shadow-sm">
        <CardHeader className={cn("pb-3 pt-4 px-4 sm:px-6 rounded-t-lg", "bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5")}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Configure Practice</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {chapterName} · {subject} · {className} {batchName}
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
          <Button className="gradient-button h-10 px-6" onClick={onGenerate}>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate {totalQ} Questions
          </Button>
        </div>
      </div>
    </div>
  );
}
