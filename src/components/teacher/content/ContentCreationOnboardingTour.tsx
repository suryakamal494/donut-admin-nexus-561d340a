/**
 * Onboarding Tour for Content Creation
 * Step-by-step guided tutorial for first-time content creators
 */

import { useState, useEffect, useCallback } from "react";
import { ChevronRight, ChevronLeft, X, Upload, Sparkles, Lightbulb, FolderOpen, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TourStep {
  id: string;
  target?: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const tourSteps: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to Content Creation! 🎉",
    description: "Here you can create teaching materials for your classes. Let's quickly show you how it works.",
    icon: Lightbulb,
    position: 'center',
  },
  {
    id: "upload",
    target: '[data-tour="create-upload"]',
    title: "Upload from Device",
    description: "Tap here to upload files from your phone or computer - videos, PDFs, presentations, or paste URLs from YouTube.",
    icon: Upload,
    position: 'bottom',
  },
  {
    id: "ai-generate",
    target: '[data-tour="create-ai"]',
    title: "Generate with AI",
    description: "Or let AI create presentation slides for you! Just describe what you want and we'll generate it automatically.",
    icon: Sparkles,
    position: 'bottom',
  },
  {
    id: "classification",
    title: "Classify Your Content",
    description: "Select the subject, chapter, and topic for your content. This helps organize everything and makes it easy to find later.",
    icon: FolderOpen,
    position: 'center',
  },
  {
    id: "save",
    title: "Save to Your Library",
    description: "Once you're done, save your content and it will appear in your Content Library. You can use it in lesson plans anytime!",
    icon: Save,
    position: 'center',
  },
];

interface ContentCreationOnboardingTourProps {
  onComplete: () => void;
  onSkip?: () => void;
}

const STORAGE_KEY = 'teacher-content-creation-onboarding-count';
const MAX_SHOW_COUNT = 2;

export const useContentCreationTour = () => {
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const count = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
      if (count < MAX_SHOW_COUNT) {
        setShowTour(true);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const completeTour = useCallback(() => {
    const count = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
    localStorage.setItem(STORAGE_KEY, String(count + 1));
    setShowTour(false);
  }, []);

  const skipTour = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, String(MAX_SHOW_COUNT));
    setShowTour(false);
  }, []);

  const resetTour = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { showTour, completeTour, skipTour, resetTour };
};

export function ContentCreationOnboardingTour({ onComplete, onSkip }: ContentCreationOnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const step = tourSteps[currentStep];

  // Find and highlight the current target element
  useEffect(() => {
    const findTarget = () => {
      if (step.target) {
        const target = document.querySelector(step.target);
        if (target) {
          const rect = target.getBoundingClientRect();
          setTargetRect(rect);
          return;
        }
      }
      setTargetRect(null);
    };

    findTarget();
    window.addEventListener('resize', findTarget);
    return () => window.removeEventListener('resize', findTarget);
  }, [step.target]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    onSkip?.();
    onComplete();
  };

  // Calculate tooltip position
  const getTooltipStyle = (): React.CSSProperties => {
    // Center position for non-targeted steps
    if (!targetRect || step.position === 'center') {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    const padding = 16;
    const tooltipWidth = 320;

    switch (step.position) {
      case 'bottom':
        return {
          position: 'fixed',
          left: Math.max(padding, Math.min(
            targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
            window.innerWidth - tooltipWidth - padding
          )),
          top: targetRect.bottom + padding,
        };
      case 'top':
        return {
          position: 'fixed',
          left: Math.max(padding, Math.min(
            targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
            window.innerWidth - tooltipWidth - padding
          )),
          bottom: window.innerHeight - targetRect.top + padding,
        };
      default:
        return {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        };
    }
  };

  const IconComponent = step.icon;

  return (
    <div className="fixed inset-0 z-[200]">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70" onClick={handleSkip} />
      
      {/* Spotlight on target */}
      {targetRect && (
        <div
          className="absolute rounded-xl ring-4 ring-primary ring-offset-4 ring-offset-transparent"
          style={{
            left: targetRect.left - 8,
            top: targetRect.top - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.7)',
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className="w-80 max-w-[calc(100vw-2rem)] p-5 rounded-2xl shadow-2xl bg-background border border-border"
        style={getTooltipStyle()}
      >
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <IconComponent className="w-6 h-6 text-primary" />
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-1.5 mb-3">
          {tourSteps.map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "h-1.5 rounded-full transition-all",
                idx === currentStep
                  ? "w-6 bg-primary"
                  : idx < currentStep
                  ? "w-1.5 bg-primary/50"
                  : "w-1.5 bg-muted"
              )}
            />
          ))}
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold mb-2 text-foreground">
          {step.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {step.description}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="text-sm text-muted-foreground"
          >
            Skip Tour
          </Button>
          
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                className="gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleNext}
              className="gap-1"
            >
              {currentStep === tourSteps.length - 1 ? "Got it!" : "Next"}
              {currentStep < tourSteps.length - 1 && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
