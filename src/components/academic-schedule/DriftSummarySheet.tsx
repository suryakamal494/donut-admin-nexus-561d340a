import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, TrendingDown, TrendingUp, Clock, ChevronRight, CheckCircle2, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useInstituteDriftSummary, DriftItem } from "@/hooks/useInstituteDriftSummary";
import { ScheduleAdjustmentDialog } from "./ScheduleAdjustmentDialog";
import { ChapterDriftStatus, DriftSeverity, AdjustmentAction, DRIFT_CAUSE_LABELS } from "@/types/academicSchedule";

interface DriftSummarySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const severityConfig: Record<DriftSeverity, { 
  bg: string; 
  text: string; 
  border: string;
  icon: typeof AlertTriangle;
  label: string;
}> = {
  critical: { 
    bg: "bg-red-50", 
    text: "text-red-700", 
    border: "border-red-200",
    icon: AlertTriangle,
    label: "Critical"
  },
  significant: { 
    bg: "bg-amber-50", 
    text: "text-amber-700", 
    border: "border-amber-200",
    icon: TrendingDown,
    label: "Significant"
  },
  minor: { 
    bg: "bg-yellow-50", 
    text: "text-yellow-700", 
    border: "border-yellow-200",
    icon: Clock,
    label: "Minor"
  },
};

