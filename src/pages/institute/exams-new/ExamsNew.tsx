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
  FileText,
  Clock,
  Users,
  Calendar,
  LayoutGrid,
  CheckCircle2,
  Timer,
  AlertCircle,
  Edit,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Mock exam data for the new module
const mockExamsNew = [
  {
    id: "exam-new-1",
    name: "JEE Main Mock Test 1",
    patternId: "jee-main-2025",
    patternName: "JEE Main 2025",
    subjects: ["Physics", "Chemistry", "Mathematics"],
    totalQuestions: 75,
    totalMarks: 300,
    duration: 180,
    status: "scheduled",
    scheduledDate: "2024-02-15",
    scheduledTime: "10:00 AM",
    assignedBatches: ["JEE 2025 Batch A", "JEE 2025 Batch B"],
    createdAt: "2024-01-20",
  },
  {
    id: "exam-new-2",
    name: "NEET Weekly Test - Biology",
    patternId: "neet-2025",
    patternName: "NEET 2025",
    subjects: ["Biology"],
    totalQuestions: 45,
    totalMarks: 180,
    duration: 60,
    status: "draft",
    scheduledDate: null,
    scheduledTime: null,
    assignedBatches: [],
    createdAt: "2024-01-22",
  },
  {
    id: "exam-new-3",
    name: "Physics Chapter Test - Mechanics",
    patternId: "weekly-physics-test",
    patternName: "Weekly Physics Test",
    subjects: ["Physics"],
    totalQuestions: 20,
    totalMarks: 50,
    duration: 45,
    status: "completed",
    scheduledDate: "2024-01-18",
    scheduledTime: "2:00 PM",
    assignedBatches: ["Class 11 - A"],
    createdAt: "2024-01-15",
  },
  {
    id: "exam-new-4",
    name: "Monthly Assessment - January",
    patternId: "monthly-assessment",
    patternName: "Monthly Assessment",
    subjects: ["Physics", "Chemistry"],
    totalQuestions: 45,
    totalMarks: 80,
    duration: 120,
    status: "live",
    scheduledDate: "2024-01-25",
    scheduledTime: "11:00 AM",
    assignedBatches: ["Class 12 - Science"],
    createdAt: "2024-01-10",
  },
  {
    id: "exam-new-5",
    name: "Quick Quiz - Organic Chemistry",
    patternId: null,
    patternName: "Quick Test",
    subjects: ["Chemistry"],
    totalQuestions: 15,
    totalMarks: 30,
    duration: 20,
    status: "draft",
    scheduledDate: null,
    scheduledTime: null,
    assignedBatches: [],
    createdAt: "2024-01-24",
  },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  draft: { label: "Draft", color: "bg-muted text-muted-foreground", icon: FileText },
  scheduled: { label: "Scheduled", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: Calendar },
  live: { label: "Live", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: Timer },
  completed: { label: "Completed", color: "bg-primary/10 text-primary", icon: CheckCircle2 },
};

const ExamsNew = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredExams = useMemo(() => {
    return mockExamsNew.filter((exam) => {
      const matchesSearch = exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      
      if (activeTab === "all") return matchesSearch;
      return matchesSearch && exam.status === activeTab;
    });
  }, [searchQuery, activeTab]);

  const stats = useMemo(() => ({
    total: mockExamsNew.length,
    draft: mockExamsNew.filter(e => e.status === "draft").length,
    scheduled: mockExamsNew.filter(e => e.status === "scheduled").length,
    live: mockExamsNew.filter(e => e.status === "live").length,
    completed: mockExamsNew.filter(e => e.status === "completed").length,
  }), []);

  return (
    <div className="space-y-6 animate-fade-in pb-20 sm:pb-0">
      <PageHeader
        title="Exams"
        description="Create and manage exams using patterns or quick tests"
        breadcrumbs={[
          { label: "Dashboard", href: "/institute/dashboard" },
          { label: "Exams New" },
        ]}
        actions={
          <Button 
            onClick={() => navigate("/institute/exams-new/create")}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create Exam</span>
            <span className="sm:hidden">Create</span>
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <LayoutGrid className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Exams</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {Object.entries(statusConfig).map(([status, config]) => {
          const Icon = config.icon;
          const count = stats[status as keyof typeof stats];
          return (
            <Card key={status} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg", config.color.split(' ')[0])}>
                    <Icon className={cn("w-5 h-5", config.color.split(' ').slice(1).join(' '))} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-xs text-muted-foreground">{config.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search and Tabs */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search exams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-5 w-full sm:w-auto">
            <TabsTrigger value="all" className="text-xs sm:text-sm">All</TabsTrigger>
            <TabsTrigger value="draft" className="text-xs sm:text-sm">Draft</TabsTrigger>
            <TabsTrigger value="scheduled" className="text-xs sm:text-sm">Scheduled</TabsTrigger>
            <TabsTrigger value="live" className="text-xs sm:text-sm">Live</TabsTrigger>
            <TabsTrigger value="completed" className="text-xs sm:text-sm">Done</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Exam Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredExams.map((exam) => {
          const statusInfo = statusConfig[exam.status];
          const StatusIcon = statusInfo.icon;
          
          return (
            <Card key={exam.id} className="group hover:shadow-lg transition-all duration-200 hover:border-primary/30">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base font-semibold line-clamp-1">
                      {exam.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      {exam.patternName}
                    </p>
                  </div>
                  <Badge className={cn("shrink-0", statusInfo.color)}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusInfo.label}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Subjects */}
                <div className="flex flex-wrap gap-1.5">
                  {exam.subjects.map((subject) => (
                    <Badge key={subject} variant="outline" className="text-xs">
                      {subject}
                    </Badge>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-muted/50">
                    <p className="text-sm font-semibold">{exam.totalQuestions}</p>
                    <p className="text-[10px] text-muted-foreground">Questions</p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50">
                    <p className="text-sm font-semibold">{exam.totalMarks}</p>
                    <p className="text-[10px] text-muted-foreground">Marks</p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50">
                    <p className="text-sm font-semibold">{exam.duration}</p>
                    <p className="text-[10px] text-muted-foreground">Minutes</p>
                  </div>
                </div>

                {/* Schedule/Batches Info */}
                {exam.status === "scheduled" && exam.scheduledDate && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{exam.scheduledDate} at {exam.scheduledTime}</span>
                  </div>
                )}
                
                {exam.assignedBatches.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="w-3.5 h-3.5" />
                    <span className="line-clamp-1">{exam.assignedBatches.join(", ")}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Button variant="outline" size="sm" className="flex-1 h-10 sm:h-9 text-xs">
                    <Eye className="w-4 h-4 mr-1.5" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 h-10 sm:h-9 text-xs">
                    <Edit className="w-4 h-4 mr-1.5" />
                    Edit
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-10 w-10 sm:h-9 sm:w-9 p-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover">
                      <DropdownMenuItem className="min-h-[40px] sm:min-h-[32px]">Duplicate</DropdownMenuItem>
                      <DropdownMenuItem className="min-h-[40px] sm:min-h-[32px]">Assign Batches</DropdownMenuItem>
                      <DropdownMenuItem className="min-h-[40px] sm:min-h-[32px]">Schedule</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive min-h-[40px] sm:min-h-[32px]">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredExams.length === 0 && (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-muted">
              <AlertCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">No exams found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery 
                  ? "Try adjusting your search query" 
                  : "Create your first exam to get started"}
              </p>
            </div>
            <Button onClick={() => navigate("/institute/exams-new/create")}>
              <Plus className="w-4 h-4 mr-2" />
              Create Exam
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ExamsNew;
