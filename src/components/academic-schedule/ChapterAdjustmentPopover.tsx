// Chapter Adjustment Popover Component
// Hour-based adjustment actions when clicking a chapter cell

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Minus,
  Lock,
  Unlock,
  RefreshCw,
  Trash2,
  Info,
} from "lucide-react";
import { ChapterAdjustment, AdjustmentType } from "@/types/academicPlanner";

interface ChapterAdjustmentPopoverProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  chapterId: string;
  chapterName: string;
  subjectId: string;
  weekIndex: number;
  hours: number;
  totalChapterHours?: number;
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
  totalChapterHours,
  isLocked,
  isPublished,
  onAdjust,
  onViewDetails,
  children,
}: ChapterAdjustmentPopoverProps) {
  const [customHours, setCustomHours] = useState<string>("");

  const handleAdjust = (type: AdjustmentType, hoursValue?: number) => {
    onAdjust({
      type,
      subjectId,
      chapterId,
      weekIndex,
      hours: hoursValue,
      timestamp: new Date().toISOString(),
    });
    onOpenChange(false);
  };

  const handleCustomHoursApply = () => {
    const value = parseInt(customHours);
    if (value && value > 0) {
      handleAdjust('setHours', value);
    }
    setCustomHours("");
  };

  if (isPublished) {
    return <>{children}</>;
  }

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="center">
        <div className="space-y-3">
          {/* Header */}
          <div className="px-1">
            <p className="text-sm font-medium truncate" title={chapterName}>{chapterName}</p>
            <p className="text-xs text-muted-foreground">
              {hours}h this week
              {totalChapterHours && ` · ${totalChapterHours}h total`}
            </p>
          </div>
          
          <Separator />
          
          {/* Hour Adjustments */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">Adjust Hours</Label>
            
            {/* Quick add/remove buttons */}
            <div className="flex gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8 text-xs gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleAdjust('removeHours', 1)}
                disabled={hours <= 1}
              >
                <Minus className="w-3 h-3" />
                1h
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8 text-xs gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={() => handleAdjust('addHours', 1)}
              >
                <Plus className="w-3 h-3" />
                1h
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8 text-xs gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={() => handleAdjust('addHours', 2)}
              >
                <Plus className="w-3 h-3" />
                2h
              </Button>
            </div>
            
            {/* Custom hours input */}
            <div className="flex gap-1.5 items-center">
              <Input
                type="number"
                min="1"
                max="20"
                placeholder="Custom"
                value={customHours}
                onChange={(e) => setCustomHours(e.target.value)}
                className="h-8 text-xs"
              />
              <Button
                variant="secondary"
                size="sm"
                className="h-8 text-xs whitespace-nowrap"
                onClick={handleCustomHoursApply}
                disabled={!customHours || parseInt(customHours) <= 0}
              >
                Set Hours
              </Button>
            </div>
          </div>
          
          <Separator />
          
          {/* Actions */}
          <div className="space-y-1">
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
                  <Lock className="w-4 h-4 text-amber-500" />
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
            
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => handleAdjust('removeFromWeek')}
            >
              <Trash2 className="w-4 h-4" />
              <span>Remove from this week</span>
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
