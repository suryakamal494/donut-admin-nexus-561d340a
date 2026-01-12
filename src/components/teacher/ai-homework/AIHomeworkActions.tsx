import { Sparkles, Loader2, RefreshCw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AIHomeworkActionsProps {
  hasGeneratedHomework: boolean;
  isGenerating: boolean;
  isAssigning: boolean;
  canGenerate: boolean;
  onCancel: () => void;
  onGenerate: () => void;
  onRegenerate: () => void;
  onAssign: () => void;
}

export function AIHomeworkActions({
  hasGeneratedHomework,
  isGenerating,
  isAssigning,
  canGenerate,
  onCancel,
  onGenerate,
  onRegenerate,
  onAssign,
}: AIHomeworkActionsProps) {
  return (
    <div className="flex gap-2 pt-3 border-t">
      {!hasGeneratedHomework ? (
        <>
          <Button
            variant="outline"
            onClick={onCancel}
            className="h-11"
          >
            Cancel
          </Button>
          <Button
            onClick={onGenerate}
            disabled={isGenerating || !canGenerate}
            className="flex-1 h-11 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate with AI
              </>
            )}
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="outline"
            onClick={onRegenerate}
            disabled={isGenerating}
            className="h-11 gap-2"
          >
            <RefreshCw className={cn("w-4 h-4", isGenerating && "animate-spin")} />
            <span className="hidden sm:inline">Regenerate</span>
          </Button>
          <Button
            onClick={onAssign}
            disabled={isAssigning}
            className="flex-1 h-11 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
          >
            {isAssigning ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Check className="w-4 h-4 mr-2" />
            )}
            Accept & Assign
          </Button>
        </>
      )}
    </div>
  );
}
