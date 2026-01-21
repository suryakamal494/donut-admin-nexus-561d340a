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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionDraft, availableSubjects } from "@/hooks/usePatternBuilder";
import { QuestionType, questionTypeLabels } from "@/data/examPatternsData";

interface SectionsStepProps {
  sections: SectionDraft[];
  hasFixedSubjects: boolean;
  subjects: string[];
  hasSectionWiseTime: boolean;
  hasUniformMarking: boolean;
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

interface SortableSectionCardProps {
  section: SectionDraft;
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  hasFixedSubjects: boolean;
  availableSubjectsForSection: { id: string; name: string }[];
  hasUniformMarking: boolean;
  hasSectionWiseTime: boolean;
  sectionsCount: number;
  updateSection: (id: string, updates: Partial<SectionDraft>) => void;
  duplicateSection: (id: string) => void;
  removeSection: (id: string) => void;
  toggleQuestionType: (sectionId: string, type: QuestionType) => void;
}

function SortableSectionCard({
  section,
  index,
  isExpanded,
  onToggleExpand,
  hasFixedSubjects,
  availableSubjectsForSection,
  hasUniformMarking,
  hasSectionWiseTime,
  sectionsCount,
  updateSection,
  duplicateSection,
  removeSection,
  toggleQuestionType,
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
          <CardHeader className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="touch-none cursor-grab active:cursor-grabbing p-1 -m-1 rounded hover:bg-muted"
                {...attributes}
                {...listeners}
              >
                <GripVertical className="w-4 h-4 text-muted-foreground" />
              </button>
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
                    {section.questionCount} questions
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    {section.marksPerQuestion} marks each
                  </span>
                </div>
              </div>
              <ChevronDown
                className={cn(
                  "w-5 h-5 text-muted-foreground transition-transform",
                  isExpanded && "rotate-180"
                )}
              />
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="p-4 pt-0 space-y-4 border-t">
            {/* Section Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              {/* Subject (if applicable) */}
              {hasFixedSubjects && (
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Select
                    value={section.subjectId || "none"}
                    onValueChange={(value) =>
                      updateSection(section.id, {
                        subjectId: value === "none" ? null : value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="none">Any Subject</SelectItem>
                      {availableSubjectsForSection.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Question Count */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Number of Questions</Label>
                <span className="text-sm font-medium">{section.questionCount}</span>
              </div>
              <Slider
                value={[section.questionCount]}
                onValueChange={([value]) =>
                  updateSection(section.id, { questionCount: value })
                }
                min={1}
                max={50}
                step={1}
              />
            </div>

            {/* Question Types */}
            <div className="space-y-2">
              <Label>Question Types</Label>
              <div className="flex flex-wrap gap-2">
                {allQuestionTypes.map((type) => {
                  const isSelected = section.questionTypes.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleQuestionType(section.id, type)}
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium transition-all",
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
                    attemptLimit: checked ? Math.min(section.questionCount, 5) : null,
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
                          section.questionCount
                        ),
                      })
                    }
                    className="w-20 text-center"
                    min={1}
                    max={section.questionCount}
                  />
                  <span className="text-sm text-muted-foreground">
                    out of {section.questionCount}
                  </span>
                </div>
              </div>
            )}

            {/* Marks per Question (if not uniform) */}
            {!hasUniformMarking && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Marks per Question</Label>
                  <Input
                    type="number"
                    value={section.marksPerQuestion}
                    onChange={(e) =>
                      updateSection(section.id, {
                        marksPerQuestion: parseFloat(e.target.value) || 1,
                      })
                    }
                    min={0.5}
                    step={0.5}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Negative Marks</Label>
                  <Input
                    type="number"
                    value={section.negativeMarks}
                    onChange={(e) =>
                      updateSection(section.id, {
                        negativeMarks: parseFloat(e.target.value) || 0,
                      })
                    }
                    min={0}
                    step={0.25}
                  />
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
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => duplicateSection(section.id)}
                className="gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                Duplicate
              </Button>
              {sectionsCount > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeSection(section.id)}
                  className="gap-1 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-3.5 h-3.5" />
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

// Drag overlay card (simplified version shown while dragging)
function DragOverlayCard({ section }: { section: SectionDraft }) {
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
                {section.questionCount} questions
              </span>
              <span className="flex items-center gap-1">
                <Award className="w-3 h-3" />
                {section.marksPerQuestion} marks each
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

export function SectionsStep({
  sections,
  hasFixedSubjects,
  subjects,
  hasSectionWiseTime,
  hasUniformMarking,
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
      activationConstraint: {
        distance: 8,
      },
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

  const toggleQuestionType = (sectionId: string, type: QuestionType) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;

    const newTypes = section.questionTypes.includes(type)
      ? section.questionTypes.filter((t) => t !== type)
      : [...section.questionTypes, type];

    updateSection(sectionId, { questionTypes: newTypes });
  };

  const availableSubjectsForSection = hasFixedSubjects
    ? availableSubjects.filter((s) => subjects.includes(s.id))
    : availableSubjects;

  // Calculate totals
  const totalQuestions = sections.reduce((total, section) => {
    if (section.isOptional && section.attemptLimit) {
      return total + section.attemptLimit;
    }
    return total + section.questionCount;
  }, 0);

  const totalMarks = sections.reduce((total, section) => {
    const count =
      section.isOptional && section.attemptLimit
        ? section.attemptLimit
        : section.questionCount;
    return total + count * section.marksPerQuestion;
  }, 0);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      const newSections = arrayMove(sections, oldIndex, newIndex);
      reorderSections(newSections);
    }
  };

  const activeSection = activeId ? sections.find((s) => s.id === activeId) : null;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Sections Configuration</h2>
        <p className="text-sm text-muted-foreground">
          Define sections with question counts and types. Drag to reorder.
        </p>
      </div>

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
            <p className="text-2xl font-bold">{totalQuestions}</p>
            <p className="text-xs text-muted-foreground">Questions</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold">{totalMarks}</p>
            <p className="text-xs text-muted-foreground">Marks</p>
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
                hasFixedSubjects={hasFixedSubjects}
                availableSubjectsForSection={availableSubjectsForSection}
                hasUniformMarking={hasUniformMarking}
                hasSectionWiseTime={hasSectionWiseTime}
                sectionsCount={sections.length}
                updateSection={updateSection}
                duplicateSection={duplicateSection}
                removeSection={removeSection}
                toggleQuestionType={toggleQuestionType}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeSection ? <DragOverlayCard section={activeSection} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Add Section Button */}
      <Button
        type="button"
        variant="outline"
        onClick={addSection}
        className="w-full gap-2 border-dashed"
      >
        <Plus className="w-4 h-4" />
        Add Section
      </Button>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={onNext} disabled={!canProceed}>
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
