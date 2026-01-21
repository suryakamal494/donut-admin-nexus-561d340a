import { useState, useMemo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import {
  Search,
  Trash2,
  Sparkles,
  Library,
  Upload,
  Calculator,
  Image,
  Filter,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { AddedQuestion, CreationMethod, availableSubjects } from "@/hooks/useExamCreationNew";
import { questionTypeLabels, QuestionType } from "@/data/examPatternsData";

interface AddedQuestionsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectionId: string | null; // null = show all sections
  sectionName: string;
  addedQuestions: AddedQuestion[];
  onRemoveQuestion: (questionId: string) => void;
}

// Source icons and labels
const sourceConfig: Record<CreationMethod, { icon: typeof Sparkles; label: string; color: string }> = {
  ai: { icon: Sparkles, label: "AI Generated", color: "bg-purple-100 text-purple-700" },
  bank: { icon: Library, label: "Question Bank", color: "bg-blue-100 text-blue-700" },
  pdf: { icon: Upload, label: "PDF Upload", color: "bg-orange-100 text-orange-700" },
};

const difficultyColors = {
  easy: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-rose-100 text-rose-700",
};

export function AddedQuestionsSheet({
  open,
  onOpenChange,
  sectionId,
  sectionName,
  addedQuestions,
  onRemoveQuestion,
}: AddedQuestionsSheetProps) {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<CreationMethod | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return addedQuestions.filter((q) => {
      // Filter by section if specified
      if (sectionId && q.sectionId !== sectionId && q.subject !== sectionId) return false;
      // Filter by search
      if (searchQuery && !q.text.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      // Filter by source
      if (sourceFilter && q.source !== sourceFilter) return false;
      return true;
    });
  }, [addedQuestions, sectionId, searchQuery, sourceFilter]);

  // Virtualizer for performance with large lists
  const virtualizer = useVirtualizer({
    count: filteredQuestions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // Estimated row height
    overscan: 5,
  });

  // Get subject name
  const getSubjectName = (id: string) => {
    return availableSubjects.find((s) => s.id === id)?.name || id;
  };

  // Question card renderer
  const renderQuestionCard = (question: AddedQuestion, index: number) => {
    const SourceIcon = sourceConfig[question.source].icon;

    return (
      <div
        key={question.id}
        className="p-3 border rounded-lg bg-card hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-start gap-3">
          {/* Index */}
          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0">
            <span className="text-[10px] font-medium">{index + 1}</span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Question text */}
            <p className="text-xs sm:text-sm line-clamp-2 mb-2">
              {question.text.replace(/\$[^$]+\$/g, "[formula]").substring(0, 120)}
              {question.text.length > 120 ? "..." : ""}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-1">
              {/* Subject */}
              <Badge variant="outline" className="text-[9px] capitalize px-1.5">
                {getSubjectName(question.subject)}
              </Badge>

              {/* Difficulty */}
              <Badge
                className={cn(
                  "text-[9px] px-1.5",
                  difficultyColors[question.difficulty as keyof typeof difficultyColors]
                )}
              >
                {question.difficulty}
              </Badge>

              {/* Type */}
              <Badge variant="secondary" className="text-[9px] px-1.5">
                {questionTypeLabels[question.type]}
              </Badge>

              {/* Source */}
              <Badge className={cn("text-[9px] px-1.5 gap-0.5", sourceConfig[question.source].color)}>
                <SourceIcon className="w-2.5 h-2.5" />
                {sourceConfig[question.source].label}
              </Badge>
            </div>

            {/* Marks */}
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-muted-foreground">
                {question.marks} marks
              </span>
            </div>
          </div>

          {/* Delete button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveQuestion(question.id);
            }}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    );
  };

  // Content shared between Sheet and Drawer
  const content = (
    <div className="flex flex-col h-full">
      {/* Filters */}
      <div className="space-y-2 mb-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10"
          />
        </div>

        {/* Source filter chips */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSourceFilter(null)}
            className={cn(
              "px-2.5 py-1.5 rounded-full text-xs font-medium transition-all",
              !sourceFilter
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            )}
          >
            All Sources
          </button>
          {(["ai", "bank", "pdf"] as CreationMethod[]).map((source) => {
            const config = sourceConfig[source];
            const Icon = config.icon;
            const count = addedQuestions.filter((q) => 
              (!sectionId || q.sectionId === sectionId || q.subject === sectionId) && 
              q.source === source
            ).length;

            return (
              <button
                key={source}
                onClick={() => setSourceFilter(sourceFilter === source ? null : source)}
                className={cn(
                  "px-2.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1",
                  sourceFilter === source
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                )}
              >
                <Icon className="w-3 h-3" />
                {config.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Questions list with virtualization */}
      <div ref={parentRef} className="flex-1 overflow-auto">
        {filteredQuestions.length > 0 ? (
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {virtualizer.getVirtualItems().map((virtualItem) => {
              const question = filteredQuestions[virtualItem.index];
              return (
                <div
                  key={virtualItem.key}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                  className="pb-2"
                >
                  {renderQuestionCard(question, virtualItem.index)}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Filter className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">No questions found</p>
            <p className="text-xs mt-1">
              {searchQuery || sourceFilter ? "Try adjusting your filters" : "Add questions to see them here"}
            </p>
          </div>
        )}
      </div>

      {/* Summary footer */}
      <div className="mt-4 pt-3 border-t flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Showing {filteredQuestions.length} of {addedQuestions.filter(q => 
            !sectionId || q.sectionId === sectionId || q.subject === sectionId
          ).length} questions
        </span>
        <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
          Done
        </Button>
      </div>
    </div>
  );

  // Mobile: Use Drawer
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="pb-2">
            <DrawerTitle className="text-base">{sectionName} Questions</DrawerTitle>
            <DrawerDescription className="text-xs">
              Review and manage questions added to this section
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4 flex-1 overflow-hidden flex flex-col" style={{ maxHeight: "calc(85vh - 80px)" }}>
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop: Use Sheet
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle>{sectionName} Questions</SheetTitle>
          <SheetDescription>
            Review and manage questions added to this section
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-hidden flex flex-col mt-4">
          {content}
        </div>
      </SheetContent>
    </Sheet>
  );
}
