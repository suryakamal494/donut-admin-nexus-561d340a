import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Copy,
  ChevronDown,
  GripVertical,
  FileQuestion,
  Award,
  AlertCircle,
  CheckCircle2,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionDraft, QuestionTypeConfig } from "@/hooks/usePatternBuilder";
import { QuestionType, questionTypeLabels } from "@/data/examPatternsData";

interface SectionsStepProps {
  sections: SectionDraft[];
  hasFixedSubjects: boolean;
  subjects: string[];
  hasSectionWiseTime: boolean;
  hasUniformMarking: boolean;
  perSubjectQuestionCount: number;
  sectionValidationTarget: number;
  defaultMarksPerQuestion: number;
  hasNegativeMarking: boolean;
  defaultNegativeMarks: number;
  addSection: () => void;
  removeSection: (id: string) => void;
  updateSection: (id: string, updates: Partial<SectionDraft>) => void;
  duplicateSection: (id: string) => void;
  reorderSections: (newSections: SectionDraft[]) => void;
  canProceed: boolean;
  onNext: () => void;
  onBack: () => void;
}

const allQuestionTypes: QuestionType[] = [
  "single_correct",
  "multiple_correct",
  "integer",
  "numerical",
  "assertion_reasoning",
  "paragraph",
  "match_the_following",
  "fill_in_blanks",
  "short_answer",
  "long_answer",
  "true_false",
];

// ============================================
// Per-type config card
// ============================================

