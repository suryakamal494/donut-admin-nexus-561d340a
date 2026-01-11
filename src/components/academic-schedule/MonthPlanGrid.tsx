// Month Plan Grid Component
// Main grid visualization for the Academic Planner workspace
// Now with drag-and-drop chapter reordering using @dnd-kit

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
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
import { Lock, ChevronRight, GripVertical, Pencil, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { AcademicWeek } from "@/types/academicSchedule";
import {
  BatchAcademicPlan,
  SubjectPlanData,
  ChapterCellType,
  ChapterAdjustment,
  PendingChapter,
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
import { AddChapterPopover } from "./AddChapterPopover";

// Modification types union
type ModificationType = 'reorder' | 'extend' | 'compress' | 'swap' | 'addHours' | 'removeHours' | 'manualAdd' | 'removeFromWeek';

interface MonthPlanGridProps {
  plan: BatchAcademicPlan;
  weeks: AcademicWeek[];
  monthWeeks: { startWeekIndex: number; endWeekIndex: number; weeksInMonth: AcademicWeek[] };
  currentWeekIndex: number;
  publishedMonths: Set<number>;
  pendingChaptersBySubject?: Record<string, PendingChapter[]>;
  onAdjust?: (adjustment: ChapterAdjustment) => void;
  onCellClick?: (subjectId: string, chapterId: string | null, weekIndex: number) => void;
  onReorderChapters?: (subjectId: string, oldIndex: number, newIndex: number) => void;
  onAddChapter?: (subjectId: string, chapterId: string, weekIndex: number, hours: number) => void;
}

export function MonthPlanGrid({
  plan,
  weeks,
  monthWeeks,
  currentWeekIndex,
  publishedMonths,
  pendingChaptersBySubject = {},
  onAdjust,
  onCellClick,
  onReorderChapters,
  onAddChapter,
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
            <GripVertical className="w-3 h-3" />
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
              pendingChapters={pendingChaptersBySubject[subject.subjectId] || []}
              onAdjust={onAdjust}
              onCellClick={onCellClick}
              onReorderChapters={onReorderChapters}
              onAddChapter={onAddChapter}
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
          <GripVertical className="w-3 h-3" />
          <span>Draggable</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-3 bg-orange-400 rounded" />
          <span>Modified</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Plus className="w-3 h-3 text-primary" />
          <span>Add chapter</span>
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
  pendingChapters: PendingChapter[];
  onAdjust?: (adjustment: ChapterAdjustment) => void;
  onCellClick?: (subjectId: string, chapterId: string | null, weekIndex: number) => void;
  onReorderChapters?: (subjectId: string, oldIndex: number, newIndex: number) => void;
  onAddChapter?: (subjectId: string, chapterId: string, weekIndex: number, hours: number) => void;
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
  pendingChapters,
  onAdjust,
  onCellClick,
  onReorderChapters,
  onAddChapter,
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

            // For empty cells, show add chapter button
            if (isEmpty) {
              return (
                <AddChapterPopover
                  key={item.id}
                  subjectId={subject.subjectId}
                  subjectName={subject.subjectName}
                  weekIndex={item.weekIndex}
                  weeklyHours={subject.weeklyHours}
                  pendingChapters={pendingChapters}
                  onAddChapter={(chapterId, hours) => {
                    onAddChapter?.(subject.subjectId, chapterId, item.weekIndex, hours);
                  }}
                />
              );
            }

            // For non-draggable cells (middle, end, locked, published), use regular cell with popover
            if (item.cellType === 'middle' || item.cellType === 'end' || isPublished) {
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
  modificationTypes: ModificationType[];
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
          onLongPress={() => !isPublished && setIsPopoverOpen(true)}
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
  modificationTypes: ModificationType[];
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
  
  // Long press state for mobile
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);

  // Trigger haptic feedback if available
  const triggerHaptic = (duration: number = 10) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(duration);
    }
  };

  // Handle touch start for long press
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isPublished || isEmpty) return;
    
    const touch = e.touches[0];
    touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };
    
    longPressTimerRef.current = setTimeout(() => {
      setIsLongPressing(true);
      triggerHaptic(15);
      setIsPopoverOpen(true);
    }, 500);
  };

  // Handle touch move - cancel long press if moved too much
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartPosRef.current || !longPressTimerRef.current) return;
    
    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - touchStartPosRef.current.x);
    const dy = Math.abs(touch.clientY - touchStartPosRef.current.y);
    
    if (dx > 10 || dy > 10) {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    }
  };

  // Handle touch end
  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    touchStartPosRef.current = null;
    setIsLongPressing(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);
  
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
    if (modificationTypes.includes('addHours')) labels.push('Hours Added');
    if (modificationTypes.includes('removeHours')) labels.push('Hours Removed');
    if (modificationTypes.includes('manualAdd')) labels.push('Manually Added');
    if (modificationTypes.includes('removeFromWeek')) labels.push('Removed');
    return labels.join(', ');
  };

  const modificationLabel = getModificationLabel();

  const cellContent = (
    <button
      onClick={() => {
        if (!isEmpty && !isPublished && !isLongPressing) {
          triggerHaptic(5);
          setIsPopoverOpen(true);
        } else {
          onClick?.();
        }
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      disabled={isPublished}
      className={cn(
        // Increased height for mobile touch (min 48px)
        "relative min-h-[48px] md:h-16 w-full flex flex-col items-center justify-center border text-xs transition-all touch-manipulation",
        isEmpty 
          ? "bg-muted/20 border-dashed border-muted-foreground/20 hover:bg-muted/40" 
          : cn(colors.bg, colors.border, getOpacity(), getCellStyle()),
        isCurrent && "ring-2 ring-primary ring-offset-1",
        !isPublished && !isEmpty && "hover:shadow-md cursor-pointer active:scale-[0.98]",
        isPublished && "cursor-default opacity-80",
        isLocked && "ring-1 ring-amber-400",
        // Modified indicator - left accent border
        isModified && !isEmpty && "border-l-4 border-l-orange-400",
        // Long press visual feedback
        isLongPressing && "scale-[0.96] ring-2 ring-primary/50"
      )}
    >
      {/* Modified Badge */}
      {isModified && !isEmpty && (cellType === 'start' || cellType === 'single' || cellType === 'full') && (
        <div className="absolute -top-1.5 right-1 bg-orange-500 text-white text-[8px] px-1 py-0.5 rounded-sm font-medium flex items-center gap-0.5 shadow-sm">
          <Pencil className="w-2 h-2" />
        </div>
      )}
      
      {!isEmpty && (
        <>
          <div 
            className={cn("font-medium truncate max-w-full px-1 text-[11px] md:text-xs", colors.text)}
            title={chapterName || undefined}
          >
            {chapterName}
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

      {/* Long press hint for mobile */}
      {!isEmpty && !isPublished && (
        <div className="absolute bottom-0.5 right-0.5 md:hidden">
          <span className="text-[8px] text-muted-foreground/50">hold</span>
        </div>
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