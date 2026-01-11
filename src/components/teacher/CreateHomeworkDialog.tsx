import { useState } from "react";
import { 
  Sparkles, 
  Loader2,
  Calendar,
  Pencil,
  Timer,
  FolderOpen,
  ArrowLeft,
  Paperclip,
  Upload,
  X,
  CheckCircle2
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
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";

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

interface CreateHomeworkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (homework: any) => void;
  linkedLessonPlanId?: string;
  // Context from schedule or lesson plan
  context?: {
    subject?: string;
    batchId?: string;
    batchName?: string;
    chapter?: string;
    topic?: string;
  };
}

export const CreateHomeworkDialog = ({
  open,
  onOpenChange,
  onCreated,
  linkedLessonPlanId,
  context,
}: CreateHomeworkDialogProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Step state: 'select' for type selection, 'form' for details
  const [step, setStep] = useState<'select' | 'form'>('select');
  const [selectedType, setSelectedType] = useState<HomeworkType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);
  
  // Form data - minimal fields
  const [formData, setFormData] = useState({
    title: '',
    instructions: '',
    subject: context?.subject || 'Physics',
    batchId: context?.batchId || 'batch-10a',
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
      // For Test type, we could redirect to test creation
      // For now, create a homework entry
      const homework = {
        id: `hw-${Date.now()}`,
        title: formData.title,
        description: formData.instructions,
        subject: formData.subject,
        batchId: formData.batchId,
        batchName: formData.batchId === "batch-10a" ? "10A" : formData.batchId === "batch-10b" ? "10B" : "11A",
        className: formData.batchId.includes("10") ? "Class 10" : "Class 11",
        dueDate: formData.dueDate,
        assignedDate: new Date().toISOString().split('T')[0],
        status: "assigned" as const,
        submissionCount: 0,
        totalStudents: 35,
        linkedLessonPlanId: linkedLessonPlanId,
        homeworkType: selectedType,
        attachments: attachments.length > 0 ? attachments : undefined,
      };

      // Simulate brief delay
      await new Promise(resolve => setTimeout(resolve, 300));

      toast({
        title: "Homework Assigned! ✓",
        description: `${homework.batchName} students have been notified.`,
      });

      onCreated?.(homework);
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Failed to assign",
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
    setAttachments([]);
    setFormData({
      title: '',
      instructions: '',
      subject: context?.subject || 'Physics',
      batchId: context?.batchId || 'batch-10a',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
  };

  const handleAddAttachment = () => {
    // Mock attachment - in real app would open file picker
    const mockAttachment = `worksheet-${Date.now()}.pdf`;
    setAttachments(prev => [...prev, mockAttachment]);
    toast({
      title: "Attachment added",
      description: mockAttachment,
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
      
      {/* Context hint if available */}
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
      <div className="space-y-4">
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

        {/* Instructions - Optional but important for Project */}
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

        {/* Subject & Batch - Side by side, only if no context */}
        {!context?.subject && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm">Subject</Label>
              <Select
                value={formData.subject}
                onValueChange={(v) => setFormData(prev => ({ ...prev, subject: v }))}
              >
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
              <Select
                value={formData.batchId}
                onValueChange={(v) => setFormData(prev => ({ ...prev, batchId: v }))}
              >
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
        )}

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

        {/* Attachments - For Practice and Project */}
        {(selectedType === 'practice' || selectedType === 'project') && (
          <div className="space-y-2">
            <Label className="text-sm flex items-center gap-2">
              <Paperclip className="w-4 h-4" />
              Attachments (optional)
            </Label>
            
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {attachments.map((file, idx) => (
                  <Badge 
                    key={idx} 
                    variant="secondary" 
                    className="gap-1.5 pl-2 pr-1 py-1"
                  >
                    {file}
                    <button
                      onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                      className="hover:bg-muted rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddAttachment}
              className="w-full h-10 border-dashed"
            >
              <Upload className="w-4 h-4 mr-2" />
              Add Worksheet / Reference
            </Button>
          </div>
        )}

        {/* Context badge if available */}
        {context?.subject && (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-muted-foreground">Assigning to:</span>
            <Badge variant="outline" className="text-xs">
              {context.batchName || formData.batchId.replace('batch-', '')} • {context.subject}
            </Badge>
          </div>
        )}
      </div>
    );
  };

  // Action Buttons
  const ActionButtons = () => (
    <div className="flex gap-2 pt-2">
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
          Assign Homework
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
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="pb-2">
            <DrawerTitle>
              {step === 'select' ? 'Assign Homework' : 'Homework Details'}
            </DrawerTitle>
          </DrawerHeader>
          
          <ScrollArea className="px-4 pb-2 max-h-[60vh]">
            {step === 'select' ? <TypeSelectionContent /> : <FormContent />}
          </ScrollArea>
          
          <div className="p-4 border-t">
            <ActionButtons />
          </div>
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'select' ? 'Assign Homework' : 'Homework Details'}
          </DialogTitle>
        </DialogHeader>
        
        {step === 'select' ? <TypeSelectionContent /> : <FormContent />}
        
        <ActionButtons />
      </DialogContent>
    </Dialog>
  );
};