import { useState, useMemo, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  Clock,
  FileQuestion,
  Award,
  Sparkles,
  Building2,
  Check,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ExamPattern,
  systemPresetPatterns,
  institutePatterns,
  getPatternTotalQuestions,
  getPatternTotalMarks,
  formatDuration,
} from "@/data/examPatternsData";
import { useNavigate } from "react-router-dom";
import { UITypeSelector, type UIType } from "../UITypeSelector";

interface PatternSelectStepProps {
  selectedPatternId: string | null;
  selectedPattern: ExamPattern | null;
  onSelectPattern: (patternId: string) => void;
  selectedUIType: UIType;
  onSelectUIType: (type: UIType) => void;
  canSelectRealExamUI: boolean;
  canProceed: boolean;
  onNext: () => void;
  onBack: () => void;
}

export function PatternSelectStep({
  selectedPatternId,
  selectedPattern,
  onSelectPattern,
  selectedUIType,
  onSelectUIType,
  canSelectRealExamUI,
  canProceed,
  onNext,
  onBack,
}: PatternSelectStepProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const selectedPreviewRef = useRef<HTMLDivElement>(null);

  // Combine all patterns - Standard first, then Custom
  const allPatterns = useMemo(() => {
    const standardPatterns = systemPresetPatterns.map(p => ({ ...p, patternType: "standard" as const }));
    const customPatterns = institutePatterns.map(p => ({ ...p, patternType: "custom" as const }));
    return [...standardPatterns, ...customPatterns];
  }, []);

  // Filter patterns based on search query
  const filteredPatterns = useMemo(() => {
    if (!searchQuery) return allPatterns;
    
    return allPatterns.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, allPatterns]);

  // Handle pattern selection with auto-scroll
  const handleSelectPattern = useCallback((patternId: string) => {
    onSelectPattern(patternId);
    
    // Auto-scroll to preview section after selection
    setTimeout(() => {
      selectedPreviewRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
      });
    }, 100);
  }, [onSelectPattern]);

  const renderPatternCard = (pattern: ExamPattern & { patternType: "standard" | "custom" }) => {
    const isSelected = selectedPatternId === pattern.id;
    const totalQuestions = getPatternTotalQuestions(pattern);
    const totalMarks = getPatternTotalMarks(pattern);
    const isStandard = pattern.patternType === "standard";

    return (
      <Card
        key={pattern.id}
        className={cn(
          "cursor-pointer transition-all duration-200",
          isSelected
            ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary/20"
            : "hover:border-primary/50 hover:shadow-sm"
        )}
        onClick={() => handleSelectPattern(pattern.id)}
      >
        <CardContent className="p-3 sm:p-4">
          {/* Header with type badge */}
          <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
              {isStandard ? (
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
              ) : (
                <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
              )}
              <h4 className="font-medium text-xs sm:text-sm truncate">{pattern.name}</h4>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Badge 
                variant={isStandard ? "default" : "secondary"} 
                className="text-[8px] sm:text-[9px] px-1.5 py-0"
              >
                {isStandard ? "Standard" : "Custom"}
              </Badge>
              {isSelected && (
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary-foreground" />
                </div>
              )}
            </div>
          </div>

          <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2 mb-2 sm:mb-3">
            {pattern.description}
          </p>

          {/* Subjects */}
          <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
            {pattern.hasFixedSubjects ? (
              pattern.subjects.slice(0, 2).map((s) => (
                <Badge key={s} variant="outline" className="text-[9px] sm:text-[10px] capitalize px-1.5 bg-muted/50">
                  {s}
                </Badge>
              ))
            ) : (
              <Badge variant="outline" className="text-[9px] sm:text-[10px] px-1.5">
                Any Subjects
              </Badge>
            )}
            {pattern.hasFixedSubjects && pattern.subjects.length > 2 && (
              <Badge variant="outline" className="text-[9px] sm:text-[10px] px-1.5 bg-muted/50">
                +{pattern.subjects.length - 2}
              </Badge>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-muted-foreground">
            <span className="flex items-center gap-0.5 sm:gap-1">
              <FileQuestion className="w-3 h-3" />
              {totalQuestions}
            </span>
            <span className="flex items-center gap-0.5 sm:gap-1">
              <Award className="w-3 h-3" />
              {totalMarks}
            </span>
            <span className="flex items-center gap-0.5 sm:gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(pattern.totalDuration)}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  };

  const hasCustomPatterns = institutePatterns.length > 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg sm:text-xl font-semibold">Select Exam Pattern</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Choose a pattern that defines the structure of your exam
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search patterns..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-10 sm:h-11"
        />
      </div>

      {/* Unified Pattern Grid */}
      <ScrollArea className="h-[280px] sm:h-[320px] pr-2">
        <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2">
          {filteredPatterns.map(renderPatternCard)}
        </div>
        
        {filteredPatterns.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4 text-sm">No patterns found</p>
            {!hasCustomPatterns && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/institute/exams-new/patterns/create")}
                className="h-10 text-sm"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Create Custom Pattern
              </Button>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Create custom pattern link */}
      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/institute/exams-new/patterns/create")}
          className="text-xs text-muted-foreground hover:text-primary"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Create Custom Pattern
        </Button>
      </div>

      {/* Selected Pattern Preview */}
      <div ref={selectedPreviewRef}>
        {selectedPattern && (
          <div className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-200">
            <div className="p-3 sm:p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <Check className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">Selected: {selectedPattern.name}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedPattern.sections.length} sections • {getPatternTotalQuestions(selectedPattern)} questions • {formatDuration(selectedPattern.totalDuration)}
              </p>
            </div>
            
            {/* UI Type Selector */}
            <UITypeSelector
              selectedUIType={selectedUIType}
              onSelectUIType={onSelectUIType}
              realExamUIAvailable={canSelectRealExamUI}
              realExamUILabel={selectedPattern.realExamUILabel}
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex flex-col-reverse sm:flex-row justify-between pt-4 border-t gap-3 pb-20 sm:pb-0">
        <Button variant="outline" onClick={onBack} className="h-11 sm:h-10 text-sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={onNext} disabled={!canProceed} className="h-11 sm:h-10 text-sm">
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
