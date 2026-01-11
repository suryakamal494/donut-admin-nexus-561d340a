// Month Plan Grid Component
// Main grid visualization for the Academic Planner workspace
// Now with drag-and-drop chapter reordering using @dnd-kit

import { useState, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToHorizontalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Lock, ChevronRight, GripHorizontal, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { AcademicWeek } from "@/types/academicSchedule";
import {
  BatchAcademicPlan,
  SubjectPlanData,
  ChapterCellType,
  ChapterAdjustment,
  SUBJECT_COLORS,
  SUBJECT_ICONS,
  ChapterWeekAssignment,
} from "@/types/academicPlanner";
import {
  getChapterCellType,
  getHoursForWeek,
  getWeekNumberInMonth,
} from "@/lib/academicPlannerUtils";
import { ChapterAdjustmentPopover } from "./ChapterAdjustmentPopover";
import { SortableChapterCell, ChapterCellDragOverlay } from "./SortableChapterCell";

interface MonthPlanGridProps {
  plan: BatchAcademicPlan;
  weeks: AcademicWeek[];
  monthWeeks: { startWeekIndex: number; endWeekIndex: number; weeksInMonth: AcademicWeek[] };
  currentWeekIndex: number;
  publishedMonths: Set<number>;
  onAdjust?: (adjustment: ChapterAdjustment) => void;
  onCellClick?: (subjectId: string, chapterId: string | null, weekIndex: number) => void;
  onReorderChapters?: (subjectId: string, oldIndex: number, newIndex: number) => void;
}

export function MonthPlanGrid({
  plan,
  weeks,
  monthWeeks,
  currentWeekIndex,
  publishedMonths,
  onAdjust,
  onCellClick,
  onReorderChapters,
}: MonthPlanGridProps) {
  // Get month name
  const monthName = useMemo(() => {
    if (monthWeeks.weeksInMonth.length === 0) return "";
    const firstWeek = monthWeeks.weeksInMonth[0];
    const date = new Date(firstWeek.startDate);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [monthWeeks]);

  // Check if month is published
  const isMonthPublished = useMemo(() => {
    if (monthWeeks.weeksInMonth.length === 0) return false;
    const date = new Date(monthWeeks.weeksInMonth[0].startDate);
    return publishedMonths.has(date.getMonth());
  }, [monthWeeks, publishedMonths]);

  return (
    <div className="space-y-3">
      {/* Month Header */}
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">{monthName}</h3>
        {isMonthPublished && (
          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
            <Lock className="w-3 h-3 mr-1" />
            Published
          </Badge>
        )}
        {!isMonthPublished && onReorderChapters && (
          <Badge variant="outline" className="text-xs gap-1">
            <GripHorizontal className="w-3 h-3" />
            Drag to reorder
          </Badge>
        )}
      </div>

      {/* Grid */}
      <ScrollArea className="w-full">
        <div className="min-w-[600px]">
          {/* Header Row - Weeks */}
          <div className="grid gap-1" style={{ 
            gridTemplateColumns: `140px repeat(${monthWeeks.weeksInMonth.length}, 1fr)` 
          }}>
            {/* Empty corner cell */}
            <div className="h-12" />
            
            {/* Week headers */}
            {monthWeeks.weeksInMonth.map((week, idx) => {
              const absoluteIndex = monthWeeks.startWeekIndex + idx;
              const weekInMonth = getWeekNumberInMonth(week, weeks);
              const isCurrent = absoluteIndex === currentWeekIndex;
              const startDay = new Date(week.startDate).getDate();
              const endDay = new Date(week.endDate).getDate();
              
              return (
                <div
                  key={week.weekNumber}
                  className={cn(
                    "h-12 flex flex-col items-center justify-center rounded-t-lg border-t border-x text-xs",
                    isCurrent 
                      ? "bg-primary/10 border-primary" 
                      : "bg-muted/30 border-border"
                  )}
                >
                  <span className="font-medium">Week {weekInMonth}</span>
                  <span className="text-muted-foreground text-[10px]">
                    {startDay}-{endDay}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Subject Rows */}
          {plan.subjects.map((subject) => (
            <SubjectRow
              key={subject.subjectId}
              subject={subject}
              weeks={weeks}
              monthWeeks={monthWeeks}
              currentWeekIndex={currentWeekIndex}
              isPublished={isMonthPublished}
              onAdjust={onAdjust}
              onCellClick={onCellClick}
              onReorderChapters={onReorderChapters}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-2 border-t">
        <span className="font-medium">Legend:</span>
        <div className="flex items-center gap-1.5">
          <div className="w-8 h-3 bg-primary/70 rounded" />
          <span>Full week</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-8 h-3 bg-primary/40 rounded-l" />
          <span>Continues</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-8 h-3 bg-primary/40 rounded-r flex items-center justify-end pr-1">
            <ChevronRight className="w-2 h-2" />
          </div>
          <span>Continues next</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Lock className="w-3 h-3 text-amber-600" />
          <span>Locked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <GripHorizontal className="w-3 h-3" />
          <span>Draggable</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5 bg-orange-500 text-white text-[8px] px-1 py-0.5 rounded-sm">
            <Pencil className="w-2 h-2" />
          </div>
          <span>Modified</span>
        </div>
      </div>
    </div>
  );
}

// Subject Row Component with Drag and Drop
interface SubjectRowProps {
  subject: SubjectPlanData;
  weeks: AcademicWeek[];
  monthWeeks: { startWeekIndex: number; endWeekIndex: number; weeksInMonth: AcademicWeek[] };
  currentWeekIndex: number;
  isPublished: boolean;
  onAdjust?: (adjustment: ChapterAdjustment) => void;
  onCellClick?: (subjectId: string, chapterId: string | null, weekIndex: number) => void;
  onReorderChapters?: (subjectId: string, oldIndex: number, newIndex: number) => void;
}

interface DraggedChapterInfo {
  chapterId: string;
  chapterName: string;
  chapterIndex: number;
  hours: number;
}

function SubjectRow({
  subject,
  weeks,
  monthWeeks,
  currentWeekIndex,
  isPublished,
  onAdjust,
  onCellClick,
  onReorderChapters,
}: SubjectRowProps) {
  const colors = SUBJECT_COLORS[subject.subjectId] || SUBJECT_COLORS.mat;
  const icon = SUBJECT_ICONS[subject.subjectId] || '📚';
  
  const [activeChapter, setActiveChapter] = useState<DraggedChapterInfo | null>(null);

  // Sensors for pointer/touch and keyboard
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement to start drag (prevent accidental drags)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Build sortable items - use chapter assignments that appear in this month
  const chapterItems = useMemo(() => {
    const items: { 
      id: string; 
      chapterId: string; 
      chapterName: string;
      chapterIndex: number;
      weekIndex: number;
      hours: number;
      cellType: ChapterCellType;
      isLocked: boolean;
      assignment: ChapterWeekAssignment | null;
    }[] = [];

    monthWeeks.weeksInMonth.forEach((week, idx) => {
      const absoluteIndex = monthWeeks.startWeekIndex + idx;
      
      // Find chapter for this week
      const foundAssignment = subject.chapterAssignments.find(
        a => absoluteIndex >= a.startWeekIndex && absoluteIndex <= a.endWeekIndex
      );
      
      const chapterIndex = foundAssignment 
        ? subject.chapterAssignments.findIndex(a => a.chapterId === foundAssignment.chapterId)
        : -1;
      
      const cellType: ChapterCellType = foundAssignment 
        ? getChapterCellType(absoluteIndex, foundAssignment)
        : 'empty';
      
      const hours = foundAssignment 
        ? getHoursForWeek(absoluteIndex, foundAssignment)
        : 0;

      items.push({
        id: `${subject.subjectId}-${week.weekNumber}-${absoluteIndex}`,
        chapterId: foundAssignment?.chapterId || '',
        chapterName: foundAssignment?.chapterName || '',
        chapterIndex,
        weekIndex: absoluteIndex,
        hours,
        cellType,
        isLocked: foundAssignment?.isLocked || false,
        assignment: foundAssignment || null,
      });
    });

    return items;
  }, [subject, monthWeeks]);

  // Get unique chapter IDs for sortable context (only chapters visible in this month)
  const sortableIds = chapterItems.map(item => item.id);

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const draggedItem = chapterItems.find(item => item.id === event.active.id);
    if (draggedItem && draggedItem.chapterId) {
      setActiveChapter({
        chapterId: draggedItem.chapterId,
        chapterName: draggedItem.chapterName,
        chapterIndex: draggedItem.chapterIndex,
        hours: draggedItem.hours,
      });
    }
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveChapter(null);

    if (!over || active.id === over.id) return;

    const activeItem = chapterItems.find(item => item.id === active.id);
    const overItem = chapterItems.find(item => item.id === over.id);

    if (!activeItem || !overItem) return;
    if (activeItem.chapterIndex === -1) return; // Can't drag empty cells

    // If dropping on an empty cell or different chapter, perform reorder
    if (overItem.chapterIndex !== activeItem.chapterIndex && overItem.chapterIndex !== -1) {
      // Swap chapters
      onReorderChapters?.(
        subject.subjectId,
        activeItem.chapterIndex,
        overItem.chapterIndex
      );
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToHorizontalAxis]}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div 
        className="grid gap-1 mb-1" 
        style={{ 
          gridTemplateColumns: `140px repeat(${monthWeeks.weeksInMonth.length}, 1fr)` 
        }}
      >
        {/* Subject Label */}
        <div className={cn(
          "h-16 flex items-center gap-2 px-3 rounded-l-lg border-y border-l",
          colors.bg, colors.border
        )}>
          <span className="text-lg">{icon}</span>
          <div className="min-w-0">
            <div className={cn("text-sm font-medium truncate", colors.text)}>
              {subject.subjectName}
            </div>
            <div className="text-[10px] text-muted-foreground">
              {subject.weeklyHours}h/week
            </div>
          </div>
        </div>

        {/* Week Cells - Sortable */}
        <SortableContext items={sortableIds} strategy={horizontalListSortingStrategy}>
          {chapterItems.map((item) => {
            const isCurrent = item.weekIndex === currentWeekIndex;
            const isEmpty = item.cellType === 'empty';
            const isDraggable = !isEmpty && !isPublished && !item.isLocked && 
              (item.cellType === 'start' || item.cellType === 'single' || item.cellType === 'full');

            // For non-draggable cells (middle, end, locked, published), use regular cell with popover
            if (isEmpty || item.cellType === 'middle' || item.cellType === 'end' || isPublished) {
              return (
                <ChapterCellWithPopover
                  key={item.id}
                  subjectId={subject.subjectId}
                  chapterId={item.chapterId || null}
                  chapterName={item.chapterName || null}
                  hours={item.hours}
                  weekIndex={item.weekIndex}
                  cellType={item.cellType}
                  isCurrent={isCurrent}
                  isLocked={item.isLocked}
                  isPublished={isPublished}
                  isModified={item.assignment?.isModified || false}
                  modificationTypes={item.assignment?.modificationTypes || []}
                  colors={colors}
                  onAdjust={onAdjust}
                  onClick={() => onCellClick?.(subject.subjectId, item.chapterId || null, item.weekIndex)}
                />
              );
            }

            // For draggable cells (start, single, full), use sortable cell
            return (
              <ChapterCellWithDrag
                key={item.id}
                id={item.id}
                subjectId={subject.subjectId}
                chapterId={item.chapterId}
                chapterName={item.chapterName}
                hours={item.hours}
                weekIndex={item.weekIndex}
                cellType={item.cellType}
                isCurrent={isCurrent}
                isLocked={item.isLocked}
                isPublished={isPublished}
                isDraggable={isDraggable}
                isModified={item.assignment?.isModified || false}
                modificationTypes={item.assignment?.modificationTypes || []}
                colors={colors}
                onAdjust={onAdjust}
                onClick={() => onCellClick?.(subject.subjectId, item.chapterId || null, item.weekIndex)}
              />
            );
          })}
        </SortableContext>
      </div>

      {/* Drag Overlay */}
      <DragOverlay modifiers={[restrictToHorizontalAxis]}>
        {activeChapter ? (
          <ChapterCellDragOverlay
            chapterName={activeChapter.chapterName}
            hours={activeChapter.hours}
            colors={colors}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

// Chapter Cell with Drag functionality
interface ChapterCellWithDragProps {
  id: string;
  subjectId: string;
  chapterId: string;
  chapterName: string;
  hours: number;
  weekIndex: number;
  cellType: ChapterCellType;
  isCurrent: boolean;
  isLocked: boolean;
  isPublished: boolean;
  isDraggable: boolean;
  isModified: boolean;
  modificationTypes: ('reorder' | 'extend' | 'compress' | 'swap')[];
  colors: { bg: string; text: string; border: string };
  onAdjust?: (adjustment: ChapterAdjustment) => void;
  onClick?: () => void;
}

function ChapterCellWithDrag({
  id,
  subjectId,
  chapterId,
  chapterName,
  hours,
  weekIndex,
  cellType,
  isCurrent,
  isLocked,
  isPublished,
  isDraggable,
  isModified,
  modificationTypes,
  colors,
  onAdjust,
  onClick,
}: ChapterCellWithDragProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Wrap sortable cell with popover
  return (
    <ChapterAdjustmentPopover
      isOpen={isPopoverOpen}
      onOpenChange={setIsPopoverOpen}
      chapterId={chapterId}
      chapterName={chapterName}
      subjectId={subjectId}
      weekIndex={weekIndex}
      hours={hours}
      isLocked={isLocked}
      isPublished={isPublished}
      onAdjust={(adjustment) => {
        onAdjust?.(adjustment);
        setIsPopoverOpen(false);
      }}
    >
      <div onClick={() => !isPublished && setIsPopoverOpen(true)}>
        <SortableChapterCell
          id={id}
          chapterId={chapterId}
          chapterName={chapterName}
          hours={hours}
          cellType={cellType}
          isCurrent={isCurrent}
          isLocked={isLocked}
          isPublished={isPublished}
          isDraggable={isDraggable}
          isModified={isModified}
          modificationTypes={modificationTypes}
          colors={colors}
          onClick={onClick}
        />
      </div>
    </ChapterAdjustmentPopover>
  );
}

// Chapter Cell with Popover Component (non-draggable)
interface ChapterCellWithPopoverProps {
  subjectId: string;
  chapterId: string | null;
  chapterName: string | null;
  hours: number;
  weekIndex: number;
  cellType: ChapterCellType;
  isCurrent: boolean;
  isLocked: boolean;
  isPublished: boolean;
  isModified: boolean;
  modificationTypes: ('reorder' | 'extend' | 'compress' | 'swap')[];
  colors: { bg: string; text: string; border: string };
  onAdjust?: (adjustment: ChapterAdjustment) => void;
  onClick?: () => void;
}

function ChapterCellWithPopover({
  subjectId,
  chapterId,
  chapterName,
  hours,
  weekIndex,
  cellType,
  isCurrent,
  isLocked,
  isPublished,
  isModified,
  modificationTypes,
  colors,
  onAdjust,
  onClick,
}: ChapterCellWithPopoverProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const isEmpty = cellType === 'empty';
  
  // Determine visual style based on cell type
  const getCellStyle = () => {
    switch (cellType) {
      case 'single':
        return "rounded-lg";
      case 'start':
        return "rounded-l-lg";
      case 'end':
        return "rounded-r-lg";
      case 'middle':
        return "";
      case 'full':
        return "rounded-lg";
      default:
        return "rounded-lg";
    }
  };
  
  const getOpacity = () => {
    switch (cellType) {
      case 'single':
      case 'full':
        return "bg-opacity-70";
      case 'start':
        return "bg-opacity-60";
      case 'middle':
        return "bg-opacity-40";
      case 'end':
        return "bg-opacity-50";
      default:
        return "";
    }
  };

  // Get modification label for tooltip
  const getModificationLabel = () => {
    if (!isModified || modificationTypes.length === 0) return null;
    const labels: string[] = [];
    if (modificationTypes.includes('reorder')) labels.push('Reordered');
    if (modificationTypes.includes('extend')) labels.push('Extended');
    if (modificationTypes.includes('compress')) labels.push('Compressed');
    if (modificationTypes.includes('swap')) labels.push('Swapped');
    return labels.join(', ');
  };

  const modificationLabel = getModificationLabel();

  const cellContent = (
    <button
      onClick={() => {
        if (!isEmpty && !isPublished) {
          setIsPopoverOpen(true);
        } else {
          onClick?.();
        }
      }}
      disabled={isPublished}
      className={cn(
        "relative h-16 w-full flex flex-col items-center justify-center border text-xs transition-all",
        isEmpty 
          ? "bg-muted/20 border-dashed border-muted-foreground/20 hover:bg-muted/40" 
          : cn(colors.bg, colors.border, getOpacity(), getCellStyle()),
        isCurrent && "ring-2 ring-primary ring-offset-1",
        !isPublished && !isEmpty && "hover:shadow-md cursor-pointer",
        isPublished && "cursor-default opacity-80",
        isLocked && "ring-1 ring-amber-400",
        // Modified indicator - dashed border top
        isModified && !isEmpty && "border-t-2 border-t-orange-400 border-dashed"
      )}
    >
      {/* Modified Badge */}
      {isModified && !isEmpty && (cellType === 'start' || cellType === 'single' || cellType === 'full') && (
        <div className="absolute -top-1.5 left-1 bg-orange-500 text-white text-[8px] px-1 py-0.5 rounded-sm font-medium flex items-center gap-0.5 shadow-sm">
          <Pencil className="w-2 h-2" />
          <span className="hidden sm:inline">Edited</span>
        </div>
      )}
      
      {!isEmpty && (
        <>
          <div className={cn("font-medium truncate max-w-full px-1", colors.text)}>
            {chapterName?.split(' ').slice(0, 2).join(' ')}
            {(cellType === 'middle' || cellType === 'end') && '...'}
          </div>
          <div className="text-[10px] text-muted-foreground flex items-center gap-1">
            {hours}h
            {isLocked && <Lock className="w-2.5 h-2.5 text-amber-600" />}
            {cellType === 'end' && <ChevronRight className="w-2.5 h-2.5" />}
          </div>
        </>
      )}
      {isEmpty && (
        <span className="text-muted-foreground/50">—</span>
      )}
    </button>
  );

  // If empty or published, just show tooltip
  if (isEmpty || isPublished) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {cellContent}
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[200px]">
            {isEmpty ? (
              <p>No chapter planned</p>
            ) : (
              <div className="text-xs">
                <p className="font-medium">{chapterName}</p>
                <p className="text-muted-foreground">{hours} hours this week</p>
                {isModified && modificationLabel && (
                  <p className="text-orange-600">✎ {modificationLabel}</p>
                )}
                {isPublished && <p className="text-green-600">✓ Published (read-only)</p>}
              </div>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Show popover for adjustable cells
  return (
    <ChapterAdjustmentPopover
      isOpen={isPopoverOpen}
      onOpenChange={setIsPopoverOpen}
      chapterId={chapterId!}
      chapterName={chapterName!}
      subjectId={subjectId}
      weekIndex={weekIndex}
      hours={hours}
      isLocked={isLocked}
      isPublished={isPublished}
      onAdjust={(adjustment) => {
        onAdjust?.(adjustment);
        setIsPopoverOpen(false);
      }}
    >
      {cellContent}
    </ChapterAdjustmentPopover>
  );
}
