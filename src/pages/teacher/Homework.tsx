import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Search, 
  FileText,
  Clock,
  Users,
  AlertCircle,
  CheckCircle2,
  Calendar
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/ui/page-header";
import { HomeworkCard } from "@/components/teacher/HomeworkCard";
import { CreateHomeworkDialog } from "@/components/teacher/CreateHomeworkDialog";
import { ReviewSubmissionsDialog } from "@/components/teacher/ReviewSubmissionsDialog";
import { teacherHomework, type TeacherHomework } from "@/data/teacherData";

const Homework = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [batchFilter, setBatchFilter] = useState<string>("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [homeworkList, setHomeworkList] = useState<TeacherHomework[]>(teacherHomework);
  const [selectedHomework, setSelectedHomework] = useState<TeacherHomework | null>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  const filteredHomework = homeworkList.filter((hw) => {
    const matchesSearch = hw.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || hw.status === statusFilter;
    const matchesBatch = batchFilter === "all" || hw.batchId === batchFilter;
    return matchesSearch && matchesStatus && matchesBatch;
  });

  const stats = {
    total: homeworkList.length,
    active: homeworkList.filter(h => h.status === "assigned").length,
    overdue: homeworkList.filter(h => h.status === "overdue").length,
    completed: homeworkList.filter(h => h.status === "completed").length,
    pendingReview: homeworkList.reduce((sum, h) => sum + h.submissionCount, 0),
  };

  const handleHomeworkCreated = (newHomework: TeacherHomework) => {
    setHomeworkList(prev => [newHomework, ...prev]);
  };

  const handleViewSubmissions = (hw: TeacherHomework) => {
    setSelectedHomework(hw);
    setShowReviewDialog(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-20 md:pb-6">
      {/* Header with inline stats */}
      <div className="space-y-3">
        <PageHeader
          title="Homework"
          description="Assign and track homework submissions"
          breadcrumbs={[
            { label: "Teacher", href: "/teacher" },
            { label: "Homework" },
          ]}
        />

        {/* Compact Stats Row - Inline badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="bg-muted/50 text-xs gap-1.5 py-1 px-2.5">
            <FileText className="w-3 h-3" />
            {stats.total} Total
          </Badge>
          <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50/50 text-xs gap-1.5 py-1 px-2.5">
            <Clock className="w-3 h-3" />
            {stats.active} Active
          </Badge>
          {stats.overdue > 0 && (
            <Badge variant="outline" className="text-red-700 border-red-200 bg-red-50/50 text-xs gap-1.5 py-1 px-2.5">
              <AlertCircle className="w-3 h-3" />
              {stats.overdue} Overdue
            </Badge>
          )}
          <Badge variant="outline" className="text-amber-700 border-amber-200 bg-amber-50/50 text-xs gap-1.5 py-1 px-2.5">
            <Users className="w-3 h-3" />
            {stats.pendingReview} To Review
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search homework..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="min-w-[110px] w-auto shrink-0">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="assigned">Active</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={batchFilter} onValueChange={setBatchFilter}>
            <SelectTrigger className="min-w-[100px] w-auto shrink-0">
              <SelectValue placeholder="Batch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Batches</SelectItem>
              <SelectItem value="batch-10a">10A</SelectItem>
              <SelectItem value="batch-10b">10B</SelectItem>
              <SelectItem value="batch-11a">11A</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            className="gradient-button gap-2 shrink-0 h-10 min-w-[44px]"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Assign</span>
          </Button>
        </div>
      </div>

      {/* Tabs for quick filtering */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full overflow-x-auto flex h-auto p-1 scrollbar-hide">
          <TabsTrigger value="all" className="shrink-0 min-w-[60px]">
            All ({homeworkList.length})
          </TabsTrigger>
          <TabsTrigger value="active" className="gap-1 shrink-0 min-w-[70px]">
            <Clock className="w-3 h-3" />
            Active ({stats.active})
          </TabsTrigger>
          <TabsTrigger value="overdue" className="gap-1 shrink-0 min-w-[80px]">
            <AlertCircle className="w-3 h-3" />
            Overdue ({stats.overdue})
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-1 shrink-0 min-w-[90px]">
            <CheckCircle2 className="w-3 h-3" />
            Completed ({stats.completed})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <HomeworkGrid 
            homework={filteredHomework} 
            navigate={navigate}
            onDelete={(id) => setHomeworkList(prev => prev.filter(h => h.id !== id))}
          />
        </TabsContent>
        <TabsContent value="active" className="mt-4">
          <HomeworkGrid 
            homework={filteredHomework.filter(h => h.status === "assigned")} 
            navigate={navigate}
            onDelete={(id) => setHomeworkList(prev => prev.filter(h => h.id !== id))}
          />
        </TabsContent>
        <TabsContent value="overdue" className="mt-4">
          <HomeworkGrid 
            homework={filteredHomework.filter(h => h.status === "overdue")} 
            navigate={navigate}
            onDelete={(id) => setHomeworkList(prev => prev.filter(h => h.id !== id))}
          />
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          <HomeworkGrid 
            homework={filteredHomework.filter(h => h.status === "completed")} 
            navigate={navigate}
            onDelete={(id) => setHomeworkList(prev => prev.filter(h => h.id !== id))}
          />
        </TabsContent>
      </Tabs>

      {/* Create Dialog */}
      <CreateHomeworkDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreated={handleHomeworkCreated}
      />

      {/* Review Submissions Dialog */}
      <ReviewSubmissionsDialog
        open={showReviewDialog}
        onOpenChange={setShowReviewDialog}
        homework={selectedHomework}
      />

      {/* Mobile FAB */}
      <div className="fixed bottom-20 right-4 md:hidden">
        <Button 
          size="lg"
          className="w-14 h-14 rounded-full gradient-button shadow-lg shadow-primary/30"
          onClick={() => setShowCreateDialog(true)}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

// Extracted grid component for reuse in tabs
const HomeworkGrid = ({ 
  homework, 
  navigate,
  onDelete,
  onViewSubmissions 
}: { 
  homework: TeacherHomework[]; 
  navigate: any;
  onDelete: (id: string) => void;
  onViewSubmissions: (hw: TeacherHomework) => void;
}) => {
  if (homework.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-8 flex flex-col items-center justify-center text-center">
          <FileText className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-foreground mb-1">No homework found</h3>
          <p className="text-sm text-muted-foreground">
            No homework matches your current filters
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {homework.map((hw) => (
        <HomeworkCard
          key={hw.id}
          homework={hw}
          onEdit={() => {}}
          onDelete={() => onDelete(hw.id)}
          onViewSubmissions={() => {}}
          onViewLessonPlan={() => {
            if (hw.linkedLessonPlanId) {
              navigate(`/teacher/lesson-plans/${hw.linkedLessonPlanId}`);
            }
          }}
        />
      ))}
    </div>
  );
};

export default Homework;
