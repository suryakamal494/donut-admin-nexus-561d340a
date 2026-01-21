import { cn } from "@/lib/utils";
import { Check, FileText, Clock, LayoutGrid, Award, Eye } from "lucide-react";

interface PatternStepperProps {
  currentStep: number;
  totalSteps: number;
}

const steps = [
  { number: 1, title: "Basic Info", icon: FileText },
  { number: 2, title: "Duration", icon: Clock },
  { number: 3, title: "Sections", icon: LayoutGrid },
  { number: 4, title: "Marking", icon: Award },
  { number: 5, title: "Review", icon: Eye },
];

export function PatternStepper({ currentStep, totalSteps }: PatternStepperProps) {
  return (
    <div className="w-full">
      {/* Mobile: Progress bar */}
      <div className="sm:hidden mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium">Step {currentStep} of {totalSteps}</span>
          <span className="text-muted-foreground">{steps[currentStep - 1]?.title}</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop: Full stepper */}
      <div className="hidden sm:flex items-center justify-between relative mb-8">
        {/* Connecting line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted" />
        <div 
          className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          
          return (
            <div
              key={step.number}
              className="flex flex-col items-center gap-2 relative z-10"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200",
                  isCompleted && "bg-primary border-primary text-primary-foreground",
                  isCurrent && "border-primary bg-background text-primary",
                  !isCompleted && !isCurrent && "border-muted bg-muted/50 text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium text-center",
                  isCurrent && "text-primary",
                  isCompleted && "text-primary",
                  !isCompleted && !isCurrent && "text-muted-foreground"
                )}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