export function DriftSummarySheet({ open, onOpenChange }: DriftSummarySheetProps) {
  const navigate = useNavigate();
  const driftSummary = useInstituteDriftSummary();
  const [selectedItem, setSelectedItem] = useState<DriftItem | null>(null);
  const [adjustmentDialogOpen, setAdjustmentDialogOpen] = useState(false);

  const handleRowClick = (item: DriftItem) => {
    onOpenChange(false);
    navigate(`/institute/academic-schedule/batches/${item.batchId}`);
  };

  const handleResolveClick = (item: DriftItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedItem(item);
    setAdjustmentDialogOpen(true);
  };

  const handleAdjustmentSubmit = (action: AdjustmentAction, notes?: string) => {
    // In a real app, this would save to database
    console.log("Adjustment submitted:", { item: selectedItem, action, notes });
    setAdjustmentDialogOpen(false);
    setSelectedItem(null);
    // Could show toast here
  };

  // Convert DriftItem to ChapterDriftStatus for the dialog
  const selectedChapterDrift: ChapterDriftStatus | null = selectedItem ? {
    batchId: selectedItem.batchId,
    subjectId: selectedItem.subjectId,
    chapterId: selectedItem.chapterId,
    chapterName: selectedItem.chapterName,
    plannedHours: selectedItem.plannedHours,
    actualHours: selectedItem.actualHours,
    driftHours: selectedItem.driftHours,
    driftPercentage: Math.round((selectedItem.driftHours / selectedItem.plannedHours) * 100),
    severity: selectedItem.severity,
    isResolved: false,
    teacherId: selectedItem.teacherId,
    teacherName: selectedItem.teacherName,
    teacherHoursBreakdown: selectedItem.teacherHoursBreakdown,
    driftAnalysis: selectedItem.driftAnalysis,
  } : null;

  return (
    <>
      <ResponsiveDialog
        open={open}
        onOpenChange={onOpenChange}
        title="Institute Drift Summary"
        description="Unresolved schedule drifts across all batches, sorted by severity"
        className="sm:max-w-2xl"
      >
        {/* Summary Pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge 
            variant="outline" 
            className={cn(
              "gap-1.5 py-1.5 px-3",
              driftSummary.criticalCount > 0 
                ? "border-red-300 bg-red-50 text-red-700" 
                : "border-muted"
            )}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            {driftSummary.criticalCount} Critical
          </Badge>
          <Badge 
            variant="outline" 
            className={cn(
              "gap-1.5 py-1.5 px-3",
              driftSummary.significantCount > 0 
                ? "border-amber-300 bg-amber-50 text-amber-700" 
                : "border-muted"
            )}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            {driftSummary.significantCount} Significant
          </Badge>
          <Badge 
            variant="outline" 
            className={cn(
              "gap-1.5 py-1.5 px-3",
              driftSummary.minorCount > 0 
                ? "border-yellow-300 bg-yellow-50 text-yellow-700" 
                : "border-muted"
            )}
          >
            <Clock className="w-3.5 h-3.5" />
            {driftSummary.minorCount} Minor
          </Badge>
        </div>

        {driftSummary.driftItems.length === 0 ? (
          /* Empty State */
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="font-semibold text-lg mb-1">All Batches On Track</h3>
            <p className="text-sm text-muted-foreground">
              No unresolved schedule drift detected across any batch.
            </p>
          </div>
        ) : (
          /* Drift Items Table */
          <ScrollArea className="max-h-[50vh]">
            <div className="space-y-2">
              {driftSummary.driftItems.map((item, index) => {
                const config = severityConfig[item.severity];
                const Icon = item.driftDirection === "over" ? TrendingUp : TrendingDown;
                
                return (
                  <div
                    key={`${item.batchId}-${item.chapterId}-${index}`}
                    onClick={() => handleRowClick(item)}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-all",
                      "hover:shadow-md hover:border-primary/30",
                      config.bg,
                      config.border
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {/* Severity indicator */}
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                        item.severity === "critical" ? "bg-red-100" : 
                        item.severity === "significant" ? "bg-amber-100" : "bg-yellow-100"
                      )}>
                        <config.icon className={cn(
                          "w-4 h-4",
                          item.severity === "critical" ? "text-red-600" : 
                          item.severity === "significant" ? "text-amber-600" : "text-yellow-600"
                        )} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-medium text-sm">{item.batchName}</span>
                          <Badge variant="outline" className="text-xs py-0 h-5">
                            {item.subjectName}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground truncate">
                          {item.chapterName}
                        </p>
                        
                        {/* Teacher Attribution - NEW */}
                        {item.teacherName && (
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <User className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {item.teacherName}
                              {item.teacherHoursBreakdown && item.teacherHoursBreakdown.length > 1 && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="text-[10px] ml-1 text-primary cursor-help">
                                      +{item.teacherHoursBreakdown.length - 1} more
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="max-w-xs">
                                    <div className="space-y-1">
                                      <p className="text-xs font-medium mb-1">All Teachers:</p>
                                      {item.teacherHoursBreakdown.map(t => (
                                        <p key={t.teacherId} className="text-xs">
                                          {t.teacherName}: {t.hours}h
                                        </p>
                                      ))}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </span>
                          </div>
                        )}
                        
                        {/* Drift Cause Analysis - NEW */}
                        {item.driftAnalysis && (
                          <div className="flex items-center gap-1.5 mt-1 text-xs">
                            <AlertCircle className="w-3 h-3 text-muted-foreground shrink-0" />
                            <span className={cn(
                              "text-xs",
                              item.driftAnalysis.cause === "teacher_absence" ? "text-red-600" :
                              item.driftAnalysis.cause === "extended_teaching" ? "text-amber-600" :
                              "text-muted-foreground"
                            )}>
                              {item.driftAnalysis.description}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 mt-1.5">
                          <Badge 
                            className={cn(
                              "gap-1 text-xs",
                              item.driftDirection === "over" 
                                ? "bg-amber-100 text-amber-800 hover:bg-amber-100" 
                                : "bg-red-100 text-red-800 hover:bg-red-100"
                            )}
                          >
                            <Icon className="w-3 h-3" />
                            {item.driftDirection === "over" ? "+" : ""}{item.driftHours}h
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Planned: {item.plannedHours}h → Actual: {item.actualHours}h
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => handleResolveClick(item, e)}
                          className={cn(
                            "h-8 text-xs",
                            item.severity === "critical" 
                              ? "border-red-300 text-red-700 hover:bg-red-50" 
                              : "border-amber-300 text-amber-700 hover:bg-amber-50"
                          )}
                        >
                          Resolve
                        </Button>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}

        {/* Footer Summary */}
        {driftSummary.driftItems.length > 0 && (
          <div className="pt-4 border-t mt-4 text-sm text-muted-foreground text-center">
            {driftSummary.totalIssues} issues across {driftSummary.batchesWithDrift} batches
          </div>
        )}
      </ResponsiveDialog>

      {/* Adjustment Dialog */}
      {selectedChapterDrift && (
        <ScheduleAdjustmentDialog
          open={adjustmentDialogOpen}
          onOpenChange={setAdjustmentDialogOpen}
          chapterDrift={selectedChapterDrift}
          subjectName={selectedItem?.subjectName || ""}
          onSubmit={handleAdjustmentSubmit}
        />
      )}
    </>
  );
}
