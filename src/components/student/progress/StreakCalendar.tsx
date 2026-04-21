import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, subMonths, isToday } from "date-fns";

interface StreakCalendarProps {
  currentStreak: number;
  longestStreak: number;
  activeDays: Date[];
}

const StreakCalendar = ({ currentStreak, longestStreak, activeDays }: StreakCalendarProps) => {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get the day of week the month starts on (0 = Sunday)
  const startDayOfWeek = monthStart.getDay();
  
  // Pre-build Set for O(1) active day lookup
  const activeDaySet = new Set(activeDays.map(d => format(d, 'yyyy-MM-dd')));
  const isDayActive = (day: Date) => activeDaySet.has(format(day, 'yyyy-MM-dd'));

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg"
    >
      {/* Streak Stats */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">Study Streak</h3>
        <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-bold text-orange-600">{currentStreak} days</span>
        </div>
      </div>

      {/* Streak Info */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1 bg-muted/10 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-foreground">{currentStreak}</p>
          <p className="text-xs text-muted-foreground">Current</p>
        </div>
        <div className="flex-1 bg-muted/10 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-foreground">{longestStreak}</p>
          <p className="text-xs text-muted-foreground">Longest</p>
        </div>
      </div>

      {/* Month Label */}
      <p className="text-sm font-medium text-foreground mb-3">{format(today, 'MMMM yyyy')}</p>

      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDays.map((day, i) => (
          <div key={i} className="text-center text-xs text-muted-foreground font-medium py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before month starts */}
        {Array.from({ length: startDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        
        {/* Days of the month */}
        {daysInMonth.map((day, index) => {
          const isActive = isDayActive(day);
          const isTodayDate = isToday(day);
          
          return (
            <motion.div
              key={day.toISOString()}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + index * 0.01 }}
              className={`
                aspect-square rounded-lg flex items-center justify-center text-xs font-medium
                ${isActive 
                  ? 'bg-gradient-to-br from-[hsl(var(--donut-coral))] to-[hsl(var(--donut-orange))] text-white shadow-md' 
                  : 'bg-muted/10 text-muted-foreground'
                }
                ${isTodayDate && !isActive ? 'ring-2 ring-[hsl(var(--donut-coral))] ring-offset-1' : ''}
              `}
            >
              {format(day, 'd')}
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-muted/20">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-br from-[hsl(var(--donut-coral))] to-[hsl(var(--donut-orange))]" />
          <span className="text-xs text-muted-foreground">Active day</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-muted/20 ring-2 ring-[hsl(var(--donut-coral))]" />
          <span className="text-xs text-muted-foreground">Today</span>
        </div>
      </div>
    </motion.div>
  );
};

export default StreakCalendar;
