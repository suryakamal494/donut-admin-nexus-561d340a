import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import MathMarkdown from "../MathMarkdown";

interface Variable {
  symbol: string;
  name: string;
  unit?: string;
}

interface FormulaCard {
  name: string;
  expression: string;
  when_to_use: string;
  variables?: Variable[];
  unit?: string;
}

interface FormulaSheetContent {
  topic: string;
  subject?: string;
  formulas: FormulaCard[];
}

interface Props {
  content: FormulaSheetContent;
}

export default function FormulaSheetView({ content }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <FileText className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm text-foreground">{content.topic} — Formulas</h3>
      </div>

      <div className="grid gap-2">
        {content.formulas?.map((f, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-3 space-y-2">
              <p className="text-xs font-semibold text-foreground">{f.name}</p>
              <div className="bg-primary/5 rounded-md p-2 text-center">
                <MathMarkdown compact>{`$$${f.expression}$$`}</MathMarkdown>
              </div>
              <p className="text-[11px] text-muted-foreground italic">{f.when_to_use}</p>
              {f.variables && f.variables.length > 0 && (
                <div className="grid grid-cols-2 gap-1">
                  {f.variables.map((v, j) => (
                    <div key={j} className="flex items-center gap-1 text-[10px]">
                      <MathMarkdown compact inline className="text-[10px] font-mono">{`$${v.symbol}$`}</MathMarkdown>
                      <span className="text-muted-foreground">= {v.name}{v.unit ? ` (${v.unit})` : ""}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}