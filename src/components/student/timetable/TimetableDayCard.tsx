// Timetable Day Card - Single day's schedule with warm student design

import { ScheduleItem, subjectColors } from "@/data/student/dashboard";
import { cn } from "@/lib/utils";
import { Clock, MapPin, User, Radio, FileText, ClipboardCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TimetableDayCardProps {
  dateStr: string;
  items: ScheduleItem[];
  isToday: boolean;
}

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const TimetableDayCard = ({ dateStr, items, isToday }: TimetableDayCardProps) => {
  const date = new Date(dateStr + 'T00:00:00');
  const dayNum = date.getDate();
  const dayName = dayLabels[date.getDay()];
  const classCount = items.filter(i => i.type === 'class').length;
  const examCount = items.filter(i => i.type === 'exam').length;

  return (
    <div className="space-y-1.5">
      {/* Day Header */}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex flex-col items-center justify-center text-center shrink-0",
            isToday
              ? "bg-gradient-to-br from-donut-coral to-donut-orange text-white shadow-lg shadow-orange-300/40"
              : "bg-muted text-muted-foreground"
          )}
        >
          <span className="text-[10px] font-semibold leading-none">{dayName}</span>
          <span className="text-lg font-bold leading-tight">{dayNum}</span>
        </div>
        <div>
          <p className={cn("text-sm font-semibold", isToday && "text-donut-coral")}>
            {isToday ? "Today" : date.toLocaleDateString('en-US', { weekday: 'long' })}
          </p>
          <p className="text-xs text-muted-foreground">
            {classCount} classes
            {examCount > 0 && (
              <span className="text-purple-500 font-medium"> · {examCount} exam{examCount > 1 ? 's' : ''}</span>
            )}
          </p>
        </div>
      </div>

      {/* Period Cards */}
      <div className="space-y-1.5 pl-[52px]">
        {items.map((item) => {
          if (item.type === 'break') {
            return (
              <div
                key={item.id}
                className="flex items-center gap-2 py-2 px-3 rounded-xl border border-dashed border-muted-foreground/20"
              >
                <span className="text-xs text-muted-foreground">{item.time} – {item.endTime}</span>
                <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
              </div>
            );
          }

          if (item.type === 'exam') {
            const examTypeLabel = item.examType === 'quiz' ? 'Quiz' : item.examType === 'exam' ? 'Exam' : 'Unit Test';
            return (
              <div
                key={item.id}
                className="relative p-3 rounded-xl border-2 border-purple-300/60 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 dark:border-purple-700/40 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center shrink-0 mt-0.5">
                    <ClipboardCheck className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-purple-700 dark:text-purple-300">{item.examTitle}</p>
                      <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 border-purple-200 dark:border-purple-700 text-[10px] px-1.5 py-0">{examTypeLabel}</Badge>
                    </div>
                    <p className="text-xs text-purple-600/70 dark:text-purple-400/70 capitalize mt-0.5">{item.subject}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 text-[11px] text-purple-500/80 dark:text-purple-400/60">
                        <Clock className="w-3 h-3" />
                        {item.time} – {item.endTime}
                      </span>
                      {item.room && (
                        <span className="flex items-center gap-1 text-[11px] text-purple-500/80 dark:text-purple-400/60">
                          <MapPin className="w-3 h-3" />
                          {item.room}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          const colors = item.subject ? subjectColors[item.subject] : null;
          const isCurrent = item.status === 'current' && isToday;

          return (
            <div
              key={item.id}
              className={cn(
                "relative p-2.5 rounded-xl border transition-all",
                isCurrent
                  ? "bg-gradient-to-r from-donut-coral/5 to-donut-orange/5 border-donut-coral/30 shadow-md shadow-orange-200/20"
                  : "bg-card border-border/50 hover:shadow-sm"
              )}
            >
              {/* LIVE badge */}
              {isCurrent && (
                <div className="absolute -top-2 right-3 flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-donut-coral to-donut-orange text-white text-[10px] font-bold rounded-full shadow-md">
                  <Radio className="w-3 h-3 animate-pulse" />
                  LIVE
                </div>
              )}

              <div className="flex items-start gap-3">
                {/* Subject Color Dot */}
                {colors && (
                  <div className={cn("w-2.5 h-2.5 rounded-full mt-1.5 shrink-0", colors.bg)} />
                )}

                <div className="flex-1 min-w-0">
                  {/* Subject & Topic */}
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground capitalize">{item.subject}</p>
                    {item.lessonPlanId && (
                      <button
                        onClick={() => {/* TODO: navigate to lesson plan */}}
                        className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                        title="View Lesson Plan"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  {item.topic && (
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.topic}</p>
                  )}

                  {/* Meta row */}
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {item.time} – {item.endTime}
                    </span>
                    {item.teacher && (
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <User className="w-3 h-3" />
                        {item.teacher}
                      </span>
                    )}
                    {item.room && (
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        Room {item.room}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};