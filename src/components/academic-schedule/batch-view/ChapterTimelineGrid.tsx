import { useMemo, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Calendar, Check, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChapterHourAllocation, ChapterDriftStatus, AcademicWeek } from "@/types/academicSchedule";
import { MonthNavigator, getCompactWeekLabel } from "@/components/academic-schedule/MonthNavigator";
import { ChapterDetail, SubjectProgressInfo, getChapterTeacher } from "./types";

interface ChapterTimelineGridProps {
  batchId: string;
  currentSubject: SubjectProgressInfo;
  chapters: ChapterHourAllocation[];
  academicWeeks: AcademicWeek[];
  currentWeekIndex: number;
  selectedMonthIndex: number;
  onMonthChange: (index: number) => void;
  chaptersWithDrift: ChapterDriftStatus[];
  onChapterClick: (detail: ChapterDetail) => void;
  onDriftClick: (drift: ChapterDriftStatus) => void;
}

const HOURS_PER_WEEK = 5;

export function ChapterTimelineGrid({
  batchId,
  currentSubject,
  chapters,
  academicWeeks,
  currentWeekIndex,
  selectedMonthIndex,
  onMonthChange,
  chaptersWithDrift,
  onChapterClick,
  onDriftClick,
}: ChapterTimelineGridProps) {
  // Get months from weeks
  const months = useMemo(() => {
    const monthMap = new Map<string, { name: string; weeks: AcademicWeek[] }>();
    academicWeeks.forEach((week) => {
      const date = new Date(week.startDate);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, { name: monthName, weeks: [] });
      }
      monthMap.get(monthKey)!.weeks.push(week);
    });
    return Array.from(monthMap.values());
  }, [academicWeeks]);

  const currentMonth = months[selectedMonthIndex];

  // Calculate chapters with week spans
  const chaptersWithWeeks = useMemo(() => {
    return chapters.slice(0, 8).map((chapter, idx) => {
      const cumulativeHoursBefore = chapters
        .slice(0, idx)
        .reduce((sum, ch) => sum + ch.plannedHours, 0);
      const startWeek = Math.floor(cumulativeHoursBefore / HOURS_PER_WEEK);
      const weeksNeeded = Math.max(1, Math.ceil(chapter.plannedHours / HOURS_PER_WEEK));
      const endWeek = startWeek + weeksNeeded - 1;
      
      return { ...chapter, startWeek, endWeek, weeksNeeded };
    });
  }, [chapters]);

  const getChapterTeacherMemo = useCallback(
    (subjectId: string, chapterId: string) => {
      return getChapterTeacher(batchId, subjectId, chapterId);
    },
    [batchId]
  );

  if (!currentMonth) return null;

  const monthFirstWeekIndex = academicWeeks.findIndex(w => 
    w.startDate === currentMonth.weeks[0]?.startDate
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Yearly Plan - {currentSubject.subjectName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Month Navigator */}
        <MonthNavigator
          weeks={academicWeeks}
          currentWeekIndex={currentWeekIndex}
          selectedMonthIndex={selectedMonthIndex}
          onMonthChange={onMonthChange}
        />

        {/* Month Timeline Grid */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground">{currentMonth.name}</h4>
          
          <ScrollArea className="w-full">
            <div className="min-w-[600px]">
              {/* Week Headers */}
              <div className="grid gap-2" style={{ gridTemplateColumns: `180px repeat(${currentMonth.weeks.length}, 1fr)` }}>
                <div className="text-xs text-muted-foreground font-medium px-2 py-1">Chapter</div>
                {currentMonth.weeks.map((week, idx) => {
                  const label = getCompactWeekLabel(week, idx + 1);
                  const weekIndex = academicWeeks.findIndex(w => w.startDate === week.startDate);
                  const isCurrent = weekIndex === currentWeekIndex;
                  const isPast = weekIndex < currentWeekIndex;
                  return (
                    <div 
                      key={week.startDate}
                      className={cn(
                        "text-center text-xs px-2 py-1 rounded",
                        isCurrent && "bg-primary/10 text-primary font-medium",
                        isPast && "text-muted-foreground"
                      )}
                    >
                      <div>{label.week}</div>
                      <div className="text-[10px] opacity-70">{label.dates}</div>
                    </div>
                  );
                })}
              </div>

              {/* Chapter Rows */}
              {chaptersWithWeeks.map((chapter, chapterIdx) => {
                const isCompleted = chapterIdx < currentSubject.chaptersCompleted;
                const isCurrentChapter = chapter.chapterId === currentSubject.currentChapter;
                
                const chapterDrift = chaptersWithDrift.find(d => d.chapterId === chapter.chapterId);
                const hasDrift = chapterDrift && chapterDrift.driftHours !== 0 && !chapterDrift.isResolved;
                
                const chapterTeacher = getChapterTeacherMemo(currentSubject.subjectId, chapter.chapterId);
                
                return (
                  <div 
                    key={chapter.chapterId}
                    className="grid gap-2 items-center border-t py-2"
                    style={{ gridTemplateColumns: `180px repeat(${currentMonth.weeks.length}, 1fr)` }}
                  >
                    <div className="flex items-center gap-2 px-2">
                      {isCompleted ? (
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : isCurrentChapter ? (
                        <div className="w-4 h-4 rounded-full border-2 border-primary shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-sky-300 shrink-0" />
                      )}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className={cn(
                            "text-sm truncate cursor-help",
                            isCompleted && "text-muted-foreground",
                            isCurrentChapter && "font-medium text-primary"
                          )}>
                            {chapter.chapterName}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <div className="space-y-1">
                            <p className="font-semibold">{chapter.chapterName}</p>
                            <p className="text-xs text-muted-foreground">
                              {chapter.plannedHours}h planned • Spans {chapter.weeksNeeded} week{chapter.weeksNeeded > 1 ? 's' : ''}
                            </p>
                            {chapterTeacher && (
                              <div className="flex items-center gap-1.5 text-xs border-t pt-1 mt-1">
                                <User className="w-3 h-3 text-primary" />
                                <span className="font-medium">{chapterTeacher.teacherName}</span>
                                <span className="text-muted-foreground">({chapterTeacher.hours}h taught)</span>
                              </div>
                            )}
                            {chapterDrift && (
                              <p className={cn(
                                "text-xs font-medium",
                                chapterDrift.driftHours > 0 ? "text-amber-600" : "text-emerald-600"
                              )}>
                                {chapterDrift.driftHours > 0 ? "+" : ""}{chapterDrift.driftHours}h vs plan
                                ({chapterDrift.actualHours}h actual / {chapterDrift.plannedHours}h planned)
                              </p>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                      
                      {/* Teacher Badge (compact) */}
                      {chapterTeacher && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] shrink-0 cursor-help">
                              <User className="w-2.5 h-2.5" />
                              <span className="max-w-[60px] truncate">{chapterTeacher.teacherName.split(' ')[0]}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="text-xs">{chapterTeacher.teacherName} - {chapterTeacher.hours}h taught</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      
                      {/* Drift Indicator Badge */}
                      {hasDrift && (
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-[10px] px-1.5 py-0 h-4 shrink-0 cursor-pointer font-semibold",
                            chapterDrift.severity === "critical" 
                              ? "bg-red-50 text-red-700 border-red-300 hover:bg-red-100" 
                              : chapterDrift.severity === "significant"
                              ? "bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100"
                              : "bg-muted text-muted-foreground border-muted-foreground/30 hover:bg-muted/80"
                          )}
                          onClick={() => onDriftClick(chapterDrift)}
                        >
                          {chapterDrift.driftHours > 0 ? "+" : ""}{chapterDrift.driftHours}h
                        </Badge>
                      )}
                    </div>
                    
                    {currentMonth.weeks.map((week, weekIdx) => {
                      const absoluteWeekIdx = monthFirstWeekIndex + weekIdx;
                      const showBar = absoluteWeekIdx >= chapter.startWeek && absoluteWeekIdx <= chapter.endWeek;
                      
                      const weekIndex = academicWeeks.findIndex(w => w.startDate === week.startDate);
                      const isPastWeek = weekIndex < currentWeekIndex;
                      const isCurrentWeek = weekIndex === currentWeekIndex;
                      
                      const isFirstWeek = absoluteWeekIdx === chapter.startWeek;
                      const isLastWeek = absoluteWeekIdx === chapter.endWeek;
                      const remainingHours = chapter.plannedHours % HOURS_PER_WEEK;
                      const hoursThisWeek = isLastWeek && remainingHours > 0 ? remainingHours : HOURS_PER_WEEK;
                      
                      const startDate = new Date(week.startDate);
                      const endDate = new Date(week.endDate);
                      const formatDate = (d: Date) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
                      
                      const statusText = isCompleted ? "✓ Completed" : 
                        isCurrentChapter && isCurrentWeek ? "📍 Current" :
                        isCurrentChapter ? "In Progress" : 
                        isPastWeek ? "Planned" : "Upcoming";
                      
                      const barWidth = isLastWeek && remainingHours > 0 && remainingHours < HOURS_PER_WEEK 
                        ? `${Math.max(40, (remainingHours / HOURS_PER_WEEK) * 100)}%` 
                        : '100%';
                      
                      return (
                        <div key={week.startDate} className="h-6 flex items-center justify-center">
                          {showBar && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onChapterClick({
                                      chapter,
                                      isCompleted,
                                      isCurrent: isCurrentChapter,
                                      subjectName: currentSubject.subjectName,
                                    });
                                  }}
                                  className={cn(
                                    "h-4 rounded cursor-pointer transition-all hover:scale-y-125 hover:shadow-sm",
                                    isCompleted ? "bg-emerald-300 hover:bg-emerald-400" :
                                    isCurrentChapter && isCurrentWeek ? "bg-primary hover:bg-primary/90" :
                                    isCurrentChapter ? "bg-primary/40 hover:bg-primary/50" :
                                    "bg-sky-200 hover:bg-sky-300",
                                    isFirstWeek && "rounded-l-md ml-1",
                                    isLastWeek && "rounded-r-md mr-1",
                                    !isFirstWeek && !isLastWeek && "mx-0.5",
                                    hasDrift && chapterDrift?.severity === "critical" && "ring-2 ring-red-500 ring-offset-1",
                                    hasDrift && chapterDrift?.severity === "significant" && "ring-2 ring-amber-500 ring-offset-1",
                                    hasDrift && chapterDrift?.severity === "minor" && "ring-1 ring-amber-400"
                                  )}
                                  style={{ width: barWidth }}
                                />
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs">
                                <div className="space-y-1">
                                  <p className="font-semibold text-sm">{chapter.chapterName}</p>
                                  <div className="text-xs text-muted-foreground space-y-0.5">
                                    <p>📅 {formatDate(startDate)} - {formatDate(endDate)}</p>
                                    <p>⏱️ {hoursThisWeek}h / {chapter.plannedHours}h total</p>
                                    <p>{statusText}</p>
                                    {isFirstWeek && chapter.weeksNeeded > 1 && <p>🚀 Week 1 of {chapter.weeksNeeded}</p>}
                                    {isLastWeek && chapter.weeksNeeded > 1 && <p>🏁 Week {chapter.weeksNeeded} of {chapter.weeksNeeded}</p>}
                                    <p className="text-primary mt-1">Click for details →</p>
                                  </div>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          
          {/* Color-Coded Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 pt-4 border-t mt-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-3 rounded bg-emerald-300" />
              <span className="text-xs text-muted-foreground">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-3 rounded bg-primary" />
              <span className="text-xs text-muted-foreground">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-3 rounded bg-sky-200" />
              <span className="text-xs text-muted-foreground">Upcoming</span>
            </div>
            <div className="flex items-center gap-1.5 border-l pl-4">
              <div className="w-5 h-3 rounded bg-muted ring-2 ring-red-500 ring-offset-1" />
              <span className="text-xs text-muted-foreground">Critical Drift</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-3 rounded bg-muted ring-2 ring-amber-500 ring-offset-1" />
              <span className="text-xs text-muted-foreground">Significant Drift</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
