// Student Week Navigator - Warm design language with month picker

import { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface StudentWeekNavigatorProps {
  currentWeekStart: Date;
  onWeekChange: (newStart: Date) => void;
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const shortMonths = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const StudentWeekNavigator = ({ currentWeekStart, onWeekChange }: StudentWeekNavigatorProps) => {
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(currentWeekStart.getFullYear());

  const weekEnd = new Date(currentWeekStart);
  weekEnd.setDate(weekEnd.getDate() + 5); // Mon-Sat

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const goToPreviousWeek = () => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() - 7);
    onWeekChange(d);
  };

  const goToNextWeek = () => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() + 7);
    onWeekChange(d);
  };

  const isThisWeek = () => {
    const today = new Date();
    return today >= currentWeekStart && today <= weekEnd;
  };

  const goToThisWeek = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    onWeekChange(monday);
  };

  const selectMonth = (monthIndex: number) => {
    // Go to first Monday of selected month
    const firstDay = new Date(pickerYear, monthIndex, 1);
    const day = firstDay.getDay();
    const diff = day === 0 ? 1 : day === 1 ? 0 : 8 - day;
    const firstMonday = new Date(pickerYear, monthIndex, 1 + diff);
    // If first Monday is too late, use previous Monday
    if (firstMonday.getMonth() !== monthIndex) {
      firstMonday.setDate(firstMonday.getDate() - 7);
    }
    firstMonday.setHours(0, 0, 0, 0);
    onWeekChange(firstMonday);
    setMonthPickerOpen(false);
  };

  const currentMonth = currentWeekStart.getMonth();

  return (
    <div className="space-y-2">
      {/* Month Picker */}
      <div className="flex items-center justify-center">
        <Popover open={monthPickerOpen} onOpenChange={setMonthPickerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="text-sm font-semibold text-foreground gap-1.5 h-9"
            >
              <CalendarDays className="w-4 h-4 text-donut-coral" />
              {monthNames[currentMonth]} {currentWeekStart.getFullYear()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3 pointer-events-auto" align="center">
            <div className="flex items-center justify-between mb-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPickerYear(y => y - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-semibold">{pickerYear}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPickerYear(y => y + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {shortMonths.map((m, i) => (
                <button
                  key={m}
                  onClick={() => selectMonth(i)}
                  className={cn(
                    "text-xs font-medium py-2 rounded-lg transition-all min-h-[36px]",
                    currentMonth === i && pickerYear === currentWeekStart.getFullYear()
                      ? "bg-gradient-to-r from-donut-coral to-donut-orange text-white shadow-md"
                      : "hover:bg-muted text-foreground"
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Week Slider */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="h-11 w-11 rounded-xl"
          onClick={goToPreviousWeek}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {formatDate(currentWeekStart)} – {formatDate(weekEnd)}
          </span>
          {!isThisWeek() && (
            <button
              onClick={goToThisWeek}
              className="text-[11px] font-semibold text-donut-coral bg-donut-coral/10 px-2.5 py-1 rounded-full"
            >
              This Week
            </button>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-11 w-11 rounded-xl"
          onClick={goToNextWeek}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};