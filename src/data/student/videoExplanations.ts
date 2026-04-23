// Maps question IDs to pre-rendered video explanation URLs

const STORAGE_BASE = "https://jmzuxhkceuuulegbcvsi.supabase.co/storage/v1/object/public/explanation-videos";

export interface VideoExplanation {
  questionId: string;
  videoUrl: string;
  duration: string; // e.g. "0:17"
  subject: string;
  chapter: string;
  questionNumber: number;
}

export const videoExplanations: VideoExplanation[] = [
  { questionId: "q1", videoUrl: `${STORAGE_BASE}/wrong-answer-q1.mp4`, duration: "0:58", subject: "Physics", chapter: "Laws of Motion", questionNumber: 1 },
  { questionId: "q2", videoUrl: `${STORAGE_BASE}/wrong-answer-q2.mp4`, duration: "1:08", subject: "Physics", chapter: "Laws of Motion", questionNumber: 2 },
  { questionId: "q3", videoUrl: `${STORAGE_BASE}/wrong-answer-q3.mp4`, duration: "0:46", subject: "Chemistry", chapter: "Atomic Structure", questionNumber: 3 },
  { questionId: "q4", videoUrl: `${STORAGE_BASE}/wrong-answer-q4.mp4`, duration: "1:00", subject: "Mathematics", chapter: "Quadratic Equations", questionNumber: 4 },
  { questionId: "q5", videoUrl: `${STORAGE_BASE}/wrong-answer-q5.mp4`, duration: "0:52", subject: "Physics", chapter: "Electrostatics", questionNumber: 5 },
];

export function getVideoForQuestion(questionId: string): VideoExplanation | undefined {
  return videoExplanations.find(v => v.questionId === questionId);
}

// Get video by question number (for mock data matching)
export function getVideoForQuestionNumber(questionNumber: number): VideoExplanation | undefined {
  return videoExplanations.find(v => v.questionNumber === questionNumber);
}