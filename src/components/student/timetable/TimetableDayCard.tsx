// Timetable Day Card - Single day's schedule with warm student design

import { ScheduleItem, subjectColors } from "@/data/student/dashboard";
import { cn } from "@/lib/utils";
import { Clock, MapPin, User, Radio } from "lucide-react";

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

  return (
    <div className="space-y-2">
      {/* Day Header */}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex flex-col items-center justify-center text-center shrink-0",
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
          <p className="text-xs text-muted-foreground">{classCount} classes</p>
        </div>
      </div>

      {/* Period Cards */}
      <div className="space-y-2 pl-[60px]">
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

          const colors = item.subject ? subjectColors[item.subject] : null;
          const isCurrent = item.status === 'current' && isToday;

          return (
            <div
              key={item.id}
              className={cn(
                "relative p-3 rounded-xl border transition-all",
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
                  <p className="text-sm font-semibold text-foreground capitalize">{item.subject}</p>
                  {item.topic && (
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.topic}</p>
                  )}

                  {/* Meta row */}
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
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