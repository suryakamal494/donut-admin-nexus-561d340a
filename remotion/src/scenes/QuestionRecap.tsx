import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, VideoQuestionData } from "../constants";
import { AnimatedText } from "../components/AnimatedText";
import { OptionBubble } from "../components/OptionBubble";
import { ProgressBar } from "../components/ProgressBar";

interface Props {
  data: VideoQuestionData;
}

export const QuestionRecap: React.FC<Props> = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgScale = interpolate(frame, [0, 90], [1.05, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(145deg, ${COLORS.warmBg} 0%, ${COLORS.warmBgDark} 100%)`,
        transform: `scale(${bgScale})`,
      }}
    >
      {/* Header badge */}
      <div style={{ position: "absolute", top: 36, left: 60, display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            padding: "6px 16px",
            borderRadius: 20,
            background: `linear-gradient(135deg, ${COLORS.coral}, ${COLORS.orange})`,
            color: COLORS.white,
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          Q{data.questionNumber} · {data.subject}
        </div>
        <div
          style={{
            padding: "6px 14px",
            borderRadius: 20,
            backgroundColor: COLORS.incorrectBg,
            color: COLORS.incorrect,
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            opacity: interpolate(frame, [8, 22], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          ✗ You got this wrong
        </div>
      </div>

      {/* Question text */}
      <div style={{ position: "absolute", top: 90, left: 60, right: 60 }}>
        <AnimatedText
          text={data.questionText}
          fontSize={22}
          fontWeight={600}
          delay={10}
          maxWidth={900}
        />
      </div>

      {/* Options */}
      <div style={{ position: "absolute", top: 200, left: 60, right: 60, display: "flex", flexDirection: "column", gap: 12 }}>
        {data.options.map((opt, i) => (
          <OptionBubble
            key={opt.id}
            label={opt.id}
            text={opt.text}
            isCorrect={false}
            isWrong={opt.id === data.wrongAnswerId}
            showResult={frame > 60}
            delay={20 + i * 8}
          />
        ))}
      </div>

      {/* "Your answer" label */}
      {frame > 65 && (
        <div
          style={{
            position: "absolute",
            top: 200 + data.options.findIndex(o => o.id === data.wrongAnswerId) * 68 + 18,
            right: 80,
            fontSize: 12,
            fontWeight: 600,
            color: COLORS.incorrect,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            opacity: interpolate(frame, [65, 75], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          Your answer ↑
        </div>
      )}

      <ProgressBar currentScene={0} totalScenes={4} />
    </AbsoluteFill>
  );
};