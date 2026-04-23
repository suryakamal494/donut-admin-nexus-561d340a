import { Series } from "remotion";
import { VideoQuestionData } from "./constants";
import { QuestionRecap } from "./scenes/QuestionRecap";
import { CorrectReveal } from "./scenes/CorrectReveal";
import { ExplanationSteps } from "./scenes/ExplanationSteps";
import { Summary } from "./scenes/Summary";

interface Props {
  data: VideoQuestionData;
}

export const WrongAnswerVideo: React.FC<Props> = ({ data }) => {
  return (
    <Series>
      <Series.Sequence durationInFrames={120}>
        <QuestionRecap data={data} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={110}>
        <CorrectReveal data={data} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={150}>
        <ExplanationSteps data={data} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={120}>
        <Summary data={data} />
      </Series.Sequence>
    </Series>
  );
};