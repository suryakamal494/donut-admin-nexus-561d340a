import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  ClipboardList,
  Plus,
  Clock,
  ArrowRight,
  UserPlus,
  FileText,
  BookMarked,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { SubjectBadge } from "@/components/subject";
import { batches, teachers, students, availableSubjects, instituteExams, assignedTracks } from "@/data/instituteData";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AssignCourseDialog } from "@/components/institute/batches/AssignCourseDialog";
import { AssignTeacherDialog } from "@/components/institute/batches/AssignTeacherDialog";

const BatchDashboard = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [assignCourseOpen, setAssignCourseOpen] = useState(false);
  const [assignTeacherOpen, setAssignTeacherOpen] = useState(false);
  const [batchCourses, setBatchCourses] = useState<string[]>([]);

  const batch = batches.find((b) => b.id === batchId);
  
  // Initialize batch courses from batch data
  if (batch && batchCourses.length === 0 && batch.assignedCourses.length > 0) {
    setBatchCourses(batch.assignedCourses);
  }

  if (!batch) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-xl font-semibold mb-2">Batch not found</h2>
        <Button variant="outline" onClick={() => navigate("/institute/batches")}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Batches
        </Button>
      </div>
    );
  }

  // Get batch-specific data
  const batchTeachers = teachers.filter((t) =>
    t.batches.some((b) => b.batchId === batchId)
  );
  const batchStudents = students.filter((s) => s.batchId === batchId);
  const batchExams = instituteExams.filter((e) => e.batches.includes(batchId!));
  const upcomingExams = batchExams.filter((e) => e.status === "scheduled");
  const completedExams = batchExams.filter((e) => e.status === "completed");

  const getSubjectName = (subjectId: string) => {
    return availableSubjects.find((s) => s.id === subjectId)?.name || subjectId;
  };

  return (
    <div className="space-y-8 pb-24">
      <PageHeader
        title={`${batch.className} - ${batch.name}`}
        description={`Manage students, teachers, timetable, and tests for this batch. Academic Year: ${batch.academicYear}`}
        actions={
          <Button variant="outline" onClick={() => navigate("/institute/batches")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Batches
          </Button>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{batchStudents.length}</p>
                <p className="text-xs text-muted-foreground">Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 border-emerald-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{batchTeachers.length}</p>
                <p className="text-xs text-muted-foreground">Teachers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/5 to-amber-500/10 border-amber-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{batch.subjects.length}</p>
                <p className="text-xs text-muted-foreground">Subjects</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/5 to-purple-500/10 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <ClipboardList className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{batchExams.length}</p>
                <p className="text-xs text-muted-foreground">Tests</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Common tasks for this batch</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() =>
                navigate(
                  `/institute/students/add?batchId=${batchId}&returnTo=/institute/batches/${batchId}`
                )
              }
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Students
            </Button>
            <Button
              variant="outline"
              onClick={() => setAssignTeacherOpen(true)}
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              Assign Teacher
            </Button>
            <Button
              variant="outline"
              onClick={() => setAssignCourseOpen(true)}
            >
              <BookMarked className="h-4 w-4 mr-2" />
              Assign Course
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(`/institute/batches/${batchId}/timetable`)}
            >
              <Calendar className="h-4 w-4 mr-2" />
              View Timetable
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(`/institute/exams/create?batchId=${batchId}`)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Create Test
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subjects & Teachers */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Subjects & Teachers</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/institute/teachers")}
              >
                Manage
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {batch.subjects.map((subjectId) => {
                const teacher = batchTeachers.find((t) =>
                  t.batches.some((b) => b.batchId === batchId && b.subject.toLowerCase().includes(subjectId))
                );
                return (
                  <div
                    key={subjectId}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <SubjectBadge subject={getSubjectName(subjectId)} />
                    {teacher ? (
                      <span className="text-sm text-foreground">{teacher.name}</span>
                    ) : (
                      <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                        Not Assigned
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Students */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Students</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/institute/students?batchId=${batchId}`)}
              >
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {batchStudents.length > 0 ? (
              <div className="space-y-2">
                {batchStudents.slice(0, 5).map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{student.name}</p>
                        <p className="text-xs text-muted-foreground">@{student.username}</p>
                      </div>
                    </div>
                    <Badge
                      variant={student.status === "active" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {student.status}
                    </Badge>
                  </div>
                ))}
                {batchStudents.length > 5 && (
                  <p className="text-sm text-center text-muted-foreground pt-2">
                    +{batchStudents.length - 5} more students
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-3">No students added yet</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    navigate(
                      `/institute/students/add?batchId=${batchId}&returnTo=/institute/batches/${batchId}`
                    )
                  }
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Students
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Tests */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Upcoming Tests</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/institute/exams")}
              >
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingExams.length > 0 ? (
              <div className="space-y-3">
                {upcomingExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{exam.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {exam.scheduledDate}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          • {exam.duration} mins
                        </span>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                      Scheduled
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-3">No upcoming tests</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/institute/exams/create?batchId=${batchId}`)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create Test
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Completed Tests */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Completed Tests</CardTitle>
          </CardHeader>
          <CardContent>
            {completedExams.length > 0 ? (
              <div className="space-y-3">
                {completedExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{exam.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {exam.totalQuestions} questions • {exam.totalMarks} marks
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      View Results
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ClipboardList className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No completed tests yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Assigned Courses Display */}
      {batchCourses.length > 0 && (
        <Card className="border-dashed">
          <CardContent className="py-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-medium text-muted-foreground">Assigned Courses:</span>
              {batchCourses.map((courseId) => {
                const course = assignedTracks.find((t) => t.id === courseId);
                return course ? (
                  <Badge key={courseId} variant="secondary" className="text-sm">
                    {course.name}
                  </Badge>
                ) : null;
              })}
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto"
                onClick={() => setAssignCourseOpen(true)}
              >
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/80 p-3 md:pl-[calc(16rem+1.5rem)] md:pr-6">
        <div className="flex gap-3 max-w-screen-xl mx-auto">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setAssignCourseOpen(true)}
          >
            <BookMarked className="h-4 w-4 mr-2" />
            Assign Courses
          </Button>
          <Button
            className="flex-1"
            onClick={() => navigate(`/institute/batches/${batchId}/edit`)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit Batch
          </Button>
        </div>
      </div>

      {/* Assign Course Dialog */}
      <AssignCourseDialog
        open={assignCourseOpen}
        onOpenChange={setAssignCourseOpen}
        batchName={`${batch.className} - ${batch.name}`}
        currentCourses={batchCourses}
        onSave={(courses) => setBatchCourses(courses)}
      />

      {/* Assign Teacher Dialog */}
      <AssignTeacherDialog
        open={assignTeacherOpen}
        onOpenChange={setAssignTeacherOpen}
        batchId={batchId!}
        batchName={`${batch.className} - ${batch.name}`}
        subjects={batch.subjects}
      />
    </div>
  );
};

export default BatchDashboard;
