import { useState, useEffect, useCallback } from "react";
import { Sparkles } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { ContentLibraryPicker, ContentItem } from "./ContentLibraryPicker";
import { LessonPlanPicker, LessonPlanItem } from "./LessonPlanPicker";

// Import refactored components
import {
  HomeworkType,
  ContextSourceType,
  GeneratedHomework,
  AIHomeworkFormData,
  getBatchDisplayName,
  getClassName,
} from "./ai-homework/types";
import { AIHomeworkForm } from "./ai-homework/AIHomeworkForm";
import { AIHomeworkPreview } from "./ai-homework/AIHomeworkPreview";
import { AIHomeworkActions } from "./ai-homework/AIHomeworkActions";

// Re-export type for external use
export type { HomeworkType };

interface AIHomeworkGeneratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (homework: any) => void;
}

export const AIHomeworkGeneratorDialog = ({
  open,
  onOpenChange,
  onCreated,
}: AIHomeworkGeneratorDialogProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Form state
  const [formData, setFormData] = useState<AIHomeworkFormData>({
    title: "",
    instructions: "",
    selectedType: 'practice',
    subject: "Physics",
    batchId: "batch-10a",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });
  
  // Context source state
  const [contextSource, setContextSource] = useState<ContextSourceType>('none');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [selectedLessonPlan, setSelectedLessonPlan] = useState<LessonPlanItem | null>(null);
  
  // Picker states
  const [showContentPicker, setShowContentPicker] = useState(false);
  const [showLessonPlanPicker, setShowLessonPlanPicker] = useState(false);
  
  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedHomework, setGeneratedHomework] = useState<GeneratedHomework | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const resetForm = useCallback(() => {
    setFormData({
      title: "",
      instructions: "",
      selectedType: 'practice',
      subject: "Physics",
      batchId: "batch-10a",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    setContextSource('none');
    setUploadedFile(null);
    setSelectedContent(null);
    setSelectedLessonPlan(null);
    setGeneratedHomework(null);
  }, []);

  const handleFormChange = useCallback(<K extends keyof AIHomeworkFormData>(
    key: K, 
    value: AIHomeworkFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setContextSource('document');
      setSelectedContent(null);
      setSelectedLessonPlan(null);
    }
  }, []);

  const handleContentSelect = useCallback((content: ContentItem) => {
    setSelectedContent(content);
    setContextSource('content');
    setUploadedFile(null);
    setSelectedLessonPlan(null);
    setShowContentPicker(false);
  }, []);

  const handleLessonPlanSelect = useCallback((plan: LessonPlanItem) => {
    setSelectedLessonPlan(plan);
    setContextSource('lesson_plan');
    setUploadedFile(null);
    setSelectedContent(null);
    setShowLessonPlanPicker(false);
  }, []);

  const clearContext = useCallback(() => {
    setContextSource('none');
    setUploadedFile(null);
    setSelectedContent(null);
    setSelectedLessonPlan(null);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for the homework.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
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
          topic: formData.title,
          subject: formData.subject,
          homeworkType: formData.selectedType,
          customInstructions: formData.instructions,
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
  }, [formData, contextSource, uploadedFile, selectedContent, selectedLessonPlan, toast]);

  const handleRegenerate = useCallback(() => {
    setGeneratedHomework(null);
    handleGenerate();
  }, [handleGenerate]);

  const handleAssign = useCallback(async () => {
    if (!generatedHomework) return;

    setIsAssigning(true);

    try {
      const homework = {
        id: `hw-ai-${Date.now()}`,
        title: generatedHomework.title || formData.title,
        description: generatedHomework.description,
        subject: formData.subject,
        batchId: formData.batchId,
        batchName: getBatchDisplayName(formData.batchId),
        className: getClassName(formData.batchId),
        dueDate: formData.dueDate,
        assignedDate: new Date().toISOString().split('T')[0],
        status: "assigned" as const,
        submissionCount: 0,
        totalStudents: 35,
        homeworkType: formData.selectedType,
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
  }, [generatedHomework, formData, toast, onCreated, onOpenChange]);

  // Content to render
  const renderContent = () => (
    <>
      {generatedHomework ? (
        <AIHomeworkPreview
          generatedHomework={generatedHomework}
          title={formData.title}
          batchId={formData.batchId}
          subject={formData.subject}
          dueDate={formData.dueDate}
          isMobile={isMobile}
        />
      ) : (
        <AIHomeworkForm
          formData={formData}
          onFormChange={handleFormChange}
          contextSource={contextSource}
          uploadedFile={uploadedFile}
          selectedContent={selectedContent}
          selectedLessonPlan={selectedLessonPlan}
          onFileUpload={handleFileUpload}
          onContentSelect={() => setShowContentPicker(true)}
          onLessonPlanSelect={() => setShowLessonPlanPicker(true)}
          onClearContext={clearContext}
          isMobile={isMobile}
        />
      )}
      <AIHomeworkActions
        hasGeneratedHomework={!!generatedHomework}
        isGenerating={isGenerating}
        isAssigning={isAssigning}
        canGenerate={!!formData.title.trim()}
        onCancel={() => onOpenChange(false)}
        onGenerate={handleGenerate}
        onRegenerate={handleRegenerate}
        onAssign={handleAssign}
      />
    </>
  );

  // Pickers
  const renderPickers = () => (
    <>
      <ContentLibraryPicker
        open={showContentPicker}
        onOpenChange={setShowContentPicker}
        onSelect={handleContentSelect}
        subject={formData.subject}
      />
      <LessonPlanPicker
        open={showLessonPlanPicker}
        onOpenChange={setShowLessonPlanPicker}
        onSelect={handleLessonPlanSelect}
      />
    </>
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
              {renderContent()}
            </div>
          </DrawerContent>
        </Drawer>
        {renderPickers()}
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
            {renderContent()}
          </div>
        </DialogContent>
      </Dialog>
      {renderPickers()}
    </>
  );
};
