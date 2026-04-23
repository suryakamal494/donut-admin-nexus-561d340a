// Student Timetable Page - Full week view with navigation, auto-scroll, day selector

import { useState, useEffect, useRef, useCallback } from "react";
import { getWeekSchedule, getMonday } from "@/data/student/weeklySchedule";
import { StudentWeekNavigator } from "@/components/student/timetable/StudentWeekNavigator";
import { TimetableDayCard } from "@/components/student/timetable/TimetableDayCard";
import { cn } from "@/lib/utils";

const StudentTimetable = () => {
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  const dayRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const schedule = getWeekSchedule(weekStart);
  const todayStr = new Date().toISOString().split('T')[0];

  const sortedDates = Object.keys(schedule).sort();

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Auto-scroll to today on load / week change
  useEffect(() => {
    if (sortedDates.includes(todayStr)) {
      setTimeout(() => {
        dayRefs.current[todayStr]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [weekStart, todayStr, sortedDates]);

  const scrollToDay = useCallback((dateStr: string) => {
    dayRefs.current[dateStr]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <div className="w-full pb-24 lg:pb-6">
      {/* Header */}
      <div className="mb-3">
        <h1 className="text-xl font-bold text-foreground">Timetable</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Your weekly class schedule</p>
      </div>

      {/* Week Navigator */}
      <div className="mb-3 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 p-2.5">
        <StudentWeekNavigator
          currentWeekStart={weekStart}
          onWeekChange={setWeekStart}
        />
      </div>

      {/* Day Selector Strip */}
      <div className="mb-3 flex gap-1.5 overflow-x-auto no-scrollbar">
        {sortedDates.map((dateStr) => {
          const d = new Date(dateStr + 'T00:00:00');
          const isToday = dateStr === todayStr;
          return (
            <button
              key={dateStr}
              onClick={() => scrollToDay(dateStr)}
              className={cn(
                "flex-1 min-w-[48px] flex flex-col items-center py-1.5 px-1 rounded-xl text-center transition-all",
                isToday
                  ? "bg-gradient-to-br from-donut-coral to-donut-orange text-white shadow-md shadow-orange-300/30"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted"
              )}
            >
              <span className="text-[10px] font-semibold leading-none">{dayLabels[d.getDay()]}</span>
              <span className="text-sm font-bold leading-tight">{d.getDate()}</span>
            </button>
          );
        })}
      </div>

      {/* Day-by-day schedule */}
      <div className="space-y-4">
        {sortedDates.map((dateStr) => (
          <div
            key={dateStr}
            ref={(el) => { dayRefs.current[dateStr] = el; }}
          >
            <TimetableDayCard
              dateStr={dateStr}
              items={schedule[dateStr]}
              isToday={dateStr === todayStr}
            />
          </div>
        ))}

        {sortedDates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">No classes scheduled for this week</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentTimetable;