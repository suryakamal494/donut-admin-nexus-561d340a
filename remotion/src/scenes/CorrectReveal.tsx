import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, VideoQuestionData } from "../constants";
import { OptionBubble } from "../components/OptionBubble";
import { ProgressBar } from "../components/ProgressBar";

interface Props {
  data: VideoQuestionData;
}

export const CorrectReveal: React.FC<Props> = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const checkScale = spring({ frame: frame - 40, fps, config: { damping: 8, stiffness: 150 } });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(145deg, ${COLORS.warmBg} 0%, #F0FDF4 100%)`,
      }}
    >
      {/* Header */}
      <div style={{ position: "absolute", top: 36, left: 60, display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            padding: "6px 16px",
            borderRadius: 20,
            background: COLORS.correct,
            color: COLORS.white,
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          ✓ Correct Answer
        </div>
      </div>

      {/* Question text (condensed) */}
      <div
        style={{
          position: "absolute",
          top: 85,
          left: 60,
          right: 60,
          fontSize: 18,
          fontWeight: 500,
          color: COLORS.mutedText,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          opacity: interpolate(frame, [5, 18], [0, 0.7], { extrapolateRight: "clamp" }),
          lineHeight: 1.4,
        }}
      >
        {data.questionText}
      </div>

      {/* Options with result shown */}
      <div style={{ position: "absolute", top: 190, left: 60, right: 60, display: "flex", flexDirection: "column", gap: 12 }}>
        {data.options.map((opt, i) => (
          <OptionBubble
            key={opt.id}
            label={opt.id}
            text={opt.text}
            isCorrect={opt.isCorrect}
            isWrong={opt.id === data.wrongAnswerId}
            showResult={true}
            delay={10 + i * 6}
          />
        ))}
      </div>

      {/* Big checkmark */}
      {frame > 35 && (
        <div
          style={{
            position: "absolute",
            right: 80,
            top: 190 + data.options.findIndex(o => o.isCorrect) * 68 + 5,
            fontSize: 48,
            transform: `scale(${checkScale})`,
            opacity: interpolate(frame, [35, 45], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          ✅
        </div>
      )}

      <ProgressBar currentScene={1} totalScenes={4} />
    </AbsoluteFill>
  );
};