import { useState, useMemo, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Save,
  Check,
  Clock,
  GripVertical,
  Plus,
  HelpCircle,
} from "lucide-react";
import { SetupProgressMatrix } from "@/components/academic-schedule";
import { academicScheduleSetups } from "@/data/academicScheduleData";
import { getSubjectsByClass, hindiChapters } from "@/data/cbseMasterData";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import type { ChapterHourAllocation } from "@/types/academicSchedule";

// Unified subject colors using shorthand IDs (consistent across the platform)
const SUBJECT_COLORS: Record<string, string> = {
  // Core subjects (shorthand codes)
  phy: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200",
  che: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200",
  mat: "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200",
  bio: "bg-green-100 text-green-700 border-green-200 hover:bg-green-200",
  his: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200",
  hin: "bg-red-100 text-red-700 border-red-200 hover:bg-red-200",
  eng: "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200",
  sci: "bg-teal-100 text-teal-700 border-teal-200 hover:bg-teal-200",
  sst: "bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-200",
  cs: "bg-cyan-100 text-cyan-700 border-cyan-200 hover:bg-cyan-200",
  eco: "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200",
  // JEE subjects
  jee_phy: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200",
  jee_mat: "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200",
  jee_che: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200",
};

// Sortable Chapter Row Component
interface SortableChapterRowProps {
  chapter: ChapterHourAllocation;
  index: number;
  selectedSubject: string;
}

function SortableChapterRow({ chapter, index, selectedSubject }: SortableChapterRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: chapter.chapterId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors",
        isDragging && "shadow-lg ring-2 ring-primary/20 rotate-1"
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="touch-none cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-4 h-4 text-muted-foreground/50 shrink-0" />
      </div>
      
      <Badge variant="outline" className="shrink-0 text-xs">
        Ch {index + 1}
      </Badge>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {chapter.chapterName}
        </p>
        {/* Show English transliteration for Hindi chapters */}
        {selectedSubject === "8" && chapter.chapterName.match(/[\u0900-\u097F]/) && (
          <p className="text-xs text-muted-foreground truncate">
            {hindiChapters.find(h => h.id === chapter.chapterId)?.name || ''}
          </p>
        )}
      </div>
      
      <div className="flex items-center gap-2 shrink-0">
        <Input
          type="number"
          defaultValue={chapter.plannedHours}
          className="w-16 h-8 text-center text-sm"
          min={1}
          max={50}
        />
        <span className="text-xs text-muted-foreground">hrs</span>
      </div>
    </div>
  );
}

