import { useState, useRef, useEffect, memo, useCallback } from "react";
import { Lock, ChevronRight, Pencil } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ChapterCellType, ChapterAdjustment } from "@/types/academicPlanner";
import { ChapterAdjustmentPopover } from "../ChapterAdjustmentPopover";
import { 
  ModificationType, 
  SubjectColors, 
  getCellStyle, 
  getCellOpacity, 
  getModificationLabel,
  triggerHaptic 
} from "./types";

interface ChapterCellProps {
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
  colors: SubjectColors;
  onAdjust?: (adjustment: ChapterAdjustment) => void;
  onClick?: () => void;
}

export const ChapterCell = memo(function ChapterCell({
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
}: ChapterCellProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const isEmpty = cellType === 'empty';
  
  // Long press state for mobile
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);

  // Handle touch start for long press
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isPublished || isEmpty) return;
    
    const touch = e.touches[0];
    touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };
    
    longPressTimerRef.current = setTimeout(() => {
      setIsLongPressing(true);
      triggerHaptic(15);
      setIsPopoverOpen(true);
    }, 500);
  }, [isPublished, isEmpty]);

  // Handle touch move - cancel long press if moved too much
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
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
  }, []);

  // Handle touch end
  const handleTouchEnd = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    touchStartPosRef.current = null;
    setIsLongPressing(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  const modificationLabel = getModificationLabel(modificationTypes);

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
        "relative min-h-[48px] md:h-16 w-full flex flex-col items-center justify-center border text-xs transition-all touch-manipulation",
        isEmpty 
          ? "bg-muted/20 border-dashed border-muted-foreground/20 hover:bg-muted/40" 
          : cn(colors.bg, colors.border, getCellOpacity(cellType), getCellStyle(cellType)),
        isCurrent && "ring-2 ring-primary ring-offset-1",
        !isPublished && !isEmpty && "hover:shadow-md cursor-pointer active:scale-[0.98]",
        isPublished && "cursor-default opacity-80",
        isLocked && "ring-1 ring-amber-400",
        isModified && !isEmpty && "border-l-4 border-l-orange-400",
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
});

ChapterCell.displayName = "ChapterCell";
