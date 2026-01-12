import { useState } from "react";
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

export function DraggableChapterCell({
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
