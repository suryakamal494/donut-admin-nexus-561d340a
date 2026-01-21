import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Clock,
  FileQuestion,
  Award,
  Eye,
  Edit,
  Copy,
  LayoutGrid,
  Sparkles,
  Building2,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  systemPresetPatterns,
  institutePatterns,
  ExamPattern,
  getPatternTotalQuestions,
  getPatternTotalMarks,
  formatDuration,
} from "@/data/examPatternsData";

const categoryConfig = {
  competitive: { 
    label: "Competitive", 
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    icon: Award,
  },
  board: { 
    label: "Board", 
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    icon: Building2,
  },
  custom: { 
    label: "Custom", 
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    icon: LayoutGrid,
  },
};

const Patterns = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Combine all patterns: standard first, then institute patterns
  const allPatterns = useMemo(() => {
    return [...systemPresetPatterns, ...institutePatterns];
  }, []);

  const filteredPatterns = useMemo(() => {
    return allPatterns.filter((pattern) =>
      pattern.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pattern.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pattern.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, allPatterns]);

  const renderPatternCard = (pattern: ExamPattern) => {
    const categoryInfo = categoryConfig[pattern.category];
    const CategoryIcon = categoryInfo.icon;
    const totalQuestions = getPatternTotalQuestions(pattern);
    const totalMarks = getPatternTotalMarks(pattern);
    const isEditable = !pattern.isSystemPreset;

    return (
      <Card 
        key={pattern.id} 
        className="group hover:shadow-lg transition-all duration-200 hover:border-primary/30 flex flex-col"
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <CardTitle className="text-sm sm:text-base font-semibold line-clamp-1">
                  {pattern.name}
                </CardTitle>
                {pattern.isSystemPreset ? (
                  <Badge variant="secondary" className="text-[10px] gap-1 shrink-0">
                    <Sparkles className="w-3 h-3" />
                    Standard
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] gap-1 shrink-0">
                    <Building2 className="w-3 h-3" />
                    Custom
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {pattern.description}
              </p>
            </div>
            <Badge className={cn("shrink-0 hidden sm:flex", categoryInfo.color)}>
              <CategoryIcon className="w-3 h-3 mr-1" />
              {categoryInfo.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 sm:space-y-4 flex-1 flex flex-col">
          {/* Subjects */}
          {pattern.hasFixedSubjects && pattern.subjects.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {pattern.subjects.slice(0, 3).map((subject) => (
                <Badge key={subject} variant="outline" className="text-[10px] capitalize">
                  {subject}
                </Badge>
              ))}
              {pattern.subjects.length > 3 && (
                <Badge variant="outline" className="text-[10px]">
                  +{pattern.subjects.length - 3}
                </Badge>
              )}
            </div>
          ) : (
            <Badge variant="secondary" className="text-[10px] w-fit">
              Any Subjects
            </Badge>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center">
            <div className="p-1.5 sm:p-2 rounded-lg bg-muted/50">
              <div className="flex items-center justify-center gap-1 text-xs sm:text-sm font-semibold">
                <FileQuestion className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground" />
                {totalQuestions}
              </div>
              <p className="text-[9px] sm:text-[10px] text-muted-foreground">Questions</p>
            </div>
            <div className="p-1.5 sm:p-2 rounded-lg bg-muted/50">
              <div className="flex items-center justify-center gap-1 text-xs sm:text-sm font-semibold">
                <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground" />
                {totalMarks}
              </div>
              <p className="text-[9px] sm:text-[10px] text-muted-foreground">Marks</p>
            </div>
            <div className="p-1.5 sm:p-2 rounded-lg bg-muted/50">
              <div className="flex items-center justify-center gap-1 text-xs sm:text-sm font-semibold">
                <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground" />
                <span className="truncate">{formatDuration(pattern.totalDuration)}</span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-muted-foreground">Duration</p>
            </div>
          </div>

          {/* Sections Summary */}
          <div className="text-[10px] sm:text-xs text-muted-foreground flex flex-wrap gap-x-2">
            <span>{pattern.sections.length} section{pattern.sections.length !== 1 ? 's' : ''}</span>
            {pattern.hasNegativeMarking && <span>• Negative</span>}
            {pattern.hasPartialMarking && <span>• Partial</span>}
          </div>

          {/* Tags - hidden on very small screens */}
          <div className="hidden sm:flex flex-wrap gap-1">
            {pattern.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Spacer to push actions to bottom */}
          <div className="flex-1" />

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 pt-2 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 h-8 sm:h-9 text-[10px] sm:text-xs px-2 sm:px-3"
              onClick={() => navigate(`/institute/exams-new/patterns/${pattern.id}/view`)}
            >
              <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
              View
            </Button>
            {isEditable ? (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 h-8 sm:h-9 text-[10px] sm:text-xs px-2 sm:px-3"
                onClick={() => navigate(`/institute/exams-new/patterns/${pattern.id}/edit`)}
              >
                <Edit className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
                Edit
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 h-8 sm:h-9 text-[10px] sm:text-xs px-2 sm:px-3"
                onClick={() => {/* Duplicate logic */}}
              >
                <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
                Copy
              </Button>
            )}
            <Button 
              size="sm" 
              className="h-8 sm:h-9 w-8 sm:w-9 p-0"
              onClick={() => navigate(`/institute/exams-new/create?patternId=${pattern.id}`)}
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in pb-20 sm:pb-6">
      <PageHeader
        title="Exam Patterns"
        description="Manage exam templates with predefined structures and rules"
        breadcrumbs={[
          { label: "Dashboard", href: "/institute/dashboard" },
          { label: "Exams New", href: "/institute/exams-new" },
          { label: "Patterns" },
        ]}
        actions={
          <Button 
            onClick={() => navigate("/institute/exams-new/patterns/create")}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create Pattern</span>
            <span className="sm:hidden">Create</span>
          </Button>
        }
      />

      {/* Search */}
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search patterns..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Pattern Cards Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredPatterns.map((pattern) => renderPatternCard(pattern))}
      </div>

      {/* Empty State */}
      {filteredPatterns.length === 0 && (
        <Card className="p-8 sm:p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-muted">
              <LayoutGrid className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">No patterns found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery 
                  ? "Try adjusting your search query" 
                  : "Create your first exam pattern to get started"}
              </p>
            </div>
            {!searchQuery && (
              <Button onClick={() => navigate("/institute/exams-new/patterns/create")}>
                <Plus className="w-4 h-4 mr-2" />
                Create Pattern
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Patterns;