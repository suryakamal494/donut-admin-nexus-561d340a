import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  number: number;
  title: string;
  key: string;
}

interface ExamNewStepperProps {
  steps: Step[];
  currentStep: number;
}

export function ExamNewStepper({ steps, currentStep }: ExamNewStepperProps) {
  return (
    <div className="w-full">
      {/* Mobile: Progress bar */}
      <div className="sm:hidden mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium">Step {currentStep} of {steps.length}</span>
          <span className="text-muted-foreground">
            {steps.find(s => s.number === currentStep)?.title}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop: Full stepper */}
      <div className="hidden sm:flex items-center justify-between relative mb-8">
        {/* Connecting line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted" />
        <div 
          className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          
          return (
            <div
              key={step.number}
              className="flex flex-col items-center gap-2 relative z-10"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200 text-sm font-semibold",
                  isCompleted && "bg-primary border-primary text-primary-foreground",
                  isCurrent && "border-primary bg-background text-primary",
                  !isCompleted && !isCurrent && "border-muted bg-muted/50 text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium text-center whitespace-nowrap",
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