export default function Setup() {
  const [selectedTrack, setSelectedTrack] = useState<"cbse" | "jee">("cbse");
  const [selectedClass, setSelectedClass] = useState<string>("1");
  const [selectedSubject, setSelectedSubject] = useState<string>("mat");
  const [chapters, setChapters] = useState<ChapterHourAllocation[]>([]);

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Get classes for the selected track
  const classes = useMemo(() => {
    if (selectedTrack === "cbse") {
      return [
        { id: "1", name: "Class 6" },
        { id: "2", name: "Class 7" },
        { id: "3", name: "Class 8" },
        { id: "4", name: "Class 9" },
        { id: "5", name: "Class 10" },
        { id: "6", name: "Class 11" },
        { id: "7", name: "Class 12" },
      ];
    }
    // JEE uses same class IDs but only 11-12
    return [
      { id: "6", name: "Class 11" },
      { id: "7", name: "Class 12" },
    ];
  }, [selectedTrack]);

  // Get subjects for the selected class
  const subjects = useMemo(() => {
    if (selectedTrack === "cbse") {
      return getSubjectsByClass(selectedClass);
    }
    return [
      { id: "jee_phy", name: "Physics" },
      { id: "jee_mat", name: "Mathematics" },
      { id: "jee_che", name: "Chemistry" },
    ];
  }, [selectedTrack, selectedClass]);

  // Get current setup for selected class + subject
  const currentSetup = useMemo(() => {
    return academicScheduleSetups.find(
      s => s.classId === selectedClass && s.subjectId === selectedSubject
    );
  }, [selectedClass, selectedSubject]);

  // Update chapters state when setup changes
  useEffect(() => {
    if (currentSetup) {
      setChapters([...currentSetup.chapters]);
    } else {
      setChapters([]);
    }
  }, [currentSetup]);

  // Reset selected subject when class or track changes to first available subject
  useEffect(() => {
    if (subjects.length > 0) {
      const subjectExists = subjects.some(s => s.id === selectedSubject);
      if (!subjectExists) {
        const mathSubject = subjects.find(s => s.id === "mat");
        setSelectedSubject(mathSubject ? mathSubject.id : subjects[0].id);
      }
    }
  }, [selectedClass, selectedTrack, subjects]);

  // Handle drag end for reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setChapters((items) => {
        const oldIndex = items.findIndex(item => item.chapterId === active.id);
        const newIndex = items.findIndex(item => item.chapterId === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Build progress matrix data
  const progressMatrix = useMemo(() => {
    const trackClasses = selectedTrack === "cbse" 
      ? [
          { id: "1", name: "6" },
          { id: "2", name: "7" },
          { id: "3", name: "8" },
          { id: "4", name: "9" },
          { id: "5", name: "10" },
          { id: "6", name: "11" },
          { id: "7", name: "12" },
        ]
      : [{ id: "6", name: "11" }, { id: "7", name: "12" }];

    return trackClasses.map(cls => {
      const classSubjects = selectedTrack === "cbse"
        ? getSubjectsByClass(cls.id)
        : [{ id: "jee_phy", name: "Physics" }, { id: "jee_mat", name: "Math" }, { id: "jee_che", name: "Chemistry" }];

      return {
        classId: cls.id,
        className: `Class ${cls.name}`,
        subjects: classSubjects.map(s => {
          const hasSetup = academicScheduleSetups.some(
            setup => setup.classId === cls.id && setup.subjectId === s.id
          );
          return {
            subjectId: s.id,
            subjectName: s.name,
            isComplete: hasSetup,
          };
        }),
      };
    });
  }, [selectedTrack]);

  // Calculate total hours for current setup
  const totalPlannedHours = chapters.reduce(
    (sum, ch) => sum + ch.plannedHours, 0
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Syllabus Setup"
        description="Define planned hours per chapter for each class and subject"
        breadcrumbs={[
          { label: "Syllabus Tracker", href: "/institute/academic-schedule/progress" },
          { label: "Setup" },
        ]}
        actions={
          <Button className="gap-2">
            <Save className="w-4 h-4" />
            Save & Continue
          </Button>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Progress Matrix */}
        <div className="lg:col-span-1 space-y-4">
          {/* Track Selector */}
          <Card className="p-4">
            <div className="flex gap-2">
              <Button
                variant={selectedTrack === "cbse" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setSelectedTrack("cbse")}
              >
                CBSE
              </Button>
              <Button
                variant={selectedTrack === "jee" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setSelectedTrack("jee")}
              >
                JEE Mains
              </Button>
            </div>
          </Card>

          {/* Progress Matrix */}
          <SetupProgressMatrix
            trackName={selectedTrack === "cbse" ? "CBSE Curriculum" : "JEE Mains"}
            classes={progressMatrix}
            selectedClassId={selectedClass}
            onSelectClass={setSelectedClass}
          />

          {/* Info Card */}
          <Card className="p-4 bg-blue-50/50 border-blue-100">
            <div className="flex gap-3">
              <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900">How it works</p>
                <p className="text-blue-700 mt-1">
                  Define planned hours for each chapter. This helps track 
                  actual teaching vs expected pace across batches.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Chapter Allocation */}
        <div className="lg:col-span-2 space-y-4">
          {/* Subject Selector */}
          <Card className="p-4">
            <div className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground">
                Select Subject
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {subjects.map(subject => {
                  const isSelected = selectedSubject === subject.id;
                  const hasSetup = academicScheduleSetups.some(
                    s => s.classId === selectedClass && s.subjectId === subject.id
                  );
                  
                  return (
                    <button
                      key={subject.id}
                      onClick={() => setSelectedSubject(subject.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg border text-sm font-medium transition-all flex items-center gap-1.5",
                        isSelected
                          ? "ring-2 ring-primary ring-offset-2"
                          : "",
                        SUBJECT_COLORS[subject.id] || "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      {subject.name}
                      {hasSetup && (
                        <Check className="w-3.5 h-3.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Chapter Allocation */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Chapter Hours Allocation
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    Total: {totalPlannedHours}h
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {chapters.length > 0 ? (
                <div className="space-y-2">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis]}
                  >
                    <SortableContext
                      items={chapters.map(c => c.chapterId)}
                      strategy={verticalListSortingStrategy}
                    >
                      {chapters.map((chapter, index) => (
                        <SortableChapterRow
                          key={chapter.chapterId}
                          chapter={chapter}
                          index={index}
                          selectedSubject={selectedSubject}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                  
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    Drag to reorder chapters
                  </p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="font-medium text-muted-foreground">
                    No chapters configured
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Start by adding chapters from the curriculum
                  </p>
                  <Button variant="outline" className="mt-4 gap-2">
                    <Plus className="w-4 h-4" />
                    Import from Curriculum
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Hours Distribution Preview */}
          {chapters.length > 0 && (
            <Card className="p-4">
              <h4 className="text-sm font-medium mb-3">Hours Distribution</h4>
              <div className="flex gap-1 h-4 rounded-full overflow-hidden bg-muted">
                {chapters.map((chapter, index) => {
                  const widthPercent = (chapter.plannedHours / totalPlannedHours) * 100;
                  const colors = [
                    "bg-blue-500", "bg-purple-500", "bg-emerald-500", 
                    "bg-orange-500", "bg-cyan-500", "bg-amber-500",
                    "bg-red-500", "bg-green-500"
                  ];
                  
                  return (
                    <TooltipProvider key={chapter.chapterId}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(colors[index % colors.length], "transition-all cursor-pointer hover:opacity-80")}
                            style={{ width: `${widthPercent}%` }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-medium">{chapter.chapterName}</p>
                          <p className="text-xs">{chapter.plannedHours} hours ({Math.round(widthPercent)}%)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-3 mt-3">
                {chapters.slice(0, 4).map((chapter, index) => {
                  const colors = ["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-orange-500"];
                  return (
                    <div key={chapter.chapterId} className="flex items-center gap-1.5 text-xs">
                      <div className={cn("w-2.5 h-2.5 rounded-full", colors[index])} />
                      <span className="text-muted-foreground truncate max-w-[100px]">
                        {chapter.chapterName.split(" ").slice(0, 2).join(" ")}
                      </span>
                    </div>
                  );
                })}
                {chapters.length > 4 && (
                  <span className="text-xs text-muted-foreground">
                    +{chapters.length - 4} more
                  </span>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
