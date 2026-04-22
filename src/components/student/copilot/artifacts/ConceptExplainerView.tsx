import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Lightbulb, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import MathMarkdown from "../MathMarkdown";

interface Step {
  title: string;
  explanation: string;
  hint?: string;
}

interface ConceptExplainerContent {
  topic: string;
  subject?: string;
  summary: string;
  steps: Step[];
  challenge?: string;
  key_takeaway?: string;
}

interface Props {
  content: ConceptExplainerContent;
}

export default function ConceptExplainerView({ content }: Props) {
  const [revealedSteps, setRevealedSteps] = useState<Set<number>>(new Set([0]));
  const [showChallenge, setShowChallenge] = useState(false);

  const toggleStep = (i: number) => {
    setRevealedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <BookOpen className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm text-foreground">{content.topic}</h3>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-3">
          <MathMarkdown compact>{content.summary}</MathMarkdown>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {content.steps?.map((step, i) => (
          <Card key={i} className="overflow-hidden">
            <button
              className="w-full flex items-center gap-2 p-3 text-left hover:bg-accent/50 transition-colors"
              onClick={() => toggleStep(i)}
            >
              {revealedSteps.has(i) ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
              <span className="text-xs font-medium text-primary">Step {i + 1}</span>
              <span className="text-sm font-medium text-foreground truncate">{step.title}</span>
            </button>
            {revealedSteps.has(i) && (
              <CardContent className="px-3 pb-3 pt-0 ml-6">
                <MathMarkdown compact>{step.explanation}</MathMarkdown>
                {step.hint && (
                  <div className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground bg-accent/30 rounded p-2">
                    <Lightbulb className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-500" />
                    <MathMarkdown compact className="text-xs">{step.hint}</MathMarkdown>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {content.challenge && (
        <div className="mt-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={() => setShowChallenge(!showChallenge)}
          >
            {showChallenge ? "Hide Challenge" : "🎯 Try It Yourself"}
          </Button>
          {showChallenge && (
            <Card className="mt-2 border-amber-500/30 bg-amber-50/50">
              <CardContent className="p-3">
                <MathMarkdown compact>{content.challenge}</MathMarkdown>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {content.key_takeaway && (
        <Card className="border-emerald-500/20 bg-emerald-50/50">
          <CardContent className="p-3">
            <p className="text-xs font-medium text-emerald-700 mb-1">Key Takeaway</p>
            <MathMarkdown compact>{content.key_takeaway}</MathMarkdown>
          </CardContent>
        </Card>
      )}
    </div>
  );
}