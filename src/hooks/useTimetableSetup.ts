import { useState } from "react";
import { BreakConfig } from "@/data/timetableData";
import { 
  defaultPeriodStructure, 
  teacherLoads, 
  TeacherLoad, 
  PeriodType, 
  defaultPeriodTypes,
  academicHolidays,
  TeacherConstraint,
  Facility,
  defaultTeacherConstraints,
  defaultFacilities
} from "@/data/timetableData";
import { Holiday } from "@/components/timetable/HolidayCalendarDialog";
import { toast } from "sonner";
import { Clock, Layers, CalendarDays, User, AlertTriangle, Building2, ClipboardList } from "lucide-react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export interface TabConfig {
  id: string;
  label: string;
  icon: React.ElementType;
}

export function useTimetableSetup() {
  const [activeTab, setActiveTab] = useState("period-structure");
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  
  // Period structure state
  const [workingDays, setWorkingDays] = useState<string[]>(defaultPeriodStructure.workingDays);
  const [periodsPerDay, setPeriodsPerDay] = useState(defaultPeriodStructure.periodsPerDay);
  const [breaks, setBreaks] = useState<BreakConfig[]>(defaultPeriodStructure.breaks);
  const [useTimeMapping, setUseTimeMapping] = useState(defaultPeriodStructure.useTimeMapping);
  const [timeMapping, setTimeMapping] = useState(defaultPeriodStructure.timeMapping);

  // Period types state
  const [periodTypes, setPeriodTypes] = useState<PeriodType[]>(defaultPeriodTypes);

  // Holidays state
  const [holidays, setHolidays] = useState<Holiday[]>(academicHolidays);
  const [holidayDialogOpen, setHolidayDialogOpen] = useState(false);

  // Teacher load states
  const [teacherLoadData, setTeacherLoadData] = useState<TeacherLoad[]>(teacherLoads);
  const [editingTeacher, setEditingTeacher] = useState<string | null>(null);

  // Advanced mode states
  const [teacherConstraints, setTeacherConstraints] = useState<TeacherConstraint[]>(defaultTeacherConstraints);
  const [facilities, setFacilities] = useState<Facility[]>(defaultFacilities);

  // Progress tracking
  const getTabProgress = (tab: string): 'complete' | 'partial' | 'empty' => {
    switch (tab) {
      case 'period-structure':
        return workingDays.length > 0 && periodsPerDay > 0 ? 'complete' : 'empty';
      case 'period-types':
        return periodTypes.length > 0 ? 'complete' : 'empty';
      case 'holidays':
        return holidays.length > 0 ? 'complete' : 'partial';
      case 'teacher-load':
        return teacherLoadData.length > 0 ? 'complete' : 'empty';
      case 'exam-schedule':
        return 'complete'; // Always shows as complete since it's self-contained
      case 'teacher-constraints':
        return teacherConstraints.length > 0 ? 'complete' : 'empty';
      case 'facilities':
        return facilities.length > 0 ? 'complete' : 'empty';
      default:
        return 'empty';
    }
  };

  const toggleDay = (day: string) => {
    setWorkingDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const updateTimeMapping = (period: number, field: 'startTime' | 'endTime', value: string) => {
    setTimeMapping(prev => 
      prev.map(t => t.period === period ? { ...t, [field]: value } : t)
    );
  };

  const updateTeacherLoad = (teacherId: string, field: keyof TeacherLoad, value: any) => {
    setTeacherLoadData(prev =>
      prev.map(t => t.teacherId === teacherId ? { ...t, [field]: value } : t)
    );
  };

  const generateTimeMappings = () => {
    const newMappings = [];
    let currentTime = 8 * 60; // Start at 8:00 AM
    const periodDuration = 45;
    
    // Sort breaks by afterPeriod
    const sortedBreaks = [...breaks].sort((a, b) => a.afterPeriod - b.afterPeriod);

    for (let i = 1; i <= periodsPerDay; i++) {
      const startHour = Math.floor(currentTime / 60);
      const startMin = currentTime % 60;
      const endTime = currentTime + periodDuration;
      const endHour = Math.floor(endTime / 60);
      const endMin = endTime % 60;

      newMappings.push({
        period: i,
        startTime: `${startHour.toString().padStart(2, '0')}:${startMin.toString().padStart(2, '0')}`,
        endTime: `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`,
      });

      // Add break duration if there's a break after this period
      const breakAfterThis = sortedBreaks.find(b => b.afterPeriod === i);
      currentTime = endTime + (breakAfterThis ? breakAfterThis.duration : 0);
    }

    setTimeMapping(newMappings);
    toast.success("Time slots generated based on your break configuration!");
  };

  // Add a new break
  const addBreak = () => {
    if (breaks.length >= 4) {
      toast.error("Maximum 4 breaks allowed");
      return;
    }
    
    // Find the first available period position
    const usedPositions = breaks.map(b => b.afterPeriod);
    let newPosition = 2;
    for (let i = 1; i < periodsPerDay; i++) {
      if (!usedPositions.includes(i)) {
        newPosition = i;
        break;
      }
    }
    
    const newBreak: BreakConfig = {
      id: `break-${Date.now()}`,
      name: breaks.length === 0 ? 'Short Break' : 
            breaks.length === 1 ? 'Lunch Break' : 
            breaks.length === 2 ? 'Snacks Break' : 'Break',
      afterPeriod: newPosition,
      duration: breaks.length === 1 ? 30 : 15,
    };
    
    setBreaks([...breaks, newBreak]);
  };

  // Update a break
  const updateBreak = (id: string, field: keyof BreakConfig, value: any) => {
    setBreaks(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  // Remove a break
  const removeBreak = (id: string) => {
    setBreaks(prev => prev.filter(b => b.id !== id));
  };

  const basicTabs: TabConfig[] = [
    { id: 'period-structure', label: 'Period Structure', icon: Clock },
    { id: 'period-types', label: 'Period Types', icon: Layers },
    { id: 'holidays', label: 'Holidays', icon: CalendarDays },
    { id: 'teacher-load', label: 'Teacher Load', icon: User },
    { id: 'exam-schedule', label: 'Exam Schedule', icon: ClipboardList },
  ];

  const advancedTabs: TabConfig[] = [
    { id: 'teacher-constraints', label: 'Teacher Constraints', icon: AlertTriangle },
    { id: 'facilities', label: 'Facilities', icon: Building2 },
  ];

  const tabs = isAdvancedMode ? [...basicTabs, ...advancedTabs] : basicTabs;

  const handleAdvancedModeChange = (checked: boolean) => {
    setIsAdvancedMode(checked);
    if (!checked && (activeTab === 'teacher-constraints' || activeTab === 'facilities')) {
      setActiveTab('period-structure');
    }
  };

  return {
    // State
    activeTab,
    setActiveTab,
    isAdvancedMode,
    setIsAdvancedMode: handleAdvancedModeChange,
    workingDays,
    setWorkingDays,
    periodsPerDay,
    setPeriodsPerDay,
    breaks,
    setBreaks,
    useTimeMapping,
    setUseTimeMapping,
    timeMapping,
    setTimeMapping,
    periodTypes,
    setPeriodTypes,
    holidays,
    setHolidays,
    holidayDialogOpen,
    setHolidayDialogOpen,
    teacherLoadData,
    setTeacherLoadData,
    editingTeacher,
    setEditingTeacher,
    teacherConstraints,
    setTeacherConstraints,
    facilities,
    setFacilities,
    
    // Functions
    toggleDay,
    updateTimeMapping,
    updateTeacherLoad,
    generateTimeMappings,
    addBreak,
    updateBreak,
    removeBreak,
    getTabProgress,
    
    // Constants
    DAYS,
    basicTabs,
    advancedTabs,
    tabs,
  };
}
