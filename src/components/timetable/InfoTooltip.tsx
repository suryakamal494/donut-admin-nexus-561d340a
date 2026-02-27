import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface InfoTooltipProps {
  content: string;
  className?: string;
}

export const InfoTooltip = ({ content, className }: InfoTooltipProps) => {
  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors",
            className
          )}
        >
          <Info className="w-3 h-3" />
        </button>
      </TooltipTrigger>
      <TooltipContent collisionPadding={16} sideOffset={6} className="max-w-[280px] text-sm">
        {content}
      </TooltipContent>
    </Tooltip>
  );
};
