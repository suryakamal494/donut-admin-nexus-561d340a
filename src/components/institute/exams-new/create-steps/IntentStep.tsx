import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LayoutGrid, Zap, ChevronRight, Sparkles, Clock, FileQuestion } from "lucide-react";
import { Intent } from "@/hooks/useExamCreationNew";

interface IntentStepProps {
  onSelectIntent: (intent: Intent) => void;
  onCancel: () => void;
}

export function IntentStep({ onSelectIntent, onCancel }: IntentStepProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center space-y-1 sm:space-y-2">
        <h2 className="text-lg sm:text-xl font-semibold">How would you like to create this exam?</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Choose a structured pattern or create a quick custom test
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
        {/* Use a Pattern */}
        <Card 
          className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50 overflow-hidden"
          onClick={() => onSelectIntent("pattern")}
        >
          <CardContent className="p-0">
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div className="flex items-start justify-between">
                <div className="p-2.5 sm:p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-0.5 sm:mb-1">Use a Pattern</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Create structured exam using JEE, NEET, or custom patterns
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-muted text-muted-foreground">
                  JEE Main
                </span>
                <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-muted text-muted-foreground">
                  NEET
                </span>
                <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-muted text-muted-foreground">
                  Custom
                </span>
              </div>
            </div>

            <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-muted/30 border-t">
              <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  Section-wise
                </span>
                <span className="flex items-center gap-1">
                  <FileQuestion className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  Type rules
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Test */}
        <Card 
          className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50 overflow-hidden"
          onClick={() => onSelectIntent("quick_test")}
        >
          <CardContent className="p-0">
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div className="flex items-start justify-between">
                <div className="p-2.5 sm:p-3 rounded-xl bg-accent group-hover:bg-accent/80 transition-colors">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-accent-foreground" />
                </div>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-0.5 sm:mb-1">Quick Test</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Simple test with uniform marking — no sections, no complex rules
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-muted text-muted-foreground">
                  Class tests
                </span>
                <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-muted text-muted-foreground">
                  Quizzes
                </span>
                <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-muted text-muted-foreground">
                  Weekly
                </span>
              </div>
            </div>

            <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-muted/30 border-t">
              <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  Fast setup
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  Simple config
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center pt-2 sm:pt-4">
        <Button variant="ghost" onClick={onCancel} className="h-9 sm:h-10">
          Cancel
        </Button>
      </div>
    </div>
  );
}