import { useState } from "react";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Calendar, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  AlertTriangle,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  AdjustmentAction, 
  ChapterDriftStatus,
  ADJUSTMENT_ACTION_LABELS,
} from "@/types/academicSchedule";

interface ScheduleAdjustmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chapterDrift: ChapterDriftStatus;
  subjectName: string;
  onSubmit: (action: AdjustmentAction, notes: string) => void;
}

interface ActionOption {
  value: AdjustmentAction;
  label: string;
  description: string;
  impact: string;
  icon: React.ElementType;
}

/**
 * ScheduleAdjustmentDialog - Modal for resolving schedule drift
 * Provides 4 resolution options with impact preview
 */
export function ScheduleAdjustmentDialog({
  open,
  onOpenChange,
  chapterDrift,
  subjectName,
  onSubmit,
}: ScheduleAdjustmentDialogProps) {
  const [selectedAction, setSelectedAction] = useState<AdjustmentAction>("extend_chapter");
  const [notes, setNotes] = useState("");

  const actionOptions: ActionOption[] = [
    {
      value: "extend_chapter",
      label: ADJUSTMENT_ACTION_LABELS.extend_chapter,
      description: "Add extra periods to complete this chapter properly",
      impact: `Chapter completion extends by ${Math.abs(chapterDrift.driftHours)} period(s). Subsequent chapters shift accordingly.`,
      icon: Calendar,
    },
    {
      value: "compress_future",
      label: ADJUSTMENT_ACTION_LABELS.compress_future,
      description: "Cover extra content per period in upcoming chapters",
      impact: `Future chapters will be taught at accelerated pace to recover ${Math.abs(chapterDrift.driftHours)}h.`,
      icon: Zap,
    },
    {
      value: "add_compensatory",
      label: ADJUSTMENT_ACTION_LABELS.add_compensatory,
      description: "Schedule additional class (Saturday/extra period)",
      impact: `${Math.abs(chapterDrift.driftHours)} compensatory period(s) will be scheduled separately.`,
      icon: Clock,
    },
    {
      value: "accept_variance",
      label: ADJUSTMENT_ACTION_LABELS.accept_variance,
      description: "Acknowledge drift without immediate action",
      impact: "No schedule changes. Drift will be tracked but not corrected now.",
      icon: CheckCircle,
    },
  ];

  const handleSubmit = () => {
    onSubmit(selectedAction, notes);
    setNotes("");
    setSelectedAction("extend_chapter");
    onOpenChange(false);
  };

  const selectedOption = actionOptions.find(o => o.value === selectedAction);

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Resolve Schedule Drift"
      description={`${chapterDrift.chapterName} • ${subjectName}`}
      footer={
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="flex-1 sm:flex-none gap-1.5"
          >
            Apply Adjustment
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Drift Summary */}
        <div className={cn(
          "p-4 rounded-lg border-2",
          chapterDrift.severity === "critical" ? "bg-red-50 border-red-200" :
          chapterDrift.severity === "significant" ? "bg-amber-50 border-amber-200" :
          "bg-muted/50 border-muted"
        )}>
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
              chapterDrift.severity === "critical" ? "bg-red-100" :
              chapterDrift.severity === "significant" ? "bg-amber-100" : "bg-muted"
            )}>
              {chapterDrift.severity === "critical" ? (
                <AlertTriangle className="w-5 h-5 text-red-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-amber-600" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold">
                  {chapterDrift.driftHours > 0 ? "+" : ""}{chapterDrift.driftHours}h
                </span>
                <span className="text-sm text-muted-foreground">
                  {chapterDrift.driftHours > 0 ? "over planned" : "behind planned"}
                </span>
                <Badge variant="outline" className={cn(
                  "text-xs",
                  chapterDrift.severity === "critical" ? "text-red-600 border-red-300" :
                  chapterDrift.severity === "significant" ? "text-amber-600 border-amber-300" :
                  "text-muted-foreground"
                )}>
                  {chapterDrift.severity}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Planned: {chapterDrift.plannedHours}h • Actual: {chapterDrift.actualHours}h
              </p>
            </div>
          </div>
        </div>

        {/* Action Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">How would you like to handle this?</Label>
          
          <RadioGroup 
            value={selectedAction} 
            onValueChange={(v) => setSelectedAction(v as AdjustmentAction)}
            className="space-y-2"
          >
            {actionOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedAction === option.value;
              
              return (
                <label
                  key={option.value}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all",
                    isSelected 
                      ? "border-primary bg-primary/5" 
                      : "border-muted hover:border-muted-foreground/30"
                  )}
                >
                  <RadioGroupItem value={option.value} className="mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Icon className={cn(
                        "w-4 h-4",
                        isSelected ? "text-primary" : "text-muted-foreground"
                      )} />
                      <span className="font-medium text-sm">{option.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                </label>
              );
            })}
          </RadioGroup>
        </div>

        {/* Impact Preview */}
        {selectedOption && (
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-xs font-medium text-blue-700 mb-1">Impact Preview</p>
            <p className="text-sm text-blue-800">{selectedOption.impact}</p>
          </div>
        )}

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm">Notes (optional)</Label>
          <Textarea
            id="notes"
            placeholder="Add any context or reasoning for this decision..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="h-20 resize-none"
          />
        </div>
      </div>
    </ResponsiveDialog>
  );
}
