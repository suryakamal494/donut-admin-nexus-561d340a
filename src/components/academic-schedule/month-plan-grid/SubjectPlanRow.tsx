import { useState, useMemo, useCallback, memo } from "react";
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
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { cn } from "@/lib/utils";
import { AcademicWeek } from "@/types/academicSchedule";
import {
  SubjectPlanData,
  ChapterCellType,
  ChapterAdjustment,
  PendingChapter,
  SUBJECT_COLORS,
  SUBJECT_ICONS,
} from "@/types/academicPlanner";
import {
  getChapterCellType,
  getHoursForWeek,
} from "@/lib/academicPlannerUtils";
import { ChapterCellDragOverlay } from "../SortableChapterCell";
import { AddChapterPopover } from "../AddChapterPopover";
import { ChapterCell } from "./ChapterCell";
import { DraggableChapterCell } from "./DraggableChapterCell";
import { ChapterItemData, DraggedChapterInfo, MonthWeeksData } from "./types";

interface SubjectPlanRowProps {
  subject: SubjectPlanData;
  weeks: AcademicWeek[];
  monthWeeks: MonthWeeksData;
  currentWeekIndex: number;
  isPublished: boolean;
  pendingChapters: PendingChapter[];
  onAdjust?: (adjustment: ChapterAdjustment) => void;
  onCellClick?: (subjectId: string, chapterId: string | null, weekIndex: number) => void;
  onReorderChapters?: (subjectId: string, oldIndex: number, newIndex: number) => void;
  onAddChapter?: (subjectId: string, chapterId: string, weekIndex: number, hours: number) => void;
}

export const SubjectPlanRow = memo(function SubjectPlanRow({
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
}: SubjectPlanRowProps) {
  const colors = SUBJECT_COLORS[subject.subjectId] || SUBJECT_COLORS.mat;
  const icon = SUBJECT_ICONS[subject.subjectId] || '📚';
  
  const [activeChapter, setActiveChapter] = useState<DraggedChapterInfo | null>(null);

  // Sensors for pointer/touch and keyboard
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Build sortable items
  const chapterItems = useMemo<ChapterItemData[]>(() => {
    const items: ChapterItemData[] = [];

    monthWeeks.weeksInMonth.forEach((week, idx) => {
      const absoluteIndex = monthWeeks.startWeekIndex + idx;
      
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

  const sortableIds = chapterItems.map(item => item.id);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const draggedItem = chapterItems.find(item => item.id === event.active.id);
    if (draggedItem && draggedItem.chapterId) {
      setActiveChapter({
        chapterId: draggedItem.chapterId,
        chapterName: draggedItem.chapterName,
        chapterIndex: draggedItem.chapterIndex,
        hours: draggedItem.hours,
      });
    }
  }, [chapterItems]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveChapter(null);

    if (!over || active.id === over.id) return;

    const activeItem = chapterItems.find(item => item.id === active.id);
    const overItem = chapterItems.find(item => item.id === over.id);

    if (!activeItem || !overItem) return;
    if (activeItem.chapterIndex === -1) return;

    if (overItem.chapterIndex !== activeItem.chapterIndex && overItem.chapterIndex !== -1) {
      onReorderChapters?.(
        subject.subjectId,
        activeItem.chapterIndex,
        overItem.chapterIndex
      );
    }
  }, [chapterItems, onReorderChapters, subject.subjectId]);

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

        {/* Week Cells */}
        <SortableContext items={sortableIds} strategy={horizontalListSortingStrategy}>
          {chapterItems.map((item) => {
            const isCurrent = item.weekIndex === currentWeekIndex;
            const isEmpty = item.cellType === 'empty';
            const isDraggable = !isEmpty && !isPublished && !item.isLocked && 
              (item.cellType === 'start' || item.cellType === 'single' || item.cellType === 'full');

            // Empty cells show add chapter button
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

            // Non-draggable cells (middle, end, published)
            if (item.cellType === 'middle' || item.cellType === 'end' || isPublished) {
              return (
                <ChapterCell
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

            // Draggable cells (start, single, full)
            return (
              <DraggableChapterCell
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
});

SubjectPlanRow.displayName = "SubjectPlanRow";
