import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Calendar,
  Filter,
} from "lucide-react";
import { useTeacherSyllabusProgress, type SectionProgress } from "@/hooks/useTeacherSyllabusProgress";
import {
  WeekContextBanner,
  SubjectProgressCard,
  ChapterDetailSheet,
} from "@/components/teacher/syllabus-progress";
import { TeachingConfirmationDialog } from "@/components/teacher/TeachingConfirmationDialog";
import { toast } from "sonner";

export default function TeacherAcademicProgress() {
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedSection, setSelectedSection] = useState<SectionProgress | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  
  // Teaching confirmation dialog state
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmingSection, setConfirmingSection] = useState<SectionProgress | null>(null);

  const progressData = useTeacherSyllabusProgress();

  // Filter subjects
  const filteredSubjects = selectedSubject === "all"
    ? progressData.subjects
    : progressData.subjects.filter(s => s.subjectId === selectedSubject);

  const handleSectionTap = (section: SectionProgress) => {
    setSelectedSection(section);
    setSheetOpen(true);
  };

  const handleConfirmTap = (section: SectionProgress) => {
    setConfirmingSection(section);
    setConfirmDialogOpen(true);
  };

  const handleConfirmSubmit = (data: {
    didTeach: boolean;
    chapterId?: string;
    chapterName?: string;
    topicIds?: string[];
    topicNames?: string[];
    noTeachReason?: string;
    noTeachNote?: string;
  }) => {
    // TODO: Integrate with backend to save confirmation
    console.log("Teaching confirmation:", {
      section: confirmingSection?.batchName,
      ...data,
    });
    
    if (data.didTeach) {
      toast.success(`Confirmed: ${data.chapterName || "Chapter"} taught to ${confirmingSection?.batchName}`);
    } else {
      toast.info(`Marked as not taught: ${confirmingSection?.batchName}`);
    }
    
    setConfirmDialogOpen(false);
    setConfirmingSection(null);
  };

  // Get chapters for the confirming section (mock data for now)
  const getChaptersForSection = (section: SectionProgress | null) => {
    if (!section) return [];
    return section.chapters.map((ch, idx) => ({
      chapterId: ch.chapterId,
      chapterName: ch.chapterName,
      order: idx + 1,
      hoursAllocated: ch.plannedHours,
      plannedHours: ch.plannedHours,
    }));
  };

  // Get subject name for the confirming section
  const getSubjectNameForSection = (section: SectionProgress | null) => {
    if (!section) return "";
    const subject = progressData.subjects.find(s => 
      s.sections.some(sec => sec.batchName === section.batchName)
    );
    return subject?.subjectName || "";
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto pb-20">
      {/* Compact Header */}
      <PageHeader
        title="My Teaching Progress"
        description="Track syllabus completion across your batches"
        breadcrumbs={[
          { label: "Teacher", href: "/teacher" },
          { label: "Progress" },
        ]}
      />

      {/* Week Context Banner */}
      <WeekContextBanner weekContext={progressData.weekContext} />

      {/* Quick Stats - Compact Inline */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-teal-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{progressData.totalBatches}</p>
                <p className="text-xs text-muted-foreground">Sections</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{progressData.onTrackCount}</p>
                <p className="text-xs text-muted-foreground">On Track</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{progressData.laggingCount}</p>
                <p className="text-xs text-muted-foreground">Attention</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{progressData.overallProgress}%</p>
                <p className="text-xs text-muted-foreground">Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Filter - Optional */}
      {progressData.subjects.length > 1 && (
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {progressData.subjects.map((subject) => (
                <SelectItem key={subject.subjectId} value={subject.subjectId}>
                  {subject.subjectName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Subject Progress Cards */}
      <div className="space-y-4">
        {filteredSubjects.map((subject) => (
          <SubjectProgressCard
            key={subject.subjectId}
            subject={subject}
            onSectionTap={handleSectionTap}
            onConfirmTap={handleConfirmTap}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredSubjects.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Progress Data</h3>
              <p className="text-muted-foreground max-w-md mx-auto text-sm">
                Progress tracking will appear here once you start teaching and confirming classes.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chapter Detail Sheet */}
      <ChapterDetailSheet
        section={selectedSection}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />

      {/* Teaching Confirmation Dialog */}
      <TeachingConfirmationDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        batchName={confirmingSection?.batchName || ""}
        subjectName={getSubjectNameForSection(confirmingSection)}
        date={new Date().toISOString()}
        periodsCount={1}
        chapters={getChaptersForSection(confirmingSection)}
        suggestedChapter={confirmingSection?.chapters.find(ch => ch.status === "in_progress")?.chapterId}
        onConfirm={handleConfirmSubmit}
      />
    </div>
  );
}
