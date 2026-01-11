import { BookOpen, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionProgressRow } from "./SectionProgressRow";
import type { TeacherSubjectSummary, SectionProgress } from "@/hooks/useTeacherSyllabusProgress";

interface SubjectProgressCardProps {
  subject: TeacherSubjectSummary;
  onSectionTap?: (section: SectionProgress) => void;
}

export function SubjectProgressCard({ subject, onSectionTap }: SubjectProgressCardProps) {
  // Subject icons based on name
  const getSubjectIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("physics")) return "⚛️";
    if (lower.includes("chemistry")) return "🧪";
    if (lower.includes("math")) return "📐";
    if (lower.includes("biology")) return "🧬";
    if (lower.includes("english")) return "📚";
    if (lower.includes("hindi")) return "🔤";
    return "📖";
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-100/50">
        <div className="flex items-center justify-between gap-3">
          {/* Subject Name */}
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl" role="img" aria-label={subject.subjectName}>
              {getSubjectIcon(subject.subjectName)}
            </span>
            <div className="min-w-0">
              <h3 className="font-semibold text-lg text-foreground truncate">
                {subject.subjectName}
              </h3>
              <p className="text-sm text-muted-foreground">
                {subject.totalSections} {subject.totalSections === 1 ? "section" : "sections"}
              </p>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="flex items-center gap-2 shrink-0">
            {subject.totalPending > 0 && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1">
                <AlertCircle className="w-3 h-3" />
                {subject.totalPending}
              </Badge>
            )}
            <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 gap-1">
              <TrendingUp className="w-3 h-3" />
              {subject.averageProgress}%
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-4 space-y-3">
        {subject.sections.map((section) => (
          <SectionProgressRow
            key={section.batchId}
            section={section}
            onTap={() => onSectionTap?.(section)}
          />
        ))}
      </CardContent>
    </Card>
  );
}
