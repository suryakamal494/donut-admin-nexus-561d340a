import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { useCourseBuilder } from "@/hooks/useCourseBuilder";
import {
  SourcePanel,
  TargetPanel,
  CourseSelector,
  CreateCourseDialog,
  CreateChapterDialog,
  CreateTopicDialog,
  EmptyState,
} from "@/components/parameters/course-builder";

const CourseBuilder = () => {
  const navigate = useNavigate();
  const builder = useCourseBuilder();

  return (
    <div className="space-y-4 animate-fade-in h-full">
      <PageHeader
        title="Course Builder"
        description="Build competitive courses by selecting chapters from curriculums"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin/dashboard" },
          { label: "Master Data", href: "/superadmin/parameters" },
          { label: "Course Builder" }
        ]}
        actions={
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <Button variant="outline" size="sm" className="h-8 sm:h-9 text-xs sm:text-sm" onClick={() => navigate("/superadmin/parameters")}>
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            {builder.selectedCourseId && (
              <>
                <Button variant="outline" size="sm" className="h-8 sm:h-9 text-xs sm:text-sm" onClick={builder.handleSaveDraft} disabled={!builder.isDirty}>
                  <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Save Draft</span>
                  <span className="sm:hidden">Save</span>
                </Button>
                <Button size="sm" className="h-8 sm:h-9 text-xs sm:text-sm" onClick={builder.handlePublish}>
                  <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Publish
                </Button>
              </>
            )}
          </div>
        }
      />

      {/* Course Selector */}
      <CourseSelector
        selectedCourseId={builder.selectedCourseId}
        selectedCourse={builder.selectedCourse}
        currentChapterCount={builder.currentCourseChapters.length}
        isDirty={builder.isDirty}
        onCourseChange={builder.setSelectedCourseId}
        onCreateCourse={() => builder.setShowCreateCourseDialog(true)}
      />

      {/* Main Workspace */}
      {builder.selectedCourseId ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 h-auto lg:h-[calc(100vh-380px)] lg:min-h-[450px]">
          {/* Left Panel: Source */}
          <SourcePanel
            sourceCurriculumId={builder.sourceCurriculumId}
            sourceClassId={builder.sourceClassId}
            sourceSubjectId={builder.sourceSubjectId}
            sourceSearchQuery={builder.sourceSearchQuery}
            selectedChapterIds={builder.selectedChapterIds}
            availableChapters={builder.availableChapters}
            onCurriculumChange={builder.setSourceCurriculumId}
            onClassChange={builder.handleSourceClassChange}
            onSubjectChange={builder.handleSourceSubjectChange}
            onSearchChange={builder.setSourceSearchQuery}
            onChapterToggle={builder.handleChapterToggle}
            onSelectAll={builder.handleSelectAll}
            onClearSelection={builder.handleClearSelection}
            onAddSelected={builder.handleAddSelectedChapters}
            onCreateChapter={() => builder.setShowCreateChapterDialog(true)}
            onCreateTopic={() => builder.setShowCreateTopicDialog(true)}
          />

          {/* Right Panel: Target */}
          <TargetPanel
            courseName={builder.selectedCourse?.name || ""}
            courseContentBySubject={builder.courseContentBySubject}
            totalChapters={builder.currentCourseChapters.length}
            sensors={builder.sensors}
            onDragEnd={builder.handleDragEnd}
            onDeleteChapter={builder.handleDeleteChapter}
            getSubjectName={builder.getSubjectName}
          />
        </div>
      ) : (
        <EmptyState onCreateCourse={() => builder.setShowCreateCourseDialog(true)} />
      )}

      {/* Create Course Dialog */}
      <CreateCourseDialog
        open={builder.showCreateCourseDialog}
        onOpenChange={builder.setShowCreateCourseDialog}
        newCourse={builder.newCourse}
        onCourseChange={builder.setNewCourse}
        onToggleCurriculum={builder.toggleCurriculumSelection}
        onToggleClass={builder.toggleClassSelection}
        onCreate={builder.handleCreateCourse}
      />

      {/* Create Chapter Dialog */}
      <CreateChapterDialog
        open={builder.showCreateChapterDialog}
        onOpenChange={builder.setShowCreateChapterDialog}
        newChapter={builder.newChapter}
        onChapterChange={builder.setNewChapter}
        onCreate={builder.handleCreateChapter}
      />

      {/* Create Topic Dialog */}
      <CreateTopicDialog
        open={builder.showCreateTopicDialog}
        onOpenChange={builder.setShowCreateTopicDialog}
        courseChapters={builder.currentCourseChapters}
        newTopic={builder.newTopic}
        setNewTopic={builder.setNewTopic}
        onCreateTopic={builder.handleCreateTopic}
      />
    </div>
  );
};

export default CourseBuilder;
