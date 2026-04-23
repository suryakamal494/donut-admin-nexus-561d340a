import { Composition } from "remotion";
import { WrongAnswerVideo } from "./WrongAnswerVideo";
import { DEMO_QUESTIONS } from "./constants";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {DEMO_QUESTIONS.map((q, i) => (
        <Composition
          key={q.id}
          id={`wrong-answer-${q.id}`}
          component={WrongAnswerVideo}
          durationInFrames={500}
          fps={30}
          width={1280}
          height={720}
          defaultProps={{ data: q }}
        />
      ))}
    </>
  );
};