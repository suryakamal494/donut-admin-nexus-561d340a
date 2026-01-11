import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";
import { useTeacherSyllabusProgress, type SectionProgress } from "@/hooks/useTeacherSyllabusProgress";
import {
  WeekContextBanner,
  SubjectProgressCard,
  ChapterDetailSheet,
} from "@/components/teacher/syllabus-progress";

export default function TeacherAcademicProgress() {
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedSection, setSelectedSection] = useState<SectionProgress | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const progressData = useTeacherSyllabusProgress();

  // Filter subjects
  const filteredSubjects = selectedSubject === "all"
    ? progressData.subjects
    : progressData.subjects.filter(s => s.subjectId === selectedSubject);

  const handleSectionTap = (section: SectionProgress) => {
    setSelectedSection(section);
    setSheetOpen(true);
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
    </div>
  );
}
