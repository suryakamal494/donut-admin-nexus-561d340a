// Lesson Plan Workspace Components
export { WorkspaceHeader } from "./WorkspaceHeader";
export { WorkspaceContextBar } from "./WorkspaceContextBar";
export { WorkspaceToolbar } from "./WorkspaceToolbar";
export { WorkspaceCanvas } from "./WorkspaceCanvas";
export { WorkspaceBlock } from "./WorkspaceBlock";
export { WorkspaceFooter } from "./WorkspaceFooter";
export { BlockDialog } from "./BlockDialog";
export { QuizDialog } from "./QuizDialog";
export { HomeworkBlockDialog } from "./HomeworkBlockDialog";
export { AIAssistDialog } from "./AIAssistDialog";
export { ContentPreviewDialog } from "./ContentPreviewDialog";
export { QuestionBankSheet } from "./QuestionBankSheet";
export { ContentLibrarySheet } from "./ContentLibrarySheet";
export { PresentationMode } from "./presentation";

// Types
export type { LessonPlanBlock, LessonPlan, WorkspaceContext, BlockType, BlockSource, LinkType, AnnotationTool } from "./types";
export { blockTypeConfig, detectLinkType, getYouTubeEmbedUrl, getVimeoEmbedUrl } from "./types";