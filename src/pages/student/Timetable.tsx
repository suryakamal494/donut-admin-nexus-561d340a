// Student Timetable Page - Full week view with navigation

import { useState } from "react";
import { getWeekSchedule, getMonday } from "@/data/student/weeklySchedule";
import { StudentWeekNavigator } from "@/components/student/timetable/StudentWeekNavigator";
import { TimetableDayCard } from "@/components/student/timetable/TimetableDayCard";

const StudentTimetable = () => {
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));

  const schedule = getWeekSchedule(weekStart);
  const todayStr = new Date().toISOString().split('T')[0];

  const sortedDates = Object.keys(schedule).sort();

  return (
    <div className="w-full pb-24 lg:pb-6">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-foreground">Timetable</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Your weekly class schedule</p>
      </div>

      {/* Week Navigator */}
      <div className="mb-6 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 p-3">
        <StudentWeekNavigator
          currentWeekStart={weekStart}
          onWeekChange={setWeekStart}
        />
      </div>

      {/* Day-by-day schedule */}
      <div className="space-y-6">
        {sortedDates.map((dateStr) => (
          <TimetableDayCard
            key={dateStr}
            dateStr={dateStr}
            items={schedule[dateStr]}
            isToday={dateStr === todayStr}
          />
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