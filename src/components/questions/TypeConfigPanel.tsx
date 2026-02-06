import { useState, useEffect, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { QuestionType, questionTypeLabels } from "@/data/questionsData";
import { Settings2, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

// Types that need special config beyond just quantity
const COMPLEX_TYPES: QuestionType[] = ["paragraph", "matrix_match", "fill_blanks"];

// Sub-question types allowed inside a paragraph
const PARAGRAPH_SUB_TYPES: { id: QuestionType; label: string }[] = [
  { id: "mcq_single", label: "MCQ (Single)" },
  { id: "mcq_multiple", label: "MCQ (Multiple)" },
  { id: "numerical", label: "Numerical" },
  { id: "fill_blanks", label: "Fill in Blanks" },
  { id: "true_false", label: "True/False" },
];

export interface TypeConfig {
  mode: "auto" | "custom";
  typeDistribution: Partial<Record<QuestionType, number>>;
  paragraphConfig: {
    count: number;
    subQuestionsPerParagraph: number;
    subQuestionTypes: QuestionType[];
  };
  matrixConfig: {
    count: number;
    itemsPerColumn: number;
  };
  fillConfig: {
    count: number;
    blanksPerQuestion: number;
  };
}

const DEFAULT_CONFIG: TypeConfig = {
  mode: "auto",
  typeDistribution: {},
  paragraphConfig: {
    count: 1,
    subQuestionsPerParagraph: 3,
    subQuestionTypes: ["mcq_single"],
  },
  matrixConfig: {
    count: 1,
    itemsPerColumn: 4,
  },
  fillConfig: {
    count: 2,
    blanksPerQuestion: 2,
  },
};

interface TypeConfigPanelProps {
  selectedTypes: QuestionType[];
  totalCount: number;
  onConfigChange: (config: TypeConfig) => void;
}

export const TypeConfigPanel = ({
  selectedTypes,
  totalCount,
  onConfigChange,
}: TypeConfigPanelProps) => {
  const [config, setConfig] = useState<TypeConfig>(DEFAULT_CONFIG);
  const [isOpen, setIsOpen] = useState(false);

  const isCustom = config.mode === "custom";

  // Initialize distribution when types change
  useEffect(() => {
    if (isCustom && selectedTypes.length > 0) {
      const newDist: Partial<Record<QuestionType, number>> = {};

      // Override complex types from their configs first
      if (selectedTypes.includes("paragraph")) {
        const pConfig = config.paragraphConfig;
        newDist["paragraph"] = pConfig.count * pConfig.subQuestionsPerParagraph;
      }
      if (selectedTypes.includes("matrix_match")) {
        newDist["matrix_match"] = config.matrixConfig.count;
      }
      if (selectedTypes.includes("fill_blanks")) {
        newDist["fill_blanks"] = config.fillConfig.count;
      }

      // Calculate remaining budget for simple types
      const complexTotal = Object.values(newDist).reduce((sum, v) => sum + (v || 0), 0);
      const simpleSelectedTypes = selectedTypes.filter(t => !COMPLEX_TYPES.includes(t));
      const remaining = Math.max(0, totalCount - complexTotal);
      const perSimple = simpleSelectedTypes.length > 0 ? Math.max(1, Math.floor(remaining / simpleSelectedTypes.length)) : 0;

      simpleSelectedTypes.forEach((type, i) => {
        newDist[type] = i === 0
          ? Math.max(0, remaining - perSimple * (simpleSelectedTypes.length - 1))
          : perSimple;
      });

      setConfig((prev) => ({ ...prev, typeDistribution: newDist }));
    }
  }, [selectedTypes.join(","), isCustom]);

  // Notify parent on config change
  useEffect(() => {
    onConfigChange(config);
  }, [config]);

  const calculatedTotal = useMemo(() => {
    if (!isCustom) return totalCount;
    return Object.values(config.typeDistribution).reduce(
      (sum, v) => sum + (v || 0),
      0
    );
  }, [config.typeDistribution, isCustom, totalCount]);

  const updateDistribution = (type: QuestionType, value: number) => {
    setConfig((prev) => ({
      ...prev,
      typeDistribution: { ...prev.typeDistribution, [type]: Math.max(0, value) },
    }));
  };

  const updateParagraphConfig = (
    key: keyof TypeConfig["paragraphConfig"],
    value: any
  ) => {
    setConfig((prev) => {
      const newPConfig = { ...prev.paragraphConfig, [key]: value };
      const newDist = { ...prev.typeDistribution };
      newDist["paragraph"] =
        newPConfig.count * newPConfig.subQuestionsPerParagraph;
      return { ...prev, paragraphConfig: newPConfig, typeDistribution: newDist };
    });
  };

  const updateMatrixConfig = (
    key: keyof TypeConfig["matrixConfig"],
    value: number
  ) => {
    setConfig((prev) => {
      const newMConfig = { ...prev.matrixConfig, [key]: value };
      const newDist = { ...prev.typeDistribution };
      newDist["matrix_match"] = newMConfig.count;
      return { ...prev, matrixConfig: newMConfig, typeDistribution: newDist };
    });
  };

  const updateFillConfig = (
    key: keyof TypeConfig["fillConfig"],
    value: number
  ) => {
    setConfig((prev) => {
      const newFConfig = { ...prev.fillConfig, [key]: value };
      const newDist = { ...prev.typeDistribution };
      newDist["fill_blanks"] = newFConfig.count;
      return { ...prev, fillConfig: newFConfig, typeDistribution: newDist };
    });
  };

  const toggleSubQuestionType = (type: QuestionType) => {
    setConfig((prev) => {
      const current = prev.paragraphConfig.subQuestionTypes;
      const updated = current.includes(type)
        ? current.filter((t) => t !== type)
        : [...current, type];
      if (updated.length === 0) return prev; // keep at least one
      return {
        ...prev,
        paragraphConfig: { ...prev.paragraphConfig, subQuestionTypes: updated },
      };
    });
  };

  if (selectedTypes.length === 0) return null;

  // Simple types = everything except complex types
  const simpleTypes = selectedTypes.filter(
    (t) => !COMPLEX_TYPES.includes(t)
  );
  const complexSelected = selectedTypes.filter((t) =>
    COMPLEX_TYPES.includes(t)
  );

  return (
    <div className="space-y-3">
      {/* Toggle: Let AI Decide vs Custom Setup */}
      <div className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-muted/30">
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Custom Setup</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {isCustom ? "Manual" : "Let AI Decide"}
          </span>
          <Switch
            checked={isCustom}
            onCheckedChange={(checked) => {
              setConfig((prev) => ({
                ...prev,
                mode: checked ? "custom" : "auto",
                typeDistribution: checked ? prev.typeDistribution : {},
              }));
              if (checked) setIsOpen(true);
            }}
          />
        </div>
      </div>

      {/* Custom Setup Panel */}
      {isCustom && (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <button className="flex items-center justify-between w-full p-3 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
              <span className="text-sm font-medium text-primary">
                Type Distribution
              </span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  Total: {calculatedTotal}
                </Badge>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-primary" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-primary" />
                )}
              </div>
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="mt-2 space-y-1 rounded-xl border border-border/50 bg-card p-3 sm:p-4">
              {/* Simple types — just quantity */}
              {simpleTypes.map((type) => (
                <div
                  key={type}
                  className="flex items-center justify-between py-2.5 min-h-[44px] border-b border-border/30 last:border-b-0"
                >
                  <span className="text-xs sm:text-sm font-medium">
                    {questionTypeLabels[type]}
                  </span>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      max={50}
                      value={config.typeDistribution[type] ?? 0}
                      onChange={(e) =>
                        updateDistribution(type, parseInt(e.target.value) || 0)
                      }
                      className="w-16 h-8 sm:h-10 text-center text-sm"
                    />
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      questions
                    </span>
                  </div>
                </div>
              ))}

              {/* Paragraph config */}
              {selectedTypes.includes("paragraph") && (
                <div className="py-3 border-b border-border/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-primary">
                      Paragraph
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {(config.paragraphConfig.count *
                        config.paragraphConfig.subQuestionsPerParagraph)}{" "}
                      sub-questions
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pl-2">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        Paragraphs
                      </Label>
                      <Input
                        type="number"
                        min={1}
                        max={5}
                        value={config.paragraphConfig.count}
                        onChange={(e) =>
                          updateParagraphConfig(
                            "count",
                            Math.min(5, Math.max(1, parseInt(e.target.value) || 1))
                          )
                        }
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        Questions / paragraph
                      </Label>
                      <Input
                        type="number"
                        min={2}
                        max={5}
                        value={config.paragraphConfig.subQuestionsPerParagraph}
                        onChange={(e) =>
                          updateParagraphConfig(
                            "subQuestionsPerParagraph",
                            Math.min(5, Math.max(2, parseInt(e.target.value) || 2))
                          )
                        }
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>

                  <div className="pl-2 space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Sub-question types
                    </Label>
                    <div className="flex flex-wrap gap-1.5">
                      {PARAGRAPH_SUB_TYPES.map((sub) => (
                        <div
                          key={sub.id}
                          className={cn(
                            "flex items-center gap-1.5 px-2.5 py-2 min-h-[44px] rounded-lg border cursor-pointer transition-all text-xs",
                            config.paragraphConfig.subQuestionTypes.includes(
                              sub.id
                            )
                              ? "border-primary/30 bg-primary/5 text-primary"
                              : "border-border/50 hover:border-primary/20"
                          )}
                          onClick={() => toggleSubQuestionType(sub.id)}
                        >
                          <Checkbox
                            checked={config.paragraphConfig.subQuestionTypes.includes(
                              sub.id
                            )}
                            className="h-3.5 w-3.5"
                          />
                          <span>{sub.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Matrix Match config */}
              {selectedTypes.includes("matrix_match") && (
                <div className="py-3 border-b border-border/30 space-y-3">
                  <span className="text-sm font-semibold text-primary">
                    Matrix Match
                  </span>
                  <div className="grid grid-cols-2 gap-3 pl-2">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        Matrix questions
                      </Label>
                      <Input
                        type="number"
                        min={1}
                        max={5}
                        value={config.matrixConfig.count}
                        onChange={(e) =>
                          updateMatrixConfig(
                            "count",
                            Math.min(5, Math.max(1, parseInt(e.target.value) || 1))
                          )
                        }
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        Items per column
                      </Label>
                      <Input
                        type="number"
                        min={3}
                        max={5}
                        value={config.matrixConfig.itemsPerColumn}
                        onChange={(e) =>
                          updateMatrixConfig(
                            "itemsPerColumn",
                            Math.min(5, Math.max(3, parseInt(e.target.value) || 3))
                          )
                        }
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Fill in Blanks config */}
              {selectedTypes.includes("fill_blanks") && (
                <div className="py-3 border-b border-border/30 space-y-3">
                  <span className="text-sm font-semibold text-primary">
                    Fill in Blanks
                  </span>
                  <div className="grid grid-cols-2 gap-3 pl-2">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        Questions
                      </Label>
                      <Input
                        type="number"
                        min={1}
                        max={20}
                        value={config.fillConfig.count}
                        onChange={(e) =>
                          updateFillConfig(
                            "count",
                            Math.min(20, Math.max(1, parseInt(e.target.value) || 1))
                          )
                        }
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        Blanks per question
                      </Label>
                      <Input
                        type="number"
                        min={1}
                        max={3}
                        value={config.fillConfig.blanksPerQuestion}
                        onChange={(e) =>
                          updateFillConfig(
                            "blanksPerQuestion",
                            Math.min(3, Math.max(1, parseInt(e.target.value) || 1))
                          )
                        }
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Total summary */}
              <div className="flex items-center justify-between pt-3">
                <span className="text-sm font-semibold">Total Questions</span>
                <Badge
                  variant={calculatedTotal > 0 ? "default" : "destructive"}
                  className="text-sm px-3"
                >
                  {calculatedTotal}
                </Badge>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};
