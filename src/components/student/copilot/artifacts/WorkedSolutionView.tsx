import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, Calculator } from "lucide-react";
import MathMarkdown from "../MathMarkdown";

interface SolutionStep {
  step_number: number;
  description: string;
  working: string;
}

interface WorkedSolutionContent {
  problem: string;
  given?: string;
  to_find?: string;
  steps: SolutionStep[];
  final_answer: string;
  common_mistakes?: string[];
  marks_breakdown?: { step: string; marks: number }[];
}

interface Props {
  content: WorkedSolutionContent;
}

export default function WorkedSolutionView({ content }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <Calculator className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm text-foreground">Worked Solution</h3>
      </div>

      <Card className="bg-muted/30">
        <CardContent className="p-3">
          <p className="text-xs font-medium text-muted-foreground mb-1">Problem</p>
          <MathMarkdown compact>{content.problem}</MathMarkdown>
        </CardContent>
      </Card>

      {(content.given || content.to_find) && (
        <div className="grid grid-cols-2 gap-2">
          {content.given && (
            <Card><CardContent className="p-2.5">
              <p className="text-[10px] font-medium text-muted-foreground mb-0.5">Given</p>
              <MathMarkdown compact className="text-xs">{content.given}</MathMarkdown>
            </CardContent></Card>
          )}
          {content.to_find && (
            <Card><CardContent className="p-2.5">
              <p className="text-[10px] font-medium text-muted-foreground mb-0.5">To Find</p>
              <MathMarkdown compact className="text-xs">{content.to_find}</MathMarkdown>
            </CardContent></Card>
          )}
        </div>
      )}

      <div className="space-y-2 border-l-2 border-primary/30 pl-3">
        {content.steps?.map((step, i) => (
          <div key={i} className="space-y-0.5">
            <p className="text-xs font-medium text-primary">Step {step.step_number ?? i + 1}: {step.description}</p>
            <MathMarkdown compact className="text-sm">{step.working}</MathMarkdown>
          </div>
        ))}
      </div>

      <Card className="border-emerald-500/30 bg-emerald-50/50">
        <CardContent className="p-3 flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-emerald-700 mb-0.5">Final Answer</p>
            <MathMarkdown compact>{content.final_answer}</MathMarkdown>
          </div>
        </CardContent>
      </Card>

      {content.common_mistakes && content.common_mistakes.length > 0 && (
        <Card className="border-amber-500/20 bg-amber-50/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
              <p className="text-xs font-medium text-amber-700">Common Mistakes</p>
            </div>
            <ul className="space-y-1">
              {content.common_mistakes.map((m, i) => (
                <li key={i} className="text-xs text-amber-800 flex items-start gap-1">
                  <span className="text-amber-400">•</span>
                  <MathMarkdown compact inline className="text-xs">{m}</MathMarkdown>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {content.marks_breakdown && content.marks_breakdown.length > 0 && (
        <Card>
          <CardContent className="p-3">
            <p className="text-xs font-medium text-muted-foreground mb-1.5">Marks Breakdown</p>
            <div className="space-y-1">
              {content.marks_breakdown.map((m, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span>{m.step}</span>
                  <span className="font-medium text-primary">{m.marks}M</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}