import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { TrendingUp, AlertTriangle, ChevronDown, User, Calendar, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChapterHourAllocation, NO_TEACH_REASON_LABELS } from "@/types/academicSchedule";
import { SubjectProgressInfo, getLostDaysByTeacher } from "./types";

interface SubjectProgressSectionProps {
  batchId: string;
  currentSubject: SubjectProgressInfo;
  chapters: ChapterHourAllocation[];
}

export function SubjectProgressSection({
  batchId,
  currentSubject,
  chapters,
}: SubjectProgressSectionProps) {
  const [lostDaysOpen, setLostDaysOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Progress Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-muted/30 border">
            <p className="text-xs text-muted-foreground">Hours</p>
            <p className="text-lg font-semibold">
              {currentSubject.totalActualHours}/{currentSubject.totalPlannedHours}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 border">
            <p className="text-xs text-muted-foreground">Chapters</p>
            <p className="text-lg font-semibold">
              {currentSubject.chaptersCompleted}/{currentSubject.totalChapters}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 border">
            <p className="text-xs text-muted-foreground">Current</p>
            <p className="text-lg font-semibold truncate">
              {currentSubject.currentChapterName || "—"}
            </p>
          </div>
          <div className={cn(
            "p-3 rounded-lg border",
            currentSubject.lostDays > 3 ? "bg-red-50 border-red-200" : 
            currentSubject.lostDays > 0 ? "bg-amber-50 border-amber-200" : "bg-muted/30"
          )}>
            <p className="text-xs text-muted-foreground">Lost Days</p>
            <p className="text-lg font-semibold">{currentSubject.lostDays}</p>
          </div>
        </div>

        {/* Chapter List */}
        <div className="space-y-2">
          {chapters.map((chapter, index) => {
            const isCompleted = index < currentSubject.chaptersCompleted;
            const isCurrent = chapter.chapterId === currentSubject.currentChapter;
            const progress = isCompleted ? 100 : isCurrent ? 60 : 0;
            
            return (
              <div
                key={chapter.chapterId}
                className={cn(
                  "p-3 rounded-lg border flex items-center gap-3",
                  isCurrent && "border-primary bg-primary/5",
                  isCompleted && "border-emerald-200 bg-emerald-50/30"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-medium",
                  isCompleted ? "bg-emerald-100 text-emerald-700" :
                  isCurrent ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "font-medium text-sm truncate",
                    isCompleted && "text-muted-foreground"
                  )}>
                    {chapter.chapterName}
                  </p>
                  <p className="text-xs text-muted-foreground">{chapter.plannedHours}h planned</p>
                </div>
                <Progress value={progress} className="w-20 h-1.5" />
              </div>
            );
          })}
        </div>

        {/* Lost Days Breakdown */}
        {currentSubject.lostDays > 0 && currentSubject.lostDaysReasons.length > 0 && (
          <LostDaysBreakdown
            batchId={batchId}
            subjectId={currentSubject.subjectId}
            lostDaysReasons={currentSubject.lostDaysReasons}
            isOpen={lostDaysOpen}
            onOpenChange={setLostDaysOpen}
          />
        )}
      </CardContent>
    </Card>
  );
}

interface LostDaysBreakdownProps {
  batchId: string;
  subjectId: string;
  lostDaysReasons: { reason: string; count: number }[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

function LostDaysBreakdown({
  batchId,
  subjectId,
  lostDaysReasons,
  isOpen,
  onOpenChange,
}: LostDaysBreakdownProps) {
  const teacherLostDays = getLostDaysByTeacher(batchId, subjectId);
  const teacherAbsences = teacherLostDays.filter(t => t.reason === "teacher_absent");
  const otherAbsences = teacherLostDays.filter(t => t.reason !== "teacher_absent");

  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between text-amber-600 hover:text-amber-700 hover:bg-amber-50">
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Lost Days Breakdown
          </span>
          <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 space-y-4">
        {/* Summary by Reason */}
        <div>
          <h5 className="text-xs font-medium text-muted-foreground mb-2">By Reason</h5>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {lostDaysReasons.map((item) => (
              <div key={item.reason} className="p-3 rounded-lg bg-muted/50 border text-center">
                <p className="text-2xl font-bold">{item.count}</p>
                <p className="text-xs text-muted-foreground">{NO_TEACH_REASON_LABELS[item.reason as keyof typeof NO_TEACH_REASON_LABELS]}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Teacher-Specific Breakdown */}
        {teacherAbsences.length > 0 && (
          <div>
            <h5 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
              <User className="w-3 h-3" />
              Teacher Absences
            </h5>
            <div className="space-y-2">
              {teacherAbsences.map((item) => (
                <div 
                  key={`${item.teacherId}-${item.reason}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-red-50/50 border border-red-100"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{item.teacherName}</p>
                      <p className="text-xs text-muted-foreground">Teacher Absent</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xl font-bold text-red-600">{item.count}</p>
                    <p className="text-[10px] text-muted-foreground">class{item.count > 1 ? 'es' : ''} missed</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Other Lost Days (non-teacher) */}
        {otherAbsences.length > 0 && (
          <div>
            <h5 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              Other Lost Classes
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {otherAbsences.map((item) => (
                <div 
                  key={`${item.teacherId}-${item.reason}`}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50/50 border border-amber-100"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{item.teacherName}</p>
                    <p className="text-xs text-muted-foreground">{NO_TEACH_REASON_LABELS[item.reason as keyof typeof NO_TEACH_REASON_LABELS] || item.reason}</p>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <p className="text-lg font-bold text-amber-600">{item.count}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
