/**
 * Homework Block Dialog
 * Simplified 3-mode homework creation for Lesson Plan Workspace
 */
import { useState } from "react";
import { 
  Pencil,
  Timer,
  FolderOpen,
  Calendar,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Paperclip,
  Upload,
  X
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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import type { LessonPlanBlock } from "./types";

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
    borderColor: 'border-blue-200 hover:border-blue-400',
  },
  test: {
    id: 'test',
    label: 'Test',
    description: 'Auto-graded MCQ/Questions',
    icon: Timer,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200 hover:border-purple-400',
  },
  project: {
    id: 'project',
    label: 'Project',
    description: 'Reports, PPTs, creative work',
    icon: FolderOpen,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200 hover:border-orange-400',
  },
};

interface HomeworkBlockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddBlock: (block: Omit<LessonPlanBlock, 'id'>) => void;
  // Context from lesson plan
  context?: {
    subject?: string;
    chapter?: string;
    topic?: string;
    batchId?: string;
    batchName?: string;
  };
}

export const HomeworkBlockDialog = ({
  open,
  onOpenChange,
  onAddBlock,
  context,
}: HomeworkBlockDialogProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Step state
  const [step, setStep] = useState<'select' | 'form'>('select');
  const [selectedType, setSelectedType] = useState<HomeworkType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    title: '',
    instructions: '',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  // Generate suggested title based on type and context
  const getSuggestedTitle = (type: HomeworkType): string => {
    const topic = context?.topic || context?.chapter || '';
    switch (type) {
      case 'practice':
        return topic ? `Practice: ${topic}` : 'Practice Problems';
      case 'test':
        return topic ? `Test: ${topic}` : 'Chapter Test';
      case 'project':
        return topic ? `Project: ${topic}` : 'Mini Project';
      default:
        return '';
    }
  };

  const handleTypeSelect = (type: HomeworkType) => {
    setSelectedType(type);
    setFormData(prev => ({
      ...prev,
      title: getSuggestedTitle(type),
    }));
    setStep('form');
  };

  const handleBack = () => {
    setStep('select');
    setSelectedType(null);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for the homework.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create homework block for lesson plan
      const block: Omit<LessonPlanBlock, 'id'> = {
        type: 'homework',
        title: formData.title,
        content: formData.instructions || undefined,
        source: 'custom',
        duration: 5, // Homework block typically shown briefly in class
        // Store homework metadata in the block
        sourceType: selectedType || 'practice',
      };

      // Simulate brief delay
      await new Promise(resolve => setTimeout(resolve, 200));

      toast({
        title: "Homework Added ✓",
        description: `${formData.title} added to lesson plan.`,
      });

      onAddBlock(block);
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Failed to add",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep('select');
    setSelectedType(null);
    setFormData({
      title: '',
      instructions: '',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
  };

  // Type Selection UI
  const TypeSelectionContent = () => (
    <div className="p-4 space-y-4">
      <p className="text-sm text-muted-foreground text-center">
        What type of homework?
      </p>
      
      <div className="grid gap-3">
        {Object.values(homeworkTypeConfig).map((config) => {
          const Icon = config.icon;
          return (
            <button
              key={config.id}
              onClick={() => handleTypeSelect(config.id)}
              className={cn(
                "flex items-center gap-4 p-4 rounded-xl border-2 transition-all",
                "hover:shadow-md active:scale-[0.98]",
                config.borderColor,
                config.bgColor
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                "bg-white shadow-sm",
                config.color
              )}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-foreground">{config.label}</h3>
                <p className="text-sm text-muted-foreground">{config.description}</p>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Context hint */}
      {context?.chapter && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Badge variant="secondary" className="text-xs">
            {context.subject} • {context.chapter}
          </Badge>
        </div>
      )}
    </div>
  );

  // Form UI for selected type
  const FormContent = () => {
    if (!selectedType) return null;
    
    const typeConfig = homeworkTypeConfig[selectedType];
    const TypeIcon = typeConfig.icon;
    
    return (
      <div className="p-4 space-y-4">
        {/* Type Header - Compact */}
        <div className={cn(
          "flex items-center gap-3 p-3 rounded-lg",
          typeConfig.bgColor
        )}>
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center bg-white shadow-sm",
            typeConfig.color
          )}>
            <TypeIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">{typeConfig.label} Homework</h3>
            <p className="text-xs text-muted-foreground">{typeConfig.description}</p>
          </div>
        </div>

        {/* Title - Required */}
        <div className="space-y-1.5">
          <Label className="text-sm">Title *</Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder={`e.g., ${getSuggestedTitle(selectedType)}`}
            className="h-11"
          />
        </div>

        {/* Instructions - Optional */}
        <div className="space-y-1.5">
          <Label className="text-sm">
            Instructions {selectedType === 'project' ? '*' : '(optional)'}
          </Label>
          <Textarea
            value={formData.instructions}
            onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
            placeholder={
              selectedType === 'practice' 
                ? "Solve questions 1-10 from Chapter 5..."
                : selectedType === 'project'
                ? "Create a presentation on... Include at least 10 slides..."
                : "Complete the test within the given time..."
            }
            className="min-h-[80px] resize-none"
          />
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
            onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
            min={new Date().toISOString().split('T')[0]}
            className="h-10"
          />
        </div>

        {/* Context badge */}
        {context?.batchName && (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-muted-foreground">Assigning to:</span>
            <Badge variant="outline" className="text-xs">
              {context.batchName} • {context.subject}
            </Badge>
          </div>
        )}

        {/* Info note */}
        <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-lg">
          💡 This homework will be linked to your lesson plan and can be assigned to students when you teach this lesson.
        </p>
      </div>
    );
  };

  // Action Buttons
  const ActionButtons = () => (
    <div className="flex gap-2 p-4 border-t">
      {step === 'form' && (
        <Button
          variant="ghost"
          onClick={handleBack}
          className="h-11"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
      )}
      
      <Button
        variant="outline"
        onClick={() => {
          onOpenChange(false);
          resetForm();
        }}
        className={cn("h-11", step === 'select' ? "flex-1" : "")}
      >
        Cancel
      </Button>
      
      {step === 'form' && (
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !formData.title.trim()}
          className="flex-1 h-11 gradient-button"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <CheckCircle2 className="w-4 h-4 mr-2" />
          )}
          Add to Lesson
        </Button>
      )}
    </div>
  );

  // Mobile Drawer
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={(isOpen) => {
        if (!isOpen) resetForm();
        onOpenChange(isOpen);
      }}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="pb-2">
            <DrawerTitle>
              {step === 'select' ? 'Add Homework Block' : 'Homework Details'}
            </DrawerTitle>
          </DrawerHeader>
          
          <ScrollArea className="max-h-[55vh]">
            {step === 'select' ? <TypeSelectionContent /> : <FormContent />}
          </ScrollArea>
          
          <ActionButtons />
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop Dialog
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="max-w-md p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>
            {step === 'select' ? 'Add Homework Block' : 'Homework Details'}
          </DialogTitle>
        </DialogHeader>
        
        {step === 'select' ? <TypeSelectionContent /> : <FormContent />}
        
        <ActionButtons />
      </DialogContent>
    </Dialog>
  );
};