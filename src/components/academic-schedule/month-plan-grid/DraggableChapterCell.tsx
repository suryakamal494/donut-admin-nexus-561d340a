import { useState, memo, useCallback } from "react";
import { ChapterCellType, ChapterAdjustment } from "@/types/academicPlanner";
import { ChapterAdjustmentPopover } from "../ChapterAdjustmentPopover";
import { SortableChapterCell } from "../SortableChapterCell";
import { ModificationType, SubjectColors } from "./types";

interface DraggableChapterCellProps {
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
  colors: SubjectColors;
  onAdjust?: (adjustment: ChapterAdjustment) => void;
  onClick?: () => void;
}

export const DraggableChapterCell = memo(function DraggableChapterCell({
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
}: DraggableChapterCellProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleAdjust = useCallback((adjustment: ChapterAdjustment) => {
    onAdjust?.(adjustment);
    setIsPopoverOpen(false);
  }, [onAdjust]);

  const handleClick = useCallback(() => {
    if (!isPublished) setIsPopoverOpen(true);
  }, [isPublished]);

  const handleLongPress = useCallback(() => {
    if (!isPublished) setIsPopoverOpen(true);
  }, [isPublished]);

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
      onAdjust={handleAdjust}
    >
      <div onClick={handleClick}>
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
          onLongPress={handleLongPress}
        />
      </div>
    </ChapterAdjustmentPopover>
  );
});

DraggableChapterCell.displayName = "DraggableChapterCell";
