// Sortable Chapter Cell Component
// Draggable chapter cell for reordering within a subject row

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Lock, ChevronRight, GripHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChapterCellType } from "@/types/academicPlanner";

interface SortableChapterCellProps {
  id: string;
  chapterId: string | null;
  chapterName: string | null;
  hours: number;
  cellType: ChapterCellType;
  isCurrent: boolean;
  isLocked: boolean;
  isPublished: boolean;
  isDraggable: boolean;
  colors: { bg: string; text: string; border: string };
  onClick?: () => void;
}

export function SortableChapterCell({
  id,
  chapterId,
  chapterName,
  hours,
  cellType,
  isCurrent,
  isLocked,
  isPublished,
  isDraggable,
  colors,
  onClick,
}: SortableChapterCellProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id,
    disabled: !isDraggable || isPublished || isLocked,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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

  // Only the start cell (or single cell) should show the drag handle
  const showDragHandle = isDraggable && !isPublished && !isLocked && 
    (cellType === 'start' || cellType === 'single' || cellType === 'full');

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative h-16 w-full flex flex-col items-center justify-center border text-xs transition-all",
        isEmpty 
          ? "bg-muted/20 border-dashed border-muted-foreground/20" 
          : cn(colors.bg, colors.border, getOpacity(), getCellStyle()),
        isCurrent && "ring-2 ring-primary ring-offset-1",
        isDragging && "opacity-50 ring-2 ring-primary z-50 shadow-lg",
        !isPublished && !isEmpty && !isLocked && "cursor-grab active:cursor-grabbing",
        isPublished && "cursor-default opacity-80",
        isLocked && "ring-1 ring-amber-400 cursor-not-allowed"
      )}
      onClick={onClick}
    >
      {/* Drag Handle Overlay */}
      {showDragHandle && (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-0.5 right-0.5 p-1 rounded opacity-0 hover:opacity-100 transition-opacity bg-background/50"
          title="Drag to reorder"
        >
          <GripHorizontal className="w-3 h-3 text-muted-foreground" />
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
    </div>
  );
}

// Drag overlay component for floating preview
export function ChapterCellDragOverlay({
  chapterName,
  hours,
  colors,
}: {
  chapterName: string;
  hours: number;
  colors: { bg: string; text: string; border: string };
}) {
  return (
    <div
      className={cn(
        "h-16 min-w-[80px] px-3 flex flex-col items-center justify-center border text-xs rounded-lg shadow-xl",
        colors.bg, colors.border, "bg-opacity-90",
        "rotate-2 scale-105"
      )}
    >
      <div className={cn("font-medium truncate max-w-full", colors.text)}>
        {chapterName?.split(' ').slice(0, 2).join(' ')}
      </div>
      <div className="text-[10px] text-muted-foreground">
        {hours}h
      </div>
    </div>
  );
}
