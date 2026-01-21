import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface PatternSelectStepProps {
  selectedPatternId: string | null;
  selectedPattern: ExamPattern | null;
  onSelectPattern: (patternId: string) => void;
  canProceed: boolean;
  onNext: () => void;
  onBack: () => void;
}

export function PatternSelectStep({
  selectedPatternId,
  selectedPattern,
  onSelectPattern,
  canProceed,
  onNext,
  onBack,
}: PatternSelectStepProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("standard");

  const filteredStandardPatterns = useMemo(() => {
    return systemPresetPatterns.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const filteredInstitutePatterns = useMemo(() => {
    return institutePatterns.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const renderPatternCard = (pattern: ExamPattern) => {
    const isSelected = selectedPatternId === pattern.id;
    const totalQuestions = getPatternTotalQuestions(pattern);
    const totalMarks = getPatternTotalMarks(pattern);

    return (
      <Card
        key={pattern.id}
        className={cn(
          "cursor-pointer transition-all duration-200",
          isSelected
            ? "border-primary bg-primary/5 shadow-md"
            : "hover:border-primary/50 hover:shadow-sm"
        )}
        onClick={() => onSelectPattern(pattern.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              {pattern.isSystemPreset ? (
                <Sparkles className="w-4 h-4 text-amber-500" />
              ) : (
                <Building2 className="w-4 h-4 text-muted-foreground" />
              )}
              <h4 className="font-medium text-sm">{pattern.name}</h4>
            </div>
            {isSelected && (
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {pattern.description}
          </p>

          {/* Subjects */}
          <div className="flex flex-wrap gap-1 mb-3">
            {pattern.hasFixedSubjects ? (
              pattern.subjects.slice(0, 3).map((s) => (
                <Badge key={s} variant="secondary" className="text-[10px] capitalize">
                  {s}
                </Badge>
              ))
            ) : (
              <Badge variant="outline" className="text-[10px]">
                Any Subjects
              </Badge>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <FileQuestion className="w-3 h-3" />
              {totalQuestions}
            </span>
            <span className="flex items-center gap-1">
              <Award className="w-3 h-3" />
              {totalMarks}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(pattern.totalDuration)}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Select Exam Pattern</h2>
        <p className="text-sm text-muted-foreground">
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
          className="pl-9"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="standard" className="gap-1.5">
            <Sparkles className="w-4 h-4" />
            Standard
          </TabsTrigger>
          <TabsTrigger value="my-patterns" className="gap-1.5">
            <Building2 className="w-4 h-4" />
            My Patterns
          </TabsTrigger>
        </TabsList>

        <TabsContent value="standard" className="mt-4">
          <ScrollArea className="h-[300px] pr-2">
            <div className="grid gap-3 sm:grid-cols-2">
              {filteredStandardPatterns.map(renderPatternCard)}
            </div>
            {filteredStandardPatterns.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No patterns found
              </p>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="my-patterns" className="mt-4">
          <ScrollArea className="h-[300px] pr-2">
            <div className="grid gap-3 sm:grid-cols-2">
              {filteredInstitutePatterns.map(renderPatternCard)}
            </div>
            {filteredInstitutePatterns.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-3">No custom patterns yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/institute/exams-new/patterns/create")}
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Create Pattern
                </Button>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Selected Pattern Preview */}
      {selectedPattern && (
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Check className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">Selected: {selectedPattern.name}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {selectedPattern.sections.length} sections • {getPatternTotalQuestions(selectedPattern)} questions • {formatDuration(selectedPattern.totalDuration)}
          </p>
        </div>
      )}

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
