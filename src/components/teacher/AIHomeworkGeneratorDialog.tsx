import { useState, useEffect } from "react";
import { 
  Sparkles, 
  Loader2,
  Calendar,
  Pencil,
  Timer,
  FolderOpen,
  Upload,
  FileText,
  Library,
  BookOpen,
  X,
  Info,
  RefreshCw,
  Check,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { ContentLibraryPicker, ContentItem } from "./ContentLibraryPicker";
import { LessonPlanPicker, LessonPlanItem } from "./LessonPlanPicker";

// Homework type configuration
export type HomeworkType = 'practice' | 'test' | 'project';

interface HomeworkTypeConfig {
  id: HomeworkType;
  label: string;
  description: string;
  icon: typeof Pencil;
  color: string;
  bgColor: string;
  borderColor: string;
}

const homeworkTypeConfig: Record<HomeworkType, HomeworkTypeConfig> = {
  practice: {
    id: 'practice',
    label: 'Practice',
    description: 'Write, solve, upload answers',
    icon: Pencil,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  test: {
    id: 'test',
    label: 'Test',
    description: 'Auto-graded MCQ/Questions',
    icon: Timer,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  project: {
    id: 'project',
    label: 'Project',
    description: 'Reports, PPTs, creative work',
    icon: FolderOpen,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
};

type ContextSourceType = 'none' | 'document' | 'content' | 'lesson_plan';

interface AIHomeworkGeneratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (homework: any) => void;
}

interface GeneratedHomework {
  title: string;
  description: string;
  instructions: string[];
  tasks: Array<{
    id: string;
    type: string;
    content: string;
    marks?: number;
  }>;
  totalMarks?: number;
  estimatedTime: number;
  resources?: string[];
}

export const AIHomeworkGeneratorDialog = ({
  open,
  onOpenChange,
  onCreated,
}: AIHomeworkGeneratorDialogProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Form state
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [selectedType, setSelectedType] = useState<HomeworkType>('practice');
  const [subject, setSubject] = useState("Physics");
  const [batchId, setBatchId] = useState("batch-10a");
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  
  // Context source state
  const [contextSource, setContextSource] = useState<ContextSourceType>('none');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [selectedLessonPlan, setSelectedLessonPlan] = useState<LessonPlanItem | null>(null);
  const [isContextOpen, setIsContextOpen] = useState(false);
  
  // Picker states
  const [showContentPicker, setShowContentPicker] = useState(false);
  const [showLessonPlanPicker, setShowLessonPlanPicker] = useState(false);
  
  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedHomework, setGeneratedHomework] = useState<GeneratedHomework | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setTitle("");
    setInstructions("");
    setSelectedType('practice');
    setSubject("Physics");
    setBatchId("batch-10a");
    setDueDate(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setContextSource('none');
    setUploadedFile(null);
    setSelectedContent(null);
    setSelectedLessonPlan(null);
    setIsContextOpen(false);
    setGeneratedHomework(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setContextSource('document');
      setSelectedContent(null);
      setSelectedLessonPlan(null);
    }
  };

  const handleContentSelect = (content: ContentItem) => {
    setSelectedContent(content);
    setContextSource('content');
    setUploadedFile(null);
    setSelectedLessonPlan(null);
    setShowContentPicker(false);
  };

  const handleLessonPlanSelect = (plan: LessonPlanItem) => {
    setSelectedLessonPlan(plan);
    setContextSource('lesson_plan');
    setUploadedFile(null);
    setSelectedContent(null);
    setShowLessonPlanPicker(false);
  };

  const clearContext = () => {
    setContextSource('none');
    setUploadedFile(null);
    setSelectedContent(null);
    setSelectedLessonPlan(null);
  };

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

  const handleGenerate = async () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for the homework.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Build context content
      let contextContent = "";
      let contextType: string | undefined;

      if (contextSource === 'document' && uploadedFile) {
        contextType = "document";
        contextContent = `Document uploaded: ${uploadedFile.name}. Use this document as context for generating homework.`;
      } else if (contextSource === 'content' && selectedContent) {
        contextType = "content";
        contextContent = `Content from library: ${selectedContent.title} (${selectedContent.type}). ${selectedContent.description || ''}`;
      } else if (contextSource === 'lesson_plan' && selectedLessonPlan) {
        contextType = "lesson_plan";
        contextContent = `Lesson Plan: ${selectedLessonPlan.title}. Topics: ${selectedLessonPlan.topics?.join(', ') || 'N/A'}. ${selectedLessonPlan.description || ''}`;
      }

      const { data, error } = await supabase.functions.invoke('assessment-ai', {
        body: {
          action: 'generate_homework',
          topic: title,
          subject: subject,
          homeworkType: selectedType,
          customInstructions: instructions,
          contextType,
          contextContent,
        },
      });

      if (error) throw error;

      if (data?.success && data?.data) {
        setGeneratedHomework(data.data);
        toast({
          title: "Homework Generated!",
          description: "Review the generated homework below.",
        });
      } else {
        throw new Error(data?.error || "Failed to generate homework");
      }
    } catch (error: any) {
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    setGeneratedHomework(null);
    handleGenerate();
  };

  const handleAssign = async () => {
    if (!generatedHomework) return;

    setIsAssigning(true);

    try {
      const homework = {
        id: `hw-ai-${Date.now()}`,
        title: generatedHomework.title || title,
        description: generatedHomework.description,
        subject: subject,
        batchId: batchId,
        batchName: batchId === "batch-10a" ? "10A" : batchId === "batch-10b" ? "10B" : "11A",
        className: batchId.includes("10") ? "Class 10" : "Class 11",
        dueDate: dueDate,
        assignedDate: new Date().toISOString().split('T')[0],
        status: "assigned" as const,
        submissionCount: 0,
        totalStudents: 35,
        homeworkType: selectedType,
        instructions: generatedHomework.instructions?.join('\n') || '',
        tasks: generatedHomework.tasks,
        estimatedTime: generatedHomework.estimatedTime,
        aiGenerated: true,
      };

      await new Promise(resolve => setTimeout(resolve, 300));

      toast({
        title: "Homework Assigned! ✓",
        description: `${homework.batchName} students have been notified.`,
      });

      onCreated?.(homework);
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Failed to assign",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
  };

  // Form Content
  const FormContent = () => (
    <ScrollArea className={cn("pr-2", isMobile ? "max-h-[70vh]" : "max-h-[65vh]")}>
      <div className="space-y-4 pb-4">
        {/* Title Input */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Homework Title *</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
              const isSelected = selectedType === config.id;
              return (
                <button
                  key={config.id}
                  onClick={() => setSelectedType(config.id)}
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
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
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
          
          <CollapsibleContent className="pt-3 space-y-3">
            {/* Selected Context Display */}
            {contextSource !== 'none' && (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-2 text-sm">
                  {contextSource === 'document' && <FileText className="w-4 h-4 text-primary" />}
                  {contextSource === 'content' && <Library className="w-4 h-4 text-primary" />}
                  {contextSource === 'lesson_plan' && <BookOpen className="w-4 h-4 text-primary" />}
                  <span className="truncate max-w-[200px]">{getContextDescription()}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={clearContext}
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
                  onChange={handleFileUpload}
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
                onClick={() => setShowContentPicker(true)}
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
                onClick={() => setShowLessonPlanPicker(true)}
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
          </CollapsibleContent>
        </Collapsible>

        {/* Subject & Batch */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-sm">Subject</Label>
            <Select value={subject} onValueChange={setSubject}>
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
            <Select value={batchId} onValueChange={setBatchId}>
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
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="h-10"
          />
        </div>
      </div>
    </ScrollArea>
  );

  // Generated Preview Content
  const PreviewContent = () => {
    if (!generatedHomework) return null;

    return (
      <ScrollArea className={cn("pr-2", isMobile ? "max-h-[60vh]" : "max-h-[55vh]")}>
        <div className="space-y-4 pb-4">
          {/* Generated Title & Description */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20">
            <h3 className="font-semibold text-foreground mb-1">
              {generatedHomework.title || title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {generatedHomework.description}
            </p>
            <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
              {generatedHomework.estimatedTime && (
                <span className="flex items-center gap-1">
                  <Timer className="w-3.5 h-3.5" />
                  {generatedHomework.estimatedTime} mins
                </span>
              )}
              {generatedHomework.totalMarks && (
                <span>Total: {generatedHomework.totalMarks} marks</span>
              )}
            </div>
          </div>

          {/* Instructions */}
          {generatedHomework.instructions?.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Instructions</Label>
              <ul className="text-sm space-y-1.5 text-muted-foreground">
                {generatedHomework.instructions.map((instruction, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary font-medium">{idx + 1}.</span>
                    {instruction}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tasks */}
          {generatedHomework.tasks?.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tasks ({generatedHomework.tasks.length})</Label>
              <div className="space-y-2">
                {generatedHomework.tasks.map((task, idx) => (
                  <div
                    key={task.id || idx}
                    className="p-3 rounded-lg bg-muted/50 border"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-foreground">{task.content}</p>
                      {task.marks && (
                        <Badge variant="outline" className="shrink-0 text-xs">
                          {task.marks}m
                        </Badge>
                      )}
                    </div>
                    <Badge variant="secondary" className="text-xs mt-2">
                      {task.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assignment Info */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Assign to:</span>
              <Badge variant="outline">
                {batchId === "batch-10a" ? "10A" : batchId === "batch-10b" ? "10B" : "11A"}
              </Badge>
              <Badge variant="outline">{subject}</Badge>
            </div>
            <span className="text-sm text-muted-foreground">Due: {dueDate}</span>
          </div>
        </div>
      </ScrollArea>
    );
  };

  // Action Buttons
  const ActionButtons = () => (
    <div className="flex gap-2 pt-3 border-t">
      {!generatedHomework ? (
        <>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-11"
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !title.trim()}
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
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="h-11 gap-2"
          >
            <RefreshCw className={cn("w-4 h-4", isGenerating && "animate-spin")} />
            <span className="hidden sm:inline">Regenerate</span>
          </Button>
          <Button
            onClick={handleAssign}
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

  // Mobile Drawer
  if (isMobile) {
    return (
      <>
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent className="max-h-[92vh]">
            <DrawerHeader className="pb-2 border-b">
              <DrawerTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Generate Homework with AI
              </DrawerTitle>
            </DrawerHeader>
            <div className="p-4">
              {generatedHomework ? <PreviewContent /> : <FormContent />}
              <ActionButtons />
            </div>
          </DrawerContent>
        </Drawer>

        {/* Pickers */}
        <ContentLibraryPicker
          open={showContentPicker}
          onOpenChange={setShowContentPicker}
          onSelect={handleContentSelect}
          subject={subject}
        />
        <LessonPlanPicker
          open={showLessonPlanPicker}
          onOpenChange={setShowLessonPlanPicker}
          onSelect={handleLessonPlanSelect}
        />
      </>
    );
  }

  // Desktop Dialog
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[540px] p-0">
          <DialogHeader className="p-6 pb-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Generate Homework with AI
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-4">
            {generatedHomework ? <PreviewContent /> : <FormContent />}
            <ActionButtons />
          </div>
        </DialogContent>
      </Dialog>

      {/* Pickers */}
      <ContentLibraryPicker
        open={showContentPicker}
        onOpenChange={setShowContentPicker}
        onSelect={handleContentSelect}
        subject={subject}
      />
      <LessonPlanPicker
        open={showLessonPlanPicker}
        onOpenChange={setShowLessonPlanPicker}
        onSelect={handleLessonPlanSelect}
      />
    </>
  );
};
