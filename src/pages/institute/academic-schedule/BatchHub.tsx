import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  Clock,
  Search,
  ChevronRight,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { batchProgressSummaries, pendingConfirmations } from "@/data/academicScheduleData";
import { useInstituteDriftSummary } from "@/hooks/useInstituteDriftSummary";
import { DriftSummarySheet } from "@/components/academic-schedule/DriftSummarySheet";

// Status configuration
const getStatusConfig = (status: string) => {
  switch (status) {
    case "ahead":
      return { 
        icon: TrendingUp, 
        label: "Ahead", 
        color: "text-emerald-600 bg-emerald-50 border-emerald-200",
        dotColor: "bg-emerald-500",
      };
    case "on_track":
      return { 
        icon: CheckCircle, 
        label: "On Track", 
        color: "text-blue-600 bg-blue-50 border-blue-200",
        dotColor: "bg-blue-500",
      };
    case "lagging":
      return { 
        icon: TrendingDown, 
        label: "Lagging", 
        color: "text-amber-600 bg-amber-50 border-amber-200",
        dotColor: "bg-amber-500",
      };
    case "critical":
      return { 
        icon: AlertTriangle, 
        label: "Critical", 
        color: "text-red-600 bg-red-50 border-red-200",
        dotColor: "bg-red-500",
      };
    default:
      return { 
        icon: Clock, 
        label: status, 
        color: "text-muted-foreground bg-muted",
        dotColor: "bg-gray-400",
      };
  }
};

export default function BatchHub() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [driftSheetOpen, setDriftSheetOpen] = useState(false);
  
  // Get institute-wide drift summary
  const driftSummary = useInstituteDriftSummary();

  // Get unique classes
  const classOptions = useMemo(() => {
    const classes = [...new Set(batchProgressSummaries.map(b => b.className))];
    return classes.sort((a, b) => {
      // Extract numeric part for proper sorting
      const numA = parseInt(a.replace(/\D/g, '')) || 0;
      const numB = parseInt(b.replace(/\D/g, '')) || 0;
      return numA - numB;
    });
  }, []);

  // Filter batches
  const filteredBatches = useMemo(() => {
    return batchProgressSummaries.filter(batch => {
      const matchesSearch = 
        batch.batchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        batch.className.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesClass = selectedClass === "all" || batch.className === selectedClass;
      
      return matchesSearch && matchesClass;
    });
  }, [searchQuery, selectedClass]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = batchProgressSummaries.length;
    const ahead = batchProgressSummaries.filter(b => b.status === "ahead").length;
    const onTrack = batchProgressSummaries.filter(b => b.status === "on_track").length;
    const lagging = batchProgressSummaries.filter(b => b.status === "lagging").length;
    const critical = batchProgressSummaries.filter(b => b.status === "critical").length;
    const pendingCount = pendingConfirmations.length;
    
    return { total, ahead, onTrack, lagging, critical, pendingCount };
  }, []);

  // Get pending count per batch
  const getPendingForBatch = (batchId: string) => {
    return pendingConfirmations.filter(p => p.batchId === batchId).length;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Batch Progress"
        description="Track syllabus completion and pending confirmations across all batches"
        breadcrumbs={[
          { label: "Syllabus Tracker" },
          { label: "Batch Progress" },
        ]}
      />

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <div>
                <p className="text-2xl font-bold">{stats.ahead}</p>
                <p className="text-xs text-muted-foreground">Ahead</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.onTrack}</p>
                <p className="text-xs text-muted-foreground">On Track</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <div>
                <p className="text-2xl font-bold">{stats.lagging}</p>
                <p className="text-xs text-muted-foreground">Lagging</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <div>
                <p className="text-2xl font-bold">{stats.critical}</p>
                <p className="text-xs text-muted-foreground">Critical</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={cn(stats.pendingCount > 0 && "border-amber-200 bg-amber-50/30")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className={cn("w-5 h-5", stats.pendingCount > 0 ? "text-amber-600" : "text-muted-foreground")} />
              <div>
                <p className="text-2xl font-bold">{stats.pendingCount}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Drift Issues Card - NEW */}
        <Card 
          className={cn(
            "cursor-pointer transition-all hover:shadow-md",
            driftSummary.hasAnyDrift 
              ? driftSummary.criticalCount > 0
                ? "border-red-300 bg-red-50/50 hover:border-red-400"
                : "border-amber-300 bg-amber-50/50 hover:border-amber-400"
              : "hover:border-primary/30"
          )}
          onClick={() => setDriftSheetOpen(true)}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className={cn(
                "w-5 h-5",
                driftSummary.criticalCount > 0 
                  ? "text-red-600" 
                  : driftSummary.hasAnyDrift 
                    ? "text-amber-600" 
                    : "text-muted-foreground"
              )} />
              <div>
                <p className="text-2xl font-bold">{driftSummary.totalIssues}</p>
                <p className="text-xs text-muted-foreground">Drift Issues</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search batches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Class Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={selectedClass === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedClass("all")}
            className="h-8"
          >
            All
          </Button>
          {classOptions.map(cls => (
            <Button
              key={cls}
              variant={selectedClass === cls ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedClass(cls)}
              className="h-8"
            >
              {cls}
            </Button>
          ))}
        </div>
      </div>

      {/* Batch Cards Grid */}
      {filteredBatches.length === 0 ? (
        <Card className="p-12">
          <div className="text-center text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No batches found</p>
            <p className="text-sm mt-1">Try adjusting your search</p>
          </div>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredBatches.map(batch => {
            const statusConfig = getStatusConfig(batch.status);
            const StatusIcon = statusConfig.icon;
            const pendingCount = getPendingForBatch(batch.batchId);
            
            return (
              <Card 
                key={batch.batchId}
                className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group border-2 hover:border-primary/30"
                onClick={() => navigate(`/institute/academic-schedule/batches/${batch.batchId}`)}
              >
                <CardContent className="p-0">
                  {/* Header */}
                  <div className="p-4 pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
                          {batch.batchName}
                        </h3>
                        <p className="text-sm text-muted-foreground">{batch.className}</p>
                      </div>
                      
                      {pendingCount > 0 && (
                        <Badge variant="outline" className="gap-1 text-amber-600 border-amber-300 bg-amber-50 shrink-0">
                          <Clock className="w-3 h-3" />
                          {pendingCount}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="px-4 pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={cn("gap-1", statusConfig.color)}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                      </Badge>
                      <span className="text-xl font-bold">{batch.overallProgress}%</span>
                    </div>
                    <Progress value={batch.overallProgress} className="h-2" />
                  </div>

                  {/* Subject Dots */}
                  <div className="px-4 pb-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      {batch.subjects.slice(0, 5).map((subject) => (
                        <div key={subject.subjectId} className="flex items-center gap-1.5 text-xs">
                          <div 
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              subject.percentComplete >= 80 ? "bg-emerald-500" :
                              subject.percentComplete >= 50 ? "bg-blue-500" :
                              subject.percentComplete >= 30 ? "bg-amber-500" : "bg-red-500"
                            )}
                          />
                          <span className="text-muted-foreground">{subject.subjectName.slice(0, 3)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-2.5 bg-muted/30 border-t flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {batch.subjects.length} subjects
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground text-center">
        Showing {filteredBatches.length} of {batchProgressSummaries.length} batches
      </div>

      {/* Drift Summary Sheet */}
      <DriftSummarySheet 
        open={driftSheetOpen} 
        onOpenChange={setDriftSheetOpen} 
      />
    </div>
  );
}
