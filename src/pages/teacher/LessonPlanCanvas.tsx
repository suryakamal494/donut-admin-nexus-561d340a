import { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { currentTeacher, teacherLessonPlans, type LessonPlan } from "@/data/teacherData";
import {
  WorkspaceHeader,
  WorkspaceContextBar,
  WorkspaceToolbar,
  WorkspaceCanvas,
  WorkspaceFooter,
  AIAssistDialog,
  PresentationMode,
  type LessonPlanBlock,
  type BlockType,
  type WorkspaceContext,
} from "@/components/teacher/lesson-workspace";

// Convert data layer block to workspace block format
const convertToWorkspaceBlock = (block: LessonPlan['blocks'][0]): LessonPlanBlock => {
  return {
    id: block.id,
    type: block.type as BlockType,
    title: block.title,
    content: block.content,
    duration: block.duration,
    source: block.source || 'custom',
    sourceId: block.sourceId,
    sourceType: block.sourceType,
    questions: block.questions,
    embedUrl: block.embedUrl,
    linkType: block.linkType as LessonPlanBlock['linkType'],
    aiGenerated: block.aiGenerated,
  };
};

const LessonPlanCanvas = () => {
  const navigate = useNavigate();
  const { planId } = useParams();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  // Get planId from route param, or check for cloneFrom in query
  const cloneFromId = searchParams.get('cloneFrom');
  const isNew = planId === 'new' || (!planId && !cloneFromId);

  // Load existing lesson plan if planId is provided (and not "new")
  const existingPlan = (planId && planId !== 'new')
    ? teacherLessonPlans.find(p => p.id === planId)
    : cloneFromId 
      ? teacherLessonPlans.find(p => p.id === cloneFromId)
      : null;

  // Context from URL (from timetable) or from existing plan
  const contextBatch = searchParams.get('batch');
  const contextBatchName = searchParams.get('batchName');
  const contextDate = searchParams.get('date');
  const contextClassName = searchParams.get('className');
  const contextChapter = searchParams.get('chapter');

  // Workspace context - prefer existing plan data if available
  const [context, setContext] = useState<WorkspaceContext>({
    className: existingPlan?.className || contextClassName || "Class 10",
    subject: existingPlan?.subject || currentTeacher.subjects[0] || "Physics",
    chapter: existingPlan?.chapter || contextChapter || "",
    scheduledDate: existingPlan?.scheduledDate || contextDate || new Date().toISOString().split('T')[0],
    batchName: existingPlan?.batchName || contextBatchName || "10A",
    batchId: existingPlan?.batchId || contextBatch || "batch-10a",
    isFromTimetable: !!contextBatch || !!existingPlan,
  });

  // Initialize blocks from existing plan or empty
  const [blocks, setBlocks] = useState<LessonPlanBlock[]>(() => {
    if (existingPlan) {
      return existingPlan.blocks.map(convertToWorkspaceBlock);
    }
    return [];
  });

  const [planTitle, setPlanTitle] = useState(
    cloneFromId && existingPlan 
      ? `${existingPlan.title} (Copy)` 
      : existingPlan?.title || ""
  );
  const [topics, setTopics] = useState<string[]>(existingPlan?.topics || []);
  const [status, setStatus] = useState<'draft' | 'ready' | 'used'>(
    cloneFromId ? 'draft' : (existingPlan?.status || 'draft')
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeBlockType, setActiveBlockType] = useState<BlockType | null>(null);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [showPresentation, setShowPresentation] = useState(false);
  const [topic, setTopic] = useState(existingPlan?.topics?.[0] || '');

  // Update blocks when existing plan changes (e.g., navigation)
  useEffect(() => {
    if (existingPlan) {
      setBlocks(existingPlan.blocks.map(convertToWorkspaceBlock));
      setPlanTitle(cloneFromId ? `${existingPlan.title} (Copy)` : existingPlan.title);
      setTopics(existingPlan.topics || []);
      setStatus(cloneFromId ? 'draft' : existingPlan.status);
      setTopic(existingPlan.topics?.[0] || '');
      setContext({
        className: existingPlan.className,
        subject: existingPlan.subject,
        chapter: existingPlan.chapter,
        scheduledDate: existingPlan.scheduledDate,
        batchName: existingPlan.batchName,
        batchId: existingPlan.batchId,
        isFromTimetable: true,
      });
    }
  }, [existingPlan?.id, cloneFromId]);

  const totalDuration = blocks.reduce((sum, b) => sum + (b.duration || 0), 0);

  const handleAddBlock = useCallback((block: Omit<LessonPlanBlock, 'id'>) => {
    const newBlock: LessonPlanBlock = {
      ...block,
      id: `block-${Date.now()}`,
    };
    setBlocks(prev => [...prev, newBlock]);
    setActiveBlockType(null);
  }, []);

  const handleBlockClick = (type: BlockType) => {
    setActiveBlockType(activeBlockType === type ? null : type);
  };

  const handleEditBlock = useCallback((block: LessonPlanBlock) => {
    // For now, just show toast - full edit dialog can be added later
    toast({ title: "Edit Block", description: `Editing: ${block.title}` });
  }, [toast]);

  const handleDeleteBlock = useCallback((blockId: string) => {
    setBlocks(prev => prev.filter(b => b.id !== blockId));
  }, []);

  const handleReorderBlocks = useCallback((newBlocks: LessonPlanBlock[]) => {
    setBlocks(newBlocks);
  }, []);

  const handleAddBetween = useCallback((index: number, type: BlockType) => {
    const newBlock: LessonPlanBlock = {
      id: `block-${Date.now()}`,
      type,
      title: "",
      source: 'custom',
      duration: 10,
    };
    setBlocks(prev => [...prev.slice(0, index), newBlock, ...prev.slice(index)]);
  }, []);

  const handleAIGenerate = useCallback(async () => {
    if (!topic) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("lesson-plan-ai", {
        body: {
          action: "generate_plan",
          topic,
          subject: context.subject,
          chapter: context.chapter,
        },
      });

      if (error) throw error;

      if (data?.data?.blocks) {
        const newBlocks: LessonPlanBlock[] = data.data.blocks.map((b: any, i: number) => ({
          id: `block-ai-${Date.now()}-${i}`,
          type: ['explain', 'demonstrate', 'quiz', 'homework'].includes(b.type) ? b.type : 'explain',
          title: b.title || "",
          content: b.content || "",
          duration: b.duration || 10,
          source: 'ai' as const,
          aiGenerated: true,
        }));
        setBlocks(newBlocks);
        toast({ title: "Lesson Generated", description: `Created ${newBlocks.length} blocks` });
      }
    } catch (error: any) {
      toast({ title: "Generation Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  }, [topic, context.subject, context.chapter, toast]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    toast({ title: "Saved", description: "Lesson plan saved as draft" });
    setIsSaving(false);
  }, [toast]);

  const handlePublish = useCallback(async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setStatus('ready');
    toast({ title: "Published", description: "Lesson plan is ready for class" });
    setIsSaving(false);
  }, [toast]);

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-24 sm:pb-6">
      <WorkspaceHeader
        isNew={isNew}
        subject={context.subject}
        batchName={context.batchName}
        status={status}
        isSaving={isSaving}
        onBack={() => navigate("/teacher/lesson-plans")}
        onSave={handleSave}
        onStartClass={() => setShowPresentation(true)}
        planTitle={planTitle}
      />

      <WorkspaceContextBar context={context} onContextChange={(updates) => setContext(prev => ({ ...prev, ...updates }))} />

      <WorkspaceToolbar
        onBlockClick={handleBlockClick}
        onAIAssist={() => setShowAIDialog(true)}
        onAddBlock={handleAddBlock}
        isGenerating={isGenerating}
        activeBlock={activeBlockType}
        chapter={context.chapter}
        subject={context.subject}
        batchId={context.batchId}
        batchName={context.batchName}
      />

      <WorkspaceCanvas
        blocks={blocks}
        onReorder={handleReorderBlocks}
        onEditBlock={handleEditBlock}
        onDeleteBlock={handleDeleteBlock}
        onAddBetween={handleAddBetween}
      />

      <WorkspaceFooter
        totalDuration={totalDuration}
        blockCount={blocks.length}
        isSaving={isSaving}
        onSaveDraft={handleSave}
        onPublish={handlePublish}
      />

      <AIAssistDialog
        open={showAIDialog}
        onOpenChange={setShowAIDialog}
        topic={topic}
        chapter={context.chapter}
        subject={context.subject}
        onTopicChange={setTopic}
        onChapterChange={(ch) => setContext(prev => ({ ...prev, chapter: ch }))}
        onGenerate={handleAIGenerate}
        isGenerating={isGenerating}
      />

      <PresentationMode
        open={showPresentation}
        onClose={() => setShowPresentation(false)}
        blocks={blocks}
        lessonTitle={planTitle || `${context.chapter} - ${context.subject}`}
      />
    </div>
  );
};

export default LessonPlanCanvas;
