import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [activeTab, setActiveTab] = useState("standard");

  const filteredStandardPatterns = useMemo(() => {
    return systemPresetPatterns.filter((pattern) =>
      pattern.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pattern.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pattern.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const filteredInstitutePatterns = useMemo(() => {
    return institutePatterns.filter((pattern) =>
      pattern.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pattern.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pattern.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const renderPatternCard = (pattern: ExamPattern, isEditable: boolean) => {
    const categoryInfo = categoryConfig[pattern.category];
    const CategoryIcon = categoryInfo.icon;
    const totalQuestions = getPatternTotalQuestions(pattern);
    const totalMarks = getPatternTotalMarks(pattern);

    return (
      <Card 
        key={pattern.id} 
        className="group hover:shadow-lg transition-all duration-200 hover:border-primary/30"
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-base font-semibold line-clamp-1">
                  {pattern.name}
                </CardTitle>
                {pattern.isSystemPreset && (
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                )}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {pattern.description}
              </p>
            </div>
            <Badge className={cn("shrink-0", categoryInfo.color)}>
              <CategoryIcon className="w-3 h-3 mr-1" />
              {categoryInfo.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Subjects */}
          {pattern.hasFixedSubjects && pattern.subjects.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {pattern.subjects.map((subject) => (
                <Badge key={subject} variant="outline" className="text-xs capitalize">
                  {subject}
                </Badge>
              ))}
            </div>
          ) : (
            <Badge variant="secondary" className="text-xs">
              Any Subjects
            </Badge>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-lg bg-muted/50">
              <div className="flex items-center justify-center gap-1 text-sm font-semibold">
                <FileQuestion className="w-3.5 h-3.5 text-muted-foreground" />
                {totalQuestions}
              </div>
              <p className="text-[10px] text-muted-foreground">Questions</p>
            </div>
            <div className="p-2 rounded-lg bg-muted/50">
              <div className="flex items-center justify-center gap-1 text-sm font-semibold">
                <Award className="w-3.5 h-3.5 text-muted-foreground" />
                {totalMarks}
              </div>
              <p className="text-[10px] text-muted-foreground">Marks</p>
            </div>
            <div className="p-2 rounded-lg bg-muted/50">
              <div className="flex items-center justify-center gap-1 text-sm font-semibold">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                {formatDuration(pattern.totalDuration)}
              </div>
              <p className="text-[10px] text-muted-foreground">Duration</p>
            </div>
          </div>

          {/* Sections Summary */}
          <div className="text-xs text-muted-foreground">
            {pattern.sections.length} section{pattern.sections.length !== 1 ? 's' : ''} 
            {pattern.hasNegativeMarking && (
              <span className="ml-2">• Negative Marking</span>
            )}
            {pattern.hasPartialMarking && (
              <span className="ml-2">• Partial Marking</span>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {pattern.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 h-8 text-xs"
              onClick={() => navigate(`/institute/exams-new/patterns/${pattern.id}/view`)}
            >
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              View
            </Button>
            {isEditable ? (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 h-8 text-xs"
                onClick={() => navigate(`/institute/exams-new/patterns/${pattern.id}/edit`)}
              >
                <Edit className="w-3.5 h-3.5 mr-1.5" />
                Edit
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 h-8 text-xs"
                onClick={() => {/* Duplicate logic */}}
              >
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                Duplicate
              </Button>
            )}
            <Button 
              size="sm" 
              className="h-8 text-xs"
              onClick={() => navigate(`/institute/exams-new/create?patternId=${pattern.id}`)}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
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

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{systemPresetPatterns.length}</p>
                <p className="text-xs text-muted-foreground">Standard Patterns</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-accent/50 to-accent border-accent">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent">
                <Building2 className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{institutePatterns.length}</p>
                <p className="text-xs text-muted-foreground">My Patterns</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="sm:col-span-1 col-span-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <LayoutGrid className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{systemPresetPatterns.length + institutePatterns.length}</p>
                <p className="text-xs text-muted-foreground">Total Patterns</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Tabs */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search patterns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-2 w-full sm:w-auto">
            <TabsTrigger value="standard" className="gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Standard</span>
            </TabsTrigger>
            <TabsTrigger value="my-patterns" className="gap-2">
              <Building2 className="w-4 h-4" />
              <span>My Patterns</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Pattern Cards */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="standard" className="mt-0">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStandardPatterns.map((pattern) => renderPatternCard(pattern, false))}
          </div>
          
          {filteredStandardPatterns.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No standard patterns found matching your search.</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="my-patterns" className="mt-0">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredInstitutePatterns.map((pattern) => renderPatternCard(pattern, true))}
          </div>
          
          {filteredInstitutePatterns.length === 0 && (
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-muted">
                  <LayoutGrid className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">No custom patterns yet</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Create your own exam patterns for recurring test formats
                  </p>
                </div>
                <Button onClick={() => navigate("/institute/exams-new/patterns/create")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Pattern
                </Button>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Patterns;
