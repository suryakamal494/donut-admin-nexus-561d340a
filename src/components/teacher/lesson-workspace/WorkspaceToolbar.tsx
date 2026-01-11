import { BookOpen, Play, HelpCircle, ClipboardList, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { blockTypeConfig, type BlockType, type LessonPlanBlock } from "./types";
import { cn } from "@/lib/utils";
import { BlockDialog } from "./BlockDialog";
import { QuizDialog } from "./QuizDialog";
import { HomeworkBlockDialog } from "./HomeworkBlockDialog";

interface WorkspaceToolbarProps {
  onBlockClick: (type: BlockType) => void;
  onAIAssist: () => void;
  onAddBlock: (block: Omit<LessonPlanBlock, 'id'>) => void;
  isGenerating?: boolean;
  activeBlock?: BlockType | null;
  chapter?: string;
  subject?: string;
  batchId?: string;
  batchName?: string;
}

export const WorkspaceToolbar = ({ 
  onBlockClick, 
  onAIAssist, 
  onAddBlock,
  isGenerating,
  activeBlock,
  chapter,
  subject,
  batchId,
  batchName,
}: WorkspaceToolbarProps) => {
  const blockTypes: BlockType[] = ['explain', 'demonstrate', 'quiz', 'homework'];

  const getIcon = (type: BlockType) => {
    switch (type) {
      case 'explain': return BookOpen;
      case 'demonstrate': return Play;
      case 'quiz': return HelpCircle;
      case 'homework': return ClipboardList;
    }
  };

  const renderBlockButton = (type: BlockType) => {
    const config = blockTypeConfig[type];
    const IconComponent = getIcon(type);
    const isActive = activeBlock === type;
    
    const buttonContent = (
      <Button
        variant={isActive ? "default" : "outline"}
        size="sm"
        className={cn(
          "gap-1.5 sm:gap-2 shrink-0 h-10 sm:h-11 px-3 sm:px-4 transition-all",
          isActive 
            ? "bg-primary text-primary-foreground shadow-md" 
            : "hover:bg-primary/10 hover:border-primary/50 hover:shadow-sm"
        )}
        onClick={() => onBlockClick(type)}
      >
        <IconComponent className="w-4 h-4" />
        <span className="hidden sm:inline text-sm font-medium">
          {config.label}
        </span>
      </Button>
    );

    // Render Quiz Dialog
    if (type === 'quiz') {
      return (
        <div key={type}>
          <Tooltip>
            <TooltipTrigger asChild>
              {buttonContent}
            </TooltipTrigger>
            <TooltipContent 
              side="bottom" 
              sideOffset={8}
              className="z-[200] max-w-[240px] text-center p-3 bg-popover border shadow-lg"
            >
              <p className="font-medium mb-1">{config.label}</p>
              <p className="text-xs text-muted-foreground">
                {config.tooltip}
              </p>
            </TooltipContent>
          </Tooltip>
          <QuizDialog
            open={isActive}
            onOpenChange={(open) => !open && onBlockClick(type)}
            onAddBlock={onAddBlock}
            chapter={chapter}
            subject={subject}
          />
        </div>
      );
    }

    // Render Homework Dialog with simplified 3-mode selector
    if (type === 'homework') {
      return (
        <div key={type}>
          <Tooltip>
            <TooltipTrigger asChild>
              {buttonContent}
            </TooltipTrigger>
            <TooltipContent 
              side="bottom" 
              sideOffset={8}
              className="z-[200] max-w-[240px] text-center p-3 bg-popover border shadow-lg"
            >
              <p className="font-medium mb-1">{config.label}</p>
              <p className="text-xs text-muted-foreground">
                {config.tooltip}
              </p>
            </TooltipContent>
          </Tooltip>
          <HomeworkBlockDialog
            open={isActive}
            onOpenChange={(open) => !open && onBlockClick(type)}
            onAddBlock={onAddBlock}
            context={{
              subject,
              chapter,
              batchId,
              batchName,
            }}
          />
        </div>
      );
    }
    
    // Default: Explain/Demonstrate dialogs
    return (
      <div key={type}>
        <Tooltip>
          <TooltipTrigger asChild>
            {buttonContent}
          </TooltipTrigger>
          <TooltipContent 
            side="bottom" 
            sideOffset={8}
            className="z-[200] max-w-[240px] text-center p-3 bg-popover border shadow-lg"
          >
            <p className="font-medium mb-1">{config.label}</p>
            <p className="text-xs text-muted-foreground">
              {config.tooltip}
            </p>
          </TooltipContent>
        </Tooltip>
        <BlockDialog
          type={type}
          open={isActive}
          onOpenChange={(open) => !open && onBlockClick(type)}
          onAddBlock={onAddBlock}
          chapter={chapter}
          subject={subject}
        />
      </div>
    );
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="bg-background rounded-xl border border-border/50 p-3 sm:p-4 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Block Type Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-1 overflow-x-auto pb-1 sm:pb-0">
            {blockTypes.map(renderBlockButton)}
          </div>
          
          {/* Divider */}
          <div className="w-px h-8 bg-border hidden sm:block" />
          
          {/* AI Assist Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "gap-1.5 sm:gap-2 shrink-0 h-10 sm:h-11 px-3 sm:px-4",
                  "bg-gradient-to-r from-primary/5 to-[hsl(var(--donut-pink))]/5",
                  "border-primary/20 hover:border-primary/40",
                  "hover:from-primary/10 hover:to-[hsl(var(--donut-pink))]/10"
                )}
                onClick={onAIAssist}
                disabled={isGenerating}
              >
                <Sparkles className={cn(
                  "w-4 h-4 text-primary",
                  isGenerating && "animate-pulse"
                )} />
                <span className="hidden sm:inline text-sm font-medium gradient-text">
                  {isGenerating ? "Generating..." : "AI Assist"}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent 
              side="bottom" 
              sideOffset={8}
              className="z-[200] max-w-[240px] text-center p-3 bg-popover border shadow-lg"
            >
              <p className="font-medium mb-1">AI Assist</p>
              <p className="text-xs text-muted-foreground">
                Let AI generate a complete lesson plan based on your topic
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};
