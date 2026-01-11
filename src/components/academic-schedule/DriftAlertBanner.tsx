import { AlertTriangle, TrendingDown, Clock, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DriftSeverity, DRIFT_THRESHOLDS } from "@/types/academicSchedule";

interface DriftAlertBannerProps {
  totalDriftHours: number;
  affectedChapters: number;
  subjectName: string;
  severity: DriftSeverity;
  onResolveClick: () => void;
  onDismiss?: () => void;
  className?: string;
}

/**
 * DriftAlertBanner - Shows when academic schedule drift exceeds threshold
 * Only appears when drift >= DRIFT_THRESHOLDS.significant (3+ hours)
 */
export function DriftAlertBanner({
  totalDriftHours,
  affectedChapters,
  subjectName,
  severity,
  onResolveClick,
  onDismiss,
  className,
}: DriftAlertBannerProps) {
  // Don't show if below threshold
  if (totalDriftHours < DRIFT_THRESHOLDS.significant) {
    return null;
  }

  const severityConfig = {
    minor: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-800",
      icon: Clock,
    },
    significant: {
      bg: "bg-amber-50",
      border: "border-amber-300",
      text: "text-amber-800",
      icon: TrendingDown,
    },
    critical: {
      bg: "bg-red-50",
      border: "border-red-300",
      text: "text-red-800",
      icon: AlertTriangle,
    },
  };

  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <div className={cn(
      "p-4 rounded-lg border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3",
      config.bg,
      config.border,
      className
    )}>
      <div className="flex items-start gap-3 flex-1">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
          severity === "critical" ? "bg-red-100" : "bg-amber-100"
        )}>
          <Icon className={cn(
            "w-5 h-5",
            severity === "critical" ? "text-red-600" : "text-amber-600"
          )} />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className={cn("font-semibold", config.text)}>
              Schedule Drift Detected
            </p>
            <Badge variant="outline" className={cn(
              "text-xs",
              severity === "critical" ? "border-red-300 text-red-700" : "border-amber-300 text-amber-700"
            )}>
              {severity.charAt(0).toUpperCase() + severity.slice(1)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">{subjectName}</span> is{" "}
            <span className="font-semibold">{totalDriftHours}h</span> over planned schedule
            {affectedChapters > 1 && ` across ${affectedChapters} chapters`}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Button 
          onClick={onResolveClick}
          className={cn(
            "flex-1 sm:flex-none gap-1.5",
            severity === "critical" 
              ? "bg-red-600 hover:bg-red-700" 
              : "bg-amber-600 hover:bg-amber-700"
          )}
        >
          Resolve Drift
          <ArrowRight className="w-4 h-4" />
        </Button>
        {onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="h-9 w-9 shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
