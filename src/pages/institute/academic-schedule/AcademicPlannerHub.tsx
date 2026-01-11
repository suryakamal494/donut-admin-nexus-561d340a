// Academic Planner Hub
// BatchHub-style selection grid for Academic Planner

import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  Search,
  Sparkles,
  Calendar,
  BookOpen,
  Check,
  FileEdit,
  Clock,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getAllBatchPlanSummaries,
  BatchPlanSummary,
  PlanStatus,
} from "@/data/academicPlannerData";

// Status configurations
const statusConfig: Record<PlanStatus, { label: string; color: string; icon: typeof Check }> = {
  no_plan: { 
    label: "No Plan", 
    color: "bg-muted text-muted-foreground border-muted-foreground/20",
    icon: AlertCircle,
  },
  draft: { 
    label: "Draft", 
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: FileEdit,
  },
  partial: { 
    label: "Partial", 
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: Clock,
  },
  fully_published: { 
    label: "Published", 
    color: "bg-green-100 text-green-700 border-green-200",
    icon: Check,
  },
};

// Extract class number from className
function getClassNumber(className: string): number {
  const match = className.match(/\d+/);
  return match ? parseInt(match[0]) : 0;
}

export default function AcademicPlannerHub() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  // Get all batch summaries
  const allSummaries = useMemo(() => getAllBatchPlanSummaries(), []);

  // Get unique class numbers for filter pills
  const classOptions = useMemo(() => {
    const classes = new Set(allSummaries.map(s => getClassNumber(s.className)));
    return Array.from(classes).sort((a, b) => a - b);
  }, [allSummaries]);

  // Filter summaries
  const filteredSummaries = useMemo(() => {
    return allSummaries.filter(summary => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          summary.className.toLowerCase().includes(query) ||
          summary.batchName.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Class filter
      if (selectedClass) {
        const classNum = getClassNumber(summary.className);
        if (classNum.toString() !== selectedClass) return false;
      }

      return true;
    });
  }, [allSummaries, searchQuery, selectedClass]);

  // Stats
  const stats = useMemo(() => {
    const total = allSummaries.length;
    const withPlans = allSummaries.filter(s => s.status !== 'no_plan').length;
    const published = allSummaries.filter(s => s.status === 'fully_published' || s.status === 'partial').length;
    const pending = total - withPlans;
    return { total, withPlans, published, pending };
  }, [allSummaries]);

  const handleBatchClick = (batchId: string) => {
    navigate(`/institute/academic-schedule/planner/${batchId}`);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <Link 
            to="/institute/academic-schedule/batches" 
            className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-lg sm:text-xl font-semibold truncate">Academic Planner</h1>
          <Badge variant="secondary" className="bg-primary/10 text-primary gap-1 hidden sm:flex">
            <Sparkles className="w-3 h-3" />
            Auto-Sequence
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <BookOpen className="w-4 h-4" />
            <span>{stats.withPlans}/{stats.total} with plans</span>
          </div>
          <div className="flex items-center gap-1.5 text-green-600">
            <Check className="w-4 h-4" />
            <span>{stats.published} published</span>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-card border border-border/50 rounded-xl p-3 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search batches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        {/* Class Filter Pills */}
        <ScrollArea className="w-full">
          <div className="flex items-center gap-2">
            <Button
              variant={selectedClass === null ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs shrink-0"
              onClick={() => setSelectedClass(null)}
            >
              All Classes
            </Button>
            {classOptions.map(classNum => (
              <Button
                key={classNum}
                variant={selectedClass === classNum.toString() ? "default" : "outline"}
                size="sm"
                className="h-7 text-xs shrink-0 min-w-[44px]"
                onClick={() => setSelectedClass(
                  selectedClass === classNum.toString() ? null : classNum.toString()
                )}
              >
                {classNum}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Batch Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filteredSummaries.map(summary => (
          <BatchPlanCard
            key={summary.batchId}
            summary={summary}
            onClick={() => handleBatchClick(summary.batchId)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredSummaries.length === 0 && (
        <Card className="p-8">
          <div className="text-center text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No Batches Found</p>
            <p className="text-sm mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}

// Batch Plan Card Component
interface BatchPlanCardProps {
  summary: BatchPlanSummary;
  onClick: () => void;
}

function BatchPlanCard({ summary, onClick }: BatchPlanCardProps) {
  const config = statusConfig[summary.status];
  const StatusIcon = config.icon;

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-md hover:border-primary/30",
        "active:scale-[0.98]"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold truncate">{summary.className}</h3>
            <p className="text-sm text-muted-foreground">{summary.batchName}</p>
          </div>
          <Badge 
            variant="outline" 
            className={cn("shrink-0 gap-1 text-[10px]", config.color)}
          >
            <StatusIcon className="w-3 h-3" />
            {config.label}
          </Badge>
        </div>

        {/* Stats */}
        {summary.status !== 'no_plan' && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{summary.subjectCount} subjects</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{summary.totalChapters} chapters</span>
            </div>
          </div>
        )}

        {/* Published Months */}
        {summary.publishedMonthCount > 0 && (
          <div className="flex items-center gap-1.5 text-xs">
            <Check className="w-3.5 h-3.5 text-green-600" />
            <span className="text-green-700">
              {summary.publishedMonthCount} month{summary.publishedMonthCount > 1 ? 's' : ''} published
            </span>
          </div>
        )}

        {/* Action Hint */}
        <div className="pt-2 border-t">
          <div className="flex items-center gap-1.5 text-xs text-primary">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {summary.status === 'no_plan' 
                ? 'Generate Plan' 
                : 'View & Edit Plan'
              }
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
