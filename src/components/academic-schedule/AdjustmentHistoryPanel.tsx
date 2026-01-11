import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  History, 
  ChevronDown, 
  Calendar, 
  Zap, 
  Clock, 
  CheckCircle,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  ScheduleAdjustment, 
  AdjustmentAction,
  ADJUSTMENT_ACTION_LABELS,
} from "@/types/academicSchedule";

interface AdjustmentHistoryPanelProps {
  adjustments: ScheduleAdjustment[];
  className?: string;
}

const ACTION_ICONS: Record<AdjustmentAction, React.ElementType> = {
  extend_chapter: Calendar,
  compress_future: Zap,
  add_compensatory: Clock,
  accept_variance: CheckCircle,
};

const ACTION_COLORS: Record<AdjustmentAction, string> = {
  extend_chapter: "bg-blue-100 text-blue-700",
  compress_future: "bg-purple-100 text-purple-700",
  add_compensatory: "bg-emerald-100 text-emerald-700",
  accept_variance: "bg-muted text-muted-foreground",
};

/**
 * AdjustmentHistoryPanel - Collapsible panel showing schedule adjustment history
 */
export function AdjustmentHistoryPanel({
  adjustments,
  className,
}: AdjustmentHistoryPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (adjustments.length === 0) {
    return null;
  }

  // Sort by date, newest first
  const sortedAdjustments = [...adjustments].sort(
    (a, b) => new Date(b.adjustedAt).getTime() - new Date(a.adjustedAt).getTime()
  );

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className={className}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          className="w-full justify-between text-muted-foreground hover:text-foreground hover:bg-muted/50 h-12"
        >
          <span className="flex items-center gap-2">
            <History className="w-4 h-4" />
            <span className="font-medium">Adjustment History</span>
            <Badge variant="secondary" className="ml-1">
              {adjustments.length}
            </Badge>
          </span>
          <ChevronDown className={cn(
            "w-4 h-4 transition-transform",
            isOpen && "rotate-180"
          )} />
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="pt-2">
        <div className="space-y-2">
          {sortedAdjustments.map((adjustment) => {
            const Icon = ACTION_ICONS[adjustment.action];
            const colorClass = ACTION_COLORS[adjustment.action];
            const formattedDate = new Date(adjustment.adjustedAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            return (
              <div
                key={adjustment.id}
                className="p-3 rounded-lg border bg-card"
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    colorClass
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm truncate">
                        {adjustment.chapterName}
                      </p>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {formattedDate}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {ADJUSTMENT_ACTION_LABELS[adjustment.action]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {adjustment.driftHoursBefore > 0 ? "+" : ""}{adjustment.driftHoursBefore}h drift
                      </span>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      {adjustment.impactDescription}
                    </p>
                    
                    {adjustment.notes && (
                      <div className="flex items-start gap-1.5 mt-2 pt-2 border-t">
                        <FileText className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
                        <p className="text-xs text-muted-foreground italic">
                          "{adjustment.notes}"
                        </p>
                      </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground">
                      by {adjustment.adjustedBy}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
