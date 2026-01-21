import { cn } from "@/lib/utils";
import { Check, FileText, LayoutGrid, BookOpen, Settings, Sparkles, Users, type LucideIcon } from "lucide-react";

interface Step {
  number: number;
  title: string;
  key: string;
}

interface ExamNewStepperProps {
  steps: Step[];
  currentStep: number;
}

// Icon mapping for step keys
const stepIcons: Record<string, LucideIcon> = {
  intent: FileText,
  pattern: LayoutGrid,
  subjects: BookOpen,
  config: Settings,
  questions: Sparkles,
  batch: Users,
};

// Get icon for a step key with fallback
const getStepIcon = (key: string): LucideIcon => stepIcons[key] || FileText;

export function ExamNewStepper({ steps, currentStep }: ExamNewStepperProps) {
  return (
    <div className="w-full">
      {/* Mobile: Compact progress bar with current step info */}
      <div className="sm:hidden mb-4">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-medium text-foreground">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-muted-foreground">
            {steps.find(s => s.number === currentStep)?.title}
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
        
        {/* Mobile: Icon indicators */}
        <div className="flex items-center justify-between mt-3 px-1">
          {steps.map((step) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            const Icon = getStepIcon(step.key);
            
            return (
              <div
                key={step.number}
                className={cn(
                  "flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200",
                  isCompleted && "bg-primary text-primary-foreground",
                  isCurrent && "bg-primary text-primary-foreground shadow-md",
                  !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop: Full stepper with icons and labels */}
      <div className="hidden sm:flex items-start justify-between relative mb-8">
        {/* Connecting line - background */}
        <div className="absolute top-5 left-8 right-8 h-0.5 bg-muted" />
        
        {/* Connecting line - progress */}
        <div 
          className="absolute top-5 left-8 h-0.5 bg-primary transition-all duration-500 ease-out"
          style={{ 
            width: currentStep === 1 
              ? '0%' 
              : `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - 4rem)` 
          }}
        />

        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          const Icon = getStepIcon(step.key);
          
          return (
            <div
              key={step.number}
              className={cn(
                "flex flex-col items-center gap-2 relative z-10",
                index === 0 && "items-start",
                index === steps.length - 1 && "items-end"
              )}
              style={{ flex: 1 }}
            >
              {/* Icon container */}
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                  isCompleted && "bg-primary text-primary-foreground shadow-sm",
                  isCurrent && "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-110",
                  !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              
              {/* Step label */}
              <span
                className={cn(
                  "text-xs font-medium text-center whitespace-nowrap transition-colors duration-200",
                  isCurrent && "text-primary font-semibold",
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
