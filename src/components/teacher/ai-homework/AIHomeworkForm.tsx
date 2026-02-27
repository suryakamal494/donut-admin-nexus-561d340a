import { useState } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Info,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Library } from "lucide-react";
import { HomeworkType, homeworkTypeConfig, AIHomeworkFormData, ContextSourceType } from "./types";
import { ContextSourceSelector } from "./ContextSourceSelector";
import { ContentItem } from "../ContentLibraryPicker";
import { LessonPlanItem } from "../LessonPlanPicker";

interface AIHomeworkFormProps {
  formData: AIHomeworkFormData;
  onFormChange: <K extends keyof AIHomeworkFormData>(key: K, value: AIHomeworkFormData[K]) => void;
  contextSource: ContextSourceType;
  uploadedFile: File | null;
  selectedContent: ContentItem | null;
  selectedLessonPlan: LessonPlanItem | null;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onContentSelect: () => void;
  onLessonPlanSelect: () => void;
  onClearContext: () => void;
  contextBanner?: string;
  isMobile?: boolean;
}

export function AIHomeworkForm({
  formData,
  onFormChange,
  contextSource,
  uploadedFile,
  selectedContent,
  selectedLessonPlan,
  onFileUpload,
  onContentSelect,
  onLessonPlanSelect,
  onClearContext,
  contextBanner,
  isMobile = false,
}: AIHomeworkFormProps) {
  const [isContextOpen, setIsContextOpen] = useState(false);

  const getContextDescription = (): string => {
    if (contextSource === 'document' && uploadedFile) {
      return `Document: ${uploadedFile.name}`;
    }
    if (contextSource === 'content' && selectedContent) {
      return `Content: ${selectedContent.title}`;
    }
    if (contextSource === 'lesson_plan' && selectedLessonPlan) {
      return `Lesson Plan: ${selectedLessonPlan.title}`;
    }
    return "";
  };

  return (
    <ScrollArea className={cn("pr-2", isMobile ? "max-h-[70vh]" : "max-h-[65vh]")}>
      <div className="space-y-4 pb-4">
        {/* Context Banner */}
        {contextBanner && (
          <div className="flex items-center gap-2 rounded-lg bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 px-3 py-2.5">
            <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <p className="text-xs font-medium text-teal-700 dark:text-teal-300">{contextBanner}</p>
          </div>
        )}

        {/* Title Input */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Homework Title *</Label>
          <Input
            value={formData.title}
            onChange={(e) => onFormChange('title', e.target.value)}
            placeholder="e.g., Newton's Laws Practice Problems"
            className="h-11"
          />
        </div>

        {/* Homework Type - Compact Pills */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Type</Label>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            {Object.values(homeworkTypeConfig).map((config) => {
              const Icon = config.icon;
              const isSelected = formData.selectedType === config.id;
              return (
                <button
                  key={config.id}
                  onClick={() => onFormChange('selectedType', config.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 transition-all shrink-0",
                    "text-sm font-medium",
                    isSelected 
                      ? `${config.bgColor} ${config.borderColor} ${config.color}`
                      : "border-border bg-background hover:bg-muted"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Instructions/Context for AI */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Instructions for AI</Label>
          <Textarea
            value={formData.instructions}
            onChange={(e) => onFormChange('instructions', e.target.value)}
            placeholder="Describe what kind of homework you want... e.g., 'Focus on numerical problems related to F=ma' or 'Include real-world examples'"
            className="min-h-[80px] resize-none text-sm"
          />
        </div>

        {/* Context Sources - Collapsible */}
        <Collapsible open={isContextOpen} onOpenChange={setIsContextOpen}>
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <Library className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Add Context</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3.5 h-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[200px] text-xs">
                      Adding context helps AI generate more relevant homework based on your teaching materials
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-2">
                {contextSource !== 'none' && (
                  <Badge variant="secondary" className="text-xs py-0.5">
                    {contextSource === 'document' && '📄'}
                    {contextSource === 'content' && '📚'}
                    {contextSource === 'lesson_plan' && '📋'}
                    Selected
                  </Badge>
                )}
                {isContextOpen ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="pt-3">
            <ContextSourceSelector
              contextSource={contextSource}
              contextDescription={getContextDescription()}
              onFileUpload={onFileUpload}
              onContentSelect={onContentSelect}
              onLessonPlanSelect={onLessonPlanSelect}
              onClearContext={onClearContext}
            />
          </CollapsibleContent>
        </Collapsible>

        {/* Subject & Batch */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-sm">Subject</Label>
            <Select value={formData.subject} onValueChange={(v) => onFormChange('subject', v)}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Batch</Label>
            <Select value={formData.batchId} onValueChange={(v) => onFormChange('batchId', v)}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="batch-10a">10A</SelectItem>
                <SelectItem value="batch-10b">10B</SelectItem>
                <SelectItem value="batch-11a">11A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Due Date */}
        <div className="space-y-1.5">
          <Label className="text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Due Date
          </Label>
          <Input
            type="date"
            value={formData.dueDate}
            onChange={(e) => onFormChange('dueDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="h-10"
          />
        </div>
      </div>
    </ScrollArea>
  );
}