function QuestionTypeConfigCard({
  config,
  hasUniformMarking,
  globalMarks,
  hasGlobalNegative,
  globalNegative,
  onChange,
}: {
  config: QuestionTypeConfig;
  hasUniformMarking: boolean;
  globalMarks: number;
  hasGlobalNegative: boolean;
  globalNegative: number;
  onChange: (updated: QuestionTypeConfig) => void;
}) {
  return (
    <div className="p-3 rounded-lg border bg-muted/30 space-y-3">
      <p className="text-sm font-semibold">{questionTypeLabels[config.type]}</p>
      <div className="grid grid-cols-3 gap-3">
        {/* Questions */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Questions</Label>
          <Input
            type="number"
            value={config.count || ""}
            onChange={(e) =>
              onChange({ ...config, count: parseInt(e.target.value) || 0 })
            }
            placeholder="0"
            className="text-center h-9"
            min={0}
          />
        </div>
        {/* Marks per Question */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Marks/Q</Label>
          {hasUniformMarking ? (
            <div className="h-9 flex items-center justify-center text-sm font-medium text-muted-foreground bg-muted rounded-md border">
              {globalMarks}
            </div>
          ) : (
            <Input
              type="number"
              value={config.marksPerQuestion}
              onChange={(e) =>
                onChange({ ...config, marksPerQuestion: parseFloat(e.target.value) || 1 })
              }
              className="text-center h-9"
              min={0.5}
              step={0.5}
            />
          )}
        </div>
        {/* Negative Marks */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground flex items-center gap-1">
            <Minus className="w-3 h-3" />Negative
          </Label>
          <Input
            type="number"
            value={config.negativeMarks}
            onChange={(e) =>
              onChange({ ...config, negativeMarks: parseFloat(e.target.value) || 0 })
            }
            className="text-center h-9"
            min={0}
            step={0.25}
          />
        </div>
      </div>
      {hasUniformMarking && (
        <p className="text-[10px] text-muted-foreground italic">
          Marks set globally ({globalMarks}/question)
        </p>
      )}
    </div>
  );
}

// ============================================
// Sortable Section Card
// ============================================

interface SortableSectionCardProps {
  section: SectionDraft;
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  hasUniformMarking: boolean;
  hasSectionWiseTime: boolean;
  sectionsCount: number;
  globalMarks: number;
  hasGlobalNegative: boolean;
  globalNegative: number;
  updateSection: (id: string, updates: Partial<SectionDraft>) => void;
  duplicateSection: (id: string) => void;
  removeSection: (id: string) => void;
}

function SortableSectionCard({
  section,
  index,
  isExpanded,
  onToggleExpand,
  hasUniformMarking,
  hasSectionWiseTime,
  sectionsCount,
  globalMarks,
  hasGlobalNegative,
  globalNegative,
  updateSection,
  duplicateSection,
  removeSection,
}: SortableSectionCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const toggleQuestionType = (type: QuestionType) => {
    const isSelected = section.questionTypes.includes(type);
    let newTypes: QuestionType[];
    let newConfigs: QuestionTypeConfig[];

    if (isSelected) {
      newTypes = section.questionTypes.filter((t) => t !== type);
      newConfigs = section.questionTypeConfigs.filter((c) => c.type !== type);
    } else {
      newTypes = [...section.questionTypes, type];
      newConfigs = [
        ...section.questionTypeConfigs,
        {
          type,
          count: 0,
          marksPerQuestion: hasUniformMarking ? globalMarks : 4,
          negativeMarks: hasGlobalNegative ? globalNegative : 0,
        },
      ];
    }

    updateSection(section.id, {
      questionTypes: newTypes,
      questionTypeConfigs: newConfigs,
    });
  };

  const updateTypeConfig = (updated: QuestionTypeConfig) => {
    const newConfigs = section.questionTypeConfigs.map((c) =>
      c.type === updated.type ? updated : c
    );
    updateSection(section.id, { questionTypeConfigs: newConfigs });
  };

  // Section summary
  const totalQ = section.questionTypeConfigs.reduce((s, c) => s + c.count, 0);
  const totalM = section.questionTypeConfigs.reduce(
    (s, c) => s + c.count * (hasUniformMarking ? globalMarks : c.marksPerQuestion),
    0
  );

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "overflow-hidden transition-all",
        isDragging && "opacity-50 shadow-lg ring-2 ring-primary"
      )}
    >
      <Collapsible open={isExpanded && !isDragging} onOpenChange={onToggleExpand}>
        <CollapsibleTrigger asChild>
          <CardHeader className="p-3 sm:p-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                className="touch-none cursor-grab active:cursor-grabbing min-w-[44px] min-h-[44px] flex items-center justify-center rounded hover:bg-muted"
                {...attributes}
                {...listeners}
              >
                <GripVertical className="w-5 h-5 text-muted-foreground" />
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">{section.name}</CardTitle>
                  {section.isOptional && (
                    <Badge variant="secondary" className="text-xs">Optional</Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1">
                    <FileQuestion className="w-3 h-3" />
                    {totalQ} questions
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    {totalM} marks
                  </span>
                  {section.questionTypes.length > 0 && (
                    <span>{section.questionTypes.length} type{section.questionTypes.length > 1 ? "s" : ""}</span>
                  )}
                </div>
              </div>
              <ChevronDown
                className={cn(
                  "w-5 h-5 text-muted-foreground transition-transform shrink-0",
                  isExpanded && "rotate-180"
                )}
              />
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="p-3 sm:p-4 pt-0 space-y-4 border-t">
            {/* Section Name */}
            <div className="space-y-2">
              <Label>Section Name</Label>
              <Input
                value={section.name}
                onChange={(e) =>
                  updateSection(section.id, { name: e.target.value })
                }
                placeholder="Section A"
                maxLength={50}
              />
            </div>

            {/* Question Types Selector */}
            <div className="space-y-2">
              <Label>Question Types</Label>
              <div className="flex flex-wrap gap-2">
                {allQuestionTypes.map((type) => {
                  const isSelected = section.questionTypes.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleQuestionType(type)}
                      className={cn(
                        "px-3 py-2 min-h-[36px] sm:min-h-[32px] rounded-full text-xs font-medium transition-all",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80 text-muted-foreground"
                      )}
                    >
                      {questionTypeLabels[type]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Per-Type Configuration Cards */}
            {section.questionTypeConfigs.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm">Question Type Configuration</Label>
                {section.questionTypeConfigs.map((config) => (
                  <QuestionTypeConfigCard
                    key={config.type}
                    config={config}
                    hasUniformMarking={hasUniformMarking}
                    globalMarks={globalMarks}
                    hasGlobalNegative={hasGlobalNegative}
                    globalNegative={globalNegative}
                    onChange={updateTypeConfig}
                  />
                ))}
              </div>
            )}

            {/* Optional Section */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <Label htmlFor={`optional-${section.id}`}>Optional Section</Label>
                <p className="text-xs text-muted-foreground">
                  Students choose which questions to attempt
                </p>
              </div>
              <Switch
                id={`optional-${section.id}`}
                checked={section.isOptional}
                onCheckedChange={(checked) =>
                  updateSection(section.id, {
                    isOptional: checked,
                    attemptLimit: checked ? Math.min(totalQ, 5) : null,
                  })
                }
              />
            </div>

            {section.isOptional && (
              <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                <Label>Attempt Limit</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Answer any</span>
                  <Input
                    type="number"
                    value={section.attemptLimit || 5}
                    onChange={(e) =>
                      updateSection(section.id, {
                        attemptLimit: Math.min(
                          parseInt(e.target.value) || 1,
                          totalQ
                        ),
                      })
                    }
                    className="w-20 text-center"
                    min={1}
                    max={totalQ}
                  />
                  <span className="text-sm text-muted-foreground">
                    out of {totalQ}
                  </span>
                </div>
              </div>
            )}

            {/* Section Time (if enabled) */}
            {hasSectionWiseTime && (
              <div className="space-y-2">
                <Label>Section Time Limit (minutes)</Label>
                <Input
                  type="number"
                  value={section.timeLimit || ""}
                  onChange={(e) =>
                    updateSection(section.id, {
                      timeLimit: e.target.value ? parseInt(e.target.value) : null,
                    })
                  }
                  placeholder="No limit"
                  min={1}
                />
              </div>
            )}

            {/* Section Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => duplicateSection(section.id)}
                className="gap-1.5 h-10 sm:h-9 flex-1 sm:flex-none"
              >
                <Copy className="w-4 h-4" />
                Duplicate
              </Button>
              {sectionsCount > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeSection(section.id)}
                  className="gap-1.5 h-10 sm:h-9 flex-1 sm:flex-none text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </Button>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

function DragOverlayCard({ section, hasUniformMarking, globalMarks }: { section: SectionDraft; hasUniformMarking: boolean; globalMarks: number }) {
  const totalQ = section.questionTypeConfigs.reduce((s, c) => s + c.count, 0);
  const totalM = section.questionTypeConfigs.reduce(
    (s, c) => s + c.count * (hasUniformMarking ? globalMarks : c.marksPerQuestion), 0
  );
  return (
    <Card className="shadow-xl ring-2 ring-primary rotate-2 opacity-95">
      <CardHeader className="p-4">
        <div className="flex items-center gap-3">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">{section.name}</CardTitle>
              {section.isOptional && (
                <Badge variant="secondary" className="text-xs">Optional</Badge>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <FileQuestion className="w-3 h-3" />
                {totalQ} questions
              </span>
              <span className="flex items-center gap-1">
                <Award className="w-3 h-3" />
                {totalM} marks
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

// ============================================
// Main SectionsStep
// ============================================

export function SectionsStep({
  sections,
  hasFixedSubjects,
  subjects,
  hasSectionWiseTime,
  hasUniformMarking,
  perSubjectQuestionCount,
  sectionValidationTarget,
  defaultMarksPerQuestion,
  hasNegativeMarking,
  defaultNegativeMarks,
  addSection,
  removeSection,
  updateSection,
  duplicateSection,
  reorderSections,
  canProceed,
  onNext,
  onBack,
}: SectionsStepProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(
    sections.length > 0 ? [sections[0].id] : []
  );
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleExpanded = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Section question total
  const sectionQuestionTotal = sections.reduce(
    (sum, s) => sum + s.questionTypeConfigs.reduce((a, c) => a + c.count, 0),
    0
  );
  const target = sectionValidationTarget;
  const hasTarget = target > 0;
  const remaining = hasTarget ? target - sectionQuestionTotal : 0;
  const isMatched = hasTarget && sectionQuestionTotal === target;
  const isExceeded = hasTarget && sectionQuestionTotal > target;

  const targetLabel = hasFixedSubjects ? "per subject" : "total";

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      reorderSections(arrayMove(sections, oldIndex, newIndex));
    }
  };

  const activeSection = activeId ? sections.find((s) => s.id === activeId) : null;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Sections Configuration</h2>
        <p className="text-sm text-muted-foreground">
          Define sections with question types, counts, and marks. Same structure applies to all subjects.
        </p>
      </div>

      {/* Validation Banner */}
      {hasTarget && (
        <Card className={cn(
          "border",
          isMatched && "border-emerald-500/50 bg-emerald-500/5",
          isExceeded && "border-destructive/50 bg-destructive/5",
          !isMatched && !isExceeded && "border-primary/50 bg-primary/5"
        )}>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-3">
              {isMatched ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className={cn("w-5 h-5 shrink-0", isExceeded ? "text-destructive" : "text-primary")} />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Section total: {sectionQuestionTotal} / {target} {targetLabel}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isMatched
                    ? `✓ Section questions match ${targetLabel} count`
                    : isExceeded
                    ? `Exceeded by ${Math.abs(remaining)} questions — reduce section counts`
                    : `${remaining} more questions needed across sections`}
                </p>
              </div>
            </div>
            <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  isMatched && "bg-emerald-500",
                  isExceeded && "bg-destructive",
                  !isMatched && !isExceeded && "bg-primary"
                )}
                style={{ width: `${Math.min((sectionQuestionTotal / target) * 100, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Card */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold">{sections.length}</p>
            <p className="text-xs text-muted-foreground">Sections</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold">{sectionQuestionTotal}</p>
            <p className="text-xs text-muted-foreground">Questions</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold">
              {new Set(sections.flatMap((s) => s.questionTypes)).size}
            </p>
            <p className="text-xs text-muted-foreground">Types</p>
          </CardContent>
        </Card>
      </div>

      {/* Sections List with DnD */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={sections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {sections.map((section, index) => (
              <SortableSectionCard
                key={section.id}
                section={section}
                index={index}
                isExpanded={expandedSections.includes(section.id)}
                onToggleExpand={() => toggleExpanded(section.id)}
                hasUniformMarking={hasUniformMarking}
                hasSectionWiseTime={hasSectionWiseTime}
                sectionsCount={sections.length}
                globalMarks={defaultMarksPerQuestion}
                hasGlobalNegative={hasNegativeMarking}
                globalNegative={defaultNegativeMarks}
                updateSection={updateSection}
                duplicateSection={duplicateSection}
                removeSection={removeSection}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeSection ? (
            <DragOverlayCard
              section={activeSection}
              hasUniformMarking={hasUniformMarking}
              globalMarks={defaultMarksPerQuestion}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Add Section Button */}
      <Button
        type="button"
        variant="outline"
        onClick={addSection}
        className="w-full gap-2 h-11 border-dashed"
      >
        <Plus className="w-4 h-4" />
        Add Section
      </Button>

      {/* Navigation */}
      <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-4 border-t pb-20 sm:pb-0">
        <Button variant="outline" onClick={onBack} className="h-11 sm:h-10">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={onNext} disabled={!canProceed} className="h-11 sm:h-10">
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
