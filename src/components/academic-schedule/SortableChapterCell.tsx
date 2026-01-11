// Sortable Chapter Cell Component
// Draggable chapter cell for reordering within a subject row

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Lock, ChevronRight, GripVertical, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChapterCellType } from "@/types/academicPlanner";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

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
  isModified?: boolean;
  modificationTypes?: ('reorder' | 'extend' | 'compress' | 'swap' | 'addHours' | 'removeHours' | 'manualAdd' | 'removeFromWeek')[];
  colors: { bg: string; text: string; border: string };
  onClick?: () => void;
  onRemove?: () => void;
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
  isModified = false,
  modificationTypes = [],
  colors,
  onClick,
  onRemove,
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

  const cellElement = (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative h-16 w-full flex items-center border text-xs transition-all group",
        isEmpty 
          ? "bg-muted/20 border-dashed border-muted-foreground/20" 
          : cn(colors.bg, colors.border, getOpacity(), getCellStyle()),
        isCurrent && "ring-2 ring-primary ring-offset-1",
        isDragging && "opacity-50 ring-2 ring-primary z-50 shadow-lg",
        !isPublished && !isEmpty && !isLocked && "cursor-pointer hover:shadow-md",
        isPublished && "cursor-default opacity-80",
        isLocked && "ring-1 ring-amber-400 cursor-not-allowed",
        // Modified indicator - left accent border
        isModified && !isEmpty && "border-l-4 border-l-orange-400"
      )}
      onClick={onClick}
    >
      {/* Drag Handle - Always visible on left side */}
      {showDragHandle && (
        <div
          {...attributes}
          {...listeners}
          className={cn(
            "flex items-center justify-center w-6 h-full cursor-grab active:cursor-grabbing",
            "bg-muted/30 hover:bg-muted/50 transition-colors",
            "border-r border-border/50",
            cellType === 'start' && "rounded-l-lg",
            cellType === 'single' && "rounded-l-lg",
            cellType === 'full' && "rounded-l-lg"
          )}
          title="Drag to reorder"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-3 h-3 text-muted-foreground" />
        </div>
      )}

      {/* Cell Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-1 min-w-0">
        {/* Modified Badge */}
        {isModified && !isEmpty && (cellType === 'start' || cellType === 'single' || cellType === 'full') && (
          <div className="absolute -top-1.5 right-1 bg-orange-500 text-white text-[8px] px-1 py-0.5 rounded-sm font-medium flex items-center gap-0.5 shadow-sm">
            <Pencil className="w-2 h-2" />
          </div>
        )}

        {!isEmpty && (
          <>
            <div 
              className={cn("font-medium truncate w-full text-center px-1", colors.text)}
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
      </div>

      {/* Quick Delete Button - on hover */}
      {!isEmpty && !isPublished && !isLocked && onRemove && (
        <button
          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600 z-10"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          title="Remove from week"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );

  // Wrap with tooltip for full chapter name and modification info
  if (!isEmpty) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {cellElement}
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[250px]">
            <div className="text-xs space-y-1">
              <p className="font-medium">{chapterName}</p>
              <p className="text-muted-foreground">{hours} hours this week</p>
              {isModified && modificationLabel && (
                <p className="text-orange-600">✎ {modificationLabel}</p>
              )}
              {showDragHandle && (
                <p className="text-blue-600">⋮⋮ Drag handle on left to reorder</p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return cellElement;
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
        "h-16 min-w-[100px] px-3 flex flex-col items-center justify-center border text-xs rounded-lg shadow-xl",
        colors.bg, colors.border, "bg-opacity-90",
        "rotate-2 scale-105"
      )}
    >
      <div className={cn("font-medium truncate max-w-full", colors.text)}>
        {chapterName}
      </div>
      <div className="text-[10px] text-muted-foreground">
        {hours}h
      </div>
    </div>
  );
}