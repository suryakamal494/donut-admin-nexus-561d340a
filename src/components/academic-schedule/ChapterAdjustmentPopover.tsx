// Chapter Adjustment Popover Component
// Quick adjustment actions when clicking a chapter cell

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  ArrowLeft,
  Lock,
  Unlock,
  RefreshCw,
  Info,
} from "lucide-react";
import { ChapterAdjustment, AdjustmentType } from "@/types/academicPlanner";
import { cn } from "@/lib/utils";

interface ChapterAdjustmentPopoverProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  chapterId: string;
  chapterName: string;
  subjectId: string;
  weekIndex: number;
  hours: number;
  isLocked: boolean;
  isPublished: boolean;
  onAdjust: (adjustment: ChapterAdjustment) => void;
  onViewDetails?: () => void;
  children: React.ReactNode;
}

export function ChapterAdjustmentPopover({
  isOpen,
  onOpenChange,
  chapterId,
  chapterName,
  subjectId,
  weekIndex,
  hours,
  isLocked,
  isPublished,
  onAdjust,
  onViewDetails,
  children,
}: ChapterAdjustmentPopoverProps) {
  const handleAdjust = (type: AdjustmentType) => {
    onAdjust({
      type,
      subjectId,
      chapterId,
      weekIndex,
      timestamp: new Date().toISOString(),
    });
    onOpenChange(false);
  };

  if (isPublished) {
    return <>{children}</>;
  }

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="center">
        <div className="space-y-2">
          {/* Header */}
          <div className="px-2 py-1">
            <p className="text-sm font-medium truncate">{chapterName}</p>
            <p className="text-xs text-muted-foreground">{hours}h this week</p>
          </div>
          
          <Separator />
          
          {/* Actions */}
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 h-8"
              onClick={() => handleAdjust('extend')}
            >
              <ArrowRight className="w-4 h-4 text-blue-500" />
              <span>Extend by 1 week</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 h-8"
              onClick={() => handleAdjust('compress')}
            >
              <ArrowLeft className="w-4 h-4 text-amber-500" />
              <span>Compress by 1 week</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 h-8"
              onClick={() => handleAdjust(isLocked ? 'unlock' : 'lock')}
            >
              {isLocked ? (
                <>
                  <Unlock className="w-4 h-4 text-green-500" />
                  <span>Unlock chapter</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-orange-500" />
                  <span>Lock chapter</span>
                </>
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 h-8"
              onClick={() => handleAdjust('swap')}
            >
              <RefreshCw className="w-4 h-4 text-purple-500" />
              <span>Swap with next</span>
            </Button>
          </div>
          
          {onViewDetails && (
            <>
              <Separator />
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 h-8 text-muted-foreground"
                onClick={onViewDetails}
              >
                <Info className="w-4 h-4" />
                <span>View details</span>
              </Button>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
