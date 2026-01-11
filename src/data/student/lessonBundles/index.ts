// Lesson Bundles - Barrel Export
// Re-exports everything for backward compatibility

// Types
export type {
  ContentType,
  HomeworkType,
  SubmissionStatus,
  LessonBundle,
  BundleContentItem,
  TeacherScreenshot,
  HomeworkItem,
  AIPathItem,
  ChallengeItem,
} from "./types";

// Data
export { lessonBundles } from "./bundles";
export { bundleContentItems, teacherScreenshots } from "./content";
export { homeworkItems, aiPathItems, challengeItems } from "./learning";

// Helper functions
export {
  getLessonBundlesByChapter,
  getLessonBundleById,
  getContentByBundle,
  getContentById,
  getScreenshotsByBundle,
  getHomeworkByChapter,
  getAIPathByChapter,
  getChallengesByChapter,
} from "./helpers";
