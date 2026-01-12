import {
  FileText,
  Library,
  BookOpen,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ContextSourceType } from "./types";

interface ContextSourceSelectorProps {
  contextSource: ContextSourceType;
  contextDescription: string;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onContentSelect: () => void;
  onLessonPlanSelect: () => void;
  onClearContext: () => void;
}

export function ContextSourceSelector({
  contextSource,
  contextDescription,
  onFileUpload,
  onContentSelect,
  onLessonPlanSelect,
  onClearContext,
}: ContextSourceSelectorProps) {
  return (
    <div className="space-y-3">
      {/* Selected Context Display */}
      {contextSource !== 'none' && (
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 text-sm">
            {contextSource === 'document' && <FileText className="w-4 h-4 text-primary" />}
            {contextSource === 'content' && <Library className="w-4 h-4 text-primary" />}
            {contextSource === 'lesson_plan' && <BookOpen className="w-4 h-4 text-primary" />}
            <span className="truncate max-w-[200px]">{contextDescription}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onClearContext}
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}

      {/* Context Source Options */}
      <div className="grid gap-2">
        {/* Upload Document */}
        <div className="relative">
          <input
            type="file"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            onChange={onFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <button
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-lg border transition-all",
              "hover:bg-muted/50 hover:border-primary/30",
              contextSource === 'document' && "border-primary/50 bg-primary/5"
            )}
          >
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <Upload className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium">Upload Document</p>
              <p className="text-xs text-muted-foreground">PDF, Word, or Image</p>
            </div>
          </button>
        </div>

        {/* From Content Library */}
        <button
          onClick={onContentSelect}
          className={cn(
            "w-full flex items-center gap-3 p-3 rounded-lg border transition-all",
            "hover:bg-muted/50 hover:border-primary/30",
            contextSource === 'content' && "border-primary/50 bg-primary/5"
          )}
        >
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
            <Library className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium">From Content Library</p>
            <p className="text-xs text-muted-foreground">Videos, PDFs, PPTs</p>
          </div>
        </button>

        {/* From Lesson Plans */}
        <button
          onClick={onLessonPlanSelect}
          className={cn(
            "w-full flex items-center gap-3 p-3 rounded-lg border transition-all",
            "hover:bg-muted/50 hover:border-primary/30",
            contextSource === 'lesson_plan' && "border-primary/50 bg-primary/5"
          )}
        >
          <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium">From Lesson Plans</p>
            <p className="text-xs text-muted-foreground">Use existing lesson context</p>
          </div>
        </button>
      </div>
    </div>
  );
}
