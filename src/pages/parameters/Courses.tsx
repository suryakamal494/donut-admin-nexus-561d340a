import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layers, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { 
  CourseListPanel, 
  CourseSubjectPanel, 
  CourseContentPanel,
  CourseManageDialog
} from "@/components/parameters";
import { CourseStats, CourseEditDialog } from "@/components/parameters/courses";
import { useCourses } from "@/hooks/useCourses";
import { Course } from "@/types/masterData";

const Courses = () => {
  const navigate = useNavigate();
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  const { 
    selectedCourseId, 
    selectedSubjectId, 
    selectedCourse,
    showManageDialog, 
    setShowManageDialog,
    stats,
    handleCourseSelect,
    handleSubjectSelect,
  } = useCourses();

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setShowEditDialog(true);
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      <PageHeader
        title="Courses"
        description="Browse course structure, subjects, chapters and topics"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin/dashboard" }, 
          { label: "Master Data" },
          { label: "Courses" }
        ]}
        actions={
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1.5 sm:gap-2 h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3"
              onClick={() => setShowManageDialog(true)}
            >
              <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Manage Courses</span>
              <span className="sm:hidden">Manage</span>
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="gap-1.5 sm:gap-2 h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3"
              onClick={() => navigate("/superadmin/parameters/course-builder")}
            >
              <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Course Builder</span>
              <span className="sm:hidden">Builder</span>
            </Button>
          </div>
        }
      />

      {/* Course Stats */}
      <CourseStats
        totalCourses={stats.totalCourses}
        publishedCount={stats.publishedCount}
        competitiveCount={stats.competitiveCount}
        selectedChapterCount={stats.selectedChapterCount}
        selectedCourseName={selectedCourse?.name}
      />

      {/* Three-Panel Layout */}
      <div className="bg-card rounded-xl sm:rounded-2xl shadow-soft border border-border/50 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[180px_180px_1fr] xl:grid-cols-[220px_200px_1fr] h-auto lg:h-[calc(100vh-440px)] lg:min-h-[450px]">
          <CourseListPanel 
            selectedCourseId={selectedCourseId}
            onSelectCourse={handleCourseSelect}
            onEditCourse={handleEditCourse}
          />
          <CourseSubjectPanel 
            selectedCourseId={selectedCourseId}
            selectedSubjectId={selectedSubjectId}
            onSelectSubject={handleSubjectSelect}
          />
          <CourseContentPanel 
            selectedCourseId={selectedCourseId}
            selectedSubjectId={selectedSubjectId}
          />
        </div>
      </div>

      {/* Course Management Dialog */}
      <CourseManageDialog 
        open={showManageDialog}
        onOpenChange={setShowManageDialog}
      />

      {/* Course Edit Dialog */}
      <CourseEditDialog
        course={editingCourse}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />
    </div>
  );
};

export default Courses;
