import { Series, Audio, staticFile, useVideoConfig } from "remotion";
import { VideoQuestionData, AUDIO_DURATIONS } from "./constants";
import { QuestionRecap } from "./scenes/QuestionRecap";
import { CorrectReveal } from "./scenes/CorrectReveal";
import { ExplanationSteps } from "./scenes/ExplanationSteps";
import { Summary } from "./scenes/Summary";

interface Props {
  data: VideoQuestionData;
}

export const WrongAnswerVideo: React.FC<Props> = ({ data }) => {
  const { durationInFrames, fps } = useVideoConfig();
  const audioDur = AUDIO_DURATIONS[data.id] || 60;
  const totalFrames = durationInFrames;

  // Distribute frames proportionally: 25% recap, 10% reveal, 50% explanation, 15% summary
  const recapFrames = Math.round(totalFrames * 0.25);
  const revealFrames = Math.round(totalFrames * 0.10);
  const explanationFrames = Math.round(totalFrames * 0.50);
  const summaryFrames = totalFrames - recapFrames - revealFrames - explanationFrames;

  return (
    <>
      <Audio src={staticFile(`audio/${data.id}.mp3`)} volume={1} />
      <Series>
        <Series.Sequence durationInFrames={recapFrames}>
          <QuestionRecap data={data} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={revealFrames}>
          <CorrectReveal data={data} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={explanationFrames}>
          <ExplanationSteps data={data} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={summaryFrames}>
          <Summary data={data} />
        </Series.Sequence>
      </Series>
    </>
  );
};