import { Composition } from "remotion";
import { WrongAnswerVideo } from "./WrongAnswerVideo";
import { DEMO_QUESTIONS, AUDIO_DURATIONS, VIDEO_CONFIG } from "./constants";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {DEMO_QUESTIONS.map((q, i) => (
        <Composition
          key={q.id}
          id={`wrong-answer-${q.id}`}
          component={WrongAnswerVideo}
          durationInFrames={Math.ceil((AUDIO_DURATIONS[q.id] || 60) * VIDEO_CONFIG.fps) + 30}
          fps={VIDEO_CONFIG.fps}
          width={VIDEO_CONFIG.width}
          height={VIDEO_CONFIG.height}
          defaultProps={{ data: q }}
        />
      ))}
    </>
  );
};